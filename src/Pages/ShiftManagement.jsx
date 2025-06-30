import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { X, Pencil, Trash2 } from "lucide-react";
import EmployeeQuestView from "./EmployeeQuest";
import ListIzin from "./ListIzin";
import ShiftForm from "./ShiftForm";
import Swal from "sweetalert2";

const ShiftPage = () => {
  const [employees, setEmployees] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Today");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  const [activeView, setActiveView] = useState("shift");

  const fetchShifts = async () => {
    const { data, error } = await supabase
      .from("shifts")
      .select("*")
      .order("shift_date", { ascending: false });

    if (error) console.error("Error fetching shifts:", error);
    else setEmployees(data);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Hapus Shift?",
      text: "Data tidak bisa dikembalikan setelah dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      const { error } = await supabase.from("shifts").delete().eq("id", id);
      if (!error) {
        Swal.fire("Berhasil", "Shift dihapus.", "success");
        fetchShifts();
      }
    }
  };

  const handleEditClick = (shift) => {
    setEditData(shift);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from("shifts")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) fetchShifts();
  };

  const hadirCount = employees.filter((emp) => emp.status === "Hadir").length;
  const absenCount = employees.filter((emp) => emp.status === "Absen").length;
  const telatCount = employees.filter((emp) => {
    if (emp.status === "Hadir" && emp.time_in) {
      const [jam, menit] = emp.time_in.split(":").map(Number);
      return jam > 8 || (jam === 8 && menit > 0);
    }
    return false;
  }).length;
  const filteredEmployees = employees.filter((emp) => {
  const today = new Date();
  const empDate = new Date(emp.shift_date);

  switch (activeFilter) {
    case "Today":
      return empDate.toDateString() === today.toDateString();

    case "Yesterday":
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      return empDate.toDateString() === yesterday.toDateString();

    case "Pagi":
      return emp.shift_type?.toLowerCase() === "pagi";

    case "Malam":
      return emp.shift_type?.toLowerCase() === "malam";

    case "Fulltime":
      return emp.shift_type?.toLowerCase() === "fulltime";

    case "Part Time":
      return emp.shift_type?.toLowerCase() === "part time";

    case "All":
    default:
      return true;
  }
});



const filters = [
  "All",
  "Today",
  "Yesterday",
  "Pagi",
  "Malam",
  "Fulltime",
  "Part Time",
];


  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex justify-center gap-6 mb-8">
        {[
          { label: "Employee Quest", value: "quest" },
          { label: "List Izin", value: "izin" },
          { label: "Employee Shift", value: "shift" },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={() => setActiveView(btn.value)}
            className={`px-6 py-2 rounded-xl shadow font-semibold ${activeView === btn.value
                ? "bg-orange-500 text-white"
                : "bg-white text-orange-600 border border-orange-500 hover:bg-orange-50"
              }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {activeView === "quest" ? (
        <EmployeeQuestView />
      ) : activeView === "izin" ? (
        <ListIzin />
      ) : (
        <>
          <h2 className="text-3xl font-bold text-center text-orange-600 mb-8">
            Shift Page
          </h2>

          {/* 3 Card Total */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-center">
            <div className="bg-white rounded-xl shadow-md py-6">
              <p className="text-orange-600 text-lg font-bold">Karyawan Hadir</p>
              <p className="text-2xl font-bold text-gray-800">{hadirCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md py-6">
              <p className="text-orange-600 text-lg font-bold">Karyawan Absen</p>
              <p className="text-2xl font-bold text-gray-800">{absenCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md py-6">
              <p className="text-orange-600 text-lg font-bold">Karyawan Telat</p>
              <p className="text-2xl font-bold text-gray-800">{telatCount}</p>
            </div>
          </div>

          {/* Filter Button */}
          <div className="flex gap-2 text-sm font-medium text-gray-700 mb-4 flex-wrap">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full ${activeFilter === filter
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-orange-600"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Tabel Shift */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-orange-600">
                Employee Shift List
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditMode(false);
                  setEditData(null);
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600"
              >
                + Tambah Shift
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-separate border-spacing-y-2">
                <thead className="text-orange-600">
                  <tr>
                    {/* Tambahkan kolom No. di sini */}
                    <th className="px-4 py-2">No.</th>
                    <th className="px-4 py-2">Nama</th>
                    <th className="px-4 py-2">Masuk</th>
                    <th className="px-4 py-2">Contact</th>
                    <th className="px-4 py-2">Keluar</th>
                    <th className="px-4 py-2">Shift</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className="bg-gray-100 hover:bg-orange-50 rounded-xl text-sm"
                    >
                      {/* Tampilkan nomor urut di sini */}
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{emp.employee_name}</td>
                      <td className="px-4 py-2">{emp.time_in || "-"}</td>
                      <td className="px-4 py-2">{emp.contact}</td>
                      <td className="px-4 py-2">{emp.time_out || "-"}</td>
                      <td className="px-4 py-2">{emp.shift_type}</td>
                      <td className="px-4 py-2">
                        <select
                          value={emp.status}
                          onChange={(e) =>
                            handleStatusChange(emp.id, e.target.value)
                          }
                          className={`px-2 py-1 text-xs rounded-md font-semibold ${emp.status === "Hadir"
                              ? "bg-green-600 text-white"
                              : "bg-red-500 text-white"
                            }`}
                        >
                          <option value="Hadir">Hadir</option>
                          <option value="Absen">Absen</option>
                          <option value="Izin">Izin</option>
                          <option value="Sakit">Sakit</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleEditClick(emp)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <ShiftForm
          onClose={() => {
            setIsModalOpen(false);
            setEditMode(false);
            fetchShifts();
          }}
          editData={editData}
        />
      )}
    </div>
  );
};

export default ShiftPage;