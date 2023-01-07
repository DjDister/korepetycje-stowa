import { configureStore } from "@reduxjs/toolkit";
import { query, collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
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
});

store.subscribe(() => {
  stateLoader.saveState(store.getState());
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
