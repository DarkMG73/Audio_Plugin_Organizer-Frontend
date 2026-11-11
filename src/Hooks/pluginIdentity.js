const PLUGIN_EXTENSION = /\.(vst3|vst|component|aaxplugin|clap)$/i;

function cleanPluginKey(str) {
   return String(str || "")
      .toLowerCase()
      .replace(/waveshell[-_a-z0-9]*/g, "")
      .replace(/[\s_\-.'()[\]]/g, "");
}

function pluginNamesMatch(a, b) {
   const ca = cleanPluginKey(a);
   const cb = cleanPluginKey(b);
   if (!ca || !cb) return false;
   if (ca === cb) return true;
   if (ca.length >= 5 && cb.length >= 5 && (ca.includes(cb) || cb.includes(ca))) {
      return true;
   }
   return false;
}

function fileNameFromPluginFile(file) {
   return String(file || "").replace(PLUGIN_EXTENSION, "");
}

function findLibraryMatch(fileName, allTools) {
   if (!allTools || typeof allTools !== "object") return null;
   const displayName = fileNameFromPluginFile(fileName);

   for (const tool of Object.values(allTools)) {
      if (!tool || tool._id === "error") continue;
      if (
         pluginNamesMatch(displayName, tool.masterLibraryID) ||
         pluginNamesMatch(displayName, tool.name)
      ) {
         return tool;
      }
   }
   return null;
}

export {
   PLUGIN_EXTENSION,
   cleanPluginKey,
   pluginNamesMatch,
   fileNameFromPluginFile,
   findLibraryMatch
};
