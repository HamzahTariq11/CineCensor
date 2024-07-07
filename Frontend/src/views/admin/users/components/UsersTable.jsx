import {
  Flex,
  Table,
  Icon,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { DeleteIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons";
import Card from "components/card/Card";
import { MdCheckCircle, MdCancel, MdOutlineError } from "react-icons/md";
import Modal from "../../users/components/modal.jsx";
// import { getUsers } from "api/users.js";
import DeleteModal from "../../../../components/alert/deleteAlert.jsx";
import { IoPersonAdd } from "react-icons/io5";
import { ToastContainer } from "react-toastify";

export default function ColumnsTable(props) {
  const [email, setEmail] = useState();
  const [selectedRow2, setSelectedRow2] = useState();
  const [name, setName] = useState();
  const [role, setRole] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();
  const {
    isOpen: isOpen3,
    onOpen: onOpen3,
    onClose: onClose3,
  } = useDisclosure();
  const { columnsData, tableData, getUserTableData } = props;
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
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 5;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const iconColor = useColorModeValue("secondaryGray.500", "white");
  const deleteColor = useColorModeValue("red.500", "white");
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

  // useEffect(async () => {
  //   setLoading(true);
  //   // let response = await getUsers();
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 2000);
  //   // console.log(response);
  // }, []);

  return (
    <>
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
            Users Manager
          </Text>
          {/* <Menu /> */}
          <Button
            leftIcon={<IoPersonAdd />}
            bg={bgButton}
            _hover={bgHover}
            _focus={bgFocus}
            _active={bgFocus}
            color={textColor}
            // colorScheme="teal"
            variant="outline"
            onClick={onOpen3}
          >
            User
            <Modal
              isOpen={isOpen3}
              onClose={onClose3}
              modalTitle={"Add User"}
              email={""}
              name={""}
              role={""}
              status={""}
              getUserTableData={getUserTableData}
            />
          </Button>
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
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index1) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index1}>
                  {row.cells.map((cell, index) => {
                    if (cell.column.Header === "STATUS") {
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          <Flex align="center">
                            <Icon
                              w="24px"
                              h="24px"
                              me="5px"
                              color={
                                cell.value === "Active"
                                  ? "green.500"
                                  : cell.value === "Inactive"
                                  ? "red.500"
                                  : null
                              }
                              as={
                                cell.value === "Active"
                                  ? MdCheckCircle
                                  : cell.value === "Inactive"
                                  ? MdCancel
                                  : null
                              }
                            />
                            <Text
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell.value}
                            </Text>
                          </Flex>
                        </Td>
                      );
                    } else if (cell.column.Header === "ACTIONS") {
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          <Flex align="center">
                            <Flex onClick={onOpen}>
                              <EditIcon
                                me="16px"
                                h="18px"
                                w="19px"
                                color={textColor}
                                onClick={() => {
                                  console.log(row.values.name);
                                  console.log(row.values.status);
                                  console.log(row.values.role);
                                  setEmail(row.values.email);
                                  setName(row.values.name);
                                  setRole(row.values.role);
                                  setStatus(row.values.status);
                                }}
                              />
                              <Modal
                                isOpen={isOpen}
                                onClose={onClose}
                                modalTitle={"Update User"}
                                email={email}
                                name={name}
                                role={role}
                                status={status}
                                getUserTableData={getUserTableData}
                              />
                            </Flex>
                            <Flex onClick={onOpen2}>
                              <DeleteIcon
                                me="16px"
                                h="18px"
                                w="19px"
                                color={deleteColor}
                                onClick={() => {
                                  setSelectedRow2(row.values.email);
                                }}
                              />
                              <DeleteModal
                                isOpen={isOpen2}
                                onClose={onClose2}
                                value={selectedRow2}
                                tableName={"Users"}
                                getTableData={getUserTableData}
                              />
                            </Flex>
                          </Flex>
                        </Td>
                      );
                    } else {
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                        >
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        </Td>
                      );
                    }
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Card>
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
