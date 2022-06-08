import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Script
        src='https://www.googletagmanager.com/gtag/js?id=G-5MYBR7GDLZ'
        strategy='afterInteractive'
      />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5MYBR7GDLZ');
          `}
      </Script>
      <Component {...pageProps} />
    </div>
  );
}
export default MyApp;
