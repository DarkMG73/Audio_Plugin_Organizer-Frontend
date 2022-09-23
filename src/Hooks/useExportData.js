import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getSchemaForAudioPlugin } from "../storage/audioToolsDB";

const useExportData = () => {
  const [pluginSchema, setPluginSchema] = useState(false);
  const { allTools, filteredToolsIds } = useSelector(
    (state) => state.toolsData
  );

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////
  useEffect(() => {
    getSchemaForAudioPlugin().then((data) => setPluginSchema(data));
  }, []);

  ////////////////////////////////////////
  /// Functionality
  ////////////////////////////////////////
  if (!filteredToolsIds) return null;

  const generateExport = function (props) {
    if (props.type === "json") {
      exportJSON(allTools);
    } else if (pluginSchema) {
      const headers = {};

      for (const topic in pluginSchema.obj) {
        headers[topic] = topic;
      }

      const itemsReadyForCVS = formatAnObject(allTools);

      // format the data
      function formatAnObject(obj) {
        var itemsFormatted = [];

        for (const key in obj) {
          const item = obj[key];
          const itemDetailFormatted = {};
          for (const topic in pluginSchema.obj) {
            itemDetailFormatted[topic] = item[topic] || "-";
          }

          itemsFormatted.push(itemDetailFormatted);
        }

        return itemsFormatted;
      }

      const fileName = prompt("What would you like to name the file?");
      let exportFileName = fileName || "interview_tools_list.json";
      exportCSVFile(headers, itemsReadyForCVS, exportFileName); // call the exportCSVFile() function to process the JSON and trigger the download
    }
  };

  return generateExport;
};

function exportCSVFile(headers, items, fileTitle) {
  // Sort by name
  items.sort(function (a, b) {
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  });

  if (headers) {
    items.unshift(headers);
  }

  // Convert Object to JSON -for testing
  // var jsonObject = JSON.stringify(items);
  const groomedItems = items.map((group) => {
    const outputGroup = {};

    for (const topic in group) {
      if (group[topic].constructor === Array) {
        let str = group[topic].join("/");

        if (str[0] == ",") {
          str = str.substring(1);
        }

        outputGroup[topic] = str.replaceAll(",", "^");

        // outputGroup[topic] = str;
      } else if (topic === "notes") {
        outputGroup[topic] = JSON.stringify(encodeURI(group[topic]));
      } else if (group[topic].constructor === String) {
        outputGroup[topic] = group[topic].replaceAll(",", "^");

        // outputGroup[topic] = group[topic];
      } else {
        outputGroup[topic] = group[topic];
      }
    }

    return outputGroup;
  });

  var csv = convertToCSV(groomedItems);

  var exportedFilenmae = fileTitle + ".csv" || "export.csv";

  var blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, exportedFilenmae);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", exportedFilenmae);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }
  return str;
}

const exportJSON = function (allTools) {
  const fileName = prompt("What would you like to name the file?");
  const newToolRecord = {
    ...allTools,
  };
  let dataStr = JSON.stringify(newToolRecord);
  let dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  let exportFileName = fileName || "interview_tools_list.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileName);
  linkElement.click();
};

export default useExportData;
