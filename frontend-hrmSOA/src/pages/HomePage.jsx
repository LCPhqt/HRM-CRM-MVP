import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function HomePage() {
  const { user, role, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Xin chào</p>
            <h1 className="text-2xl font-bold text-slate-800">{user?.email || 'Người dùng'}</h1>
            <p className="text-sm text-slate-500">Vai trò: {role || 'staff'}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium"
          >
            Đăng xuất
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/profile"
            className="p-4 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
          >
            <h3 className="font-semibold text-slate-800 mb-1">Hồ sơ cá nhân</h3>
            <p className="text-sm text-slate-500">Xem và cập nhật thông tin của bạn.</p>
          </Link>
          {role === 'admin' && (
            <Link
              to="/admin"
              className="p-4 border rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition"
            >
              <h3 className="font-semibold text-slate-800 mb-1">Trang quản trị</h3>
              <p className="text-sm text-slate-500">Xem danh sách nhân viên đã đăng ký.</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;

