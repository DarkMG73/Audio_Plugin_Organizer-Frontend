import {
  savePlugin,
  saveManyPlugins,
  updateAPlugin,
} from "../storage/audioToolsDB";

const useSaveAudioFormData = () => {
  const outputFunction = (
    toolsGroomedObject,
    user,
    saveOrUpdateData,
    successCallback
  ) => {
    const theData = [];
    for (const key in toolsGroomedObject) {
      theData.push(toolsGroomedObject[key]);
    }

    if (user) {
      if (saveOrUpdateData === "save")
        saveManyPlugins({ user, theData }, true).then((res) => {
          if (res.status && res.status < 299) {
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
          } else {
            alert(
              "There was an error when trying to save the new entry. Here is the message from the server: \n",
              res.data.message
            );
          }
        });

      if (saveOrUpdateData === "update")
        updateAPlugin(theData[0].id, theData[0], user)
          .then((res) => {
            if (res.status < 299) {
              successCallback();
            } else {
              alert(
                "There was an error when trying to update this production tool. If the problem continues, please contact the website administrator. Here is the message from the server: ",
                res.data.message
              );
            }
          })
          .catch((err) => {
            console.log("Update Error: ", err);
            alert(
              "There was an error when trying to update this production tool. If the problem continues, please contact the website administrator. Here is the message from the server: " +
                err.message
            );
          });
    } else {
      const emailTheEntry = window.confirm(
        'Hello! If you wish to add this to the general plugin library, thank you! Just click the "OK" button below and a pre-filled email will open up in your email client.\n\nIf, instead, you actually wanted to add this to your personal library in your account, click "CANCEL" and return to the page, scroll up a bit and use the login form. If you do not have a personal account, sign up there for free!'
      );
      if (emailTheEntry) {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A New Plugin Request for the Production Tools Organizer";
        const body = `A new tool is being offered: ${encodeURIComponent(
          JSON.stringify(theData)
        )}`;

        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${body}`
        );
        return "success";
      }
    }
  };
  return outputFunction;
};

export default useSaveAudioFormData;
