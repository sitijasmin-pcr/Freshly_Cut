// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ShoppingCart,UserCircle } from "lucide-react";
// import { useCart } from "./CartContext";
// import { supabase } from "../supabase"; // Import your Supabase client
// import Swal from 'sweetalert2'; // Import SweetAlert2 for confirmations

// export default function OrderInformation() {
//   const { cartItems, clearCart } = useCart();
//   const navigate = useNavigate();

//   const [orderSummary, setOrderSummary] = useState(() => {
//     const storedOrder = sessionStorage.getItem("lastOrderSummary");
//     return storedOrder ? JSON.parse(storedOrder) : null;
//   });
//   const [currentOrderStatus, setCurrentOrderStatus] = useState(
//     orderSummary?.status || "Unknown"
//   );
//   const [showReceiptModal, setShowReceiptModal] = useState(false);

//   useEffect(() => {
//     console.log(
//       "OrderInformation mounted/updated. Current orderSummary from state:",
//       orderSummary
//     );
//     console.log("Current cartItems from context:", cartItems);

//     // REMOVED: The navigation logic when orderSummary is empty
//     // if (!orderSummary && cartItems.length === 0) {
//     //   console.log(
//     //     "Tidak ada informasi pesanan yang bisa ditampilkan. Mengarahkan ke halaman Menu."
//     //   );
//     //   navigate("/MenuUser", { replace: true });
//     //   return; // Exit early if no order data
//     // }

//     // Set initial status from orderSummary if available
//     if (orderSummary?.status) {
//       setCurrentOrderStatus(orderSummary.status);
//     }

//     // --- Supabase Realtime Subscription ---
//     let orderSubscription = null;
//     if (orderSummary && orderSummary.orderId) {
//       // Only subscribe if orderId exists
//       console.log(
//         `Subscribing to order changes for ID: ${orderSummary.orderId}`
//       );
//       orderSubscription = supabase
//         .channel(`order_status_changes:${orderSummary.orderId}`) // Unique channel for this order
//         .on(
//           "postgres_changes",
//           {
//             event: "UPDATE",
//             schema: "public",
//             table: "orders",
//             filter: `id=eq.${orderSummary.orderId}`, // Filter for this specific order ID
//           },
//           (payload) => {
//             console.log("Realtime update received!", payload);
//             if (payload.new && payload.new.status) {
//               const newStatus = payload.new.status;
//               setCurrentOrderStatus(newStatus); // Update the status state
//               const updatedSummary = { ...orderSummary, status: newStatus };
//               setOrderSummary(updatedSummary); // Update full summary
//               sessionStorage.setItem(
//                 "lastOrderSummary",
//                 JSON.stringify(updatedSummary)
//               );
//             }
//           }
//         )
//         .subscribe();
//     }

//     // Cleanup function for the subscription
//     return () => {
//       if (orderSubscription) {
//         console.log(
//           `Unsubscribing from order changes for ID: ${orderSummary?.orderId}`
//         );
//         supabase.removeChannel(orderSubscription);
//       }
//     };
//   }, [orderSummary, cartItems, navigate]); // Add orderSummary to dependencies for initial status setting and subscription

