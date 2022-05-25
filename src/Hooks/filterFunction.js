function FilterQuestions(questionData) {
  const {
    filteredQuestionsIds,
    currentFilters,
    allQuestions,
    questionMetadata,
  } = questionData;

  const allFilters = currentFilters;

  let filteredQuestions = allQuestions;
  if (allFilters.level.length < questionMetadata.level.length) {
    filteredQuestions = applyFIlter(
      filteredQuestions,
      allFilters.level,
      "level"
    );
  }

  if (allFilters.topic.length < questionMetadata.topic.length) {
    filteredQuestions = applyFIlter(
      filteredQuestions,
      allFilters.topic,
      "topic"
    );
  }

  if (allFilters.tags.length < questionMetadata.tags.length) {
    applyFIlter(filteredQuestions, allFilters.tags, "tags");
  }

  // Set the filter ID Array

  for (const key in filteredQuestions) {
    filteredQuestionsIds.push(filteredQuestions[key].id);
  }

  return filteredQuestionsIds;
}

export default FilterQuestions;

function applyFIlter(nestedObjectArray, filterArray, filterName) {
  const output = nestedObjectArray.filter((questionData) => {
    for (const k in questionData) {
      if (filterArray.includes(questionData[filterName])) {
        return true;
      }
    }
    return false;
  });

  return output;
}
