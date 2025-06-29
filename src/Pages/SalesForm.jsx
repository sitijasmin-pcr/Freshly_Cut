// import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar
// import Swal from 'sweetalert2'; // Swal sudah tersedia secara global jika CDN di public/index.html

// const SalesForm = ({ onClose, onSuccess, initialOrderData }) => {
//   const [products, setProducts] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('Coffee');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [orderList, setOrderList] = useState([]);
//   const [orderType, setOrderType] = useState('Dine In');
//   const [customerName, setCustomerName] = useState('');
//   const [tableNumber, setTableNumber] = useState('');
//   const [customerType, setCustomerType] = useState('Indoor');
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [productFetchError, setProductFetchError] = useState(null);

//   const productCategories = [
//     "Food and Bakery", "Classic Coffee", "Non Coffee", "Fruity Series",
//     "Cheese Latte Series", "Cloud Series", "Jujutsu Kaisen Series",
//     "UPSETDUCK X PISTACHIO SERIES", "Pesta Kuliner Banting Harga",
//     "SPECIAL OFFER", "Flash Sale Makan Harian",
//   ];

//   useEffect(() => {
//     const fetchProductsFromSupabase = async () => {
//       setLoadingProducts(true);
//       setProductFetchError(null);
//       try {
//         const { data, error } = await supabase.from('produk').select('*');
//         if (error) throw error;
//         setProducts(data);
//         if (data.length > 0 && !data.some(p => p.kategori === activeCategory)) {
//             setActiveCategory(data[0].kategori);
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err.message);
//         setProductFetchError("Gagal memuat daftar produk. Pastikan tabel 'produk' ada dan Supabase terhubung dengan benar.");
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProductsFromSupabase();
//   }, []);

//   useEffect(() => {
//     if (initialOrderData) {
//       setCustomerName(initialOrderData.name || '');
//       setOrderType(initialOrderData.order_type || 'Dine In');
//       setTableNumber(initialOrderData.table_number || '');
//       setCustomerType(initialOrderData.customer_type || 'Indoor');
//       setOrderList([]);
//     } else {
//       setCustomerName('');
//       setOrderType('Dine In');
//       setTableNumber('');
//       setCustomerType('Indoor');
//       setOrderList([]);
//     }
//   }, [initialOrderData]);

//   const subtotal = orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const taxRate = 0.10;
//   const tax = subtotal * taxRate;
//   const total = subtotal + tax;

//   const filteredProducts = products.filter(product =>
//     product.kategori === activeCategory &&
//     product.nama.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const addToOrder = (productToAdd) => {
//     setOrderList(prevList => {
//       const existingItem = prevList.find(item => item.id === productToAdd.id);
//       if (existingItem) {
//         return prevList.map(item =>
//           item.id === productToAdd.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [...prevList, {
//           id: productToAdd.id,
//           name: productToAdd.nama,
//           price: productToAdd.harga,
//           imageUrl: productToAdd.gambar,
//           quantity: 1,
//           modifiers: []
//         }];
//       }
//     });
//   };

//   const updateOrderQuantity = (id, delta) => {
//     setOrderList(prevList => {
//       const updatedList = prevList.map(item =>
//         item.id === id
//           ? { ...item, quantity: item.quantity + delta }
//           : item
//       ).filter(item => item.quantity > 0);
//       return updatedList;
//     });
//   };

//   const removeItem = (id) => {
//     setOrderList(prevList => prevList.filter(item => item.id !== id));
//   };

//   const handlePlaceOrder = async () => {
//     if (orderList.length === 0) {
//       Swal.fire('Pesanan Kosong', 'Harap tambahkan item ke pesanan terlebih dahulu.', 'warning');
//       return;
//     }

//     if (!customerName) {
//       Swal.fire('Nama Pelanggan Kosong', 'Harap masukkan nama pelanggan.', 'warning');
//       return;
//     }

//     try {
//       const { data: orderData, error: orderError } = await supabase
//         .from('orders')
//         .insert({
//           customer_name: customerName,
//           order_type: orderType,
//           table_number: tableNumber,
//           customer_type: customerType,
//           status: 'Processing',
//           total_amount: total,
//         })
//         .select();

//       if (orderError) throw orderError;

//       const newOrderId = orderData[0].id;

//       const orderItemsToInsert = orderList.map(item => ({
//         order_id: newOrderId,
//         product_id: item.id,
//         product_name: item.name,
//         quantity: item.quantity,
//         price_per_unit: item.price
//       }));

//       const { error: orderItemsError } = await supabase
//         .from('order_items')
//         .insert(orderItemsToInsert);

//       if (orderItemsError) throw orderItemsError;

//       Swal.fire('Berhasil!', `Pesanan untuk ${customerName} berhasil ditempatkan. Total: Rp ${total.toLocaleString('id-ID')}`, 'success');

//       setOrderList([]);
//       setCustomerName('');
//       setTableNumber('');
//       setCustomerType('Indoor');
//       onSuccess();
//       onClose();
//     } catch (err) {
//       console.error("Error placing order:", err.message);
//       Swal.fire('Gagal!', `Terjadi kesalahan saat menempatkan pesanan: ${err.message}. Mohon cek koneksi Supabase Anda.`, 'error');
//     }
//   };

