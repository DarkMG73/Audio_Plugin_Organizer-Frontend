import styles from "./FormInput.module.css";
import { useState, useEffect, useRef } from "react";

const FormInput = (props) => {
  const [requiredError, setRequiredError] = useState(false);
  const input = props.inputDataObj;
  const [inputValue, setInputValue] = useState(input.preFilledData);
  const requiredTextInput = useRef();
  let outputJSX;

  const textInputOnChangeHandler = (e) => {
    setInputValue(e.target.value);
    if (input.required == true && requiredTextInput.current.value.length <= 0) {
      setRequiredError(true);
    } else {
      setRequiredError(false);
    }
  };

  if (input.type === "select") {
    const options = input.options.map((option) => (
      <option
        name={input.name}
        className={styles.option + " " + styles["option-" + input.name]}
        value={option}
      >
        {option}
      </option>
    ));
    options.push(
      <option disabled selected value="">
        -- select an option --
      </option>
    );
    options.push(<option value=""></option>);
    options.push(<option value="">-- Unkown --</option>);

    outputJSX = (
      <div
        className={
          styles["input-container"] + " " + styles["input-" + input.name]
        }
      >
        <label htmlFor={input.name}>{input.title}</label>
        <input
          type="text"
          name={input.name}
          value={inputValue}
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
        <select
          type={input.type}
          name={input.name}
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
        <input type={input.type} name={input.name} value={option} />{" "}
        <label htmlFor={input.name}>{option}</label>
      </div>
    ));
    outputJSX = (
      <div
        className={
          styles["input-container"] + " " + styles["input-" + input.name]
        }
      >
        <label htmlFor={input.name}>{input.title}</label>
        <input
          type="text"
          name={input.name}
          value={inputValue}
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
        {options.map((optionHTML) => optionHTML)}
      </div>
    );
  } else {
    outputJSX = (
      <div className={styles["input-container"] + " " + styles[input.name]}>
        <label htmlFor={input.name}> {input.title}</label>
        <input
          type={input.type}
          name={input.name}
          value={inputValue}
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
