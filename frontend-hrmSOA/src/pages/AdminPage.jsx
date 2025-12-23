import React, { useEffect, useMemo, useState } from 'react';
import EmployeeTable from '../components/EmployeeTable';
import { useAuth } from '../context/AuthContext';

function AdminPage() {
  const { client, logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const { data } = await client.get('/admin/employees');
        setEmployees(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, [client]);

  const filtered = useMemo(() => {
    if (!filter) return employees;
    return employees.filter((e) =>
      [e.full_name, e.fullName, e.email, e.position, e.department]
        .join(' ')
        .toLowerCase()
        .includes(filter.toLowerCase())
    );
  }, [employees, filter]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold">
            HR
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">HRM Core</p>
            <p className="text-sm font-semibold">Enterprise SOA</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { label: 'Tổng quan', active: false, icon: '🏠' },
            { label: 'Nhân viên', active: true, icon: '👥' },
            { label: 'Phòng ban', active: false, icon: '🏢' },
            { label: 'Lương thưởng', active: false, icon: '💰' },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                item.active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-slate-800'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800/80 px-3 py-2 rounded-lg">
            <div className="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-white">S</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Đang trực tuyến</p>
              <p className="text-xs text-slate-400">Quản trị viên</p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-white text-lg" title="Đăng xuất">
              ↪
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Nhân viên</p>
            <h1 className="text-2xl font-bold text-slate-900">Nhân sự</h1>
            <p className="text-sm text-slate-500">Quản lý hồ sơ và thông tin nhân viên toàn công ty.</p>
          </div>
          <div className="text-sm text-slate-500">
            <p>Hôm nay</p>
            <p className="font-semibold text-slate-700">{new Date().toLocaleDateString('vi-VN')}</p>
          </div>
        </header>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-200 flex-1">
            <span className="text-slate-400">🔍</span>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Tìm kiếm nhân viên theo tên, email..."
              className="w-full outline-none text-sm text-slate-700"
            />
          </div>
          <button className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-200">
            ⚙ Bộ lọc: Tất cả
          </button>
          <button className="px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-300 hover:bg-indigo-700">
            + Thêm nhân viên
          </button>
        </div>

        <EmployeeTable employees={filtered} />
      </main>
    </div>
  );
}

export default AdminPage;

