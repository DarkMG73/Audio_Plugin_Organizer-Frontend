import { getSchemaForAudioPlugin } from "./DbInteractions";
import { formInputData } from "../data/formInputData";
import { toTitleCase } from "./utility";

async function GetPluginFormInputsWithOptions() {
  const output = [];
  const pluginSchema = await getSchemaForAudioPlugin();
  console.log(
    "%c --> %cline:3%cpluginSchema",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(34, 8, 7);padding:3px;border-radius:2px",
    pluginSchema
  );

  const checkForInputData = (obj, key, subKey) => {
    if (obj.hasOwnProperty(key) && obj[key].hasOwnProperty(subKey)) {
      return obj[key][subKey];
    }
    return false;
  };

  for (const key in pluginSchema.data.model.obj) {
    console.log(
      "%c --> %cline:23%ckey",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
      key
    );
    output.push({
      title: toTitleCase(key, true),
      name: key,
      type: checkForInputData(formInputData, key, "type")
        ? checkForInputData(formInputData, key, "type")
        : "text",
      options: checkForInputData(formInputData, key, "options")
        ? checkForInputData(formInputData, key, "options")
        : [],
      required: checkForInputData(formInputData, key, "required")
        ? checkForInputData(formInputData, key, "required")
        : false,
      preFilledData: "",
    });
  }

  return output;
}

export default GetPluginFormInputsWithOptions;
