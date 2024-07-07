import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { Switch, BrowserRouter, HashRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import RoutesRendering from "RoutesRendering";
import { Route, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
const getToken = () => {
  const token = localStorage.getItem("token");
  return token || false;
};
const role = localStorage.getItem("roleName") || false;
ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <HashRouter>
          <Switch>
            <>
              {getToken() ? (
                <>
                  <Route path="/admin" component={AdminLayout} />
                  <Redirect from="/" to="/admin/default" />
                </>
              ) : (
                <>
                  <Route path="/auth" component={AuthLayout} />
                  <Redirect from="/" to="/auth" />
                </>
              )}
            </>
          </Switch>
        </HashRouter>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
