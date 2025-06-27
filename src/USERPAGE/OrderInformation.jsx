// import React, { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ShoppingCart, Bell } from "lucide-react";
// import { useCart } from "./CartContext";
// import { motion } from "framer-motion";

// export default function OrderInformation() {
//   const { cartItems, clearCart } = useCart();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [orderSummary, setOrderSummary] = useState(location.state?.orderSummary || null);
//   const [showReceiptModal, setShowReceiptModal] = useState(false); // State untuk mengontrol visibilitas modal

//   useEffect(() => {
//     console.log("OrderInformation mounted/updated. Current orderSummary:", orderSummary);
//     console.log("Current cartItems from context:", cartItems);

//     if (!orderSummary && cartItems.length > 0) {
//       const subTotalAmount = cartItems.reduce(
//         (acc, item) => acc + (item.price * item.quantity),
//         0
//       );
//       const deliveryFee = 0;
//       const taxesRate = 0.1;
//       const taxesAmount = subTotalAmount * taxesRate;
//       const couponDiscount = location.state?.couponDiscount || 0; 

//       const totalAmount = subTotalAmount + deliveryFee + taxesAmount - couponDiscount;

//       setOrderSummary({
//         totalItems: cartItems.length,
//         subTotalAmount,
//         deliveryFee,
//         taxesAmount,
//         couponDiscount,
//         totalAmount,
//         items: cartItems.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           sugarLevel: item.sugarLevel,
//           image: item.image,
//           subtotal: item.price * item.quantity
//         }))
//       });
//       console.log("OrderSummary recalculated from cartItems:", {
//         totalItems: cartItems.length,
//         subTotalAmount,
//         deliveryFee,
//         taxesAmount,
//         couponDiscount,
//         totalAmount,
//         items: cartItems
//       });
//     } else if (cartItems.length === 0 && !orderSummary) {
//       console.log("Tidak ada informasi pesanan yang bisa ditampilkan. Keranjang kosong atau halaman diakses langsung tanpa data. Mengarahkan ke halaman Menu.");
//       navigate('/MenuUser', { replace: true });
//     }
//   }, [cartItems, orderSummary, location.state, navigate]);

//   const formatRupiah = (amount) => {
//     return new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const handleReceiptButtonClick = () => {
//     setShowReceiptModal(true); // Tampilkan modal saat tombol "Recept" diklik
//   };

//   // Fungsi placeholder untuk download receipt
//   const handleDownloadReceipt = () => {
//     // Implementasi logika download receipt di sini
//     console.log("Downloading receipt...");
//     // Contoh: Anda bisa membuat PDF atau gambar dari konten modal
//     alert("Fungsi download receipt akan ditambahkan di sini.");
//     // Setelah download, Anda bisa memilih untuk menutup modal atau tidak
//     // setShowReceiptModal(false); 
//   };


//   if (!orderSummary || orderSummary.items.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-100 font-sans flex flex-col items-center justify-center">
//         <h1 className="text-3xl font-bold text-gray-700 mb-4">Memuat informasi pesanan...</h1>
//         <p className="text-gray-500 mb-6">Jika tidak muncul, keranjang mungkin kosong atau ada masalah data.</p>
//         <Link to="/MenuUser" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
//           Kembali ke Menu
//         </Link>
//       </div>
//     );
//   }

//   // Generate a dummy invoice number (for demonstration purposes)
//   const invoiceNumber = "INV-TM-" + Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//   const orderDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  
//   // Asumsi nama pelanggan tetap 'Andi Wijaya' seperti gambar
//   const customerName = "Andi Wijaya";

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
//             <Link to="/HomeUser" className="hover:text-orange-500 transition-colors">
//               Home
//             </Link>
//             <Link to="/MenuUser" className="hover:text-orange-500 transition-colors">
//               Menu
//             </Link>
//             <Link to="/location" className="hover:text-orange-500 transition-colors">
//               Location
//             </Link>
//             <Link to="/faq" className="hover:text-orange-500 transition-colors">
//               FAQ
//             </Link>
//             <Link to="/feedback" className="hover:text-orange-500 transition-colors">
//               Feedback
//             </Link>
//           </nav>

