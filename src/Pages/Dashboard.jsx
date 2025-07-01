// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { supabase } from '../supabase'; // PASTIKAN PATH INI BENAR!
// import {
//   PieChart, Pie, Cell,
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from 'recharts';
// import {
//   DollarSign, ShoppingBag, CheckCircle, Clock, // Icons for StatCards
//   Download, ChevronDown, Users, Package, // Icons for general use (Package for products)
// } from 'lucide-react'; // Import ikon dari lucide-react

// const Dashboard = () => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // State untuk data yang akan ditampilkan
//   const [totalSalesAmount, setTotalSalesAmount] = useState(0);
//   const [totalOrdersCount, setTotalOrdersCount] = useState(0);
//   const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
//   const [processingOrdersCount, setProcessingOrdersCount] = useState(0);
//   const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
//   const [canceledOrdersCount, setCanceledOrdersCount] = useState(0);

//   const [topProducts, setTopProducts] = useState([]);
//   const [topCustomers, setTopCustomers] = useState([]);

//   const [monthlySalesData, setMonthlySalesData] = useState([]);

//   // Data untuk Status Pesanan (menggantikan Aktivitas Email)
//   const orderStatusData = useMemo(() => ([
//     { name: 'Selesai', value: completedOrdersCount },
//     { name: 'Diproses', value: processingOrdersCount },
//     { name: 'Tertunda', value: pendingOrdersCount },
//     { name: 'Dibatalkan', value: canceledOrdersCount },
//   ].filter(item => item.value > 0)), [completedOrdersCount, processingOrdersCount, pendingOrdersCount, canceledOrdersCount]);

//   const ORDER_STATUS_COLORS = ['#20c997', '#fb923c', '#4d9be6', '#dc3545']; // Hijau, Oranye, Biru, Merah

//   // State dan data untuk Distribusi Gender Pelanggan
//   const [genderDistribution, setGenderDistribution] = useState({
//     men: 0,
//     women: 0,
//     notIdentify: 0,
//   });

//   const genderPieData = useMemo(() => ([
//     { name: 'Pria', value: genderDistribution.men },
//     { name: 'Wanita', value: genderDistribution.women },
//     { name: 'Tidak Diketahui', value: genderDistribution.notIdentify },
//   ].filter(item => item.value > 0)), [genderDistribution]);
//   const GENDER_COLORS = ['#3B82F6', '#EC4899', '#9CA3AF']; // Biru, Pink, Abu-abu

//   // State untuk pilihan periode
//   const [selectedPeriod, setSelectedPeriod] = useState('Current Month');

//   // Helper untuk mendapatkan nama bulan
//   const getMonthName = (year, monthIndex) => {
//     const date = new Date(year, monthIndex, 1);
//     return date.toLocaleString('id-ID', { month: 'short', year: '2-digit' });
//   };

//   // Helper untuk mengisi data chart bulanan
//   const generateMonthlySalesData = useCallback((orders, numberOfMonths, endDate) => {
//     const dataMap = new Map();
//     let currentMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

//     for (let i = 0; i < numberOfMonths; i++) {
//       const monthKey = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
//       dataMap.set(monthKey, { name: getMonthName(currentMonth.getFullYear(), currentMonth.getMonth()), uv: 0 });
//       currentMonth.setMonth(currentMonth.getMonth() - 1);
//     }

//     orders.forEach(order => {
//       const date = new Date(order.created_at);
//       const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
//       if (dataMap.has(monthKey) && order.status === 'Completed') {
//         const currentData = dataMap.get(monthKey);
//         currentData.uv += (order.total_amount || 0);
//         dataMap.set(monthKey, currentData);
//       }
//     });

//     return Array.from(dataMap.values()).sort((a, b) => {
//       const parseMonthYear = (name) => {
//         const parts = name.split(' ');
//         let year, monthIndex;
//         if (parts.length === 2) {
//           year = 2000 + parseInt(parts[1]);
//           monthIndex = new Date(`${parts[0]} 1, 2000`).getMonth();
//         } else {
//           year = new Date().getFullYear();
//           monthIndex = new Date(`${parts[0]} 1, ${year}`).getMonth();
//         }
//         return new Date(year, monthIndex);
//       };

//       const dateA = parseMonthYear(a.name);
//       const dateB = parseMonthYear(b.name);

//       return dateA.getTime() - dateB.getTime();
//     });
//   }, []);

//   // Fungsi utama untuk mengambil semua data dashboard
//   const fetchDashboardData = useCallback(async (period) => {
//     setLoading(true);
//     setError(null);

//     let startDate, endDate;
//     const now = new Date();
//     now.setHours(23, 59, 59, 999);

//     switch (period) {
//       case 'Current Month':
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//         endDate = now;
//         break;
//       case 'Last Month':
//         startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//         endDate = new Date(now.getFullYear(), now.getMonth(), 0);
//         break;
//       case 'Last 3 Months':
//         startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
//         endDate = now;
//         break;
//       case 'Last 6 Months':
//         startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
//         endDate = now;
//         break;
//       case 'Last 12 Months':
//         startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
//         endDate = now;
//         break;
//       default:
//         startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//         endDate = now;
//     }

//     try {
//       // 1. Ambil data produk untuk pemetaan gambar
//       const { data: produkData, error: produkError } = await supabase
//         .from('produk') // Menggunakan nama tabel 'produk'
//         .select('id, nama, gambar'); // Mengambil kolom 'gambar'
//       if (produkError) throw produkError;
//       const productMap = new Map(produkData.map(p => [p.id, p]));

//       // START MODIFIKASI UNTUK PROFILE PICTURE
//       const { data: usersData, error: usersError } = await supabase
//         .from('users') // Mengakses tabel 'users' di skema 'auth'
//         .select('id, email, user_metadata'); // Ambil email dan user_metadata untuk avatar_url/full_name

