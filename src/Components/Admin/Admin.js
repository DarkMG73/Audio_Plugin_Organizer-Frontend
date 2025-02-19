import styles from "./Admin.module.css";
import { useState, useEffect, Fragment } from "react";
import ImageDownload from "./ImageDownload";
import SetImageURLS from "./SetImageURLS";
import FormInput from "../../UI/Form/FormInput/FormInput";
import { updateAppVersions } from "../../storage/versionDB";
import { dateAIsLaterThanB } from "../../Hooks/utility";
import Storage from "../../storage/storage";
import { getAdminNotes, updateAdminNotes } from "../../storage/adminDB";

const Admin = ({ appVersions, user, isDesktopApp }) => {
   const [adminToolsOpen, setAdminToolsOpen] = useState(false);
   const [showImageDownload, setShowImageDownload] = useState(false);
   const [setImageURLS, setSetImageURLS] = useState(false);
   const [versionFormData, setVersionFormData] = useState({});
   const [notesData, setNotesData] = useState("");
   const [notesDataFromDB, setNotesDataFromDB] = useState(false);
   const [saveNotesData, setSaveNotesData] = useState(false);
   const [notesNeedsToBeSaved, setNotesNeedsToBeSaved] = useState(false);
   const [submitVersionData, setSubmitVersionData] = useState(false);
   const [savedData, setSavedData] = useState([false]);
   const [currentVersionIsScheduled, setCurrentVersionIsScheduled] =
      useState(false);
   const [currentVersionNumberHigher, setCurrentVersionNumberHigher] =
      useState(false);
   const [releaseCheckboxes, setReleaseCheckboxes] = useState(
      Storage("GET", false, "adminReleaseChecklist") || []
   );
   const cleanStr = (str) => str.replaceAll(" ", "").replaceAll(".", "");
   const allDataIsSaved = (savedData, versionFormData) => {
      for (const [key, value] of Object.entries(versionFormData)) {
         if (value !== savedData[key]) {
            return false;
         }
      }
      return true;
   };
   const softwareReleaseChecklist = {
      prePush: [
         "Copy all changes to both the desktop and web app.",
         "Test desktop version.",
         "Test web version",
         "Set web version numbers in .env (and anywhere else needed). *** DO NOT SET THE DESKTOP VERSION NUMBER YET ***",
         "Build web version.",
         "Upload web build to production folder.",
         "Test web version in Production.",
         "Enter new version number in Admin Tools",
         "Enter new release date in Admin Tools",
         "Update message (if needed) in Admin Tools",
         "Update link (if needed) in Admin Tools",
         "Check all data is right (especially release date)",
         "*** Push desktop update. ***"
      ],
      postPush: [
         "Set version for desktop in VERSION.json",
         "Package Desktop version.",
         "Upload desktop version to download folder.",
         "Test desktop download in production."
      ]
   };

   const handleOpenAdminTools = () => {
      setAdminToolsOpen(!adminToolsOpen);
   };

   useEffect(() => {
      Storage("ADD", releaseCheckboxes, "adminReleaseChecklist");
   }, [releaseCheckboxes]);

   useEffect(() => {
      getAdminNotes()
         .then((data) => {
            setNotesDataFromDB(data);
         })
         .catch((e) => {
            console.log("Error --->", e);
         });
   }, []);

   useEffect(() => {
      if (notesDataFromDB) setNotesData(notesDataFromDB);
   }, [notesDataFromDB]);

   useEffect(() => {
      if (saveNotesData) {
         updateAdminNotes(user, notesData)
            .then((res) => {
               if (res.status < 400) {
                  window.DayPilot.alert("Admin Notes were successfully saved.");
               } else {
                  window.DayPilot.alert(
                     "There was a problem saving the Admin Notes.<br/><br/>Error " +
                        res.data?.message +
                        "<br/><br/>Error code " +
                        res.status
                  );

                  console.log("ERROR --->", res);
               }
            })
            .catch((e) => {
               console.log("ERROR --->", e);
               window.DayPilot.alert(
                  "There was a problem saving the Admin Notes: ",
                  e.data?.message
               );
            });
         setSaveNotesData(false);
         setNotesNeedsToBeSaved(false);
      }
   }, [saveNotesData]);

   useEffect(() => {
      if (appVersions) {
         const currentSetDate = Object.hasOwn(versionFormData, "desktopVersion")
            ? versionFormData.desktopVersion
            : appVersions.desktopVersion;
         const versionIsHigherThanProduction = Object.hasOwn(
            appVersions,
            "localData"
         )
            ? currentSetDate >
              (savedData.desktopVersion || appVersions.localData.versionNumber)
            : false;

         const versionIsScheduled = dateAIsLaterThanB(
            versionFormData.desktopVersionReleaseDate
               ? versionFormData.desktopVersionReleaseDate
               : appVersions.desktopVersionReleaseDate,
            new Date()
         );

         setCurrentVersionIsScheduled(versionIsScheduled);
         setCurrentVersionNumberHigher(versionIsHigherThanProduction);
      }
   }, [appVersions, versionFormData]);

   useEffect(() => {
      if (!submitVersionData) return;
      const newFormData = { ...appVersions };
      for (const [key, value] of Object.entries(versionFormData)) {
         newFormData[key] = value;
      }

      if (Object.hasOwn(newFormData, "localData")) delete newFormData.localData;
      if (Object.hasOwn(newFormData, "updatedAt")) delete newFormData.updatedAt;

      updateAppVersions(newFormData, user)
         .then((res) => {
            if (res.status < 400) {
               window.DayPilot.alert(
                  "The changes were successfully submitted."
               );

               setSavedData(res.data.doc);
            } else {
               window.DayPilot.alert(
                  "There was a problem saving the changes: " + res.status
               );

               console.log("ERROR --->", res);
            }
         })
         .catch((e) => {
            console.log("ERROR --->", e);
            window.DayPilot.alert(
               "There was a problem saving the changes: ",
               e
            );
         });
      setSubmitVersionData(false);
   }, [submitVersionData]);

   // useEffect(() => {
   //   if (appVersions) {

   //     setVersionFormData(...appVersions);
   //   }
   // }, [appVersions]);

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   const downloadPicsButtonHandler = () => {
      setShowImageDownload(!showImageDownload);
   };

   const setImageURLSButtonHandler = () => {
      setSetImageURLS(!setImageURLS);
   };

   const handleToggleReleaseCheckbox = (e) => {
      setReleaseCheckboxes((prevState) => {
         const oldState = [...prevState];
         const value = cleanStr(e.target.value);
         if (oldState.includes(value)) {
            return oldState.filter((item) => item !== value);
         } else {
            oldState.push(value);
            return oldState;
         }
      });
   };

   const handleNotesChange = (e) => {
      setNotesData(e.target.value);
      setNotesNeedsToBeSaved(true);
   };

   const handleSaveNotes = (e) => {
      setSaveNotesData(true);
   };

   const handleVersionFormChange = (e) => {
      const newVersionFormData = { ...versionFormData };
      newVersionFormData[e.target.name.replace("VFORM#", "")] = e.target.value;
      setVersionFormData(newVersionFormData);
   };

   const handleSubmitVersionForm = () => {
      window.DayPilot.confirm(
         "This will save the data, but will not push a new release. To push a new release, hit cancel and chnage the DesktopVersion and ReleaseDate to a higher and later value."
      )
         .then(function (args) {
            if (!args.canceled) {
               setSubmitVersionData(true);
            }
         })
         .catch((e) => {
            console.lof("Error: " + e);
         });
   };

   const handlePushNewVersion = () => {
      window.DayPilot.confirm(
         '*** THIS WILL PUSH A NEW VERSION ***<br/><br/> Before clicking "OK", make sure:\n-The DesktopVersion is a higher number\n AND \n- the ReleaseDate is a later date than right now.'
      )
         .then(function (args) {
            if (!args.canceled) {
               setSubmitVersionData(true);
            }
         })
         .catch((e) => {
            console.lof("Error: " + e);
         });
   };

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   return (
      <Fragment>
         <button
            type="button"
            onClick={handleOpenAdminTools}
            className={styles["admin-toggle-button"]}
         >
            {!adminToolsOpen && <span>Open</span>}{" "}
            {adminToolsOpen && <span>&darr; CLOSE</span>} Admin Tools
         </button>{" "}
         <div
            className={
               styles.backdrop + " " + (adminToolsOpen && styles["admin-open"])
            }
         ></div>
         <div
            className={
               styles["admin-container"] +
               " " +
               (adminToolsOpen && styles["admin-open"])
            }
         >
            <h3 key="home" className="section-title">
               Admin Tools
            </h3>
            {isDesktopApp && (
               <div className={styles["version-release-tools-container"]}>
                  <div className={styles["new-version-pre-release-container"]}>
                     <ul className={styles["new-version-release-checklist"]}>
                        <h3>Software Release Checklist</h3>
                        <h2>Pre-Push Checklist</h2>
                        {softwareReleaseChecklist.prePush.map((item) => (
                           <li
                              className={
                                 releaseCheckboxes.includes(cleanStr(item)) &&
                                 styles.checked
                              }
                           >
                              <input
                                 type="checkbox"
                                 id={item.replaceAll(" ", "")}
                                 name={item.replaceAll(" ", "")}
                                 value={item}
                                 checked={releaseCheckboxes.includes(
                                    cleanStr(item)
                                 )}
                                 onChange={handleToggleReleaseCheckbox}
                              />
                              <label for={item.replaceAll(" ", "")}>
                                 {item}
                              </label>
                              <br />
                           </li>
                        ))}

                        <h2>Post-Push Checklist</h2>
                        {softwareReleaseChecklist.postPush.map((item) => (
                           <li
                              className={
                                 releaseCheckboxes.includes(cleanStr(item)) &&
                                 styles.checked
                              }
                           >
                              <input
                                 type="checkbox"
                                 id={item.replaceAll(" ", "")}
                                 name={item.replaceAll(" ", "")}
                                 value={item}
                                 checked={releaseCheckboxes.includes(
                                    cleanStr(item)
                                 )}
                                 onChange={handleToggleReleaseCheckbox}
                              />
                              <label for={item.replaceAll(" ", "")}>
                                 {item}
                              </label>
                              <br />
                           </li>
                        ))}
                     </ul>
                     <div
                        className={
                           styles["new-version-pre-release-notes"] +
                           " " +
                           (notesNeedsToBeSaved && styles.highlight)
                        }
                     >
                        <h3>Pre-Release Notes</h3>
                        {notesData && (
                           <textarea
                              onChange={handleNotesChange}
                              value={notesData}
                           />
                        )}
                        <button
                           className={
                              styles["save-notes-button"] +
                              " " +
                              (notesNeedsToBeSaved && styles.pulse)
                           }
                           onClick={handleSaveNotes}
                        >
                           Save Notes
                        </button>
                     </div>
                  </div>{" "}
                  <h3>Push Software New Version</h3>
                  <div className={styles["version-release-alert-container"]}>
                     {((!currentVersionIsScheduled &&
                        currentVersionNumberHigher) ||
                        (currentVersionIsScheduled &&
                           !currentVersionNumberHigher)) && (
                        <div className={styles["version-release-alert"]}>
                           <h4>
                              Either the version number or release date needs to
                              be updated!
                           </h4>
                        </div>
                     )}
                     {currentVersionNumberHigher && (
                        <p className={styles["version-info-success"]}>
                           New Version number is set.
                        </p>
                     )}
                     {!currentVersionNumberHigher && (
                        <p className={styles["version-info-caution"]}>
                           Current version number needs to be set.
                        </p>
                     )}
                     {currentVersionIsScheduled && (
                        <p className={styles["version-info-success"]}>
                           New Version release date is set.
                        </p>
                     )}
                     {!currentVersionIsScheduled && (
                        <p className={styles["version-info-caution"]}>
                           Current version release date needs to be set.
                        </p>
                     )}
                  </div>
                  {!allDataIsSaved(savedData, versionFormData) &&
                     currentVersionIsScheduled &&
                     currentVersionNumberHigher && (
                        <div className={styles["ready-to-push-version"]}>
                           CURRENT VERSION IS READY BUT HAS NOT BEEN PUSHED!
                           <brk />
                           CLICK THE "PUSH NEW VERSION" BUTTON.
                        </div>
                     )}
                  <div className={styles["form-input-container"]}>
                     {appVersions &&
                        Object.entries(appVersions).map((entry) => {
                           if (entry[0] === "updatedAt") return;
                           if (typeof entry[1] === "string") {
                              return (
                                 <div
                                    className={
                                       Object.keys(versionFormData).includes(
                                          entry[0]
                                       ) &&
                                       versionFormData[entry[0]] !==
                                          appVersions[entry[0]] &&
                                       versionFormData[entry[0]] !==
                                          savedData[entry[0]] &&
                                       styles.highlight
                                    }
                                    data-elmid={entry[0]}
                                 >
                                    <FormInput
                                       key={entry[0]}
                                       formNumber={"VFORM"}
                                       inputDataObj={{
                                          name: entry[0],
                                          title: entry[0],
                                          type: "text",
                                          value: entry[1],
                                          preFilledData: entry[1],
                                          placeholder: entry[0]
                                       }}
                                       requiredError={{}}
                                       onChange={handleVersionFormChange}
                                       elmid={entry[0]}
                                    />
                                 </div>
                              );
                           } else {
                              return (
                                 <div className={styles["fixed-version-elms"]}>
                                    <label>{entry[0]}</label>;
                                    {Object.entries(entry[1]).map((item) => {
                                       return (
                                          <li>
                                             {item[0]}: {item[1]}
                                          </li>
                                       );
                                    })}
                                 </div>
                              );
                           }
                        })}
                     <div className={styles["new-version-button-container"]}>
                        {!currentVersionNumberHigher &&
                           Object.keys(versionFormData).length > 0 && (
                              <button
                                 className={
                                    styles["new-version-save-button"] +
                                    " " +
                                    (currentVersionIsScheduled &&
                                       currentVersionNumberHigher &&
                                       styles.pulse)
                                 }
                                 type="submit"
                                 onClick={handleSubmitVersionForm}
                              >
                                 Save Message, Link Text & Release Date
                              </button>
                           )}
                        {currentVersionNumberHigher &&
                           !allDataIsSaved(savedData, versionFormData) && (
                              <button
                                 className={
                                    styles["new-version-push-button"] +
                                    " " +
                                    (!currentVersionIsScheduled &&
                                       styles.prevent) +
                                    " " +
                                    (currentVersionIsScheduled &&
                                       currentVersionNumberHigher &&
                                       styles.pulse)
                                 }
                                 type="submit"
                                 onClick={handlePushNewVersion}
                              >
                                 Push New Version
                              </button>
                           )}
                     </div>
                  </div>
               </div>
            )}
            <div className={styles["other-tools-container"]}>
               <h3>Other Tools</h3>
               <div className={styles["new-version-button-container"]}>
                  <button onClick={downloadPicsButtonHandler}>
                     Download Pics
                  </button>
                  {showImageDownload && <ImageDownload />}
                  <button onClick={setImageURLSButtonHandler}>
                     Set IMage URL's
                  </button>
                  {setImageURLS && <SetImageURLS />}
               </div>
            </div>
         </div>
      </Fragment>
   );
};

export default Admin;
