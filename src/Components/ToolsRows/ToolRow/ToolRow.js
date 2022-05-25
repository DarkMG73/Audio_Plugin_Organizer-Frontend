import { useSelector } from "react-redux";
import styles from "./ToolRow.module.css";
import { useState, useRef, Fragment, useEffect } from "react";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import { isValidHttpUrl, groomFormOutput } from "../../../Hooks/utility";
import CardSecondary from "../../../UI/Cards/CardSecondary/CardSecondary";
import CollapsibleElm from "../../../UI/CollapsibleElm/CollapsibleElm";
import AddAQuestionForm from "../..//AddATool/AddAToolForm";
// import { addDocToDB, deleteDocFromDb } from "../../storage/firebase.config";
import {
  updateAPlugin as addDocToDB,
  deleteAPlugin as deleteDocFromDb,
} from "../../../Hooks/DbInteractions";

function ToolRow(props) {
  const toolsMetadata = useSelector((state) => state.toolsData.toolsMetadata);
  const [inEditMode, setInEditMode] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const editedTools = useRef({ edits: {} });
  const tool = props.tool;
  console.log(
    "%c *************** %cline:17%ctool",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
    tool
  );
  const key = props.keyOne;
  const k = props.keyOne;
  // editButtonDirection to be used with future edit mode visual manipulations
  const editButtonDirection = inEditMode ? "" : "";
  const editButtonWidth = inEditMode ? "max-content" : "5em";
  let formInputData;
  // useEffect(() => {
  //   console.log(
  //     "%c --> %cline:35%ctool",
  //     "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
  //     "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
  //     "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
  //     tool
  //   );
  //   formInputData = groomFormOutput(tool);
  // }, [tool]);

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
      console.log(
        "%c --> %cline:62%ctitle",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
        title
      );

      let value;
      if (Object.keys(tool).includes(title)) {
        value = tool[title];
        if (Array.isArray(value)) {
          value = (
            <ul className={styles[title + "list"] + " " + styles.list}>
              {value.map((item) => (
                <li>{item}</li>
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
      console.log(
        "%c --> %cline:92%cisValidLink",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
        isValidLink
      );

      console.log(
        "%c --> %cline:95%ctitle",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
        title
      );
      if (isValidLink) {
        console.log(
          "%c --> %cline:95%c   IN  ",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px"
        );
        if (title === "photoURL") {
          value = <img src={value} alt={title} />;
        } else {
          value = (
            <a href={value} alt={title} target="_blank">
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
          className={styles[title + "-wrap"] + " " + styles["grid-item"]}
        >
          <div
            className={`${styles[title]} ${styles[title + "-title"]}
               ${styles["grid-item-title"]} 
               ${styles["grid-item-child"]}`}
          >
            {itemTitle}
          </div>
          <div
            className={`${styles[title]} ${styles[title + "-text"]}
            ${styles["grid-item-text"]} 
            ${styles["grid-item-child"]}`}
            contentEditable={inEditMode}
            ref={(elm) => {
              //  Moving this out of processing to handle after elements added.
              setTimeout(() => {
                editedTools.current.edits[title] = elm.innerText;
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
    <div key={key} id={key} class="tool-result-container">
      <CardSecondary>
        <CollapsibleElm
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
          <div className={styles["button-container"]}>
            <PushButton
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
                <div className={styles["tool-id"]}>
                  <p>
                    Tool ID:
                    <br />
                    {key}
                  </p>
                </div>
              </>
            )}
          </div>
        </CollapsibleElm>
      </CardSecondary>
    </div>
  );

  if (!deleted) {
    return (
      <Fragment>
        {!inEditMode && output}
        {inEditMode && <AddAQuestionForm formData={formInputData} />}
      </Fragment>
    );
  } else {
    return (
      <div className={styles.deleted}>
        <h3>This tool was deleted (ID: {key})</h3>
      </div>
    );
  }
}

export default ToolRow;