//       if (usersError) {
//           console.warn("Could not fetch user data from 'auth.users' table. Profile pictures might be missing:", usersError.message);
//       }

//       // Buat peta untuk mencari gambar profil berdasarkan email atau nama lengkap
//       const userProfilePictureMap = new Map();
//       if (usersData) {
//           usersData.forEach(user => {
//               const email = user.email;
//               const fullName = user.user_metadata?.full_name;
//               let profilePicture = null;

//               if (user.user_metadata?.avatar_url) {
//                   profilePicture = user.user_metadata.avatar_url;
//               } else if (fullName) {
//                   profilePicture = `https://api.dicebear.com/8.x/initials/svg?seed=${fullName}&radius=50&backgroundColor=008080,FB923C&size=40`;
//               } else {
//                   profilePicture = `https://api.dicebear.com/8.x/initials/svg?seed=${email}&radius=50&backgroundColor=008080,FB923C&size=40`;
//               }

//               userProfilePictureMap.set(email, profilePicture);
//               if (fullName) {
//                   userProfilePictureMap.set(fullName, profilePicture); // Juga simpan berdasarkan full_name
//               }
//           });
//       }
//       // END MODIFIKASI UNTUK PROFILE PICTURE

//       // 2. Ambil data pelanggan (tetap dipertahankan, mungkin berguna untuk validasi nama)
//       const { data: customersData, error: customersError } = await supabase
//         .from('customers')
//         .select('id, nama');
//       if (customersError) throw customersError;
//       const customerNameMap = new Map(customersData.map(c => [c.nama, c.id]));

//       // 3. Ambil data pesanan (tanpa customer_email)
//       const { data: ordersData, error: ordersError } = await supabase
//       .from("orders")
//       .select(`
//         id,
//         status,
//         total_amount,
//         created_at,
//         customer_name,
//         order_items (
//           product_id,
//           product_name,
//           quantity,
//           price_per_unit
//         )
//       `)
//       .gte('created_at', startDate.toISOString())
//       .lte('created_at', endDate.toISOString());

//       if (ordersError) throw ordersError;

//       let totalSales = 0;
//       let totalOrders = ordersData.length;
//       let completed = 0;
//       let processing = 0;
//       let pending = 0;
//       let canceled = 0;

//       const productSales = {}; // Untuk Top Products
//       const customerSpending = {}; // Untuk Top Customers

//       ordersData.forEach(order => {
//         if (order.status === 'Completed') {
//           totalSales += order.total_amount || 0;
//           completed++;
//         }

//         switch (order.status) {
//           case 'Processing': processing++; break;
//           case 'Pending': pending++; break;
//           case 'Canceled': canceled++; break;
//           default: break;
//         }

//         // Hitung penjualan produk
//         order.order_items.forEach(item => {
//           const productId = item.product_id;
//           const productInfo = productMap.get(productId);
//           const productName = productInfo?.nama || item.product_name;
//           const imageUrl = productInfo?.gambar || `https://placehold.co/40x40/FFDDC1/FF8C00?text=${productName.substring(0,1)}`;

//           if (!productSales[productName]) {
//             productSales[productName] = { totalSold: 0, totalProfit: 0, imageUrl: imageUrl };
//           }
//           productSales[productName].totalSold += item.quantity;
//           productSales[productName].totalProfit += (item.quantity * item.price_per_unit) || 0;
//         });

//         // Hitung pengeluaran pelanggan
//         const customerName = order.customer_name;
//         if (customerName) {
//           let customerImageUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${customerName}&radius=50&backgroundColor=008080,FB923C&size=40`; // Default DiceBear

//           // MODIFIKASI: Coba ambil gambar dari userProfilePictureMap menggunakan customerName
//           // Jika customerName cocok dengan email atau full_name di auth.users
//           if (userProfilePictureMap.has(customerName)) {
//               customerImageUrl = userProfilePictureMap.get(customerName);
//           }
//           // END MODIFIKASI

//           if (!customerSpending[customerName]) {
//             customerSpending[customerName] = { totalOrders: 0, totalExpenses: 0, imageUrl: customerImageUrl };
//           }
//           customerSpending[customerName].totalOrders++;
//           customerSpending[customerName].totalExpenses += order.total_amount || 0;
//           // Pastikan imageUrl diperbarui jika ditemukan yang lebih spesifik
//           customerSpending[customerName].imageUrl = customerImageUrl;
//         }
//       });

//       // Sortir dan potong Top 5 Produk
//       const sortedProducts = Object.entries(productSales)
//         .map(([name, data], index) => ({
//           id: index + 1, // ID sementara
//           name: name,
//           totalSold: data.totalSold,
//           profits: data.totalProfit,
//           imageUrl: data.imageUrl
//         }))
//         .sort((a, b) => b.totalSold - a.totalSold)
//         .slice(0, 5);

//       // Sortir dan potong Top 5 Pelanggan
//       const sortedCustomers = Object.entries(customerSpending)
//         .map(([name, data], index) => ({
//           id: index + 1, // ID sementara
//           name: name,
//           totalOrder: data.totalOrders,
//           expenses: data.totalExpenses,
//           imageUrl: data.imageUrl // Gambar profil yang sudah digabungkan
//         }))
//         .sort((a, b) => b.expenses - a.expenses)
//         .slice(0, 5);

//       let numberOfMonthsForChart = 1; // Default untuk Current Month
//       if (period === 'Last Month') numberOfMonthsForChart = 2;
//       if (period === 'Last 3 Months') numberOfMonthsForChart = 3;
//       if (period === 'Last 6 Months') numberOfMonthsForChart = 6;
//       if (period === 'Last 12 Months') numberOfMonthsForChart = 12;

//       setMonthlySalesData(generateMonthlySalesData(ordersData, numberOfMonthsForChart, endDate));

