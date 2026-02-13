import { Box, type BoxProps } from "@chakra-ui/react";

type MainContainerProps = {
  children: React.ReactNode;
} & BoxProps;

export default function MainContainer({ children, ...props }: MainContainerProps) {
  return (
    <Box 
        width="100%"
        margin="0 auto"
        padding="0 16px"
        maxWidth="1400px"
        {...props}
    >
      {children || null}
    </Box>
  );
}