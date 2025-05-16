'use client';
import SmartLine_Logo from "@/assets/SmartLine_Logo.webp";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";


export default function RegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
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
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          }
          // Redirige según el rol
          if (form.role === "vendedor") {
            router.push("/pos"); // Redirige a la página de POS
          } else {
            router.push("/dashboard"); // Redirige al dashboard
          }
        }, 1000);
      }
    } catch (err) {
      setError("Error de conexión");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Image
        src={SmartLine_Logo}
        alt="SmartLine Logo"
        width={305}
      />
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
            className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 focus:outline-none"
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
            className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 bg-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>  
        </div>
        <div>
          <label className="block font-semibold mb-2">Rol</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 focus:outline-none"
          >
            <option value="" disabled>
              Seleccione un rol
            </option>
            <option value="cliente">Cliente</option>
            <option value="vendedor">Vendedor</option>
          </select>
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
