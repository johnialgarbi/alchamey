import { Tabs } from '@chakra-ui/react'

export type SegmentedTabItem = {
  value: string
  label: string
}

type SegmentedTabsProps = {
  value?: string
  defaultValue?: string
  items: SegmentedTabItem[]
  size?: 'sm' | 'md' | 'lg'
  onValueChange?: (details: { value: string }) => void
  variant?: 'line' | 'subtle' | 'enclosed' | 'outline' | 'plain'
  colorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink'
}

export default function SegmentedTabs({
  items,
  value,
  size = 'sm',
  defaultValue,
  onValueChange,
  variant = 'subtle',
  colorPalette = 'purple',
}: SegmentedTabsProps) {
  const isControlled = value !== undefined

  return (
    <Tabs.Root
      {...(isControlled ? { value } : { defaultValue: defaultValue ?? items[0]?.value })}
      size={size}
      variant={variant}
      colorPalette={colorPalette}
      onValueChange={onValueChange}
    >
      <Tabs.List
        p="0"
        gap="8px"
        border="none"
        bg="transparent"
        flexWrap={{ base: 'wrap', lg: 'nowrap' }}
      >
        {items.map(({ value: itemValue, label }) => (
          <Tabs.Trigger
            py="8px"
            px="16px"
            bg="white"
            fontSize="14px"
            display="flex"
            color="gray.50"
            key={itemValue}
            fontWeight="500"
            textAlign="center"
            value={itemValue}
            alignItems="center"
            borderRadius="12px"
            borderWidth="1px"
            fontFamily="main"
            borderStyle="solid"
            justifyContent="center"
            borderColor="gray.400"
            textTransform="capitalize"
            transition="all 0.2s linear"
            _hover={{ borderColor: 'blue.50',}}
            flex={{ base: '1 1 calc(50% - 4px)', lg: 'initial'}}
            _selected={{  color: 'white', bg: 'blue.50', borderColor: 'transparent', boxShadow: 'md'}}
          >
            {label} 
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
