import axios from "axios";

const DbInteractions = (props) => {
  return {};
};

// export function savePlugin(dataObj) {
//   axios
//     .get(`/api/all-plugins/add/`, { params: dataObj })
//     .then((res) => {
//       console.log("res", res);
//     })
//     .catch((err) => {
//       console.log("err", err);
//       console.log("errors", err.response.data.err.message);
//     });
// }

// export function updateAPlugin(id, dataObj) {
//   axios
//     .get(`/api/all-plugins/update/`, { params: dataObj })
//     .then((res) => {
//       console.log("res", res);
//     })
//     .catch((err) => {
//       console.log("err", err);
//       console.log("errors", err.response.data.err.message);
//     });
// }

// export function deleteAPlugin(id) {
//   axios
//     .get(`/api/all-plugins/${id}/delete/`)
//     .then((res) => {
//       console.log("res", res);
//     })
//     .catch((err) => {
//       console.log("err", err);
//       console.log("errors", err.response.data.err.message);
//     });
// }

// export async function getSchemaForAudioPlugin() {
//   const output = await axios
//     .get(`/api/all-plugins/model/`)
//     .then((res) => {
//       console.log("res", res);
//       return res;
//     })
//     .catch((err) => {
//       console.log("err", err);
//       console.log("errors", err.response.data.err.message);
//     });

//   return output;
// }

export default DbInteractions;
