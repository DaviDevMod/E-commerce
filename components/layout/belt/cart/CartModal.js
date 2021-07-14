import { useSelector } from 'react-redux';

import classes from './CartModal.module.css';
import Modal from '../../../UI/modal/Modal';
import CartItems from './CartItems';
import useTrapFocus from '../../../../hooks/use-trap-focus';

function CartModal(props) {

  const cart = useSelector(store => store.cart);
  const setUntrapRef = useTrapFocus();

  if (!cart.quantity) return (
    <Modal onClose={props.onClose}>
      <p className={classes.empty_cart}>
        Your cart is empty!
      </p>
    </Modal>
  );

  return (
    <Modal onClose={props.onClose}>
      <div className={classes.cart}>
        <h1 >Shopping Cart</h1>
        <CartItems />
        <div className={classes.total}>
          Total ({cart.quantity} items): <span aria-label='Total price'>£{cart.total.toFixed(2)}</span>
        </div>
        <div className={classes.actions}>
          <button aria-label='close cart' ref={setUntrapRef} onClick={props.onClose}>
            Close
          </button>
          <button aria-label='place order' onClick={() => { }}>
            Order
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CartModal;