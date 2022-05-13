import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.allTools = null;
  initialState.filteredToolsIds = null;
  initialState.toolsMetadata = null;
  initialState.currentFilters = null;
  return initialState;
}

export const audioToolDataSlice = createSlice({
  name: "toolsData",
  initialState: InitState(),
  reducers: {
    initState: (state, action) => {
      const toolsData = action.payload;
      state.allTools = toolsData.allTools;
      state.filteredToolsIds = [];
      state.toolsMetadata = toolsData.toolsMetadata;
      state.currentFilters = toolsData.currentFilters;
      console.log("toolsData", toolsData);
    },

    addToToolFilters: (state, action) => {
      state.currentFilters[action.payload.type] = [
        ...state.currentFilters[action.payload.type],
        action.payload.value,
      ];
    },
    removeFromToolFilters: (state, action) => {
      let newState = [...state.currentFilters[action.payload.type]];

      newState.splice(newState.indexOf(action.payload.value), 1);
      state.currentFilters[action.payload.type] = newState;
    },
    setToolFilterIds: (state, action) => {
      state.filteredToolsIds = [...action.payload];
    },
    clearToolFilterIds: (state, action) => {
      state.filteredToolsIds = [];
    },
  },
});

// Action creators are generated for each case reducer function
export const audioToolDataActions = audioToolDataSlice.actions;

export default audioToolDataSlice.reducer;
