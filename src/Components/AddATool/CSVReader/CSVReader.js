import React from "react";
import styles from "./CSVReader.module.css";
import { useCSVReader } from "react-papaparse";
import { formInputData } from "../../../data/formInputData";

export default function CSVReader(props) {
  const { CSVReader } = useCSVReader();

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
    console.log(
      "%c --> %cline:24%cpairedObjectsArray",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
      pairedObjectsArray
    );

    const outputArray = [];
    pairedObjectsArray.forEach((row) => {
      console.log(
        "%c --> %cline:29%crow",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
        row
      );
      const rowGroup = [];
      let assembledRow = {};
      formInputData.forEach((inputData, i) => {
        console.log(
          "%c --> %cline:32%cinputData",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
          inputData
        );
        assembledRow = { ...inputData };
        console.log(
          "%c --> %cline:54%c_____________________",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px"
        );

        console.log(
          "%c --> %cline:29%crow",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
          row
        );
        console.log(
          "%c --> %cline:54%cinputData.title",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px",
          inputData.name
        );
        console.log(
          "%c --> %cline:67%crow[inputData.title]",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
          row[inputData.name]
        );
        console.log(
          "%c --> %cline:67%crow[inputData.title]",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
          row["name"]
        );

        assembledRow.preFilledData = row[inputData.name]
          ? row[inputData.name]
          : "";
        console.log(
          "%c --> %cline:70%cassembledRow",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px",
          assembledRow
        );
        console.log(
          "%c --> %cline:54%c_____________________",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px"
        );
        rowGroup.push(assembledRow);
      });
      outputArray.push(rowGroup);
    });
    return outputArray;
  };

  return (
    <CSVReader
      onUploadAccepted={(results) => {
        console.log("---------------------------");
        console.log(results);
        console.log("---------------------------");
        const groomedCSVOutput = groomCSVOutput(results.data);
        console.log(
          "%c --> %cline:27%cgroomedCSVOutput",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px",
          groomedCSVOutput
        );
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
