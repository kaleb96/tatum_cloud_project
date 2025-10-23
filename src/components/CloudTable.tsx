import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { Cloud, Provider } from "../types/type";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Edit2, Trash2 } from "lucide-react";
import Chip from "./commons/Chip";
import type { TableCloud } from "../assets/dummy/data";

interface CloudTableProps {
  data: TableCloud[];
  onEdit: (cloud: TableCloud) => void;
  onDelete: (id: string) => void;
}

const CloudTable = ({ data, onEdit, onDelete }: CloudTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pageSize, setPageSize] = useState(30);

  const columns = useMemo<ColumnDef<TableCloud>[]>(
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
              <ArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown size={14} />
            ) : (
              <ArrowUpDown size={14} className="text-gray-400" />
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
        header: ({ column }) => (
          <button
            className="flex items-center gap-1 font-semibold text-gray-800"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Account
            {column.getIsSorted() === "asc" ? (
              <ArrowUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown size={14} />
            ) : (
              <ArrowUpDown size={14} className="text-gray-400" />
            )}
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="text-gray-900">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "cloudGroupName",
        header: "Cloud Group",
        cell: ({ getValue }) => {
          const arr = (getValue<string[]>() ?? []).slice(0, 2);
          return (
            <div className="flex items-center gap-1">
              {arr.map((g, i) => (
                <span
                  key={i}
                  className="rounded-full bg-blue-50 text-blue-600 text-xs px-2 py-0.5"
                >
                  {g}
                </span>
              ))}
            </div>
          );
        },
      },
      { accessorKey: "organization", header: "Organization" },
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
          return (
            <span className="text-gray-800">
              {map[prov] || row.original.accountId}
            </span>
          );
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
            return <span className="text-gray-400 italic">Not Set</span>;
          const value =
            provider === "AWS"
              ? (eventSource as any)?.cloudTrailName
              : (eventSource as any)?.storageAccountName;
          return (
            <span className="text-gray-700">
              {value || <span className="text-gray-400 italic">N/A</span>}
            </span>
          );
        },
      },
      // 고정 버튼들
      {
        id: "edit",
        header: () => <div className="text-right pr-3">Edit</div>,
        cell: ({ row }) => (
          <div className="text-right pr-3 sticky right-12 bg-white">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => onEdit(row.original)}
            >
              <Edit2 size={18} />
            </button>
          </div>
        ),
        size: 64,
      },
      {
        id: "delete",
        header: () => <div className="text-right pr-4">Delete</div>,
        cell: ({ row }) => (
          <div className="text-right pr-4 sticky right-0 bg-white">
            <button
              className="text-red-600 hover:text-red-800"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ),
        size: 64,
      },
    ],
    [onEdit, onDelete]
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

  const handlePageSize = (n: number) => {
    setPageSize(n);
    table.setPageSize(n);
  };

  const pageFrom =
    table.getState().pagination.pageIndex *
      table.getState().pagination.pageSize +
    1;
  const pageTo = Math.min(
    pageFrom + table.getState().pagination.pageSize - 1,
    data.length
  );

  return (
    <div className="relative">
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-[1200px] w-full border-collapse text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b">
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: Pagination + Items per page */}
      <div className="mt-2 flex items-center justify-between rounded-md border bg-white px-3 py-2 text-sm">
        <div className="flex items-center gap-1">
          <button
            className="px-2 py-1 rounded border disabled:opacity-40"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </button>
          <button
            className="px-2 py-1 rounded border disabled:opacity-40"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </button>

          <span className="mx-2 inline-flex items-center justify-center rounded bg-blue-600 px-3 py-1 text-white">
            {table.getState().pagination.pageIndex + 1}
          </span>

          <button
            className="px-2 py-1 rounded border disabled:opacity-40"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </button>
          <button
            className="px-2 py-1 rounded border disabled:opacity-40"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            »
          </button>

          <span className="ml-3 text-gray-600">
            {pageFrom} - {pageTo} of {data.length} items
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600">Items per page</span>
          <select
            className="rounded border px-2 py-1"
            value={pageSize}
            onChange={(e) => handlePageSize(Number(e.target.value))}
          >
            {[10, 30, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CloudTable;
