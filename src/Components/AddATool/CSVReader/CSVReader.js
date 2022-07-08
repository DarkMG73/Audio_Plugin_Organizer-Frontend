import React, { useState, useEffect } from "react";
import styles from "./CSVReader.module.css";
import { useCSVReader } from "react-papaparse";
import GetPluginFormInputsWithOptions from "../../../Hooks/GetPluginFormInputsWithOptions";
import BarLoader from "../../../UI/Loaders/BarLoader/BarLoader";

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
        assembledRow[categoryTitles[i].trim()] = value
          .replaceAll("^", ",")
          .trim();
      });
      outputArray.push(assembledRow);
    });
    outputArray.shift();
    return outputArray;
  };

  const groomCSVOutput = (csvOutputArray) => {
    const pairedObjectsArray = createKeyValueObjectsArray(csvOutputArray);
    const duplicateFunctionOptions = [];
    const outputArray = [];

    pairedObjectsArray.forEach((row) => {
      const rowGroup = [];
      let assembledRow = {};

      formInputData.forEach((inputData, i) => {
        assembledRow = { ...inputData };
        if (inputData.name === "notes") {
          let rowData = row[inputData.name];
          rowData = decodeURI(rowData);
          assembledRow.preFilledData = row[inputData.name] ? rowData : "";
        } else if (
          (typeof row[inputData.name] != "undefined" &&
            row.hasOwnProperty(inputData.name) &&
            row[inputData.name].constructor === Boolean) ||
          (typeof row[inputData.name] != "undefined" &&
            inputData.options.includes("true") &&
            inputData.options.includes("false"))
        ) {
          if (row[inputData.name].toLowerCase() == false) {
            assembledRow.preFilledData = "false";
          } else if (row[inputData.name].toLowerCase() == true) {
            assembledRow.preFilledData = "true";
          } else {
            assembledRow.preFilledData = row[inputData.name].toLowerCase();
          }
        } else if (inputData.name === "functions") {
          // See if row[inputData.name], which is an array, has an item that is equal to any of the set options. To do this, we need to compare the option item after the tilde ( ~) )

          if (!row[inputData.name] && row[inputData.name] != "") return;
          const tempFunctionOptionsArray = row[inputData.name]
            .split("/")
            .map((element) => element.trim())
            .filter((element) => element !== "");
          row[inputData.name] = [...tempFunctionOptionsArray];

          //  loop through row[inputData.name]
          const groomedFunctionsOptions = row[inputData.name].map(
            (rowFunctionOption) => {
              // loop through all of the function options
              for (const functionOption of inputData.options) {
                // break each function option down into part after the tilde (~)
                let optionGroup = "User Added";
                let functionOptionName = functionOption;

                if (functionOption.includes("~")) {
                  [optionGroup, functionOptionName] = functionOption.split("~");
                  optionGroup = optionGroup.trim();
                  functionOptionName = functionOptionName.trim();
                }

                // compare the this with the row variable
                // if they match, push the prefilled data array variable with the information plus the group info preceding it.
                if (rowFunctionOption === functionOptionName) {
                  return optionGroup + " ~ " + functionOptionName;
                } // if they do not match, let pass to next in loop
              }

              // if at the end of the loop nothing matches, just assign the "User ~ " group and the info an array and assign that to the prefilled array.
              assembledRow.options.push("User Added ~ " + rowFunctionOption);

              return "User Added" + " ~ " + rowFunctionOption;
            }
          );

          assembledRow.preFilledData = groomedFunctionsOptions;

          const removeUngroomedOptions = [...assembledRow.options];

          // Groom user added options
          removeUngroomedOptions.forEach((optionToRemove) => {
            if (!optionToRemove.includes("~")) {
              if (duplicateFunctionOptions.includes(optionToRemove.trim())) {
                assembledRow.options.splice(
                  assembledRow.options.indexOf(optionToRemove),
                  1
                );
              } else {
                assembledRow.options[
                  assembledRow.options.indexOf(optionToRemove)
                ] = "User Added" + " ~ " + optionToRemove;
              }
            } else {
              let [optionGroup, optionName] = optionToRemove.split("~");
              optionGroup = optionGroup.trim();
              optionName = optionName.trim();

              if (duplicateFunctionOptions.includes(optionName)) {
                assembledRow.options.splice(
                  assembledRow.options.indexOf(
                    "User Added" + " ~ " + optionToRemove
                  ),
                  1
                );
              }
            }
          });

          const tempAssembledRowOptions = [...assembledRow.options];
          tempAssembledRowOptions.forEach((optionOne) => {
            // Separate the first options
            let [optionOneGroup, optionOneName] = optionOne.split("~");
            optionOneGroup = optionOneGroup.trim();
            optionOneName = optionOneName.trim();
            // Remove any blanks
            if (optionOneName === "" || optionOneName === " ") {
              assembledRow.options.splice(
                assembledRow.options.indexOf(optionOne),
                1
              );
              return;
            }
            // Loop through assembledRow.options and remove any user-added duplicates
            if (optionOneGroup === "User Added") {
              let foundCount = 0;
              assembledRow.options.forEach((rowOption) => {
                let [rowOptionGroup, rowOptionName] = rowOption.split("~");
                rowOptionGroup = rowOptionGroup.trim();
                rowOptionName = rowOptionName.trim();

                if (optionOneName === rowOptionName) {
                  foundCount++;
                  if (foundCount > 1) {
                    assembledRow.options.splice(
                      assembledRow.options.indexOf(optionOne),
                      1
                    );
                  }
                }
              });
            }
          });
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
              <ProgressBar
                key={"progress-bar"}
                className={styles["progress-bar-background-color"]}
              />
              {acceptedFile && acceptedFile.name}
            </div>
            <button {...getRemoveFileProps()} className={styles.remove}>
              Remove
            </button>
          </div>
        </>
      )}
    </CSVReader>
  );
}
