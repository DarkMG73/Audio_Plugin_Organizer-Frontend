import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import Styles from "./PluginFinder.module.css";
import { getLocalPluginData } from "../../storage/audioToolsDB";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import AddAToolForm from "../AddATool/AddAToolForm";
import useGroomDataForToolForm from "../../Hooks/useGroomDataForToolForm";
import { updateUserPluginPaths } from "../../storage/userDB";

const PluginFinder = () => {
   const { user } = useSelector((state) => state.auth);
   console.log(
      "%c⚪️►►►► %cline:11%cuser",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
      user
   );
   const { allTools } = useSelector((state) => state.toolsData);
   const acceptedPluginWrappers = ["vst", "vst3", "component"];
   const [fileNames, setFileNames] = useState([]);
   const [addToLibrary, setAddToLibrary] = useState([]);
   const [userFilesToGroomArray, setUserFilesToGroomArray] = useState(false);
   const [sendToLibrary, setSendToLibrary] = useState(false);
   const [findNewPlugins, setFindNewPlugins] = useState(false);
   const [pluginPathsObj, setPluginPathsObj] = useState({});
   const [showPluginPathSaveButton, setShowPluginPathSaveButton] =
      useState(true);
   const [showHidePluginPathsButton, setShowHidePluginPathsButton] =
      useState(false);
   const [showPluginPaths, setShowPluginPaths] = useState(false);
   const [noPluginPathsExist, setNoPluginPathsExist] = useState(true);
   const groomDataForToolForm = useGroomDataForToolForm();
   const toolsSchema = useSelector((state) => state.toolsData.toolsSchema);
   const [activateLoader, setActivateLoader] = useState(false);

   useEffect(() => {
      let pluginPathsExist = false;

      if (pluginPathsObj) {
         Object.values(pluginPathsObj).forEach((path) => {
            if (!pluginPathsExist && path) pluginPathsExist = true;
         });
      }

      if (pluginPathsExist) setNoPluginPathsExist(false);
   }, [pluginPathsObj]);

   useEffect(() => {
      const userPluginPaths =
         user &&
         Object.hasOwn(user, "pluginPaths") &&
         user.pluginPaths.constructor === Object
            ? user.pluginPaths
            : {};

      setShowHidePluginPathsButton(true);
      setPluginPathsObj(userPluginPaths);
   }, [user]);

   useEffect(() => {
      if (findNewPlugins) {
         setActivateLoader(true);

         getLocalPluginData(user, pluginPathsObj)
            .then((data) => {
               console.log("plugin names---->", data);

               const acceptedPluginNames = new Set();

               data.forEach((name) => {
                  const nameArray = name.split(".");

                  const isValid = acceptedPluginWrappers.includes(
                     nameArray[name.split(".").length - 1]
                  );

                  if (isValid) acceptedPluginNames.add(nameArray[0]);
               });

               const matchedNames = [];
               const groomedList = [];
               // Remove existing plugin names
               for (const name of acceptedPluginNames) {
                  if (!matchedNames.includes(name)) {
                     for (const value of Object.values(allTools)) {
                        const referenceID = value.masterLibraryID || value.name;

                        if (
                           name
                              .replaceAll(" ", "")
                              .includes(referenceID.replaceAll(" ", ""))
                        ) {
                           matchedNames.push(name);
                           break;
                        }
                     }
                  }

                  if (!matchedNames.includes(name)) {
                     groomedList.push(name);
                  }
               }

               setFileNames(groomedList);
               setTimeout(() => {
                  setActivateLoader(false);
               }, 3000);
            })
            .catch((err) => {
               setTimeout(() => {
                  setActivateLoader(false);
               }, 3000);
               console.log("err->", err);
            });
      } else {
         setTimeout(() => {
            setActivateLoader(false);
         }, 3000);
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
      }
      setTimeout(() => {
         setActivateLoader(false);
      }, 3000);
   }, [sendToLibrary, addToLibrary, groomDataForToolForm, toolsSchema]);

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   const handleShowPluginPaths = (e) => {
      e.preventDefault();
      setShowPluginPaths(!showPluginPaths);
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

   const handleAddPluginLocationInput = (e) => {
      e.preventDefault();
      setShowPluginPaths(true);
      setShowPluginPathSaveButton(true);
      setPluginPathsObj((prevState) => {
         const newState = { ...prevState };
         newState[e.target.name] = e.target.value;
         return newState;
      });
   };

   const handleSaveLocationsButton = (e) => {
      console.log(
         "%c⚪️►►►► %cline:143%chandleSaveLocationsButton",
         "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
         "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
         "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
         pluginPathsObj
      );
      updateUserPluginPaths(user, pluginPathsObj);
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

   const handleFindNewPluginsButton = (e) => {
      setActivateLoader(true);
      setFindNewPlugins(!findNewPlugins);
   };
   const handleAddToLibraryButton = () => {
      setActivateLoader(true);
      setSendToLibrary(true);
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
         <button
            className={Styles["find-new-plugins-button"]}
            onClick={handleFindNewPluginsButton}
         >
            {findNewPlugins && <span> Close</span>} Local Plugin Finder
         </button>

         <div className={Styles["plugin-finder-selector-wrap"]}>
            <ul>
               {activateLoader > 0 && (
                  <div key="loader" className={Styles["loader-wrap"]}>
                     <BarLoader />
                  </div>
               )}

               {findNewPlugins && (
                  <Fragment>
                     {fileNames.length > 0 && (
                        <h3>
                           {fileNames.length} new plugins found on this
                           computer.
                        </h3>
                     )}

                     {showHidePluginPathsButton && (
                        <button
                           className={Styles["url-show-paths-button"]}
                           onClick={handleShowPluginPaths}
                        >
                           Show Plugin Paths
                        </button>
                     )}

                     {!showHidePluginPathsButton && (
                        <p>
                           * Please paste in the paths to each plugin location
                           on your system *
                        </p>
                     )}
                     {(showPluginPaths || noPluginPathsExist) && (
                        <div className={Styles["url-input-container"]}>
                           <div className={Styles["location-input-container"]}>
                              <label htmlFor="location-1">
                                 Plugin Location 1
                              </label>
                              <input
                                 name="location-1"
                                 type="text"
                                 defaultValue={
                                    Object.hasOwn(pluginPathsObj, "location-1")
                                       ? pluginPathsObj["location-1"]
                                       : ""
                                 }
                                 onChange={handleAddPluginLocationInput}
                              />
                           </div>{" "}
                           <div className={Styles["location-input-container"]}>
                              <label htmlFor="location-2">
                                 Plugin Location 2
                              </label>
                              <input
                                 name="location-2"
                                 type="text"
                                 defaultValue={
                                    Object.hasOwn(pluginPathsObj, "location-2")
                                       ? pluginPathsObj["location-2"]
                                       : ""
                                 }
                                 onChange={handleAddPluginLocationInput}
                              />{" "}
                           </div>{" "}
                           <div className={Styles["location-input-container"]}>
                              <label htmlFor="location-3">
                                 Plugin Location 3
                              </label>
                              <input
                                 name="location-3"
                                 type="text"
                                 defaultValue={
                                    Object.hasOwn(pluginPathsObj, "location-3")
                                       ? pluginPathsObj["location-3"]
                                       : ""
                                 }
                                 onChange={handleAddPluginLocationInput}
                              />{" "}
                           </div>{" "}
                           <div className={Styles["location-input-container"]}>
                              <label htmlFor="location-4">
                                 Plugin Location 4
                              </label>
                              <input
                                 name="location-4"
                                 type="text"
                                 defaultValue={
                                    Object.hasOwn(pluginPathsObj, "location-4")
                                       ? pluginPathsObj["location-4"]
                                       : ""
                                 }
                                 onChange={handleAddPluginLocationInput}
                              />
                           </div>
                           {showPluginPathSaveButton &&
                              Object.keys(pluginPathsObj).length > 0 && (
                                 <button onClick={handleSaveLocationsButton}>
                                    Save Plugin Location Changes
                                 </button>
                              )}
                        </div>
                     )}

                     <div className={Styles["button-container"]}>
                        <label
                           htmlFor="select-none"
                           onClick={handleClearAllCheckBox}
                        >
                           <input type="checkbox" name="select-none" />
                           Clear All
                        </label>

                        {fileNames.length > 20 && (
                           <label
                              htmlFor="select-twenty"
                              onClick={handleCheckSomeCheckBox}
                              data-amount="20"
                           >
                              <input type="checkbox" name="select-twenty" />
                              Select First Twenty Items
                           </label>
                        )}
                        {fileNames.length > 50 && (
                           <label
                              htmlFor="select-fifty"
                              onClick={handleCheckSomeCheckBox}
                              data-amount="50"
                           >
                              <input type="checkbox" name="select-fifty" />
                              Select First Fifty Items
                           </label>
                        )}

                        {fileNames.length > 0 && (
                           <label
                              htmlFor="select-all"
                              onClick={handleCheckAllCheckBox}
                           >
                              <input type="checkbox" name="select-all" />
                              Select All
                           </label>
                        )}
                     </div>
                     <button
                        className={Styles["add-to-library-button"]}
                        onClick={handleAddToLibraryButton}
                     >
                        Add to Library &rarr;
                     </button>
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
                                 checked={addToLibrary.includes(fileName)}
                              />
                              {fileName}
                           </label>
                        </li>
                     ))}
                  </Fragment>
               )}
            </ul>
         </div>
         {userFilesToGroomArray && (
            <div className={Styles["plugin-finder-modal"]}>
               <button
                  key={"addtoolformelms-5"}
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
                     ignoreFormOpen={true}
                     setFormParentOpen={false}
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
