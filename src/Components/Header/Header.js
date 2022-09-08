import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Header.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import LoginStatus from "../User/LoginStatus/LoginStatus";
import { audioToolDataActions } from "../../store/audioToolDataSlice";

const Header = () => {
  const [scrolledUp, setScrolledUp] = useState(false);
  const [loginSlidePanelOpen, setLoginSlidePanelOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const showNavbarClass = scrolledUp ? "show-navbar" : "hide-navbar";
  const dispatch = useDispatch();

  const addAToolButtonHandler = () => {
    dispatch(audioToolDataActions.goToAddATool());
  };
  useEffect(() => {
    function onScroll() {
      let currentPosition = window.pageYOffset; // or use document.documentElement.scrollTop;

      if (currentPosition < 470) {
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

  const loginSlidePanelToggleButtonHandler = () => {
    setLoginSlidePanelOpen(!loginSlidePanelOpen);
  };

  return (
    <Fragment>
      {}
      <div
        className={styles["navbar-container"] + " " + styles[showNavbarClass]}
      >
        <h1 key="home" className="section-title">
          Production Tool Organizer
        </h1>

        <div
          className={`${styles["login-button-wrap"]} ${styles["show-on-small-screens"]}`}
        >
          {!user && (
            <PushButton
              inputOrButton="button"
              id="create-entry-btn"
              colorType="secondary"
              value="Add a Question"
              data=""
              size="small"
              onClick={loginSlidePanelToggleButtonHandler}
              styles={{ margin: "0 auto" }}
            >
              {loginSlidePanelOpen && <span>CLOSE Login/Sign Up</span>}{" "}
              {!loginSlidePanelOpen && <span>Login/Sign up</span>}
            </PushButton>
          )}
          {user && (
            <PushButton
              inputOrButton="button"
              id="create-entry-btn"
              colorType="secondary"
              value="Add a Question"
              data=""
              size="small"
              onClick={loginSlidePanelToggleButtonHandler}
              styles={{ margin: "0 auto" }}
            >
              {loginSlidePanelOpen && <span>CLOSE Login/logout</span>}{" "}
              {!loginSlidePanelOpen && <span>Logout</span>}
            </PushButton>
          )}
          {loginSlidePanelOpen && (
            <div className={`${styles["login-slide-panel"]} `}>
              <LoginStatus horizontalDisplay={false} />
            </div>
          )}
        </div>
        <div className={styles["hide-on-small-screens"]}>
          {" "}
          <LoginStatus horizontalDisplay={true} />
        </div>
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
