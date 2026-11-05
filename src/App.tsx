// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, X, Maximize, Beaker, Sun, Target, Edit3, CheckCircle, 
  MessageSquare, Send, Save, RefreshCw, Camera, AlertTriangle, Image as ImageIcon, Cloud, 
  Layers, ChevronDown, ChevronUp, BookOpen, Share2, Zap, Search, 
  FileSpreadsheet, History, Mail, Code, Calendar, Eye, ThumbsUp,
  QrCode, Smartphone, Monitor, Link, Check, Users, Lock, ShieldCheck, Briefcase, MapPin, UserCheck, Hash, 
  ChevronLeft, ChevronRight, Loader2, Copy, Calculator 
} from 'lucide-react';
import { TONER_DB, shortcuts, PEARL_LEVELS, OEM_COLORS } from './tonerDB';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import ClearMixer from './components/ClearMixer';
import ClearGuide from './components/ClearGuide';

// Firebase 설정 및 초기화
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

if (!TONER_DB['WT 340']) TONER_DB['WT 340'] = { role: '옐로우 마젠타 레드', type: 'solid', face: '#E53935', flop: '#B71C1C', desc: '맑은 자주색 조색제. 338에 비해 밝고 청색이 적음. 주로 이펙트 컬러에 사용함. 알루미늄 입자에 혼합할 경우 맑은 분홍색을 냄', details: [['일반 특성', '맑은 자주색 조색제로 338에 비해 밝고 청색이 적습니다.'], ['혼합 특성', '주로 이펙트 컬러에 사용하며, 알루미늄 입자에 혼합할 경우 맑은 분홍색을 냅니다.'], ['외관 변화', '정면과 측면 모두 맑고 화사한 적자색(Pinkish Red)을 띱니다.'], ['타겟 컬러', '고채도 레드, 핑크 계열 이펙트 컬러 및 솔리드 레드'], ['배합 비율', '조색 데이터에 따라 베이스 및 펄 컬러에 다양하게 적용'], ['조색 한계점', '은폐력이 매우 낮아 단독 사용 시 바닥이 비칠 수 있습니다.'], ['비교 분석', 'WT 338(블루이쉬 마젠타)보다 청색조가 덜하고 따뜻한 핑크/레드빛을 강하게 띱니다.']] };
if (!TONER_DB['9031']) TONER_DB['9031'] = { role: '애플 레드 (Apple Red)', type: 'candy', face: '#8b0000', flop: '#ff0000', desc: '은폐력 제로의 투명하고 깊은 정통 캔디 레드. 맑은 사과빛 심도를 냅니다.', details: [['🎯 캔디 도장 공정', '고휘도 실버(WT 361/303) 또는 거친 다이아몬드 하도를 완벽하게 건조한 뒤, 2액형 클리어와 정밀 혼합하여 겹침 없이 일정한 두께로 코팅해야 얼룩을 막을 수 있습니다.'], ['💡 비교 분석', '[비교] 캔디 9031 vs 일반 투명 틴트 WT 311\nWT 311(루비레드)은 단독 보카시(블렌딩)가 가능하지만, 9031 캔디는 블렌딩이 절대 불가(전체 도장 필수)하며 일반 틴트가 흉내 낼 수 없는 극강의 3D 입체 투명 심도(유리알 텍스처)를 냅니다.']] };
if (!TONER_DB['9032']) TONER_DB['9032'] = { role: '오션 블루 (Ocean Blue)', type: 'candy', face: '#004488', flop: '#0088ff', desc: '심연의 바다처럼 깊고 투명한 시안 커스텀 캔디 블루입니다.', details: [['🎯 캔디 도장 공정', '스프레이 건의 에어 압력을 높이고 토출량을 줄여 아주 곱고 균일하게 미스트를 쪼개어 도포해야 투명감을 살릴 수 있습니다.'], ['💡 비교 분석', '[비교] 캔디 9032 vs 일반 투명 틴트 WT 348\n일반 투명 틴트(348)도 맑은 편이나 한계가 있는 반면, 9032 캔디는 두껍게 올릴수록 심해가 깊어지듯 끝을 알 수 없는 딥 블루 3D 심도를 연출합니다.']] };
if (!TONER_DB['9033']) TONER_DB['9033'] = { role: '선셋 골드 (Sunset Gold)', type: 'candy', face: '#886600', flop: '#ffcc00', desc: '노을빛 화려한 황금 스파클 캔디 필터를 제공합니다.', details: [['⚠️ 캔디 3대 철칙', '부분 도장(보카시/블렌딩)은 물리적으로 절대 불가하며, 반드시 패널 전체를 한 판 단위로 끊어서 도장해야 합니다.'], ['💡 비교 분석', '[비교] 캔디 9033 vs 일반 투명 틴트 WT 329\nWT 329는 얇은 황금빛 셀로판지라면, 9033 선셋 골드는 두꺼운 황금색 스테인드글라스처럼 압도적인 빛의 투과율과 공간감을 자랑합니다.']] };
if (!TONER_DB['9048']) TONER_DB['9048'] = { role: '마룬 / 흑갈색 투명 첨가제', type: 'candy', face: '#5a1827', flop: '#8b253f', desc: '엑솔타(Axalta) 스피스헥커 프리미엄 첨가제. 은폐력 제로의 투명하고 깊은 마룬(Maroon) 빛 심도를 냅니다.', details: [['🎯 캔디 도장 공정', '마쯔다(Mazda) 소울 레드 크리스탈(46V) 등 고휘도 실버 하도를 건조한 뒤, 2액형 클리어와 정밀 혼합하여 겹침(Overlap) 없이 코팅해야 얼룩을 막을 수 있습니다.'], ['💡 비교 분석', '[비교] 캔디 9048 vs 일반 마룬 틴트\n일반 마룬 베이스는 메탈릭 입자를 탁하게 가리지만, 9048 캔디 첨가제는 100% 투명도를 유지하며 맑고 깊은 적갈색 필터 효과를 부여합니다.']] };

