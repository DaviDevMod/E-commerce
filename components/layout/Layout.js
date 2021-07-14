import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import Head from 'next/head';

import { initializeCart } from '../../store/cart/cart-actions';
import LoadingSpinner from '../UI/loading-spinner/LoadingSpinner';
import Belt from './belt/Belt';
import MainNavigation from './main-navigation/MainNavigation';
import Notification from '../UI/notification/Notification';
import { uiActions } from '../../store/ui/ui-slice';

function Layout(props) {

  const [session, loading] = useSession();
  const notification = useSelector(store => store.ui.notification);
  const cart = useSelector(store => store.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  // cart initialization after every page reload
  useEffect(() => {
    if (!loading) dispatch(initializeCart(session?.user?.email));
  }, [session, loading]);

  // saving the cart to either a database or the local storage every time
  // the page content becomes hidden to the user (this includes page reloads)
  useEffect(() => {
    const saveCart = () => {
      try {
        if (!cart.noNeedToSave && document.visibilityState === 'hidden') {
          if (session) {
            const response = navigator.sendBeacon('/api/user/cart/',
              JSON.stringify({
                email: session.user.email,
                cart,
              })
            );
            if (!response) throw new Error('The cart failed to reach our server.');
          }
          else cart.quantity && localStorage.setItem('cart', JSON.stringify(cart));
        }
      } catch (e) { console.log(e); }
    };
    document.addEventListener('visibilitychange', saveCart);
    return () => document.removeEventListener('visibilitychange', saveCart);
  }, [cart, session]);

  // dispatch current window width every time it changes
  useEffect(() => {
    const updateWidth = () => dispatch(uiActions.acknowledgeWindowWidth({ windowWidth: window.innerWidth }));
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // clean up notification when user navigates to a different page
  useEffect(() => {
    notification && dispatch(uiActions.notify({ notification: null }));
  }, [router.asPath])

  if (loading) return <LoadingSpinner />

  return (
    <Fragment>
      <Head>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <header>
        <Belt />
        <MainNavigation />
      </header>
      <main>
        {notification && <Notification {...notification} />}
        {props.children}
      </main>
    </Fragment>
  );
}

export default Layout;