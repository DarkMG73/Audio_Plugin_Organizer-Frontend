import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./ToolsRowsList.module.css";
import ToolsRows from "../ToolsRows/ToolsRows";
import CollapsibleElm from "../../../UI/CollapsibleElm/CollapsibleElm";

function ToolsRowsList(props) {
  const { allTools, filteredToolsIds, currentFilters } = useSelector(
    (state) => state.toolsData
  );
  const user = useSelector((state) => state.auth.user);
  // const sessionResultsBox = useRef();

  // useEffect(() => {
  //   props.setScrollToToolsRowsList(sessionResultsBox);
  // }, []);
  useEffect(() => {
    console.log("_______________");
    console.log(
      "%c --> %cline:19%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
      user
    );
    console.log(
      "%c --> %cline:8%callTools",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
      allTools
    );
    console.log("/_______________");
  }, [user]);

  let toolsToDisplay = { ...allTools };

  if (filteredToolsIds.length > 0) {
    toolsToDisplay = {};
    filteredToolsIds.forEach((id) => {
      toolsToDisplay[id] = allTools[id];
    });
  }

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
    <div
      key="toolsrowsList-1"
      id="tool-row-list"
      className={styles["tool-row-list"]}
    >
      <h2 key="toolsrowsList-2" className="section-title">
        Plugins and other Tools
      </h2>
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

      <ToolsRows
        key="toolsrowsList-4"
        allTools={toolsToDisplay}
        showLoader={props.showLoader}
        noQuestionsMessage={noQuestionsMessage}
      />
    </div>
  );
}

export default ToolsRowsList;
