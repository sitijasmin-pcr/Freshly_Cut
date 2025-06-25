import { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Pastikan path supabase benar
import CustomerForm from "./CustomerForm";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // State untuk mengontrol visibilitas form

  // State untuk data ringkasan member
  const [memberSummary, setMemberSummary] = useState({
    gold: { total: 0, percentage: 0 },
    bronze: { total: 0, percentage: 0 },
    silver: { total: 0, percentage: 0 },
    newcomer: { total: 0, percentage: 0 },
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Hitung ringkasan member setiap kali data pelanggan berubah
    calculateMemberSummary();
  }, [customers]);

  const fetchCustomers = async () => {
    // Mengubah order by menjadi 'created_at' karena 'joined_date' tidak ada di skema
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
    if (error) console.error("Fetch Error:", error);
    else setCustomers(data);
  };

  const calculateMemberSummary = () => {
    // Menggunakan cust.status_member
    const gold = customers.filter(cust => cust.status_member === 'Gold').length;
    const bronze = customers.filter(cust => cust.status_member === 'Bronze').length;
    const silver = customers.filter(cust => cust.status_member === 'Silver').length;
    const newcomer = customers.filter(cust => cust.status_member === 'Newcomer').length;
    
    const totalCustomers = customers.length;

    setMemberSummary({
      gold: { total: gold, percentage: totalCustomers > 0 ? ((gold / totalCustomers) * 100).toFixed(0) : 0 },
      bronze: { total: bronze, percentage: totalCustomers > 0 ? ((bronze / totalCustomers) * 100).toFixed(0) : 0 },
      silver: { total: silver, percentage: totalCustomers > 0 ? ((silver / totalCustomers) * 100).toFixed(0) : 0 },
      newcomer: { total: newcomer, percentage: totalCustomers > 0 ? ((newcomer / totalCustomers) * 100).toFixed(0) : 0 },
    });
  };

  const addCustomer = async (customer) => {
    // Kolom 'created_at' akan otomatis diisi oleh database Supabase
    // Anda tidak perlu mengirimkannya secara eksplisit di sini.
    const { error } = await supabase.from("customers").insert({
      ...customer,
      role: customer.role || "User", 
    });
    if (error) {
        console.error("Insert Error:", error);
        alert(`Error adding customer: ${error.message}`);
    }
    else {
        fetchCustomers();
        setIsFormOpen(false); // Tutup form setelah submit
        setEditingCustomer(null); // Reset editing customer
    }
  };

  const updateCustomer = async (customer) => {
    // Saat update, `created_at` tidak perlu diubah, jadi Supabase akan mengabaikannya
    // atau biarkan saja di objek customer jika tidak ada kolom `created_at` di `form` yang diubah.
    // Jika ada `created_at` di objek customer, Supabase akan mengabaikan update untuk kolom ini jika diatur default
    const { error } = await supabase.from("customers").update(customer).eq("id", customer.id);
    if (error) {
        console.error("Update Error:", error);
        alert(`Error updating customer: ${error.message}`);
    }
    else {
      fetchCustomers();
      setEditingCustomer(null);
      setIsFormOpen(false); // Tutup form setelah submit
    }
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
        const { error } = await supabase.from("customers").delete().eq("id", id);
        if (error) {
            console.error("Delete Error:", error);
            alert(`Error deleting customer: ${error.message}`);
        }
        else fetchCustomers();
    }
  };

  // Helper untuk mendapatkan warna status_member (digunakan untuk badge "Status" di tabel)
  const getStatusMemberColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Deactive':
        return 'bg-red-500';
      case 'Gold':
        return 'bg-green-500';
      case 'Silver':
        return 'bg-green-500';
      case 'Bronze':
        return 'bg-green-500';
      case 'Newcomer':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Helper untuk mendapatkan warna member type (digunakan untuk badge "Member Type" di tabel)
  const getMemberTypeColor = (type) => {
    switch (type) {
      case 'Gold':
        return 'bg-yellow-500';
      case 'Bronze':
        return 'bg-amber-800';
      case 'Silver':
        return 'bg-gray-400';
      case 'Newcomer':
        return 'bg-gray-300';
      default:
        return 'bg-gray-300';
    }
  };

  const handleEditClick = (cust) => {
    setEditingCustomer(cust);
    setIsFormOpen(true); // Buka form saat mode edit
  };

  const handleAddNewClick = () => {
    setEditingCustomer(null); // Pastikan tidak dalam mode edit
    setIsFormOpen(true); // Buka form
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(null); // Pastikan editingCustomer direset saat form ditutup
  };

  // Helper function to format date for display in table
  const formatDateForTable = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Format menjadi YYYY-MM-DD
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Customer Page</h1>

      {/* Member Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Gold Member Total */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg">Gold Member Total</p>
          <p className="text-4xl font-bold text-orange-500 mt-2">{memberSummary.gold.total}</p>
          <p className="text-green-500 text-sm">+{memberSummary.gold.percentage}%</p>
        </div>

        {/* Bronze Member Total */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg">Bronze Member Total</p>
          <p className="text-4xl font-bold text-orange-500 mt-2">{memberSummary.bronze.total}</p>
          <p className="text-green-500 text-sm">+{memberSummary.bronze.percentage}%</p>
        </div>

        {/* Silver Member Total */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg">Silver Member Total</p>
          <p className="text-4xl font-bold text-orange-500 mt-2">{memberSummary.silver.total}</p>
          <p className="text-green-500 text-sm">+{memberSummary.silver.percentage}%</p>
        </div>

        {/* Newcomer Total */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
          <p className="text-gray-600 text-lg">Newcomer Total</p>
          <p className="text-4xl font-bold text-orange-500 mt-2">{memberSummary.newcomer.total}</p>
          <p className="text-red-500 text-sm">+{memberSummary.newcomer.percentage}%</p>
        </div>
      </div>

      {/* Button to open form */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddNewClick}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Add New Customer
        </button>
      </div>

      {/* CustomerForm - Conditionally rendered */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
            <button
              onClick={handleCloseForm}
              className="text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>
          </div>
          <CustomerForm
            addCustomer={addCustomer}
            updateCustomer={updateCustomer}
            editingCustomer={editingCustomer}
            onClose={handleCloseForm} // Kirimkan prop onClose ke form
          />
        </div>
      )}

      {/* Customer List Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Customer List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th> {/* Tambahkan kolom Joined Date */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minuman Favorit</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((cust) => (
                <tr key={cust.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cust.nama}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForTable(cust.created_at)}</td> {/* Tampilkan created_at */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getMemberTypeColor(cust.status_member)}`}>
                      {cust.status_member}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.minuman_favorit}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusMemberColor(cust.status_member)} text-white`}>
                      {cust.status_member === 'Gold' || cust.status_member === 'Silver' || cust.status_member === 'Bronze' ? 'Active' : 'Deactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditClick(cust)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button onClick={() => deleteCustomer(cust.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}