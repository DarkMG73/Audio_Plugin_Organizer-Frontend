import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import ToolRow from "../ToolRow/ToolRow";
import styles from "./VirtualizedToolList.module.css";
import {
   getPluginListColumnCount,
   getPluginRowEstimate,
   getToolsForVirtualRow,
   getVirtualRowCount
} from "./pluginListVirtualization";

function VirtualizedToolList({ sortedTools, toolsById, displayFormat, openAll }) {
   const listRef = useRef(null);
   const [scrollMargin, setScrollMargin] = useState(0);
   const [viewportWidth, setViewportWidth] = useState(() =>
      typeof window === "undefined" ? 1200 : window.innerWidth
   );
   const columns = getPluginListColumnCount(viewportWidth, displayFormat);
   const rowCount = getVirtualRowCount(sortedTools.length, columns);

   useEffect(() => {
      const onResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
   }, []);

   useLayoutEffect(() => {
      if (listRef.current) {
         setScrollMargin(listRef.current.offsetTop);
      }
   }, [sortedTools.length, displayFormat, openAll, columns]);

   const estimateSize = useCallback(
      () => getPluginRowEstimate(displayFormat, openAll),
      [displayFormat, openAll]
   );

   const virtualizer = useWindowVirtualizer({
      count: rowCount,
      estimateSize,
      overscan: 4,
      scrollMargin,
      getItemKey: (index) => {
         const first = sortedTools[index * columns];
         return first ? `${columns}:${first[0]}` : index;
      }
   });

   useLayoutEffect(() => {
      virtualizer.measure();
   }, [displayFormat, openAll, columns, sortedTools.length]);

   return (
      <div
         ref={listRef}
         className={`${styles["virtual-list"]} virtualized-plugin-list`}
         data-testid="virtualized-plugin-list"
         data-columns={columns}
         data-display-format={displayFormat}
      >
         <div
            className={styles["virtual-list-inner"]}
            style={{
               height: `${virtualizer.getTotalSize()}px`,
               width: "100%",
               position: "relative"
            }}
         >
            {virtualizer.getVirtualItems().map((virtualRow) => {
               const rowTools = getToolsForVirtualRow(
                  sortedTools,
                  virtualRow.index,
                  columns
               );
               return (
                  <div
                     key={virtualRow.key}
                     data-index={virtualRow.index}
                     ref={virtualizer.measureElement}
                     className={styles["virtual-row"]}
                     style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${
                           virtualRow.start - virtualizer.options.scrollMargin
                        }px)`
                     }}
                  >
                     {rowTools.map(([key]) => (
                        <ToolRow
                           key={key}
                           tool={toolsById[key]}
                           keyOne={key}
                           openAll={openAll}
                        />
                     ))}
                  </div>
               );
            })}
         </div>
      </div>
   );
}

export default VirtualizedToolList;
