import { createBrowserRouter, Navigate } from "react-router-dom";
import Collections from "./Page/Collections/Collections";
import Create from "./Page/Create/Create";
import Navbar from "./assets/Component/Navbar/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/create" />,
  },
  {
    path: "/collections",
    element: (
      <>
        <Navbar />
        <Collections />
      </>
    ),
  },
  {
    path: "/create",
    element: (
      <>
        <Navbar />
        <Create />
      </>
    ),
  },
]);

export default router;
