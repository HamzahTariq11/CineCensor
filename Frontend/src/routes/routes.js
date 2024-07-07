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

// Admin Imports
import MainDashboard from "views/admin/default";
import DataTables from "views/admin/dataTables";
import videoProcess from "views/admin/videoprocessing/index.jsx";
import videoPreview from "views/admin/videopreview/index.jsx";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Uploads",
    layout: "/admin",
    icon: (
      <Icon
        as={HiDocumentChartBar}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    path: "/uploads",
    component: DataTables,
  },
  {
    name: "Processed",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: "/processed",
    component: DataTables,
  },
  {
    name: "Video Preview",
    layout: "/admin",
    path: "/video/preview",
    component: videoPreview,
  },
  {
    name: "Video Process",
    layout: "/admin",
    path: "/video/process",
    component: videoProcess,
  },
];

export default routes;
