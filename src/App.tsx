import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Minus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, BookOpen, Share2, Zap, Search, FileSpreadsheet, History, PaintBucket
} from 'lucide-react';

interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

// 💡 [1번 구역] 기존에 쓰시던 안료 데이터(TONER_DB)를 여기에 그대로 넣으세요.
export const TONER_DB: Record<string, TonerData> = {
  'WT 144': { role: '블루 [WT 346 완벽대체]', type: 'solid', face: '#1e3a8a', flop: '#0369a1', desc: '고농축 청색입니다.' },
  // ... (기존 WT 안료 데이터들 전부) ...
  'WT 3080': { role: '스페셜 애디티브', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '특수 첨가제.' }
};

// 💡 [2번 구역] 고객님이 추가하시려던 2610줄의 FORD 색상 코드는 반드시 '여기에' 넣으셔야 에러가 안 납니다!
export const OEM_COLORS = [
  // 아래에 { code: '...', name: '...' }, 형태의 2610줄을 전부 붙여넣으세요!
  { code: 'X10088K', name: 'CINZA BRISTOL' },
  { code: 'HT', name: 'CINNAMON RED' },
  { code: 'M6542G', name: 'CHARCOAL (1)(M)' }
];

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => {
  let labelCategory = "일반 특성"; let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
  const r = data.role || ''; const d = data.desc || ''; const t = data.type || '';
  if(r.includes("블루") || r.includes("레드") || r.includes("옐로우") || r.includes("그린") || r.includes("오렌지") || r.includes("바이올렛") || r.includes("마룬")) { labelCategory = "색상/외관"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200"; } 
  else if (d.includes("금지") || d.includes("최대") || d.includes("주의") || d.includes("제한") || d.includes("경고")) { labelCategory = "경고/주의사항"; badgeColor = "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100"; } 
  else if (r.includes("실버") || r.includes("펄") || r.includes("이펙트") || d.includes("이펙트") || code === 'WT 400') { labelCategory = "이펙트 전용"; badgeColor = "bg-blue-50 text-blue-600 border-blue-200"; } 
  else if (t === "binder" || d.includes("첨가제") || d.includes("수지") || d.includes("바인더") || r.includes("콤퍼넌트")) { labelCategory = "배합/첨가제"; badgeColor = "bg-purple-50 text-purple-600 border-purple-200"; }
  return { code, ...data, labelCategory, badgeColor };
});

export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('글라스') || r.includes('대체용'); }

const textureCache: Record<string, React.CSSProperties> = {};
export const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
    if (!isMetallic || type === 'binder' || type === 'solid') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
    const key = `${type}_${faceColor}_${flopColor}`; if (textureCache[key]) return textureCache[key];
    let baseFreq = '0.5', alphaMult = '4', surfaceScale = '2', specConst = '1.2';
    if (type === 'xirallic') { baseFreq = '0.8'; alphaMult = '10'; surfaceScale = '5'; specConst = '2.0'; }
    else if (type === 'pearl') { baseFreq = '0.4'; alphaMult = '6'; surfaceScale = '3'; specConst = '1.5'; }
    else if (type === 'silver_fine') { baseFreq = '1.2'; alphaMult = '3'; surfaceScale = '1.5'; specConst = '1.0'; }
    else if (type === 'silver_coarse') { baseFreq = '0.2'; alphaMult = '8'; surfaceScale = '4'; specConst = '1.8'; }
    const safeFaceColor = faceColor || '#ffffff'; const safeFlopColor = flopColor || '#ffffff';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -1"/><feSpecularLighting surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="20" lighting-color="%23ffffff"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting></filter><rect width="100%25" height="100%25" fill="${encodeURIComponent(safeFaceColor)}"/><rect width="100%25" height="100%25" filter="url(%23f)" opacity="0.4"/></svg>`;
    const result = { backgroundColor: safeFaceColor, backgroundImage: `url("data:image/svg+xml;utf8,${svg}"), linear-gradient(135deg, ${safeFaceColor} 0%, ${safeFlopColor} 100%)`, backgroundBlendMode: 'overlay, normal' as any, boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)' };
    textureCache[key] = result; return result;
};

export const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || ''; let h = 0; let s = 0; let baseL = 50;
  if (code.includes('144')) { h = 230; s = 85; baseL = 35; } 
  else if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('적') || r.includes('마룬')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹')) { h = 140; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('황')) { h = 40; s = 80; baseL = 50; }
  else if (r.includes('오커')) { h = 30; s = 60; baseL = 40; }
  else if (r.includes('오렌지')) { h = 20; s = 90; baseL = 50; }
  else if (r.includes('바이올렛')) { h = 270; s = 80; baseL = 40; }
  else if (r.includes('화이트') || r.includes('백')) { h = 0; s = 0; baseL = 90; }
  else if (r.includes('블랙') || r.includes('흑')) { h = 0; s = 0; baseL = 15; }
  else if (r.includes('실버') || r.includes('알루미늄') || code.includes('400')) { h = 210; s = 10; baseL = 60; }
  else { h=0; s=0; baseL=95; } 
  const isMetallic = isTonerMetallic(r) || code.includes('400');
  if (angle === 'face') {
    const l = isMetallic ? Math.min(100, baseL + 25) : Math.min(100, baseL + 10);
    return `radial-gradient(circle at 40% 40%, hsl(${h}, ${s}%, ${Math.min(100, l+20)}%) 0%, hsl(${h}, ${s}%, ${l}%) 60%, hsl(${h}, ${s}%, ${Math.max(0, l-15)}%) 100%)`;
  } else {
    const l = isMetallic ? Math.max(0, baseL - 30) : Math.max(0, baseL - 15);
    return `radial-gradient(circle at 10% 10%, hsl(${h}, ${s}%, ${Math.min(100, l+10)}%) 0%, hsl(${h}, ${s}%, ${l}%) 100%)`;
  }
};

