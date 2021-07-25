import { useState } from 'react';
import { useSelector } from 'react-redux';

import { getCartFromDb, sendCartToDb, mergeTwoCarts } from '../lib/cart';

// this hook is used only after a successful 'pre-log-in' in AuthForm.js
// once the hook `status` becomes `DONE`, the user is actually logged in

// possible action: 'FINDOUT', 'MERGE', 'DB', 'REDUX', 'ABORT'
// possible status: '', 'ASKING', 'DONE', 'ABORTED', ('ERROR: ' + someErrorMessage)
function useCartDestiny() {

  const [status, setStatus] = useState('');
  const [dbCart, setDbCart] = useState({});
  const reduxCart = useSelector(store => store.cart);

  const decideCartDestiny = async (email, password, action) => {
    try {
      if (action === 'FINDOUT') {
        const cart = await getCartFromDb(email, password);
        if (cart.quantity) {
          if (reduxCart.quantity) {
            setDbCart(cart);
            setStatus('ASKING');
            return;
          }
        }
        else if (reduxCart.quantity) await sendCartToDb(email, password, reduxCart);
      }
      else if (action === 'REDUX') await sendCartToDb(email, password, reduxCart);
      else if (action === 'MERGE') await sendCartToDb(email, password, mergeTwoCarts(dbCart, reduxCart));
      else if (action === 'ABORT') {
        setStatus('ABORTED');
        return;
      }
      localStorage.removeItem('cart');
      setStatus('DONE');
    } catch (e) {
      setStatus('ERROR: ' + e.message);
    }
  };

  return [status, decideCartDestiny];
};

export default useCartDestiny;