import { useMemo, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import CloudTable from "../components/CloudTable";
import CloudDialog from "../components/CloudDialog";
import type { Cloud } from "../types/type";
import MultiSelect from "../components/commons/MultiSelect";
import { Bell, BellOff, Search, SlidersHorizontal } from "lucide-react";
import { tableDummyData } from "../assets/dummy/data";
import { sleep } from "../utils/sleep";

const DashboardPage = () => {
  const [activeMenu, setActiveMenu] = useState("Cloud");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [tableData, setTableData] = useState<Cloud[]>([...tableDummyData]);
  const [selectedCloud, setSelectedCloud] = useState<Cloud | undefined>();

  // 🔔 헤더 알림 토글
  const [notiOn, setNotiOn] = useState(true);

  // 🔎 헤더 검색
  const [search, setSearch] = useState("");

  const [filterOptions] = useState<string[]>([
    "Provider: All",
    "Account: All",
    "Status: All",
    "Region: All",
    "Cloud Watcher: All",
  ]);

  // ✅ 검색 필터 데이터 (Account=name 기준)
  const filteredData = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tableData;
    return tableData.filter((row) => row.name.toLowerCase().includes(q));
  }, [search, tableData]);

  // Edit Dialog
  const handleEditDialog = (id: string) => {
    const target = tableData.find((d) => d.id === id);
    if (!target) return;
    setSelectedCloud(target);
    setDialogOpen(true);
  };

  // Delete
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await sleep(Math.random() * 500);
      setTableData((prev) => prev.filter((row) => row.id !== id));

      alert(`${id} 삭제가 완료되었습니다.`);
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ Dialog Submit (Create → 상단 추가 / Edit → 치환)
  const handleDialogSubmit = (payload: Cloud, isEdit: boolean) => {
    if (isEdit) {
      // console.log("Edited:", payload);
      setTableData((prev) =>
        prev.map((row) => (row.id === payload.id ? payload : row))
      );
    } else {
      // console.log("Created:", payload);
      // ⬆️ 최상단으로 추가
      setTableData((prev) => [payload, ...prev]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <SideBar onSelect={() => ""} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-6 pb-2 bg-white flex-shrink-0">
          {/* 헤더 1줄 */}
          <div className="flex justify-between mb-2 content-center">
            <div className="flex gap-2 text-xm">
              <p className="text-gray-400">Users</p>
              <p>{">"}</p>
              <p className="font-bold">Cloud Management</p>
            </div>

            <div className="flex items-center font-bold h-[32px] leading-[32px] gap-2">
              <button
                type="button"
                className={`flex items-center mr-3 ${
                  notiOn ? "text-blue-600" : "text-red-600"
                }`}
                onClick={() => setNotiOn((v) => !v)}
                aria-label="toggle-notification"
              >
                {notiOn ? <Bell size={22} /> : <BellOff size={22} />}
              </button>
              <div className="ml-2">운영자</div>
              <div className="ml-2">SystemAdmin🙋</div>
            </div>
          </div>

          <h1 className="text-2xl font-semibold mb-2">Cloud Management</h1>
          <NavBar activeMenu={activeMenu} onSelect={setActiveMenu} />
        </header>

        <main className="flex-1 p-6 pt-2 overflow-hidden">
          {isDeleting && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-50">
              <div className="bg-white shadow-md px-6 py-3 rounded text-gray-700 font-semibold">
                삭제 중입니다...
              </div>
            </div>
          )}

          {activeMenu === "Cloud" ? (
            <>
              {/* Toolbar */}
              <div className="flex gap-4 mb-4 items-center h-[50px]">
                <div className="w-[240px]">
                  <MultiSelect
                    value={"Account"}
                    options={[{ value: "Account", label: "Account" }]}
                    onChange={() => ""}
                  />
                </div>

                {/* 검색 입력 */}
                <div className="flex items-center relative w-72">
                  <input
                    type="text"
                    placeholder="Search account..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border border-gray-400 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Search
                    size={18}
                    className="absolute right-3 text-gray-400 pointer-events-none"
                  />
                </div>

                <span className="text-gray-300">|</span>

                <button
                  onClick={() => {
                    setSelectedCloud(undefined);
                    setDialogOpen(true);
                  }}
                  className="px-4 py-[6px] bg-white text-blue-600 border-[1.5px] border-blue-600 rounded"
                >
                  + Create Cloud
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex gap-4 mb-4 pb-4 items-center border-b-[2px] border-gray-400">
                <button
                  type="button"
                  className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-blue-600 hover:bg-gray-100 transition-colors"
                  onClick={() => alert("필터 구현 준비중입니다.")}
                >
                  <SlidersHorizontal size={18} />
                  <span>Filter</span>
                </button>
                <span className="text-gray-400">|</span>

                <div className="pl-2 flex gap-2">
                  {filterOptions.map((filter, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="border rounded-2xl bg-gray-200 px-3 py-1 text-[14px] cursor-pointer"
                      onClick={() => alert(`${filter} 기능 구현 준비중입니다.`)}
                    >
                      {filter}
                    </button>
                  ))}
                  <span className="text-gray-400 mx-2">...</span>
                  {/* ✅ more + 알림 */}
                  <button
                    type="button"
                    className="border rounded-2xl px-3 py-1"
                    onClick={() => alert("추가 버튼 기능 구현 준비중입니다.")}
                  >
                    more +
                  </button>
                </div>
              </div>

              {/* 테이블 */}
              <div className="flex-1 overflow-hidden">
                {filteredData.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500 border rounded bg-white">
                    검색어와 일치하는 데이터가 없습니다
                  </div>
                ) : (
                  <CloudTable
                    data={filteredData}
                    onEdit={handleEditDialog}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-[calc(100vh-300px)] text-gray-600 font-medium">
              서비스 준비중입니다.
            </div>
          )}
        </main>

        {/* Dialog */}
        <CloudDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          initialData={selectedCloud}
          onSubmit={handleDialogSubmit}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
