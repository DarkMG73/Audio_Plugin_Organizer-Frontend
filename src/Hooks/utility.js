export function hyphenate(string, indexBreakPoint, separator) {
  const firstHalf = string.substring(0, indexBreakPoint);
  const secondHalf = string.substring(indexBreakPoint, string.length);
  return firstHalf + separator + secondHalf;
}

export function numberToText(number) {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];
  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "fourty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  if (number < 20) return ones[number];
}

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export const refreshTokenSetup = (res) => {
  // Timing to renew access token
  let refreshTiming = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

  const refreshToken = async () => {
    const newAuthRes = await res.reloadAuthResponse();
    refreshTiming = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
    // saveUserToken(newAuthRes.access_token);  <-- save new token
    localStorage.setItem("authToken", newAuthRes.id_token);

    // Setup the other timer after the first one
    setTimeout(refreshToken, refreshTiming);
  };

  // Setup first refresh timer
  setTimeout(refreshToken, refreshTiming);
};

export function escapeHtml(string) {
  var entityMap = {
    "&": "&",
    "<": "<",
    ">": ">",
    '"': '"',
    "'": "'",
    "/": "/",
    "`": "`",
    "=": "=",
  };

  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s];
  });
}

const createKeyValueObjectsArray = (formOutputArray) => {
  const outputArray = [];
  const categoryTitles = formOutputArray[0];
  formOutputArray.forEach((row) => {
    const assembledRow = {};
    row.forEach((value, i) => {
      assembledRow[categoryTitles[i].trim()] = value.trim();
    });
    outputArray.push(assembledRow);
  });
  outputArray.shift();
  return outputArray;
};

export const groomFormOutput = (formOutputArray, passFormInputData) => {
  const pairedObjectsArray = formOutputArray;

  // The _id field must remain to allow the ID to be passed on DB item updates.
  const idData = {
    title: "Tool ID",
    name: "_id",
    type: "textarea",
    options: [],
    required: "false",
    preFilledData: "",
  };

  const formInputData = [...passFormInputData, idData];
  const outputArray = [];
  pairedObjectsArray.forEach((row) => {
    const rowGroup = [];
    let assembledRow = {};

    formInputData.forEach((inputData, i) => {
      assembledRow = { ...inputData };

      if (
        row.hasOwnProperty(inputData.name) &&
        row[inputData.name].constructor === Boolean
      ) {
        if (row[inputData.name] == false) assembledRow.preFilledData = "false";
      } else if (inputData.name === "functions") {
        // See if row[inputData.name], which is an array, has an item that is equal to any of the set options. To do this, we need to compare the option item after the tilde ( ~) )

        //  loop through row[inputData.name]

        const groomedFunctionsOptions = row[inputData.name].map(
          (rowFunctionOption) => {
            // loop through all of the function options
            for (const functionOption of inputData.options) {
              // break each function option down into part after the tilde (~)
              let optionGroup = "User Added";
              let functionOptionName = functionOption;
              if (functionOption.includes("~")) {
                [optionGroup, functionOptionName] = functionOption.split("~");
                optionGroup = optionGroup.trim();
                functionOptionName = functionOptionName.trim();
              }

              // compare the this with the row variable
              // if they match, push the prefilled data array variable with the information plus the group info preceding it.

              if (rowFunctionOption === functionOptionName) {
                return optionGroup + " ~ " + functionOptionName;
              }
              // if they do not match, let pass to next in loop
            }

            // if at the end of the loop nothing matches, just assign the "User ~ " group and the info an array and assign that to the prefilled array.

            assembledRow.options.push("User Added ~ " + rowFunctionOption);
            return "User Added" + " ~ " + rowFunctionOption;
          }
        );

        assembledRow.preFilledData = groomedFunctionsOptions;
      } else {
        assembledRow.preFilledData = row[inputData.name]
          ? row[inputData.name]
          : "";
      }

      const removeUngroomedOptions = [...assembledRow.options];
      removeUngroomedOptions.forEach((optionToRemove) => {
        if (!optionToRemove.includes("~")) {
          assembledRow.options.splice(
            assembledRow.options.indexOf(optionToRemove),
            1
          );
        }
      });

      rowGroup.push(assembledRow);
    });

    outputArray.push(rowGroup);
  });
  console.log(
    "%c --> %cline:208%coutputArray",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(118, 77, 57);padding:3px;border-radius:2px",
    outputArray
  );
  return outputArray;
};

export const toTitleCase = (str, spaceAtCamelCase = false) => {
  if (spaceAtCamelCase) {
    str = [...str].map((character) => {
      if (!isNaN(character * 1) && character == character.toUpperCase()) {
        return "-" + character;
      }

      return character;
    });
  }
  str = str.join("");
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
