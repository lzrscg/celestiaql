export type RpcResponse<T> = {
  jsonrpc: "2.0";
  id: number;
  result: T;
}