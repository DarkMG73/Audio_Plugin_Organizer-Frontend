import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./LoginStatus.module.css";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import Register from "../Register/Register";
import Login from "../Login/Login";
import { authActions } from "../../../store/authSlice";
import { deleteUserCookie } from "../../../storage/userDB";
import GatherToolData from "../../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../../store/audioToolDataSlice";

function LoginStatus(props) {
  const userData = useSelector((state) => state.auth);
  const user = userData.user;
  const isLoggedIn = userData.userLoggedIn;
  const dispatch = useDispatch();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const toggleSignupLoginButtonHandler = () => {
    setShowLoginForm(!showLoginForm);
    setShowSignupForm(!showSignupForm);
  };

  const logOutButtonHandler = async () => {
    console.log("click");
    try {
      deleteUserCookie();
      dispatch(authActions.logOut());
      GatherToolData().then((data) => {
        console.log("🟣 | getData | questionsFromDB", data);
        dispatch(audioToolDataActions.initState(data));
      });
      setLoginError(false);
    } catch (error) {
      setLoginError(
        "Unfortunately, we could not log you out. Please contact general@glassinteractive.com if the problem continues. Error received: " +
          error.message
      );
      console.log(
        "%c --> %cline:69%cerror",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
        error
      );
    }
  };

  return (
    <div
      id="db-login-container"
      className={`${styles["inner-wrap "]}  ${styles["db-login-container"]}`}
    >
      <h4>Database login status:</h4>

      <p>
        <span id="db-login-status" className={styles["db-login-status"]}>
          {user ? (
            <span className={styles["login-text"]}>
              {" "}
              {user.email} is logged in.{" "}
            </span>
          ) : (
            <span
              className={
                styles["login-text"] + " " + styles["not-logged-in-text"]
              }
            >
              {" "}
              No one is currently logged in.
            </span>
          )}
        </span>
      </p>
      <div className={styles["button-container"]}>
        {!user && (
          <>
            <div className={styles["form-container"]}>
              {showLoginForm && (
                <Login
                  toggleSignupLoginButtonHandler={
                    toggleSignupLoginButtonHandler
                  }
                />
              )}
              {showSignupForm && (
                <Register
                  toggleSignupLoginButtonHandler={
                    toggleSignupLoginButtonHandler
                  }
                />
              )}
            </div>
          </>
        )}

        {user && (
          <PushButton
            inputOrButton="button"
            id="logout-from-db"
            colorType="primary"
            value="logout from db"
            data=""
            size="small"
            onClick={logOutButtonHandler}
          >
            LogOut
          </PushButton>
        )}
        {loginError && <p>{loginError}</p>}
      </div>
    </div>
  );
}

export default LoginStatus;
