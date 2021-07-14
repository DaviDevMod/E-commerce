import Link from 'next/link';

import classes from './MainNavigation.module.css';

function MainNavigation() {

  return (
    <nav role='navigation' className={classes.main_nav}>
      <ul>
        <li>
          <Link href='/sport'>Sport</Link>
        </li>
        <li>
          <Link href='/clothes'>Clothes</Link>
        </li>
        <li>
          <Link href='/books'>Books</Link>
        </li>
        <li>
          <Link href='/electronics'>Electronics</Link>
        </li>
      </ul>
    </nav>
  );
}

export default MainNavigation;