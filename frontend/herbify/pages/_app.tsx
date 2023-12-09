import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/styles/theme';
import { QueryClientProvider } from 'react-query';
import {persistQueryClient} from 'react-query/persistQueryClient-experimental';
import {ReactQueryDevtools} from "react-query/devtools";
import {createWebStoragePersistor} from "react-query/createWebStoragePersistor-experimental";
import { QueryClient } from 'react-query';
import { AnimatePresence } from 'framer-motion';
import 'typeface-roboto';


export default function App({ Component, pageProps, router }: AppProps) {
  const queryClient = new QueryClient();
  /*
  if (typeof localStorage !== 'undefined'){
    const localStoragePersistor = createWebStoragePersistor({
      storage : localStorage
    });
    persistQueryClient({
      queryClient : queryClient,
      persistor : localStoragePersistor,
  
    })
  }*/
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* <AnimatePresence mode="wait"> */}
          {/* Add 'key' prop to enable correct re-rendering during route changes */}
          <Component {...pageProps} key={router.route} />
        {/* </AnimatePresence> */}
        <ReactQueryDevtools />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
