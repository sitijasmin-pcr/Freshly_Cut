import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom"; // Pastikan useLocation di-import
import { Bell, ShoppingCart, UserCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";
import { supabase } from "../supabase";
import { AuthContext } from "../App";

import logo from "../assets/FreshlyLogo.png";

const NotificationUser = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const { userEmail } = useContext(AuthContext);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data Pesanan
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userEmail) return;

      const { data: userData } = await supabase
        .from("users")
        .select("nama")
        .eq("email", userEmail)
        .single();

      if (userData) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_name", userData.nama)
          .order("created_at", { ascending: false });
        
        if (orderData) setOrders(orderData);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [userEmail]);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* HEADER BARU */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/HomeUser" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12" />
            <div className="hidden sm:block">
              <span className="text-xl font-black text-orange-600 block leading-none">FRESHLY CUT</span>
              <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Makan Sehat, Tinggal Hap!</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex gap-10">
            {["Home", "Menu", "Story", "FAQ", "Feedback"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/HomeUser" : `/${item}User`}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-orange-600 ${
                  location.pathname.includes(item) ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-500"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link to="/ProfileUser" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600"><UserCircle size={22} /></Link>
            <Link to="/CartUser" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600 relative">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cartItems.length}</span>}
            </Link>
            <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
            <Link to="/NotificationUser" className="relative p-2 text-gray-600"><Bell size={22} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative py-20 bg-[#F0F9FF]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-black text-green-900 uppercase italic leading-none mb-6">
            Order <span className="text-orange-600">Notifications</span>
          </h1>
        </div>
      </section>

      {/* CONTENT NOTIFIKASI */}
      <main className="max-w-3xl mx-auto px-6 py-20">
        {loading ? (
            <p className="text-center font-bold text-gray-400">Memuat notifikasi...</p>
        ) : orders.length === 0 ? (
            <div className="text-center text-gray-400 font-black uppercase py-20">Belum ada pesanan</div>
        ) : (
            <AnimatePresence>
            {orders.map((order) => {
                const isPending = order.status === "Pending";
                const isCompleted = order.status === "Completed";
                return (
                    <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white border-l-8 ${isPending ? "border-orange-500" : isCompleted ? "border-green-500" : "border-red-500"} rounded-[2rem] shadow-sm p-8 mb-6 flex justify-between items-center`}
                    >
                        <div>
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${isPending ? "bg-orange-50 text-orange-600" : isCompleted ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                                {isPending ? "Menunggu Pembayaran" : isCompleted ? "Pembayaran Berhasil" : "Dibatalkan"}
                            </span>
                            <h3 className="text-xl font-black italic text-green-900 mt-3">Pesanan #{order.receipt_id}</h3>
                            <p className="text-gray-600 text-sm mt-2">Total: Rp {order.total_amount?.toLocaleString("id-ID")}</p>
                            
                            {isPending && (
                                <Link to={`/order-information/${order.id}`} className="inline-block mt-4 bg-orange-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase">Bayar Sekarang</Link>
                            )}
                        </div>
                        {isPending ? <Clock className="text-orange-500" size={32}/> : isCompleted ? <CheckCircle className="text-green-500" size={32}/> : <XCircle className="text-red-500" size={32}/>}
                    </motion.div>
                );
            })}
            </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default NotificationUser;