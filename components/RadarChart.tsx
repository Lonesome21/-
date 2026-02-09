import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { CognitiveFunctions } from '../types';

interface FunctionRadarProps {
  data: CognitiveFunctions;
  data2?: CognitiveFunctions; // For comparison
  name1?: string;
  name2?: string;
}

const FunctionRadar: React.FC<FunctionRadarProps> = ({ data, data2, name1, name2 }) => {
  const chartData = [
    { subject: 'Ne', A: data.Ne, B: data2?.Ne || 0, fullMark: 50 },
    { subject: 'Ni', A: data.Ni, B: data2?.Ni || 0, fullMark: 50 },
    { subject: 'Se', A: data.Se, B: data2?.Se || 0, fullMark: 50 },
    { subject: 'Si', A: data.Si, B: data2?.Si || 0, fullMark: 50 },
    { subject: 'Te', A: data.Te, B: data2?.Te || 0, fullMark: 50 },
    { subject: 'Ti', A: data.Ti, B: data2?.Ti || 0, fullMark: 50 },
    { subject: 'Fe', A: data.Fe, B: data2?.Fe || 0, fullMark: 50 },
    { subject: 'Fi', A: data.Fi, B: data2?.Fi || 0, fullMark: 50 },
  ];

  return (
    <div className="w-full h-80 bg-mystic-800/50 rounded-xl p-4 border border-mystic-700">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#475569" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 50]} tick={false} axisLine={false} />
          <Radar
            name={name1 || "User"}
            dataKey="A"
            stroke="#818cf8"
            fill="#818cf8"
            fillOpacity={0.4}
          />
          {data2 && (
             <Radar
             name={name2 || "Partner"}
             dataKey="B"
             stroke="#fbbf24"
             fill="#fbbf24"
             fillOpacity={0.4}
           />
          )}
          <Legend wrapperStyle={{ color: '#e2e8f0' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunctionRadar;