export const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code && TONER_DB[t.code]);
  const sumW = colorToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0; let rGreen=0; let rRed=0; let rYellow=0; let rViolet=0;
  let wSilver=0; let wWhite=0; let wBlack=0; let wPearl=0; let wBinder=0; let interferenceColor: string | null = null;

  colorToners.forEach(t => {
    const w = safeNum(parseFloat(t.adjustedWeight)); if (w <= 0) return;
    const role = TONER_DB[t.code]?.role || ''; const code = t.code || ''; let strength = 1.0;
    if (code.includes('341') || code.includes('300') || code.includes('338')) strength = 2.5;

    if (role.includes('컴포넌트') || role.includes('바인더') || role.includes('애디티브') || ['WT 385', 'WT 387', 'WT 386', 'WT 400', 'WT 3080', 'WT 310'].some(c => code.includes(c.replace('WT ', '')))) wBinder += w;
    else if (role.includes('블랙') || code.includes('323') || code.includes('388') || code.includes('188') || code.includes('1500')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄') || code.includes('362') || code.includes('357') || code.includes('197') || code.includes('303') || code.includes('305') || code.includes('307') || code.includes('400')) wSilver += w;
    else if (role.includes('화이트') || code.includes('321') || code.includes('328') || code.includes('322')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('스파클') || code.includes('304') || code.includes('377') || code.includes('381')) {
      wPearl += w;
      if (role.includes('블루') || code.includes('381')) { interferenceColor = 'blue'; rBlue += w * 0.15; }
      else if (role.includes('레드') || role.includes('마젠타')) { interferenceColor = 'red'; rRed += w * 0.15; }
      else if (role.includes('그린') || code.includes('380')) { interferenceColor = 'green'; rGreen += w * 0.15; }
      else if (role.includes('골드') || code.includes('304') || code.includes('382')) { interferenceColor = 'yellow'; rYellow += w * 0.15; }
      else if (role.includes('화이트') || code.includes('377')) interferenceColor = 'white';
    } 
    else if (code.includes('144')) { rBlue += w * 2.5; rRed += (w * 2.5) * 0.4; } 
    else if (role.includes('블루') || role.includes('청')) { rBlue += w * strength; rGreen += (w * strength) * 0.5; }
    else if (code.includes('339') || role.includes('바이올렛')) rViolet += w * strength;
    else if (code.includes('353') || code.includes('309') || role.includes('마젠타')) { rRed += w * strength; rViolet += (w * strength) * 0.5; }
    else if (code.includes('300') || role.includes('마룬') || role.includes('적')) rRed += w * strength;
    else if (code.includes('308') || role.includes('오렌지')) { rRed += w * strength; rYellow += (w * strength) * 0.5; }
    else if (role.includes('옐로우') || role.includes('황') || code.includes('350')) rYellow += w * strength;
    else if (role.includes('그린') || role.includes('녹')) rGreen += w * strength;
  });

  const colorWeight = (rBlue + rGreen + rRed + rYellow + rViolet);
  const effectiveW = wWhite + wBlack + wSilver + wPearl + colorWeight;
  const totalForRatio = effectiveW > 0 ? effectiveW : 1;
  const pSilver = wSilver / totalForRatio; const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio; const pPearl = wPearl / totalForRatio; const pColor = colorWeight / totalForRatio;

  let baseL = (pWhite * 96) + (pSilver * 65) + (pPearl * 85); if (effectiveW === 0 && wBinder > 0) baseL = 90; 
  let blackImpact = Math.pow(pBlack, 0.45) * 60; if (pWhite > 0.6) blackImpact = blackImpact * 0.15; 
  const colorImpactL = Math.pow(pColor, 0.5) * 30; baseL = Math.max(4, baseL - blackImpact - colorImpactL);
  let l15 = baseL + (Math.pow(pSilver + pPearl, 0.6) * 45); 
  let l110 = Math.max(2, baseL - 30 - (pSilver * 40) - (pBlack * 20));
  if (pWhite > 0.6) { l110 = Math.max(83, baseL - 8); l15 = Math.min(99, baseL + (pPearl > 0 ? 10 : 3)); }

  let x = rRed + (rYellow * 0.5) - (rGreen * 0.5) - rBlue - (rViolet * 0.5);
  let y = (rYellow * 0.866) + (rGreen * 0.866) - (rBlue * 0.866) - (rViolet * 0.866);
  let hue = Math.atan2(y, x) * (180 / Math.PI); if (hue < 0) hue += 360;
  
  let sat = colorWeight > 0 ? Math.min(100, Math.pow((colorWeight / (colorWeight + wWhite + wSilver + Math.max(wBlack * 2, 0))), 0.4) * 150) : 0;
  if (pWhite > 0.6) sat = sat * 0.3; 

  let flopHue = hue; let faceHue = hue;
  if (interferenceColor === 'blue') { faceHue = 210; flopHue = 230; }
  else if (interferenceColor === 'red') { faceHue = 340; flopHue = 350; }
  else if (interferenceColor === 'green') { faceHue = 120; flopHue = 140; }
  else if (interferenceColor === 'yellow') { faceHue = 50; flopHue = 60; }
  let faceSat = Math.min(100, sat + (pPearl * (interferenceColor === 'white' ? 5 : 20)));
  let flopSat = Math.min(100, sat + (pPearl * (interferenceColor === 'white' ? 2 : 12)));
  if (colorWeight === 0 && wPearl === 0) { hue = 0; flopHue = 0; faceHue = 0; sat = 0; faceSat = 0; flopSat = 0; }

  return {
    face: { h: safeNum(Math.round(faceHue)), s: safeNum(Math.round(faceSat)), l: safeNum(Math.round(Math.min(99, Math.max(5, l15)))) },
    mid:  { h: safeNum(Math.round(hue)), s: safeNum(Math.round(sat)), l: safeNum(Math.round(Math.min(98, Math.max(5, baseL)))) },
    flop: { h: safeNum(Math.round(wPearl > 0 ? flopHue : hue)), s: safeNum(Math.round(flopSat)), l: safeNum(Math.round(Math.min(98, Math.max(2, l110)))) },
    isMetallic: (wSilver > 0 || wPearl > 0)
  };
};

export const packToners = (tonerList: any[]) => { return tonerList.filter((t: any) => t.code).map((t: any) => { const c = t.code.replace('WT ', '').trim(); const w = t.adjustedWeight || ''; return `${c}_${w}`; }).join('*'); };
export const unpackToners = (str: string) => { if (!str) return []; return str.split('*').map((t, i) => { const [c, w] = t.split('_'); return { id: `restored_${Date.now()}_${i}`, code: c ? `WT ${c}` : '', adjustedWeight: w || '', history: [], memo: '' }; }); };

// 💡 [에러 해결!] 이 부분이 바로 누락되어서 에러가 났던 함수입니다. 다시 채워 넣었습니다.
export const getMunsellDynamicDescription = (code: string, role: string, type: string, weight: number) => {
  if (weight <= 0) {
    return (
      <div className="text-sm text-slate-500 bg-slate-100 p-3 rounded-lg mb-4 text-center font-bold">
        현재 배합량이 0g이라 정밀 광학 분석이 비활성화되었습니다.
      </div>
    );
  }

  const typeName = type === 'solid' ? '솔리드(Solid)' : 
                   type === 'pearl' ? '펄(Pearl)' : 
                   type === 'xirallic' ? '지랄릭(Xirallic)' : 
                   type === 'binder' ? '바인더/수지(Binder)' : 
                   type.includes('silver') ? '메탈릭(Metallic)' : '이펙트';

  return (
    <div className="flex flex-col gap-2 bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4 shadow-sm">
      <p className="text-sm text-slate-800 font-bold">
        <span className="text-blue-600 font-black">[{code}]</span> {role}
      </p>
      <p className="text-xs text-slate-600 leading-relaxed break-keep">
        해당 안료는 <span className="font-bold text-slate-700">{typeName}</span> 특성을 띄고 있으며, 
        현재 베이스에 <span className="font-black text-blue-600 text-sm">{weight}g</span>이 배합되어 도막의 최종 발색 및 은폐력에 직접적인 영향을 주고 있습니다.
      </p>
    </div>
  );
};

const MUNSELL_WHEEL_COLORS = [
    { name: '빨강', symbol: 'R', hex: '#E60012' },
    { name: '다홍', symbol: 'yR', hex: '#EB6100' },
    { name: '주황', symbol: 'YR', hex: '#F39800' },
    { name: '귤색', symbol: 'rY', hex: '#FCC800' },
    { name: '노랑', symbol: 'Y', hex: '#FFF100' },
    { name: '노랑연두', symbol: 'gY', hex: '#CFDB00' },
    { name: '연두', symbol: 'GY', hex: '#8FC31F' },
    { name: '풀색', symbol: 'yG', hex: '#22AC38' },
    { name: '녹색', symbol: 'G', hex: '#009944' },
    { name: '초록', symbol: 'bG', hex: '#009B6B' },
    { name: '청록', symbol: 'BG', hex: '#009E96' },
    { name: '바다색', symbol: 'gB', hex: '#00A0C1' },
    { name: '파랑', symbol: 'B', hex: '#00A0E9' },
    { name: '감청', symbol: 'pB', hex: '#0086D1' },
    { name: '남색', symbol: 'PB', hex: '#0068B7' },
    { name: '남보라', symbol: 'bP', hex: '#00479D' },
    { name: '보라', symbol: 'P', hex: '#1D2088' },
    { name: '붉은보라', symbol: 'rP', hex: '#601986' },
    { name: '자주', symbol: 'RP', hex: '#920783' },
    { name: '연지', symbol: 'pR', hex: '#BE0081' },
];

