import { createSlice } from "@reduxjs/toolkit";

const initState = {
   user: false,
   authToken: false,
   refreshUser: false
};

export const authSlice = createSlice({
   name: "auth",
   initialState: initState,
   reducers: {
      logIn: (state, action) => {
         state.user = action.payload;
         state.authToken = action.payload.token;
      },

      logOut: () => {
         return initState;
      },
      refreshUser: (state, action) => {
         state.refreshUser = action.payload;
      }
   }
});

// Action creators are generated for each case reducer function
export const authActions = authSlice.actions;

export default authSlice.reducer;
