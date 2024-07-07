import React from 'react'
import { useToast } from '@chakra-ui/react'

export default function errorToast({status}) {
    const toast = useToast()
    const statuses = ['success', 'error', 'warning', 'info']
  return (
    <Wrap>
         <WrapItem >
          <Button
            onClick={() =>
              toast({
                title: `${status} toast`,
                status: status,
                isClosable: true,
              })
            }
          >
            Show {status} toast
          </Button>
        </WrapItem>
    </Wrap>
  )
}
