import React, { useEffect, useState, Fragment } from "react";
import styles from "./App.module.css";
import Home from "./Pages/Home/Home";
import Header from "./Components/Header/Header";
import Admin from "./Components/Admin/Admin";
import GatherToolData from "./Hooks/GatherToolData";
import { useSelector, useDispatch } from "react-redux";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import { getUserCookie, getUserUserByToken } from "./storage/userDB";
import { audioToolDataActions } from "./store/audioToolDataSlice";
import { authActions } from "./store/authSlice";
import { ErrorBoundary } from "./Components/ErrorHandling/ErrorBoundary/ErrorBoundary";
import LocalErrorDisplay from "./Components/ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";
import CardPrimary from "./UI/Cards/CardPrimary/CardPrimary";

const App = () => {
  const [user, setUser] = useState(false);
  const [localError, setLocalError] = useState({
    active: false,
    message: null,
  });
  const toolsData = useSelector((state) => state.toolsData);
  const dispatch = useDispatch();
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
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
          err
        );
        if (err.hasOwnProperty("status") && err.status >= 500) {
          setLocalError({
            active: true,
            message:
              " *** " +
              err.statusText +
              " *** It looks like we can not make a connection. Here is the error we received: Please make sure there is an internet connection and refresh the browser. if the problem continues, please send a quick email so this can be looked into. Email Address: general@glassinteractive.com.com",
          });
        } else if (err.hasOwnProperty("status")) {
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
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err,
          });
        }
      });
  };
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

  const localErrorButtonHandler = () => {
    setLocalError({ active: !localError, message: localError.message });
  };

  return (
    <div className={styles["app-container"]}>
      <div
        className={
          styles["error-wrapper"] +
          " " +
          (localError.active && styles["error-active"])
        }
      >
        <button
          className={styles["error-close-button"]}
          onClick={localErrorButtonHandler}
        >
          X
        </button>
        {localError.active && (
          <LocalErrorDisplay message={localError.message} />
        )}
      </div>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      {user.isAdmin && (
        <Fragment>
          <div className={styles["admin-notice"]}>
            <h3>GLOBAL ADMIN MODE</h3>
          </div>
          <Admin />
        </Fragment>
      )}
      <div className={styles["content-container"]}>
        {/* !toolsData.allTools && <BarLoader />*/}
        <ErrorBoundary>{/*toolsData.allTools &&*/ <Home />}</ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
