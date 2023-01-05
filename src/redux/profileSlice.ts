import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserProfileData } from "../types";

interface ProfileSlice {
  profile: UserProfileData;
}

const initialState: ProfileSlice = {
  profile: {
    students: [],
    email: "",
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = profileSlice.actions;

export default profileSlice.reducer;