//       setTotalSalesAmount(totalSales);
//       setTotalOrdersCount(totalOrders);
//       setCompletedOrdersCount(completed);
//       setProcessingOrdersCount(processing);
//       setPendingOrdersCount(pending);
//       setCanceledOrdersCount(canceled);
//       setTopProducts(sortedProducts);
//       setTopCustomers(sortedCustomers);

//     } catch (err) {
//       console.error("Fetch Dashboard Data Error:", err.message);
//       setError("Gagal memuat data dashboard. Pastikan koneksi Supabase dan tabel sudah benar.");
//     } finally {
//       setLoading(false);
//     }
//   }, [generateMonthlySalesData]);

//   // Fungsi untuk mengambil data distribusi gender
//   const fetchGenderData = useCallback(async () => {
//     try {
//       const { data: customersData, error: customersError } = await supabase
//         .from('customers')
//         .select('jenis_kelamin');

//       if (customersError) throw customersError;

//       const genderCounts = { 'Pria': 0, 'Wanita': 0, 'Tidak Diketahui': 0 };
//       let totalCustomersWithGenderData = 0;

//       customersData.forEach(customer => {
//         if (customer.jenis_kelamin) {
//           totalCustomersWithGenderData++;
//           const gender = customer.jenis_kelamin;
//           if (gender === 'Pria') {
//             genderCounts['Pria']++;
//           } else if (gender === 'Wanita') {
//             genderCounts['Wanita']++;
//           } else {
//             genderCounts['Tidak Diketahui']++;
//           }
//         } else {
//           genderCounts['Tidak Diketahui']++; // Perlakukan null/undefined gender sebagai "Tidak Diketahui"
//           totalCustomersWithGenderData++;
//         }
//       });

//       if (totalCustomersWithGenderData > 0) {
//         setGenderDistribution({
//           men: Math.round((genderCounts['Pria'] / totalCustomersWithGenderData) * 100),
//           women: Math.round((genderCounts['Wanita'] / totalCustomersWithGenderData) * 100),
//           notIdentify: Math.round((genderCounts['Tidak Diketahui'] / totalCustomersWithGenderData) * 100),
//         });
//       } else {
//         setGenderDistribution({ men: 0, women: 0, notIdentify: 0 });
//       }

//     } catch (err) {
//       console.error("Fetch Gender Data Error:", err.message);
//     }
//   }, []);

//   // Efek samping untuk mengambil data saat komponen dimuat atau periode berubah
//   useEffect(() => {
//     fetchDashboardData(selectedPeriod);
//     fetchGenderData();
//   }, [fetchDashboardData, fetchGenderData, selectedPeriod]);

//   // Handler untuk perubahan periode
//   const handlePeriodChange = (event) => {
//     setSelectedPeriod(event.target.value);
//   };

//   // Handler untuk tombol Unduh Laporan
//   const handleDownloadReport = () => {
//     alert('Fungsi unduh laporan sedang dikembangkan...');
//     // Di sini Anda dapat mengimplementasikan logika untuk menghasilkan dan mengunduh laporan (misalnya PDF/Excel)
//     // Ini biasanya melibatkan pemanggilan API backend atau penggunaan library frontend seperti jsPDF atau SheetJS.
//   };

//   // Komponen Helper untuk Card Statistik
//   const StatCard = ({ title, value, percentage, isPositive, description, icon: IconComponent }) => {
//     const percentageColorClass = isPositive ? 'text-green-500' : 'text-red-500';
//     const formattedValue = typeof value === 'number' ? (title.includes('Penjualan') ? `Rp ${value.toLocaleString('id-ID')}` : value.toLocaleString('id-ID')) : value;

//     return (
//       <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start transition duration-300 ease-in-out hover:shadow-lg">
//         <div className="flex items-center mb-3">
//           {IconComponent && <IconComponent className="text-orange-500 mr-3" size={28} />}
//           <h3 className="text-gray-600 text-lg font-semibold">{title}</h3>
//         </div>
//         <p className="text-4xl font-bold text-gray-900 mb-2">{formattedValue}</p>
//         {percentage !== undefined && percentage !== null && (
//           <p className={`${percentageColorClass} text-sm flex items-center`}>
//             {Math.abs(Math.round(percentage))}% <span className="text-gray-500 ml-1">{description}</span>
//           </p>
//         )}
//       </div>
//     );
//   };

//   // Tampilan loading dan error
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
//         <p className="ml-4 text-lg text-gray-600 mt-4">Memuat data dashboard...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex justify-center items-center bg-gray-50">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative shadow-md">
//           <strong className="font-bold">Oops! Error:</strong>
//           <span className="block sm:inline ml-2"> {error}</span>
//           <p className="mt-2 text-sm">Silakan periksa koneksi internet Anda atau konfigurasi Supabase.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       <div className="p-6 lg:p-8">
//         {/* Bagian Selamat Datang */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang Kembali, Admin!</h2>
//             <p className="text-gray-600">Inilah ringkasan toko Anda hari ini.</p>
//           </div>
//           <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
//             <button
//               onClick={handleDownloadReport}
//               className="bg-orange-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-orange-700 transition-colors duration-200 flex items-center"
//             >
//               <Download size={20} className="mr-2" /> Unduh Laporan
//             </button>
//             <div className="relative">
//               <select
//                 className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
//                 value={selectedPeriod}
//                 onChange={handlePeriodChange}
//               >
//                 {/* PENTING: Ubah nilai 'value' agar sesuai dengan 'case' di fungsi fetchDashboardData */}
//                 <option value="Current Month">Bulan Ini</option>
//                 <option value="Last Month">Bulan Lalu</option>
//                 <option value="Last 3 Months">3 Bulan Terakhir</option>
//                 <option value="Last 6 Months">6 Bulan Terakhir</option>
//                 <option value="Last 12 Months">12 Bulan Terakhir</option>
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
//             </div>
//           </div>
//         </div>

//         {/* Tab Ringkasan */}
//         <div className="flex space-x-2 mb-6">
//           <button className="px-5 py-2 bg-orange-600 text-white rounded-lg font-medium shadow-md transition-all duration-200 hover:bg-orange-700">Ringkasan</button>
//         </div>

