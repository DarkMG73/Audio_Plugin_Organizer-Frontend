import styles from "./Footer.module.css";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import PushButton from "../../UI/Buttons/PushButton/PushButton";

const Footer = ({
   isDesktopApp,
   newVersionIsReady,
   appVersions,
   showVersionAlert,
   handleDesktopVersionLinkButton
}) => {
   const { localData, desktopVersion } = appVersions;
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
                  {!isDesktopApp && typeof process !== "undefined" && (
                     <p>Web App Version {process.env.REACT_APP_VERSION}</p>
                  )}
                  {isDesktopApp && newVersionIsReady && showVersionAlert && (
                     <div
                        key="version-wrapper"
                        className={
                           styles["new-version-alert"] + " " + desktopVersion
                        }
                     >
                        <ul
                           className={`${styles["update-version-text-container"]} ${styles["column-two"]} `}
                        >
                           <ul>
                              <h3>A New Version is Available!</h3>

                              <li>
                                 Newest version available: {desktopVersion}
                              </li>

                              <li>
                                 <PushButton
                                    inputOrButton="button"
                                    id="create-entry-btn"
                                    colorType=""
                                    value="download-new-version"
                                    data=""
                                    size="large"
                                    styles={{
                                       margin: "1em auto",
                                       borderRadius: "50px ",
                                       padding: " 0.75em 3em",
                                       fontVariant: "small-caps",
                                       minWidth: "min-content",
                                       flexBasis: "40%",
                                       flexGrow: " 1",
                                       background:
                                          "var(--apo-button-background-version-download)",
                                       color: "var(--apo-button-text-version-download)"
                                    }}
                                    onClick={handleDesktopVersionLinkButton}
                                 >
                                    Click to Download the new version now!
                                 </PushButton>
                              </li>
                           </ul>
                        </ul>
                     </div>
                  )}
                  {isDesktopApp && localData && (
                     <p>Desktop App Version {localData.versionNumber}</p>
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
