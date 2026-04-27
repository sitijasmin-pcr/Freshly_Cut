// import React, { useState, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { AuthContext } from './App'; // Sesuaikan path jika AuthContext tidak di App.jsx

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const { login, userRole } = useContext(AuthContext); // Ambil fungsi login dan userRole dari konteks
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError(''); // Bersihkan error sebelumnya

//     const success = login(email, password); // Panggil fungsi login dari AuthContext

//     if (success) {
//       // Arahkan berdasarkan peran pengguna
//       if (userRole === 'admin') {
//         navigate('/dashboard'); // Arahkan admin ke dashboard admin
//       } else {
//         navigate('/HomeUser'); // Arahkan customer ke halaman user HomeUser
//       }
//     } else {
//       setError('Invalid email or password. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
//         {/* Logo Tomoro Coffee di tengah atas form */}
//         <div className="flex justify-center mb-6">
//           <img src="/img/Logo.png" alt="Tomoro Coffee Logo" className="h-20" />
//         </div>

//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
//               Email
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="mb-6">
//             <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//             {/* Forget Password Link */}
//             <div className="text-right">
//               <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-800">
//                 Forgot Password?
//               </Link>
//             </div>
//           </div>

//           {error && (
//             <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>
//           )}

//           <div className="flex items-center justify-between mb-4">
//             <button
//               type="submit"
//               className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//             >
//               Login
//             </button>
//           </div>
//         </form>

//         {/* Create Account Link */}
//         <p className="text-center text-gray-600 text-sm">
//           Don't have an account?{' '}
//           <Link to="/CreateAccount" className="font-bold text-orange-500 hover:text-orange-800">
//             Create an account
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './App'; 
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, userRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);

    if (success) {
      if (userRole === 'admin') {
        navigate('/laporan');
      } else {
        navigate('/HomeUser');
      }
    } else {
      setError('Email atau password salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden font-sans antialiased">
      {/* Background Decor (Bulatan Oranye halus agar tidak kaku) */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-orange-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-30"></div>

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 relative z-10 animate-in fade-in zoom-in duration-500">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 mb-4">
            <img src="/img/Logo.png" alt="Tomoro Coffee Logo" className="h-16 object-contain" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Selamat Datang</h2>
          <p className="text-gray-400 text-sm mt-1 font-medium">Silakan login ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wider">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                id="email"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all duration-200 text-gray-700 shadow-sm"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-gray-700 text-xs font-bold uppercase tracking-wider">
                Kata Sandi
              </label>
              <Link to="/forgot-password" size={16} className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors">
                Lupa Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                id="password"
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white outline-none transition-all duration-200 text-gray-700 shadow-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-center gap-3 animate-shake">
              <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
              <p className="text-red-700 text-xs font-medium italic">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-800 hover:bg-green-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-orange-100 transition-all active:scale-[0.98] group mt-2"
          >
            LOGIN SEKARANG
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Belum punya akun?{' '}
            <Link to="/CreateAccount" className="font-bold text-green-600 hover:text-green-700 transition-colors underline-offset-4 hover:underline">
              Daftar Disini
            </Link>
          </p>
        </div>
      </div>

      {/* Tambahan Animasi via CSS inline */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
};

export default Login;