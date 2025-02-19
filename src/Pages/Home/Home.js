import { useState } from "react";
import styles from "./Home.module.css";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import CardPrimaryLarge from "../../UI/Cards/CardPrimaryLarge/CardPrimaryLarge";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import AddATool from "../../Components/AddATool/AddATool";
import FilterTools from "../../Components/FilterTools/FilterTools";
import ToolsRowsList from "../../Components/ToolsRows/ToolsRowsList/ToolsRowsList";
import OutputControls from "../../Components/OutputControls/OutputControls";
import Footer from "../../Components/Footer/Footer";
import BottomNavBar from "../../Components/BottomNavBar/BottomNavBar";
import { ErrorBoundary } from "../../Components/ErrorHandling/ErrorBoundary/ErrorBoundary";
import MobileSlideContainer from "../../UI/MobileSlideContainer/MobileSlideContainer";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { dateAIsLaterThanB } from "../../Hooks/utility";
import storage from "../../storage/storage";

const Home = ({ appVersions, isDesktopApp }) => {
   if (!appVersions) {
      appVersions = {
         desktopVersionMsg: "",
         desktopVersion: "",
         desktopVersionDownloadLink: "",
         desktopVersionReleaseDate: "",
         localData: ""
      };
   }

   const {
      desktopVersionMsg,
      desktopVersion,
      desktopVersionDownloadLink,
      desktopVersionReleaseDate,
      localData
   } = appVersions;

   const [toolListTopRef, setToolListTopRef] = useState();
   const [showVersionAlert, setShowVersionAlert] = useState(true);
   const newVersionIsReady =
      appVersions &&
      desktopVersion > localData.versionNumber &&
      dateAIsLaterThanB(new Date(), desktopVersionReleaseDate);
   const savedVersionDelayObj = storage("GET", false, "apo-version-delay");
   let userRequestedVersionDelay = false;

   if (
      savedVersionDelayObj &&
      Object.hasOwn(savedVersionDelayObj, "delayType")
   ) {
      if (
         savedVersionDelayObj.delayType === "time" &&
         Object.hasOwn(savedVersionDelayObj, "threshold") &&
         dateAIsLaterThanB(savedVersionDelayObj.threshold, new Date())
      )
         userRequestedVersionDelay = true;
      if (
         savedVersionDelayObj.delayType === "release" &&
         Object.hasOwn(savedVersionDelayObj, "threshold") &&
         savedVersionDelayObj.threshold >= desktopVersion
      )
         userRequestedVersionDelay = true;
   }

   const handleCloseVersionAlert = () => {
      window.DayPilot.alert(false);
   };
   const handleCloseAlertForWeek = () => {
      var firstDay = new Date();
      var weekFromToday = new Date(
         firstDay.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      storage(
         "ADD",
         {
            delayType: "time",
            threshold: weekFromToday
         },
         "apo-version-delay"
      );
      window.DayPilot.alert(false);
      window.DayPilot.alert(
         "Next week the update notice will come back as a friendly reminder.<br/><br/>NOTE: Update info and the download link will still be in the footer of this app."
      );
   };

   const handleDesktopVersionLinkButton = () => {
      var a = document.createElement("a");
      a.target = "_blank";
      a.href = desktopVersionDownloadLink;
      a.click();
   };

   const handleIgnoreVersion = () => {
      window.DayPilot.confirm(
         'Are you sure you want to skip this update?<br/><br/>If so, you will miss out on enhancements and new solutions. The "Remind Me in a Week" button is a better option if you can\'t update right now.<br/><br/>While it is not recommended, if you are rockin\' this just fine and don\'t feel like dealing an update right now, click the "OK"(or "CONFIRM") button below and the alert will not appear again until the next version is released.<br/><br/>NOTE: Update info and the download link will still be in the footer of this app.<br/><br/>Click "CANCEL" to keep the alert as a reminder.'
      )
         .then(function (args) {
            if (!args.canceled) {
               {
                  storage(
                     "ADD",
                     {
                        delayType: "release",
                        threshold: desktopVersion
                     },
                     "apo-version-delay"
                  );
                  window.DayPilot.alert(false);
               }
            }
         })
         .catch((e) => {
            console.lof("Error: " + e);
         });
   };

   return (
      <div key="home-page" className={styles["home-page"] + " " + "home-page"}>
         <div
            key="column-one"
            className={`${styles.column} ${styles["column-one"]} `}
         >
            <div
               key="show-on-small-screens-1"
               className={styles["show-on-small-screens"]}
            >
               <MobileSlideContainer name="Filters">
                  <CardSecondary
                     key={"FilterTools"}
                     styles={{
                        flexBasis: "223px",
                        margin: " 0",
                        minWidth: "223px",
                        maxWidth: "223px",
                        width: "223px",
                        position: "sticky",
                        height: "calc(100vh - 39px)",
                        overflowY: "auto",
                        top: "0",
                        paddingBottom: "7em",
                        borderRadius: "50px 50px 0 0"
                     }}
                  >
                     <ErrorBoundary>
                        <FilterTools />
                     </ErrorBoundary>
                  </CardSecondary>
               </MobileSlideContainer>
            </div>
            <div
               key="hide-on-small-screens-1"
               className={styles["hide-on-small-screens"]}
            >
               <CardSecondary
                  key={"FilterTools"}
                  styles={{
                     flexBasis: "223px",
                     margin: " 0",
                     minWidth: "223px",
                     maxWidth: "223px",
                     width: "223px",
                     position: "sticky",
                     height: "calc(100vh - 39px)",
                     overflowY: "auto",
                     top: "38px",
                     paddingBottom: "7em",
                     borderRadius: "50px 50px 0 0"
                  }}
               >
                  <ErrorBoundary>
                     <FilterTools />
                  </ErrorBoundary>
               </CardSecondary>
            </div>
         </div>
         <div
            key="column-two"
            className={`${styles["column"]} ${styles["column-two"]} `}
         >
            <CardPrimaryLarge key={"ToolsRowsList"}>
               <ErrorBoundary>
                  {newVersionIsReady &&
                     !userRequestedVersionDelay &&
                     showVersionAlert && (
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
                                    <h4>{desktopVersionMsg}</h4>
                                 </li>
                                 <li>
                                    Newest version available: {desktopVersion}
                                 </li>

                                 <li>
                                    Release Date: {desktopVersionReleaseDate}
                                 </li>
                                 <li>
                                    Version currently installed:{" "}
                                    {localData.versionNumber}
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
                           <div
                              key="version-button-wrapper"
                              className={
                                 styles["new-version-alert-button-container"] +
                                 " " +
                                 desktopVersion
                              }
                           >
                              <PushButton
                                 inputOrButton="button"
                                 id="create-entry-btn"
                                 colorType=""
                                 value="remind-me-later"
                                 data=""
                                 size="medium"
                                 styles={{
                                    margin: "0 auto",
                                    borderRadius: "50px ",
                                    padding: " 0.75em 3em",
                                    fontVariant: "small-caps",
                                    minWidth: "min-content",
                                    flexBasis: "40%",
                                    flexGrow: " 1"
                                 }}
                                 onClick={handleCloseVersionAlert}
                              >
                                 Remind Me Later
                              </PushButton>
                              <PushButton
                                 inputOrButton="button"
                                 id="create-entry-btn"
                                 colorType=""
                                 value="remind-me-later"
                                 data=""
                                 size="medium"
                                 styles={{
                                    margin: "0 auto",
                                    borderRadius: "50px ",
                                    padding: " 0.75em 3em",
                                    fontVariant: "small-caps",
                                    minWidth: "min-content",
                                    flexBasis: "40%",
                                    flexGrow: " 1"
                                 }}
                                 onClick={handleCloseAlertForWeek}
                              >
                                 Remind Me in a Week
                              </PushButton>
                              <PushButton
                                 inputOrButton="button"
                                 id="create-entry-btn"
                                 colorType=""
                                 value="remind-me-later"
                                 data=""
                                 size="medium"
                                 styles={{
                                    margin: "0 auto",
                                    borderRadius: "50px ",
                                    padding: " 0.75em 3em",
                                    fontVariant: "small-caps",
                                    minWidth: "min-content",
                                    flexBasis: "40%",
                                    flexGrow: " 1"
                                 }}
                                 onClick={handleIgnoreVersion}
                              >
                                 Skip this Release
                              </PushButton>
                           </div>
                        </div>
                     )}
                  <ToolsRowsList
                     setToolListTopRef={setToolListTopRef}
                     isDesktopApp={isDesktopApp}
                  />
               </ErrorBoundary>
            </CardPrimaryLarge>
            <CardSecondary key={"AddATool-1"} styles={{}}>
               <ErrorBoundary>
                  <AddATool />
               </ErrorBoundary>
            </CardSecondary>
            <CardPrimary key={"OutputControls"} styles={{}}>
               <ErrorBoundary>
                  <OutputControls />
               </ErrorBoundary>
            </CardPrimary>
            <CardSecondary key={"AddATool-2"} styles={{}}>
               <ErrorBoundary>
                  <Footer
                     isDesktopApp={isDesktopApp}
                     appVersions={appVersions}
                     newVersionIsReady={newVersionIsReady}
                     showVersionAlert={showVersionAlert}
                     desktopVersionDownloadLink={desktopVersionDownloadLink}
                     handleDesktopVersionLinkButton={
                        handleDesktopVersionLinkButton
                     }
                  />
               </ErrorBoundary>
            </CardSecondary>
            <div className={styles["bottom-navbar-wrap"]}>
               <BottomNavBar />
            </div>
         </div>
      </div>
   );
};

export default Home;
