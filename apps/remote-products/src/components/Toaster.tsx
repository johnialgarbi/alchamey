"use client"

import ToastrMessage from './ToastrMessage'; 
import { Portal, Toast, createToaster, Toaster as ChakraToaster } from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-start",
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster bg='red' toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => (
          <Toast.Root
            margin='0px'
            padding='0px'
            borderRadius='8px'
            minW={{ base: '100%', md: '350px' }}
            width={{ base: '100%', md: '350px' }}
            maxW={{ base: '100%', md: 'fit-content' }}
          >
            <ToastrMessage
              onClose={() => toaster.dismiss(toast.id)}
              message={toast.title || toast.description || ''}
              type={(toast.type as 'success' | 'error' | 'warning') || 'success'}
            />
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
