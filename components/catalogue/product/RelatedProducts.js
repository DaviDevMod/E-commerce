import { Fragment } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'
import Image from 'next/image';

import classes from './RelatedProducts.module.css';

function RelatedProducts(props) {

  const router = useRouter();

  return (
    <Fragment>
      <h3>Related Products</h3>
      <ul className={classes.products}>
        {props.relatedProducts.map(x => (
          <li key={x.id} className={classes.related_product} onClick={() => router.push('/product/' + x.id)}>
            <h4>
              <Link href={'/product/' + x.id}>
                {x.name}
              </Link>
            </h4>
            <Image
              src='/images/dane-deaner-j5asemKMmQY-unsplash.jpg'
              alt='A colorful snowboard on the snow'
              width={300}
              height={300}
            />
          </li>
        ))}
      </ul>
    </Fragment>
  );
}

export default RelatedProducts;