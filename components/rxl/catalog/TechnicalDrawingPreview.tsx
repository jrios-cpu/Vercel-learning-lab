"use client";

import { useEffect, useRef, useState } from "react";
import { getDrawingProxyUrl } from "@/lib/rxl/drawings";

const PDFJS_VERSION = "6.3.289";
const PDFJS_WORKER = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

type PreviewState = "idle" | "loading" | "ready" | "error";

export function TechnicalDrawingPreview({ drawingUrl, alt }: { drawingUrl: string; alt: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [state, setState] = useState<PreviewState>("idle");

  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      const fallbackTimer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(fallbackTimer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let loadingTask: { destroy: () => Promise<void> } | null = null;

    async function renderDrawing() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const pdfjs = await import("pdfjs-dist");
        if (cancelled) return;
        setState("loading");
        pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
        const task = pdfjs.getDocument({ url: getDrawingProxyUrl(drawingUrl), useWasm: false });
        loadingTask = task;
        const pdf = await task.promise;
        if (cancelled) return;
        const page = await pdf.getPage(1);
        const baseViewport = page.getViewport({ scale: 1 });
        const desiredWidth = 900;
        const viewport = page.getViewport({ scale: desiredWidth / baseViewport.width });
        const outputScale = Math.min(window.devicePixelRatio || 1, 2);
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) throw new Error("Canvas context unavailable");

        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.aspectRatio = `${viewport.width} / ${viewport.height}`;

        await page.render({
          canvas,
          canvasContext: context,
          viewport,
          transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
          background: "#ffffff",
        }).promise;

        if (!cancelled) setState("ready");
        await pdf.destroy();
      } catch {
        if (!cancelled) setState("error");
      }
    }

    void renderDrawing();
    return () => {
      cancelled = true;
      if (loadingTask) void loadingTask.destroy();
    };
  }, [drawingUrl, visible]);

  return (
    <div ref={hostRef} className={`rxl-drawing-preview rxl-drawing-preview-${state}`}>
      <canvas ref={canvasRef} role="img" aria-label={alt} />
      {(state === "idle" || state === "loading") && <span className="rxl-drawing-status">Loading technical drawing…</span>}
      {state === "error" && <span className="rxl-drawing-status">Technical drawing preview unavailable</span>}
    </div>
  );
}
