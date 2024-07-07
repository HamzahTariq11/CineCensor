import SignInCentered from "views/auth/signIn";
import forgotPassword from "views/auth/forgot-password";
import { MdLock } from "react-icons/md";
import { Icon } from "@chakra-ui/react";

const routes = [
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/forgot-password",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: forgotPassword,
  },
];

export default routes;
