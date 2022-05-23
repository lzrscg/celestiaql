export default interface IBlock {
  blockHash: string;
  blockHeight: number;
  timestamp: Date;
  txs: Array<string>;
  msgs: Array<{ NamespaceID: string; Data: string }>;
}
