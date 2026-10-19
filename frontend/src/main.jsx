import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";  // atau import { BrowserRouter as Router }
import axios from 'axios';

const api = axios.create({
  baseURL: '/',  // pakai proxy Vite
  withCredentials: true,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>                  {/* ← Router di paling luar */}
      <AuthProvider>                 {/* AuthProvider di dalam Router */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);