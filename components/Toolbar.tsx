import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { formatAbbreviated } from '@/lib/format-utils';
import { BUDGET } from '@/lib/constants';
import { Aporte } from "@/lib/types";

// Mock data for previous months
const MONTHS_DATA = [
  {
    month: "Enero 2024",
    presupuesto: 185000000,
    aporte: 450000
  },
  {
    month: "Febrero 2024", 
    presupuesto: 192000000,
    aporte: 480000
  },
  {
    month: "Marzo 2024",
    presupuesto: 198000000,
    aporte: 495000
  },
  {
    month: "Abril 2024",
    presupuesto: 201000000,
    aporte: 502000
  },
  {
    month: "Mayo 2024",
    presupuesto: 195000000,
    aporte: 487000
  },
  {
    month: "Junio 2024",
    presupuesto: 203000000,
    aporte: 507000
  }
];

// Get current month in Spanish
const getCurrentMonth = () => {
  const now = new Date();
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  return months[now.getMonth()];
};

interface ToolbarProps {
  presupuestoTotal: number;
  aportes: Aporte[][];
  designatedFamiliaIndex: number;
  onAporteChange: (percentageChange: number) => void;
  getFamiliaAportesSum: (familiaIndex: number) => number;
  getInitialFamiliaAportesSum: (familiaIndex: number) => number;
}

