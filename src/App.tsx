// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, X, Maximize, Beaker, Sun, 
  Layers, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, 
  FileSpreadsheet, History, Mail, Code, Calendar, Eye, ThumbsUp, 
  CheckCircle, Edit3, Target, MessageSquare, Send, Save, RefreshCw, Camera, AlertTriangle, Image as ImageIcon, Cloud,
  QrCode, Smartphone, Monitor, Link, Check, Users, Lock, ShieldCheck, Briefcase, MapPin, UserCheck, Hash,
  ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';

import { TONER_DB, shortcuts, PEARL_LEVELS, OEM_COLORS } from './tonerDB';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase 설정 및 초기화 (대표님 파이어베이스 프로젝트 연동 열쇠)
const firebaseConfig = {
  apiKey: "AIzaSyAaVn1BUqEhBNFLDuCMu9zy2VQpOdGHMvI",
  authDomain: "josek-pro.firebaseapp.com",
  projectId: "josek-pro",
  storageBucket: "josek-pro.firebasestorage.app",
  messagingSenderId: "704984614633",
  appId: "1:704984614633:web:42f263f9ebfcaf68089278",
  measurementId: "G-6T7TJRKH1J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (typeof window !== 'undefined' && !document.querySelector('#tailwind-script')) {
  const script = document.createElement('script');
  script.id = 'tailwind-script';
  script.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(script);
}

// 📌 [Mission 5] 누락된 WT 340 및 특수 캔디 라인업 상세 스펙 완벽 주입 (기존 화이트톤 UI 100% 호환)
if (!TONER_DB['WT 340']) TONER_DB['WT 340'] = { role: '옐로우 마젠타 레드', type: 'solid', face: '#E53935', flop: '#B71C1C', desc: '맑은 자주색 조색제. 338에 비해 밝고 청색이 적음. 주로 이펙트 컬러에 사용함. 알루미늄 입자에 혼합할 경우 맑은 분홍색을 냄', details: [['일반 특성', '맑은 자주색 조색제로 338에 비해 밝고 청색이 적습니다.'], ['혼합 특성', '주로 이펙트 컬러에 사용하며, 알루미늄 입자에 혼합할 경우 맑은 분홍색을 냅니다.'], ['외관 변화', '정면과 측면 모두 맑고 화사한 적자색(Pinkish Red)을 띱니다.'], ['타겟 컬러', '고채도 레드, 핑크 계열 이펙트 컬러 및 솔리드 레드'], ['배합 비율', '조색 데이터에 따라 베이스 및 펄 컬러에 다양하게 적용'], ['조색 한계점', '은폐력이 매우 낮아 단독 사용 시 바닥이 비칠 수 있습니다.'], ['비교 분석', 'WT 338(블루이쉬 마젠타)보다 청색조가 덜하고 따뜻한 핑크/레드빛을 강하게 띱니다.']] };
if (!TONER_DB['9031']) TONER_DB['9031'] = { role: '애플 레드 (Apple Red)', type: 'candy', face: '#8b0000', flop: '#ff0000', desc: '은폐력 제로의 투명하고 깊은 정통 캔디 레드. 맑은 사과빛 심도를 냅니다.', details: [['🎯 캔디 도장 공정', '고휘도 실버(WT 361/303) 또는 거친 다이아몬드 하도를 완벽하게 건조한 뒤, 2액형 클리어와 정밀 혼합하여 겹침 없이 일정한 두께로 코팅해야 얼룩을 막을 수 있습니다.'], ['💡 비교 분석', '[비교] 캔디 9031 vs 일반 투명 틴트 WT 311\nWT 311(루비레드)은 단독 보카시(블렌딩)가 가능하지만, 9031 캔디는 블렌딩이 절대 불가(전체 도장 필수)하며 일반 틴트가 흉내 낼 수 없는 극강의 3D 입체 투명 심도(유리알 텍스처)를 냅니다.']] };
if (!TONER_DB['9032']) TONER_DB['9032'] = { role: '오션 블루 (Ocean Blue)', type: 'candy', face: '#004488', flop: '#0088ff', desc: '심연의 바다처럼 깊고 투명한 시안 커스텀 캔디 블루입니다.', details: [['🎯 캔디 도장 공정', '스프레이 건의 에어 압력을 높이고 토출량을 줄여 아주 곱고 균일하게 미스트를 쪼개어 도포해야 투명감을 살릴 수 있습니다.'], ['💡 비교 분석', '[비교] 캔디 9032 vs 일반 투명 틴트 WT 348\n일반 투명 틴트(348)도 맑은 편이나 한계가 있는 반면, 9032 캔디는 두껍게 올릴수록 심해가 깊어지듯 끝을 알 수 없는 딥 블루 3D 심도를 연출합니다.']] };
if (!TONER_DB['9033']) TONER_DB['9033'] = { role: '선셋 골드 (Sunset Gold)', type: 'candy', face: '#886600', flop: '#ffcc00', desc: '노올빛 화려한 황금 스파클 캔디 필터를 제공합니다.', details: [['⚠️ 캔디 3대 철칙', '부분 도장(보카시/블렌딩)은 물리적으로 절대 불가하며, 반드시 패널 전체를 한 판 단위로 끊어서 도장해야 합니다.'], ['💡 비교 분석', '[비교] 캔디 9033 vs 일반 투명 틴트 WT 329\nWT 329는 얇은 황금빛 셀로판지라면, 9033 선셋 골드는 두꺼운 황금색 스테인드글라스처럼 압도적인 빛의 투과율과 공간감을 자랑합니다.']] };
if (!TONER_DB['9048']) TONER_DB['9048'] = { role: '마룬 / 흑갈색 투명 첨가제', type: 'candy', face: '#5a1827', flop: '#8b253f', desc: '엑솔타(Axalta) 스피스헥커 프리미엄 첨가제. 은폐력 제로의 투명하고 깊은 마룬(Maroon) 빛 심도를 냅니다.', details: [['🎯 캔디 도장 공정', '마쯔다(Mazda) 소울 레드 크리스탈(46V) 등 고휘도 실버 하도를 건조한 뒤, 2액형 클리어와 정밀 혼합하여 겹침(Overlap) 없이 코팅해야 얼룩을 막을 수 있습니다.']] };

const LAST_PATCH_DATE = "2026.10.19 (UI/UX 5대 편의성 마스터 패치 적용완료)"; 

const GUIDE_IMAGES: Record<string, any[]> = {
  theory: [
    { id: 1, title: '색의 인식과 3원색', desc: '빛의 혼합 / 안료 혼합 원리', url: '/image1.jpg' },
    { id: 2, title: '단색안료 특성', desc: '유기안료와 무기안료의 차이점', url: '/image2.jpg' },
    { id: 3, title: '빛과 안료 상호작용', desc: '솔리드 / 알루미늄 / 간섭펄 반사 원리', url: '/image3.jpg' },
    { id: 15, title: '추가 이론 자료 1', desc: '상세 가이드 페이지 (15)', url: '/image15.jpg' },
  ],
  spectrum: [
    { id: 4, title: '조색제 포스터의 이해', desc: '기호 읽는 법', url: '/image4.jpg' },
    { id: 5, title: '솔리드 포지셔닝 맵', desc: '솔리드 컬러 별 위치도', url: '/image5.jpg' },
    { id: 6, title: '황색/적색 계열도', desc: '명암 및 채도 방향성에 따른 비교', url: '/image6.jpg' },
    { id: 7, title: '청색/녹색/흑색 계열도', desc: '각 계열별 측면/정면 이색 비교', url: '/image7.jpg' },
  ],
  effect: [
    { id: 8, title: '이펙트 포지셔닝 맵', desc: '이펙트 컬러 조색제 별 위치도', url: '/image8.jpg' },
    { id: 9, title: '알루미늄 입자 특성', desc: '콘플레이크 vs 실버달러 형상 비교', url: '/image9.jpg' },
    { id: 10, title: '펄(Pearl) 입자 특성', desc: '천연 마이카 vs 시라릭 펄 현미경', url: '/image10.jpg' },
    { id: 11, title: 'PP펄 (파우더) 특성', desc: 'PP201~PP901 입자 및 현미경 비교', url: '/image11.jpg' },
  ],
  special: [
    { id: 12, title: 'WT386 특성', desc: '측면밝기조정제 명암 변화 원리', url: '/image12.jpg' },
    { id: 13, title: '3코트 컬러 특성', desc: '3코트 도장 및 얼룩 발생 주의사항', url: '/image13.jpg' },
    { id: 14, title: '틴티드 크리어 (Tinted Clear)', desc: '착색 클리어 시스템', url: '/image14.jpg' },
  ]
};

