'use client';

import { useState, useEffect, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

// Generate 400 student monthly payments (aportes)
const generateAportes = () => {
  return Array.from({ length: 400 }, (_, index) => {
    // Most students (90%) pay around the standard amount
    if (Math.random() < 0.9) {
      return 500000 + Math.floor(Math.random() * 100000) - 50000; // 450000 to 600000
    }
    // Some students (10%) have scholarships (becas) or donations (donaciones)
    return Math.floor(Math.random() * 1000000) + 100000; // 100000 to 1100000
  });
};

// Generate random overdue payment indices (aportes en mora)
const generateMoraIndices = () => {
  const moraIndices = new Set<number>();
  const targetCount = 80; // Approximately 80 students with overdue payments
  
  while (moraIndices.size < targetCount) {
    moraIndices.add(Math.floor(Math.random() * 400));
  }
  
  return Array.from(moraIndices);
};

// Hexagon component for SVG rendering
interface HexagonProps {
  color: string;
  x: number;
  y: number;
  size: number;
  isSelected: boolean;
  hasData: boolean;
  onClick: () => void;
}

function Hexagon({ color, x, y, size, isSelected, hasData, onClick }: HexagonProps) {
  const points = useMemo(() => {
    // Pointy-top hexagon: points at left/right, flat sides at top/bottom
    const sqrt3_2 = size * Math.sqrt(3) / 2;
    const halfSize = size / 2;
    
    return [
      `${x + size},${y}`,                    // Right point
      `${x + halfSize},${y - sqrt3_2}`,      // Top right
      `${x - halfSize},${y - sqrt3_2}`,      // Top left
      `${x - size},${y}`,                    // Left point
      `${x - halfSize},${y + sqrt3_2}`,      // Bottom left
      `${x + halfSize},${y + sqrt3_2}`       // Bottom right
    ].join(" ");
  }, [x, y, size]);

  return (
    <polygon
      points={points}
      fill={color}
      stroke={hasData ? color : "#ffffff"}
      strokeWidth="1"
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
  const [aportes, setAportes] = useState<number[]>([]);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const [moraIndices, setMoraIndices] = useState<number[]>([]);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    setAportes(generateAportes());
    setMoraIndices(generateMoraIndices());
    
    // Set random selected student index (0 to 399), but not one in mora
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * 400);
    } while (moraIndices.includes(randomIndex));
    setSelectedStudentIndex(randomIndex);

    // Set initial dimensions
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    // Handle resize
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const presupuestoTotal = aportes.reduce((sum, aporte) => sum + aporte, 0);

  // Generate hexagonal grid with mathematical precision
  const hexagons = useMemo(() => {
    const hexSize = Math.max(12, Math.min(35, Math.min(dimensions.width, dimensions.height) / 25));
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const dataRadius = 11;
    
    // Mathematical constants for pointy-top hexagonal tessellation
    const HEX_WIDTH = hexSize * 1.5;
    const HEX_HEIGHT = hexSize * Math.sqrt(3);
    
    const hexagons: Array<{ id: number; color: string; x: number; y: number; hasData: boolean; dataIndex: number }> = [];
    let id = 0;
    let dataId = 0;

    // Calculate extended coverage radius for infinite-looking background
    const viewportRadius = Math.max(
      Math.ceil(dimensions.width / HEX_WIDTH) + 8,  // Extended beyond viewport
      Math.ceil(dimensions.height / HEX_HEIGHT) + 8, // Extended beyond viewport
      dataRadius
    );

    // Generate all hexagons using cube coordinate system
    for (let q = -viewportRadius; q <= viewportRadius; q++) {
      const r1 = Math.max(-viewportRadius, -q - viewportRadius);
      const r2 = Math.min(viewportRadius, -q + viewportRadius);

      for (let r = r1; r <= r2; r++) {
        // Convert cube coordinates to pixel coordinates
        const x = centerX + HEX_WIDTH * q;
        const y = centerY + HEX_HEIGHT * (r + q / 2);

        // Check if this hexagon should have data
        const hexDistance = (Math.abs(q) + Math.abs(r) + Math.abs(-q - r)) / 2;
        const hasData = hexDistance <= dataRadius && dataId < 400;

        // Determine color
        let color: string;
        if (hasData) {
          const aporte = aportes[dataId] || 500000;
          const isEnMora = moraIndices.includes(dataId);
          const isEmptyBox = dataId >= aportes.length;
          
          if (isEnMora) {
            color = 'hsl(0, 70%, 50%)'; // Red for overdue payments
          } else if (isEmptyBox) {
            color = 'hsl(0, 0%, 95%)';
          } else {
            color = getBoxColor(aporte).backgroundColor;
          }
          dataId++;
        } else {
          color = 'hsl(0, 0%, 98%)'; // Subtle background
        }

        hexagons.push({
          id,
          color,
          x,
          y,
          hasData,
          dataIndex: hasData ? dataId - 1 : -1,
        });
        id++;
      }
    }

    return hexagons;
  }, [aportes, moraIndices, dimensions]);

  // Calculate SVG dimensions and hex size with extended padding for infinite background
  const padding = 200; // Increased padding to accommodate extended grid
  const maxX = dimensions.width + padding;
  const maxY = dimensions.height + padding;
  const minX = -padding;
  const minY = -padding;
  const hexSize = Math.max(12, Math.min(35, Math.min(dimensions.width, dimensions.height) / 25));

  const handleAporteChange = (newAporte: number) => {
    const newAportes = [...aportes];
    newAportes[selectedStudentIndex] = newAporte;
    setAportes(newAportes);
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

  // Calculate statistics for different student payment categories
  const calculateStats = () => {
    const aportesEnMora = aportes.filter((_, index) => moraIndices.includes(index));
    const donaciones = aportes.filter((aporte, index) => !moraIndices.includes(index) && aporte > 500000);
    const becas = aportes.filter((aporte, index) => !moraIndices.includes(index) && aporte < 500000);

    const moraSum = aportesEnMora.reduce((sum, aporte) => sum + aporte, 0);
    const donacionSum = donaciones.reduce((sum, aporte) => sum + (aporte - 500000), 0);
    const becaSum = becas.reduce((sum, aporte) => sum + (500000 - aporte), 0);

    return {
      mora: {
        sum: moraSum,
        count: aportesEnMora.length,
        formatted: formatAbbreviated(moraSum)
      },
      donaciones: {
        sum: donacionSum,
        count: donaciones.length,
        formatted: '+' + formatAbbreviated(donacionSum)
      },
      becas: {
        sum: becaSum,
        count: becas.length,
        formatted: '-' + formatAbbreviated(becaSum)
      }
    };
  };

  return (
    <div className="h-screen w-screen bg-gray-100 relative overflow-hidden">
      {/* Full Page Hexagonal Grid - covers entire viewport */}
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="100%"
          viewBox={`${minX} ${minY} ${maxX - minX} ${maxY - minY}`}
          className="w-full h-full"
        >
          {hexagons.map((hexagon) => {
            const dataIndex = hexagon.dataIndex;
            const isClickable = hexagon.hasData && 
              !moraIndices.includes(dataIndex) && 
              dataIndex < aportes.length;
            
            return (
              <Hexagon
                key={hexagon.id}
                color={hexagon.color}
                x={hexagon.x}
                y={hexagon.y}
                size={hexSize}
                isSelected={selectedStudentIndex === dataIndex}
                hasData={hexagon.hasData}
                onClick={() => {
                  if (isClickable) {
                    setSelectedStudentIndex(dataIndex);
                  }
                }}
              />
            );
          })}
        </svg>
      </div>

      {/* Stats Section - Absolute positioned at top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        {(() => {
          const stats = calculateStats();
          return (
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200 flex items-center space-x-6 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Mora</div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{stats.mora.formatted}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Donaciones</div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{stats.donaciones.formatted}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-300 rounded-full border border-green-400"></div>
                <div className="text-left">
                  <div className="text-xs text-gray-500">Becas</div>
                  <div className="text-sm sm:text-base font-bold text-gray-900">{stats.becas.formatted}</div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Bottom Toolbar - Absolute positioned at bottom */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-xl sm:rounded-2xl px-4 py-2">
          <div className="flex items-center space-x-4">
            {/* Presupuesto */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="text-left hover:bg-gray-50/80 rounded-lg px-2 py-2 cursor-pointer">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Presupuesto</div>
                  <div className="text-lg font-bold text-gray-900 leading-tight">
                    {formatAbbreviated(presupuestoTotal)}
                  </div>
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-white text-gray-900">
                <DrawerTitle className="text-gray-900">
                  Presupuesto Total
                </DrawerTitle>
                <div className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold mb-2 text-gray-900">
                      ${presupuestoTotal.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Total de Aportes Mensuales</div>
                    <div className="text-sm text-gray-500">
                      Basado en {aportes.length} estudiantes
                    </div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>

            {/* Separator */}
            <div className="w-px h-8 bg-gradient-to-b from-gray-200 to-gray-300"></div>

            {/* Aporte */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="text-left hover:bg-gray-50/80 rounded-lg px-2 py-2 cursor-pointer">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aporte</div>
                  <div className="text-lg font-bold text-gray-900 leading-tight">
                    {formatAbbreviated(aportes[selectedStudentIndex] || 0)}
                  </div>
                </button>
              </DrawerTrigger>
              <DrawerContent className="bg-white text-gray-900">
                <DrawerTitle className="text-gray-900">
                  Estudiante {selectedStudentIndex + 1}
                </DrawerTitle>
                <div className="p-4">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold mb-2 text-gray-900">
                      ${aportes[selectedStudentIndex]?.toLocaleString() || '0'}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">Aporte Mensual</div>
                    <input
                      type="range"
                      min="100000"
                      max="1000000"
                      step="10000"
                      value={aportes[selectedStudentIndex] || 500000}
                      onChange={(e) => handleAporteChange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>$100K</span>
                      <span>$1M</span>
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
