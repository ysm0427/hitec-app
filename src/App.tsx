import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Trash2, Plus, Zap, Maximize, Lock, Unlock, Layers, BrainCircuit, RefreshCw, Mic, FolderOpen } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([{ id: 1, text: 'HI-TEC 엔진 가동 준비 완료.' }]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-900">
      <h1 className="text-xl font-bold mb-4">HI-TEC Studio 3.0</h1>
      
      {/* PC: grid-cols-12(좌7, 우5), 모바일: grid-cols-1(위아래) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 배합 리스트 (좌측) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="font-bold mb-4 flex items-center"><Sliders size={18} className="mr-2"/>공식 배합 시트</h2>
          <div className="space-y-2">
            {['WT 387', 'WT 321', 'WT 350', 'WT 353', 'WT 328'].map(code => (
              <div key={code} className="flex justify-between p-3 bg-slate-50 rounded border text-sm">
                <span className="font-bold text-blue-700">{code}</span>
                <span>조색제 적용 완료</span>
              </div>
            ))}
          </div>
        </div>

        {/* 렌더링 및 터미널 (우측) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="font-bold mb-4"><Layers size={18} className="inline mr-2"/>멀티 시각화</h2>
            <div className="p-6 bg-slate-800 text-white rounded-lg font-bold text-center shadow-inner">
              TOTAL WEIGHT: 580.25g
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex-1">
            <h2 className="font-bold mb-4"><BrainCircuit size={18} className="inline mr-2"/>엔진 터미널</h2>
            <div className="h-40 overflow-y-auto bg-slate-50 p-3 rounded border text-xs mb-3 shadow-inner">
              {messages.map(m => <div key={m.id} className="mb-2">{m.text}</div>)}
              <div ref={chatEndRef} />
            </div>
            <button onClick={() => setMessages([...messages, { id: Date.now(), text: '조색 엔진 보정 완료.' }])} className="w-full bg-blue-600 text-white p-2 rounded font-bold text-sm">
              명령어 실행
            </button>
          </div>
        </div>
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}
