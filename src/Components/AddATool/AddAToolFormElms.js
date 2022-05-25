import styles from "./AddAToolFormElms.module.css";
import { useState, useEffect, Fragment } from "react";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import FormInput from "../../UI/Form/FormInput/FormInput";
import { formInputData } from "../../data/formInputData";

function AddAToolFormElms(props) {
  const [formOpen, setFormOpen] = useState(true);
  // spreadsheet upload sends nested data groups, so blank form requests need to be nested here
  const newFormInputData = props.formData ? props.formData : [formInputData];
  console.log(
    "%c --> %cline:10%cnewFormInputData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
    newFormInputData
  );

  function cancelQuestionFormButtonHandler() {
    const close = window.confirm(
      "Are you sure you want to cancel this specific question? Any data input for this question will be lost (other questions in this Question Entry Form will not be affected)? "
    );
    if (close) setFormOpen(false);
  }

  return (
    <Fragment>
      {formOpen &&
        newFormInputData.map((formDataGroup) => (
          <CardPrimary styles={{ position: "relative" }}>
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

              <button
                className={styles["close-question-form-button"]}
                onClick={cancelQuestionFormButtonHandler}
              >
                X
              </button>
            </div>
          </CardPrimary>
        ))}
    </Fragment>
  );
}

export default AddAToolFormElms;
