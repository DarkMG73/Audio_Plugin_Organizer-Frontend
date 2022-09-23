import { createSlice } from "@reduxjs/toolkit";

function InitState() {
  const initialState = {};
  initialState.allTools = null;
  initialState.filteredToolsIds = null;
  initialState.toolsMetadata = null;
  initialState.toolsHistory = null;
  initialState.currentFilters = null;
  initialState.toolsSchema = null;
  initialState.goToAddATool = null;
  initialState.goToToolRows = null;
  return initialState;
}

export const audioToolDataSlice = createSlice({
  name: "toolsData",
  initialState: InitState(),
  reducers: {
    /// INITIALIZE STATE /////////////////////////////
    initState: (state, action) => {
      const toolsData = action.payload;
      state.allTools = toolsData.allTools;
      state.filteredToolsIds = [];
      state.toolsMetadata = toolsData.toolsMetadata;
      state.toolsHistory = toolsData.toolsHistory;
      state.currentFilters = toolsData.currentFilters;
      state.toolsSchema = toolsData.toolsSchema;
      state.goToAddATool = 0;
      state.goToToolRows = 0;
    },

    /// ADD TO FILTERS /////////////////////////////
    addToToolFilters: (state, action) => {
      state.currentFilters[action.payload.type] = [
        ...state.currentFilters[action.payload.type],
        action.payload.value,
      ];
    },

    /// REMOVE FROM FILTERS ////////////////////////
    removeFromToolFilters: (state, action) => {
      let newState = [...state.currentFilters[action.payload.type]];

      newState.splice(newState.indexOf(action.payload.value), 1);
      state.currentFilters[action.payload.type] = newState;
    },

    /// SET TOOL FILTERS //////////////////////////
    setToolFilterIds: (state, action) => {
      state.filteredToolsIds = [...action.payload];
    },

    /// CLEAR TOOL FILTER IDS ////////////////////
    clearToolFilterIds: (state, action) => {
      state.filteredToolsIds = [];
    },

    /// GO TO: ADD TOOL /////////////////////////////
    goToAddATool: (state, action) => {
      const goToAddAToolCount = state.goToAddATool;
      state.goToAddATool = goToAddAToolCount + 1;
    },

    /// GO TO: TOOL ROWS /////////////////////////////
    goToToolRows: (state, action) => {
      const goToToolRowsCount = state.goToToolRows;
      state.goToToolRows = goToToolRowsCount + 1;
    },
  },
});

export const audioToolDataActions = audioToolDataSlice.actions;

export default audioToolDataSlice.reducer;
