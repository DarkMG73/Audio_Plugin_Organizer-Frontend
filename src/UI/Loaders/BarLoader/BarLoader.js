import styles from "./BarLoader.module.css";

function BarLoader() {
   return (
      <div className={styles["loader-wrap"] + " loader-container"}>
         <div
            className={
               styles["loader"] + " " + styles["loader2"] + " loader loader2"
            }
         >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
         </div>
      </div>
   );
}

export default BarLoader;
