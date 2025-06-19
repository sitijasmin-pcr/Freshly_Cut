import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Star } from "lucide-react";

export default function FormFeedback() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: "",
    feedback: "",
    role: "",
    job: "",
    photoUrl: "",
  });

  const [feedbackList, setFeedbackList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("feedbackList");
    if (stored) setFeedbackList(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
  }, [feedbackList]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFeedbackList((prev) => [form, ...prev]);
    setForm({
      name: "",
      email: "",
      rating: "",
      feedback: "",
      role: "",
      job: "",
      photoUrl: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="relative mb-6">
        <Button
          onClick={() => setIsModalOpen(true)}
          className="absolute top-0 right-0 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md"
        >
          + Form
        </Button>
        <div className="flex flex-col items-center w-full text-center">
          <h1 className="text-3xl font-bold text-orange-700">USERS FEEDBACK</h1>
          <div className="w-24 h-1 bg-orange-700 rounded-full mt-1 mb-3" />
          <p className="text-gray-600 text-sm mt-2 max-w-3xl">
            Masukan, keluhan, atau kepuasan yang disampaikan pelanggan mengenai
            produk atau pelayanan yang diterima. Feedback berguna untuk
            menemukan masalah, melakukan perbaikan, dan meningkatkan kepuasan
            pelanggan.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {feedbackList.map((item, i) => (
          <div key={i} className="relative group">
            <div className="absolute inset-0 -rotate-6 rounded-2xl bg-orange-400 z-0 scale-95 group-hover:scale-100 transition-transform duration-300"></div>
            <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 text-center border border-orange-100">
              <div className="-mt-16 mb-4">
                <img
                  src={
                    item.photoUrl || `https://i.pravatar.cc/100?img=${i + 1}`
                  }
                  alt={item.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg mx-auto"
                />
              </div>
              <h3 className="text-lg font-semibold text-orange-700">
                {item.name}
              </h3>
              <div className="flex justify-center gap-2 text-sm font-medium text-orange-500 mb-2">
                <p>{item.role || "Customer"}</p>
                {item.job && (
                  <span className="text-gray-500">| {item.job}</span>
                )}
              </div>
              <p className="text-gray-700 text-sm italic mb-4">
                "{item.feedback}"
              </p>
              <div className="relative flex justify-center items-end h-12 gap-1 mt-2 -mb-6">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className={`rounded-full w-12 h-12 flex items-center justify-center shadow-md bg-white border ${
                      index < parseInt(item.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } z-${5 - index} relative`}
                    style={{
                      transform: `translateY(${Math.abs(2 - index) * 4}px)`,
                      marginTop: "-16px",
                    }}
                  >
                    <Star
                      size={20}
                      className={
                        index < parseInt(item.rating) ? "fill-yellow-400" : ""
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl bg-white px-4 sm:px-6 py-6 mx-auto max-h-screen overflow-y-auto relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <Dialog.Title className="text-lg font-bold mb-4 text-orange-700">
              Form Feedback
            </Dialog.Title>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Email (opsional)"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <Select
                label="Peran"
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="">Pilih peran Anda</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
              </Select>
              <Input
                label="Pekerjaan"
                name="job"
                value={form.job}
                onChange={handleChange}
              />
              <Input
                label="Link Foto Profil (opsional)"
                name="photoUrl"
                value={form.photoUrl}
                onChange={handleChange}
              />
              <Select
                label="Rating Pelayanan"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                required
              >
                <option value="">Pilih rating Anda</option>
                <option value="1">⭐ Sangat Buruk</option>
                <option value="2">⭐⭐ Buruk</option>
                <option value="3">⭐⭐⭐ Cukup</option>
                <option value="4">⭐⭐⭐⭐ Baik</option>
                <option value="5">⭐⭐⭐⭐⭐ Sangat Baik</option>
              </Select>
              <Textarea
                label="Masukan atau Saran"
                name="feedback"
                value={form.feedback}
                onChange={handleChange}
                required
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Kirim
                </Button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

// Komponen Input reusable
const Input = ({ label, name, type = "text", ...props }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <input
      name={name}
      type={type}
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
      {...props}
    />
  </div>
);

// Komponen Select reusable
const Select = ({ label, name, children, ...props }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <select
      name={name}
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
      {...props}
    >
      {children}
    </select>
  </div>
);

// Komponen Textarea reusable
const Textarea = ({ label, name, ...props }) => (
  <div>
    <label className="block text-sm font-semibold mb-1">{label}</label>
    <textarea
      name={name}
      rows="4"
      className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500"
      {...props}
    />
  </div>
);
