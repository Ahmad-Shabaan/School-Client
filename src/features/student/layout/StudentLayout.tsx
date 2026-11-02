import { Outlet } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import StudentFooter from "../components/StudentFooter";

const StudentLayout = () => {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="flex min-h-svh flex-col bg-paper font-tajawal text-body"
    >
      <StudentHeader />
      <div className="flex w-full flex-1 flex-col">
        <Outlet />
      </div>
      <StudentFooter />
    </div>
  );
};

export default StudentLayout;