// import { useState, useEffect } from "react";
// import { supabase } from "../supabase"; // Pastikan path supabase benar
// import CustomerForm from "./CustomerForm";

// export default function CustomerPage() {
//   const [customers, setCustomers] = useState([]);
//   const [editingCustomer, setEditingCustomer] = useState(null);
//   const [isFormOpen, setIsFormOpen] = useState(false); // State untuk mengontrol visibilitas form
//   // State untuk pencarian
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState(""); // Mengubah selectedCategory menjadi selectedStatus
//   const [startDate, setStartDate] = useState(""); // State untuk tanggal awal
//   const [endDate, setEndDate] = useState("");   // State untuk tanggal akhir

//   // State untuk data ringkasan member
//   const [memberSummary, setMemberSummary] = useState({
//     gold: { total: 0, percentage: 0 },
//     bronze: { total: 0, percentage: 0 },
//     silver: { total: 0, percentage: 0 },
//     newcomer: { total: 0, percentage: 0 },
//   });

//   // Memanggil fetchCustomers setiap kali ada perubahan pada filter atau pencarian
//   useEffect(() => {
//     fetchCustomers();
//   }, [searchTerm, selectedStatus, startDate, endDate]);

//   useEffect(() => {
//     // Hitung ringkasan member setiap kali data pelanggan berubah
//     calculateMemberSummary();
//   }, [customers]);

//   const fetchCustomers = async () => {
//     let query = supabase.from("customers").select("*");

//     // Filter berdasarkan rentang tanggal
//     if (startDate) {
//       query = query.gte("created_at", `${startDate}T00:00:00.000Z`);
//     }
//     if (endDate) {
//       query = query.lt("created_at", `${endDate}T23:59:59.999Z`);
//     }

//     // Filter berdasarkan status
//     if (selectedStatus) {
//       query = query.eq("status_member", selectedStatus);
//     }

//     // Filter berdasarkan search term (nama)
//     if (searchTerm) {
//       query = query.ilike("nama", `%${searchTerm}%`);
//     }
    
//     // Mengubah order by menjadi 'created_at' karena 'joined_date' tidak ada di skema
//     const { data, error } = await query.order("created_at", { ascending: false });
//     if (error) console.error("Fetch Error:", error);
//     else setCustomers(data);
//   };

//   const calculateMemberSummary = () => {
//     // Menggunakan cust.status_member
//     const gold = customers.filter(cust => cust.status_member === 'Gold').length;
//     const bronze = customers.filter(cust => cust.status_member === 'Bronze').length;
//     const silver = customers.filter(cust => cust.status_member === 'Silver').length;
//     const newcomer = customers.filter(cust => cust.status_member === 'Newcomer').length;

//     const totalCustomers = customers.length;

//     setMemberSummary({
//       gold: { total: gold, percentage: totalCustomers > 0 ? ((gold / totalCustomers) * 100).toFixed(0) : 0 },
//       bronze: { total: bronze, percentage: totalCustomers > 0 ? ((bronze / totalCustomers) * 100).toFixed(0) : 0 },
//       silver: { total: silver, percentage: totalCustomers > 0 ? ((silver / totalCustomers) * 100).toFixed(0) : 0 },
//       newcomer: { total: newcomer, percentage: totalCustomers > 0 ? ((newcomer / totalCustomers) * 100).toFixed(0) : 0 },
//     });
//   };

//   const addCustomer = async (customer) => {
//     // Kolom 'created_at' akan otomatis diisi oleh database Supabase
//     // Anda tidak perlu mengirimkannya secara eksplisit di sini.
//     const { error } = await supabase.from("customers").insert({
//       ...customer,
//       role: customer.role || "User",
//     });
//     if (error) {
//         console.error("Insert Error:", error);
//         alert(`Error adding customer: ${error.message}`);
//     }
//     else {
//         fetchCustomers();
//         setIsFormOpen(false); // Tutup form setelah submit
//         setEditingCustomer(null); // Reset editing customer
//     }
//   };

