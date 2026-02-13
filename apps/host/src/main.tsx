import { createRoot } from 'react-dom/client';
import TopNavigation from './components/TopNavigation';
import MainContainer from './components/MainContainer';
import { lazy, Suspense, Component, type ReactNode } from 'react';
import type { ProductListFeatureFlags } from 'products/ProductList';
import { ChakraProvider, defaultSystem, Box, Spinner, Center, Text } from '@chakra-ui/react';

const ProductList = lazy(() => import('products/ProductList'));

const featureFlags: ProductListFeatureFlags = { showRatings: true };

class RemoteBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <Center flexDirection="column" gap="2" p="4" minHeight="120px">
          <Text color="red.600" fontWeight="semibold" fontSize="sm">
            Products failed to load
          </Text>
          <Text fontSize="xs" color="gray.600">
            {this.state.error.message}
          </Text>
        </Center>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Box width="100%" height="100%">
        <TopNavigation />
        <MainContainer pt="72px">
          <RemoteBoundary>
            <Suspense
              fallback={
                <Center height="200px">
                  <Spinner size="xl" />
                </Center>
              }
            >
              <ProductList featureFlags={featureFlags} />
            </Suspense>
          </RemoteBoundary>
        </MainContainer>
      </Box>
    </ChakraProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
