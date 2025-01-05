import axios from "axios";
import ipcExchange from "../clientController";

// HELPER FUNCTIONS
const handleError = (error, functionName) => {
   const defaultMessage = `There was an error. Advise the website admin the following error occurred:\\n\\nEA-U-${functionName}`;
   if (Object.hasOwn(error, "data")) {
      if (
         Object.hasOwn(error.data, "message") &&
         error.data.message.constructor === String
      )
         return error.message + "\\n\\nFunction name: " + functionName;
      return defaultMessage;
   }

   if (!Object.hasOwn(error, "data")) {
      if (
         Object.hasOwn(error, "message") &&
         error.message.constructor === String
      )
         return error.message + "\\n\\nFunction name: " + functionName;
      return defaultMessage;
   }

   return defaultMessage;
};

/// GET THE PLUGINS/////////////////////////////
export const getData = async (user) => {
   let axiosConfig = null;

   if (user) {
      axiosConfig = {
         headers: {
            "Content-Type": "text/plain",
            Authorization: "JWT " + user.token
         },
         timeout: 60000
      };
   }

   const res = await axios.post("/api/all-plugins/", user, axiosConfig);

   return res.data;
};

/// GET ONE PLUGIN /////////////////////////////
export const getPluginBy_Id = async (user, tool_Id) => {
   let axiosConfig = null;

   if (user) {
      axiosConfig = {
         headers: {
            "Content-Type": "text/plain",
            Authorization: "JWT " + user.token
         },
         timeout: 60000
      };
   }

   const res = await axios.post(
      "/api/all-plugins/" + tool_Id,
      user,
      axiosConfig
   );
   return res.data;
};

/// GET LOCAL PLUGINS/////////////////////////////
export const getLocalPluginData = async (user, pluginPathsObj) => {
   let comConfig = null;

   if (user) {
      comConfig = {
         headers: {
            "Content-Type": "text/plain",
            Authorization: "JWT " + user.token
         },
         timeout: 60000
      };
   }
   try {
      const res = await ipcExchange(
         "plugins:find-local",
         { params: { ...pluginPathsObj } },
         comConfig
      );

      return res.data;
   } catch (error) {
      return handleError(error, "getLocalPluginData");
   }
};

/// SAVE ONE /////////////////////////////////////
export async function savePlugin(userAndDataObject) {
   const axiosConfig = {
      headers: {
         "Content-Type": "application/json",
         Authorization: "JWT " + userAndDataObject.user.token
      }
   };

   const response = await axios
      .post(`/api/all-plugins/add/`, userAndDataObject, axiosConfig)
      .then((res) => {
         return res;
      })
      .catch((err) => {
         console.log("err", err);
         // console.log("errors", err.response.data.err.message);
         return err;
      });
   return response;
}

/// SAVE MANY /////////////////////////////////
export async function saveManyPlugins(userAndDataObject) {
   const axiosConfig = {
      headers: {
         "Content-Type": "application/json",
         Authorization: "JWT " + userAndDataObject.user.token
      }
   };

   const response = await axios
      .post(`/api/all-plugins/add-many/`, userAndDataObject, axiosConfig)
      .then((res) => {
         return res;
      })
      .catch((err) => {
         console.log("err", err);
         // console.log("errors", err.response.data.err.message);
         return err;
      });
   return response;
}

/// UPDATE //////////////////////////////////
export async function updateAPlugin(id, dataObj, user) {
   const axiosConfig = {
      headers: {
         "Content-Type": "application/json",
         Authorization: "JWT " + user.token
      }
   };

   const response = await axios
      .post(`/api/all-plugins/update/`, { dataObj }, axiosConfig)
      .then((res) => {
         return res;
      })
      .catch((err) => {
         console.log("err", err);
         // console.log("errors", err.response.data.err.message);
         return err;
      });
   return response;
}
/// UPDATE MANY//////////////////////////////////
export async function UpdateManyAudioPlugins(dataObj, user) {
   const axiosConfig = {
      headers: {
         "Content-Type": "application/json",
         Authorization: "JWT " + user.token
      }
   };

   const response = await axios
      .post(`/api/all-plugins/update-many/`, { dataObj }, axiosConfig)
      .then((res) => {
         return res;
      })
      .catch((err) => {
         console.log("err", err);
         // console.log("errors", err.response.data.err.message);
         return err;
      });
   return response;
}

/// DELETE ////////////////////////////////
export async function deleteAPlugin(id, user) {
   const axiosConfig = {
      headers: {
         "Content-Type": "application/json",
         Authorization: "JWT " + user.token
      }
   };
   const response = await axios
      .get(`/api/all-plugins/${id}/delete/`, axiosConfig)
      .then((res) => {
         return res;
      })
      .catch((err) => {
         console.log("err", err);
         console.log("errors", err.response.data.err.message);
         return err;
      });
   return response;
}

/// DELETE ALL ///////////////////////////
export async function deleteAllPlugins(user) {
   const axiosConfig = {
      headers: {
         "Content-Type": "application/json",
         Authorization: "JWT " + user.token
      }
   };
   const response = await axios
      .get(`/api/all-plugins/deleteAll/`, axiosConfig)
      .then((res) => {
         return res;
      })
      .catch((err) => {
         console.log(
            "%c --> %cline:102%cerr",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
            err
         );
         console.log("err", err);
         console.log("errors", err.response.data.err.message);
         return err;
      });
   return response;
}

/// GET AUDIO PLUGIN SCHEMA //////////////
export async function getSchemaForAudioPlugin() {
   const axiosConfig = {
      headers: {
         "Content-Type": "application/json"
      }
   };

   const output = await axios
      .get(`/api/all-plugins/model/`, axiosConfig)
      .then((res) => {
         return res.data.model;
      })
      .catch((err) => {
         const errOutput = { response: { request: {} } };
         console.log("err", err);
         console.log("errOutput", errOutput);

         if (err.code && err.code === "ERR_NETWORK") {
            errOutput.response.status = 500;
            errOutput.response.statusText = err.message;
            errOutput.response.request.responseURL = err.config.baseURL;
         }
         return errOutput.response;
      });

   return output;
}
