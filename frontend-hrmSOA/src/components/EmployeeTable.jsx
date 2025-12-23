import React from 'react';

const statusMap = {
  active: { label: 'Đang làm việc', color: 'bg-emerald-100 text-emerald-700' },
  onleave: { label: 'Nghỉ phép', color: 'bg-amber-100 text-amber-700' },
  pending: { label: 'Chờ duyệt', color: 'bg-blue-100 text-blue-700' },
};

function EmployeeTable({ employees = [], onRemove }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">Thông tin nhân viên</th>
            <th className="px-4 py-3 text-left">Vị trí & Phòng ban</th>
            <th className="px-4 py-3 text-left">Ngày gia nhập</th>
            <th className="px-4 py-3 text-left">Trạng thái</th>
            <th className="px-4 py-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody className="text-sm text-slate-700">
          {employees.map((emp) => {
            const fullName = emp.full_name || emp.fullName || emp.name || emp.email || 'N/A';
            const email = emp.email || '-';
            const position = emp.position || 'Đang cập nhật';
            const department = emp.department || 'Chưa gán';
            const joined = emp.joinedAt || emp.joined_at || emp.createdAt || '';
            const statusKey = emp.status || 'active';
            const status = statusMap[statusKey] || statusMap.active;
            const initials = (fullName || email).trim()[0]?.toUpperCase() || 'N';

            return (
              <tr key={emp.userId || emp._id || email} className="hover:bg-slate-50 border-t border-slate-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center">
                      {initials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{fullName}</div>
                      <div className="text-xs text-slate-500">{email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{position}</div>
                  <div className="text-xs text-slate-500">{department}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{joined || '--'}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                    <span className="h-2 w-2 rounded-full bg-current opacity-80" />
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onRemove?.(emp)}
                    className="text-slate-400 hover:text-rose-500 transition"
                    title="Xoá nhân viên"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;

