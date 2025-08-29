"use client";

import GrapesEditor from "@/app/components/editor/GrapesEditor";

export default function EditorPage() {
  const handleSave = (html: string) => {
    console.log("📦 HTML content:", html);
    // we can send to backend here
  };

  return (
    <div className="h-screen w-screen bg-gray-100">
      <GrapesEditor />
    </div>
  );
}
