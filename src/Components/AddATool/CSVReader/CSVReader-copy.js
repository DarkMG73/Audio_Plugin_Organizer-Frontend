import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./CSVReader.module.css";
import { useCSVReader } from "react-papaparse";
import GetPluginFormInputsWithOptions from "../../../Hooks/GetPluginFormInputsWithOptions";

export default function CSVReader(props) {
  const { CSVReader } = useCSVReader();
  const [formInputData, setFormInputData] = useState(false);
  const toolsSchema = useSelector((state) => state.toolsData.toolsSchema);
  useEffect(() => {
    GetPluginFormInputsWithOptions(toolsSchema).then((res) => {
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
        if (
          inputData.name === "favorite" ||
          inputData.name === "oversampling"
        ) {
          if (row[inputData.name]) {
            if (row[inputData.name].toLowerCase() == "true") {
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
