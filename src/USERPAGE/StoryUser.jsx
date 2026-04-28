// // src/USERPAGE/StoryUser.jsx
// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { ShoppingCart, Bell, Apple, Leaf, Award, MapPin, UserCircle, Star, Sparkles } from "lucide-react";
// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";

// // --- IMPORT CART CONTEXT ---
// import { useCart } from "./CartContext"; 

// // Komponen reusable untuk section dengan gaya Bingxue Card
// const AnimatedSection = ({ children, delay = 0, title, icon: Icon }) => {
//   const [ref, inView] = useInView({
//     triggerOnce: true,
//     threshold: 0.1,
//   });

//   return (
//     <motion.div
//       ref={ref}
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={inView ? { opacity: 1, scale: 1 } : {}}
//       transition={{ duration: 0.5, delay: delay }}
//       className="bg-white rounded-[3rem] shadow-xl shadow-blue-50 p-10 mb-12 border-2 border-blue-50 relative overflow-hidden group hover:border-blue-200 transition-all"
//     >
//       <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors" />
      
//       <div className="relative z-10">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
//             {Icon && <Icon size={28} />}
//           </div>
//           <h2 className="text-3xl font-black italic text-blue-900 uppercase tracking-tighter">
//             {title}
//           </h2>
//         </div>
//         <div className="text-gray-600 font-medium leading-relaxed space-y-4">
//           {children}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default function StoryUser() {
//   const location = useLocation();
//   // --- TAMBAHKAN INI ---
//   const { cartItems } = useCart(); 

//   return (
//     <div className="min-h-screen bg-white font-sans text-blue-900 flex flex-col overflow-x-hidden">
      
//       {/* --- HEADER --- */}
//       <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
//           <Link to="/HomeUser" className="flex items-center gap-2">
//             <img src="src/assets/img\Logo buah segar _Freshly Cut_.png" alt="Logo" className="h-12" />
//             <div className="hidden sm:block">
//               <span className="text-xl font-black text-orange-600 block leading-none">FRESHLY CUT</span>
//               <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Makan Sehat, Tinggal Hap!</span>
//             </div>
//           </Link>
//           <nav className="hidden md:flex gap-10">
//             {["Home", "Menu", "Story", "FAQ", "Feedback"].map((item) => (
//               <Link
//                 key={item}
//                 to={item === "Home" ? "/HomeUser" : `/${item}User`}
//                 className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-orange-600 ${
//                   location.pathname.includes(item) ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-500"
//                 }`}
//               >
//                 {item}
//               </Link>
//             ))}
//           </nav>
//           <div className="flex items-center gap-5">
//             <Link to="/ProfileUser" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600"><UserCircle size={22} /></Link>
//             <Link to="/CartUser" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600 relative">
//               <ShoppingCart size={22} />
//               {cartItems.length > 0 && (
//                 <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cartItems.length}</span>
//               )}
//             </Link>
//             <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
//             <Link to="/NotificationUser" className="relative p-2 text-gray-600"><Bell size={22} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></Link>
//           </div>
//         </div>
//       </header>

//       {/* --- HERO SECTION --- */}
//       <section className="relative w-full h-[450px] flex items-center justify-center overflow-hidden">
//         <div 
//           className="absolute inset-0 bg-cover bg-fixed bg-center"
//           style={{ backgroundImage: "url('/img/cabang_sembilang.png')" }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
        
//         <div className="relative z-10 max-w-7xl w-full px-10">
//           <motion.div
//             initial={{ x: -100, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.8 }}
//           >
//             <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-4 inline-block">
//               Fresh & Natural
//             </span>
//             <h1 className="text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">
//               JELAJAHI DUNIA <br /> 
//               <span className="text-orange-500">FRESHLY CUT</span>
//             </h1>
//             <p className="text-white/80 font-bold text-lg max-w-xl">
//               Komitmen kami untuk menyajikan potongan buah segar terbaik langsung ke tangan Anda.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* --- MAIN CONTENT --- */}
//       <main className="flex-grow max-w-5xl mx-auto px-6 py-20">
        
//         {/* Tentang Kami */}
//         <AnimatedSection title="Tentang Kami" icon={Apple} delay={0.1}>
//           <p>
//             Freshly Cut hadir dengan dedikasi tinggi untuk menyajikan buah potong 
//             premium yang higienis, sehat, dan praktis. Kami percaya bahwa gaya hidup sehat 
//             harus dimulai dari kemudahan akses ke nutrisi terbaik setiap hari.
//           </p>
//           <p className="bg-blue-50 p-6 rounded-[2rem] border-l-8 border-blue-600 italic font-bold">
//             "Lebih dari sekadar camilan, kami percaya buah segar adalah bahan bakar 
//             untuk semangatmu menjalani hari dengan lebih produktif dan ceria."
//           </p>
//         </AnimatedSection>

