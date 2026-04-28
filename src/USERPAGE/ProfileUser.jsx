import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Bell, UserCircle, LogOut, Edit3, Loader2, Save, X } from "lucide-react";
import { supabase } from "../supabase";
import { useCart } from "./CartContext";
import { AuthContext } from "../App";
import Swal from "sweetalert2";

const FadeInOnScroll = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

export default function ProfileUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const { userEmail, isAuthenticated, isAuthLoading, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk Edit Profile
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- LOGIC FETCH DATA ---
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("nama, email, Profile_Picture, address, title, role")
        .eq("email", userEmail)
        .eq("role", "customer")
        .single();

      if (error) throw error;
      setProfile(data);
      setNewName(data.nama);
      setNewAddress(data.address || "");
    } catch (error) {
      console.error("Error fetching profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isAuthenticated && userEmail) fetchProfile();
  }, [isAuthenticated, isAuthLoading, userEmail, navigate]);

  // --- LOGIC LOGOUT ---
  const handleLogout = () => {
    Swal.fire({
      title: 'Yakin ingin keluar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, Keluar'
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  // --- LOGIC UPDATE ---
  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({ nama: newName, address: newAddress })
        .eq("email", userEmail);

      if (error) throw error;
      Swal.fire("Sukses!", "Profil berhasil diperbarui.", "success");
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      Swal.fire("Error", "Gagal memperbarui profil.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-[#F0F9FF] min-h-screen">
      {/* --- NAVBAR --- */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/HomeUser" className="flex items-center gap-2">
            <img src="src/assets/FreshlyLogo.png" alt="Logo" className="h-12" />
            <div className="hidden sm:block">
              <span className="text-xl font-black text-orange-600 block leading-none">FRESHLY CUT</span>
              <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Makan Sehat, Tinggal Hap!</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex gap-10">
            {["Home", "Menu", "Story", "FAQ", "Feedback"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/HomeUser" : `/${item}User`}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-orange-600 ${
                  location.pathname.includes(item) ? "text-orange-600 border-b-2 border-orange-600" : "text-gray-500"
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link to="/ProfileUser" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600"><UserCircle size={22} /></Link>
            <Link to="/CartUser" className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-600 relative">
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cartItems.length}</span>
              )}
            </Link>
            <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
            <Link to="/NotificationUser" className="relative p-2 text-gray-600">
                <Bell size={22} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </Link>
          </div>
        </div>
      </header>

      {/* --- MAIN SECTION --- */}
      <main className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <FadeInOnScroll>
            <div className="bg-white rounded-[2rem] border-b-8 border-green-100 shadow-xl p-8 md:p-12">
              {loading ? (
                <div className="flex flex-col items-center py-20 text-green-600"><Loader2 className="w-12 h-12 animate-spin" /></div>
              ) : isEditing ? (
                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-green-900 mb-6">Edit Profile</h2>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400">Nama</label>
                        <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full mt-2 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 font-bold" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400">Alamat</label>
                        <textarea value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="w-full mt-2 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-green-500 font-bold" />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={handleUpdate} disabled={submitting} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black uppercase hover:bg-green-700 flex justify-center items-center gap-2">
                            {submitting ? <Loader2 className="animate-spin" /> : <><Save size={18}/> Simpan</>}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black">
                            <X size={18} />
                        </button>
                    </div>
                </div>
              ) : profile ? (
                <>
                  <div className="flex flex-col items-center mb-10">
                    <div className="w-32 h-32 rounded-full border-4 border-green-100 mb-6 overflow-hidden shadow-lg">
                      <img src={profile.Profile_Picture || "/default-avatar.png"} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black text-green-900 uppercase italic">{profile.nama}</h1>
                    <p className="text-orange-600 font-black tracking-widest text-sm uppercase">{profile.title || "Customer"}</p>
                  </div>

                  <div className="space-y-6">
                    <InfoRow label="Email" value={profile.email} />
                    <InfoRow label="Alamat" value={profile.address || "Belum diatur"} />
                    <InfoRow label="Role" value={profile.role} />
                  </div>

                  <div className="mt-12 flex gap-4">
                    <button onClick={() => setIsEditing(true)} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                      <Edit3 size={18} /> Edit Profile
                    </button>
                    <button onClick={handleLogout} className="px-6 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-red-50 hover:text-red-600 transition-all">
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-green-900 font-bold">Profil tidak ditemukan.</div>
              )}
            </div>
          </FadeInOnScroll>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="font-bold text-green-900 mt-1">{value}</p>
    </div>
  );
}