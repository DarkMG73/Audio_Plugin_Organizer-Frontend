import { useDispatch } from "react-redux";
import { audioToolDataActions } from "../store/audioToolDataSlice";

const useSaveAudioFormData = () => {
  const dispatch = useDispatch();

  const outputFunction = (user, setLocalError, GatherToolData) => {
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
              " *** It looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request. Please contact us if you find you are online and yet still receiving this error.",
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
  return outputFunction;
};

export default useSaveAudioFormData;
