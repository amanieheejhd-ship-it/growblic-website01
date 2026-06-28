"use client";

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
    <img
      src={withBasePath(src)}
      onError={handleImageError}
      alt={alt}
      className={className}
    />
  );
}
