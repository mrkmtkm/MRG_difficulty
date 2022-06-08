import Head from 'next/head';
import Link from 'next/link';
import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GA_TRACKING_ID, pageview } from 'lib/gtag';
function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    if (!GA_TRACKING_ID) return;

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
