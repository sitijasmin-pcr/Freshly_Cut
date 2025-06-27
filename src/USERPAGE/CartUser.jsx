import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from '../supabase'; // Pastikan path ke supabase client Anda benar

// Pastikan supabase client berhasil diinisialisasi.
if (!supabase) {
  console.error("Supabase client not initialized in CartUser. Check CDN setup and keys.");
  // Fallback untuk development jika Supabase tidak terinisialisasi
  // Ini akan mencegah crash tetapi tidak akan menyimpan data ke DB
  window.Swal.fire('Error', 'Supabase client tidak terinisialisasi. Cek konfigurasi!', 'error');
}

import { useCart } from "./CartContext"; // Path relatif yang benar jika CartContext.jsx ada di src/


const CartUser = () => {
  const { cartItems, updateQuantity, updateSugarLevel, removeItem, clearCart } =
    useCart();
  const navigate = useNavigate();

  const [deliveryOption, setDeliveryOption] = useState("takeAtOutlet");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [customerName, setCustomerName] = useState(""); // State untuk nama pelanggan
  const [tableNumber, setTableNumber] = useState(""); // State untuk nomor meja (opsional)

  // Ensure price and quantity are numbers for calculation
  const calculateSubtotal = (item) => Number(item.price) * Number(item.quantity);

  const totalItems = cartItems.length;
  const subTotalAmount = cartItems.reduce(
    (acc, item) => acc + calculateSubtotal(item),
    0
  );
  const deliveryFee = 0;
  const taxesRate = 0.1;

  const taxesAmount = subTotalAmount * taxesRate;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "TOMORO10") {
      setCouponDiscount(subTotalAmount * 0.1);
      setCouponMessage("Kupon 'TOMORO10' berhasil diterapkan! Anda mendapatkan diskon 10%.");
    } else {
      setCouponDiscount(0);
      setCouponMessage("Kupon tidak valid atau tidak ditemukan.");
    }
  };

  const totalAmount =
    subTotalAmount + deliveryFee + taxesAmount - couponDiscount;

  const handleQuantityChange = (id, delta) => updateQuantity(id, delta);
  const handleSugarLevelChange = (id, newSugarLevel) =>
    updateSugarLevel(id, newSugarLevel);
  const handleRemoveItem = (id) => removeItem(id);
  const handleClearShoppingCart = () => clearCart();

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Fungsi baru untuk memproses checkout dan menyimpan ke Supabase
  const handleProceedToCheckout = async () => {
    if (!supabase) {
      Swal.fire('Error', 'Koneksi database tidak tersedia. Tidak dapat memproses pesanan.', 'error');
      return;
    }
    if (cartItems.length === 0) {
      Swal.fire('Peringatan', 'Keranjang Anda kosong. Tambahkan item terlebih dahulu.', 'warning');
      return;
    }
    if (!customerName.trim()) {
      Swal.fire('Peringatan', 'Nama Pelanggan wajib diisi.', 'warning');
      return;
    }

    applyCoupon(); // Pastikan kupon diterapkan sebelum menyimpan

    const currentCouponDiscount = couponCode.toUpperCase() === "TOMORO10" ? subTotalAmount * 0.1 : 0;
    const currentTotalAmount = subTotalAmount + deliveryFee + taxesAmount - currentCouponDiscount;

    const orderSummary = {
      totalItems: totalItems,
      subTotalAmount: subTotalAmount,
      deliveryFee: deliveryFee,
      taxesAmount: taxesAmount,
      couponDiscount: currentCouponDiscount,
      totalAmount: currentTotalAmount,
      items: cartItems
    };
    navigate('/order-information', { state: { orderSummary, deliveryOption, couponCode, couponDiscount: currentCouponDiscount } });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navbar Section */}
      <nav className="bg-white shadow-sm py-4 px-8">
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <div className="flex items-center gap-3">
            <img src="/img/Logo.png" alt="Logo" className="h-10" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/40x40/FF7F50/FFFFFF?text=Logo'; }} />{" "}
            <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
              TOMORO{" "}
              <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">
                COFFEE
              </span>
            </h1>
          </div>

          <nav className="flex gap-8 text-sm font-medium text-gray-700">
            <Link
              to="/HomeUser"
              className="hover:text-orange-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/MenuUser"
              className="hover:text-orange-500 transition-colors"
            >
              Menu
            </Link>
            <Link
              to="/lokasi"
              className="hover:text-orange-500 transition-colors"
            >
              Location
            </Link>
            <Link
              to="/FAQUser"
              className="hover:text-orange-500 transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/FeedbackUser"
              className="hover:text-orange-500 transition-colors"
            >
              Feedback
            </Link>
            <Link
              to="/ProfInfo"
              className="hover:text-orange-500 transition-colors"
            >
              Story
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/CartUser"
              className="text-orange-500 hover:text-orange-600 relative"
            >
              <i className="fas fa-shopping-cart w-5 h-5"></i> {/* Font Awesome Cart Icon */}
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>
              )}
            </Link>
            <Link
              to="/NotificationUser"
              className="text-orange-500 hover:text-orange-600"
            >
              <i className="fas fa-bell w-5 h-5"></i> {/* Font Awesome Bell Icon */}
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          Shopping Cart
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-7 gap-4 text-gray-600 font-semibold border-b pb-3 mb-4 text-center">
              <div className="col-span-2 text-left">Product</div>
              <div>Harga</div>
              <div>Quantity</div>
              <div>Kadar Gula</div>
              <div>Subtotal</div>
              <div></div>
            </div>

            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Keranjang Anda kosong.</p>
            ) : (
              cartItems.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="grid grid-cols-7 gap-4 items-center py-4 border-b last:border-b-0"
                >
                  <div className="col-span-2 flex items-center space-x-4">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <i className="fas fa-times-circle h-5 w-5"></i> {/* Font Awesome close icon */}
                    </button>
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200"
                      />
                      <span className="text-gray-800 font-medium">
                        {item.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-center text-gray-700">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(item.price)}
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center border rounded-md py-1 text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  {/* Kolom Kadar Gula */}
                  <div className="text-center">
                    <select
                      value={item.sugarLevel}
                      onChange={(e) =>
                        handleSugarLevelChange(item.id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md py-1 px-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="Tinggi">Tinggi</option>
                      <option value="Sedang">Sedang</option>
                      <option value="Rendah">Rendah</option>
                      <option value="N/A">N/A</option> {/* Tambahkan opsi N/A untuk non-minuman */}
                    </select>
                  </div>
                  <div className="text-center text-gray-800 font-medium">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(calculateSubtotal(item))}
                  </div>
                  <div></div>
                </motion.div>
              ))
            )}

            <div className="mt-6 flex items-center space-x-4 text-gray-700">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-orange-500 rounded"
                  checked={deliveryOption === "deliverToLocation"}
                  onChange={() => setDeliveryOption("deliverToLocation")}
                />
                <span className="ml-2">Deliver To Location</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 text-orange-500 rounded"
                  checked={deliveryOption === "takeAtOutlet"}
                  onChange={() => setDeliveryOption("takeAtOutlet")}
                />
                <span className="ml-2">Take at Outlet</span>
              </label>
              <button
                onClick={handleClearShoppingCart}
                className="ml-auto text-red-500 hover:underline text-sm"
              >
                Clear Shopping Cart
              </button>
            </div>

            {/* Input Nama Pelanggan dan Nomor Meja (jika Take at Outlet) */}
            <div className="mt-4">
              <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Pelanggan:
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Masukkan nama Anda"
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            {deliveryOption === "takeAtOutlet" && (
              <div className="mt-4">
                <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Meja (Opsional):
                </label>
                <input
                  type="text"
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Contoh: Meja 5"
                  className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Insert Your Coupon
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                Masukkan Kupon atau Voucher Anda
              </p>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Insert Here..."
                  className="flex-1 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponMessage("");
                  }}
                />
                <button
                  onClick={applyCoupon} // Hanya untuk menerapkan kupon, bukan checkout
                  className="ml-4 bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Terapkan Kupon
                </button>
              </div>
              {couponMessage && (
                <p className={`mt-2 text-sm ${couponDiscount > 0 ? "text-green-600" : "text-red-500"}`}>
                  {couponMessage}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="w-full lg:w-96 bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>{new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(subTotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Taxes ({taxesRate * 100}%)</span>
                <span>{new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(taxesAmount)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>-{new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(couponDiscount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-4 mt-4">
                <span>Total</span>
                <span>{new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalAmount)}</span>
              </div>
            </div>
            <button
              onClick={handleProceedToCheckout} // Panggil fungsi untuk menyimpan ke Supabase
              className="mt-8 w-full block text-center bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="relative mt-20 w-full text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://placehold.co/1920x400/333333/FFFFFF?text=Footer+Background')" }} // Placeholder for image 48.png
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="https://placehold.co/40x40/FF7F50/FFFFFF?text=Logo" alt="Logo" className="h-10" />
              <div>
                <h2 className="text-xl font-bold text-orange-400">TOMORO</h2>
                <p className="text-sm tracking-[0.3em] text-orange-300">
                  COFFEE
                </p>
              </div>
            </div>
            <div className="text-sm leading-relaxed">
              <p className="text-orange-400 font-semibold mb-1">Our Location</p>
              <p>Headquarters</p>
              <p>
                Jl. Riau No.57 B, Kp. Bandar, Kec. Senapelan, Kota Pekanbaru,
                Riau 28291
              </p>
            </div>
          </div>
          <div className="text-sm">
            <p className="text-orange-400 font-semibold mb-2">Social Media</p>
            <div className="flex gap-4 text-lg">
              <a href="#" className="hover:text-orange-300">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="hover:text-orange-300">
                <i className="fab fa-tiktok"></i>
              </a>
              <a
                href="mailto:contact@tomorocoffee.com"
                className="hover:text-orange-300"
              >
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
          Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
        </div>
      </footer>
    </div>
  );
};

export default CartUser;
