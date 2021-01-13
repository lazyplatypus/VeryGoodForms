// ./lambda_functions/what_is_the_time.js

// This `handler` is what is called when your Lambda
// function is triggered. For more full specs on it see
// https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
module.exports.handler = async (event, context) => {
    const unixTime = Math.floor(Date.now() / 1000);
    return {
      statusCode: 200,
      body: `The Unix time is ${unixTime}`,
    };
  };