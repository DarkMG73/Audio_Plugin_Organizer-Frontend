import styles from "./CardSecondary.module.css";
import cardStyles from "../Card/Card.module.css";

const CardSecondary = (props) => {
  console.log(
    "%c --> %cline:10%cprops.styles",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
    props.styles
  );
  return (
    <div
      className={
        styles.header + " " + styles["card-secondary"] + " " + cardStyles.card
      }
      style={props.styles}
    >
      {props.children}
    </div>
  );
};

export default CardSecondary;
