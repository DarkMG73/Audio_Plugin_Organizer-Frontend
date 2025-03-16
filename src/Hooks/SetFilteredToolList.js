function SetFilteredToolList(allTools, currentFiltersObj) {
   let filteredToolIdList = [];
   let currentFilters = { ...currentFiltersObj };

   // See if there are any filters selected yet and
   if (Object.keys(currentFilters).length <= 0) return [];

   for (const category in currentFilters) {
      if (currentFilters[category].length > 0) break;

      if (Object.keys(currentFilters)[-1] === category) return [];
   }

   Object.keys(allTools).forEach((id) => {
      const hasTerms = [];
      Object.keys(currentFilters).forEach((filterName) => {
         currentFilters[filterName].forEach((chosenName) => {
            if (
               allTools[id].hasOwnProperty(filterName) &&
               (allTools[id][filterName].constructor === Boolean ||
                  allTools[id][filterName].constructor === Number)
            ) {
               hasTerms.push(allTools[id][filterName] === chosenName);
            } else if (
               allTools[id].hasOwnProperty(filterName) &&
               allTools[id][filterName].constructor === Array &&
               allTools[id][filterName].length > 0
            ) {
               let termExists = false;
               allTools[id][filterName].forEach((name) => {
                  if (
                     name.constructor === String &&
                     name.replaceAll(" ", "").toLowerCase() ===
                        chosenName.replaceAll(" ", "").toLowerCase()
                  )
                     termExists = true;
               });

               hasTerms.push(termExists);
            } else if (
               allTools[id].hasOwnProperty(filterName) &&
               allTools[id][filterName].length > 0
            ) {
               const termExists =
                  allTools[id][filterName].replaceAll(" ", "").toLowerCase() ===
                  chosenName.replaceAll(" ", "").toLowerCase();

               hasTerms.push(termExists);
            } else {
               hasTerms.push(false);
            }
         });
      });

      if (!hasTerms.includes(false) && hasTerms.length > 0)
         filteredToolIdList.push(id);
   });

   return filteredToolIdList;
}

export default SetFilteredToolList;
