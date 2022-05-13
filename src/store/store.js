import { configureStore } from "@reduxjs/toolkit";
import audioToolDataReducer from "./audioToolDataSlice";
import loginStatusReducer from "./loginStatusSlice";

export default configureStore({
  reducer: {
    toolsData: audioToolDataReducer,
    loginStatus: loginStatusReducer,
  },
});
