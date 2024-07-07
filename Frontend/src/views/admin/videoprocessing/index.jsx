import React, { useEffect, useState } from "react";
import VideoPlayer from "components/videoPlayer/index.jsx";
import {
  Box,
  Center,
  Divider,
  SimpleGrid,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import ColumnsTable from "../dataTables/components/ColumnsTable";
import { columnsDataColumns } from "../dataTables/variables/columnsData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOneVideo } from "api/uploadVideo";
import CustomTable from "./components/CustomTable";

export default function VideoProcess() {
  const showToast = (msg) => {
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

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const [data, setData] = useState({});

  useEffect(async () => {
    const url = window.location.href;
    const [id, ...rest] = url.split("/").reverse();
    console.log(id);
    try {
      const response = await getOneVideo(id);
      console.log("response", response);
      setData([
        {
          Categories: "Nudity",
          Detected: response[9],
        },
        {
          Categories: "Guns",
          Detected: response[10] || response[13],
        },
        {
          Categories: "Blood",
          Detected: response[11],
        },
        {
          Categories: "Cigarette",
          Detected: response[12],
        },
      ]);
    } catch (error) {
      showToast(error.message);
    }
  }, []);

  return (
    <>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 2, "2xl": 2 }}
          gap="20px"
          mb="20px"
        >
          <Center>
            <Text
              color={textColor}
              fontSize="xl"
              fontWeight="700"
              lineHeight="100%"
            >
              Before
            </Text>
          </Center>
          <Center>
            <Text
              color={textColor}
              fontSize="xl"
              fontWeight="700"
              lineHeight="100%"
            >
              After
            </Text>
          </Center>
          <VideoPlayer
            key={100}
            heading={""}
            endPont={""}
            isProcessed={0}
            takeParamFromUrl={true}
          />
          <VideoPlayer
            key={101}
            heading={""}
            endPont={""}
            isProcessed={1}
            takeParamFromUrl={true}
          />
        </SimpleGrid>
      </Box>
      <ColumnsTable columnsData={columnsDataColumns} tableData={data} />
      {/* <CustomTable /> */}
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
    </>
  );
}
