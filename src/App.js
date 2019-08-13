import React from "react";
import Login from "./Login";

export default () => (
  <div>
    <h1>Glist</h1>
    <Login location={window.location.search} />
  </div>
);
