import {
   cleanPluginKey,
   pluginNamesMatch,
   fileNameFromPluginFile,
   findLibraryMatch
} from "./pluginIdentity";

describe("pluginIdentity", () => {
   test("strips plugin extensions", () => {
      expect(fileNameFromPluginFile("ValhallaRoom.vst3")).toBe("ValhallaRoom");
      expect(fileNameFromPluginFile("Pro-Q 3.component")).toBe("Pro-Q 3");
   });

   test("matches names ignoring spaces, dashes, and case", () => {
      expect(pluginNamesMatch("Pro-Q 3", "proq3")).toBe(true);
      expect(pluginNamesMatch("Valhalla Room", "ValhallaRoom")).toBe(true);
      expect(pluginNamesMatch("EQ", "Decapitator")).toBe(false);
   });

   test("finds a library row from a scanned file name", () => {
      const tools = {
         a: { _id: "a", name: "FabFilter Pro-Q 3", masterLibraryID: "proq3" }
      };
      expect(findLibraryMatch("Pro-Q 3.vst3", tools).name).toBe(
         "FabFilter Pro-Q 3"
      );
      expect(findLibraryMatch("Something Else.vst3", tools)).toBeNull();
   });

   test("cleanPluginKey drops WaveShell prefixes", () => {
      expect(cleanPluginKey("WaveShell1-VST3 14.12")).toBe("1412");
   });
});
