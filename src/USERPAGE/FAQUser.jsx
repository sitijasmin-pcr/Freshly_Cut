// src/USERPAGE/FAQUser.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Bell, ChevronDown, HelpCircle, MessageCircle, UserCircle } from "lucide-react";
import { useCart } from "./CartContext"; 

export default function FAQUser() {
  const location = useLocation();
  const { cartItems } = useCart(); 

  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase.from("faq").select("*");
      if (error) {
        console.error("Gagal mengambil data FAQ:", error.message);
      } else {
        setFaqs(data);
      }
    };
    fetchFaqs();
  }, []);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-gray-900">
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/HomeUser" className="flex items-center gap-2">
            <img src="/img/Logo.png" alt="Logo" className="h-12" />
            <div className="hidden sm:block">
              <span className="text-xl font-black text-orange-600 block leading-none">TOMORO</span>
              <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Coffee & More</span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-10">
            {['Home', 'Menu', 'Story', 'FAQ', 'Feedback'].map((item) => (
              <Link
                key={item}
                to={item === 'Home' ? '/HomeUser' : `/${item}User`}
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
              {cartItems && cartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
            <Link to="/NotificationUser" className="relative p-2 text-gray-600">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO FAQ --- */}
      <section className="bg-gradient-to-b from-[#F0F9FF] to-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200 text-white"
          >
            <HelpCircle size={40} strokeWidth={2.5} />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-black text-blue-900 mb-6 italic tracking-tighter uppercase"
          >
            Ada <span className="text-orange-600 text-6xl md:text-7xl">Pertanyaan?</span>
          </motion.h1>
          <p className="text-blue-800/60 font-bold text-lg uppercase tracking-widest">
            Kami siap membantu kebutuhan nutrisimu
          </p>
        </div>
        
        <div className="absolute top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-[80px] opacity-60"></div>
        <div className="absolute bottom-0 -right-10 w-60 h-60 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
      </section>

      {/* --- FAQ ACCORDION --- */}
      <main className="flex-grow max-w-4xl mx-auto px-6 py-16 w-full relative z-10">
        {faqs.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <MessageCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="font-black text-gray-400 uppercase tracking-widest italic">Belum ada FAQ tersedia</p>
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group rounded-[2.5rem] transition-all duration-300 border-2 ${
                  openIndex === index 
                  ? "bg-white border-blue-600 shadow-2xl shadow-blue-100" 
                  : "bg-gray-50 border-transparent hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex justify-between items-center p-7 text-left focus:outline-none"
                >
                  <span className={`text-lg font-black italic tracking-tight uppercase ${
                    openIndex === index ? "text-blue-600" : "text-blue-900"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-2xl transition-all duration-300 ${
                    openIndex === index ? "bg-blue-600 text-white rotate-180" : "bg-white text-blue-900 shadow-sm"
                  }`}>
                    <ChevronDown size={24} strokeWidth={3} />
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-blue-800/70 font-bold leading-relaxed border-t border-blue-50 pt-4 mx-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-20 text-center bg-blue-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <MessageCircle size={120} />
            </div>
            <h3 className="text-3xl font-black italic mb-4 uppercase tracking-tighter">Masih punya pertanyaan?</h3>
            <p className="text-blue-200 font-bold mb-8 uppercase text-xs tracking-widest">Hubungi tim support kami yang ramah</p>
            <a 
              href="mailto:support@freshlycut.com" 
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              Kirim Email
            </a>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-blue-900 pt-20 pb-10 px-6 text-white rounded-t-[50px]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 mb-16">
          <div className="text-center md:text-left">
            <img src="/img/Logo.png" alt="Logo" className="h-12 mx-auto md:mx-0 mb-6 brightness-200" />
            <p className="text-blue-200/60 font-bold uppercase text-[10px] tracking-widest">
                Segar, sehat, dan praktis setiap hari.
            </p>
          </div>
          <div className="flex justify-center md:justify-around gap-10 font-black uppercase text-[10px] tracking-widest text-blue-200">
             <Link to="/HomeUser" className="hover:text-orange-500">Home</Link>
             <Link to="/MenuUser" className="hover:text-orange-500">Menu</Link>
             <Link to="/FAQUser" className="text-orange-500">FAQ</Link>
          </div>
          <div className="text-center md:text-right text-[10px] font-black uppercase tracking-widest text-blue-400">
            <p>Support: support@freshlycut.com</p>
            <p className="mt-2">© 2026 FRESHLY CUT INDONESIA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}