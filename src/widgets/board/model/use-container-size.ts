import { useEffect, useState, type RefObject } from "react";

export interface ContainerSize {
  width: number;
  height: number;
}

/**
 * Track the pixel size of a container element (used to size the Konva Stage to
 * its wrapper). Falls back to 0×0 until first measurement.
 */
export const useContainerSize = (ref: RefObject<HTMLElement | null>): ContainerSize => {
  const [size, setSize] = useState<ContainerSize>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        setSize({ width: rect.width, height: rect.height });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
};
