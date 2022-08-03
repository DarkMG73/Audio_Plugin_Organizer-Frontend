import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AddATool.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAToolForm from "./AddAToolForm";
import CSVReader from "./CSVReader/CSVReader";
import Register from "../User/Register/Register";
import LoginStatus from "../User/LoginStatus/LoginStatus";
import AudioPluginSelector from "../AudioPluginSelector/AudioPluginSelector";

function AddATool(props) {
  const { allTools, goToAddATool } = useSelector((state) => state.toolsData);
  const user = useSelector((state) => state.auth.user);
  const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);
  const [showAddFromLibrary, setShowAddFromLibrary] = useState(false);
  const [fileUploadArray, setFileUploadArray] = useState(false);
  const doNotShowTitle = props.doNotShowTitle;
  const doNotShowWelcomeMessage = props.doNotShowWelcomeMessage;
  const doNotShowAddButtons = props.doNotShowAddButtons;
  const doNotShowLogin = props.doNotShowLogin;
  const [renderCount, setRenderCount] = useState(0);
  const addAToolRef = useRef();

  useEffect(() => {
    if (renderCount > 0)
      addAToolRef.current?.scrollIntoView({ behavior: "smooth" });
    setRenderCount(renderCount + 1);
  }, [goToAddATool]);

  useEffect(() => {
    if (Object.keys(allTools).includes("error")) {
      setShowAddQuestionForm(true);
    }
  }, []);

  function showNewQuestionFormButtonHandler() {
    setShowAddQuestionForm(!showAddQuestionForm);
  }
  function showAudioPluginSelectorButtonHandler() {
    setShowAddFromLibrary(!showAddFromLibrary);
  }

  return (
    <div
      id="add-a-tool-outer-wrap"
      className={styles["add-a-tool-outer-wrap"]}
      ref={addAToolRef}
    >
      <div id="add-a-tool-container" className={styles["add-a-tool-container"]}>
        {!doNotShowTitle && <h2 className="section-title">Add A Tool Here</h2>}
        {!doNotShowWelcomeMessage && (
          <p className={styles["add-a-tool-intro"]}>
            To add an item, simply click the <i>Show the Entry Form</i> button
            and fill out the small form. Feel free to click the "Add Another
            Form" button to create as many forms as needed to add multiple
            question at once. When they are all ready, click the <i>Submit</i>{" "}
            button.
          </p>
        )}

        {!doNotShowLogin && (
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
                  You must be logged in to access or submit production tools to
                  the database. If you do not have an account, the entry form
                  will be emailed to the site admin for review before it is
                  entered into he database .
                </p>
              </div>
            )}
          </div>
        )}
        {!doNotShowAddButtons && (
          <div className={styles["button-section-container"]}>
            <div className={styles["button-container"]}>
              <PushButton
                inputOrButton="button"
                id="create-entry-btn"
                colorType="secondary"
                value="Add a Question"
                data=""
                size="medium"
                onClick={showAudioPluginSelectorButtonHandler}
              >
                {showAddFromLibrary && (
                  <span>
                    <b>Cancel</b> the Library Selector
                  </span>
                )}
                {!showAddFromLibrary && <span>Add from the Library</span>}
              </PushButton>
            </div>
            <div className={styles["button-container"]}>
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
                    <b>Cancel</b> the Manual Entry Form
                  </span>
                )}
                {!showAddQuestionForm && <span>Manual Entry Form</span>}
              </PushButton>
            </div>{" "}
            <div className={styles["button-container"]}>
              <div className={styles["cvs-buttons-container"]}>
                <CSVReader setFileUploadArray={setFileUploadArray} />
              </div>
            </div>
          </div>
        )}
        <div className={styles["inputs-container"]}>
          {showAddFromLibrary && <AudioPluginSelector />}
          {showAddQuestionForm && (
            <AddAToolForm
              saveOrUpdateData="save"
              setFormParentOpen={setShowAddQuestionForm}
              buttonStyles={{
                width: "80%",
                background: "var(--iq-color-accent-gradient)",
                borderRadius: "50px",
                height: "3em",
                font: "var(--iq-font-heading-2)",
                fontSize: "1.5em",
                padding: "0",
                textTransform: "uppercase",
                fontWeight: "900",
                letterSpacing: "0.25em",
                textShadow:
                  "rgb(0 0 0 / 50%) -1px -1px 1px, rgb(255 255 255 / 50%) 1px 1px 1px, 0 0 22px wheat",
              }}
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
      </div>
    </div>
  );
}

export default AddATool;
