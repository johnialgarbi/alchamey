import { Icon } from "@chakra-ui/react";
import { RxCross2 } from "react-icons/rx";
import FlexRowContainer from "./FlexRowContainer";
import { Typography } from "../components/Typography";  

type ToastrType = 'success' | 'error' | 'warning';
const toastrColorByType: Record<ToastrType, string> = {
    success: "green.50",
    error: "#E1607F",
    warning: "#D3905F",
};

type CustomToastrProps = {
    type: ToastrType;
    onClose: () => void;
    message?: string | React.ReactNode;
};

export default function ToastrMessage({ type, onClose, message }: CustomToastrProps) {
    return (
        <FlexRowContainer
            p='16px'
            gap='12px'
            borderRadius='8px'
            bg={toastrColorByType[type]}
        >
            <Typography
                flex={1}
                color='white'
                fontWeight='500'
                variant='subtitle'
            >
                {message}
            </Typography>
            <Icon
                width='20px'
                height='20px'
                color="white"
                as={RxCross2}
                cursor='pointer'
                onClick={onClose}
                _hover={{ opacity: 0.8 }}
            />
        </FlexRowContainer>
    );
};