//           <div className="flex items-center gap-4">
//             <Link to="/CartUser" className="text-orange-500 hover:text-orange-600 relative">
//               <ShoppingCart className="w-5 h-5" />
//               {cartItems.length > 0 && (
//                 <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>
//               )}
//             </Link>
//             <Link
//               to="/NotificationUser"
//               className="text-orange-500 hover:text-orange-600"
//             >
//               <Bell className="w-5 h-5" />
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
//             {/* Header Table */}
//             <div className="grid grid-cols-6 gap-4 text-gray-600 font-semibold border-b pb-3 mb-4 text-center">
//               <div className="col-span-2 text-left">Product</div>
//               <div>Harga</div>
//               <div>Quantity</div>
//               <div className="text-center">Subtotal</div>
//               <div></div>
//             </div>

//             {/* List of Items */}
//             {orderSummary.items.map((item, index) => (
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
//                     onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/E8DED1/333333?text=Produk"; }}
//                   />
//                   <span className="text-gray-800 font-medium">{item.name}</span>
//                 </div>
//                 <div className="text-center text-gray-700">
//                   {formatRupiah(item.price)}
//                 </div>
//                 <div className="text-center text-gray-800">
//                   {item.quantity}
//                 </div>
//                 <div className="text-center text-gray-800 font-medium">
//                   {formatRupiah(item.subtotal)}
//                 </div>
//                 <div></div>
//               </motion.div>
//             ))}

//             <div className="mt-6 flex justify-between items-center text-gray-700 text-sm">
//                 <div className="flex items-center gap-2">
//                     <span className="font-semibold">Status:</span>
//                     <span className="text-blue-600 font-bold">Processing</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <span className="font-semibold">Estimate Time:</span>
//                     <span className="text-green-600 font-bold">30 Min</span>
//                 </div>
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
//                 <span>{orderSummary.totalItems}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Sub Total</span>
//                 <span>{formatRupiah(orderSummary.subTotalAmount)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Delivery</span>
//                 <span>{formatRupiah(orderSummary.deliveryFee)}</span>
//               </div>
//               <div className="flex justify-between text-orange-600">
//                 <span>Taxes (10%)</span>
//                 <span>{formatRupiah(orderSummary.taxesAmount)}</span>
//               </div>
//               <div className="flex justify-between text-red-500">
//                 <span>Discount</span>
//                 <span>-{formatRupiah(orderSummary.couponDiscount)}</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-4 mt-4">
//                 <span>Total</span>
//                 <span>{formatRupiah(orderSummary.totalAmount)}</span>
//               </div>
//             </div>
//             {/* Tombol Recept di bagian bawah Order Summary */}
//             <button
//               onClick={handleReceiptButtonClick} // Membuka modal
//               className="mt-8 w-full block text-center bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
//             >
//               Recept
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Footer Section */}
//       <footer className="relative mt-20 w-full text-white">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: "url('/img/image 48.png')" }}
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
//             {/* Close button */}
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
//                 <img src="/img/Logo.png" alt="Logo" className="h-8 inline-block" />
//                 <h2 className="text-2xl font-bold text-orange-600">TOMORO COFFEE</h2>
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
//               {orderSummary.items.map((item) => (
//                 <div key={item.id} className="grid grid-cols-4 gap-2 py-2 text-sm text-gray-700">
//                   <div className="col-span-1">{item.name}</div>
//                   <div className="text-center">{item.quantity}</div>
//                   <div className="text-right">{formatRupiah(item.price)}</div>
//                   <div className="text-right">{formatRupiah(item.subtotal)}</div>
//                 </div>
//               ))}
//             </div>

//             <div className="space-y-2 text-gray-700 text-sm">
//               <div className="flex justify-between">
//                 <span>SUBTOTAL</span>
//                 <span className="font-semibold">{formatRupiah(orderSummary.subTotalAmount)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>DELIVERY</span>
//                 <span className="font-semibold">{formatRupiah(orderSummary.deliveryFee)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>TAXES (10%)</span>
//                 <span className="font-semibold">{formatRupiah(orderSummary.taxesAmount)}</span>
//               </div>
//               <div className="flex justify-between text-red-600">
//                 <span>DISCOUNT</span>
//                 <span className="font-semibold">-{formatRupiah(orderSummary.couponDiscount)}</span>
//               </div>
//               <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2 text-gray-800">
//                 <span>TOTAL</span>
//                 <span>{formatRupiah(orderSummary.totalAmount)}</span>
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
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ShoppingCart, Bell } from "lucide-react"; // Diganti dengan Font Awesome
import { useCart } from "./CartContext"; // Path relatif yang benar jika CartContext.jsx ada di src/


