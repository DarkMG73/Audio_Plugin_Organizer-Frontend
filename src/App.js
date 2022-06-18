import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import Home from "./Pages/Home/Home";
import GatherToolData from "./Hooks/GatherToolData";
import { audioToolDataActions } from "./store/audioToolDataSlice";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const toolsData = useSelector((state) => state.toolsData);
  const dispatch = useDispatch();

  useEffect(() => {
    GatherToolData().then((data) => {
      console.log("🟣 | getData | questionsFromDB", data);
      dispatch(audioToolDataActions.initState(data));
    });
  }, []);

  return <div>{toolsData.allTools && <Home />}</div>;
};

export default App;
