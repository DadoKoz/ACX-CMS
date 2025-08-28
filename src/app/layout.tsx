"use client";

import Sidebar from "@/app/components/sidebar/side-bar";
import StatusBar from "@/app/components/statusbar/status-bar";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // stranice koje trebaju biti fullscreen (bez sidebar/statusbar)
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isEditorPage = pathname === "/editor";

  const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            {/* samo prikazuj statusbar i sidebar ako nismo na auth ili editor stranici */}
            {!isAuthPage && !isEditorPage && (
              <>
                {/* fixed Statusbar */}
                <div className="fixed top-0 left-0 right-0 z-20">
                  <StatusBar />
                </div>

                {/* fixed Sidebar */}
                <div className="fixed top-[65px] left-0 right-0 z-10">
                  <Sidebar />
                </div>
              </>
            )}

            <main
              className={
                !isAuthPage && !isEditorPage
                  ? "pl-[70px] pt-[65px] h-[calc(100vh-65px)] overflow-auto"
                  : "h-screen w-screen" // fullscreen layout za auth + editor stranice
              }
            >
              <div
                className={
                  !isAuthPage && !isEditorPage
                    ? "max-w-7xl mx-auto px-6 py-4"
                    : "w-full h-full"
                }
              >
                {children}
              </div>
            </main>

            <Toaster position="top-right" reverseOrder={false} />
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
