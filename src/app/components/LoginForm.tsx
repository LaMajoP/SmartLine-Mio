"use client";

import { Eye, EyeOff } from "lucide-react";
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const data = await res.text();
        setError(data || "Error al iniciar sesión");
      } else {
        const data = await res.json();
        setSuccess("¡Inicio de sesión exitoso!");
        const role = data.user.role?.toLowerCase();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role); // opcional: guardar el rol también

        if (role === "cliente") {
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        } else if (role === "vendedor") {
          setTimeout(() => {
            router.push("/pos");
          }, 1000);
        } else {
          setError("Rol no reconocido");
        }
      }
    } catch (err) {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Image src={SmartLine_Logo} alt="SmartLine Logo" width={305} />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-6"
      >
        <div className="w-full">
          <label className="block font-semibold mb-2">Correo</label>
          <input
            type="email"
            name="email"
            placeholder="Ingrese Correo"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 focus:outline-none"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Contraseña</label>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Ingrese Contraseña"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-700 text-white font-semibold py-3 rounded-xl mt-2 hover:bg-green-800 transition"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
        {success && <p className="text-green-700 text-center">{success}</p>}
        <a href="/register" className="text-center text-black underline mt-2">
          ¿No tienes cuenta? Regístrate
        </a>
      </form>
    </div>
  );
}
