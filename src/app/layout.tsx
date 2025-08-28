"use client";

import Sidebar from "@/app/components/sidebar/side-bar";
import StatusBar from "@/app/components/statusbar/status-bar";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { useEffect } from "react";

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

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isEditorPage = pathname === "/editor";

  const queryClient = new QueryClient();

  useEffect(() => {
    // Pokrećemo samo u produkciji (Vercel)
    if (process.env.NODE_ENV === "production") {
      const scale = 0.98; // blago udaljavanje (samo 2%)
      document.body.style.transform = `scale(${scale})`;
      document.body.style.transformOrigin = "top left";
      document.body.style.width = `${100 / scale}vw`;
      document.body.style.height = `${100 / scale}vh`;
    }
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Važno: meta viewport za konsistentnu veličinu */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <SessionProvider>
          <QueryClientProvider client={queryClient}>
            {/* Statusbar i Sidebar prikazujemo samo na normalnim stranicama */}
            {!isAuthPage && !isEditorPage && (
              <>
                <div className="fixed top-0 left-0 right-0 z-20">
                  <StatusBar />
                </div>

                <div className="fixed top-16 left-0 right-0 z-10">
                  <Sidebar />
                </div>
              </>
            )}

            <main
              className={
                !isAuthPage && !isEditorPage
                  ? "flex flex-col h-screen overflow-auto"
                  : "h-screen w-screen flex justify-center items-center"
              }
            >
              <div
                className={
                  !isAuthPage && !isEditorPage
                    ? "flex-1 max-w-7xl mx-auto w-full px-4 py-4 mt-16"
                    : "w-full max-w-[98%] max-h-[98%]"
                }
                style={
                  isAuthPage || isEditorPage
                    ? { transform: "scale(0.98)", transformOrigin: "top left" }
                    : undefined
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
