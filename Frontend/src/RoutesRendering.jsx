import React from 'react'
import { Route, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";

export default function RoutesRendering() {
    const getToken = () => {
        const token = localStorage.getItem("token");
        return token || false;
      };
      const role = localStorage.getItem('role') 
    const routes = ()=>{
        if(getToken() && role === 'Admin'){
            <>
            <Route path={`/admin`} component={AdminLayout} />
                <Redirect from="/" to="/admin" />
                </>
        }else{
            <>
            <Route path={`/auth`} component={AuthLayout} />
            <Redirect from="/" to="/auth/sign-in" />
          </>
        }
    }
  return (
    <>{
        (getToken() && role === 'Admin')?
            <>
            <Route path={`/admin`} component={AdminLayout} />
                <Redirect from="/" to="/admin" />
                </>
        :
            <>
            <Route path={`/auth`} component={AuthLayout} />
            <Redirect from="/" to="/auth/sign-in" />
          </>
    }</>
  )
}
// {getToken && role === "Admin" ? (
//     <>
//       <Route path={`/admin`} component={AdminLayout} />
//       <Redirect from="/" to="/admin" />
//     </>
//   ) : getToken && role === "Finance" ? (
//     <>
//       <Route path={`/finance`} component={financeLayout} />
//       <Redirect from="/" to="/finance/finance-reports" />
//     </>
//   ) : (
//     <>
//       <Route path={`/auth`} component={AuthLayout} />
//       <Redirect from="/" to="/auth/sign-in" />
//     </>
//   )}