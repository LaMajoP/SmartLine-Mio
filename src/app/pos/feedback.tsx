// app/pos/feedback.tsx

import React, { useEffect, useState } from "react";

interface FeedbackItem {
  id: string;
  userId: string;
  mensaje: string;
  calificacion: number;
  fecha: string;
}
//feedback
export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No autenticado");
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Error al obtener feedback");
        }
        const data = await res.json();
        setFeedbacks(data);
      } catch (err: any) {
        setError(err.message || "Error al obtener feedback");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  if (loading) return <div className="text-center text-lg text-gray-600">Cargando feedback...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Feedback de Clientes</h2>
      {feedbacks.length === 0 ? (
        <p className="text-center text-gray-500">No hay feedback disponible.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li key={fb.id} className="bg-white p-4 rounded shadow">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-blue-700">Usuario:</span>
                <span className="text-gray-800">{fb.userId}</span>
                <span className="ml-auto text-yellow-500 font-bold">{"★".repeat(fb.calificacion)}<span className="text-gray-400">{"★".repeat(5 - fb.calificacion)}</span></span>
              </div>
              <p className="text-gray-700 mb-1">{fb.mensaje}</p>
              <span className="text-xs text-gray-400">{new Date(fb.fecha).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

