import styles from "./MobileSlideContainer.module.css";
import { useState, Fragment } from "react";
const MobileSlideContainer = (props) => {
   const [openSlideContainer, setOpenSlideContainer] = useState(false);
   const containerStyles = openSlideContainer ? "open" : "";
   const toggleSliderButtonHandler = (e) => {
      setOpenSlideContainer(!openSlideContainer);
   };

   return (
      <Fragment>
         <button
            key={"addtoolformelms-5"}
            className={`${styles["open-slider-panel-button"]} ${styles["slider-panel-button"]}`}
            onClick={toggleSliderButtonHandler}
            style={props.cancelButtonStyles}
         >
            &darr; Open &nbsp; {props.name} &darr;
         </button>
         <div className={`${styles.container} ${styles[containerStyles]}`}>
            <button
               key={"addtoolformelms-5"}
               className={`${styles["close-slider-panel-button"]} ${styles["slider-panel-button"]}`}
               onClick={toggleSliderButtonHandler}
               style={props.cancelButtonStyles}
            >
               &uarr; CLOSE &nbsp; {props.name} &uarr;
            </button>
            {props.children}
         </div>
      </Fragment>
   );
};

export default MobileSlideContainer;
