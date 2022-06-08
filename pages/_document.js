import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ga_id } from '../lib/gtag';

class SampleDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html
        style={{
          backgroundColor: '#F0EDD1',
          width: '100%',
          height: '100vh',
        }}
      >
        <Head>
          <link rel='dns-prefetch' href='//www.google.co.jp' />
          {ga_id && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${ga_id}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
        `,
                }}
              />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default SampleDocument;
