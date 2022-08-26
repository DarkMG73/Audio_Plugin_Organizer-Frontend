import styles from "./Login.module.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormInput from "../../../UI/Form/FormInput/FormInput";
import { sign_inAUser, setUserCookie } from "../../../storage/userDB";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import { authActions } from "../../../store/authSlice";
import storage from "../../../storage/storage";
import GatherToolData from "../../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../../store/audioToolDataSlice";

const Login = (props) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loginError, seLoginError] = useState(false);
  const dispatch = useDispatch();
  const horizontalDisplay = props.horizontalDisplay ? "horizontal-display" : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    const groomedName = name.split("#")[1];
    setUser({
      ...user, //spread operator
      [groomedName]: value,
    });
  };
  //register function
  const submitLogin = (e) => {
    e.preventDefault();

    const { email, password } = user;

    if (email && password) {
      // axios("http://localhost:8000/api/users/auth/register", user)
      sign_inAUser(user)
        .then((res) => {
          if (res && res.hasOwnProperty("status") && res.status >= 400) {
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
            // storage("add", res.data);

            setUserCookie(res.data).then((res) => {});

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
        });
    } else {
      seLoginError(
        "Either the email or password is not meeting the requirements. Please fix and try again."
      );
    }
  };
  return (
    <div
      className={styles["login-container"] + " " + styles[horizontalDisplay]}
    >
      <div className={styles["login-title-wrap"]}>
        <h3 className={styles["login-title"]}>Login</h3>
      </div>
      <span className={styles["login-question"]}>
        Need to register?
        <PushButton
          inputOrButton="button"
          id="create-entry-btn"
          colorType="primary"
          value="Add a Question"
          data=""
          size="small"
          onClick={props.toggleSignupLoginButtonHandler}
          styles={props.signUpButtonStyles}
        >
          Sign Up &#10140;
        </PushButton>
      </span>
      <div className={styles["login-form-wrap"]}>
        <form className={styles["form"]} action="#">
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
            <PushButton
              inputOrButton="button"
              id="create-entry-btn"
              colorType="primary"
              value="Login"
              data=""
              size="medium"
              onClick={submitLogin}
            >
              Login
            </PushButton>
          </div>
        </form>
        {loginError && (
          <div className={styles["form-input-error"]}>
            <p>{loginError}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Login;
