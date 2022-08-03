import styles from "./ImageDownload.module.css";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

const ImageDownload = (props) => {
  const allTools = useSelector((state) => state.toolsData.allTools);

  const downloadPicsButtonHandler = (e) => {
    console.log("Click", e.target);
  };

  const btnOnClick = (e) => {
    console.log(
      "%c --> %cline:14%ce.target",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
      e.target
    );
  };
  let count = 0;
  const newAllTools = {};

  for (const key in allTools) {
    newAllTools[key] = allTools[key];
    count++;
    // if (count > 4) break;
  }

  console.log(
    "%c --> %cline:32%cnewAllTools",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
    newAllTools
  );

  return (
    <div className={styles["image-download-container"]}>
      <h2 key="home" className="section-title">
        Download Product Images
      </h2>

      <button onClick={downloadPicsButtonHandler}>Download Pics</button>

      {Object.keys(newAllTools).map((key, i) => {
        const tool = newAllTools[key];
        console.log(
          "%c --> %cline:31%ctool",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
          tool
        );
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
