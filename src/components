
// src/components/ClearMixer.tsx
import React from 'react';
import { Calculator, Sliders, ChevronUp, ChevronDown } from 'lucide-react';

interface ClearMixerProps {
  isClearCoatMode: boolean;
  isClearAutoCalc: boolean;
  setIsClearAutoCalc: (val: boolean) => void;
  clearCode: string;
  setClearCode: (val: string) => void;
  clearWeight: string;
  setClearWeight: (val: string) => void;
  hardenerCode: string;
  setHardenerCode: (val: string) => void;
  hardenerWeight: string;
  setHardenerWeight: (val: string) => void;
  thinnerCode: string;
  setThinnerCode: (val: string) => void;
  thinnerWeight: string;
  setThinnerWeight: (val: string) => void;
  clearRatioPreset: string;
  setClearRatioPreset: (val: string) => void;
}

export default function ClearMixer({
  isClearCoatMode,
  isClearAutoCalc,
  setIsClearAutoCalc,
  clearCode,
  setClearCode,
  clearWeight,
  setClearWeight,
  hardenerCode,
  setHardenerCode,
  hardenerWeight,
  setHardenerWeight,
  thinnerCode,
  setThinnerCode,
  thinnerWeight,
  setThinnerWeight,
  clearRatioPreset,
  setClearRatioPreset,
}: ClearMixerProps) {
  if (!isClearCoatMode) return null;

  // 비율 문자열 파싱 (예: "3:1+5%" 또는 "3:1")
  const ratioMatch = (clearRatioPreset || '3:1').match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)(?:\+(\d+(?:\.\d+)?)%)?$/);
  const rClear = ratioMatch ? parseFloat(ratioMatch[1]) : 3;
  const rHard = ratioMatch ? parseFloat(ratioMatch[2]) : 1;
  const rThin = ratioMatch && ratioMatch[3] ? parseFloat(ratioMatch[3]) : 0;

  // 무게 자동 계산 로직
  const updateClearMix = (nextC: number, nextH: number, nextT: number, weightVal = clearWeight, autoMode = isClearAutoCalc) => {
    const safeC = Math.max(1, Math.min(20, nextC));
    const safeH = Math.max(1, Math.min(20, nextH));
    const safeT = Math.max(0, Math.min(50, nextT));
    const nextPreset = safeT > 0 ? `${safeC}:${safeH}+${safeT}%` : `${safeC}:${safeH}`;
    setClearRatioPreset(nextPreset);

    if (autoMode) {
      const cw = parseFloat(weightVal) || 0;
      const hw = cw * (safeH / safeC);
      const tw = (cw + hw) * (safeT / 100);
      setHardenerWeight(hw.toFixed(1));
      setThinnerWeight(tw.toFixed(1));
    }
  };

  return (
    <div className="pt-4 mt-4 border-t border-cyan-200 space-y-2 pb-2">
       <div className="text-xs font-black text-cyan-700 flex justify-between items-center border-b pb-1">
           <span>▼ 투명 코트 (Clear Coat) 스마트 배합기</span>
           <label className="flex items-center gap-1.5 cursor-pointer">
               <span className="text-[10px] font-bold text-slate-500">{isClearAutoCalc ? '자동 계산 ON' : '수동 입력 모드'}</span>
               <div className="relative">
                   <input
                     type="checkbox"
                     className="sr-only"
                     checked={isClearAutoCalc}
                     onChange={() => {
                       const next = !isClearAutoCalc;
                       setIsClearAutoCalc(next);
                       if (next) updateClearMix(rClear, rHard, rThin, clearWeight, true);
                     }}
                   />
                   <div className={`w-8 h-4 rounded-full transition-colors ${isClearAutoCalc ? 'bg-cyan-500' : 'bg-slate-300'}`}></div>
                   <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform ${isClearAutoCalc ? 'transform translate-x-4' : ''}`}></div>
               </div>
           </label>
       </div>
       
       <div className="bg-cyan-50 rounded-xl overflow-hidden border border-cyan-200 shadow-sm flex flex-col p-3 gap-2.5">
           {/* 1. 고정 품번 프리셋 3가지 버튼 */}
           <div className="flex flex-col gap-1">
               <span className="text-[10px] font-bold text-cyan-800">★ 대표 제품 원클릭 프리셋</span>
               <div className="flex flex-wrap gap-1.5 items-center">
                   <button
                     type="button"
                     onClick={() => {
                       setClearCode('355S'); setHardenerCode('7205'); setThinnerCode('-');
                       updateClearMix(3, 1, 0, clearWeight, true); setIsClearAutoCalc(true);
                     }}
                     className={`px-2.5 py-1.5 text-[10px] font-black rounded-lg border transition-all ${clearCode === '355S' && hardenerCode === '7205' ? 'bg-blue-600 text-white border-blue-700 shadow-sm' : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-100'}`}
                   >
                       크로맥스 (355S · 경화제 7205 = 3:1)
                   </button>
                   <button
                     type="button"
                     onClick={() => {
                       setClearCode('8055'); setHardenerCode('3225'); setThinnerCode('9034');
                       updateClearMix(3, 1, 5, clearWeight, true); setIsClearAutoCalc(true);
                     }}
                     className={`px-2.5 py-1.5 text-[10px] font-black rounded-lg border transition-all ${clearCode === '8055' && hardenerCode === '3225' ? 'bg-cyan-600 text-white border-cyan-700 shadow-sm' : 'bg-white text-cyan-700 border-cyan-200 hover:bg-cyan-100'}`}
                   >
                       헥커 (8055 · 3225 · 9034 = 3:1:5%)
                   </button>
                   <button
                     type="button"
                     onClick={() => {
                       setClearCode('8700'); setHardenerCode('3470'); setThinnerCode('9070');
                       updateClearMix(2, 1, 10, clearWeight, true); setIsClearAutoCalc(true);
                     }}
                     className={`px-2.5 py-1.5 text-[10px] font-black rounded-lg border transition-all ${clearCode === '8700' && hardenerCode === '3470' ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm' : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-100'}`}
                   >
                       헥커 (8700 · 3470 · 9070 = 2:1:10%)
                   </button>
               </div>
           </div>

           {/* 2. 타사 제품용 수동 비율 조작 (위아래 버튼 & 스크롤바) */}
           <div className="bg-white/90 rounded-lg p-2.5 border border-cyan-200/80 flex flex-col gap-2">
               <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black text-slate-700 flex items-center gap-1">
                       <Sliders size={11} className="text-cyan-600" />
                       타사/수동 비율 설정 ({rClear} : {rHard}{rThin > 0 ? ` : ${rThin}%` : ' (무희석)'})
                   </span>
               </div>
               <div className="grid grid-cols-3 gap-2">
                   {/* 주제 비율 */}
                   <div className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded border border-slate-200">
                       <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-slate-400">주제 비율</span>
                           <span className="text-sm font-black text-cyan-700">{rClear}</span>
                       </div>
                       <div className="flex flex-col gap-0.5">
                           <button type="button" onClick={() => updateClearMix(rClear + 1, rHard, rThin)} className="p-0.5 bg-white border border-slate-200 rounded hover:bg-cyan-50"><ChevronUp size={12} /></button>
                           <button type="button" onClick={() => updateClearMix(Math.max(1, rClear - 1), rHard, rThin)} className="p-0.5 bg-white border border-slate-200 rounded hover:bg-cyan-50"><ChevronDown size={12} /></button>
                       </div>
                   </div>
                   {/* 경화제 비율 */}
                   <div className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded border border-slate-200">
                       <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-slate-400">경화제 비율</span>
                           <span className="text-sm font-black text-slate-700">{rHard}</span>
                       </div>
                       <div className="flex flex-col gap-0.5">
                           <button type="button" onClick={() => updateClearMix(rClear, rHard + 1, rThin)} className="p-0.5 bg-white border border-slate-200 rounded hover:bg-cyan-50"><ChevronUp size={12} /></button>
                           <button type="button" onClick={() => updateClearMix(rClear, Math.max(1, rHard - 1), rThin)} className="p-0.5 bg-white border border-slate-200 rounded hover:bg-cyan-50"><ChevronDown size={12} /></button>
                       </div>
                   </div>
                   {/* 첨가제 비율 */}
                   <div className="flex items-center justify-between bg-slate-50 px-2 py-1 rounded border border-slate-200">
                       <div className="flex flex-col">
                           <span className="text-[9px] font-bold text-slate-400">첨가제(신너)</span>
                           <span className="text-sm font-black text-emerald-600">{rThin}%</span>
                       </div>
                       <div className="flex flex-col gap-0.5">
                           <button type="button" onClick={() => updateClearMix(rClear, rHard, Math.min(50, rThin + 1))} className="p-0.5 bg-white border border-slate-200 rounded hover:bg-cyan-50"><ChevronUp size={12} /></button>
                           <button type="button" onClick={() => updateClearMix(rClear, rHard, Math.max(0, rThin - 1))} className="p-0.5 bg-white border border-slate-200 rounded hover:bg-cyan-50"><ChevronDown size={12} /></button>
                       </div>
                   </div>
               </div>
               {/* 1~50% 신너 스크롤 바 */}
               <div className="pt-1 flex flex-col gap-1">
                   <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                       <span>첨가제(신너) 스크롤 바 (0% ~ 50%)</span>
                   </div>
                   <input type="range" min="0" max="50" step="1" value={rThin} onChange={e => updateClearMix(rClear, rHard, parseInt(e.target.value, 10) || 0)} className="w-full h-2 bg-slate-200 rounded-lg cursor-pointer accent-cyan-600" />
               </div>
           </div>
           
           {/* 3. 품번 및 무게 입력창 */}
           <div className="grid grid-cols-3 gap-2 items-center">
               <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-inner">
                   <div className="flex items-center justify-between gap-1 mb-1">
                       <span className="text-[9px] font-bold text-slate-400">주제</span>
                       <input type="text" value={clearCode} onChange={e => setClearCode(e.target.value.toUpperCase())} className="text-[10px] font-black text-cyan-700 bg-cyan-50 px-1 rounded w-12 text-center focus:outline-none" placeholder="품번" />
                   </div>
                   <div className="flex items-end gap-0.5 border-b border-slate-100 pb-0.5">
                       <input type="text" inputMode="decimal" pattern="[0-9]*" value={clearWeight} onChange={e => { const val = e.target.value.replace(/[^0-9.]/g, ''); setClearWeight(val); updateClearMix(rClear, rHard, rThin, val, isClearAutoCalc); }} className="w-full text-base sm:text-xl font-black text-slate-800 bg-transparent focus:outline-none" />
                       <span className="font-bold text-slate-400 text-[10px]">g</span>
                   </div>
               </div>
               <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-inner">
                   <div className="flex items-center justify-between gap-1 mb-1">
                       <span className="text-[9px] font-bold text-slate-400">경화제</span>
                       <input type="text" value={hardenerCode} onChange={e => setHardenerCode(e.target.value.toUpperCase())} className="text-[10px] font-black text-slate-600 bg-slate-100 px-1 rounded w-12 text-center focus:outline-none" placeholder="품번" />
                   </div>
                   <div className="flex items-end gap-0.5 border-b border-slate-100 pb-0.5">
                       <input type="text" inputMode="decimal" pattern="[0-9]*" value={hardenerWeight} onChange={e => setHardenerWeight(e.target.value.replace(/[^0-9.]/g, ''))} readOnly={isClearAutoCalc} className={`w-full text-base sm:text-xl font-black ${isClearAutoCalc ? 'text-slate-500' : 'text-slate-800'} bg-transparent focus:outline-none`} />
                       <span className="font-bold text-slate-400 text-[10px]">g</span>
                   </div>
               </div>
               <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-inner">
                   <div className="flex items-center justify-between gap-1 mb-1">
                       <span className="text-[9px] font-bold text-slate-400">신너</span>
                       <input type="text" value={thinnerCode} onChange={e => setThinnerCode(e.target.value.toUpperCase())} className="text-[10px] font-black text-slate-600 bg-slate-100 px-1 rounded w-12 text-center focus:outline-none" placeholder="품번" />
                   </div>
                   <div className="flex items-end gap-0.5 border-b border-slate-100 pb-0.5">
                       <input type="text" inputMode="decimal" pattern="[0-9]*" value={thinnerWeight} onChange={e => thinnerWeight && setThinnerWeight(e.target.value.replace(/[^0-9.]/g, ''))} readOnly={isClearAutoCalc} className={`w-full text-base sm:text-xl font-black ${isClearAutoCalc ? 'text-slate-500' : 'text-slate-800'} bg-transparent focus:outline-none`} />
                       <span className="font-bold text-slate-400 text-[10px]">g</span>
                   </div>
               </div>
           </div>

           {/* 4. 성분별 세부 무게 합계 */}
           <div className="bg-slate-900 px-3 py-2.5 rounded-lg flex flex-col gap-1 text-white mt-1">
               <div className="flex justify-between items-center text-[11px] text-slate-300 font-bold border-b border-slate-800 pb-1">
                   <span>성분별 내역 ({rClear}:{rHard}{rThin > 0 ? `:${rThin}%` : ''})</span>
                   <span className="text-cyan-300">주제 + 경화제 + 신너</span>
               </div>
               <div className="flex flex-wrap justify-between items-center pt-1 gap-1">
                   <span className="text-xs font-bold text-slate-300">
                       {clearWeight || '0'}g ({clearCode || '-'}) + {hardenerWeight || '0'}g ({hardenerCode || '-'}) + {thinnerWeight || '0'}g ({thinnerCode || '-'})
                   </span>
                   <span className="text-sm sm:text-base font-black text-emerald-400 ml-auto">
                       총합계: {((parseFloat(clearWeight) || 0) + (parseFloat(hardenerWeight) || 0) + (parseFloat(thinnerWeight) || 0)).toFixed(1)}g
                   </span>
               </div>
           </div>
       </div>
    </div>
  );
}
