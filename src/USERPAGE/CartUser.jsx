import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from '../supabase';
import Swal from 'sweetalert2';
import { UserCircle, ShoppingCart, Bell, Trash2, Plus, Minus, X, ChevronRight } from 'lucide-react';
import { useCart } from "./CartContext";

const CartUser = () => {
  const { cartItems, updateQuantity, updateSugarLevel, removeItem } = useCart();
  const navigate = useNavigate();

  const [deliveryOption, setDeliveryOption] = useState("takeAtOutlet");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [showViewOrderButton, setShowViewOrderButton] = useState(false);

  useEffect(() => {
    const checkUncompletedOrders = async () => {
      if (!supabase) return;
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, status')
          .neq('status', 'Completed');

        if (data && data.length > 0) setShowViewOrderButton(true);
        else setShowViewOrderButton(false);
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };
    checkUncompletedOrders();
  }, []);

  const calculateSubtotal = (item) => Number(item.price) * Number(item.quantity);
  const subTotalAmount = cartItems.reduce((acc, item) => acc + calculateSubtotal(item), 0);
  const taxesRate = 0.1;
  const taxesAmount = subTotalAmount * taxesRate;
  const totalAmount = subTotalAmount + taxesAmount - couponDiscount;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "BINGXUE10") {
      setCouponDiscount(subTotalAmount * 0.1);
      setCouponMessage("Kupon berhasil diterapkan!");
    } else {
      setCouponDiscount(0);
      setCouponMessage("Kupon tidak valid.");
    }
  };

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const handleProceedToCheckout = async () => {
    if (!customerName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Nama Pelanggan wajib diisi.',
        confirmButtonColor: '#2563eb'
      });
      return;
    }
    // ... logic checkout Anda
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      {/* Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/HomeUser" className="flex items-center gap-2">
            <img src="src/assets/img\Logo buah segar _Freshly Cut_.png" alt="Logo" className="h-12" />
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
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cartItems.length}</span>
              )}
            </Link>
            <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
            <Link to="/NotificationUser" className="relative p-2 text-gray-600"><Bell size={22} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-black text-blue-900 mb-12 uppercase italic tracking-tighter">
          Shopping Bag
        </h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <div className="p-20 text-center bg-gray-50 rounded-[40px]">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-400 font-black uppercase italic tracking-widest">Cart is empty.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-gray-100 rounded-[30px] p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <img src={item.image} className="w-24 h-24 object-cover rounded-2xl" alt={item.name} />
                    <div>
                      <h3 className="text-lg font-black text-blue-900 uppercase italic tracking-tighter">{item.name}</h3>
                      <p className="text-blue-600 font-bold">{formatRupiah(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-2 bg-white rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Minus size={14}/></button>
                      <span className="w-8 text-center font-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-2 bg-white rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Plus size={14}/></button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Right Column: Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-blue-900 rounded-[40px] p-8 text-white sticky top-28">
              <h2 className="text-2xl font-black mb-8 uppercase italic tracking-tighter border-b border-blue-800 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8 font-medium">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(subTotalAmount)}</span></div>
                <div className="flex justify-between"><span>Tax (10%)</span><span>{formatRupiah(taxesAmount)}</span></div>
                {couponDiscount > 0 && <div className="flex justify-between text-orange-500 font-bold"><span>Discount</span><span>-{formatRupiah(couponDiscount)}</span></div>}
                <div className="flex justify-between text-xl font-black pt-4 border-t border-blue-800">
                  <span>TOTAL</span>
                  <span className="text-orange-500">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              <input
                type="text"
                placeholder="NAMA PELANGGAN"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-blue-800 border-none rounded-2xl py-4 px-4 text-sm font-bold placeholder:text-blue-500 mb-4 focus:ring-2 focus:ring-orange-500"
              />

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl text-lg font-black shadow-lg shadow-orange-900/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest"
              >
                Checkout Now <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer minimalis seperti HomeUser */}
      <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-gray-100 pb-16 mb-8">
          <div>
            <img src="src/assets/img\Logo buah segar _Freshly Cut_.png" alt="Logo" className="h-16 mb-6" />
            <p className="text-gray-400 text-sm font-medium italic">Empowering everyone to enjoy a high-quality cup of coffee. Freshness guaranteed.</p>
          </div>
          <div>
            <h4 className="font-black text-blue-900 mb-6 uppercase tracking-widest text-xs italic">Explore</h4>
            <ul className="space-y-3 text-sm font-bold text-gray-500 uppercase tracking-tighter">
              <li><Link to="/HomeUser" className="hover:text-orange-600 transition-colors">Home</Link></li>
              <li><Link to="/MenuUser" className="hover:text-orange-600 transition-colors">Our Menu</Link></li>
              <li><Link to="/StoryUser" className="hover:text-orange-600 transition-colors">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-blue-900 mb-6 uppercase tracking-widest text-xs italic">Support</h4>
            <ul className="space-y-3 text-sm font-bold text-gray-500 uppercase tracking-tighter">
              <li><Link to="/FAQUser" className="hover:text-orange-600 transition-colors">General FAQ</Link></li>
              <li><Link to="/FeedbackUser" className="hover:text-orange-600 transition-colors">Feedback</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-blue-900 mb-6 uppercase tracking-widest text-xs italic">Social</h4>
            <div className="flex gap-4">
              {["instagram", "tiktok", "facebook"].map((social) => (
                <a key={social} href="#" className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] font-black text-black-300 uppercase tracking-[0.5em]">&copy; 2026 FRESHLY CUT - ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
};

export default CartUser;