import axios from "axios";
import http from "http";

export async function syncHistoryFrom(latestBlockHeight: number): Promise<void> {
  const axiosInstance = axios.create({
    // tendermint can't handle many new http connections
    httpAgent: new http.Agent({ keepAlive: true }),
  });

  for (
    let currentBlockNumber = latestBlockHeight;
    currentBlockNumber > 0;
    currentBlockNumber--
  ) {
    // await block to finish syncing to not flood requests
    await syncBlock(currentBlockNumber);
  }
}

/**
 * Helpers
 */
async function syncBlock(blockHeight: number): Promise<void> {

}