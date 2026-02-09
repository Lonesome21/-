import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { FiveElementData } from '../types';

interface Props {
  data: FiveElementData[];
}

const FiveElementsChart: React.FC<Props> = ({ data }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full h-48 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={2}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#020617', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', color: '#fbbf24' }}
               itemStyle={{ color: '#e2e8f0' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="text-center">
              <span className="text-xl font-serif text-gray-200 font-bold block">五行</span>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest">Balance</span>
           </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-xs text-gray-400 font-serif">{item.name} <span className="text-gray-500 font-sans ml-1">{item.value}%</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FiveElementsChart;
