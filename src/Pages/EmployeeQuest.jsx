// import React, { useEffect, useState } from "react";
// import { Dialog } from "@headlessui/react";
// import { X, XCircle, CheckCircle } from "lucide-react";
// import { supabase } from "../supabase";
// import Swal from "sweetalert2";

// export default function EmployeeQuest() {
//   const [quests, setQuests] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [targets, setTargets] = useState([]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
//   const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

//   const [newMessage, setNewMessage] = useState("");
//   const [newTarget, setNewTarget] = useState("");
//   const [newQuest, setNewQuest] = useState({
//     title: "",
//     imageFile: null,
//     imageUrl: "",
//   });

//   const fetchAllData = async () => {
//     const { data: questData } = await supabase.from("quests").select("*");
//     const { data: messageData } = await supabase.from("messages").select("*");
//     const { data: targetData } = await supabase.from("targets").select("*");

//     setQuests(questData || []);
//     setMessages(messageData?.map((m) => m.text) || []);
//     setTargets(targetData?.map((t) => t.text) || []);
//   };

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   const handleSubmitQuest = async (e) => {
//     e.preventDefault();
//     let finalImage = newQuest.imageUrl;

//     if (newQuest.imageFile) {
//       finalImage = URL.createObjectURL(newQuest.imageFile);
//     }

//     if (newQuest.title && finalImage) {
//       const { error } = await supabase.from("quests").insert([
//         { title: newQuest.title, image: finalImage, done: false },
//       ]);

//       if (!error) {
//         Swal.fire("Berhasil", "Quest ditambahkan", "success");
//         setNewQuest({ title: "", imageFile: null, imageUrl: "" });
//         setIsModalOpen(false);
//         fetchAllData();
//       }
//     }
//   };

//   const handleAddMessage = async (e) => {
//     e.preventDefault();
//     if (newMessage.trim()) {
//       const { error } = await supabase
//         .from("messages")
//         .insert([{ text: newMessage.trim() }]);
//       if (!error) {
//         Swal.fire("Berhasil", "Message ditambahkan", "success");
//         setNewMessage("");
//         setIsMessageModalOpen(false);
//         fetchAllData();
//       }
//     }
//   };

//   const handleAddTarget = async (e) => {
//     e.preventDefault();
//     if (newTarget.trim()) {
//       const { error } = await supabase
//         .from("targets")
//         .insert([{ text: newTarget.trim() }]);
//       if (!error) {
//         Swal.fire("Berhasil", "Target ditambahkan", "success");
//         setNewTarget("");
//         setIsTargetModalOpen(false);
//         fetchAllData();
//       }
//     }
//   };

//   const markAsDone = async (id) => {
//     const { error } = await supabase
//       .from("quests")
//       .update({ done: true })
//       .eq("id", id);

//     if (!error) {
//       Swal.fire("Berhasil", "Quest ditandai selesai", "success");
//       fetchAllData();
//     }
//   };

//   return (
//     <div className="p-6 bg-white min-h-screen relative">
//       <div className="text-3xl font-bold text-orange-600 mb-6">
//         Employee Quest
//       </div>

//       {/* Header */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//         <SummaryCard
//           label="Todays Message"
//           content={messages}
//           onAdd={() => setIsMessageModalOpen(true)}
//         />
//         <div className="col-span-3 grid grid-cols-3 gap-4">
//           <SummaryCard
//             label="Quest Done"
//             value={quests.filter((q) => q.done).length}
//           />
//           <SummaryCard label="Shift" value="9.00AM - 2.00AM" />
//           <SummaryCard
//             label="Quest Remain"
//             value={quests.filter((q) => !q.done).length}
//           />
//         </div>
//         <SummaryCard
//           label="Todays Target"
//           content={targets}
//           onAdd={() => setIsTargetModalOpen(true)}
//         />
//       </div>

//       {/* Quest List */}
//       <div className="bg-white border shadow rounded-2xl p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-orange-600">Quest List</h2>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
//           >
//             + Tambah Quest
//           </button>
//         </div>

//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//           {quests.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white border shadow rounded-xl flex flex-col items-center p-4"
//             >
//               <img
//                 src={item.image}
//                 alt={item.title}
//                 className="w-16 h-16 object-contain mb-2"
//               />
//               <h3 className="text-md font-semibold text-gray-700 mb-1">
//                 {item.title}
//               </h3>

//               {item.done ? (
//                 <span className="mt-2 px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full flex items-center gap-1">
//                   <CheckCircle size={14} /> Done
//                 </span>
//               ) : (
//                 <button
//                   onClick={() => markAsDone(item.id)}
//                   className="mt-2 text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600"
//                 >
//                   Mark as Done
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Modals */}
//       <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Quest Baru">
//         <form onSubmit={handleSubmitQuest} className="space-y-4">
//           <Input
//             label="Judul Quest"
//             value={newQuest.title}
//             onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
//           />
//           <Input
//             label="Upload Gambar"
//             type="file"
//             accept="image/*"
//             onChange={(e) => setNewQuest({ ...newQuest, imageFile: e.target.files[0] })}
//           />
//           <Input
//             label="Atau Link Gambar"
//             value={newQuest.imageUrl}
//             onChange={(e) => setNewQuest({ ...newQuest, imageUrl: e.target.value })}
//           />
//           <SubmitButton />
//         </form>
//       </Modal>

