import { useState, useEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Header.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import LoginStatus from "../User/LoginStatus/LoginStatus";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import { headerDimensionsActions } from "../../store/elementDimensionsSlice";
import Measure from "react-measure";
import { ReactComponent as Logo } from "../../assets/logos/PTO_Logo-192x192.svg";

const Header = () => {
  const [scrolledUp, setScrolledUp] = useState(false);
  const [loginSlidePanelOpen, setLoginSlidePanelOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(null);
  const navbarRef = useRef(null); // unused now, but leaving for a planned change
  const user = useSelector((state) => state.auth.user);
  const showNavbarClass = scrolledUp ? "show-navbar" : "hide-navbar";
  const dispatch = useDispatch();
  const scrollPositionToAtivateNavbar = 95;

  ////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////
  // unused now, but leaving for a planned change
  const addAToolButtonHandler = () => {
    dispatch(audioToolDataActions.goToAddATool());
  };

  const loginSlidePanelToggleButtonHandler = () => {
    setLoginSlidePanelOpen(!loginSlidePanelOpen);
  };

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    function onScroll() {
      let currentPosition = window.pageYOffset; // or use document.documentElement.scrollTop;
      if (currentPosition < scrollPositionToAtivateNavbar) {
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

  useEffect(() => {
    dispatch(headerDimensionsActions.updateHeaderDimensions(navbarHeight));
  }, [navbarHeight]);

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  return (
    <Fragment>
      <Measure
        bounds
        onResize={(contentRect) => {
          setNavbarHeight(contentRect.bounds);
        }}
      >
        {({ measureRef }) => (
          <div
            ref={measureRef}
            className={
              styles["navbar-container"] + " " + styles[showNavbarClass]
            }
          >
            <a href="#">
              <h1 key="home" className="section-title">
                {" "}
                <span className={styles["logo-wrap"]}>
                  <Logo />
                </span>
                Production Tool Organizer
              </h1>
            </a>
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
            <div
              className={`${styles["navbar-login-wrap"]} ${styles["hide-on-small-screens"]}`}
            >
              {" "}
              <LoginStatus horizontalDisplay={true} />
            </div>
          </div>
        )}
      </Measure>
      <div className={styles["header-container"]}>
        <div className={styles["fixed-header-container"]}>
          <h1 key="home" className="section-title">
            {" "}
            <span className={styles["logo-wrap"]}>
              <Logo />
            </span>
            Production Tool Organizer
          </h1>
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
