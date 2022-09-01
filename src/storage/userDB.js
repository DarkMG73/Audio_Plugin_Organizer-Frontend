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
  const output = new Promise((resolve, reject) => {
    const cookie = StorageForSession("ADD", user, "giProductionTool");
    console.log(
      "%c --> %cline:23%ccookie",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
      cookie
    );
    let status = 400;
    if (cookie) status = 202;

    resolve({
      data: {
        cookie,
      },
      status,
    });
  });

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
  const output = new Promise((resolve, reject) => {
    const cookie = StorageForSession("DELETE", {}, "giProductionTool");
    console.log(
      "%c --> %cline:23%ccookie",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
      cookie
    );
    let status = 400;
    if (cookie) status = 202;

    resolve({
      data: {
        cookie,
      },
      status,
    });
  });

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
  const output = new Promise((resolve, reject) => {
    const cookie = StorageForSession("GET", {}, "giProductionTool");

    let status = 400;
    if (cookie) status = 202;

    resolve({
      data: {
        cookie,
      },
      status,
    });
  });

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
      return err.response;
      // console.log("errors", err.response.data.err.message);
    });

  return output;
}
