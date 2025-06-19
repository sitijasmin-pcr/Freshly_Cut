import React, { useState } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import EmployeeQuestView from "./EmployeeQuest";
import ListIzin from "./ListIzin";

const initialEmployees = [
  {
    id: 1,
    name: "Andi Wijaya",
    masuk: "08:00",
    keluar: "17:00",
    contact: "andi.wijaya@email.com",
    status: "Hadir",
    shift: "Pagi",
  },
  {
    id: 2,
    name: "Sinta Marlina",
    masuk: "07:45",
    keluar: "17:30",
    contact: "sinta.m@email.com",
    status: "Hadir",
    shift: "Fulltime",
  },
  {
    id: 3,
    name: "Dimas Pratama",
    masuk: "08:10",
    keluar: "16:50",
    contact: "dimas.p@email.com",
    status: "Hadir",
    shift: "Part Time",
  },
  {
    id: 4,
    name: "Clara Nathania",
    masuk: "-",
    keluar: "-",
    contact: "clara.n@email.com",
    status: "Absen",
    shift: "Malam",
  },
];

const ShiftPage = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [activeFilter, setActiveFilter] = useState("Today");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    masuk: "",
    keluar: "",
    contact: "",
    status: "Hadir",
    shift: "Pagi",
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [activeView, setActiveView] = useState("shift");

  const handleAddOrUpdateEmployee = () => {
    if (editMode) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editId ? { ...formData, id: editId } : emp
        )
      );
    } else {
      setEmployees((prev) => [...prev, { ...formData, id: prev.length + 1 }]);
    }
    setFormData({
      name: "",
      masuk: "",
      keluar: "",
      contact: "",
      status: "Hadir",
      shift: "Pagi",
    });
    setIsModalOpen(false);
    setEditMode(false);
    setEditId(null);
  };

  const handleEditClick = (emp) => {
    setFormData(emp);
    setEditMode(true);
    setEditId(emp.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus shift ini?")) {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: newStatus } : emp))
    );
  };

  const filters = [
    "Yesterday",
    "Today",
    "Tomorrow",
    "Pagi",
    "Malam",
    "Fulltime",
  ];

  const hadirCount = employees.filter((emp) => emp.status === "Hadir").length;
  const absenCount = employees.filter((emp) => emp.status === "Absen").length;
  const telatCount = employees.filter((emp) => {
    if (emp.status === "Hadir" && emp.masuk !== "-") {
      const [jam, menit] = emp.masuk.split(":").map(Number);
      return jam > 8 || (jam === 8 && menit > 0);
    }
    return false;
  }).length;

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-600">
        Pages / Dashboard
      </h1>

      <div className="flex justify-center gap-6 mb-8">
        {[
          { label: "Employee Quest", value: "quest" },
          { label: "List Izin", value: "izin" },
          { label: "Employee Shift", value: "shift" },
        ].map((btn, idx) => (
          <button
            key={idx}
            onClick={() => setActiveView(btn.value)}
            className={`px-6 py-2 rounded-xl shadow font-semibold ${
              activeView === btn.value
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6 text-center">
            <div className="bg-white rounded-xl shadow-md py-6">
              <p className="text-orange-600 text-lg font-bold">
                Karyawan Hadir
              </p>
              <p className="text-2xl font-bold text-gray-800">{hadirCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md py-6">
              <p className="text-orange-600 text-lg font-bold">
                Karyawan Absen
              </p>
              <p className="text-2xl font-bold text-gray-800">{absenCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md py-6">
              <p className="text-orange-600 text-lg font-bold">
                Karyawan Telat
              </p>
              <p className="text-2xl font-bold text-gray-800">{telatCount}</p>
            </div>
          </div>

          <div className="flex gap-2 text-sm font-medium text-gray-700 mb-4 flex-wrap">
            {filters.map((filter, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1 rounded-full ${
                  activeFilter === filter
                    ? "bg-orange-500 text-white"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-orange-600">
                Employee Shift List
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setEditMode(false);
                  setFormData({
                    name: "",
                    masuk: "",
                    keluar: "",
                    contact: "",
                    status: "Hadir",
                    shift: "Pagi",
                  });
                }}
                className="bg-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-orange-600"
              >
                Tambah Shift
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-separate border-spacing-y-2">
                <thead className="text-orange-600">
                  <tr>
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
                  {employees.map((emp) => (
                    <tr
                      key={emp.id}
                      className="bg-gray-100 hover:bg-orange-50 rounded-xl text-sm"
                    >
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.masuk}</td>
                      <td className="px-4 py-2">{emp.contact}</td>
                      <td className="px-4 py-2">{emp.keluar}</td>
                      <td className="px-4 py-2">{emp.shift}</td>
                      <td className="px-4 py-2">
                        <select
                          value={emp.status}
                          onChange={(e) =>
                            handleStatusChange(emp.id, e.target.value)
                          }
                          className={`px-2 py-1 text-xs rounded-md font-semibold ${
                            emp.status === "Hadir"
                              ? "bg-green-600 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          <option value="Hadir">Hadir</option>
                          <option value="Absen">Absen</option>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setEditMode(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-orange-600">
              {editMode ? "Edit Shift Karyawan" : "Tambah Shift Karyawan"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nama"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="time"
                value={formData.masuk}
                onChange={(e) =>
                  setFormData({ ...formData, masuk: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="time"
                value={formData.keluar}
                onChange={(e) =>
                  setFormData({ ...formData, keluar: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Kontak"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              />
              <select
                value={formData.shift}
                onChange={(e) =>
                  setFormData({ ...formData, shift: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              >
                <option value="Pagi">Pagi</option>
                <option value="Malam">Malam</option>
                <option value="Part Time">Part Time</option>
                <option value="Fulltime">Fulltime</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border px-4 py-2 rounded-md"
              >
                <option value="Hadir">Hadir</option>
                <option value="Absen">Absen</option>
              </select>
              <button
                onClick={handleAddOrUpdateEmployee}
                className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 font-semibold"
              >
                {editMode ? "Update Shift" : "Simpan Shift"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftPage;
