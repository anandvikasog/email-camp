import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
  email: '',
  emailVerified: null,
  firstName: '',
  lastName: '',
  mobile: '',
  countryCode: '',
  profilePicture: '',
  gender: '',
  companyName: '',
  about: '',
  createdAt: '',
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
      state.emailVerified = action.payload?.emailVerified || false;
      state.firstName = action.payload?.firstName || '';
      state.lastName = action.payload?.lastName || '';
      state.mobile = action.payload?.mobile || '';
      state.countryCode = action.payload?.countryCode || '';
      state.profilePicture = action.payload?.profilePicture || '';
      state.gender = action.payload?.gender || '';
      state.companyName = action.payload?.companyName || '';
      state.about = action.payload?.about || '';
      state._id = action.payload?._id || '';
      state.subscription = action.payload?.subscription || null;
      state.createdAt = action.payload?.createdAt || '';
    },
    updateData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { logIn, logOut, updateData } = authSlice.actions;

export default authSlice.reducer;
