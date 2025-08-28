"use client";

import GrapesEditor from "@/app/components/editor/GrapesEditor";

export default function EditorPage() {
  const handleSave = (html: string) => {
    console.log("📦 HTML content:", html);
    // ovdje možeš poslati na backend
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      <GrapesEditor />
    </div>
  );
}
