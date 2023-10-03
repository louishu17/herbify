import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/styles/theme';
import { QueryClientProvider } from 'react-query';
import { QueryClient } from 'react-query';
export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
