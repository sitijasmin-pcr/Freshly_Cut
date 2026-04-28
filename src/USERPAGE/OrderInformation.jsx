// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { supabase } from "../supabase";
// import { Clock } from "lucide-react";
// import Swal from "sweetalert2";

// export default function OrderInformation() {
//   const { orderId } = useParams(); // Tangkap ID dari URL
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       const { data } = await supabase.from("orders").select("*").eq("id", orderId).single();
//       if (data) setOrder(data);
//     };
//     fetchOrder();
//   }, [orderId]);

//   const handleConfirm = async () => {
//     await supabase.from("orders").update({ status: "Completed" }).eq("id", orderId);
//     Swal.fire("Sukses", "Pembayaran Diterima", "success");
//     navigate("/HomeUser");
//   };

//   if (!order) return <p>Loading...</p>;

//   return (
//     <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
//       <div className="bg-white p-10 rounded-3xl text-center shadow-lg w-full max-w-sm">
//         <Clock className="mx-auto text-green-600 mb-4" size={50} />
//         <h2 className="text-2xl font-black">Menunggu Pembayaran</h2>
//         <p className="text-4xl font-bold my-6">Rp {order.total_amount?.toLocaleString("id-ID")}</p>
//         <button onClick={handleConfirm} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold">
//           Konfirmasi Pembayaran
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { Clock } from "lucide-react";
import Swal from "sweetalert2";

export default function OrderInformation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  
  // State untuk timer (300 detik = 5 menit)
  const [timeLeft, setTimeLeft] = useState(300); 

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase.from("orders").select("*").eq("id", orderId).single();
      if (data) setOrder(data);
    };
    fetchOrder();
  }, [orderId]);

  // LOGIKA COUNTDOWN
  useEffect(() => {
    // Fungsi untuk update status ke database
    const cancelOrder = async () => {
      try {
        await supabase
          .from("orders")
          .update({ status: "Canceled" })
          .eq("id", orderId);
        
        Swal.fire({
          title: "Waktu Habis",
          text: "Pesanan telah dibatalkan karena waktu pembayaran habis.",
          icon: "error",
          confirmButtonText: "Kembali ke Menu"
        }).then(() => {
          navigate("/HomeUser");
        });
      } catch (error) {
        console.error("Gagal membatalkan pesanan:", error);
      }
    };

    // JIKA WAKTU HABIS
    if (timeLeft <= 0) {
      cancelOrder();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, navigate, orderId]);

  // Format waktu menjadi MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirm = async () => {
    await supabase.from("orders").update({ status: "Completed" }).eq("id", orderId);
    Swal.fire("Sukses", "Pembayaran Diterima", "success");
    navigate("/HomeUser");
  };

  if (!order) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="bg-white p-10 rounded-3xl text-center shadow-lg w-full max-w-sm">
        <Clock className="mx-auto text-green-600 mb-4" size={50} />
        <h2 className="text-2xl font-black text-green-900">Menunggu Pembayaran</h2>
        
        {/* TAMPILAN TIMER */}
        <div className="text-5xl font-black text-orange-600 my-6 tabular-nums">
          {formatTime(timeLeft)}
        </div>

        <p className="text-gray-500 font-bold mb-2">Total Tagihan:</p>
        <p className="text-3xl font-black text-green-900 mb-8">
          Rp {order.total_amount?.toLocaleString("id-ID")}
        </p>

        <button 
          onClick={handleConfirm} 
          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all"
        >
          Konfirmasi Pembayaran
        </button>
      </div>
    </div>
  );
}