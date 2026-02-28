"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageWithFallbackProps extends React.ComponentProps<typeof Image> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/images/logo.png",
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
  }, [src]);

  const imageSrc = !error && currentSrc && typeof currentSrc === 'string' && currentSrc.trim() !== '' 
    ? currentSrc 
    : fallbackSrc;

  return (
    <Image
      src={imageSrc}
      alt={alt || ''}
      onError={() => {
        if (!error) setError(true);
      }}
      {...props}
    />
  );
}
