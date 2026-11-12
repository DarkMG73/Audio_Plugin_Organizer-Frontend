export const PLUGIN_GRID_COLUMNS = 4;
export const PLUGIN_GRID_STACK_MAX_WIDTH = 600;

const ROW_HEIGHT_ESTIMATES = {
  grid: { collapsed: 320, expanded: 620 },
  lines: { collapsed: 140, expanded: 320 },
  streamlined: { collapsed: 110, expanded: 260 },
  minimal: { collapsed: 72, expanded: 140 },
};

export function getPluginListColumnCount(viewportWidth, displayFormat) {
  if (displayFormat !== 'grid') return 1;
  if (!viewportWidth || viewportWidth <= PLUGIN_GRID_STACK_MAX_WIDTH) return 1;
  return PLUGIN_GRID_COLUMNS;
}

export function getPluginRowEstimate(displayFormat, openAll) {
  const pair = ROW_HEIGHT_ESTIMATES[displayFormat] || ROW_HEIGHT_ESTIMATES.grid;
  return openAll ? pair.expanded : pair.collapsed;
}

export function getVirtualRowCount(itemCount, columns) {
  const cols = Math.max(1, columns || 1);
  if (!itemCount || itemCount <= 0) return 0;
  return Math.ceil(itemCount / cols);
}

export function getToolsForVirtualRow(sortedTools, rowIndex, columns) {
  const cols = Math.max(1, columns || 1);
  const start = rowIndex * cols;
  if (!Array.isArray(sortedTools) || start >= sortedTools.length) return [];
  return sortedTools.slice(start, start + cols);
}

export function toolRowPropsAreEqual(prevProps, nextProps) {
  return (
    prevProps.keyOne === nextProps.keyOne &&
    prevProps.openAll === nextProps.openAll &&
    prevProps.tool === nextProps.tool
  );
}
