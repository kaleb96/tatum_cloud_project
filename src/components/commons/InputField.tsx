interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: InputFieldProps) => {
  return (
    <div className="mb-4">
      <label className="block mb-1 text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
};

export default InputField;
