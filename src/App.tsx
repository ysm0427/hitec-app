import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Zap, Maximize, Lock, Layers, BrainCircuit, Mic, MicOff, ChevronRight, Sun, Droplet, Camera, X, Image as ImageIcon, ScanLine, Beaker, Minus, ChevronsLeft, ChevronsRight, ChevronLeft
} from 'lucide-react';

// 💡 1. 사용자 맞춤형 안료 DB (실제 색상 Face/Flop HEX 코드 및 입자 타입 완벽 반영)
const TONER_DB: Record<string, { role: string, desc: string, face: string, flop: string, type: 'solid'|'silver_fine'|'silver_coarse'|'pearl'|'xirallic'|'binder' }> = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료.', face: '#0284c7', flop: '#0c4a6e', type: 'solid' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제.', face: '#3b82f6', flop: '#1e3a8a', type: 'silver_fine' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두움.', face: '#0f172a', flop: '#020617', type: 'solid' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제.', face: '#f8fafc', flop: '#64748b', type: 'silver_fine' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 알루미늄 혼합 시 주의.', face: '#000000', flop: '#000000', type: 'solid' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 전용 작업성 개선 첨가제.', face: '#ffffff', flop: '#ffffff', type: 'binder' },
  'WT 813': { role: '오렌지/옐로우 계열', desc: '현장 대응용 보강 안료.', face: '#f59e0b', flop: '#78350f', type: 'solid' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제 및 블랜딩용.', face: '#ffffff', flop: '#ffffff', type: 'binder' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. 채도가 높으며 측면을 더 어둡게 함.', face: '#991b1b', flop: '#450a0a', type: 'solid' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제.', face: '#f1f5f9', flop: '#475569', type: 'silver_fine' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '크고 반짝임이 매우 좋은 글라스 플레이크.', face: '#fef08a', flop: '#475569', type: 'xirallic' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제.', face: '#e2e8f0', flop: '#334155', type: 'silver_fine' },
  'WT 307': { role: '프리즈마 실버', desc: '정면은 은색, 측면은 무지개 색을 내는 특수 홀로그램 조색제.', face: '#e2e8f0', flop: '#a855f7', type: 'xirallic' },
  'WT 308': { role: '브라이트 오렌지', desc: '이펙트 컬러에 사용하는 맑은 주황색 조색제.', face: '#ea580c', flop: '#7c2d12', type: 'solid' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 은폐력은 떨어짐.', face: '#d946ef', flop: '#701a75', type: 'solid' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 사용을 위한 바인더.', face: '#ffffff', flop: '#ffffff', type: 'binder' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제.', face: '#ef4444', flop: '#7f1d1d', type: 'solid' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '15도는 맑은 적색, 45도/110도는 녹색으로 변하는 특수 펄.', face: '#ef4444', flop: '#22c55e', type: 'pearl' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 펄. 15도는 적청색, 나머지는 녹황색 간섭 펄.', face: '#3b82f6', flop: '#84cc16', type: 'pearl' },
  'WT 316': { role: '터콰이즈 펄', desc: '15도는 맑은 청색, 나머지는 맑은 녹색 간섭 펄.', face: '#06b6d4', flop: '#10b981', type: 'pearl' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: '반짝임이 좋은 매끄러운 특수 알루미늄. 정면은 밝고 측면은 어두움.', face: '#f8fafc', flop: '#334155', type: 'silver_fine' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제.', face: '#0284c7', flop: '#082f49', type: 'solid' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 정측면 모두 실버 색감.', face: '#f1f5f9', flop: '#64748b', type: 'pearl' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제.', face: '#ffffff', flop: '#e2e8f0', type: 'solid' },
  'WT 323': { role: '스페셜 블랙', desc: '가장 맑고 진한 표준 흑색 조색제.', face: '#020617', flop: '#000000', type: 'solid' },
  'WT 328': { role: '오커', desc: '솔리드 컬러에 사용하는 탁한 오커 브라운 계열의 황색.', face: '#b45309', flop: '#451a03', type: 'solid' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 황적색 발현.', face: '#b91c1c', flop: '#7c2d12', type: 'solid' },
  'WT 341': { role: '아주르 블루', desc: '채도 높은 맑은 청색 조색제.', face: '#2563eb', flop: '#1e3a8a', type: 'solid' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 청색 조색제. 이펙트에 가장 많이 사용.', face: '#1d4ed8', flop: '#0f172a', type: 'solid' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제. 측면은 약간의 황적색을 띔.', face: '#1e293b', flop: '#451a03', type: 'solid' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제.', face: '#c026d3', flop: '#4a044e', type: 'solid' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 광휘형 알루미늄 조색제. 측면 어두움.', face: '#f8fafc', flop: '#334155', type: 'silver_coarse' },
  'WT 360': { role: '코올스 실버', desc: '거친 알루미늄. 정면 밝고 측면 어두움.', face: '#cbd5e1', flop: '#1e293b', type: 'silver_coarse' },
  'WT 363': { role: '브릴리언트 골드', desc: '펄 입자가 강한 밝은 황색 알루미늄. (실사 반영)', face: '#fbbf24', flop: '#b45309', type: 'pearl' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기의 백색 펄 조색제. 정측면 모두 은색빛 화이트 펄. (실사 반영)', face: '#ffffff', flop: '#94a3b8', type: 'pearl' },
  'WT 365': { role: '라일락 펄', desc: '자주색 간섭 펄. 정면 황녹색, 측면 적자주색 변색. (실사 반영)', face: '#a3e635', flop: '#be185d', type: 'pearl' },
  'WT 366': { role: '골드 펄', desc: '맑은 황색 간섭 펄. 정면 황색, 측면 청보라색. (실사 반영)', face: '#facc15', flop: '#4c1d95', type: 'pearl' },
  'WT 370': { role: '브라이트 블루 펄', desc: '맑은 청색 간섭 펄. 정면 청색, 측면 적자주색. (실사 반영)', face: '#0ea5e9', flop: '#be123c', type: 'pearl' },
  'WT 371': { role: '브라운 펄', desc: '중간 크기 주황/구리색 착색 펄 조색제. (실사 반영)', face: '#d97706', flop: '#451a03', type: 'pearl' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄. 반짝임이 매우 좋음.', face: '#ffffff', flop: '#64748b', type: 'xirallic' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄. 맑고 선명함.', face: '#4ade80', flop: '#166534', type: 'xirallic' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄. 반짝임 우수.', face: '#3b82f6', flop: '#1e3a8a', type: 'xirallic' },
  'WT 386': { role: '플롭 컨트롤', desc: '입자 배열 및 밝기, 측면 반사각 조절제.', face: '#ffffff', flop: '#ffffff', type: 'binder' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: '점도 조절 첨가제.', face: '#ffffff', flop: '#ffffff', type: 'binder' },
  'WT 6052': { role: '에디티브 6052', desc: '지연용 컨트롤러.', face: '#ffffff', flop: '#ffffff', type: 'binder' },
};

// 💡 2. 리얼 3D 프랙탈 노이즈 렌더러 (만화 같은 효과 완전 제거, 사진 질감 구현)
const getTonerVisuals = (code: string) => {
  const tonerInfo = TONER_DB[code] || { face: '#94a3b8', flop: '#334155', type: 'solid' };
  
  if (tonerInfo.type === 'binder') {
    return {
      macroStyle: { background: 'rgba(255,255,255,0.9)', border: '1px dashed #cbd5e1' },
      smoothStyle: { background: 'rgba(255,255,255,0.9)', border: '1px dashed #cbd5e1' }
    };
  }

  // 솔리드는 단순 그라데이션, 펄/실버는 mix-blend-mode를 이용한 리얼 플레이크 구현
  const isEffect = tonerInfo.type !== 'solid';
  let noiseFreq = '0.04', specConstant = '0.5', colorMatrix = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1';
  
  if (tonerInfo.type === 'xirallic') { noiseFreq = '0.7'; specConstant = '2.5'; colorMatrix = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8'; }
  else if (tonerInfo.type === 'pearl') { noiseFreq = '0.4'; specConstant = '1.8'; colorMatrix = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -5'; }
  else if (tonerInfo.type === 'silver_fine') { noiseFreq = '1.2'; specConstant = '1.2'; colorMatrix = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 10 -3'; }
  else if (tonerInfo.type === 'silver_coarse') { noiseFreq = '0.2'; specConstant = '2.0'; colorMatrix = '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10'; }

  const svgNoise = isEffect ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${noiseFreq}" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="${colorMatrix}" result="c"/><feSpecularLighting surfaceScale="3" specularConstant="${specConstant}" specularExponent="20" lighting-color="%23fff" in="c"><feDistantLight azimuth="45" elevation="55"/></feSpecularLighting></filter><rect width="100%25" height="100%25" filter="url(%23f)"/></svg>')` : 'none';

  return {
    macroStyle: {
      backgroundColor: tonerInfo.face,
      backgroundImage: `${svgNoise}, linear-gradient(135deg, ${tonerInfo.face} 0%, ${tonerInfo.flop} 100%)`,
      backgroundBlendMode: isEffect ? 'color-dodge, normal' : 'normal',
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
    },
    smoothStyle: {
      background: `linear-gradient(90deg, ${tonerInfo.face} 0%, ${tonerInfo.flop} 100%)`,
    }
  };
};

// 💡 3. 시뮬레이션 광학 혼합 엔진 (에러 차단)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHue = (a: number, b: number, t: number) => {
  let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360;
  let h = a + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360; return h;
};
const lerpColor = (c1: any, c2: any, t: number) => ({ h: lerpHue(c1.h, c2.h, t), s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) });

const getColorString = (opticsObj: any, angle: 'face'|'mid'|'flop') => {
  if (!opticsObj || !opticsObj[angle]) return 'hsl(0,0%,90%)';
  return `hsl(${Math.round(opticsObj[angle].h)}, ${Math.round(opticsObj[angle].s)}%, ${Math.round(opticsObj[angle].l)}%)`;
};

const getInteractiveBackground = (opticsObj: any, lPos: any, hasMetallic: boolean) => {
  if (!opticsObj || !opticsObj.face || !opticsObj.mid || !opticsObj.flop) return '#f1f5f9';
  
  // X축(가로)을 시야각으로 변환 (0=Flop 110도, 50=Mid 45도, 100=Face 15도)
  const viewAngleT = Math.max(0, Math.min(1, lPos.x / 100));
  let activeBaseColor = viewAngleT > 0.5 ? lerpColor(opticsObj.mid, opticsObj.face, (viewAngleT - 0.5) * 2) : lerpColor(opticsObj.flop, opticsObj.mid, viewAngleT * 2);
  
  const baseColorStr = `hsl(${Math.round(activeBaseColor.h)}, ${Math.round(activeBaseColor.s)}%, ${Math.round(activeBaseColor.l)}%)`;
  
  // 빛의 하이라이트 (태양 위치)
  const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2)); 
  const normalizedDist = Math.min(1, dist / 70); 
  const highlightAlpha = lerp(0.8, 0.0, normalizedDist);
  
  const svgNoise = hasMetallic ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="3"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -6" result="c"/><feSpecularLighting surfaceScale="2" specularConstant="1" specularExponent="20" lighting-color="%23fff" in="c"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting></filter><rect width="100%25" height="100%25" filter="url(%23f)"/></svg>'), ` : '';
  const blendMode = hasMetallic ? 'color-dodge, normal' : 'normal';

  return {
      backgroundImage: `${svgNoise}radial-gradient(circle at ${lPos.x}% ${lPos.y}%, rgba(255,255,255,${highlightAlpha}) 0%, ${baseColorStr} ${lerp(30, 80, normalizedDist)}%, hsl(${Math.round(activeBaseColor.h)}, ${Math.round(activeBaseColor.s)}%, ${Math.round(activeBaseColor.l * 0.3)}) 100%)`,
      backgroundBlendMode: blendMode
  };
};

const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code !== '' && !t.role.includes('지정되지'));
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0, rGreen=0, rRed=0, rYellow=0, rViolet=0;
  let wSilver=0, wWhite=0, wBlack=0, wPearl=0, wBinder=0; 
  let faceShiftH = 0, flopShiftH = 0, pearlStrength = 0;

  colorToners.forEach(t => {
    const w = parseFloat(t.adjustedWeight) || 0; if (w <= 0) return;
    const code = t.code || ''; let strength = 1.0;
    const dbInfo = TONER_DB[code];
    if (!dbInfo) return;

    if (dbInfo.type === 'binder') { wBinder += w; }
    else if (code.includes('323') || code.includes('188') || code.includes('1500')) wBlack += w;
    else if (dbInfo.type.includes('silver')) wSilver += w;
    else if (code.includes('321') || code.includes('322')) wWhite += w;
    else if (dbInfo.type === 'pearl' || dbInfo.type === 'xirallic') {
      wPearl += w;
      if (code === 'WT 365') { faceShiftH = 80; flopShiftH = 320; pearlStrength += w; } // Lilac: Green -> Purple
      else if (code === 'WT 370') { faceShiftH = 200; flopShiftH = 340; pearlStrength += w; } // Bright Blue: Blue -> Red
      else if (code === 'WT 366') { faceShiftH = 45; flopShiftH = 260; pearlStrength += w; } // Gold: Gold -> Violet
      else if (code === 'WT 371') { faceShiftH = 30; flopShiftH = 15; pearlStrength += w; } // Brown
    }
    else {
      if (code.includes('144') || code.includes('341') || code.includes('346')) rBlue += w * 2;
      else if (code.includes('339') || code.includes('342')) rViolet += w * 2;
      else if (code.includes('309') || code.includes('338')) { rRed += w * 2; rViolet += w; }
      else if (code.includes('300') || code.includes('311') || code.includes('332')) rRed += w * 2;
      else if (code.includes('308') || code.includes('813')) { rRed += w; rYellow += w * 2; }
      else if (code.includes('326') || code.includes('328')) rYellow += w * 2;
      else if (code.includes('345') || code.includes('347')) rGreen += w * 2;
    }
  });

  const colorWeight = (rBlue + rGreen + rRed + rYellow + rViolet);
  const effectiveW = wWhite + wBlack + wSilver + wPearl + colorWeight;
  const totalForRatio = effectiveW > 0 ? effectiveW : 1;

  const pSilver = wSilver / totalForRatio; const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio; const pPearl = wPearl / totalForRatio;

  let baseL = (pWhite * 96) + (pSilver * 65) + (pPearl * 85);
  if (effectiveW === 0 && wBinder > 0) baseL = 90;

  baseL = Math.max(4, baseL - (Math.pow(pBlack, 0.45) * 60) - (Math.pow(colorWeight/totalForRatio, 0.5) * 30));

  let l15 = baseL + (Math.pow(pSilver + pPearl, 0.6) * 45); 
  let l110 = baseL - (Math.pow(pSilver, 0.6) * 45) - (Math.pow(pBlack, 0.5) * 20);
  
  if (pWhite > 0.6) { l110 = Math.max(83, baseL - 8); l15 = Math.min(99, baseL + (pPearl > 0 ? 10 : 3)); }

  let x = rRed + (rYellow * 0.5) - (rGreen * 0.5) - rBlue - (rViolet * 0.5);
  let y = (rYellow * 0.866) + (rGreen * 0.866) - (rBlue * 0.866) - (rViolet * 0.866);
  let hue = Math.atan2(y, x) * (180 / Math.PI); if (hue < 0) hue += 360;

  let sat = colorWeight > 0 ? Math.min(100, Math.pow((colorWeight / (colorWeight + wWhite + wSilver + Math.max(wBlack * 2, 0))), 0.4) * 100) : 0;
  if (pWhite > 0.6) sat = sat * 0.3;

  let finalFaceH = pearlStrength > colorWeight ? faceShiftH : hue;
  let finalFlopH = pearlStrength > colorWeight ? flopShiftH : hue;

  return {
    face: { h: Math.round(finalFaceH), s: Math.round(sat + pPearl*20), l: Math.round(Math.min(99, Math.max(5, l15))) },
    mid:  { h: Math.round(hue), s: Math.round(sat), l: Math.round(Math.min(98, Math.max(5, baseL))) },
    flop: { h: Math.round(finalFlopH), s: Math.round(sat + pPearl*10), l: Math.round(Math.min(98, Math.max(2, l110))) },
    isMetallic: (wSilver > 0 || wPearl > 0)
  };
};

export default function App() {
  const [toners, setToners] = useState<any[]>([{ id: 't_init', code: '', role: '코드 입력', adjustedWeight: "0.0" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: 'p_init', code: '', role: '코드 입력', adjustedWeight: "0.0" }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false);
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 1, type: 'system', text: '💡 **[HI-TEC Master V11.0 렌더링 엔진 가동]**\n- 🎛️ 스크롤바 삭제 및 퀵 다이렉트 버튼(+/-) 탑재 완료.\n- ✨ 실사 기반 3D 프랙탈 운모/은분 렌더링 활성화.\n- 🎙️ 빈칸 자동 추적 쾌속 음성 입력 대기 중.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [liveVoiceText, setLiveVoiceText] = useState('');
  const recognitionRef = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // 💡 확장 뷰어(비교 모드) 관련 상태
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);
  const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null);

  const [isBaseMetallic, setIsBaseMetallic] = useState(false);
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [baseOptics, setBaseOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 } });
  const [pearlOptics, setPearlOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 } });
  const [finalOptics, setFinalOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 } });

  useEffect(() => {
    const baseTotalNum = toners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    const pearlTotalNum = pearlToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    setTotalBaseWeight(baseTotalNum.toFixed(2)); 
    setTotalPearlWeight(pearlTotalNum.toFixed(2)); 
    setTotalFinalWeight((baseTotalNum + pearlTotalNum).toFixed(2));
    setBaseOptics(getOptics(toners)); 
    setPearlOptics(getOptics(pearlToners)); 
    setFinalOptics(getOptics(isThreeCoatMode ? [...toners, ...pearlToners] : toners));

    const checkMetallic = (tonerList: any[]) => tonerList.some(t => {
      const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== '';
    });
    setIsBaseMetallic(checkMetallic(toners));
    setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }
  }, [chatMessages, liveVoiceText]);

  const handlePointerMove = (e: any) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100; let y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const getLightDirectionText = (x: number, y: number) => {
    let angle = Math.round(110 - (x / 100) * 95); // 0=110도(측면), 100=15도(정면)
    let pos = "센터 조명";
    if (x > 70) pos = "우측면 (Face)"; else if (x < 30) pos = "좌측면 (Flop)";
    if (y < 30) pos = `상단 ${pos}`; else if (y > 70) pos = `하단 ${pos}`;
    return `[조명: ${pos}] 현재 관찰 각도: 약 ${angle}°`;
  };

  const addChatMessage = (type: string, text: string) => { 
    setChatMessages(prev => [...prev, { id: Date.now(), type, text, time: new Date().toLocaleTimeString('ko-KR') }]); 
  };

  // 💡 [해결 1] 빈칸 자동 추적 로직
  const addTonerAutoFill = (codeNum: string, weightStr: string) => {
    const finalCode = `WT ${codeNum}`;
    const tonerInfo = TONER_DB[finalCode];
    if (!tonerInfo) return false;

    const isPearlLayer = isThreeCoatMode && (tonerInfo.type === 'pearl' || tonerInfo.type === 'xirallic');
    const targetState = isPearlLayer ? pearlToners : toners;
    const setter = isPearlLayer ? setPearlToners : setToners;

    setter(prev => {
      const emptyIndex = prev.findIndex(t => t.code === '');
      if (emptyIndex !== -1) {
        const updated = [...prev];
        updated[emptyIndex] = { ...updated[emptyIndex], code: finalCode, role: tonerInfo.role, adjustedWeight: weightStr };
        return updated;
      }
      return [...prev, { id: `auto_${Date.now()}_${Math.random()}`, code: finalCode, role: tonerInfo.role, adjustedWeight: weightStr }];
    });
    return true;
  };

  // 🎙️ V11 음성 인식
  const toggleVoiceDictation = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); setLiveVoiceText(''); return; }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('아이폰 사파리(Safari) 앱을 직접 실행해 주세요.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR'; recognition.continuous = true; recognition.interimResults = true; 

    recognition.onstart = () => {
      setIsListening(true);
      addChatMessage('system', '🎙️ **[음성 자동 입력 켜짐]** "311 20.5 추가", "312 10.3" 등 계속 말씀하세요. 종료 시 "완료"라고 말씀하세요.');
    };
    
    recognition.onresult = (event: any) => {
      let interimTranscript = ''; let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        else interimTranscript += event.results[i][0].transcript;
      }
      if (interimTranscript) setLiveVoiceText(interimTranscript);
      if (finalTranscript) {
        setLiveVoiceText('');
        const trimmedText = finalTranscript.trim();
        addChatMessage('user', `🗣️ "${trimmedText}"`);
        if (trimmedText.includes('완료') || trimmedText.includes('끝')) {
           recognition.stop(); setIsListening(false);
           addChatMessage('system', '🎙️ [음성 입력 완료] 마이크가 정상 종료되었습니다.'); return;
        }

        const regex = /\d+(?:\.\d+)?/g;
        const numbers = trimmedText.match(regex);
        if (numbers && numbers.length > 0) {
            let pendingCode: string | null = null; let addedCount = 0;
            for (let i = 0; i < numbers.length; i++) {
                const num = numbers[i];
                if (num.length >= 3 && num.length <= 4 && /^[13468]/.test(num)) {
                    if (pendingCode) { if(addTonerAutoFill(pendingCode, "0.0")) addedCount++; }
                    pendingCode = num;
                } else {
                    if (pendingCode) { if(addTonerAutoFill(pendingCode, num)) addedCount++; pendingCode = null; }
                }
            }
            if (pendingCode) { if(addTonerAutoFill(pendingCode, "0.0")) addedCount++; }
            if (addedCount > 0) addChatMessage('system', `✅ ${addedCount}개 안료 추가 완료. 빈칸이 없으면 새 줄을 만듭니다.`);
            else addChatMessage('system', `❌ 유효한 안료 번호(3~4자리)를 찾지 못했습니다.`);
        }
      }
    };
    recognition.onerror = () => { setIsListening(false); setLiveVoiceText(''); };
    recognition.onend = () => { setIsListening(false); setLiveVoiceText(''); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // 💡 [해결 4] AI 텍스트 피드백 ("312 10 감소 색상 변화")
  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput; addChatMessage('user', q); setChatInput('');
    
    setTimeout(() => {
      const regex = /(?:WT\s*)?(\d{3,4}).*?(감소|빼|추가|올리|더|변화)/i;
      const match = q.match(regex);
      let advice = "";
      
      if (match) {
          const finalCode = `WT ${match[1]}`;
          const tonerInfo = TONER_DB[finalCode];
          
          if (tonerInfo) {
              advice = `👑 **[AI 광학 시뮬레이션 브리핑: ${finalCode}]**\n\n`;
              advice += `▪️ **안료 고유 특성:** ${tonerInfo.desc}\n\n`;
              
              if (q.includes('감소') || q.includes('빼')) {
                  advice += `📉 **[감소 시 도막 변화]**\n해당 안료(${tonerInfo.role.split(' ')[0]})의 지배력이 약해집니다. 이로 인해 전체적인 채도가 낮아지거나, 반사각(Flop 110°)에서 베이스 고유의 바탕색이 더 투명하게 드러나며 상대적으로 명도가 상승할 수 있습니다.\n\n`;
              } else if (q.includes('추가') || q.includes('올리') || q.includes('더')) {
                  advice += `📈 **[추가 시 도막 변화]**\n해당 안료(${tonerInfo.role.split(' ')[0]})의 특성이 강하게 부각됩니다. 정면(Face 15°) 색감이 짙어지고, 입자감이 거칠거나 투명도가 낮을 경우 도막의 은폐력이 상승하며 다소 탁해질 수 있습니다.\n\n`;
              } else {
                   advice += `🔄 **[색상 변화 예측]**\n해당 안료의 증감은 도막의 ${tonerInfo.type !== 'solid' ? '반사광과 간섭색 펄감' : '기본 명도와 채도'}에 직접적인 영향을 미칩니다.\n\n`;
              }
              advice += `💡 **Action:** 상단의 **[확장 뷰어]**를 열어 상단 패널의 **[- / +] 버튼**을 눌러보세요. **[원본 vs 수정본]**의 색상 차이를 실시간으로 비교할 수 있습니다!`;
          } else {
              advice = `⚠️ ${finalCode} 안료를 DB에서 찾을 수 없습니다.`;
          }
      } else {
          advice = `👑 명령어 분석을 완료했습니다. 상세 변화를 보시려면 "WT 315 0.9 감소 색상 변화" 처럼 구체적으로 질문해 주세요.`;
      }
      addChatMessage('ai', advice);
    }, 500);
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val.startsWith('.')) val = '0' + val;
    
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formatted = newCode.toUpperCase().trim(); 
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if (t.id === id) {
        let matched = TONER_DB[formatted]; let finalCode = formatted; 
        if (!matched) {
          const numMatch = formatted.match(/\d+/);
          if (numMatch) { finalCode = `WT ${numMatch[0]}`; matched = TONER_DB[finalCode]; }
        }
        return matched ? { ...t, code: finalCode, role: matched.role } : { ...t, code: newCode, role: '코드 입력' };
      }
      return t;
    }));
  };

  // 💡 [해결 1] 퀵 에디터 미세/매크로 다이렉트 버튼 조작 함수
  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if(t.id === id) {
         let current = parseFloat(t.adjustedWeight) || 0;
         let newVal = Math.max(0, current + delta);
         return { ...t, adjustedWeight: newVal.toFixed(1) };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col overflow-x-hidden lg:overflow-hidden">
      
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 11.0</span></h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-auto lg:h-[calc(100vh-70px)] overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
            {isListening && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center space-x-2 text-xs font-bold shadow-inner">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0"></span>
                <span className="text-slate-400 font-normal shrink-0">음성 인식 중:</span>
                <span className="text-slate-900 font-black truncate">{liveVoiceText || '대기 중... 계속 말씀하세요 ("완료" 시 종료)'}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 시트</h2>
              <div className="flex space-x-1.5 shrink-0">
                <button onClick={toggleVoiceDictation} className={`px-2.5 py-1.5 rounded-md flex items-center text-xs font-black transition-all ${isListening ? 'bg-red-500 text-white animate-pulse border-2 border-red-400' : 'bg-slate-700 hover:bg-slate-800 text-white'}`}>
                  {isListening ? <MicOff size={14} className="mr-1" /> : <Mic size={14} className="mr-1" />} <span>음성 추가</span>
                </button>
                <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-2.5 py-1.5 rounded-md flex items-center text-xs font-bold"><Trash2 size={14} className="mr-1"/>초기화</button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-white relative min-h-[400px] lg:min-h-0">
            <div className="space-y-3 pb-4">
              <div className="text-xs font-black text-slate-400 mb-1 flex items-center justify-between border-b pb-1.5">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-0.5 rounded border">
                  <span className="mr-1.5 text-[11px] font-bold text-purple-700">3Coat 펄 모드</span>
                  <input type="checkbox" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                </label>
              </div>

              {toners.map((toner) => {
                const visuals = getTonerVisuals(toner.code);
                return (
                  <div key={toner.id} className="flex flex-col bg-white p-2.5 mb-2 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-10 h-5 rounded shadow-xs border flex overflow-hidden cursor-pointer shrink-0" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                          <div className="flex-1" style={visuals.macroStyle}></div>
                          <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                        </div>
                        <input type="text" value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} placeholder="코드입력" className="flex-1 bg-transparent font-black text-blue-700 outline-none text-base uppercase px-1" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-full">
                        <div className="text-xs font-black text-slate-800">{toner.role}</div>
                        <div className="text-[12px] text-slate-600 leading-relaxed mt-1 break-keep whitespace-pre-wrap">
                          {TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '코드를 입력하면 상세 스펙 데이터가 출력됩니다.'}
                        </div>
                      </div>
                      {/* 💡 [해결 1] 다이렉트 매크로/미세 버튼 입력 그룹 적용 */}
                      <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-200 w-full mt-1">
                        <div className="flex space-x-1">
                           <button onClick={() => quickEditWeight(toner.id, -10, false)} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">-10</button>
                           <button onClick={() => quickEditWeight(toner.id, -1, false)} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">-1</button>
                           <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="px-1.5 py-1 bg-red-50 border border-red-200 rounded text-[10px] font-bold text-red-600 hover:bg-red-100">-0.1</button>
                        </div>
                        <div className="flex items-center px-2">
                           <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} className="w-14 text-center bg-transparent text-sm font-black text-blue-900 outline-none" />
                           <span className="text-slate-400 text-[10px] font-bold">g</span>
                        </div>
                        <div className="flex space-x-1">
                           <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="px-1.5 py-1 bg-blue-50 border border-blue-200 rounded text-[10px] font-bold text-blue-600 hover:bg-blue-100">+0.1</button>
                           <button onClick={() => quickEditWeight(toner.id, 1, false)} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">+1</button>
                           <button onClick={() => quickEditWeight(toner.id, 10, false)} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">+10</button>
                        </div>
                        <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500 ml-2"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold flex items-center justify-center space-x-1 text-xs hover:border-blue-500 transition-colors"><Plus size={14} /><span>빈칸 추가</span></button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-3 border-t-2 border-dashed border-purple-100 space-y-3 pb-6">
                <div className="text-xs font-black text-purple-700 mb-1">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const visuals = getTonerVisuals(toner.code);
                  return (
                    <div key={toner.id} className="flex flex-col bg-white p-2.5 mb-2 rounded-lg border border-purple-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2 w-full">
                          <div className="w-10 h-5 rounded shadow-xs border flex overflow-hidden cursor-pointer shrink-0" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                            <div className="flex-1" style={visuals.macroStyle}></div>
                            <div className="flex-1 border-l" style={visuals.smoothStyle}></div>
                          </div>
                          <input type="text" value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} placeholder="코드입력" className="flex-1 bg-transparent font-black text-purple-700 outline-none text-base uppercase px-1" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="w-full">
                          <div className="text-xs font-black text-slate-800">{toner.role}</div>
                          <div className="text-[12px] text-slate-600 leading-relaxed mt-1 break-keep whitespace-pre-wrap">
                            {TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '코드를 입력하면 상세 스펙 데이터가 출력됩니다.'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-purple-50/30 p-1.5 rounded-lg border border-purple-100 w-full mt-1">
                          <div className="flex space-x-1">
                             <button onClick={() => quickEditWeight(toner.id, -10, true)} className="px-1.5 py-1 bg-white border border-purple-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">-10</button>
                             <button onClick={() => quickEditWeight(toner.id, -1, true)} className="px-1.5 py-1 bg-white border border-purple-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">-1</button>
                             <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="px-1.5 py-1 bg-red-50 border border-red-200 rounded text-[10px] font-bold text-red-600 hover:bg-red-100">-0.1</button>
                          </div>
                          <div className="flex items-center px-2">
                             <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)} className="w-14 text-center bg-transparent text-sm font-black text-purple-900 outline-none" />
                             <span className="text-slate-400 text-[10px] font-bold">g</span>
                          </div>
                          <div className="flex space-x-1">
                             <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="px-1.5 py-1 bg-purple-100 border border-purple-300 rounded text-[10px] font-bold text-purple-700 hover:bg-purple-200">+0.1</button>
                             <button onClick={() => quickEditWeight(toner.id, 1, true)} className="px-1.5 py-1 bg-white border border-purple-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">+1</button>
                             <button onClick={() => quickEditWeight(toner.id, 10, true)} className="px-1.5 py-1 bg-white border border-purple-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">+10</button>
                          </div>
                          <button onClick={() => removeToner(toner.id, true)} className="text-purple-300 hover:text-red-500 ml-2"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addToner(true)} className="w-full py-2 border border-dashed rounded-lg text-purple-400 font-bold flex items-center justify-center space-x-1 text-xs hover:border-purple-500 transition-colors"><Plus size={14} /><span>빈칸 추가</span></button>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-800 text-slate-200 flex flex-col shrink-0 space-y-2 text-xs rounded-b-xl lg:rounded-none">
             <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
               <div>베이스 합계: <span className="text-white font-black text-sm">{totalBaseWeight}g</span></div>
               <div className="text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/30 flex items-center">
                  <Beaker size={12} className="mr-1"/> 6052: <span className="text-white font-black ml-1">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g</span> <span className="opacity-70 ml-1">({isBaseMetallic ? '메탈릭 20%' : '솔리드 10%'})</span>
               </div>
             </div>
             {isThreeCoatMode && (
               <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                 <div>펄 코트 합계: <span className="text-white font-black text-sm">{totalPearlWeight}g</span></div>
                 <div className="text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/30 flex items-center">
                    <Beaker size={12} className="mr-1"/> 6052: <span className="text-white font-black ml-1">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g</span> <span className="opacity-70 ml-1">({isPearlMetallic ? '메탈릭 20%' : '솔리드 10%'})</span>
                 </div>
               </div>
             )}
             <div className="flex justify-between items-center pt-1 font-bold text-sm">
               <span className="text-slate-400 uppercase tracking-wider text-xs">Total Formula</span>
               <span className="text-base text-cyan-400 font-black">{totalFinalWeight} <span className="text-xs">g</span></span>
             </div>
          </div>
        </div>

        {/* Right Column: Multi-View & AI Terminal */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-4">
          <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-xl flex-none">
            <h3 className="text-sm font-bold mb-3 flex justify-between items-center border-b pb-2">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={16} />멀티 렌더링 비교</span>
              <button onClick={() => { 
                  setOriginalFinalOptics(finalOptics); 
                  setIsConfiguratorOpen(true); 
                  setLightPos({x:50,y:50}); 
              }} className="text-xs px-3 py-1.5 bg-blue-50 border border-blue-200 rounded font-black text-blue-700 shadow-sm hover:bg-blue-100 transition-colors">확장 뷰어 (Before/After)</button>
            </h3>
            <div className="space-y-3">
              <div>
                 <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-0.5"><span>A. 베이스 코트</span><span>{totalBaseWeight}g</span></div>
                 <div className="h-11 rounded-lg border relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}></div>
              </div>
              {isThreeCoatMode && (
                <div>
                   <div className="flex justify-between text-[11px] font-bold text-purple-600 mb-0.5"><span>B. 펄 코트</span><span>{totalPearlWeight}g</span></div>
                   <div className="h-11 rounded-lg border relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` }}></div>
                </div>
              )}
              <div>
                 <div className="flex justify-between text-[11px] font-bold text-blue-600 mb-0.5"><span>C. 최종 3코트 결합</span><span>{totalFinalWeight}g</span></div>
                 <div className="h-14 rounded-lg border relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-3 flex flex-col flex-1 shadow-xl overflow-hidden min-h-[350px] lg:min-h-0">
            <h3 className="text-xs font-bold flex items-center mb-2"><BrainCircuit className="text-blue-600 mr-2" size={14} />AI 엔진 터미널</h3>
            <div ref={chatContainerRef} className="flex-1 bg-slate-50 border p-3 overflow-y-auto mb-2 space-y-3 rounded-lg text-xs shadow-inner">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`p-2.5 rounded border leading-relaxed ${msg.type === 'system' ? 'bg-slate-800 text-slate-100 font-medium' : msg.type === 'user' ? 'bg-blue-600 text-white ml-6' : 'bg-white text-slate-800 mr-6'}`}>
                   <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                </div>
              ))}
            </div>
            <div className="flex space-x-1.5 shrink-0">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskSolution()} placeholder="명령어 입력 (예: 315 0.9 감소 색상 변화)" className="w-full bg-white border rounded p-2 text-xs focus:outline-none focus:border-blue-500 shadow-inner" />
              <button onClick={handleAskSolution} className="bg-blue-600 text-white px-4 rounded font-bold text-xs whitespace-nowrap">분석</button>
            </div>
          </div>
        </div>
      </div>

      {/* 안료 디테일 뷰어 모달 */}
      {selectedTonerForView && TONER_DB[selectedTonerForView] && (() => {
        const tonerInfo = TONER_DB[selectedTonerForView];
        const visuals = getTonerVisuals(selectedTonerForView);
        return (
          <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center p-3 backdrop-blur-xs">
             <div className="bg-white rounded-xl w-full max-w-lg flex flex-col max-h-[85vh] shadow-2xl border border-slate-700">
                <div className="bg-slate-900 p-3.5 flex justify-between items-center shrink-0 rounded-t-xl">
                   <h3 className="text-white font-bold text-sm flex items-center"><Droplet className="mr-2 text-blue-400" size={16}/> {selectedTonerForView} 단일 안료 뷰어</h3>
                   <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-4 overflow-y-auto space-y-4">
                   <div className="flex items-center mb-1">
                      <div className="flex w-16 h-8 rounded shadow-xs border border-slate-400 overflow-hidden mr-3 shrink-0">
                        <div className="flex-1" style={visuals.macroStyle}></div>
                        <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                      </div>
                      <div className="text-xl font-black text-blue-700">{tonerInfo.role}</div>
                   </div>
                   <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border font-bold whitespace-pre-wrap break-keep">{tonerInfo.desc}</p>
                   <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                         <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase text-center bg-slate-100 py-1.5 rounded shadow-sm">Macro View (3D 입자감)</div>
                         <div className="h-40 rounded-lg border border-slate-300 relative overflow-hidden" style={visuals.macroStyle}></div>
                      </div>
                      <div className="flex-[1.3]">
                         <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase text-center bg-slate-100 py-1.5 rounded shadow-sm">Color Travel (변각 도막광학)</div>
                         <div className="h-40 rounded-lg border border-slate-300 relative overflow-hidden" style={visuals.smoothStyle}></div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 text-white py-3 rounded-lg font-bold w-full text-sm shadow-md mt-2 hover:bg-slate-700">닫기</button>
                </div>
             </div>
          </div>
        );
      })()}

      {/* 💡 3D 확장 뷰어 (수정 전/후 + 실시간 다이렉트 컨트롤러) */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white backdrop-blur-md select-none">
          <header className="p-3 flex justify-between items-center bg-black/60 border-b border-slate-800 shrink-0">
            <h2 className="text-sm font-black tracking-widest text-slate-300 flex items-center"><Camera className="mr-2 text-blue-500" size={16}/> 실시간 조색 시뮬레이터 (Before & After)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-1.5 bg-slate-800 hover:bg-red-500 rounded-full border border-slate-700 transition-colors"><X size={18}/></button>
          </header>
          
          <div className="w-full bg-slate-900 border-b border-slate-700 p-2 overflow-x-auto flex gap-2 items-center custom-scrollbar shrink-0 shadow-xl">
             <div className="text-[10px] font-black text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50 shrink-0 mr-1 text-center">베이스<br/>수정</div>
             {toners.filter(t => t.code).map(t => (
                <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-1.5 shrink-0 items-center">
                   <span className="text-[10px] font-bold text-slate-300 mb-1">{t.code}</span>
                   <div className="flex items-center space-x-1">
                      <button onClick={() => quickEditWeight(t.id, -1, false)} className="bg-slate-700 hover:bg-slate-600 w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]"><ChevronsLeft size={10}/></button>
                      <button onClick={() => quickEditWeight(t.id, -0.1, false)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-6 h-6 rounded flex items-center justify-center font-bold border border-red-800/50"><Minus size={12}/></button>
                      <span className="text-[11px] font-black w-10 text-center">{t.adjustedWeight}</span>
                      <button onClick={() => quickEditWeight(t.id, 0.1, false)} className="bg-blue-900/50 hover:bg-blue-500 text-blue-100 w-6 h-6 rounded flex items-center justify-center font-bold border border-blue-800/50"><Plus size={12}/></button>
                      <button onClick={() => quickEditWeight(t.id, 1, false)} className="bg-slate-700 hover:bg-slate-600 w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]"><ChevronsRight size={10}/></button>
                   </div>
                </div>
             ))}
             {isThreeCoatMode && (
               <>
                 <div className="w-px h-8 bg-slate-700 mx-1 shrink-0"></div>
                 <div className="text-[10px] font-black text-purple-400 bg-purple-900/30 px-2 py-1 rounded border border-purple-800/50 shrink-0 mr-1 text-center">펄 코트<br/>수정</div>
                 {pearlToners.filter(t => t.code).map(t => (
                    <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-1.5 shrink-0 items-center">
                       <span className="text-[10px] font-bold text-purple-300 mb-1">{t.code}</span>
                       <div className="flex items-center space-x-1">
                          <button onClick={() => quickEditWeight(t.id, -1, true)} className="bg-slate-700 hover:bg-slate-600 w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]"><ChevronsLeft size={10}/></button>
                          <button onClick={() => quickEditWeight(t.id, -0.1, true)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-6 h-6 rounded flex items-center justify-center font-bold border border-red-800/50"><Minus size={12}/></button>
                          <span className="text-[11px] font-black w-10 text-center">{t.adjustedWeight}</span>
                          <button onClick={() => quickEditWeight(t.id, 0.1, true)} className="bg-purple-900/50 hover:bg-purple-500 text-purple-100 w-6 h-6 rounded flex items-center justify-center font-bold border border-purple-800/50"><Plus size={12}/></button>
                          <button onClick={() => quickEditWeight(t.id, 1, true)} className="bg-slate-700 hover:bg-slate-600 w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]"><ChevronsRight size={10}/></button>
                       </div>
                    </div>
                 ))}
               </>
             )}
          </div>

          <main ref={viewerRef} className="flex-1 p-3 flex flex-col md:flex-row gap-4 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)} onPointerLeave={() => setIsDraggingLight(false)}>
             
             {/* ☀️ 태양(광원) 및 빛 각도 가이드 텍스트 (해결 3) */}
             <div className="absolute z-50 flex items-center justify-center pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-14 h-16 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_#fff] border border-white/30"><Sun className="text-yellow-100" size={28} /></div>
                <div className="absolute top-16 whitespace-nowrap text-[11px] font-black text-yellow-300 bg-black/70 px-2.5 py-1 rounded-md shadow-lg border border-yellow-500/30">{getLightDirectionText(lightPos.x, lightPos.y)}</div>
             </div>
             
             <div className="w-full md:flex-1 h-1/2 md:h-[80%] rounded-2xl border border-slate-600 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]" style={getInteractiveBackground(originalFinalOptics, lightPos, isBaseMetallic || isPearlMetallic)}>
                <div className="absolute top-3 left-3 bg-black/80 px-3 py-1.5 rounded-lg text-xs font-black text-slate-300 border border-slate-700 shadow-md">A. 원본 배합 (변경 전)</div>
             </div>
             
             <div className="text-slate-600 pointer-events-none shrink-0 hidden md:block"><ChevronRight size={32} /></div>
             
             <div className="w-full md:flex-1 h-1/2 md:h-[80%] rounded-2xl border-2 border-blue-500 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)]" style={getInteractiveBackground(finalOptics, lightPos, isBaseMetallic || isPearlMetallic)}>
                <div className="absolute top-3 left-3 bg-blue-900/90 px-3 py-1.5 rounded-lg text-xs font-black text-white border border-blue-400 shadow-md flex items-center">
                   <Zap size={14} className="mr-1.5 text-yellow-300 animate-pulse"/> B. 시뮬레이션 (변경 후)
                </div>
             </div>
          </main>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 10px; }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
      `}} />
    </div>
  );
}
