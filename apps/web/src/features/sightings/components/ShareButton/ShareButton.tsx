"use client";

import { useState } from "react";

import { Icon } from "@/components/atoms/Icon";
import { cn } from "@/shared/utils/cn";

export interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButton({ url, title, className }: ShareButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleShare = async (): Promise<void> => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      aria-label="Compartilhar flagrado"
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-bg-elevated/90 px-3 py-2 text-sm text-fg-primary backdrop-blur",
        className,
      )}
      onClick={() => void handleShare()}
    >
      <Icon name="share" size="sm" />
      {copied ? "Link copiado" : "Compartilhar"}
    </button>
  );
}
