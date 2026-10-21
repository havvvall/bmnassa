import React from "react";
import ReactDOM from "react-dom/client";
// Version 1 app (built slice by slice). The old prototype stays in src/App.jsx until version 1 replaces it.
import App from "./app/App.jsx";
// loaded last: the smooth look refines every screen's own styles
import "./app/smooth.css";
import "./app/palette.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
