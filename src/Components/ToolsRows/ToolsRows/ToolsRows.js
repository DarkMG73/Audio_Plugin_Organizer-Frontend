import { useState, Fragment } from "react";
import styles from "./ToolsRows.module.css";
import ToolRow from "../ToolRow/ToolRow";
import AudioPluginSelector from "../../AudioPluginSelector/AudioPluginSelector";
import Card from "../../../UI/Cards/Card/Card";
import BarLoader from "../../../UI/Loaders/BarLoader/BarLoader";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";

function ToolsRows(props) {
  const allTools = props.allTools;
  const toolsToDisplay = props.toolsToDisplay;
  const toolsToDisplayCategories = [];
  const toolsToDisplayRows = {};
  const [openAll, setOpenAll] = useState(false);
  const filteredToolsIds = props.filteredToolsIds;

  for (const k in toolsToDisplay) {
    if (k !== "stats") {
      toolsToDisplayCategories.push(k);
      toolsToDisplayRows[k] = [];
      for (const key in toolsToDisplay[k]) {
        // Add the row
        toolsToDisplayRows[k].push(key);
      }
    }
  }

  // Set the order as alphabetical
  let sortedAllTools = [];
  for (const key in toolsToDisplay) {
    sortedAllTools.push([key, toolsToDisplay[key].name]);
  }
  // Sort by name
  sortedAllTools.sort(function (a, b) {
    return a[1].toLowerCase().localeCompare(b[1].toLowerCase());
  });

  const openAllButtonHandler = (e) => {
    setOpenAll(!openAll);
  };

  return (
    <>
      <div
        key="open-all-button-wrap"
        className={styles["open-all-button-wrap"]}
      >
        {" "}
        <PushButton
          key={"open-all-button"}
          inputOrButton="button"
          styles={{
            width: "75%",
            letterSpacing: "var(--iq-spacing-subheading)",
            fontVariant: "small-caps",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            padding: "0.75em 1.5em",
            transform: "none",
            borderRadius: "50px",
          }}
          id={"open-all-button"}
          colorType="secondary"
          value="Open All"
          data=""
          size=""
          onClick={openAllButtonHandler}
        >
          Expand All Tools
        </PushButton>
      </div>
      <div key="toolsrows-1" className={styles["tools-rows-list-container"]}>
        <h3
          key="toolsrowsList-3"
          className={`"section-subtitle" ${styles["section-subtitle"]}`}
        >
          There are{" "}
          {filteredToolsIds.length > 0
            ? filteredToolsIds.length
            : Object.keys(allTools).length}{" "}
          tools shown of the total {Object.keys(allTools).length}.
        </h3>
        {!toolsToDisplay.hasOwnProperty("error") ? (
          sortedAllTools.map((tool) => {
            const key = tool[0];
            return (
              <ToolRow
                key={key}
                tool={toolsToDisplay[key]}
                keyOne={key}
                openAll={openAll}
              />
            );
          })
        ) : (
          <Card
            key="toolsrows-2"
            styles={{ borderRadius: "30px", padding: "3em" }}
          >
            {!props.showLoader && (
              <Fragment>
                <h3>{toolsToDisplay.error["Audio & Video Plugin Status"]}</h3>
                <p>{toolsToDisplay.error["What you can do"]}</p>{" "}
                <AudioPluginSelector />
              </Fragment>
            )}
            {props.showLoader && <BarLoader />}
          </Card>
        )}
      </div>
    </>
  );
}

export default ToolsRows;
