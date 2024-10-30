import { useState, useEffect, Fragment, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./AudioPluginSelector.module.css";
import GatherToolData from "../../Hooks/GatherToolData";
import { audioToolDataActions } from "../../store/audioToolDataSlice";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import CardPrimaryLarge from "../../UI/Cards/CardPrimaryLarge/CardPrimaryLarge";
import CardSecondary from "../../UI/Cards/CardSecondary/CardSecondary";
import { saveManyPlugins } from "../../storage/audioToolsDB";
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
  const [listOpen, setListOpen] = useState([]);
  const listHeightRef = useRef();
  const headerPosition = useSelector((state) => state.elementDimensions.header);
  const [localError, setLocalError] = useState({
    active: false,
    message: null,
  });
  const successCallback = () => {
    runGatherToolData(user, setLocalError, GatherToolData);
    alert(
      "The items were successfully added to your library! Changes should already be reflected in your library area (above). In addition, the items added should have been removed from the selector tool. If not, please refresh the browser."
    );
  };

  ////////////////////////////////////////
  /// HELPER FUNCTIONS
  ////////////////////////////////////////
  const runGatherToolData = (user) => {
    GatherToolData(user)
      .then((data) => {
        if (process.env.NODE_ENV === "development")
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
              `***\n\nIt looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request.\n\nIt is also possible that the server's security software detected abnormally high traffic between this IP address and the server.  This is nothing anyone did wrong, just a rare occurrence with a highly-secured server. This will clear itself sometime within the next thirty minutes or so.\n\nPlease contact us if you find you are online and this error does not clear within an hour.\n\nSorry for the trouble. 😢`,
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
  const createPhotoURLImage = (tool) => {
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

  const getCompanyNamesArray = (toolsListArray) => {
    const output = new Set();
    toolsListArray.forEach((tool) => {
      output.add(tool.company);
    });

    return Array.from(output);
  };

  const sortToolsList = (toolsListArray, sortArray) => {
    const output = [];
    sortArray.forEach((topic) => {
      output.push({
        [topic]: toolsListArray.filter((item) => item.company === topic),
      });
    });
    return output;
  };

  ////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////
  const sectionToggleButtonHandler = (e) => {
    const listID = e.target.getAttribute("data-ID");

    if (listOpen.includes(listID)) {
      const newArray = listOpen.slice();
      newArray.splice(newArray.indexOf(listID), 1);
      setListOpen(newArray);
      return;
    }
    setListOpen([listID, ...listOpen]);
  };

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
    const tempToolsLibraryArray = [];
    const flattenedToolsLibraryArray = [];
    toolsFromLibrary.forEach((toolGroup) =>
      Object.keys(toolGroup).forEach((key) => {
        tempToolsLibraryArray.push(toolGroup[key]);
      })
    );
    tempToolsLibraryArray.forEach((toolGroupArray) =>
      toolGroupArray.forEach((tool) => {
        flattenedToolsLibraryArray.push(tool);
      })
    );

    const theData = [];

    selectedTools.forEach((selectedID) =>
      flattenedToolsLibraryArray.forEach((toolObj) => {
        if (toolObj.identifier === selectedID) {
          if (toolObj.hasOwnProperty("_id")) {
            toolObj.masterLibraryID = toolObj._id;
            delete toolObj._id;
          }
          theData.push(toolObj);
        }
      })
    );

    saveManyPlugins({ user, theData }, true).then((res) => {
      if (res.status && res.status < 299) {
        runGatherToolData(user);
        setSelectedTools([]);
        setRefreshList(!refreshList);
        successCallback();
      } else if (res.response.status === 404) {
        const failedIdsAndNames = res.response.data.err.writeErrors.map(
          (item) => ({ id: item.op._id, name: item.op.name })
        );
        const failedNames = failedIdsAndNames.map((item) => item.name);
        const runSuccessCallback = window.confirm(
          `The following were skipped because they were already in your database:\n\n${failedNames.join(
            "\n"
          )}\n\nAny not listed above were entered successfully.\n\n Click "OK" to finish or "CANCEL" to return to the form.\n\nIf you intended to add a different tool that happens to have the exact same name as one you already have saved, please add it again, but alter the name in some way. The name must be unique.`
        );
        if (runSuccessCallback) successCallback();
      } else if (res.response.status === 401) {
        setShowLoginModal(true);
      } else {
        alert(
          "There was an error when trying to save the new entry. Here is the message from the server: " +
            res.message
        );
      }
    });
  };

  const localErrorButtonHandler = () => {
    setLocalError({ active: !localError, message: localError.message });
  };

  const loginModalCloseButtonHandler = () => {
    setShowLoginModal(false);
  };

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    GatherToolData().then((data) => {
      if (process.env.NODE_ENV === "development")
        console.log(
          "%c Getting tool data from DB:",
          "color:#fff;background:#028218;padding:14px;border-radius:0 25px 25px 0",
          data
        );

      if (data.allTools.hasOwnProperty("error")) return;

      GatherToolData(user).then((userData) => {
        if (process.env.NODE_ENV === "development")
          console.log(
            "%c Getting * USER's * tool data from DB:",
            "color:#fff;background:#028218;padding:14px;border-radius:0 25px 25px 0",
            data
          );

        const usersIDArray = Object.keys(userData.allTools).map(
          (key) => userData.allTools[key].identifier
        );

        const output = [];

        for (const key in data.allTools) {
          if (!usersIDArray.includes(data.allTools[key].identifier)) {
            output.push(data.allTools[key]);
          }
        }

        if (output.length <= 0) {
          for (const key in data.allTools) {
            output.push(data.allTools[key]);
          }
        }
        const sortedToolsList = sortToolsList(
          output,
          getCompanyNamesArray(output)
        ).sort((a, b) => {
          if (
            Object.keys(a)[0].toLowerCase() < Object.keys(b)[0].toLowerCase()
          ) {
            return -1;
          }
          if (
            Object.keys(a)[0].toLowerCase() > Object.keys(b)[0].toLowerCase()
          ) {
            return 1;
          }
          return 0;
        });

        setToolsFromLibrary(sortedToolsList);
        // dispatch(audioToolDataActions.initState(data));
      });
    });
  }, [refreshList, user]);

  ////////////////////////////////////////
  /// OUTPUT
  ////////////////////////////////////////
  return (
    <CardPrimaryLarge
      key="outer-container"
      styles={{ width: "100%", maxWidth: "100%" }}
    >
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
                to make one. Login and Signup forms are available below.
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
          <div
            style={{
              position: "sticky",
              top: headerPosition.bottom - 3 + "px",
            }}
          >
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
                maxWidth: "80%",
                margin: "0 auto",
                width: "100%",
              }}
            >
              Submit
            </PushButton>
          </div>
        )}
        <ul key="library-list" className={styles["library-list-container"]}>
          {toolsFromLibrary &&
            toolsFromLibrary.map((companyListObject) => {
              const companyName = Object.keys(companyListObject)[0];
              const sectionTitle =
                companyName !== "" ? companyName : "* Company Unknown *";
              return (
                <Fragment>
                  {" "}
                  <div
                    style={{
                      position: "sticky",
                      top: headerPosition.bottom + 38 + "px",
                    }}
                  >
                    <button
                      className={styles["section-toggle-button"]}
                      onClick={sectionToggleButtonHandler}
                      data-ID={companyName}
                    >
                      <h3>{sectionTitle}</h3>
                    </button>
                  </div>
                  <div
                    className={`${styles["library-list-outer-wrap"]}`}
                    style={{
                      height: listHeightRef.current
                        ? listHeightRef.current.height
                        : "TEST",
                    }}
                    ref={listHeightRef}
                  >
                    {listOpen.includes(companyName) && (
                      <div className={`${styles["library-list"]}`}>
                        {companyListObject[companyName].map((tool) => {
                          return (
                            <li key={"item-li-" + tool.identifier}>
                              <li key={"item-li-inner-" + tool.identifier}>
                                <button
                                  key={"item-button-" + tool.identifier}
                                  id="line-inner-wrap"
                                  className={
                                    styles["line-inner-wrap"] +
                                    " " +
                                    (selectedTools.includes(tool.identifier) &&
                                      styles["selected-tool"])
                                  }
                                  onClick={buttonChangeHandler}
                                  value={tool.identifier}
                                >
                                  <span
                                    id="line-text-inner-wrap"
                                    className={styles["line-text-inner-wrap"]}
                                  >
                                    <span
                                      className={` ${
                                        styles[tool.name + " name"]
                                      } ${styles["item-title"]}`}
                                    >
                                      {tool.name}
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
                                          <Fragment>
                                            {createPhotoURLImage(tool)}
                                          </Fragment>
                                        </span>
                                      </span>
                                    )}

                                    {tool.company && (
                                      <span
                                        className={`${
                                          styles[tool.name + "-company"]
                                        } ${styles["item-company"]}`}
                                      >
                                        <Fragment>
                                          <span>By </span> {tool.company}
                                        </Fragment>
                                      </span>
                                    )}
                                    {(tool.functions && tool.functions.length) >
                                      0 && (
                                      <span
                                        className={`${
                                          styles[tool.name + "-functions"]
                                        } ${styles["item-functions"]}}`}
                                      >
                                        <Fragment>
                                          <span>Functions: </span>{" "}
                                          {tool.functions.toString()}
                                        </Fragment>
                                      </span>
                                    )}
                                    {tool.productURL && (
                                      <span
                                        className={`${
                                          styles[tool.name + "-productURL"]
                                        } ${styles["item-productURL"]}`}
                                      >
                                        <Fragment>
                                          <a
                                            href={tool.productURL}
                                            alt={
                                              tool.name + " by " + tool.company
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            More detail
                                          </a>
                                        </Fragment>
                                      </span>
                                    )}
                                  </span>
                                </button>
                              </li>
                            </li>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Fragment>
              );
            })}
        </ul>
      </div>
    </CardPrimaryLarge>
  );
};

export default AudioPluginSelector;
