import styles from "./Register.module.css";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import FormInput from "../../../UI/Form/FormInput/FormInput";
import {
  registerAUser,
  sign_inAUser,
  setUserCookie,
} from "../../../storage/userDB";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import {} from "../../../storage/userDB";
import { authActions } from "../../../store/authSlice";
import GatherToolData from "../../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../../store/audioToolDataSlice";
import ReactCaptcha from "modern-react-captcha";
import reloadIcon from "../../../assets/images/reloadIcon.svg";
import { toTitleCase } from "../../../Hooks/utility";
import usePasswordValidator, {
  passwordRequirements,
} from "../../../Hooks/usePasswordValidator";

const Register = (props) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const groomedName = name.split("#")[1];
    setUser({
      ...user, //spread operator
      [groomedName]: value,
    });
  };
  const [captchaVerified, setCaptchaVerified] = useState();
  const handleCAPTCHASuccess = () => {
    console.log("Captcha matched!");
    setCaptchaVerified(true);
    setLoginError("CAPTCHA test is now correct!");
  };
  const handleCAPTCHAFailure = () => {
    console.log("Captcha does not match");
    setLoginError("CAPTCHA test is not correct yet.");
    setCaptchaVerified(false);
  };
  const horizontalDisplay = props.horizontalDisplay ? "horizontal-display" : "";
  const passwordValidator = usePasswordValidator();
  const inputsValidate = (inputNameObject) => {
    /////////////////
    //INPUT CRITERIA
    //////////////////
    const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    for (const key in inputNameObject) {
      console.log(
        "%c --> %cline:57%ckey",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
        key
      );
      if (
        !inputNameObject[key].constructor === String ||
        !inputNameObject[key].length > 0
      ) {
        return {
          valid: false,
          message:
            'The "' +
            toTitleCase(key, true) +
            '" field is empty. Please fill this in.',
        };
      } else if (
        key === "email" &&
        !inputNameObject[key].match(validEmailRegex)
      ) {
        setLoginError();
        return {
          valid: false,
          message:
            "The email address is not a valid email format. Please use a standard email address.",
        };
      } else if (key === "password") {
        console.log(
          "%c --> %cline:86%ckey === password",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
          key === "password"
        );
        const passwordValidCheck = passwordValidator(inputNameObject[key]);
        console.log(
          "%c --> %cline:82%cpasswordValidCheck",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px",
          passwordValidCheck
        );
        if (!passwordValidCheck)
          return {
            valid: false,
            message:
              "The password does not meet the requirements. It failed with these errors: " +
              passwordRequirements.toString +
              ". " +
              passwordRequirements,
          };
      }
    }
    return true;
  };

  const completeSignInProcedures = (res) => {
    setLoginError(false);
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

  //register function
  const egister = (e) => {
    e.preventDefault();

    const { userName, email, password } = user;
    console.log(
      "%c --> %cline:47%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
      user
    );
    if (captchaVerified) {
      const inputsValidCheck = inputsValidate({ userName, email, password });
      if (inputsValidCheck.valid) {
        // axios("http://localhost:8000/api/users/auth/register", user)
        registerAUser(user).then((res) => {
          sign_inAUser(user)
            .then((res) => {
              console.log(
                "%c --> %cline:60%cres",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
                res
              );
              if (res && res.hasOwnProperty("status")) {
                if (res.status >= 200 && res.status < 400) {
                  completeSignInProcedures(res);
                } else if (res.status === 404) {
                  setLoginError(
                    "There was a problem finding the user database. Make sure you are connected to the internet. Contact the site admin if the problem continues. Error: " +
                      res.status +
                      " | " +
                      res.statusText
                  );
                } else if (res.status >= 400) {
                  console.log(
                    "%c --> %cline:70%cres",
                    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                    "color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px",
                    res
                  );
                  setLoginError(
                    res.data.message ? res.data.message : res.statusText
                  );
                }
              } else if (res && res.hasOwnProperty("data")) {
                console.log(
                  "%c --> %cline:76%cres",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
                  res
                );
                setLoginError(false);
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
              } else {
                console.log(
                  "%c --> %cline:89%celse",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px"
                );
                setLoginError(
                  "Unfortunately, something went wrong and we can not figure out what happened.  Please refresh and try again."
                );
              }
            })
            .catch((err) => {
              setLoginError(err);
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
        console.log(
          "%c --> %cline:210%cinputsValidCheck",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
          inputsValidCheck
        );
        setLoginError(inputsValidCheck.message);
        alert("Invalid Input Error: " + inputsValidCheck.message);
      }
    } else {
      alert(
        'The CAPTCHA test has failed. Please fix the wrong items and then resubmit. Keep in mind that "I" and "1" and "l" can look really similar in that test. "0", "O" and "o" can also be mistaken.'
      );
    }
  };
  return (
    <div
      className={`${styles["registration-container"]}   ${styles[horizontalDisplay]}`}
    >
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
          &#x21e6;Login
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

          <div className={`${styles["form-input-container"]}`}>
            <div
              className={`${styles["inner-form-input-container"]} ${styles["captcha-wrap"]}`}
            >
              <label>Test for Human</label>
              <ReactCaptcha
                key={"captcha" + horizontalDisplay}
                charset="un"
                length={5}
                color="var(--iq-color-foreground)"
                bgColor="var(--iq-color-background-warm)"
                reload={true}
                reloadText="Reload Captcha"
                reloadIcon={reloadIcon}
                handleSuccess={handleCAPTCHASuccess}
                handleFailure={handleCAPTCHAFailure}
              />
            </div>
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
