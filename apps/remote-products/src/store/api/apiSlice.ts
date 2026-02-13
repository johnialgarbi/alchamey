import type { Product } from '../../types';
import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

const baseUrl = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? '';
const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 600;

const productsBaseQuery: BaseQueryFn<
  string | { url: string; method?: string; body?: unknown },
  Product[],
  { status?: number; data?: string }
> = async (arg) => {
  const url = typeof arg === 'string' ? arg : arg.url;
  const fullUrl = baseUrl ? baseUrl.replace(/\/$/, '') + url : url;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    let response: Response;
    try {
      response = await fetch(fullUrl, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return { error: { status: 0, data: message } };
    }

    if (!response.ok) {
      return { error: { status: response.status, data: `HTTP ${response.status}` } };
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      if (attempt < MAX_ATTEMPTS - 1) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }
      const text = await response.text();
      return {
        error: {
          status: response.status,
          data: `Expected JSON but got ${contentType || 'unknown'} (response may be HTML). ${text.slice(0, 50)}...`,
        },
      };
    }

    const data = await response.json();
    return { data };
  }

  return { error: { status: 0, data: 'Max retries exceeded' } };
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: productsBaseQuery,
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/api/products',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Products' as const, id })),
              { type: 'Products', id: 'LIST' },
            ]
          : [{ type: 'Products', id: 'LIST' }],
    }),
  }),
});

export const { useGetProductsQuery, useLazyGetProductsQuery } = apiSlice;
