import React from 'react';
import { useGridDistortion } from '../hooks/useGridDistortion';

/** Flip to `true` to re-enable the grid distortion hover effect globally. */
export const GRID_DISTORTION_ENABLED = false;

interface GridDistortionImageProps {
  src: string;
  alt: string;
  /** Extra classes applied to the base <img> */
  imgClassName?: string;
  /** Extra classes applied to the outer wrapper (receives rounded corners, overflow-hidden, etc.) */
  className?: string;
  /** Inline styles on the outer wrapper */
  style?: React.CSSProperties;
  /** When false the grid overlay is not mounted (use for mobile) */
  enabled?: boolean;
  /** Forwarded data attributes */
  [key: `data-${string}`]: string | undefined;
}

export function GridDistortionImage({
  src,
  alt,
  imgClassName = '',
  className = '',
  style,
  enabled = true,
  ...rest
}: GridDistortionImageProps) {
  const effectEnabled = GRID_DISTORTION_ENABLED && enabled;
  const { containerRef, gridRef, baseRef } = useGridDistortion(effectEnabled);

  // Extract only data-* attributes from rest
  const dataAttrs: Record<string, string | undefined> = {};
  for (const key of Object.keys(rest)) {
    if (key.startsWith('data-')) {
      dataAttrs[key] = (rest as Record<string, string | undefined>)[key];
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', ...style }}
    >
      {/* Base image — always visible, serves as fallback and source for tile images */}
      <img
        ref={baseRef}
        src={src}
        alt={alt}
        draggable={false}
        className={`absolute inset-0 w-full h-full ${imgClassName}`}
        style={{ zIndex: 1 }}
        {...dataAttrs}
      />
      {/* Grid overlay — tiles reconstruct the image and can be individually displaced */}
      {effectEnabled && (
        <div
          ref={gridRef}
          style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
        />
      )}
    </div>
  );
}
