'use client';

import { useState, ImgHTMLAttributes } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
  imgClassName?: string;
}

export default function LazyImage({ src, alt, fallback = '/images/sofas/premium-three-seater.webp', className = '', imgClassName = '', ...props }: LazyImageProps) {
  const [failedSource, setFailedSource] = useState<typeof src>();

  return (
    <div className={`relative overflow-hidden bg-dark/5 ${className}`}>
      <img
        src={failedSource !== undefined && failedSource === src ? fallback : src}
        alt={alt || ''}
        loading="lazy"
        decoding="async"
        onError={() => setFailedSource(src)}
        className={`w-full h-full object-cover ${imgClassName}`}
        {...props}
      />
    </div>
  );
}
