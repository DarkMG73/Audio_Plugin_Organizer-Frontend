function SetFilteredToolList(
  allTools,
  currentFiltersObj,
  clearToolFilterIds,
  setToolFilterIds,
  filteredToolsIds
) {
  let filteredToolIdList = [];
  let currentFilters = { ...currentFiltersObj };
  console.log(
    "%c --> %cline:63%cfilteredToolIdList",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
    filteredToolIdList
  );

  // See if there are any filters selected yet and
  if (Object.keys(currentFilters).length <= 0) return [];
  console.log(
    "%c --> %cline:19%cObject.keys(currentFilters).length <= 0)",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(161, 23, 21);padding:3px;border-radius:2px",
    Object.keys(currentFilters).length <= 0
  );

  for (const category in currentFilters) {
    console.log(
      "%c --> %cline:23%ccurrentFilters[category]",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
      currentFilters[category]
    );
    if (currentFilters[category].length > 0) break;

    if (Object.keys(currentFilters)[-1] === category) return [];
  }

  console.log(
    "%c --> %cline:16%ccurrentFilters",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
    currentFilters
  );

  console.log(
    "%c --> %cline:33%callTools",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
    allTools
  );
  Object.keys(allTools).forEach((id) => {
    console.log(
      "%c --> %cline:33%cid",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
      id
    );
    let hasTerms = [];
    Object.keys(currentFilters).forEach((filterName) => {
      console.log(
        "%c --> %cline:36%cfilterName",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
        filterName
      );
      currentFilters[filterName].forEach((chosenName) => {
        console.log(
          "%c --> %cline:38%cchosenName",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
          chosenName
        );
        console.log(
          "%c --> %cline:84%c allTools[id].hasOwnProperty(filterName) &&allTools[id][filterName].length > 0",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
          allTools[id].hasOwnProperty(filterName) &&
            allTools[id][filterName].length > 0
        );
        if (
          allTools[id].hasOwnProperty(filterName) &&
          allTools[id][filterName].length > 0
        ) {
          console.log(
            "%c --> %cline:84%callTools[id][filterName]",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(254, 67, 101);padding:3px;border-radius:2px",
            allTools[id][filterName]
          );
          hasTerms.push(allTools[id][filterName].includes(chosenName));
        }
        console.log(
          "%c --> %cline:37%chasTerms",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px",
          hasTerms
        );
      });
    });

    if (!hasTerms.includes(false) && hasTerms.length > 0)
      filteredToolIdList.push(id);
  });

  console.log(
    "%c --> %cline:36%cfilteredToolIdList",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px",
    filteredToolIdList
  );
  // Filter by level
  // if (currentFilters.level.length > 0) {
  //   for (const k in allTools) {
  //     if (currentFilters.level.includes(allTools[k].level.trim())) {
  //       filteredToolIdList.push(allTools[k].id);
  //     }
  //   }
  // }
  // // Filter by topic
  // if (filteredToolIdList.length <= 0) {
  //   filteredToolIdList = Object.keys(allTools);
  // }
  // if (currentFilters.topic.length > 0) {
  //   const questIdsToRemove = [];
  //   filteredToolIdList.forEach((id) => {
  //     if (!currentFilters.topic.includes(allTools[id].topic.trim())) {
  //       questIdsToRemove.push(allTools[id].id);
  //     }
  //   });
  //   questIdsToRemove.forEach((id) => {
  //     if (filteredToolIdList.indexOf(id) >= 0)
  //       filteredToolIdList.splice(filteredToolIdList.indexOf(id), 1);
  //   });
  // }

  // // Filter by tags
  // if (filteredToolIdList.length <= 0)
  //   filteredToolIdList = Object.keys(allTools);
  // if (currentFilters.tags.length > 0) {
  //   const questIdsToRemove = [];
  //   filteredToolIdList.forEach((id) => {
  //     if (allTools[id].tags.length !== 0) {
  //       currentFilters.tags.forEach((tag) => {
  //         if (!allTools[id].tags.includes(tag.trim())) {
  //           questIdsToRemove.push(allTools[id].id);
  //         }
  //       });
  //     } else {
  //       questIdsToRemove.push(allTools[id].id);
  //     }
  //   });

  //   questIdsToRemove.forEach((id) => {
  //     if (filteredToolIdList.indexOf(id) >= 0)
  //       filteredToolIdList.splice(filteredToolIdList.indexOf(id), 1);
  //   });
  // }

  console.log(
    "%c --> %cline:63%cfilteredToolIdList",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(131, 175, 155);padding:3px;border-radius:2px",
    filteredToolIdList
  );
  return filteredToolIdList;
}

export default SetFilteredToolList;
