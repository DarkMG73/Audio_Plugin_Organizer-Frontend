import styles from "./SlideButton.module.css";

const SlideButton = (props) => {
  // Mat.random() is used below in the input to ensure a full re-render if any part of this component re-renders. This avoides the input appearing to be checked, but not no longer checked.
  return (
    <div
      key={"slide-bitton-1" + props.label}
      className={styles["slide-button-container"]}
      style={props.containerStyles}
    >
      <span key={"slide-bitton-2" + props.label} className={styles.title}>
        {props.label}
      </span>
      <label key={"slide-bitton-3" + props.label} className={styles.switch}>
        <input
          key={props.user + props.label + Math.random()}
          id={props.user + props.label + Math.random()}
          type="checkbox"
          name={props.label}
          onClick={props.onClick}
          className={styles["switch-input"]}
          value={props.value ? props.value : props.label}
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
