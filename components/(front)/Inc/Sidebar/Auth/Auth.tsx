"use client";
import React, { useState } from "react";
import Login from "@/components/(front)/Inc/Sidebar/Auth/Login";
import Register from "@/components/(front)/Inc/Sidebar/Auth/Register";

function Auth() {
  const [authLoading, setAuthLoading] = useState(false);
  const [auth, setAuth] = useState("login");

  return (
    <div className="relative flex flex-col gap-4 w-full h-[calc(100dvh-77px)] justify-center items-center lg:p-8 p-4 overflow-hidden">
      {authLoading && (
        <div className="absolute w-full h-full backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="animate-spin rounded-full m-0.5 lg:size-24 size-16 border-t-4 border-b-4 border-gray-200 group-hover:border-white"></div>
        </div>
      )}
      <div
        className={`w-full h-full absolute transition-all duration-500 lg:p-8 p-4 ${
          auth === "login"
            ? "translate-x-0"
            : "-translate-x-full opacity-0 scale-x-0"
        }`}
      >
        <Login
          setAuth={setAuth}
          authLoading={authLoading}
          setAuthLoading={setAuthLoading}
        />
      </div>
      <div
        className={`w-full h-full absolute transition-all duration-500 lg:p-8 p-4 ${
          auth === "register"
            ? "translate-x-0"
            : "translate-x-full opacity-0 scale-x-0"
        }`}
      >
        <Register setAuth={setAuth} authLoading={authLoading} setAuthLoading={setAuthLoading} />
      </div>
    </div>
  );
}

export default Auth;
