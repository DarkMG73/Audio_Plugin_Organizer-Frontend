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

  console.log(
    "%c --> %cline:8%ctoolsMetadata",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
    toolsMetadata
  );

  console.log(
    "%c --> %cline:8%callTools",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
    allTools
  );
  return (
    <div className={styles["home-page"]}>
      {toolsMetadata && !toolsMetadata._id.includes("error") && (
        <CardSecondary key={"filter"}>
          <FilterTools />
        </CardSecondary>
      )}
      <CardPrimary>
        <ToolsRowsList />
      </CardPrimary>
      <CardSecondary key={"filter"}>
        <AddATool />
      </CardSecondary>
    </div>
  );
};

export default Home;
