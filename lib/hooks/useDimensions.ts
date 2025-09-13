import { useState, useEffect } from 'react';
import type { Dimensions } from '../types';

export function useDimensions(): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 1200, height: 800 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };

    handleResize(); // Set initial dimensions
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}
