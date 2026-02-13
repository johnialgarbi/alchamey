import { Icon } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa" ;
import { Typography } from "./Typography";
import FlexRowContainer from "./FlexRowContainer";

type RateElementProps = {
    rating: number;
}

export default function RateElement({ rating }: RateElementProps) {
    return (
        <FlexRowContainer width='initial' gap='4px'>
            <Icon as={FaStar} color='orange.50' width='18px' height='18px' />
            <Typography variant='subtitle' fontWeight='600'>{rating}</Typography>
        </FlexRowContainer>
    );
}