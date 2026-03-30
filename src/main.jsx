import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { LightboxProvider } from "./components/LightBoxContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <LightboxProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LightboxProvider>
    </HelmetProvider>
  </React.StrictMode>
);