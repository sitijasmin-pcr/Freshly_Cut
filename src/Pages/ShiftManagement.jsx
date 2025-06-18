import React from "react";

const employees = [
  { name: "Andi Wijaya", masuk: "08.00", keluar: "17.00", contact: "andi.wijaya@gmail.com", status: "Hadir" },
  { name: "Sinta Marlina", masuk: "07.45", keluar: "17.30", contact: "sinta.m@gmail.com", status: "Hadir" },
  { name: "Dimas Pratama", masuk: "08.10", keluar: "16.50", contact: "dimas.g@gmail.com", status: "Hadir" },
  { name: "Clara Nathania", masuk: "-", keluar: "-", contact: "clara.n@email.com", status: "Absen" },
];

const ShiftPage = () => {
  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8 font-sans">
      <h1 className="text-center text-3xl font-semibold text-orange-600 mb-10 tracking-wide">Shift Page</h1>

      {/* Stat Boxes */}
      <div className="flex justify-center gap-6 mb-10">
        {[
          { label: "Karyawan Hadir", value: 250, change: "+30%" },
          { label: "Karyawan Absen", value: 130, change: "-3%" },
          { label: "Karyawan Telat", value: 300, change: "+6%" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white w-52 rounded-xl px-6 py-5 text-center border border-gray-100 shadow-lg shadow-orange-200"
          >
            <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-orange-600">{stat.value}</p>
            <p className="text-sm text-gray-400">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6 mb-12">
        {['Employee Quest', 'List Izin', 'Employee Shift'].map((label, i) => (
          <button
            key={i}
            className="px-5 py-2.5 bg-white rounded-full shadow-md border border-gray-200 text-orange-600 font-medium hover:bg-orange-50 transition"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow-lg rounded-2xl px-6 pt-6 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-orange-600">Employee Shift List</h2>
          <div className="flex gap-2">
            {["Tuesday", "Today", "Tomorrow"].map((day, i) => (
              <span
                key={i}
                className={`px-3 py-1 text-sm rounded-full border ${day === "Today" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {day}
              </span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-gradient-to-b from-orange-50 to-orange-100 text-gray-800">
              <tr>
                <th className="p-3 font-semibold">Nama</th>
                <th className="p-3 font-semibold">Masuk</th>
                <th className="p-3 font-semibold">Contact</th>
                <th className="p-3 font-semibold">Keluar</th>
                <th className="p-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {employees.map((emp, index) => (
                <tr key={index} className="border-t hover:bg-orange-50/30">
                  <td className="p-3 text-gray-700">{emp.name}</td>
                  <td className="p-3 text-gray-700">{emp.masuk}</td>
                  <td className="p-3 text-gray-700">{emp.contact}</td>
                  <td className="p-3 text-gray-700">{emp.keluar}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${emp.status === "Hadir" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShiftPage;