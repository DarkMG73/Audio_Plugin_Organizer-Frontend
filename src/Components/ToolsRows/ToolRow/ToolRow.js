import { useSelector } from "react-redux";
import styles from "./ToolRow.module.css";
import { useState, useRef, useEffect } from "react";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import { isValidHttpUrl, groomFormOutput } from "../../../Hooks/utility";
import CardSecondary from "../../../UI/Cards/CardSecondary/CardSecondary";
import CollapsibleElm from "../../../UI/CollapsibleElm/CollapsibleElm";
import AddAToolForm from "../..//AddATool/AddAToolForm";
// import image from "../../../assets/images/Waves_WNS-Noise-Suppressor.png";
// import { addDocToDB, deleteDocFromDb } from "../../storage/firebase.config";
import {
  updateAPlugin as addDocToDB,
  deleteAPlugin as deleteDocFromDb,
} from "../../../storage/audioToolsDB";
import GetPluginFormInputsWithOptions from "../../../Hooks/GetPluginFormInputsWithOptions";
import useToolDisplayOrder from "../../../Hooks/useToolDisplayOrder";
import placeholderImage from "../../../assets/images/product-photo-placeholder-5.png";

function ToolRow(props) {
  const { toolsMetadata, toolsSchema } = useSelector(
    (state) => state.toolsData
  );
  const [inEditMode, setInEditMode] = useState(false);
  const [toolRowOrder, setToolRowOrder] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const toolDisplayOrder = useToolDisplayOrder;
  const [formInputData, setFormInputData] = useState(false);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const order = toolDisplayOrder(toolsSchema);
    setToolRowOrder(order);
    const res = GetPluginFormInputsWithOptions(toolsSchema, toolsMetadata);
    setFormInputData(res);
  }, []);
  const editedTools = useRef({ edits: {} });
  const tool = props.tool;
  const key = props.keyOne;
  const k = props.keyOne;
  // editButtonDirection to be used with future edit mode visual manipulations
  const editButtonDirection = inEditMode ? "" : "";
  const editButtonWidth = inEditMode ? "max-content" : "5em";
  let groomedFormInputData;

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    const toolFormDataArray = [tool];
    if (formInputData)
      groomedFormInputData = groomFormOutput(
        toolFormDataArray,
        formInputData,
        toolRowOrder
      );
  }, [tool, formInputData, toolRowOrder]);

  ////////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  const toolFormDataArray = [tool];
  if (formInputData)
    groomedFormInputData = groomFormOutput(
      toolFormDataArray,
      formInputData,
      toolRowOrder
    );

  ////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////
  const rowEditButtonHandler = (e, setElmOpen) => {
    setInEditMode(!inEditMode);
  };

  const rowSaveButtonHandler = (e) => {
    // Use tempKey instead of key when in dev
    // const tempKey = "TESTTEST";
    // console.log(
    //   "%c --> %cline:75%cuser",
    //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //   "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
    //   user
    // );
    // addDocToDB(key, editedTools.current.edits, user).then((res) => {
    //   setInEditMode(!inEditMode);
    //   return res;
    // });
  };

  const deleteToolButtonHandler = (e) => {
    // Use tempKey instead of key when in dev
    // const tempKey = "TESTTEST";
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tool (ID: " +
        key +
        ")? This can not be undone. You might want to use the CVS download at the bottom of the page to backup your production tools first in case you want to restore this list as it is right now. Clicking CANCEL returns to the page as-is and clicking CONFIRM will delete this tool."
    );
    if (confirmDelete) {
      deleteDocFromDb(key, user)
        .then((res) => {
          if (res.status < 299) {
            setDeleted(true);
          } else {
            alert(
              "There was an error when trying to delete this production tool. Here is the message from the server: " +
                res.response.data.message +
                ". Be sure you have an internet connections and try again. If all else fails, please notify the administrator."
            );
          }
        })
        .catch((err) => {
          alert(
            "There was an error when trying to delete this entry. Be sure you have an internet connections and try again. If all else fails, please notify the administrator."
          );
        });
    }
  };

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  function AssembleInnerRow(tool, key, passedCategoryNamesArray) {
    const categoryNamesArray = passedCategoryNamesArray
      ? passedCategoryNamesArray
      : Object.keys(toolsMetadata);
    let rowHTML = [];

    function onTextChangeHandler(e, title) {
      editedTools.current.edits[title] = e.target.innerText;
    }
    categoryNamesArray.forEach((title) => {
      let value;
      if (Object.keys(tool).includes(title)) {
        value = tool[title];
        if (Array.isArray(value)) {
          value = (
            <ul
              key={value + 10}
              className={styles[title + "list"] + " " + styles.list}
            >
              {value.map((item) => (
                <li key={item + 11}>{item}</li>
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

      if (isValidLink || title === "photoURL" || title === "productURL") {
        if (title === "photoURL" && isValidLink) {
          // value = <img key={title + value} src={value} alt={title} />;
          value = <img key={title + value} src={value} alt={title} />;
        } else if (title === "photoURL" && value !== undefined) {
          const photoSrc =
            value !== "" ? "./assets/images/" + value : placeholderImage;
          value = (
            <img
              key={title + value}
              src={photoSrc}
              // src={image}
              alt={title}
            />
          );
        } else if (title === "productURL") {
          // value = <img key={title + value} src={value} alt={title} />;
          value = (
            <a
              key={title + value}
              href={value}
              alt={title}
              target="_blank"
              rel="noreferrer"
            >
              Webpage {"\u2B95"}
            </a>
          );
        } else {
          value = (
            <a
              key={title + value}
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

      let favoriteClass = "";
      if (title === "favorite") {
        if (
          (value.constructor === Boolean && value) ||
          value.toLowercase == "true" ||
          value == "True"
        ) {
          favoriteClass = "favorite-true";
        } else {
          favoriteClass = "favorite-false";
        }
      }
      if (title === "oversampling") {
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
            styles[title] +
            " " +
            styles[favoriteClass]
          }
        >
          <div
            key={itemTitle + value}
            className={`${styles[title + "-title"]}
               ${styles["grid-item-title"]} 
               ${styles["grid-item-child"]} `}
          >
            {itemTitle}
          </div>
          <CollapsibleElm
            key={key + "2"}
            id={key + "-collapsible-elm"}
            styles={{
              position: "relative",
            }}
            maxHeight="10em"
            inputOrButton="button"
            buttonStyles={{
              margin: "0 auto",
              fontVariant: "small-caps",
              transform: "translateY(100%)",
              transition: "0.7s all ease",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              padding: "0",
            }}
            colorType="secondary"
            data=""
            size="small"
          >
            <div
              key={key + value}
              className={` ${styles[title + "-text"]}
            ${styles["grid-item-text"]} 
            ${styles["grid-item-child"]}`}
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
          </CollapsibleElm>
        </div>
      );
    });

    return rowHTML;
  }

  // Add the edit button
  const output = (
    <div key={key + "1"} id={key} className="tool-result-container">
      <CardSecondary
        key={key + "1"}
        styles={{ position: "relative", minWidth: "214px" }}
      >
        <CollapsibleElm
          key={key + "2"}
          id={key + "-collapsible-elm"}
          styles={{
            position: "relative",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "baseline",
            minHeight: "21em",
          }}
          maxHeight="21em"
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
          open={props.openAll}
        >
          {AssembleInnerRow(tool, key, toolRowOrder)}
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
                  key={"toolrow" + key + "4"}
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
                  <p key={"toolrow-button-p" + key}>
                    Tool ID:
                    <br key={"toolrow-button-br" + key} />
                    {key}
                  </p>
                </div>
              </>
            )}
          </div>
        </CollapsibleElm>
      </CardSecondary>
      {inEditMode && (
        <>
          <div className={styles.overlay}></div>
          <div className={styles["editing-fields-wrap"]}>
            <AddAToolForm
              key={key + "7"}
              saveOrUpdateData="update"
              formData={groomedFormInputData}
              removeAddMoreButton={true}
              deleteToolButtonHandler={deleteToolButtonHandler}
              setFormParentOpen={setInEditMode}
              styles={{ minHeight: "100%" }}
              buttonStyles={{
                position: "relative",
                height: "3em",
                width: "100%",
                left: "0",
                background: "var( --iq-color-background-warm-gradient)",
                fontSize: "24px",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                margin: "auto",
                color: "var( --iq-color-foreground)",
                borderRadius: "50px ",
                boxShadow: "0 0 20px -5px var(--iq-color-accent)",
                textShadow: "0 0 3px var(--iq-color-accent)",
              }}
              submitButtonStyles={{
                top: "-14px",
                width: "80%",
                background: "var(--iq-color-accent-gradient)",
                borderRadius: "50px",
                height: "3em",
                font: "var(--iq-font-heading-2)",
                zIndex: "1",
              }}
              deleteButtonStyles={{
                flexBasis: " 25%",
                flexGrow: "1",
                top: "-14px",
                width: "90%",
                maxWidth: " 40%",
                fontSize: "1em",
                color: "var( --iq-color-background-warm",
                background: "var( --iq-color-foreground-gradient)",
              }}
              cancelButtonStyles={{
                position: "fixed",
                top: "30px",
                left: "calc(100% - 121px)",
                maxWidth: "fit-content",
                zIndex: "100",
                color: "var(--iq-color-background-warm)",
                padding: "0.25em 0",
                borderRadius: "50%",
                fontSize: "12px",
                transform: "scale(1.25, 1) ",
                fontWeight: "900",
                letterSpacing: "0.25em",
                textShadow:
                  "rgb(255 135 0) 0px 0px 2px, rgb(0 0 0) 2px 2px 4px, rgb(255 135 0) 0px 0px 15px, rgb(255 135 0) 0px 0px 30px",
                transition: "all 0.2s ease",
              }}
            />
          </div>
        </>
      )}
    </div>
  );

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  if (!deleted) {
    return (
      <div
        className={`${styles["tool-row-wrap"]} ${
          styles["status-" + tool.status]
        }`}
      >
        {output}
      </div>
    );
  } else {
    return (
      <div key={"deleted" + key} className={styles.deleted}>
        <h3 key={key + "9"}>This tool was deleted (ID: {key})</h3>
      </div>
    );
  }
}

export default ToolRow;
