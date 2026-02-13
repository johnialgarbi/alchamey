import { useMemo, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { FaCaretDown, FaCheck, FaTimes } from "react-icons/fa";
import { Portal, Select, createListCollection, Box, Icon } from "@chakra-ui/react";

type SelectInputProps = {
  OnClear?: () => void;
  onChange?: (value: string) => void;
  label?: string;
  value?: string;
  fontSize?: string;
  disabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  borderRadius?: string;
  disableClear?: boolean;
  width?: number | string;
  disablePadding?: boolean;
  height?: number | string;
  size?: "sm" | "md" | "lg";
  options: { label: string; value: string | number }[];
};

export default function SelectInput({
  placeholder,
  options,
  value,
  onChange,
  OnClear,
  label,
  width = "100%",
  size = "sm",
  height = "44px",
  borderRadius = "12px",
  disabled = false,
  isLoading = false,
  disableClear = false,
  disablePadding = false,
  fontSize = "14px",
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const defaultPlaceholder = placeholder || 'Select an option';
  
  const collection = useMemo(
    () =>
      createListCollection({
        items: options,
      }),
    [options]
  );

  const handleValueChange = (details: { value: string[] }) => {
    if (onChange && details.value.length > 0) {
      onChange(details.value[0]);
    } else if (onChange && details.value.length === 0) {
      onChange("");
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    OnClear?.();
  };

  const hasValue = value && value !== "";

  return (
    <Box width={width}>
      <Select.Root
        size={size}
        open={isOpen}
        disabled={disabled}
        collection={collection}
        value={value ? [value] : []}
        onValueChange={handleValueChange}
        onOpenChange={(details) => setIsOpen(details.open)}
      >
        <Select.HiddenSelect />
        <Box
          position="relative"
          borderRadius={borderRadius}
          border="none"
          boxShadow={
            isOpen
              ? "0 0 0 1px {colors.blue.50}, 0 0 8px rgba(33, 206, 216, 0.09)"
              : "0 0 0 1px {colors.gray.400}, 0 0 8px rgba(233, 234, 235, 0.15)"
          }
          transition="all 0.2s linear"
          width="100%"
        >
          <Select.Control>
            <Select.Trigger
              px="12px"
              bg="white"
              border="none"
              fontWeight="500"
              cursor="pointer"
              height={height}
              color="gray.50"
              fontFamily="main"
              minHeight={height}
              fontSize={fontSize}
              borderRadius={borderRadius}
              aria-label={label ?? placeholder ?? defaultPlaceholder}
              _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
              pr={disablePadding ? "0px" : hasValue ? "72px" : "12px"}
            >
              <Select.ValueText placeholder={defaultPlaceholder} color="gray.600" fontWeight="500"/>
            </Select.Trigger>
            {hasValue && !disabled && !disableClear && !isLoading && (
              <Box
                top="50%"
                zIndex={1}
                right="36px"
                display="flex"
                cursor="pointer"
                position="absolute"
                alignItems="center"
                onClick={handleClear}
                justifyContent="center"
                transition="color 0.2s"
                transform="translateY(-50%)"
                color="var(--chakra-colors-gray-500)"
                _hover={{ color: "var(--chakra-colors-gray-400)",}}
              >
                <Icon as={FaTimes} width='14px' height='14px' color="gray.50" />
              </Box>
            )}
            {isLoading && 
            <Icon
              w="18px"
              h="18px"
              top="27%"
              right="12px"
              display="flex"
              as={ImSpinner2}
              cursor="pointer"
              color="gray.50"
              position="absolute"
              alignItems="center"
              justifyContent="center"
              transition="color 0.2s"
              transform="translateY(-50%)"
            />}
            {!isLoading && 
            <Select.IndicatorGroup pr="12px" color="gray.50">
              <Select.Indicator color="gray.50">
                <Box
                  display="flex"
                  color="gray.500"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaCaretDown} width='14px' height='14px' color="gray.50" />
                </Box>
              </Select.Indicator>
            </Select.IndicatorGroup>}
          </Select.Control>
        </Box>
        <Portal>
          <Select.Positioner>
            <Select.Content
              p='8px'
              bg="white"
              maxH="300px"
              overflowY="auto"
              borderRadius={borderRadius}
            >
              {collection.items.map((item) => (
                <Select.Item
                  p='12px'
                  mb='8px'
                  item={item}
                  color="gray.50"
                  key={item.value}
                  cursor="pointer"
                  fontWeight="500"
                  fontFamily='main'
                  fontSize={fontSize}
                  borderRadius={borderRadius}
                  transition='all 0.2s linear'
                  _hover={{
                    bg: "gray.700",
                    color: "gray.50",
                  }}
                  _highlighted={{
                    bg: "gray.700",
                    color: "gray.50",
                  }}
                  _selected={{
                    bg: "blue.50",
                    color: "white",
                    fontWeight: "600",
                    _hover: { bg: "blue.50", color: "white" },
                  }}
                >
                  {item.label}
                  <Select.ItemIndicator>
                    <Icon as={FaCheck} width='14px' height='14px' color="white" />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Box>
  );
}