//         {/* Grid Kartu Ringkasan */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//           <StatCard
//             title="Total Penjualan"
//             value={totalSalesAmount}
//             icon={DollarSign}
//             description={`dari pesanan selesai (${selectedPeriod})`}
//           />

//           <StatCard
//             title="Total Pesanan"
//             value={totalOrdersCount}
//             icon={ShoppingBag}
//             description={`semua status (${selectedPeriod})`}
//           />

//           <StatCard
//             title="Pesanan Selesai"
//             value={completedOrdersCount}
//             percentage={totalOrdersCount > 0 ? (completedOrdersCount / totalOrdersCount) * 100 : 0}
//             isPositive={true}
//             icon={CheckCircle}
//             description="dari total pesanan"
//           />

//           <StatCard
//             title="Pesanan Diproses"
//             value={processingOrdersCount}
//             percentage={totalOrdersCount > 0 ? (processingOrdersCount / totalOrdersCount) * 100 : 0}
//             isPositive={false}
//             icon={Clock}
//             description="sedang dalam proses"
//           />
//         </div>

//         {/* Bagian Grafik */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Grafik Status Pesanan */}
//           <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
//             <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Status Pesanan ({selectedPeriod})</h3>
//             <div className="flex flex-col items-center">
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={orderStatusData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {orderStatusData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="text-center text-gray-600 mt-2">
//                 <p className="text-4xl font-bold text-gray-900">
//                   {totalOrdersCount}
//                 </p>
//                 <p className="text-lg">Total Pesanan</p>
//               </div>
//               <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 w-full mt-4 text-sm text-gray-600 font-medium">
//                 {orderStatusData.map((data, index) => (
//                   <p key={data.name} className="flex items-center">
//                     <span className="w-3 h-3 inline-block rounded-full mr-2" style={{ backgroundColor: ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length] }}></span>
//                     {data.name}: {data.value}
//                   </p>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Grafik Batang Penjualan */}
//           <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
//             <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Performa Penjualan ({selectedPeriod})</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart
//                 data={monthlySalesData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//                 <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#cccccc' }} />
//                 <YAxis
//                   tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
//                   tickLine={false}
//                   axisLine={{ stroke: '#cccccc' }}
//                 />
//                 <Tooltip
//                   formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah Penjualan']}
//                   labelFormatter={(label) => `Bulan: ${label}`}
//                   contentStyle={{
//                     borderRadius: '8px',
//                     borderColor: '#e0e0e0',
//                     boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
//                   }}
//                   itemStyle={{ color: '#333' }}
//                   labelStyle={{ color: '#555', fontWeight: 'bold' }}
//                 />
//                 <Legend wrapperStyle={{ paddingTop: '10px' }} />
//                 <Bar dataKey="uv" name="Jumlah Penjualan" fill="#fb923c" barSize={30} radius={[5, 5, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Bagian Produk Terlaris dan Pelanggan Teratas */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//           {/* Top 5 Produk Terlaris */}
//           <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
//             <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Top 5 Produk Terlaris ({selectedPeriod})</h3>
//             <ul className="space-y-4">
//               {topProducts.length > 0 ? (
//                 topProducts.map((product) => (
//                   <li key={product.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
//                     <div className="flex items-center">
//                       <img
//                         src={product.imageUrl}
//                         alt={product.name}
//                         className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200 shadow-sm"
//                         onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/FFDDC1/FF8C00?text=P`; }} // Fallback image for product
//                       />
//                       <div>
//                         <p className="font-semibold text-gray-800">{product.name}</p>
//                         <p className="text-sm text-gray-500">{product.totalSold} terjual</p>
//                       </div>
//                     </div>
//                     <span className="text-gray-700 font-bold">Rp {Math.round(product.profits).toLocaleString('id-ID')}</span>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-gray-500 italic text-center py-4">Tidak ada data produk terlaris untuk periode ini.</p>
//               )}
//             </ul>
//           </div>

//           {/* Top 5 Pelanggan Teratas */}
//           <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
//             <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Top 5 Pelanggan Teratas ({selectedPeriod})</h3>
//             <ul className="space-y-4">
//               {topCustomers.length > 0 ? (
//                 topCustomers.map((customer) => (
//                   <li key={customer.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
//                     <div className="flex items-center">
//                       <img
//                         src={customer.imageUrl}
//                         alt={customer.name}
//                         className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200 shadow-sm"
//                         onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${customer.name}&radius=50&backgroundColor=008080,FB923C&size=40`; }} // Fallback image for customer with initials
//                       />
//                       <div>
//                         <p className="font-semibold text-gray-800">{customer.name}</p>
//                         <p className="text-sm text-gray-500">{customer.totalOrder} pesanan</p>
//                       </div>
//                     </div>
//                     <span className="text-gray-700 font-bold">Rp {customer.expenses.toLocaleString('id-ID')}</span>
//                   </li>
//                 ))
//               ) : (
//                 <p className="text-gray-500 italic text-center py-4">Tidak ada data pelanggan teratas untuk periode ini.</p>
//               )}
//             </ul>
//           </div>
//         </div>

//         {/* Bagian Distribusi Gender Pelanggan */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
//           <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1 transition duration-300 ease-in-out hover:shadow-lg">
//             <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Distribusi Gender Pelanggan</h3>
//             <div className="flex flex-col items-center">
//               <ResponsiveContainer width="100%" height={200}>
//                 <PieChart>
//                   <Pie
//                     data={genderPieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={80}
//                     fill="#8884d8"
//                     paddingAngle={5}
//                     dataKey="value"
//                   >
//                     {genderPieData.map((entry, index) => (
//                       <Cell key={`cell-gender-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip formatter={(value) => `${value}%`} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="text-center text-gray-600 mt-2">
//                 <p className="text-4xl font-bold text-gray-900">
//                   {/* Tampilkan total persentase gender yang teridentifikasi, atau 100 jika semua tidak teridentifikasi */}
//                   {genderDistribution.men + genderDistribution.women + genderDistribution.notIdentify === 0 ? 0 : genderDistribution.men + genderDistribution.women + genderDistribution.notIdentify}%
//                 </p>
//                 <p className="text-lg">Total Distribusi (semua pelanggan)</p>
//               </div>
//               <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 w-full mt-4 text-sm text-gray-600 font-medium">
//                 {genderDistribution.men > 0 && (
//                   <p className="flex items-center">
//                     <span className="w-3 h-3 inline-block rounded-full bg-blue-500 mr-2"></span>
//                     Pria: {genderDistribution.men}%
//                   </p>
//                 )}
//                 {genderDistribution.women > 0 && (
//                   <p className="flex items-center">
//                     <span className="w-3 h-3 inline-block rounded-full bg-pink-500 mr-2"></span>
//                     Wanita: {genderDistribution.women}%
//                   </p>
//                 )}
//                 {genderDistribution.notIdentify > 0 && (
//                   <p className="flex items-center">
//                     <span className="w-3 h-3 inline-block rounded-full bg-gray-400 mr-2"></span>
//                     Tidak Diketahui: {genderDistribution.notIdentify}%
//                   </p>
//                 )}
//                 {genderDistribution.men === 0 && genderDistribution.women === 0 && genderDistribution.notIdentify === 0 && (
//                   <p className="text-gray-500 italic">Tidak ada data gender tersedia.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../supabase'; // PASTIKAN PATH INI BENAR!
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  DollarSign, ShoppingBag, CheckCircle, Clock,
  Download, ChevronDown,
} from 'lucide-react'; // Import ikon dari lucide-react

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk data yang akan ditampilkan
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [completedOrdersCount, setCompletedOrdersCount] = useState(0);
  const [processingOrdersCount, setProcessingOrdersCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [canceledOrdersCount, setCanceledOrdersCount] = useState(0);

  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const [monthlySalesData, setMonthlySalesData] = useState([]);

  // Data untuk Status Pesanan
  const orderStatusData = useMemo(() => ([
    { name: 'Selesai', value: completedOrdersCount },
    { name: 'Diproses', value: processingOrdersCount },
    { name: 'Tertunda', value: pendingOrdersCount },
    { name: 'Dibatalkan', value: canceledOrdersCount },
  ].filter(item => item.value > 0)), [completedOrdersCount, processingOrdersCount, pendingOrdersCount, canceledOrdersCount]);

  const ORDER_STATUS_COLORS = ['#20c997', '#fb923c', '#4d9be6', '#dc3545']; // Hijau, Oranye, Biru, Merah

  // State dan data untuk Distribusi Gender Pelanggan
  const [genderDistribution, setGenderDistribution] = useState({
    men: 0,
    women: 0,
    notIdentify: 0,
  });

  const genderPieData = useMemo(() => ([
    { name: 'Pria', value: genderDistribution.men },
    { name: 'Wanita', value: genderDistribution.women },
    { name: 'Tidak Diketahui', value: genderDistribution.notIdentify },
  ].filter(item => item.value > 0)), [genderDistribution]);
  const GENDER_COLORS = ['#3B82F6', '#EC4899', '#9CA3AF']; // Biru, Pink, Abu-abu

  // State untuk pilihan periode
  const [selectedPeriod, setSelectedPeriod] = useState('Current Month');

  // Helper untuk mendapatkan nama bulan
  const getMonthName = (year, monthIndex) => {
    const date = new Date(year, monthIndex, 1);
    return date.toLocaleString('id-ID', { month: 'short', year: '2-digit' });
  };

  // Helper untuk mengisi data chart bulanan
  const generateMonthlySalesData = useCallback((orders, numberOfMonths, endDate) => {
    const dataMap = new Map();
    let currentMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    for (let i = 0; i < numberOfMonths; i++) {
      const monthKey = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}`;
      dataMap.set(monthKey, { name: getMonthName(currentMonth.getFullYear(), currentMonth.getMonth()), uv: 0 });
      currentMonth.setMonth(currentMonth.getMonth() - 1);
    }

    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      if (dataMap.has(monthKey) && order.status === 'Completed') {
        const currentData = dataMap.get(monthKey);
        currentData.uv += (order.total_amount || 0);
        dataMap.set(monthKey, currentData);
      }
    });

    return Array.from(dataMap.values()).sort((a, b) => {
      const parseMonthYear = (name) => {
        const parts = name.split(' ');
        let year, monthIndex;
        if (parts.length === 2) {
          year = 2000 + parseInt(parts[1]); // Asumsi tahun 2 digit berarti 20xx
          monthIndex = new Date(`${parts[0]} 1, 2000`).getMonth();
        } else {
          year = new Date().getFullYear(); // Jika tidak ada tahun, gunakan tahun sekarang
          monthIndex = new Date(`${parts[0]} 1, ${year}`).getMonth();
        }
        return new Date(year, monthIndex);
      };

      const dateA = parseMonthYear(a.name);
      const dateB = parseMonthYear(b.name);

      return dateA.getTime() - dateB.getTime();
    });
  }, []);

  // Fungsi utama untuk mengambil semua data dashboard
  const fetchDashboardData = useCallback(async (period) => {
    setLoading(true);
    setError(null);

    let startDate, endDate;
    const now = new Date();
    now.setHours(23, 59, 59, 999); // Set ke akhir hari ini

    switch (period) {
      case 'Current Month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
        break;
      case 'Last Month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Hari terakhir bulan lalu
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'Last 3 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        endDate = now;
        break;
      case 'Last 6 Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        endDate = now;
        break;
      case 'Last 12 Months':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        endDate = now;
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = now;
    }

    try {
      // 1. Ambil data produk untuk pemetaan gambar
      const { data: produkData, error: produkError } = await supabase
        .from('produk') // Menggunakan nama tabel 'produk'
        .select('id, nama, gambar'); // Mengambil kolom 'gambar'
      if (produkError) throw produkError;
      const productMap = new Map(produkData.map(p => [p.id, p]));

      // START: Pengambilan data users (auth.users) untuk gambar profil pelanggan
      // Menggunakan 'user_metadata' berdasarkan error terbaru
      const { data: usersData, error: usersError } = await supabase
        .from('users') // Mengakses tabel 'users' di skema 'auth'
        .select('id, email, user_metadata'); // <<< Perbaikan: Kembali gunakan 'user_metadata'

      if (usersError) {
        console.warn("Could not fetch user data from 'auth.users' table. Profile pictures might be missing:", usersError.message);
      }

      // Buat peta untuk mencari gambar profil berdasarkan ID, email, atau nama lengkap
      const userProfilePictureMap = new Map();
      if (usersData) {
        usersData.forEach(user => {
          const email = user.email;
          // Ambil full_name dari user_metadata
          const fullName = user.user_metadata?.full_name; // <<< Perbaikan: Kembali gunakan 'user_metadata'
          let profilePicture = null;

          // Prioritaskan avatar_url dari user_metadata
          if (user.user_metadata?.avatar_url) { // <<< Perbaikan: Kembali gunakan 'user_metadata'
            profilePicture = user.user_metadata.avatar_url;
          } else if (fullName) {
            // Gunakan DiceBear dengan fullName jika tidak ada avatar_url
            profilePicture = `https://api.dicebear.com/8.x/initials/svg?seed=${fullName}&radius=50&backgroundColor=008080,FB923C&size=40`;
          } else {
            // Fallback ke DiceBear dengan email jika tidak ada keduanya
            profilePicture = `https://api.dicebear.com/8.x/initials/svg?seed=${email || 'user'}&radius=50&backgroundColor=008080,FB923C&size=40`;
          }

          // Prioritaskan ID pengguna sebagai kunci utama untuk pencarian
          userProfilePictureMap.set(user.id, profilePicture);
          if (email) userProfilePictureMap.set(email, profilePicture);
          if (fullName) userProfilePictureMap.set(fullName, profilePicture);
        });
      }
      // END: Pengambilan data users

      // 2. Ambil data pesanan (termasuk user_id)
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(`
          id,
          status,
          total_amount,
          created_at,
          customer_name,
          user_id,
          order_items!inner(
            product_id,
            product_name,
            quantity,
            price_per_unit
          )
        `) // <<< Perbaikan: Hapus komentar dalam string select
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (ordersError) throw ordersError;

      let totalSales = 0;
      let totalOrders = ordersData.length;
      let completed = 0;
      let processing = 0;
      let pending = 0;
      let canceled = 0;

      const productSales = {}; // Untuk Top Products
      const customerSpending = {}; // Untuk Top Customers

      ordersData.forEach(order => {
        if (order.status === 'Completed') {
          totalSales += order.total_amount || 0;
          completed++;
        }

        switch (order.status) {
          case 'Processing': processing++; break;
          case 'Pending': pending++; break;
          case 'Canceled': canceled++; break;
          default: break;
        }

        // Hitung penjualan produk
        order.order_items.forEach(item => {
          const productId = item.product_id;
          const productInfo = productMap.get(productId);
          const productName = productInfo?.nama || item.product_name || 'Produk Tidak Dikenal';
          // Mengambil gambar dari productMap, dengan fallback ke placeholder
          const imageUrl = productInfo?.gambar || `https://placehold.co/40x40/FFDDC1/FF8C00?text=${productName.substring(0,1)}`;

          if (!productSales[productName]) {
            productSales[productName] = { totalSold: 0, totalProfit: 0, imageUrl: imageUrl };
          }
          productSales[productName].totalSold += item.quantity;
          productSales[productName].totalProfit += (item.quantity * item.price_per_unit) || 0;
          productSales[productName].imageUrl = imageUrl; // Pastikan imageUrl selalu yang terbaru
        });

        // Hitung pengeluaran pelanggan
        const customerName = order.customer_name || 'Pelanggan Tidak Dikenal'; // Fallback nama
        const customerUserId = order.user_id; // Ambil user_id dari order

        let customerImageUrl = `https://api.dicebear.com/8.x/initials/svg?seed=${customerName}&radius=50&backgroundColor=008080,FB923C&size=40`; // Default DiceBear

        // Prioritaskan pencarian gambar profil berdasarkan user_id
        if (customerUserId && userProfilePictureMap.has(customerUserId)) {
          customerImageUrl = userProfilePictureMap.get(customerUserId);
        }
        // Jika user_id tidak ada atau tidak ditemukan, coba cari berdasarkan customerName (email/full_name dari auth.users)
        else if (customerName && userProfilePictureMap.has(customerName)) {
          customerImageUrl = userProfilePictureMap.get(customerName);
        }

        if (!customerSpending[customerName]) {
          customerSpending[customerName] = { totalOrders: 0, totalExpenses: 0, imageUrl: customerImageUrl };
        }
        customerSpending[customerName].totalOrders++;
        customerSpending[customerName].totalExpenses += order.total_amount || 0;
        customerSpending[customerName].imageUrl = customerImageUrl; // Pastikan imageUrl selalu yang terbaru
      });

      // Sortir dan potong Top 5 Produk
      const sortedProducts = Object.entries(productSales)
        .map(([name, data], index) => ({
          id: index + 1, // ID sementara
          name: name,
          totalSold: data.totalSold,
          profits: data.totalProfit,
          imageUrl: data.imageUrl
        }))
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 5);

      // Sortir dan potong Top 5 Pelanggan
      const sortedCustomers = Object.entries(customerSpending)
        .map(([name, data], index) => ({
          id: index + 1, // ID sementara
          name: name,
          totalOrder: data.totalOrders,
          expenses: data.totalExpenses,
          imageUrl: data.imageUrl // Gambar profil yang sudah digabungkan
        }))
        .sort((a, b) => b.expenses - a.expenses)
        .slice(0, 5);

      let numberOfMonthsForChart = 1; // Default untuk Current Month
      if (period === 'Last Month') numberOfMonthsForChart = 2;
      if (period === 'Last 3 Months') numberOfMonthsForChart = 3;
      if (period === 'Last 6 Months') numberOfMonthsForChart = 6;
      if (period === 'Last 12 Months') numberOfMonthsForChart = 12;

      setMonthlySalesData(generateMonthlySalesData(ordersData, numberOfMonthsForChart, endDate));

      setTotalSalesAmount(totalSales);
      setTotalOrdersCount(totalOrders);
      setCompletedOrdersCount(completed);
      setProcessingOrdersCount(processing);
      setPendingOrdersCount(pending);
      setCanceledOrdersCount(canceled);
      setTopProducts(sortedProducts);
      setTopCustomers(sortedCustomers);

    } catch (err) {
      console.error("Fetch Dashboard Data Error:", err.message);
      setError("Gagal memuat data dashboard. Pastikan koneksi Supabase, tabel, dan RLS sudah benar.");
    } finally {
      setLoading(false);
    }
  }, [generateMonthlySalesData]);

  // Fungsi untuk mengambil data distribusi gender
  const fetchGenderData = useCallback(async () => {
    try {
      // Tidak mengambil 'id' dari tabel customers karena tidak diperlukan untuk distribusi gender
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('jenis_kelamin');

      if (customersError) throw customersError;

      const genderCounts = { 'Pria': 0, 'Wanita': 0, 'Tidak Diketahui': 0 };
      let totalCustomersWithGenderData = 0;

      customersData.forEach(customer => {
        if (customer.jenis_kelamin) {
          totalCustomersWithGenderData++;
          const gender = customer.jenis_kelamin;
          if (gender === 'Pria') {
            genderCounts['Pria']++;
          } else if (gender === 'Wanita') {
            genderCounts['Wanita']++;
          } else {
            genderCounts['Tidak Diketahui']++;
          }
        } else {
          genderCounts['Tidak Diketahui']++; // Perlakukan null/undefined gender sebagai "Tidak Diketahui"
          totalCustomersWithGenderData++;
        }
      });

      if (totalCustomersWithGenderData > 0) {
        setGenderDistribution({
          men: Math.round((genderCounts['Pria'] / totalCustomersWithGenderData) * 100),
          women: Math.round((genderCounts['Wanita'] / totalCustomersWithGenderData) * 100),
          notIdentify: Math.round((genderCounts['Tidak Diketahui'] / totalCustomersWithGenderData) * 100),
        });
      } else {
        setGenderDistribution({ men: 0, women: 0, notIdentify: 0 });
      }

    } catch (err) {
      console.error("Fetch Gender Data Error:", err.message);
    }
  }, []);

  // Efek samping untuk mengambil data saat komponen dimuat atau periode berubah
  useEffect(() => {
    fetchDashboardData(selectedPeriod);
    fetchGenderData();
  }, [fetchDashboardData, fetchGenderData, selectedPeriod]);

  // Handler untuk perubahan periode
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  // Handler untuk tombol Unduh Laporan
  const handleDownloadReport = () => {
    alert('Fungsi unduh laporan sedang dikembangkan...');
  };

  // Komponen Helper untuk Card Statistik
  const StatCard = ({ title, value, percentage, isPositive, description, icon: IconComponent }) => {
    const percentageColorClass = isPositive ? 'text-green-500' : 'text-red-500';
    const formattedValue = typeof value === 'number' ? (title.includes('Penjualan') ? `Rp ${value.toLocaleString('id-ID')}` : value.toLocaleString('id-ID')) : value;

    return (
      <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-start transition duration-300 ease-in-out hover:shadow-lg">
        <div className="flex items-center mb-3">
          {IconComponent && <IconComponent className="text-orange-500 mr-3" size={28} />}
          <h3 className="text-gray-600 text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-4xl font-bold text-gray-900 mb-2">{formattedValue}</p>
        {percentage !== undefined && percentage !== null && (
          <p className={`${percentageColorClass} text-sm flex items-center`}>
            {Math.abs(Math.round(percentage))}% <span className="text-gray-500 ml-1">{description}</span>
          </p>
        )}
      </div>
    );
  };

  // Tampilan loading dan error
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        <p className="ml-4 text-lg text-gray-600 mt-4">Memuat data dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative shadow-md">
          <strong className="font-bold">Oops! Error:</strong>
          <span className="block sm:inline ml-2"> {error}</span>
          <p className="mt-2 text-sm">Silakan periksa koneksi internet Anda atau konfigurasi Supabase.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="p-6 lg:p-8">
        {/* Bagian Selamat Datang */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang Kembali, Admin!</h2>
            <p className="text-gray-600">Inilah ringkasan toko Anda hari ini.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
            <button
              onClick={handleDownloadReport}
              className="bg-orange-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-orange-700 transition-colors duration-200 flex items-center"
            >
              <Download size={20} className="mr-2" /> Unduh Laporan
            </button>
            <div className="relative">
              <select
                className="appearance-none bg-gray-100 border border-gray-300 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                value={selectedPeriod}
                onChange={handlePeriodChange}
              >
                <option value="Current Month">Bulan Ini</option>
                <option value="Last Month">Bulan Lalu</option>
                <option value="Last 3 Months">3 Bulan Terakhir</option>
                <option value="Last 6 Months">6 Bulan Terakhir</option>
                <option value="Last 12 Months">12 Bulan Terakhir</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {/* Tab Ringkasan */}
        <div className="flex space-x-2 mb-6">
          <button className="px-5 py-2 bg-orange-600 text-white rounded-lg font-medium shadow-md transition-all duration-200 hover:bg-orange-700">Ringkasan</button>
        </div>

        {/* Grid Kartu Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Penjualan"
            value={totalSalesAmount}
            icon={DollarSign}
            description={`dari pesanan selesai (${selectedPeriod})`}
          />

          <StatCard
            title="Total Pesanan"
            value={totalOrdersCount}
            icon={ShoppingBag}
            description={`semua status (${selectedPeriod})`}
          />

          <StatCard
            title="Pesanan Selesai"
            value={completedOrdersCount}
            percentage={totalOrdersCount > 0 ? (completedOrdersCount / totalOrdersCount) * 100 : 0}
            isPositive={true}
            icon={CheckCircle}
            description="dari total pesanan"
          />

          <StatCard
            title="Pesanan Diproses"
            value={processingOrdersCount}
            percentage={totalOrdersCount > 0 ? (processingOrdersCount / totalOrdersCount) * 100 : 0}
            isPositive={false}
            icon={Clock}
            description="sedang dalam proses"
          />
        </div>

        {/* Bagian Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grafik Status Pesanan */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Status Pesanan ({selectedPeriod})</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center text-gray-600 mt-2">
                <p className="text-4xl font-bold text-gray-900">
                  {totalOrdersCount}
                </p>
                <p className="text-lg">Total Pesanan</p>
              </div>
              <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 w-full mt-4 text-sm text-gray-600 font-medium">
                {orderStatusData.map((data, index) => (
                  <p key={data.name} className="flex items-center">
                    <span className="w-3 h-3 inline-block rounded-full mr-2" style={{ backgroundColor: ORDER_STATUS_COLORS[index % ORDER_STATUS_COLORS.length] }}></span>
                    {data.name}: {data.value}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Grafik Batang Penjualan */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Performa Penjualan ({selectedPeriod})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlySalesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#cccccc' }} />
                <YAxis
                  tickFormatter={(value) => `Rp ${value.toLocaleString('id-ID')}`}
                  tickLine={false}
                  axisLine={{ stroke: '#cccccc' }}
                />
                <Tooltip
                  formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Jumlah Penjualan']}
                  labelFormatter={(label) => `Bulan: ${label}`}
                  contentStyle={{
                    borderRadius: '8px',
                    borderColor: '#e0e0e0',
                    boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: '#333' }}
                  labelStyle={{ color: '#555', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="uv" name="Jumlah Penjualan" fill="#fb923c" barSize={30} radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bagian Produk Terlaris dan Pelanggan Teratas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Top 5 Produk Terlaris */}
          <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Top 5 Produk Terlaris ({selectedPeriod})</h3>
            <ul className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product) => (
                  <li key={product.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200 shadow-sm"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/40x40/FFDDC1/FF8C00?text=P`; }} // Fallback image for product
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.totalSold} terjual</p>
                      </div>
                    </div>
                    <span className="text-gray-700 font-bold">Rp {Math.round(product.profits).toLocaleString('id-ID')}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">Tidak ada data produk terlaris untuk periode ini.</p>
              )}
            </ul>
          </div>

          {/* Top 5 Pelanggan Teratas */}
          <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Top 5 Pelanggan Teratas ({selectedPeriod})</h3>
            <ul className="space-y-4">
              {topCustomers.length > 0 ? (
                topCustomers.map((customer) => (
                  <li key={customer.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                    <div className="flex items-center">
                      <img
                        src={customer.imageUrl}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200 shadow-sm"
                        onError={(e) => { e.target.onerror = null; e.target.src = `https://api.dicebear.com/8.x/initials/svg?seed=${customer.name}&radius=50&backgroundColor=008080,FB923C&size=40`; }} // Fallback image for customer with initials
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.totalOrder} pesanan</p>
                      </div>
                    </div>
                    <span className="text-gray-700 font-bold">Rp {customer.expenses.toLocaleString('id-ID')}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">Tidak ada data pelanggan teratas untuk periode ini.</p>
              )}
            </ul>
          </div>
        </div>

        {/* Bagian Distribusi Gender Pelanggan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1 transition duration-300 ease-in-out hover:shadow-lg">
            <h3 className="text-gray-800 text-xl font-semibold mb-4 border-b pb-2 border-gray-100">Distribusi Gender Pelanggan</h3>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={genderPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderPieData.map((entry, index) => (
                      <Cell key={`cell-gender-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center text-gray-600 mt-2">
                <p className="text-4xl font-bold text-gray-900">
                  {/* Tampilkan total persentase gender yang teridentifikasi, atau 100 jika semua tidak teridentifikasi */}
                  {genderDistribution.men + genderDistribution.women + genderDistribution.notIdentify === 0 ? 0 : genderDistribution.men + genderDistribution.women + genderDistribution.notIdentify}%
                </p>
                <p className="text-lg">Total Distribusi (semua pelanggan)</p>
              </div>
              <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 w-full mt-4 text-sm text-gray-600 font-medium">
                {genderDistribution.men > 0 && (
                  <p className="flex items-center">
                    <span className="w-3 h-3 inline-block rounded-full bg-blue-500 mr-2"></span>
                    Pria: {genderDistribution.men}%
                  </p>
                )}
                {genderDistribution.women > 0 && (
                  <p className="flex items-center">
                    <span className="w-3 h-3 inline-block rounded-full bg-pink-500 mr-2"></span>
                    Wanita: {genderDistribution.women}%
                  </p>
                )}
                {genderDistribution.notIdentify > 0 && (
                  <p className="flex items-center">
                    <span className="w-3 h-3 inline-block rounded-full bg-gray-400 mr-2"></span>
                    Tidak Diketahui: {genderDistribution.notIdentify}%
                  </p>
                )}
                {genderDistribution.men === 0 && genderDistribution.women === 0 && genderDistribution.notIdentify === 0 && (
                  <p className="text-gray-500 italic">Tidak ada data gender tersedia.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;