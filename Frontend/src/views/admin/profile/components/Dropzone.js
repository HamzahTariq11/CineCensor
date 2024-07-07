// Chakra imports
import {
  Button,
  Flex,
  Input,
  useColorModeValue,
  Box,
  Icon,
  Text,
  Image,
} from "@chakra-ui/react";
// Assets
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdUpload } from "react-icons/md";
import VideoThumbnail from "react-video-thumbnail";

function Dropzone(props) {
  const { image, setImage, videoName, setVideoName, ...rest } = props;
  const bg = useColorModeValue("gray.100", "navy.700");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  const textColorSecondary = "gray.400";
  const brandColor = useColorModeValue("brand.500", "white");
  const [content, setContent] = useState(
    <Box>
      <Icon as={MdUpload} w="80px" h="80px" color={brandColor} />
      <Flex justify="center" mx="auto" mb="12px">
        <Text fontSize="xl" fontWeight="700" color={brandColor}>
          Upload Videos
        </Text>
      </Flex>
      <Text fontSize="sm" fontWeight="500" color="secondaryGray.500">
        MP4, AVI and WebM files are allowed
      </Text>
    </Box>
  );
  const onDrop = useCallback((acceptedFiles) => {
    if (
      acceptedFiles[0].type === "video/mp4" ||
      acceptedFiles[0].type === "video/avi" ||
      acceptedFiles[0].type === "video/webm"
    ) {
      let videoUrl = URL.createObjectURL(acceptedFiles[0]);
      setImage({
        image: acceptedFiles[0],
        preview: videoUrl,
      });
      setVideoName(acceptedFiles[0].name);
      setContent(
        <Box>
          <VideoThumbnail
            videoUrl={videoUrl}
            thumbnailHandler={(thumbnail) => console.log(thumbnail)}
          />
          <Flex justify="center" mx="auto" mb="12px" mt="5px">
            <Text fontSize="m" fontWeight="700" color={textColorSecondary}>
              {acceptedFiles[0].name}
            </Text>
          </Flex>
        </Box>
      );
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Flex
      align="center"
      justify="center"
      bg={bg}
      border="1px dashed"
      borderColor={borderColor}
      borderRadius="16px"
      w="100%"
      h="max-content"
      minH="100%"
      cursor="pointer"
      {...getRootProps({ className: "dropzone" })}
      {...rest}
    >
      <Input
        variant="main"
        type="file"
        accept="video/mp4, video/avi, video/webm"
        display="none"
        {...getInputProps({
          variant: "main",
          type: "file",
          accept: "video/mp4, video/avi, video/webm",
          display: "none",
        })}
      />
      <Button variant="no-effects">{content}</Button>
    </Flex>
  );
}

export default Dropzone;
