import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface RiskStatusChartProps {
  implemented: number;
  partiallyImplemented: number;
  notImplemented: number;
}

export function RiskStatusChart({ 
  implemented, 
  partiallyImplemented, 
  notImplemented 
}: RiskStatusChartProps) {
  const data = [
    { name: 'Implemented', value: implemented, color: '#22c55e' },
    { name: 'Partially Implemented', value: partiallyImplemented, color: '#f59e0b' },
    { name: 'Not Implemented', value: notImplemented, color: '#ef4444' },
  ].filter(item => item.value > 0); // Only include non-zero values
  
  const total = implemented + partiallyImplemented + notImplemented;
  
  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-muted-foreground mb-2">No assessment data available</p>
        <p className="text-xs text-muted-foreground">
          Complete the assessment to view compliance status
        </p>
      </div>
    );
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [
            `${value} controls (${((value / total) * 100).toFixed(1)}%)`, 
            'Controls'
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}