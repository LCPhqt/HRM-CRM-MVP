import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmployeeTable from "../components/EmployeeTable";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/MainLayout";

function AdminPage() {
  const { client, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState("");

  // ✅ Dropdown filter trạng thái
  const [openFilter, setOpenFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // ✅ Edit & Add
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [viewing, setViewing] = useState(null);

  const [addForm, setAddForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    dob: "",
    phone: "",
    address: "",
    salary: "",
    position: "",
    department: "",
  });

  const fetchEmployees = async () => {
    try {
      const { data } = await client.get("/admin/employees");
      setEmployees(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filtered = useMemo(() => {
    let list = [...employees];

    // ✅ filter status
    if (statusFilter !== "all") {
      list = list.filter((e) => {
        const st = e.status || e.profile?.status || "working";
        return st === statusFilter;
      });
    }

    // ✅ search text
    if (!filter) return list;

    return list.filter((e) => {
      const profile = e.profile || {};

      // ✅ lấy tên chuẩn: ưu tiên từ profile
      const fullName =
        e.full_name ||
        e.fullName ||
        profile.fullName ||
        profile.full_name ||
        profile.name ||
        e.name ||
        "";

      const email = e.email || profile.email || "";

      const position = e.position || profile.position || "";
      const department = e.department || profile.department || "";

      const text = `${fullName} ${email} ${position} ${department}`.toLowerCase();

      return text.includes(filter.toLowerCase());
    });
  }, [employees, filter, statusFilter]);

  return (
    <MainLayout
      title="Nhân sự"
      subtitle="Quản lý hồ sơ và thông tin nhân viên toàn công ty."
    >
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          {/* Search */}
          <div className="relative w-full sm:w-96 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Tìm kiếm nhân viên..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Filter Dropdown */}
            <div className="relative z-20">
              <button
                onClick={() => setOpenFilter((p) => !p)}
                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2 whitespace-nowrap min-w-[140px] justify-between"
              >
                <span>
                  {statusFilter === "all"
                    ? "Tất cả trạng thái"
                    : statusFilter === "working"
                      ? "Đang làm việc"
                      : statusFilter === "leave"
                        ? "Nghỉ phép"
                        : "Đã nghỉ việc"}
                </span>
                <span className="text-slate-400">▼</span>
              </button>

              {openFilter && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setOpenFilter(false)}></div>
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-30 animate-fade-in">
                    {[
                      { label: "Tất cả", value: "all", color: "text-slate-700" },
                      {
                        label: "Đang làm việc",
                        value: "working",
                        color: "text-emerald-600",
                      },
                      {
                        label: "Nghỉ phép",
                        value: "leave",
                        color: "text-amber-600",
                      },
                      {
                        label: "Đã nghỉ việc",
                        value: "quit",
                        color: "text-slate-400",
                      },
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => {
                          setStatusFilter(item.value);
                          setOpenFilter(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-50 text-sm font-medium transition-colors ${item.color} ${statusFilter === item.value ? 'bg-indigo-50' : ''}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Add Button */}
            <button
              className="btn-primary flex items-center gap-2 whitespace-nowrap"
              onClick={() => {
                setAddForm({
                  full_name: "",
                  email: "",
                  password: "",
                  confirm_password: "",
                  salary: "",
                  position: "",
                  department: "",
                });
                setAdding(true);
              }}
            >
              <span>+</span> Thêm nhân viên
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="p-0">
          <EmployeeTable
            employees={filtered}
            onView={(emp) => {
              const profile = emp.profile || {};
              setViewing({
                email: emp.email || profile.email || "",
                full_name:
                  emp.full_name ||
                  emp.fullName ||
                  profile.full_name ||
                  profile.fullName ||
                  "",
                department: emp.department || profile.department || "",
                position: emp.position || profile.position || "",
                dob: profile.dob || "",
                phone: profile.phone || "",
                address: profile.address || "",
                salary: profile.salary ?? "",
                status: emp.status || profile.status || "working",
                joined_at:
                  emp.joined_at ||
                  profile.createdAt ||
                  emp.createdAt ||
                  profile.created_at ||
                  emp.created_at ||
                  "",
              });
            }}
            onStatusChange={async (emp, newStatus) => {
              try {
                await client.put(`/admin/employees/${emp.id || emp.userId || emp._id}`, {
                  status: newStatus,
                });
                await fetchEmployees();
              } catch (err) {
                alert(err.response?.data?.message || err.message);
                throw err;
              }
            }}
            onEdit={(emp) => {
              const profile = emp.profile || {};
              setEditing({
                id: emp.id || emp.userId || emp._id,
                email: emp.email || profile.email || "",
                full_name:
                  emp.full_name ||
                  emp.fullName ||
                  profile.full_name ||
                  profile.fullName ||
                  "",
                department: emp.department || profile.department || "",
                position: emp.position || profile.position || "",
                dob: profile.dob || "",
                phone: profile.phone || "",
                address: profile.address || "",
                salary: profile.salary ?? "",
              });
            }}
            onRemove={async (emp) => {
              if (!window.confirm(`Xóa nhân viên ${emp.full_name || emp.email}?`))
                return;
              try {
                await client.delete(`/admin/employees/${emp.id || emp.userId || emp._id}`);
                await fetchEmployees();
              } catch (err) {
                alert(err.response?.data?.message || err.message);
              }
            }}
          />
        </div>
      </div>

      {/* ✅ MODALS (Giữ nguyên logic nhưng update style một chút cho đẹp) */}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-800">Chỉnh sửa nhân viên</h3>
              <button
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                onClick={() => setEditing(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="grid md:grid-cols-2 gap-5">
                {[
                  { label: "Email", key: "email" },
                  { label: "Họ và tên", key: "full_name" },
                  { label: "Chức vụ", key: "position" },
                  { label: "Phòng ban", key: "department" },
                  { label: "Lương cơ bản", key: "salary", type: "number" },
                  { label: "Ngày sinh", key: "dob", type: "date" },
                  { label: "Số điện thoại", key: "phone" },
                  { label: "Địa chỉ", key: "address", colSpan: true }
                ].map(field => (
                  <div key={field.key} className={field.colSpan ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
                    <input
                      type={field.type || "text"}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                      value={editing[field.key]}
                      onChange={(e) => setEditing((p) => ({ ...p, [field.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button
                className="btn-secondary"
                onClick={() => setEditing(null)}
              >
                Hủy bỏ
              </button>
              <button
                className="btn-primary"
                onClick={async () => {
                  try {
                    const payload = { ...editing };
                    delete payload.id;
                    await client.put(`/admin/employees/${editing.id}`, payload);
                    setEditing(null);
                    await fetchEmployees();
                  } catch (err) {
                    alert(err.response?.data?.message || err.message);
                  }
                }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
              <h3 className="text-xl font-bold text-slate-800">Thông tin chi tiết</h3>
              <button
                className="w-8 h-8 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                onClick={() => setViewing(null)}
              >
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-y-6 gap-x-8">
                {[
                  { label: "Họ và tên", value: viewing.full_name, highlight: true },
                  { label: "Email", value: viewing.email },
                  { label: "Chức vụ", value: viewing.position },
                  { label: "Phòng ban", value: viewing.department },
                  { label: "Trạng thái", value: viewing.status, isStatus: true },
                  { label: "Lương cơ bản", value: viewing.salary },
                  { label: "Ngày sinh", value: viewing.dob },
                  { label: "Số điện thoại", value: viewing.phone },
                  { label: "Địa chỉ", value: viewing.address, colSpan: true },
                  { label: "Ngày tham gia", value: viewing.joined_at ? new Date(viewing.joined_at).toLocaleDateString("vi-VN") : "" }
                ].map((item, idx) => (
                  <div key={idx} className={item.colSpan ? "md:col-span-2" : ""}>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                    {item.isStatus ? (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${item.value === 'working' ? 'bg-emerald-100 text-emerald-700' :
                          item.value === 'leave' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {item.value}
                      </span>
                    ) : (
                      <p className={`text-base font-medium text-slate-800 border-b border-slate-100 pb-1 ${item.highlight ? 'text-lg text-indigo-900' : ''}`}>{item.value || "—"}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                className="btn-secondary"
                onClick={() => setViewing(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD MODAL */}
      {adding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Thêm nhân viên mới</h3>
              <button
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                onClick={() => setAdding(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 mb-2">
                  <h4 className="text-sm font-bold text-indigo-900 mb-3">Thông tin đăng nhập</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Email <span className="text-red-500">*</span></label>
                      <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                        value={addForm.email} onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                      <input type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                        value={addForm.password} onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Nhập lại mật khẩu</label>
                      <input type="password" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                        value={addForm.confirm_password} onChange={e => setAddForm(p => ({ ...p, confirm_password: e.target.value }))} />
                    </div>
                  </div>
                </div>

                {[
                  { label: "Họ và tên", key: "full_name" },
                  { label: "Chức vụ", key: "position" },
                  { label: "Phòng ban", key: "department" },
                  { label: "Lương cơ bản", key: "salary", type: "number" },
                  { label: "Ngày sinh", key: "dob", type: "date" },
                  { label: "Số điện thoại", key: "phone" },
                  { label: "Địa chỉ", key: "address", colSpan: true },
                ].map(field => (
                  <div key={field.key} className={field.colSpan ? "md:col-span-2" : ""}>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{field.label}</label>
                    <input
                      type={field.type || "text"}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
                      value={addForm[field.key]}
                      onChange={(e) => setAddForm((p) => ({ ...p, [field.key]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button
                className="btn-secondary"
                onClick={() => setAdding(false)}
              >
                Hủy bỏ
              </button>
              <button
                className="btn-primary"
                onClick={async () => {
                  if (addForm.password !== addForm.confirm_password) {
                    alert("Mật khẩu nhập lại không khớp");
                    return;
                  }
                  try {
                    await client.post("/admin/employees", addForm);
                    setAdding(false);
                    await fetchEmployees();
                  } catch (err) {
                    alert(err.response?.data?.message || err.message);
                  }
                }}
              >
                Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default AdminPage;
