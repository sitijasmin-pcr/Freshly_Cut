import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { supabase } from '../supabase';
import { AuthContext } from '../App'; // Pastikan path ini benar
import { UserCircle, ShoppingCart, Bell } from 'lucide-react'; // Ikon untuk header

export default function ProfileUser() {
  const { userEmail, isAuthenticated, isAuthLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    id: null,
    nama: '',
    role: '',
    memberLevel: 'Non-Member', // Menggunakan memberLevel untuk menampilkan status member
    email: '',
    address: '',
    Profile_Picture: '',
    totalTransactions: 0, // State untuk total transaksi pengguna (dari tabel customers.total_spent)
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State untuk mengontrol visibilitas form keanggotaan
  const [showMembershipForm, setShowMembershipForm] = useState(false);
  const [isJoiningMembership, setIsJoiningMembership] = useState(false); // State untuk loading saat gabung member

  // State untuk data form keanggotaan, meniru struktur CustomerForm
  const [membershipForm, setMembershipForm] = useState({
    nama: '',
    usia: '',
    penghasilan: '',
    jenis_kelamin: '',
    jenis_kegiatan: '',
    tingkat_kadar_gula: '',
    email: '', // Menggunakan 'email' sebagai kontak
    metode_pembayaran_favorit: '',
    status_member: 'Bronze', // Default untuk anggota baru, tidak bisa diubah di form ini
    minuman_favorit: '',
    role: 'User', // Default role untuk customer baru
  });

  // State untuk pesan milestone
  const [milestoneMessage, setMilestoneMessage] = useState('');

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
            // Fetch from 'users' table
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id, nama, email, role, address, Profile_Picture')
              .eq('email', userEmail)
              .single();

            let currentMemberLevel = 'Non-Member'; // Default level
            let customerTotalSpent = 0; // Inisialisasi total_spent dari tabel customers

            if (userError && userError.code !== 'PGRST116') {
              throw userError;
            }

            // Fetch from 'customers' table to get status_member AND total_spent
            const { data: customerData, error: customerError } = await supabase
              .from('customers')
              .select('id, status_member, total_spent') // NEW: Ambil total_spent dari sini
              .eq('email', userEmail)
              .single();

            if (customerError && customerError.code !== 'PGRST116') {
              throw customerError;
            }

            if (customerData) {
              currentMemberLevel = customerData.status_member || 'Non-Member';
              customerTotalSpent = customerData.total_spent || 0; // NEW: Set total_spent
              console.log("ProfileUser: Data customer berhasil diambil:", customerData);
            } else {
              console.warn("ProfileUser: No matching customer profile found in 'customers' table.");
            }

            if (userData) {
              console.log("ProfileUser: Data user berhasil diambil dari Supabase:", userData);
              setProfileData({
                id: userData.id,
                nama: userData.nama || 'No Name',
                role: userData.role || 'Customer',
                memberLevel: currentMemberLevel, // Set member level from customer table
                email: userData.email || userEmail,
                address: userData.address || 'No Address Provided',
                Profile_Picture: userData.Profile_Picture || 'https://placehold.co/150x150/EEEEEE/333333?text=Profil',
                totalTransactions: customerTotalSpent, // NEW: Gunakan total_spent dari customers
              });
              // Pre-fill membership form with current user data
              setMembershipForm(prev => ({
                ...prev,
                nama: userData.nama || '',
                email: userData.email || userEmail,
              }));
            } else {
              console.warn("ProfileUser: No user profile data returned from Supabase. Initializing with defaults and authenticated email.");
              setProfileData(prev => ({
                ...prev,
                id: null,
                nama: 'No Name',
                role: 'Customer',
                memberLevel: currentMemberLevel,
                email: userEmail || 'No Email',
                address: 'No Address Provided',
                Profile_Picture: 'https://placehold.co/150x150/EEEEEE/333333?text=Profil',
                totalTransactions: customerTotalSpent, // NEW: Gunakan total_spent dari customers
              }));
              setMembershipForm(prev => ({
                ...prev,
                nama: 'No Name',
                email: userEmail || 'No Email',
              }));
              Swal.fire("Peringatan", "Data profil pengguna tidak ditemukan. Mungkin Anda perlu melengkapi profil atau bergabung sebagai member.", "info");
            }

            // Hitung dan set pesan milestone
            setMilestoneMessage(calculateMilestoneMessage(currentMemberLevel, customerTotalSpent)); // NEW: Gunakan customerTotalSpent

          } catch (err) {
            console.error("ProfileUser: Kesalahan saat mengambil profil pengguna dari Supabase:", err.message);
            Swal.fire("Error", `Gagal memuat profil: ${err.message}`, "error");
            setProfileData({
              id: null, nama: '', role: '', memberLevel: 'Non-Member', email: '', address: '', Profile_Picture: '', totalTransactions: 0
            });
            setMembershipForm(prev => ({
              ...prev,
              nama: '', email: '',
            }));
            setMilestoneMessage('');
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
  }, [userEmail, isAuthenticated, isAuthLoading, navigate]);

  // Fungsi untuk menghitung pesan milestone
  const calculateMilestoneMessage = (memberLevel, totalSpent) => {
    const targets = {
      'Bronze': 300000, // Target untuk naik ke Silver
      'Silver': 750000, // Target untuk naik ke Gold
    };

    let message = '';
    const formatter = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    if (memberLevel === 'Non-Member') {
      message = 'Bergabunglah sebagai member untuk mendapatkan keuntungan eksklusif!';
    } else if (memberLevel === 'Bronze') {
      const remaining = targets['Bronze'] - totalSpent;
      if (remaining > 0) {
        message = `Transaksi ${formatter.format(remaining)} lagi untuk naik ke member Silver!`;
      } else {
        message = 'Selamat! Anda telah mencapai syarat untuk naik ke member Silver.';
      }
    } else if (memberLevel === 'Silver') {
      const remaining = targets['Silver'] - totalSpent;
      if (remaining > 0) {
        message = `Transaksi ${formatter.format(remaining)} lagi untuk naik ke member Gold!`;
      } else {
        message = 'Selamat! Anda telah mencapai syarat untuk naik ke member Gold.';
      }
    } else if (memberLevel === 'Gold') {
      message = 'Anda adalah member Gold. Terus nikmati keuntungan terbaik kami!';
    }

    return message;
  };


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

    if (!profileData.id) {
        Swal.fire("Informasi", "Profil ini tidak dapat disimpan ke database karena tidak memiliki ID pengguna yang valid (tidak terdaftar di tabel 'users').", "info");
        setIsEditing(false);
        setIsSaving(false);
        return;
    }

    try {
      const { nama, email, address, Profile_Picture } = profileData;
      const { error } = await supabase
        .from('users')
        .update({
          nama,
          email,
          address,
          Profile_Picture,
        })
        .eq('id', profileData.id);

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

  // Handler for membership form input changes
  const handleMembershipChange = (e) => {
    const { name, value } = e.target;
    setMembershipForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler for joining membership
  const handleJoinMembership = async (e) => {
    e.preventDefault();
    setIsJoiningMembership(true);

    if (!supabase) {
      Swal.fire('Error', 'Koneksi database tidak tersedia.', 'error');
      setIsJoiningMembership(false);
      return;
    }

    if (!membershipForm.nama || !membershipForm.email || !membershipForm.metode_pembayaran_favorit) {
      Swal.fire('Peringatan', 'Nama, Email, dan Metode Pembayaran Favorit wajib diisi.', 'warning');
      setIsJoiningMembership(false);
      return;
    }

    try {
      // Check if user already exists as a customer by email
      const { data: existingCustomers, error: fetchError } = await supabase
        .from('customers')
        .select('id, status_member, total_spent') // NEW: Ambil total_spent di sini juga
        .eq('email', membershipForm.email)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingCustomers) {
        if (existingCustomers.status_member && existingCustomers.status_member !== 'Non-Member') {
          Swal.fire('Info', `Anda sudah terdaftar sebagai member dengan status: ${existingCustomers.status_member}.`, 'info');
          setProfileData(prev => ({
            ...prev,
            memberLevel: existingCustomers.status_member,
            totalTransactions: existingCustomers.total_spent || 0 // NEW: Update total_spent
          }));
          setShowMembershipForm(false);
          setIsJoiningMembership(false);
          return;
        } else {
          // If customer exists but status_member is 'Non-Member' or null, update it to Bronze
          const { error: updateCustomerError } = await supabase.from('customers').update({
            nama: membershipForm.nama,
            usia: membershipForm.usia || null,
            penghasilan: membershipForm.penghasilan || null,
            jenis_kelamin: membershipForm.jenis_kelamin || null,
            jenis_kegiatan: membershipForm.jenis_kegiatan || null,
            tingkat_kadar_gula: membershipForm.tingkat_kadar_gula || null,
            metode_pembayaran_favorit: membershipForm.metode_pembayaran_favorit,
            minuman_favorit: membershipForm.minuman_favorit || null,
            status_member: 'Bronze', // Set to Bronze
            role: membershipForm.role || 'User',
            total_spent: existingCustomers.total_spent || 0 // Pertahankan total_spent yang sudah ada
          }).eq('id', existingCustomers.id);

          if (updateCustomerError) throw updateCustomerError;
          Swal.fire('Berhasil!', 'Status membership Anda berhasil diperbarui menjadi Bronze!', 'success');
        }
      } else {
        // If customer does not exist, insert new customer data
        const { error: insertError } = await supabase.from('customers').insert({
          nama: membershipForm.nama,
          email: membershipForm.email,
          usia: membershipForm.usia || null,
          penghasilan: membershipForm.penghasilan || null,
          jenis_kelamin: membershipForm.jenis_kelamin || null,
          jenis_kegiatan: membershipForm.jenis_kegiatan || null,
          tingkat_kadar_gula: membershipForm.tingkat_kadar_gula || null,
          metode_pembayaran_favorit: membershipForm.metode_pembayaran_favorit,
          minuman_favorit: membershipForm.minuman_favorit || null,
          status_member: 'Bronze', // Selalu 'Bronze' untuk member baru
          role: membershipForm.role || 'User',
          total_spent: 0 // NEW: Inisialisasi total_spent untuk member baru
        });

        if (insertError) {
          throw insertError;
        }
        Swal.fire('Berhasil!', 'Anda berhasil bergabung sebagai member Bronze!', 'success');
      }

      // Update the 'title' in the 'users' table to match the new membership status (optional, depends on your user table)
      // Jika Anda tidak menggunakan kolom 'title' di tabel 'users' untuk menyimpan level member, Anda bisa hapus bagian ini.
      const { error: updateProfileError } = await supabase
        .from('users')
        .update({ role: 'Customer' }) // Menggunakan role 'Customer' yang lebih umum
        .eq('email', userEmail);

      if (updateProfileError) {
        console.warn('ProfileUser: Gagal memperbarui role di tabel users:', updateProfileError.message);
        Swal.fire("Peringatan", "Berhasil bergabung membership, namun gagal memperbarui status di profil utama. Silakan refresh halaman.", "warning");
      }

      setShowMembershipForm(false);
      // Update profileData.memberLevel and totalTransactions in frontend to immediately reflect the change
      setProfileData(prev => ({
        ...prev,
        memberLevel: 'Bronze',
        totalTransactions: prev.totalTransactions, // Pertahankan totalTransactions yang ada di state
      }));
      setMilestoneMessage(calculateMilestoneMessage('Bronze', profileData.totalTransactions));
    } catch (err) {
      console.error('ProfileUser: Kesalahan saat bergabung membership:', err.message);
      Swal.fire('Error', `Gagal bergabung membership: ${err.message}`, 'error');
    } finally {
      setIsJoiningMembership(false);
    }
  };

  const handleCloseMembershipForm = () => {
    setShowMembershipForm(false);
    setMembershipForm({
      nama: profileData.nama || '',
      usia: '',
      penghasilan: '',
      jenis_kelamin: '',
      jenis_kegiatan: '',
      tingkat_kadar_gula: '',
      email: profileData.email || '',
      metode_pembayaran_favorit: '',
      status_member: 'Bronze',
      minuman_favorit: '',
      role: 'User',
    });
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
                <label htmlFor="memberLevelDisplay" className="block text-left text-gray-700 font-medium mb-1">Tingkat Member:</label>
                <input
                  type="text"
                  id="memberLevelDisplay"
                  name="memberLevelDisplay"
                  value={profileData.memberLevel}
                  className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  disabled // Not editable directly here
                />
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
              <p className="text-lg text-gray-700">Tingkat Member: <span className="font-medium text-orange-600">{profileData.memberLevel}</span></p>
              {/* Tampilkan total transaksi */}
              <p className="text-lg text-gray-700">Total Transaksi: <span className="font-medium">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(profileData. totalTransactions)}</span></p>
              {/* Tampilkan pesan milestone */}
              {milestoneMessage && (
                <p className="text-base text-gray-600 italic mt-2">{milestoneMessage}</p>
              )}
              <p className="text-lg text-gray-700">Email: <span className="font-medium text-orange-600">{profileData.email}</span></p>
              <p className="text-lg text-gray-700">Alamat: <span className="font-medium">{profileData.address || 'Belum diatur'}</span></p>
              <button
                onClick={handleEditToggle}
                className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition duration-300 font-semibold"
              >
                Edit Profil
              </button>
              {/* Gabung Membership Button - Tampilkan jika user belum jadi member penuh */}
              {profileData.memberLevel === 'Non-Member' && (
                <button
                  onClick={() => {
                    setShowMembershipForm(true);
                    setMembershipForm(prev => ({
                      ...prev,
                      nama: profileData.nama,
                      email: profileData.email,
                    }));
                  }}
                  className="mt-4 ml-4 bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition duration-300 font-semibold"
                >
                  Gabung Membership
                </button>
              )}
            </div>
          )}

          {/* Membership Form Modal/Section */}
          {showMembershipForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Gabung Membership</h3>
                  <button
                    onClick={handleCloseMembershipForm}
                    className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
                  >
                    &times;
                  </button>
                </div>
                <form onSubmit={handleJoinMembership} className="space-y-4">
                  <div>
                    <label htmlFor="membershipNama" className="block text-sm font-medium text-gray-700">Nama</label>
                    <input
                      name="nama"
                      id="membershipNama"
                      placeholder="Nama Lengkap"
                      value={membershipForm.nama}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="membershipEmail" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      name="email"
                      id="membershipEmail"
                      placeholder="Email"
                      type="email"
                      value={membershipForm.email}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="membershipUsia" className="block text-sm font-medium text-gray-700">Usia</label>
                    <input
                      name="usia"
                      id="membershipUsia"
                      placeholder="Usia"
                      type="number"
                      value={membershipForm.usia}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="membershipPenghasilan" className="block text-sm font-medium text-gray-700">Penghasilan</label>
                    <input
                      name="penghasilan"
                      id="membershipPenghasilan"
                      placeholder="Penghasilan (Rp)"
                      type="number"
                      value={membershipForm.penghasilan}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="membershipJenisKelamin" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                    <select
                      name="jenis_kelamin"
                      id="membershipJenisKelamin"
                      value={membershipForm.jenis_kelamin}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="Pria">Pria</option>
                      <option value="Wanita">Wanita</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="membershipJenisKegiatan" className="block text-sm font-medium text-gray-700">Jenis Kegiatan</label>
                    <select
                      name="jenis_kegiatan"
                      id="membershipJenisKegiatan"
                      value={membershipForm.jenis_kegiatan}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Pilih Jenis Kegiatan</option>
                      <option value="Mahasiswa">Mahasiswa</option>
                      <option value="Pengangguran">Pengangguran</option>
                      <option value="Pekerja Kantoran">Pekerja Kantoran</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="membershipTingkatKadarGula" className="block text-sm font-medium text-gray-700">Tingkat Kadar Gula</label>
                    <select
                      name="tingkat_kadar_gula"
                      id="membershipTingkatKadarGula"
                      value={membershipForm.tingkat_kadar_gula}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Pilih Tingkat Gula</option>
                      <option value="Rendah">Rendah</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Tinggi">Tinggi</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="membershipMetodePembayaranFavorit" className="block text-sm font-medium text-gray-700">Metode Pembayaran Favorit</label>
                    <select
                      name="metode_pembayaran_favorit"
                      id="membershipMetodePembayaranFavorit"
                      value={membershipForm.metode_pembayaran_favorit}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                      required
                    >
                      <option value="">Pilih Metode Pembayaran Favorit</option>
                      <option value="QRIS">QRIS</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="membershipStatusMember" className="block text-sm font-medium text-gray-700">Status Member</label>
                    <input
                      name="status_member"
                      id="membershipStatusMember"
                      value={membershipForm.status_member}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="membershipMinumanFavorit" className="block text-sm font-medium text-gray-700">Minuman/Produk Favorit</label>
                    <input
                      name="minuman_favorit"
                      id="membershipMinumanFavorit"
                      placeholder="Minuman/Produk Favorit (mis: Americano, Croissant)"
                      value={membershipForm.minuman_favorit}
                      onChange={handleMembershipChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      type="button"
                      onClick={handleCloseMembershipForm}
                      className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={isJoiningMembership}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-md shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isJoiningMembership}
                    >
                      {isJoiningMembership ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memproses...
                        </div>
                      ) : (
                        'Gabung Sekarang'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}