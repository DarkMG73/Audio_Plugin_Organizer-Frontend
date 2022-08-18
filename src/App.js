import React, { useEffect, useState, Fragment } from "react";
import styles from "./App.module.css";
import Home from "./Pages/Home/Home";
import Header from "./Components/Header/Header";
import Admin from "./Components/Admin/Admin";
import GatherToolData from "./Hooks/GatherToolData";
import { audioToolDataActions } from "./store/audioToolDataSlice";
import { useSelector, useDispatch } from "react-redux";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import { getUserCookie, getUserUserByToken } from "./storage/userDB";
import { authActions } from "./store/authSlice";
import { ErrorBoundary } from "./Components/ErrorBoundary/ErrorBoundary";
const App = () => {
  const [user, setUser] = useState(false);
  const toolsData = useSelector((state) => state.toolsData);

  const dispatch = useDispatch();

  useEffect(() => {
    getUserCookie().then((res) => {
      if (res.status >= 400) {
        GatherToolData().then((data) => {
          // console.log("🟣 | getData | questionsFromDB", data);
          dispatch(audioToolDataActions.initState(data));
        });
      } else {
        getUserUserByToken(res.data.cookie).then((userProfile) => {
          setUser({ ...userProfile, token: res.data.cookie });
        });
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(authActions.logIn(user));
      GatherToolData(user).then((data) => {
        // console.log("🟣 | getData | questionsFromDB", data);
        dispatch(audioToolDataActions.initState(data));
      });
    }
  }, [user]);

  return (
    <div className={styles["app-container"]}>
      <ErrorBoundary>
        <h1>
          This is a test
          <input type="checkbox" value="the value" checked />
        </h1>
      </ErrorBoundary>
      <Header />
      {user.isAdmin && (
        <Fragment>
          <div className={styles["admin-notice"]}>
            <h3>GLOBAL ADMIN MODE</h3>
          </div>
          <Admin />
        </Fragment>
      )}
      <div className={styles["content-container"]}>
        {!toolsData.allTools && <BarLoader />}
        <ErrorBoundary specialProps={"Testing Props"}>
          {toolsData.allTools && <Home />}
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
