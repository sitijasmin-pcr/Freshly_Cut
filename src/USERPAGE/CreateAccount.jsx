import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../supabase';
import { Eye, EyeOff, User, Mail, Lock, MapPin, Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function CreateAccount() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alamat, setAlamat] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!nama || !email || !password || !alamat) {
      Swal.fire("Peringatan", "Semua field wajib diisi!", "warning");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      Swal.fire("Peringatan", "Password minimal harus 6 karakter.", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          nama: nama,
          email: email,
          pass: password,
          address: alamat,
          Profile_Picture: profilePicture,
          role: 'customer',
        }]);

      if (error) {
        let errorMessage = "Gagal membuat akun.";
        if (error.code === '23505') errorMessage = "Email sudah terdaftar.";
        Swal.fire("Error", errorMessage, "error");
      } else {
        Swal.fire("Berhasil!", "Akun berhasil dibuat. Silakan login.", "success")
          .then(() => navigate('/Login'));
      }
    } catch (error) {
      Swal.fire("Error", "Terjadi kesalahan yang tidak terduga.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden font-sans antialiased">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 relative z-10 animate-in fade-in zoom-in duration-500">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 mb-4">
            <img src="src/assets/FreshlyLogo.png" alt="Logo" className="h-16 object-contain" />
          </div>
          <h2 className="text-3xl font-black text-green-800 tracking-tight">Buat Akun</h2>
          <p className="text-gray-400 text-sm mt-1 font-medium">Lengkapi profil Anda untuk bergabung</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="text" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all duration-200 text-gray-700 shadow-sm" placeholder="John Doe" value={nama} onChange={(e) => setNama(e.target.value)} required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="email" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all duration-200 text-gray-700 shadow-sm" placeholder="email@contoh.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type={showPassword ? "text" : "password"} className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all duration-200 text-gray-700 shadow-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">Alamat</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-4 text-gray-400" size={18} />
              <textarea className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all duration-200 text-gray-700 shadow-sm" rows="2" placeholder="Jl. Contoh No. 123" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">Link Foto Profil (Opsional)</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="url" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all duration-200 text-gray-700 shadow-sm" placeholder="https://..." value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-orange-100 transition-all active:scale-[0.98] group mt-4">
            {isSubmitting ? "Memproses..." : "DAFTAR SEKARANG"}
            {!isSubmitting && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Sudah punya akun?{' '}
            <Link to="/Login" className="font-bold text-green-600 hover:text-green-700 transition-colors underline-offset-4 hover:underline">
              Login Disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}