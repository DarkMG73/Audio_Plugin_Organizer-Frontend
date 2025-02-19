import styles from "./CSVReader.module.css";
import { useCSVReader } from "react-papaparse";
import useGroomDataForToolForm from "../../../Hooks/useGroomDataForToolForm";

export default function CSVReader(props) {
   const { CSVReader } = useCSVReader();
   const groomCSVOutput = useGroomDataForToolForm();

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   return (
      <CSVReader
         onUploadAccepted={(results) => {
            const groomedCSVOutput = groomCSVOutput(results.data);

            // Remove entries with empty Name fields
            const cleanGroomedCSVOutput = groomedCSVOutput.filter(
               (entry) => entry[0].name === "name" && entry[0].preFilledData
            );

            props.setFileUploadArray(cleanGroomedCSVOutput);
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
                  {props.showFileName && (
                     <div className={styles["accepted-file"]}>
                        <ProgressBar
                           key={"progress-bar"}
                           className={styles["progress-bar-background-color"]}
                        />
                        {acceptedFile && acceptedFile.name}
                     </div>
                  )}
                  {/* {false && (
              <button {...getRemoveFileProps()} className={styles.remove}>
                Remove
              </button>
            )} */}
               </div>
            </>
         )}
      </CSVReader>
   );
}
