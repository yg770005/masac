"use client";

import { useMemo } from "react";
import katex from "katex";

interface KatexFormulaProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export default function KatexFormula({
  latex,
  displayMode = true,
  className = "",
}: KatexFormulaProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return `<span class="text-red-400">[渲染错误] ${latex}</span>`;
    }
  }, [latex, displayMode]);

  return (
    <span
      className={`katex-formula ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
