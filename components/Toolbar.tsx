import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { formatAbbreviated } from '@/lib/format-utils';
import { BUDGET } from '@/lib/constants';
import { Aporte } from "@/lib/types";

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
