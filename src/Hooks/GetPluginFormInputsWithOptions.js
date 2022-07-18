import { getSchemaForAudioPlugin } from "../storage/audioToolsDB";
import { formInputData } from "../data/formInputData";
import { toTitleCase } from "./utility";

async function GetPluginFormInputsWithOptions(toolsMetadata) {
  const output = [];
  const pluginSchema = await getSchemaForAudioPlugin();

  const checkForInputData = (obj, key, subKey, toolsMetadata) => {
    if (obj.hasOwnProperty(key) && obj[key].hasOwnProperty(subKey)) {
      return obj[key][subKey];
    }
    return false;
  };

  for (const key in pluginSchema.obj) {
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

      if (key in toolsMetadata) {
        toolsMetadata[key].forEach((option) => optionsSet.add(option));
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
      preFilledData: formInputData[key].preFilledData
        ? formInputData[key].preFilledData
        : "",
      typeOfObject: pluginSchema.paths[key].instance,
    });
  }

  return output;
}

export default GetPluginFormInputsWithOptions;
