import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Bell, Coffee, Leaf, Award, MapPin, UserCircle } from "lucide-react"; // Tambah ikon baru
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useCart } from "./CartContext"; // Sesuaikan path jika berbeda

// Komponen reusable untuk section dengan animasi
const AnimatedSection = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({
    triggerOnce: true, // Animasi hanya berjalan sekali saat masuk view
    threshold: 0.1, // Aktif saat 10% elemen terlihat
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className="bg-white rounded-lg shadow-xl p-8 mb-8 hover:shadow-2xl transition-shadow duration-300"
    >
      {children}
    </motion.div>
  );
};

export default function ProfInfo() {
  const { cartItems } = useCart(); // Dapatkan item keranjang dari context

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 font-sans flex flex-col">
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
      <div
        className="relative w-full h-[300px] md:h-[400px] bg-cover bg-center flex items-center justify-center text-white p-4"
        style={{
          backgroundImage: "url('/img/cabang_sembilang.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay gelap */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
            Jelajahi Dunia Tomoro Coffee
          </h1>
          <p className="text-lg md:text-xl font-light max-w-2xl mx-auto">
            Kisah, komitmen, dan semangat di balik setiap cangkir kopi Tomoro.
          </p>
        </motion.div>
      </div>

      {/* Main Content: Company Profile with Animations */}
      <div className="flex-grow container mx-auto px-4 py-12">
        <AnimatedSection delay={0.2}>
          <h2 className="text-3xl font-bold text-orange-700 mb-4 flex items-center gap-3">
            <Coffee className="w-8 h-8" /> Tentang Kami
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Tomoro Coffee, sebuah nama yang kian populer di kancah perkopian
            Indonesia, hadir dengan dedikasi untuk menyajikan kopi berkualitas
            premium yang mudah diakses. Sejak didirikan, kami telah berkomitmen
            penuh untuk memilih biji kopi terbaik dari berbagai belahan dunia,
            memprosesnya dengan standar tertinggi, dan menyajikannya dengan
            sentuhan kehangatan yang khas.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Lebih dari sekadar minuman, kami percaya kopi adalah pengalaman,
            sebuah momen untuk jeda, refleksi, atau berbagi tawa. Filosofi ini
            tercermin dalam setiap aspek operasional kami, mulai dari desain
            outlet yang nyaman dan modern hingga pelayanan barista yang ramah
            dan sigap.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <h2 className="text-3xl font-bold text-orange-700 mb-4 flex items-center gap-3">
            <Award className="w-8 h-8" /> Visi & Misi
          </h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Visi:</h3>
            <p className="text-gray-700 leading-relaxed">
              Menjadi merek kopi yang paling dicintai dan berpengaruh di Asia
              Tenggara, menghadirkan pengalaman kopi yang luar biasa dan
              menginspirasi jutaan orang setiap hari.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Misi:</h3>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-1">
              <li>
                <b>Kualitas Tak Tertandingi:</b> Menyediakan produk kopi dan
                non-kopi yang konsisten berkualitas tinggi, menggunakan bahan
                baku terbaik dan proses yang cermat.
              </li>
              <li>
                <b>Inovasi Berkelanjutan</b>: Terus berinovasi dalam menu,
                teknologi, dan pengalaman pelanggan untuk tetap relevan dan
                menarik.
              </li>
              <li>
                <b>Aksesibilitas Luas:</b> Membangun jaringan outlet yang luas dan
                strategis, serta memperkuat kehadiran digital, agar kopi
                berkualitas kami mudah dijangkau.
              </li>
              <li>
                <b>Pengalaman Pelanggan Personal:</b> Menciptakan interaksi yang
                ramah, efisien, dan personal di setiap titik kontak, membuat
                pelanggan merasa dihargai.
              </li>
              <li>
                <b>Tanggung Jawab Sosial:</b> Berkontribusi positif pada masyarakat
                dan lingkungan melalui praktik bisnis yang berkelanjutan dan
                program komunitas.
              </li>
            </ul>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.6}>
          <h2 className="text-3xl font-bold text-orange-700 mb-4 flex items-center gap-3">
            <MapPin className="w-8 h-8" /> Jaringan di Indonesia
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Dari ibu kota hingga pelosok negeri, Tomoro Coffee telah menancapkan
            jejaknya dengan cepat di seluruh kepulauan Indonesia. Kami bangga
            dapat melayani masyarakat Indonesia melalui jaringan outlet yang
            terus berkembang, membawa budaya kopi modern ke lebih banyak kota.
            Setiap outlet dirancang untuk menjadi 'rumah kedua' bagi para
            pelanggan, tempat mereka dapat bersantai, bekerja, atau sekadar
            menikmati secangkir kopi favorit.
          </p>
          {/* Bagian ini diganti dengan iframe Google Maps */}
          <div className="flex justify-center my-6">
            <iframe
              src="http://maps.google.com/maps?q=tomoro+coffee+indonesia&output=embed"
              width="100%" // Mengatur lebar 100% agar responsif
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Jaringan Tomoro Coffee Indonesia" // Tambahkan judul untuk aksesibilitas
              className="rounded-lg shadow-lg border border-orange-200" // Tambahkan kelas Tailwind CSS
            ></iframe>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Ekspansi kami didukung oleh pemahaman mendalam tentang preferensi
            lokal dan komitmen untuk menyediakan pengalaman yang konsisten di
            mana pun Anda berada.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.8}>
          <h2 className="text-3xl font-bold text-orange-700 mb-4 flex items-center gap-3">
            <Award className="w-8 h-8" /> Pencapaian Utama
          </h2>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>
              <b>Ekspansi Kilat:</b> Lebih dari 700 outlet dibuka di Indonesia
              dalam kurun waktu kurang dari 3 tahun, menjadikannya salah satu
              rantai kopi dengan pertumbuhan tercepat.
            </li>
            <li>
              <b>Pengakuan Industri:</b> Dianugerahi sebagai "Merek Kopi Pendatang
              Baru Terbaik" dan "Inovasi Produk Terfavorit" pada ajang
              penghargaan industri kopi nasional 2024.
            </li>
            <li>
              <b>Basis Pelanggan Loyal:</b> Membangun komunitas pelanggan yang kuat
              dan setia, dengan tingkat retensi yang tinggi berkat program
              loyalitas yang menarik.
            </li>
            <li>
              <b>Inovasi Digital:</b> Peluncuran aplikasi mobile yang inovatif,
              memfasilitasi pemesanan mudah, pembayaran digital, dan penawaran
              personal.
            </li>
            <li>
              <b>Dampak Sosial:</b> Memberikan ribuan lapangan kerja dan aktif
              dalam berbagai inisiatif sosial, termasuk dukungan untuk petani
              kopi lokal dan program pendidikan.
            </li>
          </ul>
        </AnimatedSection>

        <AnimatedSection delay={1.0}>
          <h2 className="text-3xl font-bold text-orange-700 mb-4 flex items-center gap-3">
            <Leaf className="w-8 h-8" /> Komitmen Keberlanjutan
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Di Tomoro Coffee, kami berkomitmen untuk pertumbuhan yang
            berkelanjutan. Ini berarti kami tidak hanya fokus pada kualitas
            kopi, tetapi juga pada bagaimana kami berinteraksi dengan planet dan
            masyarakat. Inisiatif keberlanjutan kami meliputi:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
            <li>
              <b>Pengadaan Biji Kopi Bertanggung Jawab:</b> Bekerja sama langsung
              dengan petani yang menerapkan praktik pertanian berkelanjutan,
              memastikan keadilan harga dan dampak lingkungan yang minimal.
            </li>
            <li>
              <b>Pengelolaan Sampah:</b> Menerapkan program daur ulang di seluruh
              outlet dan mengurangi penggunaan plastik sekali pakai.
            </li>
            <li>
              <b>Efisiensi Energi:</b> Menggunakan peralatan hemat energi dan
              mendesain outlet dengan pencahayaan alami yang optimal.
            </li>
            <li>
              <b>Pemberdayaan Komunitas:</b> Mendukung program pelatihan untuk
              barista lokal dan inisiatif pengembangan di area penghasil kopi.
            </li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Kami percaya bahwa secangkir kopi yang baik harus terasa enak dan
            juga berdampak baik.
          </p>
        </AnimatedSection>
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