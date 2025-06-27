// import { useState, useEffect } from "react";
// import { AnimatePresence, motion } from "framer-motion";

// // FAQ content
// const faqData = [
//   {
//     question: "Apakah Tomoro Coffee menggunakan biji kopi lokal?",
//     answer:
//       "Ya, kami hanya menggunakan biji kopi terbaik dari petani lokal untuk menjaga kualitas dan rasa autentik.",
//   },
//   {
//     question: "Apakah tersedia layanan pesan antar?",
//     answer:
//       "Tersedia! Kamu bisa memesan melalui aplikasi kami atau layanan delivery partner seperti Gojek dan Grab.",
//   },
//   {
//     question: "Apakah ada promo untuk pelanggan baru?",
//     answer:
//       "Kami sering mengadakan promo menarik khusus untuk pelanggan baru dan pelanggan setia. Pantau terus media sosial kami ya!",
//   },
//   {
//     question: "Bisakah saya memesan kopi secara custom?",
//     answer:
//       "Tentu saja! Kamu bisa memilih tingkat kekuatan kopi, ukuran, dan tambahan lainnya sesuai selera.",
//   },
// ];

// // Floating icons — hanya kiri & kanan
// const icons = [
//   {
//     id: "coffee-cup",
//     svg: (
//       <svg viewBox="0 0 24 24" className="w-10 h-10 text-orange-300" fill="none" stroke="currentColor" strokeWidth="1.5">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8m-9-6h10a4 4 0 004-4V9H5v2a4 4 0 004 4zM3 9h18" />
//       </svg>
//     ),
//     style: "top-[4rem] left-[-40px] delay-0",
//   },
//   {
//     id: "croissant",
//     svg: (
//       <svg className="w-12 h-12 text-orange-200" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M21 12a9 9 0 01-9 9v-4a5 5 0 005-5h4zm-9 9a9 9 0 01-9-9h4a5 5 0 005 5v4zm-9-9a9 9 0 019-9v4a5 5 0 00-5 5H3zm9-9a9 9 0 019 9h-4a5 5 0 00-5-5V3z" />
//       </svg>
//     ),
//     style: "top-[14rem] left-[-50px] delay-[300ms]",
//   },
//   {
//     id: "donut",
//     svg: (
//       <svg className="w-10 h-10 text-pink-200" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5a1 1 0 10-2 0 1 1 0 002 0z" />
//       </svg>
//     ),
//     style: "bottom-[6rem] right-[-40px] delay-[100ms]",
//   },
//   {
//     id: "tea",
//     svg: (
//       <svg className="w-10 h-10 text-green-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2m-6 0h6m-6 0V9a2 2 0 012-2h2a2 2 0 012 2v8" />
//       </svg>
//     ),
//     style: "top-[10rem] right-[-35px] delay-[600ms]",
//   },
//   {
//     id: "bean",
//     svg: (
//       <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
//         <path d="M12 2C8 2 4 6 4 10s4 8 8 8 8-4 8-8-4-8-8-8z" />
//       </svg>
//     ),
//     style: "bottom-[12rem] left-[-30px] delay-[400ms]",
//   },
// ];

// export default function Faq() {
//   const [openIndex, setOpenIndex] = useState(null);
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

//   const toggleIndex = (index) => {
//     setOpenIndex(openIndex === index ? null : index);
//   };

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       setMousePos({ x: e.clientX, y: e.clientY });
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   return (
//     <div className="relative max-w-4xl mx-auto p-6 z-10">
//       {/* Floating café icons only at left & right edges */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
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

//       <h2 className="text-3xl font-bold mb-6 text-center text-orange-700 relative z-10">
//         FAQ – Pertanyaan Umum
//       </h2>

//       <div className="space-y-4 relative z-10">
//         {faqData.map((item, index) => (
//           <div
//             key={index}
//             className="border border-gray-300 rounded-xl transition focus-within:ring-2 focus-within:ring-orange-500"
//           >
//             <button
//               onClick={() => toggleIndex(index)}
//               className="w-full flex justify-between items-center p-4 font-semibold text-left text-gray-800 hover:bg-orange-50 rounded-xl focus:outline-none"
//               aria-expanded={openIndex === index}
//               aria-controls={`faq-answer-${index}`}
//               id={`faq-question-${index}`}
//             >
//               {item.question}
//               <span
//                 className={`transform transition-transform duration-300 ${
//                   openIndex === index ? "rotate-180" : ""
//                 }`}
//               >
//                 ▼
//               </span>
//             </button>

//             <AnimatePresence initial={false}>
//               {openIndex === index && (
//                 <motion.div
//                   key="answer"
//                   id={`faq-answer-${index}`}
//                   aria-labelledby={`faq-question-${index}`}
//                   initial={{ height: 0, opacity: 0 }}
//                   animate={{ height: "auto", opacity: 1 }}
//                   exit={{ height: 0, opacity: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className="overflow-hidden"
//                 >
//                   <div className="p-4 text-gray-700 bg-orange-50 rounded-b-xl">
//                     {item.answer}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         ))}
//       </div>

//       {/* Floating animation styles */}
//       <style jsx>{`
//         @keyframes float {
//           0% {
//             transform: translateY(0px);
//           }
//           50% {
//             transform: translateY(-8px);
//           }
//           100% {
//             transform: translateY(0px);
//           }
//         }

//         .animate-float {
//           animation: float 5s ease-in-out infinite;
//         }

//         .delay-0 {
//           animation-delay: 0ms;
//         }

//         .delay-\[100ms\] {
//           animation-delay: 100ms;
//         }

//         .delay-\[300ms\] {
//           animation-delay: 300ms;
//         }

//         .delay-\[400ms\] {
//           animation-delay: 400ms;
//         }

//         .delay-\[600ms\] {
//           animation-delay: 600ms;
//         }
//       `}</style>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import FAQForm from "./FAQForm";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const fetchFaqs = async () => {
    const { data, error } = await supabase
      .from("faq")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch FAQ Error:", error);
    } else {
      setFaqs(data);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddNew = () => {
    setEditingFAQ(null);
    setIsFormOpen(true);
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus FAQ ini?")) {
      const { error } = await supabase.from("faq").delete().eq("id", id);
      if (error) {
        console.error("Delete Error:", error);
        alert(`Gagal menghapus: ${error.message}`);
      } else {
        alert("FAQ berhasil dihapus!");
        fetchFaqs();
      }
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingFAQ(null);
    fetchFaqs();
  };

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">FAQ – Pertanyaan Umum</h1>

      {/* Tombol Tambah */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddNew}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg"
        >
          Tambah FAQ Baru
        </button>
      </div>

      {/* List FAQ */}
      <div className="space-y-4">
        {faqs.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada FAQ yang tersedia.</p>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="border border-gray-300 rounded-lg bg-white shadow-sm transition"
            >
              <button
                onClick={() => toggleIndex(index)}
                className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <span
                  className={`transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {openIndex === index && (
                <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>
              )}

              <div className="flex justify-end gap-2 px-4 pb-4">
                <button
                  onClick={() => handleEdit(faq)}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isFormOpen && (
        <FAQForm
          onClose={handleFormClose}
          editingFAQ={editingFAQ}
        />
      )}
    </div>
  );
}
