import React from "react";
import { RouteObject } from "react-router-dom";
import { PATHS } from "./paths";
import HomePage from "../pages/HomePage";
import Groups from "../pages/Groups";
import ProfilePage from "../pages/ProfilePage";

const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));
const LandingPage = React.lazy(() => import("../pages/LandingPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const InboxPage = React.lazy(()=>import ("../pages/Inbox"));

export const ROUTES: RouteObject[] = [
  {
    path: PATHS.LANDING_PAGE,
    element: <LandingPage />,
  },
  {
    path: PATHS.LOGIN_PAGE,
    element: <LoginPage />,
  },
  {
    path: PATHS.HOME_PAGE,
    element: <HomePage/>,
  },
  {
    path: PATHS.REGISTER_PAGE,
    element: <RegisterPage/>,
  },
  {
    path: PATHS.GROUPS,
    element: <Groups/>
  },
  {
    path: PATHS.INBOX,
    element: <InboxPage/>
  },
  {
    path: PATHS.PROFILE,
    element: <ProfilePage/>
  }
];