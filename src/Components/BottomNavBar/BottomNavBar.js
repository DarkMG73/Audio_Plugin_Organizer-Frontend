import { Fragment } from "react";
import { useDispatch } from "react-redux";
import styles from "./BottomNavBar.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { audioToolDataActions } from "../../store/audioToolDataSlice";

const BottomNavBar = () => {
   const dispatch = useDispatch();

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   const addAToolButtonHandler = () => {
      dispatch(audioToolDataActions.goToAddATool());
   };
   const goToTopButtonHandler = () => {
      window.scrollTo({
         top: 0,
         behavior: "smooth"
      });
   };
   const goToBottomButtonHandler = () => {
      window.scrollTo({
         top: document.documentElement.scrollHeight,
         behavior: "smooth"
      });
   };

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   return (
      <Fragment>
         {}
         <div className={styles["navbar-container"]}>
            <PushButton
               inputOrButton="button"
               id="create-entry-btn"
               colorType="secondary"
               value="Add a Question"
               data=""
               size="small"
               onClick={goToTopButtonHandler}
               styles={{
                  margin: "0 auto",
                  borderRadius: "50px 0 0 0",
                  padding: " 0.75em 3em",
                  fontVariant: "small-caps"
               }}
            >
               <span>&#9650;Top</span>
            </PushButton>{" "}
            <PushButton
               inputOrButton="button"
               id="create-entry-btn"
               colorType="primary"
               value="Add a Question"
               data=""
               size="small"
               onClick={addAToolButtonHandler}
               styles={{
                  margin: "0 auto",
                  textShadow: "0 0 3px wheat",
                  padding: " 0.75em 3em",
                  fontVariant: "small-caps",
                  borderRadius: "3px"
               }}
            >
               <div className={styles["hide-on-small-screens"]}>
                  Add a Plugin or Tool
               </div>
               <div
                  className={
                     styles["show-on-small-screens"] + " " + styles["plus-sign"]
                  }
               >
                  &#65291;
               </div>
            </PushButton>
            <PushButton
               inputOrButton="button"
               id="create-entry-btn"
               colorType="secondary"
               value="Add a Question"
               data=""
               size="small"
               onClick={goToBottomButtonHandler}
               styles={{
                  margin: "0 auto",
                  borderRadius: "0 50px 0 0",
                  padding: " 0.75em 3em",
                  fontVariant: "small-caps"
               }}
            >
               <span>Bottom&#9660;</span>
            </PushButton>
         </div>
      </Fragment>
   );
};

export default BottomNavBar;
