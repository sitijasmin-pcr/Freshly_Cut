import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function TentangUser() {
  return (
    <div className="font-sans bg-[#FDFBE2] min-h-screen">
      {/* --- HEADER --- */}
      <header className="px-4 py-6">
        <nav className="bg-[#2D5A27] rounded-full max-w-4xl mx-auto py-3 px-8 flex justify-between items-center text-white shadow-lg">
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-yellow-400">
              Home
            </Link>
            <Link to="/menu" className="hover:text-yellow-400">
              Menu
            </Link>
          </div>
          <img
            src="/img/logo-freshly-cut.png"
            alt="Logo"
            className="h-10 w-10 object-contain"
          />
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/tentang" className="text-yellow-400 font-bold">
              Tentang
            </Link>
            <Link to="/lokasi" className="hover:text-yellow-400">
              Lokasi
            </Link>
            <Link to="/Login" className="hover:text-yellow-400">
              Login
            </Link>
          </div>
        </nav>
      </header>

      {/* Content Tentang */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-serif font-bold text-[#2D5A27] mb-8">Tentang Kami</h1>
          
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-left space-y-6">
            <p className="text-gray-700 leading-relaxed">
              <strong>Freshly Cut</strong> hadir sebagai solusi camilan sehat bagi civitas akademika di lingkungan Politeknik Caltex Riau (PCR). Kami percaya bahwa makanan sehat tidak harus membosankan.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Fokus utama kami adalah menyediakan buah potong dan salad buah yang diproses secara higienis, menggunakan bahan-bahan segar pilihan yang dipotong langsung saat pesanan diterima (made-to-order).
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="bg-[#A3C982]/20 p-6 rounded-2xl">
                <h3 className="font-bold text-[#2D5A27] mb-2">Visi Kami</h3>
                <p className="text-sm text-gray-600">Menjadi penyedia camilan sehat terpercaya yang mendukung pola hidup aktif mahasiswa.</p>
              </div>
              <div className="bg-[#A3C982]/20 p-6 rounded-2xl">
                <h3 className="font-bold text-[#2D5A27] mb-2">Komitmen</h3>
                <p className="text-sm text-gray-600">Standar kebersihan food-grade dan penggunaan bahan 100% segar tanpa pengawet.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}