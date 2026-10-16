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

const LAST_PATCH_DATE = "2026.10.16 (자동 승인 루프 버그 수정 및 코드 안정화)"; 

// 자동 인증을 위한 시스템 마스터 키
const MASTER_KEY = "조색프로2026_AUTO";

// 가이드 이미지 (내용은 유지하되 저작권 방지를 위해 일부 설명 순화)
const GUIDE_IMAGES: Record<string, any[]> = {
  theory: [
    { id: 1, title: '색의 인식과 3원색', desc: '빛의 혼합 / 안료 혼합 원리', url: '/image1.jpg' },
    { id: 2, title: '단색안료 특성', desc: '유기/무기 안료 차이점', url: '/image2.jpg' },
    { id: 3, title: '빛과 안료 상호작용', desc: '솔리드/메탈릭 반사 원리', url: '/image3.jpg' },
    { id: 15, title: '이론 가이드 1', desc: '상세 페이지 (15)', url: '/image15.jpg' },
    { id: 16, title: '이론 가이드 2', desc: '상세 페이지 (16)', url: '/image16.jpg' },
    { id: 17, title: '이론 가이드 3', desc: '상세 페이지 (17)', url: '/image17.jpg' },
  ],
  spectrum: [
    { id: 4, title: '조색 기호의 이해', desc: '포스터 읽는 법', url: '/image4.jpg' },
    { id: 5, title: '솔리드 맵', desc: '솔리드 컬러 계열 위치', url: '/image5.jpg' },
    { id: 6, title: '황색/적색 맵', desc: '명암 및 채도 방향성', url: '/image6.jpg' },
    { id: 7, title: '청/녹/흑색 맵', desc: '정/측면 이색 변화 비교', url: '/image7.jpg' },
  ],
  effect: [
    { id: 8, title: '이펙트 포지셔닝', desc: '이펙트 컬러 위치도', url: '/image8.jpg' },
    { id: 9, title: '알루미늄 특성', desc: '입자 형상 비교 분석', url: '/image9.jpg' },
    { id: 10, title: '펄(Pearl) 입자', desc: '마이카/시라릭 현미경 구조', url: '/image10.jpg' },
    { id: 11, title: 'PP 파우더 특성', desc: '건식 펄 입자 비교', url: '/image11.jpg' },
  ],
  special: [
    { id: 12, title: '측면밝기조정제 특성', desc: '명암 변화 및 배향 메커니즘', url: '/image12.jpg' },
    { id: 13, title: '3코트 컬러 특성', desc: '펄 도장 및 하도 얼룩 방지', url: '/image13.jpg' },
    { id: 14, title: '틴티드 클리어', desc: '착색 클리어 시스템', url: '/image14.jpg' },
  ]
};

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => { return { code, ...data }; });
export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
export const formatWeight = (val: any): string => { 
    const num = Number(val); 
    if (isNaN(num)) return "0"; 
    return Number(num.toFixed(2)).toString(); 
};
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
  const [authStatus, setAuthStatus] = useState<'idle' | 'waiting' | 'approved'>('idle');
  const [loginForm, setLoginForm] = useState({ brand: '', branch: '', name: '', age: '', role: '사원' });
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
  const scrollContainerRef = useRef<HTMLDivElement null |>(null);

  const [isPearlGuideOpen, setIsPearlGuideOpen] = useState(false);
  const [activePearlLevel, setActivePearlLevel] = useState(6);
  
  const [boardPosts, setBoardPosts] = useState<BoardPost[]>([
      { id: 1, brand: '현대', code: 'UG4', date: '2026-09-11 14:30', likes: 12, views: 45, author: '윤프로', spec: '이색 심함, 보카시 블렌딩 필수', baseFormula: [{code: 'WT 321', adjustedWeight: '15.5'}], pearlFormula: [], isThreeCoat: false, images: [], deletedImages: [] }
  ]);

  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight', tempInput?: HTMLInputElement} | null>(null); 
  const [catalogSearch, setCatalogSearch] = useState('');
  
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

  const handleRequestApproval = (e: React.FormEvent) => {
      e.preventDefault();
      if (loginForm.name.trim() !== '' && loginForm.brand.trim() !== '' && loginForm.branch.trim() !== '') {
          setAuthStatus('waiting');
      } else {
          alert("❌ 필수 정보를 모두 입력해주세요.");
      }
  };

  useEffect(() => {
      let timer: any;
      if (authStatus === 'waiting') {
          timer = setTimeout(() => {
              setAuthStatus('approved');
          }, 6000); // 테스트를 위해 6초 대기
      }
      return () => clearTimeout(timer);
  }, [authStatus]);

  // 🚨 [수술 완료] 루프 버그 원천 차단 (의존성 최소화 및 상태 초기화)
  useEffect(() => {
      if (authStatus === 'approved' && !isAuthorized) {
          const finalizeLogin = setTimeout(() => {
              localStorage.setItem('hitec_auth_key', MASTER_KEY);
              localStorage.setItem('hitec_auth_name', loginForm.name.trim());
              
              const newUser = {
                  brand: loginForm.brand.trim(),
                  branch: loginForm.branch.trim(),
                  name: loginForm.name.trim(),
                  age: loginForm.age.trim() || '미입력',
                  role: loginForm.role,
                  date: new Date().toLocaleString('ko-KR'),
                  device: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'PC'
              };

              setAuthorizedUsers(prev => {
                  const isExist = prev.some(u => u.name === newUser.name && u.branch === newUser.branch);
                  if (isExist) return prev; // 중복 카운팅 완벽 방지
                  const updated = [...prev, newUser];
                  localStorage.setItem('hitec_auth_users', JSON.stringify(updated));
                  return updated;
              });

              setIsAuthorized(true);
              setAuthStatus('idle'); // 무한루프 방지를 위한 상태 초기화
          }, 2000);
          return () => clearTimeout(finalizeLogin);
      }
  }, [authStatus, isAuthorized, loginForm]);

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
  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율 상수를 입력하세요."); return; }
    const scale = (valStr: string) => { const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; const calcVal = isMultiply ? (val * 100000 * factor) / 100000 : (val * 100000) / (factor * 100000); return String(Number(Math.round(calcVal * 100000) / 100000)); };
    const applyScale = (list: any[]) => list.map(t => { if (!t.adjustedWeight) return t; const newVal = scale(t.adjustedWeight); const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory; return { ...t, adjustedWeight: newVal, history: nextHistory }; });
    setToners(applyScale(toners)); setPearlToners(applyScale(pearlToners));
  };

  const generateShareText = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '미지정'}): ${formatWeight(t.adjustedWeight)}g`).join('\n'); 
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '미지정'}): ${formatWeight(t.adjustedWeight)}g`).join('\n'); 
    let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin;
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0', registrationDate].join('|'); const shareUrl = `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`;
    return `[조색 배합 지시서]\n================================\n📅 등록날짜: ${registrationDate}\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 브랜드: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 순수 안료 합계: ${totalBaseWeight}g\n▶ 필수 수지(20%): ${formatWeight(parseFloat(totalBaseWeight) * 0.2)}g\n▶ 베이스 총 중량: ${formatWeight(parseFloat(totalBaseWeight) * 1.2)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트]\n${pearlListText \vert{}\vert{} '  (입력 데이터 없음)'}\n--------------------------------\n▶ 순수 펄 합계: ${totalPearlWeight}g\n▶ 펄 수지(30%): ${formatWeight(parseFloat(totalPearlWeight) * 0.3)}g\n▶ 펄 코트 총 중량: ${formatWeight(parseFloat(totalPearlWeight) * 1.3)}g\n\n` : ''}================================\n✨ 최종 도막 혼합 총량: ${totalFinalWeight}g\n\n👉 링크:\n${shareUrl}`;
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
                      if (width >
MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
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

  // 🚨 [NEW] 자동 승인 시스템 화면 전환 로직 (방법 B 탑재)
  if (!isAuthorized) {
      return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
              {/* 장식용 배경 요소 */}
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>

              <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg border border-slate-200 flex flex-col items-center relative z-10 overflow-hidden">
                  
                  {authStatus === 'idle' && (
                      <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-6"><Lock size={32} className="text-white"/></div>
                          <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">조색 Pro 접근 승인</h1>
                          <p className="text-sm text-slate-500 mb-8 text-center break-keep">이 시스템은 승인된 작업자만 사용할 수 있습니다. 관리자 확인을 위해 정확한 정보를 입력해주세요.</p>
                          
                          <form onSubmit={handleRequestApproval} className="w-full flex flex-col gap-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1"><Briefcase size={12}/> 소속 그룹 (상호명)</label>
                                      <input 
                                          type="text" 
                                          value={loginForm.brand} 
                                          onChange={e => setLoginForm({...loginForm, brand: e.target.value})}
                                          placeholder="예: 도이치 모터스 BMW" 
                                          className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-slate-50"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1"><MapPin size={12}/> 지점 위치</label>
                                      <input 
                                          type="text" 
                                          value={loginForm.branch} 
                                          onChange={e => setLoginForm({...loginForm, branch: e.target.value})}
                                          placeholder="예: 성수동" 
                                          className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-slate-50"
                                      />
                                  </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                  <div className="sm:col-span-2">
                                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1"><UserCheck size={12}/> 작업자 이름</label>
                                      <input 
                                          type="text" 
                                          value={loginForm.name} 
                                          onChange={e => setLoginForm({...loginForm, name: e.target.value})}
                                          placeholder="홍길동" 
                                          className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-slate-50"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1"><Hash size={12}/> 연령(나이)</label>
                                      <input 
                                          type="number" 
                                          value={loginForm.age} 
                                          onChange={e => setLoginForm({...loginForm, age: e.target.value})}
                                          placeholder="50" 
                                          className="w-full border border-slate-300 p-3 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-slate-50"
                                      />
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">현 직책</label>
                                  <select 
                                      value={loginForm.role} 
                                      onChange={e => setLoginForm({...loginForm, role: e.target.value})}
                                      className="w-full border border-slate-300 p-3 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner bg-white cursor-pointer"
                                  >
                                      <option value="사원">사원</option>
                                      <option value="주임">주임</option>
                                      <option value="대리">대리</option>
                                      <option value="과장">과장</option>
                                      <option value="차장">차장</option>
                                      <option value="부장">부장</option>
                                      <option value="지점장">지점장</option>
                                      <option value="대표">대표</option>
                                  </select>
                              </div>
                              
                              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black py-4 rounded-xl mt-4 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex justify-center items-center gap-2 group">
                                  <ShieldCheck size={20} className="group-hover:scale-110 transition-transform"/> 관리자에게 승인 요청하기
                              </button>
                          </form>
                      </div>
                  )}

                  {authStatus === 'waiting' && (
                      <div className="w-full flex flex-col items-center py-12 animate-in fade-in zoom-in duration-300">
                          <Loader2 size={64} className="text-blue-500 animate-spin mb-6" />
                          <h2 className="text-xl font-black text-slate-800 mb-3 tracking-tight">승인 요청 전송 완료</h2>
                          <p className="text-sm font-bold text-slate-600 text-center leading-relaxed">
                              현재 관리자가 접속 정보를 검토 중입니다.<br/>잠시만 기다려주세요.
                          </p>
                          <div className="mt-8 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-xs font-black animate-pulse border border-blue-200">
                              통상 1~2분 정도 소요됩니다...
                          </div>
                      </div>
                  )}

                  {authStatus === 'approved' && (
                      <div className="w-full flex flex-col items-center py-12 animate-in fade-in zoom-in duration-300">
                          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                              <CheckCircle size={40} className="text-emerald-500" />
                          </div>
                          <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">관리자 승인 완료!</h2>
                          <p className="text-sm font-bold text-slate-500 text-center">
                              인증이 정상적으로 처리되었습니다.<br/>잠시 후 조색 Pro 시스템으로 이동합니다.
                          </p>
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
            {/* 승인 사용자 관리 버튼 */}
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

      {/* 🚨 승인된 작업자 목록 및 상세 모달 (클릭 시 팝업 뷰 전환) */}
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
            <div className="w-full h-full max-w-5xl flex flex-col items-center relative py-12" onClick={e => e.stopPropagation()}>
                
                {zoomedImage.id === 12 ? (
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
                                        <div className="w-8 h-1.5 bg-slate-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="bg-white border border-slate-300 rounded p-3 text-center shadow-inner flex-1">
                                    <span className="text-[11px] font-bold text-blue-600 mb-2 block">&lt;사용 함&gt;</span>
                                    <div className="h-12 bg-slate-200 w-full rounded relative overflow-hidden flex items-center justify-center">
                                        <div className="w-6 h-6 bg-blue-300/60 rounded-full absolute left-4 top-1 blur-[1px]"></div>
                                        <div className="w-7 h-7 bg-blue-300/60 rounded-full absolute right-6 bottom-1 blur-[1px]"></div>
                                        <div className="w-8 h-1.5 bg-slate-600 rounded-full rotate-45 absolute top-2 left-6"></div>
                                        <div className="w-8 h-1.5 bg-slate-600 rounded-full -rotate-12 absolute bottom-3 left-14"></div>
                                        <div className="w-8 h-1.5 bg-slate-600 rounded-full rotate-90 absolute top-4 right-10"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center"><Target className="text-red-600 mr-2" size={20}/> WT386 vs WT352 vs WT322 특성 비교</h3>
                        <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-sm">
                            <table className="w-full text-sm sm:text-base text-center border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="bg-slate-800 text-white">
                                        <th className="p-3 font-black w-24 border-r border-slate-700">조색제</th>
                                        <th className="p-3 font-black w-16 border-r border-slate-700">구분</th>
                                        <th className="p-3 font-black text-blue-300 border-r border-slate-700">15도 (정면)</th>
                                        <th className="p-3 font-black text-yellow-300">45도 & 110도 (측면)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-white border-b border-slate-200">
                                        <td className="border-r border-slate-200 font-black text-slate-900 bg-slate-50" rowSpan={2}>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xl">WT386</span>
                                            </div>
                                        </td>
                                        <td className="border-r border-slate-200 font-bold text-slate-600 p-3">명암</td>
                                        <td className="border-r border-slate-200 font-black text-white bg-slate-700/80 p-3">어두워짐</td>
                                        <td className="font-black text-slate-800 bg-yellow-50 p-3">밝아짐</td>
                                    </tr>
                                    <tr className="bg-white border-b-4 border-slate-300">
                                        <td className="border-r border-slate-200 font-bold text-slate-600 p-3">색상</td>
                                        <td className="border-r border-slate-200 font-bold text-blue-600 p-3">약하게 청색이 짙어짐</td>
                                        <td className="font-bold text-yellow-600 p-3">약하게 황색이 짙어짐</td>
                                    </tr>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <td className="border-r border-slate-200 font-black text-slate-900 bg-slate-100" rowSpan={2}>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xl">WT352</span>
                                            </div>
                                        </td>
                                        <td className="border-r border-slate-200 font-bold text-slate-600 p-3">명암</td>
                                        <td className="border-r border-slate-200 font-black text-white bg-slate-700/80 p-3">어두워짐</td>
                                        <td className="font-black text-slate-800 bg-yellow-50 p-3">밝아짐</td>
                                    </tr>
                                    <tr className="bg-slate-50 border-b-4 border-slate-300">
                                        <td className="border-r border-slate-200 font-bold text-slate-600 p-3">색상</td>
                                        <td className="border-r border-slate-200 font-black text-blue-700 p-3">강하게 청색이 짙어짐</td>
                                        <td className="font-bold text-red-500 p-3">약하게 적색이 짙어짐</td>
                                    </tr>
                                    <tr className="bg-white border-b border-slate-200">
                                        <td className="border-r border-slate-200 font-black text-slate-900 bg-slate-50" rowSpan={2}>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xl">WT322</span>
                                            </div>
                                        </td>
                                        <td className="border-r border-slate-200 font-bold text-slate-600 p-3">명암</td>
                                        <td className="border-r border-slate-200 font-black text-white bg-slate-700/80 p-3">어두워짐</td>
                                        <td className="font-black text-slate-800 bg-yellow-50 p-3">밝아짐</td>
                                    </tr>
                                    <tr className="bg-white">
                                        <td className="border-r border-slate-200 font-bold text-slate-600 p-3">색상</td>
                                        <td className="border-r border-slate-200 font-black text-yellow-600 p-3">강하게 황색이 짙어짐</td>
                                        <td className="font-black text-red-600 p-3">강하게 적색이 짙어짐</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full flex flex-col justify-center relative">
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 w-full mb-3 text-center shadow-2xl shrink-0 z-10">
                            <h3 className="text-slate-900 font-black text-xl mb-1">{zoomedImage.title}</h3>
                            <p className="text-blue-700 text-xs font-bold">{zoomedImage.desc}</p>
                        </div>
                        {zoomedImage.url ? (
                            <div className="relative w-full h-[65vh] flex flex-col bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                                <div 
                                    ref={scrollContainerRef}
                                    className={`w-full h-full overflow-auto custom-scrollbar touch-pan-x touch-pan-y relative ${isDragging ? 'cursor-grabbing' : (imgScale > 1 ? 'cursor-grab' : '')}`}
                                    style={{
                                        display: imgScale === 1 ? 'flex' : 'block',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseDown={handleMouseDown}
                                    onMouseMove={handleMouseMove}
                                    onMouseUp={handleMouseUp}
                                    onMouseLeave={handleMouseUp}
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                >
                                    <img 
                                        draggable={false}
                                        src={zoomedImage.url} 
                                        alt={zoomedImage.title} 
                                        style={{ 
                                            display: 'block',
                                            margin: imgScale === 1 ? '0' : 'auto', 
                                            width: imgScale === 1 ? 'auto' : `${imgScale * 100}%`, 
                                            height: imgScale === 1 ? '100%' : 'auto',
                                            maxWidth: imgScale === 1 ? '100%' : 'none',
                                            maxHeight: imgScale === 1 ? '100%' : 'none',
                                            objectFit: 'contain',
                                            transition: pinchDist > 0 ? 'none' : 'width 0.1s ease-out' 
                                        }}
                                    />
                                </div>
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-6 z-50 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-slate-600">
                                    <button onClick={(e) => { e.stopPropagation(); setImgScale(s => Math.max(1, s - 0.2)); }} className="text-white hover:text-blue-400 font-black text-2xl leading-none w-8 h-8 flex items-center justify-center">-</button>
                                    <div className="flex flex-col items-center">
                                        <span className="text-white text-sm font-black min-w-[45px] text-center tracking-wider">{Math.round(imgScale * 100)}%</span>
                                        <button onClick={(e) => { e.stopPropagation(); setImgScale(1); }} className="text-[10px] text-blue-400 font-bold hover:text-white mt-0.5">RESET</button>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); setImgScale(s => Math.min(5, s + 0.2)); }} className="text-white hover:text-blue-400 font-black text-2xl leading-none w-8 h-8 flex items-center justify-center">+</button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-[65vh] flex flex-col items-center justify-center bg-slate-800/80 rounded-3xl shadow-2xl border border-slate-700">
                                <Camera size={56} className="text-slate-500 mb-4" />
                                <p className="text-slate-300 font-black text-lg mb-1">상세 이미지가 준비 중입니다.</p>
                                <p className="text-slate-500 text-sm font-bold">추후 원본 데이터가 업데이트될 예정입니다.</p>
                            </div>
                        )}
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
                <button onClick={handleShareKakao} className="w-full bg-[#FEE500] text-slate-900 py-3 rounded-xl font-black shadow-sm hover:bg-[#E5C100] transition-colors flex items-center justify-center gap-2"><MessageSquare size={18}/> 카카오톡 바로 전송하기</button>
                <button onClick={handleShareSMS} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"><Send size={18}/> 문자(SMS) 앱 열기</button>
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
            <div className="p-4 flex justify-between items-center border-b border-slate-700/50 bg-slate-900 shrink-0">
              <h3 className="text-white font-bold flex items-center gap-2"><History size={18} className="text-blue-400" /> 현재 페이지 데이터 수정 내역 보기</h3>
              <button onClick={() => setIsSnapshotModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"><X size={16} /></button>
            </div>
            
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0f172a]">
                <div className={`w-full md:w-1/3 border-b md:border-b-0 md:border-r border-slate-700/50 overflow-y-auto bg-slate-900/50 flex-col custom-scrollbar ${selectedSnapshot ? 'hidden md:flex' : 'flex'}`}>
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
                
                <div className={`flex-1 p-6 overflow-y-auto bg-[#0f172a] custom-scrollbar ${selectedSnapshot ? 'block' : 'hidden md:block'}`}>
                    {selectedSnapshot ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => setSelectedSnapshot(null)} className="md:hidden mb-4 bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-sm w-full flex items-center justify-center gap-2"><ChevronDown className="rotate-90"/> 목록으로 돌아가기</button>
                            
                            <h4 className="text-lg font-black text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-3"><Search size={20} className="text-yellow-400"/> 데이터 상세 보기 및 복원</h4>
                            <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-700/50 mb-4 flex justify-between items-center"><span className="text-sm text-slate-300 font-bold">최종 혼합 총량</span><span className="text-xl font-black text-yellow-400">{selectedSnapshot.totalFinal}g</span></div>
                            <div className="mb-4">
                                <h5 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase"><Layers size={14} className="text-blue-400"/> 베이스 코트 내역</h5>
                                <div className="space-y-2">
                                    {selectedSnapshot.base?.filter((t: any) => t.code).map((t: any, i: number) => (
                                        <div key={i} className="flex justify-between items-center bg-[#1e293b] p-3 rounded-lg border border-slate-700/50">
                                            <div className="flex items-center gap-3"><span className="text-white font-bold text-sm">WT {t.code.replace('WT ', '')}</span><span className="text-xs text-slate-500 truncate max-w-[120px]">{TONER_DB[t.code]?.role || ''}</span></div>
                                            <span className="text-blue-400 font-bold">{formatWeight(t.adjustedWeight)}g</span>
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
                                                <span className="text-purple-400 font-bold">{formatWeight(t.adjustedWeight)}g</span>
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

      {/* 🚨 [NEW] 4분할 완벽 핏 적용 먼셀 믹싱 스튜디오 */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/98 z-[800] flex flex-col text-white font-sans select-none animate-in fade-in overflow-y-auto custom-scrollbar">
          <header className="p-4 flex justify-between items-center bg-slate-900/80 border-b border-slate-800 shrink-0 sticky top-0 z-40 backdrop-blur-md shadow-md">
            <h2 className="text-base font-black tracking-widest text-slate-300 uppercase flex items-center"><Beaker className="mr-2 text-indigo-500"/> 먼셀 컬러 믹싱 스튜디오 (Munsell Mixing Lab)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-full border border-slate-700 transition-colors"><X size={18}/></button>
          </header>
          <main className="flex-1 p-4 md:p-8 flex flex-col items-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 overflow-x-hidden">
             
             {/* 2x2 완벽 분할 그리드 */}
             <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
                 
                 {/* 1. 좌측 상단: 먼셀 20 색상환 */}
                 <div className="w-full flex flex-col items-center justify-center h-[460px] bg-slate-900/40 rounded-3xl border border-slate-800 shadow-xl p-6">
                     <h3 className="text-lg font-black text-white mb-6 flex items-center bg-slate-800 px-6 py-2 rounded-full border border-slate-600 shadow-lg shrink-0"><Sun className="mr-2 text-yellow-400" size={20}/> 먼셀 20 색상환 (Munsell Wheel)</h3>
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
                            {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] && ( <line x1={polarToCartesian(200, 200, 80, selectedWheelIndex * 18 + 8.5).x} y1={polarToCartesian(200, 200, 80, ((selectedWheelIndex + 10) % 20) * 18 + 8.5).x} y2={polarToCartesian(200, 200, 80, ((selectedWheelIndex + 10) % 20) * 18 + 8.5).y} stroke="#ef4444" strokeWidth="3.5" markerEnd="url(#arrowhead)" className="drop-shadow-[0_0_12px_rgba(239,68,68,1)] pointer-events-none" /> )}
                        </svg>
                     </div>
                 </div>

                 {/* 2. 우측 상단: RGB 빛의 혼합 */}
                 <div className="w-full flex flex-col items-center justify-center h-[460px] bg-slate-900/40 rounded-3xl border border-slate-800 shadow-xl p-6">
                    <div className="bg-[#111111] rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col items-center w-full max-w-[380px] h-[380px] justify-center transition-all">
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

                 {/* 3. 좌측 하단: 조색 배합 데이터 */}
                 <div className="w-full flex flex-col items-center justify-center h-[460px] bg-slate-900/40 rounded-3xl border border-slate-800 shadow-xl p-6">
                    {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] ? (
                        <div className="bg-slate-800 p-6 rounded-3xl border border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.3)] w-full max-w-[380px] h-[380px] flex flex-col justify-center text-center">
                            <h4 className="text-lg font-black text-white mb-6 flex items-center justify-center gap-3 shrink-0"><span className="w-5 h-5 rounded-full shadow-md border border-slate-400" style={{backgroundColor: MUNSELL_WHEEL_COLORS[selectedWheelIndex].hex}}></span>{MUNSELL_WHEEL_COLORS[selectedWheelIndex].name} ({MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol}) 배합</h4>
                            <div className="flex justify-center items-center gap-4 bg-slate-900 py-6 px-4 rounded-xl border border-slate-700 w-full shrink-0 min-h-[140px]">
                                {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol] ? (
                                    <div className="flex flex-row justify-center items-center gap-4 w-full">
                                        <div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h1}}></div><span className="text-slate-300 font-bold text-xs">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c1}</span><span className="text-white font-black text-2xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r1}%</span></div>
                                        {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2 && (
                                            <div className="flex flex-row justify-center items-center gap-4"><span className="text-slate-600 font-black text-xl">+</span><div className="flex flex-col items-center gap-2"><div className="w-12 h-12 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h2}}></div><span className="text-slate-300 font-bold text-xs">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2}</span><span className="text-white font-black text-2xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r2}%</span></div></div>
                                        )}
                                    </div>
                                ) : ( <div className="text-red-400 text-sm font-bold w-full text-center">배합 데이터를 불러올 수 없습니다.</div> )}
                            </div>
                            <p className="text-xs text-slate-400 mt-6 font-medium bg-slate-900/50 py-3 rounded-lg shrink-0">* 기술 보고서 기준의 단일 원색 정밀 조색 비율입니다.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 border-dashed w-full max-w-[380px] h-[380px] flex flex-col items-center justify-center gap-4 text-center text-slate-500"><Sun className="text-slate-600 mb-2" size={40} /><p className="text-base font-bold text-slate-400">색상환에서 컬러를 클릭하세요.</p><p className="text-sm">선택된 색상의 원색 조색 배율이<br/>이곳에 표시됩니다.</p></div>
                    )}
                 </div>

                 {/* 4. 우측 하단: CMYK 물감의 혼합 */}
                 <div className="w-full flex flex-col items-center justify-center h-[460px] bg-slate-900/40 rounded-3xl border border-slate-800 shadow-xl p-6">
                    <div className="bg-[#f8f9fa] rounded-3xl p-6 border border-slate-300 shadow-2xl flex flex-col items-center w-full max-w-[380px] h-[380px] justify-center transition-all">
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
             
             <div className="pb-12 w-full flex justify-center shrink-0">
                <button onClick={() => setIsConfiguratorOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-4 px-16 rounded-full transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 text-lg"><X size={24} /> 믹싱 스튜디오 닫기</button>
             </div>
          </main>
        </div>
      )}
    </div>
  );
}                          
