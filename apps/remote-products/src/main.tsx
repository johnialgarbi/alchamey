import './msw/browser';
import theme from './styles/theme';
import { store } from './store/store';
import { Provider } from 'react-redux'
import ProductList from './ProductList';
import { createRoot } from 'react-dom/client';
import { Toaster } from './components/Toaster'
import { Box, ChakraProvider } from "@chakra-ui/react";

function DevPage() {
  return (
    <Provider store={store}>
      <ChakraProvider value={theme}>
        <Toaster />
        <Box
          width='100%'
          height='100%'
          margin='0 auto'
          padding='0 16px'
          maxWidth='1400px'
        >
          <ProductList featureFlags={{ showRatings: true }} />
        </Box>
      </ChakraProvider> 
    </Provider>
  );
}

createRoot(document.getElementById('root')!).render(<DevPage />);
