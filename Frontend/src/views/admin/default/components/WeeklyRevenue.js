// Chakra imports
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card.js";
// Custom components
import BarChart from "components/charts/BarChart";
import React from "react";
import {
  barChartDataConsumption,
  barChartOptionsConsumption,
} from "variables/charts";
import { MdBarChart } from "react-icons/md";

export default function WeeklyRevenue(props) {
  let { data, ...rest } = props;
  if (!data) {
    data = [
      [1700, 5689],
      [8300, 9384],
      [3400, 6432],
    ];
  }
  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("brand.500", "white");
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const dataOptions = () => {
    let array = ["Nudity", "Gun", "Blood", "Substance Abuse"];
    barChartOptionsConsumption.xaxis.show = true;
    barChartOptionsConsumption.xaxis.categories = array;
    // if (data) {
    //   for (let i in array) {
    //   }
    // }
    console.log(barChartOptionsConsumption);
    return barChartOptionsConsumption;
  };
  const fineTuneData = () => {
    const tempData = [
      { name: "Detected Frames", data: [] },
      { name: "Total Frames", data: [] },
    ];
    console.log(data);
    if (data) {
      for (let i in data) {
        tempData[0].data.push(data[i][0]);
        tempData[1].data.push(data[i][1]);
      }
    }
    return tempData;
  };
  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          Video vs Category
        </Text>
        {/* <Button
          align='center'
          justifyContent='center'
          bg={bgButton}
          _hover={bgHover}
          _focus={bgFocus}
          _active={bgFocus}
          w='37px'
          h='37px'
          lineHeight='100%'
          borderRadius='10px'
          {...rest}>
          <Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
        </Button> */}
      </Flex>

      <Box h="240px" mt="auto">
        <BarChart chartData={fineTuneData()} chartOptions={dataOptions()} />
      </Box>
    </Card>
  );
}
