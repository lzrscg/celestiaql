import Connection from "./connection";

const { MongoClient } = require("mongodb");
require("dotenv").config();

// Connection URI
const uri = process.env.MONGO_URI;
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the database
    await client.connect();

    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to database");

    const db = client.db("celestiaql");
    const history = new Connection(db);

    await history.sync();
    console.log("Done");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
