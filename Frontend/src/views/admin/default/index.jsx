import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  MdAttachMoney,
  MdBarChart,
  MdOutlineCalendarMonth,
  MdVideoCameraBack,
  MdVideoCameraFront,
  MdVideoStable,
} from "react-icons/md";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import { useEffect } from "react";
import { getDashboard } from "api/dashboard";
import { LoadingSpinner } from "components/loading/loadingSpinner";
import { ViewOffIcon } from "@chakra-ui/icons";

export default function UserReports() {
  // Chakra Color Mode
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [earnPkr, setEarnPkr] = useState([]);
  const [meta, setMeta] = useState([]);
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
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

  const parseData = (data) => {
    let parsedData = [];
    parsedData.push([data[0], 0]);
    parsedData.push([data[1] + data[4], 0]);
    parsedData.push([data[2], 0]);
    parsedData.push([data[3], 0]);
    return parsedData;
  };
  useEffect(async () => {
    try {
      setLoading(true);
      let res = await getDashboard();
      console.log(res);
      if (res.length > 0) {
        setData(parseData(res[3]));
        setEarnings(res[0][0]);
        setEarnPkr(res[1][0]);
        setMeta(res[2]);
      } else {
        setEarnings("27");
        setEarnPkr("10");
        setMeta("63");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      showToast(error.message);
      setError(error);
    }
  }, []);
  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, "2xl": 6 }}
            gap="20px"
            mb="20px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="25px"
                      h="25px"
                      as={MdVideoCameraFront}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Total Videos "
              value={`${earnings}`}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="25px"
                      h="25px"
                      as={MdVideoStable}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Processed Videos"
              value={`${earnPkr}`}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="25px"
                      h="25px"
                      as={ViewOffIcon}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Explicit Content (%)"
              value={`${meta} %`}
            />
          </SimpleGrid>

          <SimpleGrid>
            <WeeklyRevenue data={data} />
          </SimpleGrid>
        </>
      )}
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
    </Box>
  );
}
