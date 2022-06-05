import { useSelector, useDispatch } from "react-redux";
import GatherToolData from "../Hooks/GatherToolData";
import axios from "axios";

export const getData = async () => {
  const res = await axios.get("/api/all-plugins/");
  return res.data;
};

export function savePlugin(dataObj, reGatherToolData = false) {
  axios
    .get(`/api/all-plugins/add/`, { params: dataObj })
    .then((res) => {
      console.log("res", res);
      if (reGatherToolData) GatherToolData();
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
    });
}

export function updateAPlugin(id, dataObj, reGatherToolData = false) {
  axios
    .get(`/api/all-plugins/update/`, { params: dataObj })
    .then((res) => {
      console.log("res", res);
      if (reGatherToolData) GatherToolData();
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
    });
}

export function deleteAPlugin(id) {
  axios
    .get(`/api/all-plugins/${id}/delete/`)
    .then((res) => {
      console.log("res", res);
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
    });
}

export async function getSchemaForAudioPlugin() {
  const output = await axios
    .get(`/api/all-plugins/model/`)
    .then((res) => {
      console.log("res", res);
      return res;
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
    });

  return output;
}
