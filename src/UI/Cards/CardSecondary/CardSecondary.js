import styles from "./CardSecondary.module.css";
import cardStyles from "../Card/Card.module.css";

const CardSecondary = (props) => {
  return (
    <div
      className={
        styles.header + " " + styles["card-secondary"] + " " + cardStyles.card
      }
    >
      {props.children}
    </div>
  );
};

export default CardSecondary;