export default function OrderInformation() {
  const { cartItems, clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  // Mengambil orderSummary dari state navigasi. Jika tidak ada, fallback ke recalculation.
  const [orderSummary, setOrderSummary] = useState(location.state || null);
  const [showReceiptModal, setShowReceiptModal] = useState(false); // State untuk mengontrol visibilitas modal

  useEffect(() => {
    console.log("OrderInformation mounted/updated. Current location.state:", location.state);
    console.log("Current cartItems from context:", cartItems);

    // Jika orderSummary tidak ada di location.state atau itemnya kosong, coba re-calculate dari cartItems
    if (!location.state || !location.state.items || location.state.items.length === 0) {
      if (cartItems.length > 0) {
        const subTotalAmount = cartItems.reduce(
          (acc, item) => acc + (item.price * item.quantity),
          0
        );
        const deliveryFee = 0; // Sesuaikan jika ada logika deliveryFee di CartContext
        const taxesRate = 0.1;
        const taxesAmount = subTotalAmount * taxesRate;
        const couponDiscount = 0; // Jika tidak ada dari state, anggap 0

        const totalAmount = subTotalAmount + deliveryFee + taxesAmount - couponDiscount;

        setOrderSummary({
          totalItems: cartItems.length,
          subTotalAmount,
          deliveryFee,
          taxesAmount,
          couponDiscount,
          totalAmount,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            sugarLevel: item.sugarLevel,
            image: item.image,
            subtotal: item.price * item.quantity
          })),
          customerName: "Guest", // Default jika tidak ada nama dari navigasi state
          orderId: `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Dummy Order ID
          receipt_id: `INV-TM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` // Dummy Invoice
        });
        console.log("OrderSummary recalculated from cartItems:", {
          totalItems: cartItems.length,
          subTotalAmount,
          deliveryFee,
          taxesAmount,
          couponDiscount,
          totalAmount,
          items: cartItems
        });
      } else {
        // Jika tidak ada data di location.state dan keranjang juga kosong
        console.log("Tidak ada informasi pesanan yang bisa ditampilkan. Keranjang kosong atau halaman diakses langsung tanpa data. Mengarahkan ke halaman Menu.");
        navigate('/MenuUser', { replace: true });
      }
    }
  }, [cartItems, location.state, navigate]);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleReceiptButtonClick = () => {
    setShowReceiptModal(true); // Tampilkan modal saat tombol "Receipt" diklik
  };

  // Fungsi placeholder untuk download receipt
  const handleDownloadReceipt = () => {
    // Implementasi logika download receipt di sini
    console.log("Downloading receipt...");
    // Contoh: Anda bisa membuat PDF atau gambar dari konten modal
    Swal.fire('Informasi', 'Fungsi download receipt akan ditambahkan di sini.', 'info');
    // Setelah download, Anda bisa memilih untuk menutup modal atau tidak
    // setShowReceiptModal(false);
  };

  if (!orderSummary || !orderSummary.items || orderSummary.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 font-sans flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-700 mb-4">Memuat informasi pesanan...</h1>
        <p className="text-gray-500 mb-6">Jika tidak muncul, keranjang mungkin kosong atau ada masalah data.</p>
        <Link to="/MenuUser" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-colors">
          Kembali ke Menu
        </Link>
      </div>
    );
  }

  // Mengambil data dari orderSummary (yang bisa dari location.state atau recalculated)
  const currentOrderSummary = orderSummary;
  const customerName = currentOrderSummary.customerName || "Customer"; // Menggunakan nama dari state navigasi atau default
  const orderDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const invoiceNumber = currentOrderSummary.receipt_id || `INV-TM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans flex flex-col">
      {/* Navbar Section */}
      <nav className="bg-white shadow-lg py-4 px-8 sticky top-0 z-50">
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <div className="flex items-center gap-3">
            <img src="/img/Logo.png" alt="Logo" className="h-10" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/FF7F50/FFFFFF?text=Logo'; }} />
            <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
              TOMORO{" "}
              <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">
                COFFEE
              </span>
            </h1>
          </div>

          <nav className="flex gap-8 text-sm font-medium text-gray-700">
            <Link to="/HomeUser" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link to="/MenuUser" className="hover:text-orange-500 transition-colors">
              Menu
            </Link>
            <Link to="/location" className="hover:text-orange-500 transition-colors">
              Location
            </Link>
            <Link to="/faq" className="hover:text-orange-500 transition-colors">
              FAQ
            </Link>
            <Link to="/feedback" className="hover:text-orange-500 transition-colors">
              Feedback
            </Link>
            <Link to="/profile" className="hover:text-orange-500 transition-colors">
              Story
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/CartUser" className="text-orange-500 hover:text-orange-600 relative">
              <i className="fas fa-shopping-cart w-5 h-5"></i> {/* Font Awesome Cart Icon */}
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>
              )}
            </Link>
            <Link
              to="/NotificationUser"
              className="text-orange-500 hover:text-orange-600"
            >
              <i className="fas fa-bell w-5 h-5"></i> {/* Font Awesome Bell Icon */}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Your Orders
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details (Left/Main Column) */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {/* Header Table */}
            <div className="grid grid-cols-6 gap-4 text-gray-600 font-semibold border-b pb-3 mb-4 text-center">
              <div className="col-span-2 text-left">Product</div>
              <div>Harga</div>
              <div>Quantity</div>
              <div className="text-center">Subtotal</div>
              <div></div>
            </div>

            {/* List of Items */}
            {currentOrderSummary.items.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="grid grid-cols-6 gap-4 items-center py-4 border-b last:border-b-0"
              >
                <div className="col-span-2 flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md border border-gray-200"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/E8DED1/333333?text=Produk"; }}
                  />
                  <span className="text-gray-800 font-medium">{item.name}</span>
                </div>
                <div className="text-center text-gray-700">
                  {formatRupiah(item.price)}
                </div>
                <div className="text-center text-gray-800">
                  {item.quantity}
                </div>
                <div className="text-center text-gray-800 font-medium">
                  {formatRupiah(item.subtotal)}
                </div>
                <div></div>
              </motion.div>
            ))}

            <div className="mt-6 flex justify-between items-center text-gray-700 text-sm">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <span className="text-blue-600 font-bold">Processing</span> {/* Bisa diubah dinamis dari data order */}
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Estimate Time:</span>
                    <span className="text-green-600 font-bold">30 Min</span> {/* Bisa diubah dinamis */}
                </div>
            </div>
          </div>

          {/* Order Summary (Right Column) */}
          <div className="lg:col-span-1 w-full bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{currentOrderSummary.items.length}</span> {/* Menggunakan currentOrderSummary.items.length */}
              </div>
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>{formatRupiah(currentOrderSummary.subTotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatRupiah(currentOrderSummary.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Taxes (10%)</span>
                <span>{formatRupiah(currentOrderSummary.taxesAmount)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>-{formatRupiah(currentOrderSummary.couponDiscount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                <span>TOTAL</span>
                <span>{formatRupiah(currentOrderSummary.totalAmount)}</span>
              </div>
            </div>
            {/* Tombol Receipt di bagian bawah Order Summary */}
            <button
              onClick={handleReceiptButtonClick} // Membuka modal
              className="mt-8 w-full block text-center bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Receipt
            </button>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative mt-20 w-full text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://placehold.co/1920x400/333333/FFFFFF?text=Footer+Background')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://placehold.co/40x40/FF7F50/FFFFFF?text=Logo" alt="Logo" className="h-10" />
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
            {/* Close button */}
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times-circle h-6 w-6"></i> {/* Font Awesome close icon */}
            </button>

            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/img/Logo.png" alt="Logo" className="h-8 inline-block" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/32x32/FF7F50/FFFFFF?text=Logo'; }} />
                <h2 className="text-2xl font-bold text-orange-600">TOMORO COFFEE</h2>
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
                <span>{orderDate}</span>
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
                <div key={item.id} className="grid grid-cols-4 gap-2 py-2 text-sm text-gray-700">
                  <div className="col-span-1">{item.name}</div>
                  <div className="text-center">{item.quantity}</div>
                  <div className="text-right">{formatRupiah(item.price)}</div>
                  <div className="text-right">{formatRupiah(item.subtotal)}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>SUBTOTAL</span>
                <span className="font-semibold">{formatRupiah(currentOrderSummary.subTotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>DELIVERY</span>
                <span className="font-semibold">{formatRupiah(currentOrderSummary.deliveryFee)}</span>
              </div>
              <div className="flex justify-between">
                <span>TAXES (10%)</span>
                <span className="font-semibold">{formatRupiah(currentOrderSummary.taxesAmount)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>DISCOUNT</span>
                <span className="font-semibold">-{formatRupiah(currentOrderSummary.couponDiscount)}</span>
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
