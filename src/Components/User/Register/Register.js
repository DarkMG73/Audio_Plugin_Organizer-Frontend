import styles from "./Register.module.css";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormInput from "../../../UI/Form/FormInput/FormInput";
import { registerAUser, sign_inAUser } from "../../../storage/userDB";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import {} from "../../../storage/userDB";
import { authActions } from "../../../store/authSlice";
import GatherToolData from "../../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../../store/audioToolDataSlice";

const Register = (props) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [loginError, seLoginError] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const groomedName = name.split("#")[1];
    setUser({
      ...user, //spread operator
      [groomedName]: value,
    });
  };
  //register function
  const egister = (e) => {
    e.preventDefault();

    const { userName, email, password } = user;

    if (userName && email && password) {
      // axios("http://localhost:8000/api/users/auth/register", user)
      registerAUser(user)
        .then((res) => res)
        .then((res) => {
          sign_inAUser(user)
            .then((res) => {
              if (res && res.hasOwnProperty("status")) {
                if (res.status === 404) {
                  seLoginError(
                    "There was a problem finding the user database. Make sure you are connected to the internet. Contact the site admin if the problem continues. Error: " +
                      res.status +
                      " | " +
                      res.statusText
                  );
                } else if (res.status >= 400) {
                  seLoginError(
                    res.data.message ? res.data.message : res.statusText
                  );
                }
              } else if (res && res.hasOwnProperty("data")) {
                seLoginError(false);
                dispatch(authActions.logIn(res.data));
                GatherToolData(res.data).then((data) => {
                  // console.log("🟣 | getData | questionsFromDB", data);
                  dispatch(audioToolDataActions.initState(data));
                });
              } else {
                seLoginError(
                  "Unfortunately, something went wrong and we can not figure out what happened.  Please refresh and try again."
                );
              }
            })
            .catch((err) => {
              seLoginError(err);
              console.log(
                "%c --> %cline:46%cerr",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
                err
              );
            });
        });
    } else {
      alert("invalid input");
    }
  };
  return (
    <div className={styles["registration-container"]}>
      <div className={styles["registration-title-wrap"]}>
        <h3 className={styles["registration-title"]}>Create a new account</h3>
      </div>
      <span className={styles["registration-question"]}>
        Already have an account ?
        <PushButton
          inputOrButton="button"
          id="create-entry-btn"
          colorType="secondary"
          value="login"
          data=""
          size="small"
          onClick={props.toggleSignupLoginButtonHandler}
        >
          Log In &#10140;
        </PushButton>
      </span>
      <div className={styles["registration-form-wrap"]}>
        <form className={styles["form"]} action="#">
          <div className={styles["form-input-container"]}>
            <FormInput
              key={"register-4"}
              formNumber={1}
              inputDataObj={{
                name: "userName",
                title: "User Name",
                type: "text",
                value: user.name,
                placeholder: "User Name",
              }}
              requiredError={{}}
              onChange={handleChange}
            />
          </div>

          <div className={styles["form-input-container"]}>
            <FormInput
              key={"register-4"}
              formNumber={1}
              inputDataObj={{
                name: "email",
                title: "Email",
                type: "email",
                value: user.email,
                placeholder: "Email Address",
              }}
              requiredError={{}}
              onChange={handleChange}
            />
          </div>

          <div className={styles["form-input-container"]}>
            <FormInput
              key={"register-4"}
              formNumber={1}
              inputDataObj={{
                name: "password",
                title: "Password",
                type: "password",
                value: user.password,
                placeholder: "Password",
              }}
              requiredError={{}}
              onChange={handleChange}
            />
          </div>

          <div className={styles["form-submit-button-wrap"]}>
            <button
              type="submit"
              className={styles["form-submit-button"]}
              onClick={egister}
            >
              Register
            </button>
          </div>
        </form>
        <div className={styles["form-input-error"]}>
          <p>{loginError}</p>
        </div>
      </div>
    </div>
  );
};
export default Register;