//   const updateCustomer = async (customer) => {
//     // Saat update, `created_at` tidak perlu diubah, jadi Supabase akan mengabaikannya
//     // atau biarkan saja di objek customer jika tidak ada kolom `created_at` di `form` yang diubah.
//     // Jika ada `created_at` di objek customer, Supabase akan mengabaikan update untuk kolom ini jika diatur default
//     const { error } = await supabase.from("customers").update(customer).eq("id", customer.id);
//     if (error) {
//         console.error("Update Error:", error);
//         alert(`Error updating customer: ${error.message}`);
//     }
//     else {
//       fetchCustomers();
//       setEditingCustomer(null);
//       setIsFormOpen(false); // Tutup form setelah submit
//     }
//   };

//   const deleteCustomer = async (id) => {
//     if (window.confirm("Are you sure you want to delete this customer?")) {
//         const { error } = await supabase.from("customers").delete().eq("id", id);
//         if (error) {
//             console.error("Delete Error:", error);
//             alert(`Error deleting customer: ${error.message}`);
//         }
//         else fetchCustomers();
//     }
//   };

//   // Helper untuk mendapatkan warna status_member (digunakan untuk badge "Status" di tabel)
//   const getStatusMemberColor = (status) => {
//     switch (status) {
//       case 'Active':
//         return 'bg-green-500';
//       case 'Deactive':
//         return 'bg-red-500';
//       case 'Gold':
//         return 'bg-green-500';
//       case 'Silver':
//         return 'bg-green-500';
//       case 'Bronze':
//         return 'bg-green-500';
//       case 'Newcomer':
//         return 'bg-gray-500';
//       default:
//         return 'bg-gray-500';
//     }
//   };

//   // Helper untuk mendapatkan warna member type (digunakan untuk badge "Member Type" di tabel)
//   const getMemberTypeColor = (type) => {
//     switch (type) {
//       case 'Gold':
//         return 'bg-yellow-500';
//       case 'Bronze':
//         return 'bg-amber-800';
//       case 'Silver':
//         return 'bg-gray-400';
//       case 'Newcomer':
//         return 'bg-gray-300';
//       default:
//         return 'bg-gray-300';
//     }
//   };

//   const handleEditClick = (cust) => {
//     setEditingCustomer(cust);
//     setIsFormOpen(true); // Buka form saat mode edit
//   };

//   const handleAddNewClick = () => {
//     setEditingCustomer(null); // Pastikan tidak dalam mode edit
//     setIsFormOpen(true); // Buka form
//   };

//   const handleCloseForm = () => {
//     setIsFormOpen(false);
//     setEditingCustomer(null); // Pastikan editingCustomer direset saat form ditutup
//   };

//   // Helper function to format date for display in table
//   const formatDateForTable = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     // Format menjadi YYYY-MM-DD
//     return date.toISOString().split('T')[0];
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Customer Page</h1>

//       {/* Member Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {/* Gold Member Total */}
//         <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
//           <p className="text-gray-600 text-lg">Gold Member Total</p>
//           <p className="text-4xl font-bold text-orange-500 mt-2">{memberSummary.gold.total}</p>
//           <p className="text-green-500 text-sm">+{memberSummary.gold.percentage}%</p>
//         </div>

//         {/* Bronze Member Total */}
//         <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
//           <p className="text-gray-600 text-lg">Bronze Member Total</p>
//           <p className="text-4xl font-bold text-orange-500 mt-2">{memberSummary.bronze.total}</p>
//           <p className="text-green-500 text-sm">+{memberSummary.bronze.percentage}%</p>
//         </div>

//         {/* Silver Member Total */}
//         <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
//           <p className="text-gray-600 text-lg">Silver Member Total</p>
//           <p className="text-4xl font-bold text-orange-500 mt-2">{memberSummary.silver.total}</p>
//           <p className="text-green-500 text-sm">+{memberSummary.silver.percentage}%</p>
//         </div>

//         {/* Newcomer Total */}
//         <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center">
//           <p className="text-gray-600 text-lg">Newcomer Total</p>
//           <p className="text-4xl font-bold text-orange-500 mt-2">{memberSummary.newcomer.total}</p>
//           <p className="text-red-500 text-sm">+{memberSummary.newcomer.percentage}%</p>
//         </div>
//       </div>

