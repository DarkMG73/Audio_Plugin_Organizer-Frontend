import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import Home from "./Pages/Home/Home";
import GatherToolData from "./Hooks/GatherToolData";
import { audioToolDataActions } from "./store/audioToolDataSlice";
import { useSelector, useDispatch } from "react-redux";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import { getUserCookie, getUserUserByToken } from "./storage/userDB";
import { authActions } from "./store/authSlice";

const App = () => {
  const [user, setUser] = useState(false);
  const toolsData = useSelector((state) => state.toolsData);
  const dispatch = useDispatch();

  useEffect(() => {
    getUserCookie().then((res) => {
      if (res.status >= 400) {
        GatherToolData().then((data) => {
          console.log("🟣 | getData | questionsFromDB", data);
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
        console.log("🟣 | getData | questionsFromDB", data);
        dispatch(audioToolDataActions.initState(data));
      });
    }
  }, [user]);

  return (
    <div>
      {!toolsData.allTools && <BarLoader />}
      {toolsData.allTools && <Home />}
    </div>
  );
};

export default App;
