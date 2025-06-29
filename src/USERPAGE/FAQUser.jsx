// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";
// import { AnimatePresence, motion } from "framer-motion";
// import { Link } from "react-router-dom";
// import { ShoppingCart, Bell } from "lucide-react";
// import { useCart } from "./CartContext"; // Pastikan path ini benar
// import { FaUserCircle } from "react-icons/fa";

// export default function Produk() {
//   // Inisialisasi state untuk posisi mouse
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   // Inisialisasi state untuk FAQ
//   const [faqs, setFaqs] = useState([]);
//   const [openIndex, setOpenIndex] = useState(null);

//   // Efek untuk melacak posisi mouse
//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   // Efek untuk mengambil data FAQ dari Supabase
//   useEffect(() => {
//     const fetchFaqs = async () => {
//       const { data, error } = await supabase.from("faqs").select("*");
//       if (error) {
//         console.error("Error fetching FAQs:", error.message);
//       } else {
//         setFaqs(data);
//       }
//     };
//     fetchFaqs();
//   }, []);

//   // Fungsi untuk membuka/menutup accordion FAQ
//   const toggleIndex = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   const icons = [
//     {
//       id: "coffee-cup",
//       svg: (
//         <svg
//           viewBox="0 0 24 24"
//           className="w-10 h-10 text-orange-300"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M8 21h8m-9-6h10a4 4 0 004-4V9H5v2a4 4 0 004 4zM3 9h18"
//           />
//         </svg>
//       ),
//       style: "top-[4rem] left-[-40px] delay-0",
//     },
//     {
//       id: "croissant",
//       svg: (
//         <svg
//           className="w-12 h-12 text-orange-200"
//           fill="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path d="M21 12a9 9 0 01-9 9v-4a5 5 0 005-5h4zm-9 9a9 9 0 01-9-9h4a5 5 0 005 5v4zm-9-9a9 9 0 019-9v4a5 5 0 00-5 5H3zm9-9a9 9 0 019 9h-4a5 5 0 00-5-5V3z" />
//         </svg>
//       ),
//       style: "top-[14rem] left-[-50px] delay-[300ms]",
//     },
//     {
//       id: "donut",
//       svg: (
//         <svg
//           className="w-10 h-10 text-pink-200"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0 1 1 0 002 0z"
//           />
//         </svg>
//       ),
//       style: "bottom-[6rem] right-[-40px] delay-[100ms]",
//     },
//     {
//       id: "tea",
//       svg: (
//         <svg
//           className="w-10 h-10 text-green-300"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.5"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2m-6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v8"
//           />
//         </svg>
//       ),
//       style: "top-[10rem] right-[-35px] delay-[600ms]",
//     },
//     {
//       id: "bean",
//       svg: (
//         <svg
//           className="w-8 h-8 text-amber-400"
//           fill="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path d="M12 2C8 2 4 6 4 10s4 8 8 8 8-4 8-8-4-8-8-8z" />
//         </svg>
//       ),
//       style: "bottom-[12rem] left-[-30px] delay-[400ms]",
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
//       {/* Navbar */}
//       <nav className="bg-white shadow-sm py-4 px-8">
//         <div className="flex justify-between items-center border-b pb-3 mb-6">
//           {/* Logo */}
//           <div className="flex items-center gap-3">
//             <img src="/img/Logo.png" alt="Logo" className="h-10" />
//             <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
//               TOMORO{" "}
//               <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">
//                 COFFEE
//               </span>
//             </h1>
//           </div>

//           {/* Menu */}
//           <nav className="flex gap-8 text-sm font-medium text-gray-700">
//             <Link to="/HomeUser" className="hover:text-orange-500">
//               Home
//             </Link>
//             <Link to="/MenuUser" className="hover:text-orange-500">
//               Menu
//             </Link>
//             <Link to="/ProfInfo" className="hover:text-orange-500">
//               Story
//             </Link>
//             <Link to="/FAQUser" className="hover:text-orange-500">
//               FAQ
//             </Link>
//             <Link to="/feedback" className="hover:text-orange-500">
//               Feedback
//             </Link>
//             <Link to="/Lokasi" className="hover:text-orange-500">
//               Location
//             </Link>
//           </nav>

