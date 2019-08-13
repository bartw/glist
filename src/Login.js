import React, { useState, useEffect } from "react";
import { oauthLoginUrl } from "@octokit/oauth-login-url";
import queryString from "query-string";

export default ({ location }) => {
  const [code, setCode] = useState(null);
  const [state, setState] = useState(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const { code, state } = queryString.parse(location);
    setCode(code);
    setState(state);
  }, [location]);

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

  const { url } = oauthLoginUrl({ clientId: "2805188ab52cee247e99" });

  return (
    <div>
      {message && <h2>{message}</h2>}
      {pending && <div>pending</div>}
      <div>
        <a href={url}>Login using GitHub</a>
      </div>
    </div>
  );
};
