import "reflect-metadata";

import theme, { createEmotionCache } from "@/config/theme";
import { CacheProvider } from "@emotion/react";
import { EmotionCache } from "@emotion/cache";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "@/components/layout";
import { AuthProvider } from "@/context/AuthContext";
import { WebsocketProvider } from "@/context/WebsocketContext";
import { NavBarProvider } from "@/context/NavbarContext";
import Head from "next/head";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface AppPropsWithCache extends AppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: AppPropsWithCache) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Chat application</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <NavBarProvider>
            <WebsocketProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </WebsocketProvider>
          </NavBarProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
