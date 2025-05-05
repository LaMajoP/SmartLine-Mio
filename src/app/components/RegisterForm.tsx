'use client';

import { useState } from "react";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error al registrar usuario");
      } else {
        setSuccess("¡Registro exitoso!");
        setForm({ email: "", password: "", role: "" });
      }
    } catch (err) {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        src="/SmartLine_Logo.webp"
        alt="SmartLine Logo"
        className="w-24 mb-4"
      />
      <h1 className="text-3xl font-bold mb-8">
        <span className="text-black">Smart</span>
        <span className="text-green-700">Line</span>
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <div>
          <label className="block font-semibold mb-2">Correo</label>
          <input
            type="email"
            name="email"
            placeholder="Ingrese Correo"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-black rounded-xl px-4 py-3 focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingrese Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-black rounded-xl px-4 py-3 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Rol</label>
          <input
            type="text"
            name="role"
            placeholder="Escriba 'cliente' o 'vendedor'"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full border border-black rounded-xl px-4 py-3 focus:outline-none"
            pattern="cliente|vendedor"
            title="Debe ser 'cliente' o 'vendedor'"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl mt-2 hover:bg-green-800 transition"
          disabled={loading}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-700 text-center">{success}</p>}
        <a
          href="/login"
          className="text-center text-black underline mt-2"
        >
          ¿Ya tienes cuenta? Inicia sesión
        </a>
      </form>
    </div>
  );
}