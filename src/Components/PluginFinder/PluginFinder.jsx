import React, { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import Styles from "./PluginFinder.module.css";
import { getLocalPluginData } from "../../storage/audioToolsDB";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import AddAToolForm from "../AddATool/AddAToolForm";
import useGroomDataForToolForm from "../../Hooks/useGroomDataForToolForm";

const PluginFinder = () => {
   const { allTools } = useSelector((state) => state.toolsData);
   const acceptedPluginWrappers = ["vst", "vst3", "component"];
   const [fileNames, setFileNames] = useState([]);
   const [addToLibrary, setAddToLibrary] = useState([]);
   const [userFilesToGroomArray, setUserFilesToGroomArray] = useState(false);
   const [sendToLibrary, setSendToLibrary] = useState(false);
   const [findNewPlugins, setFindNewPlugins] = useState(false);
   const groomDataForToolForm = useGroomDataForToolForm();
   const toolsSchema = useSelector((state) => state.toolsData.toolsSchema);
   const [activateLoader, setActivateLoader] = useState(false);

   useEffect(() => {
      if (findNewPlugins) {
         setActivateLoader(true);
         getLocalPluginData()
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

               setActivateLoader(false);
            })
            .catch((err) => {
               setActivateLoader(false);
               console.log("err->", err);
            });
      } else {
         setActivateLoader(false);
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
      setActivateLoader(false);
   }, [sendToLibrary, addToLibrary, groomDataForToolForm, toolsSchema]);

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
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

                        <label
                           htmlFor="select-all"
                           onClick={handleCheckAllCheckBox}
                        >
                           <input type="checkbox" name="select-all" />
                           Select All
                        </label>
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
