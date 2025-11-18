import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

interface RadarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[]
  }
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  // Convert the input data format to the format expected by Recharts
  const convertedData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = {
      subject: label,
    };

    // Add all datasets for this label
    data.datasets.forEach((dataset, datasetIndex) => {
      dataPoint[dataset.label] = dataset.data[index];
    });

    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadarChart cx="50%" cy="50%" outerRadius="80%" data={convertedData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        {data.datasets.map((dataset, index) => (
          <Radar
            key={index}
            name={dataset.label}
            dataKey={dataset.label}
            stroke={dataset.borderColor}
            fill={dataset.backgroundColor}
            fillOpacity={0.6}
          />
        ))}
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChart;