import { useEffect, Fragment, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classes from './CartButton.module.css';
import { uiActions } from '../../../../store/ui/ui-slice';
import CartModal from './CartModal';

function CartButton() {

  const cart = useSelector(store => store.cart);
  const showCart = useSelector(store => store.ui.showCart);
  const dispatch = useDispatch();
  const [playBumpAnimation, setPlayBumpAnimation] = useState(false);
  const cartButtonRef = useRef();

  useEffect(() => {
    if (!cart.items.length) return;
    setPlayBumpAnimation(true);
    const bumpTimer = setTimeout(() => setPlayBumpAnimation(false), 300);
    return () => clearTimeout(bumpTimer);
  }, [cart.items]);

  const toggleCartHandler = () => {
    if (showCart) cartButtonRef.current.focus();
    dispatch(uiActions.toggleCart());
  }

  return (
    <Fragment>
      {showCart && <CartModal onClose={toggleCartHandler} />}
      <button
        aria-label='open your cart'
        aria-haspopup='dialog'
        aria-expanded={showCart}
        className={`${classes.cart_button} ${playBumpAnimation ? classes.bump : ''}`}
        onClick={toggleCartHandler}
        ref={cartButtonRef}
      >
        <span className={classes.icon}>
          <svg width='1.5rem' height='1.5rem' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
            <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
          </svg>
        </span>
        <span className={classes.badge}>{cart.quantity}</span>
      </button>
    </Fragment>
  );
}

export default CartButton;