import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import pollReducer from "../features/pollSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    poll: pollReducer,
  },
});
