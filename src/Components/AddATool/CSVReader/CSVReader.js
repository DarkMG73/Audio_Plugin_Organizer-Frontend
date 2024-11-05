import styles from "./CSVReader.module.css";
import { useCSVReader } from "react-papaparse";
import useGroomDataForToolForm from "../../../Hooks/useGroomDataForToolForm";

export default function CSVReader(props) {
  const { CSVReader } = useCSVReader();
  const groomCSVOutput = useGroomDataForToolForm()




  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  return (
    <CSVReader
      onUploadAccepted={(results) => {
        const groomedCSVOutput = groomCSVOutput(results.data);
        props.setFileUploadArray(groomedCSVOutput);
      }}
    >
      {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }) => (
        <>
          <div className={styles["csv-reader"]}>
            <button
              type="button"
              {...getRootProps()}
              className={styles["browse-file"]}
            >
              CSV Upload
            </button>
            <div className={styles["accepted-file"]}>
              <ProgressBar
                key={"progress-bar"}
                className={styles["progress-bar-background-color"]}
              />
              {acceptedFile && acceptedFile.name}
            </div>
            {false && (
              <button {...getRemoveFileProps()} className={styles.remove}>
                Remove
              </button>
            )}
          </div>
        </>
      )}
    </CSVReader>
  );
}
