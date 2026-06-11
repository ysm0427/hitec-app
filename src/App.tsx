import React, { useState } from 'react';

export default function App() {
  const [total] = useState("580.25");
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">HI-TEC Studio 3.0</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-bold mb-4">공식 배합 시트</h2>
          <p className="text-gray-600">배합 데이터 영역입니다.</p>
        </div>
        <div className="lg:col-span-5 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-lg font-bold mb-4">멀티 시각화 렌더링</h2>
          <div className="p-4 bg-slate-800 text-white rounded-lg font-bold">
            TOTAL WEIGHT: {total} g
          </div>
        </div>
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
