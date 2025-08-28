"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import { useRouter } from "next/navigation";

interface GrapesEditorProps {
  initialData?: {
    slug?: string;
    contentHtml: string;
    contentCss?: string;
  };
}

const YELLOW = "#d8de2c";
const BLACK = "#000000";

const GrapesEditor = ({ initialData }: GrapesEditorProps) => {
  const editorRef = useRef<any>(null);

  const editorContainer = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [slug, setSlug] = useState(initialData?.slug || "");
  const [activeTab, setActiveTab] = useState<
    "blocks" | "styles" | "layers" | "traits"
  >("blocks");
  const [blockQuery, setBlockQuery] = useState("");

  // ids za kontejnere GrapesJS managera
  const ids = useMemo(
    () => ({
      blocks: "gjs-right-blocks",
      styles: "gjs-right-styles",
      layers: "gjs-right-layers",
      traits: "gjs-right-traits",
      topbar: "gjs-topbar",
    }),
    []
  );

  const handleGoDashboard = () => {
    router.push("/dashboard");
  };

  useEffect(() => {
    if (editorRef.current) return;

    const editor = grapesjs.init({
      container: editorContainer.current!,
      height: "100vh",
      width: "100%",
      storageManager: false,
      fromElement: false,
      panels: { defaults: [] }, // koristimo custom topbar
      blockManager: { appendTo: `#${ids.blocks}` },
      styleManager: { appendTo: `#${ids.styles}`, clearProperties: 1 },
      selectorManager: { appendTo: `#${ids.styles}` },
      traitManager: { appendTo: `#${ids.traits}` },
      layerManager: { appendTo: `#${ids.layers}` },
      deviceManager: {
        devices: [
          { id: "Desktop", name: "Desktop", width: "" },
          { id: "Tablet", name: "Tablet", width: "768px" },
          { id: "Mobile", name: "Mobile", width: "375px" },
        ],
      },
      canvas: {
        styles: [
          "https://unpkg.com/grapesjs/dist/css/grapes.min.css",
          // tema + grid pozadina (vrlo suptilno)
          `
            body { background:${BLACK}; }
            #${ids.blocks},#${ids.styles},#${ids.layers},#${ids.traits}{
              background:${BLACK}; color:white;
            }
            .gjs-cv-canvas .gjs-frame {
              background:
                linear-gradient(transparent 31px, rgba(255,255,255,0.05) 31px, rgba(255,255,255,0.05) 32px, transparent 32px),
                linear-gradient(90deg, transparent 31px, rgba(255,255,255,0.05) 31px, rgba(255,255,255,0.05) 32px, transparent 32px);
              background-size: 32px 32px, 32px 32px;
            }
          `,
        ],
      },
    });

    // --- Default component ponašanje (tvoje) ---
    editor.DomComponents.addType("default", {
      model: {
        defaults: {
          resizable: { tl: 1, tc: 1, tr: 1, cl: 1, cr: 1, bl: 1, bc: 1, br: 1 },
          draggable: true,
          highlightable: true,
          editable: true,
          style: { position: "absolute" },
          traits: [
            { type: "text", label: "Custom Class", name: "custom-class" },
          ],
        },
      },
    });

    // --- Blokovi (isti sadržaj, samo grupisan + labelice) ---
    const blocks = [
      {
        id: "div",
        label: "Div Container",
        category: "Layout",
        content: `<div style="padding:20px; border:1px dashed ${YELLOW};">Prazan kontejner</div>`,
      },
      {
        id: "grid",
        label: "Grid Layout",
        category: "Layout",
        content: `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"><div style="background:#f3f3f3;padding:20px;">Kolona 1</div><div style="background:#e3e3e3;padding:20px;">Kolona 2</div></div>`,
      },
      {
        id: "hero",
        label: "Hero",
        category: "Sekcije",
        content: `<section style="padding:40px; text-align:center; background:black; color:${YELLOW};"><h1>Naslov vijesti</h1><p>Kratki opis</p></section>`,
      },
      {
        id: "paragraph",
        label: "Paragraph",
        category: "Tekst",
        content: `<p style="color:${YELLOW}; font-size:18px;">Ovdje ide tekst...</p>`,
      },
      {
        id: "image",
        label: "Image",
        category: "Mediji",
        content: `<img src="https://via.placeholder.com/400x200" style="width:400px;height:200px;border:2px solid ${YELLOW};border-radius:8px;" />`,
      },
      {
        id: "button",
        label: "Button",
        category: "UI",
        content: `<a href="#" style="display:inline-block;background:${YELLOW};color:black;padding:10px 16px;border-radius:6px;font-weight:bold;border:2px solid ${YELLOW};">Klikni ovdje</a>`,
      },
      {
        id: "quote",
        label: "Quote",
        category: "Tekst",
        content: `<blockquote style="font-style:italic;border-left:4px solid ${YELLOW};padding-left:12px;color:${YELLOW};">"Inspirativni citat"</blockquote>`,
      },
    ];
    blocks.forEach((blk) =>
      editor.BlockManager.add(blk.id, {
        label: blk.label,
        content: blk.content,
        category: { id: blk.category, label: blk.category, open: true },
      })
    );

    // --- Učitaj početni sadržaj ---
    if (initialData?.contentHtml) {
      editor.setComponents(initialData.contentHtml);
      editor.getComponents().forEach((comp: any) => {
        comp.addStyle({ position: "absolute" });
      });
    }
    if (initialData?.contentCss) editor.setStyle(initialData.contentCss);

    // --- Komande/tooling ---
    editor.Commands.add("preview", {
      run: (ed: any) => ed.runCommand("core:preview"),
      stop: (ed: any) => ed.stopCommand("core:preview"),
    });
    editor.Commands.add("clear-canvas", {
      run: (ed: any) => ed.DomComponents.clear(),
    });
    editor.Commands.add("set-device-desktop", {
      run: (ed: any) => ed.setDevice("Desktop"),
    });
    editor.Commands.add("set-device-tablet", {
      run: (ed: any) => ed.setDevice("Tablet"),
    });
    editor.Commands.add("set-device-mobile", {
      run: (ed: any) => ed.setDevice("Mobile"),
    });

    // Kratica za snimanje (Ctrl/Cmd + S)
    const keyHandler = (e: KeyboardEvent) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
      if (isSave) {
        e.preventDefault();
        handleSave(); // koristi lokalnu funkciju
      }
    };
    window.addEventListener("keydown", keyHandler);

    editorRef.current = editor;

    return () => {
      window.removeEventListener("keydown", keyHandler);
      // editor.destroy(); // po potrebi
    };
  }, [initialData, ids.blocks, ids.layers, ids.styles, ids.traits]);

  // filter blokova po upitu
  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;
    const all = ed.BlockManager.getAll();
    all.forEach((blk: any) => {
      const el = (blk as any).view?.el as HTMLElement | undefined;
      if (!el) return;
      const match =
        !blockQuery ||
        blk.get("label").toLowerCase().includes(blockQuery.toLowerCase()) ||
        blk
          .get("category")
          ?.id?.toLowerCase?.()
          .includes(blockQuery.toLowerCase());
      el.style.display = match ? "" : "none";
    });
  }, [blockQuery]);

  const handleSave = async () => {
    const ed = editorRef.current;
    if (!ed) return;
    if (!slug) return alert("⚠️ Unesi slug!");

    const html = ed.getHtml();
    const css = ed.getCss();

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, contentHtml: html, contentCss: css }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert("❌ Greška: " + (err?.error || "Neuspješno snimanje."));
        return;
      }

      alert("✅ Vijest sačuvana!");
    } catch (error) {
      console.error(error);
      alert("❌ Greška prilikom spremanja posta.");
    }
  };

  return (
    <div className="flex w-full h-screen bg-black text-white">
      {/* Canvas + topbar */}
      <div className="relative flex-1 bg-neutral-900">
        {/* Topbar */}
        <div
          id={ids.topbar}
          className="absolute top-0 left-0 right-0 z-20 flex items-center gap-2 border-b border-white/10 bg-black/80 backdrop-blur px-3 py-2"
        >
          <div className="flex items-center gap-1">
            <button
              onClick={() => editorRef.current?.runCommand("core:undo")}
              className="px-2 py-1 rounded hover:bg-white/10"
              title="Undo"
            >
              ↶
            </button>
            <button
              onClick={() => editorRef.current?.runCommand("core:redo")}
              className="px-2 py-1 rounded hover:bg-white/10"
              title="Redo"
            >
              ↷
            </button>
            <span className="mx-2 h-4 w-px bg-white/20" />
            <button
              onClick={() => editorRef.current?.runCommand("preview")}
              className="px-2 py-1 rounded hover:bg-white/10"
              title="Preview"
            >
              👁
            </button>
            <button
              onClick={() => editorRef.current?.runCommand("clear-canvas")}
              className="px-2 py-1 rounded hover:bg-white/10"
              title="Očisti canvas"
            >
              🗑
            </button>
          </div>

          <div className="ml-2 flex items-center gap-1">
            <button
              onClick={() =>
                editorRef.current?.runCommand("set-device-desktop")
              }
              className="px-2 py-1 rounded hover:bg-white/10"
              title="Desktop"
            >
              🖥
            </button>
            <button
              onClick={() => editorRef.current?.runCommand("set-device-tablet")}
              className="px-2 py-1 rounded hover:bg-white/10"
              title="Tablet"
            >
              📱↔
            </button>
            <button
              onClick={() => editorRef.current?.runCommand("set-device-mobile")}
              className="px-2 py-1 rounded hover:bg-white/10"
              title="Mobile"
            >
              📱
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() =>
                alert(
                  "Export HTML/CSS je sada u bazi preko API-ja.\nAko želiš, lako dodamo gumb koji skida .zip sa HTML/CSS."
                )
              }
              className="px-3 py-1.5 rounded border border-white/15 hover:bg-white/10 text-sm"
            >
              Export
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded font-semibold border-2 text-black"
              style={{ backgroundColor: YELLOW, borderColor: YELLOW }}
              title="Ctrl/Cmd + S"
            >
              Sačuvaj
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div ref={editorContainer} className="h-full w-full" />
      </div>

      {/* Desni glavni panel (tabovi) */}
      <div className="w-[340px] border-l border-white/10 bg-black flex flex-col">
        {/* Tabs */}
        <div className="flex gap-1 p-2 border-b border-white/10">
          {(["blocks", "styles", "layers", "traits"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded text-sm font-medium ${
                activeTab === t ? "text-black" : "text-white"
              }`}
              style={{
                backgroundColor: activeTab === t ? YELLOW : "transparent",
                border: `1px solid ${
                  activeTab === t ? YELLOW : "rgba(255,255,255,0.15)"
                }`,
              }}
            >
              {t === "blocks" && "Blocks"}
              {t === "styles" && "Styles"}
              {t === "layers" && "Layers"}
              {t === "traits" && "Properties"}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto p-2 space-y-2 custom-scroll">
          {/* Blokovi: pretraga + container */}
          <div className={activeTab === "blocks" ? "block" : "hidden"}>
            <div className="mb-2">
              <input
                value={blockQuery}
                onChange={(e) => setBlockQuery(e.target.value)}
                placeholder="Search blocks..."
                className="w-full rounded border border-white/15 bg-black px-3 py-2 text-sm focus:outline-none focus:ring-1"
                style={{ color: "white" }}
              />
            </div>
            <div id={ids.blocks} className="space-y-2" />
          </div>

          {/* Stilovi */}
          <div className={activeTab === "styles" ? "block" : "hidden"}>
            <div id={ids.styles} />
          </div>

          {/* Slojevi */}
          <div className={activeTab === "layers" ? "block" : "hidden"}>
            <div id={ids.layers} />
          </div>

          {/* Traits */}
          <div className={activeTab === "traits" ? "block" : "hidden"}>
            <div id={ids.traits} />
          </div>
        </div>
      </div>

      {/* Uski utility panel (slug + save) */}
      <div className="w-72 bg-black border-l border-white/10 p-4 flex flex-col gap-3">
        <h2 className="font-semibold text-lg">Slug</h2>
        <input
          className="border border-white/15 p-2 rounded bg-black text-white focus:outline-none focus:ring-1"
          placeholder="npr. nova-vijest"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="rounded-lg px-4 py-3 font-semibold"
          style={{
            backgroundColor: YELLOW,
            color: "black",
            border: `2px solid ${YELLOW}`,
          }}
        >
          Sačuvaj vijest
        </button>

        <button
          onClick={handleGoDashboard}
          className="rounded-lg px-4 py-3 font-semibold"
          style={{
            backgroundColor: YELLOW,
            color: "black",
            border: `2px solid ${YELLOW}`,
          }}
        >
          Dashboard
        </button>

        <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/70 space-y-2">
          <p>
            <b>Prečica:</b> Ctrl/Cmd + S
          </p>
          <p>
            <b>Savjet:</b> Koristi tabove gore desno za blokove, stilove,
            slojeve i svojstva.
          </p>
        </div>
      </div>

      {/* malo stilizacije scrollbara bez tailwind plugina */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 10px; }
        .custom-scroll::-webkit-scrollbar-track { background: ${BLACK}; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
        /* ujednači GrapeJS kartice s temom */
        .gjs-one-bg { background-color: ${BLACK}; }
        .gjs-two-color { color: #eee; }
        .gjs-three-bg { background-color: #111; }
        .gjs-four-color, .gjs-color-warn { color: ${YELLOW}; }
        .gjs-category-title { background: #0d0d0d !important; color: #fff !important; border: 1px solid rgba(255,255,255,.1); }
        .gjs-block { border: 1px solid rgba(255,255,255,.1); border-radius: 8px; }
        .gjs-block:hover { border-color: ${YELLOW}; box-shadow: 0 0 0 1px ${YELLOW} inset; }
        .gjs-fields, .gjs-sm-sectors { border: none !important; }
        .gjs-layer-title, .gjs-trt-traits-label { color: #fff !important; }
      `}</style>
    </div>
  );
};

export default GrapesEditor;
