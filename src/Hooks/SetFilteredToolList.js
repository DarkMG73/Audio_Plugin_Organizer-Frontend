function SetFilteredToolList(
  allTools,
  currentFilters,
  clearToolFilterIds,
  setToolFilterIds,
  filteredToolsIds
) {
  let filteredToolIdList = [];

  if (!currentFilters) return [];

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

  return filteredToolIdList;
}

export default SetFilteredToolList;
