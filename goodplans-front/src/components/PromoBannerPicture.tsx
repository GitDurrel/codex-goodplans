import React from "react";

type Props = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  mobileMaxWidthPx?: number; // default 639 (sm)
};

export function PromoBannerPicture({
  desktopSrc,
  mobileSrc,
  alt,
  className,
  imgClassName = "h-full w-full object-cover",
  mobileMaxWidthPx = 639,
}: Props) {
  return (
    <picture className={className}>
      <source media={`(max-width: ${mobileMaxWidthPx}px)`} srcSet={mobileSrc} />
      <img src={desktopSrc} alt={alt} className={imgClassName} />
    </picture>
  );
}
