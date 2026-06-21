import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export default function TrylleForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    feedback: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save to Firestore
      await addDoc(collection(db, "usersForm"), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        feedback: formData.feedback,
        createdAt: new Date(),
      });

      // Also send an email notification
      await fetch("https://formsubmit.co/ajax/omitterang@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          feedback: formData.feedback,
          _subject: "New Form Submission from Vizzle (/form)",
          _template: "table"
        })
      });

      navigate("/greeting");
    } catch (error) {
      console.error("Error adding document: ", error);
      // Navigate to greeting page even if Firebase fails
      navigate("/greeting");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-100 flex justify-center items-center px-4 py-10">
      <div className="max-w-xl w-full bg-white/30 backdrop-blur-lg shadow-2xl p-10 rounded-3xl border border-white/40 transition duration-300 hover:shadow-[0px_0px_40px_rgba(123,97,255,0.4)]">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="/viz.png" 
            alt="Vizzle Logo" 
            className="w-35 h-28 "
          />
        </div>

        <h1 className="text-4xl font-extrabold text-center text-black mb-10 tracking-tight">
          Vizzle
        </h1>

        <form className="space-y-8 text-black" onSubmit={handleSubmit}>

          {/* Input Fields */}
          <div>
            <label className="text-lg font-semibold">
              What should we call you? <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 bg-[#111]/90 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#7b61ff] shadow-sm hover:bg-[#111] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-lg font-semibold">Your contact number</label>
            <input
              name="phone"
              type="text"
              placeholder="Contact number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-2 bg-[#111]/90 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#7b61ff] shadow-sm hover:bg-[#111] transition-all"
            />
          </div>

          <div>
            <label className="text-lg font-semibold">
              Best email for follow-ups <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 bg-[#111]/90 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#7b61ff] shadow-sm hover:bg-[#111] transition-all"
              required
            />
          </div>

          <div>
            <label className="text-lg font-semibold">Any feedback?</label>
            <textarea
              name="feedback"
              rows={5}
              value={formData.feedback}
              onChange={handleChange}
              className="w-full mt-2 bg-[#111]/90 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#7b61ff] shadow-sm hover:bg-[#111] transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1D8DB2] rounded-xl text-white font-semibold hover:shadow-[0_0_20px_rgba(123,97,255,0.7)] hover:scale-[1.02] transition-all"
          >
            Let’s connect →
          </button>
        </form>
      </div>
    </div>
  );
}
