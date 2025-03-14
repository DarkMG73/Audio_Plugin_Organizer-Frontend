import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AddAToolForm.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAToolFormElms from "./AddAToolFormElms";
import GatherToolData from "../../Hooks/GatherToolData";
import useGroomAudioFormData from "../../Hooks/useGroomAudioFormData";
import useSaveAudioFormData from "../../Hooks/useSaveAudioFormData";
import useRunGatherToolData from "../../Hooks/useRunGatherToolData";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import LocalErrorDisplay from "../ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";

function AddAToolForm(props) {
   const user = useSelector((state) => state.auth.user);
   const { toolsMetadata, toolsSchema } = useSelector(
      (state) => state.toolsData
   );
   const [requiredError, setRequiredError] = useState(false);
   const [largerForms, setLargerForms] = useState(false);
   const [formOpen, setFormOpen] = useState(null);
   const [submitData, setSubmitData] = useState(null);
   const [unsavedFormData, setUnsavedFormData] = useState(null);
   const groomAudioFormData = useGroomAudioFormData();
   const saveAudioFormData = useSaveAudioFormData();
   const getRunGatherToolData = useRunGatherToolData();
   const runGatherToolData = function (user, setLocalError, GatherToolData) {
      makeLoadingRequest();
      getRunGatherToolData(user, setLocalError, GatherToolData);
      setTimeout(() => {
         removeLoadingRequest();
      }, 2000);
   };
   const dispatch = useDispatch();
   const makeLoadingRequest = function () {
      return dispatch(loadingRequestsActions.addToLoadRequest());
   };
   const removeLoadingRequest = function () {
      dispatch(loadingRequestsActions.removeFromLoadRequest());
   };
   const headerPosition = useSelector(
      (state) => state.elementDimensions.header
   );

   const [localError, setLocalError] = useState({
      active: false,
      message: null
   });
   // JSX is stored in state as this can
   // change based on input and use.
   const [formJSX, setFormJSX] = useState([
      <AddAToolFormElms
         key={"addatoolformcomponent-1"}
         formData={unsavedFormData || props.formData}
         setFormParentOpen={props.setFormParentOpen}
         cancelButtonStyles={props.cancelButtonStyles}
         requiredError={props.requiredError}
         formOpen={formOpen}
         // formRefresh={formRefresh}
         cancelOneForm={props.cancelOneForm}
         ignoreFormOpen={props.ignoreFormOpen}
      />
   ]);
   const successCallback = (unsavedItems) => {
      console.log(
         "%c⚪️►►►► %cline:62%csuccessCallback",
         "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
         "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
         "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
         successCallback
      );
      if (props.successCallback) props.successCallback();

      if (user && props.saveOrUpdateData === "update") {
         window.DayPilot.alert(
            "The item was successfully updated in your library!<br/><br/>Changes will be reflected after you close this notice. If not, please refresh the browser."
         );
      } else if (user && unsavedItems) {
         window.DayPilot.alert(
            "Items that could be saved were successfully added to your library. Changes will be reflected in your library area after you close this notice..<br/><br/>Any items without the name field filled in could not be saved and will still be open in the form ready to be completed."
         );
      } else if (user) {
         window.DayPilot.alert(
            "The items were successfully added to your library<br/><br/>Changes will be reflected in your library area after you close this notice. If not, please refresh the browser."
         );
      }

      // Remove forms that were saved
      if (unsavedItems && unsavedItems.length > 0) {
         const names = document.querySelectorAll(".FormInput_name input");
         names.forEach((elm) => {
            console.log("value: " + elm.value);
            if (elm.value) elm.closest(".form-group-wrap").remove();
         });
      } else {
         props.setFormParentOpen(false);
      }
      setTimeout(() => {
         runGatherToolData(user, setLocalError, GatherToolData);
      }, 1000);
   };

   const noUserCallback = () => {
      props.setFormParentOpen(false);
   };

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   function submitButtonHandler(e) {
      e.preventDefault();
      window.DayPilot.confirm(
         "If you are ready to save these, click OK.<br/><br/>If not, click CANCEL to return to the form."
      )
         .then(function (args) {
            if (!args.canceled) {
               const data = new FormData(
                  e.target.closest("form#add-quest-form")
               );
               const dataEntries = [...data.entries()];
               const { groomedToolsData, unsavedItems } = groomAudioFormData(
                  dataEntries,
                  props.saveOrUpdateData
               );
               setSubmitData({ groomedToolsData, unsavedItems });
            }
         })
         .catch((e) => {
            console.lof("Error: " + e);
         });
   }

   function handleLargerForms(e) {
      e.preventDefault();
      const bodyElm = document.body;

      if (bodyElm.classList.contains("largeForms")) {
         bodyElm.classList.remove("largeForms");
         setLargerForms(false);
      } else {
         bodyElm.classList.add("largeForms");
         setLargerForms(true);
      }
   }

   ////////////////////////////////////////
   /// EFFECTS
   ////////////////////////////////////////

   useEffect(() => {
      setFormJSX([
         <AddAToolFormElms
            key={"addatoolformcomponent-2"}
            formData={unsavedFormData || props.formData}
            setFormParentOpen={props.setFormParentOpen}
            cancelButtonStyles={props.cancelButtonStyles}
            requiredError={props.requiredError}
            formOpen={formOpen}
            // formRefresh={formRefresh}
            cancelOneForm={props.cancelOneForm}
            ignoreFormOpen={props.ignoreFormOpen}
         />
      ]);
   }, [requiredError]);

   useEffect(() => {
      if (submitData) {
         const { groomedToolsData, unsavedItems } = submitData;
         const loadedSuccessCallback = () => {
            successCallback(unsavedItems);
         };
         if (groomedToolsData && Object.keys(groomedToolsData).length > 0)
            saveAudioFormData(
               groomedToolsData,
               user,
               props.saveOrUpdateData,
               loadedSuccessCallback,
               noUserCallback
            );
      }
   }, [submitData]);

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
            // formRefresh={formRefresh}
            cancelOneForm={props.cancelOneForm}
            ignoreFormOpen={props.ignoreFormOpen}
         />
      ]);
   }

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   return (
      <form
         action=""
         id="add-quest-form"
         className={styles["inner-wrap form"] + " " + "inner-wrap form"}
      >
         {" "}
         <div
            style={{ top: headerPosition.bottom - 18 + "px" }}
            data-data="add-tool-submit-2-wrap"
         >
            <PushButton
               key={"addatoolform-9"}
               inputOrButton="input"
               type="submit"
               id="quest-submit-btn"
               colorType="primary"
               value="Save"
               data="add-tool-submit-2"
               size="medium"
               onClick={submitButtonHandler}
               styles={{
                  ...props.buttonStyles,
                  ...props.submitButtonStyles,
                  background: "var(--iq-color-accent-2) !important",
                  boxShadow:
                     "inset -7px -7px 10px -7px #000000,    inset 7px 7px 10px -7px var(--iq-color-accent-2-light), 7px 7px 7px -7px #0000008a",
                  border: "none"
               }}
            >
               Save
            </PushButton>
         </div>
         <div
            key={"addatoolform-4"}
            className={styles["inner-wrap"] + " " + "inner-wrap"}
         >
            <PushButton
               key={"addatoolform-4"}
               inputOrButton="input"
               type="button"
               id="tool-submit-btn"
               // colorType="secondary"
               value={"Make Forms " + (largerForms ? "Compact" : "Larger")}
               data="larger-forms-1"
               size="medium"
               onClick={handleLargerForms}
               styles={{
                  // position: 'relative',
                  width: "50%",
                  // margin: 'auto',
                  fontVariant: "small-caps",
                  textTransform: "uppercase",
                  boxShadow:
                     "black -3px -3px 7px -4px inset, white 3px 3px 7px -4px inset, 0 0 14px 0px var(--iq-color-accent-light)",
                  background: "var(--iq-color-background)",
                  color: "var(--iq-color-foreground)",
                  letterSpacing: "0.5em"
               }}
            />
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
                        boxShadow: " 15px 15px 30px -15px black"
                     }}
                  >
                     {props.removeAddMoreButton && (
                        <div
                           key={"addatoolform-3"}
                           className={
                              styles["edit-buttons-wrap"] +
                              " " +
                              "edit-buttons-wrap"
                           }
                        >
                           <PushButton
                              key={"addatoolform-4"}
                              inputOrButton="input"
                              type="submit"
                              id="tool-submit-btn"
                              colorType="primary"
                              value="Save Changes"
                              data="add-tool-submit-1"
                              size="small"
                              onClick={submitButtonHandler}
                              styles={{
                                 ...props.buttonStyles,
                                 ...props.submitButtonStyles
                              }}
                           >
                              Save Changes
                           </PushButton>
                           <PushButton
                              key={"addatoolform-4"}
                              inputOrButton="input"
                              type="button"
                              id="tool-submit-btn"
                              colorType="secondary"
                              value={
                                 "Make Forms " +
                                 (largerForms ? "Compact" : "Larger")
                              }
                              data="larger-forms-2"
                              size="small"
                              onClick={handleLargerForms}
                              styles={{
                                 position: "relative",
                                 display: "block",
                                 width: "50%",
                                 margin: "auto",
                                 fontVariant: "small-caps",
                                 textTransform: "uppercase",
                                 boxShadow:
                                    "inset -3px -3px 7px -4px black,inset 3px 3px 7px -4px white",
                                 background: "var(--iq-color-background)",
                                 color: "var(--iq-color-foreground)",
                                 letterSpacing: "0.5em"
                              }}
                           />
                        </div>
                     )}
                     {formElms}
                     {!props.doNotShowDeleteButton && (
                        <PushButton
                           key={"addatoolform-5"}
                           inputOrButton="input"
                           type="submit"
                           id="tool-delete-btn"
                           colorType="primary"
                           value="Delete this Item"
                           data="delete-button"
                           size="small"
                           onClick={props.deleteToolButtonHandler}
                           styles={{
                              ...props.buttonStyles,
                              ...props.deleteButtonStyles
                           }}
                        >
                           Delete this Item
                        </PushButton>
                     )}
                  </CardPrimary>
               </Fragment>
            ))}
            {requiredError && (
               <div
                  key={"addatoolform-6"}
                  className={styles["error-text"] + " " + "error-text"}
               >
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
                     colorType="secondary"
                     value="Add another Plugin"
                     data=""
                     size="medium"
                     onClick={addAnotherQuestionFormButtonHandler}
                     styles={props.buttonStyles}
                  >
                     Add Another Plugin
                  </PushButton>
                  <PushButton
                     key={"addatoolform-9"}
                     inputOrButton="input"
                     type="submit"
                     id="quest-submit-btn"
                     colorType="primary"
                     value="Save"
                     data="add-tool-submit-3"
                     size="medium"
                     onClick={submitButtonHandler}
                     styles={{
                        ...props.buttonStyles,
                        ...props.submitButtonStyles,
                        zIndex: "10"
                     }}
                  >
                     Save
                  </PushButton>
               </Fragment>
            )}
         </div>
      </form>
   );
}
export default AddAToolForm;

