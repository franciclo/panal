'use client';

import { useState, useEffect, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

// Generate 400 numbers, most around 500000 with some variation
const generateNumbers = () => {
  return Array.from({ length: 400 }, (_, index) => {
    // Most boxes (90%) should be around 500000
    if (Math.random() < 0.9) {
      return 500000 + Math.floor(Math.random() * 100000) - 50000; // 450000 to 600000
    }
    // Some boxes (10%) can be more varied
    return Math.floor(Math.random() * 1000000) + 100000; // 100000 to 1100000
  });
};

// Generate random red box indices (approximately 80 red boxes)
const generateRedBoxIndices = () => {
  const redBoxIndices = new Set<number>();
  const targetCount = 80;
  
  while (redBoxIndices.size < targetCount) {
    redBoxIndices.add(Math.floor(Math.random() * 400));
  }
  
  return Array.from(redBoxIndices);
};

// Hexagon component for SVG rendering
interface HexagonProps {
  color: string;
  x: number;
  y: number;
  size: number;
  isSelected: boolean;
  onClick: () => void;
}

function Hexagon({ color, x, y, size, isSelected, onClick }: HexagonProps) {
  const points = useMemo(() => {
    const angles = [0, 60, 120, 180, 240, 300];
    return angles
      .map((angle) => {
        const radian = (angle * Math.PI) / 180;
        const px = x + size * Math.cos(radian);
        const py = y + size * Math.sin(radian);
        return `${px},${py}`;
      })
      .join(" ");
  }, [x, y, size]);

  return (
    <polygon
      points={points}
      fill={color}
      stroke={isSelected ? "#fbbf24" : "#ffffff"}
      strokeWidth={isSelected ? "3" : "1"}
      className="transition-all hover:opacity-80 cursor-pointer"
      onClick={onClick}
    />
  );
}

// Calculate HSL color based on value - smooth transition from white to green to blue
const getBoxColor = (value: number) => {
  const minValue = 100000;  // Minimum slider value = white
  const maxValue = 1000000; // Maximum slider value = blue
  const midValue = 500000;  // Middle value = green
  
  // Normalize value to 0-1 range
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const clampedValue = Math.max(0, Math.min(1, normalizedValue));
  
  let hue, saturation, lightness;
  
  if (clampedValue <= 0.5) {
    // First half: White to Green (0 to 0.5)
    const intensity = clampedValue * 2; // 0 to 1
    
    // Hue: stays at green (120°)
    hue = 120;
    
    // Saturation: 0% (white) to 80% (bright green)
    saturation = Math.round(80 * intensity);
    
    // Lightness: 100% (white) to 60% (bright green, not dark)
    lightness = Math.round(100 - (40 * intensity));
    
  } else {
    // Second half: Green to Blue (0.5 to 1)
    const intensity = (clampedValue - 0.5) * 2; // 0 to 1
    
    // Hue: 120° (green) to 240° (blue)
    hue = Math.round(120 + (120 * intensity));
    
    // Saturation: stays at 80% (rich, vibrant colors)
    saturation = 80;
    
    // Lightness: 60% (bright green) to 65% (bright blue)
    lightness = Math.round(60 + (5 * intensity));
  }
  
  return {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`
  };
};

export default function Home() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number>(0);
  const [redBoxIndices, setRedBoxIndices] = useState<number[]>([]);

  useEffect(() => {
    setNumbers(generateNumbers());
    setRedBoxIndices(generateRedBoxIndices());
    
    // Set random selected box index (0 to 399), but not a red box
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * 400);
    } while (redBoxIndices.includes(randomIndex));
    setSelectedBoxIndex(randomIndex);
  }, []);

  const totalSum = numbers.reduce((sum, num) => sum + num, 0);

  // Generate hexagonal grid data using cube coordinates
  const hexagons = useMemo(() => {
    const hexSize = 15;
    const hexagons: Array<{ id: number; color: string; x: number; y: number }> = [];

    const radius = 11; // Number of hexagons from center to edge
    const centerX = radius * hexSize * 1.5;
    const centerY = radius * hexSize * Math.sqrt(3);
    let id = 0;

    for (let q = -radius; q <= radius && id < 400; q++) {
      const r1 = Math.max(-radius, -q - radius);
      const r2 = Math.min(radius, -q + radius);

      for (let r = r1; r <= r2 && id < 400; r++) {
        // Convert cube coordinates to pixel coordinates
        const x = centerX + hexSize * 1.5 * q;
        const y = centerY + hexSize * Math.sqrt(3) * (r + q / 2);

        const number = numbers[id] || 500000;
        const isRedBox = redBoxIndices.includes(id);
        const isEmptyBox = id >= numbers.length;
        
        let color: string;
        if (isRedBox) {
          color = 'hsl(0, 70%, 50%)';
        } else if (isEmptyBox) {
          color = 'hsl(0, 0%, 95%)';
        } else {
          const colorData = getBoxColor(number);
          color = colorData.backgroundColor;
        }

        hexagons.push({
          id,
          color,
          x,
          y,
        });
        id++;
      }
    }

    return hexagons.slice(0, 400);
  }, [numbers, redBoxIndices]);

  // Calculate SVG dimensions with padding
  const padding = 50;
  const maxX = Math.max(...hexagons.map((h) => h.x)) + padding;
  const maxY = Math.max(...hexagons.map((h) => h.y)) + padding;
  const minX = Math.min(...hexagons.map((h) => h.x)) - padding;
  const minY = Math.min(...hexagons.map((h) => h.y)) - padding;

  const handleValueChange = (newValue: number) => {
    const newNumbers = [...numbers];
    newNumbers[selectedBoxIndex] = newValue;
    setNumbers(newNumbers);
  };


  // Format numbers in abbreviated form (e.g., 40M instead of 40,000,000)
  const formatAbbreviated = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Calculate statistics for different box categories
  const calculateStats = () => {
    const redBoxes = numbers.filter((_, index) => redBoxIndices.includes(index));
    const over500kBoxes = numbers.filter((value, index) => !redBoxIndices.includes(index) && value > 500000);
    const under500kBoxes = numbers.filter((value, index) => !redBoxIndices.includes(index) && value < 500000);

    const redBoxSum = redBoxes.reduce((sum, value) => sum + value, 0);
    const surplusSum = over500kBoxes.reduce((sum, value) => sum + (value - 500000), 0);
    const charitySum = under500kBoxes.reduce((sum, value) => sum + (500000 - value), 0);

    return {
      redBoxes: {
        sum: redBoxSum,
        count: redBoxes.length,
        formatted: formatAbbreviated(redBoxSum)
      },
      surplus: {
        sum: surplusSum,
        count: over500kBoxes.length,
        formatted: '+' + formatAbbreviated(surplusSum)
      },
      charity: {
        sum: charitySum,
        count: under500kBoxes.length,
        formatted: '-' + formatAbbreviated(charitySum)
      }
    };
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Stats Section */}
      <div className="bg-gray-100 px-3 sm:px-4 py-3 flex-shrink-0">
        <div className="flex justify-center">
          {(() => {
            const stats = calculateStats();
            return (
              <div className="bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200 flex items-center space-x-6 sm:space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{stats.redBoxes.formatted}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{stats.surplus.formatted}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-300 rounded-full border border-green-400"></div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{stats.charity.formatted}</div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Hexagonal Grid Container */}
      <div className="flex-1 flex justify-center items-center p-3 sm:p-4 lg:p-6 min-h-0">
        <div className="w-full max-w-4xl mx-auto">
          <svg
            width={maxX - minX}
            height={maxY - minY}
            viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
            className="w-full h-auto"
          >
            {hexagons.map((hexagon) => {
              const isRedBox = redBoxIndices.includes(hexagon.id);
              const isEmptyBox = hexagon.id >= numbers.length;
              const isClickable = !isRedBox && !isEmptyBox;
              
              return (
                <Hexagon
                  key={hexagon.id}
                  color={hexagon.color}
                  x={hexagon.x}
                  y={hexagon.y}
                  size={15}
                  isSelected={selectedBoxIndex === hexagon.id}
                  onClick={() => {
                    if (isClickable) {
                      setSelectedBoxIndex(hexagon.id);
                    }
                  }}
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-white border-t border-gray-200 shadow-lg flex-shrink-0">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Total */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs sm:text-sm text-gray-500">Total</div>
                <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                  {formatAbbreviated(totalSum)}
                </div>
              </div>
            </div>

            {/* Right - Selected Box */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="px-3 py-2 sm:px-4 sm:py-2 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  {formatAbbreviated(numbers[selectedBoxIndex] || 0)}
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-white text-gray-900">
                <DrawerTitle className="text-gray-900">
                  Box {selectedBoxIndex + 1}
                </DrawerTitle>
                <div className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold mb-2 text-gray-900">
                      {numbers[selectedBoxIndex]?.toLocaleString() || '0'}
                    </div>
                    <input
                      type="range"
                      min="100000"
                      max="1000000"
                      step="10000"
                      value={numbers[selectedBoxIndex] || 500000}
                      onChange={(e) => handleValueChange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>100K</span>
                      <span>1M</span>
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>

    </div>
  );
}
