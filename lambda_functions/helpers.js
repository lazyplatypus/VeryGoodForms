const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'formboiz';

let cachedDb = null;

const surveys = {
    question: data.questions,
    hash: data.hash,
  };

const responses = {
    response: data.responses,
    hash: data.hash,
  };

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

const queryDatabase = async (db) => {
    const surveys = await db.collection("surveys").find({}).toArray();
  
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveys),
    };
  };

  const pushToQuestions = async (db, data, collection) => {
  
    if (surveys.question && surveys.hash) {
      await db.collection(collection).insertMany([data]);
      return { statusCode: 201 };
    } else {
      return { statusCode: 422 };
    }
  };