//       {/* Date Range Filter and Add New Button */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
//         <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
//           <div className="flex items-center gap-2">
//             <label htmlFor="startDate" className="text-sm font-medium text-gray-700 whitespace-nowrap">Dari Tanggal:</label>
//             <input
//               type="date"
//               id="startDate"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <label htmlFor="endDate" className="text-sm font-medium text-gray-700 whitespace-nowrap">Sampai Tanggal:</label>
//             <input
//               type="date"
//               id="endDate"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full"
//             />
//           </div>
//         </div>
//         <button
//           onClick={handleAddNewClick}
//           className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//           </svg>
//           Buat Pesanan Baru
//         </button>
//       </div>

//       {/* Customer List Table */}
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v2m14 0a2 2 0 01-2 2H7a2 2 0 01-2-2m7 7h.01" />
//           </svg>
//           Daftar Permintaan Pesanan
//         </h2>
        
//         {/* Search and Status Filter */}
//         <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
//             <div className="flex-1 w-full md:w-auto">
//                 <input
//                     type="text"
//                     id="search"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     placeholder="Cari nama pelanggan..."
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//             </div>
//             <div className="w-full md:w-auto">
//                 <select
//                     id="status"
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 >
//                     <option value="">Semua Status</option>
//                     <option value="Active">Active</option>
//                     <option value="Deactive">Deactive</option>
//                     <option value="Gold">Gold</option>
//                     <option value="Silver">Silver</option>
//                     <option value="Bronze">Bronze</option>
//                     <option value="Newcomer">Newcomer</option>
//                 </select>
//             </div>
//             <div className="text-gray-500 font-medium whitespace-nowrap mt-2 md:mt-0">
//                 Total hasil: {customers.length}
//             </div>
//         </div>

//         {/* CustomerForm - Conditionally rendered */}
//         {isFormOpen && (
//           <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-2xl font-bold text-gray-800">{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
//               <button
//                 onClick={handleCloseForm}
//                 className="text-gray-500 hover:text-gray-800 text-xl font-bold"
//               >
//                 &times;
//               </button>
//             </div>
//             <CustomerForm
//               addCustomer={addCustomer}
//               updateCustomer={updateCustomer}
//               editingCustomer={editingCustomer}
//               onClose={handleCloseForm} // Kirimkan prop onClose ke form
//             />
//           </div>
//         )}

