import styles from "./FormInput.module.css";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { toTitleCase } from "../../../Hooks/utility";
import { useSelector } from "react-redux";
import ImagePicker from "react-image-picker";
import "react-image-picker/dist/index.css";
// import img1 from "../../../assets/images/Acoustica-Audio_AERO-AMP.png";
// import img2 from "../../../assets/images/product-photo-placeholder-2.png";

const FormInput = (props) => {
   const { officialImages, defaultImages } = useSelector(
      (state) => state.toolsData
   );

   // const images = require.context(
   //   '../../../assets/images/official_plugin_images/',
   //   true,
   // );

   // const genericImages = require.context(
   //   '../../../assets/images/generic_plugin_images/',
   //   true,
   // );

   const imageList = officialImages;

   const genericImageList = [];

   Object.values(defaultImages).forEach((defaultImageGroup) => {
      defaultImageGroup.forEach((imageData) =>
         genericImageList.push(imageData)
      );
   });

   const [requiredError, setRequiredError] = useState(true);
   const [requiredClass, setRequiredClass] = useState("");
   const [photoSelected, setPhotoSelected] = useState();
   const [picSelectorOpen, setPicSelectorOpen] = useState(false);
   const [genericPicSelectorOpen, setGenericPicSelectorOpen] = useState(false);
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
      if (
         input.required == true &&
         requiredTextInput.current.value.length <= 0
      ) {
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

   const handleClosePicSelector = (e) => {
      e.preventDefault();

      if (e.target.value === "cancel") {
         setPhotoSelected(null);
      }

      if (e.target.dataset.selectorType === "generic") {
         setGenericPicSelectorOpen(!genericPicSelectorOpen);
      } else {
         setPicSelectorOpen(!picSelectorOpen);
      }
   };

   const handleOnSelectPic = (imageObj) => {
      const listArray = imageList;
      const picLocation = "official_plugin_images/";

      setPhotoSelected(picLocation + applySelectedPhoto(imageObj, listArray));
   };

   const handleOnGenericSelectPic = (imageObj) => {
      const listArray = genericImageList;
      const picLocation = "generic_plugin_images/";

      setPhotoSelected(picLocation + applySelectedPhoto(imageObj, listArray));
   };

   ///////////////////////////////////////
   /// FUNCTIONALITY
   ////////////////////////////////////////
   function applySelectedPhoto(imageObj, listArray) {
      const imageStr = imageObj.src;

      // const groomedImageNameStart = imageStr.substring(
      //    0,
      //    imageStr.indexOf(".")
      // );
      const rawName = listArray.find((group) => {
         return group.src === imageStr;
      });

      const groomedImageNameStart = rawName.name;

      const groomedImageNameEnd = groomedImageNameStart.replace("./", "");

      return groomedImageNameEnd;
   }

   const addTitlesToPicSelIMages = (listArray) => {
      try {
         const checkForElmInterval = setInterval(() => {
            const imagePickerElm = document.querySelector(".image_picker");

            if (imagePickerElm) {
               clearInterval(checkForElmInterval);
               const allElms = document.querySelectorAll(".responsive");

               allElms.forEach((elm) => {
                  // Get image within elm
                  const imgElm = elm.querySelector("img");

                  const imgSrc = imgElm.src;

                  const cleanImageName = (srcStr) => {
                     return srcStr
                        .substring(
                           srcStr.lastIndexOf("/") + 1,
                           srcStr.indexOf(".", srcStr.lastIndexOf("/"))
                        )
                        .replaceAll("%20", "")
                        .replaceAll(" ", "");
                  };

                  // Groom src string to be just name

                  let imageName = cleanImageName(imgSrc);

                  imageName = listArray.find((group) => {
                     const groomedGroupSrc = cleanImageName(group.src);

                     return groomedGroupSrc === imageName;
                  });

                  if (
                     !imageName ||
                     !Object.hasOwn(imageName, "name") ||
                     imageName.name.includes("data:image")
                  )
                     return;

                  imageName = cleanImageName(imageName.name.replace(/^./, ""));

                  const charLimit = 21;
                  if (imageName.length >= charLimit) {
                     imageName = imageName.substring(0, charLimit - 1) + "...";
                  }

                  // Add title to elm
                  const preventDuplicates = elm.querySelector("h4");
                  const newH3ELm = document.createElement("h4");
                  newH3ELm.innerText = imageName
                     .replace("_", " ")
                     .replace("-", " ");

                  if (!preventDuplicates) elm.prepend(newH3ELm);
               });
            }
         }, 300);
      } catch (err) {
         console.log("----> err", err);
      }
   };

   let groomedOptions;
   if (Object.hasOwn(input, "options") && input.options) {
      groomedOptions = input.options.map((option) => {
         return typeof option === "string" && option.trim();
      });
   }

   if (input.type === "textarea") {
      outputJSX = (
         <div
            key="form-input"
            className={
               styles["input-container"] +
               " " +
               styles[input.name] +
               " " +
               "input-container" +
               " " +
               "FormInput_" +
               input.name +
               " " +
               "FormInput_input-" +
               input.name
            }
         >
            <label key={"form-input-1"} htmlFor={formNumber + "#" + input.name}>
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
               className={styles[requiredClass] + " " + requiredClass}
               style={{ height: "auto", width: "auto", minHeight: "0" }}
            ></textarea>
            {requiredError && input.required == true && (
               <span
                  key={"form-input-3"}
                  className={
                     styles[requiredClass + "-text"] +
                     " " +
                     requiredClass +
                     "-text"
                  }
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
            if (a && b) return a.toLowerCase().localeCompare(b.toLowerCase());
         })
         .map((option, i) => {
            if (
               inputValue &&
               option &&
               inputValue.toLowerCase().trim() == option.toLowerCase().trim()
            ) {
               inputHasSelected = true;
               return (
                  <option
                     key={"form-input-" + i}
                     name={formNumber + "#" + input.name}
                     className={
                        styles.option + " " + styles["option-" + input.name]
                     }
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
                     className={
                        styles.option + " " + styles["option-" + input.name]
                     }
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
               styles["input-container"] +
               " " +
               styles["input-" + input.name] +
               " " +
               "input-container" +
               " " +
               "FormInput_" +
               input.name +
               " " +
               "FormInput_input-" +
               input.name
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
               className={styles[requiredClass] + " " + requiredClass}
               required={props.inputRequired}
            />
            {requiredError && input.required == true && (
               <span
                  key={"form-input-3"}
                  className={
                     styles[requiredClass + "-text"] +
                     " " +
                     requiredClass +
                     "-text"
                  }
               >
                  &uarr; This field is required &uarr;
               </span>
            )}
         </div>
      );
   } else if (input.type === "datalist") {
      // *** Select Boxes***
      let inputHasSelected = false;

      const options = groomedOptions
         .sort(function (a, b) {
            if (a && b) return a.toLowerCase().localeCompare(b.toLowerCase());
         })
         .map((option, i) => {
            if (
               inputValue &&
               option &&
               inputValue.toLowerCase().trim() == option.toLowerCase().trim()
            ) {
               inputHasSelected = true;
               return (
                  <option
                     key={"form-input-" + i}
                     name={formNumber + "#" + input.name}
                     className={
                        styles.option + " " + styles["option-" + input.name]
                     }
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
                     className={
                        styles.option + " " + styles["option-" + input.name]
                     }
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
      // options.push(
      //    <option key={"form-input-unkown"} defaultValue="">
      //       -- Unkown --
      //    </option>
      // );

      outputJSX = (
         <div
            key={"form-input-jsx"}
            className={
               styles["input-container"] +
               " " +
               styles["input-" + input.name] +
               " " +
               "input-container" +
               " " +
               "FormInput_" +
               input.name +
               " " +
               "FormInput_input-" +
               input.name
            }
         >
            <label key={"form-input-1"} htmlFor={formNumber + "#" + input.name}>
               {input.title}
            </label>

            <input
               list={formNumber + "#" + input.name}
               name={formNumber + "#" + input.name}
               defaultValue={
                  input.options.length > 0 ? input.options[0].trim() : ""
               }
               placeholder="Email address..."
               required={input.required}
               onChange={props.onChange || textInputOnChangeHandler}
            />
            <datalist
               className="form-control"
               id={formNumber + "#" + input.name}
               key={"form-input-4"}
               type={input.type}
               name={formNumber + "#" + input.name}
               defaultValue={input.value}
               required={input.required}
               onChange={props.onChange || textInputOnChangeHandler}
            >
               {options.map((optionHTML) => optionHTML)}
            </datalist>

            {requiredError && input.required == true && (
               <span
                  key={"form-input-3"}
                  className={
                     styles[requiredClass + "-text"] +
                     " " +
                     requiredClass +
                     "-text"
                  }
               >
                  &uarr; This field is required &uarr;
               </span>
            )}
         </div>
      );
   } else if (input.type === "url") {
      outputJSX = (
         <div
            key={"form-input"}
            className={
               styles["input-container"] +
               " " +
               styles[input.name] +
               " " +
               "input-container" +
               " " +
               "FormInput_" +
               input.name +
               " " +
               "FormInput_input-" +
               input.name
            }
         >
            <label
               key={"form-input-1t"}
               htmlFor={formNumber + "#" + input.name}
            >
               {input.title}
               {input.title === "Producturl" && (
                  <a
                     href={`https://search.brave.com/search?q=audio+plugin+${props.parentName}&source=desktop`}
                     target="_blank"
                     alt="A Brave search for this plugin"
                  >
                     To get the product URL a photo URL, find the developer page
                     here &rarr;
                  </a>
               )}
            </label>

            {input.title === "Photourl" && (
               <div
                  className={
                     styles["image-selector-outer-container"] +
                     " " +
                     "image-selector-outer-container"
                  }
               >
                  {
                     // OEM Pic Selector
                  }
                  <div
                     className={
                        styles["image-selector-container"] +
                        " " +
                        styles["image-selector-" + input.title] +
                        " " +
                        "image-selector-container" +
                        " " +
                        "image-selector-" +
                        input.title
                     }
                  >
                     {picSelectorOpen && (
                        <div
                           className={
                              styles["image-selector"] +
                              " " +
                              styles["default-image-selector"] +
                              " " +
                              "default-image-selector"
                           }
                        >
                           <ImagePicker
                              images={imageList.map((imageData, i) => {
                                 if (i >= imageList.length - 1)
                                    addTitlesToPicSelIMages(imageList);
                                 return {
                                    src: imageData.src,
                                    value: i
                                 };
                              })}
                              onPick={handleOnSelectPic}
                           />
                           <div
                              className={
                                 styles["button-container"] +
                                 " " +
                                 "button-container"
                              }
                           >
                              <button
                                 type="button"
                                 value="select"
                                 data-selector-type="oem"
                                 onClick={handleClosePicSelector}
                                 className={
                                    styles["select-button"] +
                                    " " +
                                    "select-button"
                                 }
                              >
                                 OK
                              </button>
                              <button
                                 type="button"
                                 value="cancel"
                                 data-selector-type="oem"
                                 onClick={handleClosePicSelector}
                                 className={
                                    styles["cancel-button"] +
                                    " " +
                                    "cancel-button"
                                 }
                              >
                                 Cancel
                              </button>
                           </div>
                        </div>
                     )}

                     <button
                        onClick={handleClosePicSelector}
                        data-selector-type="oem"
                     >
                        Select from OEM Pics Library
                     </button>
                  </div>
                  {
                     // Generic Pic Selector
                  }
                  <div
                     className={
                        styles["image-selector-container"] +
                        " " +
                        styles["image-selector-" + input.title] +
                        " " +
                        "image-selector-container" +
                        "image-selector-" +
                        input.title
                     }
                  >
                     {genericPicSelectorOpen && (
                        <div
                           className={
                              styles["image-selector"] +
                              " " +
                              styles["default-image-selector"] +
                              " " +
                              "image-selector" +
                              " " +
                              "default-image-selector"
                           }
                        >
                           <ImagePicker
                              images={genericImageList.map((image, i) => {
                                 if (i >= genericImageList.length - 1) {
                                    addTitlesToPicSelIMages(genericImageList);
                                 }
                                 return {
                                    src: image.src,
                                    value: i
                                 };
                              })}
                              onPick={handleOnGenericSelectPic}
                           />
                           <div
                              className={
                                 styles["button-container"] +
                                 " " +
                                 "button-container"
                              }
                           >
                              <button
                                 type="button"
                                 value="select"
                                 data-selector-type="generic"
                                 onClick={handleClosePicSelector}
                                 className={
                                    styles["select-button"] +
                                    " " +
                                    "select-button"
                                 }
                              >
                                 OK
                              </button>
                              <button
                                 type="button"
                                 value="cancel"
                                 data-selector-type="generic"
                                 onClick={handleClosePicSelector}
                                 className={
                                    styles["cancel-button"] +
                                    " " +
                                    "cancel-button"
                                 }
                              >
                                 Cancel
                              </button>
                           </div>
                        </div>
                     )}
                     <button
                        onClick={handleClosePicSelector}
                        data-selector-type="generic"
                     >
                        Select from Generic Pics Library
                     </button>
                  </div>
               </div>
            )}

            <input
               key={"form-input-2"}
               type="url"
               name={formNumber + "#" + input.name}
               defaultValue={photoSelected ? photoSelected : inputValue}
               value={photoSelected}
               ref={requiredTextInput}
               onChange={props.onChange || textInputOnChangeHandler}
               className={styles[requiredClass] + " " + requiredClass}
            />
            {requiredError && input.required == true && (
               <span
                  key={"form-input-3"}
                  className={
                     styles[requiredClass + "-text"] +
                     " " +
                     requiredClass +
                     "-text"
                  }
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
         if (option && option.includes("~")) {
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
                     styles["input-wrap"] +
                     " 1 " +
                     styles["input-option" + option] +
                     " " +
                     "input-wrap1 " +
                     "input-option" +
                     option
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
            ((optionName && inputValue.constructor === String) ||
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
                     " 2 " +
                     (typeof optionName === "string" &&
                        optionName.toLowerCase().replace(/[^A-Z0-9]+/gi, "_")) +
                     " " +
                     styles[
                        "input-option-" +
                           (typeof optionName === "string" &&
                              optionName
                                 .toLowerCase()
                                 .replace(/[^A-Z0-9]+/gi, "_"))
                     ] +
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
               typeof optionName === "string" &&
               (optionName.toLowerCase() === "true" ||
                  optionName.toLowerCase() === "false")
            )
               optionName = toTitleCase(optionName.toLowerCase(), true);
            return (
               <div
                  key={"form-input-a3" + i}
                  className={
                     styles["input-wrap"] +
                     " 3 " +
                     (typeof optionName === "string" &&
                        optionName.toLowerCase().replace(/[^A-Z0-9]+/gi, "_")) +
                     " " +
                     styles[
                        "input-option-" +
                           (typeof optionName === "string" &&
                              optionName
                                 .toLowerCase()
                                 .replace(/[^A-Z0-9]+/gi, "_"))
                     ] +
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
                  />
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
                  styles["input-container"] +
                  " " +
                  styles["input-" + input.name] +
                  " " +
                  "input-container" +
                  " " +
                  "FormInput_" +
                  input.name +
                  " " +
                  "FormInput_input-" +
                  input.name
               }
            >
               <label
                  key={"form-input-a7"}
                  htmlFor={formNumber + "#" + input.name}
               >
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
                  styles["input-container"] +
                  " " +
                  styles["input-" + input.name] +
                  " " +
                  "input-container" +
                  " " +
                  "FormInput_" +
                  input.name +
                  " " +
                  "FormInput_input-" +
                  input.name
               }
            >
               <label
                  key={"form-input-c2"}
                  htmlFor={formNumber + "#" + input.name}
               >
                  {input.title}
               </label>

               {requiredError && input.required == true && (
                  <span
                     key={"form-input-c4"}
                     className={styles[requiredClass + "-text"]}
                  >
                     &uarr; This field is required &uarr;
                  </span>
               )}
               {options.map((optionHTML) => optionHTML)}
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
            </div>
         );
      }
   } else {
      outputJSX = (
         <div
            key={"text-input-1"}
            className={
               styles["input-container"] +
               " " +
               styles[input.name] +
               " " +
               "input-container" +
               " " +
               "FormInput_" +
               input.name +
               " " +
               "FormInput_input-" +
               input.name
            }
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
               <span
                  key={"form-input"}
                  className={styles[requiredClass + "-text"]}
               >
                  &uarr; This field is required &uarr;
               </span>
            )}
         </div>
      );
   }

   return outputJSX;
};

export default FormInput;
