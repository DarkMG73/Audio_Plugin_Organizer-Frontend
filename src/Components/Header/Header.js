import { useState, useEffect, Fragment } from "react";
import Measure from "react-measure";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Header.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import LoginStatus from "../User/LoginStatus/LoginStatus";
// import { audioToolDataActions } from '../../store/audioToolDataSlice';
import { headerDimensionsActions } from "../../store/elementDimensionsSlice";

// import { ReactComponent as Logo } from '../../assets/logos/PTO_Logo-192x192.svg';
import Logo from "../../assets/logos/icon.png";
import AppThemeSwitcher from "../AppThemeSwitcher/AppThemeSwitcher";

const Header = () => {
   const [scrolledUp, setScrolledUp] = useState(false);
   const [loginSlidePanelOpen, setLoginSlidePanelOpen] = useState(false);
   const [showSignUpInLoginSlide, setShowSignUpInLoginSlide] = useState(false);
   const [navbarHeight, setNavbarHeight] = useState(null);
   // const navbarRef = useRef(null); // unused now, but leaving for a planned change
   const user = useSelector((state) => state.auth.user);
   const showNavbarClass = scrolledUp ? "show-navbar" : "hide-navbar";
   const dispatch = useDispatch();
   const scrollPositionToAtivateNavbar = 95;

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   // unused now, but leaving for a planned change
   // const addAToolButtonHandler = () => {
   //   dispatch(audioToolDataActions.goToAddATool());
   // };
   const closeLoginSlidePanel = (open) => {
      setShowSignUpInLoginSlide(open);
      setLoginSlidePanelOpen(open);
   };
   const loginSlidePanelToggleButtonHandler = (e) => {
      const { value } = e.target.closest("button");
      if (value === "close") {
         closeLoginSlidePanel(false);
      } else {
         setLoginSlidePanelOpen(true);
         if (value === "signup") setShowSignUpInLoginSlide(true);
      }
   };

   ////////////////////////////////////////
   /// EFFECTS
   ////////////////////////////////////////
   useEffect(() => {
      function onScroll() {
         const currentPosition = window.pageYOffset; // or use document.documentElement.scrollTop;
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
                  <a href="#" className={styles["section-title-wrap"]}>
                     <h1 key="home" className="section-title animate">
                        {" "}
                        <span className={styles["logo-wrap"]}>
                           <img src={Logo} alt="logo" />
                        </span>
                        Production Tool Organizer
                     </h1>
                  </a>
                  <div className={`${styles["button-outer-container"]} `}>
                     <div className={`${styles["login-button-wrap"]} `}>
                        {!user && (
                           <div
                              className={`${styles["login-button-inner-wrap"]} ${styles["show-on-small-screens"]}`}
                           >
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
                                 {loginSlidePanelOpen && <span>CLOSE</span>}
                                 {!loginSlidePanelOpen && (
                                    <span>
                                       Login or
                                       <br />
                                       Sign up
                                    </span>
                                 )}
                              </PushButton>
                           </div>
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
                              {loginSlidePanelOpen && (
                                 <span>CLOSE Login/logout</span>
                              )}
                              {!loginSlidePanelOpen && <span>Logout</span>}
                           </PushButton>
                        )}
                     </div>
                     {!user && (
                        <div
                           className={`${styles["login-button-wrap"]} ${styles["hide-on-small-screens"]}`}
                        >
                           {!loginSlidePanelOpen && (
                              <Fragment>
                                 <PushButton
                                    inputOrButton="button"
                                    id="create-entry-btn"
                                    colorType="secondary"
                                    value="login"
                                    data=""
                                    size="small"
                                    onClick={loginSlidePanelToggleButtonHandler}
                                    styles={{ margin: "0 auto" }}
                                 >
                                    {loginSlidePanelOpen && (
                                       <span>CLOSE Login</span>
                                    )}
                                    {!loginSlidePanelOpen && <span>Login</span>}
                                 </PushButton>
                                 <PushButton
                                    inputOrButton="button"
                                    id="create-entry-btn"
                                    colorType="secondary"
                                    value="signup"
                                    data=""
                                    size="small"
                                    onClick={loginSlidePanelToggleButtonHandler}
                                    styles={{ margin: "0 auto" }}
                                 >
                                    {loginSlidePanelOpen && (
                                       <span>CLOSE Sign Up</span>
                                    )}
                                    {!loginSlidePanelOpen && (
                                       <span>Sign up</span>
                                    )}
                                 </PushButton>
                              </Fragment>
                           )}
                        </div>
                     )}
                     {loginSlidePanelOpen && (
                        <div className={`${styles["login-slide-panel"]} `}>
                           <LoginStatus
                              horizontalDisplay={false}
                              showLoginForm={!showSignUpInLoginSlide}
                              showSignupForm={showSignUpInLoginSlide}
                              callback={closeLoginSlidePanel}
                           />
                           <div
                              className={`${styles["login-slide-panel-close-wrap"]} `}
                           >
                              <PushButton
                                 inputOrButton="button"
                                 id="create-entry-btn"
                                 colorType="secondary"
                                 value="close"
                                 data=""
                                 size="small"
                                 onClick={loginSlidePanelToggleButtonHandler}
                                 styles={{ margin: "0 auto" }}
                              >
                                 <span>Cancel</span>
                              </PushButton>
                           </div>
                        </div>
                     )}
                     <div className={`${styles["theme-selector-wrap"]}`}>
                        <AppThemeSwitcher />
                     </div>
                  </div>
               </div>
            )}
         </Measure>
         <div className={styles["header-container"]}>
            <div className={styles["fixed-header-container"]}>
               <h1 key="home" className="section-title animate">
                  {" "}
                  <span className={styles["logo-wrap"]}>
                     <img src={Logo} alt="logo" />
                  </span>
                  Production Tool Organizer
               </h1>
            </div>
         </div>
      </Fragment>
   );
};

export default Header;
