import styles from "./SetImageURLS.module.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { audioToolDataActions } from "../../store/audioToolDataSlice";

const SetImageURLS = (props) => {
  const toolsData = useSelector((state) => state.toolsData);
  const allTools = toolsData.allTools;
  const dispatch = useDispatch();
  const downloadPicsButtonHandler = (e) => {};

  const setImageURLSButtonHandler = (e) => {
    const newAllTools = {};
    for (const key in allTools) {
      const tool = allTools[key];
      const imageName =
        tool.company.replaceAll(" ", "-").replaceAll("_", "-") +
        "_" +
        tool.name.replaceAll(" ", "-").replaceAll("_", "-") +
        ".png";
      newAllTools[key] = { ...tool };

      if (allTools[key].photoURL) {
        newAllTools[key].photoURL = imageName;
      } else {
        newAllTools[key].photoURL = "";
      }
    }

    const newToolsData = { ...toolsData };
    newToolsData.allTools = { ...newAllTools };

    dispatch(audioToolDataActions.initState(newToolsData));
  };

  return (
    <div className={styles["image-download-container"]}>
      <h2 key="home" className="section-title">
        Download Product Images
      </h2>

      <button onClick={setImageURLSButtonHandler}>Set Image URLS</button>
    </div>
  );
};

export default SetImageURLS;