const ALL_GUIDE_IMAGES = [...GUIDE_IMAGES.theory, ...GUIDE_IMAGES.spectrum, ...GUIDE_IMAGES.effect, ...GUIDE_IMAGES.special];

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
  id: number; brand: string; code: string; date: string; likes: number; views: number; author: string; spec: string;
  baseFormula: any[]; pearlFormula: any[]; isThreeCoat: boolean; images: string[]; deletedImages?: { url: string; deletedAt: number }[]; 
}

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window !== 'undefined') return sessionStorage.getItem('hitec_auth_passed') === 'true';
    return false;
  });
  
  const [authForm, setAuthForm] = useState({ company: '', location: '', name: '', age: '', role: '사원' });
  const isAuthFormValid = authForm.company.trim() !== '' && authForm.location.trim() !== '' && authForm.name.trim() !== '' && String(authForm.age).trim() !== '';
  
  const [isApproving, setIsApproving] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState("");
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

  const [authorizedUsers, setAuthorizedUsers] = useState<any[]>(() => {
      if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('hitec_auth_users');
          if (saved) return JSON.parse(saved);
      }
      return [];
  });
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);

  const handleFakeApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthFormValid) return; 
    setIsApproving(true);
    setApprovalMessage("마스터(윤성만) 기기로 승인 요청 알림 전송 완료...");
    try {
      // 🚀 실시간 작업자 정보 Firebase 전송
      await addDoc(collection(db, "active_users"), {
        company: authForm.company,     // 소속 상호명
        location: authForm.location,   // 지점 위치
        name: authForm.name,           // 작업자 이름
        age: authForm.age,             // 연령
        role: authForm.role,           // 직책
        connectedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("전송 오류:", err);
    }
    await new Promise(r => setTimeout(r, 1000));
    setApprovalMessage("관리자가 입력된 소속 및 직책 정보를 확인하고 있습니다...");
    const phase2Delay = Math.floor(Math.random() * 2000) + 2500; 
    await new Promise(r => setTimeout(r, phase2Delay));
    setApprovalMessage("보안 접근 권한 부여 및 시스템 개방 중...");
    const phase3Delay = Math.floor(Math.random() * 1000) + 500; 
    await new Promise(r => setTimeout(r, phase3Delay));
    setIsApproving(false);
    setShowApprovalSuccess(true); 
  };

  const handleApprovalConfirm = () => {
    setShowApprovalSuccess(false);
    setIsAuthorized(true);
    sessionStorage.setItem('hitec_auth_passed', 'true');
  };

  const [isLoaded, setIsLoaded] = useState(false);
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false);
  const [isCandyCoatMode, setIsCandyCoatMode] = useState(false);
  const [candyClear, setCandyClear] = useState("100.0");
  const [candyHardener, setCandyHardener] = useState("50.0");
  const [candyCode, setCandyCode] = useState("");
  const [candyAdditive, setCandyAdditive] = useState("2.0");
  const [candyToners, setCandyToners] = useState<any[]>([{ id: `c_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [totalCandyWeight, setTotalCandyWeight] = useState("0");

  const handleCandyCodeChange = (id: string, newCode: string) => {
      const rawVal = newCode.toUpperCase(); const numOnly = rawVal.replace(/[^0-9]/g, ''); let finalCode = rawVal;
      if (rawVal.startsWith('90') && numOnly.length >= 4) finalCode = numOnly.substring(0, 4);
      else if (['1051', '1500', '455', 'AXT700'].includes(numOnly) || rawVal === 'AXT700') finalCode = rawVal === 'AXT700' ? 'AXT700' : numOnly;
      else if (numOnly) finalCode = `WT ${numOnly}`;
      setCandyToners(prev => prev.map(toner => { if (toner.id === id) { if (TONER_DB[finalCode]) { setFocusTarget({ id: id, type: 'weight' }); } return { ...toner, code: finalCode }; } return toner; }));
  };
  const handleCandyWeightInputChange = (id: string, rawValue: string) => {
      let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.'); if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
      if (val === '') val = ''; else if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, ''); else if (val.startsWith('.')) val = '0' + val;
      setCandyToners(candyToners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };
  const handleCandyWeightBlur = (id: string, value: string) => {
      if (!value) return; setCandyToners(prev => prev.map(t => { if (t.id === id) { const currentHistory = t.history || []; if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== value) return { ...t, history: [...currentHistory, value] }; } return t; }));
  };
  const handleCandyWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => { if (e.key === 'Enter') { e.preventDefault(); const newId = `new_c_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; setCandyToners([...candyToners, { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setFocusTarget({ id: newId, type: 'code' }); } };
  const removeCandyToner = (id: string) => setCandyToners(candyToners.filter(t => t.id !== id));
  const addCandyToner = () => {
      let tempInput: HTMLInputElement | undefined;
      if (typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          tempInput = document.createElement('input'); tempInput.type = 'number'; tempInput.style.position = 'fixed'; tempInput.style.top = '50%'; tempInput.style.left = '50%'; tempInput.style.opacity = '0'; tempInput.style.width = '1px'; tempInput.style.height = '1px'; document.body.appendChild(tempInput); tempInput.focus();
      }
      const newId = `new_c_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setCandyToners([...candyToners, { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
      setFocusTarget({ id: newId, type: 'code', tempInput });
  };
  const quickEditCandyWeight = (id: string, delta: number) => {
      setCandyToners(prev => prev.map(t => { if(t.id === id) { let newVal = Math.max(0, (parseFloat(t.adjustedWeight) || 0) + delta); let strVal = String(Number(Math.round(newVal * 100000) / 100000)); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory; return { ...t, adjustedWeight: strVal, history: nextHistory }; } return t; }));
  };
  const toggleCandyExpand = (id: string) => setCandyToners(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t));
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
  const [oemSearch, setOemSearch] = useState('');           
  
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedWheelIndex, setSelectedWheelIndex] = useState<number | null>(null);
  
  const [paletteDrops, setPaletteDrops] = useState({ red: 0, blue: 0, yellow: 0, green: 0, white: 0, black: 0 });

  const isAnyModalOpen = isUsersModalOpen || isGlossaryModalOpen || isBoardOpen || isShareModalOpen || isExcelModalOpen || !!viewingPost || isCloudModalOpen || !!previewModalImage || !!zoomedImage || memoModal.isOpen || isSnapshotModalOpen || isProcessOpen || isConfiguratorOpen || isPearlGuideOpen;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isAnyModalOpen) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = '';
      }
    }
    return () => { if (typeof window !== 'undefined') document.body.style.overflow = ''; };
  }, [isAnyModalOpen]);

  const handleWheelClick = (index: number) => { setSelectedWheelIndex(index); };

  const activeCodes = [...toners, ...pearlToners, ...(isCandyCoatMode && candyCode ? [{code: candyCode}] : [])].map(t => t.code).filter(c => c !== '');
  
  const sortedCatalog = [...catalogData].filter(item => {
    const code = item.code;
    if (activeTab === 'CANDY') return code.startsWith('90');
    if (activeTab === 'PP') return code.startsWith('PP');
    return !code.startsWith('90') && !code.startsWith('PP'); 
  }).sort((a, b) => { 
      const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); 
      if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; 
  }).filter(item => {
      const searchTxt = catalogSearch.toUpperCase();
      if (!searchTxt.trim()) return true;
      const searchTerms = searchTxt.split(/\s+/).filter(Boolean);
      const fullString = `${String(item.code || '')} ${String(item.role || '')} ${String(item.desc || '')}`.toUpperCase();
      return searchTerms.every(term => fullString.includes(term));
  });

  const filteredOemColors = OEM_COLORS.filter(c => {
      const searchTxt = oemSearch.toUpperCase();
      if (!searchTxt.trim()) return false;
      const searchTerms = searchTxt.split(/\s+/).filter(Boolean);
      const fullString = `${String(c.code || '')} ${String(c.name || '')}`.toUpperCase();
      return searchTerms.every(term => fullString.includes(term));
  });

  useEffect(() => { document.title = "조색 Pro"; }, []);

  useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
      const handleFocusIn = (e: FocusEvent) => { if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) setIsKeyboardOpen(true); };
      const handleFocusOut = () => { setTimeout(() => { if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '')) setIsKeyboardOpen(false); }, 150); };
      window.addEventListener('focusin', handleFocusIn); window.addEventListener('focusout', handleFocusOut);
      return () => { window.removeEventListener('focusin', handleFocusIn); window.removeEventListener('focusout', handleFocusOut); };
  }, []);

  useEffect(() => {
      if (boardPosts.length > 0) {
          const now = Date.now(); const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; let changed = false;
          const cleanedPosts = boardPosts.map(post => {
              if (post.deletedImages && post.deletedImages.length > 0) {
                  const validTrash = post.deletedImages.filter(img => now - img.deletedAt < THREE_DAYS_MS);
                  if (validTrash.length !== post.deletedImages.length) { changed = true; return { ...post, deletedImages: validTrash }; }
              }
              return post;
          });
          if (changed) setBoardPosts(cleanedPosts);
      }
  }, [boardPosts]);

  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (zoomedImage) {
        if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); 
    } else {
        if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'); 
    }
    return () => { if (meta) meta.setAttribute('content', 'width=device-width, initial-scale=1'); };
  }, [zoomedImage]);

  useEffect(() => {
      const el = scrollContainerRef.current; if (!el || !zoomedImage || zoomedImage.id === 12) return; 
      const handleNativeWheel = (e: WheelEvent) => { e.preventDefault(); const delta = e.deltaY < 0 ? 0.01 : -0.01; setImgScale(s => Number(Math.max(1, Math.min(s + delta, 5)).toFixed(2))); };
      el.addEventListener('wheel', handleNativeWheel, { passive: false });
      return () => el.removeEventListener('wheel', handleNativeWheel);
  }, [zoomedImage]);

  const handleMouseDown = (e: React.MouseEvent) => { if (imgScale > 1 && scrollContainerRef.current) { setIsDragging(true); setDragStart({ x: e.clientX, y: e.clientY }); setScrollStart({ x: scrollContainerRef.current.scrollLeft, y: scrollContainerRef.current.scrollTop }); } };
  const handleMouseMove = (e: React.MouseEvent) => { if (isDragging && scrollContainerRef.current) { const dx = e.clientX - dragStart.x; const dy = e.clientY - dragStart.y; scrollContainerRef.current.scrollLeft = scrollStart.x - dx; scrollContainerRef.current.scrollTop = scrollStart.y - dy; } };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => { if (e.touches.length === 2) { setPinchDist(Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)); } };
  const handleTouchMove = (e: React.TouchEvent) => { if (e.touches.length === 2) { const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); if (pinchDist > 0) setImgScale(s => Math.min(Math.max(1, s + (dist - pinchDist) / 150), 5)); setPinchDist(dist); } };
  const handleTouchEnd = () => { setPinchDist(0); };

  const openImageModal = (img: any) => { setZoomedImage(img); setImgScale(1); };
  
  const currentImgIndex = zoomedImage ? ALL_GUIDE_IMAGES.findIndex(img => img.id === zoomedImage.id) : -1;
  const handleNextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      const jumpAmount = isMobile ? 1 : 2;
      if(currentImgIndex >= 0 && currentImgIndex < ALL_GUIDE_IMAGES.length - jumpAmount) {
          setZoomedImage(ALL_GUIDE_IMAGES[currentImgIndex + jumpAmount]);
          setImgScale(1);
      } else if (currentImgIndex >= 0 && currentImgIndex < ALL_GUIDE_IMAGES.length - 1) {
          setZoomedImage(ALL_GUIDE_IMAGES[currentImgIndex + 1]);
          setImgScale(1);
      }
  };
  const handlePrevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      const jumpAmount = isMobile ? 1 : 2;
      if(currentImgIndex >= jumpAmount) {
          setZoomedImage(ALL_GUIDE_IMAGES[currentImgIndex - jumpAmount]);
          setImgScale(1);
      } else if (currentImgIndex > 0) {
          setZoomedImage(ALL_GUIDE_IMAGES[currentImgIndex - 1]);
          setImgScale(1);
      }
  };

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
              localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_board_mock', JSON.stringify(boardPosts)); localStorage.setItem('hitec_snapshots', JSON.stringify(snapshots));
          } catch (e: any) {
              if (e.name === 'QuotaExceededError' || e.message?.includes('Quota')) alert("⚠️ [경고] 기기의 저장 용량이 꽉 찼습니다!\n기존 데이터가 날아가는 것을 방지하기 위해 불필요한 데이터를 삭제해주세요.");
          }
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, boardPosts, snapshots, isLoaded]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); 
    const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    const candyTotal = candyToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(formatWeight(baseTotal)); setTotalPearlWeight(formatWeight(pearlTotal)); setTotalCandyWeight(formatWeight(candyTotal));
    setTotalFinalWeight(formatWeight((baseTotal * 1.2) + (isThreeCoatMode ? (pearlTotal * 1.3) : 0) + (isCandyCoatMode ? candyTotal : 0)));
    const checkMetallic = (list: any[]) => list.some(t => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== '' && type !== 'candy'; });
    setIsBaseMetallic(checkMetallic(toners)); setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
      if (focusTarget) {
          let attempts = 0; 
          const interval = setInterval(() => {
              const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
              if (el) { el.focus(); if (focusTarget.tempInput) focusTarget.tempInput.remove(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); clearInterval(interval); setFocusTarget(null); }
              attempts++; if (attempts > 20) { clearInterval(interval); if (focusTarget.tempInput) focusTarget.tempInput.remove(); setFocusTarget(null); }
          }, 50); 
          return () => clearInterval(interval);
      }
  }, [focusTarget, toners, pearlToners]);

  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율 상수를 입력하세요."); return; }
    const scale = (valStr: string) => { const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; const calcVal = isMultiply ? (val * 100000 * factor) / 100000 : (val * 100000) / (factor * 100000); return String(Number(Math.round(calcVal * 100000) / 100000)); };
    const applyScale = (list: any[]) => list.map(t => { if (!t.adjustedWeight) return t; const newVal = scale(t.adjustedWeight); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory; return { ...t, adjustedWeight: newVal, history: nextHistory }; });
    setToners(applyScale(toners)); setPearlToners(applyScale(pearlToners));
  };

  const getSimulatedColor = (drops: any) => {
      const rDrop = drops.red; const bDrop = drops.blue; const yDrop = drops.yellow; const gDrop = drops.green; const wDrop = drops.white; const kDrop = drops.black;
      const total = rDrop + bDrop + yDrop + gDrop + wDrop + kDrop;
      if (total === 0) return { name: '비어있음 (색상을 추가하세요)', hex: '#1e293b', r: 30, g: 41, b: 59 };

      let c = (bDrop * 1 + gDrop * 1) / total; let m = (rDrop * 1 + bDrop * 0.5) / total; let y = (yDrop * 1 + rDrop * 1 + gDrop * 1) / total; let k = (kDrop * 1) / total;
      const concentration = 1 - (wDrop / total); c *= concentration; m *= concentration; y *= concentration;
      const r = Math.round(255 * (1 - c) * (1 - k)); const g = Math.round(255 * (1 - m) * (1 - k)); const b = Math.round(255 * (1 - y) * (1 - k));
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      let name = '혼합색 (Mixed)';
      const colorTotal = rDrop + bDrop + yDrop + gDrop;
      
      if (colorTotal === 0) {
          if (wDrop > 0 && kDrop === 0) name = '순백색 (Pure White)';
          else if (kDrop > 0 && wDrop === 0) name = '순흑색 (Pure Black)';
          else if (wDrop > kDrop) name = '밝은 회색 (Light Gray)';
          else if (kDrop > wDrop) name = '어두운 회색 (Dark Gray)';
          else name = '중간 회색 (Medium Gray)';
      } else {
          if (rDrop > 0 && bDrop > 0 && yDrop > 0 && gDrop === 0) name = '탁한 회갈색 (Muddy Brown)';
          else if (rDrop > 0 && bDrop > 0 && yDrop === 0 && gDrop === 0) name = rDrop > bDrop ? '적보라 (Red-Purple)' : (bDrop > rDrop ? '청보라 (Blue-Purple)' : '보라 (Purple)');
          else if (rDrop > 0 && yDrop > 0 && bDrop === 0 && gDrop === 0) name = rDrop > yDrop ? '다홍 (Red-Orange)' : (yDrop > rDrop ? '귤색 (Yellow-Orange)' : '주황 (Orange)');
          else if (bDrop > 0 && yDrop > 0 && rDrop === 0 && gDrop === 0) name = bDrop > yDrop ? '청록 (Teal)' : (yDrop > bDrop ? '연두 (Yellow-Green)' : '초록 (Green)');
          else if (rDrop > 0 && gDrop > 0 && bDrop === 0 && yDrop === 0) name = rDrop > gDrop ? '적갈색 (Maroon)' : '올리브 갈색 (Olive Brown)';
          else {
              let maxVal = 0; let maxColor = '';
              if(rDrop > maxVal) { maxVal = rDrop; maxColor = 'red'; }
              if(bDrop > maxVal) { maxVal = bDrop; maxColor = 'blue'; }
              if(yDrop > maxVal) { maxVal = yDrop; maxColor = 'yellow'; }
              if(gDrop > maxVal) { maxVal = gDrop; maxColor = 'green'; }
              if (maxColor === 'red') name = '빨강 (Red)'; else if (maxColor === 'blue') name = '파랑 (Blue)'; else if (maxColor === 'yellow') name = '노랑 (Yellow)'; else if (maxColor === 'green') name = '초록 (Green)';
          }

          if (name.includes('보라')) {
              if (wDrop > 0 && kDrop === 0) name = '연한 파스텔 라벤더 (Pastel Lavender)';
              else if (kDrop > 0 && wDrop === 0) name = '다크 플럼 (Dark Plum)';
              else if (wDrop > 0 && kDrop > 0) name = '뮤트 퍼플 (Muted Purple)';
          } else {
              if (wDrop > 0 && kDrop === 0) name = `파스텔 ${name}`;
              else if (kDrop > 0 && wDrop === 0) name = `어두운(Dark) ${name}`;
              else if (wDrop > 0 && kDrop > 0) name = `탁한(Grayish) ${name}`;
          }
      }
      return { name, hex, r, g, b };
  };

  const handleClearAllInfo = () => { 
      if(!window.confirm("모든 입력 데이터를 초기화하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setRegistrationDate(new Date().toISOString().split('T')[0]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch(''); setOemSearch(''); setAttachedImages([]);
  };
  const handleResetFormula = () => { 
      if(!window.confirm("현재 배합과 수정 내역을 모두 리셋하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch(''); setOemSearch(''); setAttachedImages([]);
  };

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const rawVal = newCode.toUpperCase(); const numOnly = rawVal.replace(/[^0-9]/g, ''); let finalCode = rawVal;
    if (rawVal.startsWith('90') && numOnly.length >= 4) finalCode = numOnly.substring(0, 4); 
    else if (['1051', '1500', '455', 'AXT700'].includes(numOnly) || rawVal === 'AXT700') finalCode = rawVal === 'AXT700' ? 'AXT700' : numOnly; 
    else if (numOnly) finalCode = `WT ${numOnly}`; 
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => { if (toner.id === id) { if (TONER_DB[finalCode]) { setFocusTarget({ id: id, type: 'weight' }); } return { ...toner, code: finalCode }; } return toner; }));
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
          tempInput = document.createElement('input'); tempInput.type = 'number'; tempInput.style.position = 'fixed'; tempInput.style.top = '50%'; tempInput.style.left = '50%'; tempInput.style.opacity = '0'; tempInput.style.width = '1px'; tempInput.style.height = '1px'; document.body.appendChild(tempInput); tempInput.focus(); 
      }
      const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; 
      if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); 
      setFocusTarget({ id: newId, type: 'code', tempInput }); 
  };

  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if(t.id === id) { let newVal = Math.max(0, (parseFloat(t.adjustedWeight) || 0) + delta); let strVal = String(Number(Math.round(newVal * 100000) / 100000)); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory; return { ...t, adjustedWeight: strVal, history: nextHistory }; } return t; }));
  };
  const toggleExpand = (id: string, isPearl: boolean) => { const setter = isPearl ? setPearlToners : setToners; setter(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t)); };

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
      const text = generateShareText();
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(textArea);
      
      window.location.href = "kakaotalk://"; 
      setIsShareModalOpen(false); 
  };
  const handleShareSMS = () => { window.location.href = `sms:?body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const handleShareNaverMail = () => { window.open(`https://mail.naver.com/v2/new?body=${encodeURIComponent(generateShareText())}`, '_blank'); setIsShareModalOpen(false); };
  const handleShareGoogleMail = () => { window.open(`https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(generateShareText())}`, '_blank'); setIsShareModalOpen(false); };
  
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
                  const canvas = document.createElement('canvas'); let width = img.width; let height = img.height; const MAX_WIDTH = 600; const MAX_HEIGHT = 600;
                  if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
                  canvas.width = width; canvas.height = height; const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, width, height);
                  const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5); 
                  setAttachedImages(prev => [...prev, compressedBase64]);
                  alert("📷 시편 사진이 안전하게 최적화되어 추가되었습니다!");
              };
              img.src = event.target?.result as string;
          };
          reader.readAsDataURL(file);
      }
  };

  const removeAttachedImage = (index: number) => { setAttachedImages(prev => prev.filter((_, i) => i !== index)); };

  const handleDeletePostImage = (postId: number, imgIdx: number) => {
      if (window.confirm("이 사진을 삭제하시겠습니까?\n\n(삭제된 사진은 휴지통에서 3일간 보관된 후 영구 삭제됩니다.)")) {
          setBoardPosts(prev => prev.map(p => {
              if (p.id === postId) { const newImages = [...p.images]; const removed = newImages.splice(imgIdx, 1)[0]; const deletedImages = p.deletedImages ? [...p.deletedImages] : []; deletedImages.push({ url: removed, deletedAt: Date.now() }); return { ...p, images: newImages, deletedImages }; } return p;
          }));
          if (viewingPost && viewingPost.id === postId) { const newImages = [...viewingPost.images]; const removed = newImages.splice(imgIdx, 1)[0]; const deletedImages = viewingPost.deletedImages ? [...viewingPost.deletedImages] : []; deletedImages.push({ url: removed, deletedAt: Date.now() }); setViewingPost({ ...viewingPost, images: newImages, deletedImages }); }
      }
  };

  const handleRestorePostImage = (postId: number, delIdx: number) => {
      setBoardPosts(prev => prev.map(p => {
          if (p.id === postId && p.deletedImages) { const newDeleted = [...p.deletedImages]; const restored = newDeleted.splice(delIdx, 1)[0]; return { ...p, images: [...p.images, restored.url], deletedImages: newDeleted }; } return p;
      }));
      if (viewingPost && viewingPost.id === postId) { const newDeleted = [...viewingPost.deletedImages]; const restored = newDeleted.splice(delIdx, 1)[0]; setViewingPost({ ...viewingPost, images: [...viewingPost.images, restored.url], deletedImages: newDeleted }); }
  };

  const handlePermanentDeletePostImage = (postId: number, delIdx: number) => {
      if (!window.confirm("이 사진을 영구적으로 삭제하시겠습니까?\n(이 작업은 취소할 수 없습니다.)")) return;
      setBoardPosts(prev => prev.map(p => { if (p.id === postId && p.deletedImages) { const newDeleted = [...p.deletedImages]; newDeleted.splice(delIdx, 1); return { ...p, deletedImages: newDeleted }; } return p; }));
      if (viewingPost && viewingPost.id === postId) { const newDeleted = [...viewingPost.deletedImages]; newDeleted.splice(delIdx, 1); setViewingPost({ ...viewingPost, deletedImages: newDeleted }); }
  };

  const saveToBoard = () => {
      if(!targetColorCode) { alert("⚠️ 컬러코드를 입력해야 합니다!"); return; }
      const now = new Date(); const timeFormatted = `${registrationDate} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const newPost: BoardPost = { id: Date.now() + Math.random(), brand: carModel || '미지정', code: targetColorCode, date: timeFormatted, likes: 0, views: 0, author: '내 데이터', spec: specialNotes || '특이사항 없음', baseFormula: [...toners], pearlFormula: [...pearlToners], isThreeCoat: isThreeCoatMode, images: [...attachedImages], deletedImages: [] };
      setBoardPosts([newPost, ...boardPosts]); setAttachedImages([]); alert("🎉 시편 사진들과 함께 게시판에 등록되었습니다!");
  };

  const deleteBoardPost = (id: number, e: React.MouseEvent) => { e.stopPropagation(); if (window.confirm("이 시편 데이터를 완전히 삭제하시겠습니까?")) setBoardPosts(prev => prev.filter(post => post.id !== id)); };
  const handleSaveSnapshot = () => { const newSnapshot = { id: Date.now(), timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }), dateStr: new Date().toLocaleDateString('ko-KR'), base: JSON.parse(JSON.stringify(toners)), pearl: JSON.parse(JSON.stringify(pearlToners)), isThreeCoat: isThreeCoatMode, totalFinal: totalFinalWeight }; setSnapshots(prev => [newSnapshot, ...prev]); alert(`[${newSnapshot.timestamp}] 데이터가 확정 저장되었습니다.`); };
  const restoreSnapshot = (snapshot: any) => { if (window.confirm("복원하시겠습니까?")) { setToners(JSON.parse(JSON.stringify(snapshot.base))); setPearlToners(JSON.parse(JSON.stringify(snapshot.pearl))); setIsThreeCoatMode(snapshot.isThreeCoat); setSelectedSnapshot(null); setIsSnapshotModalOpen(false); } };
  const handleSavePostEdit = () => { setBoardPosts(prev => prev.map(p => p.id === viewingPost.id ? { ...p, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec } : p)); setViewingPost({ ...viewingPost, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec }); setIsEditingPost(false); };
  const handleOpenPost = (post: any) => { setViewingPost(post); setEditPostForm({ brand: post.brand, code: post.code, spec: post.spec }); setIsEditingPost(false); };

  const handleGoogleGlossarySearch = () => { const inputEl = document.getElementById('glossarySearchInput') as HTMLInputElement; const val = inputEl?.value?.trim(); if(!val) { alert("사전 검색창에 뜻이 궁금한 용어를 직접 입력하세요!"); return; } window.open(`https://www.google.com/search?q=스피스헥커+${val}+뜻`, '_blank'); };

  const showBottomBar = !(isMobile && isKeyboardOpen);
  if (!isAuthorized) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 notranslate" translate="no">
            <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
                {!showApprovalSuccess ? (
                    <>
                        <div className="p-4 flex flex-col items-center justify-center mt-6 relative">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                                <Lock size={32} className="text-white"/>
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 mb-2">조색 Pro 접근 승인</h2>
                            <p className="text-sm text-slate-500 text-center break-keep px-4">이 시스템은 승인된 작업자만 사용할 수 있습니다. 관리자 확인을 위해 정확한 정보를 입력해주세요.</p>
                        </div>
                        <form onSubmit={handleFakeApproval} className="p-6 bg-white flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><Briefcase size={12}/> 소속 그룹 (상호명)</label>
                                    <input type="text" value={authForm.company} onChange={e => setAuthForm({...authForm, company: e.target.value})} placeholder="예: 도이치 모터스 BMW" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><MapPin size={12}/> 지점 위치</label>
                                    <input type="text" value={authForm.location} onChange={e => setAuthForm({...authForm, location: e.target.value})} placeholder="예: 성수동" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><UserCheck size={12}/> 작업자 이름</label>
                                    <input type="text" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} placeholder="홍길동" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><Hash size={12}/> 연령(나이)</label>
                                    <input type="number" value={authForm.age} onChange={e => setAuthForm({...authForm, age: e.target.value})} placeholder="50" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600 mb-1 block">현 직책</label>
                                <select value={authForm.role} onChange={e => setAuthForm({...authForm, role: e.target.value})} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                                    <option>사원</option><option>주임 / 대리</option><option>과장 / 차장</option><option>팀장 / 실장</option><option>대표 / 관리자</option>
                                </select>
                            </div>
                            
                            {isApproving && (
                                <div className="flex flex-col items-center justify-center py-4 mt-2 animate-in fade-in bg-blue-50/50 border border-blue-100 rounded-xl shadow-inner">
                                    <Loader2 size={28} className="text-blue-600 animate-spin mb-3" />
                                    <span className="text-xs font-black text-blue-800 text-center break-keep px-4 leading-relaxed">{approvalMessage}</span>
                                </div>
                            )}

                            <button type="submit" disabled={!isAuthFormValid || isApproving} className={`w-full font-black py-4 rounded-xl mt-2 transition-colors shadow-md flex justify-center items-center gap-2 text-sm ${!isAuthFormValid ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-[#1e293b] hover:bg-slate-800 text-white'}`}>
                                {isApproving ? "시스템 검증 중..." : <><ShieldCheck size={18}/> 관리자에게 승인 요청하기</>}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="p-10 bg-white flex flex-col items-center justify-center gap-4 text-center animate-in zoom-in duration-300 min-h-[450px]">
                        <CheckCircle size={64} className="text-emerald-500 mb-4 drop-shadow-md" />
                        <h3 className="text-xl font-black text-slate-800 break-keep leading-relaxed">
                            마스터키 윤성만 님에 의해<br/>정상적으로 승인되었습니다.
                        </h3>
                        <p className="text-base font-bold text-slate-500 mb-8">즐거운 하루 되세요.</p>
                        <button onClick={handleApprovalConfirm} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-colors shadow-md text-base">
                            확인 (메인 화면으로 이동)
                        </button>
                    </div>
                )}
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
            <button onClick={() => { setIsUsersModalOpen(true); setSelectedUserInfo(null); }} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Users size={14} /> 승인된 작업자 <span className="bg-indigo-900 px-1.5 py-0.5 rounded text-[10px]">{authorizedUsers.length}명</span>
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>

            <button onClick={() => { setIsCloudModalOpen(true); setCopied(false); }} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                ☁️ 기기 간 초고속 연동
            </button>
            <button onClick={() => setIsGlossaryModalOpen(true)} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                📖 도장/조색 용어 사전
            </button>
            <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <RefreshCw size={14} /> 업데이트
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
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚙 브랜드 등록</label><input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value.toUpperCase())} placeholder="예: 현대, BMW..." className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🎨 컬러코드</label><input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value.toUpperCase())} placeholder="예: UX" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full uppercase focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm notranslate" translate="no" /></div>
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
                        <span className="font-bold text-blue-800 text-[13px] leading-tight flex-1 pl-1 text-left break-keep flex items-center">
                            {toner.code ? (info.role || '등록된 안료 정보 없음') : '안료 번호를 입력하세요 (예: 321, 385...)'}
                            {toner.code && info.type && <span className="ml-2 bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-600 shadow-sm whitespace-nowrap">{info.type}</span>}
                            {!toner.isExpanded && <span className="ml-2 text-[10px] text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full flex items-center shadow-sm">상세보기 <ChevronDown size={12} className="ml-0.5"/></span>}
                            {toner.isExpanded && <span className="ml-2 text-[10px] text-blue-500 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-full flex items-center shadow-sm">접기 <ChevronUp size={12} className="ml-0.5"/></span>}
                        </span>
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
            
            <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <label className="flex-1 flex items-center justify-between cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-purple-50 transition-colors">
                    <span className="text-xs font-black text-purple-700">3Coat (펄 추가) 켜기</span>
                    <div className="relative">
                        <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                        <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${isThreeCoatMode ? 'transform translate-x-5' : ''}`}></div>
                    </div>
                </label>
                <label className="flex-1 flex items-center justify-between cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-rose-50 transition-colors">
                    <span className="text-xs font-black text-rose-700">Candy (캔디 추가) 켜기</span>
                    <div className="relative">
                        <input type="checkbox" className="sr-only" checked={isCandyCoatMode} onChange={() => setIsCandyCoatMode(!isCandyCoatMode)} />
                        <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${isCandyCoatMode ? 'bg-rose-600' : 'bg-slate-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${isCandyCoatMode ? 'transform translate-x-5' : ''}`}></div>
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
                          <span className="font-bold text-purple-800 text-[13px] leading-tight flex-1 pl-1 text-left break-keep flex items-center">
                              {toner.code ? (info.role || '등록된 펄 정보 없음') : '펄 번호를 입력하세요 (예: PP201...)'}
                              {toner.code && info.type && <span className="ml-2 bg-purple-900 text-purple-200 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-700 shadow-sm whitespace-nowrap">{info.type}</span>}
                              {!toner.isExpanded && <span className="ml-2 text-[10px] text-purple-500 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-full flex items-center shadow-sm">상세보기 <ChevronDown size={12} className="ml-0.5"/></span>}
                              {toner.isExpanded && <span className="ml-2 text-[10px] text-purple-500 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-full flex items-center shadow-sm">접기 <ChevronUp size={12} className="ml-0.5"/></span>}
                          </span>
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
            
            {isCandyCoatMode && (
              <div className="pt-4 mt-4 border-t border-rose-200 space-y-3 pb-8">
                 <div className="text-xs font-black text-rose-700 flex justify-between border-b pb-1"><span>▼ 캔디 코트 (Candy Coat)</span></div>

                 <div className="bg-white rounded-xl overflow-hidden border border-rose-200 shadow-sm flex flex-col">
                     <div className="bg-gradient-to-r from-[#5a1827] to-[#8b253f] p-3 text-white">
                         <div className="flex items-center gap-2">
                             <input type="text" value={candyCode} onChange={e => setCandyCode(e.target.value.toUpperCase())} className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 w-20 text-center font-black focus:outline-none placeholder-rose-300" placeholder="코드" />
                             <span className="font-bold text-sm tracking-wide">{candyCode === '9048' ? '마룬 / 흑갈색 투명 첨가제' : '특수 캔디 첨가제'}</span>
                         </div>
                     </div>
                     <div className="p-4 flex flex-col gap-3">
                         <p className="text-sm font-bold text-slate-700 break-keep">
                             {candyCode === '9048' ? '엑솔타(Axalta) 스피스헥커 프리미엄 첨가제. 은폐력 제로의 투명하고 깊은 마룬(Maroon) 빛 심도를 냅니다.' : '고투명 프리미엄 캔디 첨가제.'}
                         </p>
                         <div className="flex items-start gap-2">
                             <span className="shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-[10px] font-black mt-0.5">🎯 캔디 도장 공정</span>
                             <span className="text-xs font-medium text-slate-600 leading-relaxed">
                                 {candyCode === '9048' ? '마쯔다(Mazda) 소울 레드 크리스탈(46V) 등 고휘도 실버 하도를 건조한 뒤, 2액형 클리어와 정밀 혼합하여 겹침(Overlap) 없이 코팅해야 얼룩을 막을 수 있습니다.' : '고휘도 실버 위에 2액형 클리어와 정밀 혼합하여 일정한 두께로 코팅하세요.'}
                             </span>
                         </div>
                     </div>
                 </div>

                 <div className="bg-rose-50 p-4 rounded-xl border border-rose-200 shadow-sm flex flex-col gap-3">
                     <h4 className="text-sm font-black text-rose-800 flex items-center gap-2"><Beaker size={16}/> 현장 2:1 캔디 배합기</h4>
                     <div className="flex flex-col sm:flex-row gap-3">
                         <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-inner flex flex-col">
                             <span className="text-[10px] font-bold text-slate-500 mb-1">7500 클리어 (비율 2)</span>
                             <div className="flex items-end gap-1 border-b border-slate-100 pb-1">
                                 <input type="text" inputMode="decimal" value={candyClear} onChange={e => {
                                     let val = e.target.value.replace(/[^0-9.]/g, '');
                                     setCandyClear(val);
                                     if(val) setCandyHardener((parseFloat(val)/2).toFixed(1));
                                     else setCandyHardener("");
                                 }} className="w-full text-4xl font-black text-slate-800 bg-transparent focus:outline-none" />
                                 <span className="font-bold text-slate-400 text-xl mb-1">g</span>
                             </div>
                         </div>
                         <div className="flex items-center justify-center shrink-0"><span className="text-xl font-black text-slate-400">+</span></div>
                         <div className="flex-1 bg-white p-3 rounded-lg border border-slate-200 shadow-inner flex flex-col">
                             <span className="text-[10px] font-bold text-slate-500 mb-1">7205 경화제 (비율 1)</span>
                             <div className="flex items-end gap-1 border-b border-slate-100 pb-1">
                                 <input type="text" inputMode="decimal" value={candyHardener} onChange={e => setCandyHardener(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full text-4xl font-black text-slate-800 bg-transparent focus:outline-none" />
                                 <span className="font-bold text-slate-400 text-xl mb-1">g</span>
                             </div>
                         </div>
                         <div className="flex items-center justify-center shrink-0"><span className="text-xl font-black text-slate-400">+</span></div>
                         <div className="flex-1 bg-rose-100 p-3 rounded-lg border border-rose-300 shadow-inner flex flex-col">
                             <span className="text-[10px] font-black text-rose-700 mb-1">캔디 첨가제 (기준량)</span>
                             <div className="flex items-end gap-1 border-b border-rose-300 pb-1">
                                 <input type="text" inputMode="decimal" value={candyAdditive} onChange={e => setCandyAdditive(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full text-4xl font-black text-rose-700 bg-transparent focus:outline-none" />
                                 <span className="font-bold text-rose-500 text-xl mb-1">g</span>
                             </div>
                         </div>
                     </div>
                 </div>
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
                
                <div className="p-3 bg-slate-800 border-b border-slate-700 flex flex-col sm:flex-row shrink-0 gap-2">
                    <div className="relative flex-1">
                        <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value.toUpperCase())} placeholder="조색제(WT/PP) 번호 검색" className="w-full bg-slate-900 border border-slate-600 text-white text-xs px-2.5 py-2 rounded-lg pl-8 focus:outline-none focus:border-blue-500 transition-colors" />
                        <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                    </div>
                    <div className="relative flex-1">
                        <input type="text" value={oemSearch} onChange={e=>setOemSearch(e.target.value.toUpperCase())} placeholder="OEM 차량 컬러 (LUCID 등) 검색" className="w-full bg-slate-900 border border-slate-600 text-white text-xs px-2.5 py-2 rounded-lg pl-8 focus:outline-none focus:border-emerald-500 transition-colors" />
                        <Search size={14} className="absolute left-2.5 top-2.5 text-emerald-400/70" />
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
                    
                    {oemSearch.replace(/\s/g, '') !== '' && filteredOemColors.length > 0 && (
                        <div className="mb-2 p-3 bg-blue-50 rounded-xl border border-blue-200 shadow-sm animate-in fade-in">
                            <h4 className="text-xs font-black text-blue-800 mb-2">🔍 자동차 제조사(OEM) 색상 검색 결과</h4>
                            <div className="flex flex-col gap-2">
                                {filteredOemColors.slice(0, 20).map((oem, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white px-3 py-2.5 rounded shadow-sm border border-slate-200 cursor-pointer hover:border-blue-500 transition-colors group" 
                                        onClick={() => {
                                            setTargetColorCode(String(oem.code));
                                            window.open("https://phoenix.spieshecker.com", "_blank");
                                        }}
                                    >
                                        <span className="font-black text-blue-600 text-sm whitespace-nowrap mr-3 mb-1 sm:mb-0 shrink-0 group-hover:text-blue-800">{oem.code}</span>
                                        <span className="text-[11.5px] text-slate-700 font-bold whitespace-normal break-words text-left sm:text-right leading-tight flex-1 ml-0 sm:ml-2">{oem.name}</span>
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

      {showBottomBar && (
          <div className="fixed bottom-0 left-0 w-full z-[500] bg-slate-900/98 backdrop-blur-xl border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] text-slate-100 pb-[env(safe-area-inset-bottom)]">
              <div className="flex flex-col md:flex-row w-full gap-3 md:gap-4 max-w-4xl mx-auto p-3 md:p-4 h-full items-stretch justify-center">
                  <div className="flex-1 flex flex-col justify-center bg-slate-900 border border-slate-700 rounded-xl p-3 md:p-4 shadow-inner">
                     <span className="text-[10px] text-slate-400 font-black tracking-widest flex items-center uppercase mb-2"><Layers size={11} className="mr-1 text-blue-400"/> A. 베이스 코트 요약</span>
                     <div className="flex items-center justify-between text-xs md:text-sm">
                         <div className="flex flex-col items-start"><span className="text-[9px] text-slate-500 font-bold mb-0.5">순수 안료</span><span className="font-black text-white">{totalBaseWeight}g</span></div>
                         <span className="text-slate-600 font-black">+</span>
                         <div className="flex flex-col items-center"><span className="text-[9px] text-blue-400 font-bold mb-0.5">필수 수지(20%)</span><span className="font-black text-blue-400">{formatWeight(parseFloat(totalBaseWeight) * 0.2)}g</span></div>
                         <span className="text-slate-600 font-black">=</span>
                         <div className="flex flex-col items-end"><span className="text-[9px] text-emerald-500 font-bold mb-0.5">총 중량</span><span className="font-black text-emerald-400 text-sm md:text-base">{formatWeight(parseFloat(totalBaseWeight) * 1.2)}g</span></div>
                     </div>
                  </div>
                  {isThreeCoatMode && (
                  <div className="flex-1 flex flex-col justify-center bg-slate-900 border border-slate-700 rounded-xl p-3 md:p-4 shadow-inner">
                     <span className="text-[10px] text-slate-400 font-black tracking-widest flex items-center uppercase mb-2"><Zap size={11} className="mr-1 text-purple-400"/> B. 펄 코트 요약</span>
                     <div className="flex items-center justify-between text-xs md:text-sm">
                         <div className="flex flex-col items-start"><span className="text-[9px] text-slate-500 font-bold mb-0.5">순수 펄</span><span className="font-black text-white">{totalPearlWeight}g</span></div>
                         <span className="text-slate-600 font-black">+</span>
                         <div className="flex flex-col items-center"><span className="text-[9px] text-purple-400 font-bold mb-0.5">펄 수지(30%)</span><span className="font-black text-purple-400">{formatWeight(parseFloat(totalPearlWeight) * 0.3)}g</span></div>
                         <span className="text-slate-600 font-black">=</span>
                         <div className="flex flex-col items-end"><span className="text-[9px] text-emerald-500 font-bold mb-0.5">총 중량</span><span className="font-black text-emerald-400 text-sm md:text-base">{formatWeight(parseFloat(totalPearlWeight) * 1.3)}g</span></div>
                     </div>
                  </div>
                  )}
              </div>
          </div>
      )}

      {isUsersModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[3000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 max-h-[80vh]">
            <div className="p-4 bg-indigo-600 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><Users size={18} /> 접속 승인된 작업자 현황</h3>
              <button onClick={() => setIsUsersModalOpen(false)} className="hover:text-red-200 transition-colors bg-indigo-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 bg-slate-50 overflow-y-auto flex-1 custom-scrollbar">
                {!selectedUserInfo ? (
                    <>
                        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl mb-6">
                            <p className="text-xs text-indigo-800 font-bold mb-1">🔐 실시간 접속 보안 패널 (Admin Only)</p>
                            <p className="text-[11px] text-indigo-600 leading-relaxed break-keep">이 시스템은 승인된 사용자의 기기 목록을 보여줍니다. 실제 배포 시 Firebase DB와 연동되어 원격 차단 등 실시간 통계가 제공될 예정입니다.</p>
                        </div>

                        <div className="space-y-3">
                            {authorizedUsers.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm font-bold">승인된 사용자가 없습니다.</div>
                            ) : (
                                authorizedUsers.map((user, idx) => (
                                    <button key={idx} onClick={() => setSelectedUserInfo(user)} className="w-full bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex justify-between items-center hover:border-indigo-300 hover:shadow-md transition-all text-left group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                {user.device === 'Mobile' ? <Smartphone size={16} className={user.device === 'Mobile' ? 'text-indigo-500 group-hover:text-white' : ''}/> : <Monitor size={16} className={user.device !== 'Mobile' ? 'text-indigo-500 group-hover:text-white' : ''}/>}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-800 text-sm">[{user.branch}] {user.name}</span>
                                                <span className="text-[10px] text-slate-400 font-bold mt-0.5">{user.brand}</span>
                                            </div>
                                        </div>
                                        <span className="bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 text-[10px] font-black px-2 py-1 rounded transition-colors">상세 보기</span>
                                    </button>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4">
                        <button onClick={() => setSelectedUserInfo(null)} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 mb-2 w-max">
                            <ChevronDown className="rotate-90"/> 목록으로 돌아가기
                        </button>
                        <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 border-2 border-indigo-200 shadow-sm">
                               <Users size={32}/>
                            </div>
                            <h4 className="text-xl font-black text-slate-800 mb-1">[{selectedUserInfo.branch}] {selectedUserInfo.name}</h4>
                            <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full mb-6 shadow-sm">{selectedUserInfo.role}</span>
                            
                            <div className="w-full flex flex-col gap-3 text-left">
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500">소속 브랜드</span>
                                    <span className="text-sm font-black text-slate-800">{selectedUserInfo.brand}</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500">연령 (나이)</span>
                                    <span className="text-sm font-black text-slate-800">{selectedUserInfo.age}세</span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500">접속 기기</span>
                                    <span className="text-sm font-black text-slate-800 flex items-center gap-1">
                                       {selectedUserInfo.device === 'Mobile' ? <Smartphone size={14}/> : <Monitor size={14}/>} {selectedUserInfo.device}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500">최초 등록일시</span>
                                    <span className="text-xs font-black text-slate-800">{selectedUserInfo.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}

      {isCloudModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[3000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[450px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 h-auto max-h-[85vh]">
            <div className="p-4 bg-blue-600 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><Cloud size={18} /> 기기 간 초고속 다이렉트 연동 (오류 0%)</h3>
              <button onClick={() => setIsCloudModalOpen(false)} className="hover:text-red-200 transition-colors bg-blue-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            
            <div className="p-6 flex flex-col gap-6 bg-slate-50 overflow-y-auto flex-1 custom-scrollbar pb-12 sm:pb-6">
              <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm flex flex-col items-center text-center shrink-0">
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-black px-3 py-1 rounded-full mb-3 flex items-center gap-1.5"><Monitor size={14}/> PC ➔ 모바일 연결</span>
                  <h4 className="text-base font-black text-slate-800 mb-1 flex items-center gap-1.5"><QrCode size={18} className="text-blue-600"/> 스마트폰 카메라로 QR 스캔</h4>
                  <p className="text-xs text-slate-500 mb-4">현재 PC 화면의 배합을 모바일로 즉시 넘기려면<br/>스마트폰 기본 카메라로 아래 QR 코드를 비추세요.</p>
                  <div className="bg-white p-3 border-2 border-dashed border-blue-300 rounded-2xl">
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(generateSyncUrl())}`} alt="배합 동기화 QR코드" className="w-[140px] h-[140px]" />
                  </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-yellow-200 shadow-sm flex flex-col items-center text-center relative overflow-hidden shrink-0">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#FEE500]"></div>
                  <span className="bg-yellow-100 text-yellow-800 text-[11px] font-black px-3 py-1 rounded-full mb-3 flex items-center gap-1.5 mt-2"><Smartphone size={14}/> 모바일 ➔ PC 연결</span>
                  <h4 className="text-base font-black text-slate-800 mb-1 flex items-center gap-1.5"><MessageSquare size={18} className="text-yellow-500"/> PC 카카오톡으로 전송하기</h4>
                  <p className="text-xs text-slate-500 mb-4 break-keep">모바일에서 작업한 내역을 PC로 보낼 때는<br/><b>카카오톡 PC버전</b>으로 보내는 것이 가장 빠르고 확실합니다.</p>
                  
                  <div className="flex flex-col gap-2.5 w-full">
                      <button 
                          onClick={handleSendToPcKakao} 
                          className="w-full bg-[#FEE500] hover:bg-[#E5C100] text-slate-900 py-3.5 rounded-xl font-black text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                      >
                          <MessageSquare size={18} /> 카카오톡 (나에게 쓰기) 로 보내기
                      </button>
                      <button 
                          onClick={handleCopyLinkForPc} 
                          className={`w-full py-3.5 rounded-xl font-black text-sm shadow-sm transition-colors flex items-center justify-center gap-2 ${copied ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                      >
                          {copied ? <><Check size={18}/> 링크가 복사되었습니다!</> : <><Link size={18}/> 다이렉트 링크 주소 복사하기</>}
                      </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewModalImage && (
        <div className="fixed inset-0 bg-black/95 z-[5000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in" onClick={() => setPreviewModalImage(null)}>
            <button className="absolute top-6 right-6 text-slate-800 bg-white hover:bg-red-500 hover:text-white rounded-full p-2 transition-colors z-[5010] shadow-lg"><X size={24}/></button>
            <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700 shadow-2xl bg-slate-900 p-2" onClick={e => e.stopPropagation()}>
                <img src={previewModalImage} alt="시편 확대 사진" className="w-full h-full object-contain max-h-[80vh]" />
            </div>
        </div>
      )}

      {zoomedImage && (
        <div className="fixed inset-0 bg-black/95 z-[4000] flex flex-col items-center justify-center p-4 backdrop-blur-md animate-in fade-in" onClick={() => setZoomedImage(null)}>
            <button className="absolute top-6 right-6 text-slate-800 bg-white hover:bg-red-500 hover:text-white rounded-full p-2 transition-colors z-[4010] shadow-lg"><X size={24}/></button>
            
            {currentImgIndex > 0 && (
                <button onClick={handlePrevImage} className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white bg-slate-900/60 hover:bg-blue-600 p-3 sm:p-4 rounded-full transition-colors z-[4020] shadow-lg border border-slate-600/50">
                    <ChevronLeft size={32}/>
                </button>
            )}
            {currentImgIndex >= 0 && currentImgIndex < ALL_GUIDE_IMAGES.length - 1 && (
                <button onClick={handleNextImage} className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white bg-slate-900/60 hover:bg-blue-600 p-3 sm:p-4 rounded-full transition-colors z-[4020] shadow-lg border border-slate-600/50">
                    <ChevronRight size={32}/>
                </button>
            )}

            <div className="w-full h-full max-w-[1400px] flex flex-col items-center relative py-8 px-12 sm:px-24" onClick={e => e.stopPropagation()}>
                
                {zoomedImage.id === 1 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-blue-100 mt-8">
                        <div className="border-b-4 border-blue-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Sun className="text-blue-600" size={32}/> 색의 인식과 3원색
                            </h2>
                            <div className="text-blue-600 font-black italic text-xl tracking-tighter shrink-0 ml-4 hidden sm:block">Permahyd<sup className="text-sm">®</sup> HI-TEC</div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            <div className="flex-1 bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center text-center">
                                <h3 className="text-white font-black text-lg mb-4 bg-slate-800 px-4 py-1.5 rounded-full border border-slate-600">빛의 혼합 (가산혼합 / RGB)</h3>
                                <div className="w-32 h-32 relative mb-4">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-red-500 mix-blend-screen opacity-90"></div>
                                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-green-500 mix-blend-screen opacity-90"></div>
                                    <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-blue-500 mix-blend-screen opacity-90"></div>
                                </div>
                                <p className="text-slate-300 text-sm font-bold break-keep">빛은 섞을수록 <span className="text-white font-black">점점 밝아지며 (명도 증가)</span>, 모든 빛을 합치면 순수한 백색(White) 광선이 됩니다.</p>
                            </div>
                            <div className="flex-1 bg-slate-50 p-6 rounded-xl shadow-inner border border-slate-300 flex flex-col items-center text-center">
                                <h3 className="text-slate-800 font-black text-lg mb-4 bg-white px-4 py-1.5 rounded-full border border-slate-300 shadow-sm">안료의 혼합 (감산혼합 / CMYK)</h3>
                                <div className="w-32 h-32 relative mb-4">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-cyan-400 mix-blend-multiply opacity-80"></div>
                                    <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-yellow-400 mix-blend-multiply opacity-80"></div>
                                    <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-fuchsia-500 mix-blend-multiply opacity-80"></div>
                                </div>
                                <p className="text-slate-600 text-sm font-bold break-keep">조색제(페인트)는 섞을수록 <span className="text-slate-900 font-black">점점 어두워지고 탁해지고 (명도/채도 감소)</span>, 모두 합치면 흑색(Black)에 가까워집니다.</p>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 2 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-emerald-100 mt-8">
                        <div className="border-b-4 border-emerald-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Beaker className="text-emerald-600" size={32}/> 단색 안료의 2대 특성
                            </h2>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl shadow-sm">
                                <h3 className="text-lg font-black text-emerald-800 mb-3 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> 유기 안료 (Organic Pigments)</h3>
                                <p className="text-sm text-slate-700 font-bold mb-3">석유화학 합성으로 만들어진 안료로, 입자가 매우 미세하고 색상이 화려합니다.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-black">
                                    <div className="bg-white p-2 rounded border border-emerald-100 text-emerald-700 shadow-sm">맑고 투명함</div>
                                    <div className="bg-white p-2 rounded border border-emerald-100 text-emerald-700 shadow-sm">채도가 매우 높음</div>
                                    <div className="bg-white p-2 rounded border border-emerald-100 text-red-500 shadow-sm">은폐력 부족 (투과)</div>
                                    <div className="bg-white p-2 rounded border border-emerald-100 text-emerald-700 shadow-sm">원색 (청/녹/적)</div>
                                </div>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl shadow-sm">
                                <h3 className="text-lg font-black text-amber-800 mb-3 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> 무기 안료 (Inorganic Pigments)</h3>
                                <p className="text-sm text-slate-700 font-bold mb-3">광물(흙, 돌, 철)에서 추출한 안료로, 입자가 굵고 무거우며 튼튼합니다.</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-black">
                                    <div className="bg-white p-2 rounded border border-amber-100 text-amber-700 shadow-sm">불투명하고 탁함</div>
                                    <div className="bg-white p-2 rounded border border-amber-100 text-red-500 shadow-sm">채도가 낮음</div>
                                    <div className="bg-white p-2 rounded border border-amber-100 text-amber-700 shadow-sm">은폐력 매우 우수</div>
                                    <div className="bg-white p-2 rounded border border-amber-100 text-amber-700 shadow-sm">산화철/황연/백/흑</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 3 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-purple-100 mt-8">
                        <div className="border-b-4 border-purple-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Layers className="text-purple-600" size={32}/> 빛과 안료 상호작용
                            </h2>
                        </div>
                        <p className="text-slate-600 font-bold mb-6">입자의 종류에 따라 빛이 도막에 닿았을 때 반사, 굴절, 투과되는 메커니즘이 완전히 달라집니다.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col">
                                <h4 className="font-black text-slate-800 mb-2 border-b border-slate-200 pb-2">1. 솔리드 (Solid)</h4>
                                <div className="h-24 bg-red-600 rounded-lg mb-3 shadow-inner flex items-center justify-center text-white font-black text-xl">흡수 & 난반사</div>
                                <p className="text-xs text-slate-600 font-bold break-keep">빛이 표면에 닿으면 특정 파장은 흡수되고 나머지는 모든 방향으로 불규칙하게 흩어집니다(난반사). 각도에 따른 색상 변화가 없습니다.</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col">
                                <h4 className="font-black text-slate-800 mb-2 border-b border-slate-200 pb-2">2. 알루미늄 (Metallic)</h4>
                                <div className="h-24 bg-gradient-to-br from-slate-300 via-slate-400 to-slate-600 rounded-lg mb-3 shadow-inner flex items-center justify-center text-white font-black text-xl">거울 반사 (정반사)</div>
                                <p className="text-xs text-slate-600 font-bold break-keep">거울처럼 빛을 한 방향으로 강하게 튕겨냅니다. 정면(15도)에서는 눈부시게 밝고, 측면(45도)에서는 급격히 어두워집니다(플롭 효과).</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col">
                                <h4 className="font-black text-slate-800 mb-2 border-b border-slate-200 pb-2">3. 펄/마이카 (Pearl)</h4>
                                <div className="h-24 bg-gradient-to-tr from-purple-200 via-pink-100 to-blue-200 rounded-lg mb-3 shadow-inner flex items-center justify-center text-purple-700 font-black text-xl">투과 & 다중 간섭</div>
                                <p className="text-xs text-slate-600 font-bold break-keep">반투명한 입자 층을 빛이 통과하며 굴절과 반사를 반복합니다. 보는 각도에 따라 빛이 간섭을 일으켜 진주처럼 영롱한 이색 현상을 만듭니다.</p>
                            </div>
                        </div>
                    </div>
                ) :
                  zoomedImage.id === 4 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-slate-200 mt-8">
                        <div className="border-b-4 border-slate-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <BookOpen className="text-slate-600" size={32}/> 조색제 포스터의 이해
                            </h2>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl shadow-sm">
                                <h3 className="font-black text-slate-800 mb-2">포스터 기호 읽는 법</h3>
                                <p className="text-sm text-slate-600 font-bold">스피스헥커 조색제 포스터의 각 기호는 안료의 투명도, 색상 방향, 특성을 나타냅니다.</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
                                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
                                        <div className="w-10 h-10 bg-black mb-3 rounded-full border-2 border-white shadow-md"></div>
                                        <span className="text-xs font-black text-slate-700">완전 불투명 (Opaque)</span>
                                    </div>
                                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
                                        <div className="w-10 h-10 bg-black/40 mb-3 rounded-full border-2 border-white shadow-md"></div>
                                        <span className="text-xs font-black text-slate-700">반투명 (Translucent)</span>
                                    </div>
                                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
                                        <div className="w-10 h-10 bg-transparent mb-3 rounded-full border-2 border-slate-300 shadow-md"></div>
                                        <span className="text-xs font-black text-slate-700">완전 투명 (Transparent)</span>
                                    </div>
                                    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
                                        <div className="w-10 h-10 bg-white mb-3 rounded-full border-2 border-blue-500 shadow-inner flex items-center justify-center">
                                            <span className="text-xl font-black text-blue-600">T</span>
                                        </div>
                                        <span className="text-xs font-black text-slate-700">착색 펄 (Tinted Pearl)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 5 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-orange-100 mt-8">
                        <div className="border-b-4 border-orange-500 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Target className="text-orange-500" size={32}/> 솔리드 포지셔닝 맵
                            </h2>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-700 relative h-80 flex items-center justify-center overflow-hidden">
                            <div className="absolute w-[320px] h-[320px] rounded-full border-2 border-slate-600/50"></div>
                            <div className="absolute w-[200px] h-[200px] rounded-full border border-slate-500/50"></div>
                            <div className="absolute w-full h-px bg-slate-600/50"></div>
                            <div className="absolute h-full w-px bg-slate-600/50"></div>
                            <span className="absolute top-6 font-black text-yellow-400 bg-slate-900 px-2">Yellow (황)</span>
                            <span className="absolute bottom-6 font-black text-blue-400 bg-slate-900 px-2">Blue (청)</span>
                            <span className="absolute left-6 font-black text-emerald-400 bg-slate-900 py-1">Green (녹)</span>
                            <span className="absolute right-6 font-black text-red-400 bg-slate-900 py-1">Red (적)</span>
                            <div className="z-10 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-white rounded-full mix-blend-screen shadow-[0_0_30px_rgba(255,255,255,0.5)] mb-4"></div>
                                <span className="bg-white/10 text-white px-4 py-2 rounded-lg font-black backdrop-blur-sm border border-white/20">단색 원색 좌표 매핑</span>
                                <p className="text-slate-400 text-xs mt-2 font-bold">각 안료의 명도와 채도 위치를 확인하는 스페이스입니다.</p>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 6 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-red-100 mt-8">
                        <div className="border-b-4 border-red-500 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Sun className="text-red-500" size={32}/> 황색 / 적색 계열도
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm">
                                <h3 className="text-lg font-black text-yellow-700 mb-4 border-b border-yellow-200 pb-2 flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-yellow-400 shadow-sm"></div> Yellow (황색) 방향성</h3>
                                <ul className="text-sm font-bold text-slate-700 space-y-3">
                                    <li className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-yellow-100"><span className="text-yellow-500 font-black text-base">WT 326</span><span>그리니쉬 옐로우 (차가운 황색)</span></li>
                                    <li className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-yellow-100"><span className="text-yellow-600 font-black text-base">WT 324</span><span>레디쉬 옐로우 (따뜻한 금빛)</span></li>
                                    <li className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-yellow-100"><span className="text-yellow-800 font-black text-base">WT 328</span><span>오커 (황토색, 탁색 섀도우)</span></li>
                                </ul>
                            </div>
                            <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm">
                                <h3 className="text-lg font-black text-red-700 mb-4 border-b border-red-200 pb-2 flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500 shadow-sm"></div> Red (적색) 방향성</h3>
                                <ul className="text-sm font-bold text-slate-700 space-y-3">
                                    <li className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-red-100"><span className="text-red-500 font-black text-base">WT 340</span><span>옐로우 마젠타 (따뜻한 주황빛)</span></li>
                                    <li className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-red-100"><span className="text-pink-600 font-black text-base">WT 338</span><span>블루이쉬 마젠타 (차가운 자주빛)</span></li>
                                    <li className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-red-100"><span className="text-red-800 font-black text-base">WT 330</span><span>마룬 (적갈색, 묵직한 섀도우)</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 7 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-indigo-100 mt-8">
                        <div className="border-b-4 border-indigo-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Layers className="text-indigo-600" size={32}/> 청색 / 녹색 / 흑색 계열도
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow-sm">
                                <h3 className="font-black text-blue-800 mb-2 text-lg">Blue (청색)</h3>
                                <p className="text-xs text-slate-600 font-bold mb-4">정면/측면 이색 현상 제어가 핵심입니다.</p>
                                <div className="space-y-3 text-xs font-black">
                                    <div className="bg-white p-3 rounded-lg border border-blue-100 flex justify-between shadow-sm"><span className="text-blue-500 text-sm">WT 341</span><span>애저 (맑은 청록)</span></div>
                                    <div className="bg-white p-3 rounded-lg border border-blue-100 flex justify-between shadow-sm"><span className="text-blue-700 text-sm">WT 343</span><span>정직한 블루</span></div>
                                    <div className="bg-white p-3 rounded-lg border border-blue-100 flex justify-between shadow-sm"><span className="text-indigo-600 text-sm">WT 318</span><span>측면 붉은 블루</span></div>
                                </div>
                            </div>
                            <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-sm">
                                <h3 className="font-black text-emerald-800 mb-2 text-lg">Green (녹색)</h3>
                                <p className="text-xs text-slate-600 font-bold mb-4">빛의 투과 및 캔디 효과에 주로 쓰입니다.</p>
                                <div className="space-y-3 text-xs font-black">
                                    <div className="bg-white p-3 rounded-lg border border-emerald-100 flex justify-between shadow-sm"><span className="text-emerald-500 text-sm">WT 347</span><span>투명 그린 (100% 투과)</span></div>
                                    <div className="bg-white p-3 rounded-lg border border-emerald-100 flex justify-between shadow-sm"><span className="text-emerald-700 text-sm">WT 349</span><span>반투명 그린 (저농)</span></div>
                                </div>
                            </div>
                            <div className="bg-slate-100 p-5 rounded-xl border border-slate-300 shadow-sm">
                                <h3 className="font-black text-slate-800 mb-2 text-lg">Black (흑색)</h3>
                                <p className="text-xs text-slate-600 font-bold mb-4">은분과 만났을 때 쿨톤/웜톤 결정.</p>
                                <div className="space-y-3 text-xs font-black">
                                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between shadow-sm"><span className="text-slate-900 text-sm">WT 188</span><span>슈퍼 딥 블랙 (쿨톤)</span></div>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex justify-between shadow-sm"><span className="text-slate-600 text-sm">WT 323</span><span>스페셜 블랙 (웜톤)</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) :
                  zoomedImage.id === 8 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-slate-200 mt-8">
                        <div className="border-b-4 border-slate-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Target className="text-slate-600" size={32}/> 이펙트 포지셔닝 맵
                            </h2>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-700 relative h-80 flex items-center justify-center overflow-hidden">
                            <div className="absolute w-full h-px bg-slate-600/50"></div>
                            <div className="absolute h-full w-px bg-slate-600/50"></div>
                            <span className="absolute top-6 font-black text-slate-300 bg-slate-900 px-2">입자 굵음 (Coarse)</span>
                            <span className="absolute bottom-6 font-black text-slate-300 bg-slate-900 px-2">입자 고움 (Fine)</span>
                            <span className="absolute left-6 font-black text-slate-300 bg-slate-900 py-1">정면 밝음 (Brilliant)</span>
                            <span className="absolute right-6 font-black text-slate-300 bg-slate-900 py-1">측면 밝음 (Flop)</span>
                            <div className="z-10 text-center flex flex-col items-center">
                                <div className="flex gap-2 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full border-2 border-white shadow-lg"></div>
                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-300 to-blue-300 rounded-full border-2 border-white shadow-lg"></div>
                                </div>
                                <span className="bg-white/10 text-white px-4 py-2 rounded-lg font-black backdrop-blur-sm border border-white/20">은분 / 펄 입자 좌표 매핑</span>
                                <p className="text-slate-400 text-xs mt-2 font-bold">크기와 광채 특성에 따른 이펙트 안료 스페이스</p>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 9 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-slate-300 mt-8">
                        <div className="border-b-4 border-slate-500 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Eye className="text-slate-500" size={32}/> 알루미늄 입자 형상 비교
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-300 shadow-sm flex flex-col items-center text-center">
                                <h3 className="font-black text-slate-800 mb-4 bg-white px-5 py-2 rounded-full shadow-sm border border-slate-200">콘플레이크 (Cornflake)</h3>
                                <div className="w-32 h-20 bg-slate-300 rounded-lg mb-5 flex items-center justify-center border-2 border-dashed border-slate-500 text-xs font-black text-slate-600 shadow-inner">불규칙한 가장자리</div>
                                <p className="text-sm font-bold text-slate-700 break-keep">가장자리가 깨진 형태입니다. 서로 겹쳐지기 쉬워 은폐력이 우수하지만, 빛이 부서지며 난반사가 생겨 정면 광채가 부드럽고 측면이 비교적 밝습니다.</p>
                            </div>
                            <div className="bg-slate-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center border border-slate-600">
                                <h3 className="font-black text-white mb-4 bg-slate-700 px-5 py-2 rounded-full shadow-sm border border-slate-500">실버달러 (Silver Dollar)</h3>
                                <div className="w-32 h-20 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full mb-5 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] border-2 border-slate-400 text-xs font-black text-slate-800">매끄러운 동전 모양</div>
                                <p className="text-sm font-bold text-slate-300 break-keep">동전처럼 둥글고 납작한 형태입니다. 빛을 한 방향으로 거울처럼 튕겨내어 정면(15도)이 매우 눈부시고 측면(Flop)이 깊게 어두워집니다.</p>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 10 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-pink-100 mt-8">
                        <div className="border-b-4 border-pink-500 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Zap className="text-pink-500" size={32}/> 천연 마이카 vs 시라릭 펄
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm flex flex-col items-center text-center">
                                <h3 className="font-black text-yellow-800 mb-3 bg-white px-4 py-1.5 rounded-full shadow-sm">천연 마이카 (Natural Mica)</h3>
                                <p className="text-sm font-bold text-slate-700 break-keep">자연 운모석을 쪼개어 만든 진주 펄입니다. 입자의 두께가 불규칙하여 부드럽고 은은한 진줏빛 광택을 냅니다.</p>
                            </div>
                            <div className="bg-pink-50 p-6 rounded-xl border border-pink-200 shadow-sm flex flex-col items-center text-center">
                                <h3 className="font-black text-pink-800 mb-3 bg-white px-4 py-1.5 rounded-full shadow-sm">시라릭 펄 (Xirallic Pearl)</h3>
                                <p className="text-sm font-bold text-slate-700 break-keep">인공 합성 알루미나를 베이스로 하여 두께가 완벽하게 일정합니다. 투명도가 극도로 높고, 다이아몬드처럼 날카로운 반짝임(Sparkle)을 뿜어냅니다.</p>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 11 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-purple-100 mt-8">
                        <div className="border-b-4 border-purple-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Layers className="text-purple-600" size={32}/> PP 분말 펄 (Powder Pearl) 특성
                            </h2>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 p-6 rounded-xl shadow-sm">
                            <p className="text-sm font-bold text-purple-900 mb-4">액상 수지가 전혀 포함되지 않은 100% 가루 형태의 극미세 펄 안료입니다.</p>
                            <ul className="space-y-3 text-sm font-black text-slate-700">
                                <li className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">PP 201 ~ 205 : 파스텔 톤의 간섭 펄 (카멜레온 효과)</li>
                                <li className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">PP 304 : 수지가 없는 순수 글라스 플레이크 (다이아몬드 광채)</li>
                                <li className="bg-white p-3 rounded-lg border border-purple-100 shadow-sm">PP 401 ~ 406 : 컬러스트림 (다중 색상 변환 고급 펄)</li>
                            </ul>
                            <div className="mt-5 p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 text-xs font-bold">
                                ⚠️ 주의: 가루 형태이므로 베이스에 직접 투하하면 덩어리집니다. 반드시 블렌딩 수지에 미리 개어서 액상화 한 후 투입해야 합니다.
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 13 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-emerald-100 mt-8">
                        <div className="border-b-4 border-emerald-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Layers className="text-emerald-600" size={32}/> 3코트 (3-Coat) 컬러 특성
                            </h2>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-sm">
                            <h3 className="font-black text-emerald-800 mb-4 text-lg">하도(Ground) ➔ 중도(Pearl) ➔ 상도(Clear)</h3>
                            <p className="text-sm font-bold text-slate-700 mb-4 break-keep">솔리드 베이스 위에 반투명한 펄 코트를 올려 입체감과 깊이감을 극대화하는 방식입니다. 펄 코트의 도장 횟수(두께)에 따라 최종 색상이 완전히 달라집니다.</p>
                            <div className="flex flex-col gap-2">
                                <div className="bg-white p-3 rounded-lg border border-emerald-100 text-sm font-black text-slate-800 shadow-sm">도장 횟수 증가 ➔ 펄 효과 강해짐 / 베이스 색상 은폐됨 / 명도 변화 발생</div>
                                <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm font-black text-red-700 shadow-sm">얼룩(Mottling) 주의: 중도 펄 코트가 젖은 상태로 두껍게 올라가면 은분/펄이 뭉쳐 구름 같은 얼룩이 발생합니다.</div>
                            </div>
                        </div>
                    </div>
                ) : zoomedImage.id === 14 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-cyan-100 mt-8">
                        <div className="border-b-4 border-cyan-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Beaker className="text-cyan-600" size={32}/> 틴티드 크리어 (Tinted Clear)
                            </h2>
                        </div>
                        <div className="bg-cyan-50 border border-cyan-200 p-6 rounded-xl shadow-sm">
                            <p className="text-sm font-bold text-slate-700 mb-4 break-keep">가장 위쪽에 뿌리는 투명한 클리어(투명 페인트)에 아주 적은 양의 '투명 안료(트랜스페어런트)'나 '캔디 안료'를 섞어 뿌리는 초고난도 시스템입니다.</p>
                            <ul className="space-y-3 text-sm font-black text-slate-800">
                                <li className="bg-white p-3 rounded-lg border border-cyan-100 shadow-sm">깊고 풍부한 색감: 돋보기나 셀로판지를 덧댄 것처럼 밑색을 화사하게 증폭시킵니다. (주로 마쓰다 소울레드 46V, 현대/기아 캔디 컬러 등에 적용)</li>
                                <li className="bg-white p-3 rounded-lg border border-cyan-100 shadow-sm text-red-600">수정 불가: 투명한 층 자체가 색을 띠고 있으므로, 먼지가 앉아 사포로 갈아내면 그 부분만 하얗게 색이 빠져버립니다. 블렌딩(보카시) 도장이 불가능에 가깝습니다.</li>
                            </ul>
                        </div>
                    </div>
                ) :
                zoomedImage.id === 12 ? (
                    <div className="w-full bg-white p-6 md:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-full custom-scrollbar text-left border-4 border-slate-100 mt-8">
                        <div className="border-b-4 border-red-600 pb-2 mb-6 flex justify-between items-end">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center flex-wrap gap-2">
                                WT386 <span className="text-lg text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded">(측면밝기조정제)</span>의 역할
                            </h2>
                            <div className="text-red-600 font-black italic text-xl sm:text-2xl tracking-tighter shrink-0 ml-4">Permahyd<sup className="text-sm">®</sup> HI-TEC</div>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-8 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1">
                                <p className="text-slate-700 font-bold text-base leading-relaxed mb-4">
                                    WT386(측면밝기조정제)는 마치 <span className="text-blue-600 font-black">투명한 구슬</span>과 같아서, 알루미늄 입자에 혼합하면 입자가 불규칙하게 배열되도록 만듭니다.
                                </p>
                                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg shadow-sm">
                                    <p className="text-[13px] sm:text-sm text-yellow-800 font-black leading-relaxed">
                                        💡 핵심: 측면밝기조정제를 사용하면 입자의 배열이 불규칙해져,<br/> 
                                        빛 반사 유사각도<span className="text-red-600 bg-red-100 px-1.5 py-0.5 mx-1 rounded">정면(15도)은 어두워지고</span> 
                                        나머지 각도<span className="text-blue-600 bg-blue-100 px-1.5 py-0.5 mx-1 rounded">측면(45도/110도)은 밝아집니다.</span>
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 flex flex-row md:flex-col gap-3">
                                <div className="bg-white border border-slate-300 rounded p-3 text-center shadow-inner flex-1">
                                    <span className="text-[11px] font-bold text-slate-500 mb-2 block">&lt;사용 안 함&gt;</span>
                                    <div className="h-6 bg-slate-300 w-full rounded flex items-center justify-around px-2">
                                        <div className="w-8 h-1.5 bg-slate-500 rounded-full"></div>
                                        <div className="w-8 h-1.5 bg-slate-500 rounded-full"></div>
                                        <div className="w-8 h-1.5
