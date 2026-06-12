import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Zap, Maximize, Lock, Layers, BrainCircuit, Mic, MicOff, ChevronRight, Sun, Droplet, Camera, X, Image as ImageIcon, ScanLine, Beaker, Minus, ChevronsLeft, ChevronsRight
} from 'lucide-react';

// 💡 1. 사용자 맞춤형 안료 DB
const TONER_DB: Record<string, { role: string, desc: string, type: string }> = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임.', type: 'solid' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제.', type: 'silver_fine' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두움.', type: 'solid' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자가 매우 작지만 반짝임이 좋은 특수 알루미늄.', type: 'silver_fine' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 알루미늄 혼합 시 주의.', type: 'solid' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 전용 작업성 및 외관 개선 첨가제.', type: 'binder' },
  'WT 813': { role: '오렌지/옐로우 계열', desc: '현장 대응용 보강 안료.', type: 'solid' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제 및 블랜딩용.', type: 'binder' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. 측면을 더 어둡게 함.', type: 'solid' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제.', type: 'silver_fine' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크.', type: 'xirallic' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제.', type: 'silver_fine' },
  'WT 307': { role: '프리즈마 실버', desc: '측면에서 무지개 색을 내는 특수 조색제(홀로그램).', type: 'xirallic' },
  'WT 308': { role: '브라이트 오렌지', desc: '맑은 주황색 조색제. 은폐력은 떨어짐.', type: 'solid' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 은폐력은 떨어짐.', type: 'solid' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 사용을 위한 조색제 바인더.', type: 'binder' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제.', type: 'solid' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상 변화가 큰 특수 펄 조색제.', type: 'pearl' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제.', type: 'pearl' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제.', type: 'pearl' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: '반짝임이 좋은 매끄러운 특수 알루미늄.', type: 'silver_fine' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제.', type: 'solid' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 정/측면 실버 색감.', type: 'pearl' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제.', type: 'solid' },
  'WT 322': { role: '마이크로 화이트', desc: '이펙트 컬러 전용 미세 백색 조색제.', type: 'solid' },
  'WT 323': { role: '스페셜 블랙', desc: '가장 맑고 진한 표준 흑색 조색제.', type: 'solid' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제.', type: 'solid' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '선명한 녹색빛을 띠는 맑은 황색 조색제.', type: 'solid' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 채도 높고 밝은 황색 조색제.', type: 'solid' },
  'WT 328': { role: '오커', desc: '탁한 오커 브라운 계열의 황색. 은폐력 우수.', type: 'solid' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색 조색제.', type: 'solid' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 무연(납 미함유).', type: 'solid' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '맑은 적황색 조색제. 측면 어둡고 정면 투명.', type: 'solid' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 전체적 황적색 발현.', type: 'solid' },
  'WT 333': { role: '그라나다 레드', desc: '블랙이 포함된 밝은 적색 조색제.', type: 'solid' },
  'WT 334': { role: '옥사이드 레드', desc: '탁한 적색 조색제. 단독 은폐력 좋음.', type: 'solid' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제.', type: 'solid' },
  'WT 336': { role: '트랜스루센트 레드', desc: '선명하며 어두운 갈색 조색제.', type: 'solid' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 메탈릭에서 투명함.', type: 'solid' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제.', type: 'solid' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 측면은 붉은빛.', type: 'solid' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '높은 채도의 맑은 자주색 조색제.', type: 'solid' },
  'WT 341': { role: '아주르 블루', desc: '채도 높은 맑은 청색 조색제. 변색 가장 큼.', type: 'solid' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 은폐력 있음.', type: 'solid' },
  'WT 343': { role: '블루', desc: '중간 순수 청색 조색제.', type: 'solid' },
  'WT 344': { role: '다크 블루', desc: '어두운 표준 청색 조색제.', type: 'solid' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '황색을 조금 띠는 맑고 선명한 녹색 조색제.', type: 'solid' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 청색 조색제. 이펙트 컬러에 다수 사용.', type: 'solid' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 맑고 선명한 녹색 조색제.', type: 'solid' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '맑고 채도 높고 투명한 청색 조색제.', type: 'solid' },
  'WT 349': { role: '트랜스루센트 그린', desc: '녹색 저농 조색제. WT347의 저농 버전.', type: 'solid' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제. 측면은 약간의 황적색.', type: 'solid' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '저농 청색 조색제. WT348의 저농 버전.', type: 'solid' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. WT321의 저농 버전.', type: 'solid' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농 버전.', type: 'solid' },
  'WT 354': { role: '화인 실버', desc: '매우 작은 일반형 알루미늄 조색제.', type: 'silver_fine' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 광휘형 알루미늄 조색제. 측면 어두움.', type: 'silver_coarse' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 일반형 알루미늄 조색제.', type: 'silver_fine' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 가장 작고 백색빛 띠는 일반형 알루미늄.', type: 'silver_fine' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트/펄 컬러용 특수 실버 조색제.', type: 'silver_fine' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄. 정면 밝음.', type: 'silver_coarse' },
  'WT 360': { role: '코올스 실버', desc: '중간 규격의 거친 알루미늄(어두운 회색).', type: 'silver_coarse' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄. 측면 제일 밝음.', type: 'silver_coarse' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제.', type: 'silver_fine' },
  'WT 363': { role: '브릴리언트 골드', desc: '펄 입자가 강한 밝은 황색 알루미늄.', type: 'pearl' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기의 백색 펄 조색제. 은색빛 화이트 펄.', type: 'pearl' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 간섭 펄 조색제. 15도 청적색, 측면 황녹색.', type: 'pearl' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 맑은 황색 간섭 펄 조색제.', type: 'pearl' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 간섭 펄 조색제.', type: 'pearl' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간~미세 크기 백색 펄 조색제.', type: 'pearl' },
  'WT 369': { role: '레드 펄', desc: '작은 크기 적색 착색 펄 조색제. 은폐력 높음.', type: 'pearl' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기 맑은 청색 간섭 펄 조색제.', type: 'pearl' },
  'WT 371': { role: '브라운 펄', desc: '중간~거친 크기 주황색/구리색 착색 펄 조색제.', type: 'pearl' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 적색이 있는 청색 간섭 펄 조색제.', type: 'pearl' },
  'WT 373': { role: '루비 펄', desc: '중간~거친 크기 은폐력 있는 적색 착색 펄 조색제.', type: 'pearl' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기 청녹색 간섭 펄 조색제.', type: 'pearl' },
  'WT 375': { role: '그린 펄', desc: '중간 크기 녹색빛 특수 간섭 펄 조색제.', type: 'pearl' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기 특수 적색 간섭 펄 조색제.', type: 'pearl' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭(Xirallic) 백색 펄. 반짝임 매우 좋음.', type: 'xirallic' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄. 반짝임 강한 착색 펄.', type: 'xirallic' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색(커버) 펄. 반짝임 매우 강함.', type: 'xirallic' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄. 맑고 선명.', type: 'xirallic' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄. 반짝임 우수.', type: 'xirallic' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 펄. 측면 매우 맑음.', type: 'xirallic' },
  'WT 383': { role: '브릴리언트 오렌지', desc: '적황색 알루미늄. 착색감 맑음.', type: 'silver_coarse' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: '투명 화이트 밸런스 조정제(Transparent White).', type: 'binder' },
  'WT 386': { role: '플롭 컨트롤', desc: '입자 배열 및 밝기, 측면 반사각 조절제.', type: 'binder' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: '점도 조절 첨가제(Viscosity Additive).', type: 'binder' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT323보다 어두움.', type: 'solid' },
  'WT 389': { role: '플래틴 실버 화인', desc: '미세한 은빛 플래티넘 실버 알루미늄 조색제.', type: 'silver_fine' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기 고휘도 알루미늄. 정면 매우 밝음.', type: 'silver_coarse' },
  'WT 392': { role: '매직 이펙트', desc: '색상이 WT312 반대로 변하는 특수 펄.', type: 'pearl' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색 띠는 밝은 황색 조색제.', type: 'solid' },
  'WT 6050': { role: '에디티브 6050', desc: '퍼마하이드 하이텍용 속건용/자전용 컨트롤러.', type: 'binder' },
  'WT 6052': { role: '에디티브 6052', desc: '퍼마하이드 하이텍용 지연용 컨트롤러.', type: 'binder' }
};

// 💡 2. 수학 및 색상 보간 함수
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

const getInteractiveBackground = (opticsObj: any, lPos: any) => {
  if (!opticsObj || !opticsObj.face || !opticsObj.mid || !opticsObj.flop) return '#f1f5f9';
  const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2)); const normalizedDist = Math.min(1, dist / 50); 
  let activeColor = normalizedDist < 0.5 ? lerpColor(opticsObj.face, opticsObj.mid, normalizedDist * 2) : lerpColor(opticsObj.mid, opticsObj.flop, (normalizedDist - 0.5) * 2);
  const colorStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(activeColor.l)}%)`;
  const highlightAlpha = lerp(0.9, 0.2, normalizedDist);
  const highlightStr = opticsObj.mid.l > 80 ? `rgba(255,255,255,${lerp(1, 0.4, normalizedDist)})` : `rgba(255,255,255,${highlightAlpha})`;
  const shadowL = opticsObj.mid.l > 80 ? lerp(90, 70, normalizedDist) : lerp(10, 0, normalizedDist);
  return `radial-gradient(circle at ${lPos.x}% ${lPos.y}%, ${highlightStr} 0%, ${colorStr} ${lerp(30, 60, normalizedDist)}%, hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(shadowL)}%) 100%)`;
};

const getTonerVisuals = (code: string) => {
  const tonerInfo = TONER_DB[code] || { face: '#94a3b8', flop: '#334155', type: 'solid', role: '', desc: '' };
  
  if (tonerInfo.type === 'binder') {
    return {
      macroStyle: { background: 'rgba(255,255,255,0.9)', border: '1px dashed #cbd5e1' },
      smoothStyle: { background: 'rgba(255,255,255,0.9)', border: '1px dashed #cbd5e1' }
    };
  }

  const isEffect = tonerInfo.type !== 'solid';
  let faceColor = '#e2e8f0'; 
  if (tonerInfo.role.includes('블루') || tonerInfo.role.includes('청')) faceColor = '#1d4ed8'; 
  else if (tonerInfo.role.includes('레드') || tonerInfo.role.includes('마젠타') || tonerInfo.role.includes('마룬') || code.includes('300')) faceColor = '#b91c1c'; 
  else if (tonerInfo.role.includes('그린') || tonerInfo.role.includes('녹')) faceColor = '#15803d'; 
  else if (tonerInfo.role.includes('옐로우') || tonerInfo.role.includes('황') || tonerInfo.role.includes('오커') || code.includes('813')) faceColor = '#eab308'; 
  else if (tonerInfo.role.includes('오렌지')) faceColor = '#ea580c'; 
  else if (tonerInfo.role.includes('바이올렛')) faceColor = '#7e22ce'; 
  else if (tonerInfo.role.includes('화이트') || tonerInfo.role.includes('백')) faceColor = '#f8fafc'; 
  else if (tonerInfo.role.includes('블랙') || tonerInfo.role.includes('흑')) faceColor = '#0f172a'; 
  else if (tonerInfo.type.includes('silver')) faceColor = '#94a3b8'; 

  let flopColor = '#1e293b';
  if (!isEffect) { flopColor = faceColor; } 
  else {
    if (tonerInfo.desc.includes('녹황색') || tonerInfo.desc.includes('황녹색')) flopColor = '#65a30d'; 
    else if (tonerInfo.desc.includes('적황색') || tonerInfo.desc.includes('황적색')) flopColor = '#ea580c'; 
    else if (tonerInfo.desc.includes('적색') || tonerInfo.desc.includes('마젠타') || tonerInfo.desc.includes('적청색')) flopColor = '#991b1b'; 
    else if (tonerInfo.desc.includes('녹색') || tonerInfo.desc.includes('청녹색')) flopColor = '#166534'; 
    else if (tonerInfo.desc.includes('청색') || tonerInfo.desc.includes('적청색')) flopColor = '#1e3a8a'; 
    else if (tonerInfo.desc.includes('황색')) flopColor = '#b45309'; 
    else if (tonerInfo.type.includes('silver')) flopColor = '#334155';
  }

  let baseFreq = '0.04', alphaMult = '15', surfaceScale = '4';
  if (tonerInfo.type === 'xirallic') { baseFreq = '0.06'; alphaMult = '25'; surfaceScale = '8'; }
  else if (tonerInfo.type === 'pearl') { baseFreq = '0.05'; alphaMult = '12'; surfaceScale = '3'; } 
  else if (tonerInfo.type === 'silver_fine') { baseFreq = '0.12'; alphaMult = '10'; surfaceScale = '2'; } 
  else if (tonerInfo.type === 'silver_coarse') { baseFreq = '0.015'; alphaMult = '20'; surfaceScale = '7'; }
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="4" result="t"/><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alphaMult} -7" in="t" result="c"/><feSpecularLighting in="c" surfaceScale="${surfaceScale}" specularConstant="1.5" specularExponent="20" lighting-color="#fff"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting><feComposite in2="c" operator="in" result="s"/><feMerge><feMergeNode in="c"/><feMergeNode in="s"/></feMerge></filter><rect width="100%" height="100%" fill="${encodeURIComponent(faceColor)}"/><rect width="100%" height="100%" filter="url(#f)" opacity="0.9"/></svg>`;

  return {
    macroStyle: {
      backgroundImage: `url('data:image/svg+xml;utf8,${svg}')`,
      backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
    },
    smoothStyle: { background: `linear-gradient(135deg, ${faceColor} 0%, ${isEffect ? flopColor : 'rgba(0,0,0,0.4)'} 100%)` }
  };
};

const getOptics = (tonersList: any[], weightKey: string) => {
  const colorToners = tonersList.filter(t => !t.role.includes('지정되지 않은'));
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t[weightKey]) || 0), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0, rGreen=0, rRed=0, rYellow=0, rViolet=0;
  let wSilver=0, wWhite=0, wBlack=0, wPearl=0, wBinder=0; let interferenceColor: string | null = null;

  colorToners.forEach(t => {
    const w = parseFloat(t[weightKey]) || 0; if (w <= 0) return;
    const role = t.role || ''; const code = t.code || ''; let strength = 1.0;
    if (code.includes('144') || code.includes('341') || code.includes('300') || code.includes('338')) strength = 2.5;

    if (role.includes('컴포넌트') || role.includes('바인더') || role.includes('에디티브') || role.includes('클리어') || ['WT 385', 'WT 387', 'WT 386', 'WT 400', 'WT 3080', 'WT 310', 'WT 6052', 'WT 6050'].some(c => code.includes(c.replace('WT ', '')))) { wBinder += w; }
    else if (role.includes('블랙') || code.includes('323') || code.includes('388') || code.includes('188') || code.includes('1500')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄') || code.includes('362') || code.includes('357') || code.includes('197') || code.includes('303') || code.includes('305') || code.includes('307')) wSilver += w;
    else if (role.includes('화이트') || code.includes('321') || code.includes('328')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('스파클') || role.includes('다이아몬드') || code.includes('304') || code.includes('377') || code.includes('381')) {
      wPearl += w;
      if (role.includes('블루') || code.includes('381')) { interferenceColor = 'blue'; rBlue += w * 0.15; }
      else if (role.includes('레드') || role.includes('마젠타')) { interferenceColor = 'red'; rRed += w * 0.15; }
      else if (role.includes('그린')) { interferenceColor = 'green'; rGreen += w * 0.15; }
      else if (role.includes('골드') || code.includes('304')) { interferenceColor = 'yellow'; rYellow += w * 0.15; }
      else if (role.includes('화이트') || code.includes('377')) interferenceColor = 'white';
    }
    else if (code.includes('144') || role.includes('블루') || role.includes('청')) { rBlue += w * strength; rGreen += (w * strength) * 0.5; }
    else if (code.includes('339') || role.includes('바이올렛')) rViolet += w * strength;
    else if (code.includes('353') || code.includes('309') || role.includes('마젠타')) { rRed += w * strength; rViolet += (w * strength) * 0.5; }
    else if (code.includes('300') || role.includes('마룬') || role.includes('적')) rRed += w * strength;
    else if (code.includes('308') || role.includes('오렌지')) { rRed += w * strength; rYellow += (w * strength) * 0.5; }
    else if (role.includes('옐로우') || role.includes('황') || code.includes('350') || code.includes('813')) rYellow += w * strength;
    else if (role.includes('그린') || role.includes('녹')) rGreen += w * strength;
  });

  const colorWeight = (rBlue + rGreen + rRed + rYellow + rViolet);
  const effectiveW = wWhite + wBlack + wSilver + wPearl + colorWeight;
  const totalForRatio = effectiveW > 0 ? effectiveW : 1;

  const pSilver = wSilver / totalForRatio; const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio; const pPearl = wPearl / totalForRatio;
  const pColor = colorWeight / totalForRatio;

  let baseL = (pWhite * 96) + (pSilver * 65) + (pPearl * 85);
  if (effectiveW === 0 && wBinder > 0) baseL = 90;

  let blackImpact = Math.pow(pBlack, 0.45) * 60; 
  if (pWhite > 0.6) blackImpact = blackImpact * 0.15;
  const colorImpactL = Math.pow(pColor, 0.5) * 30;
  baseL = Math.max(4, baseL - blackImpact - colorImpactL);

  let l15 = baseL + (Math.pow(pSilver + pPearl, 0.6) * 45); 
  let l110 = baseL - (Math.pow(pSilver, 0.6) * 45) - (Math.pow(pBlack, 0.5) * 20);
  
  if (pWhite > 0.6) { l110 = Math.max(83, baseL - 8); l15 = Math.min(99, baseL + (pPearl > 0 ? 10 : 3)); }

  let x = rRed + (rYellow * 0.5) - (rGreen * 0.5) - rBlue - (rViolet * 0.5);
  let y = (rYellow * 0.866) + (rGreen * 0.866) - (rBlue * 0.866) - (rViolet * 0.866);
  let hue = Math.atan2(y, x) * (180 / Math.PI); if (hue < 0) hue += 360;

  let sat = colorWeight > 0 ? Math.min(100, Math.pow((colorWeight / (colorWeight + wWhite + wSilver + Math.max(wBlack * 2, 0))), 0.4) * 100) : 0;
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
    face: { h: Math.round(faceHue), s: Math.round(faceSat), l: Math.round(Math.min(99, Math.max(5, l15))) },
    mid:  { h: Math.round(hue), s: Math.round(sat), l: Math.round(Math.min(98, Math.max(5, baseL))) },
    flop: { h: Math.round(wPearl > 0 ? flopHue : hue), s: Math.round(flopSat), l: Math.round(Math.min(98, Math.max(2, l110))) },
    isMetallic: (wSilver > 0 || wPearl > 0)
  };
};

export default function App() {
  const [toners, setToners] = useState<any[]>([{ id: 't_init', code: '', role: '코드 입력', adjustedWeight: "0.0" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: 'p_init', code: '', role: '코드 입력', adjustedWeight: "0.0" }]);
  
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false);
  const [targetColorCode, setTargetColorCode] = useState('');
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);

  const [focusTarget, setFocusTarget] = useState<{ id: string, type: 'base' | 'pearl' } | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 1, type: 'system', text: '💡 **[HI-TEC Master V10.0 무결점 스튜디오 가동]**\n- 에러 영구 해결 완료. 무한 음성 모드 및 3D 확장 뷰어 정상화.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [liveVoiceText, setLiveVoiceText] = useState('');
  const recognitionRef = useRef<any>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
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
    if (!document.getElementById('tesseract-script')) {
      const script = document.createElement('script');
      script.id = 'tesseract-script';
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const baseTotalNum = toners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    const pearlTotalNum = pearlToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    
    setTotalBaseWeight(baseTotalNum.toFixed(2)); 
    setTotalPearlWeight(pearlTotalNum.toFixed(2)); 
    setTotalFinalWeight((baseTotalNum + pearlTotalNum).toFixed(2));
    
    setBaseOptics(getOptics(toners, 'adjustedWeight')); 
    setPearlOptics(getOptics(pearlToners, 'adjustedWeight')); 
    setFinalOptics(getOptics(isThreeCoatMode ? [...toners, ...pearlToners] : toners, 'adjustedWeight'));

    const checkMetallic = (tonerList: any[]) => tonerList.some(t => {
      const type = TONER_DB[t.code]?.type || '';
      return type !== 'solid' && type !== 'binder' && type !== '';
    });

    setIsBaseMetallic(checkMetallic(toners));
    setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }
  }, [chatMessages, isAiProcessing, liveVoiceText]);

  const handlePointerMove = (e: any) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100; let y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const getLightDirectionText = (x: number, y: number) => {
    let angle = Math.round(110 - (x / 100) * 95); 
    let pos = "센터 조명";
    if (x > 70) pos = "우측면 (Face)"; else if (x < 30) pos = "좌측면 (Flop)";
    if (y < 30) pos = `상단 ${pos}`; else if (y > 70) pos = `하단 ${pos}`;
    return `[조명: ${pos}] 현재 관찰 각도: 약 ${angle}°`;
  };

  const addChatMessage = (type: string, text: string) => { 
    setChatMessages(prev => [...prev, { id: Date.now(), type, text, time: new Date().toLocaleTimeString('ko-KR') }]); 
  };

  const handleClearAll = () => {
    setToners([{ id: `init_b_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "0.0" }]); 
    setPearlToners([{ id: `init_p_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "0.0" }]); 
    setTargetColorCode(''); setIsBaseConfirmed(false); setScannedImage(null);
    addChatMessage('system', '🗑️ 모든 배합 리스트가 초기화되었습니다.');
  };

  const handleConfirmBase = () => {
    setIsBaseConfirmed(true);
    addChatMessage('system', '🔒 기준 코드가 확정되었습니다. 멀티 시각화 렌더링을 활성화합니다.');
  };

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

  const toggleVoiceDictation = () => {
    if (isListening) {
      recognitionRef.current?.stop(); setIsListening(false); setLiveVoiceText(''); return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) { alert('아이폰 사파리(Safari) 앱을 직접 실행하셔야 모바일 마이크 연동이 작동합니다.'); return; }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR'; recognition.continuous = true; recognition.interimResults = true; recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      addChatMessage('system', '🎙️ **[무한 자동 채움 모드 켜짐]**\n계속해서 말씀하세요. "완료"라고 말씀하시면 마이크가 꺼집니다.\n(예: "311 20.5 추가", "312 10.3")');
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
           recognition.stop(); setIsListening(false); addChatMessage('system', '🎙️ [음성 입력 완료] 마이크가 정상 종료되었습니다.'); return;
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
            if (addedCount > 0) addChatMessage('system', `✅ ${addedCount}개 안료 추가 완료. 빈칸이 없으면 새 줄이 자동 생성됩니다.`);
            else addChatMessage('system', `❌ 유효한 안료 번호(3~4자리)를 찾지 못했습니다.`);
        }
      }
    };
    recognition.onerror = () => { setIsListening(false); setLiveVoiceText(''); };
    recognition.onend = () => { setIsListening(false); setLiveVoiceText(''); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const imageUrl = URL.createObjectURL(file); setScannedImage(imageUrl); setIsScanning(true);
    addChatMessage('system', '⏳ **[AI 비전 사냥 가동]** 오직 안료 번호와 소수점 중량만 추출하여 빈칸에 자동 입력합니다.');
    try {
      if ((window as any).Tesseract) {
        const result = await (window as any).Tesseract.recognize(file, 'eng', { logger: (m: any) => console.log(m) });
        const text = result.data.text;
        const numRegex = /\d+(?:\.\d+)?/g;
        const numbers = text.match(numRegex) || [];
        let pendingCode: string | null = null; let addedCount = 0;
        for(let i=0; i<numbers.length; i++) {
            const num = numbers[i];
            if (num.length >= 3 && num.length <= 4 && /^[13468]/.test(num)) {
                if (pendingCode) { if(addTonerAutoFill(pendingCode, "0.0")) addedCount++; }
                pendingCode = num;
            } else {
                if (pendingCode) { if(addTonerAutoFill(pendingCode, num)) addedCount++; pendingCode = null; }
            }
        }
        if (pendingCode) { if(addTonerAutoFill(pendingCode, "0.0")) addedCount++; }
        if (addedCount > 0) addChatMessage('ai', `📸 **[스캔 매칭 완료]** 총 ${addedCount}개의 데이터를 화면의 빈칸에 꽂아 넣었습니다.`);
        else throw new Error("코드 인식 실패");
      } else { throw new Error("OCR 모듈 미적용"); }
    } catch (error) {
      addChatMessage('ai', `❌ **[스캔 경고]** 사진 화질 문제로 숫자를 찾지 못했습니다. 직접 추가해 주십시오.`);
    }
    setIsScanning(false);
  };

  // 💡 [해결 4] AI 텍스트 피드백 완벽 적용
  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput; addChatMessage('user', q); setChatInput(''); setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      const regex = /(?:WT\s*)?(\d{3,4}).*?(감소|빼|추가|올리|더|변화)/i;
      const match = q.match(regex);
      let advice = "";
      if (match) {
          const finalCode = `WT ${match[1]}`;
          const tonerInfo = TONER_DB[finalCode];
          if (tonerInfo) {
              advice = `👑 **[AI 광학 시뮬레이션: ${finalCode}]**\n\n`;
              advice += `▪️ **특성:** ${tonerInfo.desc}\n\n`;
              if (q.includes('감소') || q.includes('빼')) {
                  advice += `📉 **[감소 변화]** ${tonerInfo.role.split(' ')[0]}의 지배력이 약해져 반사각(Flop)에서 바탕색이 투명하게 드러나고 명도가 상승할 수 있습니다.\n\n`;
              } else if (q.includes('추가') || q.includes('올리') || q.includes('더')) {
                  advice += `📈 **[추가 변화]** 정면(Face) 색감이 짙어지고, 은폐력이 상승하여 다소 탁해질 수 있습니다.\n\n`;
              }
              advice += `💡 **Action:** 상단의 **[확장 뷰어]**를 열어 **[원본 vs 수정본]** 렌더링을 직접 비교하세요!`;
          } else { advice = `⚠️ ${finalCode} 안료를 DB에서 찾을 수 없습니다.`; }
      } else { advice = `👑 명령어 분석 완료. 구체적으로 "WT 315 0.9 감소 색상 변화" 처럼 질문해 주세요.`; }
      addChatMessage('ai', advice);
    }, 600);
  };

  const processWeightInput = (rawValue: string) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, '');
    if (val.startsWith('.')) val = '0' + val; return val;
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    const cleanValue = processWeightInput(rawValue);
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: cleanValue } : t));
    else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: cleanValue } : t));
  };

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim(); 
    const targetToners = isPearl ? pearlToners : toners; const setter = isPearl ? setPearlToners : setToners;
    setter(targetToners.map(toner => {
      if (toner.id === id) {
        let matchedTonerInfo = TONER_DB[formattedCode]; let finalCode = formattedCode; 
        if (!matchedTonerInfo) {
          const numMatch = formattedCode.match(/\d+/);
          if (numMatch) { finalCode = `WT ${numMatch[0]}`; matchedTonerInfo = TONER_DB[finalCode]; }
        }
        return matchedTonerInfo ? { ...toner, code: finalCode, role: matchedTonerInfo.role } : { ...toner, code: newCode, role: '코드 입력' };
      }
      return toner;
    }));
  };

  const removeToner = (id: string, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id));
  };
  
  const addToner = (isPearl = false) => {
    const newId = `new_${Date.now()}`; const newToner = { id: newId, code: '', role: '코드 입력', adjustedWeight: "0.0" };
    if (isPearl) { setPearlToners([...pearlToners, newToner]); setFocusTarget({ id: newId, type: 'pearl' }); } 
    else { setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'base' }); }
  };

  // 💡 [해결 2] 퀵 에디터 다이렉트 버튼 조작 함수 (+/- 버튼)
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
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      
      {scannedImage && (
        <div className="bg-slate-900 border-b-4 border-blue-500 shadow-2xl z-50 p-2 md:p-4 sticky top-0 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-2 px-2 max-w-[1600px] mx-auto">
            <h2 className="text-white text-sm md:text-base font-bold flex items-center">
              <ImageIcon className="mr-2 text-blue-400" size={18}/> 사진 고속 참조 모드
            </h2>
            <button onClick={() => setScannedImage(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1.5 rounded-full border border-slate-700">
              <X size={18} />
            </button>
          </div>
          <div className="w-full max-h-[30vh] md:max-h-[25vh] overflow-auto rounded-lg border border-slate-700 bg-black flex justify-center max-w-[1600px] mx-auto">
             <img src={scannedImage} alt="스캔된 배합표" className="object-contain w-full h-auto" />
          </div>
        </div>
      )}

      {isScanning && (
        <div className="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="relative mb-4">
            <ScanLine className="text-blue-500 w-28 h-28 animate-pulse opacity-80" />
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-[scan_1.5s_ease-in-out_infinite]"></div>
          </div>
          <h2 className="text-white text-xl font-black tracking-wide">숫자 헌팅 필터 가동 중...</h2>
        </div>
      )}

      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 10.0</span></h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-auto lg:h-[calc(100vh-10px)] overflow-y-auto lg:overflow-hidden">
        
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
                <button onClick={toggleVoiceDictation} className={`px-2.5 py-1.5 rounded-md flex items-center text-xs font-black transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-md border-red-400' : 'bg-slate-700 hover:bg-slate-800 text-white'}`}>
                  {isListening ? <MicOff size={14} className="mr-1" /> : <Mic size={14} className="mr-1" />}
                  <span>{isListening ? '듣고있습니다' : '음성 추가'}</span>
                </button>
                <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleCameraCapture} />
                <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-md flex items-center text-xs font-black shadow-md"><Camera size={14} className="mr-1" />시편 촬영</button>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력 (예: UG-Z)" className="bg-white border border-slate-300 px-3 py-2 rounded text-xs font-bold focus:outline-none flex-1 uppercase" />
              <button onClick={handleConfirmBase} className="bg-slate-800 text-white px-3 py-2 rounded text-xs font-bold whitespace-nowrap">확정</button>
              <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-2 py-2 rounded"><Trash2 size={16} /></button>
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
                        <div className="w-10 h-5 rounded shadow-xs border flex overflow-hidden cursor-pointer shrink-0 hover:scale-110 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                          <div className="flex-1" style={visuals.macroStyle}></div>
                          <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                        </div>
                        <input type="text" autoFocus={focusTarget?.id === toner.id} ref={(el) => { if (el && focusTarget?.id === toner.id) { el.focus(); setFocusTarget(null); } }} value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} placeholder="코드입력" className="flex-1 md:w-[120px] bg-transparent font-black text-blue-700 outline-none text-base uppercase px-1" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-full">
                        <div className="text-xs font-black text-slate-800">{toner.role}</div>
                        <div className="text-[12px] text-slate-600 leading-relaxed mt-1 break-keep whitespace-pre-wrap">
                          {TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '코드를 입력하면 안료의 상세 스펙 데이터가 100% 완전 노출됩니다.'}
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-200 w-full mt-1">
                        {/* 💡 [해결 2] 매크로/마이크로 조작 버튼 배열 */}
                        <div className="flex space-x-1">
                           <button onClick={() => quickEditWeight(toner.id, -10, false)} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">-10</button>
                           <button onClick={() => quickEditWeight(toner.id, -1, false)} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">-1</button>
                           <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="px-1.5 py-1 bg-red-50 border border-red-200 rounded text-[10px] font-bold text-red-600 hover:bg-red-100">-0.1</button>
                        </div>
                        <div className="flex items-center px-1">
                           <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} className="w-12 text-center bg-transparent text-sm font-black text-blue-900 outline-none" />
                           <span className="text-slate-400 text-[10px] font-bold">g</span>
                        </div>
                        <div className="flex space-x-1">
                           <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="px-1.5 py-1 bg-blue-50 border border-blue-200 rounded text-[10px] font-bold text-blue-600 hover:bg-blue-100">+0.1</button>
                           <button onClick={() => quickEditWeight(toner.id, 1, false)} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">+1</button>
                           <button onClick={() => quickEditWeight(toner.id, 10, false)} className="px-1.5 py-1 bg-white border border-slate-300 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">+10</button>
                        </div>
                        <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500 ml-1.5"><Trash2 size={14} /></button>
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
                          <div className="w-10 h-5 rounded shadow-xs border flex overflow-hidden cursor-pointer shrink-0 hover:scale-110 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                            <div className="flex-1" style={visuals.macroStyle}></div>
                            <div className="flex-1 border-l" style={visuals.smoothStyle}></div>
                          </div>
                          <input type="text" autoFocus={focusTarget?.id === toner.id} ref={(el) => { if (el && focusTarget?.id === toner.id) { el.focus(); setFocusTarget(null); } }} value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} placeholder="코드입력" className="flex-1 bg-transparent font-black text-purple-700 outline-none text-base uppercase px-1" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="w-full">
                          <div className="text-xs font-black text-slate-800">{toner.role}</div>
                          <div className="text-[12px] text-slate-600 leading-relaxed mt-1 break-keep whitespace-pre-wrap">
                            {TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '코드를 입력하면 상세 스펙 데이터가 100% 완전 노출됩니다.'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between bg-purple-50/30 p-1.5 rounded-lg border border-purple-100 w-full mt-1">
                          <div className="flex space-x-1">
                             <button onClick={() => quickEditWeight(toner.id, -10, true)} className="px-1.5 py-1 bg-white border border-purple-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">-10</button>
                             <button onClick={() => quickEditWeight(toner.id, -1, true)} className="px-1.5 py-1 bg-white border border-purple-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">-1</button>
                             <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="px-1.5 py-1 bg-red-50 border border-red-200 rounded text-[10px] font-bold text-red-600 hover:bg-red-100">-0.1</button>
                          </div>
                          <div className="flex items-center px-1">
                             <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)} className="w-12 text-center bg-transparent text-sm font-black text-purple-900 outline-none" />
                             <span className="text-slate-400 text-[10px] font-bold">g</span>
                          </div>
                          <div className="flex space-x-1">
                             <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="px-1.5 py-1 bg-purple-100 border border-purple-300 rounded text-[10px] font-bold text-purple-700 hover:bg-purple-200">+0.1</button>
                             <button onClick={() => quickEditWeight(toner.id, 1, true)} className="px-1.5 py-1 bg-white border border-purple-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">+1</button>
                             <button onClick={() => quickEditWeight(toner.id, 10, true)} className="px-1.5 py-1 bg-white border border-purple-200 rounded text-[10px] font-bold text-slate-600 hover:bg-slate-100">+10</button>
                          </div>
                          <button onClick={() => removeToner(toner.id, true)} className="text-purple-300 hover:text-red-500 ml-1.5"><Trash2 size={14} /></button>
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

      {/* 💡 3. [사진 3번 해결] 3D 확장 뷰어 + 슬라이더 탑재 퀵 에디터 패널 */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white backdrop-blur-md select-none">
          <header className="p-3 flex justify-between items-center bg-black/60 border-b border-slate-800 shrink-0">
            <h2 className="text-sm font-black tracking-widest text-slate-300 flex items-center"><Camera className="mr-2 text-blue-500" size={16}/> 실시간 조색 시뮬레이터 (Before & After)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-1.5 bg-slate-800 hover:bg-red-500 rounded-full border border-slate-700 transition-colors"><X size={18}/></button>
          </header>
          
          {/* 🎛️ 스와이프 가능한 슬라이더 + 마이크로/매크로 버튼 결합형 상단 퀵 에디터 */}
          <div className="w-full bg-slate-900 border-b border-slate-700 p-3 overflow-x-auto flex gap-3 items-center custom-scrollbar shrink-0 shadow-xl">
             <div className="text-[10px] font-black text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50 shrink-0 mr-1 text-center leading-tight">베이스<br/>수정</div>
             {toners.filter(t => t.code).map(t => (
                <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-2 shrink-0 min-w-[150px] items-center shadow-inner">
                   <span className="text-[11px] font-bold text-slate-300 mb-1.5">{t.code}</span>
                   <input type="range" min="0" max="500" step="0.1" value={t.adjustedWeight || 0} 
                          onChange={(e) => handleWeightInputChange(t.id, e.target.value, false)} 
                          className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500 mb-2"/>
                   <div className="flex items-center space-x-1.5">
                      <button onClick={() => quickEditWeight(t.id, -1, false)} className="bg-slate-700 hover:bg-slate-600 w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]"><ChevronsLeft size={10}/></button>
                      <button onClick={() => quickEditWeight(t.id, -0.1, false)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-6 h-6 rounded flex items-center justify-center font-bold border border-red-800/50"><Minus size={12}/></button>
                      <span className="text-[11px] font-black w-10 text-center">{t.adjustedWeight}g</span>
                      <button onClick={() => quickEditWeight(t.id, 0.1, false)} className="bg-blue-900/50 hover:bg-blue-500 text-blue-100 w-6 h-6 rounded flex items-center justify-center font-bold border border-blue-800/50"><Plus size={12}/></button>
                      <button onClick={() => quickEditWeight(t.id, 1, false)} className="bg-slate-700 hover:bg-slate-600 w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]"><ChevronsRight size={10}/></button>
                   </div>
                </div>
             ))}
             {isThreeCoatMode && (
               <>
                 <div className="w-px h-8 bg-slate-700 mx-2 shrink-0"></div>
                 <div className="text-[10px] font-black text-purple-400 bg-purple-900/30 px-2 py-1 rounded border border-purple-800/50 shrink-0 mr-1 text-center leading-tight">펄 코트<br/>수정</div>
                 {pearlToners.filter(t => t.code).map(t => (
                    <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-2 shrink-0 min-w-[150px] items-center shadow-inner">
                       <span className="text-[11px] font-bold text-purple-300 mb-1.5">{t.code}</span>
                       <input type="range" min="0" max="500" step="0.1" value={t.adjustedWeight || 0} 
                              onChange={(e) => handleWeightInputChange(t.id, e.target.value, true)} 
                              className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-500 mb-2"/>
                       <div className="flex items-center space-x-1.5">
                          <button onClick={() => quickEditWeight(t.id, -1, true)} className="bg-slate-700 hover:bg-slate-600 w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]"><ChevronsLeft size={10}/></button>
                          <button onClick={() => quickEditWeight(t.id, -0.1, true)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-6 h-6 rounded flex items-center justify-center font-bold border border-red-800/50"><Minus size={12}/></button>
                          <span className="text-[11px] font-black w-10 text-center">{t.adjustedWeight}g</span>
                          <button onClick={() => quickEditWeight(t.id, 0.1, true)} className="bg-purple-900/50 hover:bg-purple-500 text-purple-100 w-6 h-6 rounded flex items-center justify-center font-bold border border-purple-800/50"><Plus size={12}/></button>
                          <button onClick={() => quickEditWeight(t.id, 1, true)} className="bg-slate-700 hover:bg-slate-600 w-5 h-5 rounded flex items-center justify-center font-bold text-[9px]"><ChevronsRight size={10}/></button>
                       </div>
                    </div>
                 ))}
               </>
             )}
          </div>

          <main ref={viewerRef} className="flex-1 p-3 flex flex-col md:flex-row gap-4 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)} onPointerLeave={() => setIsDraggingLight(false)}>
             
             {/* ☀️ 태양(광원) 및 빛 각도 가이드 텍스트 */}
             <div className="absolute z-50 flex items-center justify-center pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-14 h-16 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_#fff] border border-white/30"><Sun className="text-yellow-100" size={28} /></div>
                <div className="absolute top-16 whitespace-nowrap text-[11px] font-black text-yellow-300 bg-black/70 px-2.5 py-1 rounded-md shadow-lg border border-yellow-500/30">{getLightDirectionText(lightPos.x, lightPos.y)}</div>
             </div>
             
             {/* 좌측: 변경 전 원본 (Original Snapshot) */}
             <div className="w-full md:flex-1 h-1/2 md:h-[80%] rounded-2xl border border-slate-600 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]" style={getInteractiveBackground(originalFinalOptics, lightPos)}>
                <div className="absolute top-3 left-3 bg-black/80 px-3 py-1.5 rounded-lg text-xs font-black text-slate-300 border border-slate-700 shadow-md">A. 원본 배합 (변경 전)</div>
             </div>
             
             <div className="text-slate-600 pointer-events-none shrink-0 hidden md:block"><ChevronRight size={32} /></div>
             
             {/* 우측: 변경 후 실시간 렌더링 (Live Final) */}
             <div className="w-full md:flex-1 h-1/2 md:h-[80%] rounded-2xl border-2 border-blue-500 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)]" style={getInteractiveBackground(finalOptics, lightPos)}>
                <div className="absolute top-3 left-3 bg-blue-900/90 px-3 py-1.5 rounded-lg text-xs font-black text-white border border-blue-400 shadow-md flex items-center">
                   <Zap size={14} className="mr-1.5 text-yellow-300 animate-pulse"/> B. 실시간 시뮬레이션 (변경 후)
                </div>
             </div>
             
             <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 w-[92%] sm:w-auto shadow-2xl">
                <span className="text-[10px] text-blue-400 font-bold text-center leading-tight">화면을 드래그하면 원본과 수정본의 반사광을 동시에 비교할 수 있습니다.</span>
                <div className="flex space-x-2 mt-2">
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x:50, y:50}); }} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors">정면 (Face 15°)</button>
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x:25, y:25}); }} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors">중면 (Mid 45°)</button>
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x:5, y:5}); }} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors">측면 (Flop 110°)</button>
                </div>
             </div>
          </main>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
        input[type=range]::-webkit-slider-thumb {
          appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #3b82f6; cursor: pointer; border: 2px solid #fff;
        }
      `}} />
    </div>
  );
}
