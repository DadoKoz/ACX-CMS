"use client";

import { useSession, signOut } from "next-auth/react";
import { CircleUserRound } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const StatusBar = () => {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div className="w-full h-[65px] bg-white/7 text-white flex items-center px-4 justify-between relative">
      {/* Logo centriran */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <img src="/logo-light.svg" alt="Logo" className="w-20 h-20" />
      </div>

      {/* User avatar + username */}
      {status === "authenticated" && session.user && (
        <div className="ml-auto relative" ref={dropdownRef}>
          {/* ime + avatar */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <span className="text-[#FFFF00] font-medium">
              {session.user.name}
            </span>
            <CircleUserRound className="w-6 h-6 text-white/70 hover:text-white" />
          </div>

          {/* dropdown ispod avatara */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-black border border-gray-800 text-white rounded-lg shadow-md z-50 pointer-events-auto">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2  hover:bg-white/30 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusBar;
