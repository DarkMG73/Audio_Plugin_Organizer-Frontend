import { useState, useEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Header.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import LoginStatus from "../User/LoginStatus/LoginStatus";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import { headerDimensionsActions } from "../../store/elementDimensionsSlice";
import Measure from "react-measure";

const Header = () => {
  const [scrolledUp, setScrolledUp] = useState(false);
  const [loginSlidePanelOpen, setLoginSlidePanelOpen] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(null);
  const navbarRef = useRef(null);
  const user = useSelector((state) => state.auth.user);
  const showNavbarClass = scrolledUp ? "show-navbar" : "hide-navbar";
  const dispatch = useDispatch();

  const addAToolButtonHandler = () => {
    dispatch(audioToolDataActions.goToAddATool());
  };

  const loginSlidePanelToggleButtonHandler = () => {
    setLoginSlidePanelOpen(!loginSlidePanelOpen);
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

  useEffect(() => {
    dispatch(headerDimensionsActions.updateHeaderDimensions(navbarHeight));
    console.log(
      "%c --> %cline:59%cnavbarHeight",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
      navbarHeight
    );
  }, [navbarHeight]);

  return (
    <Fragment>
      <Measure
        bounds
        onResize={(contentRect) => {
          console.log(
            "%c --> %cline:57%ccontentRect",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
            contentRect
          );
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
        )}
      </Measure>
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
