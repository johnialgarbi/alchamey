import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths"
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    federation({
      name: 'host',
      remotes: {
        products: {
          type: 'module',
          name: 'products',
          entry: 'http://localhost:3002/remoteEntry.js',
        }
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        '@chakra-ui/react': { singleton: true, requiredVersion: '^3.33.0' },
        '@emotion/react': { singleton: true, requiredVersion: '^11.14.0' },
      },
    }),
  ],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
  preview: { port: 3001 },
  build: { target: 'esnext' },
});
