import axios from "axios";

export const getData = async () => {
  const res = await axios.get("/api/all-plugins/");
  return res.data;
};

export async function savePlugin(dataObj) {
  const response = await axios
    .get(`/api/all-plugins/add/`, { params: dataObj })
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

export async function updateAPlugin(id, dataObj) {
  const response = await axios
    .get(`/api/all-plugins/update/`, { params: dataObj })
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

export async function deleteAPlugin(id) {
  const response = await axios
    .get(`/api/all-plugins/${id}/delete/`)
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

export async function deleteAllPlugins() {
  const response = await axios
    .get(`/api/all-plugins/delete/`)
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

export async function getSchemaForAudioPlugin() {
  const output = await axios
    .get(`/api/all-plugins/model/`)
    .then((res) => {
      // console.log("res", res);
      return res.data.model;
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
    });

  return output;
}

export async function registerAUser(user) {
  const output = await axios
    .post(`/api/users/auth/register`, user)
    .then((res) => {
      console.log("res", res);
      return res.data.user;
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
    });

  return output;
}
