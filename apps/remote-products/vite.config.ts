import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from "vite-tsconfig-paths"
import { federation } from '@module-federation/vite';
import { generateProducts } from './src/api/mockProducts';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    {
      name: 'api-products',
      enforce: 'pre',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const pathname = req.url?.replace(/\?.*$/, '') ?? '';
          if (pathname !== '/api/products' || req.method !== 'GET') {
            next();
            return;
          }
          try {
            const data = generateProducts(2000);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            setTimeout(() => {
              res.end(JSON.stringify(data));
            }, 2000);
          } catch (err) {
            console.error('[api-products]', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      },
    },
    federation({
      name: 'products',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/ProductListFederated.tsx',
      },
      library: { type: 'module' },
      shared: {
        react: { singleton: true, requiredVersion: '^19.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.0.0' },
        '@chakra-ui/react': { singleton: true, requiredVersion: '^3.33.0' },
        '@emotion/react': { singleton: true, requiredVersion: '^11.14.0' },
      },
    }),
  ],
  server: {
    port: 3002,
  },
  preview: { port: 3002 },
  build: { target: 'esnext' },
});
