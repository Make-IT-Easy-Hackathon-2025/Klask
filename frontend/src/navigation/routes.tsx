import React from "react";
import { RouteObject } from "react-router-dom";
import { PATHS } from "./paths";

import GroupPageLeaderBoard from "../pages/Group/LeaderBoardPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import ChallengesPage from "../pages/Group/ChallengesPage";
import ShopPage from "../pages/Group/ShopPage";
import ShopItemDetailPage from "../pages/Group/ShopDetailPage";

const RegisterPage = React.lazy(() => import("../pages/RegisterPage"));
const LandingPage = React.lazy(() => import("../pages/LandingPage"));
const LoginPage = React.lazy(() => import("../pages/LoginPage"));
const InboxPage = React.lazy(() => import("../pages/Inbox"));

const Manage = React.lazy(() => import("../pages/AdminPage"));

  const ChallengesDetailedPage = React.lazy(() => import("../pages/Group/ChallengeDetailPage"));

  
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
    element: <HomePage />,
  },
  {
    path: PATHS.REGISTER_PAGE,
    element: <RegisterPage />,
  },
  {
    path: PATHS.GROUP_LEADERBOARD,
    element: <GroupPageLeaderBoard />,
  },
  {
    path: PATHS.INBOX,
    element: <InboxPage />,
  },
  {
    path: PATHS.PROFILE,
    element: <ProfilePage />,
  },
  {
    path: PATHS.GROUP_MANAGE,
    element: <Manage />
  },
 {
    path: PATHS.GROUP_CHALLENGES,
    element: <ChallengesPage />,
  },
  {
    path: PATHS.GROUP_CHALLENGE_DETAIL,
    element: <ChallengesDetailedPage />,
  },
  {
    path: PATHS.GROUP_SHOP,
    element: <ShopPage/>
  },
  {
    path: PATHS.GROUP_SHOP_ITEM,
    element: <ShopItemDetailPage/>
  }
];
