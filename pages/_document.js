import Document, { Head, Html, Main, NextScript } from "next/document";

class SampleDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html
        style={{
          backgroundColor: "#F0EDD1",
          width: "100%",
          height: "100vh",
        }}
      >
        <Head>
          <link rel="dns-prefetch" href="//www.google.co.jp" />
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