//   const formatRupiah = (amount) => {
//     if (typeof amount !== "number" || isNaN(amount)) {
//       return "Rp 0";
//     }
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const handleReceiptButtonClick = () => {
//     setShowReceiptModal(true);
//   };

//   const handleDownloadReceipt = () => {
//     console.log("Downloading receipt...");
//     alert("Fungsi download receipt akan ditambahkan di sini.");
//   };

//   const handleOrderDone = () => {
//     Swal.fire({
//       title: 'Pesanan Selesai?',
//       text: "Anda akan mengosongkan informasi pesanan ini. Anda dapat melihat riwayat pesanan di halaman 'Order History' (jika ada).",
//       icon: 'info',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Ya, Selesai!',
//       cancelButtonText: 'Batal'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         // Clear order information from sessionStorage
//         sessionStorage.removeItem("lastOrderSummary");
//         // Clear the cart if there's anything left (though it should be empty after checkout)
//         clearCart();
//         // Update local state to reflect that order summary is gone
//         setOrderSummary(null);
//         setCurrentOrderStatus("Unknown");
//         // Navigate back to the menu (you can remove this if you want to stay on the empty page)
//         // navigate("/MenuUser", { replace: true }); // Keep or remove based on desired behavior after "Done"
//         Swal.fire(
//           'Pesanan Selesai!',
//           'Informasi pesanan telah dihapus.',
//           'success'
//         );
//       }
//     });
//   };

//   // Conditional rendering for when orderSummary is empty
//   if (!orderSummary || !orderSummary.items || orderSummary.items.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans flex flex-col">
//         {/* Navbar Section - Keep the navbar visible */}
//         <nav className="bg-white shadow-lg py-4 px-8 sticky top-0 z-50">
//           <div className="flex justify-between items-center border-b pb-3 mb-6">
//             <div className="flex items-center gap-3">
//               <img src="/img/Logo.png" alt="Logo" className="h-10" />
//               <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
//                 TOMORO{" "}
//                 <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">
//                   COFFEE
//                 </span>
//               </h1>
//             </div>

//             <nav className="flex gap-8 text-sm font-medium text-gray-700">
//               <Link
//                 to="/HomeUser"
//                 className="hover:text-orange-500 transition-colors"
//               >
//                 Home
//               </Link>
//               <Link
//                 to="/MenuUser"
//                 className="hover:text-orange-500 transition-colors"
//               >
//                 Menu
//               </Link>
//               <Link
//                 to="/lokasi"
//                 className="hover:text-orange-500 transition-colors"
//               >
//                 Location
//               </Link>
//               <Link
//                 to="/FAQUser"
//                 className="hover:text-orange-500 transition-colors"
//               >
//                 FAQ
//               </Link>
//               <Link
//                 to="/FeedbackUser"
//                 className="hover:text-orange-500 transition-colors"
//               >
//                 Feedback
//               </Link>
//               <Link
//                 to="/ProfInfo"
//                 className="hover:text-orange-500 transition-colors"
//               >
//                 Story
//               </Link>
//             </nav>

//           <div className="flex items-center gap-4">
//             {/* New: Profile Icon */}
//             <Link to="/ProfileUser" className="text-orange-500 hover:text-orange-600">
//               <UserCircle className="w-5 h-5" />
//             </Link>
//             {/* Existing icons */}
//             <Link to="/CartUser" className="text-orange-500 hover:text-orange-600">
//               <ShoppingCart className="w-5 h-5" />
//             </Link>
//             <Link
//               to="/NotificationUser"
//               className="text-orange-500 hover:text-orange-600"
//             >
//               <Bell className="w-5 h-5" />
//             </Link>
//           </div>
//           </div>
//         </nav>

//         {/* Empty Order Content */}
//         <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
//           <ShoppingCart className="w-24 h-24 text-gray-400 mb-6" />
//           <h1 className="text-3xl font-bold text-gray-700 mb-3">
//             Tidak Ada Pesanan Aktif
//           </h1>
//           <p className="text-gray-500 mb-8 text-center max-w-md">
//             Sepertinya Anda belum memiliki pesanan yang sedang berlangsung. Jelajahi menu kami untuk memulai pesanan baru!
//           </p>
//           <Link
//             to="/MenuUser"
//             className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg"
//           >
//             Pesan Sekarang
//           </Link>
//         </div>

//         {/* Footer Section - Keep the footer visible */}
//         <footer className="relative mt-20 w-full text-white">
//           <div
//             className="absolute inset-0 bg-cover bg-center"
//             style={{
//               backgroundImage:
//                 "url('https://placehold.co/1920x400/333333/FFFFFF?text=Footer+Background')",
//             }}
//           ></div>
//           <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
//           <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
//             <div>
//               <div className="flex items-center gap-3 mb-4">
//                 <img src="/img/Logo.png" alt="Logo" className="h-10" />
//                 <div>
//                   <h2 className="text-xl font-bold text-orange-400">TOMORO</h2>
//                   <p className="text-sm tracking-[0.3em] text-orange-300">
//                     COFFEE
//                   </p>
//                 </div>
//               </div>
//               <div className="text-sm leading-relaxed">
//                 <p className="text-orange-400 font-semibold mb-1">Our Location</p>
//                 <p>Headquarters</p>
//                 <p>
//                   Jl. Riau No.57 B, Kp. Bandar, Kec. Senapelan, Kota Pekanbaru,
//                   Riau 28291
//                 </p>
//               </div>
//             </div>
//             <div className="text-sm">
//               <p className="text-orange-400 font-semibold mb-2">Social Media</p>
//               <div className="flex gap-4 text-lg">
//                 <a href="#" className="hover:text-orange-300">
//                   <i className="fab fa-instagram"></i>
//                 </a>
//                 <a href="#" className="hover:text-orange-300">
//                   <i className="fab fa-tiktok"></i>
//                 </a>
//                 <a
//                   href="mailto:contact@tomorocoffee.com"
//                   className="hover:text-orange-300"
//                 >
//                   <i className="fas fa-envelope"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
//             Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
//           </div>
//         </footer>
//       </div>
//     );
//   }

//   // Menggunakan data dari orderSummary yang sudah pasti ada
//   const currentOrderSummary = orderSummary;
//   const customerName = currentOrderSummary.customerName || "Customer";
//   const orderDate =
//     new Date(currentOrderSummary.createdAt || Date.now()).toLocaleDateString(
//       "id-ID",
//       { year: "numeric", month: "2-digit", day: "2-digit" }
//     ) +
//     " " +
//     new Date(currentOrderSummary.createdAt || Date.now()).toLocaleTimeString(
//       "id-ID",
//       { hour: "2-digit", minute: "2-digit" }
//     );
//   const invoiceNumber =
//     currentOrderSummary.receiptId ||
//     `INV-${
//       currentOrderSummary.orderId
//         ? currentOrderSummary.orderId.substring(0, 8).toUpperCase()
//         : Date.now()
//     }`;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans flex flex-col">
//       {/* Navbar Section */}
//       <nav className="bg-white shadow-lg py-4 px-8 sticky top-0 z-50">
//         <div className="flex justify-between items-center border-b pb-3 mb-6">
//           <div className="flex items-center gap-3">
//             <img src="/img/Logo.png" alt="Logo" className="h-10" />
//             <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
//               TOMORO{" "}
//               <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">
//                 COFFEE
//               </span>
//             </h1>
//           </div>

//           <nav className="flex gap-8 text-sm font-medium text-gray-700">
//             <Link
//               to="/HomeUser"
//               className="hover:text-orange-500 transition-colors"
//             >
//               Home
//             </Link>
//             <Link
//               to="/MenuUser"
//               className="hover:text-orange-500 transition-colors"
//             >
//               Menu
//             </Link>
//             <Link
//               to="/lokasi"
//               className="hover:text-orange-500 transition-colors"
//             >
//               Location
//             </Link>
//             <Link
//               to="/FAQUser"
//               className="hover:text-orange-500 transition-colors"
//             >
//               FAQ
//             </Link>
//             <Link
//               to="/FeedbackUser"
//               className="hover:text-orange-500 transition-colors"
//             >
//               Feedback
//             </Link>
//             <Link
//               to="/ProfInfo"
//               className="hover:text-orange-500 transition-colors"
//             >
//               Story
//             </Link>
//           </nav>

//           <div className="flex items-center gap-4">
//             <Link
//               to="/CartUser"
//               className="text-orange-500 hover:text-orange-600 relative"
//             >
//               <ShoppingCart className="w-5 h-5" />
//               {cartItems.length > 0 && (
//                 <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>
//               )}
//             </Link>
//             <Link
//               to="/NotificationUser"
//               className="text-orange-500 hover:text-orange-600"
//             >
//               <i className="fas fa-bell w-5 h-5"></i>
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="flex-grow container mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
//           Your Orders
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Order Details (Left/Main Column) */}
//           <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
//             <div className="grid grid-cols-6 gap-4 text-gray-600 font-semibold border-b pb-3 mb-4 text-center">
//               <div className="col-span-2 text-left">Product</div>
//               <div>Harga</div>
//               <div>Quantity</div>
//               <div>Kadar Gula</div>
//               <div className="text-center">Subtotal</div>
//               <div></div>
//             </div>