// [
//   {
//     title: 'Name',
//     name: 'name',
//     type: 'text',
//     options: [],
//     required: true,
//     preFilledData: 'CA2600 FX',
//   },
//   {
//     title: 'Functions',
//     name: 'functions',
//     type: 'checkbox',
//     options: [
//       'SPACER-Category ~ Category',
//       'Category ~ Audio Effects',
//       'Category ~ Synthesizer',
//       'Category ~ Sampler',
//       'Category ~ Percussion Synth/Sampler',
//       'Category ~ MIDI Arpeggiator & Effects',
//       'Category ~ Music Generator',
//       'Category ~ DAW',
//       'Category ~  Editor',
//       'Category ~ Loop library',
//       'SPACER-FrequencyControl ~ Frequency Control',
//       'Frequency Control ~ EQ',
//       'Frequency Control ~ Filter',
//       'SPACER-Dynamics ~ Dynamics',
//       'Dynamics ~ Compressor',
//       'Dynamics ~ Multi-band Comp',
//       'Dynamics ~ Limiter',
//       'Dynamics ~ Clipper',
//       'Dynamics ~ Gate & Expander',
//       'Dynamics ~ De-Esser',
//       'SPACER-Saturation ~ Saturation',
//       'Saturation ~ Distortion',
//       'Saturation ~ Harmonics',
//       'Saturation ~ Subharmonic Synth',
//       'Saturation ~ Exciter',
//       'SPACER-TimeandSpace ~ Time and Space',
//       'Time and Space ~ Reverb',
//       'Time and Space ~ Delay',
//       'Time and Space ~ Pan, Stereo & Mono',
//       'Time and Space ~ Mid-Side Processing',
//       'Time and Space ~ Glitch, Stutter and Granular FX',
//       'SPACER-Modulation ~ Modulation',
//       'Modulation ~ Chorus | Flanger | Phaser | Tremolo',
//       'Modulation ~ Pitch-Shifter',
//       'Modulation ~ General Modulation',
//       'SPACER-Simulation ~ Simulation',
//       'Simulation ~ Cabinet Sim',
//       'Simulation ~ Mic Sim',
//       'Simulation ~ Amp Sim',
//       'Simulation ~ Preamp Sim',
//       'SPACER-CombinationTools ~ Combination Tools',
//       'Combination Tools ~ Channel Strip',
//       'Combination Tools ~ Effects Rack',
//       'Combination Tools ~ Vocal-Specific Processing',
//       'SPACER-Multi-FunctionShaper ~ Multi-Function Shaper',
//       'Multi-Function Shaper ~ Spectral',
//       'Multi-Function Shaper ~ Transient',
//       'Multi-Function Shaper ~ Enhancer',
//       'SPACER-Analyzers ~ Analyzers',
//       'Analyzers ~ Meter',
//       'Analyzers ~ Tuner',
//       'Analyzers ~ Spectral Analysis',
//       'Analyzers ~ Plugin Analysis',
//       'SPACER-User Added ~ User Added',
//     ],
//     required: 'false',
//     preFilledData: ['Category ~ Audio Effects'],
//   },
//   {
//     title: 'Color',
//     name: 'color',
//     type: 'checkbox',
//     options: [
//       "Vintage ('60's & Earlier)",
//       "70's",
//       "80's",
//       'Modern',
//       'Extreme',
//       'Dark Atmosphere',
//       'Light Atmosphere',
//       'Tribal & Earthy',
//       'Asian',
//       'European',
//       'Latin',
//       'Sci-Fi',
//     ],
//     required: false,
//     preFilledData: '',
//   },
//   {
//     title: 'Precision',
//     name: 'precision',
//     type: 'checkbox',
//     options: ['Vibey Analog', 'Analog Mastering', 'Digital Precision'],
//     required: false,
//     preFilledData: '',
//   },
//   {
//     title: 'Company',
//     name: 'company',
//     type: 'datalist',
//     options: [
//       '',
//       'Klienhelm',
//       'SoftTube',
//       'Brainworx',
//       'SPL',
//       'Antares',
//       'Cableguys',
//       'Celemony‍',
//       'East West‍',
//       'Eventide',
//       'FabFilter‍',
//       'Illformed‍',
//       'iZotope‍',
//       'LennarDigital‍',
//       'MeterPlugs‍',
//       'Native Instruments‍',
//       'oeksound‍',
//       'Plugin Alliance‍',
//       'Slate Digital‍',
//       'Sonarworks',
//       'Sonnox‍',
//       'Soundtoys‍',
//       'Spectrasonics‍',
//       'Synchro Arts‍',
//       'u-he‍',
//       'Universal Audio‍',
//       'Waves',
//       'Waves Factory',
//       'Xfer Records',
//       'XLN Audio',
//       ' Analog Obsession',
//       'Antares',
//       'Acoustica Audio',
//       'Arturia',
//       'Cymatics',
//       'elysia',
//       'Electronik Sound Lab',
//       'UnitedPlugins',
//       'Matthew Lane',
//       'Fuse Audio',
//       'SoundSpot',
//       'Caelum Audio',
//       'emvoice',
//       'Ampeg',
//       'Black Box Analog Design',
//       'Bettermaker',
//     ],
//     required: false,
//     preFilledData: '',
//   },
//   {
//     title: 'Producturl',
//     name: 'productURL',
//     type: 'url',
//     options: [],
//     required: false,
//     preFilledData: '',
//   },
//   {
//     title: 'Photourl',
//     name: 'photoURL',
//     type: 'url',
//     options: [],
//     required: false,
//     preFilledData: '',
//   },
//   {
//     title: 'Oversampling',
//     name: 'oversampling',
//     type: 'radio',
//     options: ['true', 'false'],
//     required: false,
//     preFilledData: 'false',
//   },
//   {
//     title: 'Favorite',
//     name: 'favorite',
//     type: 'radio',
//     options: ['true', 'false'],
//     required: false,
//     preFilledData: 'false',
//   },
//   {
//     title: 'Rating',
//     name: 'rating',
//     type: 'radio',
//     options: ['1', '2', '3', '4', '5'],
//     required: false,
//     preFilledData: '3',
//   },
//   {
//     title: 'Status',
//     name: 'status',
//     type: 'select',
//     options: ['Active', 'Demo', 'Disabled', 'Wanted'],
//     required: false,
//     preFilledData: 'active',
//   },
//   {
//     title: 'Notes',
//     name: 'notes',
//     type: 'textarea',
//     options: [],
//     required: false,
//     preFilledData: '',
//   },
//   {
//     title: 'Identifier',
//     name: 'identifier',
//     type: 'text',
//     options: [],
//     required: false,
//     preFilledData: '',
//   },
//   {
//     title: 'Masterlibraryid',
//     name: 'masterLibraryID',
//     type: 'text',
//     options: [],
//     required: false,
//     preFilledData: 'CA2600 FX',
//   },
// ];
