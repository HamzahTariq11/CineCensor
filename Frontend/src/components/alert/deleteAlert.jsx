import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
} from "@chakra-ui/react";
import { deleteProcessedVideo } from "api/processVideo";
import { deleteUploadedVideo } from "api/uploadVideo";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DeleteAlert({
  isOpen,
  onClose,
  tableName,
  value,
  getTableData,
}) {
  const [loading, setLoading] = useState(false);
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
  const handleUserDelete = async () => {
    let response;
    try {
      setLoading(true);
      console.log("Delete Value", value);
      if (tableName === "Processed") {
        response = await deleteProcessedVideo(value);
      } else {
        response = await deleteUploadedVideo(value);
      }
      setLoading(false);
      showToastSuccess(response.message);
      await getTableData();
    } catch (error) {
      showToastError(error.message);
    }
    onClose(true);
  };
  return (
    <>
      <AlertDialog onClose={onClose} isOpen={isOpen}>
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Discard Changes?</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to discard this record {value} ?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onClick={onClose}>No</Button>
            <Button
              colorScheme="red"
              ml={3}
              onClick={handleUserDelete}
              isLoading={loading}
              loadingText="Deleting"
            >
              Yes
            </Button>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
