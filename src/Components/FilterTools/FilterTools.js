import { useEffect, Fragment } from "react";
import styles from "./FilterTools.module.css";
import { useSelector, useDispatch } from "react-redux";
import SlideButton from "../../UI/Buttons/SlideButton/SlideButton";
import { escapeHtml } from "../../Hooks/utility";
import SetFilteredToolIdList from "../../Hooks/SetFilteredToolList";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";

function FilterTools(props) {
  const allToolsData = useSelector((state) => state.toolsData);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const { currentFilters, allTools, toolsMetadata } = allToolsData;

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    dispatch(audioToolDataActions.clearToolFilterIds);
    const filteredToolIdList = SetFilteredToolIdList(allTools, currentFilters);

    dispatch(audioToolDataActions.setToolFilterIds(filteredToolIdList));
  }, [currentFilters, allTools, dispatch]);

  useEffect(() => {
    dispatch(audioToolDataActions.clearToolFilterIds);
  }, [user]);

  ////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////
  function filterButtonHandler(e) {
    const value = escapeHtml(e.target.value);

    if (e.target.dataset.data === "rating" && value !== "") {
      // Only one rating can be selected at a time
      dispatch(
        audioToolDataActions.removeFromToolFilters({
          type: e.target.dataset.data,
          value: currentFilters.rating,
        })
      );

      dispatch(
        audioToolDataActions.addToToolFilters({
          type: e.target.dataset.data,
          value: parseInt(value),
        })
      );

      SetFilteredToolIdList();
    } else if (
      e.target.dataset.data === "oversampling" ||
      e.target.dataset.data === "favorite"
    ) {
      // Only one boolean selection can be selected at a time
      dispatch(
        audioToolDataActions.removeFromToolFilters({
          type: e.target.dataset.data,
          value: currentFilters[e.target.dataset.data],
        })
      );
      if (e.target.checked) {
        dispatch(
          audioToolDataActions.addToToolFilters({
            type: e.target.dataset.data,
            value: true,
          })
        );
      }

      SetFilteredToolIdList();
    } else if (e.target.checked) {
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

    dispatch(audioToolDataActions.goToToolRows());
    // FilterTools(allToolsData);
  }

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  return (
    <div key={"tool-filter-1"} id="tool-filter" className={styles.outerwrap}>
      <h2 key={"tool-filter-2"} className="section-title">
        Plugin Filters
      </h2>{" "}
      {allTools && !allTools.hasOwnProperty("error") && (
        <Fragment>
          <div key={"tool-filter-3"} className={styles["slide-button-wrap"]}>
            {currentFilters &&
              Object.keys(currentFilters).map((topic) => {
                if (
                  topic === "name" ||
                  topic.includes("URL") ||
                  topic === "notes"
                )
                  return;

                if (topic === "rating") {
                  return (
                    <div
                      key={topic + "1"}
                      className={
                        styles["slide-button-inner-wrap"] +
                        " " +
                        styles[topic + "-slide-button-inner-wrap"]
                      }
                    >
                      <h3
                        key={topic + "2"}
                        className={styles["slide-button-inner-wrap-title"]}
                      >
                        {topic}
                      </h3>
                      {currentFilters[topic] > 0 && (
                        <span
                          key={"tool-filter-1" + topic}
                          className={styles["option-selected"]}
                        ></span>
                      )}
                      <select
                        key={"tool-filter-2" + topic}
                        onChange={filterButtonHandler}
                        data-data={topic}
                      >
                        <option
                          key={topic + "3"}
                          type="radio"
                          className={
                            ["radio-button"] +
                            " " +
                            styles[topic + "-radio-button"]
                          }
                          value=""
                        ></option>
                        {toolsMetadata[topic].map((entry) => {
                          return (
                            <Fragment key={entry + "fragment 1"}>
                              <option
                                key={entry + "3"}
                                selected={currentFilters[topic].includes(entry)}
                                type="radio"
                                className={
                                  ["radio-button"] +
                                  " " +
                                  styles[topic + "-radio-button"]
                                }
                                value={entry}
                              >
                                {entry}
                              </option>
                            </Fragment>
                          );
                        })}
                      </select>
                    </div>
                  );
                }
                if (topic === "oversampling" || topic === "favorite") {
                  return (
                    <div
                      key={topic + "10"}
                      className={
                        styles["slide-button-inner-wrap"] +
                        " " +
                        styles[topic + "-slide-button-inner-wrap"]
                      }
                    >
                      <h3
                        key={topic + "20"}
                        className={styles["slide-button-inner-wrap-title"]}
                      >
                        {topic === "oversampling" ? "O-sample" : topic}
                      </h3>
                      <form key={"tool-filter-form-1" + topic}>
                        {toolsMetadata[topic].map((entry) => {
                          return (
                            <Fragment key={"tool-filter-form-2" + entry}>
                              <label
                                key={"tool-filter-form-3" + entry}
                                htmlFor={entry.toString()}
                              >
                                {entry}
                              </label>
                              <input
                                key={entry + "3"}
                                checked={currentFilters[topic].length > 0}
                                type="checkbox"
                                className={
                                  ["radio-button"] +
                                  " " +
                                  styles[topic + "-radio-button"]
                                }
                                data-data={topic}
                                onChange={filterButtonHandler}
                                value={entry}
                              />
                              <span
                                key={"tool-filter-form-4" + entry}
                                className={styles["checkmark"]}
                              ></span>
                            </Fragment>
                          );
                        })}
                      </form>
                    </div>
                  );
                }
                return (
                  <CollapsibleElm
                    key={topic + "20"}
                    id={topic + "-collapsible-elm"}
                    styles={{
                      position: "relative",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "space-between",
                    }}
                    maxHeight="20.5em"
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
                      key={topic + "30"}
                      className={styles["slide-button-inner-wrap"]}
                    >
                      <h3
                        key={topic + "40"}
                        className={styles["slide-button-inner-wrap-title"]}
                      >
                        {topic}
                      </h3>
                      {toolsMetadata[topic].map((entry) => {
                        return (
                          <SlideButton
                            key={entry + "30"}
                            label={entry}
                            onClick={filterButtonHandler}
                            checked={currentFilters[topic].includes(entry)}
                            data={topic}
                            user={user.email}
                            slideButtonTitleStyles={{ textAlign: "right" }}
                          />
                        );
                      })}
                    </div>
                  </CollapsibleElm>
                );
              })}
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default FilterTools;