//   const today = new Date();
//   const options = { weekday: 'long', day: 'numeric', month: 'long' };
//   const formattedDate = today.toLocaleDateString('en-US', options);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 font-inter">
//       <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col relative animate-fade-in-up">
//         <button
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl font-light z-20"
//           onClick={onClose}
//           title="Tutup"
//         >
//           &times;
//         </button>

//         <div className="flex flex-1 p-4 bg-gray-100 overflow-hidden">
//           <div className="w-2/3 bg-white rounded-lg shadow-md p-6 mr-4 flex flex-col">
//             <div className="flex items-center justify-between mb-6">
//               <div className="relative w-1/2 mr-4">
//                 <input
//                   type="text"
//                   placeholder="Cari produk..."
//                   className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//               </div>
//               <button className="bg-green-100 text-green-700 p-3 rounded-lg hover:bg-green-200 transition-colors duration-200">
//                 <i className="fas fa-sliders-h"></i>
//               </button>
//             </div>

//             <div className="flex space-x-3 overflow-x-auto pb-2 mb-6 custom-scrollbar-horizontal">
//               {productCategories.map(category => {
//                 const itemCount = products.filter(p => p.kategori === category).length;
//                 return (
//                   <button
//                     key={category}
//                     className={`flex-shrink-0 py-2 px-5 rounded-full font-semibold text-sm transition-colors duration-200 whitespace-nowrap
//                       ${activeCategory === category
//                         ? 'bg-green-600 text-white shadow-md'
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                       }`}
//                     onClick={() => setActiveCategory(category)}
//                   >
//                     {category} <span className="ml-1 text-xs">({itemCount} item)</span>
//                   </button>
//                 );
//               })}
//               <div className="flex-shrink-0 flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm ml-auto">
//                 <i className="fas fa-exclamation-circle mr-2"></i> Perlu restock <span className="font-bold ml-1">2</span>
//               </div>
//             </div>

//             {loadingProducts ? (
//               <div className="flex-1 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//                 <p className="ml-3 text-lg text-gray-600">Memuat produk...</p>
//               </div>
//             ) : productFetchError ? (
//               <div className="flex-1 flex items-center justify-center text-red-500 text-center">
//                 <i className="fas fa-exclamation-triangle mr-2"></i> {productFetchError}
//               </div>
//             ) : filteredProducts.length === 0 ? (
//               <div className="col-span-3 text-center text-gray-500 py-10">
//                 Tidak ada produk ditemukan di kategori ini atau dengan pencarian Anda.
//               </div>
//             ) : (
//               <div className="grid grid-cols-3 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
//                 {filteredProducts.map(product => (
//                   <div
//                     key={product.id}
//                     className="bg-gray-50 rounded-lg shadow-sm p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-md transition-shadow duration-200"
//                     onClick={() => addToOrder(product)}
//                   >
//                     <img
//                       src={product.gambar || 'https://placehold.co/100x100/A0522D/FFFFFF?text=No+Image'}
//                       alt={product.nama}
//                       className="w-24 h-24 object-cover rounded-md mb-2"
//                       onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/A0522D/FFFFFF?text=No+Image'; }}
//                     />
//                     <p className="font-semibold text-lg">{product.nama}</p>
//                     <p className="text-green-600 font-bold">Rp {product.harga?.toLocaleString('id-ID')}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col">
//             <h2 className="text-xl font-bold mb-4">Struk Pembelian</h2>

//             <div className="flex justify-around bg-gray-100 p-1 rounded-lg mb-4">
//               {['Dine In', 'Take Away', 'Order Online'].map(type => (
//                 <button
//                   key={type}
//                   className={`flex-1 py-2 rounded-md font-semibold text-sm transition-colors duration-200
//                     ${orderType === type ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
//                   onClick={() => setOrderType(type)}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>

//             <div className="space-y-3 mb-6">
//               <div>
//                 <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan</label>
//                 <input
//                   type="text"
//                   id="customerName"
//                   value={customerName}
//                   onChange={(e) => setCustomerName(e.target.value)}
//                   className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
//                   placeholder="Masukkan nama pelanggan"
//                 />
//               </div>
//               <div className="flex space-x-2">
//                 <div className="flex-1">
//                   <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">Meja</label>
//                   <input
//                     type="text"
//                     id="tableNumber"
//                     value={tableNumber}
//                     onChange={(e) => setTableNumber(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
//                     placeholder="Nomor meja"
//                   />
//                 </div>
//                 <div className="flex-1 relative">
//                   <label htmlFor="customerType" className="block text-sm font-medium text-gray-700 mb-1">BIZ</label>
//                   <select
//                     id="customerType"
//                     value={customerType}
//                     onChange={(e) => setCustomerType(e.target.value)}
//                     className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-green-500 pr-8"
//                   >
//                     <option value="Indoor">Indoor</option>
//                     <option value="Outdoor">Outdoor</option>
//                   </select>
//                   <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none mt-3"></i>
//                 </div>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-b border-gray-200 pb-4 mb-4">
//               {orderList.length === 0 ? (
//                 <div className="text-center text-gray-500 py-10">Belum ada item di pesanan.</div>
//               ) : (
//                 orderList.map(item => (
//                   <div key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2">
//                     <div>
//                       <p className="font-semibold">{item.name}</p>
//                       <p className="text-sm text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <button
//                         className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-300"
//                         onClick={() => updateOrderQuantity(item.id, -1)}
//                       >
//                         <i className="fas fa-minus"></i>
//                       </button>
//                       <span className="font-bold">{item.quantity}</span>
//                       <button
//                         className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-300"
//                         onClick={() => updateOrderQuantity(item.id, 1)}
//                       >
//                         <i className="fas fa-plus"></i>
//                       </button>
//                     </div>
//                     <p className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
//                     <button
//                         className="text-red-500 hover:text-red-700 ml-2"
//                         onClick={() => removeItem(item.id)}
//                     >
//                         <i className="fas fa-times-circle"></i>
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="space-y-2 mb-6">
//               <div className="flex justify-between text-gray-700">
//                 <span>Subtotal</span>
//                 <span>Rp {subtotal.toLocaleString('id-ID')}</span>
//               </div>
//               <div className="flex justify-between text-gray-700">
//                 <span>Pajak ({taxRate * 100}%)</span>
//                 <span>Rp {tax.toLocaleString('id-ID')}</span>
//               </div>
//               <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2">
//                 <span>Total</span>
//                 <span>Rp {total.toLocaleString('id-ID')}</span>
//               </div>
//             </div>

