import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Loader from "./utils/Loader";
import Routes from "./routes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <React.Suspense fallback={<Loader />}>
      <Routes />
    </React.Suspense>
  </React.StrictMode>
);
