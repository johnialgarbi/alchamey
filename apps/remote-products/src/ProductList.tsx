import { showToastr } from './utils';
import { useCallback, useEffect } from 'react';
import ProductItem from './components/ProductItem';
import { Typography } from './components/Typography';
import ProductsFilter from './components/ProductsFilter';
import { useGetProductsQuery } from './store/api/apiSlice';
import { Box, Button, Grid, Spinner } from '@chakra-ui/react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import FlexColumnContainer from './components/FlexColumnContainer';
import { FlexRowContainerCentered } from './components/FlexRowContainer';
import {
  setFilter,
  setProducts,
  selectCategories,
  selectVisibleProducts,
  selectHasMoreProducts,
} from './store/slices/productsListSlice';

type Props = {
  featureFlags?: { showRatings?: boolean };
};

export default function ProductList({ featureFlags }: Props) {
  const dispatch = useAppDispatch();
  const { data: products, error, isLoading } = useGetProductsQuery();

  const categories = useAppSelector(selectCategories);
  const hasMore = useAppSelector(selectHasMoreProducts);
  const visibleProducts = useAppSelector(selectVisibleProducts);
  const { visibleCount, search, category, sortByPrice } = useAppSelector((state) => state.productsList.filter);

  useEffect(() => {
    dispatch(setFilter({ visibleCount: 20 }));
  }, [dispatch, search, category, sortByPrice]);

  const handleLoadMore = useCallback(() => {
    dispatch(setFilter({ visibleCount: visibleCount + 20 }));
  }, [dispatch, visibleCount]);

  

  useEffect(() => {
    if (products != null) dispatch(setProducts(products));
  }, [dispatch, products]);

  useEffect(() => {
    if (error != null) showToastr('error', 'Error fetching products');
  }, [error]);

  if (isLoading) return <FlexRowContainerCentered pt='80px'><Spinner size="xl" /></FlexRowContainerCentered>;
  
  return (
    <FlexColumnContainer
      as="main"
      aria-label="Product list"
      py={{ base: '20px', md: '32px' }}
      gap={{ base: '32px', md: '60px' }}
    >
      <ProductsFilter
        categories={categories}
      />
      {visibleProducts.length > 0 && <Grid
        as="ul"
        margin="0"
        padding="0"
        width='100%'
        listStyleType="none"
        gap={{ base: '16px', md: '24px' }}
        templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }}
      >
        {visibleProducts.map((product) => (
          <Box as="li" key={product.id} listStyleType="none" height="100%">
            <ProductItem
              product={product}
              showRatings={featureFlags?.showRatings !== false}
            />
          </Box>
        ))}
      </Grid>}
      {visibleProducts.length === 0 && (
        <FlexRowContainerCentered>
          <Typography
            variant='base'
            color='gray.50'
            fontWeight='600'
          >
            No products found.
          </Typography>
        </FlexRowContainerCentered>
      )}
      {hasMore && (
        <FlexRowContainerCentered>
          <Button
            variant='solid'
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </FlexRowContainerCentered>
      )}
    </FlexColumnContainer>
  );
}
