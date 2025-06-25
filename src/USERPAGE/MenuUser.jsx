import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { ShoppingCart, Bell } from "lucide-react";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
// Komponen reusable untuk animasi scroll
const SectionWithOffers = ({ title, data }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-12"
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl md:text-2xl font-bold border-b-2 border-orange-500 pb-1">
          {title}
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full border border-gray-300 hover:bg-orange-100 transition"
        >
          {isExpanded ? (
            <ChevronUp className="text-orange-500" />
          ) : (
            <ChevronDown className="text-orange-500" />
          )}
        </button>
      </div>

      {/* Product Grid */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="relative overflow-hidden border rounded-xl p-4 shadow hover:shadow-md transition-all bg-white"
                >
                  {/* Gambar produk di kanan atas */}
                  <img
                    src={item.img}
                    alt={item.name}
                    className="absolute top-2 right-2 w-24 h-24 object-contain z-0"
                  />

                  {/* Konten teks */}
                  <div className="relative z-10 pr-28">
                    <h4 className="font-semibold text-base">{item.name}</h4>
                    <p className="text-xs text-gray-500 my-1">{item.desc}</p>
                    <p className="font-semibold mt-2">{item.price}</p>
                    <button className="mt-4 border border-orange-400 text-orange-500 font-semibold py-1 px-4 rounded-full hover:bg-orange-100 text-sm">
                      Tambah
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

const MenuUser = () => {
  const offers1 = [
    {
      name: "Choco Oat Latte",
      desc: "Kopi oat dengan cokelat dan susu oat.",
      price: "34.000",
      img: "/img/Espresso_Tonic-removebg-preview.png",
    },
    {
      name: "Matcha Frappe",
      desc: "Minuman matcha dingin creamy.",
      price: "27.000",
      img: "/img/Ketan_Hitam_Frappe-removebg-preview.png",
    },
    {
      name: "Matcha Latte",
      desc: "Minuman matcha latte creamy.",
      price: "30.000",
      img: "/img/matcha-latte.png",
    },
  ];

  const offers2 = [
    {
      name: "Hojicha Oat Latte",
      desc: "Minuman hojicha ringan dan creamy.",
      price: "34.000",
      img: "/img/hojicha.png",
    },
    {
      name: "Choco Oat Latte",
      desc: "Kopi oat dengan cokelat dan susu oat.",
      price: "27.000",
      img: "/img/choco-oat.png",
    },
    {
      name: "Chocolate",
      desc: "Cokelat klasik dengan susu.",
      price: "30.000",
      img: "/img/chocolate.png",
    },
  ];

  const offers3 = [
    {
      name: "Chocolate",
      desc: "Minuman cokelat rendah gula.",
      price: "30.000",
      img: "/img/chocolate.png",
    },
    {
      name: "Choco Oat Latte",
      desc: "Kopi oat dan cokelat rendah gula.",
      price: "34.000",
      img: "/img/choco-oat.png",
    },
    {
      name: "Matcha Latte",
      desc: "Matcha latte tanpa pemanis tambahan.",
      price: "30.000",
      img: "/img/matcha-latte.png",
    },
  ];

  const latestOrders = [
    {
      name: "Cinnamon Roll",
      desc: "Roti manis dengan taburan kayu manis.",
      price: "30.000",
      img: "/img/cinnamon.png",
    },
    {
      name: "Choco Oat Latte",
      desc: "Kopi oat dengan cokelat dan susu oat.",
      price: "27.000",
      img: "/img/choco-oat.png",
    },
    {
      name: "Chocolate",
      desc: "Cokelat klasik dengan susu.",
      price: "30.000",
      img: "/img/chocolate.png",
    },
  ];

  const allMenus = [
    {
      name: "Butter Croissant",
      desc: "Croissant mentega lembut, lapisan ringan.",
      price: "27.000",
      img: "/img/croissant.png",
    },
    {
      name: "Cheese Danish",
      desc: "Pastry lembut dengan keju meleleh.",
      price: "34.000",
      img: "/img/cheese-danish.png",
    },
    {
      name: "Choco Danish",
      desc: "Pastry berisi cokelat leleh lembut.",
      price: "34.000",
      img: "/img/choco-danish.png",
    },
    {
      name: "Chocolate",
      desc: "Cokelat klasik dengan susu.",
      price: "30.000",
      img: "/img/chocolate.png",
    },
    {
      name: "Choco Oat Latte",
      desc: "Kopi oat dan cokelat lembut.",
      price: "34.000",
      img: "/img/choco-oat.png",
    },
    {
      name: "Matcha Latte",
      desc: "Minuman matcha latte creamy.",
      price: "30.000",
      img: "/img/matcha-latte.png",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white text-gray-800 px-6 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b pb-3 mb-6">
        <div className="flex items-center gap-3">
          <img src="/img/Logo.png" alt="Logo" className="h-10" />
          <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
            TOMORO{" "}
            <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">
              COFFEE
            </span>
          </h1>
        </div>

        <nav className="flex gap-8 text-sm font-medium text-gray-700">
          <Link to="/HomeUser" className="hover:text-orange-500">
            Home
          </Link>
          <Link to="/MenuUser" className="hover:text-orange-500">
            Menu
          </Link>
          <Link to="/location" className="hover:text-orange-500">
            Location
          </Link>
          <Link to="/faq" className="hover:text-orange-500">
            FAQ
          </Link>
          <Link to="/feedback" className="hover:text-orange-500">
            Feedback
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/CartUser" className="text-orange-500 hover:text-orange-600">
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <Link
            to="/NotificationUser"
            className="text-orange-500 hover:text-orange-600"
          >
            <Bell className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Promo Poster */}
      <div className="relative w-full max-w-6xl mx-auto mt-8">
        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border border-orange-300 p-2 rounded-full shadow-md z-10 hover:bg-orange-100">
          <ChevronLeft className="text-orange-600" />
        </button>
        <img
          src="/img/Mask group.png"
          alt="Tomoro Promo Poster"
          className="w-full rounded-lg shadow-lg"
        />
        <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border border-orange-300 p-2 rounded-full shadow-md z-10 hover:bg-orange-100">
          <ChevronRight className="text-orange-600" />
        </button>
      </div>

      {/* Offer Sections */}
      <div className="max-w-6xl mx-auto mt-10">
        <SectionWithOffers title="Special Offers For You" data={offers1} />
        <SectionWithOffers title="Returnee Special Offers" data={offers2} />
        <SectionWithOffers title="Low Sugars Type Person" data={offers3} />
        <SectionWithOffers
          title="Based on Your Latest Order"
          data={latestOrders}
        />
        <SectionWithOffers title="All Menus" data={allMenus} />
      </div>
      {/* Footer Section */}
      <footer className="relative mt-20 w-full text-white">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/image 48.png')" }}
        ></div>

        {/* Overlay gradasi gelap transparan */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
          {/* Left - Logo & Location */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/img/Logo.png" alt="Logo" className="h-10" />
              <div>
                <h2 className="text-xl font-bold text-orange-400">TOMORO</h2>
                <p className="text-sm tracking-[0.3em] text-orange-300">
                  COFFEE
                </p>
              </div>
            </div>
            <div className="text-sm leading-relaxed">
              <p className="text-orange-400 font-semibold mb-1">Our Location</p>
              <p>Headquarters</p>
              <p>
                Jl. Riau No.57 B, Kp. Bandar, Kec. Senapelan, Kota Pekanbaru,
                Riau 28291
              </p>
            </div>
          </div>

          {/* Right - Social Media */}
          <div className="text-sm">
            <p className="text-orange-400 font-semibold mb-2">Social Media</p>
            <div className="flex gap-4 text-lg">
              <a href="#" className="hover:text-orange-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-orange-300">
                <i className="fab fa-tiktok"></i>
              </a>
              <a
                href="mailto:contact@tomorocoffee.com"
                className="hover:text-orange-300"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
          Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
        </div>
      </footer>
    </div>
  );
};

export default MenuUser;
