exports.handler = async event => ({
  statusCode: 200,
  body: `Hello ${event.queryStringParameters.name || "World"}!`
});
