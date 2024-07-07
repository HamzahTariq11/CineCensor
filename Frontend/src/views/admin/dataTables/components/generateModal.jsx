import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
// import { generateReport } from "api/reports";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function InitialFocus({ isOpen, onClose, getTableData }) {
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const [date, setDate] = useState("");
  const showToastError = (msg) => {
    toast.error(`${msg}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 0,
      theme: "light",
    });
  };
  const showToastSuccess = (msg) => {
    toast.success(`${msg}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: 0,
      theme: "light",
    });
  };
  const handleGenerate = async () => {
    let res;
    try {
      setLoading(true);
      // res = await generateReport(date);
      setLoading(false);
      if (res.status == 200) {
        showToastSuccess(res.message);
        onClose(true);
        await getTableData();
      } else {
        throw { message: res.message };
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      showToastError(error.message);
    }
  };

  const [loading, setLoading] = useState(false);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text placeContent={"center"}>
              Select the month for report generation.
            </Text>
            <Input
              isRequired={true}
              type="month"
              value={date}
              placeholder="2023-09"
              onChange={(e) => setDate(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              isLoading={loading}
              loadingText="Generating"
              onClick={handleGenerate}
            >
              Generate
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
