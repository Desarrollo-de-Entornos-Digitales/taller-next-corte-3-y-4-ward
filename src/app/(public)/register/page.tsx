// 'use client' porque maneja estado con useState
"use client";
import { useState } from "react";
import Link from "next/link";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import InputField from "../../common/components/InputField";
import PrimaryButton from "../../common/components/PrimaryButton";
import SocialButton from "../../common/components/SocialButton";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = () => {
    if (password !== confirmPassword) {
      console.error("Las contraseñas no coinciden");
      return;
    }
    console.log("Register con:", email, password);
    // Aquí iría la lógica de registro real
  };

  return (
    
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: "url('/bg-register.jpg.svg')" }}
    >
      {/* Overlay azul semitransparente encima de la imagen */}
      <div className="absolute inset-0 bg-blue-900/40" />

      {/* Card con efecto glassmorphism */}
      <div className="relative z-10 w-full max-w-md mx-4 rounded-3xl overflow-hidden
        bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl px-10 py-10
        flex flex-col items-center gap-5">

        {/* Logo / Título */}
        <h1
          className="text-5xl font-bold text-[#e8d9b0] tracking-wider"
          style={{ fontFamily: "'Caveat', cursive" }}
        >
          WARD
        </h1>

        {/* Campos del formulario */}
        <div className="w-full flex flex-col gap-4">
          <InputField
            label="Username / Email address"
            placeholder="Username / Email address"
            type="email"
            value={email}
            onChange={setEmail}
          />
          <InputField
            label="Password"
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPassword}
          />
          <InputField
            label="Confirm password"
            placeholder="Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>

        {/* Botón principal */}
        <PrimaryButton label="Register" onClick={handleRegister} fullWidth />

        {/* Divisor "Or register with" */}
        <div className="flex items-center gap-3 w-full">
          <div className="flex-1 h-px bg-white/30" />
          <span className="text-sm text-white/70">Or register with</span>
          <div className="flex-1 h-px bg-white/30" />
        </div>

        {/* Botones sociales */}
        <div className="flex gap-4">
          <SocialButton Icon={FacebookIcon} onClick={() => console.log("Facebook")} />
          <SocialButton Icon={GoogleIcon} onClick={() => console.log("Google")} />
        </div>

        {/* Link a login */}
        <p className="text-sm text-white/70">
          Already have an Account?{" "}
          <Link href="/login" className="font-bold text-white hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}