//             <button
//               className="bg-green-600 text-white py- rounded-lg text-lg font-bold flex items-center justify-center shadow-lg hover:bg-green-700 transition-colors duration-200"
//               onClick={handlePlaceOrder}
//               disabled={orderList.length === 0}
//             >
//               <i className="fas fa-arrow-right mr-3"></i> Tempatkan Pesanan Rp {total.toLocaleString('id-ID')}
//             </button>
//           </div>
//         </div>
//       </div>
//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
//         .custom-scrollbar-horizontal::-webkit-scrollbar {
//           height: 8px;
//         }
//         .custom-scrollbar-horizontal::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 10px;
//         }
//         .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SalesForm;


// import React, { useState, useEffect } from 'react';
// import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar
// import Swal from 'sweetalert2'; // Swal sudah tersedia secara global jika CDN di public/index.html
// import {
//   Search,
//   SlidersHorizontal,
//   CircleAlert,
//   XCircle,
//   Plus,
//   Minus,
//   ChevronDown,
//   ArrowRight, // Tambahkan ikon ini untuk tombol "Tempatkan Pesanan"
//   Info, // Untuk pesan tidak ada produk
// } from 'lucide-react'; // Impor ikon dari lucide-react

// const SalesForm = ({ onClose, onSuccess, initialOrderData }) => {
//   const [products, setProducts] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('Coffee');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [orderList, setOrderList] = useState([]);
//   const [orderType, setOrderType] = useState('Dine In');
//   const [customerName, setCustomerName] = useState('');
//   const [tableNumber, setTableNumber] = useState('');
//   const [customerType, setCustomerType] = useState('Indoor');
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [productFetchError, setProductFetchError] = useState(null);

//   // Perbarui kategori produk jika ada kategori "Coffee" atau atur ke yang pertama ditemukan
//   const productCategories = [
//     "Food and Bakery", "Classic Coffee", "Non Coffee", "Fruity Series",
//     "Cheese Latte Series", "Cloud Series", "Jujutsu Kaisen Series",
//     "UPSETDUCK X PISTACHIO SERIES", "Pesta Kuliner Banting Harga",
//     "SPECIAL OFFER", "Flash Sale Makan Harian",
//   ];

//   useEffect(() => {
//     const fetchProductsFromSupabase = async () => {
//       setLoadingProducts(true);
//       setProductFetchError(null);
//       try {
//         const { data, error } = await supabase.from('produk').select('*');
//         if (error) throw error;
//         setProducts(data);
//         // Set activeCategory ke 'Classic Coffee' jika ada, jika tidak, ke kategori pertama dari produk yang ditemukan
//         if (data.length > 0) {
//           const defaultCategory = productCategories.includes('Classic Coffee') ? 'Classic Coffee' : data[0].kategori;
//           setActiveCategory(defaultCategory);
//         }
//       } catch (err) {
//         console.error("Error fetching products:", err.message);
//         setProductFetchError("Gagal memuat daftar produk. Pastikan tabel 'produk' ada dan Supabase terhubung dengan benar.");
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProductsFromSupabase();
//   }, []);

//   useEffect(() => {
//     if (initialOrderData) {
//       setCustomerName(initialOrderData.name || '');
//       setOrderType(initialOrderData.order_type || 'Dine In');
//       setTableNumber(initialOrderData.table_number || '');
//       setCustomerType(initialOrderData.customer_type || 'Indoor');
//       setOrderList([]); // Reset order list for new initial data
//     } else {
//       setCustomerName('');
//       setOrderType('Dine In');
//       setTableNumber('');
//       setCustomerType('Indoor');
//       setOrderList([]); // Reset for new/empty form
//     }
//   }, [initialOrderData]);

//   const subtotal = orderList.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const taxRate = 0.10;
//   const tax = subtotal * taxRate;
//   const total = subtotal + tax;

