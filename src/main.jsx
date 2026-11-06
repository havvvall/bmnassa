import React from "react";
import ReactDOM from "react-dom/client";
// Version 1 app (built slice by slice). The old prototype stays in src/App.jsx until version 1 replaces it.
import App from "./app/App.jsx";
import { Landing } from "./app/landing/Landing.jsx";
// bmnassa.com shows the landing page; app.bmnassa.com and every other host show the app
const onMainSite = /^(www\.)?bmnassa\.com$/i.test(window.location.hostname);
// loaded last: the smooth look refines every screen's own styles
import "./app/smooth.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {onMainSite ? <Landing /> : <App />}
  </React.StrictMode>
);
