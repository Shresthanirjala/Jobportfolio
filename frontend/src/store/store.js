import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer, // Use 'job' instead of 'user' if it's related to job data
  },
});

export default store;
