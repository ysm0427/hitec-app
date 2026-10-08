// src/App.tsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sliders, Trash2, Plus, X, Maximize, Beaker, Sun, 
  Layers, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, 
  FileSpreadsheet, History, Mail, Code, Calendar, Eye, ThumbsUp, 
  CheckCircle, Edit3, Target, MessageSquare, Send, Save, RefreshCw, Camera, AlertTriangle
} from 'lucide-react';

import { TONER_DB, shortcuts, PEARL_LEVELS, OEM_COLORS, TonerData } from './tonerDB';

if (typeof window !== 'undefined' && !document.querySelector('#tailwind-script')) {
  const script = document.createElement('script');
  script.id = 'tailwind-script';
  script.src = 'https://cdn.tailwindcss.com';
  document.head.appendChild(script);
}

const LAST_PATCH_DATE = "2026.10.08 (갤러리 텍스트 UI 최적화 & 디자인 화사하게 패치)"; 

// ━━━━━━━━ [수정됨] 가짜 이미지 URL 삭제 및 페이지 표시 제거 ━━━━━━━━
const GUIDE_IMAGES: Record<string, any[]> = {
  theory: [
    { id: 1, title: '색의 인식과 3원색', desc: '빛의 혼합 / 안료 혼합 원리', url: '' },
    { id: 2, title: '단색안료 특성', desc: '유기안료와 무기안료의 차이점', url: '' },
    { id: 3, title: '빛과 안료 상호작용', desc: '솔리드 / 알루미늄 / 간섭펄 반사 원리', url: '' },
  ],
  spectrum: [
    { id: 4, title: '조색제 포스터의 이해', desc: '기호 읽는 법', url: '' },
    { id: 5, title: '솔리드 포지셔닝 맵', desc: '솔리드 컬러 별 위치도', url: '' },
    { id: 6, title: '황색/적색 계열도', desc: '명암 및 채도 방향성에 따른 비교', url: '' },
    { id: 7, title: '청색/녹색/흑색 계열도', desc: '각 계열별 측면/정면 이색 비교', url: '' },
  ],
  effect: [
    { id: 8, title: '이펙트 포지셔닝 맵', desc: '이펙트 컬러 조색제 별 위치도', url: '' },
    { id: 9, title: '알루미늄 입자 특성', desc: '콘플레이크 vs 실버달러 형상 비교', url: '' },
    { id: 10, title: '펄(Pearl) 입자 특성', desc: '천연 마이카 vs 시라릭 펄 현미경', url: '' },
    { id: 11, title: 'PP펄 (파우더) 특성', desc: 'PP201~PP901 입자 및 현미경 비교', url: '' },
  ],
  special: [
    { id: 12, title: 'WT386 특성', desc: '측면밝기조정제 명암 변화 원리', url: '' },
    { id: 13, title: '3코트 컬러 특성', desc: '3코트 도장 및 얼룩 발생 주의사항', url: '' },
    { id: 14, title: '틴티드 크리어 (Tinted Clear)', desc: '첨가제 종류 및 적용 컬러', url: '' },
  ]
};

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => { return { code, ...data }; });
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
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

