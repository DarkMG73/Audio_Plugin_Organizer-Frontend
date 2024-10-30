import { sha256 } from "js-sha256";

const useGroomAudioFormData = () => {
  const outputFunction = (dataEntries) => {
    let foundRequiredError = false;

    /////// Groom Data ///////
    // Convert string lists to arrays
    const entriesRequiringArrays = ["functions", "precision", "color"];
    const entriesRequiringNumbers = ["rating"];
    const entriesRequiringBoolean = ["oversampling", "favorite"];
    const sortedDataEntries = [];

    let nameFieldsWithRequiredError = 0;
    dataEntries.forEach((entry) => {
      entry[0] = entry[0].substring(entry[0].indexOf("#") + 1);

      if (entriesRequiringNumbers.includes(entry[0])) {
        sortedDataEntries.push([entry[0], parseInt(entry[1])]);
      } else if (entriesRequiringBoolean.includes(entry[0])) {
        if (entry[1] === "True") {
          sortedDataEntries.push([entry[0], true]);
        } else {
          sortedDataEntries.push([entry[0], false]);
        }
      } else if (!entriesRequiringArrays.includes(entry[0])) {
        sortedDataEntries.push(entry);
      } else if (entry[0] === "notes") {
        sortedDataEntries.push([entry[0], entry[1].replace(/[^\w\s]/gi, "")]);
      } else {
        if (entry[1].length === 0) {
          sortedDataEntries.push([entry[0], []]);
        } else {
          const arrayOfStrings = entry[1].split("/");
          arrayOfStrings.forEach((value) => {
            sortedDataEntries.push([entry[0], value.replace("~", "")]);
          });
        }
      }
    });

    // Trim leading and trailing whitespace and add the id to preserve order reference
    let companySelections = [];
    sortedDataEntries.forEach((entry, i) => {
      if (
        sortedDataEntries[i][0] === "NEWGROUP" ||
        sortedDataEntries[i][0].includes("URL")
      ) {
        sortedDataEntries[i][1] = sortedDataEntries[i][1].trim();
      } else if (
        sortedDataEntries[i][1].constructor === Array ||
        sortedDataEntries[i][1].constructor === Boolean ||
        sortedDataEntries[i][1].constructor === Number
      ) {
        sortedDataEntries[i][1] = sortedDataEntries[i][1];
      } else {
        sortedDataEntries[i][1] = sortedDataEntries[i][1].trim();
      }
      sortedDataEntries[i].push(i);
    });

    // Sort and remove unnecessary items
    let usedValues = { indexesToRemove: [] };
    sortedDataEntries.forEach((entry) => {
      // Make sure name field is filled out

      if (entry[0] === "name" && entry[1].length <= 0) {
        // setRequiredError(true);
        nameFieldsWithRequiredError++;
        foundRequiredError = true;
        return;
      }

      // If multiple companies put in, keep only one
      if (entry[0] === "NEWGROUP") {
        // Mark begining of new group in companySelections
        companySelections.push("NEWGROUP");

        // Reset group used term log for each NEWGROUP element in usedValues
        usedValues = { indexesToRemove: [...usedValues.indexesToRemove] };
      } else if (entry[0] === "company") {
        companySelections.push(entry[2]);
      } else {
        if (usedValues.hasOwnProperty(entry[0])) {
          if (usedValues[entry[0]].includes(entry[1])) {
            usedValues.indexesToRemove.push(entry[2]);
          } else {
            usedValues[entry[0]].push(entry[1]);
          }
        } else {
          usedValues[entry[0]] = [entry[1]];
        }
      }
    });

    // If there are not enough character in the "name" field, exit
    if (foundRequiredError) {
      alert(
        "Unfortunately, " +
          nameFieldsWithRequiredError +
          '  "Name" field(s) remain blank. Every entry is required to have a name. In addition, that name can not be the same as any production tool name that you currently have in the database or  that is being submitted now. This is to prevent duplicate production tools. If two different tools do happen to have the same name, please slightly alter one name to make it unique.'
      );
      return;
    }

    // Reduce companySelections to only company entries in excess of one per group
    let newGroupCounter = 0;
    const companySelectionsFiltered = companySelections.filter((id) => {
      if (id === "NEWGROUP") newGroupCounter = 0;
      if (newGroupCounter === 0 || newGroupCounter === 1) {
        newGroupCounter++;
        return false;
      }
      newGroupCounter++;
      return true;
    });

    // If duplicates, remove those entries
    const dataEntriesOutput = sortedDataEntries.filter((entry) => {
      // if There are more than one company added, keep only first
      if (companySelectionsFiltered.includes(entry[2])) return false;
      // If duplicates, remove those entries
      if (usedValues.indexesToRemove.includes(entry[2])) return false;
      return true;
    });

    // Process each form group separately
    let cnt = 0;
    const sortedDataEntriesObj = {};
    dataEntriesOutput.forEach((entry) => {
      if (entry[0] === "NEWGROUP") {
        cnt++;
        sortedDataEntriesObj[cnt] = {};
      } else if (
        sortedDataEntriesObj[cnt].hasOwnProperty(entry[0]) &&
        Array.isArray(sortedDataEntriesObj[cnt][entry[0]])
      ) {
        sortedDataEntriesObj[cnt][entry[0]].push(entry[1]);
      } else if (sortedDataEntriesObj[cnt].hasOwnProperty(entry[0])) {
        sortedDataEntriesObj[cnt][entry[0]] = [
          sortedDataEntriesObj[cnt][entry[0]],
          entry[1],
        ];
      } else {
        sortedDataEntriesObj[cnt][entry[0]] = entry[1];
      }
    });
    const sortedDatedEntriesArray = [];
    for (const key in sortedDataEntriesObj) {
      sortedDatedEntriesArray.push(sortedDataEntriesObj[key]);
    }

    // Replace the temp ID's with a hash based on the tool title
    const toolsGroomed = {};

    for (const i in sortedDatedEntriesArray) {
      const d = new Date();
      let year = d.getFullYear();
      const hasId = sha256(JSON.stringify(sortedDatedEntriesArray[i]));
      const newId = sortedDatedEntriesArray[i].identifier
        ? sortedDatedEntriesArray[i].identifier
        : year + "-" + hasId;

      toolsGroomed[newId] = sortedDatedEntriesArray[i];
      toolsGroomed[newId].identifier = newId;

      if (sortedDatedEntriesArray[i].hasOwnProperty("_id")) {
        sortedDatedEntriesArray[i].dbID = sortedDatedEntriesArray[i]._id;
        delete sortedDatedEntriesArray[i]._id;
      }
    }

    return toolsGroomed;
  };
  return outputFunction;
};

export default useGroomAudioFormData;