//   const filteredProducts = products.filter(product =>
//     product.kategori === activeCategory &&
//     product.nama.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const addToOrder = (productToAdd) => {
//     setOrderList(prevList => {
//       const existingItem = prevList.find(item => item.id === productToAdd.id);
//       if (existingItem) {
//         return prevList.map(item =>
//           item.id === productToAdd.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         return [...prevList, {
//           id: productToAdd.id,
//           name: productToAdd.nama,
//           price: productToAdd.harga,
//           imageUrl: productToAdd.gambar, // Assuming 'gambar' is the image URL field
//           quantity: 1,
//           modifiers: [] // For future use
//         }];
//       }
//     });
//   };

//   const updateOrderQuantity = (id, delta) => {
//     setOrderList(prevList => {
//       const updatedList = prevList.map(item =>
//         item.id === id
//           ? { ...item, quantity: item.quantity + delta }
//           : item
//       ).filter(item => item.quantity > 0); // Remove if quantity drops to 0 or less
//       return updatedList;
//     });
//   };

//   const removeItem = (id) => {
//     setOrderList(prevList => prevList.filter(item => item.id !== id));
//   };

//   const handlePlaceOrder = async () => {
//     if (orderList.length === 0) {
//       Swal.fire('Pesanan Kosong', 'Harap tambahkan item ke pesanan terlebih dahulu.', 'warning');
//       return;
//     }

//     if (!customerName.trim()) { // Use .trim() to check for empty strings or just spaces
//       Swal.fire('Nama Pelanggan Kosong', 'Harap masukkan nama pelanggan.', 'warning');
//       return;
//     }

//     try {
//       const { data: orderData, error: orderError } = await supabase
//         .from('orders')
//         .insert({
//           customer_name: customerName,
//           order_type: orderType,
//           table_number: tableNumber,
//           customer_type: customerType,
//           status: 'Processing', // Initial status
//           total_amount: total,
//           // created_at will be automatically set by Supabase timestamp
//         })
//         .select(); // Use .select() to return the inserted data

//       if (orderError) throw orderError;

//       const newOrderId = orderData[0].id;

//       const orderItemsToInsert = orderList.map(item => ({
//         order_id: newOrderId,
//         product_id: item.id,
//         product_name: item.name,
//         quantity: item.quantity,
//         price_per_unit: item.price
//       }));

//       const { error: orderItemsError } = await supabase
//         .from('order_items')
//         .insert(orderItemsToInsert);

//       if (orderItemsError) throw orderItemsError;

//       Swal.fire('Berhasil!', `Pesanan untuk ${customerName} berhasil ditempatkan. Total: Rp ${total.toLocaleString('id-ID')}`, 'success');

//       // Reset form
//       setOrderList([]);
//       setCustomerName('');
//       setTableNumber('');
//       setCustomerType('Indoor');
//       // Trigger refresh in parent component
//       onSuccess();
//       onClose(); // Close the modal
//     } catch (err) {
//       console.error("Error placing order:", err.message);
//       Swal.fire('Gagal!', `Terjadi kesalahan saat menempatkan pesanan: ${err.message}. Mohon cek koneksi Supabase Anda.`, 'error');
//     }
//   };

//   const today = new Date();
//   const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }; // Added year for clarity
//   const formattedDate = today.toLocaleDateString('id-ID', options); // Using id-ID for Indonesian format

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[1000] p-4 font-sans antialiased">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col relative animate-fade-in-up transform transition-all duration-300 scale-100 opacity-100">
//         <button
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-4xl font-light z-20 transition-transform duration-200 hover:rotate-90"
//           onClick={onClose}
//           title="Tutup Form"
//         >
//           &times;
//         </button>

//         <div className="flex-none bg-emerald-700 text-white p-6 rounded-t-xl flex justify-between items-center">
//             <h2 className="text-3xl font-extrabold flex items-center">
//                 <span className="mr-3">☕</span> Pesanan Baru
//             </h2>
//             <div className="text-lg font-medium opacity-90">
//                 {formattedDate}
//             </div>
//         </div>

