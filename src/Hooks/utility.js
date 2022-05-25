import { formInputData } from "../data/formInputData";

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
    console.log("newAuthRes:", newAuthRes);
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

export const groomFormOutput = (formOutputArray) => {
  console.log(
    "%c --> %cline:110%cformOutputArray",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(252, 157, 154);padding:3px;border-radius:2px",
    formOutputArray
  );
  const pairedObjectsArray = createKeyValueObjectsArray(formOutputArray);
  console.log(
    "%c --> %cline:24%cpairedObjectsArray",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
    pairedObjectsArray
  );

  const outputArray = [];
  pairedObjectsArray.forEach((row) => {
    console.log(
      "%c --> %cline:29%crow",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
      row
    );
    const rowGroup = [];
    let assembledRow = {};
    formInputData.forEach((inputData, i) => {
      console.log(
        "%c --> %cline:32%cinputData",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
        inputData
      );
      assembledRow = { ...inputData };
      console.log(
        "%c --> %cline:54%c_____________________",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px"
      );

      console.log(
        "%c --> %cline:29%crow",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
        row
      );
      console.log(
        "%c --> %cline:54%cinputData.title",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px",
        inputData.name
      );
      console.log(
        "%c --> %cline:67%crow[inputData.title]",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
        row[inputData.name]
      );
      console.log(
        "%c --> %cline:67%crow[inputData.title]",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
        row["name"]
      );

      assembledRow.preFilledData = row[inputData.name]
        ? row[inputData.name]
        : "";
      console.log(
        "%c --> %cline:70%cassembledRow",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px",
        assembledRow
      );
      console.log(
        "%c --> %cline:54%c_____________________",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(222, 125, 44);padding:3px;border-radius:2px"
      );
      rowGroup.push(assembledRow);
    });
    outputArray.push(rowGroup);
  });
  return outputArray;
};
