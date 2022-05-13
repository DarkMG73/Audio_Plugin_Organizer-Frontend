import storage from "../storage/storage";
import { getData } from "../storage/MongoDb";

export default async function GatherToolData() {
  const allToolsData = {};
  const dataFromStorage = storage("get");
  let historyDataFromStorage = null;
  let currentFilters = null;
  if (dataFromStorage) {
    historyDataFromStorage = dataFromStorage.toolsHistory;
    currentFilters = dataFromStorage.currentFilters;
  }

  allToolsData.allTools = {};

  let allTools = await getData();
  if (allTools.length <= 0)
    allTools = [
      {
        "Audio & Video Plugin Status": "No plugins found.",
        "What you can do":
          'To get rolling with tracking and easily sorting your audio and video plugins and tools, simply fill out the form and hit "submit" to add your first plugin. Or, use the spreadsheet upload to make it super fast.',

        _id: "error",
      },
    ];

  /////// IF USING DUMMY QUERY
  // const allTools = [];
  // for (var i in DummyToolData) {
  //   allTools.push({ ...DummyToolData[i] });
  // }
  ////////////

  allTools.forEach((toolData) => {
    const tags = [];
    if (toolData.hasOwnProperty("tags")) {
      if (toolData.tags.constructor === String) {
        toolData.tags = stringToArray(toolData.tags);
      } else if (!toolData.tags.constructor === Array) {
        console.log("ERROR: The tool tags are an incorrect format");
        toolData.tags = [];
      } else {
        toolData.tags = toolData.tags.map((tag) => tag.replaceAll(" ", ""));
      }
    } else {
      toolData.tags = [];
    }
    allToolsData.allTools[toolData._id] = toolData;
  });

  allToolsData.toolsHistory = historyDataFromStorage ?? {
    incorrect: {},
    correct: {},
    unmarked: {},
    stats: {},
  };

  allToolsData.toolsMetadata = gatherAllMetadata(allTools);

  const gatherFilters = (keysArray) => {
    console.log(
      "%c --> %cline:75%ckeysArray",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
      keysArray
    );
    const output = {};
    keysArray.forEach((item) => {
      if (item != "_id") output[item] = [];
    });
    return output;
  };

  allToolsData.currentFilters =
    currentFilters ?? gatherFilters(Object.keys(allToolsData.toolsMetadata));

  console.log(
    "%c --> %cline:62%callToolsData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
    allToolsData
  );

  return allToolsData;
}

function gatherAllMetadata(dataObject) {
  const itemsToExclude = ["__v", "createdAt", "updatedAt"];
  const valuesToExclude = ["undefined", "", " "];
  const outputSet = objectExtractAllValuesPerKey(
    dataObject,
    itemsToExclude,
    valuesToExclude
  );
  return outputSet;
}

function objectExtractAllValuesPerKey(
  objectToLoop,
  itemsToExclude,
  valuesToExclude
) {
  const outputObject = {};

  // Grab each tool
  for (const i in objectToLoop) {
    // Get each item withing that tool (ID, topic, answer, etc)
    for (let key in objectToLoop[i]) {
      key = key.trim();

      // Check if we are meant to include that item & the value is valid
      if (
        !itemsToExclude.includes(key) &&
        !valuesToExclude.includes(objectToLoop[i][key])
      ) {
        // If the value is a list, separate at the comma
        if (objectToLoop[i][key].indexOf(",") >= 0) {
          const termArray = objectToLoop[i][key].split(",");

          // For each list item, put is in the Set (removes duplicates)
          termArray.forEach((term) => {
            const value = term.trim().toString();

            // Add to Set. If key Set does not exist, create it.
            if (outputObject.hasOwnProperty(key)) {
              outputObject[key].add(value);
            } else {
              outputObject[key] = new Set();
              outputObject[key].add(value);
            }
          });
        } // Since the value is not a string list, if the value is not an array, just add it as-is to the key Set
        else if (objectToLoop[i][key].constructor !== Array) {
          const value = objectToLoop[i][key].trim().toString();

          if (outputObject.hasOwnProperty(key)) {
            outputObject[key].add(value);
          } else {
            outputObject[key] = new Set();
            outputObject[key].add(value);
          }
        } // Since the value is an array, loop to add it
        else if (objectToLoop[i][key].constructor === Array) {
          if (objectToLoop[i][key].length > 0) {
            objectToLoop[i][key].forEach((rawValue) => {
              const value = rawValue.replaceAll(" ", "").toString();
              // Check if  the value is valid
              if (!valuesToExclude.includes(value)) {
                if (outputObject.hasOwnProperty(key)) {
                  outputObject[key].add(value);
                } else {
                  outputObject[key] = new Set();
                  outputObject[key].add(value);
                }
              }
            });
          } else {
            // Given this is an empty array, just return an empty Setup
            outputObject[key] = new Set();
          }
        }
      }
    }
  }

  for (const i in outputObject) {
    outputObject[i] = Array.from(outputObject[i]);
  }

  for (const i in outputObject) {
  }
  return outputObject;
}

function stringToArray(tagString) {
  if (tagString == "undefined") return [];

  return tagString.replaceAll(" ", "").split(",");
}
