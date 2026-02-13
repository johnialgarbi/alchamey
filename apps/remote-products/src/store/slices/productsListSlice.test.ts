import { describe, it, expect } from 'vitest';
import reducer, {
  setProducts,
  setFilter,
  selectFilteredAndSortedProducts,
  selectVisibleProducts,
  selectHasMoreProducts,
  selectCategories,
} from './productsListSlice';
import type { Product } from '../../types';
import type { RootState } from '../store';

const mockProducts: Product[] = [
  { id: '1', name: 'Alpha', price: 10, image: '', rating: 5, category: 'A', description: '' },
  { id: '2', name: 'Beta', price: 20, image: '', rating: 4, category: 'B', description: '' },
  { id: '3', name: 'Gamma', price: 15, image: '', rating: 3, category: 'A', description: '' },
];

function stateWith(products: Product[], filter = {}) {
  const base: RootState = {
    productsList: {
      products,
      filter: {
        search: '',
        category: 'all',
        sortByPrice: '',
        visibleCount: 20,
        ...filter,
      },
    },
    api: { queries: {}, mutations: {} },
  } as unknown as RootState;
  return base;
}

describe('productsListSlice', () => {
  describe('reducer', () => {
    it('sets products', () => {
      const state = reducer(undefined, setProducts(mockProducts));
      expect(state.products).toEqual(mockProducts);
    });

    it('updates filter with setFilter', () => {
      const initial = reducer(undefined, setProducts(mockProducts));
      const state = reducer(initial, setFilter({ category: 'A', search: 'Alpha' }));
      expect(state.filter.category).toBe('A');
      expect(state.filter.search).toBe('Alpha');
    });

    it('merges partial filter without wiping other fields', () => {
      const initial = reducer(undefined, setProducts(mockProducts));
      const withCategory = reducer(initial, setFilter({ category: 'A' }));
      const withSearch = reducer(withCategory, setFilter({ search: 'test' }));
      expect(withSearch.filter.category).toBe('A');
      expect(withSearch.filter.search).toBe('test');
    });
  });

  describe('selectors', () => {
    it('selectFilteredAndSortedProducts filters by search', () => {
      const state = stateWith(mockProducts, { search: 'Alpha' });
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Alpha');
    });

    it('selectFilteredAndSortedProducts filters by category', () => {
      const state = stateWith(mockProducts, { category: 'A' });
      const result = selectFilteredAndSortedProducts(state);
      expect(result).toHaveLength(2);
      expect(result.every((p) => p.category === 'A')).toBe(true);
    });

    it('selectFilteredAndSortedProducts sorts by price asc', () => {
      const state = stateWith(mockProducts, { sortByPrice: 'asc' });
      const result = selectFilteredAndSortedProducts(state);
      expect(result.map((p) => p.price)).toEqual([10, 15, 20]);
    });

    it('selectFilteredAndSortedProducts sorts by price desc', () => {
      const state = stateWith(mockProducts, { sortByPrice: 'desc' });
      const result = selectFilteredAndSortedProducts(state);
      expect(result.map((p) => p.price)).toEqual([20, 15, 10]);
    });

    it('selectVisibleProducts slices by visibleCount', () => {
      const state = stateWith(mockProducts, { visibleCount: 2 });
      const result = selectVisibleProducts(state);
      expect(result).toHaveLength(2);
    });

    it('selectHasMoreProducts is true when more items exist', () => {
      const state = stateWith(mockProducts, { visibleCount: 2 });
      expect(selectHasMoreProducts(state)).toBe(true);
    });

    it('selectHasMoreProducts is false when all visible', () => {
      const state = stateWith(mockProducts, { visibleCount: 10 });
      expect(selectHasMoreProducts(state)).toBe(false);
    });

    it('selectCategories returns all plus "all"', () => {
      const state = stateWith(mockProducts);
      const categories = selectCategories(state);
      expect(categories).toContain('all');
      expect(categories).toContain('A');
      expect(categories).toContain('B');
      expect(categories).toHaveLength(3);
    });
  });
});
