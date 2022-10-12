import styles from "./FormInput.module.css";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { toTitleCase } from "../../../Hooks/utility";

const FormInput = (props) => {
  const [requiredError, setRequiredError] = useState(true);
  const [requiredClass, setRequiredClass] = useState("");
  const input = props.inputDataObj;
  const formNumber = props.formNumber;
  const [inputValue, setInputValue] = useState(input.preFilledData);
  const [checkboxTextInputValue, setCheckboxTextInputValue] = useState();
  const requiredTextInput = useRef();
  let outputJSX;

  ///////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    if (input.required == true) setRequiredClass("required-input");
  }, []);

  useEffect(() => {
    if (input.required == true && requiredError) {
      setRequiredClass("required-input-error");
    }
    if (input.required == true && !requiredError) {
      setRequiredClass("required-input");
    }
  }, [requiredError]);

  useEffect(() => {
    if (
      setInputValue.hasOwnProperty("constructor") &&
      inputValue.constructor === String
    ) {
      setInputValue(inputValue.replaceAll('"', ""));
    } else {
      setInputValue(inputValue);
    }
  }, [inputValue]);

  ///////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////
  const textInputOnChangeHandler = (e) => {
    setInputValue(e.target.value);
    if (input.required == true && requiredTextInput.current.value.length <= 0) {
      setRequiredError(true);
    } else {
      setRequiredError(false);
    }
  };

  const checkboxTextInputOnChangeHandler = (e) => {
    setCheckboxTextInputValue(e.target.value);
  };

  const checkboxInputOnChangeHandler = (e) => {
    // setInputValue(e.target.value);
  };

  ///////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  let groomedOptions;
  if (input.hasOwnProperty("options"))
    groomedOptions = input.options.map((option) => option.trim());

  if (input.type === "textarea") {
    outputJSX = (
      <div
        key={"form-input"}
        className={styles["input-container"] + " " + styles[input.name]}
      >
        <label key={"form-inpu-1t"} htmlFor={formNumber + "#" + input.name}>
          {" "}
          {input.title}
        </label>
        <textarea
          key={"form-input-2"}
          type={input.type}
          name={formNumber + "#" + input.name}
          defaultValue={inputValue}
          ref={requiredTextInput}
          onChange={props.onChange || textInputOnChangeHandler}
          className={styles[requiredClass]}
          style={{ height: "auto", width: "auto", minHeight: "0" }}
        ></textarea>
        {requiredError && input.required == true && (
          <span
            key={"form-input-3"}
            className={styles[requiredClass + "-text"]}
          >
            &uarr; This field is required &uarr;
          </span>
        )}
      </div>
    );
  } else if (input.type === "select") {
    // *** Select Boxes***
    let inputHasSelected = false;

    const options = groomedOptions
      .sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      })
      .map((option, i) => {
        if (inputValue.toLowerCase().trim() == option.toLowerCase().trim()) {
          inputHasSelected = true;
          return (
            <option
              key={"form-input-" + i}
              name={formNumber + "#" + input.name}
              className={styles.option + " " + styles["option-" + input.name]}
              defaultValue={option}
              selected
            >
              {option}
            </option>
          );
        } else {
          return (
            <option
              key={"form-input-" + i}
              name={formNumber + "#" + input.name}
              className={styles.option + " " + styles["option-" + input.name]}
              defaultValue={option}
            >
              {option}
            </option>
          );
        }
      });
    if (!inputHasSelected)
      options.push(
        <option
          key={"form-input-noInputHasSelected"}
          disabled
          selected
          defaultValue=""
        >
          -- select an option --
        </option>
      );
    options.push(<option key={"form-input-empty"} defaultValue=""></option>);
    options.push(
      <option key={"form-input-unkown"} defaultValue="">
        -- Unkown --
      </option>
    );

    outputJSX = (
      <div
        key={"form-input-jsx"}
        className={
          styles["input-container"] + " " + styles["input-" + input.name]
        }
      >
        <label key={"form-input-1"} htmlFor={formNumber + "#" + input.name}>
          {input.title}
        </label>
        <select
          key={"form-input-4"}
          type={input.type}
          name={formNumber + "#" + input.name}
          defaultValue={input.value}
          required={input.required}
          onChange={props.onChange || textInputOnChangeHandler}
        >
          {" "}
          {options.map((optionHTML) => optionHTML)}
        </select>

        <input
          key={"form-input-2"}
          type="text"
          placeholder="If the item is not in the list, type a new one here."
          name={formNumber + "#" + input.name}
          value={toTitleCase(inputValue)}
          ref={requiredTextInput}
          onChange={props.onChange || textInputOnChangeHandler}
          className={styles[requiredClass]}
          required={props.inputRequired}
        />
        {requiredError && input.required == true && (
          <span
            key={"form-input-3"}
            className={styles[requiredClass + "-text"]}
          >
            &uarr; This field is required &uarr;
          </span>
        )}
      </div>
    );
  } else if (input.type === "checkbox" || input.type === "radio") {
    // *** Checkboxes and Radio Buttons***
    // if (input.name === "functions") {
    //   groomedOptions.sort(function (a, b) {
    //     return a.toLowerCase().localeCompare(b.toLowerCase());
    //   });
    // }

    const options = groomedOptions.map((option, i) => {
      let optionGroup = "";
      let optionName = option;
      if (option.includes("~")) {
        [optionGroup, optionName] = option.split("~");
        optionGroup = optionGroup.trim();
        optionName = optionName.trim();
      }

      if (
        (inputValue.constructor.name === "Number" ||
          inputValue.constructor.name === "Boolean" ||
          (option == "false" && inputValue == "")) &&
        (inputValue.toString() == option ||
          (option == "true" && inputValue == ""))
      ) {
        return (
          <div
            key={"form-input" + i}
            className={
              styles["input-wrap"] + " " + styles["input-option" + option]
            }
          >
            <input
              key={"form-input-2" + i}
              type={input.type}
              name={formNumber + "#" + input.name}
              value={option}
              checked={"true"}
              onChange={checkboxInputOnChangeHandler}
              required={props.inputRequired}
            />
            <label
              key={"form-input-3" + i}
              htmlFor={formNumber + "#" + input.name}
            >
              {option}
            </label>
          </div>
        );
      } else if (
        (inputValue.constructor === String ||
          inputValue.constructor === Array) &&
        inputValue.length > 0 &&
        (inputValue.toString().toLowerCase().trim() ==
          optionName.toLowerCase().trim() ||
          inputValue.includes(option))
      ) {
        if (
          optionName.toLowerCase() === "true" ||
          optionName.toLowerCase() === "false"
        )
          optionName = toTitleCase(optionName.toLowerCase(), true);
        return (
          <div
            key={"form-input-a" + optionName}
            className={
              styles["input-wrap"] +
              " " +
              styles["input-option" + optionName] +
              " " +
              styles["display-row"] +
              " " +
              styles[optionGroup.replaceAll(" ", "")]
            }
            data-group={optionGroup.replaceAll(" ", "")}
          >
            <input
              key={"form-input-b" + optionName}
              type={input.type}
              name={formNumber + "#" + input.name}
              value={optionName}
              defaultChecked={"true"}
              onChange={checkboxInputOnChangeHandler}
              required={props.inputRequired}
            />{" "}
            <label
              key={"form-input-a2"}
              htmlFor={formNumber + "#" + input.name}
            >
              {optionName}
            </label>
          </div>
        );
      } else {
        if (
          optionName.toLowerCase() === "true" ||
          optionName.toLowerCase() === "false"
        )
          optionName = toTitleCase(optionName.toLowerCase(), true);
        return (
          <div
            key={"form-input-a3" + i}
            className={
              styles["input-wrap"] +
              " " +
              styles["input-option" + optionName] +
              " " +
              styles["display-row"] +
              " " +
              styles[optionGroup.replaceAll(" ", "")]
            }
            data-group={optionGroup.replaceAll(" ", "")}
          >
            <input
              key={"form-inputa4"}
              type={input.type}
              name={formNumber + "#" + input.name}
              defaultValue={optionName}
              onChange={checkboxInputOnChangeHandler}
              required={props.inputRequired}
            />{" "}
            <label
              key={"form-input-a5"}
              htmlFor={formNumber + "#" + input.name}
            >
              {optionName}
            </label>
          </div>
        );
      }
    });
    if (input.type === "radio") {
      outputJSX = (
        <div
          key={"form-input-a6"}
          className={
            styles["input-container"] + " " + styles["input-" + input.name]
          }
        >
          <label key={"form-input-a7"} htmlFor={formNumber + "#" + input.name}>
            {input.title}
          </label>

          {requiredError && input.required == true && (
            <span
              key={"form-input-a8"}
              className={styles[requiredClass + "-text"]}
            >
              &uarr; This field is required &uarr;
            </span>
          )}
          {options.map((optionHTML) => optionHTML)}
        </div>
      );
    } else {
      outputJSX = (
        <div
          key={"form-input-c1"}
          className={
            styles["input-container"] + " " + styles["input-" + input.name]
          }
        >
          <label key={"form-input-c2"} htmlFor={formNumber + "#" + input.name}>
            {input.title}
          </label>
          <input
            key={"form-input-c3"}
            type="text"
            placeholder="Type new additions here. Use forward-slashes to separate lists, like this:  Item 1 / Item 2 / Item 3"
            name={formNumber + "#" + input.name}
            value={checkboxTextInputValue}
            ref={requiredTextInput}
            onChange={checkboxTextInputOnChangeHandler}
            className={styles[requiredClass]}
            required={props.inputRequired}
          />
          {requiredError && input.required == true && (
            <span
              key={"form-input-c4"}
              className={styles[requiredClass + "-text"]}
            >
              &uarr; This field is required &uarr;
            </span>
          )}
          {options.map((optionHTML) => optionHTML)}
        </div>
      );
    }
  } else {
    outputJSX = (
      <div
        key={"text-input-1"}
        className={styles["input-container"] + " " + styles[input.name]}
      >
        <label key={"text-input-2"} htmlFor={formNumber + "#" + input.name}>
          {input.title}
        </label>
        <input
          key={"text-input-3"}
          type={input.type}
          name={formNumber + "#" + input.name}
          defaultValue={inputValue}
          ref={requiredTextInput}
          onChange={props.onChange || textInputOnChangeHandler}
          className={styles[requiredClass]}
          placeholder={input.placeholder}
          required={props.inputRequired}
        />
        {requiredError && input.required == true && (
          <span key={"form-input"} className={styles[requiredClass + "-text"]}>
            &uarr; This field is required &uarr;
          </span>
        )}
      </div>
    );
  }

  return outputJSX;
};

export default FormInput;
