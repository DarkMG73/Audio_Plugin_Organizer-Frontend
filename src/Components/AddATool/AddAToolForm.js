import { useState } from "react";
import styles from "./AddAToolForm.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAQuestionFormElms from "./AddAToolFormElms";
import { sha256 } from "js-sha256";
// import { addDocToDB } from "../../storage/firebase.config";
import { savePlugin } from "../../Hooks/DbInteractions";

function AddAToolForm(props) {
  // const userLoggedIn = useSelector((state) => state.loginStatus.userLoggedIn);
  var userLoggedIn = true;
  const [requiredError, setRequiredError] = useState(false);
  const [formJSX, setFormJSX] = useState([
    <AddAQuestionFormElms
      requiredError={requiredError}
      formData={props.formData}
    />,
  ]);

  function addAnotherQuestionFormButtonHandler(e) {
    e.preventDefault();
    setFormJSX([
      ...formJSX,
      <AddAQuestionFormElms requiredError={requiredError} />,
    ]);
  }

  function submitButtonHandler(e) {
    e.preventDefault();
    setRequiredError(false);
    const data = new FormData(e.target.parentNode);

    let dataEntries = [...data.entries()];
    let foundRequiredError = false;

    /////// Groom Data ///////
    // Convert string lists to arrays
    const entriesRequiringArrays = ["use", "precision", "color"];
    const sortedDataEntries = [];
    dataEntries.forEach((entry) => {
      if (!entriesRequiringArrays.includes(entry[0])) {
        sortedDataEntries.push(entry);
      } else {
        const arrayOfStrings = entry[1].split(",");
        arrayOfStrings.forEach((value) => {
          sortedDataEntries.push([entry[0], value]);
        });
      }
    });
    console.log(
      "%c --> %cline:46%csortedDataEntries",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
      sortedDataEntries
    );

    // Trim leading and trailing whitespace and add the id to preserve order reference
    let companySelections = [];
    sortedDataEntries.forEach((entry, i) => {
      sortedDataEntries[i][0] === "NEWGROUP" ||
        console.log(
          "%c --> %cline:62%csortedDataEntries[i][0]",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
          sortedDataEntries[i][0]
        );
      console.log(
        "%c --> %cline:66%csortedDataEntries[i][0].includes(URL)",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
        sortedDataEntries[i][0].includes("URL")
      );
      if (
        sortedDataEntries[i][0] === "NEWGROUP" ||
        sortedDataEntries[i][0].includes("URL")
      ) {
        sortedDataEntries[i][1] = sortedDataEntries[i][1].trim();
      } else {
        sortedDataEntries[i][1] = sortedDataEntries[i][1].trim().toLowerCase();
      }
      sortedDataEntries[i].push(i);
    });

    // Sort and remove unnecessary items
    let usedValues = { indexesToRemove: [] };
    sortedDataEntries.forEach((entry) => {
      // Make sure name field is filled out
      if (entry[0] === "name" && entry[1].length <= 0) {
        setRequiredError(true);
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
      }
      // Remove duplicates from all others
      else {
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
    if (foundRequiredError) return;

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

    // Replace the temp ID's with a hash based on the question title
    const toolsGroomed = {};
    for (const i in sortedDatedEntriesArray) {
      const d = new Date();
      let year = d.getFullYear();
      const hasId = sha256(JSON.stringify(sortedDatedEntriesArray[i]));
      const newId = year + "-" + hasId;
      toolsGroomed[newId] = sortedDatedEntriesArray[i];
      toolsGroomed[newId].id = newId;
    }

    // Access FormData fields with `data.get(fieldName)`
    // For example, converting to upper case
    // data.set('username', data.get('username').toUpperCase());

    console.log(
      "%c --> %cline:80%ctoolsGroomed",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
      toolsGroomed
    );
    for (const key in toolsGroomed) {
      const theData = toolsGroomed[key];

      if (userLoggedIn) {
        // addDocToDB(key, theData);
        // savePlugin({
        //   name: "TEST 2",
        //   company: "Kleinhelm",
        //   useCategories: ["compressor", "saturation"],
        //   color: ["vintage", "warm", "50's", "70's", "80's"],
        //   favorite: true,
        //   analog: true,
        //   precise: false,
        // });
        savePlugin(theData);
      } else {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject = "A New Question for the Interview Questions Tool";
        const body = `A new question is being offered: ${JSON.stringify(
          theData
        )}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${body}`
        );
      }

      //  TODO: Clear the form
      // const formEntries = document.querySelectorAll('.form-group-wrap');
      // formEntries.forEach(item => {
      //     item.parentNode.removeChild(item);
      // })
    }
  }

  return (
    <form action="" id="add-quest-form" className={styles["inner-wrap form"]}>
      <div className={styles["inner-wrap"]}>
        {formJSX.map((formElms) => formElms)}
        {requiredError && (
          <div className={styles["error-text"]}>
            <p>
              Please make sure all required fields are filled out before
              submitting.
            </p>
          </div>
        )}
        <PushButton
          inputOrButton="button"
          id="quest-submit-btn"
          colorType="primary"
          value="Add another Question"
          data=""
          size="small"
          onClick={addAnotherQuestionFormButtonHandler}
        >
          Add another Question
        </PushButton>
      </div>

      <PushButton
        inputOrButton="input"
        type="submit"
        id="quest-submit-btn"
        colorType="primary"
        value="Submit"
        data=""
        size="small"
        onClick={submitButtonHandler}
      >
        Submit
      </PushButton>
    </form>
  );
}
export default AddAToolForm;
