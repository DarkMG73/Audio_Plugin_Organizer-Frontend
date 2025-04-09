import { saveManyPlugins } from "../storage/audioToolsDB";

const useSubmitSelectionsHandler = () => {
   const outputFunction = (
      toolsFromLibrary,
      selectedTools,
      user,
      successCallback,
      setShowLoginModal,
      cleanStr
   ) => {
      window.DayPilot.confirm(
         "If you are ready to save these, click OK.<br/><br/>If not, click CANCEL to return to the form."
      )
         .then(function (args) {
            if (!args.canceled) {
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
                           toolObj.masterLibraryID = cleanStr(
                              toolObj.masterLibraryID
                           );
                           delete toolObj._id;
                        }
                        theData.push(toolObj);
                     }
                  })
               );

               saveManyPlugins({ user, theData }, true).then((res) => {
                  if (res.status && res.status < 299) {
                     successCallback();
                  } else if (res.response.status === 404) {
                     const failedIdsAndNames =
                        res.response.data.err.writeErrors.map((item) => ({
                           id: item.op._id,
                           name: item.op.name
                        }));
                     const failedNames = failedIdsAndNames.map(
                        (item) => item.name
                     );
                     window.DayPilot.confirm(
                        `The following were skipped because they were already in your database:<br/><br/>${failedNames.join(
                           "<br />"
                        )}<br/><br/>Any not listed above were entered successfully.<br/><br/> Click "OK" to finish or "CANCEL" to return to the form.<br/><br/>If you intended to add a different tool that happens to have the exact same name as one you already have saved, please add it again, but alter the name in some way. The name must be unique.`
                     )
                        .then(function (args) {
                           if (!args.canceled) {
                              successCallback();
                           }
                        })
                        .catch((e) => {
                           console.lof("Error: " + e);
                        });
                  } else if (res.response.status === 401) {
                     setShowLoginModal(true);
                  } else {
                     window.DayPilot.alert(
                        "There was an error when trying to save the new entry. Here is the message from the server: " +
                           res.message
                     );
                  }
               });
            }
         })
         .catch((e) => {
            console.log("Error: " + e);
         });
   };
   return outputFunction;
};

export default useSubmitSelectionsHandler;
