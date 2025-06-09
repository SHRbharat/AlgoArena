import { configureStore } from "@reduxjs/toolkit";
import problemReducer from "./slice/problemSlice"; // Adjust the path to your slice file
import companyReducer from "./slice/companySlice";
import topicReducer from "./slice/topicSlice";
import toggleReducer from "./slice/toggleSlice";
import authReducer from "./slice/authSlice";

export const store = configureStore({
  reducer: {
    problem: problemReducer,
    companies: companyReducer,
    topics: topicReducer,
    toggle: toggleReducer,
    auth: authReducer,
  },
});
