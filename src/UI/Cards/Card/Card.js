import styles from "./Card.module.css";
const Card = (props) => {
  return (
    <div className={styles.header} style={props.styles}>
      {props.children}
    </div>
  );
};

export default Card;
