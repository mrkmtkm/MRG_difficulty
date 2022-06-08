import Head from 'next/head';
import Link from 'next/link';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ga_id, pageview } from '../lib/gtag';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    if (!ga_id) return;

    const handleRouteChange = (url) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  return (
    <div>
      <Head></Head>
      <Component {...pageProps} />
    </div>
  );
}
export default MyApp;
