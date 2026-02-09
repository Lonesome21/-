import React from 'react';
import { TenGodData } from '../types';

interface Props {
  data: TenGodData[];
}

const TenGodsChart: React.FC<Props> = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="w-full">
      <h4 className="text-center text-gray-500 text-xs font-serif uppercase tracking-widest mb-6">十神能量占比</h4>
      <div className="grid grid-cols-10 gap-2 h-40 items-end px-2">
        {data.map((item, idx) => {
          const height = Math.max((item.value / maxVal) * 100, 5); // Min height 5%
          
          // Muted, classy colors for "Ink & Gold" theme
          let colorClass = 'bg-gray-600';
          if (['比肩','劫财'].includes(item.name)) colorClass = 'bg-slate-400'; // Self - Metal/Water tones
          else if (['食神','伤官'].includes(item.name)) colorClass = 'bg-emerald-700/60'; // Output - Muted Green
          else if (['偏财','正财'].includes(item.name)) colorClass = 'bg-amber-600/70'; // Wealth - Muted Gold
          else if (['七杀','正官'].includes(item.name)) colorClass = 'bg-red-900/60'; // Power - Muted Red
          else colorClass = 'bg-indigo-900/60'; // Resource - Deep Blue

          return (
            <div key={idx} className="flex flex-col items-center group h-full justify-end">
              <div className="relative w-full flex justify-center h-full items-end">
                 <div 
                    className={`w-full max-w-[20px] rounded-t-sm transition-all duration-1000 ${colorClass} hover:opacity-80`} 
                    style={{ height: `${height}%` }}
                 ></div>
                 
                 {/* Tooltip */}
                 <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-950 border border-white/10 text-xs text-gold-200 px-2 py-1 rounded whitespace-nowrap z-20 shadow-lg pointer-events-none">
                    {item.label}: {item.value}%
                 </div>
              </div>
              <div className="mt-3 text-[10px] text-gray-500 font-serif writing-mode-vertical text-center tracking-widest h-12 flex items-center">
                  {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TenGodsChart;
