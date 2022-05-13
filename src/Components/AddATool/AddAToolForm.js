import { useState } from "react";
import { useSelector } from "react-redux";
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
    <AddAQuestionFormElms requiredError={requiredError} />,
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

    const dataEntries = [...data.entries()];
    let foundRequiredError = false;
    dataEntries.forEach((entry) => {
      if (entry[0] === "name" && entry[1].length <= 0) {
        setRequiredError(true);
        foundRequiredError = true;
        return;
      }
    });
    if (foundRequiredError) return;
    let cnt = 0;
    const sortedDataEntriesObj = {};
    dataEntries.forEach((entry) => {
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
    const questions = sortedDatedEntriesArray;

    // Replace the temp ID's with a hash based on the question title
    const questionsGroomed = {};
    for (const i in questions) {
      const d = new Date();
      let year = d.getFullYear();
      const hasId = sha256(JSON.stringify(questions[i]));
      const newId = year + "-" + hasId;
      questionsGroomed[newId] = questions[i];
      questionsGroomed[newId].id = newId;
    }

    // Access FormData fields with `data.get(fieldName)`
    // For example, converting to upper case
    // data.set('username', data.get('username').toUpperCase());

    console.log(
      "%c --> %cline:80%cquestionsGroomed",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
      questionsGroomed
    );
    for (const key in questionsGroomed) {
      const theData = questionsGroomed[key];

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