//         <div className="flex flex-1 p-6 bg-gray-50 overflow-hidden">
//           {/* Left Panel: Product Selection */}
//           <div className="w-2/3 bg-white rounded-lg shadow-lg p-6 mr-6 flex flex-col border border-gray-200">
//             <div className="flex items-center justify-between mb-6 gap-4">
//               <div className="relative flex-1">
//                 <input
//                   type="text"
//                   placeholder="Cari produk..."
//                   className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200 text-base"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//               </div>
//               <button
//                 className="bg-emerald-50 text-emerald-700 p-3 rounded-lg hover:bg-emerald-100 transition-colors duration-200 flex items-center justify-center shadow-sm"
//                 title="Filter Produk"
//               >
//                 <SlidersHorizontal className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="flex space-x-3 overflow-x-auto pb-3 mb-6 custom-scrollbar-horizontal border-b border-gray-200">
//               {productCategories.map(category => {
//                 const itemCount = products.filter(p => p.kategori === category).length;
//                 return (
//                   <button
//                     key={category}
//                     className={`flex-shrink-0 py-2 px-5 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap group
//                       ${activeCategory === category
//                         ? 'bg-emerald-600 text-white shadow-md'
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                       }`}
//                     onClick={() => setActiveCategory(category)}
//                   >
//                     {category} <span className="ml-1 text-xs opacity-75 group-hover:opacity-100 transition-opacity duration-200">({itemCount} item)</span>
//                   </button>
//                 );
//               })}
//               {/* Optional: Restock alert, customize as needed */}
//               {/* <div className="flex-shrink-0 flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm ml-auto shadow-sm">
//                 <CircleExclamation className="w-4 h-4 mr-2" /> Perlu restock <span className="font-bold ml-1">2</span>
//               </div> */}
//             </div>

//             {loadingProducts ? (
//               <div className="flex-1 flex items-center justify-center flex-col py-10">
//                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
//                 <p className="text-xl text-gray-600 font-medium">Memuat produk...</p>
//               </div>
//             ) : productFetchError ? (
//               <div className="flex-1 flex flex-col items-center justify-center text-red-600 text-center bg-red-50 rounded-lg p-6 border border-red-200">
//                 <CircleAlert className="w-10 h-10 mb-4 text-red-500" />
//                 <p className="text-lg font-semibold mb-2">Terjadi Kesalahan!</p>
//                 <p className="text-gray-700">{productFetchError}</p>
//               </div>
//             ) : filteredProducts.length === 0 ? (
//               <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center bg-gray-100 rounded-lg p-6">
//                 <Info className="w-10 h-10 mb-4" />
//                 <p className="text-lg font-semibold mb-2">Tidak Ditemukan</p>
//                 <p>Tidak ada produk yang cocok di kategori ini atau dengan pencarian Anda.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
//                 {filteredProducts.map(product => (
//                   <div
//                     key={product.id}
//                     className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
//                     onClick={() => addToOrder(product)}
//                   >
//                     <img
//                       src={product.gambar || 'https://via.placeholder.com/150/A0522D/FFFFFF?text=No+Image'}
//                       alt={product.nama}
//                       className="w-full h-28 object-cover rounded-lg mb-3 shadow-sm"
//                       onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150/A0522D/FFFFFF?text=No+Image'; }}
//                     />
//                     <p className="font-bold text-gray-900 text-lg mb-1 leading-tight">{product.nama}</p>
//                     <p className="text-emerald-600 font-extrabold text-xl">Rp {product.harga?.toLocaleString('id-ID')}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Right Panel: Order Summary */}
//           <div className="w-1/3 bg-white rounded-lg shadow-lg p-6 flex flex-col border border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-800 mb-5">Detail Pesanan</h2>

//             <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg mb-5 text-base font-semibold">
//               {['Dine In', 'Take Away', 'Order Online'].map(type => (
//                 <button
//                   key={type}
//                   className={`py-2 rounded-lg transition-colors duration-200 flex items-center justify-center
//                     ${orderType === type ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
//                   onClick={() => setOrderType(type)}
//                 >
//                   {type}
//                 </button>
//               ))}
//             </div>

//             <div className="space-y-4 mb-6">
//               <div>
//                 <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 mb-1">Nama Pelanggan</label>
//                 <input
//                   type="text"
//                   id="customerName"
//                   value={customerName}
//                   onChange={(e) => setCustomerName(e.target.value)}
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-base"
//                   placeholder="Contoh: Budi Santoso"
//                 />
//               </div>
//               <div className="flex space-x-3">
//                 <div className="flex-1">
//                   <label htmlFor="tableNumber" className="block text-sm font-semibold text-gray-700 mb-1">Meja / No. Antrian</label>
//                   <input
//                     type="text"
//                     id="tableNumber"
//                     value={tableNumber}
//                     onChange={(e) => setTableNumber(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-base"
//                     placeholder="Contoh: M-05 atau #123"
//                   />
//                 </div>
//                 <div className="flex-1 relative">
//                   <label htmlFor="customerType" className="block text-sm font-semibold text-gray-700 mb-1">Jenis Pelanggan</label>
//                   <select
//                     id="customerType"
//                     value={customerType}
//                     onChange={(e) => setCustomerType(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-10 text-base cursor-pointer"
//                   >
//                     <option value="Indoor">Indoor</option>
//                     <option value="Outdoor">Outdoor</option>
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
//                 </div>
//               </div>
//             </div>

//             <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar border-b border-gray-200 pb-5 mb-5">
//               {orderList.length === 0 ? (
//                 <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
//                   <Info className="w-8 h-8 mx-auto mb-3 text-gray-400" />
//                   <p className="font-medium">Tambahkan item ke pesanan</p>
//                 </div>
//               ) : (
//                 orderList.map(item => (
//                   <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-3 shadow-sm hover:shadow-md transition-shadow duration-200">
//                     <div className="flex-shrink-0 mr-3">
//                       <img
//                         src={item.imageUrl || 'https://via.placeholder.com/50x50/A0522D/FFFFFF?text=No+Img'}
//                         alt={item.name}
//                         className="w-16 h-16 object-cover rounded-md"
//                         onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50x50/A0522D/FFFFFF?text=No+Img'; }}
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-gray-800 text-lg leading-tight truncate">{item.name}</p>
//                       <p className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')}</p>
//                     </div>
//                     <div className="flex items-center space-x-2 ml-4">
//                       <button
//                         className="bg-gray-200 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-300 transition-colors duration-200"
//                         onClick={() => updateOrderQuantity(item.id, -1)}
//                         title="Kurangi Kuantitas"
//                       >
//                         <Minus className="w-4 h-4" />
//                       </button>
//                       <span className="font-bold text-lg text-gray-800 w-6 text-center">{item.quantity}</span>
//                       <button
//                         className="bg-gray-200 text-gray-700 rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-gray-300 transition-colors duration-200"
//                         onClick={() => updateOrderQuantity(item.id, 1)}
//                         title="Tambah Kuantitas"
//                       >
//                         <Plus className="w-4 h-4" />
//                       </button>
//                     </div>
//                     <p className="font-extrabold text-gray-900 ml-4 whitespace-nowrap">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
//                     <button
//                       className="text-red-500 hover:text-red-700 ml-4 transition-colors duration-200"
//                       onClick={() => removeItem(item.id)}
//                       title="Hapus Item"
//                     >
//                       <XCircle className="w-6 h-6" />
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <div className="space-y-3 mb-6 font-semibold text-gray-800">
//               <div className="flex justify-between items-center text-lg">
//                 <span>Subtotal</span>
//                 <span>Rp {subtotal.toLocaleString('id-ID')}</span>
//               </div>
//               <div className="flex justify-between items-center text-lg">
//                 <span>Pajak ({taxRate * 100}%)</span>
//                 <span>Rp {tax.toLocaleString('id-ID')}</span>
//               </div>
//               <div className="flex justify-between items-center text-3xl font-extrabold text-emerald-700 border-t-2 border-gray-200 pt-4 mt-4">
//                 <span>TOTAL</span>
//                 <span>Rp {total.toLocaleString('id-ID')}</span>
//               </div>
//             </div>

