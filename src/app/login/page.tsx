"use client";

// 📁 app/login/page.tsx

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";
import Login from "../components/login/login";

const Page = () => {
  return (
    <div>
      <Login />
    </div>
  );
};

export default Page;
