import { useState, useEffect, RefObject } from 'react';
import type { Dimensions } from '../types';

export function useDimensions(targetRef?: RefObject<HTMLElement | null>): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 1200, height: 800 });

  useEffect(() => {
    const el = targetRef?.current;
    if (el) {
      const update = () => {
        setDimensions({ width: el.clientWidth, height: el.clientHeight });
      };
      update();
      const resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(el);
      return () => resizeObserver.disconnect();
    }

    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetRef]);

  return dimensions;
}
