import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { formatAbbreviated } from '@/lib/format-utils';
import { MIN_PAYMENT, MAX_PAYMENT } from '@/lib/constants';

interface ToolbarProps {
  presupuestoTotal: number;
  aportes: number[];
  selectedStudentIndex: number;
  onAporteChange: (newAporte: number) => void;
}

export function Toolbar({ presupuestoTotal, aportes, selectedStudentIndex, onAporteChange }: ToolbarProps) {
  return (
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
                    value={aportes[selectedStudentIndex] || 0}
                    onChange={(e) => onAporteChange(Number(e.target.value))}
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
  );
}
