import { useToast } from '@chakra-ui/react'

export default  promiseToast = ()=> {
    const toast = useToast()
    return (
      <Button
        onClick={() => {
          // Create an example promise that resolves in 5s
          const examplePromise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(200), 5000)
          })
  
          // Will display the loading toast until the promise is either resolved
          // or rejected.
          toast.promise(examplePromise, {
            success: { title: 'Promise resolved', description: 'Looks great' ,isClosable:true},
            error: { title: 'Promise rejected', description: 'Something wrong' ,isClosable:true},
            loading: { title: 'Promise pending', description: 'Please wait' },
          })
        }}
      >
        Show Toast
      </Button>
    )
  }