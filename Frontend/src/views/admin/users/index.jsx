import React, { useState, useEffect } from "react";
import ComplexTable from "views/admin/users/components/UsersTable";
import { columnsDataComplex } from "views/admin/dataTables/variables/columnsData";
import tableDataComplex from "views/admin/dataTables/variables/tableDataComplex.json";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { getUser } from "api/user";
import { LoadingSpinner } from "components/loading/loadingSpinner";
import { ToastContainer } from "react-toastify";

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getUserTableData = async () => {
    try {
      setLoading(true);
      let res = await getUser();
      setData(res);
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  };
  useEffect(async () => {
    await getUserTableData();
  }, []);
  const tableDataComplex = data.map((entry) => {
    const email = entry[0];
    const name = entry[1];
    const role = entry[2];
    const status = entry[3] === 0 ? "Inactive" : "Active";
    const actions = entry[0];

    return {
      name: name,
      status: status,
      email: email,
      role: role,
      actions: actions,
    };
  });
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
            <ComplexTable
              columnsData={columnsDataComplex}
              tableData={tableDataComplex}
              getUserTableData={getUserTableData}
            />
          )}
        </SimpleGrid>
      </Box>
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
