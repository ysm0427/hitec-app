// src/App.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sliders, Trash2, Plus, X, Maximize, Beaker, Sun, 
  Layers, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, 
  FileSpreadsheet, History, Mail, Code, Calendar, Eye, ThumbsUp, 
  CheckCircle, Edit3, Target, MessageSquare, Send, Save, RefreshCw, Camera, AlertTriangle, Image as ImageIcon, Cloud, CloudUpload, CloudDownload,
  QrCode, Smartphone, Monitor, Link, Check, Users, Lock, ShieldCheck, MapPin, Briefcase, Hash, UserCheck, Loader2
} from 'lucide-react';

import { TONER_DB, shortcuts, PEARL_LEVELS, OEM_COLORS } from './tonerDB';

if (typeof window !== 'undefined' && !document.querySelector('#tailwind-script')) {
  const script = document.createElement('script');
  script.id = 'tailwind-script';
  script.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(script);
}

const LAST_PATCH_DATE = "2026.10.19 (기능 100% 원상복구 및 빌드/검색 패치 완료)"; 

const MASTER_KEY = "조색프로2026";

const GUIDE_IMAGES: Record<string, any[]> = {
  theory: [
    { id: 1, title: '색의 인식과 3원색', desc: '빛의 혼합 / 안료 혼합 원리', url: '/image1.jpg' },
    { id: 2, title: '단색안료 특성', desc: '유기안료와 무기안료의 차이점', url: '/image2.jpg' },
    { id: 3, title: '빛과 안료 상호작용', desc: '솔리드 / 알루미늄 / 간섭펄 반사 원리', url: '/image3.jpg' },
    { id: 15, title: '추가 이론 자료 1', desc: '상세 가이드 페이지 (15)', url: '/image15.jpg' },
    { id: 16, title: '추가 이론 자료 2', desc: '상세 가이드 페이지 (16)', url: '/image16.jpg' },
    { id: 17, title: '추가 이론 자료 3', desc: '상세 가이드 페이지 (17)', url: '/image17.jpg' },
    { id: 18, title: '추가 이론 자료 4', desc: '상세 가이드 페이지 (18)', url: '/image18.jpg' },
    { id: 19, title: '추가 이론 자료 5', desc: '상세 가이드 페이지 (19)', url: '/image19.jpg' },
    { id: 20, title: '추가 이론 자료 6', desc: '상세 가이드 페이지 (20)', url: '/image20.jpg' },
    { id: 21, title: '추가 이론 자료 7', desc: '상세 가이드 페이지 (21)', url: '/image21.jpg' },
    { id: 22, title: '추가 이론 자료 8', desc: '상세 가이드 페이지 (22)', url: '/image22.jpg' },
    { id: 23, title: '추가 이론 자료 9', desc: '상세 가이드 페이지 (23)', url: '/image23.jpg' },
    { id: 24, title: '추가 이론 자료 10', desc: '상세 가이드 페이지 (24)', url: '/image24.jpg' },
    { id: 25, title: '추가 이론 자료 11', desc: '상세 가이드 페이지 (25)', url: '/image25.jpg' },
  ],
  spectrum: [
    { id: 4, title: '조색제 포스터의 이해', desc: '기호 읽는 법', url: '/image4.jpg' },
    { id: 5, title: '솔리드 포지셔닝 맵', desc: '솔리드 컬러 별 위치도', url: '/image5.jpg' },
    { id: 6, title: '황색/적색 계열도', desc: '명암 및 채도 방향성에 따른 비교', url: '/image6.jpg' },
    { id: 7, title: '청색/녹색/흑색 계열도', desc: '각 계열별 측면/정면 이색 비교', url: '/image7.jpg' },
    { id: 26, title: '추가 컬러 맵 자료 1', desc: '상세 가이드 페이지 (26)', url: '/image26.jpg' },
    { id: 27, title: '추가 컬러 맵 자료 2', desc: '상세 가이드 페이지 (27)', url: '/image27.jpg' },
    { id: 28, title: '추가 컬러 맵 자료 3', desc: '상세 가이드 페이지 (28)', url: '/image28.jpg' },
    { id: 29, title: '추가 컬러 맵 자료 4', desc: '상세 가이드 페이지 (29)', url: '/image29.jpg' },
    { id: 30, title: '추가 컬러 맵 자료 5', desc: '상세 가이드 페이지 (30)', url: '/image30.jpg' },
    { id: 31, title: '추가 컬러 맵 자료 6', desc: '상세 가이드 페이지 (31)', url: '/image31.jpg' },
    { id: 32, title: '추가 컬러 맵 자료 7', desc: '상세 가이드 페이지 (32)', url: '/image32.jpg' },
    { id: 33, title: '추가 컬러 맵 자료 8', desc: '상세 가이드 페이지 (33)', url: '/image33.jpg' },
    { id: 34, title: '추가 컬러 맵 자료 9', desc: '상세 가이드 페이지 (34)', url: '/image34.jpg' },
    { id: 35, title: '추가 컬러 맵 자료 10', desc: '상세 가이드 페이지 (35)', url: '/image35.jpg' },
    { id: 36, title: '추가 컬러 맵 자료 11', desc: '상세 가이드 페이지 (36)', url: '/image36.jpg' },
    { id: 37, title: '추가 컬러 맵 자료 12', desc: '상세 가이드 페이지 (37)', url: '/image37.jpg' },
  ],
  effect: [
    { id: 8, title: '이펙트 포지셔닝 맵', desc: '이펙트 컬러 조색제 별 위치도', url: '/image8.jpg' },
    { id: 9, title: '알루미늄 입자 특성', desc: '콘플레이크 vs 실버달러 형상 비교', url: '/image9.jpg' },
    { id: 10, title: '펄(Pearl) 입자 특성', desc: '천연 마이카 vs 시라릭 펄 현미경', url: '/image10.jpg' },
    { id: 11, title: 'PP펄 (파우더) 특성', desc: 'PP201~PP901 입자 및 현미경 비교', url: '/image11.jpg' },
    { id: 38, title: '추가 이펙트 자료 1', desc: '상세 가이드 페이지 (38)', url: '/image38.jpg' },
    { id: 39, title: '추가 이펙트 자료 2', desc: '상세 가이드 페이지 (39)', url: '/image39.jpg' },
    { id: 40, title: '추가 이펙트 자료 3', desc: '상세 가이드 페이지 (40)', url: '/image40.jpg' },
    { id: 41, title: '추가 이펙트 자료 4', desc: '상세 가이드 페이지 (41)', url: '/image41.jpg' },
    { id: 42, title: '추가 이펙트 자료 5', desc: '상세 가이드 페이지 (42)', url: '/image42.jpg' },
    { id: 43, title: '추가 이펙트 자료 6', desc: '상세 가이드 페이지 (43)', url: '/image43.jpg' },
    { id: 44, title: '추가 이펙트 자료 7', desc: '상세 가이드 페이지 (44)', url: '/image44.jpg' },
    { id: 45, title: '추가 이펙트 자료 8', desc: '상세 가이드 페이지 (45)', url: '/image45.jpg' },
    { id: 46, title: '추가 이펙트 자료 9', desc: '상세 가이드 페이지 (46)', url: '/image46.jpg' },
    { id: 47, title: '추가 이펙트 자료 10', desc: '상세 가이드 페이지 (47)', url: '/image47.jpg' },
    { id: 48, title: '추가 이펙트 자료 11', desc: '상세 가이드 페이지 (48)', url: '/image48.jpg' },
    { id: 49, title: '추가 이펙트 자료 12', desc: '상세 가이드 페이지 (49)', url: '/image49.jpg' },
  ],
  special: [
    { id: 12, title: 'WT386 특성', desc: '측면밝기조정제 명암 변화 원리', url: '/image12.jpg' },
    { id: 13, title: '3코트 컬러 특성', desc: '3코트 도장 및 얼룩 발생 주의사항', url: '/image13.jpg' },
    { id: 14, title: '틴티드 크리어 (Tinted Clear)', desc: '착색 클리어 시스템', url: '/image14.jpg' },
    { id: 50, title: '추가 특수 자료 1', desc: '상세 가이드 페이지 (50)', url: '/image50.jpg' },
    { id: 51, title: '추가 특수 자료 2', desc: '상세 가이드 페이지 (51)', url: '/image51.jpg' },
    { id: 52, title: '추가 특수 자료 3', desc: '상세 가이드 페이지 (52)', url: '/image52.jpg' },
    { id: 53, title: '추가 특수 자료 4', desc: '상세 가이드 페이지 (53)', url: '/image53.jpg' },
    { id: 54, title: '추가 특수 자료 5', desc: '상세 가이드 페이지 (54)', url: '/image54.jpg' },
    { id: 55, title: '추가 특수 자료 6', desc: '상세 가이드 페이지 (55)', url: '/image55.jpg' },
    { id: 56, title: '추가 특수 자료 7', desc: '상세 가이드 페이지 (56)', url: '/image56.jpg' },
    { id: 57, title: '추가 특수 자료 8', desc: '상세 가이드 페이지 (57)', url: '/image57.jpg' },
    { id: 58, title: '추가 특수 자료 9', desc: '상세 가이드 페이지 (58)', url: '/image58.jpg' },
    { id: 59, title: '추가 특수 자료 10', desc: '상세 가이드 페이지 (59)', url: '/image59.jpg' },
    { id: 60, title: '추가 특수 자료 11', desc: '상세 가이드 페이지 (60)', url: '/image60.jpg' },
    { id: 61, title: '추가 특수 자료 12', desc: '상세 가이드 페이지 (61)', url: '/image61.jpg' },
  ]
};

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => { return { code, ...data }; });
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
export const formatWeight = (val: any): string => { const num = Number(val); if (isNaN(num)) return "0"; return Number(num.toFixed(2)).toString(); };
export const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('분말') || r.includes('글라스'); };

const textureCache: any = {};
export const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
  if (!isMetallic || type === 'binder' || type === 'solid' || type === 'candy') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
  const key = `${type}_${faceColor}_${flopColor}`; if (textureCache[key]) return textureCache[key];
  let baseFreq = '0.8', alphaMult = '4', surfaceScale = '1.5', specConst = '1.2';
  if (type === 'xirallic') { baseFreq = '0.6'; alphaMult = '8'; surfaceScale = '3'; specConst = '1.8'; }
  else if (type === 'pearl') { baseFreq = '0.5'; alphaMult = '6'; surfaceScale = '2'; specConst = '1.5'; }
  else if (type === 'silver_fine') { baseFreq = '1.2'; alphaMult = '3'; surfaceScale = '1.2'; specConst = '1.0'; }
  else if (type === 'silver_coarse') { baseFreq = '0.4'; alphaMult = '8'; surfaceScale = '2.5'; specConst = '1.6'; }
  const safeFaceColor = faceColor || '#ffffff'; const safeFlopColor = flopColor || '#ffffff';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -1"/><feSpecularLighting surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="25" lighting-color="%23ffffff"><feDistantLight azimuth="45" elevation="55"/></feSpecularLighting></filter><rect width="100%25" height="100%25" fill="${encodeURIComponent(safeFaceColor)}"/><rect width="100%25" height="100%25" filter="url(%23f)" opacity="0.6"/></svg>`;
  const result = { backgroundColor: safeFaceColor, backgroundImage: `url("data:image/svg+xml;utf8,${svg}"), radial-gradient(circle at 50% 20%, ${safeFaceColor} 0%, ${safeFlopColor} 80%, #000000 100%)`, backgroundBlendMode: 'overlay, normal' as any, boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.8)' };
  textureCache[key] = result; return result;
};

export const getBadgeClass = (title: string) => {
  if(title.includes("특성") || title.includes("분말") || title.includes("캔디") || title.includes("배합")) return "bg-teal-50 text-teal-700 border-teal-300 shadow-sm";
  if(title.includes("용도") || title.includes("컬러") || title.includes("확인")) return "bg-indigo-50 text-indigo-700 border-indigo-300 shadow-sm";
  if(title.includes("외관")) return "bg-blue-50 text-blue-700 border-blue-300 shadow-sm";
  if(title.includes("비교") || title.includes("유동성") || title.includes("원리")) return "bg-yellow-100 text-yellow-800 border-yellow-400 shadow-md font-black";
  if(title.includes("경고") || title.includes("주의") || title.includes("한계") || title.includes("철칙")) return "bg-red-50 text-red-700 border-red-300 shadow-sm font-black";
  return "bg-slate-50 text-slate-700 border-slate-300 shadow-sm";
};

export const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || ''; let h = 0; let s = 0; let baseL = 50;
  if (code.includes('144')) { h = 215; s = 85; baseL = 35; } 
  else if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('적') || r.includes('마룬') || r.includes('캔디')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹') || r.includes('에메랄드')) { h = 150; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('황') || r.includes('오렌지')) { h = 45; s = 80; baseL = 50; }
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

export const packToners = (tonerList: any[]) => { return tonerList.filter((t: any) => t.code).map((t: any) => { const w = t.adjustedWeight || ''; return `${t.code}_${w}`; }).join('*'); };
export const unpackToners = (str: string) => { if (!str) return []; return str.split('*').map((t, i) => { const [c, w] = t.split('_'); return { id: `restored_${Date.now()}_${i}`, code: c || '', adjustedWeight: w || '', history: [], memo: '', isExpanded: false }; }); };

