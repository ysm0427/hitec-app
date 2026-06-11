import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Zap, Maximize, Lock, Unlock, Layers, BrainCircuit, RefreshCw, Sun, Droplet, Camera, X, ChevronRight, Mic, FolderOpen
} from 'lucide-react';

const TONER_DB = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임. (WT346 : WT144 = 1 : 0.9)' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 채도가 높고 입자감이 좋은 청색계열의 컬러에 사용됨.' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두움. 주로 흑색계열의 컬러에 제한적으로 사용함.' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨.' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. WT332에 비해 채도가 높으며 측면(110도)을 더 어둡게 함. 주로 적색 이펙트 컬러에 사용.' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제. WT389보다 작음.' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크.' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨.' },
  'WT 307': { role: '프리즈마 실버', desc: '정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제.' },
  'WT 308': { role: '브라이트 오렌지', desc: '주로 이펙트 컬러에 사용하는 맑은 주황색. 은폐력은 떨어짐.' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 주로 채도가 높은 이펙트 컬러에 사용함. 은폐력은 떨어짐.' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 사용을 위한 조색제 바인더로 사용' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑고 적색 조색제. 주로 채도 높은 적색 이펙트 컬러에 사용함. 은폐력은 떨어짐.' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상변화가 큰 특수 펄 조색제. 15도는 맑은 적색, 45도는 맑은 녹색, 110도는 약하게 녹색으로 변하는 펄.' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제. 15도는 적청색, 나머지 각도는 녹황색으로 변하는 간섭 펄 입자임.' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제. 15도는 맑은 청색, 나머지 각도는 맑은 녹색으로 변하는 간섭 펄 입자임.' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: 'WT305보다 조금 큰 반짝임이 좋은 매끄러운 특수 알루미늄 조색제.' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제. WT346보다 밝고 녹색이 더 많음' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 예) 현대 XB3, 아우디 LX7L, LX6T, BMW A96 등에 사용됨.' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제. 솔리드 컬러에서 명암을 밝게 하고 색상을 줄임.' },
  'WT 322': { role: '마이크로 화이트', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 사용함.' },
  'WT 323': { role: '스페셜 블랙', desc: '표준 흑색 조색제. 알루미늄 입자에 사용하면 명암은 어두워지고 약하게 적황색이 늘어남.' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제. 은폐력은 떨어짐. 주로 이펙트 컬러에 사용함.' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '이펙트 컬러에 사용하는 녹색을 띤 맑은 황색 조색제.' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 밝은 황색 조색제. 주로 솔리드 컬러에 사용함.' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러에 사용하는 탁한 황색.' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색 조색제. 주로 이펙트 컬러에 사용. 은폐력은 떨어짐.' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 주로 솔리드 컬러에 사용.' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '이펙트 컬러에서 맑은 적황색을 내는 조색제. 솔리드 컬러에는 사용을 금함.' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 주로 적색 이펙트 컬러에 사용하며 전체적으로 황적색을 내고 명암을 조금 어둡게 함.' },
  'WT 333': { role: '그라나다 레드', desc: '밝은 적색 조색제. 주로 솔리드 컬러에 사용함.' },
  'WT 334': { role: '옥사이드 레드', desc: '주로 솔리드 컬러에 사용하는 탁한 적색 조색제. 조색제 단독으로는 은폐력 좋음.' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제. 주로 솔리드 컬러에 사용함.' },
  'WT 336': { role: '트랜스루센트 림드', desc: '선명하며 어두운 갈색 조색제. 이펙트 컬러에만 사용.' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 주로 솔리드 컬러에 사용함. 약하게 청색을 띰.' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제. 백색 및 알루미늄 입자에 혼합할 경우 맑은 분홍색을 나타냄.' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 청색 및 회색 컬러에 주로 사용되며 보라색을 내고 명암을 어둡게 함.' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '맑은 자주색 조색제. WT338에 비해 밝고 청색이 적음. 주로 이펙트 컬러에 사용함.' },
  'WT 341': { role: '아주르 블루', desc: '채도 높은 청색 조색제. 이펙트 컬러에서 15도는 녹청색, 나머지 각도는 적청색을 띰.' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 이펙트 컬러에 사용하면 15도는 보라색, 나머지 각도는 자주색을 내는 조색제.' },
  'WT 343': { role: '블루', desc: '표준 청색 조색제. 솔리드와 이펙트 컬러에 모두 사용하는 중간 청색 조색제.' },
  'WT 344': { role: '다크 블루', desc: '어두운 청색 조색제. 이펙트 컬러에서 15도는 청색, 나머지 각도는 적색을 띰.' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '맑고 선명한 황색을 조금 띠는 녹색 조색제. WT347에 비해 밝고 황색이 많음.' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 청색 조색제. 특히 45 & 110도에서 녹색이 가장 많은 청색 조색제.' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 녹색 조색제. WT345에 비해 청색이 많고 어두움.' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '채도 높은 청색 조색제. 이펙트 컬러에서 15도는 녹색이 강한 청색, 나머지 각도는 약하게 적색을 띰.' },
  'WT 349': { role: '트랜스루센트 그린', desc: '녹색 저농 조색제. WT347의 저농 버전.' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제. WT323의 저농 버전.' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '저농 청색 조색제. WT348의 저농 버전.' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. WT321의 저농 버전.' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농 버전.' },
  'WT 354': { role: '화인 실버', desc: '매우 작은 크기의 일반형 알루미늄 조색제. WT356 보다 작음.' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 광휘형 알루미늄 조색제. 은폐력은 떨어짐.' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 일반형 알루미늄 조색제.' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 작은 일반형 알루미늄 조색제.' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트 컬러용 특수 실버 조색제' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄 조색제.' },
  'WT 360': { role: '코올스 실버', desc: 'WT359보다 큰 일반형 알루미늄 조색제.' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄 조색제.' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제. WT361에 비해 크기가 작음.' },
  'WT 363': { role: '브릴리언트 골드', desc: '밝은 황색 알루미늄 조색제. 은폐력이 우수함.' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기의 백색 펄 조색제.' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 펄 조색제. 15도는 청적색, 나머지 각도는 황녹색으로 변하는 간섭 펄 입자임.' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 황색 펄 조색제. 15도는 황색, 나머지 각도는 청색으로 변하는 간섭 펄 입자임.' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 펄 조색제. 15도는 녹색, 나머지 각도는 적색으로 변하는 간섭 펄 입자임.' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간 크기의 백색 펄 조색제.' },
  'WT 369': { role: '레드 펄', desc: '작은 크기의 적색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기의 맑은 청색 펄 조색제. 15도는 녹청색, 나머지 각도는 적황색으로 변하는 간섭 펄 입자임.' },
  'WT 371': { role: '브라운 펄', desc: '중간 크기의 주황색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 적색이 있는 청색 펄 조색제.' },
  'WT 373': { role: '루비 펄', desc: '중간 크기의 은폐력이 있는 적색 펄 조색제.' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기의 청녹색 펄 조색제.' },
  'WT 375': { role: '그린 펄', desc: '중간 크기의 녹색 펄 조색제. 15도는 맑은 녹색, 나머지 각도는 적색으로 변하는 간섭 펄 입자임.' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기의 적색 펄 조색제.' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄 조색제. 입자의 반짝임이 매우 좋음.' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄 조색제. 입자의 반짝임이 매우 좋음.' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색 펄 조색제. 입자의 반짝임이 매우 좋음.' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄 조색제. 입자의 반짝임이 매우 좋음.' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄 조색제. 입자의 반짝임이 매우 좋음.' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 펄 조색제. 입자의 반짝임이 매우 좋음.' },
  'WT 383': { role: '브릴리언트 오렌지', desc: 'WT363에 비해 적색감이 많은 적황색 알루미늄 조색제.' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: 'Transparent White. WT387에 비해 점도가 높음.' },
  'WT 386': { role: '플롭 컨트롤', desc: '측면을 밝게 하기 위한 명암 조정제.' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: 'Viscosity Additive' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT323보다 어두움.' },
  'WT 389': { role: '플래틴 실버 화인', desc: '작은 고휘도 광휘형 알루미늄 조색제.' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기의 고휘도 광휘형 알루미늄 조색제. 알루미늄 입자 중 15도가 가장 밝고 나머지 각도가 가장 어두움.' },
  'WT 392': { role: '매직 이펙트', desc: '관찰각도에 따라 색상변화가 큰 특수 펄 조색제.' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색을 띠는 밝은 황색 조색제.' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제, 블랜딩용 첨가제.' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제.' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제.' },
  'WT 3080': { role: '스페셜 애디티브', desc: '도막 보정 및 흐름 방지 첨가제' },
};

const lerp = (a, b, t) => a + (b - a) * t;
const lerpHue = (a, b, t) => {
  let d = b - a;
  if (d > 180) d -= 360; if (d < -180) d += 360;
  let h = a + d * t;
  if (h < 0) h += 360; if (h >= 360) h -= 360;
  return h;
};
const lerpColor = (c1, c2, t) => ({ h: lerpHue(c1.h, c2.h, t), s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) });

const getTonerVisuals = (code, role, desc = '') => {
  const isPearl = role.includes('펄') || role.includes('이펙트') || role.includes('글라스');
  const isSilver = role.includes('실버') || role.includes('알루미늄');
  const isSolid = !isPearl && !isSilver;
  let faceColor = '#e2e8f0'; let particleColor1 = '#ffffff'; let particleColor2 = '#94a3b8';

  if (role.includes('블루') || role.includes('청')) { faceColor = '#1d4ed8'; particleColor1 = '#60a5fa'; particleColor2 = '#3b82f6'; }
  else if (role.includes('레드') || role.includes('마젠타') || role.includes('마룬') || code.includes('300')) { faceColor = '#b91c1c'; particleColor1 = '#f87171'; particleColor2 = '#ef4444'; }
  else if (role.includes('그린') || role.includes('녹')) { faceColor = '#15803d'; particleColor1 = '#4ade80'; particleColor2 = '#22c55e'; }
  else if (role.includes('옐로우') || role.includes('황') || role.includes('오커')) { faceColor = '#eab308'; particleColor1 = '#fde047'; particleColor2 = '#ca8a04'; }
  else if (role.includes('오렌지')) { faceColor = '#ea580c'; particleColor1 = '#fb923c'; particleColor2 = '#f97316'; }
  else if (role.includes('바이올렛')) { faceColor = '#7e22ce'; particleColor1 = '#c084fc'; particleColor2 = '#a855f7'; }
  else if (role.includes('화이트') || role.includes('백')) { faceColor = '#f8fafc'; particleColor1 = '#ffffff'; particleColor2 = '#cbd5e1'; }
  else if (role.includes('블랙') || role.includes('흑')) { faceColor = '#0f172a'; particleColor1 = '#475569'; particleColor2 = '#334155'; }
  else if (isSilver) { faceColor = '#94a3b8'; particleColor1 = '#ffffff'; particleColor2 = '#f1f5f9'; }

  let flopColor = '#1e293b';
  if (isSolid) { flopColor = faceColor; } 
  else {
    if (desc.includes('녹황색') || desc.includes('황녹색')) { flopColor = '#65a30d'; particleColor2 = '#84cc16'; }
    else if (desc.includes('적황색') || desc.includes('황적색')) { flopColor = '#ea580c'; particleColor2 = '#f97316'; }
    else if (desc.includes('적색') || desc.includes('마젠타') || desc.includes('적청색')) { flopColor = '#991b1b'; particleColor2 = '#f43f5e'; }
    else if (desc.includes('녹색') || desc.includes('청녹색')) { flopColor = '#166534'; particleColor2 = '#22c55e'; }
    else if (desc.includes('청색') || desc.includes('적청색')) { flopColor = '#1e3a8a'; particleColor2 = '#3b82f6'; }
    else if (desc.includes('황색')) { flopColor = '#b45309'; particleColor2 = '#facc15'; }
    else if (isSilver) flopColor = '#334155';
  }
  let size = 30;
  if (role.includes('엑스트라 화인') || role.includes('울트라 파인') || role.includes('마이크로') || desc.includes('매우 작')) size = 15;
  else if (role.includes('코올스') || role.includes('큰') || role.includes('스파클')) size = 60;

  if (role.includes('바인더') || role.includes('컴포넌트') || role.includes('애디티브') || code.includes('385') || code.includes('387')) {
    return { smoothStyle: { background: 'rgba(255,255,255,0.8)', border: '1px dashed #cbd5e1' }, macroStyle: { background: 'rgba(255,255,255,0.8)', border: '1px dashed #cbd5e1' } };
  }
  let smoothStyle, macroStyle;
  if (isSolid) {
    smoothStyle = { background: `linear-gradient(135deg, ${faceColor} 0%, rgba(0,0,0,0.4) 100%)` };
    macroStyle = { backgroundColor: faceColor };
  } else {
    smoothStyle = { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
    macroStyle = {
      backgroundColor: '#020617',
      backgroundImage: `radial-gradient(circle at 10% 20%, ${particleColor1} 1px, transparent 2px), radial-gradient(circle at 30% 60%, ${particleColor2} 1.5px, transparent 2.5px), radial-gradient(circle at 70% 30%, ${particleColor1} 0.5px, transparent 1px), radial-gradient(circle at 80% 80%, ${particleColor2} 2px, transparent 3px), radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 2px)`,
      backgroundSize: `${size}px ${size}px`, boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9)'
    };
  }
  return { smoothStyle, macroStyle };
};

const getOptics = (tonersList, weightKey) => {
  const colorToners = tonersList.filter(t => !t.role.includes('지정되지 않은'));
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t[weightKey]) || 0), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0, rGreen=0, rRed=0, rYellow=0, rViolet=0;
  let wSilver=0, wWhite=0, wBlack=0, wPearl=0, wBinder=0; let interferenceColor = null;

  colorToners.forEach(t => {
    const w = parseFloat(t[weightKey]) || 0; if (w <= 0) return;
    const role = t.role || ''; const code = t.code || '';
    let strength = 1.0; if (code.includes('144') || code.includes('341') || code.includes('300') || code.includes('338')) strength = 2.5;

    if (role.includes('컴포넌트') || role.includes('바인더') || role.includes('애디티브') || ['WT 385', 'WT 387', 'WT 386', 'WT 400', 'WT 3080', 'WT 310'].some(c => code.includes(c.replace('WT ', '')))) { wBinder += w; }
    else if (role.includes('블랙') || code.includes('323') || code.includes('388') || code.includes('188')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄') || code.includes('362') || code.includes('357') || code.includes('197') || code.includes('303') || code.includes('305') || code.includes('307')) wSilver += w;
    else if (role.includes('화이트') || code.includes('321') || code.includes('328')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('스파클') || code.includes('304') || code.includes('377') || code.includes('381')) {
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
    else if (role.includes('옐로우') || role.includes('황') || code.includes('350')) rYellow += w * strength;
    else if (role.includes('그린') || role.includes('녹')) rGreen += w * strength;
  });

  const colorWeight = (rBlue + rGreen + rRed + rYellow + rViolet);
  const effectiveW = wWhite + wBlack + wSilver + wPearl + colorWeight;
  const totalForRatio = effectiveW > 0 ? effectiveW : 1;
  const pSilver = wSilver / totalForRatio; const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio; const pPearl = wPearl / totalForRatio; const pColor = colorWeight / totalForRatio;

  let baseL = (pWhite * 96) + (pSilver * 65) + (pPearl * 85);
  if (effectiveW === 0 && wBinder > 0) { baseL = 90; }
  let blackImpact = Math.pow(pBlack, 0.45) * 60; if (pWhite > 0.6) { blackImpact = blackImpact * 0.15; }
  baseL = Math.max(4, baseL - blackImpact - (Math.pow(pColor, 0.5) * 30));

  let l15 = baseL + (Math.pow(pSilver + pPearl, 0.6) * 45); let l110 = baseL - (Math.pow(pSilver, 0.6) * 45) - (Math.pow(pBlack, 0.5) * 20);
  if (pWhite > 0.6) { l110 = Math.max(83, baseL - 8); l15 = Math.min(99, baseL + (pPearl > 0 ? 10 : 3)); }

  let x = rRed + (rYellow * 0.5) - (rGreen * 0.5) - rBlue - (rViolet * 0.5);
  let y = (rYellow * 0.866) + (rGreen * 0.866) - (rBlue * 0.866) - (rViolet * 0.866);
  let hue = Math.atan2(y, x) * (180 / Math.PI); if (hue < 0) hue += 360;
  let sat = colorWeight > 0 ? Math.min(100, Math.pow((colorWeight / (colorWeight + wWhite + wSilver + Math.max(wBlack * 2, 0))), 0.4) * 100) : 0;
  if (pWhite > 0.6) { sat = sat * 0.3; }

  let flopHue = hue; let faceHue = hue;
  if (interferenceColor === 'blue') { faceHue = 210; flopHue = 230; }
  else if (interferenceColor === 'red') { faceHue = 340; flopHue = 350; }
  else if (interferenceColor === 'green') { faceHue = 120; flopHue = 140; }
  else if (interferenceColor === 'yellow') { faceHue = 50; flopHue = 60; }

  return {
    face: { h: Math.round(faceHue), s: Math.round(Math.min(100, sat + (pPearl * (interferenceColor === 'white' ? 5 : 20)))), l: Math.round(Math.min(99, Math.max(5, l15))) },
    mid:  { h: Math.round(hue), s: Math.round(sat), l: Math.round(Math.min(98, Math.max(5, baseL))) },
    flop: { h: Math.round(wPearl > 0 ? flopHue : hue), s: Math.round(Math.min(100, sat + (pPearl * (interferenceColor === 'white' ? 2 : 12)))), l: Math.round(Math.min(98, Math.max(2, l110))) },
    isMetallic: (wSilver > 0 || wPearl > 0)
  };
};

export default function App() {
  const [toners, setToners] = useState([
    { id: 'WT387', code: 'WT 387', role: TONER_DB['WT 387'].role, adjustedWeight: "198.3" },
    { id: 'WT321', code: 'WT 321', role: TONER_DB['WT 321'].role, adjustedWeight: "120" },
    { id: 'WT350', code: 'WT 350', role: TONER_DB['WT 350'].role, adjustedWeight: "4.35" },
    { id: 'WT353', code: 'WT 353', role: TONER_DB['WT 353'].role, adjustedWeight: "1.65" },
    { id: 'WT328', code: 'WT 328', role: TONER_DB['WT 328'].role, adjustedWeight: "1.35" },
  ]);
  const [pearlToners, setPearlToners] = useState([
    { id: 'WT387_p', code: 'WT 387', role: TONER_DB['WT 387'].role, adjustedWeight: "121.9" },
    { id: 'WT377_p', code: 'WT 377', role: TONER_DB['WT 377'].role, adjustedWeight: "47.8" },
  ]);
  
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(true);
  const [targetColorCode, setTargetColorCode] = useState('FORD-UG PLATINUM');
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState(null);

  const initialChat = { id: 1, type: 'system', text: '💡 **[HI-TEC Master Engine V3.0 로드 완료]**\n- **Role**: Spies Hecker 페인트 기술 전문가\n- **Rule**: 정식 한글 명칭 표기, 멀티 시각화 렌더링 강제 실행.', time: new Date().toLocaleTimeString('ko-KR') };
  const [chatMessages, setChatMessages] = useState([initialChat]);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const chatContainerRef = useRef(null);

  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const viewerRef = useRef(null);

  const [baseOptics, setBaseOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [pearlOptics, setPearlOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [finalOptics, setFinalOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    const pearlTotal = pearlToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2));
    setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    setBaseOptics(getOptics(toners, 'adjustedWeight')); setPearlOptics(getOptics(pearlToners, 'adjustedWeight'));
    setFinalOptics(getOptics(isThreeCoatMode ? [...toners, ...pearlToners] : toners, 'adjustedWeight'));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }
  }, [chatMessages, isAiProcessing]);

  const handlePointerMove = (e) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    setLightPos({
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    });
  };

  const handleClearAll = () => {
    setToners([]); setPearlToners([]); setTargetColorCode(''); setIsBaseConfirmed(false);
    setChatMessages([initialChat, { id: Date.now(), type: 'system', text: '🗑️ 모든 배합 리스트가 즉시 초기화되었습니다.', time: new Date().toLocaleTimeString('ko-KR') }]);
  };

  const handleConfirmBase = () => {
    setIsBaseConfirmed(true);
    setChatMessages(prev => [...prev, { id: Date.now(), type: 'system', text: '🔒 기준 코드가 확정되었습니다. 멀티 시각화 레이어를 활성화합니다.', time: new Date().toLocaleTimeString('ko-KR') }]);
  };

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput; setChatInput('');
    setChatMessages(prev => [...prev, { id: Date.now(), type: 'user', text: q, time: new Date().toLocaleTimeString('ko-KR') }]);
    setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      setChatMessages(prev => [...prev, { id: Date.now(), type: 'ai', text: `👑 명령어(${q}) 분석 완료. 실시간 보정 함수에 반영되었습니다.`, time: new Date().toLocaleTimeString('ko-KR') }]);
    }, 500);
  };

  const handleWeightInputChange = (id, rawValue, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, '');
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
    else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };

  const handleCodeChange = (id, newCode, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim();
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => {
      if (toner.id === id) {
        let dbInfo = TONER_DB[formattedCode] || TONER_DB[`WT ${formattedCode.replace(/[^0-9]/g, '')}`];
        return dbInfo ? { ...toner, code: formattedCode, role: dbInfo.role } : { ...toner, code: newCode, role: '코드 입력' };
      }
      return toner;
    }));
  };

  const handleVoiceCommand = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("아이폰 설정 > 사파리에서 마이크 권한을 허용하거나 최신 iOS로 업데이트 해주세요."); return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR"; recognition.interimResults = false;
    recognition.start();
  };

  const getColorString = (opticsObj, angle) => `hsl(${Math.round(opticsObj[angle].h)}, ${Math.round(opticsObj[angle].s)}%, ${Math.round(opticsObj[angle].l)}%)`;
  const getInteractiveBackground = (opticsObj, lPos) => {
    const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2));
    const normalizedDist = Math.min(1, dist / 50);
    let activeColor = normalizedDist < 0.5 ? lerpColor(opticsObj.face, opticsObj.mid, normalizedDist * 2) : lerpColor(opticsObj.mid, opticsObj.flop, (normalizedDist - 0.5) * 2);
    const colorStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(activeColor.l)}%)`;
    const isLight = opticsObj.mid.l > 80;
    return `radial-gradient(circle at ${lPos.x}% ${lPos.y}%, ${isLight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)'} 0%, ${colorStr} ${lerp(30, 60, normalizedDist)}%, #000 100%)`;
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden">
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold text-white">HI-TEC <span className="text-blue-400 font-normal">Studio 3.0</span></h1>
        </div>
        <button className="flex items-center space-x-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-bold text-sm transition-colors shadow-lg"><FolderOpen size={14} /><span>엑셀 DB 동기화</span></button>
      </header>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:overflow-hidden h-auto lg:h-[calc(100vh-72px)] overflow-y-auto">
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center"><Sliders className="text-blue-600 mr-2" size={20} />공식 배합 시트 (B2:D20)</h2>
              {isBaseConfirmed && <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-1 rounded flex items-center"><Lock size={12} className="mr-1"/> 시트 고정됨</span>}
            </div>
            <div className="flex items-center space-x-2">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력" className="bg-white border border-slate-300 px-3 py-2 rounded-md text-sm font-bold text-slate-800 focus:outline-none flex-1 uppercase shadow-inner" />
              <button onClick={handleConfirmBase} disabled={isBaseConfirmed} className={`px-3 py-2 rounded-md text-sm font-bold flex items-center shadow-md transition-colors ${isBaseConfirmed ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}><Lock size={14} className="mr-1"/><span>기준 확정</span></button>
              <button onClick={handleClearAll} className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-md text-sm font-bold flex items-center transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 bg-white space-y-4 max-h-[500px] lg:max-h-none">
            <div className="space-y-3">
              <div className="text-sm font-black text-slate-500 mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  <span className="mr-2 text-xs font-bold text-purple-700">3Coat (펄) 모드</span>
                  <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                  <div className={`block w-8 h-5 rounded-full transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                </label>
              </div>

              {toners.map((toner) => {
                const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '');
                return (
                  <div key={toner.id} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-md border border-slate-200">
                    <div className="col-span-4 relative flex items-center">
                      <div className="w-6 h-4 rounded shadow-sm border border-slate-400 mr-2 flex overflow-hidden shrink-0 cursor-pointer" onClick={() => setSelectedTonerForView(toner.code)}>
                        <div className="flex-1" style={visuals.macroStyle}></div>
                        <div className="flex-1" style={visuals.smoothStyle}></div>
                      </div>
                      <input type="text" value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} className="w-full bg-white text-slate-900 text-xs font-black p-1 border rounded uppercase" />
                    </div>
                    <div className="col-span-5 text-xs font-bold text-blue-700 truncate">{toner.role}</div>
                    <div className="col-span-3 flex items-center justify-end space-x-1">
                      <input type="text" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} className="w-14 text-right p-1 text-xs border rounded font-bold" />
                      <span className="text-xs text-slate-400">g</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {isThreeCoatMode && (
              <div className="pt-4 border-t-2 border-dashed border-purple-200 space-y-3">
                <div className="text-sm font-black text-purple-700 mb-2">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '');
                  return (
                    <div key={toner.id} className="grid grid-cols-12 gap-2 items-center bg-purple-50/40 p-2 rounded-md border border-purple-100">
                      <div className="col-span-4 relative flex items-center">
                        <div className="w-6 h-4 rounded shadow-sm border border-slate-400 mr-2 flex overflow-hidden shrink-0" onClick={() => setSelectedTonerForView(toner.code)}>
                          <div className="flex-1" style={visuals.macroStyle}></div>
                          <div className="flex-1" style={visuals.smoothStyle}></div>
                        </div>
                        <input type="text" value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} className="w-full bg-white text-slate-900 text-xs font-black p-1 border rounded uppercase" />
                      </div>
                      <div className="col-span-5 text-xs font-bold text-purple-700 truncate">{toner.role}</div>
                      <div className="col-span-3 flex items-center justify-end space-x-1">
                        <input type="text" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)} className="w-14 text-right p-1 text-xs border rounded font-bold" />
                        <span className="text-xs text-slate-400">g</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="p-3 bg-slate-800 text-slate-100 flex justify-between items-center shrink-0 font-bold text-sm">
             <span className="text-slate-400">TOTAL WEIGHT (BASE + PEARL)</span>
             <span className="text-lg text-cyan-400">{totalFinalWeight} g</span>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-4">
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xl shrink-0">
            <h3 className="text-sm font-bold mb-3 flex justify-between items-center border-b pb-2 text-slate-800">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={16} />멀티 시각화 렌더링 비교 (Multi-View)</span>
              <button onClick={() => { if(isBaseConfirmed) setIsConfiguratorOpen(true); }} className="text-[11px] bg-slate-100 px-2 py-1 rounded border font-bold text-blue-600 flex items-center"><Maximize size={10} className="mr-1"/>확장 뷰어</button>
            </h3>
            
            <div className="space-y-3">
              <div>
                 <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1"><span>A. 베이스 코트 (Ground Coat)</span><span>{totalBaseWeight}g</span></div>
                 <div className="h-10 rounded-lg border relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}>
                   {baseOptics.isMetallic && <div className="metallic-flake opacity-40"></div>}
                 </div>
              </div>

              {isThreeCoatMode && (
                <div>
                   <div className="flex justify-between text-[11px] font-bold text-purple-600 mb-1"><span>B. 펄 코트 (Mid Coat)</span><span>{totalPearlWeight}g</span></div>
                   <div className="h-10 rounded-lg border relative overflow-hidden" style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` : '#f1f5f9' }}>
                     {isBaseConfirmed && pearlOptics.isMetallic && <div className="metallic-flake opacity-50"></div>}
                     {!isBaseConfirmed && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 bg-slate-100 font-bold">확정 대기중</div>}
                   </div>
                </div>
              )}

              <div>
                 <div className="flex justify-between text-[11px] font-bold text-blue-600 mb-1"><span>C. 최종 3코트 결합 (FINAL COLOR)</span><span>{totalFinalWeight}g</span></div>
                 <div className="h-12 rounded-lg border relative overflow-hidden" style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` : '#f1f5f9' }}>
                   {isBaseConfirmed && finalOptics.isMetallic && <div className="metallic-flake opacity-50"></div>}
                   {!isBaseConfirmed && <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-400 bg-slate-100 font-bold">확정 대기중</div>}
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 flex flex-col flex-1 h-[350px] lg:h-full shadow-xl overflow-hidden">
            <h3 className="text-xs font-bold flex items-center mb-2 text-slate-700"><BrainCircuit className="text-blue-600 mr-2" size={16} />엔진 터미널 (VBA Macro Engine)</h3>
            <div ref={chatContainerRef} className="flex-1 bg-slate-50 border p-3 overflow-y-auto mb-2 space-y-3 rounded-lg text-xs shadow-inner">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`p-2 rounded border ${msg.type === 'system' ? 'bg-slate-800 border-slate-700 text-slate-100' : msg.type === 'user' ? 'bg-blue-600 text-white ml-6' : 'bg-white text-slate-800 mr-6'}`}>
                   <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
                </div>
              ))}
            </div>
            <div className="flex space-x-2 shrink-0">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskSolution()} placeholder="명령어 입력 (예: WT144 0.5g 추가)" className="w-full bg-white border rounded p-2 text-xs focus:outline-none" />
              <button onClick={handleVoiceCommand} className="bg-slate-200 p-2 rounded text-slate-700 hover:bg-slate-300"><Mic size={16}/></button>
              <button onClick={handleAskSolution} className="bg-blue-600 text-white px-4 rounded font-bold text-xs">실행</button>
            </div>
          </div>
        </div>
      </div>

      {selectedTonerForView && TONER_DB[selectedTonerForView] && (() => {
        const info = TONER_DB[selectedTonerForView];
        const visuals = getTonerVisuals(selectedTonerForView, info.role, info.desc);
        return (
          <div className="fixed inset-0 bg-slate-900/80 z-[120] flex items-center justify-center p-4 backdrop-blur-xs">
             <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-2xl border">
                <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                   <h3 className="font-bold text-sm flex items-center"><Droplet className="mr-2 text-blue-400" size={16}/> 안료 정밀 분석</h3>
                   <button onClick={() => setSelectedTonerForView(null)}><X size={20}/></button>
                </div>
                <div className="p-4 space-y-4">
                   <div className="text-xl font-black text-blue-700">{selectedTonerForView} [{info.role}]</div>
                   <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded border font-medium leading-relaxed">{info.desc}</p>
                   <div className="grid grid-cols-2 gap-3">
                      <div>
                         <div className="text-[10px] font-bold text-slate-400 mb-1">매크로 입자 (Macro)</div>
                         <div className="h-24 rounded border shadow-inner" style={visuals.macroStyle}></div>
                      </div>
                      <div>
                         <div className="text-[10px] font-bold text-slate-400 mb-1">색상 변환 (Travel)</div>
                         <div className="h-24 rounded border shadow-inner" style={visuals.smoothStyle}></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      })()}

      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white backdrop-blur-md select-none animate-fade-in">
          <header className="p-4 flex justify-between items-center bg-black/40 border-b border-slate-800">
            <h2 className="text-sm font-bold tracking-wider text-slate-300 flex items-center"><Camera className="mr-2 text-blue-500" size={16}/> HI-TEC MULTI 3D VIEW</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-1 bg-slate-800 hover:bg-red-500 rounded-full border border-slate-700"><X size={20}/></button>
          </header>
          <main ref={viewerRef} className="flex-1 flex flex-col lg:flex-row gap-4 p-4 items-center justify-center relative cursor-crosshair h-full" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)}>
             <div className="absolute z-50 pointer-events-none transition-transform duration-75" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-[0_0_30px_#fff] border border-white/40"><Sun className="text-yellow-100" size={24} /></div>
             </div>
             <div className="w-full lg:flex-1 h-1/3 lg:h-[80%] rounded-xl border border-slate-800 relative overflow-hidden shadow-2xl" style={{ background: getInteractiveBackground(baseOptics, lightPos) }}>
                <div className="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded text-[11px] font-bold border border-slate-600">A. 베이스 코트 (Ground)</div>
             </div>
             {isThreeCoatMode && (
               <div className="w-full lg:flex-1 h-1/3 lg:h-[80%] rounded-xl border border-purple-900 relative overflow-hidden shadow-2xl" style={{ background: getInteractiveBackground(pearlOptics, lightPos) }}>
                  <div className="absolute top-3 left-3 bg-purple-950/80 px-2 py-1 rounded text-[11px] font-bold border border-purple-500">B. 펄 코트 (Mid-coat)</div>
               </div>
             )}
             <div className="w-full lg:flex-1 h-1/3 lg:h-[80%] rounded-xl border border-blue-900 relative overflow-hidden shadow-2xl" style={{ background: getInteractiveBackground(finalOptics, lightPos) }}>
                <div className="absolute top-3 left-3 bg-blue-950/80 px-2 py-1 rounded text-[11px] font-bold border border-blue-500">C. 최종 3코트 결합</div>
             </div>
             <div className="absolute bottom-4 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-700 text-[11px] text-center text-blue-400 font-bold">화면의 빈 공간을 터치하거나 마우스로 드래그하면 광원의 위치(각도)가 실시간 보정됩니다.</div>
          </main>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #000; }
        .metallic-flake {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; mix-blend-mode: color-dodge;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.98' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)' opacity='0.7'/%3E%3C/svg%3E");
        }
      `}} />
    </div>
  );
}
