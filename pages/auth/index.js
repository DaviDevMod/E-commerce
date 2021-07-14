import { getSession } from 'next-auth/client';
import { Fragment, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Head from 'next/head';

import { uiActions } from '../../store/ui/ui-slice';
import AuthForm from '../../components/auth/AuthForm';

const toNotify = {
  new: {
    status: 'success',
    title: 'Account created!',
    message: 'You can now log in',
  },
  cp: {
    status: 'success',
    title: 'Password successfully updated!',
    message: 'You can log in with your new password',
  }
}

function AuthPage() {

  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiActions.notify({ notification: toNotify[router.query.new] || toNotify[router.query.cp] || null }));
  }, [])

  return (
    <Fragment>
      <Head>
        <title>Authenticate yourself</title>
        <meta
          name='description'
          content='Take your first step into a wonderful world of amazing products! Sign in now and enjoy our services.'
        />
      </Head>
      <AuthForm />
    </Fragment>
  );
}

export async function getServerSideProps(context) {

  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/profile',
        permanent: false,
      }
    };
  }
  else {
    return { props: { session } };
  }
}

export default AuthPage;