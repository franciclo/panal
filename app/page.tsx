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

// Generate random red box indices (approximately 80 red boxes)
const generateRedBoxIndices = () => {
  const redBoxIndices = new Set<number>();
  const targetCount = 80;
  
  while (redBoxIndices.size < targetCount) {
    redBoxIndices.add(Math.floor(Math.random() * 400));
  }
  
  return Array.from(redBoxIndices);
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

  const handleValueChange = (newValue: number) => {
    const newNumbers = [...numbers];
    newNumbers[selectedBoxIndex] = newValue;
    setNumbers(newNumbers);
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
            const isRedBox = redBoxIndices.includes(index);
            const colorStyle = isRedBox ? { backgroundColor: 'hsl(0, 70%, 50%)' } : getBoxColor(number);
            
            return (
              <div
                key={index}
                className={`
                  ${selectedBoxIndex === index ? 'border-4 border-yellow-400' : ''}
                  ${isRedBox ? 'cursor-not-allowed' : 'cursor-pointer'}
                  transition-all duration-200
                `}
                style={colorStyle}
                title={`Box ${index + 1}: ${isRedBox ? 'Red Box (Not Editable)' : number.toLocaleString()}`}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Sum display */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Sum</div>
              <div className="text-xl font-bold text-gray-900">{totalSum.toLocaleString()}</div>
            </div>
          </div>

          {/* Right side - Visualization options */}
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Visualization
            </button>
            <Drawer>
              <DrawerTrigger asChild>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                  Edit Box
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
