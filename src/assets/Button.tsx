import React from "react";
import Spinner from "./Spinner";

const Button: React.FC<any> = ({ label, onClick, loading, error }) => {
  return (
    <>
      <button
        className={`w-full p-2 lg:p-2.5 rounded mt-8 font-semibold bg-pink-950
        outline-0 text-white ${
          loading ? "cursor-not-allowed" : "hover:bg-pink-900"
        }`}
        onClick={onClick}
      >
        {loading ? <Spinner /> : label}
      </button>
      <span className="text-red-500">{error}</span>
    </>
  );
};

export default Button;
