import styles from "./FormInput.module.css";
import { useState, useEffect, useRef } from "react";
const FormInput = (props) => {
  const [requiredError, setRequiredError] = useState(false);
  const requiredTextInput = useRef();
  let outputJSX;
  const input = props.inputDataObj;

  const textInputOnChangeHandler = () => {
    if (input.required == true && requiredTextInput.current.value.length <= 0) {
      setRequiredError(true);
    } else {
      setRequiredError(false);
    }
  };
  if (input.type === "select") {
    const options = input.options.map((option) => (
      <option
        name={input.title}
        className={styles.option + " " + styles["option-" + input.title]}
        value={option}
      >
        {option}
      </option>
    ));
    options.push(
      <option disabled selected value>
        -- select an option --
      </option>
    );

    outputJSX = (
      <div
        className={
          styles["input-container"] + " " + styles["input-" + input.title]
        }
      >
        <label htmlFor={input.title}>{input.title}</label>
        <select
          type={input.type}
          name={input.title}
          value={input.value}
          required={input.required}
        >
          {" "}
          {options.map((optionHTML) => optionHTML)}
        </select>
      </div>
    );
  } else if (input.type === "checkbox") {
    const options = input.options.map((option) => (
      <div
        className={styles["input-wrap"] + " " + styles["input-option" + option]}
      >
        <input type={input.type} name={input.title} value={option} />{" "}
        <label htmlFor={input.title}>{option}</label>
      </div>
    ));
    outputJSX = (
      <div
        className={
          styles["input-container"] + " " + styles["input-" + input.title]
        }
      >
        <label htmlFor={input.title}>{input.title}</label>
        {options.map((optionHTML) => optionHTML)}
      </div>
    );
  } else {
    outputJSX = (
      <div className={styles["input-container"] + " " + styles[input.title]}>
        <label htmlFor={input.title}> {input.title}</label>
        <input
          type={input.type}
          name={input.title}
          value={input.value}
          ref={requiredTextInput}
          onChange={textInputOnChangeHandler}
          className={requiredError && styles["input-required-error"]}
        />
        {requiredError && input.required == true && (
          <span>
            <br />
            This field is required
          </span>
        )}
      </div>
    );
  }

  return outputJSX;
};

export default FormInput;
