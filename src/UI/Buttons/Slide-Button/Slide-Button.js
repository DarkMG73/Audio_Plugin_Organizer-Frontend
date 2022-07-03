import styles from "./Slide-Button.module.css";

const SlideButton = (props) => {
  return (
    <div
      key={"slide-bitton-1" + props.label}
      className={styles["slide-button-wrap"]}
    >
      <span key={"slide-bitton-2" + props.label} className={styles.title}>
        {props.label}
      </span>
      <label key={"slide-bitton-3" + props.label} className={styles.switch}>
        <input
          key={props.label}
          type="checkbox"
          name={props.label}
          onClick={props.onClick}
          className={styles["switch-input"]}
          value={props.label}
          defaultChecked={props.checked}
          data-data={props.data}
        />
        <span
          key={"slide-bitton-4" + props.label}
          className={styles["slider"]}
        ></span>
      </label>
    </div>
  );
};

export default SlideButton;
