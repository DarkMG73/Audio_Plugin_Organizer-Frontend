import styles from "./OutputControls.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import useExportData from "../../Hooks/useExportData";
import { deleteAllPlugins } from "../../storage/audioToolsDB";

function OutputControls(props) {
  const exportData = useExportData();

  function exportCVSButtonHandler() {
    exportData({ type: "cvs" });
  }
  function exportJSONButtonHandler() {
    exportData({ type: "json" });
  }
  function resetDatabaseButtonHandler() {
    const confirmation = window.confirm(
      "Are you sure you want to erase all of the plugins from the database? This can not be undone. It might be a good idea to backup your data using the CSV export. This will enable you to add everything back easily, if you need.",
      'Should we continue permanent erasing all production tools from the database? Clicking "Confirm" erases the database and clicking "Cancel" will not erase the database.'
    );
    if (confirmation)
      deleteAllPlugins().then((res) => {
        if (res.status < 299) {
          window.location.reload();
        } else {
          alert(
            "There was an error when trying reset the database. Please try again laterIf the problem continues, please contact the website administrator. Here is the message from the server: ",
            res.response.data.message
          );
        }
      });
  }
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
