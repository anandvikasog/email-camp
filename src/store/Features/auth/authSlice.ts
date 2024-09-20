import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
  email: '',
  emailVerified: false,
  firstName: '',
  lastName: '',
  mobile: '',
  profilePicture: '',
  _id: '',
  subscription: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logOut: () => {
      return { ...initialState };
    },

    logIn: (state, action) => {
      state.loggedIn = true;
      state.email = action.payload?.email || '';
      state.emailVerified = action.payload?.emailVerified || '';
      state.firstName = action.payload?.firstName || '';
      state.lastName = action.payload?.lastName || '';
      state.mobile = action.payload?.mobile || '';
      state.profilePicture = action.payload?.profilePicture || '';
      state._id = action.payload?._id || '';
      state.subscription = action.payload?.subscription || null;
    },
    updateData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { logIn, logOut, updateData } = authSlice.actions;

export default authSlice.reducer;
