import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Label } from 'recharts';

// All data points (including interpolated)
const allData = [
  { length: 1.396, load: 0.0, extension: 0.000, isOriginal: true },
  { length: 1.422, load: 2.6, extension: 0.026, isOriginal: true },
  { length: 1.448, load: 5.3, extension: 0.052, isOriginal: true },
  { length: 1.475, load: 7.9, extension: 0.079, isOriginal: true },
  { length: 1.501, load: 10.6, extension: 0.105, isOriginal: true },
  { length: 1.515, load: 11.7, extension: 0.119, isOriginal: false },
  { length: 1.525, load: 12.5, extension: 0.129, isOriginal: false },
  { length: 1.536, load: 13.2, extension: 0.140, isOriginal: true },
  { length: 1.550, load: 14.2, extension: 0.154, isOriginal: false },
  { length: 1.565, load: 15.1, extension: 0.169, isOriginal: false },
  { length: 1.579, load: 15.9, extension: 0.183, isOriginal: true }
];

function App() {
  const originalData = allData.filter(point => point.isOriginal);

  return (
    <div className="p-4">
      <div className="w-full max-w-2xl mx-auto">
        <LineChart width={600} height={400} data={allData} margin={{ top: 20, right: 20, bottom: 60, left: 40 }}>
          <CartesianGrid />
          <XAxis 
            dataKey="length" 
            name="Length" 
            unit=" m"
            label={{ value: 'Length (m)', position: 'bottom', offset: 20 }}
            domain={['dataMin', 'dataMax']}
          />
          <XAxis 
            dataKey="extension" 
            name="Extension"
            unit=" m"
            orientation="bottom"
            xAxisId="extension"
            tickFormatter={(value) => value.toFixed(3)}
            label={{ value: 'Extension (m)', position: 'bottom', offset: 40 }}
          />
          <YAxis 
            dataKey="load" 
            name="Load" 
            unit=" N"
            label={{ value: 'Load (N)', angle: -90, position: 'left', offset: 20 }}
            domain={[0, 'dataMax']}
          />
          <Tooltip />
          <Line 
            type="basis" 
            dataKey="load" 
            stroke="#8884d8" 
            dot={(props) => {
              const isOriginal = allData[props.index].isOriginal;
              if (!isOriginal) return null;
              return (
                <g>
                  <circle cx={props.cx} cy={props.cy} r={4} fill="#8884d8" />
                  <text 
                    x={props.cx} 
                    y={props.cy - 10} 
                    textAnchor="middle" 
                    fill="#666"
                    fontSize="12"
                  >
                    {`${allData[props.index].load}N`}
                  </text>
                </g>
              );
            }}
            strokeWidth={2}
          />
          <ReferenceLine y={10.6} stroke="red" strokeDasharray="3 3">
            <Label value="Limit of Proportionality (10.6 N)" position="right" />
          </ReferenceLine>
        </LineChart>
      </div>
      
      <div className="mt-4 w-full max-w-md mx-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Length (m)</th>
              <th className="border p-2">Extension (m)</th>
              <th className="border p-2">Load (N)</th>
            </tr>
          </thead>
          <tbody>
            {originalData.map((point, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border p-2 text-center">{point.length}</td>
                <td className="border p-2 text-center">{point.extension.toFixed(3)}</td>
                <td className="border p-2 text-center">{point.load}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;