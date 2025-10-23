import React from "react";

export interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string; // 같은 name이면 한 그룹으로 묶임
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
  label?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  value,
  onChange,
  options,
  label,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <p className="text-sm font-medium mb-1">{label}</p>}
      <div className="flex gap-6">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 text-sm ${
              opt.disabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-800"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => !opt.disabled && onChange(opt.value)}
              disabled={opt.disabled}
              className="cursor-pointer accent-blue-600 disabled:accent-gray-300"
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
