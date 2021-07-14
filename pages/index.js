import { Fragment } from 'react';
import Head from 'next/head';

import Home from '../components/home/Home';

function HomePage() {

  return (
    <Fragment>
      <Head>
        <title>Home Page</title>
        <meta
          name='description'
          content='Fancy that new thing? Get It now!'
        />
      </Head>
      <Home />
    </Fragment>
  );
}

export default HomePage;