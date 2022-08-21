import React, { useEffect, useState, Fragment } from "react";
import styles from "./App.module.css";
import Home from "./Pages/Home/Home";
import Header from "./Components/Header/Header";
import Admin from "./Components/Admin/Admin";
import GatherToolData from "./Hooks/GatherToolData";
import { audioToolDataActions } from "./store/audioToolDataSlice";
import { useSelector, useDispatch } from "react-redux";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import { getUserCookie, getUserUserByToken } from "./storage/userDB";
import { authActions } from "./store/authSlice";
import { ErrorBoundary } from "./Components/ErrorHandling/ErrorBoundary/ErrorBoundary";
import CardPrimary from "./UI/Cards/CardPrimary/CardPrimary";

const App = () => {
  const [user, setUser] = useState(false);
  const toolsData = useSelector((state) => state.toolsData);

  const dispatch = useDispatch();
  useEffect(() => {
    getUserCookie()
      .then((res) => {
        if (res.status >= 400) {
          GatherToolData()
            .then((data) => {
              console.log("🟣 | getData | questionsFromDB", data);
              dispatch(audioToolDataActions.initState(data));
            })
            .catch((err) => {
              console.log(
                "%c --> %cline:34%cerr----->",
                "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                "color:#fff;background:rgb(254, 67, 101);padding:3px;border-radius:2px",
                err
              );
              if (err.status >= 500) {

                const message = 
                  " *** " +
                    err.statusText +
                    " *** It looks like we can not make a connection. Here is the error we received: Please make sure there is an internet connection and refresh the browser. if the problem continues, please send a quick email so this can be looked into. Email Address: general@glassinteractive.com.com"
                    error     ErrorElement(message)
                
              } else {
                alert(
                  "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
                    err.status +
                    " |" +
                    err.statusText +
                    " | " +
                    err.request.responseURL
                );
              }
            });
        } else {
          getUserUserByToken(res.data.cookie).then((userProfile) => {
            setUser({ ...userProfile, token: res.data.cookie });
          });
        }
      })
      .catch((err) => {
        console.log(
          "%c --> %cline:34%cerr----->",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(254, 67, 101);padding:3px;border-radius:2px",
          err
        );
        alert(" An error: ", err.toString());
      });
  }, []);

  useEffect(() => {
    if (user) {
      dispatch(authActions.logIn(user));
      GatherToolData(user)
        .then((data) => {
          console.log("🟣 | getData | questionsFromDB", data);
          dispatch(audioToolDataActions.initState(data));
        })
        .catch((err) => {
          console.log(
            "%c --> %cline:34%cerr----->",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(254, 67, 101);padding:3px;border-radius:2px",
            err
          );
          if (err.status >= 500) {
            alert(
              " *** " +
                err.statusText +
                " *** It looks like we can not make a connection. Here is the error we received: Please make sure there is an internet connection and refresh the browser. if the problem continues, please send a quick email so this can be looked into. Email Address: general@glassinteractive.com.com"
            );
          } else {
            alert(
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com if the problem continues. Here is the data: " +
                err.status +
                " |" +
                err.statusText +
                " | " +
                err.request.responseURL
            );
          }
        });
    }
  }, [user]);

  return (
    <div className={styles["app-container"]}>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      {user.isAdmin && (
        <Fragment>
          <div className={styles["admin-notice"]}>
            <h3>GLOBAL ADMIN MODE</h3>
          </div>
          <Admin />
        </Fragment>
      )}
      <div className={styles["content-container"]}>
        {/* !toolsData.allTools && <BarLoader />*/}
        <ErrorBoundary>{/*toolsData.allTools &&*/ <Home />}</ErrorBoundary>
      </div>
    </div>
  );
};

export default App;
