import { useEffect } from "react";
import styles from "./FilterTools.module.css";
import { useSelector, useDispatch } from "react-redux";
import SlideButton from "../../UI/Buttons/Slide-Button/Slide-Button";
import { escapeHtml } from "../../Hooks/utility";
import SetFilteredToolIdList from "../../Hooks/SetFilteredToolList";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";

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
      <h2 className="section-title">Tool Filter</h2>
      <div className={styles["slide-button-wrap"]}>
        {Object.keys(currentFilters).map((topic) => {
          if (topic === "name") return;
          return (
            <CollapsibleElm
              key={topic + "2"}
              id={topic + "-collapsible-elm"}
              styles={{
                position: "relative",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
              maxHeight="9em"
              inputOrButton="button"
              buttonStyles={{
                margin: "0 auto",
                letterSpacing: "0.25em",
                fontVariant: "small-caps",
                transform: "translateY(0%)",
                transition: "0.7s all ease",
                minWidth: "100%",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                zIndex: "10",
                boxShadow: "inset 0px -7px 10px -7px white",
                background: "transparent",
                borderRadius: "25px",
                paddingBottom: "1em",
              }}
              colorType="secondary"
              data=""
              size="small"
              open={false}
            >
              <div
                key={topic + "1"}
                className={styles["slide-button-inner-wrap"]}
              >
                <h3
                  key={topic + "2"}
                  className={styles["slide-button-inner-wrap-title"]}
                >
                  {topic}
                </h3>
                {toolsMetadata[topic].map((entry) => {
                  return (
                    <SlideButton
                      key={entry + "3"}
                      label={entry}
                      onClick={filterButtonHandler}
                      checked={currentFilters[topic].includes(entry)}
                      data={topic}
                    />
                  );
                })}
              </div>
            </CollapsibleElm>
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
