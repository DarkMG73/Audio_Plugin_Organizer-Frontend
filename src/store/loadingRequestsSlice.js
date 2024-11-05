import { createSlice } from "@reduxjs/toolkit";

const initState = {
  pendingLoadRequests: false,
};

export const loadingRequestsSlice = createSlice({
  name: "loadingRequests",
  initialState: initState,
  reducers: {
    addToLoadRequest: (state, action) => {
      const currentValue = state.pendingLoadRequests;
      console.log('%c⚪️►►►► %cline:12%ccurrentValue', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px', currentValue + 1)
      state.pendingLoadRequests = currentValue + 1;
    },
    removeFromLoadRequest: (state) => {
      const currentValue = state.pendingLoadRequests;
      console.log('%c⚪️►►►► %cline:17%ccurrentValue', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px', currentValue - 1)
      state.pendingLoadRequests = currentValue - 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const loadingRequestsActions = loadingRequestsSlice.actions;

export default loadingRequestsSlice.reducer;
