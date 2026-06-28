"use client";

import Image from "next/image";
import { type SyntheticEvent } from "react";

const withBasePath = (path: string) => `/growblic-website01${path}`;
const fallbackCoverImage = "/images/blog/custom-software.svg";

type BlogCoverImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function BlogCoverImage({ src, alt, className }: BlogCoverImageProps) {
  function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
    const fallbackSrc = withBasePath(fallbackCoverImage);

    if (event.currentTarget.src.endsWith(fallbackSrc)) {
      return;
    }

    event.currentTarget.src = fallbackSrc;
  }

  return (
    <Image
      src={withBasePath(src)}
      onError={handleImageError}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, 720px"
      unoptimized
      className={className}
    />
  );
}
