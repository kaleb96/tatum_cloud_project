import React from "react";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectBoxProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  borderColor?: string;
}

const MultiSelect: React.FC<SelectBoxProps> = ({
  label,
  value,
  onChange,
  options,
  className = "",
  borderColor,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none border rounded px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-400 pr-8`} // 기본 여백
          style={{
            borderColor: borderColor || "#d1d5db",
            paddingRight: "2.5rem",
          }}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className={
                opt.disabled
                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                  : "text-gray-800 bg-white"
              }
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* 화살표 아이콘 커스터마이징 */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          ⏷
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
