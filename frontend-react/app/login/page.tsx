"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      alert("Login erfolgreich!");
      globalThis.location.href = "/profile";
    } else {
      alert("Fehler: " + (await res.text()));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">🌱 Login</h1>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            className="w-full p-2 border-2 border-green-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 border-2 border-green-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-gray-700">
          Noch kein Konto?{" "}
          <a href="/register" className="text-green-600 hover:text-green-800 underline transition-colors">
            Registrieren
          </a>
        </p>
      </div>
    </div>
  );
}
