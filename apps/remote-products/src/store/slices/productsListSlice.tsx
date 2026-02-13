import type { RootState } from '../store';
import type { ProductsFilterType, Product } from '../../types';
import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';

type ProductsListState = {
  products: Product[];
  filter: ProductsFilterType;
};

const initialState: ProductsListState = {
  products: [],
  filter: {
    search: '',
    category: 'all',
    sortByPrice: '',
    visibleCount: 20,
  },
};

const productsListSlice = createSlice({
  name: 'productsList',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setFilter: (state, action: PayloadAction<Partial<ProductsListState['filter']>>) => {
      state.filter = { ...state.filter, ...action.payload };
    },
  },
});

export default productsListSlice.reducer;
export const { setProducts, setFilter } = productsListSlice.actions;

const selectProducts = (state: RootState) => state.productsList.products;
const selectFilter = (state: RootState) => state.productsList.filter;

export const selectFilteredAndSortedProducts = createSelector(
  [selectProducts, selectFilter],
  (products, filter) => {
    const searchLower = filter.search.toLowerCase();
    const filtered = products.filter((p) => {
      if (filter.search && !p.name.toLowerCase().includes(searchLower)) return false;
      if (filter.category && filter.category !== 'all' && p.category !== filter.category) return false;
      return true;
    });
    if (!filter.sortByPrice) return filtered;
    return [...filtered].sort(
      (a, b) => (filter.sortByPrice === 'asc' ? 1 : -1) * (a.price - b.price)
    );
  }
);

export const selectVisibleProducts = createSelector(
  [selectFilteredAndSortedProducts, selectFilter],
  (filteredProducts, filter) => filteredProducts.slice(0, filter.visibleCount)
);

export const selectHasMoreProducts = createSelector(
  [selectFilteredAndSortedProducts, selectFilter],
  (filteredProducts, filter) => filter.visibleCount < filteredProducts.length
);

export const selectCategories = createSelector([selectProducts], (products) =>
  ['all', ...Array.from(new Set(products.map((p) => p.category)))]
);