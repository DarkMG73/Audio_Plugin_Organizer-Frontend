import React, { useEffect, useState, Fragment } from "react";
import styles from "./App.module.css";
import Home from "./Pages/Home/Home";
import Header from "./Components/Header/Header";
import Admin from "./Components/Admin/Admin";
import GatherToolData from "./Hooks/GatherToolData";
import { useDispatch } from "react-redux";
import { getUserCookie, getUserUserByToken } from "./storage/userDB";
import { audioToolDataActions } from "./store/audioToolDataSlice";
import { authActions } from "./store/authSlice";
import { ErrorBoundary } from "./Components/ErrorHandling/ErrorBoundary/ErrorBoundary";
import LocalErrorDisplay from "./Components/ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";

const App = () => {
  const [user, setUser] = useState(false);
  const [localError, setLocalError] = useState({
    active: false,
    message: null,
  });
  const dispatch = useDispatch();

  ////////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  const runGatherToolData = (user) => {
    GatherToolData(user)
      .then((data) => {
        if (process.env.NODE_ENV !== "production")
          console.log(
            "%c Getting tool data from DB:",
            "color:#fff;background:#777;padding:14px;border-radius:0 25px 25px 0",
            data
          );
        dispatch(audioToolDataActions.initState(data));
      })
      .catch((err) => {
        console.log(
          "%c --> GatherToolData: err: ",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
          err
        );
        if (err.hasOwnProperty("status") && err.status >= 500) {
          setLocalError({
            active: true,
            message:
              " *** " +
              err.statusText +
              " *** It looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request. Please contact us if you find you are online and yet still receiving this error.",
          });
        } else if (err.hasOwnProperty("status")) {
          console.log(
            "%c --> %cline:55%cerr",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(114, 83, 52);padding:3px;border-radius:2px",
            err
          );
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              err.request.responseURL,
          });
        } else {
          console.log(
            "%c --> %cline:66%cerr",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
            err
          );
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              err.request.responseURL,
          });
        }
      });
  };

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    getUserCookie()
      .then((res) => {
        if (res.status >= 400) {
          runGatherToolData();
        } else {
          getUserUserByToken(res.data.cookie)
            .then((userProfile) => {
              if (userProfile.status >= 400) {
                runGatherToolData();
              } else {
                setUser({ ...userProfile, token: res.data.cookie });
              }
            })
            .catch((err) => {
              console.log(
                "%c --> GatherToolData: err: ",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
                err
              );
            });
        }
      })
      .catch((err) => {
        console.log(
          "%c --> GatherToolData: err: ",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
          err
        );
        setLocalError({
          active: true,
          message: " An error: " + err.toString(),
        });
      });
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(authActions.logIn(user));
      runGatherToolData(user);
    }
  }, [user]);

  ////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////
  const localErrorButtonHandler = () => {
    setLocalError({ active: !localError, message: localError.message });
  };

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  return (
    <div className={styles["app-container"]}>
      <div
        key="error-wrapper"
        className={
          styles["error-wrapper"] +
          " " +
          (localError.active && styles["error-active"])
        }
      >
        <button
          key="error-close-button"
          className={styles["error-close-button"]}
          onClick={localErrorButtonHandler}
        >
          X
        </button>
        {localError.active && (
          <LocalErrorDisplay
            key="local-error-message"
            message={localError.message}
          />
        )}
      </div>
      <ErrorBoundary key="header-error-boundary">
        <Header key="header" />
      </ErrorBoundary>
      {user.isAdmin && (
        <Fragment key="fragment-global-admin">
          <div className={styles["admin-notice"]}>
            <h3>GLOBAL ADMIN MODE</h3>
          </div>
          <Admin key="admin" />
        </Fragment>
      )}
      <div key="content-container" className={styles["content-container"]}>
        {/* !toolsData.allTools && <BarLoader />*/}
        <ErrorBoundary key="home-error-boundary">
          {/*toolsData.allTools &&*/ <Home key="home" />}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
