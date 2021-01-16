// ./lambda_functions/form.js

const MongoClient = require("mongodb").MongoClient;
const functions = require('./helpers');

const MONGODB_URI = process.env.MONGODB_URI;
// Place this environment variable in Netlify
const DB_NAME = 'formboiz';

let cachedDb = null;

const queryDatabase = async (db, hash) => {
  const surveys = await db.collection("surveys").find({hash: hash.hash}).toArray();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(surveys),
  };
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await functions.connectToDatabase(MONGODB_URI);
  const hash = event.queryStringParameters;
  // console.log(hash);
  return queryDatabase(db, hash);
};

const pushToDatabase = async (db, data) => {
  const surveys = {
    question: data.questions,
    hash: data.hash,
  };

  if (surveys.question && surveys.hash) {
    await db.collection("surveys").insertMany([data]);
    return { statusCode: 201 };
  } else {
    return { statusCode: 422 };
  }
};

const editDatabase = async (db, param) => {

  if (param.original && param.updated) {
    await db.collection("surveys").updateOne(
      { hash: param.hash, questions: param.original },
      { $set: { "questions.$" : param.updated } }
   )
    return { statusCode: 201 };
  } else {
    return { statusCode: 422 };
  }
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await functions.connectToDatabase(MONGODB_URI);
  const param = event.queryStringParameters;

  switch (event.httpMethod) {
    case "GET":
      return queryDatabase(db, param);
    case "POST":
      return pushToDatabase(db, JSON.parse(event.body));
    case "PUT":
      return editDatabase(db, param);
    default:
      return { statusCode: 400 };
  }
};