//             {currentOrderSummary.items.map((item, index) => (
//               <motion.div
//                 key={item.id || index}
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//                 className="grid grid-cols-6 gap-4 items-center py-4 border-b last:border-b-0"
//               >
//                 <div className="col-span-2 flex items-center space-x-4">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-16 h-16 object-cover rounded-md border border-gray-200"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src =
//                         "https://placehold.co/64x64/E8DED1/333333?text=Produk";
//                     }}
//                   />
//                   <span className="text-gray-800 font-medium">{item.name}</span>
//                 </div>
//                 <div className="text-center text-gray-700">
//                   {formatRupiah(item.price)}
//                 </div>
//                 <div className="text-center text-gray-800">{item.quantity}</div>
//                 <div className="text-center text-gray-800">
//                   {item.sugarLevel || "N/A"}
//                 </div>
//                 <div className="text-center text-gray-800 font-medium">
//                   {formatRupiah(item.subtotal)}
//                 </div>
//                 <div></div>
//               </motion.div>
//             ))}

//             <div className="mt-6 flex justify-between items-center text-gray-700 text-sm">
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold">Status:</span>
//                 <span
//                   className={`font-bold ${
//                     currentOrderStatus === "Completed"
//                       ? "text-green-600"
//                       : currentOrderStatus === "Processing"
//                       ? "text-blue-600"
//                       : currentOrderStatus === "Pending"
//                       ? "text-yellow-600"
//                       : currentOrderStatus === "Canceled"
//                       ? "text-red-600"
//                       : "text-gray-600"
//                   }`}
//                 >
//                   {currentOrderStatus}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold">Estimate Time:</span>
//                 <span className="text-green-600 font-bold">30 Min</span>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary (Right Column) */}
//           <div className="lg:col-span-1 w-full bg-white rounded-lg shadow-md p-6 h-fit">
//             <h2 className="text-xl font-bold text-gray-800 mb-6">
//               Order Summary
//             </h2>
//             <div className="space-y-3 text-gray-700">
//               <div className="flex justify-between">
//                 <span>Items</span>
//                 <span>{currentOrderSummary.items.length}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Sub Total</span>
//                 <span>{formatRupiah(currentOrderSummary.subTotalAmount)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Delivery</span>
//                 <span>{formatRupiah(currentOrderSummary.deliveryFee)}</span>
//               </div>
//               <div className="flex justify-between text-orange-600">
//                 <span>Taxes (10%)</span>
//                 <span>{formatRupiah(currentOrderSummary.taxesAmount)}</span>
//               </div>
//               <div className="flex justify-between text-red-500">
//                 <span>Discount</span>
//                 <span>-{formatRupiah(currentOrderSummary.couponDiscount)}</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
//                 <span>TOTAL</span>
//                 <span>{formatRupiah(currentOrderSummary.totalAmount)}</span>
//               </div>
//             </div>
//             <button
//               onClick={handleReceiptButtonClick}
//               className="mt-8 w-full block text-center bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
//             >
//               Receipt
//             </button>

