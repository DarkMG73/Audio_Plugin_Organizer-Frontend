import Styles from "./CardPrimaryLarge.module.css";
import cardStyles from "../Card/Card.module.css";

const CardPrimary = ({ styles, children, data }) => {
   return (
      <div
         className={
            Styles.header + " " + cardStyles.card + " " + Styles["card-primary"]
         }
         style={styles}
         data-data={data}
      >
         {children}
      </div>
   );
};

export default CardPrimary;
