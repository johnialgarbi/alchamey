import { Flex, type FlexProps } from "@chakra-ui/react";

type FlexRowContainerProps = FlexProps & {
    variant?: 'default' | 'centered' | 'space-between';
}

export default function FlexRowContainer({ 
    children, 
    variant = 'default',
    justifyContent,
    ...props 
}: FlexRowContainerProps) {
    const getJustifyContent = () => {
        if (justifyContent) return justifyContent;
        switch (variant) {
            case 'centered':
                return 'center';
            case 'space-between':
                return 'space-between';
            default:
                return 'flex-start';
        }
    };

    return (
        <Flex
            width='100%'
            alignItems='center'
            justifyContent={getJustifyContent()}
            {...props}
        >
            {children}
        </Flex>
    )
}

export const FlexRowContainerCentered = ({ ...props }: FlexProps) => (
    <FlexRowContainer variant="centered" {...props} />
);

export const FlexRowContainerSpaceBetween = ({ ...props }: FlexProps) => (
    <FlexRowContainer variant="space-between" {...props} />
);