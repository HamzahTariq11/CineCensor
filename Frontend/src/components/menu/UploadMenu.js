import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  Box,
  Grid,
} from "@chakra-ui/react";
import Upload from "views/admin/profile/components/Upload";

// const [first, setfirst] = useState(second)

export default function UploadMenu({
  isOpen,
  onClose,
  tablename,
  getTableData,
}) {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {tablename} </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box pt={{ base: "0px", md: "0px", xl: "0px" }}>
              <Grid
                templateRows={{
                  base: "1fr",
                  lg: "1fr",
                }}
                // gap={{ base: "20px", xl: "20px" }}
              >
                <Upload
                  minH={{ base: "auto", lg: "420px", "2xl": "365px" }}
                  pe="20px"
                  pb={{ base: "100px", lg: "20px" }}
                  tablename={tablename}
                  onClose={onClose}
                  getTableData={getTableData}
                />
              </Grid>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