//       <Modal open={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} title="Tambah Message">
//         <form onSubmit={handleAddMessage} className="space-y-4">
//           <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Isi pesan..." />
//           <SubmitButton />
//         </form>
//       </Modal>

//       <Modal open={isTargetModalOpen} onClose={() => setIsTargetModalOpen(false)} title="Tambah Target">
//         <form onSubmit={handleAddTarget} className="space-y-4">
//           <Input value={newTarget} onChange={(e) => setNewTarget(e.target.value)} placeholder="Isi target..." />
//           <SubmitButton />
//         </form>
//       </Modal>
//     </div>
//   );
// }

// // Reusable Modal
// function Modal({ open, onClose, title, children }) {
//   return (
//     <Dialog open={open} onClose={onClose} className="relative z-50">
//       <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
//       <div className="fixed inset-0 flex items-center justify-center p-4">
//         <Dialog.Panel className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl bg-white px-6 py-6 mx-auto relative">
//           <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
//             <X className="w-5 h-5" />
//           </button>
//           <Dialog.Title className="text-lg font-bold mb-4 text-orange-700">{title}</Dialog.Title>
//           {children}
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   );
// }

// // Reusable Input
// function Input({ label, type = "text", ...props }) {
//   return (
//     <div>
//       {label && <label className="block text-sm font-semibold mb-1">{label}</label>}
//       <input type={type} className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500" {...props} />
//     </div>
//   );
// }

// // Reusable Button
// function SubmitButton() {
//   return (
//     <div className="flex justify-end">
//       <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl font-semibold">
//         Simpan
//       </button>
//     </div>
//   );
// }

// // Reusable Summary Card
// function SummaryCard({ label, value, content, onAdd }) {
//   return (
//     <div className="bg-white border shadow rounded-xl p-4 flex flex-col justify-between">
//       <h2 className="text-sm font-semibold text-gray-500 mb-2">{label}</h2>
//       {content ? (
//         <ul className="text-xs text-gray-600 mb-4 list-disc list-inside">
//           {content.map((item, i) => (
//             <li key={i}>{item}</li>
//           ))}
//         </ul>
//       ) : (
//         <p className="text-2xl font-bold text-gray-800">{value}</p>
//       )}
//       {onAdd && (
//         <button
//           onClick={onAdd}
//           className="bg-orange-500 text-white text-sm px-2 py-1 rounded-full w-fit self-end"
//         >
//           +
//         </button>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { X, XCircle, CheckCircle, Edit, Trash2 } from "lucide-react"; // Import ikon Edit dan Trash2
import { supabase } from "../supabase";
import Swal from "sweetalert2";

