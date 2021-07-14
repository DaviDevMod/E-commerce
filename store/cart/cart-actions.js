import { getCartFromDb } from '../../lib/cart';
import { cartActions } from './cart-slice';
import { uiActions } from '../ui/ui-slice';

export function initializeCart(email) {
  return async dispatch => {
    try {
      if (email) {
        const cart = await getCartFromDb(email);
        cart.quantity && dispatch(cartActions.replaceCart(cart));
      }
      else {
        const lSCart = JSON.parse(localStorage.getItem('cart'));
        lSCart?.quantity && dispatch(cartActions.replaceCart(lSCart));
      }
    } catch (e) {
      dispatch(uiActions.notify({
        notification: {
          status: 'error',
          title: "Something went wrong while loading your cart",
          message: 'Try to reload the page or add a product to solve the issue.',
        }
      }));
      console.log('While initializing cart:\n', e);
    }
  };
}