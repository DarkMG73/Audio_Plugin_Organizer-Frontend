import styles from './CheckBox.module.css';

const CheckBox = (props) => {
  // Mat.random() is used below in the input to ensure a full re-render if any part of this component re-renders. This avoids the input appearing to be checked, when no longer checked.
  return (
    <div
      key={'slide-button-1' + props.label}
      className={styles['checkbox-wrap']}
      style={props.containerStyles}
    >
      <label key={'checkbox' + props.label} className={styles.label}>
        <input
          key={props.user + props.label + Math.random()}
          id={props.user + props.label + Math.random()}
          type="checkbox"
          name={props.label}
          onClick={props.onClick}
          className={styles.checkbox}
          value={props.value ? props.value : props.label}
          defaultChecked={props.checked}
          data-data={props.data}
        />
        <span
          key={'slide-button-4' + props.label}
          className={styles['label-text']}
        >
          {props.label}
        </span>
      </label>
    </div>
  );
};

export default CheckBox;
