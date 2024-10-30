import { configureStore } from "@reduxjs/toolkit";
import audioToolDataReducer from "./audioToolDataSlice";
import authReducer from "./authSlice";
import elementDimensionsReducer from "./elementDimensionsSlice";
import loadingRequestsReducer from "./loadingRequestsSlice";

export default configureStore({
  reducer: {
    toolsData: audioToolDataReducer,
    auth: authReducer,
    elementDimensions: elementDimensionsReducer,
    loadingRequests: loadingRequestsReducer,
  },
});