//             <button
//               className={`bg-emerald-600 text-white py-4 rounded-lg text-xl font-extrabold flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105
//                 ${orderList.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
//               onClick={handlePlaceOrder}
//               disabled={orderList.length === 0}
//             >
//               <ArrowRight className="w-6 h-6 mr-3" />
//               Tempatkan Pesanan
//               <span className="ml-3">Rp {total.toLocaleString('id-ID')}</span>
//             </button>
//           </div>
//         </div>
//       </div>
//       <style>{`
//         /* Custom Scrollbar Styles */
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
//         .custom-scrollbar-horizontal::-webkit-scrollbar {
//           height: 8px;
//         }
//         .custom-scrollbar-horizontal::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
//         .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 10px;
//         }
//         .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }

//         /* Basic Fade-in Animation */
//         @keyframes fade-in-up {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in-up {
//           animation: fade-in-up 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SalesForm;

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar
import Swal from 'sweetalert2';
import {
  Search,
  SlidersHorizontal,
  CircleAlert,
  X, // Mengganti XCircle dengan X untuk tombol tutup
  Plus,
  Minus,
  ChevronDown,
  ArrowRight,
  Info,
  Utensils, // Icon for Dine In
  ShoppingBag, // Icon for Take Away
  Laptop, // Icon for Order Online
  User, // Icon for customer name
  Warehouse, // Icon for table number
  Building, // Icon for customer type (Indoor/Outdoor)
} from 'lucide-react';

