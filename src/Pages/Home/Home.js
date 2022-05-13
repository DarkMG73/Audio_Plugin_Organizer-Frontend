import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Home.module.css";
import CardPrimary from "../../UI/Cards/CardPrimary/CardPrimary";
import AddATool from "../../Components/AddATool/AddATool";
import FilterTools from "../../Components/FilterTools/FilterTools";

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
      <CardPrimary key={"filter"}>
        {toolsMetadata && <FilterTools />}
      </CardPrimary>
      <AddATool />
      {toolsMetadata._id.map((id) => (
        <div>
          <CardPrimary key={id}>
            {allTools[id].name && (
              <h4 key={id} className={styles[allTools[id].name]}>
                {allTools[id].name}
              </h4>
            )}
            {Object.keys(allTools[id]).map(function (key) {
              return (
                <div>
                  {key}; {allTools[id][key]}
                </div>
              );
            })}
          </CardPrimary>
        </div>
      ))}
    </div>
  );
};

export default Home;
