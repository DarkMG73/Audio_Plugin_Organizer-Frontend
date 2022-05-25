import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./ToolsRowsList.module.css";
import ToolsRows from "../ToolsRows/ToolsRows";
import CollapsibleElm from "../../../UI/CollapsibleElm/CollapsibleElm";

function ToolsRowsList(props) {
  const { allTools, filteredToolsIds, currentFilters } = useSelector(
    (state) => state.toolsData
  );
  // const sessionResultsBox = useRef();

  // useEffect(() => {
  //   props.setScrollToToolsRowsList(sessionResultsBox);
  // }, []);

  let toolsToDisplay = { ...allTools };

  if (filteredToolsIds.length > 0) {
    console.log(
      "%c --> %cline:18%cfilteredToolsIds",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
      filteredToolsIds
    );
    toolsToDisplay = {};
    filteredToolsIds.forEach((id) => {
      toolsToDisplay[id] = allTools[id];
    });
  }

  console.log(
    "%c --> %cline:17%ctoolsToDisplay",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
    toolsToDisplay
  );

  let noQuestionsMessage = (
    <p>
      You do not have a history yet on this browser. Answer a few questions and
      they will be saved tot his browser's memory. This history will remain
      available until you decide to erase it.
    </p>
  );

  let filtersAreSet = false;
  if (filteredToolsIds.length <= 0) {
    Object.keys(currentFilters).forEach((filterName) => {
      if (currentFilters[filterName].length > 0) {
        toolsToDisplay = {};
        filtersAreSet = true;
      }
    });
    if (filtersAreSet) {
      noQuestionsMessage = (
        <p>
          We can not find any plugins or tools using all of the filters you have
          selected. Try removing some of the filters and we will see if that
          helps.
        </p>
      );
    }
  }
  return (
    <div id="tool-row-list" className={styles.outerwrap}>
      <h2 class="section-title">Plugins and other Tools</h2>

      <ToolsRows
        allTools={toolsToDisplay}
        showLoader={props.showLoader}
        noQuestionsMessage={noQuestionsMessage}
      />
    </div>
  );
}

export default ToolsRowsList;
