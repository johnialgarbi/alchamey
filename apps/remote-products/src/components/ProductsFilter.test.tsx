import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../test/test-utils';
import ProductsFilter from './ProductsFilter';

describe('ProductsFilter', () => {
  it('renders category tabs and search input', () => {
    render(<ProductsFilter categories={['all', 'Electronics', 'Clothing']} />);
    expect(screen.getByRole('tab', { name: 'all' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Electronics' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Clothing' })).toBeInTheDocument();
    expect(screen.getByLabelText(/search products/i)).toBeInTheDocument();
  });

  it('renders sort by combobox', () => {
    render(<ProductsFilter categories={['all']} />);
    expect(screen.getByRole('combobox', { name: /sort by/i })).toBeInTheDocument();
  });
});
