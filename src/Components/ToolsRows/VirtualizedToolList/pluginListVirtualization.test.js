import {
   getPluginListColumnCount,
   getPluginRowEstimate,
   getToolsForVirtualRow,
   getVirtualRowCount,
   toolRowPropsAreEqual
} from "./pluginListVirtualization";

describe("pluginListVirtualization", () => {
   test("grid uses four columns above 600px and one column at or below", () => {
      expect(getPluginListColumnCount(1200, "grid")).toBe(4);
      expect(getPluginListColumnCount(600, "grid")).toBe(1);
      expect(getPluginListColumnCount(320, "grid")).toBe(1);
   });

   test("lines, streamlined, and minimal stay one column", () => {
      expect(getPluginListColumnCount(1200, "lines")).toBe(1);
      expect(getPluginListColumnCount(1200, "streamlined")).toBe(1);
      expect(getPluginListColumnCount(1200, "minimal")).toBe(1);
   });

   test("row estimates grow when all cards are expanded", () => {
      expect(getPluginRowEstimate("grid", true)).toBeGreaterThan(
         getPluginRowEstimate("grid", false)
      );
      expect(getPluginRowEstimate("minimal", false)).toBeLessThan(
         getPluginRowEstimate("grid", false)
      );
   });

   test("chunks a 300-plugin grid into 75 rows of four", () => {
      const tools = Array.from({ length: 300 }, (_, i) => [
         `id-${i}`,
         `Plugin ${i}`
      ]);
      expect(getVirtualRowCount(tools.length, 4)).toBe(75);
      expect(getToolsForVirtualRow(tools, 0, 4)).toEqual([
         ["id-0", "Plugin 0"],
         ["id-1", "Plugin 1"],
         ["id-2", "Plugin 2"],
         ["id-3", "Plugin 3"]
      ]);
      expect(getToolsForVirtualRow(tools, 74, 4)).toHaveLength(4);
   });

   test("memo comparator keeps the same tool object and openAll", () => {
      const tool = { name: "Pro-Q 3" };
      expect(
         toolRowPropsAreEqual(
            { keyOne: "a", openAll: false, tool },
            { keyOne: "a", openAll: false, tool }
         )
      ).toBe(true);
      expect(
         toolRowPropsAreEqual(
            { keyOne: "a", openAll: false, tool },
            { keyOne: "a", openAll: true, tool }
         )
      ).toBe(false);
   });
});
