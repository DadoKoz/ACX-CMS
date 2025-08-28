"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings2 } from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Početna",
  },
  {
    href: "/user-info",
    icon: Settings2,
    label: "Uredite profil",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col justify-center rounded-r-2xl w-[70px] h-[350px] mx-auto bg-white/7 p-2">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col items-center justify-center px-4 py-2 text-white hover:bg-neutral-800 rounded transition"
          >
            <Icon
              size={28}
              className={isActive ? "text-[#FFFF00]" : "text-white"}
            />
            {/* <span className="text-xs mt-1 opacity-80">{label}</span> */}

            {/* Tooltip */}
            <span className="absolute left-full ml-1 opacity-0 group-hover:opacity-100 transition bg-black/70 text-white text-sm px-2 py-1 rounded whitespace-nowrap">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Sidebar;
