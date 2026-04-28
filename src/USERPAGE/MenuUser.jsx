import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  ShoppingCart, 
  UserCircle, 
  Search, 
  Plus, 
  Bell,
  ChevronRight
} from "lucide-react";
// Import Supabase & Context
import { supabase } from "../supabase";
import { useCart } from "./CartContext";

export default function MenuUser() {
  const { addToCart, cartItems } = useCart();
  const location = useLocation();
  
  // States
  const [allMenus, setAllMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedItemId, setAddedItemId] = useState(null);
  
  const categories = ["All", "Dessert", "Buah Potong 250gr", "Buah Potong 500gr"];

  // Fetch Data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from("produk").select("*");
        if (!error) setAllMenus(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // Filter Logic
  const filteredMenu = useMemo(() => {
    return allMenus.filter((item) => {
      const matchesCat = selectedCategory === "All" || item.kategori === selectedCategory;
      const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [allMenus, selectedCategory, searchQuery]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1000);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      {/* --- NAVBAR (Sesuai HomeUser) --- */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/HomeUser" className="flex items-center gap-2">
            <img src="src/assets/img/Logo buah segar _Freshly Cut_.png" alt="Logo" className="h-12" />
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
      <section className="relative py-20 overflow-hidden bg-[#F0F9FF]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-4 py-1 bg-green-600 text-white text-xs font-black rounded-full mb-4 tracking-widest uppercase italic">
              Our Full Menu
            </span>
            <h1 className="text-6xl md:text-7xl font-black leading-[0.9] mb-6 text-green-900">
              EXPLORE <br /> <span className="text-orange-600 italic uppercase">OUR TASTE.</span>
            </h1>
            <p className="text-lg text-green-800/70 mb-8 max-w-md font-medium">
              Temukan berbagai pilihan menu terbaik kami yang siap menyegarkan harimu kapan saja.
            </p>
          </motion.div>
          
          <div className="w-full max-w-md relative">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-5 px-8 rounded-full border-none shadow-xl shadow-blue-100 font-bold text-lg focus:ring-4 focus:ring-green-400 outline-none transition-all"
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-green-600" />
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-[100px]"></div>
      </section>

      {/* --- CATEGORY NAVIGATION --- */}
      <nav className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white p-2 rounded-full shadow-xl flex justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar border border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-transparent text-gray-400 hover:text-green-600 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* --- PRODUCT GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-[2rem] border-b-8 border-green-100 hover:border-green-500 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-2xl flex flex-col h-full"
              >
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredMenu.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] mt-10 border-2 border-dashed border-gray-200">
            <div className="text-8xl mb-4 opacity-20">☕</div>
            <h3 className="text-2xl font-black text-gray-400 uppercase italic">Product not found</h3>
          </div>
        )}
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-gray-100 pb-16 mb-8">
          <div>
            <img src="src/assets/img\Logo buah segar _Freshly Cut_.png" alt="Logo" className="h-16 mb-6" />
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