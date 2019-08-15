const https = require("https");

const httpRequest = ({ options, body }) =>
  new Promise((resolve, reject) => {
    const request = https.request(options, response => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(`statusCode = ${response.statusCode}`));
      }

      const responseData = [];
      response.on("data", chunk => {
        responseData.push(chunk);
      });

      response.on("end", () => {
        try {
          const json = JSON.parse(Buffer.concat(responseData).toString());
          resolve(json);
        } catch (e) {
          reject(e);
        }
      });
    });

    request.on("error", e => {
      reject(e);
    });

    if (body) {
      request.write(body);
    }

    request.end();
  });

exports.handler = async event => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: `Method ${event.httpMethod} not allowed` };
  }

  const { code, state } = JSON.parse(event.body);

  if (!code) {
    return { statusCode: 400, body: "Missing code" };
  }

  if (!state) {
    return { statusCode: 400, body: "Missing state" };
  }

  const { REACT_APP_GITHUB_CLIENT_ID, REACT_APP_GITHUB_CLIENT_SECRET } = process.env;

  if (!REACT_APP_GITHUB_CLIENT_ID) {
    return { statusCode: 400, body: "Missing GitHub client id" };
  }

  if (!REACT_APP_GITHUB_CLIENT_SECRET) {
    return { statusCode: 400, body: "Missing GitHub client secret" };
  }

  const body = JSON.stringify({
    client_id: REACT_APP_GITHUB_CLIENT_ID,
    client_secret: REACT_APP_GITHUB_CLIENT_SECRET,
    code,
    state
  });

  const options = {
    hostname: "github.com",
    port: 443,
    path: "/login/oauth/access_token",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Content-Length": body.length
    }
  };

  try {
    const data = await httpRequest({ options, body });
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (e) {
    return { statusCode: 500, body: e };
  }
};
