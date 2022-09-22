import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AudioPluginSelector.module.css";
import GatherToolData from "../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import CardPrimaryLarge from "../../UI/Cards/CardPrimaryLarge/CardPrimaryLarge";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import { savePlugin } from "../../storage/audioToolsDB";
import { isValidHttpUrl } from "../../Hooks/utility";
import placeholderImage from "../../assets/images/product-photo-placeholder-5.png";
import LocalErrorDisplay from "../ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";
import LoginStatus from "../User/LoginStatus/LoginStatus";

const AudioPluginSelector = () => {
  const dispatch = useDispatch();
  const [toolsFromLibrary, setToolsFromLibrary] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [selectedTools, setSelectedTools] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const [localError, setLocalError] = useState({
    active: false,
    message: null,
  });

  ////////////////////////////////////////
  /// HELPER FUNCTIONS
  ////////////////////////////////////////
  const runGatherToolData = (user) => {
    GatherToolData(user)
      .then((data) => {
        if (process.env.NODE_ENV !== "production")
          console.log(
            "%c Getting tool data from DB:",
            "color:#fff;background:#777;padding:14px;border-radius:0 25px 25px 0",
            data
          );
        dispatch(audioToolDataActions.initState(data));
      })
      .catch((err) => {
        console.log(
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px;padding:3px;border-radius:0 25px 25px 0",
          err
        );
        if (err.hasOwnProperty("status") && err.status >= 500) {
          setLocalError({
            active: true,
            message:
              " *** " +
              err.statusText +
              " *** It looks like we can not make a connection. Here is the error we received: Please make sure there is an internet connection and refresh the browser. if the problem continues, please send a quick email so this can be looked into. Email Address: general@glassinteractive.com.com",
          });
        } else if (err.hasOwnProperty("status")) {
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              err.request.responseURL,
          });
        } else {
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err,
          });
        }
      });
  };

  // Product Photo Logic
  const createPhtoURLImage = (tool) => {
    let output = "";
    const title = tool.title;
    const value = tool.photoURL;
    const isValidLink = isValidHttpUrl(value);
    if (isValidLink) {
      output = <img key={title + value} src={value} alt={title} />;
    } else {
      const photoSrc =
        value !== "" && value !== undefined
          ? "./assets/images/" + value
          : placeholderImage;
      output = (
        <img
          key={title + value}
          src={photoSrc}
          // src={image}
          alt={title}
        />
      );
    }

    return output;
  };

  ////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////
  const buttonChangeHandler = (e) => {
    const newSelectedToolsArray = [...selectedTools];
    const value = e.target.closest("button").value;

    if (newSelectedToolsArray.includes(value)) {
      newSelectedToolsArray.splice(selectedTools.indexOf(value), 1);
      setSelectedTools(newSelectedToolsArray);
    } else {
      newSelectedToolsArray.push(value);
      setSelectedTools(newSelectedToolsArray);
    }
  };

  const submitButtonHandler = () => {
    toolsFromLibrary.forEach((tool) => {
      if (selectedTools.includes(tool._id)) {
        const theData = tool;
        savePlugin({ user, theData }, true).then((res) => {
          if (res.status && res.status < 299) {
            runGatherToolData(user);
            setSelectedTools([]);
            setRefreshList(!refreshList);
          } else if (res.response.status === 404) {
            setSelectedTools([]);
          } else if (res.response.status === 401) {
            setShowLoginModal(true);
          } else {
            alert(
              "There was an error when trying to save the new entry. Here is the message from the server: " +
                res.message
            );
          }
        });
      }
    });
  };

  const localErrorButtonHandler = () => {
    setLocalError({ active: !localError, message: localError.message });
  };

  const loginModalCloseButtonHandler = () => {
    console.log("Click");
    setShowLoginModal(false);
  };

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    GatherToolData().then((data) => {
      if (process.env.NODE_ENV !== "production")
        console.log(
          "%c Getting tool data from DB:",
          "color:#fff;background:#028218;padding:14px;border-radius:0 25px 25px 0",
          data
        );

      if (data.allTools.hasOwnProperty("error")) return;

      GatherToolData(user).then((userData) => {
        if (process.env.NODE_ENV !== "production")
          console.log(
            "%c Getting * USER's * tool data from DB:",
            "color:#fff;background:#028218;padding:14px;border-radius:0 25px 25px 0",
            data
          );

        const usersIDArray = Object.keys(userData.allTools);
        const output = [];

        for (const key in data.allTools) {
          if (!usersIDArray.includes(key)) output.push(data.allTools[key]);
        }

        if (output.length <= 0) {
          for (const key in data.allTools) {
            output.push(data.allTools[key]);
          }
        }
        setToolsFromLibrary(output);
        // dispatch(audioToolDataActions.initState(data));
      });
    });
  }, [refreshList]);

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  return (
    <CardPrimaryLarge key="outer-container" styles={{ maxWidth: "100%" }}>
      {" "}
      {showLoginModal && (
        <div className={styles["login-modal-container"]}>
          <CardPrimaryLarge
            key="login-container"
            styles={{ maxWidth: "800px" }}
          >
            <CardSecondary
              key="login-container"
              styles={{ maxWidth: "100%", padding: "2em 4em" }}
            >
              <p>
                It is necessary to be logged in before adding any items from the
                library. If you do not yet have an account, it is quick and easy
                to make one. Login and Signup forms are avilable below.
              </p>
            </CardSecondary>
            <LoginStatus />
            <PushButton
              key={"addatoolform-9"}
              inputOrButton="input"
              type="button"
              id="quest-submit-btn"
              colorType="secondary"
              value="Cancel and return ->"
              data=""
              size="large"
              onClick={loginModalCloseButtonHandler}
              styles={{
                maxWidth: "80%",
                margin: "0 auto",
                width: "100%",
                borderRadius: "inherit",
                boxShadow: "0 0 20px var(--iq-color-accent)",
                padding: "1em",
              }}
            />
          </CardPrimaryLarge>
        </div>
      )}
      <div className={styles["audio-plugin-selector-container"]}>
        {localError.active && (
          <div
            className={
              styles["error-wrapper"] +
              " " +
              (localError.active && styles["error-active"])
            }
          >
            <button
              className={styles["error-close-button"]}
              onClick={localErrorButtonHandler}
            >
              X
            </button>

            <LocalErrorDisplay message={localError.message} />
          </div>
        )}
        <h2 key="home" className="section-title">
          Plugins & Tools Library
        </h2>
        <p className={styles["welcome-text"]}>
          Either move the slider or slick on the slider empty space to select
          each tool you wish to add to your library. When you are finished,
          click the "Submit" button at the top.
        </p>
        <p>
          <b>
            To search for a name or company, use the browser's finder tool by
            clicking CTRL+F (PC) or CMD+F (MAC)
          </b>
        </p>
        <br />
        {toolsFromLibrary && (
          <PushButton
            key={"addatoolform-9"}
            inputOrButton="input"
            type="submit"
            id="quest-submit-btn"
            colorType="primary"
            value="Submit"
            data=""
            size="large"
            onClick={submitButtonHandler}
            styles={{
              background: "var(--iq-color-accent-gradient)",
              position: "sticky",
              top: "50px",
              maxWidth: "80%",
              margin: "0 auto",
              width: "100%",
            }}
          >
            Submit
          </PushButton>
        )}
        <ul key="library-list" className={styles["library-list"]}>
          {toolsFromLibrary &&
            toolsFromLibrary.map((tool) => {
              return (
                <li key={"item-li-" + tool._id}>
                  <li key={"item-li-inner-" + tool._id}>
                    <button
                      key={"item-button-" + tool._id}
                      id="line-inner-wrap"
                      className={
                        styles["line-inner-wrap"] +
                        " " +
                        (selectedTools.includes(tool._id) &&
                          styles["selected-tool"])
                      }
                      onClick={buttonChangeHandler}
                      value={tool._id}
                    >
                      <span
                        id="line-text-inner-wrap"
                        className={styles["line-text-inner-wrap"]}
                      >
                        <span
                          className={
                            styles[tool.name + " name"] +
                            " " +
                            styles["item-title"]
                          }
                        >
                          {tool.name}
                        </span>
                        {tool.company && (
                          <span className={styles[tool.name + " company"]}>
                            <Fragment>
                              <span>By </span> {tool.company}
                            </Fragment>
                          </span>
                        )}
                        {(tool.functions && tool.functions.length) > 0 && (
                          <span className={styles[tool.name + " functions"]}>
                            <Fragment>
                              <span>Functions: </span>{" "}
                              {tool.functions.toString()}
                            </Fragment>
                          </span>
                        )}
                        {tool.productURL && (
                          <span className={styles[tool.name + " productURL"]}>
                            <Fragment>
                              <a
                                href={tool.productURL}
                                alt={tool.name + " by " + tool.company}
                                target="_blank"
                                rel="noreferrer"
                              >
                                More detail
                              </a>
                            </Fragment>
                          </span>
                        )}
                      </span>
                      {tool.photoURL && (
                        <span
                          className={
                            styles[tool.name + " photoURL"] +
                            " " +
                            styles["image-wrap"]
                          }
                        >
                          <span
                            className={
                              styles[tool.name + " photoURL"] +
                              " " +
                              styles["image-inner-wrap"]
                            }
                          >
                            <Fragment>{createPhtoURLImage(tool)}</Fragment>
                          </span>
                        </span>
                      )}
                    </button>
                  </li>
                </li>
              );
            })}
        </ul>
      </div>
    </CardPrimaryLarge>
  );
};

export default AudioPluginSelector;
