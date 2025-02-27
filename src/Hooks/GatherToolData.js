import storage from "../storage/storage";
import { getData, getSchemaForAudioPlugin } from "../storage/audioToolsDB";
import { getUserNameMemory } from "../storage/userDB";

export default async function GatherToolData(user) {
   const allToolsData = {};
   const dataFromStorage = storage("GET");
   const pluginSchema = await getSchemaForAudioPlugin();
   // const imagesALL = require.context(
   //   '../assets/images/official_plugin_images/',
   //   true,
   // );
   const images = require.context(
      "../assets/images/generic_plugin_images/",
      true
   );
   const metadataTopicsToAlphaSort = [
      "_id",
      "name",
      "company",
      "productURL",
      "photoURL",
      "identifier",
      "masterLibraryID"
   ];

   const metadataTopicsToNumberSort = ["rating"];

   if (pluginSchema && Object.hasOwn(pluginSchema, "status"))
      throw pluginSchema;
   let historyDataFromStorage = null;
   let currentFilters = null;
   if (dataFromStorage) {
      historyDataFromStorage = dataFromStorage.toolsHistory;
      currentFilters = dataFromStorage.currentFilters;
   }

   allToolsData.allTools = {};

   let allTools;
   try {
      allTools = await getData(user);
   } catch (err) {
      throw err.response;
   }

   const { imagesOEMData: imagesALL } = allTools;
   allTools = allTools.audioPlugins.map((tool) => {
      const output = {};
      if (!Object.keys(tool).includes("oversampling")) {
         Object.keys(tool).forEach((key) => {
            output[key] = tool[key];
         });
         output.oversampling = "false";
      } else {
         // eslint-disable-next-line no-restricted-syntax
         for (const key in tool) {
            if (key === "oversampling") {
               if (tool[key] === true) output[key] = "true";
               if (tool[key] === false || tool[key] === "")
                  output[key] = "false";
            } else {
               output[key] = tool[key];
            }
         }
      }
      return output;
   });

   if (allTools.length <= 0)
      allTools = [
         {
            "Audio & Video Plugin Status": "No plugins found.",
            "What you can do":
               'To get rolling with your plugin library:\n\nDesktop version: click "Scan Computer for Plugins" and let teh system find them for you.\n\nWeb version: Use the Plugin Selector to choose items from the Master Library and/or add them manually using the "+" at the bottom of the page and then choose "Manual Entry Form".',

            _id: "error"
         }
      ];

   /////// IF USING DUMMY QUERY
   // const allTools = [];
   // for (var i in DummyToolData) {
   //   allTools.push({ ...DummyToolData[i] });
   // }
   ////////////

   allTools.forEach((toolData) => {
      // eslint-disable-next-line no-underscore-dangle
      allToolsData.allTools[toolData._id] = toolData;
   });

   allToolsData.toolsHistory = historyDataFromStorage ?? {
      incorrect: {},
      correct: {},
      unmarked: {},
      stats: {}
   };

   // eslint-disable-next-line no-use-before-define
   allToolsData.toolsMetadata = gatherAllMetadata(
      allTools,
      metadataTopicsToAlphaSort,
      metadataTopicsToNumberSort
   );
   allToolsData.toolsSchema = pluginSchema.obj;

   const gatherFilters = (keysArray) => {
      const output = {};
      keysArray.forEach((item) => {
         if (item !== "_id") output[item] = [];
      });
      return output;
   };

   allToolsData.currentFilters =
      currentFilters ?? gatherFilters(Object.keys(allToolsData.toolsMetadata));

   ////////////////////////////////////////////////////////////////
   const groomedAllImages = {};

   imagesALL.forEach((imageGroup) => {
      groomedAllImages[imageGroup.public_id.replace(".", "").replace(" ", "")] =
         {
            name: imageGroup.filename,
            publicID: imageGroup.public_id.replace(".", "").replace(" ", ""),
            src: imageGroup.url,
            data: imageGroup
         };
   });

   if (
      Object.hasOwn(allToolsData, "toolsMetadata") &&
      Object.hasOwn(allToolsData.toolsMetadata, "photoURL")
   ) {
      allToolsData.toolsMetadata.photoURL.forEach((url) => {
         // Skip if local or from the site Cloudinary account
         if (
            !url ||
            !is_url(url) ||
            url.includes("do0dxcsdm") ||
            url.includes("official_plugin_images")
         )
            return;

         // Otherwise, add it
         const domain = new URL(url);
         const name = domain.pathname
            .substring(domain.pathname.lastIndexOf("/") + 1)
            .replaceAll("%20", " ");

         const id = name.replaceAll(" ", "");
         groomedAllImages[id] = {
            name,
            publicID: id,
            src: url
         };
      });
   }

   const sortedGroomedAllImages = sortObject(groomedAllImages);

   const groomedAllDefaultImages = {};

   images.keys().forEach((image) => {
      const folder = image.split("/")[1];
      if (!Object.hasOwn(groomedAllDefaultImages, folder))
         groomedAllDefaultImages[folder] = [];

      groomedAllDefaultImages[folder].push({ name: image, src: images(image) });
   });

   allToolsData.officialImages = sortedGroomedAllImages;
   allToolsData.defaultImages = groomedAllDefaultImages;
   ////////////////////////////////////////////////////////////////
   ////////////////////////////////////////////////////////////////
   const userNameMemoryData = await getUserNameMemory();

   if (
      Object.hasOwn(userNameMemoryData.data, "appUserNameMemory") &&
      userNameMemoryData.data.appUserNameMemory
   ) {
      const { appUserNameMemory } = userNameMemoryData.data;
      if (appUserNameMemory.constructor === Array) {
         allToolsData.appUserNameMemory = appUserNameMemory;
      } else if (appUserNameMemory.constructor === String) {
         const groomedAppUserNameMemory = JSON.parse(appUserNameMemory);

         allToolsData.appUserNameMemory = groomedAppUserNameMemory;
      } else {
         allToolsData.appUserNameMemory = [];
      }
   } else {
      allToolsData.appUserNameMemory = [];
   }

   ////////////////////////////////////////////////////////////////
   return allToolsData;
}

