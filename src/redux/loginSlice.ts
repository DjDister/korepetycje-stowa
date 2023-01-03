import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'firebase/auth';

interface LoginSlice{
  isLoggedIn: boolean;
  user?: User;
}

const initialState : LoginSlice= {
  isLoggedIn:false,
  user: undefined,
}

export const loginSlice = createSlice({
  name: 'loginStatus',
  initialState,
  reducers: {
    logIn: (state,action : PayloadAction<User>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isLoggedIn=true;
      state.user=action.payload;
    },
    logOut: (state) => {
     state.isLoggedIn=false;
     state.user=undefined;
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { logIn,logOut } = loginSlice.actions

export default loginSlice.reducer