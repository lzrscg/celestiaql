import { Hash } from "crypto";
import Hasher from "./hasher";
import { getSplitPoint } from "./merkel";
import * as namespace from "./namespace";

export default class NamespacedMerkelTree {
  public treeHasher: Hasher;
  public visit: NodeVisitorFn;
  public leaves: Array<Uint8Array>; // Max size should be 128!
  public leafHashes: Array<Uint8Array>; // Max size should be 128!
  public namespaceRanges: { [key: string]: leafRange };
  public minNID: namespace.ID;
  public maxNID: namespace.ID;
  public rawRoot: Uint8Array | null;

  // For simplicity's sake, I am not implementing custom options
  constructor(h: Hash) {
    const opts = {
      InitialCapacity: 128,
      NamespaceIDSize: 8,
      IgnoreMaxNamespace: true,
      NodeVisitor: noOp,
    };

    this.treeHasher = new Hasher(
      h,
      opts.NamespaceIDSize,
      opts.IgnoreMaxNamespace
    );
    this.visit = opts.NodeVisitor;
    this.leaves = [];
    this.leafHashes = [];
    this.namespaceRanges = {};
    this.minNID = new namespace.ID(
      new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    );
    this.maxNID = new namespace.ID(
      new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    );

    // Class fields must be populated
    this.rawRoot = null;
  }

  public Push(namespacedData: namespace.PrefixedData): void {
    const nID = this.validateAndExtractNamespace(namespacedData);

    this.leaves.push(namespacedData);
    this.updateNamespaceRanges();
    this.updateMinMaxID(nID);
    this.rawRoot = null;
  }

  public updateMinMaxID(id: namespace.ID): void {
    if (id.Less(this.minNID)) {
      this.minNID = id;
    }
    if (this.maxNID.Less(id)) {
      this.maxNID = id;
    }
  }

  public updateNamespaceRanges(): void {
    if (this.leaves.length > 0) {
      const lastIndex = this.leaves.length - 1;
      const lastPushed = this.leaves[lastIndex];
      const lastNsStr = lastPushed
        .slice(0, this.treeHasher.NamespaceSize())
        .toString(); // encoding?
      const lastRange = this.namespaceRanges[lastNsStr];
      if (lastRange) {
        this.namespaceRanges[lastNsStr] = {
          start: lastIndex,
          end: lastIndex + 1,
        };
      } else {
        this.namespaceRanges[lastNsStr] = {
          start: 0, // lastRange.start
          end: 1, // lastRange.end + 1
        };
      }
    }
  }

  public validateAndExtractNamespace(
    ndata: namespace.PrefixedData
  ): namespace.ID {
    const nidSize = this.NamespaceSize();
    if (ndata.length < nidSize) {
      throw new Error(
        `mismatching namespace sizes: got: ${ndata.length}, want >= ${nidSize}`
      );
    }

    const nID = new namespace.ID(ndata.slice(0, this.NamespaceSize()));
    const curSize = this.leaves.length;
    if (curSize > 0) {
      if (
        nID.Less(new namespace.ID(this.leaves[curSize - 1].slice(0, nidSize)))
      ) {
        throw new Error(
          `pushed data has to be lexicographically ordered by namespace IDs: last namespace: ${this.leaves[
            curSize - 1
          ].slice(0, nidSize)}, pushed: ${nID.String}`
        );
      }
    }
    return nID;
  }

  public NamespaceSize(): namespace.IDSize {
    return this.treeHasher.NamespaceSize();
  }

  public Root() {
    if (this.rawRoot === null) {
      this.rawRoot = this.computeRoot(0, this.leaves.length);
    }
    return this.rawRoot;
  }

  public computeRoot(start: number, end: number): Uint8Array {
    switch (end - start) {
      case 0:
        const rootHash = this.treeHasher.EmptyRoot();
        this.visit(rootHash, []);
        return rootHash;
      case 1:
        const leafHash = this.treeHasher.HashLeaf(this.leaves[start]);
        if (this.leafHashes.length < this.leaves.length) {
          this.leafHashes.push(leafHash);
        }
        this.visit(leafHash, [this.leaves[start]]);
        return leafHash;
      default:
        const k = getSplitPoint(end - start);
        const left = this.computeRoot(start, start + k);
        const right = this.computeRoot(start + k, end);
        const hash = this.treeHasher.HashNode(left, right);
        this.visit(hash, [left, right]);
        return hash;
    }
  }
}

interface leafRange {
  start: number;
  end: number;
}

function noOp(hash: Uint8Array, children: Array<Uint8Array>): void {}

type NodeVisitorFn = (hash: Uint8Array, children: Array<Uint8Array>) => any;
