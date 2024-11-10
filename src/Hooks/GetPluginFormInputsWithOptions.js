import { formInputData } from "../data/formInputData";
import { toTitleCase } from "./utility";

function GetPluginFormInputsWithOptions(pluginSchema, toolsMetadata) {
   if (!pluginSchema) return [];
   const output = [];

   const checkForInputData = (obj, key, subKey) => {
      if (obj.hasOwnProperty(key) && obj[key].hasOwnProperty(subKey)) {
         return obj[key][subKey];
      }
      return false;
   };

   for (const key in pluginSchema) {
      // Set up options with defined options and user-added options
      const presetOptions = checkForInputData(
         formInputData,
         key,
         "options",
         toolsMetadata
      );

      let topicOptions = presetOptions ? presetOptions : [];

      if (toolsMetadata) {
         const optionsSet = new Set();

         topicOptions.forEach((option) => optionsSet.add(option));

         if (Object.hasOwn(toolsMetadata, key)) {
            toolsMetadata[key].forEach((option) => {
               if (key === "functions") {
                  const cleanOptionSetNamesArray = [];

                  optionsSet.forEach((optionSetName) =>
                     cleanOptionSetNamesArray.push(
                        optionSetName.replaceAll(" ", "").split("~").pop()
                     )
                  );

                  if (
                     !cleanOptionSetNamesArray.includes(
                        option.replaceAll(" ", "")
                     )
                  ) {
                     optionsSet.add("User Added ~ " + option);
                     return;
                  } else {
                     return;
                  }
               }

               optionsSet.add(option.toString());
            });
         }
         topicOptions = Array.from(optionsSet);
      }

      output.push({
         title: toTitleCase(key, true),
         name: key,
         type: checkForInputData(formInputData, key, "type")
            ? checkForInputData(formInputData, key, "type")
            : "text",
         options: topicOptions,

         required: checkForInputData(formInputData, key, "required")
            ? checkForInputData(formInputData, key, "required")
            : false,
         preFilledData:
            formInputData[key] && formInputData[key].preFilledData
               ? formInputData[key].preFilledData
               : "",
         typeOfObject: pluginSchema[key].instance
      });
   }

   return output;
}

export default GetPluginFormInputsWithOptions;
