import NamespacedMerkelTree from "./nmt";
import crypto from "crypto";
import * as merkel from "./merkel";

const SHARE_SIZE = 256;

export default function CreateCommitment(
  //k: bigint,
  namespace: Uint8Array,
  msg: Uint8Array
): Uint8Array {
  const k = 128n;
  const message = padMessage(msg);
  const shares = chunkMessage(message);

  if (shares.length > k * k - 1n) {
    throw new Error("message size exceeds square size");
  }

  const heights = powerOf2MountainRange(BigInt(shares.length), k);
  const leafSets: Array<Uint8Array[]> = [];
  let cursor = 0;
  heights.forEach((bigIntHeight) => {
    /**
     * Since I ported over the code from Go, one artifact of the typing is that
     * the heights turn out to be BigInts, which is unnecessary since they are
     * only used to access indexes.
     *
     * However, I don't want to go back and change that now, so I will just cast
     * them immediately to numbers.
     */
    const height = Number(bigIntHeight);
    leafSets.push(shares.slice(cursor, cursor + height));
    cursor = cursor + height;
  });

  const subTreeRoots: Array<Uint8Array> = [];
  leafSets.forEach((set) => {
    const tree = new NamespacedMerkelTree(crypto.createHash("sha256"));
    set.forEach((leaf) => {
      const nsLeaf = new Uint8Array([...namespace, ...leaf]);
      tree.Push(nsLeaf);
    });
    subTreeRoots.push(tree.Root());
  });

  return merkel.HashFromByteSlices(subTreeRoots);
}

function padMessage(msg: Uint8Array): Uint8Array {
  if (msg.length % SHARE_SIZE === 0) {
    return msg;
  }

  const shareCount = Math.floor(msg.length / SHARE_SIZE) + 1;

  const padded = new Uint8Array(shareCount);
  padded.set(msg);
  return padded;
}

function chunkMessage(message: Uint8Array): Array<Uint8Array> {
  const shares: Array<Uint8Array> = [];
  for (let i = 0; i < message.length; i += SHARE_SIZE) {
    let end = i + SHARE_SIZE;
    if (end > message.length) {
      end = message.length;
    }
    shares.push(message.slice(i, end));
  }
  return shares;
}

function powerOf2MountainRange(length: bigint, k: bigint): BigUint64Array {
  let output: BigUint64Array = new BigUint64Array();

  let l = length;
  while (l !== 0n) {
    if (l >= k) {
      output = append(output, k);
      l = l - k;
    } else {
      const p = nextPowerOf2(l);
      output = append(output, p);
      l = l - p;
    }
  }

  return output;
}

// Oddly, JS doesn't have anything like this for BigUint64Arrays
function append(arr: BigUint64Array, el: bigint) {
  const newArr = new BigUint64Array(arr.length + 1);
  newArr.set(arr);
  newArr[arr.length] = el;
  return newArr;
}

function nextPowerOf2(v: bigint): bigint {
  if (v === 1n) {
    return 1n;
  }
  const i = v;

  v--;
  v |= v >> 1n;
  v |= v >> 2n;
  v |= v >> 4n;
  v |= v >> 8n;
  v |= v >> 16n;
  v |= v >> 32n;
  v++;

  if (i === v) {
    return v;
  }

  return v / 2n;
}
