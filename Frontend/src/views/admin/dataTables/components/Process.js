import { Flex, useColorModeValue } from "@chakra-ui/react";
import { processVideo } from "api/processVideo";
import React, { useState } from "react";
import { VscServerProcess } from "react-icons/vsc";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Process({ value, getTableData }) {
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  let [id, ...rest] = value.split(",");
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
  const handleProcess = async () => {
    let response;
    try {
      response = await processVideo(id);
      showToastSuccess(response.message);
    } catch (error) {
      showToastError(error.message);
    }
  };
  return (
    <Flex onClick={handleProcess}>
      <VscServerProcess me="16px" h="18px" w="19px" color={iconColor} />
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
  );
}
