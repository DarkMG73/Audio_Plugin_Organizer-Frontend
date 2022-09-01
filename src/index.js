import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/store";
import { ErrorBoundary } from "./Components/ErrorHandling/ErrorBoundary/ErrorBoundary";
import axios from "axios";

////////////////////////
//    Axios Config
///////////////////////

const inDevelopment = process.env.NODE_ENV !== "production";
axios.defaults.baseURL = process.env.REACT_APP_NOT_SECRET_CODE;
if (inDevelopment) {
  axios.defaults.baseURL = "http://localhost:8000";
  console.log(
    "%cRunning in DEV MODE with the base URL:",
    "color:#fff;background:#027482;padding:14px;border-radius:0 25px 25px 0",
    axios.defaults.baseURL
  );
}

axios.defaults.headers.common["Authorization"] = "AUTH TOKEN";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  (request) => {
    // if (inDevelopment) console.log(request);
    // Edit request config
    return request;
  },
  (error) => {
    // if (inDevelopment) console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // if (inDevelopment) console.log(response);

    return response;
  },
  (error) => {
    // if (inDevelopment) console.log(error);
    return Promise.reject(error);
  }
);
///////////////////////

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
    ,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
