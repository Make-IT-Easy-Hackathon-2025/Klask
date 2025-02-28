import React from "react";
import { RouteObject } from "react-router-dom";
import { PATHS } from "./paths";
import GroupPage from "../pages/GroupPageLeaderBoard";
import GroupPageLeaderBoard from "../pages/GroupPageLeaderBoard";

const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));
const LandingPage = React.lazy(() => import("../pages/LandingPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));

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
    element: <LoginPage />,
  },
  {
    path: PATHS.REGISTER_PAGE,
    element: <RegisterPage/>,
  },
  {
    path: PATHS.GROUP_PAGE_LEADERBOARD,
    element: <GroupPageLeaderBoard/>
  }
];