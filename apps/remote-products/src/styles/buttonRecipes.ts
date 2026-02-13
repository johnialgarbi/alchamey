import { defineRecipe } from '@chakra-ui/react'

const buttonRecipes = defineRecipe({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
    outline: 0,
    fontWeight: 'medium',
    lineHeight: '1.2',
    borderRadius: 'md',
    _focusVisible: {
      boxShadow: 'outline',
    },
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  variants: {
    variant: {
      solid: {
        bg: 'blue.50',
        color: 'white',
        fontSize: '16px',
        fontWeight: '600',
        lineHeight: '1.2',
        fontFamily: 'main',
        textAlign: 'center',
        transition: 'all 0.3s linear',
        borderRadius: '8px',
        height: '44px',
        border: 'none',
        _hover: {
          bg: 'blue.50',
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 20px rgba(33, 206, 216, 0.3)',
        },
        _active: {
          bg: 'blue.50',
          transform: 'translateY(0)',
          boxShadow: 'none',
        },
        _disabled: {
          opacity: 0.6,
          cursor: 'not-allowed',
          transform: 'none',
          boxShadow: 'none',
          bg: 'gray.400',
          color: 'white',
          borderWidth: '1px',
          borderColor: 'gray.200',
          _hover: { bg: 'gray.100', transform: 'none' },
          _active: { bg: 'gray.100' },
        },
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
})

export default buttonRecipes

