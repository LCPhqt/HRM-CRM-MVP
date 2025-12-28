import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";

function HomePage() {
  const { user, role, client } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [empRes, depRes] = await Promise.all([
          role === "admin" ? client.get("/admin/employees") : Promise.resolve({ data: [] }),
          client.get("/departments"),
        ]);
        setEmployees(empRes.data || []);
        setDepartments(depRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [client, role]);

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;
  const avgSalary = useMemo(() => {
    const salaries = employees
      .map((e) => e.profile?.salary ?? e.salary)
      .filter((v) => v !== undefined && v !== null && v !== "");
    if (!salaries.length) return 0;
    const sum = salaries.reduce((a, b) => a + Number(b || 0), 0);
    return Math.round(sum / salaries.length);
  }, [employees]);

  const deptStats = useMemo(() => {
    const counter = new Map();
    employees.forEach((e) => {
      const dep = e.department || e.profile?.department || "Chưa phân";
      counter.set(dep, (counter.get(dep) || 0) + 1);
    });
    const arr = Array.from(counter.entries());
    arr.sort((a, b) => b[1] - a[1]);
    return arr;
  }, [employees]);

  const maxDeptCount = useMemo(
    () => Math.max(1, ...deptStats.map(([, count]) => count)),
    [deptStats]
  );

  const formatMoney = (v) =>
    Number(v || 0).toLocaleString("vi-VN", { minimumFractionDigits: 0 }) + " đ";

  const hiringTrend = [
    { label: "T1", value: 6 },
    { label: "T2", value: 5 },
    { label: "T3", value: 7 },
    { label: "T4", value: 8 },
    { label: "T5", value: 10 },
    { label: "T6", value: 12 },
  ];

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <MainLayout
      title="Tổng quan hệ thống"
      subtitle="Báo cáo chi tiết về tình hình nhân sự và hoạt động của công ty."
    >
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div
          className="bg-white rounded-2xl p-6 cursor-pointer card-hover relative overflow-hidden group border border-slate-100"
          onClick={() => role === "admin" && navigate("/admin")}
        >
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-8xl">👥</span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Tổng nhân sự</p>
            <div className="text-4xl font-bold text-slate-900 mt-2">{totalEmployees}</div>
            <p className="text-xs font-medium text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 rounded-lg">
              ↗ +3 từ tháng trước
            </p>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl p-6 cursor-pointer card-hover relative overflow-hidden group border border-slate-100"
          onClick={() => role === "admin" && navigate("/departments")}
        >
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="text-8xl">🏢</span>
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Phòng ban</p>
            <div className="text-4xl font-bold text-slate-900 mt-2">{totalDepartments}</div>
            <p className="text-xs font-medium text-indigo-600 mt-2 bg-indigo-50 inline-block px-2 py-1 rounded-lg">
              Đang hoạt động
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 card-hover border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Quỹ lương (Est)</p>
          <div className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            {formatMoney(avgSalary * totalEmployees || 0)}
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 card-hover border border-slate-100">
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Lương trung bình</p>
          <div className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{formatMoney(avgSalary)}</div>
          <p className="text-xs font-medium text-slate-400 mt-2">
            Trên mỗi nhân viên
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Department Stats */}
        <div className="bg-white rounded-3xl p-6 xl:col-span-2 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Phân bổ nhân sự</h3>
              <p className="text-sm text-slate-500">Thống kê nhân viên theo từng phòng ban</p>
            </div>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition">
              Xem chi tiết
            </button>
          </div>

          {loading ? (
            <div className="h-80 flex items-center justify-center text-slate-400">Đang tải dữ liệu...</div>
          ) : (
            <div className="relative h-80 bg-slate-50/50 rounded-2xl border border-slate-100 p-6 flex items-end justify-around gap-4 group">
              {/* Grid lines background */}
              <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between opacity-30">
                <div className="w-full border-t border-dashed border-slate-300"></div>
                <div className="w-full border-t border-dashed border-slate-300"></div>
                <div className="w-full border-t border-dashed border-slate-300"></div>
                <div className="w-full border-t border-dashed border-slate-300"></div>
              </div>

              {deptStats.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                  Chưa có dữ liệu phòng ban.
                </div>
              )}

              {deptStats.map(([dep, count], idx) => (
                <div key={dep} className="relative z-10 flex flex-col items-center gap-3 flex-1 group/bar">
                  <div className="relative w-full max-w-[60px] flex items-end justify-center h-full">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-lg shadow-indigo-200 transition-all duration-500 hover:to-purple-500"
                      style={{
                        height: `${(count / maxDeptCount) * 100}%`,
                        minHeight: "40px",
                      }}
                    >
                      <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-20">
                        {count} nhân viên
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-600 text-center w-full truncate px-1" title={dep}>
                    {dep}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hiring Trend */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Tăng trưởng</h3>
            <p className="text-sm text-slate-500">Xu hướng tuyển dụng 6 tháng</p>
          </div>

          <div className="flex-1 relative min-h-[200px] bg-gradient-to-b from-indigo-50/50 to-white rounded-2xl border border-indigo-50 overflow-hidden">
            {/* Simple SVG Chart */}
            <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 300 200" preserveAspectRatio="none">
              <path
                d="M0,150 C50,140 100,160 150,130 C200,100 250,80 300,50 L300,200 L0,200 Z"
                fill="rgba(99, 102, 241, 0.1)"
              />
              <path
                d="M0,150 C50,140 100,160 150,130 C200,100 250,80 300,50"
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Dots */}
              <circle cx="0" cy="150" r="3" fill="#6366f1" />
              <circle cx="150" cy="130" r="3" fill="#6366f1" />
              <circle cx="300" cy="50" r="3" fill="#6366f1" />
            </svg>

            <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-indigo-100">
              <p className="text-xs text-slate-500">Tháng này</p>
              <p className="text-lg font-bold text-indigo-600">+12</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 px-2">
            <span>Tháng 1</span>
            <span>Tháng 6</span>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default HomePage;
