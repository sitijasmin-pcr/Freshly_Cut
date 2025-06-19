import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, XCircle, CheckCircle } from "lucide-react";

export default function EmployeeQuest() {
  const [quests, setQuests] = useState([
    {
      title: "Cuci Piring",
      image: "https://cdn-icons-png.flaticon.com/512/2867/2867300.png",
      done: false,
      dissolving: false,
    },
    {
      title: "Restock Barang",
      image: "https://cdn-icons-png.flaticon.com/512/2933/2933917.png",
      done: false,
      dissolving: false,
    },
  ]);

  const [messages, setMessages] = useState(["INSERT MESSAGE HERE"]);
  const [targets, setTargets] = useState([
    "Rp 1,000,000",
    "4 New Customer",
    "10 Customer",
    "All quest cleared",
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  const [newMessage, setNewMessage] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newQuest, setNewQuest] = useState({
    title: "",
    imageFile: null,
    imageUrl: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalImage = newQuest.imageUrl;
    if (newQuest.imageFile) {
      finalImage = URL.createObjectURL(newQuest.imageFile);
    }
    if (newQuest.title && finalImage) {
      setQuests([...quests, { title: newQuest.title, image: finalImage, done: false, dissolving: false }]);
      setNewQuest({ title: "", imageFile: null, imageUrl: "" });
      setIsModalOpen(false);
    }
  };

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, newMessage.trim()]);
      setNewMessage("");
      setIsMessageModalOpen(false);
    }
  };

  const handleAddTarget = (e) => {
    e.preventDefault();
    if (newTarget.trim()) {
      setTargets([...targets, newTarget.trim()]);
      setNewTarget("");
      setIsTargetModalOpen(false);
    }
  };

  const markAsDone = (index) => {
    const updated = [...quests];
    updated[index].dissolving = true;
    setQuests(updated);

    setTimeout(() => {
      updated[index].done = true;
      updated[index].dissolving = false;
      setQuests([...updated]);
    }, 900); // sesuai durasi animasi
  };

  return (
    <div className="p-6 bg-white min-h-screen relative">
      <style>{`
        .dissolve {
          animation: dissolve 0.9s forwards;
        }
        @keyframes dissolve {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-20px) scale(0.8);
            filter: blur(8px);
          }
        }
      `}</style>

      <div className="text-3xl font-bold text-orange-600 mb-6">Employee Quest</div>

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white border shadow rounded-xl p-4 flex flex-col justify-between">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Todays Message</h2>
          <ul className="text-xs text-gray-400 mb-4 list-disc list-inside">
            {messages.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
          <button
            onClick={() => setIsMessageModalOpen(true)}
            className="bg-orange-500 text-white text-sm px-2 py-1 rounded-full w-fit self-end"
          >+</button>
        </div>

        <div className="col-span-3 grid grid-cols-3 gap-4">
          <SummaryCard label="Quest Done" value={quests.filter(q => q.done).length} />
          <SummaryCard label="Shift" value="9.00AM - 2.00AM" icon="🕒" />
          <SummaryCard label="Quest Remain" value={quests.filter(q => !q.done).length} />
        </div>

        <div className="bg-white border shadow rounded-xl p-4 flex flex-col justify-between">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Todays Target</h2>
          <ul className="text-xs text-gray-600 list-disc list-inside mb-4">
            {targets.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
          <button
            onClick={() => setIsTargetModalOpen(true)}
            className="bg-orange-500 text-white text-sm px-2 py-1 rounded-full w-fit self-end"
          >+</button>
        </div>
      </div>

      {/* Quest List */}
      <div className="bg-white border shadow rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-orange-600">Quest List</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Tambah Quest
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {quests.map((item, index) => (
            <div
              key={index}
              className={`bg-white border shadow rounded-xl flex flex-col items-center p-4 transition-all duration-500 ${
                item.dissolving ? "dissolve" : ""
              }`}
            >
              <img src={item.image} alt={item.title} className="w-16 h-16 object-contain mb-2" />
              <h3 className="text-md font-semibold text-gray-700 mb-1">{item.title}</h3>

              {item.done ? (
                <span className="mt-2 px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                  <CheckCircle size={14} /> Done
                </span>
              ) : (
                <>
                  <span className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full flex items-center gap-1">
                    <XCircle size={14} /> Not Finish
                  </span>
                  <button
                    onClick={() => markAsDone(index)}
                    className="mt-2 text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600"
                  >
                    Mark as Done
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Quest Baru">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Judul Quest" value={newQuest.title} onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })} />
          <Input label="Upload Gambar" type="file" accept="image/*" onChange={(e) => setNewQuest({ ...newQuest, imageFile: e.target.files[0] })} />
          <Input label="Atau Link Gambar" value={newQuest.imageUrl} onChange={(e) => setNewQuest({ ...newQuest, imageUrl: e.target.value })} />
          <SubmitButton />
        </form>
      </Modal>

      <Modal open={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} title="Tambah Message">
        <form onSubmit={handleAddMessage} className="space-y-4">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Isi pesan..." />
          <SubmitButton />
        </form>
      </Modal>

      <Modal open={isTargetModalOpen} onClose={() => setIsTargetModalOpen(false)} title="Tambah Target">
        <form onSubmit={handleAddTarget} className="space-y-4">
          <Input value={newTarget} onChange={(e) => setNewTarget(e.target.value)} placeholder="Isi target..." />
          <SubmitButton />
        </form>
      </Modal>
    </div>
  );
}

// Reusable Modal
function Modal({ open, onClose, title, children }) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl bg-white px-6 py-6 mx-auto relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
          <Dialog.Title className="text-lg font-bold mb-4 text-orange-700">{title}</Dialog.Title>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

// Reusable Input
function Input({ label, type = "text", ...props }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold mb-1">{label}</label>}
      <input type={type} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500" {...props} />
    </div>
  );
}

// Reusable Button
function SubmitButton() {
  return (
    <div className="flex justify-end">
      <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold">
        Simpan
      </button>
    </div>
  );
}

// Reusable Summary Card
function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white shadow rounded-xl flex flex-col items-center justify-center p-4 text-center">
      {icon && <span className="text-4xl text-orange-500">{icon}</span>}
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-1xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
