import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Bell, 
  ShoppingCart, 
  UserCircle, 
  MapPin, 
  MessageSquareText, 
  ChevronRight,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext"; // Pastikan path ini benar

const NotificationUser = () => {
  const location = useLocation();
  const { cartItems } = useCart();

  const initialNotifications = [
    { id: 1, type: "DISCOUNT", title: "Selamat! Voucher 20% Menanti", description: "Voucher diskon khusus untuk kategori Snacks. Berlaku hingga akhir bulan.", date: "24 Jun 2025", color: "border-orange-500" },
    { id: 2, type: "PROMOTION", title: "Cepat Gunakan Voucher Anda!", description: "Voucher 10% Coffee akan hangus segera. Jangan sampai terlewat.", date: "9 Apr 2025", color: "border-red-500" },
    { id: 3, type: "NEW PRODUCT", title: "KopiMint Coffee Telah Hadir", description: "Rasakan sensasi baru dengan diskon 10% pada 2 jam pertama perilisan.", date: "9 Apr 2025", color: "border-green-500" },
    { id: 4, type: "BIRTHDAY", title: "Special Gift untuk Anda", description: "Karena hari ini spesial, nikmati diskon 15% untuk semua produk kami.", date: "9 Apr 2025", color: "border-pink-500" },
  ];

  const [visibleNotifications, setVisibleNotifications] = useState(initialNotifications.map(n => n.id));

  const handleClaim = (id) => {
    setVisibleNotifications(prev => prev.filter(nId => nId !== id));
  };

  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-blue-100 min-h-screen">
      {/* --- NAVBAR --- */}
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

      {/* --- HERO SECTION --- */}
      <section className="py-20 bg-[#F0F9FF]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 bg-blue-600 text-white text-xs font-black rounded-full mb-4 tracking-widest uppercase italic">Updates & Offers</span>
          <h1 className="text-5xl md:text-6xl font-black italic text-blue-900 mb-6 uppercase tracking-tighter">
            Notifications
          </h1>
          <p className="text-blue-800/70 font-medium italic">
            Stay updated with our latest offers, news, and special rewards just for you.
          </p>
        </div>
      </section>

      {/* --- NOTIFICATION AREA --- */}
      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="space-y-6">
          <AnimatePresence>
            {initialNotifications.filter(n => visibleNotifications.includes(n.id)).length === 0 ? (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20 text-gray-400 font-black uppercase tracking-widest">
                    No new notifications
                </motion.div>
            ) : (
                initialNotifications.filter(n => visibleNotifications.includes(n.id)).map((n) => (
                <motion.div
                    key={n.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className={`bg-white p-8 rounded-[30px] border-l-8 ${n.color} shadow-lg shadow-gray-100 flex justify-between items-start hover:shadow-xl transition-shadow`}
                >
                    <div>
                    <span className="text-[10px] font-black tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1 rounded-full">
                        {n.type}
                    </span>
                    <h3 className="text-xl font-black mt-3 mb-2 text-blue-900 italic tracking-tight">{n.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-md">{n.description}</p>
                    <button 
                        onClick={() => handleClaim(n.id)} 
                        className="text-xs font-black uppercase tracking-widest bg-blue-900 text-white px-8 py-3 rounded-2xl hover:bg-orange-600 transition-all active:scale-95"
                    >
                        Claim Now
                    </button>
                    </div>
                    <div className="text-right text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {n.date}
                    </div>
                </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-gray-100 pb-16 mb-8">
          <div>
            <img src="/img/Logo.png" alt="Logo" className="h-16 mb-6" />
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
              {['instagram', 'tiktok', 'facebook'].map(social => (
                <a key={social} href="#" className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm">
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-[0.5em]">
          &copy; 2026 PT KOPI BINTANG INDONESIA - ALL RIGHTS RESERVED
        </p>
      </footer>

      {/* Floating Chat */}
      <Link to="/ChatUser" className="fixed bottom-8 right-8 bg-orange-500 text-white w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-2 z-50 animate-bounce group">
        <MessageSquareText size={28} className="group-hover:rotate-12 transition-transform" />
      </Link>
    </div>
  );
};

export default NotificationUser;