import { COLORS } from '@/lib/constants';
import type { PaymentStats } from '@/lib/types';

interface StatsBarProps {
  stats: PaymentStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <div className="absolute top-2 sm:top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-gray-200 flex items-center space-x-3 sm:space-x-6 md:space-x-8">
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
  );
}
