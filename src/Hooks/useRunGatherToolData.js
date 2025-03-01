import { useDispatch } from "react-redux";
import { audioToolDataActions } from "../store/audioToolDataSlice";

const useRunGatherToolData = () => {
   const dispatch = useDispatch();

   const outputFunction = (
      user,
      setLocalError,
      GatherToolData,
      successCallback
   ) => {
      GatherToolData(user)
         .then((data) => {
            if (process.env.NODE_ENV === "development")
               console.log(
                  "%c Getting tool data from DB:",
                  "color:#fff;background:#777;padding:14px;border-radius:0 25px 25px 0",
                  data
               );
            dispatch(audioToolDataActions.initState(data));
            if (successCallback) successCallback();
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
                     `***\n\nIt looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request.\n\nIt is also possible that the server's security software detected abnormally high traffic between this IP address and the server.  This is nothing anyone did wrong, just a rare occurrence with a highly-secured server. This will clear itself sometime within the next thirty minutes or so.\n\nPlease contact us if you find you are online and this error does not clear within an hour.\n\nSorry for the trouble. 😢`
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
                     err.request.responseURL
               });
            } else {
               setLocalError({
                  active: true,
                  message:
                     "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
                     err
               });
            }
         });
   };
   return outputFunction;
};

export default useRunGatherToolData;