//           {/* Icon */}
//           <div className="flex items-center gap-4">
//             <Link to="/ProfileUser" className="text-orange-500 hover:text-orange-600">
//               <FaUserCircle className="w-5 h-5" />
//             </Link>
//             <Link to="/CartUser" className="text-orange-500 hover:text-orange-600">
//               <ShoppingCart className="w-5 h-5" />
//             </Link>
//             <Link to="/NotificationUser" className="text-orange-500 hover:text-orange-600">
//               <Bell className="w-5 h-5" />
//             </Link>
//           </div>
//         </div>
//       </nav>

//       {/* Floating café icons */}
//       <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
//         {icons.map((icon) => (
//           <div
//             key={icon.id}
//             className={`absolute hidden lg:block ${icon.style} animate-float`}
//             style={{
//               transform: `translate(calc(${mousePos.x}px * 0.005), calc(${mousePos.y}px * 0.005))`,
//             }}
//           >
//             {icon.svg}
//           </div>
//         ))}
//       </div>

//       {/* FAQ Section */}
//       <div className="flex-grow relative max-w-4xl mx-auto p-6 z-10 w-full">
//         <h2 className="text-3xl font-bold mb-6 text-center text-orange-700">
//           FAQ – Pertanyaan Umum
//         </h2>

//         {faqs.length === 0 ? (
//           <p className="text-center text-gray-500">Belum ada FAQ tersedia.</p>
//         ) : (
//           <div className="space-y-4 relative z-10">
//             {faqs.map((faq, index) => (
//               <div
//                 key={faq.id}
//                 className="border border-gray-300 rounded-xl transition focus-within:ring-2 focus-within:ring-orange-500"
//               >
//                 <button
//                   onClick={() => toggleIndex(index)}
//                   className="w-full flex justify-between items-center p-4 font-semibold text-left text-gray-800 hover:bg-orange-50 rounded-xl focus:outline-none"
//                 >
//                   {faq.question}
//                   <span
//                     className={`transform transition-transform duration-300 ${
//                       openIndex === index ? "rotate-180" : ""
//                     }`}
//                   >
//                     ▼
//                   </span>
//                 </button>

//                 <AnimatePresence initial={false}>
//                   {openIndex === index && (
//                     <motion.div
//                       initial={{ height: 0, opacity: 0 }}
//                       animate={{ height: "auto", opacity: 1 }}
//                       exit={{ height: 0, opacity: 0 }}
//                       transition={{ duration: 0.3 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="p-4 text-gray-700 bg-orange-50 rounded-b-xl">
//                         {faq.answer}
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       <footer className="relative mt-20 w-full text-white">
//         <div
//           className="absolute inset-0 bg-cover bg-center"
//           style={{ backgroundImage: "url('/img/image 48.png')" }}
//         ></div>
//         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
//         <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
//           <div>
//             <div className="flex items-center gap-3 mb-4">
//               <img src="/img/Logo.png" alt="Logo" className="h-10" />
//               <div>
//                 <h2 className="text-xl font-bold text-orange-400">TOMORO</h2>
//                 <p className="text-sm tracking-[0.3em] text-orange-300">
//                   COFFEE
//                 </p>
//               </div>
//             </div>
//             <div className="text-sm leading-relaxed">
//               <p className="text-orange-400 font-semibold mb-1">Our Location</p>
//               <p>Headquarters</p>
//               <p>Jl. Riau No.57 B, Kp. Bandar, Kec. Senapelan, Kota Pekanbaru, Riau 28291</p>
//             </div>
//           </div>
//           <div className="text-sm">
//             <p className="text-orange-400 font-semibold mb-2">Social Media</p>
//             <div className="flex gap-4 text-lg">
//               <a href="#" className="hover:text-orange-300">
//                 <i className="fab fa-instagram"></i>
//               </a>
//               <a href="#" className="hover:text-orange-300">
//                 <i className="fab fa-tiktok"></i>
//               </a>
//               <a href="mailto:contact@tomorocoffee.com" className="hover:text-orange-300">
//                 <i className="fas fa-envelope"></i>
//               </a>
//             </div>
//           </div>
//         </div>
//         <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
//           Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
//         </div>
//       </footer>

