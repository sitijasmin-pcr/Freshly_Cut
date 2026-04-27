// src/USERPAGE/StoryUser.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Bell, Apple, Leaf, Award, MapPin, UserCircle, Star, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// --- IMPORT CART CONTEXT ---
import { useCart } from "./CartContext"; 

// Komponen reusable untuk section dengan gaya Bingxue Card
const AnimatedSection = ({ children, delay = 0, title, icon: Icon }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: delay }}
      className="bg-white rounded-[3rem] shadow-xl shadow-blue-50 p-10 mb-12 border-2 border-blue-50 relative overflow-hidden group hover:border-blue-200 transition-all"
    >
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
            {Icon && <Icon size={28} />}
          </div>
          <h2 className="text-3xl font-black italic text-blue-900 uppercase tracking-tighter">
            {title}
          </h2>
        </div>
        <div className="text-gray-600 font-medium leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default function StoryUser() {
  const location = useLocation();
  // --- TAMBAHKAN INI ---
  const { cartItems } = useCart(); 

  return (
    <div className="min-h-screen bg-white font-sans text-blue-900 flex flex-col overflow-x-hidden">
      
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
              {cartItems.length > 0 && (
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

      {/* --- HERO SECTION --- */}
      <section className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-fixed bg-center"
          style={{ backgroundImage: "url('/img/cabang_sembilang.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl w-full px-10">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 inline-block">
              Fresh & Natural
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">
              JELAJAHI DUNIA <br /> 
              <span className="text-orange-500">FRESHLY CUT</span>
            </h1>
            <p className="text-white/80 font-bold text-lg max-w-xl">
              Komitmen kami untuk menyajikan potongan buah segar terbaik langsung ke tangan Anda.
            </p>
          </motion.div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow max-w-5xl mx-auto px-6 py-20">
        
        {/* Tentang Kami */}
        <AnimatedSection title="Tentang Kami" icon={Apple} delay={0.1}>
          <p>
            Freshly Cut hadir dengan dedikasi tinggi untuk menyajikan buah potong 
            premium yang higienis, sehat, dan praktis. Kami percaya bahwa gaya hidup sehat 
            harus dimulai dari kemudahan akses ke nutrisi terbaik setiap hari.
          </p>
          <p className="bg-blue-50 p-6 rounded-[2rem] border-l-8 border-blue-600 italic font-bold">
            "Lebih dari sekadar camilan, kami percaya buah segar adalah bahan bakar 
            untuk semangatmu menjalani hari dengan lebih produktif dan ceria."
          </p>
        </AnimatedSection>

        {/* Visi & Misi */}
        <AnimatedSection title="Visi & Misi" icon={Sparkles} delay={0.2}>
          <div className="space-y-6">
            <div>
              <h3 className="text-blue-600 font-black uppercase text-sm tracking-widest mb-2 flex items-center gap-2">
                <Star size={16} fill="currentColor" /> Visi Kami
              </h3>
              <p>Menjadi pelopor gaya hidup sehat melalui camilan buah potong yang paling dicintai di Indonesia.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { t: "Kesegaran", d: "Standar kualitas buah terbaik setiap hari." },
                { t: "Inovasi", d: "Sajian buah dengan racikan rasa unik." },
                { t: "Praktis", d: "Solusi makan sehat di tengah kesibukan." },
                { t: "Higienis", d: "Keamanan pangan prioritas utama kami." }
              ].map((item, i) => (
                <div key={i} className="bg-orange-50 p-5 rounded-[2rem]">
                  <h4 className="font-black text-orange-600 uppercase text-xs mb-1">{item.t}</h4>
                  <p className="text-sm font-bold">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Jaringan Indonesia */}
        <AnimatedSection title="Jaringan Kami" icon={MapPin} delay={0.3}>
          <p className="mb-6">
            Kami terus berekspansi untuk memastikan setiap orang bisa menikmati kesegaran 
            buah potong Freshly Cut di mana saja dan kapan saja.
          </p>
          <div className="rounded-[3rem] overflow-hidden border-4 border-blue-50 shadow-inner">
            <iframe
              src="http://maps.google.com/maps?q=tomoro+coffee+indonesia&output=embed"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Peta Lokasi"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
          </div>
        </AnimatedSection>

        {/* Pencapaian & Keberlanjutan */}
        <div className="grid md:grid-cols-2 gap-8">
          <AnimatedSection title="Pencapaian" icon={Award} delay={0.4}>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
                <span className="text-blue-600">★</span> 100% Produk Lokal Segar
              </li>
              <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
                <span className="text-blue-600">★</span> Inovasi Kemasan Ramah Lingkungan
              </li>
              <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
                <span className="text-blue-600">★</span> Ribuan Pelanggan Puas
              </li>
            </ul>
          </AnimatedSection>

          <AnimatedSection title="Eco Focus" icon={Leaf} delay={0.5}>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
                <span className="text-orange-500">✔</span> Zero Waste Initiative
              </li>
              <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
                <span className="text-orange-500">✔</span> Mengurangi Penggunaan Plastik
              </li>
              <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
                <span className="text-orange-500">✔</span> Kemitraan dengan Petani Lokal
              </li>
            </ul>
          </AnimatedSection>
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-blue-900 pt-20 pb-10 px-6 text-white rounded-t-[50px] relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 mb-16 relative z-10">
          <div className="text-center md:text-left">
            <img src="/img/Logo.png" alt="Logo" className="h-12 mx-auto md:mx-0 mb-6 brightness-200" />
            <h3 className="text-2xl font-black italic tracking-tighter uppercase mb-2">FRESHLY CUT</h3>
            <p className="text-blue-200/60 font-bold uppercase text-[10px] tracking-widest">Makan sehat, tinggal hap!</p>
          </div>
          
          <div className="text-center">
            <h4 className="text-orange-500 font-black uppercase text-xs tracking-widest mb-6">Headquarters</h4>
            <p className="text-sm font-bold text-blue-100">Pekanbaru, Riau, Indonesia</p>
          </div>

          <div className="text-center md:text-right">
             <h4 className="text-orange-500 font-black uppercase text-xs tracking-widest mb-6">Connect With Us</h4>
             <div className="flex justify-center md:justify-end gap-6">
                {['instagram', 'tiktok', 'mail'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-orange-500 transition-all">
                    <i className={`fab fa-${social === 'mail' ? 'google' : social}`}></i>
                  </a>
                ))}
             </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 relative z-10">
          © 2026 FRESHLY CUT INDONESIA
        </div>
        
        <div className="absolute top-0 right-0 p-20 text-white/5 font-black italic text-9xl pointer-events-none uppercase">STORY</div>
      </footer>
    </div>
  );
}