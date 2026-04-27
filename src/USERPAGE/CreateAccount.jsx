// // src/CreateAccount.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import { supabase } from '../supabase';
// import { Eye, EyeOff } from 'lucide-react';

// export default function CreateAccount() {
//   const [nama, setNama] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     if (!nama || !email || !password) {
//       Swal.fire("Peringatan", "Nama, Email, dan Password tidak boleh kosong!", "warning");
//       setIsSubmitting(false);
//       return;
//     }

//     if (password.length < 6) {
//       Swal.fire("Peringatan", "Password minimal harus 6 karakter.", "warning");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .from('users')
//         .insert([
//           {
//             nama: nama,
//             email: email,
//             pass: password,
//             role: 'customer',
//           },
//         ]);

//       if (error) {
//         console.error("Error creating account:", error.message);
//         let errorMessage = "Gagal membuat akun. Silakan coba lagi.";
//         if (error.code === '23505') {
//           errorMessage = "Email sudah terdaftar. Silakan gunakan email lain atau login.";
//         }
//         Swal.fire("Error", errorMessage, "error");
//       } else {
//         Swal.fire(
//           "Berhasil!",
//           "Akun Anda berhasil dibuat sebagai Customer. Silakan login.",
//           "success"
//         ).then(() => {
//           navigate('/Login');
//         });
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error.message);
//       Swal.fire("Error", "Terjadi kesalahan yang tidak terduga.", "error");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-white flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md">
//         <div className="text-center mb-8">
//           <img src="/img/Logo.png" alt="Logo Tomoro Coffee" className="h-16 mx-auto mb-4" />
//           <h1 className="text-3xl font-extrabold text-orange-700 mb-2">Buat Akun Baru</h1>
//           <p className="text-gray-600">Daftar sekarang untuk mulai berinteraksi dengan Tomoro Coffee!</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
//             <input
//               type="text"
//               id="nama"
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
//               placeholder="Masukkan nama lengkap Anda"
//               value={nama}
//               onChange={(e) => setNama(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//             <input
//               type="email"
//               id="email"
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500"
//               placeholder="email@contoh.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="relative">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 pr-10"
//               placeholder="Minimal 6 karakter"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6 text-gray-500 hover:text-gray-700"
//             >
//               {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//             </button>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? (
//               <>
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Mendaftar...
//               </>
//             ) : (
//               "Daftar Akun"
//             )}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-600 text-sm">
//           Sudah punya akun?{" "}
//           <Link to="/Login" className="text-orange-600 hover:text-orange-800 font-medium">
//             Login di sini
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function CreateAccount() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alamat, setAlamat] = useState(''); // State baru
  const [profilePicture, setProfilePicture] = useState(''); // State baru
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
        .insert([
          {
            nama: nama,
            email: email,
            pass: password,
            address: alamat,            // Field baru
            Profile_Picture: profilePicture, // Field baru
            role: 'customer',
          },
        ]);

      if (error) {
        console.error("Error creating account:", error.message);
        let errorMessage = "Gagal membuat akun.";
        if (error.code === '23505') {
          errorMessage = "Email sudah terdaftar.";
        }
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-orange-700">Buat Akun</h1>
          <p className="text-gray-600 text-sm mt-1">Lengkapi profil Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input type="text" className="w-full p-2 border rounded-lg" value={nama} onChange={(e) => setNama(e.target.value)} required />
          </div>

          {/* Input Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="w-full p-2 border rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {/* Input Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type={showPassword ? "text" : "password"} className="w-full p-2 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-8 text-gray-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Input Alamat */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Alamat</label>
            <textarea className="w-full p-2 border rounded-lg" rows="2" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
          </div>

          {/* Input URL Gambar */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Link Foto Profil (Opsional)</label>
            <input type="url" className="w-full p-2 border rounded-lg" placeholder="https://contoh.com/gambar.jpg" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700">
            {isSubmitting ? "Mendaftar..." : "Daftar Akun"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Sudah punya akun? <Link to="/Login" className="text-orange-600 font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}