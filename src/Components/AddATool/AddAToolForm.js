import { useState, useEffect, Fragment } from "react";
import styles from "./AddAToolForm.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAToolFormElms from "./AddAToolFormElms";
import { sha256 } from "js-sha256";
// import { addDocToDB } from "../../storage/firebase.config";
import { savePlugin, updateAPlugin } from "../../storage/MongoDb";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";

function AddAToolForm(props) {
  // const userLoggedIn = useSelector((state) => state.loginStatus.userLoggedIn);
  var userLoggedIn = true;
  const [requiredError, setRequiredError] = useState(false);
  const [formJSX, setFormJSX] = useState([
    <AddAToolFormElms
      key={"addatoolformcomponent-1"}
      formData={props.formData}
      setFormParentOpen={props.setFormParentOpen}
      cancelButtonStyles={props.cancelButtonStyles}
      requiredError={props.requiredError}
    />,
  ]);

  useEffect(() => {
    setFormJSX([
      <AddAToolFormElms
        key={"addatoolformcomponent-2"}
        formData={props.formData}
        setFormParentOpen={props.setFormParentOpen}
        cancelButtonStyles={props.cancelButtonStyles}
        requiredError={props.requiredError}
      />,
    ]);
  }, [requiredError]);

  function addAnotherQuestionFormButtonHandler(e) {
    e.preventDefault();
    setFormJSX([
      ...formJSX,
      <AddAToolFormElms
        key={"addatoolformcomponent-3"}
        setFormParentOpen={props.setFormParentOpen}
        cancelButtonStyles={props.cancelButtonStyles}
        requiredError={props.requiredError}
      />,
    ]);
  }

  function submitButtonHandler(e) {
    e.preventDefault();
    // setRequiredError(false);
    const data = new FormData(e.target.closest("form#add-quest-form"));
    let dataEntries = [...data.entries()];
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
        const arrayOfStrings = entry[1].split("/");
        arrayOfStrings.forEach((value) => {
          sortedDataEntries.push([entry[0], value.replace("~", "")]);
        });
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
      const newId = sortedDatedEntriesArray[i]._id
        ? sortedDatedEntriesArray[i]._id
        : year + "-" + hasId;
      toolsGroomed[newId] = sortedDatedEntriesArray[i];
      toolsGroomed[newId].id = newId;

      if (sortedDatedEntriesArray[i].hasOwnProperty("_id"))
        delete sortedDatedEntriesArray[i]._id;
    }

    // Access FormData fields with `data.get(fieldName)`
    // For example, converting to upper case
    // data.set('username', data.get('username').toUpperCase());

    let tripsThrough = [];

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

        if (props.saveOrUpdateData === "save")
          savePlugin(theData, true).then((res) => {
            if (res.status && res.status < 299) {
              tripsThrough.push(key);
              const numberOfEntriestoAdd = Object.keys(toolsGroomed).length;

              if (numberOfEntriestoAdd <= tripsThrough.length) {
                if (
                  window.confirm(
                    "Do you want to refresh to ensure all changes are loaded?"
                  )
                ) {
                  window.location.reload();
                }
              }
              // GatherToolData().then((data) => {
              //   console.log("🟣 | getData | questionsFromDB", data);
              //   dispatch(audioToolDataActions.initState(data));
              //   props.setFormParentOpen(false);
              // });
            } else if (res.response.status === 404) {
              alert(
                "IS THE NAME UNIQUE? There was an error when trying to save the new entry. This was most likely caused by trying to add the entry with the same name as an existing tool. Make sure you do not already have this one saved. If it is a different tool that happens to have the same exact name as one you already have saved, please alter this name in some way. The name must be unique."
              );
            } else {
              alert(
                "There was an error when trying to save the new entry. Here is the message from the server: ",
                res.data.message
              );
            }
          });
        if (props.saveOrUpdateData === "update")
          updateAPlugin(theData.id, theData, true).then((res) => {
            if (res.status < 299) {
              // window.location.reload();
              // GatherToolData().then((data) => {
              //   console.log("🟣 | getData | questionsFromDB", data);
              //   dispatch(audioToolDataActions.initState(data));
              //   props.setFormParentOpen(false);
              // });
            } else {
              alert(
                "There was an error when trying to update this production tool. If the problem continues, please contact the website administrator. Here is the message from the server: ",
                res.data.message
              );
            }
          });
      } else {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A New Plugin Request for the Production Tool Organizer";
        const body = `A new tool is being offered: ${JSON.stringify(theData)}`;
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
      <div key={"addatoolform-4"} className={styles["inner-wrap"]}>
        {formJSX.map((formElms, i) => (
          <Fragment key={"addatoolformcomponent-5"}>
            <CardPrimary
              key={"addatoolform-2" + i}
              styles={{
                position: "relative",
                maxHeight: "100%",
                overflow: "scroll",
                display: "block",
                background: "var(--iq-color-foreground)",
              }}
            >
              {props.removeAddMoreButton && (
                <div
                  key={"addatoolform-3"}
                  className={styles["edit-buttons-wrap"]}
                >
                  <PushButton
                    key={"addatoolform-4"}
                    inputOrButton="input"
                    type="submit"
                    id="quest-submit-btn"
                    colorType="primary"
                    value="Submit"
                    data=""
                    size="small"
                    onClick={submitButtonHandler}
                    styles={{
                      ...props.buttonStyles,
                    }}
                  >
                    Submit
                  </PushButton>
                  <PushButton
                    key={"addatoolform-5"}
                    inputOrButton="input"
                    type="submit"
                    id="quest-submit-btn"
                    colorType="primary"
                    value="Delete"
                    data=""
                    size="small"
                    onClick={props.deleteToolButtonHandler}
                    styles={{
                      ...props.buttonStyles,
                      flexBasis: " 25%",
                      flexGrow: "1",
                      width: "90%",
                      maxWidth: " 93%",
                      fontSize: "1em",
                      color: "var( --iq-color-background-warm",
                      background: "var( --iq-color-foreground-gradient)",
                    }}
                  >
                    Delete
                  </PushButton>
                </div>
              )}
              {formElms}
            </CardPrimary>
          </Fragment>
        ))}
        {requiredError && (
          <div key={"addatoolform-6"} className={styles["error-text"]}>
            <p key={"addatoolform-7"}>
              Please make sure all required fields are filled out before
              submitting.
            </p>
          </div>
        )}
        {!props.removeAddMoreButton && (
          <Fragment key={"addatoolformcomponent-8"}>
            <PushButton
              key={"addatoolform-8"}
              inputOrButton="button"
              id="quest-submit-btn"
              colorType="primary"
              value="Add another Question"
              data=""
              size="large"
              onClick={addAnotherQuestionFormButtonHandler}
              styles={props.buttonStyles}
            >
              Add another Question
            </PushButton>
            <PushButton
              key={"addatoolform-9"}
              inputOrButton="input"
              type="submit"
              id="quest-submit-btn"
              colorType="primary"
              value="Submit"
              data=""
              size="large"
              onClick={submitButtonHandler}
              styles={props.buttonStyles}
            >
              Submit
            </PushButton>
          </Fragment>
        )}
      </div>
    </form>
  );
}
export default AddAToolForm;
