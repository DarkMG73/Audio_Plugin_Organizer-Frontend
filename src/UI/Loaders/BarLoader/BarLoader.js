import styles from "./BarLoader.module.css";

function BarLoader() {
  return (
    <div className={styles["loader-wrap"]}>
      <div className={styles["loader"] + " " + styles["loader2"]}>
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
