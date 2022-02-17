import { createHash } from "crypto";
import * as namespace from "./namespace";

const LEAF_PREFIX = 0;
const NODE_PREFIX = 1;

export default class Hasher {
  public precomputedMaxNs: namespace.ID;

  constructor(
    public NamespaceLen: namespace.IDSize,
    public ignoreMaxNs: boolean
  ) {
    this.precomputedMaxNs = new namespace.ID(
      new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff])
    );
  }

  public IsMaxNamespaceIDIgnored(): boolean {
    return this.ignoreMaxNs;
  }

  public NamespaceSize(): namespace.IDSize {
    return this.NamespaceLen;
  }

  public EmptyRoot(): Uint8Array {
    const emptyNs = new Uint8Array(this.NamespaceLen);
    const h = createHash("sha256").update(""); // empty string acts like an empty stream
    const digest = new Uint8Array([...emptyNs, ...emptyNs, ...h.digest()]);

    return digest;
  }

  public HashLeaf(leaf: Uint8Array): Uint8Array {
    const h = createHash("sha256");
    const nID = leaf.slice(0, this.NamespaceLen);
    const res = [...nID, ...nID];
    const data = new Uint8Array([LEAF_PREFIX, ...leaf]);

    return new Uint8Array([...res, ...h.update(data).digest()]);
  }

  public HashNode(l: Uint8Array, r: Uint8Array) {
    const h = createHash("sha256");
    const flagLen = 2 * this.NamespaceLen;
    const leftMinNs = l.slice(0, this.NamespaceLen);
    const leftMaxNs = l.slice(this.NamespaceLen, flagLen);
    const rightMinNs = r.slice(0, this.NamespaceLen);
    const rightMaxNs = r.slice(this.NamespaceLen, flagLen);

    const minNs = this.min(leftMinNs, rightMinNs);
    let maxNs: Uint8Array;
    if (
      this.ignoreMaxNs &&
      this.precomputedMaxNs.Equal(new namespace.ID(leftMinNs))
    ) {
      maxNs = this.precomputedMaxNs.ID;
    } else if (
      this.ignoreMaxNs &&
      this.precomputedMaxNs.Equal(new namespace.ID(rightMinNs))
    ) {
      maxNs = leftMaxNs;
    } else {
      maxNs = this.max(leftMaxNs, rightMaxNs);
    }

    const res = [...minNs, ...maxNs];
    const data = new Uint8Array([NODE_PREFIX, ...l, ...r]);

    return new Uint8Array([...res, ...h.update(data).digest()]);
  }

  public max(ns: Uint8Array, ns2: Uint8Array): Uint8Array {
    if (ns >= ns2) {
      return ns;
    }
    return ns2;
  }

  public min(ns: Uint8Array, ns2: Uint8Array): Uint8Array {
    if (ns <= ns2) {
      return ns;
    }
    return ns2;
  }
}
