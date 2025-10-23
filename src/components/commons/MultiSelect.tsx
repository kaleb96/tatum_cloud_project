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
}

const MultiSelect: React.FC<SelectBoxProps> = ({
  label,
  value,
  onChange,
  options,
  className = "",
}) => {
  return (
    <div className={`flex flex-col mb-3 ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm outline-none bg-white focus:ring-2 focus:ring-blue-400"
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
    </div>
  );
};

export default MultiSelect;
