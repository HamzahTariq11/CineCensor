import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import React from "react";
import VideoPlayer from "components/videoPlayer";
import { MdRemoveRedEye } from "react-icons/md";

function PreviewModal({ value, tableName }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  const history = useHistory();
  let [id, isProcessed] = value.split(",");
  const getPreviewAccordingly = () => {
    if (isProcessed === "false") {
      return <></>;
    }
    return (
      <Flex
        onClick={() => {
          history.push(`/admin/video/process/${id}`);
        }}
      >
        <MdRemoveRedEye me="16px" h="18px" w="19px" color={iconColor} />
      </Flex>
    );
  };

  return (
    <>
      {tableName === "Processed" ? (
        getPreviewAccordingly()
      ) : (
        <Flex onClick={onOpen}>
          <MdRemoveRedEye
            me="16px"
            h="18px"
            w="19px"
            color={iconColor}
            onClick={onOpen}
          />
          <Modal onClose={onClose} size={"6xl"} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Video Preview</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VideoPlayer endPoint={id} isProcessed={0} />
              </ModalBody>
              <ModalFooter>
                <Button onClick={onClose}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      )}
    </>
  );
}

export default PreviewModal;
