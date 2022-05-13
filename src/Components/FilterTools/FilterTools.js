import { useEffect } from "react";
import styles from "./FilterTools.module.css";
import { useSelector, useDispatch } from "react-redux";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { hyphenate } from "../../Hooks/utility";
import SetFilteredToolIdList from "../../Hooks/SetFilteredToolList";
import { audioToolDataActions } from "../../store/audioToolDataSlice";

function FilterTools(props) {
  const allToolsData = useSelector((state) => state.toolsData);

  const dispatch = useDispatch();
  const {
    filteredToolsIds,
    currentFilters,
    allTools,
    toolMetadata,
  } = allToolsData;

  useEffect(() => {
    dispatch(audioToolDataActions.clearToolFilterIds);
    const filteredToolIdList = SetFilteredToolIdList(allTools, currentFilters);
    dispatch(audioToolDataActions.setToolFilterIds(filteredToolIdList));
  }, [currentFilters, allTools, dispatch]);
  function levelFilterButtonHandler(e) {
    if (e.target.checked) {
      dispatch(
        audioToolDataActions.addToToolFilters({
          type: "level",
          value: e.target.value.replace(/-/g, ""),
        })
      );
      SetFilteredToolIdList();
    } else {
      dispatch(
        audioToolDataActions.removeFromToolFilters({
          type: "level",
          value: e.target.value.replace(/-/g, ""),
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

  return <div>Filter</div>;
  return (
    <div id="tool-filter" className={styles.outerwrap}>
      <h2 class="section-title">Tool Filter</h2>
      <div className={styles["slide-button-wrap"]}>
        {Object.key(toolsMetadata).map((filterName) => {
          <div className={styles["slide-button-inner-wrap"]}>
            <h3 className={styles["slide-button-inner-wrap-title"]}>
              {filterName}
            </h3>
            return (
            <SlideButton
              key={currentFilters[filterName]}
              label={currentFilters[filterName]}
              onClick={levelFilterButtonHandler}
              checked={currentFilters[filterName].includes(level)}
            />
            );
          </div>;
        })}

        <div className={styles["slide-button-inner-wrap"]}>
          <h3 className={styles["slide-button-inner-wrap-title"]}>Topics</h3>
          {toolMetadata.topic.map((topic) => {
            const topicNonHyphen = topic;
            if (topic === "noncoding") {
              topic = hyphenate(topic, 3, "-");
            }

            return (
              <SlideButton
                key={topic}
                label={topic}
                onClick={topicFilterButtonHandler}
                checked={currentFilters.topic.includes(topicNonHyphen)}
              />
            );
          })}
        </div>
        <div className={styles["slide-button-inner-wrap"]}>
          <h3 className={styles["slide-button-inner-wrap-title"]}>Tags</h3>
          {toolMetadata.tags.map((tag) => {
            return (
              <SlideButton
                key={tag}
                label={tag}
                onClick={tagsFilterButtonHandler}
                checked={currentFilters.tags.includes(tag)}
              />
            );
          })}
        </div>
      </div>
      <div className={styles["output-container"]}>
        <p>
          Of the {toolMetadata._id.length} tools, you have selected{" "}
          {filteredToolsIds.length} in {currentFilters.toString()}.
        </p>
      </div>
    </div>
  );
}

export default FilterTools;
