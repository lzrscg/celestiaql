import crypto from "crypto";

const LEAF_PREFIX = new Uint8Array([0]);
const INNER_PREFIX = new Uint8Array([1]);

export function getSplitPoint(length: number) {
  if (length < 1) {
    throw new Error("Trying to split a tree with size < 1");
  }
  // Gotta get creative here to get the bit length in JS
  const bitlen = 32 - Math.clz32(length);
  let k = 1 << (bitlen - 1);
  if (k === length) {
    k >>= 1;
  }
  return k;
}

export function HashFromByteSlices(items: Array<Uint8Array>): Uint8Array {
  switch (items.length) {
    case 0:
      return emptyHash();
    case 1:
      return leafHash(items[0]);
    default:
      const k = getSplitPoint(items.length);
      const left = HashFromByteSlices(items.slice(0, k));
      const right = HashFromByteSlices(items.slice(k));
      return innerHash(left, right);
  }
}

function emptyHash(): Uint8Array {
  return crypto.createHash("sha256").update(new Uint8Array(0)).digest();
}

function leafHash(leaf: Uint8Array): Uint8Array {
  return crypto
    .createHash("sha256")
    .update(new Uint8Array([...LEAF_PREFIX, ...leaf]))
    .digest();
}

function innerHash(left: Uint8Array, right: Uint8Array): Uint8Array {
  return crypto
    .createHash("sha256")
    .update(new Uint8Array([...INNER_PREFIX, ...left, ...right]))
    .digest();
}
