import { useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import CloudTable from "../components/CloudTable";
import CloudDialog from "../components/CloudDialog";
import type { Cloud } from "../types/type";
import MultiSelect from "../components/commons/MultiSelect";
import { Filter, Search } from "lucide-react";
import { tableDummyData } from "../assets/dummy/data";

const DashboardPage = () => {
  const [activeMenu, setActiveMenu] = useState("Cloud");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCloud, setSelectedCloud] = useState<Cloud | undefined>();
  const [filterOptions, setFilterOptions] = useState<string[]>([
    "Provider: All",
    "Account: All",
    "Status: All",
    "Region: All",
    "Cloud Watcher: All",
  ]);

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
              {/** Toolbar 영역 */}
              <div className="flex gap-4 mb-4">
                <div>
                  <MultiSelect
                    value={"Account"}
                    options={[{ value: "Account", label: "Account" }]}
                    onChange={() => ""}
                  />
                </div>
                <div className="relative w-72">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full border rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Search
                    size={18}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
                |
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
              {/** Filter 영역 */}
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  className="
                    flex items-center gap-2
                    px-3 py-2
                    border rounded-2xl
                    text-sm font-medium
                    text-gray-700
                    hover:bg-gray-100 hover:text-blue-600
                    transition-colors
                    "
                  onClick={() => console.log("Filter button clicked!")}
                >
                  <Filter size={18} />
                  <span>Filter</span>
                </button>
                |
                {filterOptions.map((filter, idx) => (
                  <button
                    key={idx}
                    type={"button"}
                    className="border rounded-2xl bg-gray-300 p-1"
                  >
                    {filter}
                  </button>
                ))}
                ...
                <button type="button" className="border rounded-2xl p-1">
                  more +
                </button>
              </div>
              <hr />
              {/** 테이블 영역 */}
              <CloudTable
                data={tableDummyData}
                onEdit={() => dialogOpen}
                onDelete={() => ""}
              />
            </>
          )}

          {activeMenu !== "Cloud" && (
            <div className="flex justify-center items-center h-full">
              <p>기능 준비중입니다.</p>
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
