import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import { ErrorBoundary } from "../../Components/ErrorHandling/ErrorBoundary/ErrorBoundary";
import MobileSlideContainer from "../../UI/MobileSlideContainer/MobileSlideContainer";

const Home = () => {
  const { allTools, toolsMetadata } = useSelector((state) => state.toolsData);
  const [toolListTopRef, setToolListTopRef] = useState();
  return (
    <div className={styles["home-page"]}>
      <div className={`${styles["column"]} ${styles["column-one"]} `}>
        <div className={styles["show-on-small-screens"]}>
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
                height: "100vh",
                overflowY: "auto",
                top: "0",
              }}
            >
              <ErrorBoundary>
                <FilterTools />
              </ErrorBoundary>
            </CardSecondary>
          </MobileSlideContainer>
        </div>
        <div className={styles["hide-on-small-screens"]}>
          <CardSecondary
            key={"FilterTools"}
            styles={{
              flexBasis: "223px",
              margin: " 0",
              minWidth: "223px",
              maxWidth: "223px",
              width: "223px",
              position: "sticky",
              height: "100vh",
              overflowY: "auto",
              top: "0",
            }}
          >
            <ErrorBoundary>
              <FilterTools />
            </ErrorBoundary>
          </CardSecondary>
        </div>
      </div>
      <div className={`${styles["column"]} ${styles["column-two"]} `}>
        <CardPrimaryLarge key={"ToolsRowsList"}>
          <ErrorBoundary>
            <ToolsRowsList setToolListTopRef={setToolListTopRef} />
          </ErrorBoundary>
        </CardPrimaryLarge>
        <CardSecondary key={"AddATool"} styles={{}}>
          <ErrorBoundary>
            <AddATool />
          </ErrorBoundary>
        </CardSecondary>
        <CardPrimary key={"OutputControls"} styles={{}}>
          <ErrorBoundary>
            <OutputControls />
          </ErrorBoundary>
        </CardPrimary>
        <CardSecondary key={"AddATool"} styles={{}}>
          <ErrorBoundary>
            <Footer />
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
