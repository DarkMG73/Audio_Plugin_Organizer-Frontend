import { useState, useEffect, Fragment } from "react";
import { useSelector } from "react-redux";
import styles from "./AddAToolForm.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAToolFormElms from "./AddAToolFormElms";
import GatherToolData from "../../Hooks/GatherToolData";
import useGroomAudioFormData from "../../Hooks/useGroomAudioFormData";
import useSaveAudioFormData from "../../Hooks/useSaveAudioFormData";
import useRunGatherToolData from "../../Hooks/useRunGatherToolData";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import LocalErrorDisplay from "../../Components/ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";

function AddAToolForm(props) {
  const user = useSelector((state) => state.auth.user);
  const [requiredError, setRequiredError] = useState(false);
  const [formOpen, setFormOpen] = useState(null);
  const [formRefresh, setFormRefresh] = useState(Math.random(10000));
  const runGatherToolData = useRunGatherToolData();
  const groomAudioFormData = useGroomAudioFormData();
  const saveAudioFormData = useSaveAudioFormData();
  const [localError, setLocalError] = useState({
    active: false,
    message: null,
  });
  // JSX si stored in state as this can
  // change based on input and use.
  const [formJSX, setFormJSX] = useState([
    <AddAToolFormElms
      key={"addatoolformcomponent-1"}
      formData={props.formData}
      setFormParentOpen={props.setFormParentOpen}
      cancelButtonStyles={props.cancelButtonStyles}
      requiredError={props.requiredError}
      formOpen={formOpen}
      formRefresh={formRefresh}
    />,
  ]);

  ///////////////////////////////////////////////////////////////////////
  /// Handlers
  ///////////////////////////////////////////////////////////////////////
  function submitButtonHandler(e) {
    e.preventDefault();
    const data = new FormData(e.target.closest("form#add-quest-form"));
    let dataEntries = [...data.entries()];
    const groomedToolsData = groomAudioFormData(dataEntries);
    const successCallback = () => {
      runGatherToolData(user, setLocalError, GatherToolData);
      alert(
        "Save to your library was successful! Changes should already be reflected in your library. If not, please refresh the browser."
      );
      setFormRefresh(Math.random(10000));
    };

    saveAudioFormData(
      groomedToolsData,
      user,
      props.saveOrUpdateData,
      successCallback
    );
  }

  ///////////////////////////////////////////////////////////////////////
  /// Effects
  ///////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log(
      "%c --> %cline:76%cformOpen",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
      formOpen
    );
    setFormJSX([
      <AddAToolFormElms
        key={"addatoolformcomponent-2"}
        formData={props.formData}
        setFormParentOpen={props.setFormParentOpen}
        cancelButtonStyles={props.cancelButtonStyles}
        requiredError={props.requiredError}
        formOpen={formOpen}
        formRefresh={formRefresh}
      />,
    ]);
  }, [requiredError, formRefresh]);

  function addAnotherQuestionFormButtonHandler(e) {
    e.preventDefault();
    setFormJSX([
      ...formJSX,
      <AddAToolFormElms
        key={"addatoolformcomponent-3"}
        setFormParentOpen={props.setFormParentOpen}
        cancelButtonStyles={props.cancelButtonStyles}
        requiredError={props.requiredError}
        formOpen={formOpen}
        formRefresh={formRefresh}
      />,
    ]);
  }

  ///////////////////////////////////////////////////////////////////////
  /// Output
  ///////////////////////////////////////////////////////////////////////
  return (
    <form action="" id="add-quest-form" className={styles["inner-wrap form"]}>
      <div key={"addatoolform-4"} className={styles["inner-wrap"]}>
        {" "}
        {localError.active && (
          <LocalErrorDisplay message={localError.message} />
        )}
        {formJSX.map((formElms, i) => (
          <Fragment key={"addatoolformcomponent-5"}>
            <CardPrimary
              key={"addatoolform-2" + i}
              styles={{
                position: "relative",
                maxHeight: "100%",
                height: "inherit",
                overflow: "visible",
                display: "block",
                background: "var(--iq-color-foreground)",
                padding: 0,
                boxShadow: " 15px 15px 30px -15px black",
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
                    id="tool-submit-btn"
                    colorType="primary"
                    value="Submit"
                    data=""
                    size="small"
                    onClick={submitButtonHandler}
                    styles={{
                      ...props.buttonStyles,
                      ...props.submitButtonStyles,
                    }}
                  >
                    Submit
                  </PushButton>
                  <PushButton
                    key={"addatoolform-5"}
                    inputOrButton="input"
                    type="submit"
                    id="tool-delete-btn"
                    colorType="primary"
                    value="Delete"
                    data=""
                    size="small"
                    onClick={props.deleteToolButtonHandler}
                    styles={{
                      ...props.buttonStyles,
                      ...props.deleteButtonStyles,
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
              styles={{
                ...props.buttonStyles,
                ...props.submitButtonStyles,
              }}
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
