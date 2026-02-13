import SelectInput from "./SelectInput";
import SegmentedTabs from "./SegmentedTabs";
import { useCallback, useMemo } from 'react';
import { Box, Input } from "@chakra-ui/react";
import type { ProductsFilterType } from '../types';
import useDebouncedInput from '../hooks/useDebouncedInput';
import { setFilter } from "../store/slices/productsListSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import FlexRowContainer, { FlexRowContainerSpaceBetween } from "./FlexRowContainer";

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: 'Price low', value: 'asc' },
  { label: 'Price high', value: 'desc' },
];

type Props = {
  categories: string[];
};

export default function ProductsFilter({ categories }: Props) {
  const dispatch = useAppDispatch();
  const productsFilter = useAppSelector((state) => state.productsList.filter);

  const handleProductsFilterChange = useCallback(
    (field: keyof ProductsFilterType, value: string | number) => {
      dispatch(setFilter({ [field]: value }));
    },
    [dispatch]
  );

  const categoryItems = useMemo(
    () => categories.map((cat) => ({ label: cat, value: cat })),
    [categories]
  );

  const searchInput = useDebouncedInput(
    productsFilter.search,
    (value) => handleProductsFilterChange('search', value),
    300
  );

  return (
    <FlexRowContainerSpaceBetween
      as="section"
      width="100%"
      aria-label="Filter products"
      gap={{ base: '16px', lg: '0px' }}
      flexDirection={{ base: 'column', lg: 'row' }}
      alignItems={{ base: 'stretch', lg: 'center' }}
    >
        <SegmentedTabs
            size="md"
            items={categoryItems}
            value={productsFilter.category}
            onValueChange={({ value }) => handleProductsFilterChange('category', value)}
        />
        <FlexRowContainer
          gap='12px'
          width={{ base: '100%', md: 'initial' }}
          flexDirection={{ base: 'column', sm: 'row' }}
        >
            <Box width={{ base: '100%', sm: '250px' }}>
              <Input
                width="100%"
                value={searchInput.value}
                aria-label="Search products"
                placeholder="Search products"
                onChange={(e) => searchInput.onChange(e.target.value)}
              />
            </Box>
            <Box width={{ base: '100%', sm: '180px' }}>
              <SelectInput
                width="100%"
                label="Sort by"
                placeholder="Sort by"
                options={SORT_OPTIONS}
                value={productsFilter.sortByPrice}
                OnClear={() => handleProductsFilterChange('sortByPrice', '')}
                onChange={(value) => handleProductsFilterChange('sortByPrice', value)}
              />
            </Box>
        </FlexRowContainer>
    </FlexRowContainerSpaceBetween>
  );
}