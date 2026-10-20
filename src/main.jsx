import React from "react";
import ReactDOM from "react-dom/client";
// Version 1 app (built slice by slice). The old prototype stays in src/App.jsx until version 1 replaces it.
import App from "./app/App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
