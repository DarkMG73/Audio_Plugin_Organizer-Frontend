import styles from "./AddAToolFormElms.module.css";
import { useState, useEffect, Fragment } from "react";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import FormInput from "../../UI/Form/FormInput/FormInput";
import { formInputData } from "../../data/formInputData";
function AddAToolFormElms(props) {
  const [formOpen, setFormOpen] = useState(true);

  function cancelQuestionFormButtonHandler() {
    const close = window.confirm(
      "Are you sure you want to cancel this specific question? Any data input for this question will be lost (other questions in this Question Entry Form will not be affected)? "
    );
    if (close) setFormOpen(false);
  }

  return (
    <Fragment>
      {formOpen && (
        <CardPrimary styles={{ position: "relative" }}>
          <div
            id="question-89702"
            key={Math.random()}
            className={styles["form-group-wrap"]}
          >
            {/* This hidden input separates input groups */}
            <input name="NEWGROUP" value="NEWGROUP" hidden />
            {formInputData.map((inputData) => (
              <FormInput
                inputDataObj={inputData}
                requiredError={props.requiredError}
              />
            ))}

            <button
              className={styles["close-question-form-button"]}
              onClick={cancelQuestionFormButtonHandler}
            >
              X
            </button>
          </div>
        </CardPrimary>
      )}
    </Fragment>
  );
}

export default AddAToolFormElms;
