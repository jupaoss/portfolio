import React, { useCallback } from 'react';
import { useFlowmap } from '@/app/hooks/useFlowmap';

interface FlowmapImageProps {
  src: string;
  alt?: string;
  /** Width of the container. Defaults to "100%". */
  width?: number | string;
  /**
   * Height of the container.
   * Pass "auto" to let the hidden img drive the container height (natural aspect ratio).
   * Defaults to "100%".
   */
  height?: number | string;
  falloff?: number;
  dissipation?: number;
  displacement?: number;
  rgbSplit?: number;
  className?: string;
  style?: React.CSSProperties;
  'data-scroll-img'?: boolean | string;
}

export const FlowmapImage = React.forwardRef<HTMLDivElement, FlowmapImageProps>(
  (
    {
      src,
      alt = '',
      width = '100%',
      height = '100%',
      falloff,
      dissipation,
      displacement,
      rgbSplit,
      className,
      style,
      'data-scroll-img': dataScrollImg,
    },
    forwardedRef,
  ) => {
    const { containerRef, canvasRef, resize } = useFlowmap({
      src,
      falloff,
      dissipation,
      displacement,
      rgbSplit,
    });

    // Merge the hook's internal ref with any forwarded ref
    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [forwardedRef],
    );

    const isAutoHeight = height === 'auto';

    return (
      <div
        ref={mergedRef}
        className={className}
        data-scroll-img={dataScrollImg}
        style={{
          width,
          ...(isAutoHeight ? {} : { height }),
          position: 'relative',
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Hidden img — drives container height when height="auto", or triggers onLoad resize */}
        <img
          src={src}
          alt={alt}
          onLoad={resize}
          style={
            isAutoHeight
              ? { display: 'block', width: '100%', height: 'auto', visibility: 'hidden' }
              : { position: 'absolute', opacity: 0, pointerEvents: 'none' }
          }
        />
        <canvas
          ref={canvasRef}
          style={
            isAutoHeight
              ? { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }
              : { display: 'block', width: '100%', height: '100%' }
          }
        />
      </div>
    );
  },
);

FlowmapImage.displayName = 'FlowmapImage';
