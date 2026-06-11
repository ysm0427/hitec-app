import React, { useState } from 'react';

export default function App() {
  const [list] = useState([
    { code: 'WT 387', role: '시스템 컴포넌트 B', weight: '198.3' },
    { code: 'WT 321', role: '화이트', weight: '120.0' },
    { code: 'WT 350', role: '트랜스루센트 블랙', weight: '4.35' },
    { code: 'WT 353', role: '트랜스루센트 마젠타 레드', weight: '1.65' },
    { code: 'WT 328', role: '오커', weight: '1.35' }
  ]);
  const [pearls] = useState([
    { code: 'WT 387', role: '시스템 컴포넌트 B', weight: '121.9' },
    { code: 'WT 377', role: '다이아몬드 화이트', weight: '47.8' }
  ]);

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">HI-TEC Studio 3.0</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 배합 시트 영역 */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="font-bold mb-4 border-b pb-2">공식 배합 시트</h2>
          <div className="space-y-2">
            {list.map((t, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                <span className="font-bold text-blue-700">{t.code}</span>
                <span className="text-gray-600">{t.role}</span>
                <span>{t.weight}g</span>
              </div>
            ))}
          </div>
          <h3 className="font-bold mt-4 mb-2 text-purple-700">▼ 펄 코트 (Mid Coat)</h3>
          {pearls.map((t, i) => (
              <div key={i} className="flex justify-between items-center bg-purple-50 p-2 rounded text-sm mb-1">
                <span className="font-bold text-purple-700">{t.code}</span>
                <span>{t.weight}g</span>
              </div>
            ))}
        </div>
        
        {/* 렌더링 영역 */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="font-bold mb-4 border-b pb-2">멀티 시각화 렌더링</h2>
          <div className="p-6 bg-slate-800 text-white rounded-lg font-bold text-center">
            TOTAL WEIGHT: 580.25g
          </div>
        </div>
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
