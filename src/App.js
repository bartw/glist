import React from "react";
import Login from "./Login";

export default () => {
  return (
    <div>
      <h1>Glist</h1>
      <Login queryStrings={window.location.search} />
    </div>
  );
};