export default function EmployeeQuest() {
  const [quests, setQuests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [targets, setTargets] = useState([]);

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
  const [editingQuest, setEditingQuest] = useState(null); // State baru untuk quest yang sedang diedit

  const fetchAllData = async () => {
    const { data: questData, error: questError } = await supabase.from("quests").select("*");
    const { data: messageData, error: messageError } = await supabase.from("messages").select("*");
    const { data: targetData, error: targetError } = await supabase.from("targets").select("*");

    if (questError) console.error("Error fetching quests:", questError.message);
    if (messageError) console.error("Error fetching messages:", messageError.message);
    if (targetError) console.error("Error fetching targets:", targetError.message);

    setQuests(questData || []);
    setMessages(messageData?.map((m) => m.text) || []);
    setTargets(targetData?.map((t) => t.text) || []);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSubmitQuest = async (e) => {
    e.preventDefault();
    let finalImage = newQuest.imageUrl;

    // Handle image file upload (if any)
    if (newQuest.imageFile) {
      const file = newQuest.imageFile;
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('quest_images') // Pastikan bucket ini ada di Supabase Anda
        .upload(fileName, file);

      if (uploadError) {
        Swal.fire("Error", `Gagal mengunggah gambar: ${uploadError.message}`, "error");
        console.error("Upload Error:", uploadError);
        return;
      }
      finalImage = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/quest_images/${fileName}`; // Sesuaikan dengan URL bucket Anda
    } else if (editingQuest && !newQuest.imageUrl && !newQuest.imageFile) {
      // Jika dalam mode edit dan tidak ada gambar baru atau URL, gunakan gambar lama
      finalImage = editingQuest.image;
    }


    if (newQuest.title && finalImage) {
      if (editingQuest) {
        // Mode Edit
        const { error } = await supabase
          .from("quests")
          .update({ title: newQuest.title, image: finalImage })
          .eq("id", editingQuest.id);

        if (!error) {
          Swal.fire("Berhasil", "Quest berhasil diperbarui", "success");
          setEditingQuest(null);
          setNewQuest({ title: "", imageFile: null, imageUrl: "" });
          setIsModalOpen(false);
          fetchAllData();
        } else {
          Swal.fire("Error", `Gagal memperbarui quest: ${error.message}`, "error");
          console.error("Update Error:", error);
        }
      } else {
        // Mode Tambah Baru
        const { error } = await supabase.from("quests").insert([
          { title: newQuest.title, image: finalImage, done: false },
        ]);

        if (!error) {
          Swal.fire("Berhasil", "Quest ditambahkan", "success");
          setNewQuest({ title: "", imageFile: null, imageUrl: "" });
          setIsModalOpen(false);
          fetchAllData();
        } else {
          Swal.fire("Error", `Gagal menambahkan quest: ${error.message}`, "error");
          console.error("Insert Error:", error);
        }
      }
    } else {
      Swal.fire("Peringatan", "Judul quest dan gambar tidak boleh kosong!", "warning");
    }
  };

  const handleAddMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const { error } = await supabase
        .from("messages")
        .insert([{ text: newMessage.trim() }]);
      if (!error) {
        Swal.fire("Berhasil", "Message ditambahkan", "success");
        setNewMessage("");
        setIsMessageModalOpen(false);
        fetchAllData();
      } else {
        Swal.fire("Error", `Gagal menambahkan pesan: ${error.message}`, "error");
        console.error("Insert Message Error:", error);
      }
    }
  };

  const handleAddTarget = async (e) => {
    e.preventDefault();
    if (newTarget.trim()) {
      const { error } = await supabase
        .from("targets")
        .insert([{ text: newTarget.trim() }]);
      if (!error) {
        Swal.fire("Berhasil", "Target ditambahkan", "success");
        setNewTarget("");
        setIsTargetModalOpen(false);
        fetchAllData();
      } else {
        Swal.fire("Error", `Gagal menambahkan target: ${error.message}`, "error");
        console.error("Insert Target Error:", error);
      }
    }
  };

  const markAsDone = async (id) => {
    const { error } = await supabase
      .from("quests")
      .update({ done: true })
      .eq("id", id);

    if (!error) {
      Swal.fire("Berhasil", "Quest ditandai selesai", "success");
      fetchAllData();
    } else {
      Swal.fire("Error", `Gagal menandai quest selesai: ${error.message}`, "error");
      console.error("Mark as Done Error:", error);
    }
  };

  const handleEditQuestClick = (quest) => {
    setEditingQuest(quest);
    setNewQuest({ title: quest.title, imageUrl: quest.image, imageFile: null });
    setIsModalOpen(true);
  };

  const handleDeleteQuest = async (id) => {
    Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Quest ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { error } = await supabase.from("quests").delete().eq("id", id);

        if (!error) {
          Swal.fire("Terhapus!", "Quest berhasil dihapus.", "success");
          fetchAllData();
        } else {
          Swal.fire("Error", `Gagal menghapus quest: ${error.message}`, "error");
          console.error("Delete Error:", error);
        }
      }
    });
  };

  const handleCloseQuestModal = () => {
    setIsModalOpen(false);
    setEditingQuest(null); // Reset editingQuest when modal closes
    setNewQuest({ title: "", imageFile: null, imageUrl: "" }); // Clear form
  };


  return (
    <div className="p-6 bg-white min-h-screen relative">
      <div className="text-3xl font-bold text-orange-600 mb-6">
        Employee Quest
      </div>

      {/* Header */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <SummaryCard
          label="Todays Message"
          content={messages}
          onAdd={() => setIsMessageModalOpen(true)}
        />
        <div className="col-span-3 grid grid-cols-3 gap-4">
          <SummaryCard
            label="Quest Done"
            value={quests.filter((q) => q.done).length}
          />
          <SummaryCard label="Shift" value="9.00AM - 2.00AM" />
          <SummaryCard
            label="Quest Remain"
            value={quests.filter((q) => !q.done).length}
          />
        </div>
        <SummaryCard
          label="Todays Target"
          content={targets}
          onAdd={() => setIsTargetModalOpen(true)}
        />
      </div>

      {/* Quest List */}
      <div className="bg-white border shadow rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-orange-600">Quest List</h2>
          <button
            onClick={() => {
              setEditingQuest(null); // Pastikan mode tambah baru
              setNewQuest({ title: "", imageFile: null, imageUrl: "" }); // Bersihkan form
              setIsModalOpen(true);
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            + Tambah Quest
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {quests.map((item) => (
            <div
              key={item.id}
              className="bg-white border shadow rounded-xl flex flex-col items-center p-4 relative" // Added relative for absolute positioning of buttons
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-16 h-16 object-contain mb-2"
              />
              <h3 className="text-md font-semibold text-gray-700 mb-1 text-center">
                {item.title}
              </h3>

              {item.done ? (
                <span className="mt-2 px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full flex items-center gap-1">
                  <CheckCircle size={14} /> Done
                </span>
              ) : (
                <button
                  onClick={() => markAsDone(item.id)}
                  className="mt-2 text-xs bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600"
                >
                  Mark as Done
                </button>
              )}

              {/* Edit and Delete Buttons */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleEditQuestClick(item)}
                  className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                  title="Edit Quest"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteQuest(item.id)}
                  className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                  title="Hapus Quest"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {quests.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-4">Belum ada quest. Tambahkan sekarang!</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal open={isModalOpen} onClose={handleCloseQuestModal} title={editingQuest ? "Edit Quest" : "Tambah Quest Baru"}>
        <form onSubmit={handleSubmitQuest} className="space-y-4">
          <Input
            label="Judul Quest"
            value={newQuest.title}
            onChange={(e) => setNewQuest({ ...newQuest, title: e.target.value })}
            required
          />
          <Input
            label="Upload Gambar"
            type="file"
            accept="image/*"
            onChange={(e) => setNewQuest({ ...newQuest, imageFile: e.target.files[0], imageUrl: "" })} // Clear imageUrl if file is chosen
          />
          <Input
            label="Atau Link Gambar"
            value={newQuest.imageUrl}
            onChange={(e) => setNewQuest({ ...newQuest, imageUrl: e.target.value, imageFile: null })} // Clear imageFile if URL is typed
          />
          {(newQuest.imageUrl || (editingQuest && editingQuest.image && !newQuest.imageFile)) && (
            <div className="mt-2 text-center">
              <img src={newQuest.imageUrl || editingQuest.image} alt="Preview" className="max-h-24 mx-auto rounded-md object-contain" />
            </div>
          )}
          <SubmitButton />
        </form>
      </Modal>

      <Modal open={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} title="Tambah Message">
        <form onSubmit={handleAddMessage} className="space-y-4">
          <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Isi pesan..." required />
          <SubmitButton />
        </form>
      </Modal>

      <Modal open={isTargetModalOpen} onClose={() => setIsTargetModalOpen(false)} title="Tambah Target">
        <form onSubmit={handleAddTarget} className="space-y-4">
          <Input value={newTarget} onChange={(e) => setNewTarget(e.target.value)} placeholder="Isi target..." required />
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
function SummaryCard({ label, value, content, onAdd }) {
  return (
    <div className="bg-white border shadow rounded-xl p-4 flex flex-col justify-between">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">{label}</h2>
      {content ? (
        <ul className="text-xs text-gray-600 mb-4 list-disc list-inside">
          {content.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      )}
      {onAdd && (
        <button
          onClick={onAdd}
          className="bg-orange-500 text-white text-sm px-2 py-1 rounded-full w-fit self-end"
        >
          +
        </button>
      )}
    </div>
  );
}