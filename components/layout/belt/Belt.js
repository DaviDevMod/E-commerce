import { useSession } from 'next-auth/client';
import { useSelector } from 'react-redux';
import Link from 'next/link';

import classes from './Belt.module.css';
import SearchBar from './search-bar/SearchBar';
import CartButton from './cart/CartButton';
import ProfileButton from './profile/ProfileButton';

function Belt() {

  const [session, loading] = useSession();
  const windowWidth = useSelector(store => store.ui.windowWidth);
  const isSmall = windowWidth < 768;

  return (
    <div className={classes.belt}>
      <Link role='banner' href='/'>
        <a className={classes.logo}>
          <span>Get</span>it
        </a>
      </Link>
      {!isSmall && <SearchBar />}
      <div className={classes.buttons}>
        {!session && !loading &&
          <Link href='/auth'>
            <a className={classes.buttons_login}>Sign in</a>
          </Link>
        }
        {session && <ProfileButton />}
        <CartButton />
      </div>
      {isSmall && (
        <>
          <hr />
          <SearchBar />
        </>
      )}
    </div>
  );
}

export default Belt;