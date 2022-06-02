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

  return (
    <div key="toolsrows-1" className={styles["tools-rows-list-container"]}>
      {allToolsCount > 0 ? (
        Object.keys(allTools).map((key) => {
          return <ToolRow key={key} tool={allTools[key]} keyOne={key} />;
        })
      ) : (
        <Card
          key="toolsrows-2"
          styles={{ borderRadius: "30px", padding: "3em" }}
        >
          {!props.showLoader && props.noQuestionsMessage}
          {props.showLoader && <BarLoader />}
        </Card>
      )}
    </div>
  );
}

export default ToolsRows;
