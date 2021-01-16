// ./lambda_functions/form.js

const functions = require('./helpers');
const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI;
// Place this environment variable in Netlify
const DB_NAME = 'formboiz';

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

  const db = await functions.connectToDatabase(MONGODB_URI);
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

  const db = await functions.connectToDatabase(MONGODB_URI);
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