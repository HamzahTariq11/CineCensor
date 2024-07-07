import { Box, Button, SimpleGrid } from "@chakra-ui/react";
import DevelopmentTable from "views/admin/dataTables/components/DevelopmentTable";
import {
  columnsDataDevelopmentForUploads,
  columnsDataDevelopmentForProcessed,
} from "views/admin/dataTables/variables/columnsData";
import tableDataDevelopment from "views/admin/dataTables/variables/tableDataDevelopment.json";
import React, { useEffect, useState } from "react";
import { LoadingSpinner } from "components/loading/loadingSpinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUploadedVideo } from "api/uploadVideo";
import { getProcessedVideo } from "api/processVideo";

export default function Settings({ metaData }) {
  // Chakra Color Mode
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
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

  const uploadsDataParser = (data) => {
    let parsedData = [];
    if (data.length > 0) {
      data.forEach((element) => {
        let obj = {};
        obj["Actions"] = element[0] + "," + "false";
        obj["Video Name"] = element[1];
        obj["Duration"] = element[3];
        obj["Uploaded On"] = element[4];
        parsedData.push(obj);
      });
    }
    return parsedData;
  };
  const processedDataParser = (data) => {
    let parsedData = [];
    if (data.length > 0) {
      data.forEach((element) => {
        let obj = {};
        obj["Actions"] = element[0];
        obj["Video Name"] = element[1];
        obj["Duration"] = element[3];
        obj["Uploaded On"] = element[4];
        obj["Rating"] = element[7];
        if (element[15] !== null) {
          obj["Status"] = element[15];
          obj["Actions"] = element[0] + "," + "true";
        } else {
          obj["Actions"] = element[0] + "," + "false";
          obj["Status"] = element[15];
        }
        parsedData.push(obj);
      });
    }
    return parsedData;
  };
  const getTableData = async () => {
    let response;
    let data;
    try {
      setLoading(true);
      if (metaData === "Uploads") {
        response = await getUploadedVideo();
        data = uploadsDataParser(response);
      } else {
        response = await getProcessedVideo();
        data = processedDataParser(response);
      }
      console.log("data for table ", response);
      setTableData(data);
      setLoading(false);
      // }
    } catch (error) {
      showToast(error.message);
      console.log("error");
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(async () => {
    await getTableData();
  }, []);

  return (
    <>
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <SimpleGrid
          mb="20px"
          columns={{ sm: 1 }}
          spacing={{ base: "20px", xl: "20px" }}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <DevelopmentTable
              columnsData={
                metaData === "Uploads"
                  ? columnsDataDevelopmentForUploads
                  : columnsDataDevelopmentForProcessed
              }
              tableData={tableData}
              tableName={metaData}
              getTableData={getTableData}
            />
          )}
        </SimpleGrid>
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
    </>
  );
}
