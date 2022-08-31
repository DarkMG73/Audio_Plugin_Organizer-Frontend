import axios from "axios";
import { StorageForSession } from "../storage/storage";

axios.defaults.withCredentials = true;

export async function registerAUser(user) {
  const output = await axios
    .post(`/api/users/auth/register`, user)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.message);
    });

  return output;
}

export async function setUserCookie(user) {
  // SessionStorage used while hosting API on Heroku
  const output = StorageForSession("ADD", user, "giProductionTool");

  // const output = await axios
  //   .post(`/api/users/auth/setCookie`, { user, withCredentials: true })
  //   .then((res) => {
  //     console.log("res.data", res.data);
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //     console.log("errors", err.response.data.message);
  //     return err.response;
  //   });

  return output;
}

export async function deleteUserCookie(user) {
  // SessionStorage used while hosting API on Heroku
  const output = StorageForSession("DELETE", "giProductionTool");

  // const output = await axios
  //   .get(`/api/users/auth/deleteCookie`, { withCredentials: true })
  //   .then((res) => {
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //     console.log("errors", err.response.data.message);
  //     return err.response;
  //   });

  return output;
}

export async function getUserCookie(user) {
  // SessionStorage used while hosting API on Heroku
  const output = {
    data: {
      cookie: StorageForSession("GET", {}, "giProductionTool"),
    },
    status: 202,
  };

  // const output = await axios
  //   .get(`/api/users/auth/getCookie`, { withCredentials: true })
  //   .then((res) => {
  //     return res;
  //   })
  //   .catch((err) => {
  //     console.log("err", err);
  //     console.log("errors", err.response.data.message);
  //     return err.response;
  //   });

  return output;
}

export async function sign_inAUser(token) {
  const output = await axios
    .post(`/api/users/auth/sign_in`, token)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log("err", err);
      console.log("errors", err.response.data.message);
      return err.response;
    });

  return output;
}

export async function getUserUserByToken(token) {
  const output = await axios
    .get(`/api/users/auth/get_user_by_token`, {
      headers: {
        Authorization: "JWT " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log("err", err);
      // console.log("errors", err.response.data.err.message);
    });

  return output;
}
