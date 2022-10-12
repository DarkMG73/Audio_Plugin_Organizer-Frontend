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
  const [showLoginError, setShowLoginError] = useState(true);
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
    setCaptchaVerified(true);
    setLoginError("CAPTCHA test is now correct!");
    setShowLoginError(true);
  };
  const handleCAPTCHAFailure = () => {
    setLoginError("CAPTCHA test is not correct yet.");
    setShowLoginError(true);
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
        return {
          valid: false,
          message:
            "The email address is not a valid email format. Please use a standard email address.",
        };
      } else if (key === "email" && !inputNameObject[key].includes(".")) {
        // If not period, ask if that was intended
        if (!inputNameObject[key].includes(".")) {
          const confirmPeriod = window.confirm(
            'There does not appear to be period "." in the email address. If there is no period in this email address, click "OK" to submit the form. \n\nMost email addresses have a period and a suffix like ".com" or ".net". If this email address should have a period, then click "CANCEL" to return to the registration form'
          );
          if (!confirmPeriod) return;
        }
      } else if (key === "password") {
        const passwordValidCheck = passwordValidator(
          inputNameObject[key],
          true
        );

        if (!passwordValidCheck.isValid) {
          console.log(
            "%c --> %cline:117%cpasswordTestResults",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px",
            passwordValidCheck
          );
          return {
            valid: false,
            message: `The password does not meet the requirements. It failed with these errors:\n\n${passwordValidCheck.details
              .map((error, i) => {
                const groomedMessage = error.message
                  .replace("string", "password")
                  .replace("digit", "number");
                return "   " + (i + 1) + ": " + groomedMessage + ". ";
              })
              .join(
                "\n"
              )}\n\nHere are all of the password requirements: ${passwordRequirements}`,
          };
        }
      }
    }
    return {
      valid: true,
      message: "Everything checked out OK",
    };
  };

  const completeSignInProcedures = (res) => {
    setLoginError(false);
    // storage("add", res.data);

    // For Dev use
    // setUserCookie(res.data).then((res) => {
    //   console.log(
    //     "%c --> %cline:55%cres",
    //     "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //     "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //     "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
    //     res
    //   );
    // });

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

  const egister = (e) => {
    e.preventDefault();

    const { userName, email, password } = user;

    if (captchaVerified) {
      const inputsValidCheck = inputsValidate({ userName, email, password });
      if (inputsValidCheck.valid) {
        // axios("http://localhost:8000/api/users/auth/register", user)
        registerAUser(user).then((res) => {
          if (res && res.status >= 400) {
            alert(
              `There was an error trying to complete the registration process. ${res.message}`
            );
          }

          sign_inAUser(user)
            .then((res) => {
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
                  setShowLoginError(true);
                } else if (res.status >= 400) {
                  setLoginError(
                    res.data.message ? res.data.message : res.statusText
                  );
                  setShowLoginError(true);
                }
              } else if (res && res.hasOwnProperty("data")) {
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
                setLoginError(
                  "Unfortunately, something went wrong and we can not figure out what happened.  Please refresh and try again."
                );
                setShowLoginError(true);
              }
            })
            .catch((err) => {
              setLoginError(err);
              setShowLoginError(true);
            });
        });
      } else {
        setLoginError(inputsValidCheck.message);
        setShowLoginError(true);
        alert("Invalid Input Error: " + inputsValidCheck.message);
      }
    } else {
      alert(
        'The CAPTCHA test has failed. Please fix the wrong items and then resubmit. Keep in mind that "I" and "1" and "l" can look really similar in that test. "0", "O" and "o" can also be mistaken.'
      );
    }
  };

  /////////////////////////////////////////
  // BUTTON HANDLERS
  /////////////////////////////////////////
  const errorDisplayButtonHandler = () => {
    setShowLoginError(!showLoginError);
  };

  /////////////////////////////////////////
  // Return
  /////////////////////////////////////////
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
          styles={{ borderRadius: "50px", height: "2em", padding: "0 2em" }}
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

          <div
            className={`${styles["form-input-container"]} ${styles["captcha-container"]}`}
          >
            <div
              className={`${styles["inner-form-input-container"]} ${styles["captcha-wrap"]}`}
            >
              <label>Separate Bots from Humans</label>
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
export default Register;
