import React, { useState } from 'react';
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ScatterChart,
  Scatter,
  Cell,
  ZAxis,
} from 'recharts';

interface HeatMapDataPoint {
  x: string;
  y: string;
  value: number;
}

interface HeatMapProps {
  data: HeatMapDataPoint[];
}

const HeatMap: React.FC<HeatMapProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Define color range for heatmap
  const getColor = (value: number) => {
    // Value is expected to be between 0 and 100
    if (value <= 33) {
      return "#ef4444"; // Red for high risk (low score)
    } else if (value <= 66) {
      return "#f59e0b"; // Amber for medium risk
    } else {
      return "#10b981"; // Green for low risk (high score)
    }
  };

  // Create a unique list of X and Y axis values to form a grid
  const uniqueXValues = Array.from(new Set(data.map(item => item.x)));
  const uniqueYValues = Array.from(new Set(data.map(item => item.y)));
  
  // Create a map of X and Y values to indexes for positioning
  const xMap = uniqueXValues.reduce((acc, val, i) => {
    acc[val] = i;
    return acc;
  }, {} as Record<string, number>);
  
  const yMap = uniqueYValues.reduce((acc, val, i) => {
    acc[val] = i;
    return acc;
  }, {} as Record<string, number>);
  
  // Transform data for scatter chart
  const transformedData = data.map((item, index) => ({
    ...item,
    index,
    // Map string values to numeric positions
    xPos: xMap[item.x],
    yPos: yMap[item.y],
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
      >
        <XAxis
          dataKey="xPos"
          type="number"
          name="Domain"
          tick={false}
          axisLine={false}
          domain={[0, uniqueXValues.length - 1]}
        />
        <YAxis
          dataKey="yPos"
          type="number"
          name="Control"
          tick={false}
          axisLine={false}
          domain={[0, uniqueYValues.length - 1]}
        />
        <ZAxis
          dataKey="value"
          range={[100, 500]} // Determines the size of the dots
          domain={[0, 100]}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-md bg-black/80 p-2 text-xs text-white shadow-md">
                  <p>{`Domain: ${data.x}`}</p>
                  <p>{`Control: ${data.y}`}</p>
                  <p>{`Score: ${data.value.toFixed(0)}%`}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          data={transformedData}
          onMouseOver={(_, index) => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor(entry.value)}
              fillOpacity={activeIndex === index ? 0.9 : 0.7}
              stroke={activeIndex === index ? "#ffffff" : "none"}
              strokeWidth={activeIndex === index ? 1 : 0}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default HeatMap;