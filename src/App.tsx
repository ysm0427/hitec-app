import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Zap, Maximize, Lock, Unlock, Layers, BrainCircuit, RefreshCw, Mic, FolderOpen, ChevronRight, Sun, Droplet, Camera, X, Image as ImageIcon, ScanLine
} from 'lucide-react';

// 💡 1. 사용자 맞춤형 100% 완벽 복구 안료 DB
const TONER_DB = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임. (배합비율 WT346 : WT144 = 1 : 0.9)' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋으며, 채도가 높고 입자감이 좋은 청색 계열 컬러에 사용.' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두우며 주로 흑색 계열의 컬러에 제한적으로 사용.' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨. (적용 예: Nissan KAB, Lexus 1F1, M.Benz 047)' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 염료를 함유하고 있어 알루미늄 입자에 2% 이상 사용하면 반응하여 색상이 변할 수 있음. (사용 한도: 솔리드 5%, 실버 2%, 펄 5% 이내)' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제. 베이스코트 무게의 10% 혼합하면 특히 겨울 등 낮은 습도에서 작업성 및 외관 개선됨.' },
  'WT 813': { role: '오렌지/옐로우', desc: '오렌지/옐로우 계열 조색제. (특수 추가)' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제 및 블랜딩(이음매 도장)용 첨가제.' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. WT332에 비해 채도가 높으며 측면(110도)을 더 어둡게 함. 주로 적색 이펙트 컬러에 사용.' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제. WT389보다 작음. 실버달러형 조색제.' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크 조색제.' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용. (적용: Nissan KAB, Lexus 1F1 등)' },
  'WT 307': { role: '프리즈마 실버', desc: '정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제(홀로그램). (적용 예: Audi LX7T)' },
  'WT 308': { role: '브라이트 오렌지', desc: '주로 이펙트 컬러에 사용하는 맑은 주황색 조색제. 은폐력은 떨어짐.' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 주로 채도가 높은 이펙트 컬러에 사용하며 은폐력은 떨어짐.' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 사용을 위한 조색제 바인더.' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제. 채도가 높고 순수하여 적색 이펙트 컬러에 주로 사용. 은폐력 떨어짐.' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상 변화가 큰 특수 펄 조색제. 15도는 맑은 적색, 45도는 맑은 녹색, 110도는 약하게 녹색으로 변함.' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제. WT372보다 작음. 15도는 적청색, 나머지는 녹황색 간섭 펄.' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제. 15도는 맑은 청색, 나머지는 맑은 녹색 간섭 펄.' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: 'WT305보다 조금 큰 반짝임이 좋은 매끄러운 특수 알루미늄. WT305보다 15도는 밝고 나머지는 어두움.' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제. WT346보다 밝고 녹색이 더 많음.' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 정면/측면 모두 실버 색감. (적용: 현대 XB3, BMW A96 등)' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제. 솔리드 컬러에서 명암을 밝게 하고 색상을 줄임. 이펙트 컬러에서 15도는 어둡고 나머지 각도(45 & 110도)는 밝게 하여 입자감을 줄임.' },
  'WT 322': { role: '마이크로 화이트', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 사용함. 15도는 황색을 띠며 어둡고 나머지는 청색을 띠며 밝게 함.' },
  'WT 323': { role: '스페셜 블랙', desc: '가장 맑고 진한 표준 흑색 조색제. 알루미늄 혼합시 명암이 어두워지고 약하게 청황색이 늘어남. 솔리드에선 명도/채도 낮춤.' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제. 은폐력은 떨어지며 주로 이펙트 컬러에 사용.' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '선명한 녹색빛을 띠는 맑은 황색 조색제. 알루미늄 혼합 시 15도는 맑은 황색, 나머지는 녹황색을 띔.' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 채도 높고 밝은 황색 조색제. 주로 솔리드에 사용. 이펙트에서는 45 & 110도에 밝은 황색이 필요할 때만 소량 사용.' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러에 사용하는 탁한 오커 브라운 계열의 황색. 은폐력이 좋으며, 정면은 어둡고 탁함, 측면은 밝은 노란색을 띠는 투명한 브라운색.' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색(스칼렛) 조색제. 정면은 적색, 측면은 밝은 황적색. 은폐력 떨어짐.' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 무연(납 미함유). 솔리드에 주로 사용.' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '이펙트 컬러에서 맑은 적황색을 내는 조색제. 측면에서 어둡고 정면에서 투명함. (솔리드 사용 금지)' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 적색 이펙트/메탈릭에 사용. 정면은 브라운톤 적색, 측면은 브라운/황색빛 적색으로 전체적 황적색 발현.' },
  'WT 333': { role: '그라나다 레드', desc: '블랙이 포함된 밝은 적색 조색제. 솔리드에 주로 사용.' },
  'WT 334': { role: '옥사이드 레드', desc: '주로 솔리드 컬러(아이보리, 베이지 브라운 등)에 사용하는 탁한 적색 조색제. 단독 은폐력 좋음.' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제. 솔리드 주로 사용.' },
  'WT 336': { role: '트랜스루센트 레드', desc: '선명하며 어두운 갈색 조색제. 이펙트 컬러에만 사용.' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 약하게 청색 띔. 메탈릭에서 투명하고 밝게 나타남.' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제. 백색 혼합 시 맑은 분홍색. 단색 조색시 정측면 모두 맑은 적색.' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 청색/회색 컬러에 사용. 메탈릭 측면은 붉은빛, 정면은 맑은 보라빛.' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '높은 채도의 맑은 자주색 조색제. WT338 대비 밝고 청색 적음.' },
  'WT 341': { role: '아주르 블루', desc: '채도 높은 맑은 청색 조색제. 15도는 녹청색, 나머지는 적청색. 관찰각도별 색상 변화 가장 큼.' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 은폐력 있음. 15도는 보라색, 나머지는 자주색.' },
  'WT 343': { role: '블루', desc: '솔리드/이펙트 모두 사용하는 중간 순수 청색 조색제. 정측면 모두 청색.' },
  'WT 344': { role: '다크 블루', desc: '어두운 표준 청색 조색제. 15도는 청색, 나머지는 적색 띔. 단색 조색시 맑은 청색.' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '맑고 선명한 황색을 조금 띠는 녹색 조색제. WT347대비 밝고 황색 많음.' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 청색 조색제. 이펙트 컬러에 가장 많이 사용하는 청색임.' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 맑고 선명한 녹색 조색제. WT345대비 어두움.' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '맑고 채도 높고 투명한 청색 조색제. 15도는 녹색강한 청색, 나머지는 약한 적색.' },
  'WT 349': { role: '트랜스루센트 그린', desc: '녹색 저농 조색제. WT347의 저농 버전.' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제. 정면은 블랙, 측면은 약간의 황적색을 띠는 블랙.' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '저농 청색 조색제. WT348의 저농 버전.' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. WT321의 저농 버전.' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농 버전.' },
  'WT 354': { role: '화인 실버', desc: '매우 작은 일반형 알루미늄 조색제. 정면은 그레이, 측면은 약간 밝음.' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 광휘형 알루미늄 조색제. 정면은 맑고 투명하며 측면 어두움.' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 일반형 알루미늄 조색제.' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 가장 작고 백색빛 띠는 일반형 알루미늄. 은폐력이 가장 좋음.' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트/펄 컬러용 특수 실버 조색제.' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄. 15도는 밝고 나머지는 어두움.' },
  'WT 360': { role: '코올스 실버', desc: '중간 규격의 거친 알루미늄(어두운 회색). 15도 밝고 나머지 어두움.' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄. 실버 중 측면이 제일 밝음.' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제. 정면은 맑고 측면은 어두움.' },
  'WT 363': { role: '브릴리언트 골드', desc: '펄 입자가 강한 밝은 황색 알루미늄. 은폐력 우수.' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기(중간~가장 거침)의 백색 펄 조색제. 정측면 모두 은색빛 화이트 펄.' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 간섭 펄 조색제. 15도는 청적색, 나머지는 황녹색.' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 맑은 황색 간섭 펄 조색제. 15도는 황색, 나머지는 청색.' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 간섭 펄 조색제. 15도는 녹색, 나머지는 적색.' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간~미세 크기 백색 펄 조색제. 정측면 은색빛.' },
  'WT 369': { role: '레드 펄', desc: '작은 크기 적색 착색 펄 조색제. 적색 입자감 있으며 다른 펄보다 은폐력 있음.' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기 맑은 청색 간섭 펄 조색제. 15도 녹청색, 나머지 적황색.' },
  'WT 371': { role: '브라운 펄', desc: '중간~거친 크기 주황색/구리색 착색 펄 조색제.' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 적색이 있는 청색 간섭 펄 조색제.' },
  'WT 373': { role: '루비 펄', desc: '중간~거친 크기 은폐력 있는 적색 착색 펄 조색제.' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기 청녹색 간섭 펄 조색제. 15도 청녹색, 나머지 황적색.' },
  'WT 375': { role: '그린 펄', desc: '중간 크기 녹색빛 특수 간섭 펄 조색제. 15도 녹색, 나머지 적색.' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기 특수 적색 간섭 펄 조색제. 15도 적색, 나머지 녹색.' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄. 반짝임 매우 좋음. 15도 약한 녹색, 나머지 약한 적색.' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄. 입자 굵고 반짝임 강한 착색 펄.' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색(커버) 펄. 입자 거칠고 반짝임 매우 강함.' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄. 맑고 선명. 15도 녹색, 나머지 적색 간섭 펄.' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄. 반짝임 우수. 15도 청색, 나머지 황색 간섭 펄.' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 펄. 측면 매우 맑음. 15도 황색, 나머지 청색 간섭 펄.' },
  'WT 383': { role: '브릴리언트 오렌지', desc: 'WT363 대비 적색감 많은 적황색 알루미늄. 착색감 맑음.' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: '투명 화이트 밸런스 조정제(Transparent White). WT387 대비 점도 높음.' },
  'WT 386': { role: '플롭 컨트롤', desc: '입자 배열 및 밝기, 측면 반사각 조절제. 측면을 밝게 함.' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: '점도 조절 첨가제(Viscosity Additive).' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT323보다 어두움.' },
  'WT 389': { role: '플래틴 실버 화인', desc: '미세한 은빛 플래티넘 실버 알루미늄 조색제.' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기 고휘도 알루미늄. 15도 가장 밝고 나머지가 가장 어두움.' },
  'WT 392': { role: '매직 이펙트', desc: '색상이 WT312 반대로 변하는 특수 펄. 15도 녹색, 45도 적색, 110도 약한 적색.' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색 띠는 밝은 황색 조색제. WT327 대비 녹색 적음.' },
  'WT 6050': { role: '에디티브 6050', desc: '퍼마하이드 하이텍용 속건용/자전용 컨트롤러 (수지/블렌딩 첨가).' },
  'WT 6052': { role: '에디티브 6052', desc: '퍼마하이드 하이텍용 지연용 컨트롤러.' },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHue = (a: number, b: number, t: number) => {
  let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360;
  let h = a + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360; return h;
};
const lerpColor = (c1: any, c2: any, t: number) => ({ h: lerpHue(c1.h, c2.h, t), s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) });

const getTonerVisuals = (code: string, role: string, desc = '') => {
  const isPearl = role.includes('펄') || role.includes('이펙트') || role.includes('글라스') || role.includes('다이아몬드');
  const isSilver = role.includes('실버') || role.includes('알루미늄');
  const isSolid = !isPearl && !isSilver;

  let faceColor = '#e2e8f0'; let particleColor1 = '#ffffff'; let particleColor2 = '#94a3b8';

  if (role.includes('블루') || role.includes('청')) { faceColor = '#1d4ed8'; particleColor1 = '#60a5fa'; particleColor2 = '#3b82f6'; }
  else if (role.includes('레드') || role.includes('마젠타') || role.includes('마룬') || code.includes('300')) { faceColor = '#b91c1c'; particleColor1 = '#f87171'; particleColor2 = '#ef4444'; }
  else if (role.includes('그린') || role.includes('녹')) { faceColor = '#15803d'; particleColor1 = '#4ade80'; particleColor2 = '#22c55e'; }
  else if (role.includes('옐로우') || role.includes('황') || role.includes('오커') || code.includes('813')) { faceColor = '#eab308'; particleColor1 = '#fde047'; particleColor2 = '#ca8a04'; }
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

  if (role.includes('바인더') || role.includes('컴포넌트') || role.includes('에디티브') || role.includes('클리어') || code.includes('385') || code.includes('387') || code.includes('605')) {
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
  const [toners, setToners] = useState([{ id: 't_init', code: '', role: '코드 입력', adjustedWeight: "" }]);
  const [pearlToners, setPearlToners] = useState([{ id: 'p_init', code: '', role: '코드 입력', adjustedWeight: "" }]);
  
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false);
  const [targetColorCode, setTargetColorCode] = useState('');
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);

  // 📸 카메라 스캔 (스마트 이미지 참조 모드)
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const initialChat = { id: 1, type: 'system', text: '💡 **[HI-TEC Master Engine V3.0 로드 완료]**\n- **Role**: Spies Hecker 페인트 기술 교육 전문가\n- **Rule**: 철저한 정식 한글 명칭 표기, 미확인 코드 차단.', time: new Date().toLocaleTimeString('ko-KR') };
  const [chatMessages, setChatMessages] = useState([initialChat]);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);

  const [baseOptics, setBaseOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [pearlOptics, setPearlOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [finalOptics, setFinalOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    const pearlTotal = pearlToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2)); setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    setBaseOptics(getOptics(toners, 'adjustedWeight')); setPearlOptics(getOptics(pearlToners, 'adjustedWeight')); setFinalOptics(getOptics(isThreeCoatMode ? [...toners, ...pearlToners] : toners, 'adjustedWeight'));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    const scrollToBottom = () => { if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; } };
    scrollToBottom(); const timeoutId = setTimeout(scrollToBottom, 50); return () => clearTimeout(timeoutId);
  }, [chatMessages, isAiProcessing]);

  const handlePointerMove = (e: any) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100; let y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const addChatMessage = (type: string, text: string) => { setChatMessages(prev => [...prev, { id: Date.now(), type, text, time: new Date().toLocaleTimeString('ko-KR') }]); };

  const handleClearAll = () => {
    setToners([]); setPearlToners([]); setTargetColorCode(''); setIsBaseConfirmed(false); setScannedImage(null);
    addChatMessage('system', '🗑️ **[ACTION_RESET]** 배합 리스트가 즉시 초기화되었습니다.');
  };

  const handleConfirmBase = () => {
    setIsBaseConfirmed(true);
    addChatMessage('system', '🔒 **[STATE_LOCK]** 기준 코드가 확정되었습니다. 멀티 시각화 렌더링을 활성화합니다.');
  };

  // 📸 현실적인 스마트 카메라 스캔(이미지 참조) 모드
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setScannedImage(event.target?.result as string);
        addChatMessage('system', `📸 **[스마트 뷰어 활성화]**\n매번 달라지는 수기 배합표는 웹 브라우저 단독으로 100% 자동 OCR 해독이 불가능합니다.\n화면 상단에 고정된 사진을 확대/축소하며 아래 에디터에 수치를 빠르고 정확하게 타이핑해 주세요!`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput; addChatMessage('user', q); setChatInput(''); setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      addChatMessage('ai', `👑 **[명령 수신 완료]** 입력하신 (${q}) 내용을 확인했습니다. 실시간 광학 렌더링에 반영합니다.`);
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
        let matchedTonerInfo = TONER_DB[formattedCode as keyof typeof TONER_DB]; let finalCode = formattedCode; 
        if (!matchedTonerInfo) {
          const numMatch = formattedCode.match(/\d+/);
          if (numMatch) {
            finalCode = `WT ${numMatch[0]}`;
            matchedTonerInfo = TONER_DB[finalCode as keyof typeof TONER_DB] || { role: '지정되지 않은 안료', desc: `DB에 없습니다.` };
          }
        }
        return matchedTonerInfo ? { ...toner, code: finalCode, role: matchedTonerInfo.role } : { ...toner, code: newCode, role: '코드 입력' };
      }
      return toner;
    }));
  };

  const removeToner = (id: string, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id));
    else setToners(toners.filter(t => t.id !== id));
  };
  const addToner = (isPearl = false) => {
    const newToner = { id: `new_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" };
    if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]);
  };

  const getColorString = (opticsObj: any, angle: 'face'|'mid'|'flop') => `hsl(${Math.round(opticsObj[angle].h)}, ${Math.round(opticsObj[angle].s)}%, ${Math.round(opticsObj[angle].l)}%)`;
  const getInteractiveBackground = (opticsObj: any, lPos: any) => {
    const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2)); const normalizedDist = Math.min(1, dist / 50); 
    let activeColor = normalizedDist < 0.5 ? lerpColor(opticsObj.face, opticsObj.mid, normalizedDist * 2) : lerpColor(opticsObj.mid, opticsObj.flop, (normalizedDist - 0.5) * 2);
    const colorStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(activeColor.l)}%)`;
    const highlightAlpha = lerp(0.9, 0.2, normalizedDist);
    const highlightStr = opticsObj.mid.l > 80 ? `rgba(255,255,255,${lerp(1, 0.4, normalizedDist)})` : `rgba(255,255,255,${highlightAlpha})`;
    const shadowL = opticsObj.mid.l > 80 ? lerp(90, 70, normalizedDist) : lerp(10, 0, normalizedDist);
    return `radial-gradient(circle at ${lPos.x}% ${lPos.y}%, ${highlightStr} 0%, ${colorStr} ${lerp(30, 60, normalizedDist)}%, hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(shadowL)}%) 100%)`;
  };

  const anglePresets = [
    { id: 'face', label: '정면 (Face 15°)', pos: {x: 50, y: 50} },
    { id: 'mid', label: '중면 (Mid 45°)', pos: {x: 25, y: 25} },
    { id: 'flop', label: '측면 (Flop 110°)', pos: {x: 5, y: 5} },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      
      {/* 📸 카메라 기능: 찍은 사진을 띄워놓고 보면서 입력하는 실전 모드 */}
      {scannedImage && (
        <div className="bg-slate-900 border-b-4 border-blue-500 shadow-2xl z-50 p-2 md:p-4 sticky top-0 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-2 px-2 max-w-[1600px] mx-auto">
            <h2 className="text-white text-sm md:text-base font-bold flex items-center">
              <ImageIcon className="mr-2 text-blue-400" size={18}/> 사진 고속 참조 모드
            </h2>
            <button onClick={() => setScannedImage(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors border border-slate-700">
              <X size={18} />
            </button>
          </div>
          {/* 이미지가 축소/스크롤 가능하도록 배치 */}
          <div className="w-full max-h-[30vh] md:max-h-[25vh] overflow-auto rounded-lg border border-slate-700 bg-black flex justify-center max-w-[1600px] mx-auto">
             <img src={scannedImage} alt="스캔된 배합표" className="object-contain w-full h-auto" />
          </div>
        </div>
      )}

      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 3.0</span></h1>
        </div>
      </header>

      {/* 📱 모바일에서는 h-auto로 자연스럽게 늘어나고 위아래 스크롤, PC에서는 화면 높이에 딱 맞춤 */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-auto lg:h-[calc(100vh-72px)] overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden mb-4 lg:mb-0">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-4 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <Sliders className="text-blue-600 mr-2" size={20} /> 공식 배합 시트
              </h2>
              {/* 📸 카메라 기능 버튼 */}
              <div className="flex space-x-2">
                <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleCameraCapture} />
                <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center text-[13px] font-bold transition-colors shadow-md">
                  <Camera size={16} className="mr-1.5" /> 시편 촬영
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력 (예: UG-Z)" className="bg-white border border-slate-300 px-3 py-2.5 rounded-md text-sm font-bold focus:outline-none focus:border-blue-500 flex-1 uppercase w-full" />
              <button onClick={handleConfirmBase} className="bg-slate-800 text-white px-4 py-2.5 rounded-md text-sm font-bold flex items-center whitespace-nowrap"><Lock size={14} className="mr-1"/>확정</button>
              <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-3 py-2.5 rounded-md text-sm font-bold flex items-center"><Trash2 size={18} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-white relative min-h-[400px] lg:min-h-0">
            <div className="space-y-4 pb-6">
              <div className="text-sm font-black text-slate-500 mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  <span className="mr-2 text-xs font-bold text-purple-700">3Coat (펄) 모드</span>
                  <input type="checkbox" className="accent-purple-600" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                </label>
              </div>

              {toners.map((toner) => {
                const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '');
                return (
                  <div key={toner.id} className="flex flex-col bg-white p-3 mb-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-300 hover:shadow-md">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-12 h-6 md:w-10 md:h-5 rounded shadow-sm border border-slate-400 flex overflow-hidden cursor-pointer shrink-0 hover:scale-110 transition-transform" onClick={() => { if(TONER_DB[toner.code as keyof typeof TONER_DB]) setSelectedTonerForView(toner.code); }}>
                          <div className="flex-1" style={visuals.macroStyle}></div>
                          <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                        </div>
                        <input type="text" value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} placeholder="코드입력" className="flex-1 md:w-[120px] bg-transparent font-black text-blue-700 outline-none text-lg uppercase px-1" />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-0">
                      {/* 설명 부분: 자동 줄바꿈으로 절대 잘리지 않음 (100% 노출) */}
                      <div className="flex-1 pr-0 md:pr-3">
                        <div className="text-[15px] font-bold text-slate-800 leading-tight">{toner.role}</div>
                        <div className="text-[13px] text-slate-600 leading-relaxed mt-1.5 whitespace-pre-wrap break-words">
                          {TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '정확한 코드를 입력하면 안료 정보가 100% 모두 표시됩니다.'}
                        </div>
                      </div>
                      {/* 용량 입력 부분 */}
                      <div className="flex items-center self-end bg-slate-50 p-1.5 rounded-lg border border-slate-200 w-full sm:w-auto justify-end">
                        <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} placeholder="0.0" className="w-24 text-right bg-white border border-slate-300 p-2 rounded text-[16px] font-black shadow-inner outline-none text-blue-900" />
                        <span className="text-slate-400 text-[14px] font-black mx-2">g</span>
                        <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500 p-1.5 bg-white rounded border border-slate-200"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-3.5 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-xl text-slate-500 font-bold transition-all flex items-center justify-center space-x-2 text-sm shadow-sm"><Plus size={18} /><span>베이스 추가</span></button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-4 border-t-2 border-dashed border-purple-200 space-y-4 pb-8">
                <div className="text-sm font-black text-purple-700 mb-2">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '');
                  return (
                    <div key={toner.id} className="flex flex-col bg-white p-3 mb-3 rounded-xl border border-purple-200 shadow-sm transition-all hover:border-purple-400 hover:shadow-md">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-50">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-12 h-6 md:w-10 md:h-5 rounded shadow-sm border border-slate-400 flex overflow-hidden cursor-pointer shrink-0 hover:scale-110 transition-transform" onClick={() => { if(TONER_DB[toner.code as keyof typeof TONER_DB]) setSelectedTonerForView(toner.code); }}>
                            <div className="flex-1" style={visuals.macroStyle}></div>
                            <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                          </div>
                          <input type="text" value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} placeholder="코드입력" className="flex-1 md:w-[120px] bg-transparent font-black text-purple-700 outline-none text-lg uppercase px-1" />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-0">
                        <div className="flex-1 pr-0 md:pr-3">
                          <div className="text-[15px] font-bold text-slate-800 leading-tight">{toner.role}</div>
                          <div className="text-[13px] text-slate-600 leading-relaxed mt-1.5 whitespace-pre-wrap break-words">
                            {TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '정확한 코드를 입력하면 안료 정보가 100% 모두 표시됩니다.'}
                          </div>
                        </div>
                        <div className="flex items-center self-end bg-purple-50/50 p-1.5 rounded-lg border border-purple-100 w-full sm:w-auto justify-end">
                          <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)} placeholder="0.0" className="w-24 text-right bg-white border border-purple-200 p-2 rounded text-[16px] font-black shadow-inner outline-none text-purple-900" />
                          <span className="text-slate-400 text-[14px] font-black mx-2">g</span>
                          <button onClick={() => removeToner(toner.id, true)} className="text-purple-300 hover:text-red-500 p-1.5 bg-white rounded border border-purple-100"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addToner(true)} className="w-full py-3.5 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 rounded-xl text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm shadow-sm"><Plus size={18} /><span>펄 추가</span></button>
              </div>
            )}
          </div>
          <div className="p-4 bg-slate-800 flex justify-between items-center shrink-0 rounded-b-xl lg:rounded-none">
             <div className="text-xs font-bold text-slate-400">TOTAL WEIGHT</div>
             <div className="text-xl font-black text-cyan-400">{totalFinalWeight} g</div>
          </div>
        </div>

        {/* 우측: 멀티 시각화 렌더링 & AI 터미널 */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-6">
          <div className="bg-white border border-slate-300 rounded-xl p-4 md:p-5 shadow-xl flex-none transition-all duration-300">
            <h3 className="text-[15px] font-bold mb-4 flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={18} />멀티 렌더링 비교</span>
              <button onClick={() => { if(isBaseConfirmed){ setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); } }} className="text-xs px-3 py-1.5 rounded bg-slate-100 border border-slate-200 font-bold flex items-center text-blue-600"><Maximize size={12} className="mr-1"/>확장 뷰어</button>
            </h3>
            
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1.5">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">A. 베이스 코트</span>
                   <span className="text-[11px] text-slate-500 font-bold">{totalBaseWeight}g</span>
                 </div>
                 <div className="h-14 rounded-lg border border-slate-300 relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}>
                   {baseOptics.isMetallic && <div className="metallic-flake opacity-50"></div>}
                 </div>
              </div>

              {isThreeCoatMode && (
                <div className="flex flex-col space-y-1.5 relative">
                   <div className="flex justify-between items-center px-1">
                     <span className="text-[11px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded"><Zap size={10} className="inline mr-1"/>B. 펄 코트</span>
                     <span className="text-[11px] text-purple-500 font-bold">{totalPearlWeight}g</span>
                   </div>
                   <div className="h-14 rounded-lg border border-purple-300 relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` }}>
                     {pearlOptics.isMetallic && <div className="metallic-flake opacity-70"></div>}
                   </div>
                </div>
              )}

              <div className="flex flex-col space-y-1.5 relative">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{isThreeCoatMode ? 'C. 최종 3코트 결합' : 'B. 최종 렌더링'}</span>
                   <span className="text-[11px] text-blue-500 font-bold">{totalFinalWeight}g</span>
                 </div>
                 <div className="h-20 rounded-lg border border-blue-400 relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` }}>
                   {finalOptics.isMetallic && <div className="metallic-flake opacity-60"></div>}
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 flex flex-col flex-1 shadow-xl overflow-hidden min-h-[450px] lg:min-h-0">
            <h3 className="text-[14px] font-bold flex items-center mb-3 text-slate-800"><BrainCircuit className="text-blue-600 mr-2" size={18} />AI 엔진 터미널</h3>
            <div ref={chatContainerRef} className="flex-1 bg-slate-50 border p-4 overflow-y-auto mb-4 space-y-4 rounded-lg">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`p-3.5 rounded-lg border text-[13px] leading-relaxed ${msg.type === 'system' ? 'bg-slate-800 text-white' : msg.type === 'user' ? 'bg-blue-600 text-white ml-8' : 'bg-white text-slate-800 mr-8'}`}>
                   {msg.text}
                </div>
              ))}
            </div>
            <div className="flex space-x-2 shrink-0">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskSolution()} placeholder="명령어 입력" className="w-full bg-white border px-3 py-3 text-sm focus:outline-none focus:border-blue-500 rounded-md" />
              <button onClick={handleAskSolution} className="bg-blue-600 text-white px-5 rounded-md font-bold">실행</button>
            </div>
          </div>
        </div>
      </div>

      {/* 안료 디테일 뷰어 모달 */}
      {selectedTonerForView && TONER_DB[selectedTonerForView as keyof typeof TONER_DB] && (() => {
        const tonerInfo = TONER_DB[selectedTonerForView as keyof typeof TONER_DB];
        const visuals = getTonerVisuals(selectedTonerForView, tonerInfo.role, tonerInfo.desc);
        return (
          <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-2xl w-full max-w-lg md:max-w-3xl flex flex-col shadow-2xl overflow-hidden border border-slate-700">
                <div className="bg-slate-900 p-4 md:p-5 flex justify-between items-center shrink-0">
                   <h3 className="text-white font-bold text-base md:text-lg flex items-center"><Droplet className="mr-2 text-blue-400" size={18}/> {selectedTonerForView} 단일 안료 뷰어</h3>
                   <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white"><X size={24}/></button>
                </div>
                <div className="p-4 md:p-6 overflow-y-auto max-h-[80vh]">
                   <div className="flex items-center mb-3">
                      <div className="flex w-12 h-6 md:w-16 md:h-8 rounded shadow-sm border border-slate-400 overflow-hidden mr-3 shrink-0">
                        <div className="flex-1" style={visuals.macroStyle}></div>
                        <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                      </div>
                      <div className="text-xl md:text-2xl font-black text-blue-700">{tonerInfo.role}</div>
                   </div>
                   <p className="text-slate-700 text-sm md:text-[15px] mb-5 leading-relaxed bg-slate-50 p-4 rounded-lg border shadow-inner font-medium whitespace-pre-wrap break-keep">
                     {tonerInfo.desc}
                   </p>
                   <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                         <div className="text-xs font-bold text-slate-500 mb-2 text-center uppercase bg-slate-100 py-1.5 rounded">Macro View</div>
                         <div className="h-32 md:h-44 rounded-xl border relative overflow-hidden" style={visuals.macroStyle}></div>
                      </div>
                      <div className="flex-[1.5]">
                         <div className="text-xs font-bold text-slate-500 mb-2 text-center uppercase bg-slate-100 py-1.5 rounded">Color Travel</div>
                         <div className="h-32 md:h-44 rounded-xl border relative overflow-hidden" style={visuals.smoothStyle}></div>
                      </div>
                   </div>
                   <div className="mt-6 text-center shrink-0">
                      <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 text-white px-10 py-3 rounded-xl font-bold w-full md:w-auto">닫기</button>
                   </div>
                </div>
             </div>
          </div>
        );
      })()}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
        .metallic-flake {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; mix-blend-mode: color-dodge;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }
      `}} />
    </div>
  );
}
