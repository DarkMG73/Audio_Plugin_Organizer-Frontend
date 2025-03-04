import { useState, useEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AudioPluginSelector.module.css";
import GatherToolData from "../../Hooks/GatherToolData";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import CardPrimaryLarge from "../../UI/Cards/CardPrimaryLarge/CardPrimaryLarge";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import { isValidHttpUrl } from "../../Hooks/utility";
import useRunGatherToolData from "../../Hooks/useRunGatherToolData";
import useSortToolsList from "../../Hooks/useSortToolsList";
import useSubmitSelectionsHandler from "../../Hooks/useSubmitSelectionsHandler";
import placeholderImage from "../../assets/images/generic_plugin_images/default.jpg";
import LocalErrorDisplay from "../ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";
import LoginStatus from "../User/LoginStatus/LoginStatus";
import useDefaultImageIsAvailable from "../../Hooks/useDefaultImageIsAvailable";
import useFindSelectedImage from "../../Hooks/useFindSelectedImage";

const AudioPluginSelector = ({ limitedToolsListArr, setUnMatchedItems }) => {
   const [toolsFromLibrary, setToolsFromLibrary] = useState(false);
   const [refreshList, setRefreshList] = useState(false);
   const [selectedTools, setSelectedTools] = useState([]);
   const [showLoginModal, setShowLoginModal] = useState(false);
   const user = useSelector((state) => state.auth.user);
   const { toolsMetadata, defaultImages } = useSelector(
      (state) => state.toolsData
   );
   const [listOpen, setListOpen] = useState([]);
   const listHeightRef = useRef();
   const headerPosition = useSelector(
      (state) => state.elementDimensions.header
   );
   const cleanStr = (str) => str.toLowerCase().replaceAll(" ", "");
   const runGatherToolData = useRunGatherToolData();
   const sortToolsList = useSortToolsList();
   const submitButtonHandlerFunction = useSubmitSelectionsHandler();
   const defaultImageIsAvailable = useDefaultImageIsAvailable();
   const findSelectedImage = useFindSelectedImage();
   const [localError, setLocalError] = useState({
      active: false,
      message: null
   });
   const successCallback = () => {
      const gatherCallback = () => {
         setSelectedTools([]);
         setToolsFromLibrary([]);
         setRefreshList(!refreshList);
         window.DayPilot.alert(
            "The items were successfully added to your library! Changes should already be reflected in your library area (above). In addition, the items added should have been removed from the selector tool. If not, please refresh the browser."
         );
      };
      runGatherToolData(user, setLocalError, GatherToolData, gatherCallback);
   };

   ////////////////////////////////////////
   /// HELPER FUNCTIONS
   ////////////////////////////////////////

   // Product Photo Logic
   const createPhotoURLImage = (tool) => {
      let output = "";
      const { title, functions } = tool;
      const value = tool.photoURL;
      const isValidLink = isValidHttpUrl(value);
      // if (isValidLink) {
      //   output = <img key={title + value} src={value} alt={title} />;
      // }

      if (isValidLink) {
         // value = <img key={title + value} src={value} alt={title} />;
         output = <img key={title + value} src={value} alt={title} />;
      } else if (value !== undefined) {
         const photoSrc =
            value !== ""
               ? findSelectedImage(value)
               : defaultImageIsAvailable(functions, defaultImages)
                 ? defaultImageIsAvailable(functions, defaultImages)
                 : placeholderImage;
         output = (
            <Fragment>
               <img
                  key={title + value}
                  data-test={"test-" + defaultImageIsAvailable(functions)}
                  src={photoSrc || placeholderImage}
                  // src={image}
                  alt=""
               />
            </Fragment>
         );
      } else {
         output = (
            <a
               key={title + value}
               href={value}
               alt={title}
               target="_blank"
               rel="noreferrer"
            >
               {value}
            </a>
         );
      }

      return output;
   };

   const getCompanyNamesArray = (toolsListArray) => {
      const output = new Set();
      toolsListArray.forEach((tool) => {
         output.add(tool.company);
      });

      return Array.from(output);
   };

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   const sectionToggleButtonHandler = (e) => {
      const listID = e.target.getAttribute("data-ID");

      if (listOpen.includes(listID)) {
         const newArray = listOpen.slice();
         newArray.splice(newArray.indexOf(listID), 1);
         setListOpen(newArray);
         return;
      }
      setListOpen([listID, ...listOpen]);
   };

   const sectionOpenAllHandler = () => {
      const companyNameListAry = [];
      toolsFromLibrary.forEach((companyGroup) =>
         companyNameListAry.push(Object.keys(companyGroup)[0])
      );

      setListOpen(companyNameListAry);
   };

   const sectionCloseAllHandler = () => {
      setListOpen([]);
   };

   const buttonChangeHandler = (e) => {
      const newSelectedToolsArray = [...selectedTools];
      const value = e.target.closest("button").value;

      if (newSelectedToolsArray.includes(value)) {
         newSelectedToolsArray.splice(selectedTools.indexOf(value), 1);
         setSelectedTools(newSelectedToolsArray);
      } else {
         newSelectedToolsArray.push(value);
         setSelectedTools(newSelectedToolsArray);
      }
   };

   const selectAllHandler = () => {
      const allToolsInListAry = [];

      for (const value of Object.values(toolsFromLibrary)) {
         Object.values(value).forEach((toolGroup) => {
            toolGroup.forEach((tool) =>
               allToolsInListAry.push(tool.identifier)
            );
         });
      }
      setSelectedTools(allToolsInListAry);
      sectionOpenAllHandler();
      setSelectedTools(allToolsInListAry);
   };

   const cancelSelectionsHandler = () => {
      setSelectedTools([]);
   };

   const submitButtonHandler = () => {
      submitButtonHandlerFunction(
         toolsFromLibrary,
         selectedTools,
         user,
         successCallback,
         setShowLoginModal,
         cleanStr
      );
   };

   const localErrorButtonHandler = () => {
      setLocalError({ active: !localError, message: localError.message });
   };

   const loginModalCloseButtonHandler = () => {
      setShowLoginModal(false);
   };

   ////////////////////////////////////////
   /// EFFECTS
   ////////////////////////////////////////
   useEffect(() => {
      GatherToolData().then((data) => {
         if (process.env.NODE_ENV === "development")
            console.log(
               "%c AUDIO PLUGIN SELECTOR Getting tool data from DB:",
               "color:#fff;background:#028218;padding:14px;border-radius:0 25px 25px 0",
               data
            );

         if (data.allTools.hasOwnProperty("error")) return;

         // GatherToolData(user).then((userData) => {

         const userToolsLibrary = Object.values(data.allTools);
         const libraryCompanies = new Set();
         userToolsLibrary.forEach((tool) => libraryCompanies.add(tool.company));
         const sortedToolsList = sortToolsList(
            userToolsLibrary,
            Array.from(libraryCompanies),
            toolsMetadata.masterLibraryID,
            cleanStr,
            limitedToolsListArr,
            setUnMatchedItems
         ).sort((a, b) => {
            if (
               Object.keys(a)[0].toLowerCase() < Object.keys(b)[0].toLowerCase()
            ) {
               return -1;
            }
            if (
               Object.keys(a)[0].toLowerCase() > Object.keys(b)[0].toLowerCase()
            ) {
               return 1;
            }
            return 0;
         });

         setToolsFromLibrary(sortedToolsList);
         // dispatch(audioToolDataActions.initState(data));
         // });
      });
   }, [refreshList, user]);

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   return (
      <CardPrimaryLarge
         key="outer-container"
         styles={{ width: "100%", maxWidth: "100%" }}
         data="ap-selector"
      >
         {" "}
         {showLoginModal && (
            <div className={styles["login-modal-container"]}>
               <CardPrimaryLarge
                  key="login-container"
                  styles={{ maxWidth: "800px" }}
               >
                  <CardSecondary
                     key="login-container"
                     styles={{ maxWidth: "100%", padding: "2em 4em" }}
                  >
                     <p>
                        It is necessary to be logged in before adding any items
                        from the library. If you do not yet have an account, it
                        is quick and easy to make one. Login and Signup forms
                        are available below.
                     </p>
                  </CardSecondary>
                  <LoginStatus />
                  <PushButton
                     key={"cancelandreturn"}
                     inputOrButton="input"
                     type="button"
                     id="quest-submit-btn"
                     colorType="secondary"
                     value="Cancel and return ->"
                     data=""
                     size="large"
                     onClick={loginModalCloseButtonHandler}
                     styles={{
                        maxWidth: "80%",
                        margin: "0 auto",
                        width: "100%",
                        borderRadius: "inherit",
                        boxShadow: "0 0 20px var(--iq-color-accent)",
                        padding: "1em"
                     }}
                  />
               </CardPrimaryLarge>
            </div>
         )}
         <div
            className={
               styles["audio-plugin-selector-container"] +
               " audio-plugin-selector-container"
            }
         >
            {localError && localError.active && (
               <div
                  className={
                     styles["error-wrapper"] +
                     " " +
                     (localError.active && styles["error-active"])
                  }
               >
                  <button
                     className={styles["error-close-button"]}
                     onClick={localErrorButtonHandler}
                  >
                     X
                  </button>

                  <LocalErrorDisplay message={localError.message} />
               </div>
            )}
            <h2 key="home" className="section-title">
               Plugins & Tools Library
            </h2>
            {toolsFromLibrary && toolsFromLibrary.length > 0 && (
               <Fragment>
                  <p className={styles["welcome-text"]}>
                     Open the company folders and select the plugins you wish to
                     add. When all of your selections are made, click the{" "}
                     <b>"Save to Your Library"</b> button.
                  </p>
               </Fragment>
            )}
            <br />
            {toolsFromLibrary && toolsFromLibrary.length > 0 && (
               <div
                  className={styles["button-container"]}
                  style={{
                     position: "sticky",
                     top: headerPosition.bottom - 3 + "px",
                     zIndex: "2"
                  }}
                  data-data="audio-plugin-selector-button-container"
               >
                  <PushButton
                     key={"addtolobrary"}
                     inputOrButton="input"
                     type="submit"
                     id="quest-submit-btn"
                     colorType="secondary"
                     value={
                        selectedTools.length > 0
                           ? "Add to Your Library"
                           : "Select Plugins"
                     }
                     data="audio-plugin-selector-submit"
                     size="large"
                     onClick={submitButtonHandler}
                     styles={{
                        maxWidth: "100%",
                        margin: "0 auto",
                        width: "100%",
                        pointerEvents:
                           selectedTools.length > 0 ? "all" : "none",
                        background:
                           selectedTools.length > 0
                              ? ""
                              : "var(--iq-color-foreground)",
                        border:
                           selectedTools.length > 0
                              ? ""
                              : "var(--apo-border-button-1)",
                        color:
                           selectedTools.length > 0
                              ? ""
                              : "var(--iq-color-background)",
                        boxShadow:
                           selectedTools.length > 0
                              ? ""
                              : "var(--apo-boxshadow-small-glow-inner)"
                     }}
                  />

                  <PushButton
                     key={"selectall"}
                     inputOrButton="input"
                     type="submit"
                     id="select-all"
                     colorType="primary"
                     value="Select All"
                     data="select-all"
                     size="medium"
                     onClick={selectAllHandler}
                     styles={{
                        maxWidth: "100%",
                        margin: "0 auto",
                        width: "100%"
                     }}
                  />
                  <PushButton
                     key={"cancelselections"}
                     inputOrButton="input"
                     type="submit"
                     id="cancel-selections"
                     colorType="primary"
                     value="Cancel Selections"
                     data="cancel-selections"
                     size="medium"
                     onClick={cancelSelectionsHandler}
                     styles={{
                        maxWidth: "100%",
                        margin: "0 auto",
                        width: "100%"
                     }}
                  />
                  <PushButton
                     key={"openall"}
                     inputOrButton="input"
                     type="submit"
                     id="open-all-companies"
                     colorType="primary"
                     value="Open All Companies"
                     data="open-all-companies"
                     size="medium"
                     onClick={sectionOpenAllHandler}
                     styles={{
                        maxWidth: "100%",
                        margin: "0 auto",
                        width: "100%"
                     }}
                  />

                  <PushButton
                     key={"closeallcompanies"}
                     inputOrButton="input"
                     type="submit"
                     id="close-all-companies"
                     colorType="primary"
                     value="Close All Companies"
                     data="close-all-companies"
                     size="medium"
                     onClick={sectionCloseAllHandler}
                     styles={{
                        maxWidth: "100%",
                        margin: "0 auto",
                        width: "100%"
                     }}
                  />
               </div>
            )}
            <ul
               key="library-list"
               className={
                  styles["library-list-container"] + " library-list-container"
               }
            >
               {!toolsFromLibrary ||
                  (toolsFromLibrary.length <= 0 && (
                     <div>
                        <h3>No Additional Plugins Here</h3>
                        <p>
                           Your library already contains all of the items from
                           the Master Library.
                        </p>
                     </div>
                  ))}
               {toolsFromLibrary &&
                  toolsFromLibrary.length > 0 &&
                  toolsFromLibrary.map((companyListObject) => {
                     const companyName = Object.keys(companyListObject)[0];
                     const sectionTitle =
                        companyName !== ""
                           ? companyName
                           : "* Company Unknown *";
                     return (
                        <Fragment>
                           <div
                              style={{
                                 position: "sticky",
                                 top: headerPosition.bottom + 120 + "px",
                                 zIndex: "1"
                              }}
                           >
                              <button
                                 className={
                                    styles["section-toggle-button"] +
                                    " section-toggle-button"
                                 }
                                 onClick={sectionToggleButtonHandler}
                                 data-ID={companyName}
                              >
                                 <h3>{sectionTitle}</h3>
                              </button>
                           </div>
                           <div
                              className={`${styles["library-list-outer-wrap"]}`}
                              style={{
                                 height: listHeightRef.current
                                    ? listHeightRef.current.height
                                    : ""
                              }}
                              ref={listHeightRef}
                           >
                              {listOpen.includes(companyName) && (
                                 <div className={`${styles["library-list"]}`}>
                                    {companyListObject[companyName].map(
                                       (tool) => {
                                          return (
                                             <li
                                                key={
                                                   "item-li-" + tool.identifier
                                                }
                                             >
                                                <li
                                                   key={
                                                      "item-li-inner-" +
                                                      tool.identifier
                                                   }
                                                >
                                                   <button
                                                      key={
                                                         "item-button-" +
                                                         tool.identifier
                                                      }
                                                      id="line-inner-wrap"
                                                      className={
                                                         styles[
                                                            "line-inner-wrap"
                                                         ] +
                                                         " " +
                                                         (selectedTools.includes(
                                                            tool.identifier
                                                         ) &&
                                                            styles[
                                                               "selected-tool"
                                                            ])
                                                      }
                                                      onClick={
                                                         buttonChangeHandler
                                                      }
                                                      dataSelected={
                                                         selectedTools.includes(
                                                            tool.identifier
                                                         ) && "true"
                                                      }
                                                      value={tool.identifier}
                                                   >
                                                      <span
                                                         id="line-text-inner-wrap"
                                                         className={
                                                            styles[
                                                               "line-text-inner-wrap"
                                                            ]
                                                         }
                                                      >
                                                         <span
                                                            className={` ${
                                                               styles[
                                                                  tool.name +
                                                                     " name"
                                                               ]
                                                            } ${styles["item-title"]}`}
                                                         >
                                                            {tool.name}
                                                         </span>
                                                         {tool.photoURL && (
                                                            <span
                                                               className={
                                                                  styles[
                                                                     tool.name +
                                                                        " photoURL"
                                                                  ] +
                                                                  " " +
                                                                  styles[
                                                                     "image-wrap"
                                                                  ]
                                                               }
                                                            >
                                                               <span
                                                                  className={
                                                                     styles[
                                                                        tool.name +
                                                                           " photoURL"
                                                                     ] +
                                                                     " " +
                                                                     styles[
                                                                        "image-inner-wrap"
                                                                     ]
                                                                  }
                                                               >
                                                                  <Fragment>
                                                                     {createPhotoURLImage(
                                                                        tool
                                                                     )}
                                                                  </Fragment>
                                                               </span>
                                                            </span>
                                                         )}
                                                         {tool.company && (
                                                            <span
                                                               className={`${
                                                                  styles[
                                                                     tool.name +
                                                                        "-company"
                                                                  ]
                                                               } ${styles["item-company"]}`}
                                                            >
                                                               <Fragment>
                                                                  <span>
                                                                     By{" "}
                                                                  </span>{" "}
                                                                  {tool.company}
                                                               </Fragment>
                                                            </span>
                                                         )}
                                                         {(tool.functions &&
                                                            tool.functions
                                                               .length) > 0 && (
                                                            <span
                                                               className={`${
                                                                  styles[
                                                                     tool.name +
                                                                        "-functions"
                                                                  ]
                                                               } ${styles["item-functions"]}}`}
                                                            >
                                                               <Fragment>
                                                                  <span>
                                                                     Functions:{" "}
                                                                  </span>{" "}
                                                                  {tool.functions.toString()}
                                                               </Fragment>
                                                            </span>
                                                         )}
                                                         {tool.productURL && (
                                                            <span
                                                               className={`${
                                                                  styles[
                                                                     tool.name +
                                                                        "-productURL"
                                                                  ]
                                                               } ${styles["item-productURL"]}`}
                                                            >
                                                               <Fragment>
                                                                  <a
                                                                     href={
                                                                        tool.productURL
                                                                     }
                                                                     alt={
                                                                        tool.name +
                                                                        " by " +
                                                                        tool.company
                                                                     }
                                                                     target="_blank"
                                                                     rel="noreferrer"
                                                                  >
                                                                     More detail
                                                                  </a>
                                                               </Fragment>
                                                            </span>
                                                         )}
                                                      </span>
                                                   </button>
                                                </li>
                                             </li>
                                          );
                                       }
                                    )}
                                 </div>
                              )}
                           </div>
                        </Fragment>
                     );
                  })}
            </ul>
         </div>
      </CardPrimaryLarge>
   );
};

export default AudioPluginSelector;
