import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';

import classes from './ProductOutline.module.css';

function ProductOutline(props) {

  const router = useRouter();
  const windowWidth = useSelector(store => store.ui.windowWidth);
  const isSmall = windowWidth < 768;

  const clickHandler = () => router.push('/product/' + props.id);

  const name = (
    <h2 key='nm' className={classes.product_name}>
      <Link href={'/product/' + props.id}>
        {props.name}
      </Link>
    </h2>
  );

  const price = <span key='prc' className={classes.product_price}>£{props.price.toFixed(2)}</span>

  const image = (
    <div key='mg' className={classes.product_image} onClick={clickHandler}>
      <Image
        src='/images/dane-deaner-j5asemKMmQY-unsplash.jpg'
        alt='A colorful snowboard on the snow'
        width={900}
        height={900}
      />
    </div>
  );

  const description = <p key='dscrptn' className={classes.product_description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

  const article = (
    <article className={classes.article}>
      {isSmall ? [name, price, image] : [name, price, description]}
    </article>
  );

  return (
    <section className={'card ' + classes.product_outline}>
      {!isSmall && image}
      {article}
    </section >
  );
}
export default ProductOutline;