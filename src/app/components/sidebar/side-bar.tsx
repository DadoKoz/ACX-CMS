"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings2, Tag } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Početna" },
  { href: "/promotions", icon: Tag, label: "Promocije" },
  { href: "/user-info", icon: Settings2, label: "Uredi profil" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-black rounded-t-2xl md:rounded-r-2xl flex md:flex-col justify-center items-center w-full md:w-[70px] h-[70px] md:h-[350px] p-2 fixed bottom-0 md:top-1/2 left-0 transform md:-translate-y-1/2 z-10">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="group relative flex md:flex-col flex-row items-center justify-center px-4 py-2 text-white hover:bg-neutral-800 rounded transition m-1 md:m-0"
          >
            <Icon
              size={28}
              className={isActive ? "text-[#FFFF00]" : "text-white"}
            />
            {/* Tooltip */}
            <span className="absolute left-full md:left-full top-1/2 md:top-auto transform -translate-y-1/2 md:translate-y-0 ml-1 opacity-0 group-hover:opacity-100 transition bg-black/70 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;
