// src/USERPAGE/FeedbackUser.jsx
import React, { useState } from "react";
import { Star, UserCircle, ShoppingCart, Bell } from "lucide-react"; // Import necessary icons
import Swal from "sweetalert2"; // For notifications
import { supabase } from "../supabase"; // Ensure this path is correct for Supabase client
import { Button } from "@/components/ui/button"; // Ensure this path is correct for Button component
import { Link } from "react-router-dom"; // Import Link for navigation

// Reusable Input component
const Input = ({ label, name, type = "text", ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {props.required && <span className="text-red-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
      {...props}
    />
  </div>
);

// Reusable Select component
const Select = ({ label, name, children, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {props.required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm appearance-none"
      {...props}
    >
      {children}
    </select>
  </div>
);

// Reusable Textarea component
const Textarea = ({ label, name, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {props.required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      rows="5"
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm resize-y"
      {...props}
    />
  </div>
);


export default function FeedbackUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0); // 0-5 stars
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(""); // Add state for photo URL
  const [role, setRole] = useState(""); // Add state for role
  const [job, setJob] = useState(""); // Add state for job

  // Handle rating selection
  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!name || !feedbackText || rating === 0 || !role) { // Added role to validation
      Swal.fire("Peringatan", "Nama, Feedback, Rating, dan Peran harus diisi.", "warning");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("feedback") // Assuming 'feedback' is your table name for user feedback
        .insert([
          {
            name: name,
            email: email, // Email is optional, can be null if not provided
            feedback: feedbackText,
            rating: rating,
            photo_url: photoUrl, // Include photoUrl in the data submitted to Supabase
            role: role, // Include role in the data
            job: job, // Include job in the data
            // You might want to add a 'user_id' if you link it to authenticated users
            // user_id: supabase.auth.user()?.id,
          },
        ]);

      if (error) {
        console.error("Error submitting feedback:", error.message);
        Swal.fire("Error", `Gagal mengirim feedback: ${error.message}`, "error");
      } else {
        Swal.fire(
          "Berhasil!",
          "Terima kasih atas feedback Anda!",
          "success"
        );
        // Clear form after successful submission
        setName("");
        setEmail("");
        setFeedbackText("");
        setRating(0);
        setPhotoUrl(""); // Clear photo URL after submission
        setRole(""); // Clear role after submission
        setJob(""); // Clear job after submission
      }
    } catch (error) {
      console.error("Unexpected error:", error.message);
      Swal.fire("Error", "Terjadi kesalahan yang tidak terduga.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm py-4 px-8 sticky top-0 z-50">
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
            <Link to="/ProfileUser" className="text-orange-500 hover:text-orange-600">
              <UserCircle className="w-5 h-5" />
            </Link>
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
      </header>

      {/* Feedback Form Section */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg border border-orange-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-orange-700 mb-2">Beri Kami Feedback</h1>
            <p className="text-gray-600 text-sm">
              Masukan Anda sangat berharga untuk peningkatan layanan kami.
            </p>
            <div className="w-24 h-1 bg-orange-700 rounded-full mx-auto mt-2" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Nama Anda"
              id="name"
              placeholder="Masukkan nama lengkap Anda"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email Anda (Opsional)"
              id="email"
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Link Foto Profil (Opsional)"
              id="photoUrl"
              type="url"
              placeholder="Mis: https://example.com/foto.jpg"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
            {photoUrl && (
              <div className="mt-4 text-center">
                <img
                  src={photoUrl}
                  alt="Preview Profil"
                  className="max-h-24 mx-auto rounded-full object-cover border-2 border-gray-200 shadow-md"
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/CCCCCC/000000?text=Error" }}
                />
              </div>
            )}

            <Select
              label="Peran"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Pilih peran Anda</option>
              <option value="Bronze">Bronze</option>
              <option value="Silver">Silver</option>
              <option value="Gold">Gold</option>
            </Select>

            <Input
              label="Pekerjaan (Opsional)"
              id="job"
              placeholder="Contoh: Frontend Developer"
              value={job}
              onChange={(e) => setJob(e.target.value)}
            />

            <Textarea
              label="Feedback Anda"
              id="feedback"
              placeholder="Berikan masukan atau pengalaman Anda..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              required
            />

            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating Anda <span className="text-red-500">*</span></label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    className={`cursor-pointer transition-colors duration-200 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                    onClick={() => handleRating(star)}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengirim Feedback..." : "Kirim Feedback"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
