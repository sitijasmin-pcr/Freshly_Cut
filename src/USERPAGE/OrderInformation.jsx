import React, { useState, useEffect, useCallback } from "react";



import { Link, useNavigate } from "react-router-dom";



import { motion, AnimatePresence } from "framer-motion";



import { ShoppingCart } from "lucide-react";



import { useCart } from "./CartContext";



import { supabase } from "../supabase";



import Swal from 'sweetalert2';







export default function OrderInformation() {



  const { cartItems, clearCart } = useCart();



  const navigate = useNavigate();







  const [orderSummary, setOrderSummary] = useState(() => {



    try {



      const storedOrder = sessionStorage.getItem("lastOrderSummary");



      return storedOrder ? JSON.parse(storedOrder) : null;



    } catch (error) {



      console.error("Error parsing stored order summary from sessionStorage:", error);



      return null;



    }



  });







  const [currentOrderStatus, setCurrentOrderStatus] = useState(



    orderSummary?.status || "Unknown"



  );



  const [showReceiptModal, setShowReceiptModal] = useState(false);







  // Define order tracking steps



  const orderSteps = ["Pending", "Accepted", "Processing", "On the Way", "Completed", "Canceled"]; // Added Canceled as a possible final status







  // Function to determine the active step index



  const getActiveStepIndex = useCallback(() => {



    const statusMap = {



      "Pending": 0,



      "Accepted": 1,



      "Processing": 2,



      "On the Way": 3,



      "Completed": 4,



      "Canceled": 5,



      "Unknown": -1 // For initial state or no order



    };



    return statusMap[currentOrderStatus] !== undefined ? statusMap[currentOrderStatus] : -1;



  }, [currentOrderStatus]);







  const formatRupiah = useCallback((amount) => {



    if (typeof amount !== "number" || isNaN(amount)) {



      return "Rp 0";



    }



    return new Intl.NumberFormat("id-ID", {



      style: "currency",



      currency: "IDR",



      minimumFractionDigits: 0,



      maximumFractionDigits: 0,



    }).format(amount);



  }, []);







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



              Swal.fire({



                toast: true,



                position: 'top-end',



                showConfirmButton: false,



                timer: 3000,



                timerProgressBar: true,



                icon: 'info',



                title: `Status pesanan diperbarui menjadi: ${newStatus}`



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



  }, [orderSummary?.orderId, orderSummary?.status, orderSummary, cartItems]);







  const handleReceiptButtonClick = () => {



    setShowReceiptModal(true);



  };







  const handleDownloadReceipt = () => {



    console.log("Downloading receipt...");



    Swal.fire({



      icon: 'info',



      title: 'Fungsi Akan Datang',



      text: 'Fitur download struk akan segera hadir!',



      confirmButtonText: 'Oke'



    });



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







  if (!orderSummary || !Array.isArray(orderSummary.items) || orderSummary.items.length === 0) {



    return (



      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans flex flex-col">



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



              <Link to="/HomeUser" className="hover:text-orange-500 transition-colors">Home</Link>



              <Link to="/MenuUser" className="hover:text-orange-500 transition-colors">Menu</Link>



              <Link to="/lokasi" className="hover:text-orange-500 transition-colors">Location</Link>



              <Link to="/FAQUser" className="hover:text-orange-500 transition-colors">FAQ</Link>



              <Link to="/FeedbackUser" className="hover:text-orange-500 transition-colors">Feedback</Link>



              <Link to="/ProfInfo" className="hover:text-orange-500 transition-colors">Story</Link>



            </nav>



            <div className="flex items-center gap-4">



              <Link to="/CartUser" className="text-orange-500 hover:text-orange-600 relative">



                <ShoppingCart className="w-5 h-5" />



                {cartItems.length > 0 && (



                  <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>



                )}



              </Link>



              <Link to="/NotificationUser" className="text-orange-500 hover:text-orange-600">



                <i className="fas fa-bell w-5 h-5"></i>



              </Link>



            </div>



          </div>



        </nav>



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



        <footer className="relative mt-20 w-full text-white">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/image 48.png')" }}
        ></div>

        {/* Overlay gradasi gelap transparan */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
          {/* Left - Logo & Location */}
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

          {/* Right - Social Media */}
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

        {/* Copyright */}
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



      "id-ID",



      { year: "numeric", month: "2-digit", day: "2-digit" }



    ) +



    " " +



    new Date(currentOrderSummary.createdAt || Date.now()).toLocaleTimeString(



      "id-ID",



      { hour: "2-digit", minute: "2-digit" }



    );



  const invoiceNumber =



    currentOrderSummary.receiptId ||



    `INV-${



      currentOrderSummary.orderId



        ? currentOrderSummary.orderId.substring(0, 8).toUpperCase()



        : Date.now()



    }`;







  const currentOrderTime = new Date(currentOrderSummary.createdAt || Date.now());







  return (



    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans flex flex-col">



      {/* Navbar Section */}



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



            <Link to="/HomeUser" className="hover:text-orange-500 transition-colors">Home</Link>



            <Link to="/MenuUser" className="hover:text-orange-500 transition-colors">Menu</Link>



            <Link to="/lokasi" className="hover:text-orange-500 transition-colors">Location</Link>



            <Link to="/FAQUser" className="hover:text-orange-500 transition-colors">FAQ</Link>



            <Link to="/FeedbackUser" className="hover:text-orange-500 transition-colors">Feedback</Link>



            <Link to="/ProfInfo" className="hover:text-orange-500 transition-colors">Story</Link>



          </nav>



          <div className="flex items-center gap-4">



            <Link to="/CartUser" className="text-orange-500 hover:text-orange-600 relative">



              <ShoppingCart className="w-5 h-5" />



              {cartItems.length > 0 && (



                <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>



              )}



            </Link>



            <Link to="/NotificationUser" className="text-orange-500 hover:text-orange-600">



              <i className="fas fa-bell w-5 h-5"></i>



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



          {/* Order Tracking Section (New) */}



          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6 mb-8">



            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Status</h2>



            <p className="text-gray-600 mb-6">Order ID: {orderSummary?.orderId || "N/A"}</p>







            <div className="flex justify-between items-start relative pb-8">



              {orderSteps.map((step, index) => {



                const isActive = index === getActiveStepIndex();



                const isCompleted = index < getActiveStepIndex();



                const isCanceled = currentOrderStatus === "Canceled" && index > getActiveStepIndex();







                let circleClass = "bg-gray-300 text-gray-600";



                let textClass = "text-gray-500";



                let lineClass = "bg-gray-300";



                let icon = <i className="far fa-circle"></i>; // Default icon







                if (isCompleted) {



                  circleClass = "bg-green-500 text-white";



                  textClass = "text-green-700 font-semibold";



                  lineClass = "bg-green-500";



                  icon = <i className="fas fa-check-circle"></i>;



                } else if (isActive) {



                  if (currentOrderStatus === "Canceled") {



                    circleClass = "bg-red-500 text-white";



                    textClass = "text-red-700 font-semibold";



                    icon = <i className="fas fa-times-circle"></i>; // X icon for canceled



                  } else {



                    circleClass = "bg-orange-500 text-white";



                    textClass = "text-orange-700 font-semibold";



                    icon = <i className="fas fa-clock"></i>; // Clock icon for active



                  }



                }







                // Special handling for the line between steps



                if (index > 0) {



                  const prevIsCompleted = (index - 1) < getActiveStepIndex();



                  const prevIsCanceled = currentOrderStatus === "Canceled" && (index - 1) === getActiveStepIndex();



                  if (prevIsCompleted && !isCanceled) {



                    lineClass = "bg-green-500";



                  } else if (prevIsCanceled && index === getActiveStepIndex() && currentOrderStatus === "Canceled") {



                    lineClass = "bg-red-500"; // Line to red status



                  } else if (index <= getActiveStepIndex()) { // For active step, make line active color



                     if (currentOrderStatus === "Canceled") {



                        lineClass = "bg-red-500";



                     } else {



                        lineClass = "bg-orange-500";



                     }



                  } else {



                    lineClass = "bg-gray-300";



                  }



                }







                const calculateStepTime = (baseTime, stepIndex) => {



                  if (!baseTime) return "N/A";



                  // Simple estimation for demo purposes (adjust as needed)



                  let minutesToAdd = 0;



                  if (stepIndex === 1) minutesToAdd = 5; // Accepted after 5 min



                  if (stepIndex === 2) minutesToAdd = 15; // In Progress after 15 min



                  if (stepIndex === 3) minutesToAdd = 25; // On the Way after 25 min



                  if (stepIndex === 4) minutesToAdd = 30; // Delivered after 30 min (total)







                  const stepDate = new Date(baseTime.getTime() + minutesToAdd * 60 * 1000);



                  return `${stepDate.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })} ${stepDate.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })}`;



                };











                return (



                  <React.Fragment key={step}>



                    <div className="flex-1 flex flex-col items-center relative z-10">



                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-xl transition-all duration-300 ${circleClass}`}>



                        {icon}



                      </div>



                      <span className={`text-xs font-semibold text-center ${textClass}`}>



                        {step.replace(" ", "\n")} {/* Break line for multi-word status */}



                      </span>



                      <span className="text-xs text-gray-500 text-center mt-1">



                        {(isCompleted || isActive || currentOrderStatus === "Canceled") ? calculateStepTime(currentOrderTime, index) : "---"}



                      </span>



                    </div>



                    {index < orderSteps.length - 1 && (



                      <div className={`flex-1 h-1.5 mt-5 transition-all duration-300 ${lineClass}`}></div>



                    )}



                  </React.Fragment>



                );



              })}



            </div>



          </div>







          {/* Order Details (Left/Main Column) */}



          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">



            <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>



            <div className="grid grid-cols-6 gap-4 text-gray-600 font-semibold border-b pb-3 mb-4 text-center">



              <div className="col-span-2 text-left">Product</div>



              <div>Harga</div>



              <div>Quantity</div>



              <div>Kadar Gula</div>



              <div className="text-center">Subtotal</div>



              <div></div>



            </div>







            {currentOrderSummary.items.map((item, index) => (



              <motion.div



                key={item.id || item.name + index}



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



                    onError={(e) => {



                      e.target.onerror = null;



                      e.target.src = "/img/placeholder.png";



                    }}



                  />



                  <span className="text-gray-800 font-medium">{item.name}</span>



                </div>



                <div className="text-center text-gray-700">



                  {formatRupiah(item.price)}



                </div>



                <div className="text-center text-gray-800">{item.quantity}</div>



                <div className="text-center text-gray-800">



                  {item.sugarLevel || "Normal"}



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



                <span



                  className={`font-bold ${



                    currentOrderStatus === "Completed"



                      ? "text-green-600"



                      : currentOrderStatus === "Processing"



                      ? "text-blue-600"



                      : currentOrderStatus === "Pending"



                      ? "text-yellow-600"



                      : currentOrderStatus === "Canceled"



                      ? "text-red-600"



                      : "text-gray-600"



                  }`}



                >



                  {currentOrderStatus}



                </span>



              </div>



              <div className="flex items-center gap-2">



                <span className="font-semibold">Estimate Time:</span>



                <span className="text-green-600 font-bold">30 Min</span>



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



                <span>{currentOrderSummary.items.length}</span>



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



            <button



              onClick={handleReceiptButtonClick}



              className="mt-8 w-full block text-center bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"



            >



              Receipt



            </button>



            <button



              onClick={handleOrderDone}



              className="mt-4 w-full block text-center bg-green-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"



            >



              Done (Pesanan Selesai)



            </button>



          </div>



        </div>



      </div>







      {/* Footer Section */}



      <footer className="relative mt-20 w-full text-white">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/image 48.png')" }}
        ></div>

        {/* Overlay gradasi gelap transparan */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
          {/* Left - Logo & Location */}
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

          {/* Right - Social Media */}
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

        {/* Copyright */}
        <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
          Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
        </div>
      </footer>







      {/* Receipt Modal */}



      <AnimatePresence>



        {showReceiptModal && (



          <motion.div



            initial={{ opacity: 0 }}



            animate={{ opacity: 1 }}



            exit={{ opacity: 0 }}



            transition={{ duration: 0.2 }}



            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"



          >



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



                    src="/img/Logo.png"



                    alt="Logo"



                    className="h-8 inline-block"



                  />



                  <h2 className="text-2xl font-bold text-orange-600">



                    TOMORO COFFEE



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



                {currentOrderSummary.items.map((item, index) => (



                  <div



                    key={item.id || item.name + index}



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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}