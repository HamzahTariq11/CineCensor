import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import DeleteAlert from "components/alert/deleteAlert";
import React from "react";

export default function DeleteModal({ value, tableName, getTableData }) {
  const deleteColor = useColorModeValue("red.500", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [id, ...rest] = value.split(",");
  return (
    <Flex onClick={onOpen}>
      <DeleteIcon me="16px" h="18px" w="19px" color={deleteColor} />
      <DeleteAlert
        isOpen={isOpen}
        onClose={onClose}
        tableName={tableName}
        value={id}
        getTableData={getTableData}
      />
    </Flex>
  );
}