const MUNSELL_WHEEL_COLORS = [
    { name: '빨강', symbol: 'R', hex: '#E60012' }, { name: '다홍', symbol: 'yR', hex: '#EB6100' }, { name: '주황', symbol: 'YR', hex: '#F39800' }, { name: '귤색', symbol: 'rY', hex: '#FCC800' }, { name: '노랑', symbol: 'Y', hex: '#FFF100' }, { name: '노랑연두', symbol: 'gY', hex: '#CFDB00' }, { name: '연두', symbol: 'GY', hex: '#8FC31F' }, { name: '풀색', symbol: 'yG', hex: '#22AC38' }, { name: '녹색', symbol: 'G', hex: '#009944' }, { name: '초록', symbol: 'bG', hex: '#009B6B' }, { name: '청록', symbol: 'BG', hex: '#009E96' }, { name: '바다색', symbol: 'gB', hex: '#00A0C1' }, { name: '파랑', symbol: 'B', hex: '#00A0E9' }, { name: '감청', symbol: 'pB', hex: '#0086D1' }, { name: '남색', symbol: 'PB', hex: '#0068B7' }, { name: '남보라', symbol: 'bP', hex: '#00479D' }, { name: '보라', symbol: 'P', hex: '#1D2088' }, { name: '붉은보라', symbol: 'rP', hex: '#601986' }, { name: '자주', symbol: 'RP', hex: '#920783' }, { name: '연지', symbol: 'pR', hex: '#BE0081' }
];

