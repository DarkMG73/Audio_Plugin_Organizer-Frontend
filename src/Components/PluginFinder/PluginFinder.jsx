import React, { useState, useEffect, useReducer, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import Styles from "./PluginFinder.module.css";
import { getLocalPluginData } from "../../storage/audioToolsDB";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import AddAToolForm from "../AddATool/AddAToolForm";
import useGroomDataForToolForm from "../../Hooks/useGroomDataForToolForm";
import useSaveAudioFormData from "../../Hooks/useSaveAudioFormData";
import {
   updateUserPluginPaths,
   updateIgnoredPlugins,
   updateMissingIgnoredPlugins
} from "../../storage/userDB";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import { authActions } from "../../store/authSlice";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";

const PluginFinder = (props) => {
   // If running browser version, send to download page
   const { isDesktopApp } = props;
   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.auth);
   const { allTools } = useSelector((state) => state.toolsData);
   const acceptedPluginWrappers = ["vst", "vst3", "component"];
   const [fileNames, setFileNames] = useState([]);
   const [missingFileNames, setMissingFileNames] = useState([]);
   const [addToLibrary, setAddToLibrary] = useState([]);
   const [userFilesToGroomArray, setUserFilesToGroomArray] = useState(false);
   const [sendToLibrary, setSendToLibrary] = useState(false);
   const [findNewPlugins, setFindNewPlugins] = useState(false);
   const [pluginPathsObj, setPluginPathsObj] = useState({});
   const [formOpen, setFormOpen] = useState(true);
   const [showPluginPathSaveButton, setShowPluginPathSaveButton] =
      useState(false);
   const [showHidePluginPathsButton, setShowHidePluginPathsButton] =
      useState(false);
   const [showPluginPaths, setShowPluginPaths] = useState(false);
   const [showMissingPlugins, setShowMissingPlugins] = useState(false);

   const [noPluginPathsExist, setNoPluginPathsExist] = useState(true);
   const [ignorePluginList, setIgnorePluginList] = useState([]);
   const [missingIgnorePluginList, setMissingIgnorePluginList] = useState(
      user.missingIgnoredPlugins ? [...user.missingIgnoredPlugins] : []
   );
   const [missingPluginsInModal, setMissingPluginsInModal] = useState(true);
   const [showSaveIgnoreListButton, setShowSaveIgnoreListButton] =
      useState(false);
   const [showSaveMissingIgnoreListButton, setShowSaveMissingIgnoreListButton] =
      useState(false);
   const groomDataForToolForm = useGroomDataForToolForm();
   const toolsSchema = useSelector((state) => state.toolsData.toolsSchema);
   const [activateLoader, setActivateLoader] = useState(0);
   const saveAudioFormData = useSaveAudioFormData();
   const cleanStr = (str) => str.toLowerCase().replaceAll(" ", "");
   const specialBundles = {
      EffectRack: {
         bundleTitle: "EffectRack",
         company: "Sound Toys",
         items: [
            "Crystallizer",
            "Decapitator",
            "Devil-LocDelux",
            "EchoBoy",
            "EchoBoyJr",
            "FilterFreak",
            "FilterFreak2",
            "MicroShift",
            "PanMan",
            "PhaseMistress",
            "PrimalTap",
            "Radiator",
            "Sie-Q"
         ]
      }
   };
   useEffect(() => {
      // if (activateLoader < 0) setActivateLoader(0);
   }, [activateLoader]);

   useEffect(() => {
      // Update rendered list after closing form.
      dispatch(loadingRequestsActions.addToLoadRequest());

      if (!formOpen) {
         dispatch(authActions.refreshUser(Math.random(10000)));
         setFileNames([]);
         setUserFilesToGroomArray(false);
         setAddToLibrary([]);
         setFindNewPlugins(!findNewPlugins);
         alert("clearing add to library");
      }
      setTimeout(() => {
         dispatch(loadingRequestsActions.removeFromLoadRequest());
      }, 7000);
   }, [formOpen]);

   useEffect(() => {
      if (user && Object.hasOwn(user, "pluginPaths")) {
         let pluginPaths = false;
         Object.values(user.pluginPaths).forEach((path) => {
            if (pluginPaths) return;
            if (path && path.replaceAll(" ", "") !== "") {
               pluginPaths = true;
               setNoPluginPathsExist(false);
            }
            if (!pluginPaths) setNoPluginPathsExist(true);
         });
      }
   }, [user]);

   useEffect(() => {
      const userPluginPaths =
         user &&
         Object.hasOwn(user, "pluginPaths") &&
         user.pluginPaths.constructor === Object
            ? user.pluginPaths
            : {};

      const userIgnoredPlugins =
         user &&
         Object.hasOwn(user, "ignoredPlugins") &&
         user.ignoredPlugins.constructor === Array
            ? user.ignoredPlugins
            : [];

      setShowHidePluginPathsButton(true);
      setPluginPathsObj(userPluginPaths);
      setIgnorePluginList(userIgnoredPlugins);
   }, [user]);

   useEffect(() => {
      if (findNewPlugins) {
         setActivateLoader(activateLoader + 1);
         getLocalPluginData(user, pluginPathsObj)
            .then((data) => {
               setTimeout(() => {
                  setActivateLoader((prevState) => prevState - 1);
               }, 3000);

               if (!data || data.length <= 0) return;
               const acceptedPluginNames = new Set();

               data.forEach((name) => {
                  const nameArray = name.split(".");

                  const isValid = acceptedPluginWrappers.includes(
                     nameArray[name.split(".").length - 1]
                  );
                  // Remove Waves (not yet supported)
                  if (
                     isValid &&
                     !cleanStr(nameArray[0]).includes("waveshell")
                  ) {
                     // Treat differently if  bundle
                     for (const [name, bundle] of Object.entries(
                        specialBundles
                     )) {
                        if (name === nameArray[0]) {
                           bundle.items.forEach((item) => {
                              acceptedPluginNames.add(item);
                           });
                        }
                     }
                     acceptedPluginNames.add(nameArray[0]);
                  }
               });

               const matchedNames = [...missingIgnorePluginList];
               const groomedList = [];
               // Remove existing and ignored plugin names
               for (const name of acceptedPluginNames) {
                  if (!matchedNames.includes(name)) {
                     for (const value of Object.values(allTools)) {
                        const referenceID = value.masterLibraryID || value.name;

                        if (cleanStr(name) === cleanStr(referenceID)) {
                           matchedNames.push(name);
                           break;
                        }
                     }
                  }

                  // Add to found plugin list if not in user library
                  if (
                     !matchedNames.includes(name) &&
                     !ignorePluginList.includes(name)
                  ) {
                     groomedList.push(name);
                  }
               }

               // Disable all not on computer
               const missingList = [];
               for (const value of Object.values(allTools)) {
                  if (cleanStr(value.company) === "waves") continue;
                  const nameFound = matchedNames.filter(
                     (name) =>
                        cleanStr(name) === cleanStr(value.masterLibraryID)
                  );
                  if (nameFound.length <= 0) {
                     // Treat differently if bundle
                     for (const [name, bundle] of Object.entries(
                        specialBundles
                     )) {
                        if (
                           name !== value.masterLibraryID &&
                           cleanStr(value.status) === "active"
                        ) {
                           const inBundle = bundle.items.filter(
                              (item) => item === value.masterLibraryID
                           );
                           if (inBundle.length <= 0)
                              missingList.push(value.masterLibraryID);
                        }
                     }
                  }
               }

               setMissingFileNames(
                  missingList.sort((a, b) => a.localeCompare(b))
               );
               setFileNames(groomedList.sort((a, b) => a.localeCompare(b)));
            })
            .catch((err) => {
               setTimeout(() => {
                  setActivateLoader((prevState) => prevState - 1);
               }, 3000);
               console.log("err->", err);
            });
      }
   }, [findNewPlugins]);

   useEffect(() => {
      if (sendToLibrary) {
         const categoryTitles = Object.keys(toolsSchema);
         const toAddArrays = addToLibrary.map((name) => {
            const outputArray = [];

            // Assign defaults
            outputArray[categoryTitles.indexOf("name")] = name;
            outputArray[categoryTitles.indexOf("functions")] =
               "/Audio Effects/";
            outputArray[categoryTitles.indexOf("status")] = "active";
            outputArray[categoryTitles.indexOf("rating")] = "3";
            outputArray[categoryTitles.indexOf("masterLibraryID")] = name;

            return outputArray;
         });

         const groomedData = groomDataForToolForm([
            categoryTitles,
            ...toAddArrays
         ]);

         setUserFilesToGroomArray(groomedData);
         setSendToLibrary(false);
         setTimeout(() => {
            setActivateLoader((prevState) => prevState - 1);
         }, 3000);
      }
   }, [sendToLibrary, addToLibrary, groomDataForToolForm, toolsSchema]);

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   const handleShowPluginPaths = (e) => {
      e.preventDefault();
      setShowPluginPaths(!showPluginPaths);
   };

   const handleShowMissingPlugins = (e) => {
      e.preventDefault();
      setShowMissingPlugins(!showMissingPlugins);
   };

   const handleCheckBox = (e) => {
      e.preventDefault();
      const name = e.target.dataset.fileName;
      if (addToLibrary.includes(name)) {
         setAddToLibrary((prevState) => {
            const oldState = [...prevState];
            const newState = oldState.filter((item) => item !== name);
            return newState;
         });
      } else {
         setAddToLibrary((prevState) => [...prevState, name]);
      }
   };

   const handleAddToIgnoreList = (e) => {
      e.preventDefault();
      setShowSaveIgnoreListButton(true);
      const name = e.target.dataset.fileName;
      setIgnorePluginList((prevState) => {
         return [...prevState, name].sort((a, b) => a.localeCompare(b));
      });

      if (addToLibrary.includes(name)) {
         setAddToLibrary((prevState) => {
            const oldState = [...prevState];
            const newState = oldState.filter((item) => item !== name);
            return newState;
         });
      }

      if (fileNames.includes(name)) {
         setFileNames((prevState) => {
            const oldState = [...prevState];
            const newState = oldState.filter((item) => item !== name);
            return newState;
         });
      }
   };

   const handleRemoveFromIgnoreList = (e) => {
      e.preventDefault();
      setShowSaveIgnoreListButton(true);
      const name = e.target.dataset.fileName;

      setIgnorePluginList((prevState) => {
         const oldState = [...prevState];
         const newState = oldState.filter((item) => item !== name);
         if (newState.length <= 0) {
            updateIgnoredPlugins(user, newState);
            setShowSaveIgnoreListButton(false);
         }
         return newState;
      });

      setFileNames((prevState) => {
         return [...prevState, name].sort((a, b) => a.localeCompare(b));
      });
   };

   const handleAddToMissingIgnoreList = (e) => {
      e.preventDefault();
      setShowSaveMissingIgnoreListButton(true);
      const name = e.target.dataset.fileName;
      setMissingIgnorePluginList((prevState) => {
         return [...prevState, name].sort((a, b) => a.localeCompare(b));
      });

      if (missingFileNames.includes(name)) {
         setMissingFileNames((prevState) => {
            const oldState = [...prevState];
            const newState = oldState.filter((item) => item !== name);
            return newState;
         });
      }
   };

   const handleRemoveFromMissingIgnoreList = (e) => {
      e.preventDefault();
      setShowSaveMissingIgnoreListButton(true);
      const name = e.target.dataset.fileName;

      setMissingIgnorePluginList((prevState) => {
         const oldState = [...prevState];
         const newState = oldState.filter((item) => item !== name);
         if (newState.length <= 0) {
            updateMissingIgnoredPlugins(user, newState);
            setShowSaveMissingIgnoreListButton(true);
         }
         return newState;
      });

      setMissingFileNames((prevState) => {
         return [...prevState, name].sort((a, b) => a.localeCompare(b));
      });
   };

   const handleToggleMissingPluginsInModal = () => {
      setMissingPluginsInModal(!missingPluginsInModal);
   };

   const handleAddPluginLocationInput = (e) => {
      e.preventDefault();
      setShowPluginPathSaveButton(true);
      setPluginPathsObj((prevState) => {
         const newState = { ...prevState };
         newState[e.target.name] = e.target.value;

         return newState;
      });
   };

   const handleSaveLocationsButton = () => {
      setFindNewPlugins(false);
      setActivateLoader(activateLoader + 1);
      dispatch(loadingRequestsActions.addToLoadRequest());

      updateUserPluginPaths(user, pluginPathsObj)
         .then((res) => {
            setShowPluginPathSaveButton(false);

            alert("The save was successful!\n\nServer status: " + res.status);

            dispatch(authActions.refreshUser(Math.random(10000)));
            setTimeout(() => {
               setFindNewPlugins(true);
               setActivateLoader((prevState) => prevState - 1);
               dispatch(loadingRequestsActions.removeFromLoadRequest());
            }, 5000);
         })
         .catch((err) => {
            console.log("ERROR: " + err);
         });
   };

   const handleDisableMissingPluginsButton = () => {
      setFindNewPlugins(false);

      const submitData = {};

      for (const value of Object.values(allTools)) {
         if (missingFileNames.includes(value.masterLibraryID)) {
            const newValue = { ...value };
            newValue.status = "Disabled";
            newValue.dbID = newValue._id;
            delete newValue._id;
            delete newValue.updatedAt;

            submitData[value.identifier] = newValue;
         }
      }

      const successCallback = () => {
         dispatch(loadingRequestsActions.addToLoadRequest());
         setMissingFileNames([]);
         alert(
            "The item was successfully updated in your library!\n\nChanges will be reflected after you close this notice. If not, please refresh the browser."
         );
         dispatch(authActions.refreshUser(Math.random(10000)));

         setActivateLoader(activateLoader + 1);
         setTimeout(() => {
            setFileNames([]);
            setAddToLibrary([]);
            setFindNewPlugins(true);
            setActivateLoader((prevState) => prevState - 1);
            setFindNewPlugins(true);
            dispatch(loadingRequestsActions.removeFromLoadRequest());
         }, 7000);
      };

      if (submitData) {
         saveAudioFormData(
            submitData,
            user,
            "update-many",
            successCallback
            // noUserCallback,
         );
      }

      // updateMissingIgnoredPlugins(user, missingIgnorePluginList)
      //   .then((res) => {
      //     setShowSaveMissingIgnoreListButton(false);
      //     alert('The save was successful!\n\nServer status: ' + res.status);
      //   })
      //   .catch((err) => {
      //     console.log('ERROR: ' + err);
      //   });
   };

   const handleSaveMissingIgnoredPluginsButton = () => {
      setActivateLoader(activateLoader + 1);
      dispatch(loadingRequestsActions.addToLoadRequest());

      updateMissingIgnoredPlugins(user, missingIgnorePluginList)
         .then((res) => {
            setShowSaveMissingIgnoreListButton(false);
            alert("The save was successful!\n\nServer status: " + res.status);
            setTimeout(() => {
               setActivateLoader((prevState) => prevState - 1);
               dispatch(loadingRequestsActions.removeFromLoadRequest());
            }, 3000);
         })
         .catch((err) => {
            console.log("ERROR: " + err);
         });
   };

   const handleSaveIgnoredPluginsButton = () => {
      setActivateLoader(activateLoader + 1);
      dispatch(loadingRequestsActions.addToLoadRequest());
      updateIgnoredPlugins(user, ignorePluginList)
         .then((res) => {
            setShowSaveIgnoreListButton(false);
            alert("The save was successful!\n\nServer status: " + res.status);
            setTimeout(() => {
               setActivateLoader((prevState) => prevState - 1);
               dispatch(loadingRequestsActions.removeFromLoadRequest());
            }, 2000);
         })
         .catch((err) => {
            console.log("ERROR: " + err);
         });
   };

   const handleCheckAllCheckBox = (e) => {
      e.preventDefault();
      setAddToLibrary([...fileNames]);
   };

   const handleClearAllCheckBox = (e) => {
      e.preventDefault();
      setAddToLibrary([]);
   };

   const handleCheckSomeCheckBox = (e) => {
      e.preventDefault();
      const numberToSelect = e.target.dataset.amount;
      setAddToLibrary([...fileNames.slice(0, numberToSelect)]);
   };

   const handleFindNewPluginsButton = () => {
      setFindNewPlugins(!findNewPlugins);
   };

   const handleAddToLibraryButton = () => {
      setActivateLoader(activateLoader + 1);
      setSendToLibrary(true);
      setFormOpen(true);
   };

   ////////////////////////////////////////
   /// Styles
   ////////////////////////////////////////
   const submitButtonStyles = {
      position: "relative",
      top: "-0",
      left: "40%",
      width: "80%",
      transform: " translateX(-50%)",
      background: "var(--iq-color-accent-gradient)",
      borderRadius: "50px",
      height: "3em",
      font: "var(--iq-font-heading-2)"
   };

   const buttonStyles = {
      width: "80%",
      borderRadius: "50px",
      height: "3em",
      font: "var(--iq-font-heading-2)",
      fontSize: "1.5em",
      padding: "0",
      textTransform: "uppercase",
      fontWeight: "900",
      letterSpacing: "0.25em",
      textShadow:
         "rgb(0 0 0 / 50%) -1px -1px 1px, rgb(255 255 255 / 50%) 1px 1px 1px, 0 0 22px wheat"
   };

   ////////////////////////////////////////
   /// Output
   ////////////////////////////////////////

   return (
      <div className={Styles["plugin-finder-container"]}>
         {/* 
      ************** 
        START/OPEN BUTTON 
      *************** 
      */}
         <button
            type="button"
            className={
               Styles["find-new-plugins-button"] +
               " " +
               (findNewPlugins && Styles.open)
            }
            onClick={handleFindNewPluginsButton}
         >
            {findNewPlugins && (
               <span>
                  &uarr;&nbsp;&nbsp; CLOSE New Plugin Area &nbsp;&nbsp;&uarr;
               </span>
            )}
            {!findNewPlugins && <span>Scan Computer for Plugins</span>}
         </button>

         {/* 
      ************** 
        NEW & MISSING PLUGINS WRAP 
      *************** 
      */}
         <div
            className={
               Styles["plugin-finder-selector-wrap"] +
               " " +
               (findNewPlugins && Styles.open)
            }
         >
            <ul>
               {/* 
          ************** 
            MESSAGE IF NOT DESKTOP 
          *************** 
          */}
               {!isDesktopApp && findNewPlugins && (
                  <div className={Styles["need-desktop-version-container"]}>
                     <h4>Desktop App Needed for Scanning</h4>
                     <p>
                        In order to scan your computer for new plugins, you will
                        need tp run the desktop version of this app.
                     </p>
                     <p>
                        {" "}
                        Download it from GlassInteractive.com here:
                        <br />
                        <a
                           href="https://www.glassinteractive.com/audio-plugin-organizer/"
                           target="_blank"
                           rel="noreferrer"
                        >
                           glassinteractive.com/audio-plugin-organizer/
                        </a>
                     </p>
                  </div>
               )}

               {/* 
          ************** 
            NO USER MESSAGE
          *************** 
          */}
               {isDesktopApp && !user && findNewPlugins && (
                  <div className={Styles["login-message-wrap"]}>
                     <p>
                        Please log in to be able to search for plugins on your
                        machine.
                     </p>
                     <p>
                        If you do not have a profile, please register using the
                        "Sign Up" button above.
                     </p>
                  </div>
               )}

               {/* 
          ************** 
            NO USER MESSAGE
          *************** 
          */}
               {isDesktopApp && user && findNewPlugins && (
                  <Fragment>
                     {/* 
              ************** 
                PATHS FOR PLUGIN LOCATIONS
              *************** 
              */}
                     <Fragment>
                        {showHidePluginPathsButton && (
                           <button
                              type="button"
                              className={Styles["url-show-paths-button"]}
                              onClick={handleShowPluginPaths}
                           >
                              {!showPluginPaths ||
                                 (!noPluginPathsExist && <span>Show </span>)}
                              {(showPluginPaths || noPluginPathsExist) && (
                                 <span>Hide </span>
                              )}
                              Plugin Paths
                           </button>
                        )}

                        {!showHidePluginPathsButton && (
                           <p>
                              * Please paste in the paths to each plugin
                              location on your system *
                           </p>
                        )}
                        {(showPluginPaths || noPluginPathsExist) && (
                           <div className={Styles["url-input-container"]}>
                              {/* 
                    ************** 
                      LOADER
                    *************** 
                    */}
                              {activateLoader > 0 && (
                                 <div
                                    key="loader"
                                    className={Styles["loader-wrap"]}
                                 >
                                    <BarLoader />
                                 </div>
                              )}
                              <div
                                 className={Styles["location-input-container"]}
                              >
                                 <label htmlFor="location-1">
                                    Plugin Location 1
                                 </label>
                                 <input
                                    name="location-1"
                                    type="text"
                                    defaultValue={
                                       Object.hasOwn(
                                          pluginPathsObj,
                                          "location-1"
                                       )
                                          ? pluginPathsObj["location-1"]
                                          : ""
                                    }
                                    onChange={handleAddPluginLocationInput}
                                 />
                              </div>{" "}
                              <div
                                 className={Styles["location-input-container"]}
                              >
                                 <label htmlFor="location-2">
                                    Plugin Location 2
                                 </label>
                                 <input
                                    name="location-2"
                                    type="text"
                                    defaultValue={
                                       Object.hasOwn(
                                          pluginPathsObj,
                                          "location-2"
                                       )
                                          ? pluginPathsObj["location-2"]
                                          : ""
                                    }
                                    onChange={handleAddPluginLocationInput}
                                 />{" "}
                              </div>{" "}
                              <div
                                 className={Styles["location-input-container"]}
                              >
                                 <label htmlFor="location-3">
                                    Plugin Location 3
                                 </label>
                                 <input
                                    name="location-3"
                                    type="text"
                                    defaultValue={
                                       Object.hasOwn(
                                          pluginPathsObj,
                                          "location-3"
                                       )
                                          ? pluginPathsObj["location-3"]
                                          : ""
                                    }
                                    onChange={handleAddPluginLocationInput}
                                 />{" "}
                              </div>{" "}
                              <div
                                 className={Styles["location-input-container"]}
                              >
                                 <label htmlFor="location-4">
                                    Plugin Location 4
                                 </label>
                                 <input
                                    name="location-4"
                                    type="text"
                                    defaultValue={
                                       Object.hasOwn(
                                          pluginPathsObj,
                                          "location-4"
                                       )
                                          ? pluginPathsObj["location-4"]
                                          : ""
                                    }
                                    onChange={handleAddPluginLocationInput}
                                 />
                              </div>
                              {showPluginPathSaveButton &&
                                 Object.keys(pluginPathsObj).length > 0 && (
                                    <button
                                       type="button"
                                       className={Styles.pulse}
                                       onClick={handleSaveLocationsButton}
                                    >
                                       Save Plugin Location Changes
                                    </button>
                                 )}
                           </div>
                        )}
                     </Fragment>

                     {/* 
              ************** 
                MISSING PLUGINS
              *************** 
              */}
                     {!noPluginPathsExist && (
                        <div
                           className={
                              Styles["missing-plugins-container"] +
                              " " +
                              (missingPluginsInModal && Styles.modal)
                           }
                        >
                           {!missingPluginsInModal &&
                              !showSaveMissingIgnoreListButton && (
                                 <button
                                    type="button"
                                    className={Styles["url-show-paths-button"]}
                                    onClick={handleShowMissingPlugins}
                                 >
                                    {!showMissingPlugins && <span>Show </span>}
                                    {showMissingPlugins && <span>Hide </span>}
                                    Missing Plugins
                                 </button>
                              )}
                           {(showMissingPlugins ||
                              missingPluginsInModal ||
                              showSaveMissingIgnoreListButton) && (
                              <Fragment>
                                 {missingPluginsInModal && (
                                    <button
                                       type="button"
                                       className={
                                          Styles["button-action-needed"]
                                       }
                                       onClick={
                                          handleToggleMissingPluginsInModal
                                       }
                                    >
                                       CLOSE and return (this list is still
                                       accessible)
                                    </button>
                                 )}
                                 {missingIgnorePluginList.length > 0 && (
                                    <div
                                       className={
                                          Styles[
                                             "missing-ignore-plugin-list-container"
                                          ] +
                                          " " +
                                          "missing-ignore-plugin-list-container" +
                                          " " +
                                          Styles[
                                             "missing-plugins-inner-container"
                                          ] +
                                          " " +
                                          "missing-plugins-inner-container"
                                       }
                                    >
                                       {/* 
                          ************** 
                            LOADER
                          *************** 
                          */}
                                       {activateLoader > 0 && (
                                          <div
                                             key="loader"
                                             className={Styles["loader-wrap"]}
                                          >
                                             <BarLoader />
                                          </div>
                                       )}
                                       <h3>Missing Plugins to Ignore</h3>
                                       <p>
                                          There{" "}
                                          <span
                                             className={
                                                Styles[
                                                   "highlighted-minor-message"
                                                ]
                                             }
                                          >
                                             {missingIgnorePluginList.length}
                                          </span>{" "}
                                          ignored missing plugins.
                                       </p>
                                       <p
                                          className={
                                             Styles[
                                                "missing-ignore-plugin-list-container-text"
                                             ] +
                                             " " +
                                             "missing-ignore-plugin-list-container-text"
                                          }
                                       >
                                          This list will be saved and ignored
                                          when the scanner finds these plugins
                                          in your library but not on your
                                          computer. This can be reversed (sent
                                          back to the main list) by clicking on
                                          the name.
                                          <br />
                                          This can be reversed (sent back to the
                                          main list) by clicking on the name.
                                          <br />
                                          <br />
                                       </p>

                                       {showSaveMissingIgnoreListButton && (
                                          <Fragment>
                                             <p
                                                className={
                                                   Styles["highlighted-message"]
                                                }
                                             >
                                                Be sure to save this list after
                                                each change.
                                                <br />
                                             </p>
                                             <button
                                                type="button"
                                                className={
                                                   Styles.pulse +
                                                   " " +
                                                   Styles[
                                                      "button-action-needed"
                                                   ]
                                                }
                                                onClick={
                                                   handleSaveMissingIgnoredPluginsButton
                                                }
                                             >
                                                Save Ignored Missing Plugins
                                             </button>
                                          </Fragment>
                                       )}

                                       <CollapsibleElm
                                          key={"Missing Plugins to Ignore"}
                                          id={
                                             "missing=plugins-to-ignore-collapsible-elm"
                                          }
                                          styles={{
                                             position: "relative"
                                          }}
                                          maxHeight="7em"
                                          inputOrButton="button"
                                          buttonStyles={{
                                             margin: "0 auto",
                                             fontVariant: "small-caps",
                                             transform: "translateY(50%)",
                                             transition: "0.7s all ease",
                                             textAlign: "center",
                                             display: "flex",
                                             alignItems: "center",
                                             padding: "0.25em 0",
                                             minWidth: "fit-content",
                                             width: "100%",
                                             gridColumn: "1 / -1"
                                          }}
                                          colorType="secondary"
                                          dataAttribute={{
                                             "data-elm":
                                                "missing-plugins-to-ignore-collapsible-elm"
                                          }}
                                          size="small"
                                       >
                                          <ul>
                                             {missingIgnorePluginList.length <=
                                                0 && (
                                                <div
                                                   className={
                                                      Styles[
                                                         "plugin-finder-text-box"
                                                      ]
                                                   }
                                                >
                                                   <p>
                                                      Plugins you don't want to
                                                      disable will appear here.
                                                      These are in your library,
                                                      but not installed on this
                                                      computer, but Click the X
                                                      next to the plugin name to
                                                      ignore.
                                                      <br />
                                                      Be sure to save this list
                                                      after each change.
                                                      <br />
                                                      Restore an ignored plugin
                                                      anytime by clicking on it.
                                                   </p>
                                                </div>
                                             )}

                                             {missingIgnorePluginList.map(
                                                (fileName, index) => (
                                                   <li key={index}>
                                                      <label
                                                         key={
                                                            "ignored-label" +
                                                            fileName
                                                         }
                                                         htmlFor={
                                                            "ignored" + fileName
                                                         }
                                                         onClick={
                                                            handleRemoveFromMissingIgnoreList
                                                         }
                                                         data-file-name={
                                                            fileName
                                                         }
                                                      >
                                                         {fileName}
                                                      </label>
                                                      <button
                                                         key={
                                                            "ignored" + fileName
                                                         }
                                                         type="button"
                                                         name={
                                                            "ignored" + fileName
                                                         }
                                                         className={
                                                            Styles[
                                                               "ignore-list-button"
                                                            ] +
                                                            "  " +
                                                            "ignore-list-button"
                                                         }
                                                         onClick={
                                                            handleRemoveFromMissingIgnoreList
                                                         }
                                                         data-file-name={
                                                            fileName
                                                         }
                                                      />
                                                   </li>
                                                )
                                             )}
                                          </ul>
                                       </CollapsibleElm>
                                    </div>
                                 )}
                                 {missingFileNames.length > 0 && (
                                    <div
                                       className={
                                          Styles[
                                             "missing-plugins-inner-container"
                                          ]
                                       }
                                    >
                                       {/* 
                          ************** 
                            LOADER
                          *************** 
                          */}
                                       {activateLoader > 0 && (
                                          <div
                                             key="loader"
                                             className={Styles["loader-wrap"]}
                                          >
                                             <BarLoader />
                                          </div>
                                       )}{" "}
                                       <h3>
                                          {missingFileNames.length} plugins are
                                          missing on this computer.
                                       </h3>
                                       <p
                                          className={
                                             Styles[
                                                "missing-ignore-plugin-list-container-text"
                                             ] +
                                             " " +
                                             "missing-ignore-plugin-list-container-text"
                                          }
                                       >
                                          These plugins are in your library, but
                                          not on this computer. To set each to
                                          "Disabled" status, click the button
                                          below. To ignore a specific plugin,
                                          click the "X" to the right of its
                                          name.
                                       </p>
                                       <button
                                          type="button"
                                          className={
                                             Styles.pulse +
                                             " " +
                                             Styles["button-action-needed"]
                                          }
                                          onClick={
                                             handleDisableMissingPluginsButton
                                          }
                                       >
                                          Disable these Missing Plugins &rarr;
                                       </button>
                                       <CollapsibleElm
                                          key={"Missing-Plugins"}
                                          id={"missing-plugins-collapsible-elm"}
                                          styles={{
                                             position: "relative"
                                          }}
                                          maxHeight="7em"
                                          inputOrButton="button"
                                          buttonStyles={{
                                             margin: "0 auto",
                                             fontVariant: "small-caps",
                                             transform: "translateY(50%)",
                                             transition: "0.7s all ease",
                                             textAlign: "center",
                                             display: "flex",
                                             alignItems: "center",
                                             padding: "0.25em 0",
                                             minWidth: "fit-content",
                                             width: "100%"
                                          }}
                                          colorType="secondary"
                                          dataAttribute={{
                                             "data-elm":
                                                "missing-plugins-collapsible-elm"
                                          }}
                                          size="small"
                                       >
                                          <ul>
                                             {" "}
                                             {missingFileNames.map(
                                                (fileName, index) => (
                                                   <li key={index}>
                                                      <label
                                                         htmlFor={fileName}
                                                         data-file-name={
                                                            fileName
                                                         }
                                                      >
                                                         <input
                                                            type="checkbox"
                                                            name={fileName}
                                                            data-file-name={
                                                               fileName
                                                            }
                                                            defaultChecked={addToLibrary.includes(
                                                               fileName
                                                            )}
                                                            checked={addToLibrary.includes(
                                                               fileName
                                                            )}
                                                         />
                                                         {fileName}
                                                      </label>
                                                      <button
                                                         type="button"
                                                         className={
                                                            Styles[
                                                               "ignore-list-button"
                                                            ]
                                                         }
                                                         onClick={
                                                            handleAddToMissingIgnoreList
                                                         }
                                                         data-file-name={
                                                            fileName
                                                         }
                                                      >
                                                         X
                                                      </button>
                                                   </li>
                                                )
                                             )}
                                          </ul>
                                       </CollapsibleElm>
                                    </div>
                                 )}
                                 {missingFileNames.length <= 0 && (
                                    <div
                                       className={
                                          Styles[
                                             "missing-plugins-inner-container"
                                          ]
                                       }
                                    >
                                       {" "}
                                       <h3>
                                          No plugins are missing on this
                                          computer.
                                       </h3>
                                       <p
                                          className={
                                             Styles[
                                                "missing-ignore-plugin-list-container-text"
                                             ] +
                                             " " +
                                             "missing-ignore-plugin-list-container-text"
                                          }
                                       >
                                          Either all of the plugins in your
                                          library are installed on this computer
                                          or there are missing plugins you have
                                          previously put in the "Ignored Missing
                                          Plugins" list. The "Ignored Missing
                                          Plugins" list will only show if there
                                          are items in it. If it does not appear
                                          above, that means it is empty.
                                       </p>
                                       <CollapsibleElm
                                          key={"Missing-Plugin-to-Ignore"}
                                          id={
                                             "missing-plugins-to-ignore-collapsible-elm"
                                          }
                                          styles={{
                                             position: "relative"
                                          }}
                                          maxHeight="7em"
                                          inputOrButton="button"
                                          buttonStyles={{
                                             margin: "0 auto",
                                             fontVariant: "small-caps",
                                             transform: "translateY(50%)",
                                             transition: "0.7s all ease",
                                             textAlign: "center",
                                             display: "flex",
                                             alignItems: "center",
                                             padding: "0.25em 0",
                                             minWidth: "fit-content",
                                             width: "100%"
                                          }}
                                          colorType="secondary"
                                          dataAttribute={{
                                             "data-elm":
                                                "missing-plugins-collapsible-elm"
                                          }}
                                          size="small"
                                       >
                                          <ul>
                                             {" "}
                                             {missingFileNames.map(
                                                (fileName, index) => (
                                                   <li key={index}>
                                                      <label
                                                         htmlFor={fileName}
                                                         data-file-name={
                                                            fileName
                                                         }
                                                      >
                                                         <input
                                                            type="checkbox"
                                                            name={fileName}
                                                            data-file-name={
                                                               fileName
                                                            }
                                                            defaultChecked={addToLibrary.includes(
                                                               fileName
                                                            )}
                                                            checked={addToLibrary.includes(
                                                               fileName
                                                            )}
                                                         />
                                                         {fileName}
                                                      </label>
                                                      <button
                                                         type="button"
                                                         className={
                                                            Styles[
                                                               "ignore-list-button"
                                                            ]
                                                         }
                                                         onClick={
                                                            handleAddToMissingIgnoreList
                                                         }
                                                         data-file-name={
                                                            fileName
                                                         }
                                                      >
                                                         X
                                                      </button>
                                                   </li>
                                                )
                                             )}
                                          </ul>
                                       </CollapsibleElm>
                                    </div>
                                 )}
                              </Fragment>
                           )}
                        </div>
                     )}

                     {/* 
              ************** 
                NEW PLUGINS
              *************** 
              */}
                     <div className={Styles["new-plugin-container"]}>
                        {/* 
                  ************** 
                    LOADER
                  *************** 
                  */}
                        {activateLoader > 0 && (
                           <div key="loader" className={Styles["loader-wrap"]}>
                              <BarLoader />
                           </div>
                        )}
                        {fileNames.length > 0 && !noPluginPathsExist && (
                           <h3>
                              {fileNames.length} new plugins found on this
                              computer.
                           </h3>
                        )}

                        {/* 
                ************** 
                  IGNORED PLUGINS
                *************** 
                */}
                        {!noPluginPathsExist &&
                           (ignorePluginList.length > 0 ||
                              fileNames.length > 0) && (
                              <div
                                 className={
                                    Styles["ignore-plugin-list-container"]
                                 }
                              >
                                 <h3>
                                    {ignorePluginList.length > 0
                                       ? ignorePluginList.length
                                       : "No"}{" "}
                                    Ignored Plugins
                                 </h3>
                                 {showSaveIgnoreListButton && (
                                    <button
                                       type="button"
                                       className={
                                          Styles.pulse +
                                          " " +
                                          Styles["button-action-needed"]
                                       }
                                       onClick={handleSaveIgnoredPluginsButton}
                                    >
                                       Save Ignored Plugins
                                    </button>
                                 )}
                                 <ul>
                                    {/*
                                     *** MESSAGE: NO IGNORED PLUGINS ****/}
                                    {fileNames.length > 0 &&
                                       ignorePluginList.length <= 0 && (
                                          <div
                                             className={
                                                Styles["plugin-finder-text-box"]
                                             }
                                          >
                                             <p>
                                                Plugins to ignore will appear
                                                here.
                                                <br />
                                                Be sure to save this list after
                                                each change.
                                                <br />
                                                Restore an ignored plugin
                                                anytime by clicking on it.
                                             </p>
                                          </div>
                                       )}

                                    {/*
                                     *** IGNORED PLUGINS LIST ****/}
                                    <CollapsibleElm
                                       key={"New-Plugins-to-Ignore"}
                                       id={
                                          "new-plugins-to-ignore-collapsible-elm"
                                       }
                                       styles={{
                                          position: "relative"
                                       }}
                                       maxHeight="7em"
                                       inputOrButton="button"
                                       buttonStyles={{
                                          margin: "0 auto",
                                          fontVariant: "small-caps",
                                          transform: "translateY(50%)",
                                          transition: "0.7s all ease",
                                          textAlign: "center",
                                          display: "flex",
                                          alignItems: "center",
                                          padding: "0.25em 0",
                                          minWidth: "fit-content",
                                          width: "100%",
                                          gridColumn: "1 / -1"
                                       }}
                                       colorType="secondary"
                                       dataAttribute={{
                                          "data-elm":
                                             "new-plugins-to-ignore-collapsible-elm"
                                       }}
                                       size="small"
                                    >
                                       {ignorePluginList.map(
                                          (fileName, index) => (
                                             <li key={index}>
                                                <label
                                                   key={
                                                      "ignored-label" + fileName
                                                   }
                                                   htmlFor={
                                                      "ignored" + fileName
                                                   }
                                                   onClick={
                                                      handleRemoveFromIgnoreList
                                                   }
                                                   data-file-name={fileName}
                                                >
                                                   {fileName}
                                                </label>
                                                <button
                                                   key={"ignored" + fileName}
                                                   type="button"
                                                   name={"ignored" + fileName}
                                                   className={
                                                      Styles[
                                                         "ignore-list-button"
                                                      ]
                                                   }
                                                   onClick={
                                                      handleRemoveFromIgnoreList
                                                   }
                                                   data-file-name={fileName}
                                                />
                                             </li>
                                          )
                                       )}
                                    </CollapsibleElm>
                                 </ul>
                              </div>
                           )}

                        {/* 
                ************** 
                  NEW PLUGINS
                *************** 
                */}
                        {fileNames.length > 0 && !noPluginPathsExist && (
                           <Fragment>
                              {/*
                               *** NEW PLUGINS BUTTONS ****/}
                              <div className={Styles["button-container"]}>
                                 {fileNames.length > 20 && (
                                    <label
                                       htmlFor="select-twenty"
                                       onClick={handleCheckSomeCheckBox}
                                       data-amount="20"
                                    >
                                       <input
                                          type="checkbox"
                                          name="select-twenty"
                                       />
                                       Select First Twenty Items
                                    </label>
                                 )}
                                 {fileNames.length > 50 && (
                                    <label
                                       htmlFor="select-fifty"
                                       onClick={handleCheckSomeCheckBox}
                                       data-amount="50"
                                    >
                                       <input
                                          type="checkbox"
                                          name="select-fifty"
                                       />
                                       Select First Fifty Items
                                    </label>
                                 )}

                                 {fileNames.length !== addToLibrary.length && (
                                    <label
                                       htmlFor="select-all"
                                       onClick={handleCheckAllCheckBox}
                                    >
                                       <input
                                          type="checkbox"
                                          name="select-all"
                                       />
                                       Select All
                                    </label>
                                 )}

                                 {addToLibrary.length > 0 && (
                                    <label
                                       htmlFor="select-none"
                                       onClick={handleClearAllCheckBox}
                                    >
                                       <input
                                          type="checkbox"
                                          name="select-none"
                                       />
                                       Clear All
                                    </label>
                                 )}
                              </div>

                              {/*
                               *** MESSAGE: NEW PLUGINS ****/}
                              <div
                                 className={
                                    Styles["plugin-finder-text-box"] +
                                    " " +
                                    Styles["add-to-library-text-box"]
                                 }
                              >
                                 <p>
                                    Click the plugin name to select it to add to
                                    the library. Click the X to ignore it in the
                                    future.
                                 </p>
                              </div>
                              <button
                                 type="button"
                                 className={
                                    Styles["add-to-library-button"] +
                                    " " +
                                    Styles.pulse +
                                    " " +
                                    Styles["button-action-needed"]
                                 }
                                 onClick={handleAddToLibraryButton}
                              >
                                 Add to Library &rarr;
                              </button>

                              {/*
                               *** NEW PLUGINS LIST ****/}
                              <CollapsibleElm
                                 key={"new-Plugins"}
                                 id={"new-plugins-main-collapsible-elm"}
                                 styles={{
                                    position: "relative"
                                 }}
                                 maxHeight="10em"
                                 inputOrButton="button"
                                 buttonStyles={{
                                    margin: "0 auto",
                                    fontVariant: "small-caps",
                                    transform: "translateY(50%)",
                                    transition: "0.7s all ease",
                                    textAlign: "center",
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "0.25em 0",
                                    minWidth: "fit-content",
                                    width: "100%"
                                 }}
                                 colorType="secondary"
                                 dataAttribute={{
                                    "data-elm": "new-plugins-collapsible-elm"
                                 }}
                                 size="small"
                              >
                                 {fileNames.map((fileName, index) => (
                                    <li key={index}>
                                       <label
                                          htmlFor={fileName}
                                          onClick={handleCheckBox}
                                          data-file-name={fileName}
                                       >
                                          <input
                                             type="checkbox"
                                             name={fileName}
                                             data-file-name={fileName}
                                             defaultChecked={addToLibrary.includes(
                                                fileName
                                             )}
                                             checked={addToLibrary.includes(
                                                fileName
                                             )}
                                          />
                                          {fileName}
                                       </label>
                                       <button
                                          type="button"
                                          className={
                                             Styles["ignore-list-button"]
                                          }
                                          onClick={handleAddToIgnoreList}
                                          data-file-name={fileName}
                                       >
                                          X
                                       </button>
                                    </li>
                                 ))}
                              </CollapsibleElm>
                           </Fragment>
                        )}

                        {/*
                         *** MESSAGES: NO NEW PLUGINS ****/}
                        {!noPluginPathsExist && fileNames.length <= 0 && (
                           <div className={Styles["message-container"]}>
                              <p>
                                 There are no new plugins at this time. Check
                                 out the Plugin Paths section to make sure all
                                 of your plugin locations are listed there. If
                                 it is not listed, it will not be scanned. 🙂
                                 You can add up to four plugin paths.
                              </p>
                           </div>
                        )}
                        {noPluginPathsExist && fileNames.length <= 0 && (
                           <div className={Styles["message-container"]}>
                              <p>
                                 It looks like there are not any plugin paths
                                 set. Check out the Plugin Paths section to add
                                 all of the plugin locations on your computer.
                                 The Plugin Finder can only scan locations
                                 listed there. 🙂 You can add up to four paths.
                              </p>
                           </div>
                        )}
                     </div>
                  </Fragment>
               )}
            </ul>
         </div>

         {/* 
      ************** 
        Missing Plugins Modal
      *************** 
      */}
         {userFilesToGroomArray && formOpen && (
            <div className={Styles["plugin-finder-modal"]}>
               <button
                  type="button"
                  key="addtoolformelms-5"
                  className={
                     Styles["close-form-button"] +
                     " " +
                     Styles["close-all-forms-button"]
                  }
                  onClick={() => {
                     const close = window.confirm(
                        "Are you sure you want to cancel all of the new plugin forms? Any data input will be lost. "
                     );

                     if (close) setUserFilesToGroomArray(false);
                  }}
               >
                  Close All
               </button>

               <div
                  key="add-a-tool-inputs-container 3"
                  className={Styles["inputs-container"]}
               >
                  <AddAToolForm
                     saveOrUpdateData="save"
                     formData={userFilesToGroomArray}
                     buttonStyles={buttonStyles}
                     submitButtonStyles={submitButtonStyles}
                     //   ignoreFormOpen={true}
                     setFormParentOpen={setFormOpen}
                     cancelOneForm={(e) => {
                        e.preventDefault();
                        const targetParent = e.target.closest(
                           "[class*=form-group-wrap]"
                        );
                        if (targetParent) {
                           targetParent.style.display = "none";
                        } else {
                           console.log(
                              "ERROR: Target parent element " +
                                 targetParent +
                                 " is not present. This form can not be closed."
                           );
                        }
                     }}
                  />
               </div>
            </div>
         )}
      </div>
   );
};

export default PluginFinder;
