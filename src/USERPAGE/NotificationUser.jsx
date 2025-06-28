import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, ShoppingCart, UserCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

const NotificationUser = () => {
  // Initial notifications data
  const initialNotifications = [
    {
      id: 1,
      type: "Discount Voucher",
      title: "Selamat Anda Mendapatkan Voucher Diskon",
      description: "20% Untuk Kategori Snacks Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales tortor eget elit sollicitudin, vel pharetra odio gravida. Maecenas sit amet cursus augue.",
      date: "24 Jun 2025",
      time: "11:00 am",
      actionText: "CLAIM!",
      actionLink: "#", // Ganti dengan link yang sesuai
      color: "bg-orange-100", // Warna latar belakang untuk notifikasi
      bellColor: "text-orange-500", // Warna ikon bell
      headerColor: "bg-orange-500", // Warna header notifikasi
    },
    {
      id: 2,
      type: "Limit Voucher",
      title: "Cepat Gunakan Voucher anda",
      description: "Voucher Diskon 10% Pada Kategori Coffee akan hangus pada tanggal 11 Apr 2025 at 00:00 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales tortor eget elit sollicitudin, vel pharetra odio gravida. Maecenas sit amet cursus augue. Ut",
      date: "9 Apr 2025",
      time: "1:00 pm",
      actionText: "CLAIM!",
      actionLink: "#",
      color: "bg-red-100",
      bellColor: "text-red-500",
      headerColor: "bg-red-500",
    },
    {
      id: 3,
      type: "New Product!",
      title: "Silahkan Coba Produk Baru KopiMint Coffee",
      description: "Diskon 10% pada 2 jam Setelah Perilisan! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales tortor eget elit sollicitudin, vel pharetra odio gravida. Maecenas sit amet cursus augue. Ut",
      date: "9 Apr 2025",
      time: "1:00 pm",
      actionText: "CHECK NOW!",
      actionLink: "#",
      color: "bg-green-100",
      bellColor: "text-green-500",
      headerColor: "bg-green-500",
    },
    {
      id: 4,
      type: "HAPPY BIRTHDAY!",
      title: "SELAMAT ULANG TAHUN! Jane Doe",
      description: "Pada Hari special kamu Kami Memberikan VOUCHER Diskon All Product 15%! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sodales tortor eget elit sollicitudin, vel pharetra odio gravida. Maecenas sit amet cursus augue.",
      date: "9 Apr 2025",
      time: "1:00 pm",
      actionText: "CLAIM NOW!",
      actionLink: "#",
      color: "bg-pink-100",
      bellColor: "text-pink-500",
      headerColor: "bg-pink-500",
    },
  ];

  // State to manage visible notifications (initially all notifications)
  const [visibleNotifications, setVisibleNotifications] = useState(initialNotifications.map(n => n.id));

  const handleClaim = (id) => {
    // Remove the notification from the visible list
    setVisibleNotifications(prev => prev.filter(notificationId => notificationId !== id));
    // Optionally, add logic here to handle the actual claim (e.g., send to API, show a success message)
    console.log(`Notification with ID ${id} claimed!`);
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.4 } }, // Dissolve effect on exit
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar Section */}
      <nav className="bg-white shadow-sm py-4 px-8">
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <div className="flex items-center gap-3">
            <img src="/img/Logo.png" alt="Logo" className="h-10" />{" "}
            <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
              TOMORO{" "}
              <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">
                COFFEE
              </span>
            </h1>
          </div>

          <nav className="flex gap-8 text-sm font-medium text-gray-700">
            <Link
              to="/HomeUser"
              className="hover:text-orange-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/MenuUser"
              className="hover:text-orange-500 transition-colors"
            >
              Menu
            </Link>
            <Link
              to="/ProfInfo" // Mengarahkan ke halaman profil
              className="hover:text-orange-500 transition-colors"
            >
              Story
            </Link>
            <Link
              to="/FAQUser"
              className="hover:text-orange-500 transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/FeedbackUser"
              className="hover:text-orange-500 transition-colors"
            >
              Feedback
            </Link>
            <Link
              to="/Lokasi"
              className="hover:text-orange-500 transition-colors"
            >
              Location
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* New: Profile Icon */}
            <Link to="/ProfileUser" className="text-orange-500 hover:text-orange-600">
              <UserCircle className="w-5 h-5" />
            </Link>
            {/* Existing icons */}
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
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Notifications
        </h1>

        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          <AnimatePresence> {/* Wrap with AnimatePresence */}
            {initialNotifications
              .filter(notification => visibleNotifications.includes(notification.id)) // Filter based on visibleNotifications state
              .map((notification, index) => (
                <motion.div
                  key={notification.id} // Key is crucial for AnimatePresence
                  variants={notificationVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit" // Add exit variant
                  transition={{ delay: index * 0.1, duration: 0.5 }} // Adjust duration for entry
                  className={`bg-white rounded-lg shadow-md overflow-hidden ${notification.color}`}
                >
                  <div className="flex items-center px-6 py-3">
                    <div className={`p-2 rounded-full ${notification.headerColor}`}>
                      <Bell className={`h-5 w-5 text-white`} />
                    </div>
                    <h3 className={`ml-3 font-semibold text-base ${notification.bellColor}`}>
                      {notification.type}
                    </h3>
                    <span className="ml-auto text-gray-500 text-xs flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {notification.date} at {notification.time}
                    </span>
                  </div>
                  <div className="p-6 pt-0">
                    <h4 className="font-bold text-lg mb-2">{notification.title}</h4>
                    <p className="text-gray-700 text-sm mb-4">
                      {notification.description}
                    </p>
                    <button // Changed from Link to button for the claim action
                      onClick={() => handleClaim(notification.id)}
                      className="inline-block bg-orange-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors"
                    >
                      {notification.actionText}
                    </button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
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

export default NotificationUser;