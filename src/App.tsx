import React, { useState } from 'react';

export default function App() {
  const [total, setTotal] = useState("580.25");
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>HI-TEC Studio 3.0</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px' }}>
          <h2>공식 배합 시트</h2>
          <p>여기에 배합 데이터가 표시됩니다.</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', background: '#f8fafc' }}>
          <h2>멀티 시각화 렌더링</h2>
          <div style={{ padding: '20px', background: '#1e293b', color: 'white', borderRadius: '8px' }}>
            TOTAL WEIGHT: {total} g
          </div>
        </div>
      </div>
    </div>
  );
}
