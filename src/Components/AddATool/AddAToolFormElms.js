import styles from "./AddAToolFormElms.module.css";
import React, { useState, useEffect, Fragment } from "react";
import FormInput from "../../UI/Form/FormInput/FormInput";
import GetPluginFormInputsWithOptions from "../../Hooks/GetPluginFormInputsWithOptions";
import { useSelector } from "react-redux";
import { getAllFunctionOptions } from "../../Hooks/utility";

function AddAToolFormElms(props) {
   const [formOpen, setFormOpen] = useState(true);
   const formRefresh = props.formRefresh ? props.formRefresh : true;
   const [formInputData, setFormInputData] = useState(false);
   const [newFormInputData, setNewFormInputData] = useState([]);
   const { toolsMetadata, toolsSchema } = useSelector(
      (state) => state.toolsData
   );

   ////////////////////////////////////////
   /// EFFECTS
   ////////////////////////////////////////
   useEffect(() => {
      const pluginFormWithOptions = GetPluginFormInputsWithOptions(
         toolsSchema,
         toolsMetadata
      );
      setFormInputData(pluginFormWithOptions);
   }, [toolsMetadata.company]);

   ////////////////////////////////////////
   /// Additional Functionality
   ////////////////////////////////////////
   // spreadsheet upload sends
   // nested data groups, so blank
   // form requests need to be nested here

   useEffect(() => {
      if (formInputData) {
         const output = props.formData ? props.formData : [formInputData];

         // Override "company" datalist options to ensure most recent.
         const groomedOutput = output.map((innerGroup) => {
            return innerGroup.map((group) => {
               const newGroup = { ...group };

               if (
                  Object.hasOwn(group, "title") &&
                  group.title.toLowerCase().replaceAll(" ", "") === "company"
               ) {
                  newGroup.options = toolsMetadata.company;
               }
               return newGroup;
            });
         });

         setNewFormInputData(groomedOutput);
      }
   }, [formInputData]);

   function cancelQuestionFormButtonHandler(e) {
      e.preventDefault();
      const close = window.DayPilot.confirm(
         "Are you sure you want to cancel this specific item? Any data input for this item will be lost (other items in this plugin entry form will not be affected)? "
      )
         .then(function (args) {
            if (!args.canceled) {
               // if (!props.ignoreFormOpen) setFormOpen(false);
               // if (props.setFormParentOpen) props.setFormParentOpen(false);
               if (props.cancelOneForm) props.cancelOneForm(e);
            }
         })
         .catch((e) => {
            console.lof("Error: " + e);
         });
   }

   // if (newFormInputData.length > 0) {
   //    newFormInputData[0].forEach((group) => {
   //       // To make the flow of the options through the form clearer, we set fixed numbers and booleans as strings
   //       if (group.name === "rating") group.options = ["1", "2", "3", "4", "5"];
   //       if (group.name === "favorite" || group.name === "oversampling")
   //          group.options = ["True", "False"];
   //       // Format user added functions to match stock functions
   //       if (group.name === "functions") {
   //          group.options = getAllFunctionOptions(toolsMetadata);
   //       }
   //    });
   // }

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   return (
      <Fragment key={"addtoolformelms-1" + formRefresh}>
         {formOpen && (
            <div
               key={"addtoolformelms-scrollswrap"}
               className={styles["scroll-wrap"] + " " + "scroll-wrap"}
            >
               {newFormInputData.map((formDataGroup, index) => (
                  <Fragment key={"addtoolformelms-2" + index}>
                     <div
                        key={"addtoolformelms-1"}
                        className={
                           styles["form-group-wrap"] + " " + "form-group-wrap"
                        }
                     >
                        {/* This hidden input separates input groups */}
                        <input
                           key={"addtoolformelms-3"}
                           name="NEWGROUP"
                           defaultValue="NEWGROUP"
                           hidden
                        />
                        {formDataGroup.map((inputData, i) => {
                           let preFilledData = null;

                           formDataGroup.forEach((topicGroup) => {
                              if (topicGroup.name === "name") {
                                 if (
                                    topicGroup &&
                                    Object.hasOwn(
                                       topicGroup,
                                       "preFilledData"
                                    ) &&
                                    topicGroup.preFilledData
                                 )
                                    preFilledData = topicGroup.preFilledData;
                              }
                           });

                           return (
                              <FormInput
                                 key={"addtoolformelms-4" + i}
                                 formNumber={index}
                                 inputDataObj={inputData}
                                 requiredError={props.requiredError}
                                 parentName={preFilledData}
                              />
                           );
                        })}
                        <button
                           key={"addtoolformelms-5"}
                           className={
                              styles["close-item-form-button"] +
                              " " +
                              "close-item-form-button"
                           }
                           onClick={cancelQuestionFormButtonHandler}
                           style={props.cancelButtonStyles}
                           data-form-number={index}
                        >
                           Cancel Form
                        </button>
                     </div>
                  </Fragment>
               ))}
            </div>
         )}
      </Fragment>
   );
}

export default AddAToolFormElms;
