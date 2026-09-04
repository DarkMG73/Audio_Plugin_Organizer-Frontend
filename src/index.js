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

axios.defaults.baseURL = "https://api-organizer.glassinteractive.com/";
axios.defaults.withCredentials = true;

if (inDevelopment) {
   axios.defaults.baseURL = "http://localhost:8000";
}

axios.defaults.headers.post["Content-Type"] = "application/json";

function readSessionToken() {
   try {
      const raw = sessionStorage.getItem("giProductionTool");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.token) return parsed.token;
      if (typeof parsed === "string") return parsed;
   } catch (err) {
      return null;
   }
   return null;
}

axios.interceptors.request.use(
   (request) => {
      const token = readSessionToken();
      if (token) {
         request.headers.Authorization = "Bearer " + token;
      } else if (request.headers && request.headers.Authorization === "AUTH TOKEN") {
         delete request.headers.Authorization;
      }
      if (inDevelopment) console.log("request", request.method, request.url);
      return request;
   },
   (error) => {
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

const canHover = !matchMedia("(hover: none)").matches;
if (canHover) {
   document.body.classList.add("can-hover");
}

////////////////////////
///    OUTPUT
///////////////////////
setTimeout(() => {
   const barLoader = document.getElementById("startup-loader-wrap");
   if (barLoader) barLoader.remove();
}, 10000);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
   <React.StrictMode>
      <Provider store={store}>
         <ErrorBoundary>
            <App />
         </ErrorBoundary>
      </Provider>
   </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
