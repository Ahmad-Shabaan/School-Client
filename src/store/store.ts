import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
// import { createMigrate } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers, type UnknownAction } from "redux";
import themeReducer from "@/shared/store/themeSlice";
import authReducer from "@/features/auth/store/authSlice";
import { RESET_APP } from "./resetAction";

// what to do when state shape changes? Migrations! (optional, but recommended for production apps)
// const migrations = {
//   1: (state) => ({ ...state, ui: { ...state.ui, language: "en" } }), // add new field
//   2: (state) => {
//     delete state.ui.oldField;
//     return state;
//   }, // remove old field
// };

const persistConfig = {
  key: "root",
  storage,
  // version: 2, // bump this when your state shape changes
  // migrate: createMigrate(migrations, { debug: false }),
  whitelist: ["theme","auth"], // ✅ only persist non-sensitive UI state
  // blacklist:[]  // never persist...
};
const appReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: UnknownAction,
) => {
  if (action.type === RESET_APP) {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // redux-persist dispatches non-serializable actions internally
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
        ],
      },
    }),
});
store.subscribe(() => {
  const theme = store.getState().theme;
  document.documentElement.setAttribute("data-theme", theme);
});
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
