import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// import {
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signOn,
//   signOut,
// } from "firebase/auth";
// import { loginStatusActions } from "../../store/loginStatusSlice";
// import { auth } from "../../storage/firebase.config.js";
import styles from "./AddATool.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAQuestionForm from "./AddAToolForm";
import CSVReader from "./CSVReader/CSVReader";

function AddATool(props) {
  const { allTools } = useSelector((state) => state.toolsData);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [fileUploadArray, setFileUploadArray] = useState(false);

  useEffect(() => {
    if (Object.keys(allTools).includes("error")) {
      setShowAddQuestionForm(true);
    }
  }, []);

  // LOGIN & USER DATA
  // const userData = useSelector((state) => state.loginStatus);
  // const user = userData.user;
  // const isLoggedIn = userData.userLoggedIn;
  // const dispatch = useDispatch();
  const user = { name: "Mike Glass", email: "email@something.com" };
  // useEffect(() => {}, [dispatch]);
  // onAuthStateChanged(auth, (currentUser) => {
  //   if (currentUser) {
  //     if (!isLoggedIn || currentUser.email !== userData.user.email) {
  //       const userObj = {};
  //       const desiredKeys = ["displayName", "email", "photoURL", "uid"];

  //       for (const key in currentUser) {
  //         if (desiredKeys.includes(key)) userObj[key] = currentUser[key];
  //       }
  //       dispatch(loginStatusActions.logIn(userObj));
  //     }
  //   } else {
  //     dispatch(loginStatusActions.logOut());
  //   }
  // });

  const logInButtonHandler = () => {
    setShowLoginForm(!showLoginForm);
  };
  const logInSubmitHandler = async (e) => {
    e.preventDefault();

    //   try {
    //     const user = await signInWithEmailAndPassword(
    //       auth,
    //       loginEmail,
    //       loginPassword
    //     );
    //     setLoginError(false);
    //     console.log(
    //       "%c --> %cline:16%cuser",
    //       "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //       "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //       "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
    //       user
    //     );
    //   } catch (error) {
    //     setLoginError(
    //       "Unfortunately, we could not log you in. Here is the error we received: " +
    //         error.message.replace("Firebase", "")
    //     );
    //     console.log(
    //       "%c --> %cline:18%cerror",
    //       "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //       "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //       "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
    //       error.message
    //     );
    //   }
  };

  const logOutButtonHandler = async () => {
    ("click");
    try {
      // const user = await signOut(auth);
      // console.log(
      //   "%c --> %cline:67%cuser",
      //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //   "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
      //   user
      // );
      setLoginError(false);
    } catch (error) {
      setLoginError(
        "Unfortunately, we could not log you out. Please contact general@glassinteractive.com if the problem continues. Error received: " +
          error.message.replace("Firebase", "")
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

  function showNewQuestionFormButtonHandler() {
    setShowAddQuestionForm(!showAddQuestionForm);
  }

  return (
    <div id="add-a-tool-outer-wrap" className={styles["add-a-tool-outer-wrap"]}>
      <div id="add-a-tool-container" className={styles["add-a-tool-container"]}>
        <h2 className="section-title">Add A Tool Here</h2>
        <p className={styles["add-a-tool-intro"]}>
          To add questions to this tool, simply click the{" "}
          <i>Create an Entry Form</i> button and fill out the small form. Feel
          free to click the same button to create as many forms as needed to add
          multiple question at once. When they are all ready, click the{" "}
          <i>Submit</i> button. If you are logged in with the appropriate level
          the question will be immediately added. If not, the question will be
          submitted for review first before being added.
        </p>
        <p>Thanks for contributing!</p>
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
              <PushButton
                inputOrButton="button"
                id="login-to-db"
                colorType="primary"
                value="login to db"
                data=""
                size="small"
                onClick={logInButtonHandler}
              >
                Log In
              </PushButton>
            )}

            {showLoginForm && !user ? (
              <form name="login-form" onSubmit={logInSubmitHandler}>
                <label htmlFor="login-email">Email Address</label>
                <input
                  type="text"
                  name="login-email"
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                  }}
                />

                <label htmlFor="login-password">Email Address</label>
                <input
                  type="text"
                  name="login-password"
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                  }}
                />

                <input type="submit" value="Submit" />
              </form>
            ) : (
              ""
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
          {showAddQuestionForm && (
            <AddAQuestionForm
              saveOrUpdateData="save"
              setFormParentOpen={setShowAddQuestionForm}
            />
          )}
          {fileUploadArray && (
            <AddAQuestionForm
              saveOrUpdateData="save"
              formData={fileUploadArray}
              setFormParentOpen={setShowAddQuestionForm}
            />
          )}
        </div>
        <div className={styles["button-container"]}>
          <h4>Poduction Tool Entry Form</h4>
          <PushButton
            inputOrButton="button"
            id="create-entry-btn"
            colorType="secondary"
            value="Add a Question"
            data=""
            size="medium"
            onClick={showNewQuestionFormButtonHandler}
          >
            {showAddQuestionForm && (
              <span>
                <b>Cancel</b> the Entry Form
              </span>
            )}
            {!showAddQuestionForm && <span>Show the Entry Form</span>}
          </PushButton>
          <h4>Upload a CSV Spreadsheet</h4>

          <div className={styles["cvs-buttons-container"]}>
            <CSVReader setFileUploadArray={setFileUploadArray} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddATool;