export function Toolbar({ presupuestoTotal, aportes, designatedFamiliaIndex, onAporteChange, getFamiliaAportesSum, getInitialFamiliaAportesSum }: ToolbarProps) {
  const currentSum = getFamiliaAportesSum(designatedFamiliaIndex);
  const initialSum = getInitialFamiliaAportesSum(designatedFamiliaIndex);

  // This calculates the percentage *change* (e.g., -50, 0, +50) for the slider value
  const percentageChange = initialSum > 0 ? ((currentSum / initialSum) - 1) * 100 : 0;
  
  // Calculate balance: presupuestoTotal - BUDGET
  const balance = presupuestoTotal - BUDGET;
  
  return (
    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-10" style={{bottom: 'max(1rem, env(safe-area-inset-bottom))'}}>
      <div className="bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-lg sm:rounded-xl md:rounded-2xl px-3 sm:px-4 py-2">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Month Selector */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="text-left hover:bg-gray-50/80 rounded-lg px-1 sm:px-2 py-1 sm:py-2 cursor-pointer">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mes</div>
                <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
                  {getCurrentMonth()}
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-white text-gray-900">
              <DrawerTitle className="text-gray-900">
                {/* Historial de Meses */}
              </DrawerTitle>
              <div className="p-4">
                <div className="space-y-4">
                  {/* Subtle Headers */}
                  <div className="flex justify-center">
                    <div className="px-3 sm:px-4 py-1">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className="w-4"></div>
                        <div className="w-20 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">Mes</div>
                        <div className="w-28 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">Presupuesto</div>
                        <div className="w-24 text-xs font-medium text-gray-400 uppercase tracking-wide text-center">Aporte</div>
                      </div>
                    </div>
                  </div>

                  {/* Historical Months */}
                  {MONTHS_DATA.map((monthData, index) => (
                    <div key={index} className="flex justify-center">
                      <div className="px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50/80 cursor-pointer transition-colors">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          {/* Disabled Check */}
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          </div>

                          {/* Month */}
                          <div className="w-20 text-center">
                            <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
                              {monthData.month.split(' ')[0]}
                            </div>
                          </div>

                          {/* Presupuesto */}
                          <div className="w-28 text-center">
                            <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
                              {formatAbbreviated(monthData.presupuesto)}
                            </div>
                          </div>

                          {/* Aporte */}
                          <div className="w-24 text-center">
                            <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
                              {formatAbbreviated(monthData.aporte)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Current Month */}
                  <div className="flex justify-center">
                    <div className="px-3 sm:px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        {/* Active Check */}
                        <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        </div>

                        {/* Month */}
                        <div className="w-20 text-center">
                          <div className="text-sm sm:text-lg font-bold text-blue-900 leading-tight">
                            {getCurrentMonth()}
                          </div>
                        </div>

                        {/* Presupuesto */}
                        <div className="w-28 text-center">
                          <div className="text-sm sm:text-lg font-bold text-blue-900 leading-tight">
                            {formatAbbreviated(presupuestoTotal)}
                          </div>
                        </div>

                        {/* Aporte */}
                        <div className="w-24 text-center">
                          <div className="text-sm sm:text-lg font-bold text-blue-900 leading-tight">
                            {formatAbbreviated(getFamiliaAportesSum(designatedFamiliaIndex))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Separator */}
          <div className="w-px h-8 bg-gradient-to-b from-gray-200 to-gray-300"></div>

          {/* Presupuesto */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="text-left hover:bg-gray-50/80 rounded-lg px-1 sm:px-2 py-1 sm:py-2 cursor-pointer">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Presupuesto</div>
                <div className="flex items-center">
                  <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
                    {formatAbbreviated(presupuestoTotal)}
                  </div>
                  <div className={`w-2 h-2 rounded-full ml-2 ${presupuestoTotal >= BUDGET ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-white text-gray-900">
              <DrawerTitle className="text-gray-900">
                {/* Presupuesto Total */}
              </DrawerTitle>
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold mb-2 text-gray-900">
                    ${presupuestoTotal.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">Total de Aportes Mensuales</div>
                  
                  {/* Balance Display */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-1">Balance:</div>
                    <div className={`text-lg font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {balance >= 0 ? '+' : ''}${balance.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Presupuesto: ${BUDGET.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Basado en {aportes.length} familias ({aportes.flat().length} aportes)
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          {/* Separator */}
          <div className="w-px h-8 bg-gradient-to-b from-gray-200 to-gray-300"></div>

          {/* Mi Aporte */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="text-left hover:bg-gray-50/80 rounded-lg px-1 sm:px-2 py-1 sm:py-2 cursor-pointer">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aporte</div>
                <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight">
                  {formatAbbreviated(getFamiliaAportesSum(designatedFamiliaIndex))}
                </div>
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-white text-gray-900">
              <DrawerTitle className="text-gray-900">
                {/* Mi Aporte Mensual */}
              </DrawerTitle>
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold mb-2 text-gray-900">
                    ${getFamiliaAportesSum(designatedFamiliaIndex).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">Total de Aportes</div>
                  
                  {/* Individual aportes - only show if more than one */}
                  {aportes[designatedFamiliaIndex] && aportes[designatedFamiliaIndex].length > 1 && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Aportes Individuales:</div>
                      <div className="space-y-1">
                        {aportes[designatedFamiliaIndex]?.map((aporte, index) => (
                          <div key={aporte.id} className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            Aporte {index + 1}: ${aporte.value.toLocaleString()}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Percentage change */}
                  {(() => {
                    const currentSum = getFamiliaAportesSum(designatedFamiliaIndex);
                    const initialSum = getInitialFamiliaAportesSum(designatedFamiliaIndex);
                    const percentageChange = initialSum > 0 ? ((currentSum - initialSum) / initialSum) * 100 : 0;
                    const isIncrease = percentageChange > 0;
                    const isDecrease = percentageChange < 0;
                    
                    return (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Cambio desde el valor inicial:</div>
                        <div className={`text-lg font-semibold ${isIncrease ? 'text-green-600' : isDecrease ? 'text-red-600' : 'text-gray-600'}`}>
                          {isIncrease ? '+' : ''}{percentageChange.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          Inicial: ${initialSum.toLocaleString()} → Actual: ${currentSum.toLocaleString()}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="text-sm text-gray-600 mb-4">Ajustar Aportes (%)</div>
                  <Slider
                    min={-100}
                    max={100}
                    step={1}
                    value={[percentageChange]}
                    onValueChange={(value) => onAporteChange(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>-100%</span>
                    <span>+100%</span>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
