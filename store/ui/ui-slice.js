import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    notification: null,
    showCart: false,
    windowWidth: 0,
  },
  reducers: {
    notify(state, action) { state.notification = action.payload.notification; },
    toggleCart(state) { state.showCart = !state.showCart; },
    acknowledgeWindowWidth(state, action) { state.windowWidth = action.payload.windowWidth; },
  }
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
