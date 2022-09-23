import styles from "./ImageDownload.module.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const ImageDownload = (props) => {
  const allTools = useSelector((state) => state.toolsData.allTools);

  const downloadPicsButtonHandler = (e) => {
    console.log("Click", e.target);
  };

  const btnOnClick = (e) => {};
  let count = 0;
  const newAllTools = {};

  for (const key in allTools) {
    newAllTools[key] = allTools[key];
    count++;
    // if (count > 4) break;
  }

  return (
    <div className={styles["image-download-container"]}>
      <h2 key="home" className="section-title">
        Download Product Images
      </h2>

      <button onClick={downloadPicsButtonHandler}>Download Pics</button>

      {Object.keys(newAllTools).map((key, i) => {
        const tool = newAllTools[key];

        const imageSrc = tool.photoURL;
        const imageName =
          tool.company.replaceAll(" ", "-").replaceAll("_", "-") +
          "_" +
          tool.name.replaceAll(" ", "-").replaceAll("_", "-") +
          ".png";

        return (
          <div
            key={imageName + imageSrc}
            className={styles["admin-download-row"]}
          >
            {i} |
            <span>
              <input type="text" value={imageName} />{" "}
            </span>
            <img src={imageSrc} download={imageName} />
            <input type="checkbox" />
          </div>
        );
      })}
    </div>
  );
};

export default ImageDownload;
