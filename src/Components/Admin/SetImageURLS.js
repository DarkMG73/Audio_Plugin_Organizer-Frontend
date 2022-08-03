import styles from "./SetImageURLS.module.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { audioToolDataActions } from "../../store/audioToolDataSlice";

const SetImageURLS = (props) => {
  const toolsData = useSelector((state) => state.toolsData);
  const allTools = toolsData.allTools;
  const dispatch = useDispatch();
  const downloadPicsButtonHandler = (e) => {
    console.log("Click", e.target);
  };

  const setImageURLSButtonHandler = (e) => {
    console.log(
      "%c --> %cline:14%ce.target",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
      e.target
    );

    const newAllTools = {};
    for (const key in allTools) {
      const tool = allTools[key];
      const imageName =
        tool.company.replaceAll(" ", "-").replaceAll("_", "-") +
        "_" +
        tool.name.replaceAll(" ", "-").replaceAll("_", "-") +
        ".png";
      newAllTools[key] = { ...tool };
      console.log(
        "%c --> %cline:33%callTools[key].photoURL",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
        allTools[key].photoURL
      );
      if (allTools[key].photoURL) {
        newAllTools[key].photoURL = imageName;
      } else {
        newAllTools[key].photoURL = "";
      }
    }

    console.log(
      "%c --> %cline:32%cnewAllTools",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
      newAllTools
    );

    const newToolsData = { ...toolsData };
    newToolsData.allTools = { ...newAllTools };
    console.log(
      "%c --> %cline:45%cnewToolsData",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px",
      newToolsData
    );

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
