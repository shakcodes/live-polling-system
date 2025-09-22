import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setRole } from "../features/authSlice";
import { BsStars } from "react-icons/bs";

export default function Landing() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      {/* Badge */}
      <span className="flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] text-white rounded-full font-medium text-sm sm:text-base">
        <BsStars className="text-lg sm:text-xl" />
        <span>Intervue Poll</span>
      </span>

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 leading-snug">
        Welcome to the{" "}
        <span className="text-purple-600">Live Polling System</span>
      </h1>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">
        Please select the role that best describes you
      </p>

      {/* Cards */}
      <div className="flex flex-col sm:flex-row gap-6 mt-10 w-full max-w-2xl">
        {["student", "teacher"].map((r) => (
          <div
            key={r}
            onClick={() => dispatch(setRole(r))}
            className={`flex-1 border-2 rounded-lg p-6 cursor-pointer transition text-left 
              ${role === r ? "border-purple-600 shadow-md" : "border-gray-200"}
              hover:border-purple-500 hover:shadow`}
          >
            <h2 className="font-semibold text-lg sm:text-xl mb-2">
              {r === "student" ? "I’m a Student" : "I’m a Teacher"}
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              {r === "student"
                ? "Submit answers and view results"
                : "Create polls and track responses"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
