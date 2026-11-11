function hasActiveFilters(currentFilters, searchQuery) {
   if (searchQuery && String(searchQuery).trim() !== "") return true;
   if (!currentFilters || typeof currentFilters !== "object") return false;
   return Object.keys(currentFilters).some(
      (key) => Array.isArray(currentFilters[key]) && currentFilters[key].length > 0
   );
}

function compactText(value) {
   if (value == null) return "";
   return String(value)
      .toLowerCase()
      .replace(/[~|/_\-.'()[\]]/g, "")
      .replace(/\s+/g, "");
}

function normalizeText(value) {
   if (value == null) return "";
   return String(value)
      .toLowerCase()
      .replace(/[~|/_\-.'()[\]]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
}

function asBoolean(value) {
   if (value === true || value === "true" || value === "True") return true;
   if (value === false || value === "false" || value === "False" || value === "")
      return false;
   return null;
}

function asNumber(value) {
   const parsed = Number(value);
   return Number.isFinite(parsed) ? parsed : null;
}

function valuesMatch(pluginValue, chosenValue, filterName) {
   if (filterName === "rating") {
      const pluginRating = asNumber(pluginValue);
      const minRating = asNumber(chosenValue);
      if (pluginRating == null || minRating == null) return false;
      return pluginRating >= minRating;
   }

   if (filterName === "favorite" || filterName === "oversampling") {
      return asBoolean(pluginValue) === asBoolean(chosenValue) &&
         asBoolean(chosenValue) !== null;
   }

   if (Array.isArray(pluginValue)) {
      const chosenCompact = compactText(chosenValue);
      const chosenNorm = normalizeText(chosenValue);
      const chosenLeaf = chosenNorm.split(" ").filter(Boolean).pop();
      return pluginValue.some((item) => {
         const itemCompact = compactText(item);
         const itemNorm = normalizeText(item);
         if (itemCompact === chosenCompact) return true;
         const itemLeaf = itemNorm.split(" ").filter(Boolean).pop();
         return Boolean(itemLeaf && chosenLeaf && itemLeaf === chosenLeaf);
      });
   }

   if (pluginValue == null) return false;
   return compactText(pluginValue) === compactText(chosenValue);
}

function pluginMatchesCategory(plugin, filterName, chosenValues) {
   if (!Array.isArray(chosenValues) || chosenValues.length === 0) return true;
   const pluginValue = plugin[filterName];
   return chosenValues.some((chosen) =>
      valuesMatch(pluginValue, chosen, filterName)
   );
}

function pluginMatchesSearch(plugin, searchQuery) {
   const query = String(searchQuery || "").trim();
   if (!query) return true;

   const haystack = normalizeText(
      [
         plugin.name,
         plugin.company,
         plugin.notes,
         plugin.status,
         ...(Array.isArray(plugin.functions) ? plugin.functions : [plugin.functions]),
         ...(Array.isArray(plugin.color) ? plugin.color : [plugin.color]),
         ...(Array.isArray(plugin.precision) ? plugin.precision : [plugin.precision])
      ]
         .filter(Boolean)
         .join(" ")
   );

   const tokens = normalizeText(query).split(" ").filter(Boolean);
   return tokens.every((token) => haystack.includes(token));
}

function SetFilteredToolList(allTools, currentFiltersObj, searchQuery) {
   if (!allTools || typeof allTools !== "object") return [];

   const currentFilters = { ...(currentFiltersObj || {}) };
   if (!hasActiveFilters(currentFilters, searchQuery)) return [];

   const filteredToolIdList = [];

   Object.keys(allTools).forEach((id) => {
      const plugin = allTools[id];
      if (!plugin || plugin._id === "error") return;

      if (!pluginMatchesSearch(plugin, searchQuery)) return;

      const categoryKeys = Object.keys(currentFilters).filter(
         (filterName) =>
            Array.isArray(currentFilters[filterName]) &&
            currentFilters[filterName].length > 0
      );

      const matchesAllCategories = categoryKeys.every((filterName) =>
         pluginMatchesCategory(plugin, filterName, currentFilters[filterName])
      );

      if (matchesAllCategories) filteredToolIdList.push(id);
   });

   return filteredToolIdList;
}

export {
   hasActiveFilters,
   compactText,
   normalizeText,
   pluginMatchesSearch,
   pluginMatchesCategory
};
export default SetFilteredToolList;
