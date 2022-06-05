import styles from "./AddAToolFormElms.module.css";
import { useState, useEffect, Fragment } from "react";
import FormInput from "../../UI/Form/FormInput/FormInput";
import GetPluginFormInputsWithOptions from "../../Hooks/GetPluginFormInputsWithOptions";
function AddAToolFormElms(props) {
  const [formOpen, setFormOpen] = useState(true);
  const [formInputData, setFormInputData] = useState(false);

  useEffect(() => {
    console.log(
      "%c --> %cline:20%cformInputData",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
      formInputData
    );
  }, [formInputData]);

  useEffect(() => {
    GetPluginFormInputsWithOptions().then((res) => {
      console.log(
        "%c --> %cline:13%cres",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(95, 92, 51);padding:3px;border-radius:2px",
        res
      );
      setFormInputData(res);
    });
  }, []);

  // spreadsheet upload sends nested data groups, so blank form requests need to be nested here
  let newFormInputData = [];
  if (formInputData)
    newFormInputData = props.formData ? props.formData : [formInputData];

  function cancelQuestionFormButtonHandler() {
    const close = window.confirm(
      "Are you sure you want to cancel this specific question? Any data input for this question will be lost (other questions in this Question Entry Form will not be affected)? "
    );
    if (close) {
      setFormOpen(false);
      props.setFormParentOpen(false);
    }
  }

  return (
    <Fragment>
      {formOpen &&
        newFormInputData.map((formDataGroup) => (
          <Fragment>
            <div
              id={Math.random()}
              key={Math.random()}
              className={styles["form-group-wrap"]}
            >
              {/* This hidden input separates input groups */}
              <input name="NEWGROUP" value="NEWGROUP" hidden />
              {formDataGroup.map((inputData, i) => {
                return (
                  <FormInput
                    inputDataObj={inputData}
                    requiredError={props.requiredError}
                  />
                );
              })}
            </div>
            <button
              className={styles["close-question-form-button"]}
              onClick={cancelQuestionFormButtonHandler}
              style={props.cancelButtonStyles}
            >
              X
            </button>
          </Fragment>
        ))}
    </Fragment>
  );
}

export default AddAToolFormElms;
