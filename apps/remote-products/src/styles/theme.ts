import colors from './themeColors'
import inputsRecipes from './inputsRecipes'
import buttonRecipes from './buttonRecipes'
import { createSystem, defaultConfig } from '@chakra-ui/react'

const config = {
  theme: {
    breakpoints: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1200px',
    },
    tokens: {
      colors: {
        ...colors,
      },
      fonts: {
        main: { value: "'Rajdhani', sans-serif" },
      },
    },
    recipes: {
      input: inputsRecipes,
      button: buttonRecipes,
    },
  },
}

const system = createSystem(defaultConfig, config)

export default system
