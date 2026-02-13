import { Flex, type FlexProps } from "@chakra-ui/react";

type FlexColumnContainerProps = FlexProps;

export default function FlexColumnContainer({ children, ...props }: FlexColumnContainerProps) {
    return (
        <Flex
            width='100%'
            flexDir='column'
            alignItems='flex-start'
            justifyContent='flex-start'
            {...props}
        >
            {children}
        </Flex>
    )
}

export function FlexColumnContainerCentered({ children, ...props }: FlexColumnContainerProps) {
    return (
        <FlexColumnContainer
            alignItems='center'
            justifyContent='center'
            {...props}
        >
            {children}
        </FlexColumnContainer>
    )
}