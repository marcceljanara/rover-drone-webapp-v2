import React from "react";
import 'font-awesome/css/font-awesome.min.css';
import { createRoot } from "react-dom/client";
import App from "./App";
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // ⬅️ Tambahkan ini

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ⬇️ Tambahkan ini untuk mengaktifkan PWA
serviceWorkerRegistration.register();
