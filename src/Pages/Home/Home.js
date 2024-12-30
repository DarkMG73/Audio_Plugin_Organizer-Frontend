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

const Home = () => {
   const [toolListTopRef, setToolListTopRef] = useState();

   function isElectron() {
      // Renderer process
      if (
         typeof window !== "undefined" &&
         typeof window.process === "object" &&
         window.process.type === "renderer"
      ) {
         return true;
      }

      // Main process
      if (
         typeof process !== "undefined" &&
         typeof process.versions === "object" &&
         !!process.versions.electron
      ) {
         return true;
      }

      // Detect the user agent when the `nodeIntegration` option is set to true
      if (
         typeof navigator === "object" &&
         typeof navigator.userAgent === "string" &&
         navigator.userAgent.indexOf("Electron") >= 0
      ) {
         return true;
      }

      return false;
   }

   const isDesktopApp = isElectron();
   return (
      <div key="home-page" className={styles["home-page"]}>
         <div
            key="column-one"
            className={`${styles["column"]} ${styles["column-one"]} `}
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
                  <Footer isDesktopApp={isDesktopApp} />
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
