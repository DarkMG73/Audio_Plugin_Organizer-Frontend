import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Home.module.css";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import AddATool from "../../Components/AddATool/AddATool";
import FilterTools from "../../Components/FilterTools/FilterTools";
import ToolsRowsList from "../../Components/ToolsRows/ToolsRowsList/ToolsRowsList";

const Home = () => {
  const { allTools, toolsMetadata } = useSelector((state) => state.toolsData);

  return (
    <div className={styles["home-page"]}>
      {toolsMetadata && !toolsMetadata._id.includes("error") && (
        <CardSecondary
          key={"FilterTools"}
          styles={{
            flexBasis: "10%",
            margin: " 0",
            minWidth: "min-content",
            width: "177px",
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
        }}
      >
        <ToolsRowsList />
      </CardPrimary>
      <CardSecondary key={"AddATool"}>
        <AddATool />
      </CardSecondary>
    </div>
  );
};

export default Home;
