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
   const [showLoginForm, setShowLoginForm] = useState(
      !props.showSignupForm || props.showLoginForm ? true : false
   );
   const [showSignupForm, setShowSignupForm] = useState(props.showSignupForm);
   const [loginEmail, setLoginEmail] = useState("");
   const [loginPassword, setLoginPassword] = useState("");
   const [loginError, setLoginError] = useState(false);
   const horizontalDisplay = props.horizontalDisplay
      ? "horizontal-display"
      : "";
   const callback = props.callback;

   const toggleSignupLoginButtonHandler = () => {
      setShowLoginForm(!showLoginForm);
      setShowSignupForm(!showSignupForm);
   };

   const addAToolButtonHandler = () => {
      dispatch(audioToolDataActions.goToAddATool());
   };

   const logOutButtonHandler = async () => {
      const shouldDelete = window.confirm("Are you sure you want to do this?");

      if (!shouldDelete) return;
      try {
         deleteUserCookie();
         dispatch(authActions.logOut());
         GatherToolData().then((data) => {
            if (process.env.NODE_ENV === "development")
               console.log(
                  "%c Getting tool data from DB:",
                  "color:#fff;background:#028218;padding:14px;border-radius:0 25px 25px 0",
                  data
               );
            dispatch(audioToolDataActions.initState(data));
         });
         setLoginError(false);
         if (callback) callback();
      } catch (error) {
         setLoginError(
            "Unfortunately, we could not log you out. Please contact general@glassinteractive.com if the problem continues. Error received: " +
               error.message
         );
      }
   };

   return (
      <div
         id="db-login-container"
         className={`${styles["inner-wrap "]}  ${styles["db-login-container"]} ${styles[horizontalDisplay]}`}
      >
         <h4>Database login status:</h4>

         <p className={styles["db-login-status-container"]}>
            <span id="db-login-status" className={styles["db-login-status"]}>
               {user ? (
                  <span className={styles["login-text"]}>
                     {" "}
                     {user.email} is logged in.{" "}
                  </span>
               ) : (
                  <span
                     className={
                        styles["login-text"] +
                        " " +
                        styles["not-logged-in-text"]
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
                           horizontalDisplay={props.horizontalDisplay}
                           signUpButtonStyles={props.signUpButtonStyles}
                           callback={callback}
                        />
                     )}
                     {showSignupForm && (
                        <Register
                           toggleSignupLoginButtonHandler={
                              toggleSignupLoginButtonHandler
                           }
                           horizontalDisplay={props.horizontalDisplay}
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
                  size="medium"
                  onClick={logOutButtonHandler}
                  styles={{ margin: "1em auto 1em" }}
               >
                  LogOut
               </PushButton>
            )}
            {loginError && <p>{loginError}</p>}
         </div>
         {props.showAddAToolButton && (
            <PushButton
               inputOrButton="button"
               id="create-entry-btn"
               colorType="secondary"
               value="Add a Question"
               data=""
               size="small"
               onClick={addAToolButtonHandler}
               styles={{
                  width: "300px",
                  letterSpacing: "var(--iq-spacing-subheading)",
                  fontVariant: "small-caps",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  margin: "1.5em auto",
                  padding: "0.75em",
                  transform: "none",
                  borderRadius: "50px"
               }}
            >
               <span>Add a Plugin or Tool</span>
            </PushButton>
         )}
      </div>
   );
}

export default LoginStatus;
