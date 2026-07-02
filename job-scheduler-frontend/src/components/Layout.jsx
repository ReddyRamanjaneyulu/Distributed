import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
