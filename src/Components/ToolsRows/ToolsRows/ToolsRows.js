import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import styles from "./ToolsRows.module.css";
import ToolRow from "../ToolRow/ToolRow";
import AudioPluginSelector from "../../AudioPluginSelector/AudioPluginSelector";
import Card from "../../../UI/Cards/Card/Card";
import BarLoader from "../../../UI/Loaders/BarLoader/BarLoader";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";

function ToolsRows(props) {
   const allTools = props.allTools;
   const toolsToDisplay = props.toolsToDisplay;
   const toolsToDisplayCategories = [];
   const toolsToDisplayRows = {};
   const [openAll, setOpenAll] = useState(false);
   const filteredToolsIds = props.filteredToolsIds;
   const headerPosition = useSelector(
      (state) => state.elementDimensions.header
   );
   const { currentFilters } = useSelector((state) => state.toolsData);
   let filtersAreSelected = false;

   Object.values(currentFilters).forEach((value) => {
      if (value.length > 0) filtersAreSelected = true;
   });
   //  if (!headerPosition.hasOwnProperty("bottom")) headerPosition.bottom = 0;

   ////////////////////////////////////////
   /// FUNCTIONALITY
   ////////////////////////////////////////
   for (const k in toolsToDisplay) {
      if (k !== "stats") {
         toolsToDisplayCategories.push(k);
         toolsToDisplayRows[k] = [];
         for (const key in toolsToDisplay[k]) {
            // Add the row
            toolsToDisplayRows[k].push(key);
         }
      }
   }

   // Set the order as alphabetical
   let sortedAllTools = [];
   for (const key in toolsToDisplay) {
      sortedAllTools.push([key, toolsToDisplay[key].name]);
   }
   // Sort by name
   sortedAllTools.sort(function (a, b) {
      return a[1].toLowerCase().localeCompare(b[1].toLowerCase());
   });

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   const openAllButtonHandler = (e) => {
      setOpenAll(!openAll);
   };

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   return (
      <>
         <div
            key="open-all-button-wrap"
            className={styles["open-all-button-wrap"]}
            style={{ top: headerPosition.bottom + "px" }}
         >
            {" "}
            {!toolsToDisplay.hasOwnProperty("error") && (
               <PushButton
                  key={"open-all-button"}
                  inputOrButton="button"
                  styles={{
                     width: "75%",
                     letterSpacing: "var(--iq-spacing-subheading)",
                     fontSize: "calc(0.8rem + 0.2vw)",
                     fontVariant: "all-small-caps",
                     textAlign: "center",
                     display: "flex",
                     justifyContent: "center",
                     margin: "auto",
                     padding: "calc(0.25em + 0.4vh)  1.5em",
                     transform: "none",
                     borderRadius: "50px"
                  }}
                  id={"open-all-button"}
                  colorType="secondary"
                  value="Open All"
                  data=""
                  size=""
                  onClick={openAllButtonHandler}
               >
                  {!openAll && <Fragment>Expand All Tools</Fragment>}
                  {openAll && <Fragment>Collapse All Tools</Fragment>}
               </PushButton>
            )}
         </div>
         <div key="toolsrows-1" className={styles["tools-rows-list-container"]}>
            {!toolsToDisplay.hasOwnProperty("error") && (
               <div className={styles["filters-data-container"]}>
                  {filtersAreSelected && (
                     <Fragment>
                        {filteredToolsIds.length <= 0 && (
                           <h3
                              key="toolsrowsList-3"
                              className={`"section-subtitle" ${styles["section-subtitle"]}`}
                           >
                              <span className={styles["amount-after-filters"]}>
                                 O
                              </span>{" "}
                              items fit the selected filters.
                              <br />
                              Consider removing some of the filters.
                           </h3>
                        )}

                        {filteredToolsIds.length > 0 && (
                           <h3
                              key="toolsrowsList-3"
                              className={`"section-subtitle" ${styles["section-subtitle"]}`}
                           >
                              <span className={styles["amount-after-filters"]}>
                                 {filteredToolsIds.length}
                              </span>{" "}
                              of the total {Object.keys(allTools).length} fit
                              the selected filters.
                           </h3>
                        )}
                        <ul className={styles["filters-list-container"]}>
                           <h4 className={styles["filtered-list-title"]}>
                              Filters
                           </h4>
                           {Object.entries(currentFilters).map((entry) => {
                              if (entry[1].length > 0) {
                                 if (
                                    entry[0] === "favorite" ||
                                    entry[0] === "oversampling"
                                 ) {
                                    return (
                                       <ul className={styles["topic-list"]}>
                                          <h5 className={styles["topic-title"]}>
                                             {entry[0]}
                                          </h5>
                                          {entry[1].map((name) => (
                                             <li className={styles["name"]}>
                                                True
                                             </li>
                                          ))}
                                       </ul>
                                    );
                                 } else {
                                    return (
                                       <ul className={styles["topic-list"]}>
                                          <h5 className={styles["topic-title"]}>
                                             {entry[0]}
                                          </h5>
                                          {entry[1].map((name) => (
                                             <li className={styles["name"]}>
                                                {name}
                                             </li>
                                          ))}
                                       </ul>
                                    );
                                 }
                              }

                              return false;
                           })}
                        </ul>
                     </Fragment>
                  )}
                  {!filtersAreSelected && (
                     <h3
                        key="toolsrowsList-3"
                        className={`"section-subtitle" ${styles["section-subtitle"]}`}
                     >
                        This library has {Object.keys(allTools).length} plugins.
                     </h3>
                  )}
               </div>
            )}
            {!toolsToDisplay.hasOwnProperty("error") ? (
               sortedAllTools.map((tool) => {
                  const key = tool[0];
                  return (
                     <ToolRow
                        key={key}
                        tool={toolsToDisplay[key]}
                        keyOne={key}
                        openAll={openAll}
                     />
                  );
               })
            ) : (
               <Card
                  key="toolsrows-2"
                  styles={{ borderRadius: "30px", padding: "3em" }}
               >
                  {!props.showLoader && (
                     <Fragment>
                        <h3 className={styles["no-plugin-title"]}>
                           {toolsToDisplay.error["Audio & Video Plugin Status"]}
                        </h3>
                        <p className={styles["no-plugin-text"]}>
                           {toolsToDisplay.error["What you can do"]}
                        </p>{" "}
                        <AudioPluginSelector key="audioPluginselector" />
                     </Fragment>
                  )}
                  {props.showLoader && <BarLoader />}
               </Card>
            )}
         </div>
      </>
   );
}

export default ToolsRows;
