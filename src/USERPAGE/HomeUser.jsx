import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Bell,
  UserCircle,
  ChevronRight,
  ChevronLeft,
  Star,
  Loader2,
  Plus,
} from "lucide-react";
// --- IMPORT SUPABASE & CART CONTEXT ---
import { supabase } from "../supabase";
import { useCart } from "./CartContext";

import logo from "../assets/FreshlyLogo.png";
import hero from "../assets/img/image 15.png";

const FadeInOnScroll = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function HomeUser() {
  const location = useLocation();
  const { addToCart, cartItems } = useCart();
  const [locationIndex, setLocationIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItemId, setAddedItemId] = useState(null);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: produkData, error: produkError } = await supabase
          .from("produk")
          .select("*")
          .limit(4); // Diambil 4 agar pas dengan grid MenuUser
        const { data: outletData, error: outletError } = await supabase
          .from("outlet")
          .select("*");

        if (produkError) throw produkError;
        if (outletError) throw outletError;

        setProducts(produkData || []);
        setOutlets(outletData || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNextLoc = () => setLocationIndex((prev) => (prev + 1) % outlets.length);
  const handlePrevLoc = () => setLocationIndex((prev) => (prev - 1 + outlets.length) % outlets.length);

  return (
    <div className="font-sans text-gray-900 bg-white selection:bg-green-100">
      {/* --- NAVBAR --- */}
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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#F0F9FF]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <span className="inline-block px-4 py-1 bg-green-600 text-white text-xs font-black rounded-full mb-4 tracking-widest uppercase italic">New Sensations</span>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-6 text-green-900">FRESH <br /> <span className="text-orange-600 italic uppercase">Happiness.</span></h1>
            <p className="text-lg text-green-800/70 mb-8 max-w-md font-medium">Nikmati kesegaran kopi pilihan dari biji terbaik, diseduh khusus untuk menemani setiap langkah produktifmu.</p>
            <Link to="/MenuUser" className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-5 rounded-full font-black hover:bg-green-700 transition-all shadow-xl shadow-green-200 uppercase tracking-widest">Check Our Menu <ChevronRight size={20} /></Link>
          </motion.div>
          <motion.div className="relative" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
            <div className="absolute inset-0 bg-green-400/20 rounded-full blur-[120px]"></div>
            <img src={hero} alt="Hero" className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl animate-float" />
          </motion.div>
        </div>
      </section>

      {/* --- RECOMMENDED SECTION (Updated to MenuUser Card Style) --- */}
      <section className="py-24 px-6 bg-[#F0F7FF]">
        <FadeInOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-green-900 mb-4 uppercase tracking-tighter italic">Recommended For You</h2>
            <div className="h-1.5 w-24 bg-orange-500 mx-auto rounded-full"></div>
          </div>
        </FadeInOnScroll>
        
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
              <p className="font-black italic text-green-900 uppercase">Fetching freshness...</p>
            </div>
          ) : (
            products.map((item, index) => (
              <FadeInOnScroll key={item.id} delay={index * 0.1}>
                <div className="group bg-white rounded-[2rem] border-b-8 border-green-100 hover:border-green-500 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-2xl flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative h-48 md:h-64 bg-[#F8FBFF] flex items-center justify-center p-6 overflow-hidden">
                    <div className="absolute w-full h-full bg-green-100/30 rounded-full scale-0 group-hover:scale-125 transition-transform duration-700"></div>
                    <img 
                      src={item.gambar || "/img/default-product.png"} 
                      alt={item.nama}
                      className="h-full object-contain z-10 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-green-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                        {item.kategori}
                      </span>
                    </div>
                  </div>
                  
                  {/* Info Container */}
                  <div className="p-5 text-center flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base md:text-xl font-black text-green-900 uppercase italic leading-none mb-2 line-clamp-2">
                        {item.nama}
                      </h3>
                      <p className="text-orange-500 font-black text-lg md:text-2xl mb-4 tracking-tighter">
                        Rp {item.harga?.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                        addedItemId === item.id
                          ? "bg-green-500 text-white"
                          : "bg-green-600 hover:bg-green-500 text-white"
                      }`}
                    >
                      {addedItemId === item.id ? "ADDED! ✓" : <><Plus size={16} strokeWidth={3} /> ORDER NOW</>}
                    </button>
                  </div>
                </div>
              </FadeInOnScroll>
            ))
          )}
        </div>
      </section>

      {/* --- LOCATION SECTION --- */}
      <section className="bg-green-900 py-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center text-white">
          <div>
            <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter italic leading-tight">Visit Our <br /> <span className="text-orange-500 underline underline-offset-8">Offline Stores</span></h2>
            <p className="text-green-200 mb-10 font-medium">Temukan outlet terdekat kami dan nikmati suasana Tomoro yang estetik dan nyaman untuk bersantai.</p>
            <div className="flex gap-4">
              <button onClick={handlePrevLoc} className="p-4 rounded-full border border-white/20 hover:bg-white hover:text-green-900 transition-all"><ChevronLeft /></button>
              <button onClick={handleNextLoc} className="p-4 rounded-full bg-orange-500 hover:bg-orange-600 transition-all shadow-lg"><ChevronRight /></button>
            </div>
          </div>
          <div className="relative h-[450px]">
            {outlets.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div key={locationIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="absolute inset-0 bg-white rounded-[50px] p-6 shadow-2xl flex flex-col sm:flex-row gap-6 items-center border-b-8 border-orange-500">
                  <img src={outlets[locationIndex].image_url || "/img/default-store.png"} className="w-full sm:w-1/2 h-full object-cover rounded-[40px]" alt="Store" />
                  <div className="p-4 text-green-900">
                    <div className="flex gap-1 text-orange-500 mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}</div>
                    <h3 className="text-2xl font-black mb-3 uppercase italic tracking-tighter">{outlets[locationIndex].name}</h3>
                    <button onClick={() => window.open(outlets[locationIndex].maps_url, "_blank")} className="w-full py-4 bg-green-900 text-white rounded-2xl font-black tracking-widest hover:bg-orange-500 transition-all uppercase text-xs">Get Directions</button>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : <div className="text-white text-center italic font-bold">No outlets found.</div>}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-gray-100 pb-16 mb-8">
          <div>
            <img src={logo} alt="Logo" className="h-16 mb-6" />
            <p className="text-gray-400 text-sm font-medium italic">Empowering everyone to enjoy a high-quality cup of coffee. Freshness guaranteed.</p>
          </div>
          <div>
            <h4 className="font-black text-green-900 mb-6 uppercase tracking-widest text-xs italic">Explore</h4>
            <ul className="space-y-3 text-sm font-bold text-gray-500 uppercase tracking-tighter">
              <li><Link to="/HomeUser" className="hover:text-orange-600 transition-colors">Home</Link></li>
              <li><Link to="/MenuUser" className="hover:text-orange-600 transition-colors">Our Menu</Link></li>
              <li><Link to="/StoryUser" className="hover:text-orange-600 transition-colors">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-green-900 mb-6 uppercase tracking-widest text-xs italic">Support</h4>
            <ul className="space-y-3 text-sm font-bold text-gray-500 uppercase tracking-tighter">
              <li><Link to="/FAQUser" className="hover:text-orange-600 transition-colors">General FAQ</Link></li>
              <li><Link to="/FeedbackUser" className="hover:text-orange-600 transition-colors">Feedback</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-green-900 mb-6 uppercase tracking-widest text-xs italic">Social</h4>
            <div className="flex gap-4">
              {["instagram", "tiktok", "facebook"].map((social) => (
                <a key={social} href="#" className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-green-600 hover:text-white transition-all shadow-sm">
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
}