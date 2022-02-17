import History from "./history";

const { MongoClient } = require("mongodb");
// Connection URI
const uri = "mongodb://localhost:27017/?maxPoolSize=20&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the database
    await client.connect();

    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to database");

    const pfmCollection = client.db("celestiaql").collection("payForMessages");
    const history = new History(pfmCollection);

    await history.syncFrom(81830);

    console.log("Done");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
