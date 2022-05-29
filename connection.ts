import axios, { AxiosInstance } from "axios";
import { Db } from "mongodb";
import http from "http";
import { Block } from "./types/block.type";
import { RpcResponse } from "./types/rpc-response.type";
import { Tx } from "./types/tx.type";
import { createHash } from "crypto";
import { MalleatedTx } from "./proto/tx";

class Connection {
  constructor(private _db: Db) {
    this._axiosInstance = axios.create({
      // tendermint can't handle many new http connections
      httpAgent: new http.Agent({ keepAlive: true }),
    });
  }

  private _axiosInstance: AxiosInstance;

  public async sync() {
    await this.syncFrom(1);
  }

  public async syncFrom(startingBlockHeight: number) {
    let currentBlockHeight = startingBlockHeight > 0 ? startingBlockHeight : 1;
    while (true) {
      try {
        await this.syncBlock(currentBlockHeight);
        currentBlockHeight++;
      } catch {
        console.log(`${currentBlockHeight} unavailable. Trying again...`);
        await this.sleep();
      }
    }
  }

  async sleep() {
    return new Promise((resolve) => setTimeout(resolve, 5000));
  }

  async syncBlock(blockHeight: number): Promise<void> {
    console.log(`Syncing block ${blockHeight}`);

    // don't process blocks heights 0 or lower
    if (blockHeight <= 0) {
      return;
    }

    // check if block is already in db
    if (await this.checkBlock(blockHeight)) {
      console.log(`Block ${blockHeight} already in db. Skipping...`);
      return;
    }

    // get and save block
    const block = await this.getBlock(blockHeight);
    await this.saveBlock(block);

    // get and save txs
    for (const tx of block.block.data.txs) {
      const rawTx = Buffer.from(tx, "base64");
      // see if it's a malleated tx
      try {
        const hash = Buffer.from(
          MalleatedTx.decode(rawTx).originalTxHash
        ).toString("hex");
        console.log(`Syncing tx ${hash}`);
        const txResult = await this.getTx("0x" + hash);
        await this.saveTx(txResult);
      } catch {
        let tries = 0;
        const threeTries = async () => { 
          const hash = createHash("sha256").update(rawTx).digest("hex");
          console.log(`Syncing tx ${hash}${tries > 0 ? ` (try ${tries+1})` : ""}`);
          if (tries < 3) {
            try {
              const txResult = await this.getTx("0x" + hash);
              await this.saveTx(txResult);
            } catch {
              tries++;
              await setTimeout(threeTries, 30000);
            }
          } else {
            this._db.collection('reties').insertOne({type: 'tx', hash, height: blockHeight, rawTx})
          }
        }
        await threeTries();
      }
    }
  }

  async getBlock(height: number): Promise<Block> {
    const response = await this._axiosInstance.get<RpcResponse<Block>>(
      `http://localhost:26657/block?height=${height}`
    );
    const block = response.data.result;

    return block;
  }

  async checkBlock(height: number): Promise<boolean> {
    // height is indexed as a string
    const heightStr = String(height);

    // get block if it exists
    const block = await this._db
      .collection("blocks")
      .findOne({ "block.header.height": heightStr });

    // if it doesn't exist, return false
    if (!block) {
      return false;
    }

    // get txs if they exist
    const txCount = await this._db
      .collection("txs")
      .countDocuments({ height: heightStr });

    // if the block has the same number of txs as the db, return true
    if (txCount === block.block.data.txs.length) {
      return true;
    }

    // if they have a different number, clean up the db and return false
    console.log(`Partial block height ${height} detected. Cleaning up...`);
    await this._db.collection("txs").deleteMany({ height: heightStr });
    await this._db
      .collection("blocks")
      .deleteMany({ "block.header.height": heightStr });
    return false;
  }

  async saveBlock(block: Block): Promise<void> {
    await this._db
      .collection("blocks")
      .insertOne({_height: Number(block.block.header.height),...block})
      .then(() => {
        console.log(`Block ${block.block.header.height} saved`);
      });
  }

  async getTx(hash: string): Promise<Tx> {
    const response = await this._axiosInstance.get<RpcResponse<Tx>>(
      `http://localhost:26657/tx?hash=${hash}`
    );
    const tx = response.data.result;

    return tx;
  }

  async saveTx(tx: Tx): Promise<void> {
    await this._db
      .collection("txs")
      .insertOne({ _height: Number(tx.height), ...tx })
      .then(() => {
        console.log(`Tx ${tx.hash} saved`);
      });
  }
}

export default Connection;
