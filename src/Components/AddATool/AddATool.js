import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AddATool.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAToolForm from "./AddAToolForm";
import CSVReader from "./CSVReader/CSVReader";
import Register from "../User/Register/Register";
import LoginStatus from "../User/LoginStatus/LoginStatus";

function AddATool(props) {
  const { allTools } = useSelector((state) => state.toolsData);
  const user = useSelector((state) => state.auth);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [fileUploadArray, setFileUploadArray] = useState(false);

  useEffect(() => {
    if (Object.keys(allTools).includes("error")) {
      setShowAddQuestionForm(true);
    }
  }, []);

  function showNewQuestionFormButtonHandler() {
    setShowAddQuestionForm(!showAddQuestionForm);
  }

  return (
    <div id="add-a-tool-outer-wrap" className={styles["add-a-tool-outer-wrap"]}>
      <div id="add-a-tool-container" className={styles["add-a-tool-container"]}>
        <h2 className="section-title">Add A Tool Here</h2>
        <p className={styles["add-a-tool-intro"]}>
          To add an item, simply click the <i>Show the Entry Form</i> button and
          fill out the small form. Feel free to click the "Add Another Form"
          button to create as many forms as needed to add multiple question at
          once. When they are all ready, click the <i>Submit</i> button.
        </p>

        <div
          id="db-login-container"
          className={`${styles["inner-wrap "]}  ${styles["db-login-container"]}`}
        >
          <LoginStatus />
          {!user && (
            <div
              className={`${styles["not-logged-in-error"]} ${styles["form-container"]}`}
            >
              <p>
                You must be logged in to access to submit a production tool to
                the database. If you do not have an account, the tool will be
                emailed to the site admin for review before it is entered into
                he database .
              </p>
            </div>
          )}
          {showAddQuestionForm && (
            <AddAToolForm
              saveOrUpdateData="save"
              setFormParentOpen={setShowAddQuestionForm}
            />
          )}
          {fileUploadArray && (
            <AddAToolForm
              saveOrUpdateData="save"
              formData={fileUploadArray}
              setFormParentOpen={setShowAddQuestionForm}
            />
          )}
        </div>
        <div className={styles["button-container"]}>
          <h4>Poduction Tool Entry Form</h4>
          <PushButton
            inputOrButton="button"
            id="create-entry-btn"
            colorType="secondary"
            value="Add a Question"
            data=""
            size="medium"
            onClick={showNewQuestionFormButtonHandler}
          >
            {showAddQuestionForm && (
              <span>
                <b>Cancel</b> the Entry Form
              </span>
            )}
            {!showAddQuestionForm && <span>Show the Entry Form</span>}
          </PushButton>
          <h4>Upload a CSV Spreadsheet</h4>

          <div className={styles["cvs-buttons-container"]}>
            <CSVReader setFileUploadArray={setFileUploadArray} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddATool;
