import axios, { AxiosInstance } from "axios";
import { Db } from "mongodb";
import http from "http";
import { Block } from "./types/block.type";
import { RpcResponse } from "./types/rpc-response.type";
import { Tx } from "./types/tx.type";
import { createHash } from "crypto";
import { MalleatedTx } from "./proto/tx";
import { DynamoDBClient, PutItemCommand, GetItemCommand} from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


class Connection {
  constructor(private s3Client: S3Client, private ddbClient: DynamoDBClient) {
    this._axiosInstance = axios.create({
      // tendermint can't handle many new http connections
      httpAgent: new http.Agent({ keepAlive: true }),
    });

    // this._db.collection("blocks").createIndex({ "block.header.height": 1 }, { unique: true });
    // this._db.collection("blocks").createIndex({ "_height": 1 }, { unique: true });
    // this._db.collection("blocks").createIndex({ "block_id.hash": 1 }, { unique: true })
    // this._db.collection("txs").createIndex({ "hash": 1 }, { unique: true });
    // this._db.collection("txs").createIndex({ "height": 1, "index": 1 }, { unique: true });
    // this._db.collection("txs").createIndex({ "height": 1 });
    // this._db.collection("txs").createIndex({ "_height": 1 });
  }

  private _axiosInstance: AxiosInstance;

  public async sync() {
    await this.syncFrom(4300);
  }

  public async syncFrom(startingBlockHeight: number) {
    
    // for (let i = 254500; i < 255000; i++) {
    //   await this.syncBlock(i);
    //   await this.sleep();
    // }
   
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
    return new Promise((resolve) => setTimeout(resolve, 100));
  }

