import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Link to the manifest.json file */}
        <link rel="manifest" href="/manifest.json" />
        {/* Set the theme color for the app */}
        <meta name="theme-color" content="#000000" />
        {/* Add other meta tags or links if needed */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}