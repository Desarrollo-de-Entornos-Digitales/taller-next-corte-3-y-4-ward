"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NavBar() {
  const router = useRouter();

  const navLinks = [
    { label: "Mis Prendas", href: "/feed" },
    { label: "Registrar Prenda", href: "/register-garment" },
    { label: "Crear Outfit", href: "/create-outfit" },
  ];

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-4xl">
      <div className="navbar bg-base-300/60 backdrop-blur-md rounded-full px-6 shadow-lg border border-white/10">
        {/* Logo */}
        <div className="navbar-start">
          <button
            onClick={() => router.push("/feed")}
            className="btn btn-ghost hover:bg-transparent px-0"
          >
            <Image
              src="/assets/ward-logo.svg"
              alt="WARD logo"
              width={80}
              height={32}
              className="object-contain"
            />
          </button>
        </div>

        {/* Nav links - desktop */}
        <div className="navbar-center hidden md:flex gap-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => router.push(link.href)}
              className="btn btn-ghost btn-sm text-white/80 hover:text-white hover:bg-white/10 rounded-full text-sm font-medium transition-all"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Avatar + mobile menu */}
        <div className="navbar-end flex items-center gap-2">
          {/* Mobile dropdown */}
          <div className="dropdown dropdown-end md:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-300 rounded-box w-52"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => router.push(link.href)}
                    className="text-white/80 hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Avatar — reemplaza src con la foto real del usuario cuando conectes auth */}
          <button
            onClick={() => router.push("/profile")}
            className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-blue-400 transition-all"
          >
            <div className="w-10 rounded-full overflow-hidden ring-2 ring-white/20 bg-base-200">
              <Image
                src="/assets/avatar-placeholder.svg"
                alt="User avatar"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}