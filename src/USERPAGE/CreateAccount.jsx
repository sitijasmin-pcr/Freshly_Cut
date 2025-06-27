// src/CreateAccount.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import Swal from 'sweetalert2'; // For notifications
import { supabase } from '../supabase'; // Ensure this path is correct for your Supabase client
import { Eye, EyeOff } from 'lucide-react'; // For password visibility toggle icons

export default function CreateAccount() {
  // State for form fields
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Only one password field
  // State for submission status and password visibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Hook for programmatic navigation (redirect after success)

  // Handle form submission for creating a new account
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set submitting state to true

    // Basic client-side validation for all required fields (nama, email, password)
    if (!nama || !email || !password) {
      Swal.fire("Peringatan", "Nama, Email, dan Password tidak boleh kosong!", "warning");
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    // Password length validation
    if (password.length < 6) {
      Swal.fire("Peringatan", "Password minimal harus 6 karakter.", "warning");
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    try {
      // Insert user data into the 'users' table using Supabase
      // The 'role' field is automatically set to 'customer' here.
      // Note: In a production application, passwords should be hashed server-side for security.
      const { error } = await supabase
        .from('users')
        .insert([
          {
            nama: nama,
            email: email,
            pass: password,
            role: 'customer', // Automatically assign 'customer' role
          },
        ]);

      if (error) {
        // Log the error to console for debugging
        console.error("Error creating account:", error.message);
        let errorMessage = "Gagal membuat akun. Silakan coba lagi.";
        // Check for specific error codes, e.g., unique constraint violation for email
        if (error.code === '23505') { // Common Supabase code for unique violation
            errorMessage = "Email sudah terdaftar. Silakan gunakan email lain atau login.";
        }
        Swal.fire("Error", errorMessage, "error"); // Show error notification to user
      } else {
        // Show success notification
        Swal.fire(
          "Berhasil!",
          "Akun Anda berhasil dibuat sebagai Customer. Silakan login.",
          "success"
        ).then(() => {
          // Redirect to the login page after successful registration
          navigate('/Login');
        });
      }
    } catch (error) {
      // Catch any unexpected errors during the process
      console.error("Unexpected error:", error.message);
      Swal.fire("Error", "Terjadi kesalahan yang tidak terduga.", "error");
    } finally {
      setIsSubmitting(false); // Always reset submitting state regardless of success or failure
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md">
        <div className="text-center mb-8">
          {/* Logo and title section */}
          <img src="/img/Logo.png" alt="Logo Tomoro Coffee" className="h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">Buat Akun Baru</h1>
          <p className="text-gray-600">Daftar sekarang untuk mulai berinteraksi dengan Tomoro Coffee!</p>
        </div>

        {/* Account creation form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              id="nama"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Masukkan nama lengkap Anda"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input with visibility toggle */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pr-10"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center pt-6 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* Show appropriate icon */}
            </button>
          </div>

          {/* Submit Button with loading indicator */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? (
              // Loading spinner and text when submitting
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mendaftar...
              </>
            ) : (
              "Daftar Akun" // Default button text
            )}
          </button>
        </form>

        {/* Link to Login page */}
        <p className="mt-6 text-center text-gray-600 text-sm">
          Sudah punya akun?{" "}
          <Link to="/Login" className="text-indigo-600 hover:text-indigo-800 font-medium">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
