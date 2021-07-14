import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import classes from './CartItems.module.css';
import { cartActions } from '../../../../store/cart/cart-slice';

function CartItems(props) {

  const items = useSelector(store => store.cart.items);
  const dispatch = useDispatch();

  return (
    <ul className={classes.cart_items}>
      {items.map(item => {
        const { id, name, price, quantity } = item;
        return (
          <li key={id} className={classes.item}>
            <div className={classes.item_summary}>
              <h2 aria-label='product name'>{name}</h2>
              <span aria-label='price'>£{price}</span>
            </div>
            <div className={classes.item_order}>
              <span aria-label='quantity'>x {quantity}</span>
              <div>
                <button aria-label='remove item' onClick={() => dispatch(cartActions.removeItem({ id, price }))}>-</button>
                <button aria-label='add item' onClick={() => dispatch(cartActions.addItem({ id, name, price, quantity: 1 }))}>+</button>
              </div>
            </div>
          </li>
        );
      })}
    </ul >
  );
}

export default CartItems;