import axios from "axios";

/// GET THE PLUGINS/////////////////////////////
export const getData = async (user) => {
  let axiosConfig = null;

  if (user) {
    axiosConfig = {
      headers: {
        "Content-Type": "text/plain",
        Authorization: "JWT " + user.token,
      },
      timeout: 60000,
    };
  }

  const res = await axios.post("/api/all-plugins/", user, axiosConfig);
  return res.data;
};

/// SAVE /////////////////////////////////////
export async function savePlugin(userAndDataObject) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };

  const response = await axios
    .post(`/api/all-plugins/add`, userAndDataObject, axiosConfig)
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
      Authorization: "JWT " + user.token,
    },
  };
  const response = await axios
    .get(`/api/all-plugins/update/`, { params: dataObj, ...axiosConfig })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("err", err);
      // console.log("errors", err.response.data.err.message);
      throw err;
    });

  return response;
}

/// DELETE ////////////////////////////////
export async function deleteAPlugin(id, user) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
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
      Authorization: "JWT " + user.token,
    },
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
  const output = await axios
    .get(`/api/all-plugins/model/`)
    .then((res) => {
      return res.data.model;
    })
    .catch((err) => {
      const output = { response: { request: {} } };
      console.log("err", err);
      console.log("output", output);

      if (err.code && err.code === "ERR_NETWORK") {
        output.response.status = 500;
        output.response.statusText = err.message;
        output.response.request.responseURL = err.config.baseURL;
      }
      return output.response;
    });

  return output;
}
