import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Komponen reusable untuk animasi scroll
const SectionWithOffers = ({ title, data }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      <h3 className="text-xl md:text-2xl font-bold mb-4 border-l-4 border-orange-500 pl-3">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex flex-col justify-between border rounded-xl p-4 shadow hover:shadow-md transition-all"
          >
            <div>
              <h4 className="font-semibold text-base">{item.name}</h4>
              <p className="text-xs text-gray-500 my-1">{item.desc}</p>
              <p className="font-semibold mt-2">{item.price}</p>
            </div>
            <img
              src={item.img}
              alt={item.name}
              className="w-24 h-24 object-contain mx-auto my-4"
            />
            <button className="border border-orange-400 text-orange-500 font-semibold py-1 rounded hover:bg-orange-100 text-sm">
              Tambah
            </button>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

const MenuUser = () => {
  const offers1 = [
    {
      name: "Choco Oat Latte",
      desc: "Kopi oat dengan cokelat dan susu oat.",
      price: "34.000",
      img: "/img/choco-oat.png",
    },
    {
      name: "Matcha Frappe",
      desc: "Minuman matcha dingin creamy.",
      price: "27.000",
      img: "/img/matcha-frappe.png",
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
      <div className="flex justify-between items-center border-b pb-4 mb-8">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <h1 className="text-xl font-bold text-orange-600">TOMORO COFFEE</h1>
        </div>
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-orange-500">Home</a>
          <a href="#" className="hover:text-orange-500">Menu</a>
          <a href="#" className="hover:text-orange-500">Location</a>
          <a href="#" className="hover:text-orange-500">FAQ</a>
          <a href="#" className="hover:text-orange-500">Feedback</a>
        </nav>
        <div className="flex gap-4">
          <button className="text-orange-500"><i className="fas fa-shopping-cart"></i></button>
          <button className="text-orange-500"><i className="fas fa-user"></i></button>
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
        <SectionWithOffers title="Based on Your Latest Order" data={latestOrders} />
        <SectionWithOffers title="All Menus" data={allMenus} />
      </div>
    </div>
  );
};

export default MenuUser;
