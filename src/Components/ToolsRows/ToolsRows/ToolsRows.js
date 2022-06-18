import { useState, Fragment } from "react";
import styles from "./ToolsRows.module.css";
import ToolRow from "../ToolRow/ToolRow";
import Card from "../../../UI/Cards/Card/Card";
import BarLoader from "../../../UI/Loaders/BarLoader/BarLoader";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";

function ToolsRows(props) {
  const allTools = props.allTools;
  const allToolsCategories = [];
  const allToolsRows = {};
  let allToolsCount = 0;
  const [openAll, setOpenAll] = useState(false);

  for (const k in allTools) {
    if (k !== "stats") {
      allToolsCategories.push(k);
      allToolsRows[k] = [];
      for (const key in allTools[k]) {
        // Add the row
        allToolsRows[k].push(key);
        allToolsCount++;
      }
    }
  }

  const openAllButtonHandler = (e) => {
    setOpenAll(!openAll);
  };

  return (
    <>
      <div
        key="open-all-button-wrap"
        className={styles["open-all-button-wrap"]}
      >
        <PushButton
          key={"open-all-button"}
          inputOrButton="button"
          styles={{
            width: "100%",
            letterSpacing: "var(--iq-spacing-subheading)",
            fontVariant: "small-caps",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            margin: "auto",
            padding: "0.75em",
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
          Open All
        </PushButton>
      </div>
      <div key="toolsrows-1" className={styles["tools-rows-list-container"]}>
        {!allTools.hasOwnProperty("error") ? (
          Object.keys(allTools).map((key) => {
            return (
              <ToolRow
                key={key}
                tool={allTools[key]}
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
                <h3>{allTools.error["Audio & Video Plugin Status"]}</h3>
                <p>{allTools.error["What you can do"]}</p>
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
