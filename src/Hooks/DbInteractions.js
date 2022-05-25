import axios from "axios";

const DbInteractions = (props) => {
  return {};
};

export function savePlugin(dataObj) {
  console.log(
    "%c --> %cline:7%cdataObj",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    dataObj
  );
  axios
    .get(`/api/all-plugins/add/`, { params: dataObj })
    .then((res) => {
      console.log("res", res);
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
    });
}

export function updateAPlugin(id, dataObj) {
  console.log(
    "%c --> %cline:26%cdataObj",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    dataObj
  );
  console.log(
    "%c --> %cline:7%cdataObj",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    id
  );
  axios
    .get(`/api/all-plugins/update/`, { params: dataObj })
    .then((res) => {
      console.log("res", res);
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.err.message);
    });
}

export function deleteAPlugin(id) {
  console.log(
    "%c --> %cline:7%cdataObj",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    id
  );
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
export default DbInteractions;
