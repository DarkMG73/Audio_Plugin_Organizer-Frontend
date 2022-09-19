import styles from "./SetImageURLS.module.css";
import { useSelector, useDispatch } from "react-redux";
import { audioToolDataActions } from "../../store/audioToolDataSlice";

const SetImageURLS = () => {
  const toolsData = useSelector((state) => state.toolsData);
  const allTools = toolsData.allTools;
  const dispatch = useDispatch();

  ///////////////////////////////////////////////////////////////////////
  /// Handlers
  ///////////////////////////////////////////////////////////////////////
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

  ///////////////////////////////////////////////////////////////////////
  /// Output
  ///////////////////////////////////////////////////////////////////////
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
