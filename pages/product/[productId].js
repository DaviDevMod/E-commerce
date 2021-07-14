import { ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

import { connectToDb, generateQueryString } from '../../lib/db';
import Product from '../../components/catalogue/product/Product';
import Alert from '../../components/UI/alert/Alert';

function ProductPage(props) {

  if (props.error) return <Alert error={props.error} />

  return (
    <Fragment>
      <Head>
        <title>{props.product.Description}</title>
        <meta
          name='description'
          content={`The best ${props.product.Description} money can buy`}
        />
      </Head>
      <Product
        id={props.product.id}
        name={props.product.Description}
        price={props.product.UnitPrice}
        relatedProducts={props.relatedProducts}
      />
    </Fragment>
  );
}

export async function getServerSideProps(context) {

  const client = await connectToDb();

  if (!client) return { props: { error: 'The server could not fulfill the request. Please try again.' } };

  const { productId } = context.params;
  const stockCollection = client.db().collection('stock');

  const product = await stockCollection.findOne(
    { _id: ObjectId(productId) },
    { projection: { _id: 0, Description: 1, UnitPrice: 1 } }
  );

  if (!product) return { notFound: true };

  product.id = productId;

  const queryString = generateQueryString(product.Description);

  await stockCollection.createIndex({ Description: 'text' });

  const related = await stockCollection.find(
    { $text: { $search: queryString } },
    { projection: { Description: 1, score: { $meta: 'textScore' } } }
  ).sort({ score: { $meta: 'textScore' } }
  ).limit(6);

  const relatedArray = await related.toArray();

  await related.close();

  // return always five related products with `_id: ObjectId` mapped to `id: String`
  // and filter the main product in the case it was among the related ones
  let relatedProducts = [];
  for (let n = 0, i = 0; n < 5; i++) {
    const id = relatedArray[i]._id.toString();
    id !== productId && ++n && relatedProducts.push({ id, name: relatedArray[i].Description, });
  }

  return { props: { product, relatedProducts } };
}

export default ProductPage;