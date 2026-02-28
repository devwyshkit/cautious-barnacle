"use client";

import { Share2, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useState } from "react";
import { cn } from "@/lib/utils";
import { logger } from '@/lib/logging/logger';

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  variant?: "ghost" | "outline" | "secondary" | "default" | "full" | "icon";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
}

export function ShareButton({
  title,
  text,
  url,
  variant = "ghost",
  size = "icon",
  className,
  showLabel = false,
}: ShareButtonProps) {

  const [copied, setCopied] = useState(false);

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Construct full URL if relative
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const shareUrl = url.startsWith('http')
      ? url
      : `${baseUrl}${url}`;

    const shareData = {
      title,
      text: text || `Check out ${title} on Wyshkit`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          logger.error('Error sharing:', err as Error);
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (shareUrl: string) => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy in ShareButton', err, { url: shareUrl });
      toast.error("Failed to copy link");
    }
  };

  if (variant === 'full') {
    return (
      <Button
        onClick={handleShare}
        variant="outline"
        className={cn("w-full h-12 rounded-xl border-zinc-100 gap-2 font-bold", className)}
      >
        <Share2 className="size-4" />
        Share this
      </Button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleShare}
        className={cn(
          "flex items-center justify-center size-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all active:scale-90",
          className
        )}
      >
        {copied ? (
          <Check className="size-3.5 text-green-600" />
        ) : (
          <Share2 className="size-3.5 text-zinc-600" />
        )}
      </button>
    );
  }

  return (
    <Button
      variant={variant === 'ghost' ? 'ghost' : variant as any}
      size={size}
      className={cn("rounded-full transition-all", className)}
      onClick={handleShare}
    >
      {copied ? (
        <Check className="size-4 text-green-500" />
      ) : (
        <Share2 className="size-4" />
      )}
      {(showLabel || variant === 'ghost') && (
        <span className="ml-2 font-bold text-xs">{copied ? "Copied" : "Share"}</span>
      )}
    </Button>
  );
}
