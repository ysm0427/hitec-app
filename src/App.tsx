import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Trash2, Plus, Zap, Maximize, Lock, Layers, BrainCircuit, RefreshCw, Mic, MicOff, Camera, X, ImageIcon, Beaker, Minus } from 'lucide-react';

// 💡 1. 안료 데이터베이스
const TONER_DB: Record<string, { role: string, desc: string }> = {
  'WT 387': { role: '시스템 컴포넌트 B', desc: '점도 조절 및 흐름성 향상 첨가제.' },
  'WT 321': { role: '화이트', desc: '표준 고농도 화이트. 정면 명도 상승 및 은폐력 보강.' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '투명 흑색. 섀도우 영역의 깊이감 조절.' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '투명 자주색. 고채도 이펙트 연출.' },
  'WT 328': { role: '오커', desc: '탁한 황색계열. 은폐력이 우수하여 베이지/브라운 베이스 조색용.' },
  'WT 3080': { role: '이펙트 컨트롤러', desc: '입자 배열 조절용 첨가제.' },
  'WT 377': { role: '다이아몬드 화이트', desc: '고휘도 글라스 플레이크. 정면/측면 반사율이 매우 높음.' },
  'WT 364': { role: '화이트 펄', desc: '백색 운모 펄. 입자감이 거칠고 반짝임이 강함.' },
  'WT 386': { role: '플롭 컨트롤', desc: '관찰각도에 따른 밝기 변화를 제어하는 조절제.' },
  'WT 370': { role: '브라이트 블루 펄', desc: '청색 간섭 펄. 측면에서 푸른 빛을 강하게 띔.' },
  'WT 365': { role: '라일락 펄', desc: '자주색 간섭 펄. 정면 청적색, 측면 황녹색 변화.' },
  'WT 6052': { role: '지연용 첨가제', desc: '작업성 개선을 위한 표준 지연제.' }
};

// 💡 2. 필수 광학 함수 (에러 방지용)
const getColorString = (optics: any, angle: 'face'|'mid'|'flop') => {
  if (!optics || !optics[angle]) return 'hsl(0,0%,70%)';
  return `hsl(${optics[angle].h}, ${optics[angle].s}%, ${optics[angle].l}%)`;
};

// 💡 3. 조색 시뮬레이션 로직 (입자 질감 표현)
export default function App() {
  const [toners, setToners] = useState<any[]>([{ id: 'b1', code: 'WT 387', role: '시스템 컴포넌트 B', adjustedWeight: "198.3" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: 'p1', code: 'WT 377', role: '다이아몬드 화이트', adjustedWeight: "47.8" }]);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });

  // 조명 위치에 따른 방향 텍스트 표시
  const getLightDirection = (x: number, y: number) => {
    if (y < 20) return "12시 방향 (정상광)";
    if (x > 80) return "3시 방향 (측면광)";
    if (y > 80) return "6시 방향 (하단광)";
    if (x < 20) return "9시 방향 (측면광)";
    return "센터 조명";
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-black">HI-TEC V9.1 스튜디오</h1>
        <button onClick={() => setIsConfiguratorOpen(true)} className="bg-blue-600 px-4 py-2 rounded-lg font-bold flex items-center">
          <Maximize size={16} className="mr-2"/> 확장 뷰어(Before/After)
        </button>
      </div>

      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-black z-50 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">실시간 광학 시뮬레이션</h2>
                <button onClick={() => setIsConfiguratorOpen(false)}><X size={32}/></button>
            </div>
            
            {/* 💡 태양 위치 텍스트 표시 */}
            <div className="text-center font-black text-yellow-400 mb-2">
                현재 조명 위치: {getLightDirection(lightPos.x, lightPos.y)}
            </div>

            <div className="flex-1 flex gap-4">
                <div className="flex-1 border-2 border-slate-600 rounded-xl relative" style={{background: 'linear-gradient(to right, #444, #000)'}}>
                    <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded">변경 전 (원본)</div>
                </div>
                <div className="flex-1 border-2 border-blue-500 rounded-xl relative" style={{background: 'linear-gradient(to right, #222, #000)'}}>
                    <div className="absolute top-2 left-2 bg-blue-900/50 px-2 py-1 rounded">변경 후 (수정본)</div>
                    {/* 💡 슬라이더 퀵 에디터 추가 */}
                    <div className="absolute top-12 left-2 w-full p-2">
                        {toners.map(t => (
                            <div key={t.id} className="mb-4">
                                <label className="text-xs">{t.code} ({t.adjustedWeight}g)</label>
                                <input type="range" min="0" max="500" step="0.1" value={t.adjustedWeight} 
                                       onChange={(e) => {
                                           const newToners = toners.map(tn => tn.id === t.id ? {...tn, adjustedWeight: e.target.value} : tn);
                                           setToners(newToners);
                                       }} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="h-20 flex items-center justify-center cursor-pointer relative" 
                 onPointerMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setLightPos({
                        x: ((e.clientX - rect.left) / rect.width) * 100,
                        y: ((e.clientY - rect.top) / rect.height) * 100
                    });
                 }}>
                <div className="w-8 h-8 bg-yellow-400 rounded-full" style={{left: `${lightPos.x}%`, position: 'absolute'}}></div>
            </div>
        </div>
      )}
      
      {/* 기본 입력창 UI */}
      <div className="bg-slate-800 p-4 rounded-xl">
        {toners.map(t => (
            <div key={t.id} className="flex gap-2 mb-2 items-center">
                <input value={t.code} className="bg-slate-700 p-2 rounded text-sm w-24"/>
                <input type="range" min="0" max="500" step="0.1" value={t.adjustedWeight} 
                       onChange={(e) => setToners(toners.map(tn => tn.id === t.id ? {...tn, adjustedWeight: e.target.value} : tn))} 
                       className="flex-1 accent-blue-500"/>
                <span className="w-16 text-right font-bold">{t.adjustedWeight}g</span>
            </div>
        ))}
        <button onClick={() => setToners([...toners, { id: `b_${Date.now()}`, code: '', role: '신규', adjustedWeight: '0.0' }])} 
                className="w-full py-3 bg-blue-600 rounded-lg font-bold">베이스 추가</button>
      </div>
    </div>
  );
}
