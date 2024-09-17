import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loggedIn: false,
  email: '',
  id: '',
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
      state.id = action.payload?.id || '';
    },
    updateData: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { logIn, logOut, updateData } = authSlice.actions;

export default authSlice.reducer;
