const connectToDatabase = async (uri) => {
  let cachedDb = null;
  const MongoClient = require("mongodb").MongoClient;
  const DB_NAME = 'formboiz';

  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};

const queryDatabase = async (db, hash, collection) => {
  const output = await db.collection(collection).find({hash: hash.hash}).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(output),
  };
};

exports.connectToDatabase = connectToDatabase;
exports.queryDatabase = queryDatabase;