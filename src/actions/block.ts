import { fromBase64 } from "@cosmjs/encoding";
import { decodeTxRaw, Registry } from "@cosmjs/proto-signing";
import { defaultRegistryTypes } from "@cosmjs/stargate";
import { Collection } from "mongodb";
import CreateCommitment from "../../celesjs/message-share-commitment";
import { MalleatedTx, MsgPayForMessage } from "../../celesjs/proto/tx";
import IBlock from "../models/block.interface";
import IPayForMessage from "../models/pay-for-message.interface";

/**
 * Block utilities and actions
 */
export function createBlockFromResponseData(responseData: any): IBlock {
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

  // TODO: set this to an empty array if there are no msgs
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

  return {
    blockHash,
    blockHeight,
    timestamp,
    txs,
    msgs,
  };
}

export function getPayForMessagesFromBlock(block: IBlock): IPayForMessage[] {
  const payForMessageTxs = getMsgPayForMessagesFromBlock(block);
  const commitmentMap = getCommitmentMapFromBlock(block);

  return payForMessageTxs.map((tx) => {
    const commitmentHash = Buffer.from(tx.messageShareCommitment).toString(
      "hex"
    );
    const commitmentMsg = commitmentMap[commitmentHash];
    if (!commitmentMsg) {
      throw new Error(`Commitment hash mismatch: ${commitmentHash} not found`);
    }

    return {
      block: {
        height: block.blockHeight,
        id: block.blockHash,
      },
      timestamp: block.timestamp,
      namespace: commitmentMsg.namespaceId,
      data: {
        raw: commitmentMsg.data,
      },
      index: commitmentMsg.index,
      account: tx.signer,
    };
  });
}

/**
 * MongoDB block collection queries
 */
export async function checkIfBlockShouldBeQueried(
  blockHeight: number,
  blockCollection: Collection
): Promise<boolean> {
  if (blockHeight <= 0) {
    return false;
  }

  const block = await blockCollection.findOne({ blockHeight });
  if (block) {
    return false;
  }

  return true;
}

export function saveBlockWithPayForMessages(
  block: IBlock,
  payForMessages: IPayForMessage[],
  blockCollection: Collection
): void {
  // TODO: do all in one transction
  blockCollection.insertOne({ blockHeight: block.blockHeight });
  blockCollection.insertMany(payForMessages);
}

/**
 * Helpers
 */
function getMsgPayForMessagesFromBlock(block: IBlock): MsgPayForMessage[] {
  // TODO: Consider removing this dependency and processing bytes with ts-proto and native NodeJS encoding libs
  const registry = new Registry(defaultRegistryTypes);
  registry.register("/payment.MsgPayForMessage", MsgPayForMessage);

  const decodedMsgs: Array<MsgPayForMessage> = [];
  block.txs.forEach((tx) => {
    try {
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

function getCommitmentMapFromBlock(block: IBlock): CommitmentMap {
  const commitmentMap: CommitmentMap = {};
  block.msgs.forEach((msg, index) => {
    const rawNamespaceId = fromBase64(msg.NamespaceID);
    const rawData = fromBase64(msg.Data);

    let commitment;
    // Get the commitment hash in bytes
    commitment = CreateCommitment(rawNamespaceId, rawData);

    // Convert to hex string
    const commitmentStr = Buffer.from(commitment).toString("hex");

    // Convert message to hex
    const decodedMsg = {
      namespaceId: Buffer.from(rawNamespaceId).toString("hex"),
      data: Buffer.from(rawData).toString("hex"),
      index,
    };

    // Map the commitment hash to the message
    commitmentMap[commitmentStr] = decodedMsg;
  });

  return commitmentMap;
}

type CommitmentMap = {
  [key: string]: { namespaceId: string; data: string; index: number };
};
