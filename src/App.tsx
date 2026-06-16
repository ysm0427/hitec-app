import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  Sliders, Trash2, Plus, Zap, X, 
  FolderOpen, Maximize, RefreshCw, Layers, Camera, BrainCircuit, Lock, Unlock, ChevronRight, Sun, Droplet, Image as ImageIcon, ScanLine, Beaker
} from 'lucide-react';

// 💡 1. 사용자 맞춤형 안료 DB
const TONER_DB: Record<string, { role: string, desc: string, type: string, face: string, flop: string }> = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임.', type: 'solid', face: '#0284c7', flop: '#0c4a6e' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋음.', type: 'silver_fine', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두움.', type: 'solid', face: '#0f172a', flop: '#020617' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제.', type: 'silver_fine', face: '#a1a6b4', flop: '#64748b' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. WT332에 비해 채도가 높으며 측면을 더 어둡게 함.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제. WT389보다 작음.', type: 'silver_fine', face: '#d1d5db', flop: '#475569' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크.', type: 'xirallic', face: '#fef08a', flop: '#475569' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제.', type: 'silver_fine', face: '#cbd5e1', flop: '#334155' },
  'WT 307': { role: '프리즈마 실버', desc: '정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제.', type: 'xirallic', face: '#e2e8f0', flop: '#a855f7' },
  'WT 308': { role: '브라이트 오렌지', desc: '주로 이펙트 컬러에 사용하는 맑은 주황색. 은폐력은 떨어짐.', type: 'solid', face: '#ea580c', flop: '#7c2d12' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 주로 채도가 높은 이펙트 컬러에 사용함.', type: 'solid', face: '#d946ef', flop: '#701a75' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 사용을 위한 조색제 바인더로 사용', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제.', type: 'solid', face: '#ef4444', flop: '#7f1d1d' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상변화가 큰 특수 펄 조색제.', type: 'pearl', face: '#ef4444', flop: '#22c55e' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제.', type: 'pearl', face: '#3b82f6', flop: '#84cc16' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제.', type: 'pearl', face: '#06b6d4', flop: '#10b981' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: '반짝임이 좋은 매끄러운 특수 알루미늄 조색제.', type: 'silver_fine', face: '#94a3b8', flop: '#334155' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제. WT346보다 밝고 녹색이 더 많음', type: 'solid', face: '#0284c7', flop: '#082f49' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제.', type: 'pearl', face: '#e2e8f0', flop: '#64748b' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제.', type: 'solid', face: '#ffffff', flop: '#e2e8f0' },
  'WT 322': { role: '마이크로 화이트', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 사용함.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 323': { role: '스페셜 블랙', desc: '표준 흑색 조색제. 알루미늄 입자에 사용하면 명암은 어두워지고 약하게 적황색이 늘어남.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제.', type: 'solid', face: '#f59e0b', flop: '#9a3412' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '이펙트 컬러에 사용하는 녹색을 띤 맑은 황색 조색제.', type: 'solid', face: '#eab308', flop: '#65a30d' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 밝은 황색 조색제.', type: 'solid', face: '#fde047', flop: '#ca8a04' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러에 사용하는 탁한 황색.', type: 'solid', face: '#b45309', flop: '#451a03' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색(스칼렛) 조색제.', type: 'solid', face: '#f59e0b', flop: '#ea580c' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 무연(납 미함유) 성분.', type: 'solid', face: '#ea580c', flop: '#9a3412' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '이펙트 컬러에서 맑은 적황색을 내는 조색제.', type: 'solid', face: '#d97706', flop: '#451a03' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 적색 이펙트/메탈릭에 사용.', type: 'solid', face: '#b91c1c', flop: '#7c2d12' },
  'WT 333': { role: '그라나다 레드', desc: '블랙 톤이 포함된 밝은 적색 조색제.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 334': { role: '옥사이드 레드', desc: '주로 솔리드 컬러에 사용하는 탁한 적색 조색제.', type: 'solid', face: '#7f1d1d', flop: '#450a0a' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제.', type: 'solid', face: '#d97706', flop: '#78350f' },
  'WT 336': { role: '트랜스루센트 레드', desc: '선명하며 어두운 갈색 조색제. 이펙트 컬러 조색에만 사용.', type: 'solid', face: '#7c2d12', flop: '#450a0a' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 약하게 청색을 띰.', type: 'solid', face: '#ef4444', flop: '#991b1b' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제.', type: 'solid', face: '#d946ef', flop: '#86198f' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 청색 및 회색 컬러에 주로 사용.', type: 'solid', face: '#8b5cf6', flop: '#4c1d95' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '맑은 자주색 조색제. WT338에 비해 밝고 청색이 적음.', type: 'solid', face: '#e879f9', flop: '#a21caf' },
  'WT 341': { role: '아주르 블루', desc: '채도 높은 청색 조색제. 관찰각도 별로 컬러의 변화가 가장 큼.', type: 'solid', face: '#2563eb', flop: '#1e3a8a' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 은폐력이 있음.', type: 'solid', face: '#6d28d9', flop: '#2e1065' },
  'WT 343': { role: '블루', desc: '표준 청색 조색제. 솔리드와 이펙트 컬러에 모두 사용.', type: 'solid', face: '#3b82f6', flop: '#1e40af' },
  'WT 344': { role: '다크 블루', desc: '어두운 청색 조색제. 청색 조색제 중 가장 어두움.', type: 'solid', face: '#1d4ed8', flop: '#0f172a' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '맑고 선명한 황색을 조금 띠는 녹색 조색제.', type: 'solid', face: '#10b981', flop: '#064e3b' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 투명한 청색 조색제.', type: 'solid', face: '#1d4ed8', flop: '#020617' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 녹색 조색제. WT345에 비해 어두움.', type: 'solid', face: '#059669', flop: '#022c22' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '채도 높은 청색 조색제.', type: 'solid', face: '#0ea5e9', flop: '#0369a1' },
  'WT 349': { role: '트랜스루센트 그린', desc: '녹색 저농 조색제. WT347의 저농 버전.', type: 'solid', face: '#34d399', flop: '#064e3b' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제. WT323의 저농 버전.', type: 'solid', face: '#1e293b', flop: '#451a03' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '저농 청색 조색제. WT348의 저농 버전.', type: 'solid', face: '#38bdf8', flop: '#075985' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. WT321의 저농 버전.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농 버전.', type: 'solid', face: '#c026d3', flop: '#4a044e' },
  'WT 354': { role: '화인 실버', desc: '매우 작은 크기의 일반형 알루미늄 조색제.', type: 'silver_fine', face: '#cbd5e1', flop: '#64748b' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 광휘형 알루미늄 조색제. 은폐력은 떨어짐.', type: 'silver_coarse', face: '#f8fafc', flop: '#334155' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 일반형 알루미늄 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 작은 일반형 알루미늄 조색제.', type: 'silver_fine', face: '#f8fafc', flop: '#64748b' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트 컬러용 특수 실버 조색제', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄 조색제.', type: 'silver_coarse', face: '#f1f5f9', flop: '#334155' },
  'WT 360': { role: '코올스 실버', desc: 'WT359보다 큰 거친 알루미늄 조색제.', type: 'silver_coarse', face: '#94a3b8', flop: '#1e293b' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄 조색제.', type: 'silver_coarse', face: '#f1f5f9', flop: '#64748b' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#334155' },
  'WT 363': { role: '브릴리언트 골드', desc: '밝은 황색 알루미늄 조색제. 은폐력이 우수함.', type: 'pearl', face: '#fbbf24', flop: '#b45309' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기의 백색 펄 조색제.', type: 'pearl', face: '#ffffff', flop: '#94a3b8' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 간섭 펄 조색제.', type: 'pearl', face: '#a3e635', flop: '#be185d' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 황색 간섭 펄 조색제.', type: 'pearl', face: '#facc15', flop: '#4c1d95' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 간섭 펄 조색제.', type: 'pearl', face: '#4ade80', flop: '#991b1b' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간 크기의 백색 펄 조색제.', type: 'pearl', face: '#f8fafc', flop: '#64748b' },
  'WT 369': { role: '레드 펄', desc: '작은 크기의 적색 펄 조색제. 착색 펄 입자임.', type: 'pearl', face: '#ef4444', flop: '#7f1d1d' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기의 맑은 청색 간섭 펄 조색제.', type: 'pearl', face: '#0ea5e9', flop: '#be123c' },
  'WT 371': { role: '브라운 펄', desc: '중간 크기의 주황색 착색 펄 조색제.', type: 'pearl', face: '#d97706', flop: '#451a03' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 적색이 있는 청색 간섭 펄 조색제.', type: 'pearl', face: '#3b82f6', flop: '#c026d3' },
  'WT 373': { role: '루비 펄', desc: '중간 크기의 은폐력이 있는 적색 착색 펄 조색제.', type: 'pearl', face: '#dc2626', flop: '#7f1d1d' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기의 청녹색 간섭 펄 조색제.', type: 'pearl', face: '#0d9488', flop: '#c2410c' },
  'WT 375': { role: '그린 펄', desc: '중간 크기의 녹색 간섭 펄 조색제.', type: 'pearl', face: '#16a34a', flop: '#b91c1c' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기의 적색 간섭 펄 조색제.', type: 'pearl', face: '#ef4444', flop: '#16a34a' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄 조색제. 입자의 반짝임이 매우 좋음.', type: 'xirallic', face: '#ffffff', flop: '#64748b' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄 조색제. 입자의 반짝임이 매우 좋음.', type: 'xirallic', face: '#ef4444', flop: '#7f1d1d' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색 펄 조색제. 입자의 반짝임이 매우 좋음.', type: 'xirallic', face: '#ea580c', flop: '#7c2d12' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 간섭 펄 조색제.', type: 'xirallic', face: '#4ade80', flop: '#166534' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 간섭 펄 조색제.', type: 'xirallic', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 간섭 펄 조색제.', type: 'xirallic', face: '#facc15', flop: '#a16207' },
  'WT 383': { role: '브릴리언트 오렌지', desc: '적황색 광휘 알루미늄 조색제.', type: 'silver_coarse', face: '#f97316', flop: '#9a3412' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: 'Transparent White. 도막의 투명도 조절.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 386': { role: '플롭 컨트롤', desc: '측면을 밝게 하기 위한 명암 조정제.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: 'Viscosity Additive.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT323보다 어두움.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 389': { role: '플래틴 실버 화인', desc: '작은 고휘도 광휘형 알루미늄 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기의 고휘도 광휘형 알루미늄 조색제.', type: 'silver_coarse', face: '#f8fafc', flop: '#334155' },
  'WT 392': { role: '매직 이펙트', desc: '색상이 WT312의 반대로 변함.', type: 'pearl', face: '#22c55e', flop: '#ef4444' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색을 띠는 밝은 황색 조색제.', type: 'solid', face: '#fef08a', flop: '#a16207' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제, 블랜딩용 첨가제.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제.', type: 'solid', face: '#000000', flop: '#000000' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제. 작업성 향상.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 3080': { role: '스페셜 애디티브', desc: '도막 보정 및 흐름 방지 첨가제', type: 'binder', face: '#ffffff', flop: '#ffffff' }
};

// 보간 및 광학 수학 함수
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHue = (a: number, b: number, t: number) => {
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  let h = a + d * t;
  if (h < 0) h += 360;
  if (h >= 360) h -= 360;
  return h;
};
const lerpColor = (c1: any, c2: any, t: number) => ({
  h: lerpHue(c1.h, c2.h, t),
  s: lerp(c1.s, c2.s, t),
  l: lerp(c1.l, c2.l, t)
});
const hex2rgb = (hex: string) => {
  let v = parseInt(hex.replace('#',''), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
};
const rgb2hsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const isTonerMetallic = (role: string) => role.includes('실버') || role.includes('알루미늄') || role.includes('펄') || role.includes('이펙트') || role.includes('글라스');

const getTonerColorChip = (code: string, role: string) => {
  if (!code || !role) return 'transparent';
  const c = code.replace('WT ', '');
  const isMetallic = isTonerMetallic(role);
  let baseColor = '#e2e8f0'; 
  
  if (role.includes('블루') || role.includes('청')) baseColor = '#1d4ed8'; 
  else if (role.includes('레드') || role.includes('마젠타') || role.includes('마룬') || c.includes('300')) baseColor = '#b91c1c';
  else if (role.includes('그린') || role.includes('녹')) baseColor = '#15803d'; 
  else if (role.includes('옐로우') || role.includes('황') || role.includes('오커')) baseColor = '#eab308'; 
  else if (role.includes('오렌지')) baseColor = '#ea580c'; 
  else if (role.includes('바이올렛')) baseColor = '#7e22ce'; 
  else if (role.includes('화이트') || role.includes('백')) baseColor = '#ffffff'; 
  else if (role.includes('블랙') || role.includes('흑')) baseColor = '#0f172a'; 
  else if (role.includes('실버')) baseColor = '#94a3b8'; 
  else if (role.includes('바인더') || role.includes('컴포넌트') || role.includes('애디티브') || c === '385' || c === '387') baseColor = 'rgba(255,255,255,0.3)'; 

  if (isMetallic) {
    if (role.includes('실버') || role.includes('알루미늄')) return `linear-gradient(135deg, #f1f5f9 0%, ${baseColor} 50%, #475569 100%)`;
    if (role.includes('펄') || role.includes('이펙트')) return `linear-gradient(135deg, rgba(255,255,255,0.9) 0%, ${baseColor} 50%, #000 100%)`;
    return `linear-gradient(135deg, ${baseColor} 0%, #000 100%)`;
  }
  return baseColor;
};

const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || '';
  let h = 0, s = 0, baseL = 50;

  if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('마룬')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹')) { h = 140; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('오커') || r.includes('황')) { h = 40; s = 80; baseL = 50; }
  else if (r.includes('오렌지')) { h = 20; s = 90; baseL = 50; }
  else if (r.includes('바이올렛')) { h = 270; s = 80; baseL = 40; }
  else if (r.includes('화이트') || r.includes('백')) { h = 0; s = 0; baseL = 90; }
  else if (r.includes('블랙') || r.includes('흑')) { h = 0; s = 0; baseL = 15; }
  else if (r.includes('실버') || r.includes('알루미늄')) { h = 210; s = 10; baseL = 60; }
  else { h=0; s=0; baseL=95; } 
  
  const isMetallic = isTonerMetallic(r);
  
  if (angle === 'face') {
    const l = isMetallic ? Math.min(100, baseL + 25) : Math.min(100, baseL + 10);
    return `radial-gradient(circle at 40% 40%, hsl(${h}, ${s}%, ${Math.min(100, l+20)}%) 0%, hsl(${h}, ${s}%, ${l}%) 60%, hsl(${h}, ${s}%, ${Math.max(0, l-15)}%) 100%)`;
  } else {
    const l = isMetallic ? Math.max(0, baseL - 30) : Math.max(0, baseL - 15);
    return `radial-gradient(circle at 10% 10%, hsl(${h}, ${s}%, ${Math.min(100, l+10)}%) 0%, hsl(${h}, ${s}%, ${l}%) 100%)`;
  }
};

// 리얼 3D 프랙탈 질감 엔진 (화이트 뭉개짐 해결 및 URL 인코딩 안정성 확보)
const getRealisticTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
  if (!isMetallic || type === 'binder' || type === 'solid') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };

  let baseFreq = '0.5', alphaMult = '4', surfaceScale = '2', specConst = '1.2';
  if (type === 'xirallic') { baseFreq = '0.8'; alphaMult = '10'; surfaceScale = '5'; specConst = '2.0'; }
  else if (type === 'pearl') { baseFreq = '0.4'; alphaMult = '6'; surfaceScale = '3'; specConst = '1.5'; }
  else if (type === 'silver_fine') { baseFreq = '1.2'; alphaMult = '3'; surfaceScale = '1.5'; specConst = '1.0'; }
  else if (type === 'silver_coarse') { baseFreq = '0.2'; alphaMult = '8'; surfaceScale = '4'; specConst = '1.8'; }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3" result="t"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -1" in="t" result="c"/><feSpecularLighting in="t" surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="20" lighting-color="%23ffffff"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting><feComposite in2="c" operator="in" result="s"/><feMerge><feMergeNode in="c"/><feMergeNode in="s"/></feMerge></filter><rect width="100%25" height="100%25" fill="${encodeURIComponent(faceColor)}"/><rect width="100%25" height="100%25" filter="url(%23f)" opacity="0.4"/></svg>`;

  return {
    backgroundColor: faceColor,
    backgroundImage: `url("data:image/svg+xml;utf8,${svg}"), linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)`,
    backgroundBlendMode: 'overlay, normal',
    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
  };
};

const getOptics = (tonersList: any[], weightKey: string) => {
  const colorToners = tonersList.filter(t => !t.role.includes('지정되지 않은') && t.code !== '');
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t[weightKey]) || 0), 0);

  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0, rGreen=0, rRed=0, rYellow=0, rViolet=0;
  let wSilver=0, wWhite=0, wBlack=0, wPearl=0, wBinder=0;
  let interferenceColor: string | null = null;

  colorToners.forEach(t => {
    const w = parseFloat(t[weightKey]) || 0;
    if (w <= 0) return;

    const role = t.role || '';
    const code = t.code || '';
    let strength = 1.0;
    if (code.includes('144') || code.includes('341') || code.includes('300') || code.includes('338')) strength = 2.5;

    if (role.includes('컴포넌트') || role.includes('바인더') || role.includes('애디티브') || ['WT 385', 'WT 387', 'WT 386', 'WT 400', 'WT 3080', 'WT 310'].some(c => code.includes(c.replace('WT ', '')))) {
      wBinder += w;
    } else if (role.includes('블랙') || code.includes('323') || code.includes('388') || code.includes('188')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄') || code.includes('362') || code.includes('357') || code.includes('197') || code.includes('303') || code.includes('305') || code.includes('307')) wSilver += w;
    else if (role.includes('화이트') || code.includes('321') || code.includes('328')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('스파클') || code.includes('304') || code.includes('377') || code.includes('381')) {
      wPearl += w;
      if (role.includes('블루') || code.includes('381')) { interferenceColor = 'blue'; rBlue += w * 0.15; }
      else if (role.includes('레드') || role.includes('마젠타')) { interferenceColor = 'red'; rRed += w * 0.15; }
      else if (role.includes('그린')) { interferenceColor = 'green'; rGreen += w * 0.15; }
      else if (role.includes('골드') || code.includes('304')) { interferenceColor = 'yellow'; rYellow += w * 0.15; }
      else if (role.includes('화이트') || code.includes('377')) interferenceColor = 'white';
    } else if (code.includes('144') || role.includes('블루') || role.includes('청')) { rBlue += w * strength; rGreen += (w * strength) * 0.5; }
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

  const pSilver = wSilver / totalForRatio;
  const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio;
  const pPearl = wPearl / totalForRatio;
  const pColor = colorWeight / totalForRatio;

  let baseL = (pWhite * 96) + (pSilver * 65) + (pPearl * 85);
  if (effectiveW === 0 && wBinder > 0) baseL = 90; 

  let blackImpact = Math.pow(pBlack, 0.45) * 60; 
  if (pWhite > 0.6) blackImpact = blackImpact * 0.15; 
  const colorImpactL = Math.pow(pColor, 0.5) * 30;
  baseL = Math.max(4, baseL - blackImpact - colorImpactL);

  let l15 = baseL + (Math.pow(pSilver + pPearl, 0.6) * 45); 
  let l110 = baseL - (Math.pow(pSilver, 0.6) * 45) - (Math.pow(pBlack, 0.5) * 20);
  
  if (pWhite > 0.6) {
      l110 = Math.max(83, baseL - 8); 
      l15 = Math.min(99, baseL + (pPearl > 0 ? 10 : 3));
  }

  let x = rRed + (rYellow * 0.5) - (rGreen * 0.5) - rBlue - (rViolet * 0.5);
  let y = (rYellow * 0.866) + (rGreen * 0.866) - (rBlue * 0.866) - (rViolet * 0.866);
  
  let hue = Math.atan2(y, x) * (180 / Math.PI);
  if (hue < 0) hue += 360;

  let sat = colorWeight > 0 ? Math.min(100, Math.pow((colorWeight / (colorWeight + wWhite + wSilver + Math.max(wBlack * 2, 0))), 0.4) * 100) : 0;
  if (pWhite > 0.6) sat = sat * 0.3; 

  let flopHue = hue, faceHue = hue;
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

const getColorString = (opticsObj: any, angle: string) => `hsl(${Math.round(opticsObj[angle].h)}, ${Math.round(opticsObj[angle].s)}%, ${Math.round(opticsObj[angle].l)}%)`;

// 확장 뷰어 3D 배경 렌더링
const getInteractiveBackground = (opticsObj: any, lPos: any) => {
  if (!opticsObj || !opticsObj.face || !opticsObj.mid || !opticsObj.flop) return '#f1f5f9';
  const viewAngleT = Math.max(0, Math.min(1, lPos.x / 100));
  let activeColor = viewAngleT > 0.5 ? lerpColor(opticsObj.mid, opticsObj.face, (viewAngleT - 0.5) * 2) : lerpColor(opticsObj.flop, opticsObj.mid, viewAngleT * 2);
  const baseColorStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(activeColor.l)}%)`;
  const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2)); 
  const normalizedDist = Math.min(1, dist / 70); 
  const highlightAlpha = lerp(0.6, 0.0, normalizedDist);
  return `radial-gradient(circle at ${lPos.x}% ${lPos.y}%, rgba(255,255,255,${highlightAlpha}) 0%, ${baseColorStr} ${lerp(20, 70, normalizedDist)}%, hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(activeColor.l * 0.4)}) 100%)`;
};

// ==========================================
// 💡 메인 APP 컴포넌트
// ==========================================
export default function App() {
  const [toners, setToners] = useState<any[]>([{ id: `init_b_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `init_p_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" }]);
  
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState('');
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);

  // 💡 [빌드 에러 해결] 카메라 참조 Ref 추가
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 💡 [고속 타이핑 로직] 포커스 제어를 위한 상태 및 Ref
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const initialChat = { id: 1, type: 'system', text: '💡 **[HI-TEC Master V18.2 로드 완료]**\n- ⌨️ **[고속 스피드 타이핑]**: 코드 3자리 입력 시 즉시 그람(g)수로 커서 자동 이동. 그람수 입력 후 [Enter] 누르면 즉시 새 칸이 추가되고 코드로 자동 이동합니다.\n- 📸 **[정밀 사진 스캔]**: 영수증을 찍으면 즉시 유효한 안료와 숫자를 추출해 화면에 자동 입력합니다.\n- 🎙️ 음성 인식은 안정성을 위해 시스템에서 영구 제거되었습니다.', time: new Date().toLocaleTimeString('ko-KR') };
  const [chatMessages, setChatMessages] = useState<any[]>([initialChat]);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);
  const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null); 

  const [baseOptics, setBaseOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [pearlOptics, setPearlOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [finalOptics, setFinalOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });

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
    const baseTotal = toners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    const pearlTotal = pearlToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    
    setTotalBaseWeight(baseTotal.toFixed(2));
    setTotalPearlWeight(pearlTotal.toFixed(2));
    setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    
    setBaseOptics(getOptics(toners, 'adjustedWeight'));
    setPearlOptics(getOptics(pearlToners, 'adjustedWeight'));
    
    const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners;
    setFinalOptics(getOptics(activeToners, 'adjustedWeight'));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 50); 
    return () => clearTimeout(timeoutId);
  }, [chatMessages, isAiProcessing]);

  // 💡 [고속 타이핑] 새 줄이 추가되었을 때 자동으로 Code 인풋에 포커스
  useEffect(() => {
    if (focusTarget && codeRefs.current[focusTarget]) {
      codeRefs.current[focusTarget]?.focus();
      setFocusTarget(null);
    }
  }, [focusTarget, toners, pearlToners]);

  const handlePointerMove = (e: any) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    setLightPos({ x, y });
  };

  const addChatMessage = (type: string, text: string) => { 
    setChatMessages(prev => [...prev, { id: Date.now(), type, text, time: new Date().toLocaleTimeString('ko-KR') }]); 
  };

  const handleClearAll = () => {
    setToners([{ id: `init_b_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" }]); 
    setPearlToners([{ id: `init_p_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" }]); 
    setTargetColorCode('');
    setIsBaseConfirmed(false);
    setChatMessages([initialChat, { id: Date.now(), type: 'system', text: '🗑️ 모든 배합 리스트가 초기화되었습니다.', time: new Date().toLocaleTimeString('ko-KR') }]);
  };

  const handleConfirmBase = () => {
    setIsBaseConfirmed(true);
    addChatMessage('system', '🔒 **[STATE_LOCK]** 기준 코드가 확정되었습니다. 멀티 시각화 렌더링 레이어를 동시 활성화합니다.');
  };

  // 💡 [카메라 스캔 전용] 추출된 숫자를 화면에 꽂아넣는 엔진
  const processOcrData = (text: string) => {
    let norm = text.replace(/:/g, '.').replace(/점/g, '.').replace(/\s*\.\s*/g, '.').replace(/[A-Za-z]/g, ' ');
    const nums = norm.match(/\d*\.\d+|\d+/g);
    if (!nums) return 0;

    let addedCount = 0;
    let newToners: any[] = [];
    let i = 0;

    while (i < nums.length) {
        let code = nums[i];
        if (TONER_DB[`WT ${code}`]) {
            let weight = nums[i+1];
            if (weight && !TONER_DB[`WT ${weight}`]) {
                let nextNum = nums[i+2];
                if (nextNum && nextNum.length === 1 && !TONER_DB[`WT ${nextNum}`] && !weight.includes('.')) {
                    weight = `${weight}.${nextNum}`;
                    i += 3;
                } else {
                    i += 2;
                }
                newToners.push({ id: `ocr_${Date.now()}_${i}`, code: `WT ${code}`, role: TONER_DB[`WT ${code}`].role, adjustedWeight: weight });
            } else {
                newToners.push({ id: `ocr_${Date.now()}_${i}`, code: `WT ${code}`, role: TONER_DB[`WT ${code}`].role, adjustedWeight: "" });
                i++;
            }
            addedCount++;
        } else {
            i++;
        }
    }

    if (newToners.length > 0) {
        setToners(prev => {
            let next = [...prev];
            if (next.length === 1 && next[0].code === '') next = [];
            return [...next, ...newToners];
        });
        return addedCount;
    }
    return 0;
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const imageUrl = URL.createObjectURL(file); 
    setScannedImage(imageUrl); 
    setIsScanning(true);
    addChatMessage('system', '⏳ **[AI 비전 스캔 가동]** 영수증의 안료 번호와 중량값을 추출하여 빈칸에 자동 배치합니다.');
    
    try {
      if ((window as any).Tesseract) {
        const result = await (window as any).Tesseract.recognize(file, 'eng', { logger: (m: any) => console.log(m) });
        const count = processOcrData(result.data.text);
        
        if (count > 0) addChatMessage('ai', `📸 **[스캔 매칭 완료]** 영수증 숫자 배열 분석으로 총 ${count}개 데이터를 화면 빈칸에 꽂아 넣었습니다.`);
        else throw new Error("코드 인식 실패");
      } else { throw new Error("OCR 모듈 미적용"); }
    } catch (error) {
      addChatMessage('ai', `❌ **[스캔 경고]** 사진 화질 문제로 유효한 3~4자리 숫자를 찾지 못했습니다. 에디터에서 직접 기입해 주십시오.`);
    }
    setIsScanning(false);
  };

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    addChatMessage('user', q);
    setChatInput('');
    setIsAiProcessing(true);

    setTimeout(() => {
      let advice = "";
      const isIncrease = q.match(/(추가|올리|높이|많이|더|플러스)/);
      const isDecrease = q.match(/(빼|줄이|낮추|적게|덜|마이너스|감소)/);

      const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners;
      let currR=0, currB=0, currY=0, currG=0, currW=0, currS=0, currBk=0;
      activeToners.forEach(t => {
        const w = parseFloat(t.adjustedWeight) || 0;
        if (w <= 0) return;
        const r = t.role || '';
        const c = t.code || '';
        if (r.includes('레드') || r.includes('마젠타') || r.includes('마룬') || c.includes('300')) currR += w;
        else if (r.includes('블루') || r.includes('청') || c.includes('144') || c.includes('341')) currB += w;
        else if (r.includes('옐로우') || r.includes('황') || r.includes('오커') || c.includes('328')) currY += w;
        else if (r.includes('그린') || r.includes('녹')) currG += w;
        else if (r.includes('화이트') || r.includes('백') || c.includes('321') || c.includes('322')) currW += w;
        else if (r.includes('실버') || r.includes('알루미늄') || c.includes('35')) currS += w;
        else if (r.includes('블랙') || r.includes('흑') || c.includes('323') || c.includes('350')) currBk += w;
      });

      const maxTotal = currR + currB + currY + currG + currW + currS + currBk;
      let baseTone = '알 수 없음';
      let toneReason = '입력된 안료가 부족합니다.';

      if (maxTotal > 0) {
        const maxVal = Math.max(currR, currB, currY, currG, currW, currS, currBk);
        if (maxVal === currW && maxVal > maxTotal * 0.4) {
            baseTone = '화이트';
            toneReason = `백색 안료가 총량의 ${Math.round((currW/maxTotal)*100)}%를 차지하여 전체 명도를 지배하고 있습니다.`;
        } else if (maxVal === currS && maxVal > maxTotal * 0.4) {
            baseTone = '실버/메탈릭';
            toneReason = `실버/알루미늄 비중(${Math.round((currS/maxTotal)*100)}%)이 높아 메탈릭 입자감이 주를 이룹니다.`;
        } else if (maxVal === currBk && maxVal > maxTotal * 0.3) {
            baseTone = '블랙/다크';
            toneReason = `흑색계 비중(${Math.round((currBk/maxTotal)*100)}%)이 전체 명도를 묵직하게 누르고 있습니다.`;
        } else {
            const maxColorVal = Math.max(currR, currB, currY, currG);
            if (maxColorVal === currR) { baseTone = '레드/마젠타'; toneReason = '유채색 중 적색계열 비중이 가장 높습니다.'; }
            else if (maxColorVal === currB) { baseTone = '블루'; toneReason = '유채색 중 청색계열 비중이 가장 높습니다.'; }
            else if (maxColorVal === currY) { baseTone = '옐로우/오커'; toneReason = '유채색 중 황색계열 비중이 가장 높습니다.'; }
            else if (maxColorVal === currG) { baseTone = '그린'; toneReason = '유채색 중 녹색계열 비중이 가장 높습니다.'; }
        }
      }

      const regex = /(?:WT\s*)?(\d{3,4})(?:[-x*\s]*(?:을|를)?\s*([0-9.]+)[gG]?)?/gi;
      let match;
      const foundToners = [];

      while ((match = regex.exec(q)) !== null) {
        foundToners.push({ code: match[1], weight: match[2] }); 
      }

      if (foundToners.length > 0 && (isIncrease || isDecrease)) {
        const action = isIncrease ? '증가' : '감소';
        advice = `⚡ **[조색 시뮬레이션: ${action} 타격 브리핑]**\n\n`;
        advice += `📊 **현재 베이스 성향:** [${baseTone}] 우세\n`;
        advice += `<span style="color:#64748b; font-size:12px;">👉 ${toneReason}</span>\n\n`;

        foundToners.forEach(item => {
          let finalKey = `WT ${item.code}`;
          if (!TONER_DB[finalKey] && item.code.length >= 4) finalKey = `WT ${item.code.substring(0,3)}`;

          const tonerInfo = TONER_DB[finalKey];

          if (tonerInfo) {
            const isYellow = tonerInfo.role.includes('옐로우') || tonerInfo.role.includes('황') || tonerInfo.role.includes('오커');
            const isBlue = tonerInfo.role.includes('블루') || tonerInfo.role.includes('청');
            const isRed = tonerInfo.role.includes('레드') || tonerInfo.role.includes('마젠타') || tonerInfo.role.includes('마룬') || tonerInfo.role.includes('적');
            const isBlack = tonerInfo.role.includes('블랙') || tonerInfo.role.includes('흑');
            const isWhite = tonerInfo.role.includes('화이트') || tonerInfo.role.includes('백');

            const currentWeightDelta = parseFloat(item.weight) || 0.5;
            const existingToner = activeToners.find(t => t.code.replace('WT ', '') === finalKey.replace('WT ', ''));
            const oldWeight = existingToner ? parseFloat(existingToner.adjustedWeight) : 0;
            const newWeight = action === '증가' ? oldWeight + currentWeightDelta : Math.max(0, oldWeight - currentWeightDelta);

            const chipStyle = `display:inline-block; width:14px; height:14px; border-radius:3px; background:${getTonerColorChip(finalKey, tonerInfo.role)}; border:1px solid #94a3b8; vertical-align:middle; margin-top:-2px; margin-right:6px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.2);`;
            const weightText = item.weight ? ` **(${item.weight}g)**` : '';
            
            advice += `<div style="display:flex; align-items:center; margin-bottom:4px;"><span style="${chipStyle}"></span><span style="font-weight:bold; font-size:14px; color:#1d4ed8;">🎯 ${finalKey} [${tonerInfo.role}]${weightText} ${action}</span></div>`;
            advice += `▪️ **배합 비율 변화:** 기존 ${oldWeight}g ➡️ **${newWeight.toFixed(2)}g**\n`;
            advice += `▪️ **명암 및 특성 분석:** `;
            if (action === '증가') {
              if (isBlue) advice += `블루 계열이 ${currentWeightDelta}g 추가되면서 쿨톤이 증폭되고 선명한 청색 입자감이 극대화됩니다.\n`;
              else if (isRed) advice += `적/마젠타 톤이 ${currentWeightDelta}g 더해져 붉은 뉘앙스가 딥해지며, 측면(Flop) 채도가 상승합니다.\n`;
              else if (isBlack) advice += `흑색계열 추가로 전체 명도가 급강하합니다. 섀도우 영역이 극도로 묵직하게 가라앉습니다.\n`;
              else if (isYellow && tonerInfo.role.includes('오커')) advice += `오커 추가로, 베이스의 맑은 반사율이 차단되고 정면 명도가 다소 가라앉습니다.\n`;
              else if (isYellow) advice += `따뜻한 웜톤이 부각되며 채도가 상승합니다.\n`;
              else if (isWhite) advice += `백색 입자 추가로 정면 명도가 상승하며 색감이 다소 파스텔톤으로 옅어집니다.\n`;
              else advice += `해당 안료 특유의 고유 색감이 베이스 위로 두드러지게 올라옵니다.\n`;
            } else {
              if (isYellow && tonerInfo.role.includes('오커')) advice += `탁하고 불투명한 오커가 차감되면서 텁텁한 베일이 걷히고 정면 반사율이 살아나 명도가 상승합니다.\n`;
              else if (isYellow) advice += `황색기가 억제되며 베이스가 맑아집니다.\n`;
              else if (isBlue) advice += `차가운 톤이 억제되며, 상대적으로 따뜻한 반사광이 드러나기 시작합니다.\n`;
              else if (isRed) advice += `붉은기가 억제되며, 차갑고 신선한 톤이 드러날 여지를 줍니다.\n`;
              else if (isBlack) advice += `다크 섀도우가 걷혀 명도가 수직 상승하며, 숨겨진 채도가 살아납니다.\n`;
              else advice += `해당 색감이 억제되어 전체적인 톤 밸런스가 역전됩니다.\n`;
            }
          } else {
            advice += `⚠️ **WT ${item.code}**: DB 미확인 코드 (시뮬레이션 불가)\n\n`;
          }
        });
        
      } else if (foundToners.length > 0) {
        advice = `🔍 **[안료 정밀 분석 브리핑]**\n\n`;
        foundToners.forEach(item => {
          let finalKey = `WT ${item.code}`;
          if (!TONER_DB[finalKey] && item.code.length >= 4) finalKey = `WT ${item.code.substring(0,3)}`;
          const tonerInfo = TONER_DB[finalKey];
          
          if (tonerInfo) {
              const chipStyle = `display:inline-block; width:14px; height:14px; border-radius:3px; background:${getTonerColorChip(finalKey, tonerInfo.role)}; border:1px solid #94a3b8; vertical-align:middle; margin-top:-2px; margin-right:6px; box-shadow:inset 0 1px 2px rgba(0,0,0,0.2);`;
              advice += `<div style="display:flex; align-items:center; margin-bottom:4px;"><span style="${chipStyle}"></span><span style="font-weight:bold; font-size:14px;">🎯 ${finalKey} [${tonerInfo.role}]</span></div>`;
              advice += `▪️ **기술 데이터:** ${tonerInfo.desc}\n\n`;
          } else {
              advice += `⚠️ **WT ${item.code}**: DB에 존재하지 않는 코드입니다.\n\n`;
          }
        });
      } else {
        if (q.match(/(정면|페이스|15도).*(밝게|환하게|높이|살리)/)) {
            advice = `💡 **[Master Solution: 정면(Face) 명도 향상]**\n정면의 빛 반사를 극대화하려면 표면이 매끄러운 고휘도 알루미늄(예: WT390, WT355)을 검토하십시오. 솔리드 컬러라면 화이트(WT321)의 비율을 높이십시오.`;
        } else if (q.match(/(측면|플롭|스카시|110도).*(밝게|환하게|살리)/)) {
            advice = `💡 **[Master Solution: 측면(Flop) 명도 향상]**\n측면이 지나치게 어둡게 떨어진다면 플롭 컨트롤(WT386)을 소량 첨가하거나 빛을 난반사시키는 마이크로/화인 실버(WT357, WT354) 계열로 알루미늄 입자를 교체해 보십시오.`;
        } else if (q.match(/(측면|플롭|스카시|110도).*(어둡게|눌러|죽이|떨어)/)) {
            advice = `💡 **[Master Solution: 측면(Flop) 어둡게 억제]**\n측면을 깊고 다크하게 누르려면 흑색(WT323, WT388)의 미세 조정이 필수적입니다. 이펙트 컬러의 경우 '마룬(WT300)'이나 '트랜스페어런트 딥 블루(WT346)' 같은 투명 안료의 비중을 높이십시오.`;
        } else if (q.match(/(탁해|탁함|채도|맑게|선명)/)) {
            advice = `💡 **[Master Solution: 탁색 방지 및 채도 향상]**\n컬러가 탁해지는 주원인은 보색 안료의 충돌이나 화이트/블랙/오커 등 불투명 안료의 과다 사용입니다. WT341, WT309, WT324 등 채도가 높은 계열의 안료로 교체하십시오.`;
        } else {
            advice = `👑 **[HI-TEC 마스터 엔진 대기 중]**\n저는 Spies Hecker 페인트 시스템과 수만 건의 조색 데이터를 마스터한 **전문 조색 AI**입니다.\n수치 계산(예: \`WT328 0.5g 감소\`)이나, 현장에서 마주치는 다양한 광학적 상황에 대해 질문해 주십시오.`;
        }
      }

      setIsAiProcessing(false);
      addChatMessage('ai', advice);
    }, 600);
  };

  const processWeightInput = (rawValue: string) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); 
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') return ''; 
    if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, '');
    if (val.startsWith('.')) val = '0' + val; 
    return val;
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    const cleanValue = processWeightInput(rawValue);
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: cleanValue } : t));
    else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: cleanValue } : t));
  };

  // 💡 [고속 타이핑 1단계] 코드 3자리 완성 시 바로 무게(g)로 커서 점프!
  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim(); 
    const targetToners = isPearl ? pearlToners : toners; 
    const setter = isPearl ? setPearlToners : setToners;
    
    setter(targetToners.map(toner => {
      if (toner.id === id) {
        let matchedTonerInfo = TONER_DB[formattedCode]; 
        let finalCode = formattedCode; 
        
        if (!matchedTonerInfo) {
          // 숫자 3자리 또는 4자리 감지 시 자동 매칭
          const numMatch = formattedCode.match(/\d{3,4}/);
          if (numMatch) {
            const testCode = `WT ${numMatch[0]}`;
            if (TONER_DB[testCode]) {
                finalCode = testCode;
                matchedTonerInfo = TONER_DB[testCode];
                // 🔥 안료가 유효하게 인식되면 자동으로 그람수 인풋으로 포커스 점프!
                setTimeout(() => {
                    if (weightRefs.current[id]) {
                        weightRefs.current[id]?.focus();
                    }
                }, 10);
            }
          }
        } else {
             // 이미 'WT 356' 꼴로 완성된 코드를 타이핑했을 때도 점프!
             setTimeout(() => {
                 if (weightRefs.current[id]) {
                     weightRefs.current[id]?.focus();
                 }
             }, 10);
        }
        
        return matchedTonerInfo ? { ...toner, code: finalCode, role: matchedTonerInfo.role } : { ...toner, code: newCode, role: '코드 입력' };
      }
      return toner;
    }));
  };

  // 💡 [고속 타이핑 2단계] 그람수(g) 입력 완료 후 Enter 치면 자동으로 새 행 추가 및 포커스!
  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          addToner(isPearl);
      }
  };

  const removeToner = (id: string, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id));
    else setToners(toners.filter(t => t.id !== id));
  };
  
  const addToner = (isPearl = false) => {
    const newId = `new_${Date.now()}`;
    const newToner = { id: newId, code: '', role: '안료 코드 입력', adjustedWeight: "" };
    if (isPearl) setPearlToners([...pearlToners, newToner]);
    else setToners([...toners, newToner]);
    // 🔥 새 줄 추가 후 새 코드 입력칸으로 포커스
    setFocusTarget(newId);
  };

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
          <h2 className="text-white text-xl font-black tracking-wide">숫자 헌팅 엔진 가동 중...</h2>
        </div>
      )}

      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 18.2</span></h1>
        </div>
        <button className="flex items-center space-x-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-bold transition-colors shadow-lg"><FolderOpen size={16} /><span>엑셀 DB 동기화</span></button>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-auto lg:h-[calc(100vh-10px)] overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
            
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center">
                <Sliders className="text-blue-600 mr-2" size={16} />
                공식 배합 시트 (B2:D20)
              </h2>
              {isBaseConfirmed && <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-1 rounded flex items-center"><Lock size={12} className="mr-1"/> 시트 고정됨</span>}
            </div>
            
            <div className="flex items-center space-x-1.5">
              <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleCameraCapture} />
              <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md flex-1 items-center justify-center text-sm font-black shadow-md transition-colors flex"><Camera size={18} className="mr-2" />영수증 사진 초정밀 스캔</button>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력 (예: UG-Z)" className="bg-white border border-slate-300 px-3 py-2.5 rounded-md text-xs font-bold focus:outline-none flex-1 uppercase shadow-inner" />
              <button onClick={handleConfirmBase} disabled={isBaseConfirmed} className={`px-4 py-2.5 rounded-md text-sm font-bold flex items-center shadow-md transition-colors ${isBaseConfirmed ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}>
                {isBaseConfirmed ? <Lock size={14} className="mr-1"/> : <Unlock size={14} className="mr-1"/>}<span>기준 확정</span>
              </button>
              <button onClick={handleClearAll} className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-3 py-2.5 rounded-md text-sm font-bold flex items-center transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-white relative min-h-[400px] lg:min-h-0">
            <div className="space-y-3 pb-4">
              <div className="text-xs font-black text-slate-400 mb-1 flex items-center justify-between border-b pb-1.5">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-0.5 rounded border">
                  <span className="mr-1.5 text-[11px] font-bold text-purple-700">3Coat (펄) 모드</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                    <div className={`block w-8 h-5 rounded-full transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isThreeCoatMode ? 'transform translate-x-3' : ''}`}></div>
                  </div>
                </label>
              </div>

              {toners.map((toner) => {
                const tonerInfo = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#1e293b', role: '', desc: '' };
                const isEffect = tonerInfo.type !== 'solid' && tonerInfo.type !== 'binder';

                return (
                  <div key={toner.id} className="group grid grid-cols-12 gap-3 items-start bg-slate-50 hover:bg-blue-50/50 p-2.5 rounded-md border border-slate-200 transition-colors">
                    <div className="col-span-3 mt-0.5 relative">
                      <div 
                        className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded shadow-sm border border-slate-300 pointer-events-auto cursor-pointer hover:scale-125 transition-transform z-10" 
                        style={{background: getTonerColorChip(toner.code, tonerInfo.role)}}
                        title="클릭하여 안료 상세 뷰어 열기"
                        onClick={() => {
                          let finalCode = toner.code.toUpperCase().trim();
                          if (!finalCode.startsWith('WT ')) {
                             const match = finalCode.match(/\d+/);
                             if(match) finalCode = `WT ${match[0]}`;
                          }
                          if(TONER_DB[finalCode]) setSelectedTonerForView(finalCode);
                        }}
                      ></div>
                      {/* 💡 [고속 타이핑] ref 연동 */}
                      <input 
                        type="text" 
                        ref={(el) => {
                            codeRefs.current[toner.id] = el;
                        }}
                        value={toner.code} 
                        onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} 
                        placeholder="Code" 
                        className="w-full bg-white text-slate-900 text-[14px] font-black pl-9 pr-2 py-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none uppercase shadow-sm" 
                      />
                    </div>
                    <div className="col-span-6 flex flex-col justify-start py-0.5">
                      <div className="text-[14px] font-bold text-blue-700 leading-tight break-keep" title={tonerInfo.role}>{tonerInfo.role}</div>
                      <div className="text-[12px] text-slate-600 leading-snug mt-1.5 break-keep truncate" title={tonerInfo.desc}>
                        {tonerInfo.desc || '특성 정보 없음'}
                      </div>
                    </div>
                    <div className="col-span-3 flex justify-end items-center space-x-1 mt-0.5">
                      {/* 💡 [고속 타이핑] ref 및 onKeyDown 연동 */}
                      <input 
                        type="text" 
                        inputMode="decimal" 
                        ref={(el) => { weightRefs.current[toner.id] = el; }}
                        value={toner.adjustedWeight} 
                        onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} 
                        onKeyDown={(e) => handleWeightKeyDown(e, toner.id, false)}
                        placeholder="" 
                        className="bg-white border border-slate-300 text-slate-900 font-bold px-2 py-1.5 rounded-md text-[14px] w-16 text-right focus:outline-none focus:border-blue-500 clean-number-input shadow-sm" 
                      />
                      <span className="text-slate-500 text-[12px] font-bold">g</span>
                      <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold flex items-center justify-center space-x-1 text-xs hover:border-blue-500 transition-colors"><Plus size={14} /><span>베이스 안료 추가</span></button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-3 border-t-2 border-dashed border-purple-200 space-y-3 pb-8">
                <div className="text-xs font-black text-purple-700 mb-2 flex items-center">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const tonerInfo = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#1e293b', role: '', desc: '' };
                  
                  return (
                    <div key={toner.id} className="group grid grid-cols-12 gap-3 items-start bg-purple-50/40 p-2.5 rounded-md border border-purple-100 transition-colors">
                      <div className="col-span-3 mt-0.5 relative">
                        <div 
                          className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded shadow-sm border border-slate-300 pointer-events-auto cursor-pointer hover:scale-125 transition-transform z-10" 
                          style={{background: getTonerColorChip(toner.code, tonerInfo.role)}}
                          title="클릭하여 안료 상세 뷰어 열기"
                          onClick={() => {
                            let finalCode = toner.code.toUpperCase().trim();
                            if (!finalCode.startsWith('WT ')) {
                               const match = finalCode.match(/\d+/);
                               if(match) finalCode = `WT ${match[0]}`;
                            }
                            if(TONER_DB[finalCode]) setSelectedTonerForView(finalCode);
                          }}
                        ></div>
                        <input 
                          type="text" 
                          ref={(el) => { codeRefs.current[toner.id] = el; }}
                          value={toner.code} 
                          onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} 
                          placeholder="Code" 
                          className="w-full bg-white text-slate-900 text-[14px] font-black pl-9 pr-2 py-1.5 border border-purple-200 rounded focus:border-purple-500 focus:outline-none uppercase shadow-sm" 
                        />
                      </div>
                      <div className="col-span-6 flex flex-col justify-start py-0.5">
                        <div className="text-[14px] font-bold text-purple-700 leading-tight break-keep" title={tonerInfo.role}>{tonerInfo.role}</div>
                        <div className="text-[12px] text-slate-600 leading-snug mt-1.5 break-keep truncate" title={tonerInfo.desc}>
                          {tonerInfo.desc || '특성 정보 없음'}
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-end items-center space-x-1 mt-0.5">
                        <input 
                          type="text" 
                          inputMode="decimal" 
                          ref={(el) => { weightRefs.current[toner.id] = el; }}
                          value={toner.adjustedWeight} 
                          onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)} 
                          onKeyDown={(e) => handleWeightKeyDown(e, toner.id, true)}
                          placeholder="" 
                          className="bg-white border border-purple-200 text-slate-900 font-bold px-2 py-1.5 rounded-md text-[14px] w-16 text-right focus:outline-none focus:border-purple-500 clean-number-input shadow-sm" 
                        />
                        <span className="text-slate-400 text-[12px] font-bold">g</span>
                        <button onClick={() => removeToner(toner.id, true)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addToner(true)} className="w-full py-2.5 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 rounded-md text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-2 shadow-sm">
                  <Plus size={16} /><span>펄 조색제 추가</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-800 text-slate-100 flex justify-between items-center shrink-0">
             <div className="text-xs font-bold uppercase text-slate-400">Total Weight (Base + Pearl)</div>
             <div className="text-lg font-black">{totalFinalWeight} g</div>
          </div>
        </div>

        {/* 우측: 멀티 시각화 렌더링 & AI 터미널 */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-4">
          
          <div className={`bg-white border ${isBaseConfirmed ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-300'} rounded-xl p-4 shadow-xl flex-none transition-all duration-300`}>
            <h3 className="text-[15px] font-bold mb-3 flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={18} />멀티 시각화 렌더링 비교</span>
              <button onClick={() => { if(isBaseConfirmed){ setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); } }} className={`text-xs px-3 py-1.5 rounded bg-slate-100 border border-slate-200 font-bold flex items-center ${isBaseConfirmed ? 'text-blue-600 hover:bg-blue-50 cursor-pointer' : 'text-slate-400 cursor-not-allowed'}`}><Maximize size={12} className="mr-1"/>확장 뷰어</button>
            </h3>
            
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-1">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">A. 베이스 코트 (Ground Coat)</span>
                   <span className="text-[10px] text-slate-400 font-bold">{totalBaseWeight}g</span>
                 </div>
                 <div 
                  className={`h-12 rounded-lg border ${isBaseConfirmed ? 'border-slate-300 shadow-inner' : 'border-slate-200 opacity-60'} relative overflow-hidden`}
                  style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}
                 >
                   {baseOptics.isMetallic && <div className="metallic-flake opacity-50"></div>}
                 </div>
              </div>

              {isThreeCoatMode && (
                <div className="flex flex-col space-y-1 relative">
                   <div className="flex justify-between items-center px-1">
                     <span className="text-[11px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded flex items-center"><Zap size={10} className="mr-1"/>B. 펄 코트 (Mid Coat)</span>
                     <span className="text-[10px] text-purple-400 font-bold">{totalPearlWeight}g</span>
                   </div>
                   <div 
                    className={`h-12 rounded-lg border ${isBaseConfirmed ? 'border-purple-300 shadow-inner' : 'border-slate-200'} relative overflow-hidden`}
                    style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` : '#f1f5f9' }}
                   >
                     {isBaseConfirmed && pearlOptics.isMetallic && <div className="metallic-flake opacity-70"></div>}
                     {!isBaseConfirmed && (
                       <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-[2px] flex items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-lg">
                         <Lock size={16} className="mr-1" /><span className="text-[10px] font-bold">확정 대기중</span>
                       </div>
                     )}
                   </div>
                </div>
              )}

              <div className="flex flex-col space-y-1 relative">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{isThreeCoatMode ? 'C. 최종 3코트 결합 (Final Color)' : 'B. 최종 렌더링 (Final Color)'}</span>
                   <span className="text-[10px] text-blue-400 font-bold">{totalFinalWeight}g</span>
                 </div>
                 <div 
                  className={`h-16 rounded-lg border ${isBaseConfirmed ? 'border-blue-400 shadow-inner' : 'border-slate-200'} relative overflow-hidden`}
                  style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` : '#f1f5f9' }}
                 >
                   {isBaseConfirmed && finalOptics.isMetallic && <div className="metallic-flake opacity-60"></div>}
                   {!isBaseConfirmed && (
                     <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-[2px] flex items-center justify-center text-slate-400 border border-dashed border-slate-300 rounded-lg">
                       <Lock size={16} className="mr-1" /><span className="text-[10px] font-bold">확정 대기중</span>
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 flex flex-col flex-1 shadow-xl overflow-hidden min-h-[350px] lg:min-h-0">
            <h3 className="text-[14px] font-bold flex items-center mb-3 text-slate-800"><BrainCircuit className="text-blue-600 mr-2" size={18} />엔진 터미널 (VBA Macro Engine)</h3>
            <div ref={chatContainerRef} className="flex-1 bg-slate-50 border border-slate-200 p-4 overflow-y-auto mb-3 space-y-4 custom-scrollbar shadow-inner relative rounded-lg scroll-smooth">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`p-3 rounded-lg border text-[13px] leading-relaxed ${msg.type === 'system' ? 'bg-slate-800 border-slate-700 text-slate-100 font-medium' : msg.type === 'user' ? 'bg-blue-600 border-blue-700 text-white ml-10 shadow-md' : 'bg-white border-slate-200 text-slate-800 mr-6 shadow-sm font-medium'}`}>
                   <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<span class="font-extrabold text-blue-700">$1</span>').replace(/\n/g, '<br/>') }} />
                </div>
              ))}
              {isAiProcessing && (
                <div className="p-3 rounded-lg border bg-slate-100 border-slate-200 text-slate-600 shadow-sm mr-10 flex items-center">
                  <RefreshCw className="animate-spin mr-2 h-4 w-4 text-blue-500" />
                  <span className="text-sm font-bold animate-pulse">엑셀 DB 유효성 검증 및 렌더링 산출 중...</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 relative shrink-0">
              <input 
                type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskSolution()} 
                placeholder="명령어 입력 (예: WT144 0.5g 추가)" 
                className="w-full bg-white border border-slate-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 shadow-inner" 
                disabled={isAiProcessing}
              />
              <button onClick={handleAskSolution} disabled={isAiProcessing} className={`text-white px-5 rounded-md text-sm font-bold transition-colors shadow-md ${isAiProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>실행</button>
            </div>
          </div>
        </div>
      </div>

      {/* 💡 개별 안료 컬러칩 정밀 뷰어 모달 */}
      {selectedTonerForView && TONER_DB[selectedTonerForView] && (
        <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-[650px] max-w-[95%] shadow-2xl overflow-hidden border border-slate-700">
              <div className="bg-slate-900 p-5 flex justify-between items-center">
                 <h3 className="text-white font-bold text-lg flex items-center"><Droplet className="mr-2 text-blue-400"/> {selectedTonerForView} 단일 안료 정밀 분석 뷰어</h3>
                 <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
              </div>
              <div className="p-6">
                 <div className="flex items-center mb-3">
                    <div className="w-6 h-6 rounded border border-slate-300 shadow-sm mr-3" style={{background: getTonerColorChip(selectedTonerForView, TONER_DB[selectedTonerForView].role)}}></div>
                    <div className="text-2xl font-black text-blue-700">{TONER_DB[selectedTonerForView].role}</div>
                 </div>
                 <p className="text-slate-700 text-sm mb-6 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-inner">{TONER_DB[selectedTonerForView].desc}</p>
                 
                 <div className="flex gap-5">
                    <div className="flex-1">
                       <div className="text-xs font-bold text-slate-500 mb-2 text-center uppercase tracking-widest bg-slate-100 py-1 rounded">정면 (Face 15°)</div>
                       <div className="h-44 rounded-xl shadow-inner border border-slate-300 relative overflow-hidden"
                            style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'face')}}>
                          {isTonerMetallic(TONER_DB[selectedTonerForView].role) && <div className="metallic-flake opacity-50"></div>}
                       </div>
                    </div>
                    <div className="flex-1">
                       <div className="text-xs font-bold text-slate-500 mb-2 text-center uppercase tracking-widest bg-slate-100 py-1 rounded">측면 (Flop 110°)</div>
                       <div className="h-44 rounded-xl shadow-inner border border-slate-300 relative overflow-hidden"
                            style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'flop')}}>
                          {isTonerMetallic(TONER_DB[selectedTonerForView].role) && <div className="metallic-flake opacity-25"></div>}
                       </div>
                    </div>
                 </div>
                 <div className="mt-5 text-center">
                    <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-md transition-all text-sm">닫기</button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 💡 확장 뷰어 퀵 에디터 패널 (Before/After) */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white font-sans animate-in fade-in duration-300 backdrop-blur-xl select-none">
          <header className="p-6 flex justify-between items-center bg-black/50 border-b border-slate-800">
            <h2 className="text-xl font-bold tracking-widest text-slate-300 uppercase flex items-center"><Camera className="mr-3 text-blue-500"/> HI-TEC MULTI 3D VIEW</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-500 rounded-full transition-colors border border-slate-700"><X size={24}/></button>
          </header>
          
          <div className="w-full bg-slate-900 border-b border-slate-700 p-3 overflow-x-auto flex gap-3 items-center custom-scrollbar shrink-0 shadow-xl">
             <div className="text-[10px] font-black text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50 shrink-0 mr-1 text-center leading-tight">베이스<br/>수정</div>
             {toners.filter(t => t.code).map(t => (
                <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-2 shrink-0 min-w-[240px] items-center shadow-inner">
                   <span className="text-[11px] font-bold text-slate-300 mb-2">{t.code}</span>
                   
                   <div className="flex items-center space-x-1 w-full justify-between">
                      <div className="flex space-x-1">
                        <button onClick={() => quickEditWeight(t.id, -10, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-10</button>
                        <button onClick={() => quickEditWeight(t.id, -1, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-1</button>
                        <button onClick={() => quickEditWeight(t.id, -0.1, false)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-red-800/50">-0.1</button>
                      </div>
                      
                      <div className="flex items-center px-1">
                         <input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, false)} placeholder="" className="w-10 text-center bg-transparent text-sm font-black text-white outline-none" />
                         <span className="text-slate-400 text-[10px] font-bold">g</span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button onClick={() => quickEditWeight(t.id, 0.1, false)} className="bg-blue-900/50 hover:bg-blue-500 text-blue-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-blue-800/50">+0.1</button>
                        <button onClick={() => quickEditWeight(t.id, 1, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">+1</button>
                        <button onClick={() => quickEditWeight(t.id, 10, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">+10</button>
                      </div>
                   </div>
                </div>
             ))}
             {isThreeCoatMode && (
               <>
                 <div className="w-px h-12 bg-slate-700 mx-2 shrink-0"></div>
                 <div className="text-[10px] font-black text-purple-400 bg-purple-900/30 px-2 py-1 rounded border border-purple-800/50 shrink-0 mr-1 text-center leading-tight">펄 코트<br/>수정</div>
                 {pearlToners.filter(t => t.code).map(t => (
                    <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-2 shrink-0 min-w-[240px] items-center shadow-inner">
                       <span className="text-[11px] font-bold text-purple-300 mb-2">{t.code}</span>
                       <div className="flex items-center space-x-1 w-full justify-between">
                          <div className="flex space-x-1">
                            <button onClick={() => quickEditWeight(t.id, -10, true)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-10</button>
                            <button onClick={() => quickEditWeight(t.id, -1, true)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-1</button>
                            <button onClick={() => quickEditWeight(t.id, -0.1, true)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-red-800/50">-0.1</button>
                          </div>
                          
                          <div className="flex items-center px-1">
                             <input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, true)} placeholder="" className="w-10 text-center bg-transparent text-sm font-black text-white outline-none" />
                             <span className="text-slate-400 text-[10px] font-bold">g</span>
                          </div>
                          
                          <div className="flex space-x-1">
                            <button onClick={() => quickEditWeight(t.id, 0.1, true)} className="bg-purple-900/50 hover:bg-purple-500 text-purple-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-purple-800/50">+0.1</button>
                            <button onClick={() => quickEditWeight(t.id, 1, true)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">+1</button>
                            <button onClick={() => quickEditWeight(t.id, 10, true)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">+10</button>
                          </div>
                       </div>
                    </div>
                 ))}
               </>
             )}
          </div>

          <main 
            ref={viewerRef}
            className="flex-1 p-6 flex gap-4 overflow-hidden items-center justify-center h-full relative cursor-crosshair w-full max-w-[1600px] mx-auto"
            onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }}
            onPointerMove={handlePointerMove}
            onPointerUp={() => setIsDraggingLight(false)}
            onPointerLeave={() => setIsDraggingLight(false)}
          >
             <div 
               className="absolute z-50 flex items-center justify-center transition-transform duration-75 pointer-events-none"
               style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}
             >
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.8)] backdrop-blur-sm border border-white/40 animate-pulse">
                    <Sun className="text-yellow-100 drop-shadow-[0_0_15px_rgba(255,255,255,1)]" size={40} />
                </div>
             </div>

             <div className="flex-1 h-[85%] rounded-[2rem] border border-slate-700 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-75"
                  style={{ background: getInteractiveBackground(originalFinalOptics, lightPos) }}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                {originalFinalOptics?.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" style={{ opacity: lerp(0.4, 0.05, Math.min(1, Math.sqrt(Math.pow(lightPos.x - 50, 2) + Math.pow(lightPos.y - 50, 2)) / 50)) }}></div>}
                <div className="absolute top-6 left-6 bg-black/80 px-4 py-2 rounded-xl font-bold text-sm border border-slate-600 text-slate-200 shadow-lg">A. 원본 배합 (변경 전)</div>
             </div>
             
             {isThreeCoatMode && (
               <>
                 <div className="text-slate-600 pointer-events-none shrink-0"><ChevronRight size={32} /></div>

                 <div className="flex-1 h-[85%] rounded-[2rem] border border-purple-500 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-75"
                      style={{ background: getInteractiveBackground(pearlOptics, lightPos) }}>
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                    {pearlOptics.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" style={{ opacity: lerp(0.7, 0.1, Math.min(1, Math.sqrt(Math.pow(lightPos.x - 50, 2) + Math.pow(lightPos.y - 50, 2)) / 50)) }}></div>}
                    <div className="absolute top-6 left-6 bg-purple-900/90 px-4 py-2 rounded-xl font-bold text-sm border border-purple-400 text-white shadow-lg">B. 펄 코트 (Mid-coat)</div>
                 </div>
               </>
             )}

             <div className="text-slate-600 pointer-events-none shrink-0"><ChevronRight size={32} /></div>

             <div className="flex-1 h-[85%] rounded-[2rem] border border-blue-500 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-75"
                  style={{ background: getInteractiveBackground(finalOptics, lightPos) }}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                {finalOptics.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" style={{ opacity: lerp(0.7, 0.1, Math.min(1, Math.sqrt(Math.pow(lightPos.x - 50, 2) + Math.pow(lightPos.y - 50, 2)) / 50)) }}></div>}
                <div className="absolute top-6 left-6 bg-blue-900/90 px-4 py-2 rounded-xl font-bold text-sm border border-blue-400 text-white shadow-lg">{isThreeCoatMode ? 'C. 최종 3코트 (Base + Pearl)' : 'B. 최종 렌더링 (Base Only)'}</div>
             </div>
             
             <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-slate-900/90 p-4 rounded-2xl border border-slate-700 backdrop-blur-md z-50 shadow-2xl">
                <span className="text-xs text-blue-400 font-bold mb-3 uppercase tracking-wider animate-pulse flex items-center"><Sun size={14} className="mr-1"/>빈 공간을 드래그하여 광원을 유기적으로 움직여 보세요</span>
                <div className="flex space-x-3">
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 50, y: 50}); }} className="px-6 py-2.5 rounded-xl font-bold uppercase transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-blue-400">정면 (Face 15°)</button>
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 25, y: 25}); }} className="px-6 py-2.5 rounded-xl font-bold uppercase transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-blue-400">중면 (Mid 45°)</button>
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 5, y: 5}); }} className="px-6 py-2.5 rounded-xl font-bold uppercase transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-blue-400">측면 (Flop 110°)</button>
                </div>
             </div>
          </main>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
        .metallic-flake {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; mix-blend-mode: color-dodge;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }
      `}} />
    </div>
  );
}
