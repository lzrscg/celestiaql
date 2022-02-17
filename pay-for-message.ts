import { Collection } from "mongodb";
import Block from "./block";
import { MsgPayForMessage } from "./proto/tx";

export default class PayForMessage {
  private _namespace: string;
  private _data: string;
  private _blockHeight: number;
  private _blockId: string;
  private _timestamp: Date;
  private _account: string;

  constructor(
    namespace: string,
    data: string,
    block: Block,
    tx: MsgPayForMessage
  ) {
    this._namespace = namespace;
    this._data = data;
    this._blockHeight = block.height;
    this._blockId = block.id;
    this._timestamp = block.timestamp;
    this._account = tx.signer;
  }

  public save(mongoCollection: Collection): void {
    mongoCollection.insertOne({
      block: {
        height: this._blockHeight,
        id: this._blockId,
      },
      timestamp: this._timestamp,
      namespace: this._namespace,
      data: {
        raw: this._data,
      },
      account: this._account,
    });
  }
}
