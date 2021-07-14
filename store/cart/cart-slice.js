import { createSlice } from '@reduxjs/toolkit';

// each item is of the form:
// {
//   id: String,
//   name: String,
//   price: Number,
//   quantity: Number,
// }

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    replaceCart(state, action) { return action.payload; },
    addItem(state, action) {
      const actionQty = action.payload.quantity;
      const index = state.items.findIndex(item => item.id === action.payload.id);

      if (index !== -1) state.items[index].quantity += actionQty;
      else state.items.push(action.payload);

      state.quantity += actionQty;
      state.total += actionQty * action.payload.price;
    },
    removeItem(state, action) {
      const index = state.items.findIndex(item => item.id === action.payload.id);

      if (state.items[index].quantity > 1) state.items[index].quantity--;
      else state.items = state.items.filter(item => item.id !== action.payload.id);

      if (--state.quantity) state.total -= action.payload.price;
      else state.total = 0; // remove any cumulative error due to floating point arithmetic
    },
    // the `noNeedToSave` property exists only for a fraction of a second,
    // before logging in and sometimes before logging out. It is used to
    // prevent `saveCart`(in Layout.js) from running when there is no need to
    noNeedToSave(state) { state.noNeedToSave = true },
  }
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;