//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 {/* Tambahkan kolom ID di sini */}
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th> {/* Tambahkan kolom Joined Date */}
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Type</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minuman Favorit</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {customers.map((cust, index) => ( // Tambahkan 'index' di sini
//                 <tr key={cust.id}>
//                   {/* Tampilkan nomor urut sebagai ID */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cust.nama}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateForTable(cust.created_at)}</td> {/* Tampilkan created_at */}
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getMemberTypeColor(cust.status_member)}`}>
//                       {cust.status_member}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cust.minuman_favorit}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusMemberColor(cust.status_member)} text-white`}>
//                       {cust.status_member === 'Gold' || cust.status_member === 'Silver' || cust.status_member === 'Bronze' ? 'Active' : 'Deactive'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button onClick={() => handleEditClick(cust)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
//                     <button onClick={() => deleteCustomer(cust.id)} className="text-red-600 hover:text-red-900">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Pastikan path supabase benar
import CustomerForm from "./CustomerForm";
import Swal from 'sweetalert2'; // Pastikan SweetAlert2 sudah diinstal dan diimport

// Import Feather Icons atau Font Awesome jika digunakan
import { Plus, Edit, Trash2, Search, Filter, Calendar, Users, BarChart } from 'lucide-react'; // Contoh menggunakan lucide-react
// Jika menggunakan Font Awesome, pastikan ada CDN atau import yang sesuai di project Anda
// import '@fortawesome/fontawesome-free/css/all.min.css';

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  const [error, setError] = useState(null); // Tambahkan state error

  const [memberSummary, setMemberSummary] = useState({
    gold: { total: 0, percentage: 0 },
    bronze: { total: 0, percentage: 0 },
    silver: { total: 0, percentage: 0 },
    newcomer: { total: 0, percentage: 0 },
  });

  // Memanggil fetchCustomers setiap kali ada perubahan pada filter atau pencarian
  useEffect(() => {
    fetchCustomers();
  }, [searchTerm, selectedStatus, startDate, endDate]);

  useEffect(() => {
    // Hitung ringkasan member setiap kali data pelanggan berubah
    calculateMemberSummary();
  }, [customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from("customers").select("*");

      if (startDate) {
        query = query.gte("created_at", `${startDate}T00:00:00.000Z`);
      }
      if (endDate) {
        query = query.lt("created_at", `${endDate}T23:59:59.999Z`);
      }

      if (selectedStatus) {
        query = query.eq("status_member", selectedStatus);
      }

      if (searchTerm) {
        query = query.ilike("nama", `%${searchTerm}%`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      setCustomers(data);
    } catch (err) {
      console.error("Fetch Error:", err.message);
      setError("Gagal memuat data pelanggan. Pastikan koneksi dan tabel benar.");
      Swal.fire('Error', `Gagal memuat data: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateMemberSummary = () => {
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
    try {
      const { error } = await supabase.from("customers").insert({
        ...customer,
        role: customer.role || "User",
      });
      if (error) throw error;
      fetchCustomers();
      setIsFormOpen(false);
      setEditingCustomer(null);
      Swal.fire('Sukses!', 'Pelanggan berhasil ditambahkan.', 'success');
    } catch (err) {
      console.error("Insert Error:", err.message);
      Swal.fire('Error', `Gagal menambahkan pelanggan: ${err.message}`, 'error');
    }
  };

  const updateCustomer = async (customer) => {
    try {
      const { error } = await supabase.from("customers").update(customer).eq("id", customer.id);
      if (error) throw error;
      fetchCustomers();
      setEditingCustomer(null);
      setIsFormOpen(false);
      Swal.fire('Sukses!', 'Pelanggan berhasil diperbarui.', 'success');
    } catch (err) {
      console.error("Update Error:", err.message);
      Swal.fire('Error', `Gagal memperbarui pelanggan: ${err.message}`, 'error');
    }
  };

  const deleteCustomer = async (id, nama) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Anda akan menghapus data pelanggan "${nama}"!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f97316', // Oranye
      cancelButtonColor: '#6b7280', // Abu-abu
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase.from("customers").delete().eq("id", id);
          if (error) throw error;
          fetchCustomers();
          Swal.fire('Terhapus!', 'Pelanggan berhasil dihapus.', 'success');
        } catch (err) {
          console.error("Delete Error:", err.message);
          Swal.fire('Error', `Gagal menghapus pelanggan: ${err.message}`, 'error');
        }
      }
    });
  };

  const getStatusMemberColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'Deactive': return 'bg-red-500';
      // Gold, Silver, Bronze, Newcomer akan ditangani oleh getMemberTypeColor
      default: return 'bg-gray-500';
    }
  };

  const getMemberTypeColor = (type) => {
    switch (type) {
      case 'Gold': return 'bg-yellow-500 text-yellow-900'; // Kuning keemasan
      case 'Bronze': return 'bg-amber-800 text-white'; // Coklat gelap
      case 'Silver': return 'bg-gray-400 text-gray-800'; // Abu-abu perak
      case 'Newcomer': return 'bg-blue-300 text-blue-900'; // Biru muda untuk pendatang baru
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  const handleEditClick = (cust) => {
    setEditingCustomer(cust);
    setIsFormOpen(true);
  };

  const handleAddNewClick = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingCustomer(null);
  };

  const formatDateForTable = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-inter">
      {/* Header Halaman */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-orange-700 mb-2">
          <Users className="inline-block mr-3 w-8 h-8" /> Manajemen Pelanggan
        </h1>
        <div className="w-24 h-1 bg-orange-700 rounded-full mx-auto mb-6" />
        <p className="text-gray-600 text-base max-w-lg mx-auto">
          Kelola data pelanggan dan pantau status keanggotaan mereka di sini.
        </p>
      </header>

      {/* Member Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(memberSummary).map(([key, data]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center border-b-4 border-orange-400 transform hover:scale-105 transition-transform duration-200">
            <p className="text-gray-600 text-lg font-medium capitalize mb-2">{key} Member</p>
            <p className="text-4xl font-extrabold text-orange-600">{data.total}</p>
            <p className={`text-sm mt-1 ${data.percentage > 0 ? 'text-green-500' : 'text-gray-500'}`}>
              {data.percentage}% dari total
            </p>
          </div>
        ))}
      </div>

      {/* Form Tambah/Edit Pelanggan (selalu di atas tabel jika terbuka) */}
      {isFormOpen && (
        <section className="mb-8 p-6 bg-white rounded-lg shadow-xl border-l-4 border-orange-500">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-orange-700 flex items-center">
              <Users className="inline-block mr-3 w-6 h-6" /> {editingCustomer ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
            </h2>
            <button
              onClick={handleCloseForm}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors duration-200"
              title="Tutup Formulir"
            >
              <X size={20} />
            </button>
          </div>
          <CustomerForm
            addCustomer={addCustomer}
            updateCustomer={updateCustomer}
            editingCustomer={editingCustomer}
            onClose={handleCloseForm}
          />
        </section>
      )}

      {/* Filter dan Tombol Tambah Pelanggan */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-l-4 border-orange-300">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              <Calendar size={18} className="inline-block mr-1 text-orange-500" />Dari:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="endDate" className="text-sm font-medium text-gray-700 whitespace-nowrap">
              <Calendar size={18} className="inline-block mr-1 text-orange-500" />Sampai:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-full md:w-auto"
            />
          </div>
        </div>
        <button
          onClick={handleAddNewClick}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={20} /> Tambah Pelanggan Baru
        </button>
      </div>

      {/* Customer List Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
        <h2 className="text-2xl font-bold text-orange-700 mb-6 flex items-center gap-2">
          <BarChart className="inline-block mr-2 w-6 h-6" /> Daftar Pelanggan
        </h2>

        {/* Search and Status Filter */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1 w-full md:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama pelanggan..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-full md:w-auto relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="">Semua Status Member</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
              <option value="Newcomer">Newcomer</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <div className="text-gray-500 font-medium whitespace-nowrap mt-2 md:mt-0">
            Total hasil: {customers.length}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500 mb-3"></div>
            <p className="text-lg text-orange-600 font-medium">Memuat data pelanggan...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Oops!</strong>
            <span className="block sm:inline"> {error}</span>
            <p className="text-sm mt-1">Pastikan koneksi internet Anda stabil dan konfigurasi Supabase sudah benar.</p>
          </div>
        )}

        {!loading && customers.length === 0 && !error && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-orange-300 rounded-lg p-6">
            <Users className="inline-block mb-3 text-orange-400" size={48} />
            <p className="text-lg font-medium">Belum ada data pelanggan.</p>
            <p className="text-md">Silakan gunakan tombol "Tambah Pelanggan Baru" untuk menambahkan data.</p>
          </div>
        )}

        {/* Table of Customers */}
        {!loading && customers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-orange-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">No.</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Nama</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Tanggal Bergabung</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Tipe Member</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Kontak (Email)</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Minuman Favorit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Status Akun</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-orange-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((cust, index) => (
                  <tr key={cust.id} className="hover:bg-orange-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cust.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDateForTable(cust.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMemberTypeColor(cust.status_member)}`}>
                        {cust.status_member}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cust.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cust.minuman_favorit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusMemberColor(cust.status_member === 'Gold' || cust.status_member === 'Silver' || cust.status_member === 'Bronze' ? 'Active' : 'Deactive')} text-white`}>
                        {cust.status_member === 'Gold' || cust.status_member === 'Silver' || cust.status_member === 'Bronze' ? 'Active' : 'Deactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(cust)}
                        className="text-orange-600 hover:text-orange-900 mr-4 inline-flex items-center"
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => deleteCustomer(cust.id, cust.nama)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash2 size={16} className="mr-1" /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}