const useDefaultImageIsAvailable = () => {
   const defaultImageIsAvailable = (functionsArray, defaultImgObj) => {
      const cleanFunctionsArray = functionsArray.filter((item) => {
         // Make str or arr
         const eligibleTypes = ["String", "Array"];
         if (eligibleTypes.includes(item.constructor.name))
            return item.length > 0;
         return false;
         //make sure str or arr is not empty
      });

      const groomName = (name) =>
         name && typeof name === "string"
            ? name.replace(/ /g, "-").toLowerCase()
            : "";

      const imageGetter = (indexOfcleanFuncArr) => {
         return defaultImgObj[
            groomName(
               cleanFunctionsArray[indexOfcleanFuncArr],
               cleanFunctionsArray
            )
         ][0].src;
      };

      // See if image exists: "audio effects" is skipped to use the actual effect image.
      if (cleanFunctionsArray.length > 0) {
         if (
            cleanFunctionsArray.length === 1 ||
            groomName(cleanFunctionsArray[0]) !== "audio-effects"
         ) {
            try {
               return imageGetter(0);
            } catch {
               return false;
            }
         } else {
            try {
               return imageGetter(1);
            } catch {
               return false;
            }
         }
      }

      return false;
   };

   return defaultImageIsAvailable;
};

export default useDefaultImageIsAvailable;
