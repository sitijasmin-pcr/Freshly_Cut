import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, UserCircle, ShoppingCart, Bell } from "lucide-react";
import { useCart } from "./CartContext";
import { supabase } from "../supabase";

const CartUser = () => {
  const location = useLocation();
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // FETCH PRODUK
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("produk").select("*");
      if (data) setProducts(data);
    };
    fetchProducts();
  }, []);

  const cartWithProduct = useMemo(() => {
    return cartItems.map((cart) => {
      const product = products.find((p) => p.id === cart.id);
      return { ...cart, ...product };
    });
  }, [cartItems, products]);

  const groupedCart = useMemo(() => {
    const group = {};
    cartWithProduct.forEach((item) => {
      const cat = item.kategori || "Lainnya";
      if (!group[cat]) group[cat] = [];
      group[cat].push(item);
    });
    return group;
  }, [cartWithProduct]);

  const subTotalAmount = cartWithProduct.reduce((a, b) => a + (Number(b.harga) || 0) * Number(b.quantity), 0);
  const tax = subTotalAmount * 0.1;
  const totalAmount = subTotalAmount + tax;

  const formatRupiah = (value) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  return (
    <div className="min-h-screen bg-[#FDF8EE] font-sans text-gray-900">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Link to="/HomeUser" className="flex items-center gap-2">
            <img src="src/assets/img/Logo buah segar _Freshly Cut_.png" alt="Logo" className="h-12" />
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
              {cartItems.length > 0 && <span className="absolute top-1 right-1 bg-orange-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce">{cartItems.length}</span>}
            </Link>
            <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
            <Link to="/NotificationUser" className="relative p-2 text-gray-600"><Bell size={22} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-10 px-6">
        <h2 className="text-2xl font-black text-green-900 mb-8 uppercase italic">List Keranjang Anda</h2>
        
        <div className="grid lg:grid-cols-3 gap-10">
          {/* BAGIAN KIRI: ITEMS */}
          <div className="lg:col-span-2 space-y-10">
            {cartItems.length === 0 ? (
              <div className="bg-white p-12 rounded-[2rem] text-center shadow-sm">
                <p className="font-black text-gray-400 uppercase italic">Keranjang Anda masih kosong.</p>
                <Link to="/MenuUser" className="inline-block mt-4 text-orange-600 font-bold underline">Lihat Menu</Link>
              </div>
            ) : (
              Object.entries(groupedCart).map(([kategori, items]) => (
                <div key={kategori}>
                  <h3 className="font-black text-orange-600 mb-4 uppercase">{kategori}</h3>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div key={item.id} className="bg-white p-5 rounded-[2rem] flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-4">
                          <img src={item.gambar} className="w-20 h-20 object-cover rounded-xl" alt={item.nama} />
                          <div>
                            <h4 className="font-black text-green-900">{item.nama}</h4>
                            <p className="text-orange-600 font-bold">{formatRupiah(item.harga)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)}><Minus /></button>
                          <span className="font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}><Plus /></button>
                          <button onClick={() => removeItem(item.id)} className="text-red-500"><Trash2 /></button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* BAGIAN KANAN: SUMMARY */}
          <div className="bg-green-900 text-white p-8 rounded-[3rem] h-fit sticky top-28">
            <h3 className="font-black mb-6 uppercase">Order Summary</h3>
            <div className="space-y-3 text-sm border-b pb-4 mb-4">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatRupiah(subTotalAmount)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>{formatRupiah(tax)}</span></div>
              <div className="flex justify-between font-black text-lg text-orange-500"><span>Total</span><span>{formatRupiah(totalAmount)}</span></div>
            </div>
            
            {/* BUTTON DENGAN LOGIKA DISABLED */}
            <button
              onClick={() => navigate("/CheckoutUser")}
              disabled={cartItems.length === 0}
              className={`w-full py-3 rounded-2xl font-black uppercase transition-all ${
                cartItems.length === 0 
                ? "bg-gray-400 cursor-not-allowed text-gray-200" 
                : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {cartItems.length === 0 ? "Keranjang Kosong" : "Checkout Sekarang"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartUser;