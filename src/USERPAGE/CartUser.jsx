import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Bell } from "lucide-react";
import { useCart } from "./CartContext"; // <--- PASTIKAN PATH INI BENAR

const CartUser = () => {
  const { cartItems, updateQuantity, updateSugarLevel, removeItem, clearCart } =
    useCart();
  const navigate = useNavigate();

  const [deliveryOption, setDeliveryOption] = useState("takeAtOutlet");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const calculateSubtotal = (item) => item.price * item.quantity;

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

  const handleCheckOrderInformation = () => {
    applyCoupon(); // Terapkan kupon terlebih dahulu

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
            <img src="/img/Logo.png" alt="Logo" className="h-10" />{" "}
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
              to="/location"
              className="hover:text-orange-500 transition-colors"
            >
              Location
            </Link>
            <Link
              to="/faq"
              className="hover:text-orange-500 transition-colors"
            >
              FAQ
            </Link>
            <Link
              to="/feedback"
              className="hover:text-orange-500 transition-colors"
            >
              Feedback
            </Link>
            <Link
              to="/profile"
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
              <ShoppingCart className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center text-xs text-white"></span>
              )}
            </Link>
            <Link
              to="/NotificationUser"
              className="text-orange-500 hover:text-orange-600"
            >
              <Bell className="w-5 h-5" />
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
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
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
                    {formatRupiah(item.price)}
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
                    </select>
                  </div>
                  <div className="text-center text-gray-800 font-medium">
                    {formatRupiah(calculateSubtotal(item))}
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
                  onClick={handleCheckOrderInformation}
                  className="ml-4 bg-orange-500 text-white py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Check Order Information
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
                <span>{formatRupiah(subTotalAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{formatRupiah(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Taxes</span>
                <span>{formatRupiah(taxesAmount)}</span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>-{formatRupiah(couponDiscount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-4 mt-4">
                <span>Total</span>
                <span>{formatRupiah(totalAmount)}</span>
              </div>
            </div>
            <Link
              to="/CheckoutUser"
              className="mt-8 w-full block text-center bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Proceed To Checkout
            </Link>
          </div>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="relative mt-20 w-full text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/image 48.png')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/img/Logo.png" alt="Logo" className="h-10" />
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
