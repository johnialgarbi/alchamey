import { defineRecipe } from '@chakra-ui/react'

const inputsRecipes = defineRecipe({
  base: {
    width: '100%',
    outline: 0,
    minWidth: 0,
    appearance: 'none',
    position: 'relative',
    transitionProperty: 'common',
    transitionDuration: 'normal',
    _disabled: {
      opacity: 0.4,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
    outline: {
          bg: 'white',
          width: '100%',
          height: '44px',
          fontSize: '14px',
          color: 'gray.100',
          fontWeight: '500',
          lineHeight: '1.2',
          fontFamily: 'main',
          borderRadius: '12px',
          transition: 'all 0.3s linear',
          boxShadow: '0 0 0 1px #E9EAEB, 0 0 8px rgba(245, 229, 229, 0.15)',
          border: 'none',
        _focus: {
          boxShadow: '0 0 0 1px {colors.blue.50}, 0 0 8px rgba(33, 206, 216, 0.09)',
          outline: 'none',
          border:'none',
        },
        _invalid: {
          borderColor: 'red.50',
          boxShadow: '0 0 0 1px {colors.red.50}',
        },
        _placeholder: {
          color: 'gray.600',
          fontWeight: '400',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'outline',
  },
})

export default inputsRecipes

