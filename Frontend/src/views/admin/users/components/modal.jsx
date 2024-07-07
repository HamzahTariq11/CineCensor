import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormLabel,
  Input,
  FormControl,
  InputRightElement,
  InputGroup,
  Select,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import { getOneUser } from "api/user";
import { updateUser } from "api/user";
import { userPOST } from "api/user";
import { getRole } from "api/user";
import { LoadingSpinner } from "components/loading/loadingSpinner";
import react, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function InitialFocus({
  isOpen,
  onClose,
  modalTitle,
  email,
  role,
  name,
  status,
  getUserTableData,
}) {
  // const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);
  
  
  const [options, setOptions] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    roleId: "",
    status: status,
  });
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
  useEffect(async () => {
    try {
      setRoleLoading(true);
      if (modalTitle === "Add User") {
        let res = await getRole();
        setOptions(res);
      } else if (modalTitle === "Update User") {
        let res = await getRole();
        setOptions(res);
        console.log(res);
        // setFormData({
        //   firstName: name,
        //   lastName: name,
        //   email: email,
        //   password: "",
        //   roleId: findId(role),
        //   status: status === "Active" ? "1" : "0",
        // });
      }
      setRoleLoading(false);
    } catch (error) {
      setError(error);
      showToastError(error.message);
    }
  }, []);
  const handleChange = (e) => {
    if (e == "0" || e == "1") {
      setFormData((prevData) => ({
        ...prevData,
        status: e,
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const [show, setShow] = useState(false);
  const handleClick = () => {
    (async () => {
      try {
        if (modalTitle == "Add User") {
          setLoading(true);
          const res = await userPOST(
            formData.firstName,
            formData.lastName,
            formData.email,
            formData.password,
            formData.roleId,
            formData.status
          );
          if (res.status == 200) {
            showToastSuccess(res.message);
            await getUserTableData();
          }
          setLoading(false);
          onClose(true);
        } else {
          setLoading(true);
          // console.log(formData);
          const res = await updateUser(
            email,
            ["first_name", "last_name", "username", "role_id", "status"],
            [
              formData.firstName,
              formData.lastName,
              formData.email,
              formData.roleId,
              formData.status,
            ]
          );
          if (res.status == 200) {
            showToastSuccess(res.message);
            await getUserTableData();
          }
          setLoading(false);
          onClose(true);
          setFormData({});
        }
      } catch (error) {
        console.log(error);
        showToastError(error.message);
      }
      setLoading(false);
      setFormData({});
      onClose(true);
    })();
  };

  const findId = (Role) => {
    for (let a in options) {
      if (a.includes(Role)) {
        return a[0];
      }
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={(val) => {
          onClose(val);
          setFormData({});
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            {/* {roleLoading ? (
              <LoadingSpinner />
            ) : (
              <> */}
            <FormControl>
              <FormLabel>First name</FormLabel>
              <Input
                onChange={handleChange}
                placeholder="First name"
                value={formData.firstName}
                name="firstName"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Last name</FormLabel>
              <Input
                onChange={handleChange}
                placeholder="Last name"
                value={formData.lastName}
                name="lastName"
              />
            </FormControl>
            {modalTitle === "Add User" ? (
              <>
                <FormControl mt={4}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    onChange={handleChange}
                    placeholder="jhonDeo@example.com"
                    value={formData.email}
                    name="email"
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup size="md">
                    <Input
                      onChange={handleChange}
                      pr="4.5rem"
                      value={formData.password}
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                      name="password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShow(!show)}
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </>
            ) : (
              <></>
            )}

            <FormControl mt={4}>
              <FormLabel>Role </FormLabel>
              <Select
                placeholder="Select Role"
                value={formData.roleId}
                onChange={handleChange}
                name="roleId"
                // defaultChecked={}
              >
                {options.map((option) => (
                  <option key={option[0]} value={option[0]}>
                    {option[1]}
                  </option>
                ))}
              </Select>
            </FormControl>
            {/* </>
            )} */}
            {modalTitle === "Add User" ? (
              <></>
            ) : (
              <>
                <FormLabel mt={4}>Status </FormLabel>
                <RadioGroup
                  name="status"
                  onChange={handleChange}
                  value={formData.status}
                  defaultValue={"1"}
                >
                  <Stack direction="row">
                    <Radio value="1" name="status">
                      Active
                    </Radio>
                    <Radio value="0" name="status">
                      In Active
                    </Radio>
                  </Stack>
                </RadioGroup>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleClick}
              isLoading={loading}
              colorScheme="brand"
              mr={3}
              loadingText="Updating"
            >
              Save
            </Button>
            <Button colorScheme="gray" mr={-3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost"></Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </>
  );
}
