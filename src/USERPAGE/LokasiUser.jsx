import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function LokasiUser() {
  return (
    <div className="font-sans bg-[#FDFBE2] min-h-screen">
      {/* --- HEADER (Tetap sesuai branding Anda) --- */}
      <header className="px-4 py-6">
        <nav className="bg-[#2D5A27] rounded-full max-w-5xl mx-auto py-3 px-8 flex justify-between items-center text-white shadow-lg">
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-yellow-400">Home</Link>
            <Link to="/menu" className="hover:text-yellow-400">Menu</Link>
          </div>
          <img src="/img/logo-freshly-cut.png" alt="Logo" className="h-10 w-10 object-contain" />
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/tentang" className="hover:text-yellow-400">Tentang</Link>
            <Link to="/lokasi" className="text-yellow-400 font-bold">Lokasi</Link>
            <Link to="/Login" className="hover:text-yellow-400">Login</Link>
          </div>
        </nav>
      </header>

      {/* --- HERO SECTION (Style Bingxue) --- */}
      <section className="pt-16 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-black text-[#2D5A27] mb-4 uppercase tracking-tight">
            Hubungi Kami!
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Sentuhan Hati dalam Setiap Sajian: Pesanan Anda Dibuat dengan Penuh Ketulusan.
          </p>
        </motion.div>
      </section>

      {/* --- MAIN CONTENT (Grid Layout) --- */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* Kolom Kiri: Informasi Kontak */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-[#2D5A27] mb-2">FRESHLY CUT</h2>
              <p className="text-xl text-[#A3C982] font-semibold italic">Selangkah menuju kesegaran alami</p>
            </div>

            <div className="space-y-6">
              {/* Hotline */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border-l-8 border-[#F3B414]">
                <div className="bg-[#FDFBE2] p-3 rounded-full">
                  <Phone className="text-[#2D5A27]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase">Hotline Pelanggan</p>
                  <p className="text-lg font-bold text-[#2D5A27]">0812-3456-7890</p>
                </div>
              </div>

              {/* Alamat */}
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm border-l-8 border-[#2D5A27]">
                <div className="bg-[#FDFBE2] p-3 rounded-full">
                  <MapPin className="text-[#2D5A27]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase">Alamat Kami</p>
                  <p className="text-md font-medium text-gray-700">
                    Jl. Umban Sari, Rumbai, Pekanbaru<br/>
                    (Area Lingkungan Politeknik Caltex Riau)
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border-l-8 border-[#F3B414]">
                <div className="bg-[#FDFBE2] p-3 rounded-full">
                  <Mail className="text-[#2D5A27]" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-bold uppercase">Email Support</p>
                  <p className="text-lg font-bold text-[#2D5A27]">hello@freshlycut.id</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Kolom Kanan: Map & Button */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-3 rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              {/* Placeholder untuk Map atau Gambar Store */}
              <div className="w-full h-80 bg-gray-200 rounded-2xl relative overflow-hidden group">
                <iframe
                  title="Map PCR"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.620977691688!2d101.4231846!3d0.5710667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5ab6708602e1d%3A0x199434d74967f1ee!2sPoliteknik%20Caltex%20Riau!5e0!3m2!1sid!2sid!4v1714200000000!5m2!1sid!2sid"
                  className="w-full h-full border-0"
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#2D5A27] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#1e3d1a] transition-all shadow-lg"
              >
                <MapPin size={20} />
                Petunjuk Arah (Google Maps)
              </a>
              <button className="flex items-center justify-center gap-2 w-full bg-[#F3B414] text-[#2D5A27] py-4 rounded-2xl font-bold text-lg hover:bg-yellow-500 transition-all shadow-lg">
                <MessageSquare size={20} />
                Kritik & Saran
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* --- FLOATING ACTION (Optional, mengikuti style Bingxue) --- */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4">
        <a href="https://wa.me/yournumber" className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform">
          <Phone size={28} />
        </a>
      </div>
    </div>
  );
}