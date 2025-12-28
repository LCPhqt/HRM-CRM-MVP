import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, role } = useAuth();

    const adminMenu = [
        { label: "Tổng quan", icon: "📊", path: "/home" },
        { label: "Nhân viên", icon: "👥", path: "/admin" },
        { label: "Phòng ban", icon: "🏢", path: "/departments" },
        { label: "Lương thưởng", icon: "💰", path: "/payroll" },
    ];

    const staffMenu = [
        { label: "Tổng quan", icon: "📊", path: "/home" }, // Staff cũng có Home
        { label: "Hồ sơ của tôi", icon: "🆔", path: "/staff/profile" },
        { label: "Phòng ban", icon: "🏢", path: "/departments" },
        // Có thể thêm tính năng xem đồng nghiệp nếu cần: { label: "Đồng nghiệp", icon: "👥", path: "/staff/employees" },
    ];

    const menu = role === "admin" ? adminMenu : staffMenu;

    return (
        <aside className="fixed inset-y-0 left-0 w-72 bg-slate-900 text-slate-200 flex flex-col transition-all z-50">
            {/* Brand */}
            <div className="p-6 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                    HR
                </div>
                <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">HRM System</p>
                    <p className="text-lg font-bold text-white tracking-tight">Enterprise</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                {menu.map((item) => {
                    const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`group w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${active
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 translate-x-1"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                                }`}
                        >
                            <span className={`text-xl transition-colors ${active ? "text-white" : "text-slate-500 group-hover:text-white"}`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                            {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/50"></span>}
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={logout}
                    className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                    <span className="p-1 rounded-md bg-slate-800 group-hover:bg-red-500/20 transition-colors">
                        ↪
                    </span>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}
