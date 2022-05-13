import styles from "./CardPrimary.module.css";
import stylesSquareTop from "./CardPrimarySquareTop.module.css";

const CardPrimarySquareTop = (props) => {
  return (
    <div
      className={
        styles.header +
        " " +
        styles["card-primary"] +
        " " +
        stylesSquareTop["card-primary-square-top"]
      }
      style={props.styles}
    >
      {props.children}
    </div>
  );
};

export default CardPrimarySquareTop;