  async syncBlock(blockHeight: number): Promise<void> {
    console.log(`New Syncing block ${blockHeight}`);

    // don't process blocks heights 0 or lower
    if (blockHeight <= 0) {
      return;
    }

    // check if block is already in db
    if (await this.checkIfBlockExists(blockHeight)) {
      console.log(`Block ${blockHeight} already in db. Skipping...`);
      return;
    }

    // get and save block
    const blockData = await this.getBlockvV2(blockHeight);
    const block = await this.extracBlockData(blockData);
    await this.persistBlock(block);

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
        await this.persistTx(txResult);
      } catch {
        let tries = 0;
        const threeTries = async () => { 
          const hash = createHash("sha256").update(rawTx).digest("hex");
          console.log(`Syncing tx ${hash}${tries > 0 ? ` (try ${tries+1})` : ""}`);
          if (tries < 3) {
            try {
              const txResult = await this.getTx("0x" + hash);
              await this.persistTx(txResult);
            } catch {
              tries++;
              await setTimeout(threeTries, 30000);
            }
          } else {
            // this._db.collection('reties').insertOne({type: 'tx', hash, height: blockHeight, rawTx})
          }
        }
        await threeTries();
      }
    }
  }

  async getBlock(height: number): Promise<Block> {
    const response = await this._axiosInstance.get<RpcResponse<Block>>(
      `http://34.223.94.253:26657/block?height=${height}`
    );
    
    const block = response.data.result;

    return block;
  }

  async getBlockvV2(height: number): Promise<any> {
    const response = await this._axiosInstance.get<RpcResponse<Block>>(
      `http://34.223.94.253:26657/block?height=${height}`
    );
    
    return response;
  }

  async extracBlockData(response: any): Promise<Block> {
    return response.data.result
  }
  


  // async checkBlock(height: number): Promise<boolean> {
  //   // height is indexed as a string
  //   const heightStr = String(height);

  //   // get block if it exists
  //   const block = await this._db
  //     .collection("blocks")
  //     .findOne({ "block.header.height": heightStr });



  //   // if it doesn't exist, return false
  //   if (!block) {
  //     return false;
  //   }

  //   // get txs if they exist
  //   const txCount = await this._db
  //     .collection("txs")
  //     .countDocuments({ height: heightStr });

  //   // if the block has the same number of txs as the db, return true
  //   if (txCount === block.block.data.txs.length) {
  //     return true;
  //   }

  //   // if they have a different number, clean up the db and return false
  //   console.log(`Partial block height ${height} detected. Cleaning up...`);
  //   await this._db.collection("txs").deleteMany({ height: heightStr });
  //   await this._db
  //     .collection("blocks")
  //     .deleteMany({ "block.header.height": heightStr });
  //   return false;
  // }

  // async saveBlock(block: Block): Promise<void> {
  //   await this._db
  //     .collection("blocks")
  //     .insertOne({_height: Number(block.block.header.height),...block})
  //     .then(() => {
  //       console.log(`Block ${block.block.header.height} saved`);
  //     });
  // }

  
  // Persists whole block to s3
  // Persist the s3 url to ddb
  // Index data on ddb
  async persistBlock(block: Block): Promise<void> {
    const blockHeight = block.block.header.height
    
    // store whole block to s3
    const s3ObjectKey = "height-" + blockHeight
    const bucketParams = {
      Bucket: "block-data-bucket",
      // Specify the name of the new object. For example, 'index.html'.
      // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
      Key: s3ObjectKey,
      // Content of the new object.
      Body: JSON.stringify(block),
    };
    
    const data = await this.s3Client.send(new PutObjectCommand(bucketParams));
    const s3ObjectUrl = "https://block-data-bucket.s3.us-west-2.amazonaws.com/" + s3ObjectKey;


    // store block data to ddb
    const ddbItemKey = "HEIGHT#" + blockHeight;
    const putItemCommandInput = {
      TableName : "BlockData",
      Item: {
        PK: {
          "S": ddbItemKey
        },
        SK: {
          "S": ddbItemKey
        },
        s3ObjectUrl: {
          "S": s3ObjectUrl
        }
      }
    }
    const putItemCommand = new PutItemCommand(putItemCommandInput);
    const putItemCommandResponse = await this.ddbClient.send(putItemCommand);
  }

  async getTx(hash: string): Promise<Tx> {
    const response = await this._axiosInstance.get<RpcResponse<Tx>>(
      `http://34.223.94.253:26657/tx?hash=${hash}`
    );
    const tx = response.data.result;

    return tx;
  }

  // async saveTx(tx: Tx): Promise<void> {
  //   await this._db
  //     .collection("txs")
  //     .insertOne({ _height: Number(tx.height), ...tx })
  //     .then(() => {
  //       console.log(`Tx ${tx.hash} saved`);
  //     });
  // }


  async checkIfBlockExists(height: number): Promise<boolean> {
    const heightStr = String(height);
    const getItemCommandInput = {
      TableName : "BlockData",
        Key: {
          PK: {
            "S": "HEIGHT#" + height
          },
          SK: {
            "S": "HEIGHT#" + height
          }
        }
    }
    const command = new GetItemCommand(getItemCommandInput);
    const response = await this.ddbClient.send(command);
    
    if(response.Item === undefined) {
      return false;
    }
    return true;

  }

  async persistTx(tx: Tx): Promise<void> {
    const blockHeight = tx.height;
    // store tx and corresponding msg to ddb
    const ddbItemPK = "HEIGHT#" + blockHeight;
  
    const ddbItemSK = "TX#" + tx.hash;
    const putItemCommandInput = {
      TableName : "BlockData",
      Item: {
        PK: {
          "S": ddbItemPK
        },
        SK: {
          "S": ddbItemSK
        }
      }
    }
    const command = new PutItemCommand(putItemCommandInput);
    const response = await this.ddbClient.send(command);


    const putItemCommandInput_writeTx = {
      TableName : "BlockData",
      Item: {
        PK: {
          "S": ddbItemSK
        },
        SK: {
          "S": ddbItemSK
        },
        tx: {
          "S": JSON.stringify(tx)
        }
      }
    }
    const command_writeTx = new PutItemCommand(putItemCommandInput_writeTx);
    const response_writeTx = await this.ddbClient.send(command_writeTx);
  }
}

export default Connection;
