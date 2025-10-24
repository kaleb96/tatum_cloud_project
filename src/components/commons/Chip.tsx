// 간단한 칩(뱃지) 컴포넌트
const Chip = ({
  children,
  color = "blue",
}: {
  children: React.ReactNode;
  color?: "blue" | "red" | "yellow";
}) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 ring-blue-200",
    red: "bg-red-50 text-red-600 ring-red-200",
    yellow: "bg-yellow-50 text-yellow-700 ring-yellow-200",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${colors[color]}`}
    >
      {children}
    </span>
  );
};

export default Chip;
