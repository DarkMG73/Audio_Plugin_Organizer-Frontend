import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ToolsRowsList.module.css";
import ToolsRows from "../ToolsRows/ToolsRows";
import CollapsibleElm from "../../../UI/CollapsibleElm/CollapsibleElm";
import PushButton from "../../../UI//Buttons/PushButton/PushButton";
import { audioToolDataActions } from "../../../store/audioToolDataSlice";
import LoginStatus from "../../User/LoginStatus/LoginStatus";

function ToolsRowsList(props) {
  const {
    allTools,
    filteredToolsIds,
    currentFilters,
    goToToolRows,
  } = useSelector((state) => state.toolsData);

  const user = useSelector((state) => state.auth.user);
  const toolListRef = useRef();
  const dispatch = useDispatch;

  useEffect(() => {
    if (goToToolRows > 0)
      toolListRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [goToToolRows]);

  // useEffect(() => {
  //   props.setScrollToToolsRowsList(sessionResultsBox);
  // }, []);

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

  const addAToolButtonHandler = () => {
    dispatch(audioToolDataActions.goToAddATool());
  };

  return (
    <div
      key="toolsrowsList-1"
      id="tool-row-list"
      className={styles["tool-row-list"]}
    >
      <div className={styles["header-container"]}>
        <h2 key="home" className="section-title">
          Production Tool List
        </h2>
      </div>
      <div className={styles["add-a-tool-wrap"]}>
        <LoginStatus
          horizontalDisplay={false}
          showAddAToolButton={true}
          signUpButtonStyles={{
            background:
              "linear-gradient(rgb(255 135 0) 37%, rgba(0, 0, 0, 1) 100%)",
            color: "var(--iq-color-foreground)",
            textShadow: "0 0 3px wheat",
            fontSize: "1em",
          }}
        />
      </div>{" "}
      <div
        key={"tool-list-wrap-key"}
        className={styles["tool-list-wrap"]}
        ref={toolListRef}
      >
        <ToolsRows
          key="toolsrowsList-4"
          allTools={allTools}
          toolsToDisplay={toolsToDisplay}
          filteredToolsIds={filteredToolsIds}
          showLoader={props.showLoader}
          noQuestionsMessage={noQuestionsMessage}
        />
      </div>
    </div>
  );
}

export default ToolsRowsList;
