"use client";

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";
import { formatAbbreviated } from '@/lib/format-utils';
import { STANDARD_PAYMENT } from '@/lib/constants';
import { Aporte } from "@/lib/types";
import { useMemo, useState } from "react";

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
  getFamiliaStandardBaseline: (familiaIndex: number) => number;
  getFamiliaPercentageFromStandard: (familiaIndex: number) => number;
}

export function Toolbar({ 
  presupuestoTotal, 
  aportes, 
  designatedFamiliaIndex, 
  onAporteChange, 
  getFamiliaAportesSum,
  getFamiliaStandardBaseline,
  getFamiliaPercentageFromStandard
}: ToolbarProps) {
  const currentSum = getFamiliaAportesSum(designatedFamiliaIndex);
  const standardBaseline = getFamiliaStandardBaseline(designatedFamiliaIndex);
  const percentageFromStandard = getFamiliaPercentageFromStandard(designatedFamiliaIndex);
  
  // Calculate balance: presupuestoTotal - expected total (STANDARD_PAYMENT * totalAportes)
  const expectedTotal = STANDARD_PAYMENT * aportes.flat().length;
  const balance = presupuestoTotal - expectedTotal;
  
  // Fixed aporte display logic (visual only)
  const familiaAportesCount = aportes[designatedFamiliaIndex]?.length || 0;
  const familiaBaseline = STANDARD_PAYMENT * familiaAportesCount;
  const isDeficit = balance < 0;
  const shouldApplyFixedDisplay = isDeficit && currentSum < familiaBaseline;
  const displayFamiliaTotal = shouldApplyFixedDisplay ? familiaBaseline : currentSum;

  // Mock controls for budget distribution (visual only)
  const BASE_MOCK = {
    salarios: 120_000_000,
    becas: 35_000_000,
    reservas: 25_000_000,
    mantenimiento: 18_000_000,
  };

  const [salariosPct, setSalariosPct] = useState(60);
  const [becasPct, setBecasPct] = useState(40);
  const [reservasPct, setReservasPct] = useState(20);
  const [mantenimientoPct, setMantenimientoPct] = useState(25);

  // Base + percentage increment behavior: 0% => base amount; 100% => double the base
  const salariosAmount = useMemo(() => Math.round(BASE_MOCK.salarios * (1 + salariosPct / 100)), [salariosPct]);
  const becasAmount = useMemo(() => Math.round(BASE_MOCK.becas * (1 + becasPct / 100)), [becasPct]);
  const reservasAmount = useMemo(() => Math.round(BASE_MOCK.reservas * (1 + reservasPct / 100)), [reservasPct]);
  const mantenimientoAmount = useMemo(() => Math.round(BASE_MOCK.mantenimiento * (1 + mantenimientoPct / 100)), [mantenimientoPct]);
  
  return (
    <div className="fixed lg:absolute bottom-0 left-0 right-0 z-20 bg-gray-50 border-t border-gray-200" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
      <div role="toolbar" aria-label="Barra de herramientas" className="mx-auto max-w-5xl px-3 sm:px-4">
        <div className="h-14 sm:h-16 flex items-center justify-center gap-4 sm:gap-6 divide-x divide-gray-100">
          <div className="px-2 sm:px-3">
          {/* Month Selector */}
          <Drawer>
            <DrawerTrigger asChild>
              <button aria-label="Abrir selector de mes" className="text-left hover:bg-gray-100/60 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500/40">
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

          </div>
          <div className="px-2 sm:px-3">
          {/* Presupuesto */}
          <Drawer>
            <DrawerTrigger asChild>
              <button aria-label="Ver presupuesto" className="text-left hover:bg-gray-100/60 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500/40">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Presupuesto</div>
                <div className="flex items-center">
                  <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight tabular-nums">
                    {formatAbbreviated(presupuestoTotal)}
                  </div>
                  <div className={`w-2 h-2 rounded-full ml-2 ${balance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                    Presupuesto Esperado: ${expectedTotal.toLocaleString()}
                  </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 mb-4">
                    Basado en {aportes.length} familias ({aportes.flat().length} aportes)
                  </div>
                  
                </div>
                {/* Budget controls (mock) */}
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Aumentos</div>
                    <div className="text-xs text-gray-500">
                      Sujetos a votación
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Salarios */}
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="text-sm text-gray-600">Salarios</div>
                        <div className="text-sm font-semibold text-gray-900">{formatAbbreviated(salariosAmount)}</div>
                      </div>
                      <div className="text-[11px] text-gray-400 mb-2">Base: {formatAbbreviated(BASE_MOCK.salarios)} • {salariosPct}%</div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[salariosPct]}
                        onValueChange={(v) => setSalariosPct(v[0])}
                        className="w-full"
                      />
                    </div>

                    {/* Becas */}
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="text-sm text-gray-600">Becas</div>
                        <div className="text-sm font-semibold text-gray-900">{formatAbbreviated(becasAmount)}</div>
                      </div>
                      <div className="text-[11px] text-gray-400 mb-2">Base: {formatAbbreviated(BASE_MOCK.becas)} • {becasPct}%</div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[becasPct]}
                        onValueChange={(v) => setBecasPct(v[0])}
                        className="w-full"
                      />
                    </div>

                    {/* Reservas */}
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="text-sm text-gray-600">Reservas</div>
                        <div className="text-sm font-semibold text-gray-900">{formatAbbreviated(reservasAmount)}</div>
                      </div>
                      <div className="text-[11px] text-gray-400 mb-2">Base: {formatAbbreviated(BASE_MOCK.reservas)} • {reservasPct}%</div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[reservasPct]}
                        onValueChange={(v) => setReservasPct(v[0])}
                        className="w-full"
                      />
                    </div>

                    {/* Mantenimiento */}
                    <div className="rounded-lg border border-gray-200 p-3">
                      <div className="flex items-baseline justify-between mb-1">
                        <div className="text-sm text-gray-600">Mantenimiento</div>
                        <div className="text-sm font-semibold text-gray-900">{formatAbbreviated(mantenimientoAmount)}</div>
                      </div>
                      <div className="text-[11px] text-gray-400 mb-2">Base: {formatAbbreviated(BASE_MOCK.mantenimiento)} • {mantenimientoPct}%</div>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[mantenimientoPct]}
                        onValueChange={(v) => setMantenimientoPct(v[0])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          </div>
          <div className="px-2 sm:px-3">
          {/* Mi Aporte */}
          <Drawer>
            <DrawerTrigger asChild>
              <button aria-label="Ver mi aporte" className="text-left hover:bg-gray-100/60 rounded-md px-2 sm:px-3 py-1.5 sm:py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500/40">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aporte</div>
                <div className="text-sm sm:text-lg font-bold text-gray-900 leading-tight tabular-nums">
                  {formatAbbreviated(displayFamiliaTotal)}
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
                    ${displayFamiliaTotal.toLocaleString()}
                  </div>
                  {shouldApplyFixedDisplay && (
                    <div className="mb-4">
                      <div className="inline-flex items-start space-x-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <div className="text-xs text-amber-700/90">
                            Debido al balance negativo no se permiten aportes por debajo del promedio.
                          </div>
                      </div>
                    </div>
                  )}
                  
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
                    const isIncrease = percentageFromStandard > 0;
                    const isDecrease = percentageFromStandard < 0;
                    
                    return (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-1">Cambio desde el aporte promedio:</div>
                        <div className={`text-lg font-semibold ${isIncrease ? 'text-green-600' : isDecrease ? 'text-red-600' : 'text-gray-600'}`}>
                          {isIncrease ? '+' : ''}{percentageFromStandard.toFixed(1)}%
                        </div>
                         <div className="text-xs text-gray-500">
                           Promedio: ${standardBaseline.toLocaleString()} → Actual: ${currentSum.toLocaleString()}
                         </div>
                      </div>
                    );
                  })()}

                  <div className="text-sm text-gray-600 mb-4">Ajusta el aporte (%)</div>
                  <Slider
                    min={-100}
                    max={100}
                    step={1}
                    value={[percentageFromStandard]}
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
    </div>
  );
}
