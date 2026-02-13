import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test/test-utils';
import ProductItem from './ProductItem';
import type { Product } from '../types';

vi.mock('../utils', () => ({
  showToastr: vi.fn(),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  price: 99,
  image: 'https://example.com/img.png',
  rating: 4,
  category: 'Electronics',
  description: 'A test product',
};

describe('ProductItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders product name, price, and category', () => {
    render(<ProductItem product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders image with product name as alt', () => {
    render(<ProductItem product={mockProduct} />);
    const img = screen.getByRole('img', { name: 'Test Product' });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockProduct.image);
  });

  it('renders add to cart button with accessible label', () => {
    render(<ProductItem product={mockProduct} />);
    const button = screen.getByRole('button', { name: /add test product to cart/i });
    expect(button).toBeInTheDocument();
  });

  it('calls showToastr when add to cart is clicked', async () => {
    const { showToastr } = await import('../utils');
    render(<ProductItem product={mockProduct} />);
    const button = screen.getByRole('button', { name: /add test product to cart/i });
    fireEvent.click(button);
    expect(showToastr).toHaveBeenCalledWith('success', 'Product added to cart');
  });
});
