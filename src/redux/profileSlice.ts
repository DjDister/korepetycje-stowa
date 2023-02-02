import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Student, UserProfileData } from "../types";

interface ProfileSlice {
  profile: UserProfileData;
}

const initialState: ProfileSlice = {
  profile: {
    uid: "",
    students: [],
    email: "",
    displayName: "",
    emailVerified: false,
    isAnonymous: false,
    type: "student",
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
    createdAt: { seconds: 0, nanoseconds: 0 } as Timestamp,
    subjects: [],
  },
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserProfileFirstTime: (
      state,
      action: PayloadAction<{ user: User; type: "student" | "teacher" }>
    ) => {
      state.profile = {
        ...action.payload.user,
        type: action.payload.type,
        students: [],
        email: action.payload.user.email || "",
        displayName:
          action.payload.user.displayName || action.payload.user.email || "",
        createdAt: {
          seconds: new Date().getTime() / 1000,
          nanoseconds: 0,
        } as Timestamp,
        phoneNumber: action.payload.user.phoneNumber || "",
        subjects: [],
      };
    },
    updateDisplayName: (state, action: PayloadAction<string>) => {
      state.profile.displayName = action.payload;
    },
    updatePhoneNumber: (state, action: PayloadAction<string>) => {
      state.profile.phoneNumber = action.payload;
    },
    updateSubjects: (state, action: PayloadAction<string[]>) => {
      state.profile.subjects = action.payload;
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
  updateDisplayName,
  updatePhoneNumber,
  updateSubjects,
} = profileSlice.actions;

export default profileSlice.reducer;
