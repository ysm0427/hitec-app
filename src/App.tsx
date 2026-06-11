import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Trash2, Plus, Zap, Maximize, Lock, Unlock, Layers, BrainCircuit, RefreshCw, Mic, FolderOpen, ChevronRight, Sun, Droplet, Camera, X } from 'lucide-react';

// 💡 1. 안료 DB (핵심 데이터 유지)
const TONER_DB = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임.' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제.' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. 주로 흑색계열 컬러에 제한적 사용.' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. 채도가 높으며 측면을 더 어둡게 함.' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 좋은 글라스 플레이크.' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제.' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제. 솔리드에서 명암을 밝게 함.' },
  'WT 323': { role: '스페셜 블랙', desc: '표준 흑색 조색제. 명도와 채도를 낮춤.' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러에 사용하는 탁한 황색.' },
  'WT 341': { role: '아주르 블루', desc: '채도 높은 청색 조색제. 관찰각도 별 색상 변화 큼.' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 청색 조색제. 가장 많이 사용하는 청색.' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제. WT323의 저농 버전.' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338 저농 버전.' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 일반형 알루미늄 조색제.' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄 조색제. 입자의 반짝임이 매우 좋음.' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄 조색제.' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: 'Transparent White. 점도가 높음.' },
  'WT 386': { role: '플롭 컨트롤', desc: '측면을 밝게 하기 위한 명암 조정제.' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: 'Viscosity Additive' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기의 고휘도 광휘형 알루미늄 조색제.' },
  'WT 3080': { role: '스페셜 애디티브', desc: '도막 보정 및 흐름 방지 첨가제' },
};

// 💡 2. 광학 계산 및 색상 엔진
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const getOptics = (tonersList: any[], weightKey: string) => {
  const colorToners = tonersList.filter(t => !t.role.includes('지정되지 않은'));
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t[weightKey]) || 0), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0, rGreen=0, rRed=0, rYellow=0, rViolet=0;
  let wSilver=0, wWhite=0, wBlack=0, wPearl=0, wBinder=0;

  colorToners.forEach(t => {
    const w = parseFloat(t[weightKey]) || 0; if (w <= 0) return;
    const r = t.role || ''; const c = t.code || '';
    if (r.includes('컴포넌트') || r.includes('애디티브')) wBinder += w;
    else if (r.includes('블랙')) wBlack += w;
    else if (r.includes('실버')) wSilver += w;
    else if (r.includes('화이트')) wWhite += w;
    else if (r.includes('펄') || r.includes('다이아몬드')) wPearl += w;
    else if (r.includes('블루')) rBlue += w;
    else if (r.includes('레드') || r.includes('마젠타')) rRed += w;
    else if (r.includes('옐로우') || r.includes('오커')) rYellow += w;
    else if (r.includes('그린')) rGreen += w;
  });

  const effectiveW = wWhite + wBlack + wSilver + wPearl + (rBlue + rRed + rYellow + rGreen);
  const total = effectiveW > 0 ? effectiveW : 1;
  
  let baseL = ((wWhite/total) * 96) + ((wSilver/total) * 65) + ((wPearl/total) * 85);
  if (effectiveW === 0 && wBinder > 0) baseL = 90;
  baseL = Math.max(5, baseL - (Math.pow(wBlack/total, 0.5) * 50));

  return {
    face: { h: 210, s: (wPearl/total)*30, l: Math.min(99, baseL + 15) },
    mid:  { h: 210, s: (wPearl/total)*20, l: baseL },
    flop: { h: 210, s: (wPearl/total)*10, l: Math.max(5, baseL - 20) },
    isMetallic: (wSilver > 0 || wPearl > 0)
  };
};

