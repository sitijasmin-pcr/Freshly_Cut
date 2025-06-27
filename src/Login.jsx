import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './App'; // Sesuaikan path jika AuthContext tidak di App.jsx

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, userRole } = useContext(AuthContext); // Ambil fungsi login dan userRole dari konteks
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Bersihkan error sebelumnya

    const success = login(email, password); // Panggil fungsi login dari AuthContext

    if (success) {
      // Arahkan berdasarkan peran pengguna
      if (userRole === 'admin') {
        navigate('/dashboard'); // Arahkan admin ke dashboard admin
      } else {
        navigate('/HomeUser'); // Arahkan customer ke halaman user HomeUser
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        {/* Logo Tomoro Coffee di tengah atas form */}
        <div className="flex justify-center mb-6">
          <img src="/img/Logo.png" alt="Tomoro Coffee Logo" className="h-20" />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* Forget Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="inline-block align-baseline font-bold text-sm text-orange-500 hover:text-orange-800">
                Forgot Password?
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>
          )}

          <div className="flex items-center justify-between mb-4">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Login
            </button>
          </div>
        </form>

        {/* Create Account Link */}
        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/CreateAccount" className="font-bold text-orange-500 hover:text-orange-800">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;