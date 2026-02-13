import { Text as ChakraText, type TextProps } from '@chakra-ui/react'

type TypographyVariant = 'base' | 'heading' | 'title' | 'subtitle' | 'normal' | 'small'

type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

export interface TypographyProps extends Omit<TextProps, 'variant' | 'size'> {
  variant?: TypographyVariant
  size?: TypographySize
  /** Semantic HTML element (e.g. "h2", "h3" for headings). Defaults to "p" for Chakra Text. */
  as?: TextProps['as']
}

const variantStyles: Record<TypographyVariant, Record<string, string>> = {
  base: {
    fontFamily: 'main',
    fontSize: '18px',
    fontWeight: '400',
    color: 'gray.100',
  },
  heading: {
    fontFamily: 'main',
    fontSize: '40px',
    fontWeight: '700',
    color: 'gray.100',
  },
  title: {
    fontFamily: 'main',
    fontSize: '16px',
    fontWeight: '600',
    color: 'gray.100',
  },
  subtitle: {
    fontFamily: 'main',
    fontSize: '16px',
    fontWeight: '400',
    color: 'gray.100',
  },
  normal: {
    fontFamily: 'main',
    fontSize: '14px',
    fontWeight: '500',
    color: 'gray.100',
  },
  small: {
    fontFamily: 'main',
    fontSize: '10px',
    fontWeight: '400',  
    color: 'gray.100',
  },
}

export function Typography({ variant = 'base', size, as, ...props }: TypographyProps) {
  const variantStyle = variantStyles[variant] || variantStyles.base
  const sizeStyle = size ? { fontSize: size } : {}

  return <ChakraText as={as} {...variantStyle} {...sizeStyle} {...props} />
}

