import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Bell,
  MessageSquareText,
  UserCircle,
} from "lucide-react"; // Import UserCircle

// Reusable component for scroll-based animation
const FadeInOnScroll = ({ children, direction = "up", delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

const coffeeList = [
  {
    name: "Berry Latte",
    price: 20000,
    rating: 4.5,
    img: "/img/Ketan_Hitam_Frappe-removebg-preview.png",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales tortor eget elit sollicitudin.",
  },
  {
    name: "Sea Salt Matcha",
    price: 18000,
    rating: 4.3,
    img: "/img/Sea_Salt_Matcha_Garden_Iced-removebg-preview.png",
    desc: "Ut volutpat sit amet tortor ut cursus. Aliquam vitae lacinia nunc, a malesuada libero.",
  },
  {
    name: "Classic Latte",
    price: 16000,
    rating: 4.1,
    img: "/img/Rosy_Hibiscus_Lemonade-removebg-preview.png",
    desc: "Vivamus non mauris ut nisl fermentum tincidunt. Morbi non massa, tristique eget mattis sapien.",
  },
];

export default function HomeUser() {
  const location = useLocation();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [locationIndex, setLocationIndex] = useState(0);

  const handleChangeProduct = (index) => {
    if (index !== active) setActive(index);
  };

  const handlePrev = () => {
    const maxIndex = Math.floor((locations.length - 1) / 2) * 2;
    setLocationIndex((prev) => (prev - 2 < 0 ? maxIndex : prev - 2));
  };

  const handleNext = () => {
    const maxIndex = Math.floor((locations.length - 1) / 2) * 2;
    setLocationIndex((prev) => (prev + 2 > maxIndex ? 0 : prev + 2));
  };

  const locations = [
    {
      name: "Tomoro Coffee - Riau",
      address:
        "Jl. Riau No.57 C, Kp. Bandar, Kec. Senapelan, Kota Pekanbaru, Riau 28121",
      image: "/img/image 48.png",
      rating: 4.9,
    },
    {
      name: "Tomoro Coffee - Durian",
      address:
        "Jl. Durian, Jadirejo Kec. Payung Sekaki, Kota Pekanbaru, Riau 28124",
      image: "/img/image 49.png",
      rating: 4.9,
    },
    {
      name: "Tomoro Coffee - Gobah",
      address:
        "Jl. Durian, Jadirejo Kec. Payung Sekaki, Kota Pekanbaru, Riau 28124",
      image: "/img/image 49.png",
      rating: 4.9,
    },
    {
      name: "Tomoro Coffee - Panam",
      address:
        "Jl. Durian, Jadirejo Kec. Payung Sekaki, Kota Pekanbaru, Riau 28124",
      image: "/img/image 49.png",
      rating: 4.9,
    },
  ];

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-8 sticky top-0 z-50">
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

          <nav className="flex gap-8 text-sm font-medium">
            <Link
              to="/HomeUser"
              className={`transition-colors ${
                location.pathname === "/HomeUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              Home
            </Link>
            <Link
              to="/MenuUser"
              className={`transition-colors ${
                location.pathname === "/MenuUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              Menu
            </Link>
            <Link
              to="/ProfInfo"
              className={`transition-colors ${
                location.pathname === "/ProfInfo"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              Story
            </Link>
            <Link
              to="/FAQUser"
              className={`transition-colors ${
                location.pathname === "/FAQUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              FAQ
            </Link>
            <Link
              to="/FeedbackUser"
              className={`transition-colors ${
                location.pathname === "/FeedbackUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              Feedback
            </Link>
            <Link
              to="/lokasi"
              className={`transition-colors ${
                location.pathname === "/lokasi"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
              }`}
            >
              Location
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* New: Profile Icon */}
            <Link
              to="/ProfileUser"
              className="text-orange-500 hover:text-orange-600"
            >
              <UserCircle className="w-5 h-5" />
            </Link>
            {/* Existing icons */}
            <Link
              to="/CartUser"
              className="text-orange-500 hover:text-orange-600"
            >
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
      </header>

      {/* Hero Section */}
      <FadeInOnScroll>
        <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left md:w-1/2"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              {" "}
              {/* Increased font size */}
              HEY ! <br />
              ENJOY YOUR COFFE TIME
            </h1>
            <p className="text-gray-600 mb-2">
              Enjoy various kinds of coffee of your choice and get discounts on
              purchases every day!
            </p>
            <p className="text-sm font-bold">@TOMORO</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 mb-6 md:mb-0"
          >
            <img
              src="/img/image 47.png"
              alt="Hero Coffee"
              className="rounded-xl border-4 border-blue-300 w-full max-w-sm mx-auto"
            />
          </motion.div>
        </section>
      </FadeInOnScroll>

      {/* New Release Section */}
      <FadeInOnScroll>
        <section className="relative bg-white px-6 pt-12 pb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 text-center md:text-left z-10"
            >
              <h2 className="text-6xl md:text-7xl font-extrabold leading-tight">
                {" "}
                {/* Increased font size */}
                NEW <br /> RELEASE!
              </h2>
              <p className="mt-3 text-xl md:text-2xl font-medium">
                Get the Brand New{" "}
                <span className="text-orange-500 font-bold">Product</span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative md:w-1/2 mt-10 md:mt-0 flex justify-center z-10"
            >
              <div className="w-52 h-52 md:w-64 md:h-64 bg-orange-200 rounded-full flex items-center justify-center">
                <img
                  src="/img/Sea_Salt_Matcha_Garden_Iced-removebg-preview.png"
                  alt="New Product"
                  className="w-40 md:w-48 object-contain"
                />
              </div>
              {/* BAGIAN INI DIHAPUS UNTUK MENGHILANGKAN BUBBLE PRODUK DI KANAN */}
              {/*
              <div className="absolute right-[-80px] top-0 hidden md:flex flex-col gap-6">
                {coffeeList.map((coffee, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChangeProduct(idx)}
                    className={`relative transition-all ${
                      active === idx ? "scale-110" : "opacity-80"
                    }`}
                  >
                    <img
                      src={coffee.img}
                      alt={coffee.name}
                      className="w-16 h-16 rounded-full border-2 border-orange-400"
                    />
                    <span className="absolute bottom-0 right-0 bg-white text-sm font-bold px-2 py-0.5 rounded-full shadow">
                      ⭐ {coffee.rating}
                    </span>
                  </button>
                ))}
              </div>
              */}
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-orange-400 z-0"></div>
        </section>
      </FadeInOnScroll>

      {/* Special Event Section */}
      <FadeInOnScroll>
        <section className="bg-white px-6 py-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div className="flex justify-center">
              <img
                src="/img/image 47.png" // ganti sesuai path gambar kamu
                alt="Special Event"
                className="rounded-xl shadow-lg w-full max-w-md object-cover"
              />
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                {" "}
                SPECIAL EVENT – NIKMATI MOMEN ISTIMEWA DI TOMORO COFFEE{" "}
              </h2>{" "}
              {/* Increased font size */}
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Rasakan pengalaman ngopi yang berbeda bersama Tomoro Coffee!
                Kami menghadirkan Special Event dengan suasana hangat dan penuh
                kejutan spesial untuk Anda. Mulai dari live music, promo
                bundling menu favorit, hingga sesi coffee tasting yang eksklusif
                — semua dirancang untuk menemani momen santai Anda dengan lebih
                istimewa. Jangan lewatkan keseruannya dan ajak orang tersayang
                untuk bergabung.
              </p>
            </div>
          </div>
        </section>
      </FadeInOnScroll>

      {/* Coffee of the Day Section */}
      <FadeInOnScroll>
        <section className="bg-white py-16 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold mb-2">
                {" "}
                {/* Increased font size */}
                DRINK AND COFFEE <br /> OF THE DAY
              </h2>
              <h3 className="text-xl md:text-2xl font-bold mt-4">
                {coffeeList[active].name}
              </h3>
              <p className="text-yellow-400 text-lg mt-1">★★★★★</p>
              <p className="font-bold text-gray-800 text-lg mt-1">
                Rp.{coffeeList[active].price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 mt-3 max-w-md">
                {coffeeList[active].desc}
              </p>

              <div className="flex items-center gap-4 mt-6">
                <div className="flex border rounded px-2 py-1">
                  <button onClick={() => setQty((q) => Math.max(q - 1, 1))}>
                    −
                  </button>
                  <span className="px-3">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)}>+</button>
                </div>
                <button className="bg-orange-500 text-white px-5 py-2 rounded shadow hover:bg-orange-600">
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="relative md:w-1/2 flex items-center justify-center">
              <div className="bg-orange-200 w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={coffeeList[active].img}
                    alt={coffeeList[active].name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="w-44 md:w-52"
                  />
                </AnimatePresence>
              </div>
              {/* BAGIAN INI TETAP ADA KARENA INI ADALAH SECTION "COFFEE OF THE DAY" */}
              <div className="absolute right-[-80px] top-0 hidden md:flex flex-col gap-6">
                {coffeeList.map((coffee, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChangeProduct(idx)}
                    className={`relative transition-all ${
                      active === idx ? "scale-110" : "opacity-80"
                    }`}
                  >
                    <img
                      src={coffee.img}
                      alt={coffee.name}
                      className="w-16 h-16 rounded-full border-2 border-orange-400"
                    />
                    <span className="absolute bottom-0 right-0 bg-white text-sm font-bold px-2 py-0.5 rounded-full shadow">
                      ⭐ {coffee.rating}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeInOnScroll>
      {/* Location Section */}
      <FadeInOnScroll>
        <section className="bg-white py-16 px-6 text-center" id="location">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Location</h2>{" "}
          {/* Increased font size */}
          <hr className="border-t w-20 mx-auto mb-8" />
          <div className="relative max-w-6xl mx-auto flex items-center justify-center">
            {/* Tombol Sebelumnya */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition-all duration-300 px-6 py-3 rounded-full shadow-lg z-20 text-xl font-bold"
            >
              ◀
            </button>

            <div className="w-full overflow-hidden max-w-[660px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={locationIndex}
                  className="flex gap-6 justify-center"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -100, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {locations
                    .slice(locationIndex, locationIndex + 2)
                    .map((loc, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl shadow-md overflow-hidden p-4 w-[300px]"
                      >
                        <img
                          src={loc.image}
                          alt={loc.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-bold">{loc.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {loc.address}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="text-yellow-500 font-semibold">
                            ⭐ {loc.rating}
                          </div>
                          <button className="bg-orange-500 hover:bg-orange-600 transition px-4 py-1 text-white text-sm rounded-full shadow">
                            Lokasi
                          </button>
                        </div>
                      </div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Tombol Selanjutnya */}
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-600 hover:text-white transition-all duration-300 px-6 py-3 rounded-full shadow-lg z-20 text-xl font-bold"
            >
              ▶
            </button>
          </div>
        </section>
      </FadeInOnScroll>
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

      {/* Floating Chat Button */}
      <Link
        to="/ChatUser"
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-50"
      >
        <MessageSquareText className="w-6 h-6" />
      </Link>
    </div>
  );
}