//         {/* Visi & Misi */}
//         <AnimatedSection title="Visi & Misi" icon={Sparkles} delay={0.2}>
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-blue-600 font-black uppercase text-sm tracking-widest mb-2 flex items-center gap-2">
//                 <Star size={16} fill="currentColor" /> Visi Kami
//               </h3>
//               <p>Menjadi pelopor gaya hidup sehat melalui camilan buah potong yang paling dicintai di Indonesia.</p>
//             </div>
//             <div className="grid md:grid-cols-2 gap-4">
//               {[
//                 { t: "Kesegaran", d: "Standar kualitas buah terbaik setiap hari." },
//                 { t: "Inovasi", d: "Sajian buah dengan racikan rasa unik." },
//                 { t: "Praktis", d: "Solusi makan sehat di tengah kesibukan." },
//                 { t: "Higienis", d: "Keamanan pangan prioritas utama kami." }
//               ].map((item, i) => (
//                 <div key={i} className="bg-orange-50 p-5 rounded-[2rem]">
//                   <h4 className="font-black text-orange-600 uppercase text-xs mb-1">{item.t}</h4>
//                   <p className="text-sm font-bold">{item.d}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </AnimatedSection>

//         {/* Jaringan Indonesia */}
//         <AnimatedSection title="Jaringan Kami" icon={MapPin} delay={0.3}>
//           <p className="mb-6">
//             Kami terus berekspansi untuk memastikan setiap orang bisa menikmati kesegaran 
//             buah potong Freshly Cut di mana saja dan kapan saja.
//           </p>
//           <div className="rounded-[3rem] overflow-hidden border-4 border-blue-50 shadow-inner">
//             <iframe
//               src="http://maps.google.com/maps?q=tomoro+coffee+indonesia&output=embed"
//               width="100%"
//               height="400"
//               style={{ border: 0 }}
//               allowFullScreen=""
//               loading="lazy"
//               title="Peta Lokasi"
//               className="grayscale hover:grayscale-0 transition-all duration-700"
//             ></iframe>
//           </div>
//         </AnimatedSection>

//         {/* Pencapaian & Keberlanjutan */}
//         <div className="grid md:grid-cols-2 gap-8">
//           <AnimatedSection title="Pencapaian" icon={Award} delay={0.4}>
//             <ul className="space-y-3">
//               <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
//                 <span className="text-blue-600">★</span> 100% Produk Lokal Segar
//               </li>
//               <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
//                 <span className="text-blue-600">★</span> Inovasi Kemasan Ramah Lingkungan
//               </li>
//               <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
//                 <span className="text-blue-600">★</span> Ribuan Pelanggan Puas
//               </li>
//             </ul>
//           </AnimatedSection>

//           <AnimatedSection title="Eco Focus" icon={Leaf} delay={0.5}>
//             <ul className="space-y-3">
//               <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
//                 <span className="text-orange-500">✔</span> Zero Waste Initiative
//               </li>
//               <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
//                 <span className="text-orange-500">✔</span> Mengurangi Penggunaan Plastik
//               </li>
//               <li className="flex items-start gap-2 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm italic font-bold text-sm">
//                 <span className="text-orange-500">✔</span> Kemitraan dengan Petani Lokal
//               </li>
//             </ul>
//           </AnimatedSection>
//         </div>
//       </main>

//       {/* --- FOOTER --- */}
//       <footer className="bg-white pt-24 pb-12 px-6 border-t border-gray-100">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 border-b border-gray-100 pb-16 mb-8">
//           <div>
//             <img src="src/assets/img\Logo buah segar _Freshly Cut_.png" alt="Logo" className="h-16 mb-6" />
//             <p className="text-gray-400 text-sm font-medium italic">Empowering everyone to enjoy a high-quality cup of coffee. Freshness guaranteed.</p>
//           </div>
//           <div>
//             <h4 className="font-black text-blue-900 mb-6 uppercase tracking-widest text-xs italic">Explore</h4>
//             <ul className="space-y-3 text-sm font-bold text-gray-500 uppercase tracking-tighter">
//               <li><Link to="/HomeUser" className="hover:text-orange-600 transition-colors">Home</Link></li>
//               <li><Link to="/MenuUser" className="hover:text-orange-600 transition-colors">Our Menu</Link></li>
//               <li><Link to="/StoryUser" className="hover:text-orange-600 transition-colors">Our Story</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-black text-blue-900 mb-6 uppercase tracking-widest text-xs italic">Support</h4>
//             <ul className="space-y-3 text-sm font-bold text-gray-500 uppercase tracking-tighter">
//               <li><Link to="/FAQUser" className="hover:text-orange-600 transition-colors">General FAQ</Link></li>
//               <li><Link to="/FeedbackUser" className="hover:text-orange-600 transition-colors">Feedback</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="font-black text-blue-900 mb-6 uppercase tracking-widest text-xs italic">Social</h4>
//             <div className="flex gap-4">
//               {["instagram", "tiktok", "facebook"].map((social) => (
//                 <a key={social} href="#" className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
//                   <i className={`fab fa-${social}`}></i>
//                 </a>
//               ))}
//             </div>
//           </div>
//         </div>
//         <p className="text-center text-[10px] font-black text-black-300 uppercase tracking-[0.5em]">&copy; 2026 FRESHLY CUT - ALL RIGHTS RESERVED</p>
//       </footer>
//     </div>
//   );
// }

