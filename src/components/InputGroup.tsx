import React from "react";

const InputGroup: React.FC<any> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
}) => {
  return (
    <div className="text-left mb-3">
      <label className="text-gray-400">
        {label}
        <input
          className="w-full bg-slate-100 p-2 mb-1 border-0 outline-0 rounded-md text-black focus:border-pink-900 focus:border-2"
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </label>
      {error && (
        <span className="block text-red-500 p-1 bg-red-100 rounded-md">
          {error}
        </span>
      )}
    </div>
  );
};

export default InputGroup;
