import { configureStore } from "@reduxjs/toolkit";
import audioToolDataReducer from "./audioToolDataSlice";
import authReducer from "./authSlice";
import elementDimensionsReducer from "./elementDimensionsSlice";

export default configureStore({
  reducer: {
    toolsData: audioToolDataReducer,
    auth: authReducer,
    elementDimensions: elementDimensionsReducer,
  },
});
