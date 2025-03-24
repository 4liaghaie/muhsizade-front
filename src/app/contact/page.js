"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your submission logic here
    console.log("Form data submitted:", formData);
  };

  return (
    <div
      style={{ minHeight: "calc(100vh - 80px)" }}
      className="flex items-center justify-center p-4 overflow-hidden"
    >
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-xl mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border border-gray-300 rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-xl mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-3 border border-gray-300 rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 text-xl mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows="4"
            className="w-full p-3 border border-gray-300 rounded text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-black bg-opacity-80 text-white text-xl font-semibold py-3 rounded hover:bg-black transition duration-200"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
