import React, { useState } from "react";
import { Star, UserCircle, ShoppingCart, Bell, Send, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";
import { supabase } from "../supabase";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "./CartContext"; // Pastikan path ini sesuai dengan struktur folder Anda

export default function FeedbackUser() {
  const location = useLocation();
  
  // --- TAMBAHKAN LINE INI UNTUK MEMPERBAIKI ERROR ---
  const { cartItems } = useCart(); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!name || !feedback || rating === 0) {
      Swal.fire({
        title: "Ups!",
        text: "Mohon isi Nama, Feedback, dan berikan Rating ya!",
        icon: "warning",
        confirmButtonColor: "#2563eb",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase.from("feedback").insert([{
        name, 
        email, 
        feedback, 
        rating
      }]);

      if (error) throw error;

      Swal.fire({
        title: "TERIMA KASIH!",
        text: "Feedback kamu sudah kami terima. Masukanmu sangat berharga!",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      setName(""); setEmail(""); setFeedback(""); setRating(0);
    } catch (error) {
      Swal.fire("Error", "Gagal mengirim feedback. Silakan coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-gray-900">
      {/* --- HEADER --- */}
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
      <section className="bg-gradient-to-b from-[#F0F9FF] to-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-200 text-white">
            <MessageSquare size={40} />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-blue-900 mb-6 italic tracking-tighter uppercase">
            BERI KAMI <span className="text-orange-600">MASUKAN</span>
          </h1>
          <p className="text-blue-800/60 font-bold text-lg uppercase tracking-widest">
            Pendapatmu membuat Freshly Cut lebih baik lagi
          </p>
        </div>
      </section>

      {/* --- FORM --- */}
      <main className="flex-grow flex items-center justify-center px-6 pb-24 -mt-10 relative z-20">
        <motion.div 
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[3.5rem] shadow-2xl shadow-blue-100 p-8 md:p-12 w-full max-w-2xl border border-blue-50"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Nama Lengkap" placeholder="Nama Anda" value={name} onChange={(e) => setName(e.target.value)} required />
              <Input label="Email" type="email" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <Textarea label="Pesan atau Saran" placeholder="Bagaimana pengalamanmu hari ini?" value={feedback} onChange={(e) => setFeedback(e.target.value)} required />

            <div className="bg-blue-50 rounded-[2rem] p-8 text-center border-2 border-dashed border-blue-200">
              <label className="block text-xs font-black uppercase tracking-widest text-blue-900 mb-4">Rating Pengalaman</label>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.div key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                    <Star
                      size={42}
                      className={`cursor-pointer transition-all duration-300 ${star <= rating ? "text-orange-500 fill-orange-500" : "text-white fill-gray-200"}`}
                      onClick={() => setRating(star)}
                      strokeWidth={1}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:bg-gray-300"
            >
              {isSubmitting ? "Mengirim..." : (
                <>
                  <Send size={18} /> Kirim Masukan Sekarang
                </>
              )}
            </button>
          </form>
        </motion.div>
      </main>

      {/* --- FOOTER --- */}
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
}

// Tambahkan komponen Input dan Textarea di bawah export default atau di file terpisah agar rapi
const Input = ({ label, name, type = "text", ...props }) => (
  <div className="w-full">
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 mb-2 ml-4">
      {label} {props.required && <span className="text-orange-600">*</span>}
    </label>
    <input
      type={type}
      className="w-full px-6 py-4 bg-white border-2 border-blue-50 rounded-[2rem] text-sm font-bold text-gray-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300 shadow-sm"
      {...props}
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="w-full">
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-blue-900 mb-2 ml-4">
      {label} {props.required && <span className="text-orange-600">*</span>}
    </label>
    <textarea
      rows="4"
      className="w-full px-6 py-4 bg-white border-2 border-blue-50 rounded-[2.5rem] text-sm font-bold text-gray-700 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-300 shadow-sm resize-none"
      {...props}
    />
  </div>
);