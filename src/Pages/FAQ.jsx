import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import FAQForm from "./FAQForm";
import Swal from "sweetalert2";
import { HelpCircle, Plus, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("faq")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setFaqs(data);
    setLoading(false);
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleAddNew = () => {
    setEditingFAQ(null);
    setIsFormOpen(true);
  };

  const handleEdit = (faq) => {
    setEditingFAQ(faq);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus FAQ?',
      text: "Data akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#004d33',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
    });
    if (result.isConfirmed) {
      await supabase.from("faq").delete().eq("id", id);
      fetchFaqs();
      Swal.fire("Berhasil!", "FAQ dihapus.", "success");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8EE] p-4 md:p-8 text-[#004d33]">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 border-b border-[#004d33]/20 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black italic text-[#004d33]">
              Manajemen <span className="text-orange-500">FAQ</span>
            </h1>
            <p className="text-sm opacity-60 font-bold mt-1">Kelola pertanyaan umum pelanggan</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-[#004d33] text-white px-6 py-3 rounded-2xl font-black hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} /> Tambah
          </button>
        </header>

        {loading ? (
          <div className="text-center font-black opacity-50 py-10">Memuat data...</div>
        ) : (
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                      <HelpCircle size={20} />
                    </div>
                    <h3 className="font-black text-lg text-left">{faq.question}</h3>
                  </div>
                  {openIndex === index ? <ChevronUp className="text-orange-500" /> : <ChevronDown className="text-gray-400" />}
                </button>

                {openIndex === index && (
                  <div className="mt-4 pt-4 border-t border-gray-100 pl-14 text-sm font-medium text-gray-600">
                    {faq.answer}
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => handleEdit(faq)} className="px-5 py-2 bg-gray-100 rounded-2xl font-black text-xs hover:bg-[#004d33] hover:text-white transition-colors">Edit</button>
                      <button onClick={() => handleDelete(faq.id)} className="px-5 py-2 bg-red-50 text-red-600 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-colors">Hapus</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormOpen && (
        <FAQForm 
          onClose={() => setIsFormOpen(false)} 
          editingFAQ={editingFAQ} 
          onSuccess={fetchFaqs} 
        />
      )}
    </div>
  );
}