import styles from "./AddAToolFormElms.module.css";
import React, { useState, useEffect, Fragment } from "react";
import FormInput from "../../UI/Form/FormInput/FormInput";
import GetPluginFormInputsWithOptions from "../../Hooks/GetPluginFormInputsWithOptions";
import { useSelector } from "react-redux";
import { getAllFunctionOptions } from "../../Hooks/utility";

function AddAToolFormElms(props) {
  const [formOpen, setFormOpen] = useState(true);
  const [formInputData, setFormInputData] = useState(false);
  const { toolsMetadata, toolsSchema } = useSelector(
    (state) => state.toolsData
  );

  useEffect(() => {
    GetPluginFormInputsWithOptions(toolsSchema, toolsMetadata).then((res) => {
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

  if (newFormInputData.length > 0) {
    newFormInputData[0].forEach((group) => {
      // To make the flow of the options through the form clearer, we set fixed numbers and booleans as strings
      if (group.name === "rating") group.options = ["1", "2", "3", "4", "5"];
      if (group.name === "favorite" || group.name === "oversampling")
        group.options = ["True", "False"];

      // Format user added functions to match stock functions
      if (group.name === "functions") {
        group.options = getAllFunctionOptions(toolsMetadata);
      }
    });
  }

  return (
    <Fragment key={"addtoolformelms-1"}>
      {formOpen &&
        newFormInputData.map((formDataGroup, index) => (
          <Fragment key={"addtoolformelms-2" + index}>
            <div
              key={"addtoolformelms-1"}
              className={styles["form-group-wrap"]}
            >
              {/* This hidden input separates input groups */}
              <input
                key={"addtoolformelms-3"}
                name="NEWGROUP"
                defaultValue="NEWGROUP"
                hidden
              />
              {formDataGroup.map((inputData, i) => {
                return (
                  <FormInput
                    key={"addtoolformelms-4" + i}
                    formNumber={index}
                    inputDataObj={inputData}
                    requiredError={props.requiredError}
                  />
                );
              })}
            </div>
            <button
              key={"addtoolformelms-5"}
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
