import { Provider as AuthProvider } from 'next-auth/client';
import { Provider as ReduxProvider } from 'react-redux';

import '../styles/globals.css';
import store from '../store/index';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <ReduxProvider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ReduxProvider>
    </AuthProvider>
  );
}

export default MyApp
