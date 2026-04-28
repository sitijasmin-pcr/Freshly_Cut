import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, Wallet } from "lucide-react";

export default function PaymentUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const { total } = location.state || { total: 0 };

  const handleConfirmPayment = () => {
    alert("Pembayaran Berhasil! Pesanan sedang diproses.");
    navigate("/HomeUser"); // Arahkan kembali ke Home atau halaman status pesanan
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-black text-green-900 mb-6">Pembayaran</h2>
        
        <div className="bg-green-50 p-4 rounded-2xl mb-6 flex justify-between items-center">
          <span className="text-green-800 font-bold">Total Tagihan</span>
          <span className="text-xl font-black text-green-600">Rp {total.toLocaleString("id-ID")}</span>
        </div>

        <div className="space-y-4 mb-8">
          <label className="block text-sm font-bold text-gray-500 uppercase">Pilih Metode</label>
          <div className="grid gap-3">
            {["QRIS", "Transfer Bank", "E-Wallet"].map((method) => (
              <button key={method} className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-green-500 transition-all font-bold text-gray-700">
                {method === "QRIS" ? <Wallet size={20}/> : <CreditCard size={20}/>}
                {method}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleConfirmPayment}
          className="w-full bg-green-600 text-white py-4 rounded-2xl font-black hover:bg-green-700 transition-all"
        >
          Konfirmasi Bayar
        </button>
      </div>
    </div>
  );
}