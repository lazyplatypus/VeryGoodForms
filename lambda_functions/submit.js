// ./lambda_functions/form.js

const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = "mongodb+srv://m001-student:m001-mongodb-basics@productrectest.ov7hn.mongodb.net/test?";
// Place this environment variable in Netlify
const DB_NAME = 'formboiz';

let cachedDb = null;

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true,
  });

  cachedDb = client.db(DB_NAME);

  return cachedDb;
};

const queryDatabase = async (db, hash) => {
  const responses = await db.collection("responses").find({hash: hash.hash}).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(responses),
  };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(MONGODB_URI);
  const hash = event.queryStringParameters;
  // console.log(hash);
  return queryDatabase(db, hash);
};

const pushToDatabase = async (db, data) => {
  const responses = {
    response: data.responses,
    hash: data.hash,
  };

  if (responses.response && responses.hash) {
    await db.collection("responses").insertMany([data]);
    return { statusCode: 201 };
  } else {
    return { statusCode: 422 };
  }
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await connectToDatabase(MONGODB_URI);
  const hash = event.queryStringParameters;

  switch (event.httpMethod) {
    case "GET":
      return queryDatabase(db, hash);
    case "POST":
      return pushToDatabase(db, JSON.parse(event.body));
    default:
      return { statusCode: 400 };
  }
};