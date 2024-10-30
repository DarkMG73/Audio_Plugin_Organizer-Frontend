import React, { useEffect, useState, Fragment } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Home from "./Pages/Home/Home";
import Header from "./Components/Header/Header";
import Admin from "./Components/Admin/Admin";
import GatherToolData from "./Hooks/GatherToolData";

import { getUserCookie, getUserUserByToken } from "./storage/userDB";
import { audioToolDataActions } from "./store/audioToolDataSlice";
import { authActions } from "./store/authSlice";
import { ErrorBoundary } from "./Components/ErrorHandling/ErrorBoundary/ErrorBoundary";
import LocalErrorDisplay from "./Components/ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import { loadingRequestsActions } from "./store/loadingRequestsSlice";

const App = (props) => {
  const [user, setUser] = useState(false);
  const [rateLimitData, setRateLimitData] = useState(false);
  const userLoggedIn = useSelector((state) => state.auth.user);
  const [localError, setLocalError] = useState({
    title: null,
    active: false,
    message: null,
  });
  const pendingLoadRequests = useSelector(
    (state) => state.loadingRequests.pendingLoadRequests
  );
  const dispatch = useDispatch();
  const makeLoadingRequest = function () {
    return dispatch(loadingRequestsActions.addToLoadRequest());
  };
  const removeLoadingRequest = function () {
    dispatch(loadingRequestsActions.removeFromLoadRequest());
  };

  ////////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  const runGatherToolData = (user) => {
    makeLoadingRequest();
    GatherToolData(user)
      .then((data) => {
        if (process.env.NODE_ENV === "development")
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
              `***\n\nIt looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request.\n\nIt is also possible that the server's security software detected abnormally high traffic between this IP address and the server.  This is nothing anyone did wrong, just a rare occurrence with a highly-secured server. This will clear itself sometime within the next thirty minutes or so.\n\nPlease contact us if you find you are online and this error does not clear within an hour.\n\nSorry for the trouble. 😢`,
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

          const responseURL =
            err.hasOwnProperty("request") &&
            err.request.hasOwnProperty("responseURL")
              ? err.request.responseURL
              : "";
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              responseURL,
          });
        }
      });

    removeLoadingRequest();
  };

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  axios.interceptors.response.use(
    (response) => {
      setRateLimitData({
        remaining: response.headers["ratelimit-remaining"],
        limit: response.headers["ratelimit-limit"],
      });

      return response;
    },

    (error) => {
      return Promise.reject(error);
    }
  );

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
  }, [user, dispatch]);

  useEffect(() => {
    setUser(userLoggedIn);
  }, [userLoggedIn]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development")
      console.log(
        "%c --> %cline:184%crateLimitData",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
        rateLimitData
      );
    const rateLimitConcernMessage = `For some reason, the server has reported more than expected traffic from this IP address. You are not doing anything wrong, but we have a security feature on our servers to prevent others from doing bad things on the server.\n\nEven though you are not a problem, the server might need make this IP address wait a bit if the rate limit is exceeded. If this happens, please just give it 30-60 minutes and hop back on.\n\nSorry if this causes you any trouble. 😢`;

    if (
      (rateLimitData.remaining < 30 &&
        rateLimitData.remaining > 10 &&
        localError.message !== rateLimitConcernMessage) ||
      (rateLimitData.remaining <= 10 && rateLimitData.remaining > 0)
    )
      setLocalError({
        title: "Not a big deal, but...",
        active: true,
        message: rateLimitConcernMessage,
      });

    if (process.env.NODE_ENV === "development")
      console.log(
        "%c --> %cline:190%crateLimitData.remaining <= 0",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
        rateLimitData.remaining <= 0
      );
    if (
      rateLimitData.remaining &&
      rateLimitData.remaining <= 5 &&
      rateLimitData.remaining &&
      rateLimitData.remaining >= 0
    )
      setLocalError({
        active: true,
        message:
          "It looks like the browser has exceeded the traffic limit to the server.\n\nThis is not anything you did, just some security software that is concerned. Wait a bit and you should be back in action.\n\nSorry for the trouble 😢",
      });
    // alert(
    //   "It looks like the browser has exceeded the traffic limit to the server. This is not anything you did, just some security software that is concerned. Wait a bit and you should be back in action.\n\nSorry for the trouble :("
    // );
  }, [rateLimitData]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development")
      console.log(
        "%c --> %cline:138%cloadingRequests",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px",
        pendingLoadRequests
      );
  }, [pendingLoadRequests]);

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
            title={localError.title}
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
          {pendingLoadRequests > 0 && (
            <div key="loader" className={styles["loader-wrap"]}>
              <BarLoader />
            </div>
          )}
          {/*toolsData.allTools &&*/ <Home key="home" />}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
