'use client';

import { useState, useEffect, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";

// Constants
const TOTAL_STUDENTS = 400;
const MORA_COUNT = 80;
const STANDARD_PAYMENT = 500000;
const MIN_PAYMENT = 100000;
const MAX_PAYMENT = 1000000;
const DATA_RADIUS = 11;

// Color constants
const COLORS = {
  mora: 'hsl(15, 75%, 55%)',
  donaciones: 'hsl(217, 80%, 45%)',
  becas: 'hsl(142, 70%, 55%)',
  background: 'hsl(0, 0%, 98%)',
  backgroundBorder: 'hsl(0, 0%, 95%)',
  empty: 'hsl(0, 0%, 95%)'
} as const;

// Generate student payments
const generateAportes = () => {
  return Array.from({ length: TOTAL_STUDENTS }, () => {
    // 90% pay standard amount (450k-600k)
    if (Math.random() < 0.9) {
      return STANDARD_PAYMENT + Math.floor(Math.random() * 100000) - 50000;
    }
    // 10% have scholarships or donations (100k-1.1M)
    return Math.floor(Math.random() * MAX_PAYMENT) + MIN_PAYMENT;
  });
};

// Generate overdue payment indices
const generateMoraIndices = () => {
  const indices = new Set<number>();
  while (indices.size < MORA_COUNT) {
    indices.add(Math.floor(Math.random() * TOTAL_STUDENTS));
  }
  return Array.from(indices);
};

// Hexagon component
interface HexagonProps {
  color: string;
  x: number;
  y: number;
  size: number;
  hasData: boolean;
  onClick: () => void;
}

function Hexagon({ color, x, y, size, hasData, onClick }: HexagonProps) {
  const points = useMemo(() => {
    const sqrt3_2 = size * Math.sqrt(3) / 2;
    const halfSize = size / 2;
    
    return [
      `${x + size},${y}`,
      `${x + halfSize},${y - sqrt3_2}`,
      `${x - halfSize},${y - sqrt3_2}`,
      `${x - size},${y}`,
      `${x - halfSize},${y + sqrt3_2}`,
      `${x + halfSize},${y + sqrt3_2}`
    ].join(" ");
  }, [x, y, size]);

  return (
    <polygon
      points={points}
      fill={color}
      stroke={hasData ? color : COLORS.backgroundBorder}
      strokeWidth="1"
      className="transition-all hover:opacity-80 cursor-pointer"
      style={{
        filter: hasData ? 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' : 'none'
      }}
      onClick={onClick}
    />
  );
}

// Color interpolation for payment values
const getPaymentColor = (value: number) => {
  const normalized = (value - MIN_PAYMENT) / (MAX_PAYMENT - MIN_PAYMENT);
  const clamped = Math.max(0, Math.min(1, normalized));
  
  const colorStops = [
    { h: 0, s: 0, l: 100 },      // White
    { h: 142, s: 20, l: 95 },    // Light mint
    { h: 142, s: 40, l: 85 },    // Medium mint
    { h: 142, s: 60, l: 70 },    // Rich mint
    { h: 200, s: 75, l: 50 },    // Teal-blue
    { h: 217, s: 80, l: 45 }     // Deep blue
  ];
  
  const stopIndex = clamped * (colorStops.length - 1);
  const lower = colorStops[Math.floor(stopIndex)];
  const upper = colorStops[Math.min(Math.floor(stopIndex) + 1, colorStops.length - 1)];
  const t = stopIndex - Math.floor(stopIndex);
  
  const h = Math.round(lower.h + (upper.h - lower.h) * t);
  const s = Math.round(lower.s + (upper.s - lower.s) * t);
  const l = Math.round(lower.l + (upper.l - lower.l) * t);
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export default function Home() {
  const [aportes, setAportes] = useState<number[]>([]);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const [moraIndices, setMoraIndices] = useState<number[]>([]);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const aportes = generateAportes();
    const moraIndices = generateMoraIndices();
    
    setAportes(aportes);
    setMoraIndices(moraIndices);
    
    // Select random student (not in mora)
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * TOTAL_STUDENTS);
    } while (moraIndices.includes(randomIndex));
    setSelectedStudentIndex(randomIndex);

    // Handle window resize
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

  const presupuestoTotal = aportes.reduce((sum, aporte) => sum + aporte, 0);

  // Generate hexagonal grid
  const hexagons = useMemo(() => {
    // Calculate available space between stats pill and bottom toolbar
    const statsHeight = dimensions.width < 640 ? 50 : 60; // Responsive stats height
    const toolbarHeight = dimensions.width < 640 ? 60 : 80; // Responsive toolbar height
    const topPadding = dimensions.width < 640 ? 10 : 20; // Responsive top padding
    const bottomPadding = dimensions.width < 640 ? 20 : 32; // Responsive bottom padding (increased for proper spacing)
    const sidePadding = dimensions.width < 640 ? 10 : 20; // Responsive side padding
    
    const availableHeight = dimensions.height - statsHeight - toolbarHeight - topPadding - bottomPadding;
    const availableWidth = dimensions.width - (sidePadding * 2);
    
    // Calculate hex size based on available space, ensuring it fits within bounds
    const maxHexSizeByHeight = availableHeight / (DATA_RADIUS * 2 * Math.sqrt(3));
    const maxHexSizeByWidth = availableWidth / (DATA_RADIUS * 2 * 1.5);
    const maxHexSize = Math.min(maxHexSizeByHeight, maxHexSizeByWidth);
    
    const hexSize = Math.max(8, Math.min(35, maxHexSize));
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    const HEX_WIDTH = hexSize * 1.5;
    const HEX_HEIGHT = hexSize * Math.sqrt(3);
    
    const hexagons: Array<{ id: number; color: string; x: number; y: number; hasData: boolean; dataIndex: number }> = [];
    let id = 0;
    let dataId = 0;

    const viewportRadius = Math.max(
      Math.ceil(dimensions.width / HEX_WIDTH) + 8,
      Math.ceil(dimensions.height / HEX_HEIGHT) + 8,
      DATA_RADIUS
    );

    for (let q = -viewportRadius; q <= viewportRadius; q++) {
      const r1 = Math.max(-viewportRadius, -q - viewportRadius);
      const r2 = Math.min(viewportRadius, -q + viewportRadius);

      for (let r = r1; r <= r2; r++) {
        const x = centerX + HEX_WIDTH * q;
        const y = centerY + HEX_HEIGHT * (r + q / 2);

        const hexDistance = (Math.abs(q) + Math.abs(r) + Math.abs(-q - r)) / 2;
        const hasData = hexDistance <= DATA_RADIUS && dataId < TOTAL_STUDENTS;

        let color: string;
        if (hasData) {
          const aporte = aportes[dataId] || STANDARD_PAYMENT;
          const isEnMora = moraIndices.includes(dataId);
          
          if (isEnMora) {
            color = COLORS.mora;
          } else if (dataId >= aportes.length) {
            color = COLORS.empty;
          } else {
            color = getPaymentColor(aporte);
          }
          dataId++;
        } else {
          color = COLORS.background;
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

  // SVG dimensions - use responsive padding
  const responsivePadding = Math.max(50, Math.min(200, dimensions.width * 0.1));
  const svgBounds = {
    minX: -responsivePadding,
    minY: -responsivePadding,
    maxX: dimensions.width + responsivePadding,
    maxY: dimensions.height + responsivePadding
  };
  
  // Use the same hexSize calculation as in hexagons useMemo
  const statsHeight = dimensions.width < 640 ? 50 : 60;
  const toolbarHeight = dimensions.width < 640 ? 60 : 80;
  const topPadding = dimensions.width < 640 ? 10 : 20;
  const bottomPadding = dimensions.width < 640 ? 20 : 32;
  const sidePadding = dimensions.width < 640 ? 10 : 20;
  
  const availableHeight = dimensions.height - statsHeight - toolbarHeight - topPadding - bottomPadding;
  const availableWidth = dimensions.width - (sidePadding * 2);
  
  const maxHexSizeByHeight = availableHeight / (DATA_RADIUS * 2 * Math.sqrt(3));
  const maxHexSizeByWidth = availableWidth / (DATA_RADIUS * 2 * 1.5);
  const maxHexSize = Math.min(maxHexSizeByHeight, maxHexSizeByWidth);
  
  const hexSize = Math.max(8, Math.min(35, maxHexSize));

  const handleAporteChange = (newAporte: number) => {
    setAportes(prev => {
      const updated = [...prev];
      updated[selectedStudentIndex] = newAporte;
      return updated;
    });
  };


  // Format numbers with abbreviations
  const formatAbbreviated = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  // Calculate payment statistics
  const stats = useMemo(() => {
    const mora = aportes.filter((_, i) => moraIndices.includes(i));
    const donaciones = aportes.filter((aporte, i) => !moraIndices.includes(i) && aporte > STANDARD_PAYMENT);
    const becas = aportes.filter((aporte, i) => !moraIndices.includes(i) && aporte < STANDARD_PAYMENT);

    return {
      mora: {
        sum: mora.reduce((sum, aporte) => sum + aporte, 0),
        count: mora.length,
        formatted: formatAbbreviated(mora.reduce((sum, aporte) => sum + aporte, 0))
      },
      donaciones: {
        sum: donaciones.reduce((sum, aporte) => sum + (aporte - STANDARD_PAYMENT), 0),
        count: donaciones.length,
        formatted: '+' + formatAbbreviated(donaciones.reduce((sum, aporte) => sum + (aporte - STANDARD_PAYMENT), 0))
      },
      becas: {
        sum: becas.reduce((sum, aporte) => sum + (STANDARD_PAYMENT - aporte), 0),
        count: becas.length,
        formatted: '-' + formatAbbreviated(becas.reduce((sum, aporte) => sum + (STANDARD_PAYMENT - aporte), 0))
      }
    };
  }, [aportes, moraIndices]);

  return (
    <div className="h-screen w-screen bg-gray-100 relative overflow-hidden">
      {/* Full Page Hexagonal Grid - covers entire viewport */}
      <div className="absolute inset-0">
        <svg
          width="100%"
          height="100%"
          viewBox={`${svgBounds.minX} ${svgBounds.minY} ${svgBounds.maxX - svgBounds.minX} ${svgBounds.maxY - svgBounds.minY}`}
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

      {/* Stats Section */}
      <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-6 py-2 sm:py-3 shadow-lg border border-gray-200 flex items-center space-x-3 sm:space-x-6 md:space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{backgroundColor: COLORS.mora}}></div>
            <div className="text-left">
              <div className="text-xs text-gray-500">Mora</div>
              <div className="text-sm sm:text-base font-bold text-gray-900">{stats.mora.formatted}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full" style={{backgroundColor: COLORS.donaciones}}></div>
            <div className="text-left">
              <div className="text-xs text-gray-500">Donaciones</div>
              <div className="text-sm sm:text-base font-bold text-gray-900">{stats.donaciones.formatted}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full border-2" style={{borderColor: COLORS.becas}}></div>
            <div className="text-left">
              <div className="text-xs text-gray-500">Becas</div>
              <div className="text-sm sm:text-base font-bold text-gray-900">{stats.becas.formatted}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Toolbar - Absolute positioned at bottom */}
      <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-lg sm:rounded-xl md:rounded-2xl px-3 sm:px-4 py-2">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Presupuesto */}
            <Drawer>
              <DrawerTrigger asChild>
                <button className="text-left hover:bg-gray-50/80 rounded-lg px-1 sm:px-2 py-1 sm:py-2 cursor-pointer">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Presupuesto</div>
                  <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
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
                <button className="text-left hover:bg-gray-50/80 rounded-lg px-1 sm:px-2 py-1 sm:py-2 cursor-pointer">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aporte</div>
                  <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
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
                      min={MIN_PAYMENT}
                      max={MAX_PAYMENT}
                      step="10000"
                      value={aportes[selectedStudentIndex] || STANDARD_PAYMENT}
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
