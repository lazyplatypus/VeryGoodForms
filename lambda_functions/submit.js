// ./lambda_functions/form.js

const functions = require('./helpers');
const MongoClient = require("mongodb").MongoClient;

const MONGODB_URI = process.env.MONGODB_URI;
// Place this environment variable in Netlify
const DB_NAME = 'formboiz';

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await functions.connectToDatabase(MONGODB_URI);
  const hash = event.queryStringParameters;
  // console.log(hash);
  return functions.queryDatabase(db, hash, "responses");
};

module.exports.handler = async (event, context) => {
  // otherwise the connection will never complete, since
  // we keep the DB connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  const db = await functions.connectToDatabase(MONGODB_URI);
  const hash = event.queryStringParameters;

  switch (event.httpMethod) {
    case "GET":
      return queryDatabase(db, hash, "responses");
    case "POST":
      return pushToDatabase(db, JSON.parse(event.body));
    default:
      return { statusCode: 400 };
  }
};