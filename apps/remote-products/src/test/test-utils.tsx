import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import theme from '../styles/theme';
import { ChakraProvider } from '@chakra-ui/react';

function AllTheProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ChakraProvider value={theme}>{children}</ChakraProvider>
    </Provider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
}

export { customRender as render };
