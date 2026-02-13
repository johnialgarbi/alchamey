import theme from './styles/theme';
import { store } from './store/store';
import { Provider } from 'react-redux';
import ProductList from './ProductList';
import { ChakraProvider } from '@chakra-ui/react';

type FeatureFlags = { showRatings?: boolean };

type Props = {
  featureFlags?: FeatureFlags;
};

// Federated entry for ProductList. Wraps with Redux + Chakra theme so the host
export default function ProductListFederated({ featureFlags }: Props) {
  return (
    <ChakraProvider value={theme}>
      <Provider store={store}>
        <ProductList featureFlags={featureFlags} />
      </Provider>
    </ChakraProvider>
  );
}
