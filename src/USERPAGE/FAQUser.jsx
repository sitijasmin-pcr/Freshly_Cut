// src/USERPAGE/FAQUser.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Bell, ChevronDown, HelpCircle, MessageCircle, UserCircle } from "lucide-react";
import { useCart } from "./CartContext"; 

import logo from "../assets/FreshlyLogo.png";

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

      {/* --- HERO FAQ --- */}
      <section className="bg-gradient-to-b from-[#F0F9FF] to-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200 text-white"
          >
            <HelpCircle size={40} strokeWidth={2.5} />
          </motion.div> */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-black text-green-900 mb-6 italic tracking-tighter uppercase"
          >
            Ada <span className="text-orange-600 text-6xl md:text-7xl">Pertanyaan?</span>
          </motion.h1>
          <p className="text-green-800/60 font-bold text-lg uppercase tracking-widest">
            Kami siap membantu kebutuhan nutrisimu
          </p>
        </div>
        
        <div className="absolute top-10 -left-10 w-40 h-40 bg-orange-100 rounded-full blur-[80px] opacity-60"></div>
        <div className="absolute bottom-0 -right-10 w-60 h-60 bg-green-100 rounded-full blur-[100px] opacity-60"></div>
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
                  ? "bg-white border-green-600 shadow-2xl shadow-green-100" 
                  : "bg-gray-50 border-transparent hover:border-gray-200"
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex justify-between items-center p-7 text-left focus:outline-none"
                >
                  <span className={`text-lg font-black italic tracking-tight uppercase ${
                    openIndex === index ? "text-green-600" : "text-green-900"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-2xl transition-all duration-300 ${
                    openIndex === index ? "bg-green-600 text-white rotate-180" : "bg-white text-green-900 shadow-sm"
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
                      <div className="px-8 pb-8 text-green-800/70 font-bold leading-relaxed border-t border-green-50 pt-4 mx-4">
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
        <div className="mt-20 text-center bg-green-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <MessageCircle size={120} />
            </div>
            <h3 className="text-3xl font-black italic mb-4 uppercase tracking-tighter">Masih punya pertanyaan?</h3>
            <p className="text-green-200 font-bold mb-8 uppercase text-xs tracking-widest">Hubungi tim support kami yang ramah</p>
            <a 
              href="mailto:support@freshlycut.com" 
              className="inline-block bg-orange-600 hover:bg-orange-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:-translate-y-1 active:scale-95"
            >
              Kirim Email
            </a>
        </div>
      </main>

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