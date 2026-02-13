import { Typography } from './Typography';
import { GoDotFill } from "react-icons/go";
import { Flex, Icon } from '@chakra-ui/react';
import { FlexRowContainerCentered } from './FlexRowContainer';

type TagProps = {
    label: string;
    height?: string;
    width?: string;
    color?: string;
}

export default function Tag({ label, color = 'orange.100', height = '24px', width = 'initial' }: TagProps) {
  return (
    <Flex justifyContent='center' alignItems='center' height='initial' width='initial'>
        <FlexRowContainerCentered
            gap='2px'
            padding='8px'
            width={width}
            bg='transparent'
            height={height}
            borderRadius='20px'
            alignItems='center'
            justifyContent='center'
            border='1.5px solid {colors.orange.100}'
        >
            <Icon as={GoDotFill} color={color} width='14px' height='14px' />
            <Typography
              color={color}
              variant='normal'
              fontWeight='600'
              textTransform='capitalize'
            >
                {label}
              </Typography>
        </FlexRowContainerCentered>
    </Flex>
  );
}