import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./navigation/routes";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import { AuthProvider } from "./pages/context/AuthProvider";


const App: React.FC = () => {

  const router = createBrowserRouter([
    {
      element: <Layout />,
      errorElement: <NotFoundPage />,
      children: ROUTES,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
