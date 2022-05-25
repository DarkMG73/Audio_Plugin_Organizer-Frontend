import { useEffect } from "react";
import styles from "./FilterTools.module.css";
import { useSelector, useDispatch } from "react-redux";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { escapeHtml } from "../../Hooks/utility";
import SetFilteredToolIdList from "../../Hooks/SetFilteredToolList";
import { audioToolDataActions } from "../../store/audioToolDataSlice";

function FilterTools(props) {
  const allToolsData = useSelector((state) => state.toolsData);

  const dispatch = useDispatch();
  const {
    filteredToolsIds,
    currentFilters,
    allTools,
    toolsMetadata,
  } = allToolsData;

  useEffect(() => {
    console.log(
      "%c --> %cline:24%ccurrentFilters",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
      currentFilters
    );
    dispatch(audioToolDataActions.clearToolFilterIds);
    const filteredToolIdList = SetFilteredToolIdList(allTools, currentFilters);
    dispatch(audioToolDataActions.setToolFilterIds(filteredToolIdList));
  }, [currentFilters, allTools, dispatch]);

  function filterButtonHandler(e) {
    const value = escapeHtml(e.target.value);
    if (e.target.checked) {
      dispatch(
        audioToolDataActions.addToToolFilters({
          type: e.target.dataset.data,
          value: value,
        })
      );
      SetFilteredToolIdList();
    } else {
      dispatch(
        audioToolDataActions.removeFromToolFilters({
          type: e.target.dataset.data,
          value: value,
        })
      );
    }

    // FilterTools(allToolsData);
  }

  function topicFilterButtonHandler(e) {
    if (e.target.checked) {
      dispatch(
        audioToolDataActions.addToToolFilters({
          type: "topic",
          value: e.target.value.replace(/-/g, ""),
        })
      );
    } else {
      dispatch(
        audioToolDataActions.removeFromToolFilters({
          type: "topic",
          value: e.target.value.replace(/-/g, ""),
        })
      );
    }
    // FilterTools(allToolsData);
  }

  function tagsFilterButtonHandler(e) {
    if (e.target.checked) {
      dispatch(
        audioToolDataActions.addToToolFilters({
          type: "tags",
          value: e.target.value.replace(/-/g, ""),
        })
      );
    } else {
      dispatch(
        audioToolDataActions.removeFromToolFilters({
          type: "tags",
          value: e.target.value.replace(/-/g, ""),
        })
      );
    }
    // FilterTools(allToolsData);
  }

  // return <div>Filter</div>;
  return (
    <div id="tool-filter" className={styles.outerwrap}>
      <h2 class="section-title">Tool Filter</h2>
      <div className={styles["slide-button-wrap"]}>
        {Object.keys(currentFilters).map((topic) => {
          if (topic === "name") return;
          return (
            <div className={styles["slide-button-inner-wrap"]}>
              <h3 className={styles["slide-button-inner-wrap-title"]}>
                {topic}
              </h3>
              {toolsMetadata[topic].map((entry) => {
                return (
                  <SlideButton
                    key={currentFilters[topic + " " + entry]}
                    label={entry}
                    onClick={filterButtonHandler}
                    checked={currentFilters[topic].includes(entry)}
                    data={topic}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      <div className={styles["output-container"]}>
        <p>
          Of the {toolsMetadata._id.length} tools, you have selected{" "}
          {filteredToolsIds.length} in {currentFilters.toString()}.
        </p>
      </div>
    </div>
  );
}

export default FilterTools;
