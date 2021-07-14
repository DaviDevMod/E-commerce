import { getSession } from 'next-auth/client';
import { Fragment } from 'react';
import Head from 'next/head';

import ChangePassword from '../../components/profile/ChangePassword';

function ChangePasswordPage() {

  return (
    <Fragment>
      <Head>
        <title>Change password</title>
        <meta
          name='description'
          content='Change your GetIt password here'
        />
      </Head>
      <ChangePassword />
    </Fragment>
  );
}

export async function getServerSideProps(context) {

  const session = await getSession({ req: context.req });

  if (session) {
    return { props: { session } };
  }
  else {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    };
  }
}

export default ChangePasswordPage;