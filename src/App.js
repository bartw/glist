import React, { useState, useEffect } from "react";

export default () => {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("/.netlify/functions/hello")
      .then(response => response.text())
      .then(text => {
        setMessage(text);
      });
  });

  return (
    <div>
      <h1>Glist</h1>
      {message && <h2>{message}</h2>}
    </div>
  );
};
