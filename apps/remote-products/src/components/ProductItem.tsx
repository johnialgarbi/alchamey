import Tag from './Tag';
import { memo } from 'react';
import { showToastr } from '../utils';
import RateElement from './RateElement';
import { FiPlus } from "react-icons/fi";
import type { Product } from '../types';
import { Typography } from './Typography';
import FlexColumnContainer from './FlexColumnContainer';
import { Box, Button, Icon, Image } from '@chakra-ui/react';
import { FlexRowContainerSpaceBetween } from './FlexRowContainer';

type Props = {
  product: Product;
  showRatings?: boolean;
};

function ProductItem({ product, showRatings = true }: Props) {
  const handleAddToCart = () => showToastr('success', 'Product added to cart');

  return (
    <FlexColumnContainer
      width='100%'
      height='100%'
      bgColor='white'
      overflow='hidden'
      borderRadius='8px'
      borderWidth='1px'
      borderStyle='solid'
      borderColor='gray.800'
      transition='all 0.3s linear'
      _hover={{ borderColor: 'blue.50' }}
      boxShadow='0 0 2px 0 rgba(0, 0, 0, 0.1)'
    >
      <FlexColumnContainer
        flex='1'
        p={{ base: '12px', md: '20px' }}
        gap='12px'
        minHeight='0'
    >
        <Box
            mb={{ base: '8px', md: '12px' }}
            width='100%'
            aspectRatio={1}
            overflow='hidden'
            borderRadius='8px'
        >
          <Image
            width='100%'
            height='100%'
            loading='lazy'
            decoding='async'
            objectFit='cover'
            alt={product.name}
            src={product.image}
            transition='all 0.3s linear'
            _hover={{ transform: 'scale(1.02)' }}
          />
        </Box>
        <FlexRowContainerSpaceBetween>
            <Tag label={product.category}  />
            {showRatings && <RateElement rating={product.rating} />}
        </FlexRowContainerSpaceBetween>
        <FlexColumnContainer mb={{ base: '8px', md: '12px' }}>
            <Typography
                as="h3"
                variant='base'
                fontWeight='600'
            >
                {product.name || 'No name'}
            </Typography>
            {product.description &&
            <Typography
                color='gray.50'
                fontWeight='400'
                variant='subtitle'
            >
                {product.description}
            </Typography>}
        </FlexColumnContainer>
        <FlexRowContainerSpaceBetween mt='auto'>
            <Typography
                variant='base'
                fontWeight='600'
            >
                ${product.price || '0'}
            </Typography>
            <Button
                width='44px'
                bg='gray.300'
                variant='solid'
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
                boxShadow='0 0 2px 0 rgba(0, 0, 0, 0.1)'
            >
                <Icon
                    as={FiPlus}
                    width='24px'
                    color='white'
                    height='24px' 
                />
            </Button>
        </FlexRowContainerSpaceBetween>
      </FlexColumnContainer>
    </FlexColumnContainer>
  );
}

export default memo(ProductItem);