import { createSlice } from "@reduxjs/toolkit";

const initState = {
  user: false,
  authToken: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    logIn: (state, action) => {
      state.user = action.payload;
      state.authToken = action.payload.token;
    },
    logOut: (state) => {
      return initState;
    },
  },
});

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions;

export default authSlice.reducer;
