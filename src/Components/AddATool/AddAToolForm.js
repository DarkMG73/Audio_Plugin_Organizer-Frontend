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
import LocalErrorDisplay from "../../Components/ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";

function AddAToolForm(props) {
   const user = useSelector((state) => state.auth.user);
   const [requiredError, setRequiredError] = useState(false);
   const [formOpen, setFormOpen] = useState(null);
   const [formRefresh, setFormRefresh] = useState(Math.random(10000));
   const [submitData, setSubmitData] = useState(null);
   const groomAudioFormData = useGroomAudioFormData();
   const saveAudioFormData = useSaveAudioFormData();
   const getRunGatherToolData = useRunGatherToolData();
   const runGatherToolData = function (user, setLocalError, GatherToolData) {
      makeLoadingRequest();
      getRunGatherToolData(user, setLocalError, GatherToolData);
      removeLoadingRequest();
   };
   const dispatch = useDispatch();
   const makeLoadingRequest = function () {
      return dispatch(loadingRequestsActions.addToLoadRequest());
   };
   const removeLoadingRequest = function () {
      dispatch(loadingRequestsActions.removeFromLoadRequest());
   };

   const [localError, setLocalError] = useState({
      active: false,
      message: null
   });
   // JSX is stored in state as this can
   // change based on input and use.
   const [formJSX, setFormJSX] = useState([
      <AddAToolFormElms
         key={"addatoolformcomponent-1"}
         formData={props.formData}
         setFormParentOpen={props.setFormParentOpen}
         cancelButtonStyles={props.cancelButtonStyles}
         requiredError={props.requiredError}
         formOpen={formOpen}
         formRefresh={formRefresh}
         cancelOneForm={props.cancelOneForm}
         ignoreFormOpen={props.ignoreFormOpen}
      />
   ]);
   const successCallback = () => {
      runGatherToolData(user, setLocalError, GatherToolData);
      if (props.saveOrUpdateData === "update") {
         alert(
            "The item was successfully updated in your library!\n\nChanges will be reflected after you close this notice. If not, please refresh the browser."
         );
      } else {
         alert(
            "The items were successfully added to your library\n\nChanges will be reflected in your library area after you close this notice. If not, please refresh the browser."
         );
      }
      setFormRefresh(Math.random(10000));
   };

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   function submitButtonHandler(e) {
      e.preventDefault();
      const data = new FormData(e.target.closest("form#add-quest-form"));
      let dataEntries = [...data.entries()];
      const groomedToolsData = groomAudioFormData(
         dataEntries,
         props.saveOrUpdateData
      );
      setSubmitData(groomedToolsData);
   }

   ////////////////////////////////////////
   /// EFFECTS
   ////////////////////////////////////////
   useEffect(() => {
      setFormJSX([
         <AddAToolFormElms
            key={"addatoolformcomponent-2"}
            formData={props.formData}
            setFormParentOpen={props.setFormParentOpen}
            cancelButtonStyles={props.cancelButtonStyles}
            requiredError={props.requiredError}
            formOpen={formOpen}
            formRefresh={formRefresh}
            cancelOneForm={props.cancelOneForm}
            ignoreFormOpen={props.ignoreFormOpen}
         />
      ]);
   }, [requiredError, formRefresh]);

   useEffect(() => {
      if (submitData) {
         if (props.setFormParentOpen) props.setFormParentOpen(false);
         saveAudioFormData(
            submitData,
            user,
            props.saveOrUpdateData,
            successCallback
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
            formRefresh={formRefresh}
            cancelOneForm={props.cancelOneForm}
            ignoreFormOpen={props.ignoreFormOpen}
         />
      ]);
   }

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   return (
      <form action="" id="add-quest-form" className={styles["inner-wrap form"]}>
         <div key={"addatoolform-4"} className={styles["inner-wrap"]}>
            {" "}
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
                           className={styles["edit-buttons-wrap"]}
                        >
                           <PushButton
                              key={"addatoolform-4"}
                              inputOrButton="input"
                              type="submit"
                              id="tool-submit-btn"
                              colorType="primary"
                              value="Submit"
                              data=""
                              size="small"
                              onClick={submitButtonHandler}
                              styles={{
                                 ...props.buttonStyles,
                                 ...props.submitButtonStyles
                              }}
                           >
                              Submit
                           </PushButton>
                           <PushButton
                              key={"addatoolform-5"}
                              inputOrButton="input"
                              type="submit"
                              id="tool-delete-btn"
                              colorType="primary"
                              value="Delete"
                              data=""
                              size="small"
                              onClick={props.deleteToolButtonHandler}
                              styles={{
                                 ...props.buttonStyles,
                                 ...props.deleteButtonStyles
                              }}
                           >
                              Delete
                           </PushButton>
                        </div>
                     )}
                     {formElms}
                  </CardPrimary>
               </Fragment>
            ))}
            {requiredError && (
               <div key={"addatoolform-6"} className={styles["error-text"]}>
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
                     colorType="primary"
                     value="Add another Question"
                     data=""
                     size="large"
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
                     value="Submit"
                     data=""
                     size="large"
                     onClick={submitButtonHandler}
                     styles={{
                        ...props.buttonStyles,
                        ...props.submitButtonStyles
                     }}
                  >
                     Submit
                  </PushButton>
               </Fragment>
            )}
         </div>
      </form>
   );
}
export default AddAToolForm;
