import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: false,
};

export const toggleSlice = createSlice({
  name: 'isLogin',
  initialState,
  reducers: {
    setIsLoginPage: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setIsLoginPage } = toggleSlice.actions;

export default toggleSlice.reducer;
