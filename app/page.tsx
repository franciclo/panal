'use client';

import { useState, useEffect } from 'react';
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
    
    // Saturation: 0% (white) to 60% (green)
    saturation = Math.round(60 * intensity);
    
    // Lightness: 100% (white) to 50% (green)
    lightness = Math.round(100 - (50 * intensity));
    
  } else {
    // Second half: Green to Blue (0.5 to 1)
    const intensity = (clampedValue - 0.5) * 2; // 0 to 1
    
    // Hue: 120° (green) to 240° (blue)
    hue = Math.round(120 + (120 * intensity));
    
    // Saturation: stays at 60% (rich colors)
    saturation = 60;
    
    // Lightness: 50% (green) to 60% (nice blue, not dark)
    lightness = Math.round(50 + (10 * intensity));
  }
  
  return {
    backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`
  };
};

export default function Home() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);

  useEffect(() => {
    setNumbers(generateNumbers());
  }, []);

  const totalSum = numbers.reduce((sum, num) => sum + num, 0);

  const handleBoxClick = (index: number) => {
    setSelectedBoxIndex(index);
  };

  const handleValueChange = (newValue: number) => {
    if (selectedBoxIndex !== null) {
      const newNumbers = [...numbers];
      newNumbers[selectedBoxIndex] = newValue;
      setNumbers(newNumbers);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Grid Container */}
      <div className="w-full h-[calc(100vh-5rem)] overflow-hidden">
        <div 
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: 'repeat(20, 1fr)',
            gridTemplateRows: 'repeat(20, 1fr)'
          }}
        >
          {numbers.map((number, index) => {
            const colorStyle = getBoxColor(number);
            return (
              <div
                key={index}
                className={`
                  ${selectedBoxIndex === index ? 'ring-2 ring-black ring-opacity-50' : ''}
                  transition-all duration-200 hover:scale-105 cursor-pointer
                `}
                style={colorStyle}
                onClick={() => handleBoxClick(index)}
                title={`Box ${index + 1}: ${number.toLocaleString()}`}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <div className="bg-white border-t border-gray-300 h-16 flex items-center justify-center cursor-pointer hover:bg-gray-50">
            <span className="text-2xl font-bold">{totalSum.toLocaleString()}</span>
          </div>
        </DrawerTrigger>
        <DrawerContent className="bg-white text-gray-900">
          <DrawerTitle className="text-gray-900">
            {selectedBoxIndex !== null ? `Box ${selectedBoxIndex + 1}` : 'Select a Box'}
          </DrawerTitle>
          <div className="p-4">
            {selectedBoxIndex !== null ? (
              <div className="text-center mb-4">
                <div className="text-4xl font-bold mb-2 text-gray-900">
                  {numbers[selectedBoxIndex].toLocaleString()}
                </div>
                <input
                  type="range"
                  min="100000"
                  max="1000000"
                  step="10000"
                  value={numbers[selectedBoxIndex]}
                  onChange={(e) => handleValueChange(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100K</span>
                  <span>1M</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Click on a box to edit its value
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
