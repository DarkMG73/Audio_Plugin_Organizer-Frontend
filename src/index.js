import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/store";
import { ErrorBoundary } from "./Components/ErrorHandling/ErrorBoundary/ErrorBoundary";
import "@fontsource/kodchasan";
import axios from "axios";

////////////////////////
///    Axios Config
///////////////////////
const inDevelopment = process.env.NODE_ENV === "development";
console.log(
   "%c --> %cline:15%cprocess.env.NODE_ENV",
   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
   "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
   process.env.NODE_ENV
);
console.log(
   "%c --> %cline:15%cinDevelopment",
   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
   "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
   inDevelopment
);
// axios.defaults.baseURL = "https://api-audio-plugin-organizer.herokuapp.com/";
axios.defaults.baseURL = "https://api-organizer.glassinteractive.com/";

console.log(
   "%c --> %cline:16%caxios.defaults.baseURL",
   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
   "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
   axios.defaults.baseURL
);

if (inDevelopment) {
   axios.defaults.baseURL = "https://api-organizer.glassinteractive.com/";
   // axios.defaults.baseURL = "http://localhost:8000";
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
      // alert("In REQ");
      if (inDevelopment) console.log("request", request);
      // Edit request config
      return request;
   },
   (error) => {
      // alert("In REQ Error");
      if (inDevelopment) console.log(error);
      return Promise.reject(error);
   }
);

axios.interceptors.response.use(
   (response) => {
      // alert("In Res");
      if (inDevelopment) console.log("RESPONSE---> ", response);

      return response;
   },

   (error) => {
      if (inDevelopment) console.log(error);
      return Promise.reject(error);
   }
);

////////////////////////
///    OUTPUT
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
