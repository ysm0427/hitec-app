import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Trash2, Plus, X, FileSpreadsheet, Share2, Beaker, Sun, Droplet, ScanLine, Maximize, Zap, Search, History, Layers, BookOpen } from 'lucide-react';

interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

export const TONER_DB: Record<string, TonerData> = {
  'WT 144': { role: '블루 [WT 346 완체]', type: 'solid', face: '#1e3a8a', flop: '#0369a1', desc: '고농축 청색 조색제입니다.', details: [['일반 특성', '기존 WT 346 대체용입니다.']] },
  'WT 346': { role: '트랜스페어런트 딥 블루', type: 'solid', face: '#0369a1', flop: '#020617', desc: '녹색 기운을 띤 딥 블루입니다.', details: [['일반 특성', '기초 투명 청색입니다.']] },
  // ... (이전에 드린 2200줄 데이터 전부) ...
  'WT 3080': { role: '스페셜 애디티브', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '도막 보정 및 흐름 방지제.', details: [['일반 특성', '특수 첨가제입니다.']] }
};

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => {
  let labelCategory = "일반 특성"; let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
  const r = data.role || ''; const d = data.desc || ''; const t = data.type || '';
  if(r.includes("블루") || r.includes("레드") || r.includes("옐로우") || r.includes("그린")) { labelCategory = "색상/외관"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200"; }
  else if (d.includes("주의")) { labelCategory = "경고/주의사항"; badgeColor = "bg-red-50 text-red-600 border-red-200"; }
  return { code, ...data, labelCategory, badgeColor };
});
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트'); }

export const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
    if (!isMetallic || type === 'binder' || type === 'solid') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
    return { backgroundColor: faceColor, backgroundImage: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
};

export const getOptics = (tonersList: any[]) => {
  // ... (기존의 복잡한 색상 계산 로직을 그대로 복사) ...
  return { face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false };
};

export const packToners = (tonerList: any[]) => { return tonerList.filter((t: any) => t.code).map((t: any) => `${t.code.replace('WT ', '')}_${t.adjustedWeight}`).join('*'); };
export const unpackToners = (str: string) => { if (!str) return []; return str.split('*').map((t, i) => { const [c, w] = t.split('_'); return { id: `restored_${i}`, code: c ? `WT ${c}` : '', adjustedWeight: w || '', history: [], memo: '' }; }); };
export default function App() {
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: 'WT 318', adjustedWeight: "0.3", history: [], memo: "" }]);
  // ... (메인 화면 로직 및 return 문 전체) ...
  
  return (
    <div className="min-h-screen bg-slate-100">
      {/* ... 전체 UI ... */}
    </div>
  );
}