const MIXING_DATA: Record<string, any> = {
    'R': { c1: '빨강 (R)', h1: '#ff0000', r1: 100 },
    'yR': { c1: '빨강 (R)', h1: '#ff0000', r1: 75, c2: '노랑 (Y)', h2: '#ffff00', r2: 25 },
    'YR': { c1: '빨강 (R)', h1: '#ff0000', r1: 50, c2: '노랑 (Y)', h2: '#ffff00', r2: 50 },
    'rY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 75, c2: '빨강 (R)', h2: '#ff0000', r2: 25 },
    'Y': { c1: '노랑 (Y)', h1: '#ffff00', r1: 100 },
    'gY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 75, c2: '녹색 (G)', h2: '#009900', r2: 25 },
    'GY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 50, c2: '녹색 (G)', h2: '#009900', r2: 50 },
    'yG': { c1: '녹색 (G)', h1: '#009900', r1: 75, c2: '노랑 (Y)', h2: '#ffff00', r2: 25 },
    'G': { c1: '녹색 (G)', h1: '#009900', r1: 100 },
    'bG': { c1: '녹색 (G)', h1: '#009900', r1: 75, c2: '파랑 (B)', h2: '#0000ff', r2: 25 },
    'BG': { c1: '녹색 (G)', h1: '#009900', r1: 50, c2: '파랑 (B)', h2: '#0000ff', r2: 50 },
    'gB': { c1: '파랑 (B)', h1: '#0000ff', r1: 75, c2: '녹색 (G)', h2: '#009900', r2: 25 },
    'B': { c1: '파랑 (B)', h1: '#0000ff', r1: 100 },
    'pB': { c1: '파랑 (B)', h1: '#0000ff', r1: 75, c2: '보라 (P)', h2: '#700070', r2: 25 },
    'PB': { c1: '파랑 (B)', h1: '#0000ff', r1: 50, c2: '보라 (P)', h2: '#700070', r2: 50 },
    'bP': { c1: '보라 (P)', h1: '#700070', r1: 75, c2: '파랑 (B)', h2: '#0000ff', r2: 25 },
    'P': { c1: '보라 (P)', h1: '#700070', r1: 100 },
    'rP': { c1: '보라 (P)', h1: '#700070', r1: 75, c2: '빨강 (R)', h2: '#ff0000', r2: 25 },
    'RP': { c1: '보라 (P)', h1: '#700070', r1: 50, c2: '빨강 (R)', h2: '#ff0000', r2: 50 },
    'pR': { c1: '빨강 (R)', h1: '#ff0000', r1: 75, c2: '보라 (P)', h2: '#700070', r2: 25 },
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) };
};