function gatherAllMetadata(
   dataObject,
   metadataTopicsToAlphaSort,
   metadataTopicsToNumberSort
) {
   const itemsToExclude = ["__v", "createdAt", "updatedAt"];
   const valuesToExclude = ["undefined", "", " "];
   // eslint-disable-next-line no-use-before-define
   const outputSet = objectExtractAllValuesPerKey(
      dataObject,
      itemsToExclude,
      valuesToExclude
   );

   const groomedOutputObj = {};
   for (const [key, value] of Object.entries(outputSet)) {
      let newValue = [...value];

      if (metadataTopicsToAlphaSort.includes(key)) {
         newValue = value.sort((a, b) => a.localeCompare(b));
      }

      if (metadataTopicsToNumberSort.includes(key)) {
         newValue = value.sort((a, b) => a - b);
      }

      groomedOutputObj[key] = newValue;
   }

   return groomedOutputObj;
}

function objectExtractAllValuesPerKey(
   objectToLoop,
   itemsToExclude,
   valuesToExclude
) {
   const outputObject = {};

   // Grab each tool
   // eslint-disable-next-line no-restricted-syntax, guard-for-in
   for (const i in objectToLoop) {
      // Get each item withing that tool (ID, topic, answer, etc)
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (let key in objectToLoop[i]) {
         const keyBeforeTrim = key;
         key = key.trim();

         // Check if we are meant to include that item & the value is valid
         if (
            !itemsToExclude.includes(key) &&
            !valuesToExclude.includes(objectToLoop[i][key])
         ) {
            if (typeof objectToLoop[i][key] === "boolean") {
               if (Object.hasOwn(outputObject, key)) {
                  // No need to log false Booloens
                  if (objectToLoop[i][key] === true)
                     outputObject[key].add(objectToLoop[i][key]);
               } else {
                  outputObject[key] = new Set();

                  // No need to log false Booloens
                  if (objectToLoop[i][key] === true)
                     outputObject[key].add(objectToLoop[i][key]);
               }
            } else if (typeof objectToLoop[i][key] === "number") {
               if (Object.hasOwn(outputObject, key)) {
                  outputObject[key].add(objectToLoop[i][key]);
               } else {
                  outputObject[key] = new Set();
                  outputObject[key].add(objectToLoop[i][key]);
               }
            } else if (objectToLoop[i][key]?.indexOf(",") >= 0) {
               const termArray = objectToLoop[i][key].split(",");

               // For each list item, put is in the Set (removes duplicates)
               termArray.forEach((term) => {
                  const value = term.trim().toString();

                  // Add to Set. If key Set does not exist, create it.
                  if (Object.hasOwn(outputObject, key)) {
                     outputObject[key].add(value);
                  } else {
                     outputObject[key] = new Set();
                     outputObject[key].add(value);
                  }
               });
            }

            // Since the value is not a string list, if the value is not an array, just add it as-is to the key Set
            else if (objectToLoop[i][key]?.constructor !== Array) {
               const value = objectToLoop[i][key]?.trim().toString();

               if (Object.hasOwn(outputObject, key)) {
                  outputObject[key].add(value);
               } else {
                  outputObject[key] = new Set();
                  outputObject[key].add(value);
               }
            }

            // Since the value is an array, loop to add it
            else if (objectToLoop[i][key]?.constructor === Array) {
               if (objectToLoop[i][key].length > 0) {
                  objectToLoop[i][key].forEach((rawValue) => {
                     const value = rawValue.toString();

                     // Check if  the value is valid
                     if (!valuesToExclude.includes(value)) {
                        if (Object.hasOwn(outputObject, keyBeforeTrim)) {
                           outputObject[key].add(value);
                        } else {
                           outputObject[key] = new Set();
                           outputObject[key].add(value);
                        }
                     }
                  });
               } else {
                  // Given this is an empty array, just return an empty Setup
                  // eslint-disable-next-line no-lonely-if
                  if (!Object.hasOwn(outputObject, key))
                     outputObject[key] = new Set();
               }
            }
         }
      }
   }
   // eslint-disable-next-line no-restricted-syntax, guard-for-in
   for (const i in outputObject) {
      outputObject[i] = Array.from(outputObject[i]);
   }
   // eslint-disable-next-line no-restricted-syntax, guard-for-in
   //   for (const i in outputObject) {
   //   }
   return outputObject;
}

// function stringToArray(tagString) {
//   if (tagString == 'undefined') return [];

//   return tagString.replaceAll(' ', '').split(',');
// }

function is_url(str) {
   const regexp =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
   if (regexp.test(str)) {
      return true;
   } else {
      return false;
   }
}

function sortObject(obj) {
   const sortedKeyList = Object.keys(obj).sort((str1, str2) => {
      const a = str1.toLowerCase();
      const b = str2.toLowerCase();
      if (a < b) {
         return -1;
      }
      if (a > b) {
         return 1;
      }
      return 0;
   });
   const outputObj = {};
   sortedKeyList.forEach((key) => {
      outputObj[key.toLowerCase()] = obj[key];
   });
   return outputObj;
}
