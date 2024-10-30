import axios from "axios";
import { StorageForSession } from "../storage/storage";

axios.defaults.withCredentials = true;

export async function registerAUser(user) {
  const output = await axios
    .post(`/api/users/auth/register/`, user)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%c --> %cline:12%cerr",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
        err
      );
      const error = err.response;
      console.log(
        "%c --> %cline:14%cerror",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
        error
      );
      if (
        error.hasOwnProperty("data") &&
        error.data.hasOwnProperty("message")
      ) {
        console.log(
          "%c --> %cline:30%cerror.data.hasOwnProperty(message)",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
          error.data.hasOwnProperty("message")
        );

        if (error.data.message.constructor === String) return error;

        if (error.data.message.hasOwnProperty("code")) {
          console.log(
            "%c --> %cline:41%cerror.data.message.hasOwnProperty(code)",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
            error.data.message.hasOwnProperty("code")
          );
          // MongoDB error 11000 is a duplicate error
          if (error.data.message.code === 11000) {
            console.log(
              "%c --> %cline:51%c(error.data.message.code === 11000",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
              error.data.message.code === 11000
            );
            const errorMessage = {
              status: 400,
              message: `${error.data.message.keyValue.email} is already being used in the database. Please use a different email address or login with this email address and the password originally set.`,
            };
            return errorMessage;
          } else {
            return error.message.code;
          }
        }
      }

      console.log("error", error);
      if (error.hasOwnProperty("data") && error.data.hasOwnProperty("message"))
        console.log("errors", error.data.message);
    });

  return output;
}

export async function setUserCookie(user) {
  // SessionStorage used while hosting API on Heroku
  const output = new Promise((resolve, reject) => {
    const cookie = StorageForSession("ADD", user, "giProductionTool");
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
    .post(`/api/users/auth/sign_in/`, token)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log("error", error);
      if (error.hasOwnProperty("data") && error.data.hasOwnProperty("message"))
        console.log("errors", error.response.data.message);
      return error.response;
    });

  return output;
}

export async function getUserUserByToken(token) {
  const output = await axios
    .get(`/api/users/auth/get_user_by_token/`, {
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
      console.log(
        "%c --> %cline:196%cresponse",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
        err.response
      );
      return err.response;

      // console.log("errors", err.response.data.err.message);
    });

  return output;
}
