import React, { useState, useEffect } from "react";
import queryString from "query-string";

const createOauthLoginUrl = () => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID;
  const state = Math.random()
    .toString(36)
    .substr(2);
  return `${baseUrl}?clientId=${clientId}&state=${state}`;
};

export default ({ queryStrings }) => {
  const [code, setCode] = useState(null);
  const [state, setState] = useState(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const { code, state } = queryString.parse(queryStrings);
    setCode(code);
    setState(state);
  }, [queryStrings]);

  useEffect(() => {
    if (code && state) {
      setPending(true);
      fetch(`/.netlify/functions/token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state })
      })
        .then(response => {
          if (response.status < 200 || response.status >= 300) {
            return response.text().then(errorMessage => {
              throw new Error(errorMessage);
            });
          }
          return response.json().then(json => {
            setMessage(JSON.stringify(json));
          });
        })
        .catch(e => {
          setMessage(e.message);
        })
        .finally(() => setPending(false));
    }
  }, [code, state]);

  return (
    <div>
      {message && <h2>{message}</h2>}
      {pending && <div>pending</div>}
      <div>
        <a href={createOauthLoginUrl()}>Login using GitHub</a>
      </div>
    </div>
  );
};
