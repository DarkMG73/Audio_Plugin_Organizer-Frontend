import styles from "./CardPrimary.module.css";
import cardStyles from "../Card/Card.module.css";

const CardPrimary = (props) => {
  return (
    <div
      className={
        styles.header + " " + cardStyles.card + " " + styles["card-primary"]
      }
      style={props.styles}
    >
      {props.children}
    </div>
  );
};

export default CardPrimary;
