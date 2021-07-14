import { configureStore } from '@reduxjs/toolkit';

import cart from './cart/cart-slice';
import ui from './ui/ui-slice';

const store = configureStore({
  reducer: {
    cart,
    ui,
  }
});

export default store;