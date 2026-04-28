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

import logo from "../assets/FreshlyLogo.png";

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
              src={logo}
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
              src="https://www.google.com/maps?q=indonesia&output=embed"
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