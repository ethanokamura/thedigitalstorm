"use client";

import Link from "next/link";
import { useDrawer } from "@/app/providers/DrawerProvider";
import { HiMenuAlt2 } from "react-icons/hi";

export default function AppBar() {
  const { toggleDrawer } = useDrawer();
  return (
    <header className="fixed top-0 left-0 right-0 z-1000 px-[5%] py-6 bg-base-100/20 backdrop-blur-[20px]">
      <div className="flex items-center gap-4 sm:justify-between">
        <button className="sm:hidden" onClick={toggleDrawer}>
          <HiMenuAlt2 size={24} />
        </button>
        <Link href="/" className="text-xl font-semibold text-base-content">
          The Digital Storm
        </Link>
        <div className="hidden sm:flex gap-4 items-center">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/legal">Legal</Link>
          <Link
            href="/register"
            className="hidden sm:block px-5 py-2 text-sm font-medium text-base-content bg-transparent 
              border border-base-content/70 rounded-lg transition-all duration-300
              hover:bg-base-200 hover:border-base-100
              hover:-translate-y-0.5 hover:shadow-2xl"
          >
            Register
          </Link>
          <br />
        </div>
      </div>
    </header>
  );
}