//             {/* START: New Done Button */}
//             <button
//               onClick={handleOrderDone}
//               className="mt-4 w-full block text-center bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
//             >
//               Done (Pesanan Selesai)
//             </button>
//             {/* END: New Done Button */}
//           </div>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <footer className="relative mt-20 w-full text-white">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://placehold.co/1920x400/333333/FFFFFF?text=Footer+Background')",
//           }}
//         ></div>
//         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
//         <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
//           <div>
//             <div className="flex items-center gap-3 mb-4">
//               <img src="/img/Logo.png" alt="Logo" className="h-10" />
//               <div>
//                 <h2 className="text-xl font-bold text-orange-400">TOMORO</h2>
//                 <p className="text-sm tracking-[0.3em] text-orange-300">
//                   COFFEE
//                 </p>
//               </div>
//             </div>
//             <div className="text-sm leading-relaxed">
//               <p className="text-orange-400 font-semibold mb-1">Our Location</p>
//               <p>Headquarters</p>
//               <p>
//                 Jl. Riau No.57 B, Kp. Bandar, Kec. Senapelan, Kota Pekanbaru,
//                 Riau 28291
//               </p>
//             </div>
//           </div>
//           <div className="text-sm">
//             <p className="text-orange-400 font-semibold mb-2">Social Media</p>
//             <div className="flex gap-4 text-lg">
//               <a href="#" className="hover:text-orange-300">
//                 <i className="fab fa-instagram"></i>
//               </a>
//               <a href="#" className="hover:text-orange-300">
//                 <i className="fab fa-tiktok"></i>
//               </a>
//               <a
//                 href="mailto:contact@tomorocoffee.com"
//                 className="hover:text-orange-300"
//               >
//                 <i className="fas fa-envelope"></i>
//               </a>
//             </div>
//           </div>
//         </div>
//         <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
//           Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
//         </div>
//       </footer>

