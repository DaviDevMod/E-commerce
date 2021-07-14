import { connectToDb, generateQueryString } from '../../lib/db';
import { Fragment } from 'react';
import Head from 'next/head';

import ProductOutline from '../../components/catalogue/search/ProductOutline';
import Alert from '../../components/UI/alert/Alert';

function SearchResultsPage(props) {

  if (props.error) return <Alert error={props.error} />

  if (!props.result.length) return <h1>No Match found</h1>

  const productsList = props.result.map(x =>
    <ProductOutline key={x._id} id={x._id} name={x.Description} price={x.UnitPrice} />
  );

  return (
    <Fragment>
      <Head>
        <title>{`Search results for ${props.query}`}</title>
        <meta
          name='description'
          content={`Here you can find the best ${props.query} on the web`}
        />
      </Head>
      <div>
        <h1>Search Results</h1>
        {productsList}
      </div>
    </Fragment>
  );
}

export async function getServerSideProps(context) {

  const client = await connectToDb();

  if (!client) return { props: { error: 'The server could not fulfill the request. Please try again.' } };

  const queryString = generateQueryString(context.params.search);

  const stockCollection = client.db().collection('stock');

  await stockCollection.createIndex({ Description: 'text' });

  const searchResult = await stockCollection.find(
    { $text: { $search: queryString } },
    { projection: { Description: 1, UnitPrice: 1, score: { $meta: 'textScore' } } }
  ).sort({ score: { $meta: 'textScore' } }).limit(20);

  const searchResultArray = await searchResult.toArray();

  await searchResult.close();

  const result = searchResultArray.map(x => ({ ...x, _id: x._id.toString() }));

  return { props: { result, query: context.params.search } };
}

export default SearchResultsPage;