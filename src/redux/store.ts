import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./loginSlice";
import profileSlice from "./profileSlice";

class StateLoader {
  loadState() {
    try {
      let serializedState = localStorage.getItem("http://localhost:state");

      if (serializedState === null) {
        return this.initializeState();
      }

      return JSON.parse(serializedState);
    } catch (err) {
      console.log(err);
      return this.initializeState();
    }
  }

  saveState(state: any) {
    try {
      let serializedState = JSON.stringify(state);

      localStorage.setItem("http://localhost:state", serializedState);
    } catch (err) {}
  }

  initializeState() {
    return {};
  }
}

const stateLoader = new StateLoader();

const store = configureStore({
  reducer: {
    loginStatus: loginSlice,
    profile: profileSlice,
  },
  preloadedState: stateLoader.loadState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["proffile/setUserProfile"],
        ignoredActionPaths: [
          "payload.createdAt",
          "payload.user.proactiveRefresh",
          "payload.user.auth",
          "payload.user.stsTokenManager",
          "payload.user.metadata",
        ],
        ignoredPaths: [
          "profile.profile.createdAt",
          "profile.profile.proactiveRefresh",
          "profile.profile.auth",
          "profile.profile.stsTokenManager",
          "profile.profile.metadata",
        ],
      },
    }),
});

store.subscribe(() => {
  stateLoader.saveState(store.getState());
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
