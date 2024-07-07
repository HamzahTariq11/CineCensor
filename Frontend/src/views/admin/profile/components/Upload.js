// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  VStack,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Custom components
import Card from "components/card/Card.js";
import IconBox from "components/icons/IconBox";
import React, { useState } from "react";
// Assets
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { MdUpload } from "react-icons/md";
import Dropzone from "views/admin/profile/components/Dropzone";
import { uploadVideo } from "api/uploadVideo";

export default function Upload(props) {
  const { used, total, tablename, onClose, getTableData, ...rest } = props;
  const [image, setImage] = useState();
  const [videoName, setVideoName] = useState("");
  const [loading, setLoading] = useState(false);
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
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
  const handleImageUpload = async () => {
    let response;
    try {
      if (image) {
        setLoading(true);
        response = await uploadVideo(image.image, videoName);
        showToastSuccess(response.message);
        onClose(true);
        await getTableData();
        setLoading(false);
      } else {
        showToastError("File not Selected");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      showToastError(error.message);
    }
  };
  return (
    <Card {...rest} mb="20px" align="center" p="20px">
      <Flex h="100%" direction={{ base: "column", "2xl": "row" }}>
        <Dropzone
          w={{ base: "100%", "2xl": "268px" }}
          me="36px"
          maxH={{ base: "60%", lg: "50%", "2xl": "100%" }}
          minH={{ base: "60%", lg: "50%", "2xl": "100%" }}
          content={
            <Box>
              <Icon as={MdUpload} w="80px" h="80px" color={brandColor} />
              <Flex justify="center" mx="auto" mb="12px">
                <Text fontSize="xl" fontWeight="700" color={brandColor}>
                  Upload Videos
                </Text>
              </Flex>
              <Text
                fontSize="sm"
                fontWeight="500"
                color="secondaryGray.500"
              ></Text>
            </Box>
          }
          image={image}
          setImage={setImage}
          videoName={videoName}
          setVideoName={setVideoName}
        />
        <Flex direction="column" pe="44px">
          <Text
            color={textColorPrimary}
            fontWeight="bold"
            textAlign="start"
            fontSize="2xl"
            mt={{ base: "20px", "2xl": "50px" }}
          >
            Upload Videos
          </Text>
          <Text
            color={textColorSecondary}
            fontSize="md"
            my={{ base: "auto", "2xl": "10px" }}
            mx="auto"
            textAlign="start"
          >
            Stay on the pulse of distributed projects with an an line whiteboard
            to plan, coordinate and discuss
          </Text>
          <Flex w="100%">
            <Button
              me="100%"
              mb="50px"
              w="140px"
              minW="140px"
              mt={{ base: "20px", "2xl": "auto" }}
              variant="brand"
              fontWeight="500"
              isLoading={loading}
              onClick={handleImageUpload}
              loadingText="Uploading"
            >
              Upload Now
            </Button>
          </Flex>
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
        </Flex>
      </Flex>
    </Card>
  );
}