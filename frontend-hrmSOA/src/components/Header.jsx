import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Header({ title, subtitle }) {
  const { user, role } = useAuth();
  
  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>{today}</span>
            <span>•</span>
            <span className="capitalize">{role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          {title || `Xin chào, ${user?.full_name || user?.email || "User"} 👋`}
        </h1>
        {subtitle && (
          <p className="mt-2 text-slate-500 text-sm md:text-base max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Mockup */}
        <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-50">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
           </svg>
           <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-50"></span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">{user?.full_name || user?.email}</p>
                <p className="text-xs text-slate-500 truncate max-w-[120px]">{user?.email}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
                {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
        </div>
      </div>
    </header>
  );
}
