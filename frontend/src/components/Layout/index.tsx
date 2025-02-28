import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import LoadingPage from "../../pages/LoadingPage";

export default function Layout() {
  return (
    <main>
      <Suspense fallback={<LoadingPage />}>
        <Outlet />
      </Suspense>
    </main>
  );
}