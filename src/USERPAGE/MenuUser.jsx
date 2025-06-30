import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Bell, ChevronDown, ChevronUp, UserCircle } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabase"; // Pastikan path ini benar (relative ke src/)
import { useCart } from "./CartContext";

// Komponen reusable untuk animasi scroll
const SectionWithOffers = ({ title, data, selectedCategory }) => { // Tambahkan selectedCategory prop
  const [isExpanded, setIsExpanded] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const { addToCart } = useCart();

  const [addedItemId, setAddedItemId] = useState(null);

  // Pagination states for "All Menus"
  const isAllMenusSection = title.includes("Menus"); // Ubah pengecekan title agar fleksibel
  const itemsPerPage = 12; // 3 kolom x 4 baris = 12 items per page
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed page

  // Calculate filtered and paginated data
  const paginatedData = useMemo(() => {
    let filteredData = data;
    if (isAllMenusSection && selectedCategory && selectedCategory !== "All") {
      filteredData = data.filter(item => item.kategori === selectedCategory);
    }

    if (!isAllMenusSection) {
      return filteredData; // No pagination for other sections
    }
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [data, currentPage, isAllMenusSection, itemsPerPage, selectedCategory]); // Tambahkan selectedCategory sebagai dependency

  const totalPages = useMemo(() => {
    let filteredData = data;
    if (isAllMenusSection && selectedCategory && selectedCategory !== "All") {
      filteredData = data.filter(item => item.kategori === selectedCategory);
    }
    if (!isAllMenusSection) {
      return 1;
    }
    return Math.ceil(filteredData.length / itemsPerPage);
  }, [data.length, isAllMenusSection, itemsPerPage, selectedCategory]); // Tambahkan selectedCategory sebagai dependency

  // Modifikasi fungsi ini untuk memicu animasi dengan mengubah key AnimatePresence
  const goToNextPage = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    // Reset to first page when category changes
    setCurrentPage(0);
  }, [selectedCategory]);

  const handleAddToCart = (item) => {
    addToCart(item);
    setAddedItemId(item.id);

    setTimeout(() => {
      setAddedItemId(null);
    }, 1500);
  };

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
      <AnimatePresence mode='wait' initial={false}> {/* Tambahkan mode='wait' */}
        {isExpanded && (
          // Tambahkan key={currentPage} di sini untuk memicu AnimatePresence
          <motion.div
            key={isAllMenusSection ? `${currentPage}-${selectedCategory}` : "content"} // Key akan berubah saat currentPage atau selectedCategory berubah
            initial={{ opacity: 0, y: 20 }} // Animasi masuk dari bawah sedikit
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} // Animasi keluar ke atas sedikit
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="relative"> {/* Added relative for positioning buttons */}
              {/* Pagination controls for "All Menus" */}
              {isAllMenusSection && totalPages > 1 && (
                <>
                  <button
                    onClick={goToPrevPage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="text-gray-600" />
                  </button>
                  <button
                    onClick={goToNextPage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 p-2 rounded-full shadow-md z-10 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    aria-label="Next page"
                  >
                    <ChevronRight className="text-gray-600" />
                  </button>
                </>
              )}

              {/* PERUBAHAN UTAMA DI SINI: grid-cols-3 untuk 3 kolom */}
              {/* Mengurangi padding horizontal agar lebih leluasa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4 md:px-8">
                {paginatedData.map((item, i) => (
                  <motion.div
                    key={item.id || i} // Key unik untuk setiap item agar animasi list berjalan
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    className="relative overflow-hidden border rounded-xl p-4 shadow hover:shadow-md transition-all bg-white"
                  >
                    {/* Gambar produk di kanan atas */}
                    <img
                      src={item.gambar || "/img/default-product.png"}
                      alt={item.nama}
                      className="absolute top-2 right-2 w-24 h-24 object-contain z-0"
                    />

                    {/* Konten teks */}
                    <div className="relative z-10 pr-28">
                      <h4 className="font-semibold text-base">{item.nama}</h4>
                      <p className="text-xs text-gray-500 my-1 line-clamp-2">
                        {item.deskripsi}
                      </p>
                      <p className="font-semibold mt-2">
                        Rp{item.harga?.toLocaleString("id-ID")}
                      </p>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className={`mt-4 font-semibold py-1 px-4 rounded-full text-sm transition-colors duration-300
                          ${addedItemId === item.id
                            ? "bg-green-500 text-white"
                            : "border border-orange-400 text-orange-500 hover:bg-orange-100"
                          }`}
                      >
                        {addedItemId === item.id ? "Ditambahkan! ✓" : "Tambah"}
                      </button>
                    </div>
                  </motion.div>
                ))}
                {paginatedData.length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    Tidak ada menu yang tersedia untuk kategori ini.
                  </div>
                )}
              </div>
              {isAllMenusSection && totalPages > 1 && (
                <div className="text-center mt-4 text-sm text-gray-600">
                  Halaman {currentPage + 1} dari {totalPages}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

// --- KOMPONEN MENUUSER ---
const MenuUser = () => {
  const [specialOffers, setSpecialOffers] = useState([]);
  const [returneeOffers, setReturneeOffers] = useState([]);
  const [lowSugar, setLowSugar] = useState([]);
  const [latestOrders, setLatestOrders] = useState([]);
  const [allMenus, setAllMenus] = useState([]); // This will hold all product data for "All Menus"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All"); // State baru untuk filter kategori

  const { cartItems } = useCart();
  const [user, setUser] = useState(null); // State untuk menyimpan objek user dari Supabase

  const categories = ["All", "Classic Coffee", "Food and Bakery", "Non Coffee"]; // Daftar kategori yang tersedia
  const location = useLocation(); // Tambahkan useLocation

  useEffect(() => {
    // Fungsi untuk mendapatkan sesi pengguna dan mendengarkan perubahan status otentikasi
    const getSessionAndListen = async () => {
      // Dapatkan sesi awal
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Error getting session:", sessionError.message);
      }
      setUser(session?.user || null); // Set user jika ada sesi

      // Dengarkan perubahan status otentikasi (login/logout)
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", _event, session);
        setUser(session?.user || null); // Update user state saat ada perubahan otentikasi
      });

      // Cleanup listener saat komponen di-unmount
      return () => {
        authListener.subscription.unsubscribe();
      };
    };

    getSessionAndListen();
  }, []); // Hanya jalankan sekali saat komponen mount untuk setup listener

  useEffect(() => {
    const fetchUserDataAndProducts = async () => {
      setLoading(true);
      try {
        let currentUserStatus = 'Non-Member'; // Default status

        // Jika ada user yang login (dari state 'user' yang diisi oleh useEffect sebelumnya)
        if (user) {
          const currentUserId = user.id;
          console.log("Logged-in user ID:", currentUserId);

          // Ambil data profil pengguna dari tabel 'customers'
          const { data: customerData, error: customerError } = await supabase
            .from("customers")
            .select("status_member") // Asumsi ada kolom 'status_member' di tabel 'customers'
            .eq("id_user", currentUserId) // Asumsi ada kolom 'id_user' di tabel 'customers' yang merujuk ke auth.users.id
            .single();

          if (customerError && customerError.code !== 'PGRST116') { // PGRST116 means no rows found for single()
            console.warn("Error fetching customer data:", customerError.message);
          } else if (customerData) {
            currentUserStatus = customerData.status_member;
            console.log("User membership status:", currentUserStatus);
          }
        } else {
          console.log("No user logged in. Displaying default public menu.");
        }

        // --- Fetch semua produk dari database ---
        const { data: produkData, error: produkError } = await supabase.from("produk").select("*");
        if (produkError) {
          console.error("Supabase Error fetching products:", produkError.message);
          throw produkError;
        }

        console.log("Fetched all products from Supabase:", produkData);

        if (produkData && produkData.length > 0) {
          let filteredSpecialOffers = [];
          let filteredReturneeOffers = [];
          let filteredLowSugar = [];
          let filteredLatestOrders = [];

          // Logika untuk memfilter produk berdasarkan status member
          switch (currentUserStatus) {
            case 'Gold':
              console.log("Applying Gold Member offers.");
              filteredSpecialOffers = produkData.filter(p => p.kategori === 'Premium Offers').slice(0, 3);
              filteredReturneeOffers = produkData.filter(p => p.kategori === 'Gold Member Exclusive' || p.kategori === 'Speciality Coffee').slice(0, 3);
              filteredLowSugar = produkData.filter(p => p.deskripsi?.toLowerCase().includes("rendah gula") || p.kategori === 'Herbal Tea').slice(0, 3);
              filteredLatestOrders = produkData.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
              break;
            case 'Silver':
              console.log("Applying Silver Member offers.");
              filteredSpecialOffers = produkData.filter(p => p.kategori === 'SPECIAL OFFER' || p.harga < 25000).slice(0, 3);
              filteredReturneeOffers = produkData.filter(p => p.kategori === 'Classic Coffee' || p.kategori === 'Milk Based').slice(0, 3);
              filteredLowSugar = produkData.filter(p => p.deskripsi?.toLowerCase().includes("rendah gula") || p.kategori === "Non Coffee").slice(0, 3);
              filteredLatestOrders = produkData.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
              break;
            case 'Bronze':
              console.log("Applying Bronze Member offers.");
              filteredSpecialOffers = produkData.filter(p => p.kategori === "Bronze Promo" || p.harga < 20000).slice(0, 3);
              filteredReturneeOffers = produkData.filter(p => p.kategori === "New Release").slice(0, 0); // No returnee offers for bronze in original logic
              filteredLowSugar = produkData.filter(p => p.deskripsi?.toLowerCase().includes("low sugar")).slice(0, 3);
              filteredLatestOrders = produkData.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
              break;
            default: // Termasuk 'Non-Member' atau status yang belum terdefinisi
              console.log("Applying default public offers.");
              filteredSpecialOffers = produkData.filter(p => p.kategori === "SPECIAL OFFER" || p.harga < 30000).slice(0, 3);
              filteredReturneeOffers = produkData.filter(p => p.kategori === "Classic Coffee" || p.harga > 30000).slice(0, 3);
              filteredLowSugar = produkData.filter(p => p.deskripsi?.toLowerCase().includes("rendah gula") || p.kategori === "Non Coffee").slice(0, 3);
              filteredLatestOrders = produkData.sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 3);
              break;
          }

          setSpecialOffers(filteredSpecialOffers);
          setReturneeOffers(filteredReturneeOffers);
          setLowSugar(filteredLowSugar);
          setLatestOrders(filteredLatestOrders);
          setAllMenus(produkData); // Set all products to allMenus
        } else {
          console.warn("Tidak ada produk ditemukan di tabel 'produk' Supabase. Pastikan tabel terisi dan RLS mengizinkan akses.");
          setSpecialOffers([]);
          setReturneeOffers([]);
          setLowSugar([]);
          setLatestOrders([]);
          setAllMenus([]);
        }
      } catch (err) {
        console.error("Kesalahan fatal saat memuat produk di MenuUser:", err.message);
        setError("Gagal memuat produk. Silakan coba lagi nanti. Detail: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndProducts();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Memuat produk...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

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
          <Link to="/CartUser" className="text-orange-500 hover:text-orange-600 relative">
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </Link>
          <Link
            to="/NotificationUser"
            className="text-orange-500 hover:text-orange-600"
          >
            <Bell className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Promo Poster - No change needed here */}
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
        <SectionWithOffers
          title="Special Offers For You"
          data={specialOffers}
        />
        <SectionWithOffers
          title="Returnee Special Offers"
          data={returneeOffers}
        />
        <SectionWithOffers title="Low Sugars Type Person" data={lowSugar} />
        <SectionWithOffers
          title="Based on Your Latest Order"
          data={latestOrders}
        />

        {/* Filter buttons for All Menus */}
        <div className="mt-12">
          <h3 className="text-xl md:text-2xl font-bold border-b-2 border-orange-500 pb-1 mb-4">
            {/* Judul statis "All Menus" sebelum filtering, tidak perlu diubah */}
All Menu List
          </h3>
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`py-2 px-5 rounded-full text-sm font-semibold transition-colors duration-300
                  ${selectedCategory === category
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Pass allMenus AND selectedCategory to the SectionWithOffers for "All Menus" */}
          <SectionWithOffers
            title={selectedCategory === "All" ? "All Menus" : `${selectedCategory} Menus`}
            data={allMenus}
            selectedCategory={selectedCategory}
          />
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

export default MenuUser;