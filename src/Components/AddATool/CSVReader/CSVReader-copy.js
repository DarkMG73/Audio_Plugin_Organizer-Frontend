import React, { useState, useEffect } from "react";
import styles from "./CSVReader.module.css";
import { useCSVReader } from "react-papaparse";
import GetPluginFormInputsWithOptions from "../../../Hooks/GetPluginFormInputsWithOptions";

export default function CSVReader(props) {
  const { CSVReader } = useCSVReader();
  const [formInputData, setFormInputData] = useState(false);
  useEffect(() => {
    GetPluginFormInputsWithOptions().then((res) => {
      setFormInputData(res);
    });
  }, []);

  const createKeyValueObjectsArray = (csvOutputArray) => {
    const outputArray = [];
    const categoryTitles = csvOutputArray[0];
    csvOutputArray.forEach((row) => {
      const assembledRow = {};
      row.forEach((value, i) => {
        assembledRow[categoryTitles[i].trim()] = value.trim();
      });
      outputArray.push(assembledRow);
    });
    outputArray.shift();
    return outputArray;
  };

  const groomCSVOutput = (csvOutputArray) => {
    const pairedObjectsArray = createKeyValueObjectsArray(csvOutputArray);

    const outputArray = [];
    pairedObjectsArray.forEach((row) => {
      const rowGroup = [];
      let assembledRow = {};
      formInputData.forEach((inputData, i) => {
        assembledRow = { ...inputData };
        if (inputData.name === "favorite") {
          console.log(
            "%c --> %cline:38%cinputData.name === favorite",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
            inputData.name === "favorite"
          );
          if (row[inputData.name]) {
            console.log(
              "%c --> %cline:40%crow[inputData.name]",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
              row[inputData.name]
            );
            if (row[inputData.name].toLowerCase() == "true") {
              console.log(
                "%c --> %cline:41%crow[inputData.name].toLowerCase() ",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
                row[inputData.name].toLowerCase()
              );
              assembledRow.preFilledData = "true";
            } else {
              assembledRow.preFilledData = "false";
            }
          } else {
            assembledRow.preFilledData = "false";
          }
        } else {
          assembledRow.preFilledData = row[inputData.name]
            ? row[inputData.name]
            : "";
        }

        rowGroup.push(assembledRow);
      });
      outputArray.push(rowGroup);
    });
    return outputArray;
  };

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
              Browse file
            </button>
            <div className={styles["accepted-file"]}>
              {acceptedFile && acceptedFile.name}
            </div>
            <button {...getRemoveFileProps()} className={styles.remove}>
              Remove
            </button>
          </div>
          <ProgressBar className={styles["progress-bar-backgroundo-color"]} />
        </>
      )}
    </CSVReader>
  );
}
