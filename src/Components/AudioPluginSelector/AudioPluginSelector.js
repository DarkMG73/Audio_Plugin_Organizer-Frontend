import { useState, useEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AudioPluginSelector.module.css";
import GatherToolData from "../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import CardPrimaryLarge from "../../UI/Cards/CardPrimaryLarge/CardPrimaryLarge";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import { saveManyPlugins } from "../../storage/audioToolsDB";
import { isValidHttpUrl } from "../../Hooks/utility";
import placeholderImage from "../../assets/images/product-photo-placeholder-5.png";
import LocalErrorDisplay from "../ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";
import LoginStatus from "../User/LoginStatus/LoginStatus";

const AudioPluginSelector = ({ limitedToolsListArr, setUnMatchedItems }) => {
   // Bring in list of file names
   // Filter sorted, cleaned Library list to only include those that match masterLibraryID to file named (cleaned)
   // Send unmatched back to parent.
   // Display matches.

   // const limitedToolsListArr = [
   //   '606 Koncept',
   //   'Abstract Crystal Pads',
   //   'Abstract Crystal Pads copy',
   //   'Addictive Drums 2',
   //   'Addictive Keys',
   //   'ADPTR StreamLiner',

   //   // 'AMPER',
   //   // 'AmpliTube 5',
   //   // 'Analog Lab 4',
   //   'Analog Lab V',
   //   'Analog Waveforms',
   //   'ANIMATE',
   //   'Apache',
   //   'ARCTIC',
   //   'ARCTICFLAT',
   //   'Crystal Harp',
   //   // 'Crystallizer',
   //   // 'CUBE',
   //   // 'Cymatics Diablo Lite',
   //   // 'Cymatics Origin',
   //   // 'D-05_D50 Editor VST3ance',
   //   // 'Massive',
   //   // 'Massive X',
   //   // 'MAutopan',
   //   // 'MAutoPitch',
   //   // 'MBandPass',
   //   // 'MBitFun',
   //   'MCCGenerator',

   //   // 'Mini V3',
   //   // 'Minipol',
   //   // 'Miniverse',
   //   // 'MINT',

   //   // 'MVibrato',
   //   // 'MWaveFolder',
   //   // 'MWaveShaper',
   //   // 'MYSTICT',
   //   // 'MYSTICTZL',
   //   // 'Natura',
   //   // 'Nectar 3 Elements',
   //   'NEOLD BIG AL',
   //   'NEOLD V76U73',
   //   'NEOLD WARBLE',
   //   'NICKELPRE',
   //   'NICKELPREZL',
   //   'Nostromos v2',
   //   // 'Nu Guzheng',
   //   // 'Oberom',
   //   // 'OCEAN',
   //   // 'OCEANZL',
   //   // 'OPALCOMPT',
   //   // 'OPALCOMPTZL',
   //   // 'Orbit',

   //   // 'smartEQ4',
   //   // 'smartlimit',
   //   // 'Smasher',
   //   // 'SMOKE',
   //   // 'SMOKECOMP',
   //   // 'SMOKECOMPZL',
   //   // 'SMOKEEQ',
   //   // 'SMOKEEQZL',
   //   // 'SMOKEZL',
   //   'Snap Heap',
   //   // 'soothe2',
   //   // 'SOUNDA',
   //   // 'SOUNDAZL',
   //   // 'SoundID Reference VST3 Plugin',
   //   // 'SPAN',
   //   // 'SPAN Plus',
   //   // 'SPECOMP',
   //   // 'SSL Native Channel Strip 2',
   //   // 'SSL X-Orcism 2',
   //   // 'Stage-73 V2',
   //   // 'StandardCLIP',
   //   // 'Stardust 201 Tape Echo',
   //   // 'StereoDelta',
   //   // 'StereoSavageElements',
   //   // 'Stutter Edit 2',
   //   // 'Stylo Synthesis',
   //   // 'Subdivine',
   //   // 'SubLab',
   //   // 'SUNGLOWT',
   //   // 'SUNGLOWTZL',
   //   // 'Supercharger',
   //   // 'Supercharger GT',
   //   // 'SuperPlate',

   //   // 'Tape Cassette 2',
   //   // 'TIGERMASTFLAT',
   //   // 'TIGERMASTFLATZL',
   //   // 'TONEX',
   //   // 'Toy Keyboard',
   //   // 'Toy Keyboard v3',
   //   // 'TranceEngine',
   //   // 'Transient Shaper',
   //   // 'trapdrive',
   //   // 'TripleCheese',
   //   // 'truebalance',
   //   // 'truelevel',
   //   // 'TuPRE',
   //   // 'uaudio_century_channel_strip',
   //   // 'uaudio_pultec_eqp-1a',
   //   // 'uaudio_pultec_hlf-3c',
   //   // 'uaudio_pultec_meq-5',
   //   // 'Ultrabasic',
   //   // 'ULTRAMARINE4',
   //   // 'ULTRAM',
   //   // 'ValhallaSupermassive',

   //   // 'ZebraHZ',
   //   'Zither Renaissance',
   // ];
   const dispatch = useDispatch();
   const [toolsFromLibrary, setToolsFromLibrary] = useState(false);
   const [refreshList, setRefreshList] = useState(false);
   const [selectedTools, setSelectedTools] = useState([]);
   const [showLoginModal, setShowLoginModal] = useState(false);
   const user = useSelector((state) => state.auth.user);
   const { toolsMetadata } = useSelector((state) => state.toolsData);
   const [listOpen, setListOpen] = useState([]);
   const listHeightRef = useRef();
   const headerPosition = useSelector(
      (state) => state.elementDimensions.header
   );
   const cleanStr = (str) => str.toLowerCase().replaceAll(" ", "");
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
   const runGatherToolData = (
      user,
      setLocalError,
      GatherToolData,
      gatherCallback
   ) => {
      GatherToolData(user)
         .then((data) => {
            if (process.env.NODE_ENV === "development")
               console.log(
                  "%c Getting tool data from DB:",
                  "color:#fff;background:#777;padding:14px;border-radius:0 25px 25px 0",
                  data
               );
            gatherCallback();
            dispatch(audioToolDataActions.initState(data));
         })
         .catch((err) => {
            console.log(
               "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
               err
            );
            if (err.hasOwnProperty("status") && err.status >= 500) {
               setLocalError({
                  active: true,
                  message:
                     " *** " +
                     err.statusText +
                     `***\n\nIt looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request.\n\nIt is also possible that the server's security software detected abnormally high traffic between this IP address and the server.  This is nothing anyone did wrong, just a rare occurrence with a highly-secured server. This will clear itself sometime within the next thirty minutes or so.\n\nPlease contact us if you find you are online and this error does not clear within an hour.\n\nSorry for the trouble. 😢`
               });
            } else if (err.hasOwnProperty("status")) {
               setLocalError({
                  active: true,
                  message:
                     "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
                     err.status +
                     " |" +
                     err.statusText +
                     " | " +
                     err.request.responseURL
               });
            } else {
               setLocalError({
                  active: true,
                  message:
                     "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
                     err
               });
            }
         });
   };

   // Product Photo Logic
   const createPhotoURLImage = (tool) => {
      let output = "";
      const title = tool.title;
      const value = tool.photoURL;
      const isValidLink = isValidHttpUrl(value);
      if (isValidLink) {
         output = <img key={title + value} src={value} alt={title} />;
      } else {
         const photoSrc =
            value !== "" && value !== undefined
               ? "./assets/images/" + value
               : placeholderImage;
         output = (
            <img
               key={title + value}
               src={photoSrc}
               // src={image}
               alt={title}
            />
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

   const sortToolsList = (
      toolsListArray,
      sortArray,
      currentMasterLibraryIDArray
   ) => {
      if (!currentMasterLibraryIDArray) currentMasterLibraryIDArray = [];
      const output = [];

      sortArray.forEach((topic) => {
         output.push({
            [topic]: toolsListArray.filter((item) => {
               if (item.company === "-") {
               } // Make sure all previous masterLibraryID's treated with current standard
               const groomedCurrentMasterLibraryIDArray =
                  currentMasterLibraryIDArray.map((masterLibraryID) =>
                     cleanStr(masterLibraryID)
                  );
               return (
                  item.company === topic &&
                  !groomedCurrentMasterLibraryIDArray.includes(
                     cleanStr(item.masterLibraryID)
                  )
               );
            })
         });
      });

      // Remove all empty topic categories
      const filteredOutput = output.filter((group) => {
         const value = Object.values(group)[0];
         return value.constructor === Array && value.length > 0;
      });

      // Replace personal settings with defaults
      let cleanedOutput = filteredOutput.map((group) => {
         const [companyData] = Object.entries(group);
         const company = companyData[0];
         const valueArray = companyData[1];
         const outputCompanyArray = [];
         valueArray.forEach((tool) => {
            const outputToolData = { ...tool };

            // Add defaults
            outputToolData.status = "active";
            outputToolData.rating = "3";
            outputToolData.notes = "";
            outputToolData.favorite = "false";

            outputCompanyArray.push(outputToolData);
         });

         const outputCompanyObj = { [company]: [...outputCompanyArray] };

         return outputCompanyObj;
      });

      // Bring in list of file names
      let limitedCleanedOutputArr = [];
      if (limitedToolsListArr) {
         const limitedToolsListMasterIDArray = limitedToolsListArr.map((name) =>
            cleanStr(name)
         );

         cleanedOutput.forEach((group) => {
            const [companyData] = Object.entries(group);
            const company = companyData[0];
            const valueArray = companyData[1];
            const outputCompanyArray = [];
            valueArray.forEach((tool) => {
               if (
                  limitedToolsListMasterIDArray.includes(
                     cleanStr(tool.masterLibraryID)
                  )
               ) {
                  outputCompanyArray.push(tool);
               }
            });

            const outputCompanyObj = { [company]: [...outputCompanyArray] };

            limitedCleanedOutputArr.push(outputCompanyObj);
         });

         // Remove all empty topic categories
         limitedCleanedOutputArr = limitedCleanedOutputArr.filter((group) => {
            const value = Object.values(group)[0];
            return value.constructor === Array && value.length > 0;
         });
      }
      // Filter sorted, cleaned Library list to only include those that match masterLibraryID to file named (cleaned)

      // Display matches.

      if (limitedCleanedOutputArr.length > 0) {
         // Send unmatched back to parent.
         // Build name List of output
         const limitedOutputToolList = [];
         for (const group of Object.values(limitedCleanedOutputArr)) {
            Object.values(group).forEach((tools) =>
               limitedOutputToolList.push(...tools)
            );
         }

         const limitedOutputNameList = [];
         for (const tool of Object.values(limitedOutputToolList)) {
            limitedOutputNameList.push(cleanStr(tool.name));
         }

         const unMatchedItems = limitedToolsListArr.filter((name) => {
            return !limitedOutputNameList.includes(cleanStr(name));
         });
         setUnMatchedItems(unMatchedItems);
         cleanedOutput = limitedCleanedOutputArr;
      }

      return cleanedOutput;
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
      window.DayPilot.confirm(
         "If you are ready to save these, click OK.<br/><br/>If not, click CANCEL to return to the form."
      )
         .then(function (args) {
            if (!args.canceled) {
               const tempToolsLibraryArray = [];
               const flattenedToolsLibraryArray = [];
               toolsFromLibrary.forEach((toolGroup) =>
                  Object.keys(toolGroup).forEach((key) => {
                     tempToolsLibraryArray.push(toolGroup[key]);
                  })
               );
               tempToolsLibraryArray.forEach((toolGroupArray) =>
                  toolGroupArray.forEach((tool) => {
                     flattenedToolsLibraryArray.push(tool);
                  })
               );

               const theData = [];

               selectedTools.forEach((selectedID) =>
                  flattenedToolsLibraryArray.forEach((toolObj) => {
                     if (toolObj.identifier === selectedID) {
                        if (toolObj.hasOwnProperty("_id")) {
                           toolObj.masterLibraryID = cleanStr(
                              toolObj.masterLibraryID
                           );
                           delete toolObj._id;
                        }
                        theData.push(toolObj);
                     }
                  })
               );

               saveManyPlugins({ user, theData }, true).then((res) => {
                  if (res.status && res.status < 299) {
                     successCallback();
                  } else if (res.response.status === 404) {
                     const failedIdsAndNames =
                        res.response.data.err.writeErrors.map((item) => ({
                           id: item.op._id,
                           name: item.op.name
                        }));
                     const failedNames = failedIdsAndNames.map(
                        (item) => item.name
                     );
                     window.DayPilot.confirm(
                        `The following were skipped because they were already in your database:<br/><br/>${failedNames.join(
                           "\n"
                        )}<br/><br/>Any not listed above were entered successfully.<br/><br/> Click "OK" to finish or "CANCEL" to return to the form.<br/><br/>If you intended to add a different tool that happens to have the exact same name as one you already have saved, please add it again, but alter the name in some way. The name must be unique.`
                     )
                        .then(function (args) {
                           if (!args.canceled) {
                              successCallback();
                           }
                        })
                        .catch((e) => {
                           console.lof("Error: " + e);
                        });
                  } else if (res.response.status === 401) {
                     setShowLoginModal(true);
                  } else {
                     window.DayPilot.alert(
                        "There was an error when trying to save the new entry. Here is the message from the server: " +
                           res.message
                     );
                  }
               });
            }
         })
         .catch((e) => {
            console.lof("Error: " + e);
         });
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

         const libraryTools = Object.values(data.allTools);
         const libraryCompanies = new Set();
         libraryTools.forEach((tool) => libraryCompanies.add(tool.company));
         const sortedToolsList = sortToolsList(
            libraryTools,
            Array.from(libraryCompanies),
            toolsMetadata.masterLibraryID
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
