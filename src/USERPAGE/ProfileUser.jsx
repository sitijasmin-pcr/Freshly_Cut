// src/USERPAGE/ProfileUser.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../supabase';
import { AuthContext } from '../App'; // Ensure this path is correct
import { UserCircle, ShoppingCart, Bell } from 'lucide-react'; // Icons for the header

export default function ProfileUser() {
  const { userEmail, isAuthenticated, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    id: null, // Keep id as null initially if no user is loaded or found in DB
    nama: '',
    role: '',
    title: '',
    email: '',
    address: '',
    Profile_Picture: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log("ProfileUser useEffect triggered.");
      console.log("ProfileUser useEffect - isAuthLoading:", isAuthLoading);
      console.log("ProfileUser useEffect - isAuthenticated:", isAuthenticated);
      console.log("ProfileUser useEffect - userEmail:", userEmail);

      if (!isAuthLoading) {
        if (isAuthenticated && userEmail) {
          setIsLoadingProfile(true);
          console.log("ProfileUser: Auth ready and user authenticated. Fetching profile from Supabase for email:", userEmail);
          try {
            const { data, error } = await supabase
              .from('users')
              .select('id, nama, email, role, title, address, Profile_Picture')
              .eq('email', userEmail)
              .single();

            if (error) {
              // If no data is found (e.g., for dummy admin or new user not in 'users' table yet)
              // or other errors occur, log and handle gracefully.
              if (error.code === 'PGRST116') { // No rows found for Supabase postgrest error
                console.warn("ProfileUser: No matching profile found in 'users' table for this email (PGRST116). Displaying default values.");
              } else {
                throw error; // Re-throw other types of errors
              }
            }

            if (data) {
              console.log("ProfileUser: Data profil berhasil diambil dari Supabase:", data);
              setProfileData({
                id: data.id,
                nama: data.nama || 'No Name', // Default if empty
                role: data.role || 'Customer', // Default if empty
                title: data.title || 'Bronze (No Title)', // Default if empty
                email: data.email || userEmail, // Should not be empty if logged in, but fallback to userEmail
                address: data.address || 'No Address Provided', // Default if empty
                Profile_Picture: data.Profile_Picture || 'https://placehold.co/150x150/EEEEEE/333333?text=Profil', // Default placeholder
              });
            } else {
              // This block will execute if data is null (no row found),
              // which would be the case for the dummy admin or a new user.
              console.warn("ProfileUser: No profile data returned from Supabase. Initializing with defaults and authenticated email.");
              Swal.fire("Peringatan", "Data profil tidak ditemukan. Mungkin Anda perlu melengkapi profil.", "info");
              setProfileData(prev => ({
                ...prev,
                id: null, // Ensure ID is null if no database record
                nama: 'No Name',
                role: 'Customer', // Default role, could be overridden by AuthContext if needed
                title: 'Bronze (No Title)',
                email: userEmail || 'No Email',
                address: 'No Address Provided',
                Profile_Picture: 'https://placehold.co/150x150/EEEEEE/333333?text=Profil'
              }));
            }
          } catch (err) {
            console.error("ProfileUser: Kesalahan saat mengambil profil pengguna dari Supabase:", err.message);
            Swal.fire("Error", `Gagal memuat profil: ${err.message}`, "error");
            setProfileData({
                id: null, nama: '', role: '', title: '', email: '', address: '', Profile_Picture: ''
            });
          } finally {
            setIsLoadingProfile(false);
          }
        } else {
          setIsLoadingProfile(false);
          if (!isAuthenticated) {
            console.log("ProfileUser: Pengguna tidak terotentikasi. Mengarahkan ke halaman Login.");
            Swal.fire("Informasi", "Silakan login untuk melihat profil Anda.", "info");
            navigate('/Login');
          } else if (!userEmail) {
            console.error("ProfileUser: Authenticated but user email is missing from context. Redirecting to Login.");
            Swal.fire("Error", "Gagal mengidentifikasi pengguna. Silakan login kembali.", "error");
            navigate('/Login');
          }
        }
      }
    };

    fetchUserProfile();
  }, [userEmail, isAuthenticated, isAuthLoading, navigate, supabase]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Prevent saving if there's no actual user ID from the database
    // This will cover the dummy admin user and any other users not in the 'users' table.
    if (!profileData.id) {
        Swal.fire("Informasi", "Profil ini tidak dapat disimpan ke database karena tidak memiliki ID pengguna yang valid.", "info");
        setIsEditing(false); // Exit edit mode
        setIsSaving(false);
        return;
    }

    try {
      const { nama, email, address, title, Profile_Picture } = profileData;
      const { error } = await supabase
        .from('users')
        .update({
          nama,
          email,
          address,
          title,
          Profile_Picture,
        })
        .eq('id', profileData.id); // Update based on the actual user ID from the database

      if (error) {
        throw error;
      }

      Swal.fire('Berhasil!', 'Profil berhasil diperbarui.', 'success');
      setIsEditing(false);
    } catch (err) {
      console.error('ProfileUser: Kesalahan saat memperbarui profil:', err.message);
      Swal.fire('Error', `Gagal memperbarui profil: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
        <p className="ml-4 text-orange-600">Memuat profil...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Akses Ditolak</h2>
        <p className="text-gray-600 mb-6">Anda perlu login untuk melihat halaman profil.</p>
        <Link to="/Login" className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition duration-300 font-semibold">
          Login Sekarang
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm py-4 px-8 sticky top-0 z-50">
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

          <nav className="flex gap-8 text-sm font-medium text-gray-700">
            <Link to="/HomeUser" className="hover:text-orange-500 transition-colors">Home</Link>
            <Link to="/MenuUser" className="hover:text-orange-500 transition-colors">Menu</Link>
            <Link to="/ProfInfo" className="hover:text-orange-500 transition-colors">Story</Link>
            <Link to="/FAQUser" className="hover:text-orange-500 transition-colors">FAQ</Link>
            <Link to="/FeedbackUser" className="hover:text-orange-500 transition-colors">Feedback</Link>
            <Link to="/Lokasi" className="hover:text-orange-500 transition-colors">Location</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/ProfileUser" className="text-orange-500 hover:text-orange-600">
              <UserCircle className="w-5 h-5" />
            </Link>
            <Link to="/CartUser" className="text-orange-500 hover:text-orange-600">
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <Link to="/NotificationUser" className="text-orange-500 hover:text-orange-600">
              <Bell className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Profil Pengguna</h2>

          <div className="mb-6">
            <div className="relative inline-block">
              <img
                src={profileData.Profile_Picture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-orange-500 mx-auto shadow-md"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x150/EEEEEE/333333?text=Profil"}}
              />
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nama" className="block text-left text-gray-700 font-medium mb-1">Nama:</label>
                <input
                  type="text"
                  id="nama"
                  name="nama"
                  value={profileData.nama}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-left text-gray-700 font-medium mb-1">Peran:</label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={profileData.role}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled // Role is not editable
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-left text-gray-700 font-medium mb-1">Tingkat Member:</label>
                <select
                  id="title"
                  name="title"
                  value={profileData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-left text-gray-700 font-medium mb-1">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-left text-gray-700 font-medium mb-1">Alamat:</label>
                <textarea
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="Profile_Picture" className="block text-left text-gray-700 font-medium mb-1">URL Foto Profil:</label>
                <input
                  type="url"
                  id="Profile_Picture"
                  name="Profile_Picture"
                  value={profileData.Profile_Picture}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="https://example.com/your-photo.jpg"
                />
              </div>

              <div className="flex justify-center space-x-4 mt-6">
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Menyimpan...
                    </div>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 transition duration-300 font-semibold"
                >
                  Batal
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-gray-900">{profileData.nama}</p>
              <p className="text-lg text-gray-700">Peran: <span className="font-medium">{profileData.role}</span></p>
              <p className="text-lg text-gray-700">Tingkat Member: <span className="font-medium text-orange-600">{profileData.title}</span></p>
              <p className="text-lg text-gray-700">Email: <span className="font-medium text-orange-600">{profileData.email}</span></p>
              <p className="text-lg text-gray-700">Alamat: <span className="font-medium">{profileData.address || 'Belum diatur'}</span></p>
              <button
                onClick={handleEditToggle}
                className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition duration-300 font-semibold"
              >
                Edit Profil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
