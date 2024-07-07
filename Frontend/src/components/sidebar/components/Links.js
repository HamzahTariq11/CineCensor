/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsLockFill } from "react-icons/bs";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    if (routeName) {
      return location.pathname.includes(routeName);
    }
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.layout === "/admin" || route.layout === "/auth") {
        return (
          <NavLink key={index} to={route.layout + route.path}>
            {route.icon && (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py="5px"
                  ps="10px"
                >
                  <Flex w="100%" alignItems="center" justifyContent="center">
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeIcon
                          : textColor
                      }
                      me="18px"
                    >
                      {route.icon}
                    </Box>
                    <Text
                      me="auto"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? "bold"
                          : "normal"
                      }
                    >
                      {route.name}
                    </Text>
                  </Flex>
                  <Box
                    h="36px"
                    w="4px"
                    bg={
                      activeRoute(route.path.toLowerCase())
                        ? brandColor
                        : "transparent"
                    }
                    borderRadius="5px"
                  />
                </HStack>
              </Box>
            )}

            {/* : (
            <Box>
                 <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py="5px"
                  ps="10px"
                >
                  <Text
                    me="auto"
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }
                  >
                    {route.name}
                  </Text>
                  <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                </HStack>
              </Box>
            )} */}
          </NavLink>
        );
      } else if (route.layout === "/finance") {
        return (
          <Box>
            {route.path ? (
              <HStack
                spacing={
                  activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                }
                py="5px"
                ps="10px"
              >
                <Flex w="100%" alignItems="center" justifyContent="center">
                  <Box color={activeIcon} me="18px">
                    {route.icon}
                  </Box>
                  <Text me="auto" color={activeColor} fontWeight={"bold"}>
                    {route.name}
                  </Text>
                  {!route.path ? (
                    <Icon
                      as={BsLockFill}
                      width="20px"
                      height="20px"
                      color="inherit"
                    />
                  ) : (
                    <></>
                  )}
                </Flex>
                <Box h="36px" w="4px" bg={brandColor} borderRadius="5px" />
              </HStack>
            ) : (
              <>
                <HStack spacing={"26px"} py="5px" ps="10px">
                  <Flex w="100%" alignItems="center" justifyContent="center">
                    <Box color={textColor} me="18px">
                      {route.icon}
                    </Box>
                    <Text me="auto" color={textColor} fontWeight={"normal"}>
                      {route.name}{" "}
                      {!route.path ? (
                        <Icon
                          as={BsLockFill}
                          width="12px"
                          height="15px"
                          color="inherit"
                        />
                      ) : (
                        <></>
                      )}
                    </Text>
                  </Flex>
                  <Box h="36px" w="4px" bg={"transparent"} borderRadius="5px" />
                </HStack>
              </>
            )}
          </Box>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
