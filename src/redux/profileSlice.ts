import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { Student, UserProfileData } from "../types";

interface ProfileSlice {
  profile: UserProfileData;
}

const initialState: ProfileSlice = {
  profile: {
    uid: "",
    students: [],
    email: "",
    emailVerified: false,
    isAnonymous: false,

    providerData: [
      {
        providerId: "",
        uid: "",
        displayName: null,
        email: "",
        photoURL: null,
        phoneNumber: null,
      },
    ],
    refreshToken: "",
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserProfileFirstTime: (state, action: PayloadAction<User>) => {
      state.profile = {
        ...action.payload,
        students: [],
        email: action.payload.email || "",
      };
    },
    setUserProfile: (state, action: PayloadAction<UserProfileData>) => {
      state.profile = action.payload;
    },
    updateStudents: (state, action: PayloadAction<Student[]>) => {
      state.profile.students = action.payload;
    },
    addStudents: (state, action: PayloadAction<Student[]>) => {
      state.profile.students = [...state.profile.students, ...action.payload];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUserProfileFirstTime,
  setUserProfile,
  updateStudents,
  addStudents,
} = profileSlice.actions;

export default profileSlice.reducer;