//       {/* Receipt Modal */}
//       {showReceiptModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.3 }}
//             className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 md:p-8 relative"
//           >
//             <button
//               onClick={() => setShowReceiptModal(false)}
//               className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>

//             <div className="text-center mb-6">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <img
//                   src="/img/Logo.png"
//                   alt="Logo"
//                   className="h-8 inline-block"
//                 />
//                 <h2 className="text-2xl font-bold text-orange-600">
//                   TOMORO COFFEE
//                 </h2>
//               </div>
//               <p className="text-gray-600">THANKS FOR YOUR ORDER</p>
//             </div>

//             <div className="text-sm text-gray-700 mb-6">
//               <div className="flex justify-between mb-1">
//                 <span className="font-semibold">ORDER RECEIPT:</span>
//                 <span>{invoiceNumber}</span>
//               </div>
//               <div className="flex justify-between mb-1">
//                 <span className="font-semibold">NAME:</span>
//                 <span>{customerName}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-semibold">ORDER DATE:</span>
//                 <span>{orderDate}</span>
//               </div>
//             </div>

//             <div className="border-t border-b border-gray-300 py-4 mb-6">
//               <div className="grid grid-cols-4 gap-2 font-semibold text-gray-800 pb-2 border-b border-gray-200">
//                 <div className="col-span-1">PRODUCT</div>
//                 <div className="text-center">QTY</div>
//                 <div className="text-right">PRICE</div>
//                 <div className="text-right">TOTAL</div>
//               </div>
//               {currentOrderSummary.items.map((item) => (
//                 <div
//                   key={item.id}
//                   className="grid grid-cols-4 gap-2 py-2 text-sm text-gray-700"
//                 >
//                   <div className="col-span-1">{item.name}</div>
//                   <div className="text-center">{item.quantity}</div>
//                   <div className="text-right">{formatRupiah(item.price)}</div>
//                   <div className="text-right">
//                     {formatRupiah(item.subtotal)}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-2 text-gray-700 text-sm">
//               <div className="flex justify-between">
//                 <span>SUBTOTAL</span>
//                 <span className="font-semibold">
//                   {formatRupiah(currentOrderSummary.subTotalAmount)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>DELIVERY</span>
//                 <span className="font-semibold">
//                   {formatRupiah(currentOrderSummary.deliveryFee)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>TAXES (10%)</span>
//                 <span className="font-semibold">
//                   {formatRupiah(currentOrderSummary.taxesAmount)}
//                 </span>
//               </div>
//               <div className="flex justify-between text-red-600">
//                 <span>DISCOUNT</span>
//                 <span className="font-semibold">
//                   -{formatRupiah(currentOrderSummary.couponDiscount)}
//                 </span>
//               </div>
//               <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-gray-800">
//                 <span>TOTAL</span>
//                 <span>{formatRupiah(currentOrderSummary.totalAmount)}</span>
//               </div>
//             </div>

//             <button
//               onClick={handleDownloadReceipt}
//               className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               DOWNLOAD RECEIPT
//             </button>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, UserCircle, Bell } from "lucide-react"; // Make sure Bell is imported
import { useCart } from "./CartContext";
import { supabase } from "../supabase";
import Swal from 'sweetalert2';

