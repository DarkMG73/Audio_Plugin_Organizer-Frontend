import styles from "./ToolsRows.module.css";
import ToolRow from "../ToolRow/ToolRow";
import Card from "../../../UI/Cards/Card/Card";
import BarLoader from "../../../UI/Loaders/BarLoader/BarLoader";

function ToolsRows(props) {
  const allTools = props.allTools;
  const allToolsCategories = [];
  const allToolsRows = {};
  let allToolsCount = 0;

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

  console.log(
    "%c --> %cline:12%callTools",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px",
    allTools
  );
  console.log(
    "%c --> %cline:36%callToolsRows",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
    allToolsRows
  );

  return (
    <div className={styles["tools-rows-list-container"]}>
      {allToolsCount > 0 ? (
        Object.keys(allTools).map((key) => {
          return <ToolRow tool={allTools[key]} keyOne={key} />;
        })
      ) : (
        <Card styles={{ borderRadius: "30px", padding: "3em" }}>
          {!props.showLoader && props.noQuestionsMessage}
          {props.showLoader && <BarLoader />}
        </Card>
      )}
    </div>
  );
}

export default ToolsRows;