//       {/* Floating Animation Styles */}
//       <style>{`
//         @keyframes float {
//           0% { transform: translateY(0px); }
//           50% { transform: translateY(-8px); }
//           100% { transform: translateY(0px); }
//         }
//         .animate-float { animation: float 5s ease-in-out infinite; }
//         .delay-0 { animation-delay: 0ms; }
//         .delay-\\[100ms\\] { animation-delay: 100ms; }
//         .delay-\\[300ms\\] { animation-delay: 300ms; }
//         .delay-\\[400ms\\] { animation-delay: 400ms; }
//         .delay-\\[600ms\\] { animation-delay: 600ms; }
//       `}</style>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Bell } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

export default function Produk() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // Mengambil data FAQ dari Supabase
  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase.from("faq").select("*");
      if (error) {
        console.error("Gagal mengambil data FAQ:", error.message);
      } else {
        setFaqs(data);
      }
    };
    fetchFaqs();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const icons = [
    // Icon café animation
    {
      id: "coffee-cup",
      svg: (
        <svg
          viewBox="0 0 24 24"
          className="w-10 h-10 text-orange-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 21h8m-9-6h10a4 4 0 004-4V9H5v2a4 4 0 004 4zM3 9h18"
          />
        </svg>
      ),
      style: "top-[4rem] left-[-40px] delay-0",
    },
    {
      id: "croissant",
      svg: (
        <svg className="w-12 h-12 text-orange-200" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 12a9 9 0 01-9 9v-4a5 5 0 005-5h4zm-9 9a9 9 0 01-9-9h4a5 5 0 005 5v4zm-9-9a9 9 0 019-9v4a5 5 0 00-5 5H3zm9-9a9 9 0 019 9h-4a5 5 0 00-5-5V3z" />
        </svg>
      ),
      style: "top-[14rem] left-[-50px] delay-[300ms]",
    },
    {
      id: "donut",
      svg: (
        <svg
          className="w-10 h-10 text-pink-200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0 1 1 0 002 0z" />
        </svg>
      ),
      style: "bottom-[6rem] right-[-40px] delay-[100ms]",
    },
    {
      id: "tea",
      svg: (
        <svg
          className="w-10 h-10 text-green-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2m-6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v8" />
        </svg>
      ),
      style: "top-[10rem] right-[-35px] delay-[600ms]",
    },
    {
      id: "bean",
      svg: (
        <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8 2 4 6 4 10s4 8 8 8 8-4 8-8-4-8-8-8z" />
        </svg>
      ),
      style: "bottom-[12rem] left-[-30px] delay-[400ms]",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4 px-8">
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <div className="flex items-center gap-3">
            <img src="/img/Logo.png" alt="Logo" className="h-10" />
            <h1 className="text-2xl font-bold text-orange-600 tracking-wide">
              TOMORO <span className="block text-xs font-normal text-orange-500 tracking-[.25em]">COFFEE</span>
            </h1>
          </div>

          <nav className="flex gap-8 text-sm font-medium">
            <Link
              to="/HomeUser"
              className={`transition-colors ${location.pathname === "/HomeUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Home
            </Link>
            <Link
              to="/MenuUser"
              className={`transition-colors ${location.pathname === "/MenuUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Menu
            </Link>
            <Link
              to="/ProfInfo"
              className={`transition-colors ${location.pathname === "/ProfInfo"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Story
            </Link>
            <Link
              to="/FAQUser"
              className={`transition-colors ${location.pathname === "/FAQUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              FAQ
            </Link>
            <Link
              to="/FeedbackUser"
              className={`transition-colors ${location.pathname === "/FeedbackUser"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Feedback
            </Link>
            <Link
              to="/lokasi"
              className={`transition-colors ${location.pathname === "/lokasi"
                  ? "text-orange-500 font-bold"
                  : "text-gray-700 hover:text-orange-500"
                }`}
            >
              Location
            </Link>
          </nav>


          <div className="flex items-center gap-4">
            <Link to="/ProfileUser" className="text-orange-500 hover:text-orange-600"><FaUserCircle className="w-5 h-5" /></Link>
            <Link to="/CartUser" className="text-orange-500 hover:text-orange-600"><ShoppingCart className="w-5 h-5" /></Link>
            <Link to="/NotificationUser" className="text-orange-500 hover:text-orange-600"><Bell className="w-5 h-5" /></Link>
          </div>
        </div>
      </nav>

      {/* Floating icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {icons.map((icon) => (
          <div
            key={icon.id}
            className={`absolute hidden lg:block ${icon.style} animate-float`}
            style={{ transform: `translate(calc(${mousePos.x}px * 0.005), calc(${mousePos.y}px * 0.005))` }}
          >
            {icon.svg}
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="flex-grow relative max-w-4xl mx-auto p-6 z-10 w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-700">FAQ – Pertanyaan Umum</h2>

        {faqs.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada FAQ tersedia.</p>
        ) : (
          <div className="space-y-4 relative z-10">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="border border-gray-300 rounded-xl transition focus-within:ring-2 focus-within:ring-orange-500"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full flex justify-between items-center p-4 font-semibold text-left text-gray-800 hover:bg-orange-50 rounded-xl focus:outline-none"
                >
                  {faq.question}
                  <span className={`transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}>▼</span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 text-gray-700 bg-orange-50 rounded-b-xl">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative mt-20 w-full text-white">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/img/image 48.png')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 text-white">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/img/Logo.png" alt="Logo" className="h-10" />
              <div>
                <h2 className="text-xl font-bold text-orange-400">TOMORO</h2>
                <p className="text-sm tracking-[0.3em] text-orange-300">COFFEE</p>
              </div>
            </div>
            <div className="text-sm leading-relaxed">
              <p className="text-orange-400 font-semibold mb-1">Our Location</p>
              <p>Headquarters</p>
              <p>Jl. Riau No.57 B, Kp. Bandar, Kec. Senapelan, Kota Pekanbaru, Riau 28291</p>
            </div>
          </div>
          <div className="text-sm">
            <p className="text-orange-400 font-semibold mb-2">Social Media</p>
            <div className="flex gap-4 text-lg">
              <a href="#" className="hover:text-orange-300"><i className="fab fa-instagram"></i></a>
              <a href="#" className="hover:text-orange-300"><i className="fab fa-tiktok"></i></a>
              <a href="mailto:contact@tomorocoffee.com" className="hover:text-orange-300"><i className="fas fa-envelope"></i></a>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-center text-sm text-white bg-black/40 py-2">
          Hak Cipta © 2025 PT KOPI BINTANG INDONESIA
        </div>
      </footer>

      {/* Floating Animation Style */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .delay-0 { animation-delay: 0ms; }
        .delay-\\[100ms\\] { animation-delay: 100ms; }
        .delay-\\[300ms\\] { animation-delay: 300ms; }
        .delay-\\[400ms\\] { animation-delay: 400ms; }
        .delay-\\[600ms\\] { animation-delay: 600ms; }
      `}</style>
    </div>
  );
}
