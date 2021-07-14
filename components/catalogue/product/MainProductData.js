import { Fragment } from "react";
import { useSelector } from 'react-redux';
import Image from 'next/image';

import classes from './MainProductData.module.css';

function MainProductData(props) {

  const windowWidth = useSelector(store => store.ui.windowWidth);
  const isSmall = windowWidth < 768;

  const name = <h1>{props.name}</h1>

  const price = <span className={classes.price}>£{props.price.toFixed(2)}</span>

  const description = <p className={classes.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

  const image = (
    <div className={classes.image}>
      <Image
        src='/images/dane-deaner-j5asemKMmQY-unsplash.jpg'
        alt='A colorful snowboard on the snow'
        width={900}
        height={900}
      />
    </div>
  );

  return (
    <Fragment>
      {isSmall ? (
        <>
          {name}
          {price}
          {image}
          {description}
        </>
      ) : (
        <>
          {image}
          < section className={classes.info} >
            {name}
            {price}
            {description}
          </section>
        </>
      )}
    </Fragment >
  );
}

export default MainProductData;