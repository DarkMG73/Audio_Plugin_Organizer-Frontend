import { createSlice } from "@reduxjs/toolkit";

const initState = {
  header: false,
};

export const elementDimensionsSlice = createSlice({
  name: "elementDimensions",
  initialState: initState,
  reducers: {
    updateHeaderDimensions: (state, action) => {
      state.header = action.payload;
    },
  },
});

export const headerDimensionsActions = elementDimensionsSlice.actions;

export default elementDimensionsSlice.reducer;
