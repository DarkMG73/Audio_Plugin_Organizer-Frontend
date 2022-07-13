import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Home.module.css";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import AddATool from "../../Components/AddATool/AddATool";
import Register from "../../Components/Register/Register";
import FilterTools from "../../Components/FilterTools/FilterTools";
import ToolsRowsList from "../../Components/ToolsRows/ToolsRowsList/ToolsRowsList";
import OutputControls from "../../Components/OutputControls/OutputControls";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
const Home = () => {
  const { allTools, toolsMetadata } = useSelector((state) => state.toolsData);

  return (
    <div className={styles["home-page"]}>
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
      <CardPrimary
        key={"ToolsRowsList"}
        styles={{
          flexBasis: "calc(90% - 177px)",
          minWidth: "0",
          margin: "0",
          flexGrow: "1",
          // backgroundImage:
          //   "url(https://www.transparenttextures.com/patterns/brushed-alum.png)",
        }}
      >
        <ToolsRowsList />
      </CardPrimary>
      <CardSecondary
        key={"AddATool"}
        styles={{
          flexBasis: "calc(90% - 177px)",
          minWidth: "0",
          margin: "0",
          flexGrow: "1",
          zIndex: "10",
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
        }}
      >
        <OutputControls />
      </CardPrimary>
      <CardSecondary
        key={"RegistrationForm"}
        styles={{
          flexBasis: "calc(90% - 177px)",
          minWidth: "0",
          margin: "0",
          flexGrow: "1",
          zIndex: "10",
        }}
      >
        <Register />
      </CardSecondary>
    </div>
  );
};

export default Home;
