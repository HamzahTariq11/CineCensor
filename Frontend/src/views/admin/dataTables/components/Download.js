import { Flex, useColorModeValue } from "@chakra-ui/react";
import { downloadProcessedVideo } from "api/processVideo";
import { downloadUploadedVideo } from "api/uploadVideo";
import { BaseLink } from "layouts/admin";
import React, { useContext, useState } from "react";
import { MdOutlineFontDownload } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Download({ value, tableName }) {
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

  let Link = useContext(BaseLink) || `http://127.0.0.1:5000/`;
  const [downloadUrl, setDownloadUrl] = useState("");
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  let [id, ...rest] = value.split(",");
  const handleDownload = async () => {
    try {
      if (tableName === "Processed") {
        Link = Link + `/downloadvideo?video_id=${id}&is_processed=${1}`;
      } else {
        Link = Link + `/downloadvideo?video_id=${id}&is_processed=${0}`;
      }
      console.log("download LINK", Link);
      const response = await fetch(Link);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else if (response.message) {
        throw new Error(response.message);
      }
      const blob = await response.blob();
      setDownloadUrl(URL.createObjectURL(blob));
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "video.mp4";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      showToastSuccess("File Downloaded");
    } catch (error) {
      showToast(error.message);
      console.error("Error downloading video:", error);
    }
  };
  console.log("Download Called");
  return (
    <Flex onClick={handleDownload}>
      <MdOutlineFontDownload me="16px" h="18px" w="19px" color={iconColor} />
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
