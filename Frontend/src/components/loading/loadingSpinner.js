import { AbsoluteCenter, Box, Spinner } from "@chakra-ui/react";
import React from "react";

export function LoadingSpinner() {
  return (
    <Box position="relative" h="100px">
      <AbsoluteCenter p="4" color="white" axis="both">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </AbsoluteCenter>
    </Box>
  );
}