export default function OrderInformation() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [orderSummary, setOrderSummary] = useState(() => {
    const storedOrder = sessionStorage.getItem("lastOrderSummary");
    return storedOrder ? JSON.parse(storedOrder) : null;
  });
  const [currentOrderStatus, setCurrentOrderStatus] = useState(
    orderSummary?.status || "Order Placed" // Default to "Order Placed" as per image
  );
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    console.log(
      "OrderInformation mounted/updated. Current orderSummary from state:",
      orderSummary
    );
    console.log("Current cartItems from context:", cartItems);

    if (orderSummary?.status) {
      setCurrentOrderStatus(orderSummary.status);
    }

    let orderSubscription = null;
    if (orderSummary && orderSummary.orderId) {
      console.log(
        `Subscribing to order changes for ID: ${orderSummary.orderId}`
      );
      orderSubscription = supabase
        .channel(`order_status_changes:${orderSummary.orderId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `id=eq.${orderSummary.orderId}`,
          },
          (payload) => {
            console.log("Realtime update received!", payload);
            if (payload.new && payload.new.status) {
              const newStatus = payload.new.status;
              setCurrentOrderStatus(newStatus);
              const updatedSummary = { ...orderSummary, status: newStatus };
              setOrderSummary(updatedSummary);
              sessionStorage.setItem(
                "lastOrderSummary",
                JSON.stringify(updatedSummary)
              );
              // Show a SweetAlert notification for status change
              Swal.fire({
                icon: 'info',
                title: 'Order Status Updated!',
                text: `Your order status has changed to: ${newStatus}`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
              });
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (orderSubscription) {
        console.log(
          `Unsubscribing from order changes for ID: ${orderSummary?.orderId}`
        );
        supabase.removeChannel(orderSubscription);
      }
    };
  }, [orderSummary, cartItems, navigate]);

  const formatRupiah = (amount) => {
    if (typeof amount !== "number" || isNaN(amount)) {
      return "Rp 0";
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleReceiptButtonClick = () => {
    setShowReceiptModal(true);
  };

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt...");
    alert("Fungsi download receipt akan ditambahkan di sini.");
  };

  const handleOrderDone = () => {
    Swal.fire({
      title: 'Pesanan Selesai?',
      text: "Anda akan mengosongkan informasi pesanan ini. Anda dapat melihat riwayat pesanan di halaman 'Order History' (jika ada).",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Selesai!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem("lastOrderSummary");
        clearCart();
        setOrderSummary(null);
        setCurrentOrderStatus("Unknown");
        Swal.fire(
          'Pesanan Selesai!',
          'Informasi pesanan telah dihapus.',
          'success'
        );
      }
    });
  };

  const getStatusDate = (statusKey) => {
    // This is placeholder logic. In a real application, you'd store
    // the timestamp for each status change in your database.
    // For now, we'll return a static or relative date.
    const today = new Date();
    const futureDate = new Date(today);
    let time = "9:00 AM";

    switch (statusKey) {
      case "Order Placed":
        // This should be the actual order creation date
        if (orderSummary?.createdAt) {
          const date = new Date(orderSummary.createdAt);
          return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}\n${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
        }
        return `${today.getDate()} ${today.toLocaleString('en-US', { month: 'short' })} ${today.getFullYear()}\n${today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
      case "Accepted":
        futureDate.setDate(today.getDate());
        time = "11:15 PM"; // Example time
        return `${futureDate.getDate()} ${futureDate.toLocaleString('en-US', { month: 'short' })} ${futureDate.getFullYear()}\n${time}`;
      case "In Progress":
        futureDate.setDate(today.getDate() + 1); // Example: next day
        time = "30 July 2024"; // As per image example, can be adjusted
        return `${time}`;
      case "On the Way":
        futureDate.setDate(today.getDate() + 1); // Example: next day
        time = "30 July 2024"; // As per image example, can be adjusted
        return `${time}`;
      case "Delivered":
        futureDate.setDate(today.getDate() + 2); // Example: two days later
        time = "30 July 2024"; // As per image example, can be adjusted
        return `${time}`;
      default:
        return "N/A";
    }
  };

  const getStatusIcon = (statusKey) => {
    const baseClass = "w-10 h-10 p-2 rounded-full flex items-center justify-center";
    const currentStatusIndex = ["Order Placed", "Accepted", "In Progress", "On the Way", "Delivered"].indexOf(currentOrderStatus);
    const statusIndex = ["Order Placed", "Accepted", "In Progress", "On the Way", "Delivered"].indexOf(statusKey);

    if (statusIndex < currentStatusIndex) {
      return (
        <div className={`${baseClass} bg-green-100 text-green-600`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    } else if (statusIndex === currentStatusIndex) {
      return (
        <div className={`${baseClass} bg-yellow-100 text-yellow-600 border-2 border-yellow-500`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className={`${baseClass} bg-gray-100 text-gray-400`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      );
    }
  };

  const getLineClass = (statusKey) => {
    const statuses = ["Order Placed", "Accepted", "In Progress", "On the Way", "Delivered"];
    const currentStatusIndex = statuses.indexOf(currentOrderStatus);
    const statusIndex = statuses.indexOf(statusKey);

    if (statusIndex < currentStatusIndex) {
      return "bg-green-500";
    } else {
      return "bg-gray-300";
    }
  };


  if (!orderSummary || !orderSummary.items || orderSummary.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans flex flex-col">
        {/* Navbar Section - Keep the navbar visible */}
        <nav className="bg-white shadow-lg py-4 px-8 sticky top-0 z-50">
          <div className="flex justify-between items-center border-b pb-3 mb-6">
            <div className="flex items-center gap-3">
              <img src="/img/Logo.png" alt="Logo" className="h-10" />
              <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
                TOMORO{" "}
                <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">
                  COFFEE
                </span>
              </h1>
            </div>

            <nav className="flex gap-8 text-sm font-medium text-gray-700">
              <Link
                to="/HomeUser"
                className="hover:text-orange-500 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/MenuUser"
                className="hover:text-orange-500 transition-colors"
              >
                Menu
              </Link>
              <Link
                to="/lokasi"
                className="hover:text-orange-500 transition-colors"
              >
                Location
              </Link>
              <Link
                to="/FAQUser"
                className="hover:text-orange-500 transition-colors"
              >
                FAQ
              </Link>
              <Link
                to="/FeedbackUser"
                className="hover:text-orange-500 transition-colors"
              >
                Feedback
              </Link>
              <Link
                to="/ProfInfo"
                className="hover:text-orange-500 transition-colors"
              >
                Story
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link to="/ProfileUser" className="text-orange-500 hover:text-orange-600">
                <UserCircle className="w-5 h-5" />
              </Link>
              <Link to="/CartUser" className="text-orange-500 hover:text-orange-600">
                <ShoppingCart className="w-5 h-5" />
              </Link>
              <Link
                to="/NotificationUser"
                className="text-orange-500 hover:text-orange-600"
              >
                <Bell className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Empty Order Content */}
        <div className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <ShoppingCart className="w-24 h-24 text-gray-400 mb-6" />
          <h1 className="text-3xl font-bold text-gray-700 mb-3">
            Tidak Ada Pesanan Aktif
          </h1>
          <p className="text-gray-500 mb-8 text-center max-w-md">
            Sepertinya Anda belum memiliki pesanan yang sedang berlangsung. Jelajahi menu kami untuk memulai pesanan baru!
          </p>
          <Link
            to="/MenuUser"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-colors shadow-lg"
          >
            Pesan Sekarang
          </Link>
        </div>

        {/* Footer Section - Keep the footer visible */}
        <footer className="relative mt-20 w-full text-white">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://placehold.co/1920x400/333333/FFFFFF?text=Footer+Background')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/img/Logo.png" alt="Logo" className="h-10" />
                <div>
                  <h2 className="text-xl font-bold text-orange-400">TOMORO</h2>
                  <p className="text-sm tracking-[0.3em] text-orange-300">
                    COFFEE
                  </p>
                </div>
              </div>
              <div className="text-sm leading-relaxed">
                <p className="text-orange-400 font-semibold mb-1">Our Location</p>
                <p>Headquarters</p>
                <p>
                  Jl. Riau No.57 B, Kp. Bandar, Kec. Senapelan, Kota Pekanbaru,
                  Riau 28291
                </p>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-orange-400 font-semibold mb-2">Social Media</p>
              <div className="flex gap-4 text-lg">
                <a href="#" className="hover:text-orange-300">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="hover:text-orange-300">
                  <i className="fab fa-tiktok"></i>
                </a>
                <a
                  href="mailto:contact@tomorocoffee.com"
                  className="hover:text-orange-300"
                >
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
            Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
          </div>
        </footer>
      </div>
    );
  }

  const currentOrderSummary = orderSummary;
  const customerName = currentOrderSummary.customerName || "Customer";
  const orderDate =
    new Date(currentOrderSummary.createdAt || Date.now()).toLocaleDateString(
      "en-US", // Changed to en-US for "Jul" format as in image
      { year: "numeric", month: "short", day: "2-digit" }
    );
  const orderTime = new Date(currentOrderSummary.createdAt || Date.now()).toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit", hour12: true }
  );

  const invoiceNumber =
    currentOrderSummary.receiptId ||
    `INV-${
      currentOrderSummary.orderId
        ? currentOrderSummary.orderId.substring(0, 8).toUpperCase()
        : Date.now()
    }`;

  const orderStatuses = [
    "Order Placed",
    "Accepted",
    "In Progress",
    "On the Way",
    "Delivered",
  ];

  return (
    <div className="min-h-screen bg-[#F6F5F2] font-sans flex flex-col">     

      {/* Main Content */}
      <div className="flex-grow max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Track Your Order</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Home / Track Your Order</p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Status</h2>
          <p className="text-sm text-gray-600 mb-6">Order ID: <span className="font-medium text-gray-800">{orderSummary.orderId || 'N/A'}</span></p>

          {/* Order Status Timeline */}
          <div className="relative flex justify-between items-center mb-10">
            {orderStatuses.map((status, index) => (
              <React.Fragment key={status}>
                <div className="flex flex-col items-center relative z-10 flex-1">
                  {getStatusIcon(status)}
                  <div className={`text-center mt-2 text-xs font-semibold ${index <= orderStatuses.indexOf(currentOrderStatus) ? 'text-gray-800' : 'text-gray-500'}`}>
                    {status}
                  </div>
                  <div className="text-center mt-1 text-xs text-gray-400 whitespace-pre-line">
                    {getStatusDate(status)}
                  </div>
                </div>
                {index < orderStatuses.length - 1 && (
                  <div className={`flex-1 h-0.5 ${getLineClass(orderStatuses[index])} -mt-16 mx-2`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Products</h2>
          {currentOrderSummary.items.map((item, index) => (
            <motion.div
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between py-3 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md border border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/64x64/E8DED1/333333?text=Product";
                  }}
                />
                <div>
                  <p className="text-gray-800 font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {formatRupiah(item.price)}
                    {item.sugarLevel && ` | ${item.sugarLevel}`}
                  </p>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-800">
                {formatRupiah(item.subtotal)}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 md:p-8 relative"
          >
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img
                  src="/img/Logo.png" // Assuming you have a logo for receipt
                  alt="Logo"
                  className="h-8 inline-block"
                />
                <h2 className="text-2xl font-bold text-orange-600">
                  Grocery Store
                </h2>
              </div>
              <p className="text-gray-600">THANKS FOR YOUR ORDER</p>
            </div>

            <div className="text-sm text-gray-700 mb-6">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">ORDER RECEIPT:</span>
                <span>{invoiceNumber}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold">NAME:</span>
                <span>{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">ORDER DATE:</span>
                <span>{orderDate} {orderTime}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-300 py-4 mb-6">
              <div className="grid grid-cols-4 gap-2 font-semibold text-gray-800 pb-2 border-b border-gray-200">
                <div className="col-span-1">PRODUCT</div>
                <div className="text-center">QTY</div>
                <div className="text-right">PRICE</div>
                <div className="text-right">TOTAL</div>
              </div>
              {currentOrderSummary.items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-4 gap-2 py-2 text-sm text-gray-700"
                >
                  <div className="col-span-1">{item.name}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-right">{formatRupiah(item.price)}</div>
                  <div className="text-right">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-semibold">
                  {formatRupiah(currentOrderSummary.subTotalAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>DELIVERY</span>
                <span className="font-semibold">
                  {formatRupiah(currentOrderSummary.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>TAXES (10%)</span>
                <span className="font-semibold">
                  {formatRupiah(currentOrderSummary.taxesAmount)}
                </span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>DISCOUNT</span>
                <span className="font-semibold">
                  -{formatRupiah(currentOrderSummary.couponDiscount)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-gray-800">
                <span>TOTAL</span>
                <span>{formatRupiah(currentOrderSummary.totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={handleDownloadReceipt}
              className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              DOWNLOAD RECEIPT
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}