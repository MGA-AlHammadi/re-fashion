"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, city }),
    });

    if (res.ok) {
      alert("Registrierung erfolgreich!");
      globalThis.location.href = "/login";
    } else {
      const msg = await res.text();
      alert("Fehler: " + msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">🌱 Registrieren</h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            className="w-full p-2 border-2 border-green-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full p-2 border-2 border-green-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 border-2 border-green-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Stadt"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            className="w-full p-2 border-2 border-green-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
            Registrieren
          </button>
        </form>

        <p className="text-center mt-4 text-gray-700">
          Schon ein Konto?{" "}
          <a href="/login" className="text-green-600 hover:text-green-800 underline transition-colors">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
