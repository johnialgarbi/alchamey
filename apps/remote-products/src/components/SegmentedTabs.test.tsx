import { describe, it, expect } from 'vitest';
import { screen, fireEvent, waitFor, act } from '@testing-library/react';
import { render } from '../test/test-utils';
import SegmentedTabs from './SegmentedTabs';

const items = [
  { value: 'all', label: 'All' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
];

describe('SegmentedTabs', () => {
  it('renders all tab labels', () => {
    render(<SegmentedTabs items={items} value="all" />);
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Electronics' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Clothing' })).toBeInTheDocument();
  });

  it('updates selected tab on click (user interaction)', async () => {
    render(<SegmentedTabs items={items} defaultValue="all" />);
    const allTab = screen.getByRole('tab', { name: 'All' });
    const electronicsTab = screen.getByRole('tab', { name: 'Electronics' });
    expect(allTab).toHaveAttribute('aria-selected', 'true');

    await act(async () => {
      fireEvent.click(electronicsTab);
    });

    await waitFor(() => {
      expect(electronicsTab).toHaveAttribute('aria-selected', 'true');
    });
  });
});
