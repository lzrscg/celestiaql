import { fromBase64 } from "@cosmjs/encoding";
import { decodeTxRaw, Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";
import CreateCommitment from "./celesjs/message-share-commitment";
import PayForMessage from "./pay-for-message";
import { MalleatedTx, MsgPayForMessage } from "./proto/tx";

type namespacedData = { NamespaceID: string; Data: string };

export default class Block {
  private _blockHash: string;
  private _blockHeight: number;
  private _timestamp: Date;
  private _txs: Array<string>;
  private _msgs: Array<namespacedData>;

  constructor(
    blockHash: string,
    blockHeight: number,
    timestamp: Date,
    txs: Array<string>,
    msgs: Array<namespacedData>
  ) {
    this._blockHash = blockHash;
    this._blockHeight = blockHeight;
    this._timestamp = timestamp;
    this._txs = txs;
    this._msgs = msgs;
  }

  private _getPayForMessageTxs(): Array<MsgPayForMessage> {
    /**
     * Register types for CosmJS
     * TODO: Consider removing this dependency and processing bytes
     * with ts-proto and native NodeJS encoding libs
     */
    const registry = new Registry(defaultRegistryTypes);
    registry.register("/payment.MsgPayForMessage", MsgPayForMessage);

    const decodedMsgs: Array<MsgPayForMessage> = [];

    // Loop through each tx to get the relevant data associated with payForMessage transactions
    this._txs.forEach((tx) => {
      try {
        // Txs are encoded as base64 strings
        const rawMalleatedTx = fromBase64(tx);

        // Malleated txs are not standard, they have the original hash prepended to the tx
        const decodedMalleatedTx = MalleatedTx.decode(rawMalleatedTx);
        const originalTx = decodeTxRaw(decodedMalleatedTx.tx);

        for (const message of originalTx.body.messages) {
          const decodedMsg = registry.decode(message);
          decodedMsgs.push(decodedMsg);
        }
      } catch {
        /**
         * there will be an error if the transaction is not malleated (and thus pfm)
         * but we don't care about these transactions, so we just do nothing and
         * move on...
         *  */
      }
    });
    return decodedMsgs;
  }

  private _getCommitmentMap(): { [key: string]: namespacedData } {
    const commitmentMap: { [key: string]: namespacedData } = {};
    this._msgs.forEach((msg) => {
      const rawNamespaceID = fromBase64(msg.NamespaceID);
      const rawData = fromBase64(msg.Data);

      // Get the commitment hash in bytes
      const commitment = CreateCommitment(rawNamespaceID, rawData);

      // Convert to hex string
      const commitmentStr = Buffer.from(commitment).toString("hex");

      // Convert message to hex
      const decodedMsg = {
        NamespaceID: Buffer.from(rawNamespaceID).toString("hex"),
        Data: Buffer.from(rawData).toString("hex"),
      };

      // Map the commitment hash to the message
      commitmentMap[commitmentStr] = decodedMsg;
    });

    return commitmentMap;
  }

  get payForMessages() {
    const payForMessageTxs = this._getPayForMessageTxs();
    const commitmentMap = this._getCommitmentMap();

    return payForMessageTxs.map((tx) => {
      const commitmentHash = Buffer.from(tx.messageShareCommitment).toString(
        "hex"
      );
      const commitmentMsg = commitmentMap[commitmentHash];
      if (!commitmentMsg) {
        throw new Error(
          `Commitment hash mismatch: ${commitmentHash} not found`
        );
      }

      return new PayForMessage(
        commitmentMsg.NamespaceID,
        commitmentMsg.Data,
        this,
        tx
      );
    });
  }

  get id(): string {
    return this._blockHash;
  }

  get height(): number {
    return this._blockHeight;
  }

  get timestamp(): Date {
    return this._timestamp;
  }

  public toString(): string {
    return JSON.stringify(
      {
        blockHash: this._blockHash,
        blockHeight: this._blockHeight,
        timestamp: this._timestamp,
        txs: this._txs,
        msgs: this._msgs,
      },
      null,
      2
    );
  }

  public static create(responseData: any): Block {
    const blockHash = responseData?.result?.block_id?.hash;
    if (typeof blockHash !== "string") {
      throw new Error("Field missing or incorrectly typed: block hash");
    }

    const blockHeight = Number(responseData?.result?.block?.header?.height);
    if (isNaN(blockHeight)) {
      throw new Error("Field missing or incorrectly typed: block height");
    }

    const timestamp = new Date(responseData?.result?.block?.header?.time);
    if (isNaN(timestamp.valueOf())) {
      throw new Error("Field missing or incorrectly typed: timestamp");
    }

    const txs = responseData?.result?.block?.data?.txs;
    if (
      !Array.isArray(txs) ||
      !txs.reduce((prev, cur) => prev && typeof cur === "string", true)
    ) {
      throw new Error("Field missing or incorrectly typed: txs");
    }

    const msgs = responseData?.result?.block?.data?.msgs?.msgs;
    if (
      !Array.isArray(msgs) ||
      !msgs.reduce((prev, cur) => {
        return (
          prev &&
          typeof cur === "object" &&
          cur !== null &&
          typeof cur.NamespaceID === "string" &&
          typeof cur.Data === "string"
        );
      }, true)
    ) {
      throw new Error("Field missing or incorrectly typed: msgs");
    }

    return new Block(blockHash, blockHeight, timestamp, txs, msgs);
  }

  public static hasPfms(responseData: any): boolean {
    return !!responseData?.result?.block?.data?.msgs?.msgs;
  }
}
