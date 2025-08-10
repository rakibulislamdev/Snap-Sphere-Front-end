import { Outlet } from "react-router";
import FloatingNavbar from "../common/FloatingNavbar";
export default function MainLayout() {
  return (
    <div>
      <FloatingNavbar />
      <div className="max-w-6xl mx-auto w-full h-full">
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
