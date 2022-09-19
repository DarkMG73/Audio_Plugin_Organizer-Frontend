import { savePlugin, updateAPlugin } from "../storage/audioToolsDB";

const useSaveAudioFormData = () => {
  const outputFunction = (
    toolsGroomed,
    user,
    saveOrUpdateData,
    successCallback
  ) => {
    let tripsThrough = [];

    for (const key in toolsGroomed) {
      const theData = toolsGroomed[key];

      if (user) {
        if (saveOrUpdateData === "save")
          savePlugin({ user, theData }, true).then((res) => {
            if (res.status && res.status < 299) {
              tripsThrough.push(key);
              const numberOfEntriestoAdd = Object.keys(toolsGroomed).length;

              if (numberOfEntriestoAdd <= tripsThrough.length) {
                console.log(
                  "%c --> %cline:32%ctripsThrough.length",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(3, 22, 52);padding:3px;border-radius:2px",
                  tripsThrough.length
                );

                successCallback();
              }
            } else if (res.response.status === 404) {
              alert(
                "IS THE NAME UNIQUE? There was an error when trying to save the new entry. This was most likely caused by trying to add the entry with the same name as an existing tool. Make sure you do not already have this one saved. If it is a different tool that happens to have the same exact name as one you already have saved, please alter this name in some way. The name must be unique."
              );
            } else {
              alert(
                "There was an error when trying to save the new entry. Here is the message from the server: ",
                res.data.message
              );
            }
          });
        if (saveOrUpdateData === "update")
          updateAPlugin(theData.id, theData, user)
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
          'Hello! If you wish to add this to the general plugin library, thank you! Just click the "OK" button below and a pre-filled email will open up in your email client. If, instead, you actually wanted to add this to your personal library in your account, click "Cancel" and return to the page, scroll up a bit and use the login form. If you do not have a personal account, sign up there for free!'
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

      //  TODO: Clear the form
      // const formEntries = document.querySelectorAll('.form-group-wrap');
      // formEntries.forEach(item => {
      //     item.parentNode.removeChild(item);
      // })
    }
  };
  return outputFunction;
};

export default useSaveAudioFormData;
