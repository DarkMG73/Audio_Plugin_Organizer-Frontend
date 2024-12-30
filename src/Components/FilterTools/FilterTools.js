import { useEffect, Fragment } from "react";
import styles from "./FilterTools.module.css";
import { useSelector, useDispatch } from "react-redux";
import CheckBox from "../../UI/Buttons/CheckBox/CheckBox";
// import SlideButton from '../../UI/Buttons/SlideButton/SlideButton';
import { escapeHtml } from "../../Hooks/utility";
import SetFilteredToolIdList from "../../Hooks/SetFilteredToolList";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";

function FilterTools(props) {
   const allToolsData = useSelector((state) => state.toolsData);
   const user = useSelector((state) => state.auth.user);
   const dispatch = useDispatch();
   const { currentFilters, allTools, toolsMetadata } = allToolsData;
   const doNotFilterList = [
      "name",
      "productURL",
      "photoURL",
      "notes",
      "masterLibraryID",
      "identifier"
   ];
   ////////////////////////////////////////
   /// EFFECTS
   ////////////////////////////////////////
   useEffect(() => {
      dispatch(audioToolDataActions.clearToolFilterIds);
      const filteredToolIdList = SetFilteredToolIdList(
         allTools,
         currentFilters
      );

      dispatch(audioToolDataActions.setToolFilterIds(filteredToolIdList));
   }, [currentFilters, allTools, dispatch]);

   useEffect(() => {
      dispatch(audioToolDataActions.clearToolFilterIds);
   }, [user, dispatch]);

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
               value: currentFilters.rating
            })
         );

         dispatch(
            audioToolDataActions.addToToolFilters({
               type: e.target.dataset.data,
               value: parseInt(value)
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
               value: currentFilters[e.target.dataset.data]
            })
         );
         if (e.target.checked) {
            dispatch(
               audioToolDataActions.addToToolFilters({
                  type: e.target.dataset.data,
                  value: true
               })
            );
         }

         SetFilteredToolIdList();
      } else if (e.target.checked) {
         dispatch(
            audioToolDataActions.addToToolFilters({
               type: e.target.dataset.data,
               value: value
            })
         );
         SetFilteredToolIdList();
      } else {
         dispatch(
            audioToolDataActions.removeFromToolFilters({
               type: e.target.dataset.data,
               value: value
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
      <Fragment>
         <h2
            key={"tool-filter-2"}
            className={`section-title ${styles["main-title"]}`}
         >
            Filters
         </h2>
         <div
            key={"tool-filter-1"}
            id="tool-filter"
            className={styles.outerwrap}
         >
            {allTools && !allTools.hasOwnProperty("error") && (
               <Fragment>
                  <div
                     key={"tool-filter-3"}
                     className={styles["slide-button-wrap"]}
                  >
                     {currentFilters &&
                        Object.keys(currentFilters).map((topic) => {
                           if (doNotFilterList.includes(topic)) return;

                           if (topic === "rating") {
                              return (
                                 <div
                                    key={topic + "1"}
                                    className={
                                       styles["slide-button-inner-wrap"] +
                                       " " +
                                       styles[
                                          topic + "-slide-button-inner-wrap"
                                       ]
                                    }
                                    data-topic={topic}
                                 >
                                    <h3
                                       key={topic + "2"}
                                       className={
                                          styles[
                                             "slide-button-inner-wrap-title"
                                          ]
                                       }
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
                                             <Fragment
                                                key={entry + "fragment 1"}
                                             >
                                                <option
                                                   key={entry + "3"}
                                                   selected={currentFilters[
                                                      topic
                                                   ].includes(entry)}
                                                   type="radio"
                                                   className={
                                                      ["radio-button"] +
                                                      " " +
                                                      styles[
                                                         topic + "-radio-button"
                                                      ]
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
                           if (
                              topic === "favorite" ||
                              topic === "oversampling"
                           ) {
                              return (
                                 <div
                                    key={topic + "10"}
                                    className={
                                       styles["slide-button-inner-wrap"] +
                                       " " +
                                       styles[
                                          topic + "-slide-button-inner-wrap"
                                       ]
                                    }
                                    data-topic={topic}
                                 >
                                    <h3
                                       key={topic + "20"}
                                       className={
                                          styles[
                                             "slide-button-inner-wrap-title"
                                          ]
                                       }
                                    >
                                       {topic === "oversampling"
                                          ? "O-sample"
                                          : topic}
                                    </h3>
                                    <form key={"tool-filter-form-1" + topic}>
                                       {toolsMetadata[topic].map((entry) => {
                                          return (
                                             <Fragment
                                                key={
                                                   "tool-filter-form-2" + entry
                                                }
                                             >
                                                <label
                                                   key={
                                                      "tool-filter-form-3" +
                                                      entry
                                                   }
                                                   htmlFor={entry.toString()}
                                                >
                                                   {entry}
                                                </label>
                                                <input
                                                   key={entry + "3"}
                                                   checked={
                                                      currentFilters[topic]
                                                         .length > 0
                                                   }
                                                   type="checkbox"
                                                   className={
                                                      ["radio-button"] +
                                                      " " +
                                                      styles[
                                                         topic + "-radio-button"
                                                      ]
                                                   }
                                                   data-data={topic}
                                                   onChange={
                                                      filterButtonHandler
                                                   }
                                                   value={entry}
                                                />
                                                <span
                                                   key={
                                                      "tool-filter-form-4" +
                                                      entry
                                                   }
                                                   className={
                                                      styles["checkmark"]
                                                   }
                                                ></span>
                                             </Fragment>
                                          );
                                       })}
                                    </form>
                                 </div>
                              );
                           }
                           return (
                              <div
                                 key={topic + "30"}
                                 className={styles["topic-group"]}
                                 data-topic={topic}
                              >
                                 <CollapsibleElm
                                    key={topic + "20"}
                                    id={topic + "-collapsible-elm"}
                                    styles={{
                                       position: "relative",
                                       display: "flex",
                                       flexWrap: "wrap",
                                       justifyContent: "space-between"
                                    }}
                                    maxHeight="20.5em"
                                    inputOrButton="button"
                                    buttonStyles={{
                                       margin: "-0.75em auto 0",
                                       letterSpacing: "0.25em",
                                       fontVariant: "small-caps",
                                       // transform: 'translateY(0%)',
                                       transition: "0.7s all ease",
                                       minWidth: "100%",
                                       textAlign: "center",
                                       display: "flex",
                                       alignItems: "center",
                                       zIndex: "10",
                                       borderRadius: "0 0 50px 50px",
                                       paddingBottom: "0.5em",
                                       paddingTop: "0.5em"
                                    }}
                                    colorType="secondary"
                                    size="small"
                                    open={false}
                                 >
                                    <div
                                       key={topic + "30"}
                                       className={
                                          styles["slide-button-inner-wrap"]
                                       }
                                    >
                                       <h3
                                          key={topic + "40"}
                                          className={
                                             styles[
                                                "slide-button-inner-wrap-title"
                                             ]
                                          }
                                       >
                                          {topic}
                                       </h3>
                                       {toolsMetadata[topic].map((entry) => {
                                          return (
                                             <CheckBox
                                                key={entry + "30"}
                                                label={entry}
                                                onClick={filterButtonHandler}
                                                checked={currentFilters[
                                                   topic
                                                ].includes(entry)}
                                                data={topic}
                                                user={user.email}
                                                slideButtonTitleStyles={{
                                                   textAlign: "right",
                                                   fontSize: "10px"
                                                }}
                                             />
                                          );
                                       })}
                                    </div>
                                 </CollapsibleElm>
                              </div>
                           );
                        })}
                  </div>
               </Fragment>
            )}
         </div>
      </Fragment>
   );
}

export default FilterTools;

//  <SlideButton
//    key={entry + '30'}
//    label={entry}
//    onClick={filterButtonHandler}
//    checked={currentFilters[topic].includes(entry)}
//    data={topic}
//    user={user.email}
//    slideButtonTitleStyles={{
//      textAlign: 'right',
//      fontSize: '10px',
//    }}
//  />

//  <PushButton
//                             key={entry + '30'}
//                             inputOrButton="input"
//                             id={entry + '-button'}
//                             colorType="primary"
//                             value={entry}
//                             label={entry}
//                             data={topic}
//                             size="small"
//                             onClick={filterButtonHandler}
//                             checked={currentFilters[topic].includes(entry)}
//                             styles={{
//                               textAlign: 'right',
//                               fontSize: '10px',
//                             }}
//                           >
//                             Delete this Item
//                           </PushButton>
