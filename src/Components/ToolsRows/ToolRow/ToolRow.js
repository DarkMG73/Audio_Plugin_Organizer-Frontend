import { useSelector } from "react-redux";
import styles from "./ToolRow.module.css";
import { useState, useRef, Fragment, useEffect } from "react";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import { isValidHttpUrl, groomFormOutput } from "../../../Hooks/utility";
import CardSecondary from "../../../UI/Cards/CardSecondary/CardSecondary";
import CollapsibleElm from "../../../UI/CollapsibleElm/CollapsibleElm";
import AddAToolForm from "../..//AddATool/AddAToolForm";
// import { addDocToDB, deleteDocFromDb } from "../../storage/firebase.config";
import {
  updateAPlugin as addDocToDB,
  deleteAPlugin as deleteDocFromDb,
} from "../../../Hooks/DbInteractions";
import GetPluginFormInputsWithOptions from "../../../Hooks/GetPluginFormInputsWithOptions";

function ToolRow(props) {
  const toolsMetadata = useSelector((state) => state.toolsData.toolsMetadata);
  const [inEditMode, setInEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [formInputData, setFormInputData] = useState(false);
  useEffect(() => {
    GetPluginFormInputsWithOptions().then((res) => {
      console.log(
        "%c --> %cline:13%cres",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
        res
      );
      setFormInputData(res);
    });
  }, []);
  const editedTools = useRef({ edits: {} });
  const tool = props.tool;
  const key = props.keyOne;
  const k = props.keyOne;
  // editButtonDirection to be used with future edit mode visual manipulations
  const editButtonDirection = inEditMode ? "" : "";
  const editButtonWidth = inEditMode ? "max-content" : "5em";
  let groomedFormInputData;

  useEffect(() => {
    const toolFormDataArray = [tool];
    if (formInputData)
      groomedFormInputData = groomFormOutput(toolFormDataArray, formInputData);
  }, [tool, formInputData]);
  const toolFormDataArray = [tool];
  if (formInputData)
    groomedFormInputData = groomFormOutput(toolFormDataArray, formInputData);
  console.log(
    "%c --> %cline:50%cgroomedFormInputData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
    groomedFormInputData
  );

  const rowEditButtonHandler = (e, setElmOpen) => {
    setInEditMode(!inEditMode);
  };

  const rowSaveButtonHandler = (e) => {
    // Use tempKey instead of key when in dev
    // const tempKey = "TESTTEST";
    addDocToDB(key, editedTools.current.edits);
  };

  const deleteToolButtonHandler = (e) => {
    // Use tempKey instead of key when in dev
    // const tempKey = "TESTTEST";
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this tool (ID: " + key + ")"
    );
    if (shouldDelete) {
      deleteDocFromDb(key);
      setDeleted(true);
    }
  };

  function AssembleInnerRow(tool, key, categoryNamesArray) {
    let rowHTML = [];

    function onTextChangeHandler(e, title) {
      editedTools.current.edits[title] = e.target.innerText;
    }

    for (const title of categoryNamesArray) {
      let value;
      if (Object.keys(tool).includes(title)) {
        value = tool[title];
        if (Array.isArray(value)) {
          value = (
            <ul
              key={value + Math.random()}
              className={styles[title + "list"] + " " + styles.list}
            >
              {value.map((item) => (
                <li key={item + Math.random()}>{item}</li>
              ))}
            </ul>
          );
        }
      } else {
        value = "";
      }
      let itemTitle = title;

      // Skip if no value
      // if (value == undefined || value === "" || value == " ") continue;

      // If link, add <a> tag
      const isValidLink = isValidHttpUrl(value);

      if (isValidLink) {
        if (title === "photoURL") {
          value = <img key={title + Math.random()} src={value} alt={title} />;
        } else {
          value = (
            <a
              key={title + Math.random()}
              href={value}
              alt={title}
              target="_blank"
              rel="noreferrer"
            >
              {value}
            </a>
          );
        }
      }

      // Create the row
      rowHTML.push(
        <div
          key={key + "-" + title}
          id={key + "-" + title}
          className={
            styles[title + "-wrap"] +
            " " +
            styles["grid-item"] +
            " " +
            styles[title]
          }
        >
          <div
            key={itemTitle + Math.random()}
            className={`${styles[title + "-title"]}
               ${styles["grid-item-title"]} 
               ${styles["grid-item-child"]}`}
          >
            {itemTitle}
          </div>
          <div
            key={key + Math.random()}
            className={` ${styles[title + "-text"]}
            ${styles["grid-item-text"]} 
            ${styles["grid-item-child"]}`}
            contentEditable={inEditMode}
            ref={(elm) => {
              //  Moving this out of processing to handle after elements added.
              setTimeout(() => {
                if (elm) editedTools.current.edits[title] = elm.innerText;
              }, 0);
            }}
            onBlur={(e) => {
              onTextChangeHandler(e, title);
            }}
          >
            {value}
          </div>
        </div>
      );
    }

    return rowHTML;
  }

  // Add the edit button
  const output = (
    <div key={key + "1"} id={key} className="tool-result-container">
      <CardSecondary key={key + "1"} styles={{ position: "relative" }}>
        <CollapsibleElm
          key={key + "2"}
          id={key + "-collapsible-elm"}
          styles={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
          maxHeight="9em"
          inputOrButton="button"
          buttonStyles={{
            margin: "0 auto",
            letterSpacing: "0.25em",
            fontVariant: "small-caps",
            transform: "translateY(100%)",
            transition: "0.7s all ease",
            minWidth: "5em",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
          colorType="primary"
          data=""
          size="small"
          open={inEditMode}
        >
          {AssembleInnerRow(tool, key, Object.keys(toolsMetadata))}
          <div key={key + "3"} className={styles["button-container"]}>
            <PushButton
              key={key + "4"}
              inputOrButton="button"
              styles={{
                gridArea: "edit",
                background: "transparent",
                boxShadow: "none",
                letterSpacing: "0.25em",
                fontVariant: "small-caps",
                transform: editButtonDirection,
                minWidth: editButtonWidth,
                textAlign: "center",
                display: "flex",
                alignItems: "flex-end",
                margin: "auto",
                padding: "0.75em",
              }}
              id={key + "edit-button"}
              colorType="secondary"
              value="session-record"
              data=""
              size="small"
              onClick={rowEditButtonHandler}
            >
              {inEditMode ? "Cancel Edit" : "Edit"}
            </PushButton>
            {inEditMode && (
              <>
                <PushButton
                  key={Math.random(100)}
                  inputOrButton="input"
                  styles={{
                    type: "submit",
                    gridArea: "edit",
                    boxShadow: "none",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    minWidth: "fit-content",
                    margin: "auto",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "110%",
                  }}
                  id={key + "submit-button"}
                  colorType="primary"
                  value="Save Changes"
                  data=""
                  size="small"
                  onClick={rowSaveButtonHandler}
                >
                  Save Changes
                </PushButton>
                <PushButton
                  key={key + "5"}
                  inputOrButton="input"
                  styles={{
                    type: "submit",
                    gridArea: "edit",
                    boxShadow: "none",
                    letterSpacing: "0.25em",
                    fontVariant: "small-caps",
                    minWidth: "fit-content",
                    margin: "auto",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "flex-end",
                    fontSize: "80%",
                  }}
                  id={key + "delete-button"}
                  colorType="secondary"
                  value="Delete Tool"
                  data=""
                  size="small"
                  onClick={deleteToolButtonHandler}
                >
                  Delete Tool
                </PushButton>
                <div key={key + "6"} className={styles["tool-id"]}>
                  <p key={Math.random(100)}>
                    Tool ID:
                    <br key={Math.random(100)} />
                    {key}
                  </p>
                </div>
              </>
            )}
          </div>
        </CollapsibleElm>
      </CardSecondary>
      {inEditMode && (
        <div className={styles["editing-fields-wrap"]}>
          <AddAToolForm
            key={key + "7"}
            saveOrUpdateData="update"
            formData={groomedFormInputData}
            removeAddMoreButton={true}
            styles={{ minHeight: "100%" }}
            buttonStyles={{
              height: "3em",
              width: "100%",
              left: "0",
              background: "var( --iq-color-background-warm-gradient)",
              fontSize: "24px",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              margin: "auto",
              color: "var( --iq-color-accent)",
            }}
          />
        </div>
      )}
    </div>
  );

  if (!deleted) {
    return <div className={styles["tool-row-wrap"]}>{output}</div>;
  } else {
    return (
      <div key={Math.random()} className={styles.deleted}>
        <h3 key={key + "9"}>This tool was deleted (ID: {key})</h3>
      </div>
    );
  }
}

export default ToolRow;
