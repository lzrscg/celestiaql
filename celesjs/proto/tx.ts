/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "";

export interface MsgPayForMessage {
  signer: string;
  messageNamespaceId: Uint8Array;
  messageSize: number;
  messageShareCommitment: Uint8Array;
}

export interface MalleatedTx {
  originalTxHash: Uint8Array;
  tx: Uint8Array;
}

function createBaseMsgPayForMessage(): MsgPayForMessage {
  return {
    signer: "",
    messageNamespaceId: new Uint8Array(),
    messageSize: 0,
    messageShareCommitment: new Uint8Array(),
  };
}

export const MsgPayForMessage = {
  encode(
    message: MsgPayForMessage,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.signer !== "") {
      writer.uint32(10).string(message.signer);
    }
    if (message.messageNamespaceId.length !== 0) {
      writer.uint32(18).bytes(message.messageNamespaceId);
    }
    if (message.messageSize !== 0) {
      writer.uint32(24).uint64(message.messageSize);
    }
    if (message.messageShareCommitment.length !== 0) {
      writer.uint32(34).bytes(message.messageShareCommitment);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgPayForMessage {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgPayForMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.signer = reader.string();
          break;
        case 2:
          message.messageNamespaceId = reader.bytes();
          break;
        case 3:
          message.messageSize = longToNumber(reader.uint64() as Long);
          break;
        case 4:
          message.messageShareCommitment = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgPayForMessage {
    return {
      signer: isSet(object.signer) ? String(object.signer) : "",
      messageNamespaceId: isSet(object.messageNamespaceId)
        ? bytesFromBase64(object.messageNamespaceId)
        : new Uint8Array(),
      messageSize: isSet(object.messageSize) ? Number(object.messageSize) : 0,
      messageShareCommitment: isSet(object.messageShareCommitment)
        ? bytesFromBase64(object.messageShareCommitment)
        : new Uint8Array(),
    };
  },

  toJSON(message: MsgPayForMessage): unknown {
    const obj: any = {};
    message.signer !== undefined && (obj.signer = message.signer);
    message.messageNamespaceId !== undefined &&
      (obj.messageNamespaceId = base64FromBytes(
        message.messageNamespaceId !== undefined
          ? message.messageNamespaceId
          : new Uint8Array()
      ));
    message.messageSize !== undefined &&
      (obj.messageSize = Math.round(message.messageSize));
    message.messageShareCommitment !== undefined &&
      (obj.messageShareCommitment = base64FromBytes(
        message.messageShareCommitment !== undefined
          ? message.messageShareCommitment
          : new Uint8Array()
      ));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgPayForMessage>, I>>(
    object: I
  ): MsgPayForMessage {
    const message = createBaseMsgPayForMessage();
    message.signer = object.signer ?? "";
    message.messageNamespaceId = object.messageNamespaceId ?? new Uint8Array();
    message.messageSize = object.messageSize ?? 0;
    message.messageShareCommitment =
      object.messageShareCommitment ?? new Uint8Array();
    return message;
  },
};

function createBaseMalleatedTx(): MalleatedTx {
  return { originalTxHash: new Uint8Array(), tx: new Uint8Array() };
}

export const MalleatedTx = {
  encode(
    message: MalleatedTx,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.originalTxHash.length !== 0) {
      writer.uint32(10).bytes(message.originalTxHash);
    }
    if (message.tx.length !== 0) {
      writer.uint32(18).bytes(message.tx);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MalleatedTx {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMalleatedTx();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.originalTxHash = reader.bytes();
          break;
        case 2:
          message.tx = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MalleatedTx {
    return {
      originalTxHash: isSet(object.originalTxHash)
        ? bytesFromBase64(object.originalTxHash)
        : new Uint8Array(),
      tx: isSet(object.tx) ? bytesFromBase64(object.tx) : new Uint8Array(),
    };
  },

  toJSON(message: MalleatedTx): unknown {
    const obj: any = {};
    message.originalTxHash !== undefined &&
      (obj.originalTxHash = base64FromBytes(
        message.originalTxHash !== undefined
          ? message.originalTxHash
          : new Uint8Array()
      ));
    message.tx !== undefined &&
      (obj.tx = base64FromBytes(
        message.tx !== undefined ? message.tx : new Uint8Array()
      ));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MalleatedTx>, I>>(
    object: I
  ): MalleatedTx {
    const message = createBaseMalleatedTx();
    message.originalTxHash = object.originalTxHash ?? new Uint8Array();
    message.tx = object.tx ?? new Uint8Array();
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
