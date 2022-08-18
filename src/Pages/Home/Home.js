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
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";

const Home = () => {
  const { allTools, toolsMetadata } = useSelector((state) => state.toolsData);

  const [toolListTopRef, setToolListTopRef] = useState();
  const testVar = {};
  return (
    <div className={styles["home-page"]}>
      {testVar.toUpperCase()}
      {!toolsMetadata && toolsMetadata._id.includes("error") && <BarLoader />}
      {toolsMetadata && !toolsMetadata._id.includes("error") && (
        <CardSecondary
          key={"FilterTools"}
          styles={{
            flexBasis: "10%",
            margin: " 0",
            minWidth: "min-content",
            width: "177px",
            position: "sticky",
            height: "100vh",
            overflowY: "auto",
            top: "0",
          }}
        >
          <FilterTools />
        </CardSecondary>
      )}

      <CardPrimaryLarge
        key={"ToolsRowsList"}
        styles={{
          flexBasis: "calc(90% - 177px)",
          minWidth: "0",
          margin: "0",
          flexGrow: "1",
          zIndex: "1",
          // backgroundImage:
          //   "url(https://www.transparenttextures.com/patterns/brushed-alum.png)",
        }}
      >
        <ToolsRowsList setToolListTopRef={setToolListTopRef} />
      </CardPrimaryLarge>
      <CardSecondary
        key={"AddATool"}
        styles={{
          flexBasis: "calc(90% - 177px)",
          minWidth: "0",
          margin: "0",
          flexGrow: "1",
          marginLeft: "177px",
          zIndex: "1",
        }}
      >
        <AddATool />
      </CardSecondary>

      <CardPrimary
        key={"OuputControls"}
        styles={{
          flexBasis: "calc(90% - 177px)",
          minWidth: "0",
          margin: "0",
          flexGrow: "1",
          zIndex: "10",
          marginLeft: "177px",
          zIndex: "1",
        }}
      >
        <OutputControls />
      </CardPrimary>
    </div>
  );
};

export default Home;
