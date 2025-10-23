import { useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import CloudTable from "../components/CloudTable";
import CloudDialog from "../components/CloudDialog";
import type { Cloud } from "../types/type";

const DashboardPage = () => {
  const [activeMenu, setActiveMenu] = useState("Cloud");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCloud, setSelectedCloud] = useState<Cloud | undefined>();

  const dummyData: Cloud[] = [
    {
      id: "1",
      name: "AWS Dev",
      provider: "AWS",
      cloudGroupName: ["AWS Group"],
      regionList: ["global", "ap-northeast-2"],
      eventProcessEnabled: true,
      userActivityEnabled: true,
      scheduleScanEnabled: false,
      credentials: {
        accessKeyId: "AKIA********18",
        secretAccessKey: "jZd1********0n",
      },
      credentialType: "ACCESS_KEY",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 좌측 사이드바 */}
      <SideBar onSelect={(menu) => console.log(`${menu} 클릭됨`)} />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col">
        <header className="p-6 pb-2 border-b bg-white">
          <h1 className="text-2xl font-semibold mb-2">Cloud Management</h1>
          <NavBar activeMenu={activeMenu} onSelect={setActiveMenu} />
        </header>

        <main className="flex-1 p-6 pt-2 overflow-auto">
          {activeMenu === "Cloud" && (
            <>
              <div className="flex justify-between mb-4">
                <span className="font-medium text-gray-700">Account</span>
                <button
                  onClick={() => {
                    setSelectedCloud(undefined);
                    setDialogOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  + Create Cloud
                </button>
              </div>

              <CloudTable />
            </>
          )}

          {activeMenu !== "Cloud" && (
            <div className="flex justify-center items-center h-full">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => alert(`${activeMenu} 기능은 준비중입니다.`)}
              >
                {activeMenu} Alert
              </button>
            </div>
          )}
        </main>

        <CloudDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          initialData={selectedCloud}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
