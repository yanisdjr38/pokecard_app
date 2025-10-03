import { StatusBar, Style } from "@capacitor/status-bar";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

StatusBar.setOverlaysWebView({ overlay: false });
StatusBar.setStyle({ style: Style.Dark }); // au choix

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
