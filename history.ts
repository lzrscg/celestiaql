import axios, { AxiosInstance, AxiosStatic } from "axios";
import { Collection } from "mongodb";
import http from "http";
import Block from "./block";

class History {
  constructor(/*private _mongoCollection: Collection*/) {
    this._axiosInstance = axios.create({
      // tendermint can't handle many new http connections
      httpAgent: new http.Agent({ keepAlive: true }),
    });
  }

  private _axiosInstance: AxiosInstance;

  public async syncFrom(latestBlockHeight: number, until?: number) {
    for (
      let currentBlockNumber = latestBlockHeight;
      currentBlockNumber >= (until ?? 1);
      currentBlockNumber--
    ) {
      await this._sync(currentBlockNumber);
    }
  }

  private async _sync(blockHeight: number): Promise<void> {
    // don't process blocks heights 0 or lower
    if (blockHeight <= 0) {
      return;
    }

    // fetch block by height from tendermint
    const response: any = await this._axiosInstance.get(
      `http://localhost:26657/block?height=${blockHeight}`
    );
    console.log(JSON.stringify(response.data, null, 4));

    // if there are no payForMessages, don't procees block
    /*if (!Block.hasPfms(response.data)) {
      return;
    }
    const block = Block.create(response.data);
    block.payForMessages.forEach((payForMessage) => {
      payForMessage.save(this._mongoCollection);
    });*/
  }
}

export default History;
