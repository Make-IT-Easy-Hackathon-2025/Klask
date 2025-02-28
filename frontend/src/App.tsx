import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./navigation/routes";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";


const App: React.FC = () => {

  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: ROUTES,
    },
  ]);

  return (
      <RouterProvider router={router} />
  );
};

export default App;
