import { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signOut, useSession } from 'next-auth/client';
import Link from 'next/link';

import classes from './ProfileMenu.module.css';
import LoadingSpinner from '../../../UI/loading-spinner/LoadingSpinner';
import { cartActions } from '../../../../store/cart/cart-slice';
import { sendCartToDb } from '../../../../lib/cart';

function ProfileMenu(props) {

  const [isLoading, setIsLoading] = useState(false);
  const cart = useSelector(store => store.cart);
  const session = useSession()[0];
  const dispatch = useDispatch();

  const logOutHandler = async () => {
    setIsLoading(true);
    // can't leave the job to `sendBeacon` in Layout.js because by the time
    // the request arrives to the server the user will be logged out
    // and 'api/user/cart' will forbid access to the cart
    await sendCartToDb(session.user.email, null, cart);
    dispatch(cartActions.noNeedToSave());
    signOut({ callbackUrl: '/auth' });
  }

  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      <ul
        role='menu'
        aria-label='profile menu'
        className={classes['profile_nav' + (props.display ? '' : '--hide')]}
      >
        <li>
          <Link href='/profile'>
            <a role='menuitem'>Profile</a>
          </Link>
        </li>
        <li>
          <button role='menuitem' onClick={logOutHandler}>Log Out</button>
        </li>
        <li>
          <Link href='/profile/change-password'>
            <a role='menuitem'>Change Password</a>
          </Link>
        </li>
      </ul>
    </Fragment>
  );
}

export default ProfileMenu;