const MIXING_DATA: Record<string, any> = {
    'R': { c1: '빨강 (R)', h1: '#ff0000', r1: 100 }, 'yR': { c1: '빨강 (R)', h1: '#ff0000', r1: 75, c2: '노랑 (Y)', h2: '#ffff00', r2: 25 }, 'YR': { c1: '빨강 (R)', h1: '#ff0000', r1: 50, c2: '노랑 (Y)', h2: '#ffff00', r2: 50 }, 'rY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 75, c2: '빨강 (R)', h2: '#ff0000', r2: 25 }, 'Y': { c1: '노랑 (Y)', h1: '#ffff00', r1: 100 }, 'gY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 75, c2: '녹색 (G)', h2: '#009900', r2: 25 }, 'GY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 50, c2: '녹색 (G)', h2: '#009900', r2: 50 }, 'yG': { c1: '녹색 (G)', h1: '#009900', r1: 75, c2: '노랑 (Y)', h2: '#ffff00', r2: 25 }, 'G': { c1: '녹색 (G)', h1: '#009900', r1: 100 }, 'bG': { c1: '녹색 (G)', h1: '#009900', r1: 75, c2: '파랑 (B)', h2: '#0000ff', r2: 25 }, 'BG': { c1: '녹색 (G)', h1: '#009900', r1: 50, c2: '파랑 (B)', h2: '#0000ff', r2: 50 }, 'gB': { c1: '파랑 (B)', h1: '#0000ff', r1: 75, c2: '녹색 (G)', h2: '#009900', r2: 25 }, 'B': { c1: '파랑 (B)', h1: '#0000ff', r1: 100 }, 'pB': { c1: '파랑 (B)', h1: '#0000ff', r1: 75, c2: '보라 (P)', h2: '#700070', r2: 25 }, 'PB': { c1: '파랑 (B)', h1: '#0000ff', r1: 50, c2: '보라 (P)', h2: '#700070', r2: 50 }, 'bP': { c1: '보라 (P)', h1: '#700070', r1: 75, c2: '파랑 (B)', h2: '#0000ff', r2: 25 }, 'P': { c1: '보라 (P)', h1: '#700070', r1: 100 }, 'rP': { c1: '보라 (P)', h1: '#700070', r1: 75, c2: '빨강 (R)', h2: '#ff0000', r2: 25 }, 'RP': { c1: '보라 (P)', h1: '#700070', r1: 50, c2: '빨강 (R)', h2: '#ff0000', r2: 50 }, 'pR': { c1: '빨강 (R)', h1: '#ff0000', r1: 75, c2: '보라 (P)', h2: '#700070', r2: 25 },
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => { const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0; return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) }; };
const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => { const startOuter = polarToCartesian(x, y, outerRadius, endAngle); const endOuter = polarToCartesian(x, y, outerRadius, startAngle); const startInner = polarToCartesian(x, y, innerRadius, endAngle); const endInner = polarToCartesian(x, y, innerRadius, startAngle); const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"; return [ "M", startOuter.x, startOuter.y, "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y, "L", endInner.x, endInner.y, "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y, "Z" ].join(" "); };

interface BoardPost {
  id: number;
  brand: string;
  code: string;
  date: string;
  likes: number;
  views: number;
  author: string;
  spec: string;
  baseFormula: any[];
  pearlFormula: any[];
  isThreeCoat: boolean;
  images: string[];
  deletedImages?: { url: string; deletedAt: number }[]; 
}

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: '', key: '' });
  const [authStatus, setAuthStatus] = useState<'idle' | 'waiting' | 'approved'>('idle');
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);

  const [authorizedUsers, setAuthorizedUsers] = useState<any[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('hitec_auth_users');
          if (saved) return JSON.parse(saved);
      }
      return [];
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState(''); 
  const [vehicleNumber, setVehicleNumber] = useState(''); 
  const [carModel, setCarModel] = useState(''); 
  const [jobDescription, setJobDescription] = useState(''); 
  const [specialNotes, setSpecialNotes] = useState('');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalBaseWeight, setTotalBaseWeight] = useState("0"); 
  const [totalPearlWeight, setTotalPearlWeight] = useState("0"); 
  const [totalFinalWeight, setTotalFinalWeight] = useState("0");
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);
  
  const [memoModal, setMemoModal] = useState<{isOpen: boolean, id: string, code: string, isPearl: boolean, text: string, history: string[]}>({isOpen: false, id: '', code: '', isPearl: false, text: '', history: []});

  const [activeTab, setActiveTab] = useState<'WT'|'PP'|'CANDY'>('WT');
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isGlossaryModalOpen, setIsGlossaryModalOpen] = useState(false);
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  
  const [isBoardOpen, setIsBoardOpen] = useState(false); 
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); 
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false); 
  const [viewingPost, setViewingPost] = useState<any>(null); 
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editPostForm, setEditPostForm] = useState({ brand: '', code: '', spec: '' });

  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); 

  const [boardSearch, setBoardSearch] = useState(''); 
  const [boardBrandFilter, setBoardBrandFilter] = useState('전체');
  
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);

  const [activeGuideTab, setActiveGuideTab] = useState<'theory'|'spectrum'|'effect'|'special'>('spectrum');
  
  const [zoomedImage, setZoomedImage] = useState<any>(null);
  const [imgScale, setImgScale] = useState(1);
  const [pinchDist, setPinchDist] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [isPearlGuideOpen, setIsPearlGuideOpen] = useState(false);
  const [activePearlLevel, setActivePearlLevel] = useState(6);
  
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>([
      { id: 1, brand: '현대', code: 'UG4', date: '2026-09-11 14:30', likes: 12, views: 45, author: '윤프로', spec: '이색 심함, 보카시 블렌딩 필수', baseFormula: [{code: 'WT 321', adjustedWeight: '15.5'}], pearlFormula: [], isThreeCoat: false, images: [], deletedImages: [] }
  ]);

  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight', tempInput?: HTMLInputElement} | null>(null); 
  const [catalogSearch, setCatalogSearch] = useState('');
  
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedWheelIndex, setSelectedWheelIndex] = useState<number | null>(null);
  
  // 🎨 [NEW] AI 가상 조색 시뮬레이터 (물감 혼합) 방울 수 상태 관리
  const [paletteDrops, setPaletteDrops] = useState({ red: 0, blue: 0, yellow: 0, green: 0, white: 0, black: 0 });

  const handleWheelClick = (index: number) => { setSelectedWheelIndex(index); };

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  
  // ✅ 버그 패치: 2,610개 엑셀 검색 버그 (띄어쓰기 무시 및 숫자 인식)
  const sortedCatalog = [...catalogData].filter(item => {
    const code = item.code;
    if (activeTab === 'CANDY') return code.startsWith('90');
    if (activeTab === 'PP') return code.startsWith('PP');
    return !code.startsWith('90') && !code.startsWith('PP'); 
  }).sort((a, b) => { 
      const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); 
      if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; 
  }).filter(item => {
      const searchTxt = catalogSearch.replace(/\s/g, '').toUpperCase();
      return String(item.code).replace(/\s/g, '').toUpperCase().includes(searchTxt) || String(item.role).replace(/\s/g, '').toUpperCase().includes(searchTxt);
  });

  useEffect(() => {
      if (typeof window !== 'undefined') {
          const authKey = localStorage.getItem('hitec_auth_key');
          const authName = localStorage.getItem('hitec_auth_name');
          if (authKey === MASTER_KEY && authName) {
              setIsAuthorized(true);
          }
      }
      document.title = "조색 Pro";
  }, []);

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (loginForm.key.trim() === MASTER_KEY && loginForm.name.trim() !== '') {
          localStorage.setItem('hitec_auth_key', MASTER_KEY);
          localStorage.setItem('hitec_auth_name', loginForm.name.trim());
          
          const newUser = {
              name: loginForm.name.trim(),
              date: new Date().toLocaleString('ko-KR'),
              device: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'PC'
          };
          const updatedUsers = [...authorizedUsers, newUser];
          setAuthorizedUsers(updatedUsers);
          localStorage.setItem('hitec_auth_users', JSON.stringify(updatedUsers));

          setIsAuthorized(true);
      } else {
          alert("❌ 올바른 이름과 초대 코드를 입력해주세요.");
      }
  };

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
      const handleFocusIn = (e: FocusEvent) => {
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
              setIsKeyboardOpen(true);
          }
      };
      const handleFocusOut = () => {
          setTimeout(() => {
              if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) {
                  setIsKeyboardOpen(false);
              }
          }, 150);
      };
      window.addEventListener('focusin', handleFocusIn);
      window.addEventListener('focusout', handleFocusOut);
      return () => {
          window.removeEventListener('focusin', handleFocusIn);
          window.removeEventListener('focusout', handleFocusOut);
      };
  }, []);

  useEffect(() => {
      if (boardPosts.length > 0) {
          const now = Date.now();
          const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
          let changed = false;
          const cleanedPosts = boardPosts.map(post => {
              if (post.deletedImages && post.deletedImages.length > 0) {
                  const validTrash = post.deletedImages.filter(img => now - img.deletedAt < THREE_DAYS_MS);
                  if (validTrash.length !== post.deletedImages.length) {
                      changed = true;
                      return { ...post, deletedImages: validTrash };
                  }
              }
              return post;
          });
          if (changed) setBoardPosts(cleanedPosts);
      }
  }, [boardPosts]);

  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (zoomedImage) {
        document.body.style.overflow = 'hidden'; 
        if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); 
    } else {
        document.body.style.overflow = '';
        if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); 
    }
    return () => {
        document.body.style.overflow = '';
        if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1');
    };
  }, [zoomedImage]);

  useEffect(() => {
      const el = scrollContainerRef.current;
      if (!el || !zoomedImage || zoomedImage.id === 12) return; 

      const handleNativeWheel = (e: WheelEvent) => {
          e.preventDefault(); 
          const delta = e.deltaY < 0 ? 0.15 : -0.15; 
          setImgScale(s => {
              const newScale = Math.max(1, Math.min(s + delta, 5)); 
              return Number(newScale.toFixed(2));
          });
      };

      el.addEventListener('wheel', handleNativeWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleNativeWheel);
  }, [zoomedImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
      if (imgScale > 1 && scrollContainerRef.current) {
          setIsDragging(true);
          setDragStart({ x: e.clientX, y: e.clientY });
          setScrollStart({ 
              x: scrollContainerRef.current.scrollLeft, 
              y: scrollContainerRef.current.scrollTop 
          });
      }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging && scrollContainerRef.current) {
          const dx = e.clientX - dragStart.x;
          const dy = e.clientY - dragStart.y;
          scrollContainerRef.current.scrollLeft = scrollStart.x - dx;
          scrollContainerRef.current.scrollTop = scrollStart.y - dy;
      }
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
          const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          setPinchDist(dist);
      }
  };
  const handleTouchMove = (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
          const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
          if (pinchDist > 0) {
              const delta = (dist - pinchDist) / 150; 
              setImgScale(s => Math.min(Math.max(1, s + delta), 5));
          }
          setPinchDist(dist);
      }
  };
  const handleTouchEnd = () => { setPinchDist(0); };

  const openImageModal = (img: any) => { setZoomedImage(img); setImgScale(1); };

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search); const d = urlParams.get('d'); 
        const ori = window.location.origin;
        if (!ori.includes('google') && !ori.includes('gemini') && !ori.includes('null')) localStorage.setItem('hitec_clean_domain', ori);
        let loadedFromUrl = false;
        if (d) {
            const safeD = d.replace(/ /g, '+'); 
            try {
                let decodedStr = '';
                if (safeD.includes('%7B') || safeD.includes('{')) { decodedStr = decodeURIComponent(safeD); } 
                else if (!safeD.includes('|') && !safeD.includes('%')) { try { decodedStr = decodeURIComponent(escape(atob(safeD))); } catch(e) { decodedStr = atob(safeD); } } 
                else { decodedStr = decodeURIComponent(safeD.replace(/%7C/g, '|')); }
                let parsedData = null;
                if (decodedStr.startsWith('{')) { parsedData = JSON.parse(decodedStr); } 
                else {
                    const parts = decodedStr.split('|');
                    if(parts.length >= 6) parsedData = { v: parts[0] || '', m: parts[1] || '', c: parts[2] || '', j: parts[3] || '', n: parts[4] || '', b: unpackToners(parts[5]), p: unpackToners(parts[6]), t: parts[7] === '1', date: parts[8] || '' };
                }
                if (parsedData) { 
                    setVehicleNumber(parsedData.v || ''); setCarModel(parsedData.m || ''); setTargetColorCode(parsedData.c || ''); setJobDescription(parsedData.j || ''); setSpecialNotes(parsedData.n || '');
                    if(parsedData.b && parsedData.b.length > 0) setToners(parsedData.b); if(parsedData.p && parsedData.p.length > 0) setPearlToners(parsedData.p);
                    setIsThreeCoatMode(parsedData.t || false); if(parsedData.date) setRegistrationDate(parsedData.date);
                    window.history.replaceState({}, document.title, window.location.pathname); loadedFromUrl = true; 
                }
            } catch (e) {}
        }
        if (!loadedFromUrl) {
            const savedBase = localStorage.getItem('hitec_base'); const savedPearl = localStorage.getItem('hitec_pearl'); const savedCode = localStorage.getItem('hitec_code'); const savedMode = localStorage.getItem('hitec_mode'); const savedVehicle = localStorage.getItem('hitec_vehicle'); const savedCarModel = localStorage.getItem('hitec_carmodel'); const savedJob = localStorage.getItem('hitec_job'); const savedNotes = localStorage.getItem('hitec_notes'); const savedBoard = localStorage.getItem('hitec_board_mock'); const savedSnapshots = localStorage.getItem('hitec_snapshots');
            if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl)); if (savedCode) setTargetColorCode(savedCode); if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode)); if (savedVehicle) setVehicleNumber(savedVehicle); if (savedCarModel) setCarModel(savedCarModel); if (savedJob) setJobDescription(savedJob); if (savedNotes) setSpecialNotes(savedNotes); if (savedBoard) setBoardPosts(JSON.parse(savedBoard)); if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots));
        }
        setIsLoaded(true); 
    }
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search); if (urlParams.get('d')) return;
      if (isLoaded && typeof window !== 'undefined') {
          try {
              localStorage.setItem('hitec_base', JSON.stringify(toners)); 
              localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); 
              localStorage.setItem('hitec_code', targetColorCode); 
              localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); 
              localStorage.setItem('hitec_vehicle', vehicleNumber); 
              localStorage.setItem('hitec_carmodel', carModel); 
              localStorage.setItem('hitec_job', jobDescription); 
              localStorage.setItem('hitec_notes', specialNotes); 
              localStorage.setItem('hitec_board_mock', JSON.stringify(boardPosts)); 
              localStorage.setItem('hitec_snapshots', JSON.stringify(snapshots));
          } catch (e: any) {
              if (e.name === 'QuotaExceededError' || e.message?.includes('Quota')) {
                  alert("⚠️ [경고] 기기의 저장 용량(5MB)이 꽉 찼습니다!\n기존 데이터가 날아가는 것을 방지하기 위해, 게시판의 불필요한 예전 시편 데이터나 사진을 삭제하여 공간을 비워주세요.");
              }
          }
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, boardPosts, snapshots, isLoaded]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); 
    const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    
    setTotalBaseWeight(formatWeight(baseTotal)); 
    setTotalPearlWeight(formatWeight(pearlTotal)); 
    
    const finalTotal = (baseTotal * 1.2) + (isThreeCoatMode ? (pearlTotal * 1.3) : 0);
    setTotalFinalWeight(formatWeight(finalTotal));
    
    const checkMetallic = (list: any[]) => list.some(t => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== '' && type !== 'candy'; });
    setIsBaseMetallic(checkMetallic(toners)); setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
      if (focusTarget) {
          let attempts = 0; 
          const interval = setInterval(() => {
              const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
              if (el) { 
                  el.focus(); 
                  if (focusTarget.tempInput) focusTarget.tempInput.remove();
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
                  clearInterval(interval); 
                  setFocusTarget(null); 
              }
              attempts++; 
              if (attempts > 20) { 
                  clearInterval(interval); 
                  if (focusTarget.tempInput) focusTarget.tempInput.remove();
                  setFocusTarget(null); 
              }
          }, 50); 
          return () => { clearInterval(interval); };
      }
  }, [focusTarget, toners, pearlToners]);

  const handleClearAllInfo = () => { 
      if(!window.confirm("모든 입력 데이터를 초기화하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setRegistrationDate(new Date().toISOString().split('T')[0]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch(''); setAttachedImages([]);
  };
  const handleResetFormula = () => { 
      if(!window.confirm("현재 배합과 수정 내역을 모두 리셋하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch(''); setAttachedImages([]);
  };
  
  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const rawVal = newCode.toUpperCase(); 
    const numOnly = rawVal.replace(/[^0-9]/g, '');
    let finalCode = rawVal;
    
    if (rawVal.startsWith('90') && numOnly.length >= 4) {
        finalCode = numOnly.substring(0, 4); 
    } else if (['1051', '1500', '455', 'AXT700'].includes(numOnly) || rawVal === 'AXT700') {
        finalCode = rawVal === 'AXT700' ? 'AXT700' : numOnly; 
    } else if (numOnly) {
        finalCode = `WT ${numOnly}`; 
    }

    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => { 
        if (toner.id === id) { 
            if (TONER_DB[finalCode]) { setFocusTarget({ id: id, type: 'weight' }); } 
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
    setter(prev => prev.map(t => { if (t.id === id) { const currentHistory = t.history || []; if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== value) return { ...t, history: [...currentHistory, value] }; } return t; }));
  };
  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => { if (e.key === 'Enter') { e.preventDefault(); const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); } };
  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };
  
  const addToner = (isPearl = false) => { 
      let tempInput: HTMLInputElement | undefined;
      if (typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          tempInput = document.createElement('input');
          tempInput.type = 'number';
          tempInput.style.position = 'fixed';
          tempInput.style.top = '50%';
          tempInput.style.left = '50%';
          tempInput.style.opacity = '0';
          tempInput.style.width = '1px';
          tempInput.style.height = '1px';
          document.body.appendChild(tempInput);
          tempInput.focus(); 
      }

      const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; 
      const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; 
      if (isPearl) setPearlToners([...pearlToners, newToner]); 
      else setToners([...toners, newToner]); 
      
      setFocusTarget({ id: newId, type: 'code', tempInput }); 
  };
  
  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if(t.id === id) { let newVal = Math.max(0, (parseFloat(t.adjustedWeight) || 0) + delta); let strVal = String(Number(Math.round(newVal * 100000) / 100000)); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory; return { ...t, adjustedWeight: strVal, history: nextHistory }; } return t; }));
  };
  const toggleExpand = (id: string, isPearl: boolean) => { const setter = isPearl ? setPearlToners : setToners; setter(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t)); };
  
  // 🎨 [NEW] 가상 조색 시뮬레이터 로직
  const getSimulatedColor = (drops: any) => {
      const total = drops.red + drops.blue + drops.yellow + drops.green + drops.white + drops.black;
      if (total === 0) return { name: '비어있음 (색상을 추가하세요)', hex: '#1e293b', r: 30, g: 41, b: 59 };

      let c = (drops.blue * 1 + drops.green * 1) / total;
      let m = (drops.red * 1 + drops.blue * 0.5) / total;
      let y = (drops.yellow * 1 + drops.red * 1 + drops.green * 1) / total;
      let k = (drops.black * 1) / total;

      const concentration = 1 - (drops.white / total);
      c *= concentration; m *= concentration; y *= concentration;

      const r = Math.round(255 * (1 - c) * (1 - k));
      const g = Math.round(255 * (1 - m) * (1 - k));
      const b = Math.round(255 * (1 - y) * (1 - k));
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      let name = '';
      const active = Object.keys(drops).filter(k => drops[k] > 0 && k !== 'white' && k !== 'black');
      if (active.length === 1) {
          const names: any = { red: '빨강 (Red)', blue: '파랑 (Blue)', yellow: '노랑 (Yellow)', green: '초록 (Green)' };
          name = names[active[0]];
      } else if (active.includes('red') && active.includes('blue') && active.includes('yellow')) { name = '탁한 회갈색 (Muddy Brown)';
      } else if (active.includes('red') && active.includes('blue')) { name = '보라 (Purple)';
      } else if (active.includes('red') && active.includes('yellow')) { name = '주황 (Orange)';
      } else if (active.includes('blue') && active.includes('yellow')) { name = '청록/녹색 (Teal/Green)';
      } else if (active.includes('red') && active.includes('green')) { name = '갈색 (Brown)';
      } else if (active.includes('blue') && active.includes('green')) { name = '바다색 (Deep Cyan)';
      } else if (active.includes('yellow') && active.includes('green')) { name = '연두 (Yellow-Green)';
      } else if (active.length === 0) { name = '무채색';
      } else { name = '혼합색 (Mixed)'; }

      if (drops.white > 0 && drops.black === 0 && active.length > 0) name = `파스텔 ${name}`;
      if (drops.black > 0 && active.length > 0) name = `어두운 ${name}`;
      if (drops.white > 0 && drops.black > 0 && active.length === 0) name = '회색 (Gray)';
      if (drops.white > 0 && drops.black === 0 && active.length === 0) name = '흰색 (White)';
      if (drops.black > 0 && drops.white === 0 && active.length === 0) name = '검정 (Black)';

      return { name, hex, r, g, b };
  };

  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율 상수를 입력하세요."); return; }
    const scale = (valStr: string) => { const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; const calcVal = isMultiply ? (val * 100000 * factor) / 100000 : (val * 100000) / (factor * 100000); return String(Number(Math.round(calcVal * 100000) / 100000)); };
    const applyScale = (list: any[]) => list.map(t => { if (!t.adjustedWeight) return t; const newVal = scale(t.adjustedWeight); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory; return { ...t, adjustedWeight: newVal, history: nextHistory }; });
    setToners(applyScale(toners)); setPearlToners(applyScale(pearlToners));
  };

  // ✅ Vercel 에러 완벽 해결 (유니코드 텍스트 깨짐 오류 원천 차단 - 템플릿 리터럴 제거)
  const generateShareText = () => {
    let baseListText = toners.filter(t => t.code).map(t => "  - " + t.code + " (" + (TONER_DB[t.code]?.role || '미지정') + "): " + formatWeight(t.adjustedWeight) + "g").join('\n'); 
    let pearlListText = pearlToners.filter(t => t.code).map(t => "  - " + t.code + " (" + (TONER_DB[t.code]?.role || '미지정') + "): " + formatWeight(t.adjustedWeight) + "g").join('\n'); 
    let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin;
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); 
    const shareUrl = currentOrigin + window.location.pathname + "?d=" + btoa(unescape(encodeURIComponent(payloadStr)));
    
    let resultText = "[조색 배합 지시서]\n================================\n📅 등록날짜: " + registrationDate + "\n🚗 차량번호: " + (vehicleNumber || '미지정') + "\n🚙 브랜드: " + (carModel || '미지정') + "\n🎨 컬러코드: " + (targetColorCode || '미지정') + "\n🛠️ 작업내용: " + (jobDescription || '미지정') + "\n📌 특이사항: " + (specialNotes || '없음') + "\n================================\n\n[▼ 베이스 코트]\n";
    resultText += (baseListText || '  (입력 데이터 없음)') + "\n--------------------------------\n▶ 순수 안료 합계: " + totalBaseWeight + "g\n▶ 필수 수지(20%): " + formatWeight(parseFloat(totalBaseWeight) * 0.2) + "g\n▶ 베이스 총 중량: " + formatWeight(parseFloat(totalBaseWeight) * 1.2) + "g\n\n";
    
    if (isThreeCoatMode) {
        resultText += "[▼ 펄 코트]\n" + (pearlListText || '  (입력 데이터 없음)') + "\n--------------------------------\n▶ 순수 펄 합계: " + totalPearlWeight + "g\n▶ 펄 수지(30%): " + formatWeight(parseFloat(totalPearlWeight) * 0.3) + "g\n▶ 펄 코트 총 중량: " + formatWeight(parseFloat(totalPearlWeight) * 1.3) + "g\n\n";
    }
    
    resultText += "================================\n✨ 최종 도막 혼합 총량: " + totalFinalWeight + "g\n\n👉 링크:\n" + shareUrl;
    
    return resultText;
  };

  const handleShareKakao = () => { 
      const shareText = generateShareText();
      window.location.href = `kakaotalk://send?text=${encodeURIComponent(shareText)}`;
      setIsShareModalOpen(false);
  };
  const handleShareSMS = () => { window.location.href = `sms:?body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const handleShareMail = () => { window.location.href = `mailto:?subject=${encodeURIComponent('[조색 Pro] 배합 지시서 공유')}&body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  
  const generateSyncUrl = () => { 
      let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin; 
      const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); 
      return `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`; 
  };

  const handleSendToPcKakao = () => {
      const shareUrl = generateSyncUrl();
      const shareText = `[조색 Pro] PC로 작업 보내기\n차량: ${vehicleNumber} / ${carModel}\n컬러: ${targetColorCode}\n👉 PC 카톡에서 아래 링크 클릭:\n${shareUrl}`;
      window.location.href = `kakaotalk://send?text=${encodeURIComponent(shareText)}`;
  };

  const handleCopyLinkForPc = () => {
      const url = generateSyncUrl();
      if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
          });
      }
  };

  const handleDirectExcelCopy = () => {
      const shareUrl = generateSyncUrl(); const plainText = `${registrationDate || '-'}	${vehicleNumber || '미입력'}	${carModel || '미입력'}	${targetColorCode || '미지정'}	${jobDescription || '미입력'}	${specialNotes || '-'}	${shareUrl}`;
      const htmlText = `<meta charset="utf-8"><table><tr><td>${registrationDate || '-'}</td><td>${vehicleNumber || '미입력'}</td><td>${carModel || '미입력'}</td><td>${targetColorCode || '미지정'}</td><td>${jobDescription || '미입력'}</td><td>${specialNotes || '-'}</td><td><a href="${shareUrl}">[배합보기]</a></td></tr></table>`;
      if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
          const htmlBlob = new Blob([htmlText], { type: 'text/html' }); const textBlob = new Blob([plainText], { type: 'text/plain' });
          const ClipboardItemConstructor = (window as any).ClipboardItem; const item = new ClipboardItemConstructor({ 'text/html': htmlBlob, 'text/plain': textBlob });
          navigator.clipboard.write([item]).then(() => { alert("✅ 엑셀 데이터가 복사되었습니다!"); }).catch(() => { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); }
      setIsExcelModalOpen(false);
  };
  const handleCopyExcelTemplate = () => { const headerRow = ['등록 날짜', '차량 번호', '브랜드/차종', '컬러코드', '작업내용', '특이사항', '배합보기'].join('\t'); if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(headerRow); alert("엑셀 헤더가 복사되었습니다."); } }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  let width = img.width;
                  let height = img.height;
                  const MAX_WIDTH = 600; 
                  const MAX_HEIGHT = 600;
                  if (width > height) {
                      if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                  } else {
                      if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                  }
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, width, height);
                  const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5); 
                  setAttachedImages(prev => [...prev, compressedBase64]);
                  alert("📷 시편 사진이 안전하게 최적화되어 추가되었습니다!");
              };
              img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
      }
  };

  const removeAttachedImage = (index: number) => {
      setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeletePostImage = (postId: number, imgIdx: number) => {
      if (window.confirm("이 사진을 삭제하시겠습니까?\n\n(삭제된 사진은 휴지통에서 3일간 보관된 후 영구 삭제됩니다.)")) {
          setBoardPosts(prev => prev.map(p => {
              if (p.id === postId) {
                  const newImages = [...p.images];
                  const removed = newImages.splice(imgIdx, 1)[0];
                  const deletedImages = p.deletedImages ? [...p.deletedImages] : [];
                  deletedImages.push({ url: removed, deletedAt: Date.now() });
                  return { ...p, images: newImages, deletedImages };
              }
              return p;
          }));
          
          if (viewingPost && viewingPost.id === postId) {
              const newImages = [...viewingPost.images];
              const removed = newImages.splice(imgIdx, 1)[0];
              const deletedImages = viewingPost.deletedImages ? [...viewingPost.deletedImages] : [];
              deletedImages.push({ url: removed, deletedAt: Date.now() });
              setViewingPost({ ...viewingPost, images: newImages, deletedImages });
          }
      }
  };

  const handleRestorePostImage = (postId: number, delIdx: number) => {
      setBoardPosts(prev => prev.map(p => {
          if (p.id === postId && p.deletedImages) {
              const newDeleted = [...p.deletedImages];
              const restored = newDeleted.splice(delIdx, 1)[0];
              return { ...p, images: [...p.images, restored.url], deletedImages: newDeleted };
          }
          return p;
      }));
      if (viewingPost && viewingPost.id === postId) {
          const newDeleted = [...viewingPost.deletedImages];
          const restored = newDeleted.splice(delIdx, 1)[0];
          setViewingPost({ ...viewingPost, images: [...viewingPost.images, restored.url], deletedImages: newDeleted });
      }
  };

  const handlePermanentDeletePostImage = (postId: number, delIdx: number) => {
      if (!window.confirm("이 사진을 영구적으로 삭제하시겠습니까?\n(이 작업은 취소할 수 없습니다.)")) return;
      setBoardPosts(prev => prev.map(p => {
          if (p.id === postId && p.deletedImages) {
              const newDeleted = [...p.deletedImages];
              newDeleted.splice(delIdx, 1);
              return { ...p, deletedImages: newDeleted };
          }
          return p;
      }));
      if (viewingPost && viewingPost.id === postId) {
          const newDeleted = [...viewingPost.deletedImages];
          newDeleted.splice(delIdx, 1);
          setViewingPost({ ...viewingPost, deletedImages: newDeleted });
      }
  };

  const saveToBoard = () => {
      if(!targetColorCode) { alert("⚠️ 컬러코드를 입력해야 합니다!"); return; }
      
      const now = new Date();
      const timeFormatted = `${registrationDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newPost: BoardPost = { 
          id: Date.now() + Math.random(), 
          brand: carModel || '미지정', 
          code: targetColorCode, 
          date: timeFormatted, 
          likes: 0, 
          views: 0, 
          author: '내 데이터', 
          spec: specialNotes || '특이사항 없음', 
          baseFormula: [...toners], 
          pearlFormula: [...pearlToners], 
          isThreeCoat: isThreeCoatMode,
          images: [...attachedImages],
          deletedImages: []
      };
      setBoardPosts([newPost, ...boardPosts]); 
      setAttachedImages([]); 
      alert("🎉 시편 사진들과 함께 게시판에 등록되었습니다!");
  };

  const deleteBoardPost = (id: number, e: React.MouseEvent) => { e.stopPropagation(); if (window.confirm("이 시편 데이터를 완전히 삭제하시겠습니까?")) setBoardPosts(prev => prev.filter(post => post.id !== id)); };
  const handleSaveSnapshot = () => { const newSnapshot = { id: Date.now(), timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }), dateStr: new Date().toLocaleDateString('ko-KR'), base: JSON.parse(JSON.stringify(toners)), pearl: JSON.parse(JSON.stringify(pearlToners)), isThreeCoat: isThreeCoatMode, totalFinal: totalFinalWeight }; setSnapshots(prev => [newSnapshot, ...prev]); alert(`[${newSnapshot.timestamp}] 데이터가 확정 저장되었습니다.`); };
  const restoreSnapshot = (snapshot: any) => { if (window.confirm("복원하시겠습니까?")) { setToners(JSON.parse(JSON.stringify(snapshot.base))); setPearlToners(JSON.parse(JSON.stringify(snapshot.pearl))); setIsThreeCoatMode(snapshot.isThreeCoat); setSelectedSnapshot(null); setIsSnapshotModalOpen(false); } };
  const handleSavePostEdit = () => { setBoardPosts(prev => prev.map(p => p.id === viewingPost.id ? { ...p, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec } : p)); setViewingPost({ ...viewingPost, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec }); setIsEditingPost(false); };
  const handleOpenPost = (post: any) => { setViewingPost(post); setEditPostForm({ brand: post.brand, code: post.code, spec: post.spec }); setIsEditingPost(false); };

  const handleGoogleGlossarySearch = () => {
      const inputEl = document.getElementById('glossarySearchInput') as HTMLInputElement;
      const val = inputEl?.value?.trim();
      if(!val) { alert("사전 검색창에 뜻이 궁금한 용어를 직접 입력하세요!"); return; }
      window.open(`https://www.google.com/search?q=스피스헥커+${val}+뜻`, '_blank');
  };

  const showBottomBar = !(isMobile && isKeyboardOpen);

  // 🚨 [NEW] 승인 로그인 화면 (비인가자 차단)
  if (!isAuthorized) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-200 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"><Lock size={32} className="text-white"/></div>
                  <h1 className="text-2xl font-black text-slate-800 mb-2">조색 Pro 접근 승인</h1>
                  <p className="text-sm text-slate-500 mb-8 text-center break-keep">이 앱은 승인된 작업자만 사용할 수 있습니다. 관리자에게 부여받은 이름과 코드를 입력해주세요.</p>
                  
                  <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-600 mb-1.5 block">작업자 이름 (또는 상호명)</label>
                          <input 
                              type="text" 
                              value={loginForm.name} 
                              onChange={e => setLoginForm({...loginForm, name: e.target.value})}
                              placeholder="홍길동" 
                              className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-600 mb-1.5 block">초대 코드 (마스터 키)</label>
                          <input 
                              type="password" 
                              value={loginForm.key} 
                              onChange={e => setLoginForm({...loginForm, key: e.target.value})}
                              placeholder="******" 
                              className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-lg mt-4 transition-colors shadow-md flex justify-center items-center gap-2">
                          <ShieldCheck size={18}/> 시스템 접속 승인
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-[240px] md:pb-[140px] notranslate" translate="no">
      
      <header className="bg-slate-900 flex flex-col md:flex-row justify-between items-center p-3 border-b border-slate-800 shadow-md shrink-0 gap-3 z-40">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center bg-slate-800 p-1.5 rounded-xl border border-slate-700 shadow-inner w-full sm:w-auto justify-center">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 cursor-default">
                    <span className="text-red-600 font-black italic text-sm tracking-tighter">Spies Hecker</span>
                </div>
                <button 
                    onClick={() => { window.location.replace("https://glasurit-pro-v2-2va8x70wv-ysm0427-1929s-projects.vercel.app"); }} 
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-all group cursor-pointer"
                    title="글라슈리트 90라인으로 이동"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform origin-center">🦜</span>
                    <span className="font-bold text-xs tracking-wide">Glasurit</span>
                </button>
            </div>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2.5 py-1 rounded-full border border-slate-700 hidden md:inline-block shrink-0">Last Patch: {LAST_PATCH_DATE}</span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide snap-x items-center">
            {/* 🚨 [NEW] 승인 사용자 관리 버튼 */}
            <button onClick={() => setIsUsersModalOpen(true)} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Users size={14} /> 승인된 작업자 <span className="bg-indigo-900 px-1.5 py-0.5 rounded text-[10px]">{authorizedUsers.length}명</span>
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>

            <button onClick={() => { setIsCloudModalOpen(true); setCopied(false); }} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                ☁️ 기기 간 초고속 연동
            </button>
            <button onClick={() => setIsGlossaryModalOpen(true)} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                📖 도장/조색 용어 사전
            </button>
            <button onClick={() => setIsBoardOpen(true)} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Layers size={14} /> 시편 게시판
            </button>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center shrink-0"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 워크 시트</h2>
              <button onClick={handleClearAllInfo} className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center transition-colors bg-white hover:bg-red-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm shrink-0"><Trash2 size={14} className="mr-1"/> 전체 초기화</button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📅 등록 날짜</label><input type="date" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm cursor-pointer" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚗 차량 번호</label><input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="예: 12가3456" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚙 브랜드 등록</label><input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="예: 현대, BMW..." className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🎨 컬러코드</label><input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="예: UX" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full uppercase focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm notranslate" translate="no" /></div>
              </div>
              <div><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🛠️ 작업 내용</label><input type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="예: 조수석 앞휀다 교환 등" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
              <div><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📌 특이사항 및 스펙 메모</label><input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="직접 입력 (예: 이색 심함)" className="bg-yellow-50 border-yellow-400 border p-2.5 rounded text-sm font-bold w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              
              <div className="flex w-full gap-2 mt-2">
                <button onClick={() => setIsExcelModalOpen(true)} className="flex-[1.2] bg-green-600 text-white p-3 rounded text-xs font-black flex items-center justify-center hover:bg-green-700 shadow-sm"><FileSpreadsheet size={16} className="mr-1 hidden sm:block"/> 엑셀 복사</button>
                
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className={`flex-[1.2] ${attachedImages.length > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-700 hover:bg-slate-600'} text-white p-3 rounded text-xs font-black flex items-center justify-center shadow-sm`}>
                    <Camera size={16} className="mr-1 hidden sm:block"/> {attachedImages.length > 0 ? `사진(${attachedImages.length})` : '사진첨부'}
                </button>

                <button onClick={() => { saveToBoard(); setIsBoardOpen(true); }} className="flex-[1.3] bg-blue-600 text-white p-3 rounded text-xs font-black flex items-center justify-center hover:bg-blue-700 shadow-sm"><Layers size={16} className="mr-1 hidden sm:block"/> 시편 등록</button>
                
                <button onClick={() => setIsShareModalOpen(true)} className="flex-[1.8] bg-[#FEE500] text-slate-900 p-3 rounded text-sm font-black flex items-center justify-center hover:bg-[#E5C100] shadow-sm"><Share2 size={18} className="mr-1.5"/> 공유 전송</button>
                <button onClick={handleResetFormula} className="bg-white border border-red-200 text-red-500 px-3 rounded flex flex-col items-center justify-center hover:bg-red-50 shadow-sm whitespace-nowrap"><Trash2 size={18} className="mb-0.5" /><span className="text-[9px] font-black">리셋</span></button>
              </div>

              {attachedImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2 px-2 bg-amber-50/50 rounded-xl border border-amber-200">
                      {attachedImages.map((imgSrc, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-300 shrink-0 shadow-sm group bg-white">
                              <img src={imgSrc} alt={`시편 ${idx+1}`} className="w-full h-full object-cover cursor-pointer" onClick={() => setPreviewModalImage(imgSrc)} />
                              <button onClick={() => removeAttachedImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-md">
                                  <X size={10} />
                              </button>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          </div>
          
          <div className="p-3 bg-white">
            <div className="mb-4 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-between shadow-sm gap-2">
                <div className="flex items-center gap-2"><Beaker size={14} className="text-indigo-600" /><span className="text-xs font-bold text-indigo-800">현장 실시간 용량 배율 변환기</span></div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <input type="text" inputMode="decimal" value={scaleFactor} onChange={(e) => setScaleFactor(e.target.value.replace(/[^0-9.]/g, ''))} className="w-12 text-center text-sm font-black text-indigo-700 border rounded py-1" />
                    <span className="text-[11px] font-bold text-indigo-400 mr-1">배</span>
                    <button onClick={() => handleScaleAll(true)} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm hover:bg-indigo-700 transition-colors">× 곱하기</button>
                    <button onClick={() => handleScaleAll(false)} className="bg-white border border-indigo-300 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded shadow-sm hover:bg-indigo-50 transition-colors">÷ 나누기</button>
                </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 flex justify-between border-b pb-1"><span>▼ 베이스 원색 리스트 (Ground Coat)</span></div>
              {toners.map((toner) => {
                const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
                const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
                return (
                  <div key={toner.id} className="flex flex-col bg-slate-50 hover:bg-blue-50/50 p-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
                    
                    <div className="flex items-center w-full gap-2">
                      <button 
                           type="button"
                           className="flex w-[50px] h-[36px] rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-blue-400" 
                           onClick={() => setMemoModal({isOpen: true, id: toner.id, code: toner.code, isPearl: false, text: toner.memo || '', history: toner.history || []})}
                           title="메모 및 히스토리 보기"
                      >
                           <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                           <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                           {toner.memo && <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white shadow-md z-20"></div>}
                      </button>
                      
                      <input 
                          ref={el => { codeRefs.current[toner.id] = el; }} 
                          value={toner.code.replace('WT ', '').replace('PP ', '')} 
                          onChange={e => handleCodeChange(toner.id, e.target.value, false)} 
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                          type="text"
                          inputMode="decimal" 
                          pattern="[0-9]*" 
                          className="w-16 h-[36px] text-center text-sm font-black border border-slate-300 rounded focus:border-blue-500 focus:outline-none shadow-inner shrink-0 uppercase" 
                          placeholder="번호" 
                      />

                      <div className="flex-1"></div>

                      <div className="flex items-center bg-white border rounded-md px-1 h-[36px] shrink-0 shadow-sm">
                         <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                         <input 
                             ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" pattern="[0-9]*" value={toner.adjustedWeight} 
                             onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} onBlur={e => handleWeightBlur(toner.id, e.target.value, false)} onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                             className="w-14 text-right text-[15px] font-black text-blue-600 focus:outline-none clean-number-input" placeholder="0.0" 
                         />
                         <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="px-2 py-1 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                         <span className="text-[10px] font-bold text-slate-400 ml-1">g</span>
                         <button onClick={() => removeToner(toner.id, false)} className="ml-1 px-1"><Trash2 size={16} className="text-slate-300 hover:text-red-500 transition-colors"/></button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 cursor-pointer hover:bg-blue-100/50 py-1.5 px-1 mt-1 rounded transition-colors w-full" onClick={() => toggleExpand(toner.id, false)}>
                        <span className="font-bold text-blue-800 text-[13px] leading-tight flex-1 pl-1 text-left break-keep">
                            {toner.code ? (info.role || '등록된 안료 정보 없음') : '안료 번호를 입력하세요 (예: 321, 385...)'}
                        </span>
                        {toner.isExpanded ? <ChevronUp size={16} className="text-blue-400 shrink-0" /> : <ChevronDown size={16} className="text-blue-400 shrink-0" />}
                    </div>

                    {toner.isExpanded && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-1 pt-2 border-t border-slate-200">
                            {info.details && info.details.length > 0 ? (
                                <div className="flex flex-col gap-1.5 w-full">
                                    {info.details.map((d: any, idx: number) => {
                                        const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                        if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                        return (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2.5 mb-2">
                                            <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-1 py-1.5 rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                <span className="text-[11px] font-black leading-tight break-keep">{mainTitle}</span>
                                                {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                            </div>
                                            <span className="text-[11px] text-slate-700 leading-relaxed break-keep pt-0.5 whitespace-pre-line">{d[1]}</span>
                                        </div>
                                    )})}
                                </div>
                            ) : <p className="text-[11px] text-slate-500 leading-tight break-keep pl-1">{info.desc}</p>}
                        </div>
                    )}
                  </div>
                )
              })}

              <div className="flex w-full gap-2 mt-3">
                  <button onClick={() => addToner(false)} className="flex-1 py-3 border border-dashed border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 rounded-lg text-slate-500 hover:text-blue-600 font-bold text-sm flex justify-center items-center transition-all shadow-sm">
                      <Plus size={18} className="mr-1"/>베이스 안료 추가
                  </button>
                  <button onClick={handleSaveSnapshot} className="w-[100px] sm:w-[130px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-[11px] sm:text-sm flex flex-col sm:flex-row justify-center items-center transition-all shadow-sm">
                      <Save size={16} className="mb-1 sm:mb-0 sm:mr-1.5"/>데이터 확정
                  </button>
                  <button onClick={() => setIsSnapshotModalOpen(true)} className="w-[100px] sm:w-[130px] bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold text-[11px] sm:text-sm flex flex-col sm:flex-row justify-center items-center transition-all shadow-sm relative">
                      <History size={16} className="mb-1 sm:mb-0 sm:mr-1.5"/>수정 내역
                      {snapshots.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white">{snapshots.length}</span>}
                  </button>
              </div>
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
                  const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
                  return (
                    <div key={toner.id} className="flex flex-col bg-purple-50 p-2.5 rounded-xl border border-purple-200 shadow-sm transition-colors hover:bg-purple-100/50">
                      
                      <div className="flex items-center w-full gap-2">
                        <button 
                             type="button"
                             className="flex w-[50px] h-[36px] rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-purple-400" 
                             onClick={() => setMemoModal({isOpen: true, id: toner.id, code: toner.code, isPearl: true, text: toner.memo || '', history: toner.history || []})}
                             title="메모 및 히스토리 보기"
                        >
                             <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                             <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                             {toner.memo && <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white shadow-md z-20"></div>}
                        </button>
                        
                        <input 
                            ref={el => { codeRefs.current[toner.id] = el; }} 
                            value={toner.code.replace('WT ', '').replace('PP ', '')} 
                            onChange={e => handleCodeChange(toner.id, e.target.value, true)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                            type="text" 
                            inputMode="decimal"
                            pattern="[0-9]*"
                            className="w-16 h-[36px] text-center text-sm font-black border border-purple-200 rounded text-purple-800 shadow-inner focus:outline-none focus:border-purple-500 shrink-0 uppercase" 
                            placeholder="번호" 
                        />

                        <div className="flex-1"></div>

                        <div className="flex items-center bg-white border border-purple-100 rounded-md px-1 h-[36px] shrink-0 shadow-sm">
                           <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                           <input 
                               ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" pattern="[0-9]*" value={toner.adjustedWeight} 
                               onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} onBlur={e => handleWeightBlur(toner.id, e.target.value, true)} onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} 
                               className="w-14 text-right text-[15px] font-black text-purple-600 focus:outline-none clean-number-input" placeholder="0.0" 
                           />
                           <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="px-2 py-1 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                           <span className="text-[10px] font-bold text-slate-400 ml-1">g</span>
                           <button onClick={() => removeToner(toner.id, true)} className="ml-1 px-1"><Trash2 size={16} className="text-purple-300 hover:text-red-500 transition-colors"/></button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 cursor-pointer hover:bg-purple-100/50 py-1.5 px-1 mt-1 rounded transition-colors w-full" onClick={() => toggleExpand(toner.id, true)}>
                          <span className="font-bold text-purple-800 text-[13px] leading-tight flex-1 pl-1 text-left break-keep">
                              {toner.code ? (info.role || '등록된 펄 정보 없음') : '펄 번호를 입력하세요 (예: PP201...)'}
                          </span>
                          {toner.isExpanded ? <ChevronUp size={16} className="text-purple-400 shrink-0" /> : <ChevronDown size={16} className="text-purple-400 shrink-0" />}
                      </div>

                      {toner.isExpanded && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-1 pt-2 border-t border-purple-200">
                              {info.details && info.details.length > 0 ? (
                                  <div className="flex flex-col gap-1.5 w-full">
                                      {info.details.map((d: any, idx: number) => {
                                          const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                          if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                          return (
                                          <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2.5 mb-2">
                                              <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                  <span className="text-[10.5px] font-black leading-tight">{mainTitle}</span>
                                                  {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                              </div>
                                              <span className={`text-[11.5px] leading-relaxed break-keep pt-0.5 whitespace-pre-line ${getBadgeClass(d[0]).includes('yellow') ? 'text-yellow-800 font-bold' : 'text-slate-700'}`}>{d[1]}</span>
                                          </div>
                                      )})}
                                  </div>
                              ) : <p className="text-[11px] text-slate-500 leading-tight break-keep pl-1">{info.desc}</p>}
                          </div>
                      )}
                    </div>
                  )
                })}

                <button onClick={() => addToner(true)} className="w-full py-3 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 rounded-lg text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-3 shadow-sm">
                    <Plus size={18} /><span>펄 조색제 추가</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-3 shrink-0 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-black mb-2 flex justify-between items-center text-slate-800">
                <span className="flex items-center"><Target size= {14} className="mr-1 text-blue-600"/> 📘 마스터 기술자료실 (Visual Guide)</span>
                <button onClick={() => setIsConfiguratorOpen(true)} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"><Maximize size={10} className="mr-1"/>먼셀 믹싱 랩</button>
              </h3>
              
              <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md border border-blue-200">
                  <div className="flex border-b border-blue-200 bg-slate-50">
                      {['theory', 'spectrum', 'effect', 'special'].map(tab => (
                          <button key={tab} onClick={() => setActiveGuideTab(tab as any)} className={`flex-1 py-3 text-[12px] font-black transition-all ${activeGuideTab === tab ? 'bg-blue-600 text-white shadow-md transform scale-[1.02] rounded-t-xl z-10' : 'text-slate-500 hover:text-blue-700 hover:bg-blue-50'}`}>
                              {tab === 'theory' ? '이론/기초' : tab === 'spectrum' ? '컬러 맵' : tab === 'effect' ? '이펙트/펄' : '특수/3코트'}
                          </button>
                      ))}
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-3 h-52 overflow-y-auto custom-scrollbar bg-slate-50/50">
                      {GUIDE_IMAGES[activeGuideTab].map(img => (
                          <div key={img.id} onClick={() => openImageModal(img)} className="bg-white rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 hover:shadow-xl transition-all shadow-sm border border-slate-200 group flex flex-col justify-center items-center text-center p-4 min-h-[90px] relative">
                              {img.url && (
                                  <div className="absolute inset-0 z-0">
                                      <img src={img.url} alt={img.title} className="w-full h-full object-cover opacity-10 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                              )}
                              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-1 transition-colors duration-300">
                                  <h4 className="text-[13px] font-black text-blue-800 group-hover:text-blue-600 mb-1.5 leading-tight drop-shadow-sm">{img.title}</h4>
                                  <p className="text-[11px] font-bold text-slate-500 group-hover:text-slate-700 break-keep leading-tight">{img.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="flex gap-2 mt-3 relative z-50">
                  <button onClick={() => setIsPearlGuideOpen(true)} className="flex-1 bg-purple-100 border border-purple-300 text-purple-900 py-2.5 rounded-lg text-sm font-black flex items-center justify-center hover:bg-purple-200 transition-colors shadow-sm cursor-pointer">
                      <BookOpen size={16} className="mr-1.5" /> <span className="pointer-events-none">PP(분말) 가이드 열기</span>
                  </button>
                  <button onClick={() => setIsProcessOpen(true)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-2.5 rounded-lg text-sm font-black flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors shadow-sm cursor-pointer">
                      <Code size={16} className="mr-1.5 text-slate-400 pointer-events-none" /> <span className="pointer-events-none">Pro 제작 과정 보기</span>
                  </button>
              </div>
            </div>

            <div className="flex flex-col h-full bg-slate-100">
                <div className="flex bg-slate-900 shrink-0 border-b border-slate-700">
                    <button onClick={()=>{setActiveTab('WT'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'WT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>💧 WT (액상)</button>
                    <button onClick={()=>{setActiveTab('PP'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'PP' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>🌬️ PP (분말)</button>
                    <button onClick={()=>{setActiveTab('CANDY'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'CANDY' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}>🍬 CANDY</button>
                </div>
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex shrink-0 gap-2">
                    <div className="relative flex-1">
                        <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="안료명 / 차량코드 / 색상명 검색 (띄어쓰기 무관)" className="w-full bg-slate-900 border border-slate-600 text-white text-xs px-2.5 py-2 rounded-lg pl-8 focus:outline-none focus:border-blue-500 transition-colors" />
                        <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                    {activeTab === 'CANDY' && (
                        <div className="mb-4 bg-yellow-50 border border-yellow-300 p-4 rounded-xl shadow-sm">
                           <h4 className="text-sm font-black text-yellow-800 mb-2">⚠️ 퍼마솔리드 캔디 6단계 시공 및 3대 철칙</h4>
                           <ul className="text-xs text-yellow-700 space-y-1.5 font-bold">
                              <li>1. 이소시아네이트 포함. 방독 마스크 및 환기 필수</li>
                              <li>2. 반사층 도장 후 완벽한 플래시 오프 필수</li>
                              <li>3. 블렌딩 불가(전체 도장), 건조 타임 준수</li>
                              <li>4. 2액형 클리어 조색비 엄수 및 Clear over Clear 필수</li>
                           </ul>
                        </div>
                    )}
                    
                    {/* ✅ 버그 패치: OEM 검색 띄어쓰기 및 대소문자 무시 (정밀 패치) */}
                    {catalogSearch.replace(/\s/g, '') !== '' && OEM_COLORS.some(c => String(c.code).replace(/\s/g, '').toUpperCase().includes(catalogSearch.replace(/\s/g, '').toUpperCase()) || String(c.name).replace(/\s/g, '').toUpperCase().includes(catalogSearch.replace(/\s/g, '').toUpperCase())) && (
                        <div className="mb-2 p-3 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                            <h4 className="text-xs font-black text-blue-800 mb-2">🔍 자동차 제조사(OEM) 색상 검색 결과</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {OEM_COLORS.filter(c => String(c.code).replace(/\s/g, '').toUpperCase().includes(catalogSearch.replace(/\s/g, '').toUpperCase()) || String(c.name).replace(/\s/g, '').toUpperCase().includes(catalogSearch.replace(/\s/g, '').toUpperCase())).slice(0, 20).map((oem, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors" onClick={() => setTargetColorCode(String(oem.code))}>
                                        <span className="font-black text-blue-600 text-sm">{oem.code}</span>
                                        <span className="text-xs text-slate-600 font-bold truncate max-w-[100px]" title={oem.name}>{oem.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {sortedCatalog.map((item) => {
                        const isMetallic = item.type !== 'solid' && item.type !== 'binder' && item.type !== 'candy';
                        const isCurrentlyUsed = activeCodes.includes(item.code);
                        return (
                            <div key={item.code} className={`flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isCurrentlyUsed ? 'border-2 border-blue-500 shadow-md transform scale-[1.01]' : 'border-slate-200 hover:border-blue-300 cursor-pointer'}`} onClick={() => setSelectedTonerForView(item.code)}>
                                <div className="h-12 w-full relative transition-all border-b border-slate-200" style={{background: getTonerDetailBackground(item.code, item.role, 'face')}}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-1.5 left-3 text-white text-sm font-black drop-shadow-md">{item.code} <span className="text-[10px] font-normal opacity-90 ml-1">{item.role}</span></div>
                                    {isCurrentlyUsed && <div className="absolute top-1.5 right-2 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow">배합 중</div>}
                                </div>
                                <div className="p-3 flex flex-col gap-1.5">
                                    <p className="text-[11px] text-slate-500 font-bold mb-1 break-keep leading-tight bg-slate-50 p-1.5 rounded">{item.desc}</p>
                                    {item.details?.map((d: any, idx: number) => {
                                        const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                        if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                        return (
                                        <div key={idx} className="flex items-start gap-2.5 mb-2">
                                            <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 text-[10px] font-bold rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                <span className="text-[10px] font-black leading-tight">{mainTitle}</span>
                                                {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                            </div>
                                            <span className={`text-[11.5px] leading-relaxed break-keep pt-0.5 whitespace-pre-line ${getBadgeClass(d[0]).includes('yellow') ? 'text-yellow-800 font-black' : 'text-slate-700'}`}>{d[1]}</span>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
        </div>
      </div>
      const handleClearAllInfo = () => { 
      if(!window.confirm("모든 입력 데이터를 초기화하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setRegistrationDate(new Date().toISOString().split('T')[0]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch(''); setAttachedImages([]);
  };
  const handleResetFormula = () => { 
      if(!window.confirm("현재 배합과 수정 내역을 모두 리셋하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch(''); setAttachedImages([]);
  };

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const rawVal = newCode.toUpperCase(); 
    const numOnly = rawVal.replace(/[^0-9]/g, '');
    let finalCode = rawVal;

    if (rawVal.startsWith('90') && numOnly.length >= 4) {
        finalCode = numOnly.substring(0, 4); 
    } else if (['1051', '1500', '455', 'AXT700'].includes(numOnly) || rawVal === 'AXT700') {
        finalCode = rawVal === 'AXT700' ? 'AXT700' : numOnly; 
    } else if (numOnly) {
        finalCode = `WT ${numOnly}`; 
    }

    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => { 
        if (toner.id === id) { 
            if (TONER_DB[finalCode]) { setFocusTarget({ id: id, type: 'weight' }); } 
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
    setter(prev => prev.map(t => { if (t.id === id) { const currentHistory = t.history || []; if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== value) return { ...t, history: [...currentHistory, value] }; } return t; }));
  };
  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => { if (e.key === 'Enter') { e.preventDefault(); const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); } };
  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };

  const addToner = (isPearl = false) => { 
      let tempInput: HTMLInputElement | undefined;
      if (typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          tempInput = document.createElement('input');
          tempInput.type = 'number';
          tempInput.style.position = 'fixed';
          tempInput.style.top = '50%';
          tempInput.style.left = '50%';
          tempInput.style.opacity = '0';
          tempInput.style.width = '1px';
          tempInput.style.height = '1px';
          document.body.appendChild(tempInput);
          tempInput.focus(); 
      }

      const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; 
      const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; 
      if (isPearl) setPearlToners([...pearlToners, newToner]); 
      else setToners([...toners, newToner]); 

      setFocusTarget({ id: newId, type: 'code', tempInput }); 
  };

  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if(t.id === id) { let newVal = Math.max(0, (parseFloat(t.adjustedWeight) || 0) + delta); let strVal = String(Number(Math.round(newVal * 100000) / 100000)); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory; return { ...t, adjustedWeight: strVal, history: nextHistory }; } return t; }));
  };
  const toggleExpand = (id: string, isPearl: boolean) => { const setter = isPearl ? setPearlToners : setToners; setter(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t)); };

  // ✅ Vercel 에러 완벽 해결 (유니코드 텍스트 깨짐 오류 원천 차단 - 템플릿 리터럴 제거)
  const generateShareText = () => {
    let baseListText = toners.filter(t => t.code).map(t => "  - " + t.code + " (" + (TONER_DB[t.code]?.role || '미지정') + "): " + formatWeight(t.adjustedWeight) + "g").join('\n'); 
    let pearlListText = pearlToners.filter(t => t.code).map(t => "  - " + t.code + " (" + (TONER_DB[t.code]?.role || '미지정') + "): " + formatWeight(t.adjustedWeight) + "g").join('\n'); 
    let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin;
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); 
    const shareUrl = currentOrigin + window.location.pathname + "?d=" + btoa(unescape(encodeURIComponent(payloadStr)));
    
    let resultText = "[조색 배합 지시서]\n================================\n📅 등록날짜: " + registrationDate + "\n🚗 차량번호: " + (vehicleNumber || '미지정') + "\n🚙 브랜드: " + (carModel || '미지정') + "\n🎨 컬러코드: " + (targetColorCode || '미지정') + "\n🛠️ 작업내용: " + (jobDescription || '미지정') + "\n📌 특이사항: " + (specialNotes || '없음') + "\n================================\n\n[▼ 베이스 코트]\n";
    resultText += (baseListText || '  (입력 데이터 없음)') + "\n--------------------------------\n▶ 순수 안료 합계: " + totalBaseWeight + "g\n▶ 필수 수지(20%): " + formatWeight(parseFloat(totalBaseWeight) * 0.2) + "g\n▶ 베이스 총 중량: " + formatWeight(parseFloat(totalBaseWeight) * 1.2) + "g\n\n";
    
    if (isThreeCoatMode) {
        resultText += "[▼ 펄 코트]\n" + (pearlListText || '  (입력 데이터 없음)') + "\n--------------------------------\n▶ 순수 펄 합계: " + totalPearlWeight + "g\n▶ 펄 수지(30%): " + formatWeight(parseFloat(totalPearlWeight) * 0.3) + "g\n▶ 펄 코트 총 중량: " + formatWeight(parseFloat(totalPearlWeight) * 1.3) + "g\n\n";
    }
    
    resultText += "================================\n✨ 최종 도막 혼합 총량: " + totalFinalWeight + "g\n\n👉 링크:\n" + shareUrl;
    
    return resultText;
  };

  const handleShareKakao = () => { 
      const shareText = generateShareText();
      window.location.href = `kakaotalk://send?text=${encodeURIComponent(shareText)}`;
      setIsShareModalOpen(false);
  };
  const handleShareSMS = () => { window.location.href = `sms:?body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const handleShareMail = () => { window.location.href = `mailto:?subject=${encodeURIComponent('[조색 Pro] 배합 지시서 공유')}&body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  
  const generateSyncUrl = () => { 
      let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin; 
      const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); 
      return `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`; 
  };

  const handleSendToPcKakao = () => {
      const shareUrl = generateSyncUrl();
      const shareText = `[조색 Pro] PC로 작업 보내기\n차량: ${vehicleNumber} / ${carModel}\n컬러: ${targetColorCode}\n👉 PC 카톡에서 아래 링크 클릭:\n${shareUrl}`;
      window.location.href = `kakaotalk://send?text=${encodeURIComponent(shareText)}`;
  };

  const handleCopyLinkForPc = () => {
      const url = generateSyncUrl();
      if (navigator.clipboard) {
          navigator.clipboard.writeText(url).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
          });
      }
  };

  const handleDirectExcelCopy = () => {
      const shareUrl = generateSyncUrl(); const plainText = `${registrationDate || '-'}	${vehicleNumber || '미입력'}	${carModel || '미입력'}	${targetColorCode || '미지정'}	${jobDescription || '미입력'}	${specialNotes || '-'}	${shareUrl}`;
      const htmlText = `<meta charset="utf-8"><table><tr><td>${registrationDate || '-'}</td><td>${vehicleNumber || '미입력'}</td><td>${carModel || '미입력'}</td><td>${targetColorCode || '미지정'}</td><td>${jobDescription || '미입력'}</td><td>${specialNotes || '-'}</td><td><a href="${shareUrl}">[배합보기]</a></td></tr></table>`;
      if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
          const htmlBlob = new Blob([htmlText], { type: 'text/html' }); const textBlob = new Blob([plainText], { type: 'text/plain' });
          const ClipboardItemConstructor = (window as any).ClipboardItem; const item = new ClipboardItemConstructor({ 'text/html': htmlBlob, 'text/plain': textBlob });
          navigator.clipboard.write([item]).then(() => { alert("✅ 엑셀 데이터가 복사되었습니다!"); }).catch(() => { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); }
      setIsExcelModalOpen(false);
  };
  const handleCopyExcelTemplate = () => { const headerRow = ['등록 날짜', '차량 번호', '브랜드/차종', '컬러코드', '작업내용', '특이사항', '배합보기'].join('\t'); if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(headerRow); alert("엑셀 헤더가 복사되었습니다."); } }
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  let width = img.width;
                  let height = img.height;
                  const MAX_WIDTH = 600; 
                  const MAX_HEIGHT = 600;
                  if (width > height) {
                      if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                  } else {
                      if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
                  }
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, width, height);
                  const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5); 
                  setAttachedImages(prev => [...prev, compressedBase64]);
                  alert("📷 시편 사진이 안전하게 최적화되어 추가되었습니다!");
              };
              img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
      }
  };

  const removeAttachedImage = (index: number) => {
      setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeletePostImage = (postId: number, imgIdx: number) => {
      if (window.confirm("이 사진을 삭제하시겠습니까?\n\n(삭제된 사진은 휴지통에서 3일간 보관된 후 영구 삭제됩니다.)")) {
          setBoardPosts(prev => prev.map(p => {
              if (p.id === postId) {
                  const newImages = [...p.images];
                  const removed = newImages.splice(imgIdx, 1)[0];
                  const deletedImages = p.deletedImages ? [...p.deletedImages] : [];
                  deletedImages.push({ url: removed, deletedAt: Date.now() });
                  return { ...p, images: newImages, deletedImages };
              }
              return p;
          }));
          
          if (viewingPost && viewingPost.id === postId) {
              const newImages = [...viewingPost.images];
              const removed = newImages.splice(imgIdx, 1)[0];
              const deletedImages = viewingPost.deletedImages ? [...viewingPost.deletedImages] : [];
              deletedImages.push({ url: removed, deletedAt: Date.now() });
              setViewingPost({ ...viewingPost, images: newImages, deletedImages });
          }
      }
  };

  const handleRestorePostImage = (postId: number, delIdx: number) => {
      setBoardPosts(prev => prev.map(p => {
          if (p.id === postId && p.deletedImages) {
              const newDeleted = [...p.deletedImages];
              const restored = newDeleted.splice(delIdx, 1)[0];
              return { ...p, images: [...p.images, restored.url], deletedImages: newDeleted };
          }
          return p;
      }));
      if (viewingPost && viewingPost.id === postId) {
          const newDeleted = [...viewingPost.deletedImages];
          const restored = newDeleted.splice(delIdx, 1)[0];
          setViewingPost({ ...viewingPost, images: [...viewingPost.images, restored.url], deletedImages: newDeleted });
      }
  };

  const handlePermanentDeletePostImage = (postId: number, delIdx: number) => {
      if (!window.confirm("이 사진을 영구적으로 삭제하시겠습니까?\n(이 작업은 취소할 수 없습니다.)")) return;
      setBoardPosts(prev => prev.map(p => {
          if (p.id === postId && p.deletedImages) {
              const newDeleted = [...p.deletedImages];
              newDeleted.splice(delIdx, 1);
              return { ...p, deletedImages: newDeleted };
          }
          return p;
      }));
      if (viewingPost && viewingPost.id === postId) {
          const newDeleted = [...viewingPost.deletedImages];
          newDeleted.splice(delIdx, 1);
          setViewingPost({ ...viewingPost, deletedImages: newDeleted });
      }
  };

  const saveToBoard = () => {
      if(!targetColorCode) { alert("⚠️ 컬러코드를 입력해야 합니다!"); return; }
      
      const now = new Date();
      const timeFormatted = `${registrationDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newPost: BoardPost = { 
          id: Date.now() + Math.random(), 
          brand: carModel || '미지정', 
          code: targetColorCode, 
          date: timeFormatted, 
          likes: 0, 
          views: 0, 
          author: '내 데이터', 
          spec: specialNotes || '특이사항 없음', 
          baseFormula: [...toners], 
          pearlFormula: [...pearlToners], 
          isThreeCoat: isThreeCoatMode,
          images: [...attachedImages],
          deletedImages: []
      };
      setBoardPosts([newPost, ...boardPosts]); 
      setAttachedImages([]); 
      alert("🎉 시편 사진들과 함께 게시판에 등록되었습니다!");
  };

  const deleteBoardPost = (id: number, e: React.MouseEvent) => { e.stopPropagation(); if (window.confirm("이 시편 데이터를 완전히 삭제하시겠습니까?")) setBoardPosts(prev => prev.filter(post => post.id !== id)); };
  const handleSaveSnapshot = () => { const newSnapshot = { id: Date.now(), timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }), dateStr: new Date().toLocaleDateString('ko-KR'), base: JSON.parse(JSON.stringify(toners)), pearl: JSON.parse(JSON.stringify(pearlToners)), isThreeCoat: isThreeCoatMode, totalFinal: totalFinalWeight }; setSnapshots(prev => [newSnapshot, ...prev]); alert(`[${newSnapshot.timestamp}] 데이터가 확정 저장되었습니다.`); };
  const restoreSnapshot = (snapshot: any) => { if (window.confirm("복원하시겠습니까?")) { setToners(JSON.parse(JSON.stringify(snapshot.base))); setPearlToners(JSON.parse(JSON.stringify(snapshot.pearl))); setIsThreeCoatMode(snapshot.isThreeCoat); setSelectedSnapshot(null); setIsSnapshotModalOpen(false); } };
  const handleSavePostEdit = () => { setBoardPosts(prev => prev.map(p => p.id === viewingPost.id ? { ...p, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec } : p)); setViewingPost({ ...viewingPost, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec }); setIsEditingPost(false); };
  const handleOpenPost = (post: any) => { setViewingPost(post); setEditPostForm({ brand: post.brand, code: post.code, spec: post.spec }); setIsEditingPost(false); };

  const handleGoogleGlossarySearch = () => {
      const inputEl = document.getElementById('glossarySearchInput') as HTMLInputElement;
      const val = inputEl?.value?.trim();
      if(!val) { alert("사전 검색창에 뜻이 궁금한 용어를 직접 입력하세요!"); return; }
      window.open(`https://www.google.com/search?q=스피스헥커+${val}+뜻`, '_blank');
  };

  const showBottomBar = !(isMobile && isKeyboardOpen);

  // 🚨 [NEW] 승인 로그인 화면 (비인가자 차단)
  if (!isAuthorized) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-slate-200 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"><Lock size={32} className="text-white"/></div>
                  <h1 className="text-2xl font-black text-slate-800 mb-2">조색 Pro 접근 승인</h1>
                  <p className="text-sm text-slate-500 mb-8 text-center break-keep">이 앱은 승인된 작업자만 사용할 수 있습니다. 관리자에게 부여받은 이름과 코드를 입력해주세요.</p>
                  
                  <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                      <div>
                          <label className="text-xs font-bold text-slate-600 mb-1.5 block">작업자 이름 (또는 상호명)</label>
                          <input 
                              type="text" 
                              value={loginForm.name} 
                              onChange={e => setLoginForm({...loginForm, name: e.target.value})}
                              placeholder="홍길동" 
                              className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-600 mb-1.5 block">초대 코드 (마스터 키)</label>
                          <input 
                              type="password" 
                              value={loginForm.key} 
                              onChange={e => setLoginForm({...loginForm, key: e.target.value})}
                              placeholder="******" 
                              className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              required
                          />
                      </div>
                      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 rounded-lg mt-4 transition-colors shadow-md flex justify-center items-center gap-2">
                          <ShieldCheck size={18}/> 시스템 접속 승인
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-[240px] md:pb-[140px] notranslate" translate="no">
      
      <header className="bg-slate-900 flex flex-col md:flex-row justify-between items-center p-3 border-b border-slate-800 shadow-md shrink-0 gap-3 z-40">
        <div className="flex flex-col sm:flex-row items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center bg-slate-800 p-1.5 rounded-xl border border-slate-700 shadow-inner w-full sm:w-auto justify-center">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 cursor-default">
                    <span className="text-red-600 font-black italic text-sm tracking-tighter">Spies Hecker</span>
                </div>
                <button 
                    onClick={() => { window.location.replace("https://glasurit-pro-v2-2va8x70wv-ysm0427-1929s-projects.vercel.app"); }} 
                    className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-all group cursor-pointer"
                    title="글라슈리트 90라인으로 이동"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform origin-center">🦜</span>
                    <span className="font-bold text-xs tracking-wide">Glasurit</span>
                </button>
            </div>
            <span className="bg-slate-800 text-slate-400 text-[10px] px-2.5 py-1 rounded-full border border-slate-700 hidden md:inline-block shrink-0">Last Patch: {LAST_PATCH_DATE}</span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide snap-x items-center">
            {/* 🚨 [NEW] 승인 사용자 관리 버튼 */}
            <button onClick={() => setIsUsersModalOpen(true)} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Users size={14} /> 승인된 작업자 <span className="bg-indigo-900 px-1.5 py-0.5 rounded text-[10px]">{authorizedUsers.length}명</span>
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>

            <button onClick={() => { setIsCloudModalOpen(true); setCopied(false); }} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                ☁️ 기기 간 초고속 연동
            </button>
            <button onClick={() => setIsGlossaryModalOpen(true)} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                📖 도장/조색 용어 사전
            </button>
            <button onClick={() => setIsBoardOpen(true)} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Layers size={14} /> 시편 게시판
            </button>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center shrink-0"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 워크 시트</h2>
              <button onClick={handleClearAllInfo} className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center transition-colors bg-white hover:bg-red-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm shrink-0"><Trash2 size={14} className="mr-1"/> 전체 초기화</button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📅 등록 날짜</label><input type="date" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm cursor-pointer" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚗 차량 번호</label><input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="예: 12가3456" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚙 브랜드 등록</label><input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="예: 현대, BMW..." className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🎨 컬러코드</label><input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="예: UX" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full uppercase focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm notranslate" translate="no" /></div>
              </div>
              <div><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🛠️ 작업 내용</label><input type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="예: 조수석 앞휀다 교환 등" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
              <div><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📌 특이사항 및 스펙 메모</label><input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="직접 입력 (예: 이색 심함)" className="bg-yellow-50 border-yellow-400 border p-2.5 rounded text-sm font-bold w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              
              <div className="flex w-full gap-2 mt-2">
                <button onClick={() => setIsExcelModalOpen(true)} className="flex-[1.2] bg-green-600 text-white p-3 rounded text-xs font-black flex items-center justify-center hover:bg-green-700 shadow-sm"><FileSpreadsheet size={16} className="mr-1 hidden sm:block"/> 엑셀 복사</button>
                
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className={`flex-[1.2] ${attachedImages.length > 0 ? 'bg-amber-600 hover:bg-amber-700' : 'bg-slate-700 hover:bg-slate-600'} text-white p-3 rounded text-xs font-black flex items-center justify-center shadow-sm`}>
                    <Camera size={16} className="mr-1 hidden sm:block"/> {attachedImages.length > 0 ? `사진(${attachedImages.length})` : '사진첨부'}
                </button>

                <button onClick={() => { saveToBoard(); setIsBoardOpen(true); }} className="flex-[1.3] bg-blue-600 text-white p-3 rounded text-xs font-black flex items-center justify-center hover:bg-blue-700 shadow-sm"><Layers size={16} className="mr-1 hidden sm:block"/> 시편 등록</button>
                
                <button onClick={() => setIsShareModalOpen(true)} className="flex-[1.8] bg-[#FEE500] text-slate-900 p-3 rounded text-sm font-black flex items-center justify-center hover:bg-[#E5C100] shadow-sm"><Share2 size={18} className="mr-1.5"/> 공유 전송</button>
                <button onClick={handleResetFormula} className="bg-white border border-red-200 text-red-500 px-3 rounded flex flex-col items-center justify-center hover:bg-red-50 shadow-sm whitespace-nowrap"><Trash2 size={18} className="mb-0.5" /><span className="text-[9px] font-black">리셋</span></button>
              </div>

              {attachedImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2 px-2 bg-amber-50/50 rounded-xl border border-amber-200">
                      {attachedImages.map((imgSrc, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-amber-300 shrink-0 shadow-sm group bg-white">
                              <img src={imgSrc} alt={`시편 ${idx+1}`} className="w-full h-full object-cover cursor-pointer" onClick={() => setPreviewModalImage(imgSrc)} />
                              <button onClick={() => removeAttachedImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 shadow-md">
                                  <X size={10} />
                              </button>
                          </div>
                      ))}
                  </div>
              )}
            </div>
          </div>
          
          <div className="p-3 bg-white">
            <div className="mb-4 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-between shadow-sm gap-2">
                <div className="flex items-center gap-2"><Beaker size={14} className="text-indigo-600" /><span className="text-xs font-bold text-indigo-800">현장 실시간 용량 배율 변환기</span></div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <input type="text" inputMode="decimal" value={scaleFactor} onChange={(e) => setScaleFactor(e.target.value.replace(/[^0-9.]/g, ''))} className="w-12 text-center text-sm font-black text-indigo-700 border rounded py-1" />
                    <span className="text-[11px] font-bold text-indigo-400 mr-1">배</span>
                    <button onClick={() => handleScaleAll(true)} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm hover:bg-indigo-700 transition-colors">× 곱하기</button>
                    <button onClick={() => handleScaleAll(false)} className="bg-white border border-indigo-300 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded shadow-sm hover:bg-indigo-50 transition-colors">÷ 나누기</button>
                </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 flex justify-between border-b pb-1"><span>▼ 베이스 원색 리스트 (Ground Coat)</span></div>
              {toners.map((toner) => {
                const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
                const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
                return (
                  <div key={toner.id} className="flex flex-col bg-slate-50 hover:bg-blue-50/50 p-2.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
                    
                    <div className="flex items-center w-full gap-2">
                      <button 
                           type="button"
                           className="flex w-[50px] h-[36px] rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-blue-400" 
                           onClick={() => setMemoModal({isOpen: true, id: toner.id, code: toner.code, isPearl: false, text: toner.memo || '', history: toner.history || []})}
                           title="메모 및 히스토리 보기"
                      >
                           <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                           <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                           {toner.memo && <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white shadow-md z-20"></div>}
                      </button>
                      
                      <input 
                          ref={el => { codeRefs.current[toner.id] = el; }} 
                          value={toner.code.replace('WT ', '').replace('PP ', '')} 
                          onChange={e => handleCodeChange(toner.id, e.target.value, false)} 
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                          type="text"
                          inputMode="decimal" 
                          pattern="[0-9]*" 
                          className="w-16 h-[36px] text-center text-sm font-black border border-slate-300 rounded focus:border-blue-500 focus:outline-none shadow-inner shrink-0 uppercase" 
                          placeholder="번호" 
                      />

                      <div className="flex-1"></div>

                      <div className="flex items-center bg-white border rounded-md px-1 h-[36px] shrink-0 shadow-sm">
                         <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                         <input 
                             ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" pattern="[0-9]*" value={toner.adjustedWeight} 
                             onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} onBlur={e => handleWeightBlur(toner.id, e.target.value, false)} onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                             className="w-14 text-right text-[15px] font-black text-blue-600 focus:outline-none clean-number-input" placeholder="0.0" 
                         />
                         <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="px-2 py-1 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                         <span className="text-[10px] font-bold text-slate-400 ml-1">g</span>
                         <button onClick={() => removeToner(toner.id, false)} className="ml-1 px-1"><Trash2 size={16} className="text-slate-300 hover:text-red-500 transition-colors"/></button>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 cursor-pointer hover:bg-blue-100/50 py-1.5 px-1 mt-1 rounded transition-colors w-full" onClick={() => toggleExpand(toner.id, false)}>
                        <span className="font-bold text-blue-800 text-[13px] leading-tight flex-1 pl-1 text-left break-keep">
                            {toner.code ? (info.role || '등록된 안료 정보 없음') : '안료 번호를 입력하세요 (예: 321, 385...)'}
                        </span>
                        {toner.isExpanded ? <ChevronUp size={16} className="text-blue-400 shrink-0" /> : <ChevronDown size={16} className="text-blue-400 shrink-0" />}
                    </div>

                    {toner.isExpanded && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-1 pt-2 border-t border-slate-200">
                            {info.details && info.details.length > 0 ? (
                                <div className="flex flex-col gap-1.5 w-full">
                                    {info.details.map((d: any, idx: number) => {
                                        const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                        if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                        return (
                                        <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2.5 mb-2">
                                            <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-1 py-1.5 rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                <span className="text-[11px] font-black leading-tight break-keep">{mainTitle}</span>
                                                {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                            </div>
                                            <span className="text-[11px] text-slate-700 leading-relaxed break-keep pt-0.5 whitespace-pre-line">{d[1]}</span>
                                        </div>
                                    )})}
                                </div>
                            ) : <p className="text-[11px] text-slate-500 leading-tight break-keep pl-1">{info.desc}</p>}
                        </div>
                    )}
                  </div>
                )
              })}

              <div className="flex w-full gap-2 mt-3">
                  <button onClick={() => addToner(false)} className="flex-1 py-3 border border-dashed border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 rounded-lg text-slate-500 hover:text-blue-600 font-bold text-sm flex justify-center items-center transition-all shadow-sm">
                      <Plus size={18} className="mr-1"/>베이스 안료 추가
                  </button>
                  <button onClick={handleSaveSnapshot} className="w-[100px] sm:w-[130px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-[11px] sm:text-sm flex flex-col sm:flex-row justify-center items-center transition-all shadow-sm">
                      <Save size={16} className="mb-1 sm:mb-0 sm:mr-1.5"/>데이터 확정
                  </button>
                  <button onClick={() => setIsSnapshotModalOpen(true)} className="w-[100px] sm:w-[130px] bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-bold text-[11px] sm:text-sm flex flex-col sm:flex-row justify-center items-center transition-all shadow-sm relative">
                      <History size={16} className="mb-1 sm:mb-0 sm:mr-1.5"/>수정 내역
                      {snapshots.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white">{snapshots.length}</span>}
                  </button>
              </div>
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
                  const isEffect = info.type !== 'solid' && info.type !== 'binder' && info.type !== 'candy';
                  return (
                    <div key={toner.id} className="flex flex-col bg-purple-50 p-2.5 rounded-xl border border-purple-200 shadow-sm transition-colors hover:bg-purple-100/50">
                      
                      <div className="flex items-center w-full gap-2">
                        <button 
                             type="button"
                             className="flex w-[50px] h-[36px] rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer relative focus:outline-none focus:ring-2 focus:ring-purple-400" 
                             onClick={() => setMemoModal({isOpen: true, id: toner.id, code: toner.code, isPearl: true, text: toner.memo || '', history: toner.history || []})}
                             title="메모 및 히스토리 보기"
                        >
                             <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                             <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                             {toner.memo && <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 w-4 h-4 rounded-full border-2 border-white shadow-md z-20"></div>}
                        </button>
                        
                        <input 
                            ref={el => { codeRefs.current[toner.id] = el; }} 
                            value={toner.code.replace('WT ', '').replace('PP ', '')} 
                            onChange={e => handleCodeChange(toner.id, e.target.value, true)} 
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                            type="text" 
                            inputMode="decimal"
                            pattern="[0-9]*"
                            className="w-16 h-[36px] text-center text-sm font-black border border-purple-200 rounded text-purple-800 shadow-inner focus:outline-none focus:border-purple-500 shrink-0 uppercase" 
                            placeholder="번호" 
                        />

                        <div className="flex-1"></div>

                        <div className="flex items-center bg-white border border-purple-100 rounded-md px-1 h-[36px] shrink-0 shadow-sm">
                           <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                           <input 
                               ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" pattern="[0-9]*" value={toner.adjustedWeight} 
                               onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} onBlur={e => handleWeightBlur(toner.id, e.target.value, true)} onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} 
                               className="w-14 text-right text-[15px] font-black text-purple-600 focus:outline-none clean-number-input" placeholder="0.0" 
                           />
                           <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="px-2 py-1 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                           <span className="text-[10px] font-bold text-slate-400 ml-1">g</span>
                           <button onClick={() => removeToner(toner.id, true)} className="ml-1 px-1"><Trash2 size={16} className="text-purple-300 hover:text-red-500 transition-colors"/></button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 cursor-pointer hover:bg-purple-100/50 py-1.5 px-1 mt-1 rounded transition-colors w-full" onClick={() => toggleExpand(toner.id, true)}>
                          <span className="font-bold text-purple-800 text-[13px] leading-tight flex-1 pl-1 text-left break-keep">
                              {toner.code ? (info.role || '등록된 펄 정보 없음') : '펄 번호를 입력하세요 (예: PP201...)'}
                          </span>
                          {toner.isExpanded ? <ChevronUp size={16} className="text-purple-400 shrink-0" /> : <ChevronDown size={16} className="text-purple-400 shrink-0" />}
                      </div>

                      {toner.isExpanded && (
                          <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-1 pt-2 border-t border-purple-200">
                              {info.details && info.details.length > 0 ? (
                                  <div className="flex flex-col gap-1.5 w-full">
                                      {info.details.map((d: any, idx: number) => {
                                          const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                          if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                          return (
                                          <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2.5 mb-2">
                                              <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                  <span className="text-[10.5px] font-black leading-tight">{mainTitle}</span>
                                                  {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                              </div>
                                              <span className={`text-[11.5px] leading-relaxed break-keep pt-0.5 whitespace-pre-line ${getBadgeClass(d[0]).includes('yellow') ? 'text-yellow-800 font-bold' : 'text-slate-700'}`}>{d[1]}</span>
                                          </div>
                                      )})}
                                  </div>
                              ) : <p className="text-[11px] text-slate-500 leading-tight break-keep pl-1">{info.desc}</p>}
                          </div>
                      )}
                    </div>
                  )
                })}

                <button onClick={() => addToner(true)} className="w-full py-3 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 rounded-lg text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-3 shadow-sm">
                    <Plus size={18} /><span>펄 조색제 추가</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-3 shrink-0 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-black mb-2 flex justify-between items-center text-slate-800">
                <span className="flex items-center"><Target size= {14} className="mr-1 text-blue-600"/> 📘 마스터 기술자료실 (Visual Guide)</span>
                <button onClick={() => setIsConfiguratorOpen(true)} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"><Maximize size={10} className="mr-1"/>먼셀 믹싱 랩</button>
              </h3>
              
              <div className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-md border border-blue-200">
                  <div className="flex border-b border-blue-200 bg-slate-50">
                      {['theory', 'spectrum', 'effect', 'special'].map(tab => (
                          <button key={tab} onClick={() => setActiveGuideTab(tab as any)} className={`flex-1 py-3 text-[12px] font-black transition-all ${activeGuideTab === tab ? 'bg-blue-600 text-white shadow-md transform scale-[1.02] rounded-t-xl z-10' : 'text-slate-500 hover:text-blue-700 hover:bg-blue-50'}`}>
                              {tab === 'theory' ? '이론/기초' : tab === 'spectrum' ? '컬러 맵' : tab === 'effect' ? '이펙트/펄' : '특수/3코트'}
                          </button>
                      ))}
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-3 h-52 overflow-y-auto custom-scrollbar bg-slate-50/50">
                      {GUIDE_IMAGES[activeGuideTab].map(img => (
                          <div key={img.id} onClick={() => openImageModal(img)} className="bg-white rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 hover:shadow-xl transition-all shadow-sm border border-slate-200 group flex flex-col justify-center items-center text-center p-4 min-h-[90px] relative">
                              {img.url && (
                                  <div className="absolute inset-0 z-0">
                                      <img src={img.url} alt={img.title} className="w-full h-full object-cover opacity-10 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                              )}
                              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-1 transition-colors duration-300">
                                  <h4 className="text-[13px] font-black text-blue-800 group-hover:text-blue-600 mb-1.5 leading-tight drop-shadow-sm">{img.title}</h4>
                                  <p className="text-[11px] font-bold text-slate-500 group-hover:text-slate-700 break-keep leading-tight">{img.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>

              <div className="flex gap-2 mt-3 relative z-50">
                  <button onClick={() => setIsPearlGuideOpen(true)} className="flex-1 bg-purple-100 border border-purple-300 text-purple-900 py-2.5 rounded-lg text-sm font-black flex items-center justify-center hover:bg-purple-200 transition-colors shadow-sm cursor-pointer">
                      <BookOpen size={16} className="mr-1.5" /> <span className="pointer-events-none">PP(분말) 가이드 열기</span>
                  </button>
                  <button onClick={() => setIsProcessOpen(true)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-2.5 rounded-lg text-sm font-black flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors shadow-sm cursor-pointer">
                      <Code size={16} className="mr-1.5 text-slate-400 pointer-events-none" /> <span className="pointer-events-none">Pro 제작 과정 보기</span>
                  </button>
              </div>
            </div>

            <div className="flex flex-col h-full bg-slate-100">
                <div className="flex bg-slate-900 shrink-0 border-b border-slate-700">
                    <button onClick={()=>{setActiveTab('WT'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'WT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>💧 WT (액상)</button>
                    <button onClick={()=>{setActiveTab('PP'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'PP' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>🌬️ PP (분말)</button>
                    <button onClick={()=>{setActiveTab('CANDY'); setCatalogSearch('');}} className={`flex-1 py-3 text-sm font-black transition-colors ${activeTab === 'CANDY' ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-slate-200'}`}>🍬 CANDY</button>
                </div>
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex shrink-0 gap-2">
                    <div className="relative flex-1">
                        <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="안료명 / 차량코드 / 색상명 검색 (띄어쓰기 무관)" className="w-full bg-slate-900 border border-slate-600 text-white text-xs px-2.5 py-2 rounded-lg pl-8 focus:outline-none focus:border-blue-500 transition-colors" />
                        <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                    {activeTab === 'CANDY' && (
                        <div className="mb-4 bg-yellow-50 border border-yellow-300 p-4 rounded-xl shadow-sm">
                           <h4 className="text-sm font-black text-yellow-800 mb-2">⚠️ 퍼마솔리드 캔디 6단계 시공 및 3대 철칙</h4>
                           <ul className="text-xs text-yellow-700 space-y-1.5 font-bold">
                              <li>1. 이소시아네이트 포함. 방독 마스크 및 환기 필수</li>
                              <li>2. 반사층 도장 후 완벽한 플래시 오프 필수</li>
                              <li>3. 블렌딩 불가(전체 도장), 건조 타임 준수</li>
                              <li>4. 2액형 클리어 조색비 엄수 및 Clear over Clear 필수</li>
                           </ul>
                        </div>
                    )}
                    
                    {/* ✅ 버그 패치: OEM 검색 띄어쓰기 및 대소문자 무시 (정밀 패치) */}
                    {catalogSearch.replace(/\s/g, '') !== '' && OEM_COLORS.some(c => String(c.code).replace(/\s/g, '').toUpperCase().includes(catalogSearch.replace(/\s/g, '').toUpperCase()) || String(c.name).replace(/\s/g, '').toUpperCase().includes(catalogSearch.replace(/\s/g, '').toUpperCase())) && (
                        <div className="mb-2 p-3 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                            <h4 className="text-xs font-black text-blue-800 mb-2">🔍 자동차 제조사(OEM) 색상 검색 결과</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {OEM_COLORS.filter(c => String(c.code).replace(/\s/g, '').toUpperCase().includes(catalogSearch.replace(/\s/g, '').toUpperCase()) || String(c.name).replace(/\s/g, '').toUpperCase().includes(catalogSearch.replace(/\s/g, '').toUpperCase())).slice(0, 20).map((oem, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors" onClick={() => setTargetColorCode(String(oem.code))}>
                                        <span className="font-black text-blue-600 text-sm">{oem.code}</span>
                                        <span className="text-xs text-slate-600 font-bold truncate max-w-[100px]" title={oem.name}>{oem.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {sortedCatalog.map((item) => {
                        const isMetallic = item.type !== 'solid' && item.type !== 'binder' && item.type !== 'candy';
                        const isCurrentlyUsed = activeCodes.includes(item.code);
                        return (
                            <div key={item.code} className={`flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isCurrentlyUsed ? 'border-2 border-blue-500 shadow-md transform scale-[1.01]' : 'border-slate-200 hover:border-blue-300 cursor-pointer'}`} onClick={() => setSelectedTonerForView(item.code)}>
                                <div className="h-12 w-full relative transition-all border-b border-slate-200" style={{background: getTonerDetailBackground(item.code, item.role, 'face')}}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    <div className="absolute bottom-1.5 left-3 text-white text-sm font-black drop-shadow-md">{item.code} <span className="text-[10px] font-normal opacity-90 ml-1">{item.role}</span></div>
                                    {isCurrentlyUsed && <div className="absolute top-1.5 right-2 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow">배합 중</div>}
                                </div>
                                <div className="p-3 flex flex-col gap-1.5">
                                    <p className="text-[11px] text-slate-500 font-bold mb-1 break-keep leading-tight bg-slate-50 p-1.5 rounded">{item.desc}</p>
                                    {item.details?.map((d: any, idx: number) => {
                                        const splitIndex = d[0].indexOf('('); let mainTitle = d[0]; let subTitle = '';
                                        if(splitIndex !== -1) { mainTitle = d[0].substring(0, splitIndex).trim(); subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); }
                                        return (
                                        <div key={idx} className="flex items-start gap-2.5 mb-2">
                                            <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 text-[10px] font-bold rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                <span className="text-[10px] font-black leading-tight">{mainTitle}</span>
                                                {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                            </div>
                                            <span className={`text-[11.5px] leading-relaxed break-keep pt-0.5 whitespace-pre-line ${getBadgeClass(d[0]).includes('yellow') ? 'text-yellow-800 font-black' : 'text-slate-700'}`}>{d[1]}</span>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
          </div>
        </div>
      </div>
