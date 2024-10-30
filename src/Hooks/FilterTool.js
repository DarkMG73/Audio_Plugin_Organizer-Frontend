function FilterTools(toolData) {
  const { filteredToolsIds, currentFilters, allTools, toolMetadata } = toolData;

  const allFilters = currentFilters;

  let filteredTools = allTools;
  if (allFilters.level.length < toolMetadata.level.length) {
    filteredTools = applyFIlter(filteredTools, allFilters.level, "level");
  }

  if (allFilters.topic.length < toolMetadata.topic.length) {
    filteredTools = applyFIlter(filteredTools, allFilters.topic, "topic");
  }

  if (allFilters.tags.length < toolMetadata.tags.length) {
    applyFIlter(filteredTools, allFilters.tags, "tags");
  }

  // Set the filter ID Array

  for (const key in filteredTools) {
    filteredToolsIds.push(filteredTools[key].identifier);
  }

  return filteredToolsIds;
}

export default FilterTools;

function applyFIlter(nestedObjectArray, filterArray, filterName) {
  const output = nestedObjectArray.filter((toolData) => {
    for (const k in toolData) {
      if (filterArray.includes(toolData[filterName])) {
        return true;
      }
    }
    return false;
  });

  return output;
}