export default function App() {
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
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00"); 
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00"); 
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
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

  const [boardSearch, setBoardSearch] = useState(''); 
  const [boardBrandFilter, setBoardBrandFilter] = useState('전체');
  
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<any>(null);

  const [activeGuideTab, setActiveGuideTab] = useState<'theory'|'spectrum'|'effect'|'special'>('spectrum');
  const [zoomedImage, setZoomedImage] = useState<any>(null);

  const [isPearlGuideOpen, setIsPearlGuideOpen] = useState(false);
  const [activePearlLevel, setActivePearlLevel] = useState(6);
  
  const [boardPosts, setBoardPosts] = useState([
      { id: 1, brand: '현대', code: 'UG4', date: '2026-09-11', likes: 12, views: 45, author: '윤프로', spec: '이색 심함, 보카시 블렌딩 필수', baseFormula: [{code: 'WT 321', adjustedWeight: '15.5'}], pearlFormula: [], isThreeCoat: false }
  ]);

  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null); 
  const [catalogSearch, setCatalogSearch] = useState('');
  
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [selectedWheelIndex, setSelectedWheelIndex] = useState<number | null>(null);
  const handleWheelClick = (index: number) => { setSelectedWheelIndex(index); };

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  
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
      return item.code.includes(searchTxt) || item.role.toUpperCase().includes(searchTxt);
  });

  useEffect(() => { document.title = "조색 Pro"; }, []);

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
          localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_board_mock', JSON.stringify(boardPosts)); localStorage.setItem('hitec_snapshots', JSON.stringify(snapshots));
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, boardPosts, snapshots, isLoaded]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2)); setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    const checkMetallic = (list: any[]) => list.some(t => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== '' && type !== 'candy'; });
    setIsBaseMetallic(checkMetallic(toners)); setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (focusTarget) {
      let attempts = 0; 
      const interval = setInterval(() => {
        const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
        if (el) { el.focus(); setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30); clearInterval(interval); setFocusTarget(null); }
        attempts++; if (attempts > 30) { clearInterval(interval); setFocusTarget(null); }
      }, 20); 
      return () => clearInterval(interval);
    }
  }, [focusTarget, toners, pearlToners]);

  const handleClearAllInfo = () => { 
      if(!window.confirm("모든 입력 데이터를 초기화하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setRegistrationDate(new Date().toISOString().split('T')[0]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch('');
  };
  const handleResetFormula = () => { 
      if(!window.confirm("현재 배합과 수정 내역을 모두 리셋하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); setSelectedTonerForView(null); 
      setSnapshots([]); setCatalogSearch('');
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
  const addToner = (isPearl = false) => { const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); };
  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => { if(t.id === id) { let newVal = Math.max(0, (parseFloat(t.adjustedWeight) || 0) + delta); let strVal = String(Number(Math.round(newVal * 100000) / 100000)); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory; return { ...t, adjustedWeight: strVal, history: nextHistory }; } return t; }));
  };
  const toggleExpand = (id: string, isPearl: boolean) => { const setter = isPearl ? setPearlToners : setToners; setter(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t)); };
  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율 상수를 입력하세요."); return; }
    const scale = (valStr: string) => { const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; const calcVal = isMultiply ? (val * 100000 * factor) / 100000 : (val * 100000) / (factor * 100000); return String(Number(Math.round(calcVal * 100000) / 100000)); };
    const applyScale = (list: any[]) => list.map(t => { if (!t.adjustedWeight) return t; const newVal = scale(t.adjustedWeight); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory; return { ...t, adjustedWeight: newVal, history: nextHistory }; });
    setToners(applyScale(toners)); setPearlToners(applyScale(pearlToners));
  };

  const generateShareText = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '미지정'}): ${t.adjustedWeight || '0'}g`).join('\n'); let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '미지정'}): ${t.adjustedWeight || '0'}g`).join('\n'); let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin;
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); const shareUrl = `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`;
    return `[조색 배합 지시서]\n================================\n📅 등록날짜: ${registrationDate}\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 브랜드: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 6052 수지: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 합계: ${totalPearlWeight}g\n▶ 6052 수지: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 총량: ${totalFinalWeight}g\n\n👉 링크:\n${shareUrl}`;
  };

  const handleShareKakao = () => { if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(generateShareText()); alert("복사되었습니다. 카톡에 붙여넣으세요."); } else { alert("클립보드 미지원."); } setIsShareModalOpen(false); };
  const handleShareSMS = () => { window.location.href = `sms:?body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const handleShareMail = () => { window.location.href = `mailto:?subject=${encodeURIComponent('[조색 Pro] 배합 지시서 공유')}&body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const generateShareUrl = () => { let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin; const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); return `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`; }

  const handleDirectExcelCopy = () => {
      const shareUrl = generateShareUrl(); const plainText = `${registrationDate || '-'}	${vehicleNumber || '미입력'}	${carModel || '미입력'}	${targetColorCode || '미지정'}	${jobDescription || '미입력'}	${specialNotes || '-'}	${shareUrl}`;
      const htmlText = `<meta charset="utf-8"><table><tr><td>${registrationDate || '-'}</td><td>${vehicleNumber || '미입력'}</td><td>${carModel || '미입력'}</td><td>${targetColorCode || '미지정'}</td><td>${jobDescription || '미입력'}</td><td>${specialNotes || '-'}</td><td><a href="${shareUrl}">[배합보기]</a></td></tr></table>`;
      if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
          const htmlBlob = new Blob([htmlText], { type: 'text/html' }); const textBlob = new Blob([plainText], { type: 'text/plain' });
          const ClipboardItemConstructor = (window as any).ClipboardItem; const item = new ClipboardItemConstructor({ 'text/html': htmlBlob, 'text/plain': textBlob });
          navigator.clipboard.write([item]).then(() => { alert("✅ 엑셀 데이터가 복사되었습니다!"); }).catch(() => { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(plainText).then(() => { alert("✅ 일반 텍스트로 복사되었습니다."); }); }
      setIsExcelModalOpen(false);
  };
  const handleCopyExcelTemplate = () => { const headerRow = ['등록 날짜', '차량 번호', '브랜드/차종', '컬러코드', '작업내용', '특이사항', '배합보기'].join('\t'); if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(headerRow); alert("엑셀 헤더가 복사되었습니다."); } }
  const saveToBoard = () => {
      if(!targetColorCode) { alert("⚠️ 컬러코드를 입력해야 합니다!"); return; }
      const newPost = { id: Date.now(), brand: carModel || '미지정', code: targetColorCode, date: registrationDate, likes: 0, views: 0, author: '내 데이터', spec: specialNotes || '특이사항 없음', baseFormula: [...toners], pearlFormula: [...pearlToners], isThreeCoat: isThreeCoatMode };
      setBoardPosts([newPost, ...boardPosts]); alert("🎉 게시판에 데이터가 등록되었습니다!");
  };
  const deleteBoardPost = (id: number, e: React.MouseEvent) => { e.stopPropagation(); if (window.confirm("삭제하시겠습니까?")) setBoardPosts(prev => prev.filter(post => post.id !== id)); };
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-[200px] md:pb-[140px] notranslate" translate="no">
      <header className="bg-slate-900 flex flex-col sm:flex-row justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0 gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-lg md:text-xl font-semibold flex items-center gap-2 w-full">
              <span className="text-white tracking-wide truncate">조색 Pro</span>
              <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 ml-1 hidden sm:inline-block shrink-0">Last Patch: {LAST_PATCH_DATE}</span>
          </h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
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
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚙 브랜드 등록</label><input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="예: 현대, BMW..." className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
                <div className="flex flex-col"><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🎨 컬러코드</label><input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="예: UX" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full uppercase focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm notranslate" translate="no" /></div>
              </div>
              <div><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🛠️ 작업 내용</label><input type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="예: 조수석 앞휀다 교환 등" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" /></div>
              <div><label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📌 특이사항 및 스펙 메모</label><input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="직접 입력 (예: 이색 심함)" className="bg-yellow-50 border-yellow-400 border p-2.5 rounded text-sm font-bold w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400" /></div>
              <div className="flex w-full gap-2 mt-2">
                <button onClick={() => setIsExcelModalOpen(true)} className="flex-[1.5] bg-green-600 text-white p-3 rounded text-xs font-black flex items-center justify-center hover:bg-green-700 shadow-sm"><FileSpreadsheet size={16} className="mr-1 hidden sm:block"/> 엑셀 복사</button>
                <button onClick={() => { saveToBoard(); setIsBoardOpen(true); }} className="flex-[1.5] bg-blue-600 text-white p-3 rounded text-xs font-black flex items-center justify-center hover:bg-blue-700 shadow-sm"><Layers size={16} className="mr-1 hidden sm:block"/> 시편 공유</button>
                <button onClick={() => setIsShareModalOpen(true)} className="flex-[2] bg-[#FEE500] text-slate-900 p-3 rounded text-sm font-black flex items-center justify-center hover:bg-[#E5C100] shadow-sm"><Share2 size={18} className="mr-1.5"/> 공유 전송</button>
                <button onClick={handleResetFormula} className="bg-white border border-red-200 text-red-500 px-3 rounded flex flex-col items-center justify-center hover:bg-red-50 shadow-sm whitespace-nowrap"><Trash2 size={18} className="mb-0.5" /><span className="text-[9px] font-black">리셋</span></button>
              </div>
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
                  <div key={toner.id} className="flex flex-col bg-slate-50 hover:bg-blue-50/50 p-2.5 mb-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                      <div className="flex flex-col flex-1 w-full overflow-hidden">
                          <div className="flex items-center gap-2 mb-1 w-full">
                              <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer relative" 
                                   onClick={() => setMemoModal({isOpen: true, id: toner.id, code: toner.code, isPearl: false, text: toner.memo || '', history: toner.history || []})}>
                                   <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                                   <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                                   {toner.memo && <div className="absolute -top-1 -right-1 bg-yellow-400 w-3 h-3 rounded-full border border-white shadow-sm"></div>}
                              </div>
                              <input 
                                  ref={el => { codeRefs.current[toner.id] = el; }} 
                                  value={toner.code.replace('WT ', '').replace('PP ', '')} 
                                  onChange={e => handleCodeChange(toner.id, e.target.value, false)} 
                                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                                  type="text"
                                  className="w-20 text-center text-sm font-black border border-slate-300 rounded p-1.5 focus:border-blue-500 focus:outline-none shadow-inner shrink-0 uppercase" 
                                  placeholder="번호" 
                              />
                              <div className="flex items-center gap-1 cursor-pointer hover:bg-blue-100/50 py-1 px-1.5 rounded transition-colors flex-1 overflow-hidden" onClick={() => toggleExpand(toner.id, false)}>
                                  <span className="font-bold text-blue-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                                  {toner.isExpanded ? <ChevronUp size={16} className="text-blue-400 shrink-0" /> : <ChevronDown size={16} className="text-blue-400 shrink-0" />}
                              </div>
                          </div>
                          {toner.isExpanded && (
                              <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2 pt-2 border-t border-slate-200">
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
                                  ) : <p className="text-[11px] text-slate-500 leading-tight break-keep">{info.desc}</p>}
                              </div>
                          )}
                      </div>
                      <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                         <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                         <input 
                             ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" pattern="[0-9]*" value={toner.adjustedWeight} 
                             onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} onBlur={e => handleWeightBlur(toner.id, e.target.value, false)} onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                             className="w-16 text-right text-base font-black text-blue-600 focus:outline-none clean-number-input mx-1" placeholder="0.0" 
                         />
                         <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="px-2 py-1 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                         <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => removeToner(toner.id, false)} className="ml-1"><Trash2 size={18} className="text-slate-300 hover:text-red-500 transition-colors"/></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              <div className="flex justify-between items-center bg-blue-50/80 p-3 mt-3 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center border border-blue-300 shadow-inner">
                          <Beaker size={14} className="text-blue-700"/>
                      </div>
                      <div className="flex flex-col">
                          <span className="text-xs font-black text-blue-800">💧 필수 수지/환원제 (6052 등)</span>
                          <span className="text-[10px] font-bold text-blue-600 opacity-80">입력된 베이스 안료 중량 대비 자동 계산량</span>
                      </div>
                  </div>
                  <span className="text-xl font-black text-blue-700">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}<span className="text-xs ml-0.5">g</span></span>
              </div>

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
                    <div key={toner.id} className="flex flex-col bg-purple-50 p-2.5 mb-1.5 rounded-xl border border-purple-200 shadow-sm transition-colors hover:bg-purple-100/50">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                        <div className="flex flex-col flex-1 w-full overflow-hidden pl-2">
                            <div className="flex items-center gap-2 mb-1 w-full">
                                <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer relative" 
                                     onClick={() => setMemoModal({isOpen: true, id: toner.id, code: toner.code, isPearl: true, text: toner.memo || '', history: toner.history || []})}>
                                     <div className="flex-1" style={getCachedTexture(info.type, info.face, info.flop, isEffect)}></div>
                                     <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                                     {toner.memo && <div className="absolute -top-1 -right-1 bg-yellow-400 w-3 h-3 rounded-full border border-white shadow-sm"></div>}
                                </div>
                                <input 
                                    ref={el => { codeRefs.current[toner.id] = el; }} 
                                    value={toner.code.replace('WT ', '').replace('PP ', '')} 
                                    onChange={e => handleCodeChange(toner.id, e.target.value, true)} 
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setFocusTarget({ id: toner.id, type: 'weight' }); } }}
                                    type="text" 
                                    className="w-20 text-center text-sm font-black border border-purple-200 rounded px-1.5 py-1 text-purple-800 shadow-inner focus:outline-none focus:border-purple-500 shrink-0 uppercase" 
                                    placeholder="번호" 
                                />
                                <div className="flex items-center gap-1 cursor-pointer hover:bg-purple-100/50 py-1 px-1.5 rounded transition-colors flex-1 overflow-hidden" onClick={() => toggleExpand(toner.id, true)}>
                                    <span className="font-bold text-purple-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                                    {toner.isExpanded ? <ChevronUp size={16} className="text-purple-400 shrink-0" /> : <ChevronDown size={16} className="text-purple-400 shrink-0" />}
                                </div>
                            </div>
                            {toner.isExpanded && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2 pt-2 border-t border-purple-200">
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
                                    ) : <p className="text-[11px] text-slate-500 leading-tight break-keep">{info.desc}</p>}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                           <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                           <input 
                               ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" pattern="[0-9]*" value={toner.adjustedWeight} 
                               onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} onBlur={e => handleWeightBlur(toner.id, e.target.value, true)} onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} 
                               className="w-16 text-right text-base font-black text-purple-600 focus:outline-none clean-number-input mx-1" placeholder="0.0" 
                           />
                           <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="px-2 py-1 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                           <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                           <button onClick={() => removeToner(toner.id, true)} className="ml-1"><Trash2 size={18} className="text-purple-300 hover:text-red-500 transition-colors"/></button>
                        </div>
                      </div>
                    </div>
                  )
                })}

                <div className="flex justify-between items-center bg-purple-50/80 p-3 mt-3 rounded-xl border border-purple-200 shadow-sm">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center border border-purple-300 shadow-inner">
                            <Zap size={14} className="text-purple-700"/>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-purple-800">✨ 펄 전용 수지/환원제</span>
                            <span className="text-[10px] font-bold text-purple-600 opacity-80">입력된 펄 안료 중량 대비 자동 계산량</span>
                        </div>
                    </div>
                    <span className="text-xl font-black text-purple-700">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}<span className="text-xs ml-0.5">g</span></span>
                </div>

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
                <span className="flex items-center"><Target size={14} className="mr-1 text-blue-600"/> 📘 마스터 기술자료실 (Visual Guide)</span>
                <button onClick={() => setIsConfiguratorOpen(true)} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"><Maximize size={10} className="mr-1"/>먼셀 믹싱 랩</button>
              </h3>
              
              {/* ━━━━━━━━ 밝고 화사하게 변경된 이미지 갤러리 탭 UI ━━━━━━━━ */}
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
                          <div key={img.id} onClick={() => setZoomedImage(img)} className="bg-white rounded-xl overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 hover:shadow-xl transition-all shadow-sm border border-slate-200 group flex flex-col justify-center items-center text-center p-4 min-h-[90px] relative">
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
                        <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="안료명 / 색상코드 검색" className="w-full bg-slate-900 border border-slate-600 text-white text-xs px-2.5 py-2 rounded-lg pl-8 focus:outline-none focus:border-blue-500 transition-colors" />
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
                    
                    {catalogSearch.trim() !== '' && OEM_COLORS.some(c => c.code.toUpperCase().includes(catalogSearch.toUpperCase()) || c.name.toUpperCase().includes(catalogSearch.toUpperCase())) && (
                        <div className="mb-2 p-3 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                            <h4 className="text-xs font-black text-blue-800 mb-2">🔍 FORD 색상코드 검색 결과</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {OEM_COLORS.filter(c => c.code.toUpperCase().includes(catalogSearch.toUpperCase()) || c.name.toUpperCase().includes(catalogSearch.toUpperCase())).slice(0, 20).map((oem, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400" onClick={() => setTargetColorCode(oem.code)}>
                                        <span className="font-black text-blue-600 text-sm">{oem.code}</span>
                                        <span className="text-xs text-slate-600 font-bold truncate max-w-[100px]">{oem.name}</span>
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

      <div className="fixed bottom-0 left-0 w-full z-[500] bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-12px_45px_rgba(0,0,0,0.85)] text-slate-100 pb-[env(safe-area-inset-bottom)]">
          <div className="flex flex-col md:flex-row p-3 md:p-4 justify-between items-center gap-3">
             <div className="flex w-full md:w-auto gap-3 sm:gap-4 shrink-0 overflow-x-auto custom-scrollbar pb-1 md:pb-0">
                <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
                   <span className="text-[10px] text-slate-400 font-black tracking-widest flex items-center uppercase"><Layers size={11} className="mr-1 text-blue-400"/> A. 베이스 코트 중량</span>
                   <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-800 shadow-inner text-xs">
                       <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 font-bold">순수 안료</span><span className="font-black text-white text-sm">{totalBaseWeight}g</span></div>
                       <span className="text-slate-600 font-black text-sm">+</span>
                       <div className="flex flex-col items-center"><span className="text-[9px] text-blue-400 font-bold">필수 수지</span><span className="font-black text-blue-400 text-sm">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g</span></div>
                       <span className="text-slate-600 font-black text-sm">=</span>
                       <div className="flex flex-col items-center bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/50"><span className="text-[9px] text-emerald-400 font-bold">합계</span><span className="font-black text-emerald-400 text-base">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)}g</span></div>
                   </div>
                </div>
                {isThreeCoatMode && (
                <div className="flex flex-col gap-1 flex-1 min-w-[220px]">
                   <span className="text-[10px] text-slate-400 font-black tracking-widest flex items-center uppercase"><Zap size={11} className="mr-1 text-purple-400"/> B. 펄 코트 중량</span>
                   <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-800 shadow-inner text-xs">
                       <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 font-bold">순수 펄</span><span className="font-black text-white text-sm">{totalPearlWeight}g</span></div>
                       <span className="text-slate-600 font-black text-sm">+</span>
                       <div className="flex flex-col items-center"><span className="text-[9px] text-purple-400 font-bold">펄 수지</span><span className="font-black text-purple-400 text-sm">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g</span></div>
                       <span className="text-slate-600 font-black text-sm">=</span>
                       <div className="flex flex-col items-center bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/50"><span className="text-[9px] text-emerald-400 font-bold">합계</span><span className="font-black text-emerald-400 text-base">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)}g</span></div>
                   </div>
                </div>
                )}
             </div>
             <div className="w-full md:w-auto flex flex-row md:flex-col items-center justify-between md:justify-center shrink-0 bg-gradient-to-br from-amber-950/50 to-yellow-900/20 border-2 border-yellow-500/60 px-4 py-2 sm:px-6 sm:py-2 rounded-xl shadow-[0_0_25px_rgba(234,179,8,0.2)]">
                <span className="text-[11px] text-yellow-500 font-black tracking-widest flex items-center uppercase"><Beaker size={13} className="mr-1"/> ✨ 혼합 총량</span>
                <span className="text-2xl sm:text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                   {(parseFloat((parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)) + (isThreeCoatMode ? parseFloat((parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)) : 0)).toFixed(1)}<span className="text-base sm:text-lg font-bold text-yellow-600 ml-0.5">g</span>
                </span>
             </div>
          </div>
      </div>

      {zoomedImage && (
        <div className="fixed inset-0 bg-black/90 z-[4000] flex flex-col items-center justify-center p-4 backdrop-blur-md animate-in fade-in" onClick={() => setZoomedImage(null)}>
            <button className="absolute top-6 right-6 text-slate-800 bg-white hover:bg-red-500 hover:text-white rounded-full p-2 transition-colors z-[4010] shadow-lg"><X size={24}/></button>
            <div className="max-w-5xl w-full flex flex-col items-center relative" onClick={e => e.stopPropagation()}>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 w-full mb-4 text-center shadow-2xl">
                    <h3 className="text-slate-900 font-black text-2xl mb-2">{zoomedImage.title}</h3>
                    <p className="text-blue-700 text-sm font-bold">{zoomedImage.desc}</p>
                </div>
                {zoomedImage.url ? (
                    <div className="relative w-full max-h-[65vh] flex justify-center bg-white p-2 rounded-2xl shadow-2xl">
                        <img src={zoomedImage.url} alt={zoomedImage.title} className="max-w-full max-h-[60vh] object-contain rounded-xl" />
                    </div>
                ) : (
                    <div className="w-full max-w-2xl h-[40vh] flex flex-col items-center justify-center bg-slate-800/80 rounded-3xl shadow-2xl border border-slate-700">
                        <Camera size={56} className="text-slate-500 mb-4" />
                        <p className="text-slate-300 font-black text-lg mb-1">상세 이미지가 준비 중입니다.</p>
                        <p className="text-slate-500 text-sm font-bold">추후 원본 데이터가 업데이트될 예정입니다.</p>
                    </div>
                )}
            </div>
        </div>
      )}

      {memoModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[400px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-indigo-600 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Edit3 size={18} /> {memoModal.code || '선택된 안료'} 메모 및 히스토리</h3>
              <button onClick={() => setMemoModal({...memoModal, isOpen: false})} className="hover:text-red-200 transition-colors bg-indigo-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4 bg-slate-50">
              <div>
                <label className="text-xs font-black text-indigo-800 mb-1.5 flex items-center gap-1"><Edit3 size={14}/> 조색 커스텀 메모</label>
                <textarea 
                    value={memoModal.text} 
                    onChange={e => setMemoModal({...memoModal, text: e.target.value})} 
                    placeholder="이 안료에 대한 특별한 조색 팁이나 주의사항을 자유롭게 적어두세요." 
                    className="w-full border border-slate-300 p-3 rounded-lg text-sm text-slate-800 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner font-medium" 
                />
              </div>
              {memoModal.history.length > 0 && (
                <div>
                  <label className="text-xs font-black text-slate-500 mb-1.5 flex items-center gap-1"><History size={14}/> 용량(g) 변경 히스토리 기록</label>
                  <div className="flex flex-wrap gap-1.5 bg-white p-3 rounded-lg border border-slate-200 shadow-sm max-h-32 overflow-y-auto">
                    {memoModal.history.map((h, i) => (
                      <span key={i} className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded border border-slate-200">{h}g</span>
                    ))}
                  </div>
                </div>
              )}
              <button 
                  onClick={() => {
                      if(memoModal.isPearl) setPearlToners(prev => prev.map(t => t.id === memoModal.id ? {...t, memo: memoModal.text} : t));
                      else setToners(prev => prev.map(t => t.id === memoModal.id ? {...t, memo: memoModal.text} : t));
                      setMemoModal({...memoModal, isOpen: false});
                  }} 
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black shadow-md hover:bg-indigo-700 transition-colors flex justify-center items-center gap-2"
              >
                <Save size={18}/> 메모 저장하기
              </button>
            </div>
          </div>
        </div>
      )}

      {isExcelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border-2 border-green-600">
            <div className="p-4 bg-green-600 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><FileSpreadsheet size={18} /> 엑셀(Excel) 연동 가이드 및 복사</h3>
              <button onClick={() => setIsExcelModalOpen(false)} className="hover:text-red-200 transition-colors bg-green-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4 bg-slate-50">
              <div className="text-sm text-slate-700 leading-relaxed bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="font-black text-green-800 mb-2">✅ 초간단 엑셀 복사 사용 방법 (매크로 불필요!)</p>
                  <p><b>Step 1.</b> 처음 사용하실 때만 아래 <b>'엑셀 기본 양식 복사'</b>를 눌러 엑셀 A1 셀에 붙여넣어 <b>제목 틀</b>을 만드세요.</p>
                  <p className="mt-1"><b>Step 2.</b> 데이터 입력 후 <b>초록색 [엑셀 복사] 버튼을 누른 다음, 엑셀의 빈 줄 첫 칸(A열)에 바로 붙여넣기(Ctrl+V)</b> 하시면 자동으로 팝업 복원 링크가 생성됩니다.</p>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                  <button onClick={handleCopyExcelTemplate} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold shadow-sm hover:bg-slate-700 transition-colors">📋 Step 1. 엑셀 기본 양식 복사 (제목줄 만들기)</button>
                  <button onClick={handleDirectExcelCopy} className="w-full bg-green-600 text-white py-3 rounded-xl font-black shadow-md hover:bg-green-700 transition-colors">🚀 Step 2. 현재 데이터 엑셀 복사 (배합 저장하기)</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[400px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-800 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Share2 size={18} /> 배합 데이터 공유 전송</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="hover:text-red-200 transition-colors bg-slate-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 flex flex-col gap-3 bg-slate-50">
                <button onClick={handleShareKakao} className="w-full bg-[#FEE500] text-slate-900 py-3 rounded-xl font-black shadow-sm hover:bg-[#E5C100] transition-colors flex items-center justify-center gap-2"><MessageSquare size={18}/> 카카오톡 복사 전송</button>
                <button onClick={handleShareSMS} className="w-full bg-blue-50 text-white py-3 rounded-xl font-black shadow-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><Send size={18}/> 문자(SMS)로 앱 열기</button>
                <button onClick={handleShareMail} className="w-full bg-slate-600 text-white py-3 rounded-xl font-black shadow-sm hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"><Mail size={18}/> 이메일 앱 열기</button>
            </div>
          </div>
        </div>
      )}

      {isProcessOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[3000] p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-600 shadow-2xl max-w-4xl w-full max-h-[85vh] flex flex-col overflow-hidden relative">
            <button onClick={() => setIsProcessOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700 p-1.5 rounded-full transition-colors z-10"><X size={20} /></button>
            <div className="border-b border-emerald-500/50 pb-4 mb-5 shrink-0">
                <h4 className="text-2xl sm:text-3xl font-black text-white tracking-wide mb-1">
                    Spies Hecker DB Architecture
                </h4>
                <p className="text-emerald-400 font-bold text-sm sm:text-base">
                    Total 110 Items Perfectly Built & Engineered
                </p>
                <div className="mt-4 inline-flex bg-slate-900 px-3 py-1.5 rounded border border-slate-700 items-center">
                    <span className="text-slate-400 text-[11px] sm:text-xs mr-2">Lead Color & Data Engineer:</span>
                    <span className="text-white font-black text-sm sm:text-base">윤성만 팀장</span>
                </div>
            </div>
            <div className="overflow-y-auto space-y-6 text-slate-300 font-sans text-xs sm:text-[13px] leading-relaxed break-keep pr-2 custom-scrollbar">
                <p>DB 완벽 분리 및 모바일 최적화, 화이트톤 갤러리 탭 적용 완료. 에러 Zero 패치 탑재.</p>
            </div>
          </div>
        </div>
      )}

      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[400px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-yellow-500 flex justify-between items-center text-slate-900">
              <h3 className="font-black flex items-center gap-2"><Mail size={18} /> 개발자에게 피드백 보내기</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="hover:text-red-600 transition-colors bg-yellow-400 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4 bg-slate-50">
              <div className="flex gap-3 mt-2">
                  <a href="https://mail.naver.com/v2/new?to=ysm0427@gmail.com" target="_blank" rel="noreferrer" className="flex-1 bg-[#03C75A] text-white py-3 rounded-xl font-black text-center shadow-md">네이버 메일</a>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ysm0427@gmail.com" target="_blank" rel="noreferrer" className="flex-1 bg-white border text-slate-700 py-3 rounded-xl font-black text-center shadow-sm">구글 메일</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSnapshotModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] rounded-2xl w-[800px] max-w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="p-4 flex justify-between items-center border-b border-slate-700/50 bg-slate-900">
              <h3 className="text-white font-bold flex items-center gap-2"><History size={18} className="text-blue-400" /> 현재 페이지 데이터 수정 내역 보기</h3>
              <button onClick={() => setIsSnapshotModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"><X size={16} /></button>
            </div>
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0f172a]">
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700/50 overflow-y-auto bg-slate-900/50 flex flex-col">
                    {snapshots.length === 0 ? ( <div className="p-6 text-center text-slate-500 text-sm">확정된 기록이 없습니다.</div> ) : (
                        snapshots.map((snap, idx) => (
                            <button key={snap.id} onClick={() => setSelectedSnapshot(snap)} className={`p-4 text-left border-b border-slate-800 transition-colors flex flex-col gap-1 ${selectedSnapshot?.id === snap.id ? 'bg-indigo-900/40 border-l-4 border-indigo-500' : 'hover:bg-slate-800'}`}>
                                <span className="text-xs text-slate-400 font-bold">{snap.dateStr}</span>
                                <span className="text-white font-black text-sm">{snapshots.length - idx}차 확정 데이터</span>
                                <span className="text-xs text-emerald-400 font-bold flex items-center"><CheckCircle size={12} className="mr-1"/> {snap.timestamp}</span>
                            </button>
                        ))
                    )}
                </div>
                <div className="flex-1 p-6 overflow-y-auto bg-[#0f172a] custom-scrollbar">
                    {selectedSnapshot ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-3"><Search size={20} className="text-yellow-400"/> 데이터 상세 보기 및 복원</h4>
                            <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50 mb-4 flex justify-between items-center"><span className="text-sm text-slate-300 font-bold">최종 혼합 총량</span><span className="text-xl font-black text-yellow-400">{selectedSnapshot.totalFinal}g</span></div>
                            <div className="mb-4">
                                <h5 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase"><Layers size={14} className="text-blue-400"/> 베이스 코트 내역</h5>
                                <div className="space-y-2">
                                    {selectedSnapshot.base?.filter((t: any) => t.code).map((t: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center bg-[#1e293b] p-3 rounded-lg border border-slate-700/50">
                                            <div className="flex items-center gap-3"><span className="text-white font-bold text-sm">WT {t.code.replace('WT ', '')}</span><span className="text-xs text-slate-500 truncate max-w-[120px]">{TONER_DB[t.code]?.role || ''}</span></div>
                                            <span className="text-blue-400 font-bold">{t.adjustedWeight}g</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {selectedSnapshot.isThreeCoat && selectedSnapshot.pearl?.filter((t: any) => t.code).length > 0 && (
                                <div className="mb-6">
                                    <h5 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase"><Zap size={14} className="text-purple-400"/> 펄 코트 내역</h5>
                                    <div className="space-y-2">
                                        {selectedSnapshot.pearl?.filter((t: any) => t.code).map((t: any, i: number) => (
                                            <div key={i} className="flex justify-between items-center bg-[#1e293b] p-3 rounded-lg border border-purple-900/30">
                                                <div className="flex items-center gap-3"><span className="text-white font-bold text-sm">WT {t.code.replace('WT ', '')}</span><span className="text-xs text-slate-500 truncate max-w-[120px]">{TONER_DB[t.code]?.role || ''}</span></div>
                                                <span className="text-purple-400 font-bold">{t.adjustedWeight}g</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button onClick={() => restoreSnapshot(selectedSnapshot)} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl mt-4 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all flex justify-center items-center gap-2 text-base"><RefreshCw size={20}/> 이 상태로 완벽하게 덮어쓰기 (복원)</button>
                        </div>
                    ) : ( <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50"><History size={64} className="mb-4"/><p className="font-bold">왼쪽에서 확인하실 수정 내역을 선택해주세요.</p></div> )}
                </div>
            </div>
          </div>
        </div>
      )}

      {isBoardOpen && (
        <div className="fixed inset-0 bg-slate-900/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-slate-100 rounded-2xl w-[800px] max-w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-300">
            <div className="p-4 bg-slate-800 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><Layers size={18} className="text-emerald-400"/> 브랜드별 실시간 시편 데이터 (Beta)</h3>
              <button onClick={() => setIsBoardOpen(false)} className="hover:text-red-300 transition-colors bg-slate-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            
            <div className="p-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-3 shrink-0">
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['전체', ...Array.from(new Set(boardPosts.map(p => p.brand).filter(Boolean)))].map(b => (
                        <button key={b as string} onClick={() => setBoardBrandFilter(b as string)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${boardBrandFilter === b ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'}`}>{b as string}</button>
                    ))}
                </div>
                <div className="flex gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <input type="text" value={boardSearch} onChange={e=>setBoardSearch(e.target.value)} placeholder="브랜드, 컬러코드, 특이사항 동시 검색" className="w-full bg-slate-50 border border-slate-300 text-sm px-3 py-1.5 rounded-lg pl-9 focus:outline-none focus:border-emerald-500 shadow-sm" />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    <button onClick={saveToBoard} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors shrink-0 whitespace-nowrap flex items-center gap-1"><Plus size={14}/> 현재 배합 등록</button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 bg-slate-100">
                {boardPosts.filter(p => {
                    const passBrandFilter = boardBrandFilter === '전체' || p.brand === boardBrandFilter;
                    const searchLower = boardSearch.toLowerCase();
                    const passSearch = p.brand.toLowerCase().includes(searchLower) || p.code.toLowerCase().includes(searchLower) || p.spec.toLowerCase().includes(searchLower);
                    return passBrandFilter && passSearch;
                }).map(post => (
                    <div key={post.id} onClick={() => handleOpenPost(post)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group relative">
                        <button onClick={(e) => deleteBoardPost(post.id, e)} className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-red-500 px-2 py-1 rounded-md transition-all flex items-center gap-1 font-bold text-[10px]" title="이 시편 삭제하기"><Trash2 size={14} /> 삭제</button>
                        <div className="flex justify-between items-start mb-2 pr-16">
                            <div className="flex items-center gap-2">
                                <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded font-bold">{post.brand}</span>
                                <span className="text-lg font-black text-emerald-700 uppercase tracking-wide group-hover:text-emerald-500 transition-colors notranslate" translate="no">{post.code}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-bold mb-3 break-keep pr-16">{post.spec}</p>
                        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                            <span className="text-xs text-slate-500">By. <b>{post.author}</b></span>
                            <div className="flex gap-3 text-xs font-bold text-slate-400">
                                <span className="flex items-center gap-1 group-hover:text-emerald-600 transition-colors"><Eye size={14}/> {post.views}</span>
                                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors"><ThumbsUp size={14}/> {post.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {boardPosts.length === 0 && <div className="text-center py-10 text-slate-500">검색 조건에 맞는 시편 데이터가 없습니다.</div>}
            </div>
          </div>
        </div>
      )}

      {viewingPost && (
        <div className="fixed inset-0 bg-slate-900/90 z-[2000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-300 my-8">
            <div className="p-4 bg-emerald-600 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold flex items-center gap-2"><Layers size={18} /> 시편 배합 상세 보기</h3>
              <button onClick={() => setViewingPost(null)} className="hover:text-red-200 transition-colors bg-emerald-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 bg-slate-50">
              {isEditingPost ? (
                  <div className="flex flex-col gap-3 mb-2 bg-emerald-50 p-4 rounded-xl border border-emerald-200 animate-in fade-in">
                      <h4 className="text-xs font-black text-emerald-700 flex items-center gap-1"><Edit3 size={14}/> 게시물 정보 수정</h4>
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block">브랜드 (차종)</label>
                          <input value={editPostForm.brand} onChange={e => setEditPostForm({...editPostForm, brand: e.target.value})} className="w-full border border-slate-300 p-2 rounded text-sm font-bold text-slate-800 focus:outline-none focus:border-emerald-500" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block">컬러 코드</label>
                          <input value={editPostForm.code} onChange={e => setEditPostForm({...editPostForm, code: e.target.value})} className="w-full border border-slate-300 p-2 rounded text-sm font-bold uppercase text-slate-800 focus:outline-none focus:border-emerald-500 notranslate" translate="no" />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-slate-500 mb-1 block">특이사항 및 스펙</label>
                          <textarea value={editPostForm.spec} onChange={e => setEditPostForm({...editPostForm, spec: e.target.value})} className="w-full border border-slate-300 p-2 rounded text-sm text-slate-800 h-20 resize-none focus:outline-none focus:border-emerald-500 font-medium" />
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => setIsEditingPost(false)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-bold text-xs transition-colors">취소</button>
                          <button onClick={handleSavePostEdit} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition-colors flex items-center gap-1"><CheckCircle size={14}/> 저장하기</button>
                      </div>
                  </div>
              ) : (
                  <>
                      <div className="flex justify-between items-start border-b border-slate-200 pb-3 relative">
                         <div>
                            <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded font-bold mr-2">{viewingPost.brand}</span>
                            <span className="text-2xl font-black text-emerald-700 uppercase tracking-wide notranslate" translate="no">{viewingPost.code}</span>
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <span className="text-xs text-slate-500 font-medium">{viewingPost.date}</span>
                            <button onClick={() => setIsEditingPost(true)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md text-[10px] font-black flex items-center gap-1 transition-colors shadow-sm border border-slate-200"><Edit3 size={12}/> 내용 수정</button>
                         </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm font-bold text-slate-700 break-keep">{viewingPost.spec}</div>
                  </>
              )}

              <div>
                <h4 className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1"><Layers size={14} /> 베이스 코트 (Ground Coat)</h4>
                <div className="space-y-1.5">
                  {viewingPost.baseFormula?.filter((t: any) => t.code).map((t: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2"><span className="text-slate-800 font-black text-sm w-16">{t.code.replace('WT ', '')}</span><span className="text-xs text-slate-500">{TONER_DB[t.code]?.role || '미등록 안료'}</span></div>
                      <span className="text-blue-600 font-bold">{t.adjustedWeight}g</span>
                    </div>
                  ))}
                </div>
              </div>

              {viewingPost.isThreeCoat && viewingPost.pearlFormula?.filter((t: any) => t.code).length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-purple-600 mb-2 flex items-center gap-1"><Zap size={14} /> 펄 코트 (Mid Coat)</h4>
                  <div className="space-y-1.5">
                    {viewingPost.pearlFormula?.filter((t: any) => t.code).map((t: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2"><span className="text-slate-800 font-black text-sm w-16">{t.code.replace('WT ', '')}</span><span className="text-xs text-slate-500">{TONER_DB[t.code]?.role || '미등록 안료'}</span></div>
                        <span className="text-purple-600 font-bold">{t.adjustedWeight}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
               <button onClick={() => setViewingPost(null)} className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-md">닫기</button>
            </div>
          </div>
        </div>
      )}

      {isGlossaryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[700px] max-w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-emerald-600 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><BookOpen size={18} /> 📖 자동차 도장/조색 쉬운 용어 사전</h3>
              <button onClick={() => setIsGlossaryModalOpen(false)} className="hover:text-red-200 bg-emerald-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 space-y-8">
              
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full text-sm">
                      <p className="font-black text-blue-800 mb-1">🔍 사전에 없는 용어가 궁금하신가요?</p>
                      <p className="text-slate-600 text-xs break-keep">아래 검색창에 궁금한 용어를 입력하고 엔터(Enter) 키를 치시면 바로 구글 검색 결과로 이동합니다.</p>
                      <div className="flex mt-2">
                        <input 
                            id="glossarySearchInput" 
                            lang="ko" 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleGoogleGlossarySearch(); }} 
                            type="text" 
                            placeholder="예: WT 303, 메탈릭 등 입력 후 엔터" 
                            className="flex-1 p-2 border border-blue-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        />
                        <button onClick={handleGoogleGlossarySearch} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r font-bold text-xs flex items-center justify-center"><Search size={14} className="mr-1"/> 검색</button>
                      </div>
                  </div>
              </div>

              <div>
                <h4 className="font-black text-emerald-800 mb-3 border-b-2 border-emerald-200 pb-1">1. 페인트의 종류와 성질</h4>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mr-2">솔리드 컬러 (Solid Color)</span><br/>반짝이는 가루(은분이나 펄)가 단 1%도 들어가지 않은 '순수한 색상' 그 자체입니다. (비유: 펄 없는 새빨간 소방차, 노란 유치원 버스)</li>
                  <li><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mr-2">이펙트 컬러 (Effect Color)</span><br/>바라보는 각도나 햇빛의 양에 따라 색상과 반짝임이 마술처럼 변하는 페인트입니다. 금속 가루(알루미늄)나 진주 가루(펄)가 섞여 있어야만 이펙트 컬러가 됩니다. (비유: 맑은 날에는 은색인데 그늘에 가면 진한 쥐색으로 변하는 승용차)</li>
                  <li><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mr-2">알루미늄 / 실버 (Aluminum / Silver)</span><br/>자동차에 금속 특유의 차갑고 반짝이는 느낌을 주기 위해 페인트에 섞는 '실제 금속(은분) 가루'입니다.</li>
                  <li><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mr-2">마이카 / 펄 (Mica / Pearl)</span><br/>금속 가루가 아니라, 조개껍데기 안쪽이나 진주처럼 은은하고 영롱한 빛을 내는 가루입니다. 도장면을 고급스럽고 뽀얗게 만들어줍니다.</li>
                  <li><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold mr-2">금속성 (Metallic / 메탈릭)</span><br/>쇠붙이나 깡통 표면처럼 차갑고 매끄럽게 빛을 반사하는 느낌을 말합니다.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-blue-800 mb-3 border-b-2 border-blue-200 pb-1">2. 반짝임과 빛의 성질</h4>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold mr-2">브릴리언트 / 광휘형 (Brilliant)</span><br/>일반적인 반짝임을 뛰어넘어, 눈이 부실 정도로 빛을 '쨍'하고 날카롭게 튕겨내는 엄청난 반사력을 뜻합니다. (비유: 일반 은분이 '은박지'라면, 브릴리언트는 '거울 조각'을 잘게 부숴놓은 것처럼 화려하게 반짝입니다.)</li>
                  <li><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold mr-2">간섭 펄 (Interference Pearl)</span><br/>빛의 굴절을 이용해, 정면에서 볼 때와 옆에서 볼 때 색이 완전히 다르게 변신하는 카멜레온 같은 특수 펄입니다. (비유: 정면에서는 파란색으로 빛나다가, 고개를 돌려 옆에서 보면 빨간색으로 변하는 신비로운 가루입니다.)</li>
                  <li><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold mr-2">정면 (15도) vs 측면 (45도/110도, 플롭)</span><br/>자동차 페인트는 빛을 받는 각도에 따라 색이 다릅니다.<br/>- 정면(15도): 차를 햇빛 아래서 똑바로 마주 보았을 때의 밝고 반짝이는 색상.<br/>- 측면(45도/110도): 시선을 비스듬히 돌리거나 그늘진 쪽에서 바라봤을 때 짙어지는 색상(섀도우).</li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-purple-800 mb-3 border-b-2 border-purple-200 pb-1">3. 물리적인 역할과 재료</h4>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold mr-2">파우더 펄 (Powder Pearl)</span><br/>일반적인 액체(물감) 상태가 아니라, 밀가루처럼 완전히 바싹 마른 100% 가루 형태로 된 펄 안료입니다.</li>
                  <li><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold mr-2">바인더 / 믹싱 클리어 (Binder)</span><br/>가루나 입자들이 뭉치지 단 1%도 들어가지 않게 뭉치지 않고 차체에 고르게 달라붙을 수 있도록 도와주는 '투명한 물감'이자 '접착제' 같은 역할입니다.</li>
                  <li><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold mr-2">은폐력 (Hiding Power)</span><br/>페인트를 칠했을 때, 밑바탕에 있던 원래 색이나 흠집을 얼마나 잘 가려주는지(덮어주는지) 나타내는 힘입니다. (비유: 은폐력이 좋으면 '페인트 마커'처럼 밑바탕을 완벽히 덮어버리고, 은폐력이 나쁘면 '투명한 셀로판지'처럼 밑바탕이 그대로 비쳐 보입니다.)</li>
                  <li><span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold mr-2">캔디 / 트랜스페어런트 (Candy / Transparent)</span><br/>은폐력이 전혀 없이, 투명하게 밑바탕을 비춰주는 '셀로판지' 같은 물감입니다. 밑에 칠해둔 반짝이는 은색을 그대로 투과시키면서 색깔만 예쁘게 입혀줍니다.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-black text-rose-800 mb-3 border-b-2 border-rose-200 pb-1">4. 안료(조색제) 영문 명칭 쉬운 해석</h4>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li><span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold mr-2">브라이트(Bright) / 브릴리언트(Brilliant)</span><br/>'밝은', '눈부신', '화사한'이라는 뜻입니다. 탁하지 않고 쨍하게 빛나는 맑은 원색을 의미합니다.</li>
                  <li><span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold mr-2">그리니쉬(Greenish) / 블루이쉬(Bluish) / 레디쉬(Reddish)</span><br/>'~빛이 도는'이라는 뜻입니다. (예: 그리니쉬 블루 = 초록빛이 감도는 파랑 / 레디쉬 옐로우 = 붉은빛이 도는 노랑)</li>
                  <li><span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold mr-2">마룬(Maroon) / 옥사이드(Oxide)</span><br/>마룬은 '밤색, 적갈색(버건디)'을 뜻하고, 옥사이드는 '산화철(녹슨 철)'을 뜻합니다. 맑기보단 묵직하고 탁한 흙빛 섀도우를 냅니다.</li>
                  <li><span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold mr-2">마젠타(Magenta) / 시안(Cyan)</span><br/>마젠타는 '자주색(밝은 핑크/적자색)', 시안은 '청록색(하늘색/바다색)'을 의미합니다.</li>
                  <li><span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold mr-2">트랜스페어런트(Transparent) / 트랜스루센트(Translucent)</span><br/>트랜스페어런트는 완벽히 밑이 비치는 '투명(캔디)'을, 트랜스루센트는 살짝 비치는 '반투명(저농)'을 뜻합니다.</li>
                  <li><span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold mr-2">코스(Coarse) / 파인(Fine) / 마이크로(Micro)</span><br/>은분이나 펄 입자의 크기입니다. 코스(입자가 굵고 거침) &gt; 파인(입자가 작고 고움) &gt; 마이크로(먼지처럼 아주 미세함).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/98 z-[800] flex flex-col text-white font-sans select-none animate-in fade-in overflow-y-scroll custom-scrollbar">
          <header className="p-4 flex justify-between items-center bg-black/60 border-b border-slate-800 shrink-0 sticky top-0 z-40 backdrop-blur-md">
            <h2 className="text-base font-black tracking-widest text-slate-300 uppercase flex items-center"><Beaker className="mr-2 text-indigo-500"/> 먼셀 컬러 믹싱 스튜디오 (Munsell Mixing Lab)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-full border border-slate-700 transition-colors"><X size={18}/></button>
          </header>
          <main className="flex-1 p-6 md:p-10 flex flex-col items-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 overflow-x-hidden">
             <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-8 items-start">
                 <div className="w-full flex flex-col items-center justify-center h-[460px]">
                     <h3 className="text-lg font-black text-white mb-6 flex items-center bg-slate-900 px-6 py-2 rounded-full border border-slate-700 shadow-lg shrink-0"><Sun className="mr-2 text-yellow-400" size={20}/> 먼셀 20 색상환 (Munsell Wheel)</h3>
                     <div className="relative flex justify-center items-center w-[360px] h-[360px] shrink-0">
                        <svg className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]" viewBox="0 0 400 400">
                            <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" /></marker></defs>
                            {MUNSELL_WHEEL_COLORS.map((color, index) => {
                                const startAngle = index * 18; const endAngle = (index + 1) * 18 - 1; const pathData = describeArc(200, 200, 100, 170, startAngle, endAngle); const isSelected = selectedWheelIndex === index;
                                return ( <path key={index} d={pathData} fill={color.hex} stroke={isSelected ? "#ffffff" : "transparent"} strokeWidth={isSelected ? "3" : "0"} className={`cursor-pointer transition-all duration-300 hover:opacity-80`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWheelClick(index); }} style={{ transformOrigin: '200px 200px', transform: isSelected ? 'scale(1.05)' : 'scale(1)' }} /> );
                            })}
                            {MUNSELL_WHEEL_COLORS.map((color, index) => {
                                const midAngle = index * 18 + 8.5; const pos = polarToCartesian(200, 200, 185, midAngle); let textRotation = midAngle; if (midAngle > 90 && midAngle < 270) textRotation += 180;
                                return ( <g key={`label_${index}`} transform={`rotate(${textRotation}, ${pos.x}, ${pos.y})`}><text x={pos.x} y={pos.y - 4} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle" className="pointer-events-none drop-shadow-md">{color.name}</text><text x={pos.x} y={pos.y + 6} fill="#64748b" fontSize="8" fontWeight="normal" textAnchor="middle" className="pointer-events-none">({color.symbol})</text></g> );
                            })}
                            <circle cx="200" cy="200" r="98" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                            <text x="200" y="195" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="tracking-widest">MUNSELL</text>
                            <text x="200" y="215" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle" dominantBaseline="middle">표준 색상환</text>
                            {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] && ( <line x1={polarToCartesian(200, 200, 80, selectedWheelIndex * 18 + 8.5).x} y1={polarToCartesian(200, 200, 80, selectedWheelIndex * 18 + 8.5).y} x2={polarToCartesian(200, 200, 80, ((selectedWheelIndex + 10) % 20) * 18 + 8.5).x} y2={polarToCartesian(200, 200, 80, ((selectedWheelIndex + 10) % 20) * 18 + 8.5).y} stroke="#ef4444" strokeWidth="3.5" markerEnd="url(#arrowhead)" className="drop-shadow-[0_0_12px_rgba(239,68,68,1)] pointer-events-none" /> )}
                        </svg>
                     </div>
                 </div>
                 <div className="w-full flex flex-col items-center justify-center h-[460px]">
                    <div className="bg-[#111111] rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col items-center w-full max-w-[420px] h-[420px] justify-center transition-all">
                        <h4 className="text-xl font-black text-white mb-6 tracking-widest flex items-center shrink-0"><BookOpen className="mr-2 text-blue-400" size={20}/>RGB <span className="text-xs text-slate-500 ml-2 font-normal">Additive Color (빛의 혼합)</span></h4>
                        <div className="w-60 h-60 relative shrink-0">
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" style={{ backgroundColor: 'transparent' }}>
                                <circle cx="75" cy="75" r="55" fill="#0000FF" style={{ mixBlendMode: 'screen' }} />
                                <circle cx="125" cy="75" r="55" fill="#FF0000" style={{ mixBlendMode: 'screen' }} />
                                <circle cx="100" cy="120" r="55" fill="#00FF00" style={{ mixBlendMode: 'screen' }} />
                                <g stroke="#ffffff" strokeWidth="1" strokeOpacity="0.5">
                                    <line x1="75" y1="75" x2="30" y2="40" /><line x1="125" y1="75" x2="170" y2="40" /><line x1="100" y1="120" x2="100" y2="175" /><line x1="100" y1="55" x2="100" y2="25" /> <line x1="75" y1="105" x2="30" y2="130" /> <line x1="125" y1="105" x2="170" y2="130" /> <line x1="100" y1="90" x2="150" y2="90" /> 
                                </g>
                                <g fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" className="drop-shadow-md"><text x="25" y="35">Blue</text><text x="175" y="35">Red</text><text x="100" y="185">Green</text><text x="100" y="20" fill="#FF00FF">Magenta</text><text x="25" y="140" fill="#00FFFF">Cyan</text><text x="175" y="140" fill="#FFFF00">Yellow</text><rect x="155" y="82" width="30" height="14" fill="#ffffff" rx="2" /><text x="170" y="93" fill="#000000">White</text></g>
                            </svg>
                        </div>
                    </div>
                 </div>
                 <div className="w-full flex flex-col items-center justify-center h-[460px]">
                    {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] ? (
                        <div className="bg-slate-800 p-6 rounded-3xl border border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.3)] w-full max-w-[420px] h-[420px] flex flex-col justify-center text-center">
                            <h4 className="text-xl font-black text-white mb-6 flex items-center justify-center gap-3 shrink-0"><span className="w-6 h-6 rounded-full shadow-md border border-slate-400" style={{backgroundColor: MUNSELL_WHEEL_COLORS[selectedWheelIndex].hex}}></span>{MUNSELL_WHEEL_COLORS[selectedWheelIndex].name} ({MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol}) 배합 규격</h4>
                            <div className="flex justify-center items-center gap-6 bg-slate-900 py-8 px-4 rounded-xl border border-slate-700 w-full shrink-0 min-h-[140px]">
                                {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol] ? (
                                    <div className="flex flex-row justify-center items-center gap-6 w-full">
                                        <div className="flex flex-col items-center gap-3"><div className="w-14 h-14 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h1}}></div><span className="text-slate-300 font-bold text-sm">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c1}</span><span className="text-white font-black text-3xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r1}%</span></div>
                                        {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2 && (
                                            <div className="flex flex-row justify-center items-center gap-6"><span className="text-slate-600 font-black text-2xl">+</span><div className="flex flex-col items-center gap-3"><div className="w-14 h-14 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h2}}></div><span className="text-slate-300 font-bold text-sm">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2}</span><span className="text-white font-black text-3xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r2}%</span></div></div>
                                        )}
                                    </div>
                                ) : ( <div className="text-red-400 text-sm font-bold w-full text-center">배합 데이터를 불러올 수 없습니다.</div> )}
                            </div>
                            <p className="text-xs text-slate-400 mt-6 font-medium bg-slate-900/50 py-3 rounded-lg shrink-0">* 기술 보고서 기준의 단일 원색 정밀 조색 비율입니다.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 border-dashed w-full max-w-[420px] h-[420px] flex flex-col items-center justify-center gap-4 text-center text-slate-500"><Sun className="text-slate-600 mb-2" size={40} /><p className="text-base font-bold text-slate-400">색상환에서 컬러를 클릭하세요.</p><p className="text-sm">선택된 색상의 원색 조색 배율이<br/>이곳에 표시됩니다.</p></div>
                    )}
                 </div>
                 <div className="w-full flex flex-col items-center justify-center h-[460px]">
                    <div className="bg-[#f8f9fa] rounded-3xl p-6 border border-slate-300 shadow-2xl flex flex-col items-center w-full max-w-[420px] h-[420px] justify-center transition-all">
                        <h4 className="text-xl font-black text-slate-900 mb-6 tracking-widest flex items-center shrink-0"><BookOpen className="mr-2 text-pink-500" size={20}/>CMYK <span className="text-xs text-slate-500 ml-2 font-normal">Subtractive Color (물감의 혼합)</span></h4>
                        <div className="w-60 h-60 relative shrink-0">
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" style={{ backgroundColor: 'transparent' }}>
                                <circle cx="75" cy="75" r="55" fill="#00FFFF" style={{ mixBlendMode: 'multiply' }} />
                                <circle cx="125" cy="75" r="55" fill="#FF00FF" style={{ mixBlendMode: 'multiply' }} />
                                <circle cx="100" cy="120" r="55" fill="#FFFF00" style={{ mixBlendMode: 'multiply' }} />
                                <g stroke="#000000" strokeWidth="1" strokeOpacity="0.5">
                                    <line x1="75" y1="75" x2="30" y2="40" /><line x1="125" y1="75" x2="170" y2="40" /><line x1="100" y1="120" x2="100" y2="175" /><line x1="100" y1="55" x2="100" y2="25" /> <line x1="75" y1="105" x2="30" y2="130" /> <line x1="125" y1="105" x2="170" y2="130" /> <line x1="100" y1="90" x2="150" y2="90" /> 
                                </g>
                                <g fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle"><text x="25" y="35">Cyan</text><text x="175" y="35">Magenta</text><text x="100" y="185">Yellow</text><text x="100" y="20" fill="#0000FF">Blue</text><text x="25" y="140" fill="#008000">Green</text><text x="175" y="140" fill="#FF0000">Red</text><rect x="155" y="82" width="30" height="14" fill="#000000" rx="2" /><text x="170" y="93" fill="#ffffff">Black</text></g>
                            </svg>
                        </div>
                    </div>
                 </div>
             </div>
             <div className="mt-4 pb-12 w-full flex justify-center shrink-0">
                <button onClick={() => setIsConfiguratorOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-4 px-16 rounded-full transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 text-lg"><X size={24} /> 믹싱 스튜디오 닫기</button>
             </div>
          </main>
        </div>
      )}
    </div>
  );
}
