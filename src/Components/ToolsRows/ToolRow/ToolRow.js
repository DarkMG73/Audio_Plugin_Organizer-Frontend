import { useState, useRef, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ToolRow.module.css";
import PushButton from "../../../UI/Buttons/PushButton/PushButton";
import { isValidHttpUrl, groomFormOutput } from "../../../Hooks/utility";
import CardSecondary from "../../../UI/Cards/CardSecondary/CardSecondary";
import CollapsibleElm from "../../../UI/CollapsibleElm/CollapsibleElm";
import AddAToolForm from "../../AddATool/AddAToolForm";
// import image from "../../../assets/images/Waves_WNS-Noise-Suppressor.png";
// import { addDocToDB, deleteDocFromDb } from "../../storage/firebase.config";
import {
   // updateAPlugin as addDocToDB,
   deleteAPlugin as deleteDocFromDb
} from "../../../storage/audioToolsDB";
import GetPluginFormInputsWithOptions from "../../../Hooks/GetPluginFormInputsWithOptions";
import useDefaultImageIsAvailable from "../../../Hooks/useDefaultImageIsAvailable";
import useFindSelectedImage from "../../../Hooks/useFindSelectedImage";
import useToolDisplayOrder from "../../../Hooks/useToolDisplayOrder";
// import placeholderImage from '../../../assets/images/product-photo-placeholder.png';
import placeholderImage from "../../../assets/images/generic_plugin_images/default.jpg";
import useSaveAudioFormData from "../../../Hooks/useSaveAudioFormData";
import useRunGatherToolData from "../../../Hooks/useRunGatherToolData";
import GatherToolData from "../../../Hooks/GatherToolData";
import { loadingRequestsActions } from "../../../store/loadingRequestsSlice";

function ToolRow(props) {
   const dispatch = useDispatch();
   const { toolsMetadata, toolsSchema, officialImages, defaultImages } =
      useSelector((state) => state.toolsData);

   const [inEditMode, setInEditMode] = useState(false);
   const [toolRowOrder, setToolRowOrder] = useState(false);
   const [deleted, setDeleted] = useState(false);
   const [submitFavChange, setSubmitFavChange] = useState(null);
   const toolDisplayOrder = useToolDisplayOrder;
   const [formInputData, setFormInputData] = useState(false);
   const [localError, setLocalError] = useState({
      active: false,
      message: null
   });
   const user = useSelector((state) => state.auth.user);
   const {
      tool: { functions }
   } = props;
   const defaultImageIsAvailable = useDefaultImageIsAvailable();
   const findSelectedImage = useFindSelectedImage();
   const saveAudioFormData = useSaveAudioFormData();
   const getRunGatherToolData = useRunGatherToolData();
   const makeLoadingRequest = function () {
      return dispatch(loadingRequestsActions.addToLoadRequest());
   };
   const removeLoadingRequest = function () {
      dispatch(loadingRequestsActions.removeFromLoadRequest());
   };
   const runGatherToolData = function (user, setLocalError, GatherToolData) {
      makeLoadingRequest();
      getRunGatherToolData(user, setLocalError, GatherToolData);
      setTimeout(() => {
         removeLoadingRequest();
      }, 2000);
   };
   const successCallback = () => {
      window.DayPilot.alert("This is now a Favorite in your library!");

      setTimeout(() => {
         runGatherToolData(user, setLocalError, GatherToolData);
      }, 1000);
   };

   const noUserCallback = () => {
      window.DayPilot.alert(
         "To set a favorite you will need to log in and set it within your own library. If you do not have an account, register at the top of the page to start your own library! :)"
      );
   };

   useEffect(() => {
      if (submitFavChange) {
         const newFav = !isFavorite;
         // setIsFavorite(newFav);

         saveAudioFormData(
            [{ identifier: key, dbID: key, favorite: newFav.toString() }],
            user,
            "update",
            successCallback,
            noUserCallback,
            true
         );
         setSubmitFavChange(false);
      }
   }, [submitFavChange]);

   useEffect(() => {
      const order = toolDisplayOrder(toolsSchema);
      setToolRowOrder(order);
      const res = GetPluginFormInputsWithOptions(toolsSchema, toolsMetadata);
      setFormInputData(res);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   const editedTools = useRef({ edits: {} });
   // eslint-disable-next-line react/prop-types
   const { tool, keyOne: key } = props;

   const [isFavorite, setIsFavorite] = useState(
      tool && Object.hasOwn(tool, "favorite") ? tool.favorite : false
   );
   // const key = props.keyOne;
   // const k = props.keyOne;
   // editButtonDirection to be used with future edit mode visual manipulations
   const editButtonDirection = inEditMode ? "" : "";
   const editButtonWidth = inEditMode ? "max-content" : "5em";
   let groomedFormInputData;

   ////////////////////////////////////////
   /// EFFECTS
   ////////////////////////////////////////
   useEffect(() => {
      const toolFormDataArray = [tool];
      if (formInputData)
         groomedFormInputData = groomFormOutput(
            toolFormDataArray,
            formInputData,
            toolRowOrder
         );
   }, [tool, formInputData, toolRowOrder]);

   useEffect(() => {
      if (tool && Object.hasOwn(tool, "favorite")) setIsFavorite(tool.favorite);
   }, [tool]);

   useEffect(() => {
      if (inEditMode) {
         // document.body.style.overflow = 'hidden !important';
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "";
      }
   }, [inEditMode]);

   ////////////////////////////////////////
   /// FUNCTIONALITY
   ////////////////////////////////////////
   const toolFormDataArray = [tool];
   if (formInputData)
      groomedFormInputData = groomFormOutput(
         toolFormDataArray,
         formInputData,
         toolRowOrder
      );

   ////////////////////////////////////////
   /// HANDLERS
   ////////////////////////////////////////
   const rowEditButtonHandler = (e, setElmOpen) => {
      setInEditMode(!inEditMode);
   };

   const rowSaveButtonHandler = (e) => {
      // Use tempKey instead of key when in dev
      // const tempKey = "TESTTEST";
      // console.log(
      //   "%c --> %cline:75%cuser",
      //   "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      //   "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      //   "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
      //   user
      // );
      // addDocToDB(key, editedTools.current.edits, user).then((res) => {
      //   setInEditMode(!inEditMode);
      //   return res;
      // });
   };

   const deleteToolButtonHandler = (e) => {
      e.preventDefault();
      // Use tempKey instead of key when in dev
      // const tempKey = "TESTTEST";

      window.DayPilot.confirm(
         'Are you sure you want to delete this tool?<br/><br/><span style="color: var(--iq-color-accent);font-weight: 700;">' +
            tool.name +
            " " +
            (tool.company && "by " + tool.company + "</span><br/><br/>") +
            'This can not be undone. You might want to use the CVS download at the bottom of the page to backup your production tools first in case you want to restore this list as it is right now.<br/><br/>Clicking <span style="color: var(--iq-color-alert-red);font-weight: 700;">CANCEL</span> returns to the page as it is, while clicking <span style="color: var(--iq-color-accent);font-weight: 700;">OK</span> will delete this tool.'
      ).then((args) => {
         if (!args.canceled) {
            window.DayPilot.confirm(
               'Last chance!<br/><br/>Are you absolutely sure you want to delete this?<br/><br/><span style="color: var(--iq-color-alert-red);font-weight: 700;">' +
                  tool.name +
                  (tool.company && " by " + tool.company + "<br/>") +
                  "</span><br/><br/>This can not be undone."
            )
               .then(function (args) {
                  if (!args.canceled) {
                     deleteDocFromDb(key, user)
                        .then((res) => {
                           if (res.status < 299) {
                              setDeleted(true);
                              setInEditMode(false);
                           } else {
                              window.DayPilot.alert(
                                 "There was an error when trying to delete this production tool. Here is the message from the server: " +
                                    res.response?.data?.message +
                                    ". Be sure you have an internet connections and try again. If all else fails, please notify the administrator."
                              );
                           }
                        })
                        .catch((err) => {
                           window.DayPilot.alert(
                              "There was an error when trying to delete this entry. Be sure you have an internet connections and try again. If all else fails, please notify the administrator."
                           );
                        });
                  }
               })
               .catch((e) => {
                  console.lof("Error: " + e);
               });
         }
      });
   };

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   function AssembleInnerRow(tool, key, passedCategoryNamesArray) {
      const categoryNamesArray = passedCategoryNamesArray
         ? passedCategoryNamesArray
         : Object.keys(toolsMetadata);

      let rowHTML = [];

      function onTextChangeHandler(e, title) {
         editedTools.current.edits[title] = e.target.innerText;
      }

      categoryNamesArray.forEach((title) => {
         let value;
         if (Object.keys(tool).includes(title)) {
            value = tool[title];
            if (Array.isArray(value)) {
               value = (
                  <ul
                     key={value + 10}
                     className={
                        styles[title + "list"] +
                        " " +
                        styles.list +
                        " " +
                        title +
                        "list" +
                        " " +
                        "list"
                     }
                  >
                     {value.map((item) => (
                        <li key={item + 11}>{item}</li>
                     ))}
                  </ul>
               );
            }
         } else {
            value = "";
         }
         let itemTitle = title;

         // if (!value && title !== 'photoURL') return;
         // Skip if no value
         // if (value == undefined || value === "" || value == " ") continue;

         // If link, add <a> tag
         const isValidLink = isValidHttpUrl(value);

         if (isValidLink || title === "photoURL" || title === "productURL") {
            if (title === "photoURL" && isValidLink) {
               // value = <img key={title + value} src={value} alt={title} />;
               value = <img key={title + value} src={value} alt={title} />;
            } else if (title === "photoURL" && value !== undefined) {
               const photoSrc =
                  value !== ""
                     ? findSelectedImage(value)
                     : defaultImageIsAvailable(functions, defaultImages)
                       ? defaultImageIsAvailable(functions, defaultImages)
                       : placeholderImage;
               value = (
                  <Fragment>
                     <img
                        key={title + value}
                        data-test={"test-" + defaultImageIsAvailable(functions)}
                        src={photoSrc || placeholderImage}
                        // src={image}
                        alt=""
                     />
                  </Fragment>
               );
            } else if (title === "productURL" && value) {
               // value = <img key={title + value} src={value} alt={title} />;
               value = (
                  <a
                     key={title + value}
                     href={value}
                     alt={title}
                     target="_blank"
                     rel="noreferrer"
                  >
                     Webpage {"\u2B95"}
                  </a>
               );
            } else {
               value = (
                  <a
                     key={title + value}
                     href={value}
                     alt={title}
                     target="_blank"
                     rel="noreferrer"
                  >
                     {value}
                  </a>
               );
            }
         }

         let handleElmCLick = () => {
            if (!user) {
               noUserCallback();
            } else {
               setSubmitFavChange(true);
            }
         };

         // if (title === 'favorite') {
         //   if (
         //     (!isFavorite && value.constructor === Boolean && value) ||
         //     value.toLowercase == 'true' ||
         //     value == 'True'
         //   ) {
         //     setIsFavorite(true);
         //   } else {
         //     setIsFavorite(false);
         //   }
         // }
         if (title === "oversampling") {
         }
         // Create the row
         rowHTML.push(
            <div
               key={key + "-" + title}
               id={key + "-" + title}
               className={
                  styles[title + "-wrap"] +
                  " " +
                  styles["grid-item"] +
                  " " +
                  styles[title] +
                  " " +
                  styles[
                     isFavorite && title === "favorite"
                        ? "favorite-true"
                        : "favorite-false"
                  ] +
                  " " +
                  title +
                  "-wrap" +
                  " " +
                  "grid-item" +
                  " " +
                  title +
                  " " +
                  (isFavorite && title === "favorite"
                     ? "favorite-true"
                     : "favorite-false")
               }
               {...(title === "favorite" && {
                  onClick: handleElmCLick
               })}
            >
               <div
                  key={itemTitle + value}
                  className={`${styles[title + "-title"]}
               ${styles["grid-item-title"]} 
               ${styles["grid-item-child"]} 
               
               ${title}+ -title
               grid-item-title
              grid-item-child
               
               `}
               >
                  {itemTitle}
               </div>
               <CollapsibleElm
                  key={key + "2"}
                  id={key + "-collapsible-elm"}
                  styles={{
                     position: "relative"
                  }}
                  maxHeight="10em"
                  inputOrButton="button"
                  buttonStyles={{
                     margin: "0 auto",
                     fontVariant: "small-caps",
                     transform: "translateY(50%)",
                     transition: "0.7s all ease",
                     textAlign: "center",
                     display: "flex",
                     alignItems: "center",
                     padding: "0.25em 0",
                     minWidth: "fit-content",
                     width: "100%"
                  }}
                  colorType="secondary"
                  data=""
                  size="small"
               >
                  <div
                     key={key + value}
                     className={` ${styles[title + "-text"]} 
            ${styles["grid-item-text"]} 
            ${styles["grid-item-child"]} ${title}-text grid-item-text grid-item-child
            `}
                     ref={(elm) => {
                        //  Moving this out of processing to handle after elements added.
                        setTimeout(() => {
                           if (elm)
                              editedTools.current.edits[title] = elm.innerText;
                        }, 0);
                     }}
                     onBlur={(e) => {
                        onTextChangeHandler(e, title);
                     }}
                  >
                     {value}
                  </div>
               </CollapsibleElm>
            </div>
         );
      });

      return rowHTML;
   }

   // Add the edit button
   const output = (
      <div key={key + "1"} id={key} className="tool-result-container">
         <CardSecondary
            key={key + "1"}
            styles={{ position: "relative", minWidth: "214px" }}
            attributes={{ "data-group": "tools-wrap" }}
         >
            <CollapsibleElm
               key={key + "2"}
               id={key + "-collapsible-elm"}
               styles={{
                  position: "relative",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  minHeight: "21em"
               }}
               maxHeight="21em"
               inputOrButton="button"
               buttonStyles={{
                  margin: "0 auto",
                  letterSpacing: "0.25em",
                  fontVariant: "small-caps",
                  transform: "translateY(100%)",
                  minWidth: "5em",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center"
               }}
               colorType="primary"
               data="see-more-button"
               size="small"
               open={props.openAll}
            >
               {AssembleInnerRow(tool, key, toolRowOrder)}
               <div
                  key={key + "3"}
                  className={
                     styles["button-container"] + " " + "button-container"
                  }
               >
                  <PushButton
                     key={key + "4"}
                     inputOrButton="button"
                     styles={{
                        gridArea: "edit",
                        transform: editButtonDirection,
                        minWidth: editButtonWidth,
                        textAlign: "center"
                     }}
                     id={key + "edit-button"}
                     colorType="secondary"
                     value="session-record"
                     data=""
                     size="small"
                     onClick={rowEditButtonHandler}
                  >
                     {inEditMode ? "Cancel Edit" : "Edit"}
                  </PushButton>
                  {inEditMode && (
                     <>
                        <PushButton
                           key={"toolrow" + key + "4"}
                           inputOrButton="input"
                           styles={{
                              type: "submit",
                              gridArea: "edit",
                              boxShadow: "none",
                              letterSpacing: "0.25em",
                              fontVariant: "small-caps",
                              minWidth: "fit-content",
                              margin: "auto",
                              textAlign: "center",
                              display: "flex",
                              alignItems: "flex-end",
                              fontSize: "110%"
                           }}
                           id={key + "submit-button"}
                           colorType="primary"
                           value="Save Changes"
                           data=""
                           size="small"
                           onClick={rowSaveButtonHandler}
                        >
                           Save Changes
                        </PushButton>
                        <PushButton
                           key={key + "5"}
                           inputOrButton="input"
                           styles={{
                              type: "submit",
                              gridArea: "edit",
                              boxShadow: "none",
                              letterSpacing: "0.25em",
                              fontVariant: "small-caps",
                              minWidth: "fit-content",
                              margin: "auto",
                              textAlign: "center",
                              display: "flex",
                              alignItems: "flex-end",
                              fontSize: "80%"
                           }}
                           id={key + "delete-button"}
                           colorType="secondary"
                           value="Delete Tool"
                           data=""
                           size="small"
                           onClick={deleteToolButtonHandler}
                        >
                           Delete Tool
                        </PushButton>
                        <div
                           key={key + "6"}
                           className={styles["tool-id"] + " " + "tool-id"}
                        >
                           <p key={"toolrow-button-p" + key}>
                              Tool ID:
                              <br key={"toolrow-button-br" + key} />
                              {key}
                           </p>
                        </div>
                     </>
                  )}
               </div>
            </CollapsibleElm>
         </CardSecondary>
         {inEditMode && (
            <>
               <div className={styles.overlay + " " + "overlay"}></div>
               <div
                  className={
                     styles["editing-fields-wrap"] + " " + "editing-fields-wrap"
                  }
               >
                  <AddAToolForm
                     key={key + "7"}
                     saveOrUpdateData="update"
                     formData={groomedFormInputData}
                     removeAddMoreButton={true}
                     deleteToolButtonHandler={deleteToolButtonHandler}
                     setFormParentOpen={setInEditMode}
                     cancelOneForm={() => {
                        setInEditMode(false);
                     }}
                     styles={{ minHeight: "100%" }}
                     buttonStyles={{
                        position: "relative",
                        height: "3em",
                        width: "100%",
                        left: "0",
                        background: "var( --iq-color-background-warm-gradient)",
                        fontSize: "24px",
                        letterSpacing: "0.5em",
                        textTransform: "uppercase",
                        margin: "auto",
                        color: "var( --iq-color-foreground)",
                        borderRadius: "50px ",
                        boxShadow: "0 0 20px -5px var(--iq-color-accent)",
                        textShadow: "0 0 3px var(--iq-color-accent)"
                     }}
                     submitButtonStyles={{
                        top: "-14px",
                        width: "80%",
                        background: "var(--iq-color-accent-2)",
                        color: "white",
                        borderRadius: "50px",
                        height: "3em",
                        font: "var(--iq-font-heading-2)",
                        zIndex: "1",
                        boxShadow:
                           "inset -7px -7px 10px -7px #000000,    inset 7px 7px 10px -7px var(--iq-color-accent-2-light)",
                        border: "none"
                     }}
                     deleteButtonStyles={{
                        flexBasis: " 25%",
                        flexGrow: "1",
                        fontSize: "0.75em",
                        top: "0",
                        height: "2em",
                        width: "90%",
                        minWidth: "min-content",
                        maxWidth: " 40%",
                        boxShadow:
                           "0 0 20px -5px var(--iq-color-accent-2), inset 0 0 25px 0 black",
                        color: "var(--iq-color-alert-text)",
                        background: "var(--iq-color-alert-red)",
                        marginTop: "auto",
                        margin: "auto",
                        padding: "0 0 1em",
                        // opacity: '0.5',
                        border: "none",
                        transform: "translateY(-100%)",
                        zIndex: "3"
                     }}
                  />
               </div>
            </>
         )}
      </div>
   );

   ////////////////////////////////////////
   /// OUTPUT
   ////////////////////////////////////////
   if (!deleted) {
      return (
         <div
            className={`${styles["tool-row-wrap"]} ${
               styles["status-" + tool.status]
            } 
        
        tool-row-wrap status-${tool.status}
        `}
         >
            {output}
         </div>
      );
   } else {
      return (
         <div
            key={"deleted" + key}
            className={styles.deleted + " " + "deleted"}
         >
            <h3 key={key + "9"}>
               {tool.name} was deleted. Refresh the browser to remove this
               notice.
            </h3>
         </div>
      );
   }
}

export default ToolRow;
