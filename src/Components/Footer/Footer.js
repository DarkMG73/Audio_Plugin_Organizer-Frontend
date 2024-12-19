import styles from "./Footer.module.css";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";

const Footer = (props) => {
   const { isDesktopApp } = props;

   return (
      <div className={styles["footer-container"]}>
         {" "}
         <CardPrimary styles={{ width: "auto" }}>
            <div
               className={`${styles["footer-column"]} ${styles["footer-col-1"]}`}
            />
            <div
               className={`${styles["footer-column"]} ${styles["footer-col-2"]}`}
            >
               <p>
                  Develper & Designer | {"  "}{" "}
                  <a
                     href="https://www.glassinteractive.com/about-me/"
                     target="_blank"
                     rel="noreferrer"
                  >
                     Mike Glass
                  </a>
               </p>{" "}
               <p>
                  Contact | {"  "}
                  <a href="mailto:general@glassinteractive.com">
                     general@glassinteractive.com
                  </a>{" "}
               </p>{" "}
               <p>
                  Find more web apps and info at | {"  "}
                  <a
                     href="https://www.glassinteractive.com/"
                     target="_blank"
                     rel="noreferrer"
                  >
                     glassinteractive.com
                  </a>
                  {/* Version only for web version; Electron has version in About screen */}
                  {!isDesktopApp && (
                     <p>App Version {process.env.REACT_APP_VERSION}</p>
                  )}
               </p>
            </div>
            <div
               className={`${styles["footer-column"]} ${styles["footer-col-3"]}`}
            />
         </CardPrimary>
      </div>
   );
};

export default Footer;
