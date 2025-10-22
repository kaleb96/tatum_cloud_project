import { useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import CloudTable from "../components/CloudTable";
import CloudDialog from "../components/CloudDialog";

export const DashboardPage = () => {
  const [activeMenu, setActiveMenu] = useState("Cloud");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 좌측 사이드바 */}
      <SideBar onSelect={(menu) => console.log(`${menu} 클릭됨`)} />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <header className="p-6 pb-2 bg-white">
          <h1 className="text-2xl font-semibold mb-2">Cloud Management</h1>
          <NavBar activeMenu={activeMenu} onSelect={setActiveMenu} />
        </header>

        <main className="flex-1 p-6 pt-2 overflow-auto">
          {activeMenu === "Cloud" && (
            <>
              <CloudTable />
            </>
          )}

          {activeMenu !== "Cloud" && (
            <div className="flex justify-center items-center h-full">
              기능 준비중입니다.
            </div>
          )}
        </main>

        <CloudDialog />
      </div>
    </div>
  );
};

export default DashboardPage;
