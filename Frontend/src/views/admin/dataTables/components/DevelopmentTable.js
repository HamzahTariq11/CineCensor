/* eslint-disable */
import {
  Flex,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useColorModeValue,
  Button,
  Icon,
  Tag,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card";
import React, { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { DeleteIcon, DownloadIcon, EditIcons } from "@chakra-ui/icons";
import {
  MdCloudUpload,
  MdOutlinePanoramaFishEye,
  MdRemoveRedEye,
} from "react-icons/md";
import UploadMenu from "components/menu/UploadMenu";
import DeleteModal from "./DeleteModal";
// import { metaInvoiceDownload } from "api/metaInvoice";
// import { RiAiGenerate, RiRefreshLine } from "react-icons/ri";
// import GenerateModal from "views/admin/dataTables/components/generateModal";
// import { MAUDownload } from "api/MAU";
// import { reportsDownload } from "api/reports";
// import { financeReportsDownload } from "api/financeReports";
import PreviewModal from "./PreviewModal";
import { useHistory } from "react-router-dom";
import Download from "./Download";
import { RiRefreshLine } from "react-icons/ri";
import Process from "./Process";

export default function DevelopmentTable(props) {
  const history = useHistory();
  const { columnsData, tableData, tableName, metaData, getTableData } = props;
  const [selectedRow, setSelectedRow] = useState(false);
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const bgShadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const bgHover = useColorModeValue(
    { bg: "secondaryGray.400" },
    { bg: "whiteAlpha.50" }
  );
  const bgFocus = useColorModeValue(
    { bg: "secondaryGray.300" },
    { bg: "whiteAlpha.100" }
  );
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
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
  const handleDownload = async (filename) => {
    try {
      console.log(filename);
      let response;
      // if (tableName === "Meta Invoice") {
      //   response = await metaInvoiceDownload(filename);
      // } else if (tableName === "Monthly Active Users") {
      //   response = await MAUDownload(filename);
      // } else if (tableName === "Reports") {
      //   response = await reportsDownload(filename);
      // } else if (tableName === "Finance Reports") {
      //   response = await financeReportsDownload(filename);
      // }
      showToastSuccess("File Downloaded Successfully");
      if (response.status == 400) {
        throw { message: response.message };
      }
    } catch (error) {
      console.log(error);
      showToastError(error.message);
    }
  };
  const refresh = async () => {
    await getTableData();
  };
  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      <Flex px="25px" justify="space-between" mb="20px" align="center">
        <Text
          color={textColor}
          fontSize="22px"
          fontWeight="700"
          lineHeight="100%"
        >
          {tableName}
        </Text>
        {tableName === "Processed" ? (
          <>
            <Button
              leftIcon={<Icon as={RiRefreshLine} h="16px" w="16px" me="4px" />}
              onClick={refresh}
              variant="outline"
              color={textColor}
              bg={bgButton}
              _hover={bgHover}
              _focus={bgFocus}
              _active={bgFocus}
            >
              Refresh
            </Button>
          </>
        ) : (
          <>
            <Button
              leftIcon={<Icon as={MdCloudUpload} h="16px" w="16px" me="8px" />}
              onClick={onOpen2}
              variant="outline"
              color={textColor}
              bg={bgButton}
              _hover={bgHover}
              _focus={bgFocus}
              _active={bgFocus}
              // color={textColor}
            >
              Upload
            </Button>
            <UploadMenu
              isOpen={isOpen2}
              onClose={onClose2}
              tablename={tableName}
              getTableData={getTableData}
            />
          </>
        )}
      </Flex>
      <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
        <Thead>
          {headerGroups.map((headerGroup, index) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  pe="10px"
                  key={index}
                  borderColor={borderColor}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    fontSize={{ sm: "10px", lg: "12px" }}
                    color="gray.400"
                  >
                    {column.render("Header")}
                    {/* <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span> */}
                  </Flex>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, index2) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={index2}>
                {row.cells.map((cell, index) => {
                  // let data = "";
                  if (cell.column.Header !== "ACTIONS") {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text>
                      </Td>
                    );
                  } else if (cell.column.Header === "STATUS") {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {/* <Text color={textColor} fontSize="sm" fontWeight="700">
                          {cell.value}
                        </Text> */}
                        <Tag
                          size={size}
                          key={size}
                          variant="solid"
                          colorScheme="teal"
                        >
                          Teal
                        </Tag>
                      </Td>
                    );
                  } else if (cell.column.Header === "ACTIONS") {
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "24px" }}
                        minW={{ sm: "200px", md: "250px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        <Flex align="center" value={row.values.name}>
                          <PreviewModal
                            value={cell.value}
                            key={index2}
                            tableName={tableName}
                          />
                          <Download
                            value={cell.value}
                            key={index2}
                            tableName={tableName}
                          />

                          {tableName === "Processed" ? (
                            <></>
                          ) : (
                            <Process
                              value={cell.value}
                              key={index2}
                              getTableData={getTableData}
                            />
                          )}
                          <DeleteModal
                            value={cell.value}
                            key={index2}
                            tableName={tableName}
                            getTableData={getTableData}
                          />
                        </Flex>
                      </Td>
                    );
                  }
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
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
    </Card>
  );
}
