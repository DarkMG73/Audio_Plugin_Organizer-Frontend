import { cleanup, render, screen } from "@testing-library/react";
import VirtualizedToolList from "./VirtualizedToolList";

jest.mock("../ToolRow/ToolRow", () => {
   const React = require("react");
   function MockToolRow(props) {
      return React.createElement(
         "div",
         {
            "data-testid": "tool-row",
            "data-key": props.keyOne
         },
         props.tool && props.tool.name
      );
   }
   return MockToolRow;
});

function makeTools(count) {
   const sortedTools = [];
   const toolsById = {};
   for (let i = 0; i < count; i += 1) {
      const id = `plugin-${i}`;
      sortedTools.push([id, `Plugin ${i}`]);
      toolsById[id] = { _id: id, name: `Plugin ${i}`, rating: 3 };
   }
   return { sortedTools, toolsById };
}

describe("VirtualizedToolList", () => {
   beforeAll(() => {
      class ResizeObserverMock {
         observe() {}
         unobserve() {}
         disconnect() {}
      }
      global.ResizeObserver = ResizeObserverMock;
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
         configurable: true,
         get() {
            return 400;
         }
      });
      Object.defineProperty(HTMLElement.prototype, "offsetTop", {
         configurable: true,
         get() {
            return 200;
         }
      });
      jest
         .spyOn(HTMLElement.prototype, "getBoundingClientRect")
         .mockImplementation(() => ({
            x: 0,
            y: 200,
            top: 200,
            left: 0,
            bottom: 600,
            right: 1200,
            width: 1200,
            height: 400,
            toJSON() {}
         }));
      Object.defineProperty(window, "innerHeight", {
         configurable: true,
         writable: true,
         value: 800
      });
      Object.defineProperty(window, "innerWidth", {
         configurable: true,
         writable: true,
         value: 1200
      });
      Object.defineProperty(window, "scrollY", {
         configurable: true,
         writable: true,
         value: 0
      });
      window.scrollTo = jest.fn();
   });

   afterEach(() => {
      cleanup();
   });

   test("does not mount 300 ToolRows for a 300-plugin library", () => {
      const { sortedTools, toolsById } = makeTools(300);
      render(
         <VirtualizedToolList
            sortedTools={sortedTools}
            toolsById={toolsById}
            displayFormat="grid"
            openAll={false}
         />
      );

      const mounted = screen.getAllByTestId("tool-row");
      expect(mounted.length).toBeGreaterThan(0);
      expect(mounted.length).toBeLessThan(300);
      expect(screen.getByTestId("virtualized-plugin-list")).toHaveAttribute(
         "data-columns",
         "4"
      );
   });

   test("keeps favorites-then-rating order for the first visible row", () => {
      const sortedTools = [
         ["fav", "Favorite"],
         ["high", "High rating"],
         ["mid", "Mid"],
         ["low", "Low"]
      ];
      const toolsById = {
         fav: { name: "Favorite", favorite: true, rating: 3 },
         high: { name: "High rating", favorite: false, rating: 5 },
         mid: { name: "Mid", favorite: false, rating: 3 },
         low: { name: "Low", favorite: false, rating: 1 }
      };
      render(
         <VirtualizedToolList
            sortedTools={sortedTools}
            toolsById={toolsById}
            displayFormat="lines"
            openAll={false}
         />
      );

      const names = screen
         .getAllByTestId("tool-row")
         .map((node) => node.textContent);
      expect(names[0]).toBe("Favorite");
      expect(names.slice(0, 4)).toEqual([
         "Favorite",
         "High rating",
         "Mid",
         "Low"
      ]);
   });
});
