import React, { useState } from 'react';

export default function App() {
  const [list] = useState([
    { code: 'WT 387', weight: '198.3' },
    { code: 'WT 321', weight: '120.0' },
    { code: 'WT 377', weight: '47.8' }
  ]);

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold mb-6">HI-TEC Studio 3.0</h1>
      <div className="space-y-4">
        {list.map((item, i) => (
          <div key={i} className="flex justify-between p-3 bg-gray-100 rounded">
            <span className="font-bold">{item.code}</span>
            <span>{item.weight}g</span>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-900 text-white rounded-lg text-center font-bold">
        TOTAL: 366.1g
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
