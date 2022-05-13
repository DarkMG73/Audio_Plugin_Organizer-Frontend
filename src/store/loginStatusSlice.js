import { createSlice } from "@reduxjs/toolkit";

const initState = {
  userLoggedIn: false,
  user: false,
};

export const loginStatusSlice = createSlice({
  name: "loginStatus",
  initialState: initState,
  reducers: {
    logIn: (state, action) => {
      state.userLoggedIn = true;
      state.user = action.payload;
    },
    logOut: (state) => {
      return initState;
    },
  },
});

// Action creators are generated for each case reducer function
export const loginStatusActions = loginStatusSlice.actions;

export default loginStatusSlice.reducer;
