import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Bell, ChevronDown,UserCircle } from 'lucide-react';

const CheckoutUser = () => {
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default selected payment method
  const [location, setLocation] = useState('');
  const [orderName, setOrderName] = useState('');
  const [schedule, setSchedule] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);

  // States baru untuk informasi akun Dana dan QRIS
  const [danaAccountInfo, setDanaAccountInfo] = useState('');
  const [qrisAccountInfo, setQrisAccountInfo] = useState('');

  // Fungsi placeholder untuk handling checkout
  const handleCheckout = () => {
    if (!agreementChecked) {
      alert('Anda harus menyetujui syarat dan ketentuan sebelum melanjutkan.');
      return;
    }

    // Validasi tambahan jika Dana atau QRIS dipilih
    if (paymentMethod === 'Dana' && !danaAccountInfo.trim()) {
      alert('Mohon masukkan nomor Dana Anda.');
      return;
    }
    if (paymentMethod === 'QRIS' && !qrisAccountInfo.trim()) {
      // Untuk QRIS, input ini mungkin opsional tergantung implementasi backend
      // alert('Mohon masukkan ID Transaksi QRIS Anda.');
      // return;
    }

    console.log({
      paymentMethod,
      location,
      orderName,
      schedule,
      danaAccountInfo: paymentMethod === 'Dana' ? danaAccountInfo : null,
      qrisAccountInfo: paymentMethod === 'QRIS' ? qrisAccountInfo : null,
    });
    alert('Proses Checkout (simulasi)!');
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
            <Link to="/HomeUser" className="hover:text-orange-500">
              Home
            </Link>
            <Link to="/MenuUser" className="hover:text-orange-500">
              Menu
            </Link>
            <Link to="/location" className="hover:text-orange-500">
              Location
            </Link>
            <Link to="/faq" className="hover:text-orange-500">
              FAQ
            </Link>
            <Link to="/feedback" className="hover:text-orange-500">
              Feedback
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* New: Profile Icon */}
            <Link to="/ProfileUser" className="text-orange-500 hover:text-orange-600">
              <UserCircle className="w-5 h-5" />
            </Link>
            {/* Existing icons */}
            <Link to="/CartUser" className="text-orange-500 hover:text-orange-600">
              <ShoppingCart className="w-5 h-5" />
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
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">
          Lets Checkout!
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Section: Payment Method & Schedule */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Method</h2>
            <p className="text-sm text-gray-500 mb-6">Pilih Metode Pembayaran Yang Akan Anda Gunakan</p>

            <div className="space-y-4 mb-8">
              {/* Cash */}
              <label
                className={`flex items-center justify-between border ${paymentMethod === 'Cash' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'} rounded-lg p-4 cursor-pointer transition-all duration-200`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Cash"
                    checked={paymentMethod === 'Cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="form-radio h-5 w-5 text-orange-500 border-gray-300 focus:ring-orange-400"
                  />
                  <span className="font-medium text-gray-800">Cash</span>
                </div>
                {paymentMethod === 'Cash' && <ChevronDown className="h-5 w-5 text-gray-500 transform rotate-180" />}
              </label>

              {/* Dana */}
              <div className={`border ${paymentMethod === 'Dana' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'} rounded-lg transition-all duration-200`}>
                <label className="flex items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Dana"
                      checked={paymentMethod === 'Dana'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-radio h-5 w-5 text-orange-500 border-gray-300 focus:ring-orange-400"
                    />
                    {/* Logo Dana ditambahkan di sini */}
                    <img src="/img/dana.png" alt="Logo Dana" className="h-6 w-auto" />
                    <span className="font-medium text-gray-800">Dana</span>
                  </div>
                  {paymentMethod === 'Dana' && <ChevronDown className="h-5 w-5 text-gray-500 transform rotate-180" />}
                </label>
                <AnimatePresence>
                  {paymentMethod === 'Dana' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 overflow-hidden"
                    >
                      <label htmlFor="danaAccount" className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon Dana (cth: 081234567890)</label>
                      <input
                        id="danaAccount"
                        type="text"
                        placeholder="Masukkan nomor Dana Anda"
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={danaAccountInfo}
                        onChange={(e) => setDanaAccountInfo(e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* QRIS */}
              <div className={`border ${paymentMethod === 'QRIS' ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'} rounded-lg transition-all duration-200`}>
                <label className="flex items-center justify-between p-4 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="QRIS"
                      checked={paymentMethod === 'QRIS'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="form-radio h-5 w-5 text-orange-500 border-gray-300 focus:ring-orange-400"
                    />
                    {/* Logo QRIS ditambahkan di sini */}
                    <img src="/img/qris.png" alt="Logo QRIS" className="h-6 w-auto" />
                    <span className="font-medium text-gray-800">QRIS</span>
                  </div>
                  {paymentMethod === 'QRIS' && <ChevronDown className="h-5 w-5 text-gray-500 transform rotate-180" />}
                </label>
                <AnimatePresence>
                  {paymentMethod === 'QRIS' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 overflow-hidden"
                    >
                      <label htmlFor="qrisAccount" className="block text-sm font-medium text-gray-700 mb-2">ID Transaksi QRIS (opsional)</label>
                      <input
                        id="qrisAccount"
                        type="text"
                        placeholder="Masukkan ID Transaksi QRIS Anda"
                        className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                        value={qrisAccountInfo}
                        onChange={(e) => setQrisAccountInfo(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Anda akan diarahkan ke halaman pembayaran QRIS setelah menekan "Proceed To Checkout".
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Schedule</h2>
            <p className="text-sm text-gray-500 mb-6">Pilih Waktu Pengantaran Pesanan Anda</p>
            <div className="relative">
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-lg py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
            </div>
          </div>

          {/* Right Section: Location & Order Name */}
          <div className="w-full lg:w-96 bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Location(Opt)</h2>
            <p className="text-sm text-gray-500 mb-6">Pilih Lokasi Pengantaran Jika Anda Memilih Deliver</p>
            <div className="mb-8">
              <input
                type="text"
                placeholder="Insert Here..."
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Nama</h2>
            <p className="text-sm text-gray-500 mb-6">Masukkan Nama Pemesan</p>
            <div className="mb-8">
              <input
                type="text"
                placeholder="Insert Here..."
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Agreement and Checkout Button */}
        <div className="mt-10 bg-white rounded-lg shadow-md p-6 flex flex-col items-start">
          <label className="flex items-start cursor-pointer mb-6">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-orange-500 rounded mt-1"
              checked={agreementChecked}
              onChange={(e) => setAgreementChecked(e.target.checked)}
            />
            <span className="ml-3 text-sm text-gray-700 leading-relaxed">
              I agree to the terms of the Tomoro Coffee Agreement <br />
              Dana transactions are authorized through the Smart2Pay website. <br />
              Click the button below to open a new web browser to initiate the transaction.
            </span>
          </label>

          <button
            onClick={handleCheckout}
            disabled={!agreementChecked}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-colors duration-200 ${
              agreementChecked
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
      {/* Footer Section */}
      <footer className="relative mt-20 w-full text-white">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/img/image 48.png')" }}
        ></div>

        {/* Overlay gradasi gelap transparan */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
          {/* Left - Logo & Location */}
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

          {/* Right - Social Media */}
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

        {/* Copyright */}
        <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
          Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
        </div>
      </footer>
    </div>
  );
};

export default CheckoutUser;