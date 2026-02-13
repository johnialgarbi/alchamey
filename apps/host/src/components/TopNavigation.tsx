import Logo from "../assets/logo.svg";
import { Box, Image } from "@chakra-ui/react";
import MainContainer from "../components/MainContainer";

export default function TopNavigation() {
  return (
    <Box
        top="0"
        left="0"
        right="0"
        bg="white"
        zIndex="100"
        width="100%"
        position="fixed"
    >
        <MainContainer p="16px">
          <Image src={Logo} alt="Logo" />
        </MainContainer>
    </Box>
  );
}
