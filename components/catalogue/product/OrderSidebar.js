import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';

import classes from './OrderSidebar.module.css';
import { cartActions } from '../../../store/cart/cart-slice';

const date = new Date();
const today = date.getDay();
const wait = today === 4 || today === 5 ? 8 - today : 2;
const theDayAfterTomorrowButNotSatNorSun = new Date(date.setDate(date.getDate() + wait))
  .toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

function OrderSidebar(props) {

  const [quantityState, setQuantityState] = useState('1');
  const dispatch = useDispatch();

  const changeQuantityHandler = event => setQuantityState(event.target.value);

  const orderHandler = () => {
    dispatch(cartActions.addItem({
      id: props.id,
      name: props.name,
      price: props.price,
      quantity: +quantityState,
    }));
  };

  return (
    <Fragment>
      <h2>Order Now</h2>
      <div className={classes.order_info}>
        <span className={classes.price}>£{props.price}</span>
        <p><span className={classes.blue}> Free return</span> within 30 days</p>
        <p className={classes.blue}>Free delivery</p>
        <p>Get it by <span className={classes.date}>{theDayAfterTomorrowButNotSatNorSun}</span></p>
      </div>
      <hr style={{ border: 'none' }} />
      <div className={classes.order_quantity}>
        <p className={classes.green}>In Stock.</p>
        <label htmlFor="quantity">Quantity: </label>
        <select name="quantity" id="quantity" value={quantityState} onChange={changeQuantityHandler}>
          <option value="1" >1</option>
          <option value="2" >2</option>
          <option value="3" >3</option>
          <option value="4" >4</option>
          <option value="5" >5</option>
          <option value="6" >6</option>
          <option value="7" >7</option>
          <option value="8" >8</option>
          <option value="9" >9</option>
          <option value="10" >10</option>
        </select>
      </div>
      <button className={classes.order_button} onClick={orderHandler}>Add to cart</button>
    </Fragment>
  );
}

export default OrderSidebar;