const SalesForm = ({ onClose, onSuccess, initialOrderData }) => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Classic Coffee'); // Default ke Classic Coffee
  const [searchTerm, setSearchTerm] = useState('');
  const [orderList, setOrderList] = useState([]);
  const [orderType, setOrderType] = useState('Dine In');
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [customerType, setCustomerType] = useState('Indoor');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productFetchError, setProductFetchError] = useState(null);

  const productCategories = [
    "Food and Bakery", "Classic Coffee", "Non Coffee", "Fruity Series",
    "Cheese Latte Series", "Cloud Series", "Jujutsu Kaisen Series",
    "UPSETDUCK X PISTACHIO SERIES", "Pesta Kuliner Banting Harga",
    "SPECIAL OFFER", "Flash Sale Makan Harian",
  ];

  useEffect(() => {
    const fetchProductsFromSupabase = async () => {
      setLoadingProducts(true);
      setProductFetchError(null);
      try {
        const { data, error } = await supabase.from('produk').select('*');
        if (error) throw error;
        setProducts(data);
        if (data.length > 0) {
          const defaultCategory = productCategories.includes('Classic Coffee') ? 'Classic Coffee' : data[0].kategori;
          setActiveCategory(defaultCategory);
        }
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setProductFetchError("Gagal memuat daftar produk. Pastikan tabel 'produk' ada dan Supabase terhubung dengan benar.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProductsFromSupabase();
  }, []);

  useEffect(() => {
    if (initialOrderData) {
      setCustomerName(initialOrderData.name || '');
      setOrderType(initialOrderData.order_type || 'Dine In');
      setTableNumber(initialOrderData.table_number || '');
      setCustomerType(initialOrderData.customer_type || 'Indoor');
      // If editing an existing order, populate orderList from initialOrderData items
      // For a new order form, this should likely be empty
      // This logic needs to be adjusted based on how initialOrderData is structured for existing orders
      setOrderList([]); // Assuming it's always a new order for now
    } else {
      setCustomerName('');
      setOrderType('Dine In');
      setTableNumber('');
      setCustomerType('Indoor');
      setOrderList([]);
    }
  }, [initialOrderData]);

  const subtotal = useMemo(() => orderList.reduce((sum, item) => sum + item.price * item.quantity, 0), [orderList]);
  const taxRate = 0.10;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.kategori === activeCategory &&
      product.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, activeCategory, searchTerm]);

  const addToOrder = (productToAdd) => {
    setOrderList(prevList => {
      const existingItem = prevList.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prevList.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevList, {
          id: productToAdd.id,
          name: productToAdd.nama,
          price: productToAdd.harga,
          imageUrl: productToAdd.gambar,
          quantity: 1,
          modifiers: []
        }];
      }
    });
  };

  const updateOrderQuantity = (id, delta) => {
    setOrderList(prevList => {
      const updatedList = prevList.map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity + delta }
          : item
      ).filter(item => item.quantity > 0);
      return updatedList;
    });
  };

  const removeItem = (id) => {
    setOrderList(prevList => prevList.filter(item => item.id !== id));
  };

  const handlePlaceOrder = async () => {
    if (orderList.length === 0) {
      Swal.fire('Pesanan Kosong', 'Harap tambahkan item ke pesanan terlebih dahulu.', 'warning');
      return;
    }

    if (!customerName.trim()) {
      Swal.fire('Nama Pelanggan Kosong', 'Harap masukkan nama pelanggan.', 'warning');
      return;
    }

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName,
          order_type: orderType,
          table_number: tableNumber,
          customer_type: customerType,
          status: 'Processing',
          total_amount: total,
        })
        .select();

      if (orderError) throw orderError;

      const newOrderId = orderData[0].id;

      const orderItemsToInsert = orderList.map(item => ({
        order_id: newOrderId,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price_per_unit: item.price
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (orderItemsError) throw orderItemsError;

      Swal.fire('Berhasil!', `Pesanan untuk ${customerName} berhasil ditempatkan. Total: Rp ${total.toLocaleString('id-ID')}`, 'success');

      setOrderList([]);
      setCustomerName('');
      setTableNumber('');
      setCustomerType('Indoor');
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error placing order:", err.message);
      Swal.fire('Gagal!', `Terjadi kesalahan saat menempatkan pesanan: ${err.message}. Mohon cek koneksi Supabase Anda.`, 'error');
    }
  };

  const today = new Date();
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('id-ID', options);

  return (
       <div className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-[1000] p-4 font-sans antialiased"> {/* Hapus bg-black bg-opacity-70 */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-full h-full flex flex-col relative animate-fade-in-up transform transition-all duration-300 scale-90 opacity-100"> {/* Ubah max-w-6xl menjadi max-w-full dan h-[90vh] menjadi h-full */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-4xl font-light z-20 transition-transform duration-200 hover:rotate-90"
              onClick={onClose}
              title="Tutup Form"
            >
              <X size={28} />
        </button>

        {/* Header Section - Orange Theme */}
        <div className="flex-none bg-orange-600 text-white p-6 rounded-t-xl flex justify-between items-center">
          <h2 className="text-3xl font-extrabold flex items-center">
            <span className="mr-3">Form</span> Pesanan Baru
          </h2>
          <div className="text-lg font-medium opacity-90">
            {formattedDate}
          </div>
        </div>

        <div className="flex flex-1 p-6 bg-gray-50 overflow-hidden">
          {/* Left Panel: Product Selection */}
          <div className="w-2/3 bg-white rounded-lg shadow-lg p-6 mr-6 flex flex-col border border-gray-200">
            {/* Search and Filter Section */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <button
                className="bg-orange-50 text-orange-700 p-3 rounded-lg hover:bg-orange-100 transition-colors duration-200 flex items-center justify-center shadow-sm"
                title="Filter Produk"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex space-x-3 overflow-x-auto pb-3 mb-6 custom-scrollbar-horizontal border-b border-gray-200">
              {productCategories.map(category => {
                const itemCount = products.filter(p => p.kategori === category).length;
                return (
                  <button
                    key={category}
                    className={`flex-shrink-0 py-2 px-5 rounded-full font-semibold text-sm transition-all duration-200 whitespace-nowrap group
                      ${activeCategory === category
                        ? 'bg-orange-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category} <span className="ml-1 text-xs opacity-75 group-hover:opacity-100 transition-opacity duration-200">({itemCount} item)</span>
                  </button>
                );
              })}
            </div>

            {/* Product List */}
            {loadingProducts ? (
              <div className="flex-1 flex items-center justify-center flex-col py-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
                <p className="text-xl text-gray-600 font-medium">Memuat produk...</p>
              </div>
            ) : productFetchError ? (
              <div className="flex-1 flex flex-col items-center justify-center text-red-600 text-center bg-red-50 rounded-lg p-6 border border-red-200">
                <CircleAlert className="w-10 h-10 mb-4 text-red-500" />
                <p className="text-lg font-semibold mb-2">Terjadi Kesalahan!</p>
                <p className="text-gray-700">{productFetchError}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-center bg-gray-100 rounded-lg p-6">
                <Info className="w-10 h-10 mb-4" />
                <p className="text-lg font-semibold mb-2">Tidak Ditemukan</p>
                <p>Tidak ada produk yang cocok di kategori ini atau dengan pencarian Anda.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-md p-4 flex flex-col items-center text-center cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                    onClick={() => addToOrder(product)}
                  >
                    <img
                      src={product.gambar || 'https://via.placeholder.com/150/f97316/FFFFFF?text=No+Image'}
                      alt={product.nama}
                      className="w-full h-28 object-cover rounded-lg mb-3 shadow-sm"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150/f97316/FFFFFF?text=No+Image'; }}
                    />
                    <p className="font-bold text-gray-900 text-lg mb-1 leading-tight">{product.nama}</p>
                    <p className="text-orange-600 font-extrabold text-xl">Rp {product.harga?.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        {/* Right Panel: Order Summary */}
<div className="w-1/3 bg-white rounded-lg shadow-lg p-6 flex flex-col border border-gray-200 max-h-[calc(100vh-160px)] overflow-hidden">
  {/* Header */}
  <h2 className="text-2xl font-bold text-gray-800 mb-3">Struk Pembelian</h2>

  {/* Order Type Buttons */}
  <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-lg mb-3 text-sm font-semibold flex-none">
    {['Dine In', 'Take Away', 'Order Online'].map(type => (
      <button
        key={type}
        className={`py-2 px-1 rounded-lg transition-colors duration-200 flex flex-col items-center justify-center
          ${orderType === type ? 'bg-orange-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
        onClick={() => setOrderType(type)}
      >
        {type === 'Dine In' && <Utensils size={16} className="mb-1" />}
        {type === 'Take Away' && <ShoppingBag size={16} className="mb-1" />}
        {type === 'Order Online' && <Laptop size={16} className="mb-1" />}
        {type}
      </button>
    ))}
  </div>

  {/* Customer Info Inputs */}
  <div className="space-y-3 flex-none">
    {/* Nama */}
    <div>
      <label htmlFor="customerName" className="block text-xs font-medium text-gray-700 mb-1">
        <User size={14} className="inline-block mr-1 text-gray-500" /> Nama Pelanggan
      </label>
      <input
        type="text"
        id="customerName"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
        placeholder="Cth: John Doe"
      />
    </div>

    {/* Meja + Tipe */}
    <div className="flex space-x-2">
      <div className="flex-1">
        <label htmlFor="tableNumber" className="block text-xs font-medium text-gray-700 mb-1">
          <Warehouse size={14} className="inline-block mr-1 text-gray-500" /> Meja
        </label>
        <input
          type="text"
          id="tableNumber"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
          placeholder="Cth: Meja 5"
        />
      </div>
      <div className="flex-1 relative">
        <label htmlFor="customerType" className="block text-xs font-medium text-gray-700 mb-1">
          <Building size={14} className="inline-block mr-1 text-gray-500" /> Tipe Area
        </label>
        <select
          id="customerType"
          value={customerType}
          onChange={(e) => setCustomerType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 pr-6 text-sm"
        >
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
      </div>
    </div>
  </div>

  {/* Order List Scrollable */}
  <div className="flex-1 overflow-y-auto mt-3 pr-1 custom-scrollbar border-y border-gray-200 py-3">
    {orderList.length === 0 ? (
      <div className="text-center text-gray-500 py-6">
        <Info size={32} className="mx-auto mb-2" />
        <p>Belum ada item dalam pesanan.</p>
      </div>
    ) : (
      orderList.map(item => (
        <div key={item.id} className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0">
          <div className="flex items-center">
            <img
              src={item.imageUrl || 'https://via.placeholder.com/50/f97316/FFFFFF?text=No+Image'}
              alt={item.name}
              className="w-10 h-10 object-cover rounded-md mr-2 shadow-sm"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50/f97316/FFFFFF?text=No+Image'; }}
            />
            <div>
              <p className="font-medium text-gray-800 text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">Rp {item.price.toLocaleString('id-ID')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              className="bg-gray-200 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-300"
              onClick={() => updateOrderQuantity(item.id, -1)}
            ><Minus size={14} /></button>
            <span className="font-bold text-gray-900 text-sm">{item.quantity}</span>
            <button
              className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-orange-600"
              onClick={() => updateOrderQuantity(item.id, 1)}
            ><Plus size={14} /></button>
            <p className="font-bold text-gray-900 text-sm w-16 text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
            <button
              className="text-red-500 hover:text-red-700 ml-1"
              onClick={() => removeItem(item.id)}
            ><X size={16} /></button>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Summary + Button */}
  <div className="flex-none mt-4 space-y-3">
    <div className="flex justify-between text-sm">
      <span>Subtotal</span>
      <span className="font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
    </div>
    <div className="flex justify-between text-sm">
      <span>Pajak ({taxRate * 100}%)</span>
      <span className="font-semibold">Rp {tax.toLocaleString('id-ID')}</span>
    </div>
    <div className="flex justify-between text-lg font-bold text-orange-700 border-t border-dashed border-gray-300 pt-2">
      <span>Total</span>
      <span>Rp {total.toLocaleString('id-ID')}</span>
    </div>
    <button
      className={`w-full bg-orange-600 text-white py-3 rounded-lg text-base font-bold flex items-center justify-center shadow-md hover:bg-orange-700 transition
        ${orderList.length === 0 || !customerName.trim() ? 'opacity-500 cursor-not-allowed' : ''}`}
      onClick={handlePlaceOrder}
      disabled={orderList.length === 0 || !customerName.trim()}
    >
      <ArrowRight size={20} className="mr-2" /> Proses Transaksi Rp {total.toLocaleString('id-ID')}
    </button>
  </div>
</div>

        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ccc; /* Light grey for scrollbar thumb */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb {
          background: #ccc; /* Light grey for scrollbar thumb */
          border-radius: 10px;
        }
        .custom-scrollbar-horizontal::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );  
};

export default SalesForm;