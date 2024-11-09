import { formInputData } from "../data/formInputData";
import { toTitleCase } from "./utility";

function GetPluginFormInputsWithOptions(pluginSchema, toolsMetadata) {
   console.log(
      "%c⚪️►►►► %cline:4%cpluginSchema",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px",
      pluginSchema
   );
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

      console.log(
         "%c⚪️►►►► %cline:24%cpresetOptions",
         "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
         "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
         "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px",
         presetOptions
      );
      let topicOptions = presetOptions ? presetOptions : [];
      console.log(
         "%c⚪️►►►► %cline:30%ctopicOptions",
         "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
         "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
         "color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px",
         topicOptions
      );

      if (toolsMetadata) {
         const optionsSet = new Set();
         topicOptions.forEach((option) => optionsSet.add(option));

         for (const key in toolsMetadata) {
            toolsMetadata[key].forEach((option) => {
               console.log(
                  "%c⚪️►►►► %cline:52%coption",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
                  option
               );
               // optionsSet.add(option)
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
