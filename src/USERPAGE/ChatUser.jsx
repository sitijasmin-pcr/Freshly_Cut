import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Bell, MessageSquareText, Send,UserCircle } from "lucide-react"; // Tambah ikon Send

const ChatUser = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "system",
      time: "9 Apr 2025 at 1:00 pm",
      content: "Halo! Selamat datang di layanan bantuan TOMORO Coffee. Ada yang bisa kami bantu?",
      position: "left"
    },
    {
      id: 2,
      type: "system",
      time: "9 Apr 2025 at 1:00 pm",
      content: "Saat ini Kamu Di Rank Silver! Lakukan Transaksi sebanyak Rp.300.000 Lagi Untuk Naik ke Gold",
      position: "left"
    },
    {
      id: 3,
      type: "label",
      time: "9 Apr 2025 at 1:00 pm",
      content: "MY RANK",
      position: "right"
    },
    {
      id: 4,
      type: "system",
      time: "9 Apr 2025 at 3:00 pm",
      content: "Diskon Produk Coffee 20% Pada Tanggal 7 April 2025\nDiskon Produk Snacks 10% Pada Tanggal 12 April 2025",
      position: "left"
    },
    {
      id: 5,
      type: "label",
      time: "9 Apr 2025 at 3:00 pm",
      content: "UPCOMING EVENT",
      position: "right"
    },
    {
      id: 6,
      type: "system",
      time: "9 Apr 2025 at 1:00 pm",
      content: "Voucher Diskon All Product 20% EXPIRED 20 apr 2025\nVoucher Buy 1 Get 1 Snacks EXPIRED 17 apr 2025",
      position: "left"
    },
    {
      id: 7,
      type: "label",
      time: "9 Apr 2025 at 1:00 pm",
      content: "MY COUPON",
      position: "right"
    },
    {
      id: 8,
      type: "system",
      time: "9 Apr 2025 at 1:05 pm",
      content: "Apakah ada pertanyaan lain yang ingin Anda ajukan terkait event atau kupon kami? Kami siap membantu.",
      position: "left"
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const chatContainerRef = useRef(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      const newMessage = {
        id: messages.length + 1,
        type: "user", // Tipe pesan dari user
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), // Waktu sekarang
        content: inputMessage.trim(),
        position: "right" // Pesan user di kanan
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage("");

      // Contoh respons otomatis (opsional, untuk simulasi)
      setTimeout(() => {
        const autoResponse = {
          id: messages.length + 2,
          type: "system",
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          content: "Terima kasih atas pertanyaannya. Kami akan segera memproses informasi Anda.",
          position: "left"
        };
        setMessages((prevMessages) => [...prevMessages, autoResponse]);
      }, 1000);
    }
  };

  const renderMessageBubble = (msg) => {
    // Pesan dari sistem (kiri)
    if (msg.position === 'left') {
      return (
        <div className="flex items-start gap-3"> {/* Mengurangi gap agar lebih rapat */}
          <div className="p-2 rounded-full bg-gray-200 flex-shrink-0">
            <Bell className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1 max-w-lg"> {/* Menggunakan max-w-lg untuk batas lebar */}
            <div className="bg-gray-100 p-3 rounded-lg shadow-sm"> {/* Padding lebih kecil */}
              <p className="text-sm text-gray-800 whitespace-pre-line">{msg.content}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              {msg.time}
            </p>
          </div>
        </div>
      );
    }

    // Pesan dari user atau label (kanan)
    if (msg.position === 'right') {
      return (
        <div className="flex items-start justify-end gap-3 self-end -mt-8 mr-1"> {/* Mempertahankan -mt-8 untuk efek naik */}
          {msg.type === 'label' ? (
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {msg.time}
              </span>
              <span className={`mt-1 px-3 py-1 rounded-full text-white text-xs font-semibold ${
                  msg.content === 'MY RANK' ? 'bg-black' :
                  msg.content === 'UPCOMING EVENT' ? 'bg-orange-500' :
                  msg.content === 'MY COUPON' ? 'bg-black' : 'bg-gray-700'
              }`}>
                {msg.content}
                <span className="inline-block w-2 h-2 ml-1 rounded-full bg-white"></span>
              </span>
            </div>
          ) : ( // Jika tipe user
            <div className="flex flex-col items-end max-w-lg"> {/* max-w-lg untuk batas lebar */}
              <div className="bg-orange-500 text-white p-3 rounded-lg shadow-sm"> {/* Bubble warna oranye untuk user */}
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {msg.time}
              </p>
            </div>
          )}
          <div className="w-10 h-10 flex-shrink-0"></div> {/* Placeholder untuk ikon di sisi kanan */}
        </div>
      );
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
      {/* Navbar Section (Consistent with other pages) */}
      <nav className="bg-white shadow-sm py-4 px-8 flex-shrink-0">
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

      <div className="container mx-auto px-4 py-8 flex flex-col flex-grow">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-10 flex-shrink-0">
          ASK HERE
        </h1>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 flex-grow flex flex-col">
          {/* Chat messages area */}
          <div ref={chatContainerRef} className="flex flex-col space-y-4 overflow-y-auto pr-2 pb-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                {renderMessageBubble(msg)}
              </div>
            ))}
          </div>

          {/* Chat input area */}
          <div className="mt-6 flex items-center gap-3 flex-shrink-0">
            <input
              type="text"
              className="flex-grow border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              className="bg-orange-500 text-white p-3 rounded-full hover:bg-orange-600 transition-colors shadow-md"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-8 flex justify-center gap-4 flex-shrink-0">
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow">
              MY COUPON
            </button>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow">
              UPCOMING EVENT
            </button>
            <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-colors shadow">
              MY RANK
            </button>
          </div>
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

export default ChatUser;