// PP 안료 5대 철칙 업데이트 및 1:9 비율 액상화 경고 필수 추가
if (!TONER_DB['PP 301']) TONER_DB['PP 301'] = { role: '고해상도 실버 스파클', type: 'powder', face: '#eeeeee', flop: '#bbbbbb', desc: '순도 높은 은빛 글라스 스파클 펄입니다.', details: [['🎨 광학적 특성', '입자가 고운 실버 스파클로 깨끗한 반사광을 발현합니다.'], ['🎯 타겟 컬러', '밝은 실버 계열 수입차 및 커스텀 컬러'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 완벽히 개어서 덩어리가 풀린 상태로 메인 조색에 투입하십시오.'], ['💡 비교 분석', 'PP304보다는 덜 화려하지만 입자가 균일하고 안정적입니다.']] };
if (!TONER_DB['PP 302']) TONER_DB['PP 302'] = { role: '중후한 실버 스파클', type: 'powder', face: '#d0d0d0', flop: '#a0a0a0', desc: '무게감 있는 은빛 글라스 스파클 펄입니다.', details: [['🎨 광학적 특성', '빛을 부드럽게 튕겨내는 중명도의 실버 스파클.'], ['🎯 타겟 컬러', '미디엄 실버 및 건메탈 계열 스파클 추가'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 완벽히 개어서 덩어리가 풀린 상태로 메인 조색에 투입하십시오.'], ['💡 비교 분석', 'PP301보다 어두운 톤의 은빛을 냅니다.']] };
if (!TONER_DB['PP 304']) TONER_DB['PP 304'] = { role: '분말 다이아몬드 글라스', type: 'powder', face: '#ffffff', flop: '#dddddd', desc: '수지가 완전히 배제된 100% 건식 분말 글라스 스파클입니다. 눈부신 다이아몬드 순수 난반사를 발현합니다.', details: [['🎨 광학적 특성', '도막 위에서 유리 조각이 햇빛을 튕겨내듯 눈부신 다이아몬드 순수 난반사를 극대화합니다.'], ['🎯 타겟 컬러', '초고휘도 커스텀 화이트 펄 및 특수 쇼카(Show Car) 전용 이펙트.'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '반드시 WT 386(에이전트) 또는 지정된 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다.'], ['💡 비교 분석', '[비교] PP 304 vs WT 377\n377은 액상 수지가 이미 포함되어 안정적인 다이아몬드 펄이나, PP 304는 수지가 0%인 순수 가루로 컨트롤은 까다롭지만 반사율이 훨씬 극단적이고 화려합니다.']] };
if (!TONER_DB['PP 305']) TONER_DB['PP 305'] = { role: '분말 컬러스트림(마이바흐)', type: 'powder', face: '#e6e6fa', flop: '#ffb6c1', desc: '포르쉐/마이바흐 전용 초고해상도 카멜레온 가루 펄입니다. 탁색률 0%의 예리한 광채를 뿜어냅니다.', details: [['🎨 광학적 특성', '탁색률 0%의 예리한 광채를 뿜어내며 바탕색을 1%도 덮지 않고 완벽하게 투과합니다.'], ['🎯 타겟 컬러', '포르쉐, 마이바흐 등 초호화 럭셔리 라인의 다변색 카멜레온 특수 컬러.'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지! (주의: 입자가 예민하여 기계식 교반기 절대 사용 금지)'], ['⚗️ 배합 방법', '전용 수지(WT310 등)와 1:9로 섞은 뒤 손으로 살살 저어서 부드럽게 액상화하십시오.'], ['💡 비교 분석', '일반 카멜레온 안료와 달리 입자 크기가 극도로 작아 표면 질감이 매우 고급스럽습니다.']] };
if (!TONER_DB['PP 306']) TONER_DB['PP 306'] = { role: '크리스탈 화이트 스파클', type: 'powder', face: '#ffffff', flop: '#f0f0f0', desc: '순수한 화이트 톤의 다이아몬드 스파클 펄입니다.', details: [['🎨 광학적 특성', '옐로우 톤이 없는 순백색의 깨끗한 반짝임을 제공합니다.'], ['🎯 타겟 컬러', '최고급 화이트 펄 3코트 차량'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 1:9로 완벽히 개어서 덩어리가 풀린 상태로 메인 조색에 투입하십시오.'], ['💡 비교 분석', 'PP304 대비 더 희고 깨끗한(쿨톤) 화이트 스파클을 연출합니다.']] };
if (!TONER_DB['PP 201']) TONER_DB['PP 201'] = { role: '간섭 화이트 펄', type: 'powder', face: '#ffffff', flop: '#ffffff', desc: '파스텔 톤의 간섭 펄 (카멜레온 효과)', details: [['🎨 광학적 특성', '각도에 따라 은은하게 화이트/파스텔 빛이 감도는 간섭 효과.'], ['🎯 타겟 컬러', '부드러운 카멜레온 톤이 필요한 커스텀 컬러'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 완벽히 개어서 투입할 것.'], ['💡 비교 분석', '일반 마이카보다 훨씬 부드럽고 오묘한 색 변화.']] };
if (!TONER_DB['PP 202']) TONER_DB['PP 202'] = { role: '간섭 옐로우 펄', type: 'powder', face: '#ffffcc', flop: '#ffcc99', desc: '파스텔 톤의 간섭 펄 (카멜레온 효과)', details: [['🎨 광학적 특성', '측면에서 노란/황금빛이 은은하게 감도는 간섭 효과.'], ['🎯 타겟 컬러', '화이트 베이스에 황금빛 반사가 필요한 컬러'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 완벽히 개어서 투입할 것.'], ['💡 비교 분석', '일반 골드 펄과 달리 베이스를 가리지 않는 투명도.']] };
if (!TONER_DB['PP 203']) TONER_DB['PP 203'] = { role: '간섭 레드 펄', type: 'powder', face: '#ffcccc', flop: '#ff9999', desc: '파스텔 톤의 간섭 펄 (카멜레온 효과)', details: [['🎨 광학적 특성', '측면에서 부드러운 핑크/레드빛이 감도는 간섭 효과.'], ['🎯 타겟 컬러', '오묘한 붉은빛 반사가 필요한 3코트 펄 컬러'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 완벽히 개어서 투입할 것.'], ['💡 비교 분석', '솔리드 레드가 아닌 빛의 반사로 붉은색 구현.']] };
if (!TONER_DB['PP 204']) TONER_DB['PP 204'] = { role: '간섭 블루 펄', type: 'powder', face: '#cce5ff', flop: '#99ccff', desc: '파스텔 톤의 간섭 펄 (카멜레온 효과)', details: [['🎨 광학적 특성', '측면에서 청명하고 맑은 푸른빛이 감도는 간섭 효과.'], ['🎯 타겟 컬러', '청명한 아이스 블루 반사가 필요한 화이트/블루 계열 차량'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 완벽히 개어서 투입할 것.'], ['💡 비교 분석', '블루 마이카 펄 대비 훨씬 투명하고 입체적임.']] };
if (!TONER_DB['PP 401']) TONER_DB['PP 401'] = { role: '고급 컬러스트림 (퍼플-블루)', type: 'powder', face: '#d8b4e2', flop: '#87ceeb', desc: '컬러스트림: 다중 색상 변환 고급 펄', details: [['🎨 광학적 특성', '퍼플에서 블루로 이어지는 선명한 다중 색상 변환.'], ['🎯 타겟 컬러', '고급 외제차의 특수 카멜레온 컬러'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 1:9로 완벽히 믹스 후 사용.'], ['💡 비교 분석', '기존 매직 펄 시리즈를 상회하는 예리하고 맑은 색 변환.']] };
if (!TONER_DB['PP 402']) TONER_DB['PP 402'] = { role: '고급 컬러스트림 (골드-그린)', type: 'powder', face: '#ffd700', flop: '#98fb98', desc: '컬러스트림: 다중 색상 변환 고급 펄', details: [['🎨 광학적 특성', '골드에서 그린으로 이어지는 선명한 다중 색상 변환.'], ['🎯 타겟 컬러', '프리미엄 세단의 특수 카멜레온 도장'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 1:9로 완벽히 믹스 후 사용.'], ['💡 비교 분석', '일반 옐로우-그린 간섭펄보다 대비가 극명함.']] };
if (!TONER_DB['PP 501']) TONER_DB['PP 501'] = { role: '레디쉬 골드 펄', type: 'powder', face: '#ffcc99', flop: '#ff9933', desc: '따뜻한 적금색 톤의 펄', details: [['🎨 광학적 특성', '따뜻한 붉은빛이 도는 풍부한 골드 스파클.'], ['🎯 타겟 컬러', '레드/골드 투톤 이펙트 및 스페셜 컬러'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 1:9로 완벽히 믹스 후 사용.'], ['💡 비교 분석', '순수 골드 펄보다 온화하고 깊은 톤.']] };
if (!TONER_DB['PP 502']) TONER_DB['PP 502'] = { role: '그리니쉬 골드 펄', type: 'powder', face: '#ccff99', flop: '#99cc00', desc: '차가운 녹황색 톤의 펄', details: [['🎨 광학적 특성', '차가운 녹색 빛이 살짝 감도는 옐로우 골드 반사광.'], ['🎯 타겟 컬러', '그린/옐로우 투톤 및 쿨톤 골드 이펙트 차량'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 1:9로 완벽히 믹스 후 사용.'], ['💡 비교 분석', '순수 골드 펄 대비 이지적이고 차가운 느낌을 줌.']] };
if (!TONER_DB['PP 701']) TONER_DB['PP 701'] = { role: '특수 브릴리언트 블루', type: 'powder', face: '#3399ff', flop: '#0066cc', desc: '광휘가 극대화된 블루 펄', details: [['🎨 광학적 특성', '일반 펄보다 채도와 반사율이 극도로 높은 블루 광채.'], ['🎯 타겟 컬러', '고채도 스포츠카 및 시안 블루 스페셜 차량'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 1:9로 완벽히 믹스 후 사용.'], ['💡 비교 분석', '액상 브릴리언트 블루(WT318)보다 펄감(반짝임)이 크고 화려함.']] };
if (!TONER_DB['PP 901']) TONER_DB['PP 901'] = { role: '미세 실버 펄', type: 'powder', face: '#e0e0e0', flop: '#b0b0b0', desc: '초미세 입자의 부드러운 실버 펄', details: [['🎨 광학적 특성', '거친 스파클 없이 비단처럼 곱고 은은하게 흐르는 실버 광택.'], ['🎯 타겟 컬러', '미세한 펄감이 요구되는 고급 실크 느낌 도장'], ['⚠️ 조색 주의', '액상 수지가 없는 100% 가루 형태입니다. 반드시 (각 브랜드 전용 수지) WT 310 또는 블렌드 수지에 선 계량한 후, 스틱으로 완벽하게 액상화(개어주기) 시켜서 본 도료에 투입해야 합니다. 계량 배합비 PP 1 : 수지 9 (1:9) 배합비 유지!'], ['⚗️ 배합 방법', '수지에 1:9로 완벽히 믹스 후 사용.'], ['💡 비교 분석', 'PP301, 304와 달리 반짝임(스파클)보다 면이 꽉 찬(솔리드한) 부드러움을 제공함.']] };

const LAST_PATCH_DATE = "2026.11.04 (V2.8 채팅 및 파일 다이어트 패치)";

const PATCH_HISTORY = [
  { version: "V2.8", date: "2026.11.04", title: "실시간 톡방 추가 및 앱 최적화", details: "중복된 클리어 렌더링 코드 제거 및 현장 톡방 UI 완벽 구현" },
  { version: "V2.7", date: "2026.11.04", title: "세션 리셋 타이머 & 패치 히스토리 시스템 도입", details: "12시간 세션 자동 리셋, 상단 실시간 카운트다운 알림 배지 및 패치 내역 조회 기능 탑재" },
  { version: "V2.6", date: "2026.10.28", title: "실시간 접속 작업자 현황 & 마스터 관리 기능 구축", details: "파이어베이스 연동 전국 작업자 실시간 접속 명단 공유 및 관리자 전용 일괄 리셋 구현" },
  { version: "V2.5", date: "2026.10.23", title: "4대 브랜드 투명(Clear) 가이드 & 캔디 최적화 패치", details: "글라슈리트·스피스헥커·시켄스·피피지 4사 클리어코트 TDS 통합 자료실 및 캔디 배합 고도화" },
  { version: "V2.2", date: "2026.10.18", title: "PP(분말) 안료 가이드 & 3Coat 펄 수지 계산 정밀화", details: "WT·PP·OEM 컬러 통합 검색 DB 구축 및 베이스(20%)·펄(30%) 필수 수지량 자동 합산 적용" }
];

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

const FlagIcon = ({ country, className = "" }: { country: string, className?: string }) => {
    if (country === 'DE') return <span className={`inline-block ${className}`} title="독일">🇩🇪</span>;
    if (country === 'US') return <span className={`inline-block ${className}`} title="미국">🇺🇸</span>;
    if (country === 'NL') return <span className={`inline-block ${className}`} title="네덜란드">🇳🇱</span>;
    return null;
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
  id: number; brand: string; code: string; date: string; likes: number; views: number; author: string; spec: string;
  baseFormula: any[]; pearlFormula: any[]; isThreeCoat: boolean; images: string[]; deletedImages?: { url: string; deletedAt: number }[]; 
  isCandyCoat?: boolean; candyCode?: string; candyAdditive?: string; candyClear?: string; candyHardener?: string; candyThinner?: string;
}
export default function App() {
  const [authForm, setAuthForm] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('hitec_saved_auth_profile');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return { company: '', location: '', name: '', age: '', role: '사원' };
  });

  const [isAuthorized, setIsAuthorized] = useState(() => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('hitec_auth_data');
      const savedProfile = localStorage.getItem('hitec_saved_auth_profile');
      if (authData && savedProfile) {
        try {
          const parsed = JSON.parse(authData);
          const profile = JSON.parse(savedProfile);
          const ONE_DAY = 24 * 60 * 60 * 1000;
          if (Date.now() - parsed.timestamp < ONE_DAY && profile.name?.trim()) {
            return true;
          }
        } catch (e) {}
      }
    }
    return false;
  });

  const isAuthFormValid = authForm.company.trim() !== '' && authForm.location.trim() !== '' && authForm.name.trim() !== '' && String(authForm.age).trim() !== '';
  
  const [isApproving, setIsApproving] = useState(false);
  const [approvalMessage, setApprovalMessage] = useState("");
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

  const [authorizedUsers, setAuthorizedUsers] = useState<any[]>([]);
  const [isUsersModalOpen, setIsUsersModalOpen] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState<any>(null);

  // 💬 실시간 톡방 관련 상태
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // 📋 게시판 관련 상태
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");

  // ⚡ [실시간 감시] 서버의 작업자 명단이 비워졌는지(리셋되었는지) 실시간 감지하여 강제 초기화
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "active_users"), (snapshot) => {
      const liveUsers = snapshot.docs.map((docItem) => {
        const d = docItem.data();
        return {
          id: docItem.id,
          brand: d.brand || d.company || '미입력',
          branch: d.branch || d.location || '미입력',
          name: d.name || '이름없음',
          age: d.age || '미입력',
          role: d.role || '사원',
          date: d.date || (d.connectedAt ? new Date(d.connectedAt).toLocaleString('ko-KR') : '기록없음'),
          device: d.device || 'PC',
          connectedAt: String(d.connectedAt || '')
        };
      });

      if (liveUsers.length === 0 && isAuthorized) {
        alert("🚨 [시스템 안내] 관리자에 의해 전체 작업자 명단이 리셋되었습니다!\n다시 접속하여 정보를 입력해 주세요.");
        setIsAuthorized(false);
        localStorage.removeItem('hitec_auth_data');
        localStorage.removeItem('hitec_device_id');
      }

      liveUsers.sort((a, b) => String(b.connectedAt).localeCompare(String(a.connectedAt)));
      setAuthorizedUsers(liveUsers);
    });
    return () => unsubscribe();
  }, [isAuthorized]);

  // 💬 실시간 채팅 메시지 동기화 및 안 읽은 뱃지 계산
  useEffect(() => {
    const q = query(collection(db, "chat_messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(docItem => {
        const data = docItem.data();
        return { id: docItem.id, ...data };
      });
      setChatMessages(msgs);
      
      if (!isChatOpen && msgs.length > chatMessages.length) {
        setUnreadChatCount(prev => prev + (msgs.length - chatMessages.length));
      }
    });
    return () => unsubscribe();
  }, [isChatOpen, chatMessages.length]);

  // 📋 현장 공유 게시판 실시간 동기화
  useEffect(() => {
    const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCommunityPosts(posts);
    });
    return () => unsubscribe();
  }, []);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput || !chatInput.trim()) return;

    try {
      const senderName = (typeof authForm !== 'undefined' && authForm?.name) ? authForm.name : '현장 작업자';
      const senderRole = (typeof authForm !== 'undefined' && authForm?.role) ? authForm.role : '작업자';
      const senderLocation = (typeof authForm !== 'undefined' && authForm?.location) ? authForm.location : '지점';

      await addDoc(collection(db, "chat_messages"), {
        sender: `${senderLocation} ${senderName}`,
        role: senderRole,
        text: chatInput.trim(),
        createdAt: Date.now()
      });
      setChatInput("");
    } catch (err) {
      console.error("톡 전송 에러:", err);
    }
  };

  const handleFakeApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthFormValid) return; 
    setIsApproving(true);
    setApprovalMessage("마스터(윤성만) 기기로 승인 요청 알림 전송 완료...");
    
    const deviceType = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'PC';
    const nowKor = new Date().toLocaleString('ko-KR');

    try {
      localStorage.setItem('hitec_saved_auth_profile', JSON.stringify(authForm));
      await addDoc(collection(db, "active_users"), {
        company: authForm.company.trim(),
        location: authForm.location.trim(),
        brand: authForm.company.trim(),
        branch: authForm.location.trim(),
        name: authForm.name.trim(),
        age: String(authForm.age).trim() || '미입력',
        role: authForm.role,
        date: nowKor,
        device: deviceType,
        connectedAt: new Date().toISOString()
      });
    } catch (err) {
      console.error("전송 오류:", err);
    }
    await new Promise(r => setTimeout(r, 1000));
    setApprovalMessage("관리자가 입력된 소속 및 직책 정보를 확인하고 있습니다...");
    await new Promise(r => setTimeout(r, 2000));
    setApprovalMessage("보안 접근 권한 부여 및 시스템 개방 중...");
    await new Promise(r => setTimeout(r, 800));
    setIsApproving(false);
    setShowApprovalSuccess(true); 
  };

  const handleApprovalConfirm = () => {
    localStorage.setItem('hitec_saved_auth_profile', JSON.stringify(authForm));
    setShowApprovalSuccess(false);
    setIsAuthorized(true);
    localStorage.setItem('hitec_auth_data', JSON.stringify({ passed: true, timestamp: Date.now() }));
  };
  const [isLoaded, setIsLoaded] = useState(false);
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false);
  const [isCandyCoatMode, setIsCandyCoatMode] = useState(false);
  const [isClearCoatMode, setIsClearCoatMode] = useState(false); // 컴포넌트 렌더링 토글용만 남김
  
  const [candyClear, setCandyClear] = useState("100.0");
  const [candyHardener, setCandyHardener] = useState("36.0");
  const [candyThinner, setCandyThinner] = useState("6.0");
  const [candyCode, setCandyCode] = useState("");
  const [candyAdditive, setCandyAdditive] = useState("2.0");
  const candyAdditiveRef = useRef<HTMLInputElement | null>(null);

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

  const [activeGuideTab, setActiveGuideTab] = useState<'theory'|'spectrum'|'effect'|'special'|'clear'>('spectrum');
  
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
            const savedClear = localStorage.getItem('hitec_clear'); const savedCandy = localStorage.getItem('hitec_candy');
            if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl)); if (savedCode) setTargetColorCode(savedCode); if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode)); if (savedVehicle) setVehicleNumber(savedVehicle); if (savedCarModel) setCarModel(savedCarModel); if (savedJob) setJobDescription(savedJob); if (savedNotes) setSpecialNotes(savedNotes); if (savedBoard) setBoardPosts(JSON.parse(savedBoard)); if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots));
            if (savedClear) {
                const c = JSON.parse(savedClear);
                setIsClearCoatMode(c.isClearCoatMode ?? false);
            }
            if (savedCandy) {
                const c = JSON.parse(savedCandy);
                setIsCandyCoatMode(c.isCandyCoatMode ?? false);
                setCandyCode(c.candyCode || "");
                setCandyAdditive(c.candyAdditive || "2.0");
                setCandyClear(c.candyClear || "100.0");
                setCandyHardener(c.candyHardener || "36.0");
                setCandyThinner(c.candyThinner || "6.0");
            }
        }
        setIsLoaded(true); 
    }
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search); if (urlParams.get('d')) return;
      if (isLoaded && typeof window !== 'undefined') {
          try {
              localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_board_mock', JSON.stringify(boardPosts)); localStorage.setItem('hitec_snapshots', JSON.stringify(snapshots));
              localStorage.setItem('hitec_clear', JSON.stringify({ isClearCoatMode }));
              localStorage.setItem('hitec_candy', JSON.stringify({ isCandyCoatMode, candyCode, candyAdditive, candyClear, candyHardener, candyThinner }));
          } catch (e: any) {
              if (e.name === 'QuotaExceededError' || e.message?.includes('Quota')) alert("⚠️ [경고] 기기의 저장 용량이 꽉 찼습니다!\n기존 데이터가 날아가는 것을 방지하기 위해 불필요한 데이터를 삭제해주세요.");
          }
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, boardPosts, snapshots, isClearCoatMode, isCandyCoatMode, candyCode, candyAdditive, candyClear, candyHardener, candyThinner, isLoaded]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); 
    const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(formatWeight(baseTotal)); setTotalPearlWeight(formatWeight(pearlTotal));
    
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
    let resultText = "[조색 배합 지시서]\n================================\n📅 등록날짜: " + registrationDate + "\n🚗 차량번호: " + (vehicleNumber || '미지정') + "\n🚙 브랜드: " + (carModel || '미지정') + "\n🎨 컬러코드: " + (targetColorCode || '미지정') + "\n🛠️ 작업내용: " + (jobDescription || '미지정') + "\n📌 특이사항: " + (specialNotes || '없음') + "\n================================\n\n[▼ 베이스 코트]\n" + (baseListText || '  (데이터 없음)') + "\n--------------------------------\n▶ 베이스 총 중량(수지포함): " + formatWeight(parseFloat(totalBaseWeight) * 1.2) + "g\n\n";
    if (isThreeCoatMode) {
        let pearlListText = pearlToners.filter(t => t.code).map(t => "  - " + t.code + " (" + (TONER_DB[t.code]?.role || '미지정') + "): " + formatWeight(t.adjustedWeight) + "g").join('\n'); 
        resultText += "[▼ 펄 코트]\n" + (pearlListText || '  (데이터 없음)') + "\n--------------------------------\n▶ 펄 코트 총 중량: " + formatWeight(parseFloat(totalPearlWeight) * 1.3) + "g\n\n";
    }
    if (isCandyCoatMode) { resultText += `[▼ 캔디 코트]\n  - ${candyCode || '첨가제'}: ${candyAdditive}g\n  - 클리어(7500): ${candyClear}g\n  - 경화제(7205): ${candyHardener}g\n  - 신너: ${candyThinner}g\n\n`; }
    resultText += "================================\n✨ 베이스+펄 최종 혼합량: " + totalFinalWeight + "g\n\n👉 링크:\n" + generateSyncUrl();
    return resultText;
  };

 const handleShareKakao = async () => {
    const text = generateShareText();
    if (navigator.clipboard) { try { await navigator.clipboard.writeText(text); } catch (e) {} }
    setIsShareModalOpen(false);
    window.location.href = `kakaotalk://send?text=${encodeURIComponent(text)}`;
  };

  const handleShareSMS = async () => {
    const text = generateShareText();
    if (navigator.clipboard) { try { await navigator.clipboard.writeText(text); } catch (e) {} }
    setIsShareModalOpen(false);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    window.location.href = isIOS ? `sms:&body=${encodeURIComponent(text)}` : `sms:?body=${encodeURIComponent(text)}`;
  };
  const handleCopyAllText = () => { navigator.clipboard.writeText(generateShareText()).then(() => { alert("✅ 전체 텍스트가 복사되었습니다!\n원하시는 곳에 붙여넣기 하세요."); setIsShareModalOpen(false); }); };
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
  const handleCopyExcelTemplate = () => { const headerRow = ['등록 날짜', '차량 번호', '브랜드/차종', '컬러코드', '작업내용', '특이사항', '배합보기'].join('\t'); if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(headerRow); alert("엑셀 헤더가 복사되었습니다."); } };
  
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
      const newPost: BoardPost = { id: Date.now() + Math.random(), brand: carModel || '미지정', code: targetColorCode, date: timeFormatted, likes: 0, views: 0, author: '내 데이터', spec: specialNotes || '특이사항 없음', baseFormula: [...toners], pearlFormula: [...pearlToners], isThreeCoat: isThreeCoatMode, images: [...attachedImages], deletedImages: [], isCandyCoat: isCandyCoatMode, candyCode, candyAdditive, candyClear, candyHardener, candyThinner };
      setBoardPosts([newPost, ...boardPosts]); setAttachedImages([]); alert("🎉 시편 사진들과 함께 게시판에 등록되었습니다!");
  };

  const deleteBoardPost = (id: number, e: React.MouseEvent) => { e.stopPropagation(); if (window.confirm("이 시편 데이터를 완전히 삭제하시겠습니까?")) setBoardPosts(prev => prev.filter(post => post.id !== id)); };
  
  const handleSaveSnapshot = () => { const newSnapshot = { id: Date.now(), timestamp: new Date().toLocaleTimeString('ko-KR', { hour12: false }), dateStr: new Date().toLocaleDateString('ko-KR'), base: JSON.parse(JSON.stringify(toners)), pearl: JSON.parse(JSON.stringify(pearlToners)), isThreeCoat: isThreeCoatMode, totalFinal: totalFinalWeight, isCandyCoat: isCandyCoatMode, candyCode, candyAdditive, candyClear, candyHardener, candyThinner }; setSnapshots(prev => [newSnapshot, ...prev]); alert(`[${newSnapshot.timestamp}] 데이터가 확정 저장되었습니다.`); };
  const restoreSnapshot = (snapshot: any) => { if (window.confirm("복원하시겠습니까?")) { setToners(JSON.parse(JSON.stringify(snapshot.base))); setPearlToners(JSON.parse(JSON.stringify(snapshot.pearl))); setIsThreeCoatMode(snapshot.isThreeCoat || false); setIsCandyCoatMode(snapshot.isCandyCoat || false); setCandyCode(snapshot.candyCode || ""); setCandyAdditive(snapshot.candyAdditive || "2.0"); setCandyClear(snapshot.candyClear || "100.0"); setCandyHardener(snapshot.candyHardener || "36.0"); setCandyThinner(snapshot.candyThinner || "6.0"); setSelectedSnapshot(null); setIsSnapshotModalOpen(false); } };
  
  const handleSavePostEdit = () => { setBoardPosts(prev => prev.map(p => p.id === viewingPost.id ? { ...p, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec } : p)); setViewingPost({ ...viewingPost, brand: editPostForm.brand, code: editPostForm.code, spec: editPostForm.spec }); setIsEditingPost(false); };
  const handleOpenPost = (post: any) => { setViewingPost(post); setEditPostForm({ brand: post.brand, code: post.code, spec: post.spec }); setIsEditingPost(false); };

  const handleGoogleGlossarySearch = () => { const inputEl = document.getElementById('glossarySearchInput') as HTMLInputElement; const val = inputEl?.value?.trim(); if(!val) { alert("사전 검색창에 뜻이 궁금한 용어를 직접 입력하세요!"); return; } window.open(`https://www.google.com/search?q=스피스헥커+${val}+뜻`, '_blank'); };

  const showBottomBar = !(isMobile && isKeyboardOpen);
    
    if (!isAuthorized) {
        return (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 notranslate" translate="no">
              <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
                  {!showApprovalSuccess ? (
                      <div className="p-4 flex flex-col items-center justify-center mt-6 relative">
                          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                              <Lock size={32} className="text-white"/>
                          </div>
                          <h2 className="text-2xl font-black text-slate-800 mb-2">조색 Pro 접근 승인</h2>
                          <p className="text-sm text-slate-500 text-center break-keep px-4">이 시스템은 승인된 작업자만 사용할 수 있습니다. 관리자 확인을 위해 정확한 정보를 입력해주세요.</p>
                      </div>
                  ) : null}
                  <form onSubmit={handleFakeApproval} className="p-6 bg-white flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><Briefcase size={12}/> 소속 그룹 (상호명)</label>
                              <input type="text" value={authForm.company} onChange={e => setAuthForm({...authForm, company: e.target.value})} placeholder="예: Maserati" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-blue-500"/>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><MapPin size={12}/> 지점 위치</label>
                              <input type="text" value={authForm.location} onChange={e => setAuthForm({...authForm, location: e.target.value})} placeholder="예: 서울 강남점" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-blue-500"/>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <div>
                              <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><UserCheck size={12}/> 작업자 이름</label>
                              <input type="text" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} placeholder="예: 홍길동" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-blue-500"/>
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-600 mb-1 flex items-center gap-1"><Users size={12}/> 연령(나이)</label>
                              <input type="text" inputMode="numeric" pattern="[0-9]*" value={authForm.age} onChange={e => setAuthForm({...authForm, age: e.target.value.replace(/[^0-9]/g, '')})} placeholder="예: 35" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold focus:outline-none focus:border-blue-500"/>
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-600 mb-1 block">현 직책</label>
                          <select value={authForm.role} onChange={e => setAuthForm({...authForm, role: e.target.value})} className="w-full border border-slate-300 p-2.5 rounded-lg text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
    <option value="사원/주임">사원 / 주임</option>
    <option value="대리">대리</option>
    <option value="과장">과장</option>
    <option value="차장">차장</option>
    <option value="부장">부장</option>
    <option value="팀장">팀장</option>
</select>
                      </div>
                      {isApproving && (
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                              <Loader2 className="animate-spin text-blue-600" size={24}/>
                              <span className="text-xs font-bold text-blue-700">{approvalMessage}</span>
                          </div>
                      )}
                      {showApprovalSuccess && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center gap-3">
                              <ShieldCheck className="text-emerald-600" size={32}/>
                              <span className="text-xs font-bold text-emerald-800 text-center">마스터 윤성만 님 승인이 완료되었습니다!<br/>시스템에 접속합니다.</span>
                              <button type="button" onClick={handleApprovalConfirm} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md transition-all">조색 Pro 시작하기</button>
                          </div>
                      )}
                      {!isApproving && !showApprovalSuccess && (
                          <button type="submit" disabled={!isAuthFormValid} className={`w-full py-3.5 rounded-xl font-black text-sm shadow-lg transition-all ${isAuthFormValid ? 'bg-slate-900 hover:bg-slate-800 text-white cursor-pointer' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                              시스템 검증 중...
                          </button>
                      )}
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
          <span onClick={() => alert("📋 [조색 Pro 개발 및 패치 히스토리]\n\n" + PATCH_HISTORY.map(p => `▪ ${p.version} (${p.date}) - ${p.title}\n   └ ${p.details}`).join("\n\n"))} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] px-2.5 py-1 rounded-full border border-slate-700 hidden md:inline-block shrink-0 cursor-pointer transition-colors" title="클릭하여 패치 내역 보기">Last Patch: {LAST_PATCH_DATE} 🔍</span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide snap-x items-center">
            <button onClick={() => { setIsChatOpen(true); setUnreadChatCount(0); }} className="relative flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <MessageSquare size={14} /> 현장 톡방
                {unreadChatCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">{unreadChatCount}</span>}
            </button>
            <button onClick={() => { setIsUsersModalOpen(true); setSelectedUserInfo(null); }} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Users size={14} /> 승인된 작업자 <span className="bg-indigo-900 px-1.5 py-0.5 rounded text-[10px]">{authorizedUsers.length}명</span>
            </button>
            <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>
            <button onClick={() => { setIsCloudModalOpen(true); setCopied(false); }} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                ☁️ 연동
            </button>
            <button onClick={() => setIsGlossaryModalOpen(true)} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                📖 용어사전
            </button>
            <button onClick={() => setIsBoardOpen(true)} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Layers size={14} /> 게시판
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

                <div className="flex items-center gap-1 cursor-pointer hover:bg-blue-100/50 py-1.5 px-2 mt-1 rounded transition-colors w-full border border-transparent hover:border-blue-200" onClick={() => toggleExpand(toner.id, false)}>
                    <span className="font-bold text-blue-800 text-[13px] leading-tight flex-1 text-left break-keep flex items-center justify-between w-full">
                        <span className="flex items-center">
                            {toner.code ? (info.role || '등록된 안료 정보 없음') : '안료 번호를 입력하세요'}
                            {toner.code && info.type && <span className="ml-2 bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-600 shadow-sm whitespace-nowrap">{info.type}</span>}
                        </span>
                        {toner.code && (
                            <span className="ml-2 text-[10px] text-blue-600 bg-white border border-blue-200 px-2 py-1 rounded-full flex items-center shadow-sm shrink-0">
                                {toner.isExpanded ? <>접기 <ChevronUp size={14} className="ml-0.5"/></> : <>상세보기 <ChevronDown size={14} className="ml-0.5"/></>}
                            </span>
                        )}
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
                <label className="flex-1 flex items-center justify-between cursor-pointer bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm hover:bg-cyan-50 transition-colors">
                    <span className="text-xs font-black text-cyan-700">Clear (투명 믹서) 켜기</span>
                    <div className="relative">
                        <input type="checkbox" className="sr-only" checked={isClearCoatMode} onChange={() => setIsClearCoatMode(!isClearCoatMode)} />
                        <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${isClearCoatMode ? 'bg-cyan-500' : 'bg-slate-300'}`}></div>
                        <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${isClearCoatMode ? 'transform translate-x-5' : ''}`}></div>
                    </div>
                </label>
            </div>

        {isCandyCoatMode && (() => {
          const candyInfo = TONER_DB[candyCode] || { face: '#5a1827', flop: '#8b253f', role: '캔디 코드 입력 후 엔터(Enter)' };
          return (
          <div className="pt-4 mt-4 border-t border-rose-200 space-y-2 pb-2">
             <div className="text-xs font-black text-rose-700 flex justify-between border-b pb-1">
                 <span>▼ 캔디 코트 (Candy Coat 100:36:6 슬림 배합기)</span>
             </div>
             <div className="bg-white rounded-xl overflow-hidden border border-rose-200 shadow-sm flex flex-col">
                 <div className="px-3 py-2 text-white flex items-center gap-2 transition-colors duration-500" style={{ background: `linear-gradient(to right, ${candyInfo.face}, ${candyInfo.flop})` }}>
                     <input 
                         type="text" 
                         inputMode="decimal" 
                         pattern="[0-9]*" 
                         value={candyCode} 
                         onChange={e => setCandyCode(e.target.value.toUpperCase())} 
                         onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); candyAdditiveRef.current?.focus(); } }}
                         className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 w-20 text-center text-sm font-black focus:outline-none placeholder-white/50" 
                         placeholder="번호" 
                     />
                     <span className="font-bold text-xs sm:text-sm tracking-wide truncate drop-shadow-md">
                         {candyCode && TONER_DB[candyCode] ? candyInfo.role : '캔디 코드 입력 후 엔터(Enter)'}
                     </span>
                 </div>
                 <div className="bg-rose-50 p-2 grid grid-cols-4 gap-1.5 items-center">
                     <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-inner">
                         <span className="text-[9px] font-bold text-slate-500 block truncate">7500클리어(100)</span>
                         <div className="flex items-end gap-0.5"><input type="text" inputMode="decimal" pattern="[0-9]*" value={candyClear} onChange={e => { let val = e.target.value.replace(/[^0-9.]/g, ''); setCandyClear(val); if(val) { setCandyHardener((parseFloat(val) * 0.36).toFixed(1)); setCandyThinner((parseFloat(val) * 0.06).toFixed(1)); } else { setCandyHardener(""); setCandyThinner(""); } }} className="w-full text-sm sm:text-base font-black text-slate-800 bg-transparent focus:outline-none" /><span className="font-bold text-slate-400 text-[10px]">g</span></div>
                     </div>
                     <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-inner">
                         <span className="text-[9px] font-bold text-slate-500 block truncate">경화제(36)</span>
                         <div className="flex items-end gap-0.5"><input type="text" inputMode="decimal" pattern="[0-9]*" value={candyHardener} onChange={e => setCandyHardener(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full text-sm sm:text-base font-black text-slate-800 bg-transparent focus:outline-none" /><span className="font-bold text-slate-400 text-[10px]">g</span></div>
                     </div>
                     <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-inner">
                         <span className="text-[9px] font-bold text-slate-500 block truncate">신너(6)</span>
                         <div className="flex items-end gap-0.5"><input type="text" inputMode="decimal" pattern="[0-9]*" value={candyThinner} onChange={e => setCandyThinner(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full text-sm sm:text-base font-black text-slate-800 bg-transparent focus:outline-none" /><span className="font-bold text-slate-400 text-[10px]">g</span></div>
                     </div>
                     <div className="bg-rose-100 p-1.5 rounded-lg border border-rose-300 shadow-inner">
                         <span className="text-[9px] font-black text-rose-700 block truncate">첨가제 용량</span>
                         <div className="flex items-end gap-0.5"><input ref={candyAdditiveRef} type="text" inputMode="decimal" pattern="[0-9]*" value={candyAdditive} onChange={e => setCandyAdditive(e.target.value.replace(/[^0-9.]/g, ''))} className="w-full text-sm sm:text-base font-black text-rose-700 bg-transparent focus:outline-none" /><span className="font-bold text-rose-500 text-[10px]">g</span></div>
                     </div>
                 </div>
             </div>
          </div>
          );
        })()}

            {isClearCoatMode && (
                <div className="pt-4 mt-4 border-t border-cyan-200 space-y-2 pb-2">
                    <ClearMixer />
                </div>
            )}

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

                <div className="flex items-center gap-1 cursor-pointer hover:bg-purple-100/50 py-1.5 px-2 mt-1 rounded transition-colors w-full border border-transparent hover:border-purple-200" onClick={() => toggleExpand(toner.id, true)}>
                    <span className="font-bold text-purple-800 text-[13px] leading-tight flex-1 text-left break-keep flex items-center justify-between w-full">
                        <span className="flex items-center">
                            {toner.code ? (info.role || '등록된 안료 정보 없음') : '안료 번호를 입력하세요'}
                            {toner.code && info.type && <span className="ml-2 bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-600 shadow-sm whitespace-nowrap">{info.type}</span>}
                        </span>
                        {toner.code && (
                            <span className="ml-2 text-[10px] text-purple-600 bg-white border border-purple-200 px-2 py-1 rounded-full flex items-center shadow-sm shrink-0">
                                {toner.isExpanded ? <>접기 <ChevronUp size={14} className="ml-0.5"/></> : <>상세보기 <ChevronDown size={14} className="ml-0.5"/></>}
                            </span>
                        )}
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
                                              <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 text-[10px] font-bold rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                  <span className="text-[10px] font-black leading-tight">{mainTitle}</span>
                                                  {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                              </div>
                                              <span className={`text-[11.5px] leading-relaxed break-keep pt-0.5 whitespace-pre-line ${getBadgeClass(d[0]).includes('yellow') ? 'text-yellow-800 font-black' : 'text-slate-700'}`}>{d[1]}</span>
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
                <span className="flex items-center"><Target size={14} className="mr-1 text-blue-600"/> 📘 마스터 기술자료실 (Visual Guide)</span>
                <button onClick={() => setIsConfiguratorOpen(true)} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"><Maximize size={10} className="mr-1"/>먼셀 믹싱 랩</button>
              </h3>
              
              <div className="flex border-b border-blue-200 bg-slate-50">
                  {['theory', 'spectrum', 'effect', 'special', 'clear'].map(tab => (
                      <button key={tab} onClick={() => setActiveGuideTab(tab as any)} className={`flex-1 py-3 text-[11px] sm:text-[12px] font-black transition-all ${activeGuideTab === tab ? 'bg-blue-600 text-white shadow-md transform scale-[1.02] rounded-t-xl z-10' : 'text-slate-500 hover:text-blue-700 hover:bg-blue-50'}`}>
                          {tab === 'theory' ? '이론/기초' : tab === 'spectrum' ? '컬러 맵' : tab === 'effect' ? '이펙트/펄' : tab === 'special' ? '특수/3코트' : 'Clear 가이드'}
                      </button>
                  ))}
              </div>
          </div>
          
          <div className="p-3 flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 flex flex-col">
            {activeGuideTab === 'clear' ? (
              <div className="flex flex-col flex-1 animate-in fade-in overflow-hidden h-full">
                <ClearGuide />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto custom-scrollbar">
                {(GUIDE_IMAGES[activeGuideTab] || []).map((item: any) => (
                  <div key={item.id} onClick={() => setZoomedImage(item)} className="bg-white p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">PAGE {item.id}</span>
                      <Maximize size={12} className="text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <div className="font-black text-xs text-slate-800 group-hover:text-blue-700 break-keep">{item.title}</div>
                    <div className="text-[10px] text-slate-500 font-bold mt-0.5 break-keep">{item.desc}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-4 mb-8 pb-4 relative z-50 px-1 shrink-0 border-t border-slate-200">
              <button onClick={() => setIsPearlGuideOpen(true)} className="flex-1 bg-purple-100 border border-purple-300 text-purple-900 py-3 rounded-xl text-sm font-black flex items-center justify-center hover:bg-purple-200 transition-colors shadow-md cursor-pointer">
                <BookOpen size={16} className="mr-1.5" /> <span className="pointer-events-none">PP(분말) 가이드 열기</span>
              </button>
              <button onClick={() => setIsProcessOpen(true)} className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-3 rounded-xl text-sm font-black flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors shadow-md cursor-pointer">
                <Code size={16} className="mr-1.5 text-slate-400 pointer-events-none" /> <span className="pointer-events-none">Pro 제작 과정 보기</span>
              </button>
            </div>
          </div>
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
              <div className="flex items-center gap-1.5">
                <button 
                      onClick={async () => {
                        const masterKey = prompt("마스터 관리자 비밀번호를 입력하세요:\n(※ 비밀번호를 잊으셨다면 'help'를 입력하세요)");
                        
                        if (masterKey === "7777") {
                          if (window.confirm("🚨 [주의] 정말 서버의 모든 작업자 명단을 영구 삭제하시겠습니까?\n\n- 접속 중인 모든 모바일/PC 기기에 리셋 안내가 전송됩니다.\n- 기존 조색 데이터는 안전하게 보존됩니다.")) {
                            try {
                              const snapshot = await getDocs(collection(db, "active_users"));
                              const deletePromises = snapshot.docs.map((docItem) => deleteDoc(doc(db, "active_users", docItem.id)));
                              await Promise.all(deletePromises);

                              localStorage.removeItem('hitec_auth_users');
                              setAuthorizedUsers([]);
                              
                              alert("파이어베이스 서버와 모든 기기의 작업자 명단이 완벽하게 리셋되었습니다!");
                            } catch (error) {
                              console.error("서버 리셋 중 오류 발생:", error);
                              alert("리셋 중 오류가 발생했습니다. 다시 시도해 주세요.");
                            }
                          }
                        } 
                        else if (masterKey === "help") {
                          const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ysm0427@gmail.com&su=[조색Pro] 마스터 비밀번호 찾기 요청&body=마스터 비밀번호를 분실하여 임시 키 발송을 요청합니다. 접속 기기 및 관리자 확인을 부탁드립니다.`;
                          window.open(gmailUrl, '_blank');
                          alert("구글 지메일(Gmail) 복구 요청 창이 새 탭으로 열렸습니다. 메일을 전송해 주세요!");
                        } 
                        else if (masterKey !== null) {
                          alert("비밀번호가 틀렸습니다! 마스터만 리셋할 수 있습니다.\n(비밀번호가 기억 안 나시면 'help'를 입력해 보세요)");
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      전체 명단 리셋
                    </button>
                <button onClick={() => setIsUsersModalOpen(false)} className="hover:text-red-200 transition-colors bg-indigo-700 px-2.5 py-1 rounded text-xs font-black text-white">[닫기]</button>
              </div>
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
                              {user.device === 'Mobile' ? <Smartphone size={16}/> : <Monitor size={16}/>}
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
              <h3 className="font-bold flex items-center gap-2"><Share2 size={18} /> 배합 데이터 다이렉트 공유</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="hover:text-red-200 transition-colors bg-slate-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 flex flex-col gap-3 bg-slate-50">
                <button onClick={handleCopyAllText} className="w-full bg-slate-800 text-white py-4 rounded-xl font-black shadow-lg hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-base mb-2 border-2 border-slate-600"><Copy size={20}/> 전체 텍스트 직접 복사하기</button>
                <button onClick={handleShareKakao} className="w-full bg-[#FEE500] text-slate-900 py-3.5 rounded-xl font-black shadow-sm hover:bg-[#E5C100] transition-colors flex items-center justify-center gap-2"><MessageSquare size={18}/> 카카오톡 바로 전송하기</button>
                <button onClick={handleShareSMS} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"><Send size={18}/> 문자(SMS) 앱 다이렉트 열기</button>
                
                <div className="flex gap-3 mt-1">
                    <button onClick={handleShareNaverMail} className="flex-1 bg-[#03C75A] hover:bg-[#02b350] text-white py-3.5 rounded-xl font-black shadow-md transition-colors flex items-center justify-center gap-1.5">
                        <Mail size={16}/> 네이버 메일
                    </button>
                    <button onClick={handleShareGoogleMail} className="flex-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-3.5 rounded-xl font-black shadow-sm transition-colors flex items-center justify-center gap-1.5">
                        <Mail size={16} className="text-red-500"/> 구글 메일
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {isProcessOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[3000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[600px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 max-h-[85vh]">
            <div className="p-4 bg-slate-800 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><Code size={18} /> Glasurit & Spies Hecker Pro 제작 과정</h3>
              <button onClick={() => setIsProcessOpen(false)} className="hover:text-red-200 transition-colors bg-slate-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-4 bg-slate-50">
               <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm mb-4">
                   <h4 className="font-black text-red-700 text-sm mb-2">⚠️ 시스템 제작 배경 및 면책 고지</h4>
                   <p className="text-xs text-red-800 leading-relaxed font-bold break-keep">
                       본 웹 어플리케이션(Pro)은 <strong>현장 도장 작업자들의 조색(Color Matching) 편의성과 데이터 관리에 도움을 주기 위한 순수 목적</strong>으로 개발되었습니다. <br/><br/>
                       안료 특성 및 배합 데이터는 현장 실무와 제조사 가이드를 기반으로 작성되었으나, 실제 적용 시 환경에 따라 차이가 발생할 수 있습니다. <span className="underline">작업 전 반드시 공식 홈페이지 또는 기술지원팀에 문의하여 재확인</span>하시기 바라며, 본 시스템의 정보를 맹목적으로 활용하여 발생한 어떠한 결과 및 피해에 대해서도 <strong>개발자는 법적인 책임을 지지 않음</strong>을 명시합니다.
                   </p>
               </div>
               
               <div className="overflow-y-auto space-y-6 text-slate-600 font-sans text-xs sm:text-[13px] leading-relaxed break-keep pr-2 custom-scrollbar">
                  <h4 className="text-slate-800 font-bold">1. Spies Hecker DB Architecture (진행 상황)</h4>
                  <p className="text-slate-600">현재 조색 관련 주요 알고리즘 및 데이터베이스 연동 작업이 순조롭게 진행 중입니다. 지속적인 업데이트를 통해 정확도를 높여가고 있습니다.</p>
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
                            {selectedSnapshot.isCandyCoat && (
                                <div className="mb-6">
                                    <h5 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase"><Beaker size={14} className="text-rose-400"/> 캔디 코트 내역</h5>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-[#1e293b] p-3 rounded-lg border border-rose-900/30">
                                            <div className="flex items-center gap-3"><span className="text-white font-bold text-sm">WT {selectedSnapshot.candyCode?.replace('WT ', '') || '코드없음'}</span><span className="text-xs text-slate-500 truncate max-w-[120px]">캔디 첨가제</span></div>
                                            <span className="text-rose-400 font-bold">{formatWeight(selectedSnapshot.candyAdditive)}g</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <button onClick={() => restoreSnapshot(selectedSnapshot)} className="w-full bg-indigo-600 text-white font-black py-4 rounded-xl mt-4 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all flex justify-center items-center gap-2 text-sm">
                                이 상태로 완벽하게 덮어쓰기 (복원)
                            </button>
                        </div>
                    ) : ( 
                        <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-50">
                            <History size={64} className="mb-4"/>
                            <p className="font-bold">왼쪽에서 확인하실 수정 내역을 선택해주세요.</p>
                        </div> 
                    )}
                </div>
            </div>
          </div>
        </div>
      )}

      {isBoardOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
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
                    <div key={post.id} onClick={() => handleOpenPost(post)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded font-bold">{post.brand}</span>
                                <span className="text-lg font-black text-emerald-700 uppercase tracking-wide group-hover:text-emerald-500 transition-colors notranslate" translate="no">{post.code}</span>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 mt-0.5">
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                                <button onClick={(e) => deleteBoardPost(post.id, e)} className="text-slate-400 hover:text-white hover:bg-red-500 px-2 py-1 rounded transition-colors flex items-center gap-1 font-bold text-[10px]" title="이 시편 삭제하기"><Trash2 size={12} /> 전체 삭제</button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 font-bold mb-1 break-keep mt-1">{post.spec}</p>
                        <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1">
                            <span className="text-xs text-slate-500">By. <b>{post.author}</b></span>
                        </div>
                    </div>
                ))}
                {boardPosts.length === 0 && <div className="text-center py-10 text-slate-500">검색 조건에 맞는 시편 데이터가 없습니다.</div>}
            </div>
          </div>
        </div>
      )}

      {viewingPost && (
        <div className="fixed inset-0 bg-slate-900/90 z-[2000] p-4 flex items-center justify-center animate-in fade-in backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-300">
                <div className="p-4 bg-emerald-600 flex justify-between items-center text-white shrink-0">
                    <h3 className="font-bold flex items-center gap-2"><Layers size={18}/> {viewingPost.brand} - {viewingPost.code}</h3>
                    <button onClick={() => setViewingPost(null)} className="hover:text-red-200 bg-emerald-700 p-1.5 rounded-full transition-colors"><X size={16}/></button>
                </div>
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50 custom-scrollbar">
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
                            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm font-bold text-slate-700 break-keep mt-3">{viewingPost.spec}</div>
                        </>
                    )}

                    <div className="mt-6 flex flex-col gap-4">
                        <div className="flex-1">
                            <h4 className="text-sm font-black text-slate-800 mb-2 flex items-center gap-1"><Sliders size={14} className="text-blue-500"/> 베이스 코트 배합</h4>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                                {viewingPost.baseFormula.map((t:any, i:number) => (<div key={i} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0 last:pb-0"><span className="font-bold text-slate-700">{t.code}</span><span className="text-blue-600 font-black text-sm">{t.adjustedWeight}g</span></div>))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end pt-4 border-t border-slate-200">
                        <button onClick={(e) => { deleteBoardPost(viewingPost.id, e); setViewingPost(null); }} className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl font-bold border border-red-200 hover:bg-red-100 flex items-center shadow-sm transition-colors"><Trash2 size={16} className="mr-1.5"/> 시편 영구 삭제</button>
                    </div>
                </div>
           </div>
        </div>
      )}

      {isGlossaryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[3000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[750px] max-w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-emerald-600 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><BookOpen size={18} /> 📖 자동차 도장/조색 쉬운 용어 사전</h3>
              <button onClick={() => setIsGlossaryModalOpen(false)} className="hover:text-red-200 bg-emerald-700 p-1.5 rounded-full transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 space-y-8">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center">
                  <div className="flex-1 w-full text-sm">
                      <p className="font-black text-blue-800 mb-1">🔍 사전에 없는 용어가 궁금하신가요?</p>
                      <p className="text-slate-600 text-xs break-keep">아래 검색창에 궁금한 용어를 입력하고 엔터(Enter) 키를 치시면 바로 구글 검색 결과로 이동합니다.</p>
                      <div className="flex mt-2 shadow-sm">
                        <input 
                            id="glossarySearchInput" 
                            lang="ko" 
                            onKeyDown={(e) => { if (e.key === 'Enter') handleGoogleGlossarySearch(); }} 
                            type="text" 
                            placeholder="예: WT 303, 메탈릭 등 입력 후 엔터" 
                            className="flex-1 p-2.5 border border-blue-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm" 
                        />
                        <button onClick={handleGoogleGlossarySearch} className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-r font-black text-sm flex items-center justify-center transition-colors"><Search size={16} className="mr-1.5"/> 검색</button>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🚨 실시간 현장 톡방 채팅 UI 모달 추가 완료 🚨 */}
      {isChatOpen && (
          <div className="fixed inset-0 bg-slate-900/80 z-[4000] flex justify-end animate-in fade-in">
              <div className="bg-white w-full sm:w-[400px] h-full shadow-2xl flex flex-col slide-in-from-right-full duration-300">
                  <div className="p-4 bg-blue-600 flex justify-between items-center text-white shrink-0">
                      <h3 className="font-bold flex items-center gap-2"><MessageSquare size={18}/> 현장 실시간 톡방</h3>
                      <button onClick={() => setIsChatOpen(false)} className="hover:bg-blue-700 p-1.5 rounded-full transition-colors"><X size={16}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3 custom-scrollbar">
                      {chatMessages.length === 0 && (
                          <div className="flex items-center justify-center h-full text-slate-400 font-bold text-sm">
                              아직 전송된 메시지가 없습니다.<br/>첫 메시지를 남겨보세요!
                          </div>
                      )}
                      {chatMessages.map(msg => {
                          const isMe = msg.sender.includes(authForm.name);
                          return (
                              <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                  <span className="text-[10px] text-slate-500 mb-1 font-bold">{msg.sender} ({msg.role})</span>
                                  <div className={`p-3 rounded-xl shadow-sm text-sm font-bold ${isMe ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                                      {msg.text}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
                  <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0 pb-[env(safe-area-inset-bottom)]">
                      <input 
                          type="text" 
                          value={chatInput} 
                          onChange={e => setChatInput(e.target.value)} 
                          placeholder="메시지를 입력하세요..." 
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 shadow-sm" 
                      />
                      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors shadow-sm"><Send size={18}/></button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
}

export default App;
