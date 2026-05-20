const dotenv = require("dotenv")
dotenv.config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


client.connect()
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch(console.dir);

module.exports = { client };