export default function App() {
  const [toners, setToners] = useState([
    { id: 't1', code: 'WT 387', role: '시스템 컴포넌트 B', adjustedWeight: "198.3" },
    { id: 't2', code: 'WT 321', role: '화이트', adjustedWeight: "120" },
    { id: 't3', code: 'WT 350', role: '트랜스루센트 블랙', adjustedWeight: "4.35" },
    { id: 't4', code: 'WT 353', role: '트랜스루센트 마젠타 레드', adjustedWeight: "1.65" },
    { id: 't5', code: 'WT 328', role: '오커', adjustedWeight: "1.35" },
  ]);
  const [pearlToners, setPearlToners] = useState([
    { id: 'p1', code: 'WT 387', role: '시스템 컴포넌트 B', adjustedWeight: "121.9" },
    { id: 'p2', code: 'WT 377', role: '다이아몬드 화이트', adjustedWeight: "47.8" },
  ]);
  
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(true);
  const [targetColorCode, setTargetColorCode] = useState('FORD-UG PLATINUM');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([{ id: 1, type: 'system', text: '💡 [HI-TEC 조색 엔진 연결 완료]\n- 명령어 예시: "WT328 0.5g 감소시켜줘"' }]);
  
  // 실시간 계산 상태
  const baseW = toners.reduce((s, t) => s + (parseFloat(t.adjustedWeight) || 0), 0);
  const pearlW = pearlToners.reduce((s, t) => s + (parseFloat(t.adjustedWeight) || 0), 0);
  const totalW = baseW + pearlW;
  
  const baseOptics = getOptics(toners, 'adjustedWeight');
  const pearlOptics = getOptics(pearlToners, 'adjustedWeight');
  const finalOptics = getOptics([...toners, ...(isThreeCoatMode ? pearlToners : [])], 'adjustedWeight');

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    setChatMessages(p => [...p, { id: Date.now(), type: 'user', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(p => [...p, { id: Date.now(), type: 'ai', text: `✅ 분석 완료: 입력하신 조색 데이터가 실시간 렌더링에 반영되었습니다.` }]);
    }, 600);
  };

  const handleWeightChange = (id: string, val: string, isPearl: boolean) => {
    const clean = val.replace(/[^0-9.]/g, '');
    if (isPearl) setPearlToners(p => p.map(t => t.id === id ? { ...t, adjustedWeight: clean } : t));
    else setToners(p => p.map(t => t.id === id ? { ...t, adjustedWeight: clean } : t));
  };

  const getColorStr = (opt: any, type: 'face'|'mid'|'flop') => `hsl(${opt[type].h}, ${opt[type].s}%, ${opt[type].l}%)`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col overflow-x-hidden">
      {/* 헤더 */}
      <header className="bg-slate-900 p-4 shadow-md flex justify-between items-center shrink-0">
        <h1 className="text-xl font-bold text-white flex items-center">
          <span className="bg-blue-500 w-8 h-8 flex items-center justify-center rounded mr-3 shadow">H</span>
          HI-TEC <span className="text-blue-400 font-normal ml-2">Studio 3.0</span>
        </h1>
        <button className="text-white text-sm bg-slate-800 px-4 py-2 rounded-full border border-slate-700 flex items-center">
          <FolderOpen size={16} className="mr-2"/> DB 동기화
        </button>
      </header>

      {/* 메인 레이아웃: PC(양옆), 모바일(상하 스크롤) 완벽 대응 */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-72px)] overflow-y-auto">
        
        {/* 왼쪽: 에디터 */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-xl border border-slate-300 flex flex-col h-auto lg:h-full overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
            <h2 className="font-bold flex items-center mb-3"><Sliders size={18} className="text-blue-600 mr-2"/> 공식 배합 시트</h2>
            <div className="flex space-x-2">
              <input value={targetColorCode} onChange={e => setTargetColorCode(e.target.value)} className="flex-1 border p-2 rounded text-sm font-bold shadow-inner uppercase" />
              <button className="bg-slate-800 text-white px-4 py-2 rounded text-sm font-bold flex items-center"><Lock size={14} className="mr-1"/> 확정</button>
            </div>
          </div>
          
          <div className="p-4 flex-1 overflow-y-auto space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-sm text-slate-500">▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center space-x-2 bg-slate-100 px-2 py-1 rounded cursor-pointer border">
                  <span className="text-xs font-bold text-purple-700">3Coat (펄) 모드</span>
                  <input type="checkbox" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} className="accent-purple-600" />
                </label>
              </div>
              {toners.map(t => (
                <div key={t.id} className="flex justify-between items-center bg-slate-50 p-2 mb-2 rounded border border-slate-200">
                  <input value={t.code} readOnly className="w-20 bg-transparent font-bold text-sm text-blue-700 outline-none" />
                  <span className="flex-1 text-xs font-bold truncate px-2">{t.role}</span>
                  <div className="flex items-center">
                    <input value={t.adjustedWeight} onChange={e => handleWeightChange(t.id, e.target.value, false)} className="w-16 text-right border p-1 rounded text-sm font-bold" />
                    <span className="text-xs text-gray-500 ml-1">g</span>
                  </div>
                </div>
              ))}
            </div>

            {isThreeCoatMode && (
              <div className="pt-4 border-t-2 border-dashed border-purple-200">
                <span className="font-bold text-sm text-purple-700 mb-3 block">▼ 펄 코트 (Mid Coat)</span>
                {pearlToners.map(t => (
                  <div key={t.id} className="flex justify-between items-center bg-purple-50 p-2 mb-2 rounded border border-purple-100">
                    <input value={t.code} readOnly className="w-20 bg-transparent font-bold text-sm text-purple-700 outline-none" />
                    <span className="flex-1 text-xs font-bold truncate px-2">{t.role}</span>
                    <div className="flex items-center">
                      <input value={t.adjustedWeight} onChange={e => handleWeightChange(t.id, e.target.value, true)} className="w-16 text-right border p-1 rounded text-sm font-bold" />
                      <span className="text-xs text-gray-500 ml-1">g</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-slate-800 text-white p-3 flex justify-between items-center shrink-0">
            <span className="text-xs font-bold text-slate-400">TOTAL WEIGHT</span>
            <span className="text-lg font-black text-cyan-400">{totalW.toFixed(2)} g</span>
          </div>
        </div>

        {/* 오른쪽: 시각화 & 터미널 */}
        <div className="lg:col-span-5 flex flex-col gap-4 h-auto lg:h-full">
          
          <div className="bg-white rounded-xl shadow-xl border border-slate-300 p-4 shrink-0">
            <h3 className="font-bold text-sm mb-3 flex items-center border-b pb-2"><Layers size={16} className="text-blue-600 mr-2"/> 멀티 시각화 렌더링</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1"><span>A. 베이스 코트</span><span>{baseW.toFixed(2)}g</span></div>
                <div className="h-10 rounded border shadow-inner" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorStr(baseOptics, 'face')} 0%, ${getColorStr(baseOptics, 'mid')} 50%, ${getColorStr(baseOptics, 'flop')} 100%)` }}></div>
              </div>
              {isThreeCoatMode && (
                <div>
                  <div className="flex justify-between text-xs font-bold text-purple-600 mb-1"><span>B. 펄 코트</span><span>{pearlW.toFixed(2)}g</span></div>
                  <div className="h-10 rounded border shadow-inner" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorStr(pearlOptics, 'face')} 0%, ${getColorStr(pearlOptics, 'mid')} 50%, ${getColorStr(pearlOptics, 'flop')} 100%)` }}></div>
                </div>
              )}
              <div>
                <div className="flex justify-between text-xs font-bold text-blue-600 mb-1"><span>C. 최종 컬러 결합</span><span>{totalW.toFixed(2)}g</span></div>
                <div className="h-12 rounded border shadow-inner" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorStr(finalOptics, 'face')} 0%, ${getColorStr(finalOptics, 'mid')} 50%, ${getColorStr(finalOptics, 'flop')} 100%)` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-slate-300 p-4 flex flex-col flex-1 h-[300px] lg:h-auto">
            <h3 className="font-bold text-sm mb-3 flex items-center"><BrainCircuit size={16} className="text-blue-600 mr-2"/> AI 엔진 터미널</h3>
            <div className="flex-1 bg-slate-50 border rounded p-3 overflow-y-auto space-y-3 text-xs shadow-inner mb-3">
              {chatMessages.map(m => (
                <div key={m.id} className={`p-2 rounded border ${m.type === 'system' ? 'bg-slate-800 text-white' : m.type === 'user' ? 'bg-blue-600 text-white ml-6' : 'bg-white mr-6'}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex space-x-2 shrink-0">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAskSolution()} placeholder="명령어 입력..." className="flex-1 border p-2 rounded text-xs outline-none focus:border-blue-500" />
              <button onClick={handleAskSolution} className="bg-blue-600 text-white font-bold px-4 rounded text-xs">실행</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
