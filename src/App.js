import React, { useEffect, useState } from "react";
import styles from "./App.module.css";
import axios from "axios";
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

  console.log(
    "%c --> %cline:10%ctoolsData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    toolsData.allTools
  );
  return <div>{toolsData.allTools && <Home />}</div>;
};

export default App;
