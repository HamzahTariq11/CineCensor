import React from "react";

import { Icon } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from "react-icons/md";
import { FaMeta } from "react-icons/fa6";
import { ImUsers } from "react-icons/im";
import { HiDocumentChartBar } from "react-icons/hi2";

import DataTables from "views/admin/dataTables";

const routes = [
  {
    name: "Dashboard",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Finance Reports",
    layout: "/finance",
    icon: (
      <Icon
        as={HiDocumentChartBar}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/finance-reports",
    component: DataTables,
  },
  {
    name: "Reports",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Monthly Active Users",
    icon: <Icon as={ImUsers} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Meta Invoice",
    icon: <Icon as={FaMeta} width="20px" height="20px" color="inherit" />,
  },
  {
    name: "Users",
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
  },
];

export default routes;
