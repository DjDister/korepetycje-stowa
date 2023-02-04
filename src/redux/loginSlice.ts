import { createSlice } from "@reduxjs/toolkit";

interface UserInfo {
  email: string;
  displayName: string;
  uid: string;
}
interface LoginSlice {
  isLoggedIn: boolean;
  user: UserInfo | null;
  error: string | null;
  loading: boolean;
}

const initialState: LoginSlice = {
  isLoggedIn: false,

  loading: false,
  user: null,
  error: null,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    startLogin: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.error = null;
      state.isLoggedIn = true;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
});

export const { startLogin, loginSuccess, loginFailure, logOut } =
  loginSlice.actions;

export default loginSlice.reducer;
