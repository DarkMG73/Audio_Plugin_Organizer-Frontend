import { configureStore } from "@reduxjs/toolkit";
import audioToolDataReducer from "./audioToolDataSlice";
import authReducer from "./authSlice";

export default configureStore({
  reducer: {
    toolsData: audioToolDataReducer,
    auth: authReducer,
  },
});
