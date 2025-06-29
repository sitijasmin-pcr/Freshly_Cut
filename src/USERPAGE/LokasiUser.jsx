import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Bell, MapPin, Plus, UserCircle } from "lucide-react"; // Tambah ikon Plus
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCart } from './CartContext'; // Sesuaikan path jika berbeda

// Komponen reusable untuk outlet card dengan animasi
const OutletCard = ({ outlet, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 cursor-pointer overflow-hidden"
    >
      <div className="h-60 overflow-hidden rounded-t-xl">
        <img
          src={outlet.imageUrl}
          alt={outlet.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x240/E8DED1/333333?text=Gambar+Tidak+Tersedia"; }} // Fallback image
        />
      </div>
      <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-bold text-gray-800">{outlet.name}</h2>
        <a
          href={outlet.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md flex items-center gap-2 transition-colors"
        >
          <MapPin className="w-4 h-4" /> Directions
        </a>
      </div>
    </motion.div>
  );
};

export default function LokasiUser() {
  const [outlets, setOutlets] = useState([
    {
      name: "Tomoro Coffee Riau",
      mapsUrl: "https://maps.app.goo.gl/hP4ihiRr3zkdHcGZA",
      imageUrl: "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/65/2024/09/26/21-1867463046.jpg",
    },
    {
      name: "Tomoro Coffee Hangtuah",
      mapsUrl: "https://maps.app.goo.gl/PcfR4QRvZ1Y9bEEaA",
      imageUrl: "https://cdn.8mediatech.com/gambar/59477904392-tomoro_coffee_lakukan_restrukturisasi_kepemimpinan,_lulu_yang_resmi_jabat_ceo_global.jpg",
    },
    {
      name: "Tomoro Coffee Sembilang",
      mapsUrl: "https://maps.app.goo.gl/Ji6yBRXRYdm2WYJc9",
      imageUrl: "https://jiaksimipng.wordpress.com/wp-content/uploads/2024/10/04a42838-a066-4fd4-b72b-577c16840b9e-1.jpg?w=1024",
    },
    {
      name: "Tomoro Coffee Gobah",
      mapsUrl: "https://maps.app.goo.gl/gVN1xa6r7j8Zgfze6",
      imageUrl: "https://jiaksimipng.wordpress.com/wp-content/uploads/2024/05/7bbe9084-e426-473d-aae6-bc5c1a195671-1.jpg?w=1024",
    },
    {
      name: "Tomoro Coffee Sudirman",
      mapsUrl: "https://maps.app.goo.gl/EXAMPLE1",
      imageUrl: "https://tomorocoffee.com/upload/aboutus/1715072049_logo.jpg",
    },
    {
      name: "Tomoro Coffee Panam",
      mapsUrl: "https://maps.app.goo.gl/EXAMPLE2",
      imageUrl: "https://tomorocoffee.com/upload/aboutus/1715072049_logo.jpg",
    },
  ]);

  const [newOutlet, setNewOutlet] = useState({
    name: "",
    mapsUrl: "",
    imageUrl: "",
  });

  const [showForm, setShowForm] = useState(false);
  const { cartItems } = useCart(); // Dapatkan item keranjang dari context

  const handleAddOutlet = () => {
    if (newOutlet.name && newOutlet.mapsUrl && newOutlet.imageUrl) {
      setOutlets([...outlets, { ...newOutlet, id: outlets.length + 1 }]); // Tambah ID unik
      setNewOutlet({ name: "", mapsUrl: "", imageUrl: "" });
      setShowForm(false);
    } else {
      console.log("Semua field harus diisi untuk menambahkan outlet baru.");
      // Anda bisa menampilkan pesan error di UI di sini
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans flex flex-col">
      {/* Navbar Section */}
      <nav className="bg-white shadow-lg py-4 px-8 sticky top-0 z-50">
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
              className={`transition-colors ${location.pathname === "/HomeUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Home
            </Link>
            <Link
              to="/MenuUser"
              className={`transition-colors ${location.pathname === "/MenuUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Menu
            </Link>
            <Link
              to="/ProfInfo"
              className={`transition-colors ${location.pathname === "/ProfInfo"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Story
            </Link>
            <Link
              to="/FAQUser"
              className={`transition-colors ${location.pathname === "/FAQUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              FAQ
            </Link>
            <Link
              to="/FeedbackUser"
              className={`transition-colors ${location.pathname === "/FeedbackUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Feedback
            </Link>
            <Link
              to="/lokasi"
              className={`transition-colors ${location.pathname === "/lokasi"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
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

      {/* Hero Section */}
      <div className="relative w-full h-[250px] md:h-[350px] bg-cover bg-center flex items-center justify-center text-white p-4"
        style={{ backgroundImage: "url('https://tomorocoffee.com/upload/banner/1709623887_WEB%20TOMORO%20COFFEE.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
            Temukan Tomoro Coffee Terdekat
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            Jelajahi seluruh outlet kami di berbagai kota di Indonesia.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Lokasi Outlet Kami
        </h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-10">
          Nikmati kopi berkualitas di outlet Tomoro Coffee terdekat Anda. Temukan kami di berbagai penjuru kota!
        </p>

        {/* Tombol Tampilkan/Sembunyikan Form Tambah Outlet (untuk admin/development) */}

        {/* Form Tambah Outlet */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-12"
          >
            <h3 className="text-xl font-bold text-orange-600 mb-4">Form Tambah Outlet</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Nama Outlet"
                value={newOutlet.name}
                onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="text"
                placeholder="URL Google Maps"
                value={newOutlet.mapsUrl}
                onChange={(e) => setNewOutlet({ ...newOutlet, mapsUrl: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="text"
                placeholder="URL Gambar Outlet"
                value={newOutlet.imageUrl}
                onChange={(e) => setNewOutlet({ ...newOutlet, imageUrl: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="text-right">
              <button
                onClick={handleAddOutlet}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition-colors"
              >
                Simpan Outlet Baru
              </button>
            </div>
          </motion.div>
        )}

        {/* Daftar Outlet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {outlets.map((outlet, idx) => (
            <OutletCard key={idx} outlet={outlet} delay={idx * 0.1} />
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <footer className="relative mt-20 w-full text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/image 48.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
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
        <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
          Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
        </div>
      </footer>
    </div>
  );
}
