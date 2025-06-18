import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, Pencil, Trash2 } from "lucide-react";

const initialCustomers = [
  {
    id: 1,
    name: "Andi Wijaya",
    joined: "2024-11-15",
    memberType: "Bronze",
    email: "andi.wijaya@email.com",
    preference: "Americano, Croissant",
    active: true,
  },
  {
    id: 2,
    name: "Sinta Marlina",
    joined: "2024-09-21",
    memberType: "Gold",
    email: "sinta.m@email.com",
    preference: "Caramel, Sweet Pastries",
    active: true,
  },
];

export default function CustomerPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    preference: "",
    memberType: "",
    joined: "",
    active: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "active" ? value === "true" : value,
    }));
  };

  const handleAddOrEditCustomer = (e) => {
    e.preventDefault();
    const { name, email, preference, memberType, joined } = formData;
    if (!name || !email || !preference || !memberType || !joined) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editingCustomerId !== null) {
      setCustomers((prev) =>
        prev.map((cust) =>
          cust.id === editingCustomerId ? { ...cust, ...formData, id: editingCustomerId } : cust
        )
      );
    } else {
      const newCustomer = {
        id: customers.length ? customers[customers.length - 1].id + 1 : 1,
        ...formData,
      };
      setCustomers([...customers, newCustomer]);
    }

    setFormData({
      name: "",
      email: "",
      preference: "",
      memberType: "",
      joined: "",
      active: true,
    });
    setEditingCustomerId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (cust) => {
    setFormData({
      name: cust.name,
      email: cust.email,
      preference: cust.preference,
      memberType: cust.memberType,
      joined: cust.joined,
      active: cust.active,
    });
    setEditingCustomerId(cust.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus customer ini?")) {
      setCustomers(customers.filter((cust) => cust.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
        Customer Page
      </h1>

      {/* Tombol Toggle Form */}
      <div className="mb-6 text-right">
        <button
          onClick={() => {
            setFormData({
              name: "",
              email: "",
              preference: "",
              memberType: "",
              joined: "",
              active: true,
            });
            setEditingCustomerId(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        >
          Tambah Customer
        </button>
      </div>

      {/* Modal Form */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <Dialog.Title className="text-lg font-bold mb-4 text-orange-700">
              {editingCustomerId ? "Edit Customer" : "Form Tambah Customer"}
            </Dialog.Title>
            <form onSubmit={handleAddOrEditCustomer} className="space-y-4">
              <Input label="Nama Lengkap" name="name" value={formData.name} onChange={handleInputChange} required />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              <Input label="Preferensi" name="preference" value={formData.preference} onChange={handleInputChange} required />
              <Select label="Tipe Member" name="memberType" value={formData.memberType} onChange={handleInputChange} required>
                <option value="">Pilih tipe member</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Bronze">Bronze</option>
              </Select>
              <Input label="Tanggal Bergabung" name="joined" type="date" value={formData.joined} onChange={handleInputChange} required />
              <Select label="Status" name="active" value={formData.active.toString()} onChange={handleInputChange} required>
                <option value="true">Active</option>
                <option value="false">Deactivate</option>
              </Select>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                  Simpan Customer
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Tabel Customer */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-orange-600 border-b pb-2 mb-4">
          Daftar Customer
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Member Type</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Preference</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {customers.map((cust) => (
                <tr key={cust.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{cust.name}</td>
                  <td className="px-4 py-3">{cust.joined}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      cust.memberType === "Gold"
                        ? "bg-yellow-400 text-black"
                        : cust.memberType === "Silver"
                        ? "bg-gray-500 text-white"
                        : "bg-orange-700 text-white"
                    }`}>
                      {cust.memberType}
                    </span>
                  </td>
                  <td className="px-4 py-3">{cust.email}</td>
                  <td className="px-4 py-3">{cust.preference}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      cust.active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {cust.active ? "Active" : "Deactivate"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button onClick={() => handleEdit(cust)} className="text-blue-600 hover:text-blue-800">
                      <Pencil className="w-4 h-4 inline" /> Edit
                    </button>
                    <button onClick={() => handleDelete(cust.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4 inline" /> Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-400">
                    Tidak ada data customer
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Input = ({ label, name, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <input
      name={name}
      type={type}
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
      {...props}
    />
  </div>
);

const Select = ({ label, name, children, ...props }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <select
      name={name}
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
      {...props}
    >
      {children}
    </select>
  </div>
);
