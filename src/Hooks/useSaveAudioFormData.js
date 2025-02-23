import {
   savePlugin,
   saveManyPlugins,
   updateAPlugin,
   UpdateManyAudioPlugins
} from "../storage/audioToolsDB";

const useSaveAudioFormData = () => {
   const outputFunction = (
      toolsGroomedObject,
      user,
      saveOrUpdateData,
      successCallback,
      noUserCallback,
      onlyRunNoUserCallback
   ) => {
      const theData = [];
      for (const key in toolsGroomedObject) {
         theData.push(toolsGroomedObject[key]);
      }

      if (user) {
         if (saveOrUpdateData === "save")
            saveManyPlugins({ user, theData }, true).then((res) => {
               if (res.status && res.status < 299) {
                  if (successCallback) successCallback(res);
               } else if (res.response.status === 404) {
                  const failedIdsAndNames =
                     res.response.data.err.writeErrors?.map((item) => ({
                        id: item.op._id,
                        name: item.op.name
                     }));

                  const failedNames = failedIdsAndNames?.map(
                     (item) => item.name
                  );

                  const runSuccessCallback = window.DayPilot.confirm(
                     `The following were skipped because they were already in your database:<br/><br/>${failedNames?.join(
                        "<br/>"
                     )}<br/><br/>Any not listed above were entered successfully.<br/><br/> Click "OK" to finish or "CANCEL" to return to the form.<br/><br/>If you intended to add a different tool that happens to have the exact same name as one you already have saved, please add it again, but alter the name in some way. The name must be unique.`
                  )
                     .then(function (args) {
                        if (!args.canceled) {
                           if (successCallback) successCallback(res);
                        }
                     })
                     .catch((e) => {
                        console.lof("Error: " + e);
                     });
               } else {
                  console.log(
                     "%c⚪️►►►► %cline:53%cres",
                     "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                     "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                     "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
                     res
                  );
                  const message = res.data?.message || "Unknown Network Error";

                  window.DayPilot.alert(
                     "There was an error when trying to save the new entry. Here is the message from the server: <br />",
                     message
                  );
               }
            });

         if (saveOrUpdateData === "update")
            updateAPlugin(theData[0].identifier, theData[0], user)
               .then((res) => {
                  if (res.status < 299) {
                     if (successCallback) successCallback(res);
                  } else {
                     window.DayPilot.alert(
                        "There was an error when trying to update this production tool. If the problem continues, please contact the website administrator. Here is the message from the server: ",
                        res?.data?.message
                     );
                  }
               })
               .catch((err) => {
                  console.log("Update Error: ", err);
                  window.DayPilot.alert(
                     "There was an error when trying to update this production tool. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                        err.message
                  );
               });
         if (saveOrUpdateData === "update-many")
            UpdateManyAudioPlugins(theData, user)
               .then((res) => {
                  if (res.status < 299) {
                     if (successCallback) successCallback(res);
                  } else {
                     window.DayPilot.alert(
                        "There was an error when trying to update this production tool. If the problem continues, please contact the website administrator. Here is the message from the server: ",
                        res.data.message
                     );
                  }
               })
               .catch((err) => {
                  console.log("Update Error: ", err);
                  window.DayPilot.alert(
                     "There was an error when trying to update this production tool. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                        err.message
                  );
               });
      } else {
         if (!onlyRunNoUserCallback) {
            window.DayPilot.confirm(
               'It looks like you wish to submit a plugin or edit, but are not logged in. <br/><br/>If you mean to contribute to the general public library, just click "OK" and a pre-filled email will open up in your email client.<br/><br/>If, instead, this was meant for your personal account library, please log in first.<br/><br/>If you do not have a personal account, sign up for free in the log-in area.<br/><br/>Clicking OK will open an email to suggest a change to the Master Library.<br/><br/>Clicking CANCEL will close this without the email.'
            )
               .then(function (args) {
                  if (!args.canceled) {
                     const questionAdminEmail = "general@glassinteractive.com";
                     const subject =
                        "A New Plugin Request for the Production Tools Organizer";
                     const body = `A new tool is being offered: ${encodeURIComponent(
                        JSON.stringify(theData)
                     )}`;

                     window.open(
                        `mailto:${questionAdminEmail}?subject=${subject}l&body=${body}`
                     );
                  }
               })
               .catch((e) => {
                  console.lof("Error: " + e);
               });
         }
         if (noUserCallback) noUserCallback();
      }
   };
   return outputFunction;
};

export default useSaveAudioFormData;
