import Connection from "./connection";
import { DynamoDBClient, PutItemCommand, GetItemCommand} from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// const { MongoClient } = require("mongodb");
// require("dotenv").config();
const ddbClient = new DynamoDBClient({ region: "us-west-2" });
const s3Client = new S3Client({ region: "us-west-2" });
// Connection URI
// const uri = process.env.MONGO_URI;
// Create a new MongoClient
// const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the database
    // await client.connect();

    // Establish and verify connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Connected successfully to database");

    // const db = client.db("celestiaql");

    const history = new Connection(s3Client, ddbClient);

    // const getItemCommandInput = {
    //   TableName : "BlockData",
    //   Key: {
    //     PK: {
    //       "S": "HEIGHT#" + "1"
    //     },
    //     SK: {
    //       "S": "HEIGHT#" + "1"
    //     }
    //   }
    // }
    // const command = new GetItemCommand(getItemCommandInput);
    // const response = await ddbClient.send(command);
    // console.log(response.Item);
    // if(response.Item === undefined) {
    //   console.log("cool");
    // }

    // const putItemCommandInput = {
    //   TableName : "BlockData",
    //   Item: {
    //     PK: {
    //       "S": "HEIGHT#" + "2"
    //     },
    //     SK: {
    //       "S": "HEIGHT#" + "2"
    //     }
    //   }
    // }
    // const command = new PutItemCommand(putItemCommandInput);
    // const response = await ddbClient.send(command);
    // console.log(response);

    // const bucketParams = {
    //   Bucket: "block-data-bucket",
    //   // Specify the name of the new object. For example, 'index.html'.
    //   // To create a directory for the object, use '/'. For example, 'myApp/package.json'.
    //   Key: "height-1",
    //   // Content of the new object.
    //   Body: "BODY",
    // };
    
    // const data = await s3Client.send(new PutObjectCommand(bucketParams));



    await history.sync();
    console.log("Done");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


