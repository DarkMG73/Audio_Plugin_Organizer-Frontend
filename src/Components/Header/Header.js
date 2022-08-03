import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Header.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import LoginStatus from "../User/LoginStatus/LoginStatus";
import { audioToolDataActions } from "../../store/audioToolDataSlice";

const Header = () => {
  const [scrolledUp, setScrolledUp] = useState(false);
  const showNavbarClass = scrolledUp ? "show-navbar" : "hide-navbar";
  const dispatch = useDispatch();

  const addAToolButtonHandler = () => {
    dispatch(audioToolDataActions.goToAddATool());
  };
  useEffect(() => {
    function onScroll() {
      let currentPosition = window.pageYOffset; // or use document.documentElement.scrollTop;

      if (currentPosition < 590) {
        // downscroll code
        setScrolledUp(false);
      } else {
        // upscroll code
        setScrolledUp(true);
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Fragment>
      <div
        className={styles["navbar-container"] + " " + styles[showNavbarClass]}
      >
        <h1 key="home" className="section-title">
          Production Tool Organizer
        </h1>
        <PushButton
          inputOrButton="button"
          id="create-entry-btn"
          colorType="secondary"
          value="Add a Question"
          data=""
          size="small"
          onClick={addAToolButtonHandler}
        >
          <span>Add a Production Tool</span>
        </PushButton>
        <LoginStatus horizontalDisplay={true} />
      </div>
      <div className={styles["header-container"]}>
        <div className={styles["fixed-header-container"]}>
          <h1 key="home" className="section-title">
            Production Tool Organizer
          </h1>
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