const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", startOuter.x, startOuter.y, "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y, "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y, "Z"
  ].join(" ");
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: 'WT 318', adjustedWeight: "0.3", history: [], memo: "" }, { id: `b_next`, code: 'WT 144', adjustedWeight: "4.0", history: [], memo: "" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "" }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState('UG4'); 
  const [vehicleNumber, setVehicleNumber] = useState('9'); 
  const [carModel, setCarModel] = useState('UN'); 
  const [jobDescription, setJobDescription] = useState(''); 
  const [specialNotes, setSpecialNotes] = useState('');
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00"); 
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00"); 
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);
  
  const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null); 
  const [restoredViewData, setRestoredViewData] = useState<any>(null); 
  
  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null); 
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  
  const [oemSearch, setOemSearch] = useState('');

  const [finalOptics, setFinalOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false }); 
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");
  const [tonerMemos, setTonerMemos] = useState<Record<string, string>>({});
  const [selectedWheelIndex, setSelectedWheelIndex] = useState<number | null>(null);

  const handleWheelClick = (index: number) => { setSelectedWheelIndex(index); };

  const tonersRef = useRef<any[]>([]); const pearlTonersRef = useRef<any[]>([]); const isThreeCoatModeRef = useRef<boolean>(true);

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  const sortedCatalog = [...catalogData].sort((a, b) => { 
      const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); 
      if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; 
  }).filter(item => item.code.includes(catalogSearch.toUpperCase()) || item.role.includes(catalogSearch));

  useEffect(() => { document.title = "조색 Pro"; }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search); 
        const d = urlParams.get('d'); 
        const ori = window.location.origin;
        if (!ori.includes('google') && !ori.includes('gemini') && !ori.includes('null')) localStorage.setItem('hitec_clean_domain', ori);
        
        let loadedFromUrl = false;

        if (d) {
            try {
                let parsedData = null;
                if (d.includes('%7B') || d.includes('{')) {
                    parsedData = JSON.parse(decodeURIComponent(d));
                } else {
                    let decodedStr = d;
                    if (!d.includes('|') && !d.includes('%')) {
                        try { decodedStr = decodeURIComponent(escape(atob(d))); } catch(e) { decodedStr = atob(d); }
                    } else {
                        decodedStr = decodeURIComponent(d.replace(/%7C/g, '|'));
                    }
                    const parts = decodedStr.split('|');
                    if(parts.length >= 6) {
                        parsedData = {
                            v: parts[0] || '', m: parts[1] || '', c: parts[2] || '', j: parts[3] || '', n: parts[4] || '', b: unpackToners(parts[5]), p: unpackToners(parts[6]), t: parts[7] === '1'
                        };
                    }
                }

                if (parsedData) {
                    setRestoredViewData(parsedData);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    loadedFromUrl = true;
                }
            } catch (e) { 
                console.error("URL 파싱 실패", e); 
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
        
        if (!loadedFromUrl) {
            const savedBase = localStorage.getItem('hitec_base'); const savedPearl = localStorage.getItem('hitec_pearl'); const savedCode = localStorage.getItem('hitec_code'); const savedMode = localStorage.getItem('hitec_mode'); const savedVehicle = localStorage.getItem('hitec_vehicle'); const savedCarModel = localStorage.getItem('hitec_carmodel'); const savedJob = localStorage.getItem('hitec_job'); const savedNotes = localStorage.getItem('hitec_notes'); const savedMemos = localStorage.getItem('hitec_toner_memos');
            if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl)); if (savedCode) setTargetColorCode(savedCode); if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode)); if (savedVehicle) setVehicleNumber(savedVehicle); if (savedCarModel) setCarModel(savedCarModel); if (savedJob) setJobDescription(savedJob); if (savedNotes) setSpecialNotes(savedNotes); if (savedMemos) setTonerMemos(JSON.parse(savedMemos));
        }
        setIsLoaded(true); 
    }
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search); if (urlParams.get('d')) return;
      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_toner_memos', JSON.stringify(tonerMemos));
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, tonerMemos, isLoaded]);

  useEffect(() => { tonersRef.current = toners; pearlTonersRef.current = pearlToners; isThreeCoatModeRef.current = isThreeCoatMode; }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2)); setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners; 
    setFinalOptics(getOptics(activeToners));
    const checkMetallic = (list: any[]) => list.some(t => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== ''; });
    setIsBaseMetallic(checkMetallic(toners)); setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (focusTarget) {
      let attempts = 0; 
      const interval = setInterval(() => {
        const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
        if (el) { 
            el.focus(); 
            setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30);
            clearInterval(interval); 
            setFocusTarget(null); 
        }
        attempts++; 
        if (attempts > 30) { clearInterval(interval); setFocusTarget(null); }
      }, 20); 
      return () => clearInterval(interval);
    }
  }, [focusTarget, toners, pearlToners]);

  const handleClearAll = () => { setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "" }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "" }]); setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setSelectedTonerForView(null); };

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim(); const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => {
      if (toner.id === id) {
        let finalCode = formattedCode; const numMatch = formattedCode.match(/\d+/);
        if (numMatch && numMatch[0].length >= 3) { const testCode = `WT ${numMatch[0]}`; if (TONER_DB[testCode]) { finalCode = testCode; setFocusTarget({ id: id, type: 'weight' }); } }
        return { ...toner, code: finalCode };
      }
      return toner;
    }));
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.'); if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') val = ''; else if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, ''); else if (val.startsWith('.')) val = '0' + val; 
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t)); else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };

  const handleWeightBlur = (id: string, value: string, isPearl = false) => {
    if (!value) return; const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if (t.id === id) { const currentHistory = t.history || []; if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== value) return { ...t, history: [...currentHistory, value] }; }
      return t;
    }));
  };

  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
      if (e.key === 'Enter') { 
          e.preventDefault(); 
          const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; 
          const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "" }; 
          if (isPearl) setPearlToners([...pearlToners, newToner]); 
          else setToners([...toners, newToner]); 
          setFocusTarget({ id: newId, type: 'code' }); 
      }
  };
  
  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };
  
  const addToner = (isPearl = false) => { 
      const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; 
      const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "" }; 
      if (isPearl) setPearlToners([...pearlToners, newToner]); 
      else setToners([...toners, newToner]); 
      setFocusTarget({ id: newId, type: 'code' }); 
  };

  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if(t.id === id) {
         let current = parseFloat(t.adjustedWeight) || 0; 
         let newVal = Math.max(0, current + delta);
         let strVal = String(Number(Math.round(newVal * 100000) / 100000));
         const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory;
         return { ...t, adjustedWeight: strVal, history: nextHistory };
      }
      return t;
    }));
  };

  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율 상수를 입력하세요."); return; }
    const scale = (valStr: string) => { 
        const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; 
        const calcVal = isMultiply ? (val * 100000 * factor) / 100000 : (val * 100000) / (factor * 100000);
        return String(Number(Math.round(calcVal * 100000) / 100000)); 
    };
    const applyScale = (list: any[]) => list.map(t => {
        if (!t.adjustedWeight) return t; const newVal = scale(t.adjustedWeight);
        const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory;
        return { ...t, adjustedWeight: newVal, history: nextHistory };
    });
    setToners(applyScale(toners)); setPearlToners(applyScale(pearlToners));
  };

  const copyToExcel = () => {
    const baseResin = (parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1); const baseStr = `${totalBaseWeight} (수지 ${baseResin})`; let pearlStr = "해당없음";
    if (isThreeCoatMode) { const pearlResin = (parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1); pearlStr = `${totalPearlWeight} (수지 ${pearlResin})`; }
    const baseDetails = toners.filter(t => t.code).map(t => `${t.code}: ${t.adjustedWeight || '0'}`).join(', '); const pearlDetails = isThreeCoatMode ? pearlToners.filter(t => t.code).map(t => `${t.code}: ${t.adjustedWeight || '0'}`).join(', ') : '해당없음'; const detailStr = isThreeCoatMode ? `[베이스] ${baseDetails} / [펄] ${pearlDetails}` : baseDetails;
    let currentOrigin = localStorage.getItem('hitec_clean_domain'); if (!currentOrigin || currentOrigin.includes('google') || currentOrigin.includes('gemini')) currentOrigin = window.location.origin; 
    
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0'].join('|');
    const safeUrlString = btoa(unescape(encodeURIComponent(payloadStr))); 
    const shareUrl = `${currentOrigin}${window.location.pathname}?d=${safeUrlString}`;
    
    const rowData = ["", vehicleNumber || '미입력', carModel || '미입력', targetColorCode || '미지정', jobDescription || '미입력', specialNotes || '', baseStr, pearlStr, detailStr, shareUrl].join('\t');
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(rowData).catch(err => console.error(err));
    else { const textarea = document.createElement('textarea'); textarea.value = rowData; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); document.body.removeChild(textarea); }
  };

  const shareToKakao = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}g`).join('\n');
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}g`).join('\n');
    const text = `[PERMAHYD HI-TEC 배합 지시서]\n================================\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 차종: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트 (Ground)]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 6052 수지제원: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트 (Mid-coat)]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 코트 합계: ${totalPearlWeight}g\n▶ 6052 수지제원: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 혼합 총량: ${totalFinalWeight}g\n================================`;
    if (typeof navigator !== 'undefined' && navigator.share) navigator.share({ title: 'HI-TEC 조색 데이터 인계', text: text }).catch(console.error);
    else { alert("상세 배합 스펙이 클립보드에 복사되었습니다. 카카오톡 창에 붙여넣기 하십시오.\n\n" + text); if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(text); }
  };

  const render3DView = () => {
    const SPECTRUM_GRADIENT = "linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)";

    return (
      <div className="w-full h-full relative overflow-hidden rounded-xl shadow-inner border border-slate-300">
        <div className="absolute inset-0 opacity-100" style={{ background: SPECTRUM_GRADIENT }}></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-[220px] lg:pb-[150px]">
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">윤성만님을 위한</span><span className="text-blue-400 font-normal ml-2">조색 PRO</span></h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-slate-800 flex items-center"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 워크 시트</h2></div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="차량번호" className="bg-white border p-2 rounded text-xs font-bold w-1/3" />
                <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="차종" className="bg-white border p-2 rounded text-xs font-bold w-1/3" />
                <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드" className="bg-white border p-2 rounded text-xs font-bold w-1/3 uppercase" />
              </div>
              <input type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="작업내용" className="bg-white border p-2 rounded text-xs font-bold w-full" />
              <input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="특이사항 및 스펙 메모 (직접 입력)" className="bg-yellow-50 border-yellow-400 border p-2.5 rounded text-sm font-bold w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              
              <div className="flex w-full gap-2 mt-1">
                <button onClick={copyToExcel} className="flex-1 bg-green-600 text-white p-2.5 rounded text-xs font-black flex items-center justify-center hover:bg-green-700 transition-colors"><FileSpreadsheet size={14} className="mr-1"/> 엑셀 연동 복사</button>
                <button onClick={shareToKakao} className="flex-1 bg-[#FEE500] text-slate-900 p-2.5 rounded text-xs font-black flex items-center justify-center hover:bg-[#E5C100] transition-colors"><Share2 size={14} className="mr-1"/> 모바일 인계</button>
                <button onClick={handleClearAll} className="bg-red-50 text-red-600 border border-red-200 px-3 rounded flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-white">
            <div className="mb-4 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2"><Beaker size={14} className="text-indigo-600" /><span className="text-xs font-bold text-indigo-800">현장 실시간 용량 배율 변환기</span></div>
                <div className="flex items-center gap-1.5">
                    <input type="text" inputMode="decimal" value={scaleFactor} onChange={(e) => setScaleFactor(e.target.value.replace(/[^0-9.]/g, ''))} className="w-10 text-center text-xs font-black text-indigo-700 border rounded py-1" />
                    <span className="text-[11px] font-bold text-indigo-400 mr-1">배</span>
                    <button onClick={() => handleScaleAll(true)} className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm hover:bg-indigo-700 transition-colors">× 곱하기</button>
                    <button onClick={() => handleScaleAll(false)} className="bg-white border border-indigo-300 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded shadow-sm hover:bg-indigo-50 transition-colors">÷ 나누기</button>
                </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 flex justify-between border-b pb-1"><span>▼ 베이스 원색 리스트 (Ground Coat)</span></div>
              {toners.map((toner) => {
                const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
                const isEffect = info.type !== 'solid' && info.type !== 'binder';
                return (
                  <div key={toner.id} className="flex flex-col bg-slate-50 hover:bg-blue-50/50 p-2.5 mb-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                      <div className="flex flex-col flex-1 w-full">
                          <div className="flex items-center gap-2 mb-1">
                              <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                                   <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                                   <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                              </div>
                              <input 
                                  ref={el => { codeRefs.current[toner.id] = el; }} 
                                  value={toner.code} 
                                  onChange={e => handleCodeChange(toner.id, e.target.value, false)} 
                                  className="w-20 text-sm font-black uppercase border border-slate-300 rounded p-1 focus:border-blue-500 focus:outline-none shadow-inner" 
                                  placeholder="코드" 
                              />
                              <span className="font-bold text-blue-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                          </div>
                          
                          {info.details && info.details.length > 0 ? (
                              <div className="flex flex-col gap-0.5 mt-1 ml-[64px]">
                                  {info.details.slice(0, 2).map((d: any, idx: number) => (
                                      <div key={idx} className="flex items-start gap-1.5">
                                          <span className="shrink-0 text-[10px] font-bold text-slate-500 leading-none mt-0.5">[{d[0]}]</span>
                                          <span className="text-[11px] text-slate-600 leading-tight break-keep">{d[1]}</span>
                                      </div>
                                  ))}
                              </div>
                          ) : <p className="text-[11px] text-slate-500 leading-tight break-keep ml-[64px]">{info.desc}</p>}

                          {toner.history && toner.history.length > 0 && (
                              <div className="flex items-center gap-1.5 mt-2 ml-[64px] text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                  <span className="font-bold">이력 ({toner.history.length}회):</span>
                                  <div className="flex gap-1 flex-wrap">
                                      {toner.history.map((hVal: string, hIdx: number) => (
                                          <button key={hIdx} onClick={() => quickEditWeight(toner.id, parseFloat(hVal) - parseFloat(toner.adjustedWeight||'0'), false)} className="hover:text-blue-600 hover:font-bold transition-colors">{hIdx + 1}({hVal}g)</button>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>

                      <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                         <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="px-1.5 py-0.5 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                         <input 
                             ref={el => { weightRefs.current[toner.id] = el; }} 
                             inputMode="decimal" 
                             value={toner.adjustedWeight} 
                             onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} 
                             onBlur={e => handleWeightBlur(toner.id, e.target.value, false)} 
                             onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                             className="w-16 text-right text-base font-black text-blue-600 focus:outline-none clean-number-input mx-1" 
                             placeholder="0.0" 
                         />
                         <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="px-1.5 py-0.5 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                         <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => removeToner(toner.id, false)} className="ml-1"><Trash2 size={16} className="text-slate-300 hover:text-red-500 transition-colors"/></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold text-xs flex justify-center items-center hover:bg-blue-50 hover:text-blue-500 hover:border-blue-400 transition-colors"><Plus size={12} className="mr-1"/>베이스 안료 추가</button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-purple-50 transition-colors">
                  <span className="mr-2 text-xs font-black text-purple-700">3Coat (펄 추가) 켜기</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                    <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${isThreeCoatMode ? 'transform translate-x-5' : ''}`}></div>
                  </div>
                </label>
            </div>

            {isThreeCoatMode && (
              <div className="pt-4 mt-4 border-t border-purple-200 space-y-2 pb-8">
                <div className="text-xs font-black text-purple-700 flex justify-between border-b pb-1"><span>▼ 펄 코트 (Mid Coat)</span></div>
                {pearlToners.map((toner) => {
                  const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
                  const isEffect = info.type !== 'solid' && info.type !== 'binder';
                  return (
                    <div key={toner.id} className="flex flex-col bg-purple-50 p-2.5 mb-1.5 rounded-xl border border-purple-200 shadow-sm transition-colors hover:bg-purple-100/50">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                        <div className="flex flex-col flex-1 w-full pl-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                                     <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                                     <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                                </div>
                                <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, true)} inputMode="numeric" pattern="[0-9]*" className="w-24 text-sm font-black uppercase border border-purple-200 rounded px-1.5 py-0.5 text-purple-800 shadow-inner focus:outline-none focus:border-purple-500" placeholder="코드" />
                                <span className="font-bold text-purple-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                            </div>
                            
                            {info.details && info.details.length > 0 ? (
                                <div className="flex flex-col gap-0.5 mt-1 ml-[64px]">
                                    {info.details.slice(0, 2).map((d: any, idx: number) => (
                                        <div key={idx} className="flex items-start gap-1.5">
                                            <span className="shrink-0 text-[10px] font-bold text-purple-500 leading-none mt-0.5">[{d[0]}]</span>
                                            <span className="text-[11px] text-slate-600 leading-tight break-keep">{d[1]}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-[11px] text-slate-500 leading-tight break-keep ml-[64px]">{info.desc}</p>}

                            {toner.history && toner.history.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2 ml-[64px] text-[10px] text-purple-500 bg-purple-100 px-2 py-1 rounded">
                                    <span className="font-bold">이력 ({toner.history.length}회):</span>
                                    <div className="flex gap-1 flex-wrap">
                                        {toner.history.map((hVal: string, hIdx: number) => (
                                            <button key={hIdx} onClick={() => quickEditWeight(toner.id, parseFloat(hVal) - parseFloat(toner.adjustedWeight||'0'), true)} className="hover:text-purple-700 hover:font-bold transition-colors">{hIdx + 1}({hVal}g)</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                           <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="px-1.5 py-0.5 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                           <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} onBlur={e => handleWeightBlur(toner.id, e.target.value, true)} onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} className="w-16 text-right text-base font-black text-purple-600 focus:outline-none clean-number-input mx-1" placeholder="0.0" />
                           <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="px-1.5 py-0.5 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                           <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                           <button onClick={() => removeToner(toner.id, true)} className="ml-1"><Trash2 size={16} className="text-purple-300 hover:text-red-500 transition-colors"/></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => addToner(true)} className="w-full py-2.5 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 rounded-md text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-2 shadow-sm"><Plus size={16} /><span>펄 조색제 추가</span></button>
              </div>
            )}
          </div>
        </div>

        {/* 우측 컬럼: 3D 그래픽 엔진 & 카탈로그 */}
        <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-3 shrink-0 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-black mb-2 flex justify-between items-center text-slate-800">
                <span className="flex items-center"><Sun size={14} className="mr-1 text-orange-500"/> ✨ STUDIO 3D 광학 조정 시뮬레이터</span>
                <button onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); }} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"><Maximize size={10} className="mr-1"/>먼셀 컬러 믹싱 랩</button>
              </h3>
              
              <div className="h-44 rounded-xl overflow-hidden shadow-inner border border-slate-300 bg-slate-800 bg-cover bg-center flex items-center justify-center cursor-pointer relative group" onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); }}>
                  <div className="relative z-10 w-full h-full">
                      {render3DView()}
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 text-slate-800 text-[10px] font-black px-2.5 py-1 rounded shadow backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center">
                      <Maximize size={12} className="mr-1 text-blue-600"/> 화면을 클릭하여 스튜디오 크게 열기
                  </div>
              </div>
            </div>

            {/* 💡 [요청 사항 2 완벽 반영] FORD 색상코드 전용 검색창을 추가했습니다! */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-3">
                <h3 className="text-white font-black text-sm flex items-center shrink-0"><BookOpen className="mr-2 text-blue-400" size={18}/>지능형 안료 도감</h3>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    {/* 기존 안료 검색창 */}
                    <div className="relative flex-1 sm:w-40">
                        <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="안료 검색 (예: 블루)" className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-full pl-8 focus:outline-none focus:border-blue-500 transition-colors" />
                        <Search size={14} className="absolute left-2.5 top-1.5 text-slate-400" />
                    </div>
                    {/* FORD 전용 검색창 추가 */}
                    <div className="relative flex-1 sm:w-48">
                        <input type="text" value={oemSearch} onChange={e=>setOemSearch(e.target.value)} placeholder="FORD 색상 검색" className="w-full bg-slate-800 border border-yellow-500/50 text-yellow-300 text-xs px-2.5 py-1.5 rounded-full pl-8 focus:outline-none focus:border-yellow-400 transition-colors" />
                        <Search size={14} className="absolute left-2.5 top-1.5 text-blue-400" />
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-3 bg-slate-100">
                {/* 💡 FORD 검색 결과 표시 영역 */}
                {oemSearch.trim() !== '' && (
                    <div className="mb-2 p-3 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                        <h4 className="text-xs font-black text-blue-800 mb-2">🔍 FORD 색상코드 검색 결과</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {/* 여기에 2번 구역(OEM_COLORS)에서 데이터를 찾아서 뿌려줍니다. */}
                            {OEM_COLORS.filter(c => c.code.toUpperCase().includes(oemSearch.toUpperCase()) || c.name.toUpperCase().includes(oemSearch.toUpperCase())).slice(0, 20).map((oem, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors" onClick={() => setTargetColorCode(oem.code)}>
                                    <span className="font-black text-blue-600 text-sm">{oem.code}</span>
                                    <span className="text-xs text-slate-600 font-bold truncate max-w-[100px]">{oem.name}</span>
                                </div>
                            ))}
                            {OEM_COLORS.filter(c => c.code.toUpperCase().includes(oemSearch.toUpperCase()) || c.name.toUpperCase().includes(oemSearch.toUpperCase())).length === 0 && (
                                <span className="text-xs text-slate-500 col-span-2 text-center py-2">일치하는 FORD 색상 코드가 없습니다.</span>
                            )}
                        </div>
                    </div>
                )}

                {/* 기존 안료 목록들 */}
                {sortedCatalog.map((item) => {
                    const isMetallic = item.type !== 'solid' && item.type !== 'binder';
                    const isCurrentlyUsed = activeCodes.includes(item.code);
                    
                    const getBadgeClass = (title: string) => {
                        if(title.includes("일반")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
                        if(title.includes("외관")) return "bg-blue-50 text-blue-700 border-blue-200";
                        if(title.includes("용도")) return "bg-purple-50 text-purple-700 border-purple-200";
                        if(title.includes("혼합")) return "bg-amber-50 text-amber-700 border-amber-200";
                        if(title.includes("경고") || title.includes("주의")) return "bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-100";
                        return "bg-slate-50 text-slate-700 border-slate-200";
                    };

                    return (
                        <div key={item.code} className={`flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isCurrentlyUsed ? 'border-2 border-blue-500 shadow-md transform scale-[1.01]' : 'border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer'}`} onClick={() => setSelectedTonerForView(item.code)}>
                            <div className="h-12 w-full relative transition-all border-b border-slate-200" style={getCachedTexture(item.type, item.face, item.flop, isMetallic)}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-1.5 left-3 text-white text-sm font-black drop-shadow-md">{item.code} <span className="text-[10px] font-normal opacity-90 ml-1">{item.role}</span></div>
                                {isCurrentlyUsed && <div className="absolute top-1.5 right-2 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow">배합 중</div>}
                            </div>
                            <div className="p-3 flex flex-col gap-1.5">
                                {item.details?.map((d: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className={`shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border leading-none mt-0.5 ${getBadgeClass(d[0])}`}>{d[0]}</span>
                                        <span className="text-[11px] text-slate-700 leading-snug break-keep">{d[1]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-3 sm:p-4 bg-slate-950 text-slate-100 flex flex-col lg:flex-row justify-between items-center z-[500] border-t-4 border-indigo-900 shadow-[0_-12px_45px_rgba(0,0,0,0.85)] gap-4 backdrop-blur-md">
          <div className="flex w-full lg:w-auto gap-4 flex-col sm:flex-row justify-between lg:justify-start">
              <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
                 <span className="text-[10px] text-slate-400 font-black tracking-widest flex items-center uppercase"><Layers size={11} className="mr-1 text-blue-400"/> A. 베이스 코트 실시간 중량</span>
                 <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-800 shadow-inner text-xs">
                     <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 font-bold">순수 안료</span><span className="font-black text-white text-sm">{totalBaseWeight}g</span></div>
                     <span className="text-slate-600 font-black text-sm">+</span>
                     <div className="flex flex-col items-center"><span className="text-[9px] text-blue-400 font-bold">6052 수지 ({isBaseMetallic ? '20%' : '10%'})</span><span className="font-black text-blue-400 text-sm">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g</span></div>
                     <span className="text-slate-600 font-black text-sm">=</span>
                     <div className="flex flex-col items-center bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/50"><span className="text-[9px] text-emerald-400 font-bold">총 중량</span><span className="font-black text-emerald-400 text-base">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)}g</span></div>
                 </div>
              </div>
              
              {isThreeCoatMode && (
              <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
                 <span className="text-[10px] text-slate-400 font-black tracking-widest flex items-center uppercase"><Zap size={11} className="mr-1 text-purple-400"/> B. 펄 코트 실시간 중량</span>
                 <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-800 shadow-inner text-xs">
                     <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 font-bold">순수 안료</span><span className="font-black text-white text-sm">{totalPearlWeight}g</span></div>
                     <span className="text-slate-600 font-black text-sm">+</span>
                     <div className="flex flex-col items-center"><span className="text-[9px] text-purple-400 font-bold">6052 수지 ({isPearlMetallic ? '20%' : '10%'})</span><span className="font-black text-purple-400 text-sm">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g</span></div>
                     <span className="text-slate-600 font-black text-sm">=</span>
                     <div className="flex flex-col items-center bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/50"><span className="text-[9px] text-emerald-400 font-bold">총 중량</span><span className="font-black text-emerald-400 text-base">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)}g</span></div>
                 </div>
              </div>
              )}
          </div>

          <div className="flex flex-col items-center justify-center shrink-0 bg-gradient-to-br from-amber-950/50 to-yellow-900/20 border-2 border-yellow-500/60 px-6 py-2 rounded-xl w-full lg:w-auto shadow-[0_0_25px_rgba(234,179,8,0.2)]">
             <span className="text-[11px] text-yellow-500 font-black tracking-widest flex items-center uppercase"><Beaker size={13} className="mr-1"/> ✨ 최종 도막 혼합 총량</span>
             <span className="text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                 {(
                     parseFloat((parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)) + 
                     (isThreeCoatMode ? parseFloat((parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)) : 0)
                 ).toFixed(1)}<span className="text-lg font-bold text-yellow-600 ml-0.5">g</span>
             </span>
          </div>
      </div>

      {selectedTonerForView && TONER_DB[selectedTonerForView] && (
        <div className="fixed inset-0 bg-slate-900/90 z-[700] flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
           <div className="bg-white rounded-2xl w-[650px] max-w-full shadow-2xl overflow-hidden border flex flex-col max-h-[90vh]">
              <div className="bg-slate-900 p-3.5 flex justify-between items-center text-white shrink-0 border-b-4 border-blue-600">
                 <h3 className="text-sm font-black flex items-center"><Droplet size={16} className="mr-1.5 text-blue-400"/> {selectedTonerForView} 정밀 광학 & 먼셀 분석 보드</h3>
                 <button onClick={() => setSelectedTonerForView(null)} className="hover:text-red-400 transition-colors bg-slate-800 p-1 rounded-full"><X size={18}/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
                 <div className="text-xl font-black text-slate-800 mb-3">{TONER_DB[selectedTonerForView].role}</div>
                 
                 {(()=>{
                     const activeT = [...toners, ...pearlToners].find(t => t.code === selectedTonerForView);
                     const cWeight = activeT ? (parseFloat(activeT.adjustedWeight) || 0) : 0;
                     return getMunsellDynamicDescription(selectedTonerForView, TONER_DB[selectedTonerForView].role, TONER_DB[selectedTonerForView].type, cWeight);
                 })()}

                 <div className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-slate-200 mb-4 shadow-sm">
                    {TONER_DB[selectedTonerForView].details?.map((d: any, idx: number) => {
                        const getBadgeClass = (title: string) => {
                            if(title.includes("일반")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
                            if(title.includes("외관")) return "bg-blue-50 text-blue-700 border-blue-200";
                            if(title.includes("용도")) return "bg-purple-50 text-purple-700 border-purple-200";
                            if(title.includes("혼합")) return "bg-amber-50 text-amber-700 border-amber-200";
                            if(title.includes("경고") || title.includes("주의")) return "bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-100";
                            return "bg-slate-50 text-slate-700 border-slate-200";
                        };
                        return (
                        <div key={idx} className="flex items-start gap-2.5">
                            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded border ${getBadgeClass(d[0])}`}>{d[0]}</span>
                            <span className="text-xs text-slate-700 leading-relaxed break-keep mt-0.5">{d[1]}</span>
                        </div>
                    )})}
                 </div>

                 <div className="mb-4">
                     <div className="text-[10px] font-black text-slate-500 mb-1 flex items-center"><Search size={10} className="mr-1"/> 수동 특이사항 메모 (자동 저장)</div>
                     <textarea
                         value={tonerMemos[selectedTonerForView] || ''}
                         onChange={(e) => setTonerMemos(prev => ({ ...prev, [selectedTonerForView]: e.target.value }))}
                         placeholder={`여기에 [${selectedTonerForView}] 안료에 대한 현장 작업 메모나 특이사항을 직접 기록하세요...\n(※ 작성하신 메모는 안료별로 영구 저장됩니다.)`}
                         className="w-full bg-yellow-50 border border-yellow-300 p-3 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-inner resize-none h-20"
                     />
                 </div>

                 <div className="flex gap-4 mt-2">
                    <div className="flex-1">
                       <div className="text-[10px] font-black text-center text-white bg-slate-800 py-1.5 rounded-t-lg tracking-widest">정면 반사광 (Face 15°)</div>
                       <div className="h-32 rounded-b-lg border border-slate-300 relative overflow-hidden shadow-inner" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'face')}}>
                           {isTonerMetallic(TONER_DB[selectedTonerForView].role) && <div className="metallic-flake opacity-50"></div>}
                       </div>
                    </div>
                    <div className="flex-1">
                       <div className="text-[10px] font-black text-center text-white bg-slate-800 py-1.5 rounded-t-lg tracking-widest">측면 음영 (Flop 110°)</div>
                       <div className="h-32 rounded-b-lg border border-slate-300 relative overflow-hidden shadow-inner" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'flop')}}>
                           {isTonerMetallic(TONER_DB[selectedTonerForView].role) && <div className="metallic-flake opacity-30"></div>}
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTonerForView(null)} className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black w-full text-sm mt-5 shadow-md transition-colors">분석창 닫기</button>
              </div>
           </div>
        </div>
      )}

      {/* 💡 과거 데이터를 불러오는 새 탭 모달 */}
      {restoredViewData && (
        <div className="fixed inset-0 bg-slate-950/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="p-4 flex justify-between items-center border-b border-slate-700/50 bg-[#1e293b]">
              <h3 className="text-white font-bold flex items-center gap-2">
                <History size={18} className="text-blue-400" /> 과거 구성에 따른 구성
              </h3>
              <button 
                onClick={() => { setRestoredViewData(null); window.close(); }} 
                className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar max-h-[70vh] bg-[#0f172a] space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">차량번호</div>
                  <div className="text-sm font-bold text-white">{restoredViewData.v || restoredViewData.vehicleNumber || '미입력'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">차종</div>
                  <div className="text-sm font-bold text-white">{restoredViewData.m || restoredViewData.carModel || '미입력'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">컬러코드</div>
                  <div className="text-sm font-bold text-blue-400 uppercase">{restoredViewData.c || restoredViewData.targetColorCode || '미지정'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">작업 내용</div>
                  <div className="text-sm font-bold text-white leading-snug">{restoredViewData.j || restoredViewData.jobDescription || '미입력'}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Layers size={14} /> 베이스 코트 (Ground Coat)
                </h4>
                <div className="space-y-2">
                  {(restoredViewData.b || restoredViewData.toners || [])?.filter((t: any) => t.code).map((t: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-[#1e293b] p-3.5 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-sm">무게 {t.code.replace('WT ', '')}</span>
                        <span className="text-xs text-slate-500">{TONER_DB[t.code]?.role || ''}</span>
                      </div>
                      <span className="text-blue-400 font-bold">{t.adjustedWeight}g</span>
                    </div>
                  ))}
                </div>
              </div>

              {((restoredViewData.t !== undefined ? restoredViewData.t : restoredViewData.isThreeCoatMode)) && (restoredViewData.p || restoredViewData.pearlToners || [])?.filter((t: any) => t.code).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-purple-400 mb-3 flex items-center gap-2 mt-2">
                    <Zap size={14} /> 펄코트 (Mid Coat)
                  </h4>
                  <div className="space-y-2">
                    {(restoredViewData.p || restoredViewData.pearlToners || []).filter((t: any) => t.code).map((t: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-[#1e293b] p-3.5 rounded-xl border border-purple-900/30">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold text-sm">무게 {t.code.replace('WT ', '')}</span>
                          <span className="text-xs text-slate-500">{TONER_DB[t.code]?.role || ''}</span>
                        </div>
                        <span className="text-purple-400 font-bold">{t.adjustedWeight}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#1e293b] border-t border-slate-700/50">
              <button 
                onClick={() => { setRestoredViewData(null); window.close(); }} 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
              >
                닫기 및 진행 중으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}

      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/98 z-[800] flex flex-col text-white font-sans select-none animate-in fade-in overflow-y-auto custom-scrollbar">
          <header className="p-4 flex justify-between items-center bg-black/60 border-b border-slate-800 shrink-0 sticky top-0 z-40 backdrop-blur-md">
            <h2 className="text-base font-black tracking-widest text-slate-300 uppercase flex items-center"><Beaker className="mr-2 text-indigo-500"/> 먼셀 컬러 믹싱 스튜디오 (Munsell Mixing Lab)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-full border border-slate-700 transition-colors"><X size={18}/></button>
          </header>
          
          <main className="flex-1 p-6 md:p-10 flex flex-col items-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950">
             <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 mb-8 items-center">
                 <div className="flex flex-col items-center relative w-full h-full justify-center">
                     <h3 className="text-lg font-black text-white mb-6 flex items-center bg-slate-900 px-6 py-2 rounded-full border border-slate-700 shadow-lg"><Sun className="mr-2 text-yellow-400" size={20}/> 먼셀 20 색상환 (Munsell Wheel)</h3>
                     <div className="relative flex justify-center items-center w-[360px] h-[360px] md:w-[420px] md:h-[420px]">
                        <svg className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]" viewBox="0 0 400 400">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                                </marker>
                            </defs>

                            {MUNSELL_WHEEL_COLORS.map((color, index) => {
                                const startAngle = index * 18;
                                const endAngle = (index + 1) * 18 - 1; 
                                const pathData = describeArc(200, 200, 100, 170, startAngle, endAngle); 
                                const isSelected = selectedWheelIndex === index;
                                
                                return (
                                    <path 
                                        key={index} 
                                        d={pathData} 
                                        fill={color.hex} 
                                        stroke={isSelected ? "#ffffff" : "transparent"} 
                                        strokeWidth={isSelected ? "3" : "0"}
                                        className={`cursor-pointer transition-all duration-300 hover:opacity-80`}
                                        onClick={(e) => { e.stopPropagation(); handleWheelClick(index); }}
                                        style={{ transformOrigin: '200px 200px', transform: isSelected ? 'scale(1.05)' : 'scale(1)' }}
                                    />
                                );
                            })}

                            {MUNSELL_WHEEL_COLORS.map((color, index) => {
                                const midAngle = index * 18 + 8.5; 
                                const pos = polarToCartesian(200, 200, 185, midAngle); 
                                let textRotation = midAngle;
                                if (midAngle > 90 && midAngle < 270) textRotation += 180;

                                return (
                                    <g key={`label_${index}`} transform={`rotate(${textRotation}, ${pos.x}, ${pos.y})`}>
                                        <text x={pos.x} y={pos.y - 4} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle" className="pointer-events-none drop-shadow-md">{color.name}</text>
                                        <text x={pos.x} y={pos.y + 6} fill="#64748b" fontSize="8" fontWeight="normal" textAnchor="middle" className="pointer-events-none">({color.symbol})</text>
                                    </g>
                                );
                            })}

                            <circle cx="200" cy="200" r="98" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                            <text x="200" y="195" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="tracking-widest">MUNSELL</text>
                            <text x="200" y="215" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle" dominantBaseline="middle">표준 색상환</text>

                            {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] && (
                                <line 
                                    x1={polarToCartesian(200, 200, 80, selectedWheelIndex * 18 + 8.5).x} 
                                    y1={polarToCartesian(200, 200, 80, selectedWheelIndex * 18 + 8.5).y} 
                                    x2={polarToCartesian(200, 200, 80, ((selectedWheelIndex + 10) % 20) * 18 + 8.5).x} 
                                    y2={polarToCartesian(200, 200, 80, ((selectedWheelIndex + 10) % 20) * 18 + 8.5).y} 
                                    stroke="#ef4444" 
                                    strokeWidth="3.5" 
                                    markerEnd="url(#arrowhead)" 
                                    className="drop-shadow-[0_0_12px_rgba(239,68,68,1)] pointer-events-none"
                                />
                            )}
                        </svg>
                     </div>
                 </div>

                 <div className="flex flex-col items-center w-full h-full justify-center">
                    <div className="bg-[#111111] rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col items-center w-full max-w-[420px] mx-auto h-full min-h-[360px] justify-center">
                        <h4 className="text-xl font-black text-white mb-8 tracking-widest flex items-center"><BookOpen className="mr-2 text-blue-400" size={20}/>RGB <span className="text-xs text-slate-500 ml-2 font-normal">Additive Color (빛의 혼합)</span></h4>
                        <div className="w-56 h-56 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" style={{ backgroundColor: 'transparent' }}>
                                <circle cx="75" cy="75" r="55" fill="#0000FF" style={{ mixBlendMode: 'screen' }} />
                                <circle cx="125" cy="75" r="55" fill="#FF0000" style={{ mixBlendMode: 'screen' }} />
                                <circle cx="100" cy="120" r="55" fill="#00FF00" style={{ mixBlendMode: 'screen' }} />
                                
                                <g stroke="#ffffff" strokeWidth="1" strokeOpacity="0.5">
                                    <line x1="75" y1="75" x2="30" y2="40" />
                                    <line x1="125" y1="75" x2="170" y2="40" />
                                    <line x1="100" y1="120" x2="100" y2="175" />
                                    <line x1="100" y1="55" x2="100" y2="25" /> 
                                    <line x1="75" y1="105" x2="30" y2="130" /> 
                                    <line x1="125" y1="105" x2="170" y2="130" /> 
                                    <line x1="100" y1="90" x2="150" y2="90" /> 
                                </g>
                                <g fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">
                                    <text x="25" y="35">Blue</text>
                                    <text x="175" y="35">Red</text>
                                    <text x="100" y="185">Green</text>
                                    <text x="100" y="20" fill="#FF00FF">Magenta</text>
                                    <text x="25" y="140" fill="#00FFFF">Cyan</text>
                                    <text x="175" y="140" fill="#FFFF00">Yellow</text>
                                    <rect x="155" y="82" width="30" height="14" fill="#ffffff" rx="2" />
                                    <text x="170" y="93" fill="#000000">White</text>
                                </g>
                            </svg>
                        </div>
                    </div>
                 </div>

                 <div className="flex flex-col items-center w-full h-full justify-center">
                    {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] ? (
                        <div className="bg-slate-800 p-8 rounded-3xl border border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.3)] w-full max-w-[420px] mx-auto min-h-[360px] flex flex-col justify-center text-center animate-in fade-in zoom-in duration-300">
                            <h4 className="text-xl font-black text-white mb-8 flex items-center justify-center gap-3">
                                <span className="w-6 h-6 rounded-full shadow-md border border-slate-400" style={{backgroundColor: MUNSELL_WHEEL_COLORS[selectedWheelIndex].hex}}></span>
                                {MUNSELL_WHEEL_COLORS[selectedWheelIndex].name} ({MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol}) 배합 규격
                            </h4>
                            <div className="flex justify-center items-center gap-6 bg-slate-900 py-8 px-4 rounded-xl border border-slate-700 w-full">
                                {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol] ? (
                                    <div className="flex flex-row justify-center items-center gap-6 w-full">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h1}}></div>
                                            <span className="text-slate-300 font-bold text-sm">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c1}</span>
                                            <span className="text-white font-black text-3xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r1}%</span>
                                        </div>
                                        {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2 && (
                                            <div className="flex flex-row justify-center items-center gap-6">
                                                <span className="text-slate-600 font-black text-2xl">+</span>
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-14 h-14 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h2}}></div>
                                                    <span className="text-slate-300 font-bold text-sm">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2}</span>
                                                    <span className="text-white font-black text-3xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r2}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-red-400 text-sm font-bold w-full text-center">배합 데이터를 불러올 수 없습니다.</div>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-6 font-medium bg-slate-900/50 py-3 rounded-lg">* 기술 보고서 기준의 단일 원색 정밀 조색 비율입니다.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 border-dashed w-full max-w-[420px] mx-auto min-h-[360px] flex flex-col items-center justify-center gap-4 text-center text-slate-500">
                            <Sun className="text-slate-600 mb-2" size={40} />
                            <p className="text-base font-bold text-slate-400">색상환에서 컬러를 클릭하세요.</p>
                            <p className="text-sm">선택된 색상의 원색 조색 배율이<br/>이곳에 표시됩니다.</p>
                        </div>
                    )}
                 </div>

                 <div className="flex flex-col items-center w-full h-full justify-center">
                    <div className="bg-[#f8f9fa] rounded-3xl p-8 border border-slate-300 shadow-2xl flex flex-col items-center w-full max-w-[420px] mx-auto h-full min-h-[360px] justify-center">
                        <h4 className="text-xl font-black text-slate-900 mb-8 tracking-widest flex items-center"><BookOpen className="mr-2 text-pink-500" size={20}/>CMYK <span className="text-xs text-slate-500 ml-2 font-normal">Subtractive Color (물감의 혼합)</span></h4>
                        <div className="w-56 h-56 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" style={{ backgroundColor: 'transparent' }}>
                                <circle cx="75" cy="75" r="55" fill="#00FFFF" style={{ mixBlendMode: 'multiply' }} />
                                <circle cx="125" cy="75" r="55" fill="#FF00FF" style={{ mixBlendMode: 'multiply' }} />
                                <circle cx="100" cy="120" r="55" fill="#FFFF00" style={{ mixBlendMode: 'multiply' }} />
                                
                                <g stroke="#000000" strokeWidth="1" strokeOpacity="0.5">
                                    <line x1="75" y1="75" x2="30" y2="40" />
                                    <line x1="125" y1="75" x2="170" y2="40" />
                                    <line x1="100" y1="120" x2="100" y2="175" />
                                    <line x1="100" y1="55" x2="100" y2="25" /> 
                                    <line x1="75" y1="105" x2="30" y2="130" /> 
                                    <line x1="125" y1="105" x2="170" y2="130" /> 
                                    <line x1="100" y1="90" x2="150" y2="90" /> 
                                </g>
                                <g fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">
                                    <text x="25" y="35">Cyan</text>
                                    <text x="175" y="35">Magenta</text>
                                    <text x="100" y="185">Yellow</text>
                                    <text x="100" y="20" fill="#0000FF">Blue</text>
                                    <text x="25" y="140" fill="#008000">Green</text>
                                    <text x="175" y="140" fill="#FF0000">Red</text>
                                    <rect x="155" y="82" width="30" height="14" fill="#000000" rx="2" />
                                    <text x="170" y="93" fill="#ffffff">Black</text>
                                </g>
                            </svg>
                        </div>
                    </div>
                 </div>

             </div>

             <div className="mt-4 pb-12 w-full flex justify-center">
                <button onClick={() => setIsConfiguratorOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-4 px-16 rounded-full transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 text-lg">
                    <X size={24} /> 믹싱 스튜디오 닫기
                </button>
             </div>
          </main>
        </div>
      )}
    </div>
  );
}
