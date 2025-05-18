"use client";
import RegisterForm from "@/app/components/RegisterForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen">
      {/* Imagen solo visible en desktop (lg+) */}
      <div className="hidden lg:block w-1/2 h-full">
        <img
          src="https://oleico.com/wp-content/uploads/2020/06/original-061eb31f9aaa850b7852a5e4411983a7-scaled-1.jpeg"
          alt="comida login"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Formulario ocupa todo en móvil y md, la mitad en lg */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
