import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import SigninReducer from "./AuthSlice"; // Import the reducer directly from the slice

// Combine reducers
const appReducer = combineReducers({
  Signin: SigninReducer, // Use the reducer, not the entire slice
});

// Root reducer with logout logic
const rootReducer = (state, action) => {
  if (action.type === "SIGN_OUT") {
    storage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
