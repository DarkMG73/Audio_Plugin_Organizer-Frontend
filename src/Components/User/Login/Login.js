import styles from "./Login.module.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormInput from "../../../UI/Form/FormInput/FormInput";
import { sign_inAUser, setUserCookie } from "../../../storage/userDB";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import { authActions } from "../../../store/authSlice";
import GatherToolData from "../../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../../store/audioToolDataSlice";

const Login = (props) => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [loginError, seLoginError] = useState(false);
  const [showLoginError, setShowLoginError] = useState(true);
  const dispatch = useDispatch();
  const horizontalDisplay = props.horizontalDisplay ? "horizontal-display" : "";
  const completeSignInProcedures = (res) => {
    seLoginError(false);
    // storage("add", res.data);

    setUserCookie(res.data).then((res) => {
      console.log(
        "%c --> %cline:55%cres",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
        res
      );
    });

    dispatch(authActions.logIn(res.data));
    GatherToolData(res.data).then((data) => {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "%c Getting tool data from DB:",
          "color:#fff;background:#028218;padding:14px;border-radius:0 25px 25px 0",
          data
        );
      dispatch(audioToolDataActions.initState(data));
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const groomedName = name.split("#")[1];
    setUser({
      ...user, //spread operator
      [groomedName]: value,
    });
  };

  const errorDisplayButtonHandler = () => {
    setShowLoginError(!showLoginError);
  };

  //register function
  const submitLogin = (e) => {
    e.preventDefault();

    const { email, password } = user;

    if (email && password) {
      // axios("http://localhost:8000/api/users/auth/register", user)
      sign_inAUser(user)
        .then((res) => {
          if (res && res.hasOwnProperty("status")) {
            if (res.status >= 200 && res.status < 400) {
              completeSignInProcedures(res);
            } else if (res.status === 404) {
              seLoginError(
                "There was a problem finding the user database. Make sure you are connected to the internet. Contact the site admin if the problem continues. Error: " +
                  res.status +
                  " | " +
                  res.statusText
              );
              setShowLoginError(true);
            } else if (res.status >= 400) {
              seLoginError(
                res.data.message ? res.data.message : res.statusText
              );
              setShowLoginError(true);
            }
          } else if (res && res.hasOwnProperty("data")) {
            completeSignInProcedures(res);
          } else {
            seLoginError(
              "Unfortunately, something went wrong and we can not figure out what happened.  Please refresh and try again."
            );
            setShowLoginError(true);
          }
        })
        .catch((err) => {
          seLoginError(err);
          setShowLoginError(true);
        });
    } else {
      seLoginError(
        "Either the email or password is not meeting the requirements. Please fix and try again."
      );
      setShowLoginError(true);
    }
  };

  if (loginError) console.log("loginError", loginError);

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
        {loginError && showLoginError && (
          <div className={styles["form-input-error"]}>
            <button
              className={styles["form-input-error-close-button"]}
              onClick={errorDisplayButtonHandler}
            >
              X
            </button>
            <p>{loginError}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Login;
