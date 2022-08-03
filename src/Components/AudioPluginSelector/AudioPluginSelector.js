import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import styles from "./AudioPluginSelector.module.css";
import GatherToolData from "../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import SlideButton from "../../UI/Buttons/SlideButton/SlideButton";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import CardPrimaryLarge from "../../UI/Cards/CardPrimaryLarge/CardPrimaryLarge";
import { savePlugin, updateAPlugin } from "../../storage/audioToolsDB";

const AudioPluginSelector = () => {
  const [toolsFromLibrary, setToolsFromLibrary] = useState(false);
  const [selectedTools, setSelectedTools] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    GatherToolData().then((data) => {
      console.log("🟣 | getData | questionsFromDB", data);

      if (data.allTools.hasOwnProperty("error")) return;

      const output = [];

      for (const key in data.allTools) {
        output.push(data.allTools[key]);
      }

      setToolsFromLibrary(output);
      // dispatch(audioToolDataActions.initState(data));
    });
  }, []);

  const buttonChangeHandler = (e) => {
    const newSelectedToolsArray = [...selectedTools];

    if (newSelectedToolsArray.includes(e.target.value)) {
      newSelectedToolsArray.splice(selectedTools.indexOf(e.target.value), 1);
      setSelectedTools(newSelectedToolsArray);
    } else {
      newSelectedToolsArray.push(e.target.value);
      setSelectedTools(newSelectedToolsArray);
    }
  };

  const submitButtonHandler = () => {
    toolsFromLibrary.forEach((tool) => {
      if (selectedTools.includes(tool._id)) {
        const theData = tool;
        savePlugin({ user, theData }, true).then((res) => {
          if (res.status && res.status < 299) {
          } else if (res.response.status === 404) {
            alert(
              "IS THE NAME UNIQUE? There was an error when trying to save the new entry. This was most likely caused by trying to add the entry with the same name as an existing tool. Make sure you do not already have this one saved. If it is a different tool that happens to have the same exact name as one you already have saved, please alter this name in some way. The name must be unique."
            );
          } else {
            alert(
              "There was an error when trying to save the new entry. Here is the message from the server: ",
              res.data.message
            );
          }
        });
      }
    });
  };

  return (
    <CardPrimaryLarge styles={{ maxWidth: "100%" }}>
      <div className={styles["audio-plugin-selector-container"]}>
        <p>
          If you wish to add audio plugins and tools from the library, click
          below.{" "}
        </p>
        {toolsFromLibrary && (
          <PushButton
            key={"addatoolform-9"}
            inputOrButton="input"
            type="submit"
            id="quest-submit-btn"
            colorType="primary"
            value="Submit"
            data=""
            size="large"
            onClick={submitButtonHandler}
            styles={{
              background: "var(--iq-color-accent-gradient)",
              position: "sticky",
              top: "50px",
            }}
          >
            Submit
          </PushButton>
        )}
        <ul className={styles["library-list"]}>
          {toolsFromLibrary &&
            toolsFromLibrary.map((tool) => {
              return (
                <li>
                  <li>
                    <SlideButton
                      containerStyles={{
                        flexGrow: "0",
                        maxWidth: " min-content",
                        minWidth: "min-content",
                        margin: "0",
                      }}
                      onClick={buttonChangeHandler}
                      value={tool._id}
                    />
                    <span
                      id="line-inner-wrap"
                      className={
                        styles["line-inner-wrap"] +
                        " " +
                        (selectedTools.includes(tool._id) &&
                          styles["selected-tool"])
                      }
                    >
                      <span
                        id="line-text-inner-wrap"
                        className={styles["line-text-inner-wrap"]}
                      >
                        <span
                          className={
                            styles[tool.name + " name"] +
                            " " +
                            styles["item-title"]
                          }
                        >
                          {tool.name}
                        </span>
                        {tool.company && (
                          <span className={styles[tool.name + " company"]}>
                            <Fragment>
                              <span>By </span> {tool.company}
                            </Fragment>
                          </span>
                        )}
                        {(tool.functions && tool.functions.length) > 0 && (
                          <span className={styles[tool.name + " functions"]}>
                            <Fragment>
                              <span>Functions: </span>{" "}
                              {tool.functions.toString()}
                            </Fragment>
                          </span>
                        )}
                        {tool.productURL && (
                          <span className={styles[tool.name + " productURL"]}>
                            <Fragment>
                              <a
                                href={tool.productURL}
                                alt={tool.name + " by " + tool.company}
                                target="_blank"
                              >
                                More detail
                              </a>
                            </Fragment>
                          </span>
                        )}
                      </span>
                      {tool.photoURL && (
                        <span
                          className={
                            styles[tool.name + " photoURL"] +
                            " " +
                            styles["image-wrap"]
                          }
                        >
                          <Fragment>
                            <img
                              src={tool.photoURL}
                              alt={tool.name + " by " + tool.company}
                            />
                          </Fragment>
                        </span>
                      )}
                    </span>
                  </li>
                </li>
              );
            })}
        </ul>
      </div>
    </CardPrimaryLarge>
  );
};

export default AudioPluginSelector;
