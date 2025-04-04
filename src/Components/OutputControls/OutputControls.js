import { Fragment } from "react";
import { useSelector } from "react-redux";
import styles from "./OutputControls.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useExportData from "../../Hooks/useExportData";
import { deleteAllPlugins } from "../../storage/audioToolsDB";

function OutputControls(props) {
   const exportData = useExportData();
   const user = useSelector((state) => state.auth.user);
   function exportCVSButtonHandler() {
      exportData({ type: "cvs" });
   }
   function exportJSONButtonHandler() {
      exportData({ type: "json" });
   }
   function resetDatabaseButtonHandler() {
      window.DayPilot.confirm(
         'Are you sure you want to erase all of the plugins from the database? This can not be undone. It might be a good idea to backup your data using the CSV export. This will enable you to add everything back easily, if you need.<br/><br/>Should we continue permanent erasing all production tools from the database? Clicking "OK" erases the database and clicking "Cancel" will not erase the database.'
      )
         .then((args) => {
            if (!args.canceled) {
               window.DayPilot.confirm(
                  "Just double-checking: Are you absolutely sure you want to erase all of the plugins from the database? This can not be undone. It might be a good idea to backup your data using the CSV export. This will enable you to add everything back easily, if you need."
               )
                  .then(function (args) {
                     if (!args.canceled) {
                        window.DayPilot.prompt(
                           "Final confirmation: type the following word into the text input box below and then hit OK to delete all info form your library.<br/><br/>delete"
                        )
                           .then((args) => {
                              if (args.result === "delete")
                                 deleteAllPlugins(user)
                                    .then((res) => {
                                       if (res.status < 299) {
                                          window.location.reload();
                                       } else {
                                          console.log(
                                             "%c --> %cline:29%cThere was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: ",
                                             res.response.data
                                          );

                                          window.DayPilot.alert(
                                             "There was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                                                res.response?.data?.message
                                          );
                                       }
                                    })
                                    .catch((err) => {
                                       console.log(
                                          "%c --> %cline:47%cerr",
                                          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                                          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                                          "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px",
                                          err
                                       );
                                       window.DayPilot.alert(
                                          "There was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                                             err.response.status +
                                             " | " +
                                             err.response.data
                                       );
                                    });
                           })
                           .catch((err) => {
                              console.log(
                                 "%c --> %cline:47%cerr",
                                 "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                                 "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                                 "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px",
                                 err
                              );
                              window.DayPilot.alert(
                                 "There was an error when trying reset the database. Please try again later. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                                    err.response.status +
                                    " | " +
                                    err.response.data
                              );
                           });
                     }
                  })
                  .catch((e) => {
                     console.lof("Error: " + e);
                  });
            }
         })
         .catch((e) => {
            console.lof("Error: " + e);
         });
   }
   <Fragment>
      {" "}
      <h2 className={styles["section-title"]}>Clear Database</h2>
      <div
         className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
      >
         <PushButton
            inputOrButton="button"
            id="export-cvs-btn"
            colorType="secondary"
            value="session-record"
            data-value="export-cvs"
            size="medium"
            onClick={resetDatabaseButtonHandler}
         >
            Clear the Database (Reset)
         </PushButton>
      </div>
   </Fragment>;
   return (
      <div id="output-controls" className={styles["output-controls"]}>
         <h2 className={styles["section-title"]}>Backup Controls</h2>
         <div
            className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
         >
            <PushButton
               inputOrButton="button"
               id="export-cvs-btn"
               colorType="secondary"
               value="session-record"
               data-value="export-cvs"
               size="medium"
               onClick={exportCVSButtonHandler}
            >
               Export CVS
            </PushButton>
            <PushButton
               inputOrButton="button"
               id="export-json-btn"
               colorType="secondary"
               value="session-record"
               data-value="export-json"
               size="medium"
               onClick={exportJSONButtonHandler}
            >
               Export JSON
            </PushButton>
            <br />
            <br></br>
            <br></br>
         </div>

         <h2 className={styles["section-title"]}>Clear Database</h2>
         <div
            className={`${styles["inner-wrap"]} 
      ${styles["button-wrap"]} `}
         >
            <PushButton
               inputOrButton="button"
               id="export-cvs-btn"
               colorType="secondary"
               value="session-record"
               data-value="export-cvs"
               size="medium"
               onClick={resetDatabaseButtonHandler}
            >
               Clear the Database (Reset)
            </PushButton>
         </div>
         <br></br>
         <br></br>
      </div>
   );
}

export default OutputControls;
