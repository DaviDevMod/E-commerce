import { getSession } from 'next-auth/client';
import { Fragment } from 'react';
import Head from 'next/head';

import Profile from '../../components/profile/Profile';

function ProfilePage() {

  return (
    <Fragment>
      <Head>
        <title>Profile Page</title>
        <meta
          name='description'
          content='Manage your profile from here'
        />
      </Head>
      <Profile />
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

export default ProfilePage;