import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES } from "./navigation/routes";
import NotFoundPage from "./pages/NotFoundPage";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthProvider";
import "./App.css";

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
