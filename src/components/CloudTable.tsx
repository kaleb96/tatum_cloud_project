import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit2,
  Trash2,
  Router,
  CloudCheck,
  RotateCw,
  Columns3,
} from "lucide-react";
import Chip from "./commons/Chip";
import type { Cloud, Provider } from "../types/type";

interface CloudTableProps {
  data: Cloud[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const CloudTable = ({ data, onEdit, onDelete }: CloudTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(30);

  const dummyButtons = [
    "Global Proxy",
    "Register New Cloud",
    "Refresh",
    "Customize Columns",
  ];

  const columns = useMemo<ColumnDef<Cloud>[]>(
    () => [
      {
        accessorKey: "provider",
        enableSorting: true,
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold text-gray-800"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Provider
            {column.getIsSorted() === "asc" ? (
              <ArrowUp size={14} className="ml-2" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown size={14} className="ml-2" />
            ) : (
              <ArrowUpDown size={14} className="text-gray-400 ml-2" />
            )}
          </button>
        ),
        cell: ({ getValue }) => {
          const provider = getValue<Provider>();
          const emoji =
            provider === "AWS" ? "🟠" : provider === "AZURE" ? "🔷" : "🟡";
          return (
            <div className="flex items-center gap-2">
              <span className="text-lg">{emoji}</span>
              <span className="text-gray-800">{provider}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        enableSorting: true,
        header: "Account",
        cell: ({ getValue }) => <span>{getValue<string>()}</span>,
      },
      { accessorKey: "cloudGroupName", header: "Cloud Group" },
      {
        accessorKey: "accountId",
        header: "Account ID",
        cell: ({ row }) => {
          const prov = row.original.provider as "AWS" | "AZURE" | "GCP";
          const cred = row.original.credentials as any;
          const map = {
            AWS: cred?.accessKeyId,
            AZURE: cred?.tenantId,
            GCP: cred?.projectId,
          } as const;
          return <span>{map[prov] || row.original.id}</span>;
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const ok = getValue<boolean>();
          return (
            <Chip color={ok ? "blue" : "red"}>{ok ? "READY" : "ERROR"}</Chip>
          );
        },
      },
      {
        accessorKey: "eventProcessEnabled",
        header: "Event Process",
        cell: ({ getValue }) =>
          getValue<boolean>() ? (
            <Chip>VALID</Chip>
          ) : (
            <Chip color="yellow">INVALID</Chip>
          ),
      },
      {
        accessorKey: "scheduleScanEnabled",
        header: "Scan Schedule",
        cell: ({ getValue }) => (getValue<boolean>() ? "ON" : "Not Set"),
      },
      {
        accessorKey: "userActivityEnabled",
        header: "Realtime",
        cell: ({ getValue }) => (
          <span
            className={
              getValue<boolean>()
                ? "text-green-600 font-semibold"
                : "text-gray-400 font-semibold"
            }
          >
            {getValue<boolean>() ? "ON" : "OFF"}
          </span>
        ),
      },
      {
        accessorKey: "eventSource",
        header: "Event Source",
        cell: ({ row }) => {
          const { provider, eventSource } = row.original;
          if (!eventSource)
            return <span className="text-gray-400 italic">N/A</span>;
          const value =
            provider === "AWS"
              ? (eventSource as any)?.cloudTrailName
              : provider === "AZURE"
              ? (eventSource as any)?.storageAccountName
              : (eventSource as any)?.pubSubTopic;
          return (
            <span className="text-gray-700">
              {value || <span className="text-gray-400 italic">N/A</span>}
            </span>
          );
        },
      },
      {
        accessorKey: "regionList",
        header: "Regions",
        cell: ({ row }) => {
          const { regionList } = row.original;
          const more = regionList.length;
          return more > 1 ? (
            <span>{`${regionList[0]} +${more - 1}...`}</span>
          ) : (
            <span>{regionList}</span>
          );
        },
      },
      {
        accessorKey: "proxyUrl",
        header: "Proxy",
        cell: ({ row }) => {
          const { proxyUrl } = row.original;
          return proxyUrl ? <span>{proxyUrl}</span> : <span>N/A</span>;
        },
      },
      {
        accessorKey: "credentialType",
        header: "Credential Type",
        cell: ({ row }) => {
          const { credentialType, provider } = row.original;
          return (
            <span className="text-gray-800 font-medium">
              {provider}: {credentialType || "N/A"}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination: { pageIndex: 0, pageSize } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="relative bg-white rounded-md overflow-hidden h-full">
      {/* 상단 Total + 버튼 */}
      <div className="flex justify-between my-4 items-center px-2">
        <p className="text-gray-600 text-[14px] px-2">Total {data.length}</p>
        <div className="flex text-blue-600 font-bold text-[12px] gap-2">
          {dummyButtons.map((btn, i) => (
            <button
              key={i}
              className="flex items-center gap-2 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50 transition"
              onClick={() => alert(`${btn} 기능 구현 준비중입니다.`)}
            >
              {btn === "Global Proxy" && <Router size={14} />}
              {btn === "Register New Cloud" && <CloudCheck size={14} />}
              {btn === "Refresh" && <RotateCw size={14} />}
              {btn === "Customize Columns" && <Columns3 size={14} />}
              <span>{btn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ 테이블 본체 - 스크롤 내부 */}
      <div className="h-[calc(100vh-420px)] overflow-auto">
        <table className="min-w-[1600px] w-full border-collapse text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10 border-b-[2px] border-gray-400">
            {table.getHeaderGroups().map((hg, idx) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                    style={{ minWidth: "160px" }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
                <th className="sticky right-0 bg-gray-50 px-4 py-3 text-center font-semibold shadow-[rgba(0,0,0,0.1)_-4px_0px_6px_0px]">
                  Actions
                </th>
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={
                  'hover:bg-gray-50 transition-colors duration-150 "border-b border-gray-200'
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-4 py-3 whitespace-nowrap"
                    style={{ minWidth: "160px" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="sticky right-0 bg-white px-4 py-3 text-center shadow-[rgba(0,0,0,0.12)_-4px_0px_6px_0px]">
                  <div className="flex justify-center gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => onEdit(row.original.id)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => onDelete(row.original.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CloudTable;
