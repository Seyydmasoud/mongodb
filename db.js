const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://masoud:138090@cluster0.cez3re8.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let database;

async function connectToDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    database = client.db("UniProject");
  } catch (err) {
    console.error(err);
  }
}

function getDatabase() {
  return database;
}

module.exports = { connectToDB, getDatabase };