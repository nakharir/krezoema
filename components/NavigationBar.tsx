"use client";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function NavigationBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const dropdownItems = [
    { id: 1, label: "Profil Sekolah", path_to: "/client/profilesekolah" },
    { id: 2, label: "Visi & Misi", path_to: "/client/visimisi" },
    { id: 3, label: "Data Guru & Staff", path_to: "/client/guru" },
    { id: 4, label: "Fasilitas", path_to: "/client/Fasilitas" },
  ];

  // Hover — Desktop
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 200);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md py-3 px-6 z-50">
      <div className="flex justify-between items-center">
        {/* === LEFT: Logo + Menu === */}
        <div className="flex items-center gap-8 ml-4 md:ml-20">
          <Link href="/">
            <Image
              src="/logosd.png"
              width={50}
              height={50}
              alt="Logo Sekolah"
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-8">
            {/* Dropdown Profile */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="text-[16px] font-semibold flex items-center gap-1 hover:text-red-600 transition">
                Profil <ChevronDown size={16} />
              </button>

              <div
                className={`absolute top-full left-0 mt-3 bg-white shadow-lg rounded-lg w-[200px] overflow-hidden transform transition-all duration-200 ${
                  dropdownOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                }`}
              >
                <ul className="flex flex-col">
                  {dropdownItems.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.path_to}
                        className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Menu lain */}
            <Link
              href="/client/berita"
              className="text-[16px] font-semibold hover:text-red-600"
            >
              Berita
            </Link>
            <Link
              href="/client/ekstrakulikuler"
              className="text-[16px] font-semibold hover:text-red-600"
            >
              Ekstrakurikuler
            </Link>
            <Link
              href="/client/hubungi"
              className="text-[16px] font-semibold hover:text-red-600"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>

        {/* === RIGHT: PPDB === */}
        <div className="hidden md:block mr-10">
          <a
            href="https://spmb.madiunkota.go.id/"
            target="_blank"
            className="text-[16px] font-semibold hover:text-red-600"
          >
            PPDB
          </a>
        </div>

        {/* === MOBILE BUTTON (Hamburger) === */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* === MOBILE MENU === */}
      {mobileOpen && (
        <div className="md:hidden mt-4 bg-white shadow-inner rounded-lg p-4 space-y-3">
          {/* Dropdown Mobile (Click) */}
          <div>
            <button
              onClick={() => setMobileDropdown(!mobileDropdown)}
              className="w-full flex justify-between items-center text-[16px] font-semibold"
            >
              Profile <ChevronDown size={16} />
            </button>

            {mobileDropdown && (
              <div className="mt-2 bg-gray-50 rounded-lg p-2">
                {dropdownItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.path_to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-200 rounded"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Menu lain */}
          <Link
            href="/client/berita"
            onClick={() => setMobileOpen(false)}
            className="block text-[16px] font-semibold"
          >
            Berita
          </Link>
          <Link
            href="/client/ekstrakulikuler"
            onClick={() => setMobileOpen(false)}
            className="block text-[16px] font-semibold"
          >
            Ekstrakurikuler
          </Link>
          <Link
            href="/client/hubungi"
            onClick={() => setMobileOpen(false)}
            className="block text-[16px] font-semibold"
          >
            Hubungi Kami
          </Link>

          <a
            href="https://madiunkota.spmb.id/"
            target="_blank"
            className="block text-[16px] font-semibold"
          >
            PPDB
          </a>
        </div>
      )}
    </div>
  );
}