import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Bell,
  Apple,
  Leaf,
  Award,
  MapPin,
  UserCircle,
  Star,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCart } from "./CartContext";

// Section reusable (disamakan style MenuUser)
const AnimatedSection = ({ children, title, icon: Icon, delay = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-10 mb-10 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-600 text-white rounded-2xl shadow-md">
          {Icon && <Icon size={22} />}
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-green-900 uppercase italic tracking-tight">
          {title}
        </h2>
      </div>

      <div className="text-gray-600 font-medium leading-relaxed space-y-4">
        {children}
      </div>
    </motion.div>
  );
};

export default function StoryUser() {
  const location = useLocation();
  const { cartItems } = useCart();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

      {/* ================= NAVBAR (SAMA PERSIS MENUUSER) ================= */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

          <Link to="/HomeUser" className="flex items-center gap-2">
            <img
              src="src/assets/img/Logo buah segar _Freshly Cut_.png"
              alt="Logo"
              className="h-12"
            />
            <div className="hidden sm:block">
              <span className="text-xl font-black text-orange-600 block leading-none">
                FRESHLY CUT
              </span>
              <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">
                Makan Sehat, Tinggal Hap!
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex gap-10">
            {["Home", "Menu", "Story", "FAQ", "Feedback"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/HomeUser" : `/${item}User`}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-orange-600 ${
                  location.pathname.includes(item)
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-500"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link to="/ProfileUser" className="text-gray-600">
              <UserCircle size={22} />
            </Link>

            <Link to="/CartUser" className="relative text-gray-600">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <Link to="/NotificationUser" className="relative text-gray-600">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
          </div>

        </div>
      </header>

      {/* ================= HERO (DISERAGAMKAN STYLE MENUUSER) ================= */}
      <section className="relative py-20 bg-[#F0F9FF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">

          <span className="inline-block px-4 py-1 bg-green-600 text-white text-xs font-black rounded-full mb-4 uppercase tracking-widest">
            Our Story
          </span>

          <h1 className="text-5xl md:text-7xl font-black text-green-900 uppercase italic leading-none mb-6">
            Freshly Cut <br />
            <span className="text-orange-600">Journey</span>
          </h1>

          <p className="text-green-800/70 font-medium max-w-xl mx-auto">
            Cerita kami dalam menghadirkan buah segar terbaik untuk hidup yang lebih sehat.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="max-w-5xl mx-auto px-6 py-20">

        <AnimatedSection title="Tentang Kami" icon={Apple} delay={0.1}>
          <p>
            Freshly Cut hadir untuk memberikan solusi camilan sehat berbasis buah segar
            yang praktis dan higienis.
          </p>
          <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-2xl font-bold italic">
            "Lebih dari sekadar buah, kami menghadirkan gaya hidup sehat setiap hari."
          </div>
        </AnimatedSection>

        <AnimatedSection title="Visi & Misi" icon={Sparkles} delay={0.2}>
          <p>
            Menjadi brand buah segar terbaik di Indonesia dengan kualitas premium.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[
              { t: "Kesegaran", d: "Buah terbaik setiap hari." },
              { t: "Inovasi", d: "Sajian modern dan praktis." },
              { t: "Higienis", d: "Proses bersih dan aman." },
              { t: "Praktis", d: "Siap konsumsi kapan saja." },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-2xl border">
                <h4 className="font-black text-green-700 text-xs uppercase">
                  {item.t}
                </h4>
                <p className="text-sm text-gray-600">{item.d}</p>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection title="Jaringan Kami" icon={MapPin} delay={0.3}>
          <div className="rounded-2xl overflow-hidden border">
            <iframe
              src="http://maps.google.com/maps?q=indonesia&output=embed"
              width="100%"
              height="350"
              loading="lazy"
            />
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-6">
          <AnimatedSection title="Pencapaian" icon={Award} delay={0.4}>
            <ul className="space-y-2 text-sm">
              <li>✔ 100% Buah Segar Lokal</li>
              <li>✔ Ribuan pelanggan puas</li>
              <li>✔ Kemasan ramah lingkungan</li>
            </ul>
          </AnimatedSection>

          <AnimatedSection title="Eco Focus" icon={Leaf} delay={0.5}>
            <ul className="space-y-2 text-sm">
              <li>✔ Pengurangan plastik</li>
              <li>✔ Zero waste initiative</li>
              <li>✔ Dukungan petani lokal</li>
            </ul>
          </AnimatedSection>
        </div>

      </main>

      {/* ================= FOOTER (SAMA PERSIS MENUUSER) ================= */}
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