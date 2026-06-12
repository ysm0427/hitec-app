import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Zap, Maximize, Lock, Unlock, Layers, BrainCircuit, RefreshCw, Mic, FolderOpen, ChevronRight, Sun, Droplet, Camera, X, Image as ImageIcon, ScanLine, Beaker
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
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭(Xirallic) 백색 펄. 반짝임 매우 좋음. 15도 약한 녹색, 나머지 약한 적색.' },
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

// 💡 2. 리얼 3D 프랙탈 노이즈 기반 실제 안료 질감 렌더러
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
    if (desc.includes('녹황색') || desc.includes('황녹색')) { flopColor = '#65a30d'; }
    else if (desc.includes('적황색') || desc.includes('황적색')) { flopColor = '#ea580c'; }
    else if (desc.includes('적색') || desc.includes('마젠타') || desc.includes('적청색')) { flopColor = '#991b1b'; }
    else if (desc.includes('녹색') || desc.includes('청녹색')) { flopColor = '#166534'; }
    else if (desc.includes('청색') || desc.includes('적청색')) { flopColor = '#1e3a8a'; }
    else if (desc.includes('황색')) { flopColor = '#b45309'; }
    else if (isSilver) flopColor = '#334155';
  }

  if (role.includes('바인더') || role.includes('컴포넌트') || role.includes('에디티브') || role.includes('클리어') || code.includes('385') || code.includes('387') || code.includes('605')) {
    return { smoothStyle: { background: 'rgba(255,255,255,0.8)', border: '1px dashed #cbd5e1' }, macroStyle: { background: 'rgba(255,255,255,0.8)', border: '1px dashed #cbd5e1' } };
  }

  let smoothStyle = { background: `linear-gradient(135deg, ${faceColor} 0%, ${isSolid ? 'rgba(0,0,0,0.4)' : flopColor} 100%)` };
  let macroStyle: any = { backgroundColor: faceColor };

  if (!isSolid) {
    let type = 'general';
    if (role.includes('질라릭') || role.includes('다이아몬드')) type = 'xirallic';
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('글라스')) type = 'pearl';
    else if (role.includes('엑스트라 화인') || role.includes('울트라 파인') || role.includes('마이크로') || desc.includes('매우 작')) type = 'silver_fine';
    else if (role.includes('코올스') || role.includes('큰') || role.includes('스파클') || desc.includes('거친')) type = 'silver_coarse';
    
    let baseFreq = '0.5', alphaMult = '5', surfaceScale = '3';
    if (type === 'xirallic') { baseFreq = '0.7'; alphaMult = '12'; surfaceScale = '8'; }
    else if (type === 'pearl') { baseFreq = '0.35'; alphaMult = '7'; surfaceScale = '4'; } 
    else if (type === 'silver_fine') { baseFreq = '0.9'; alphaMult = '4'; surfaceScale = '2'; } 
    else if (type === 'silver_coarse') { baseFreq = '0.15'; alphaMult = '9'; surfaceScale = '6'; }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3" result="t"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -2" in="t" result="c"/><feSpecularLighting in="t" surfaceScale="${surfaceScale}" specularConstant="1.5" specularExponent="30" lighting-color="#fff"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting><feComposite in2="c" operator="in" result="s"/><feMerge><feMergeNode in="c"/><feMergeNode in="s"/></feMerge></filter><rect width="100%" height="100%" fill="${encodeURIComponent(faceColor)}"/><rect width="100%" height="100%" filter="url(#f)" opacity="0.8"/></svg>`;
    
    macroStyle = {
        backgroundImage: `url('data:image/svg+xml;utf8,${svg}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
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

  // 💡 Auto Focus 처리용 State
  const [focusTarget, setFocusTarget] = useState<{ id: string, type: 'base' | 'pearl' } | null>(null);

  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const initialChat = { id: 1, type: 'system', text: '💡 **[HI-TEC Master Engine V3.0 로드 완료]**\n- **Role**: Spies Hecker 페인트 기술 교육 전문가\n- **Rule**: 철저한 정식 한글 명칭 표기, 미확인 코드 차단.', time: new Date().toLocaleTimeString('ko-KR') };
  const [chatMessages, setChatMessages] = useState([initialChat]);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);

  const [baseOptics, setBaseOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [pearlOptics, setPearlOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [finalOptics, setFinalOptics] = useState({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });

  // 💡 6052 계산 로직을 위한 State (메탈릭 여부)
  const [isBaseMetallic, setIsBaseMetallic] = useState(false);
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);

  // 💡 Tesseract.js (진짜 OCR 라이브러리) 동적 로드
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

    // 메탈릭 판별 로직 (6052 계산용)
    const checkMetallic = (tonerList: any[]) => tonerList.some(t => {
      const role = TONER_DB[t.code as keyof typeof TONER_DB]?.role || '';
      return role.includes('실버') || role.includes('알루미늄') || role.includes('펄') || role.includes('이펙트') || role.includes('다이아몬드') || role.includes('글라스');
    });

    setIsBaseMetallic(checkMetallic(toners));
    setIsPearlMetallic(checkMetallic(pearlToners));

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

  // 📸 진짜 OCR 스캔 핸들러 (Tesseract.js 연동 & 정규식 고도화)
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setScannedImage(imageUrl);
    setIsScanning(true);
    addChatMessage('system', '⏳ **[AI 비전 엔진 가동]**\nTesseract.js 이미지 분석 모듈을 통해 문자를 추출하고 있습니다. (약 3~5초 소요)');

    try {
      if ((window as any).Tesseract) {
        // eng+kor 다국어 인식 적용
        const result = await (window as any).Tesseract.recognize(file, 'eng+kor', { logger: (m: any) => console.log(m) });
        const text = result.data.text.replace(/\s+/g, ' '); // 공백 정규화
        
        // 정규식 개선: WT 유무 상관없이 3자리/4자리 안료 번호와 수치를 유연하게 헌팅
        const regex = /(?:WT)?\s*([13468]\d{2,3})[^\d]*?(\d{1,4}(?:\.\d{1,2})?)/gi;
        let match; const found = [];
        while ((match = regex.exec(text)) !== null) {
          const code = `WT ${match[1]}`; const weight = match[2] || "0.0";
          if (TONER_DB[code as keyof typeof TONER_DB]) {
            found.push({ id: `scan_${Date.now()}_${Math.random()}`, code, role: TONER_DB[code as keyof typeof TONER_DB].role, adjustedWeight: weight });
          }
        }

        // 중복 제거
        const uniqueFound: any[] = []; const seen = new Set();
        for(let item of found) {
           if(!seen.has(item.code)) { seen.add(item.code); uniqueFound.push(item); }
        }

        if (uniqueFound.length > 0) {
          setToners(prev => [...prev.filter(t => t.code !== ''), ...uniqueFound]);
          addChatMessage('system', `📸 **[스캔 매칭 성공]**\n사진에서 총 ${uniqueFound.length}개의 안료 데이터를 읽어왔습니다.\n\n⚠️ **주의:** 손글씨 인식(프론트엔드 한계)으로 인해 오타가 섞일 수 있으니, 상단에 고정된 원본 사진을 보며 수치를 꼭 한 번씩 수정/확인해 주십시오!\n\n(인식 원문: "${text.substring(0, 30)}...")`);
        } else {
           throw new Error("코드 인식 실패");
        }
      } else {
        throw new Error("OCR 모듈 미적용");
      }
    } catch (error) {
      addChatMessage('system', `❌ **[스캔 실패]**\n현재 브라우저의 무료 AI 모듈로는 현장 수기(손글씨)를 읽어내는 데 한계가 있습니다. 상단 참조 사진을 띄워두었으니 화면을 보시면서 하단에 빠르게 타이핑해 주십시오.`);
    }
    setIsScanning(false);
  };

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput; addChatMessage('user', q); setChatInput(''); setIsAiProcessing(true);
    setTimeout(() => {
      let advice = "";
      const isIncrease = q.match(/(추가|올리|높이|많이|더|플러스)/);
      const isDecrease = q.match(/(빼|줄이|낮추|적게|덜|마이너스|감소)/);

      const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners;
      let currR=0, currB=0, currY=0, currG=0, currW=0, currS=0, currBk=0;
      activeToners.forEach(t => {
        const w = parseFloat(t.adjustedWeight) || 0; if (w <= 0) return;
        const r = t.role || ''; const c = t.code || '';
        if (r.includes('레드') || r.includes('마젠타') || r.includes('마룬') || c.includes('300')) currR += w;
        else if (r.includes('블루') || r.includes('청') || c.includes('144') || c.includes('341')) currB += w;
        else if (r.includes('옐로우') || r.includes('황') || r.includes('오커') || c.includes('328')) currY += w;
        else if (r.includes('그린') || r.includes('녹')) currG += w;
        else if (r.includes('화이트') || r.includes('백') || c.includes('321') || c.includes('322')) currW += w;
        else if (r.includes('실버') || r.includes('알루미늄') || c.includes('35')) currS += w;
        else if (r.includes('블랙') || r.includes('흑') || c.includes('323') || c.includes('350')) currBk += w;
      });

      const maxTotal = currR + currB + currY + currG + currW + currS + currBk;
      let baseTone = '알 수 없음'; let toneReason = '입력된 안료가 부족합니다.';

      if (maxTotal > 0) {
        const maxVal = Math.max(currR, currB, currY, currG, currW, currS, currBk);
        if (maxVal === currW && maxVal > maxTotal * 0.4) { baseTone = '화이트'; toneReason = `백색 안료가 총량의 ${Math.round((currW/maxTotal)*100)}%를 차지하여 전체 명도를 지배하고 있습니다.`; } 
        else if (maxVal === currS && maxVal > maxTotal * 0.4) { baseTone = '실버/메탈릭'; toneReason = `실버/알루미늄 비중(${Math.round((currS/maxTotal)*100)}%)이 높아 메탈릭 입자감이 주를 이룹니다.`; } 
        else if (maxVal === currBk && maxVal > maxTotal * 0.3) { baseTone = '블랙/다크'; toneReason = `흑색계 비중(${Math.round((currBk/maxTotal)*100)}%)이 전체 명도를 묵직하게 누르고 있습니다.`; } 
        else {
            const maxColorVal = Math.max(currR, currB, currY, currG);
            if (maxColorVal === currR) { baseTone = '레드/마젠타'; toneReason = '유채색 중 적색계열 비중이 가장 높습니다.'; }
            else if (maxColorVal === currB) { baseTone = '블루'; toneReason = '유채색 중 청색계열 비중이 가장 높습니다.'; }
            else if (maxColorVal === currY) { baseTone = '옐로우/오커'; toneReason = '유채색 중 황색계열 비중이 가장 높습니다.'; }
            else if (maxColorVal === currG) { baseTone = '그린'; toneReason = '유채색 중 녹색계열 비중이 가장 높습니다.'; }
        }
      }

      const regex = /(?:WT\s*)?(\d{3,4})(?:[-x*\s]*(?:을|를)?\s*([0-9.]+)[gG]?)?/gi;
      let match; const foundToners = [];
      while ((match = regex.exec(q)) !== null) { foundToners.push({ code: match[1], weight: match[2] }); }

      if (foundToners.length > 0 && (isIncrease || isDecrease)) {
        const action = isIncrease ? '증가' : '감소';
        advice = `⚡ **[조색 시뮬레이션: ${action} 타격 브리핑]**\n\n`;
        advice += `📊 **현재 베이스 성향:** [${baseTone}] 우세\n`;
        advice += `<span style="color:#64748b; font-size:12px;">👉 ${toneReason}</span>\n\n`;

        foundToners.forEach(item => {
          let finalKey = `WT ${item.code}`;
          if (!TONER_DB[finalKey as keyof typeof TONER_DB] && item.code.length >= 4) finalKey = `WT ${item.code.substring(0,3)}`;
          const tonerInfo = TONER_DB[finalKey as keyof typeof TONER_DB];

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

            advice += `<div style="font-weight:bold; font-size:14px; color:#1d4ed8; margin-top:8px;">🎯 ${finalKey} [${tonerInfo.role}] ${item.weight ? `(${item.weight}g)` : ''} ${action}</div>`;
            advice += `▪️ **배합 비율 변화:** 기존 ${oldWeight}g ➡️ **${newWeight.toFixed(2)}g**\n`;
            advice += `▪️ **명암 및 특성 분석:** `;
            if (action === '증가') {
              if (isBlue) advice += `블루 계열이 추가되어 쿨톤이 증폭되고, 맑고 선명한 청색 입자감이 극대화됩니다.\n`;
              else if (isRed) advice += `적/마젠타 톤이 더해져 붉은 뉘앙스가 딥해지며, 측면(Flop) 채도가 상승합니다.\n`;
              else if (isBlack) advice += `흑색계열 추가로 전체 명도가 급강하합니다. 섀도우 영역이 극도로 묵직하게 가라앉습니다.\n`;
              else if (isYellow && tonerInfo.role.includes('오커')) advice += `오커 추가로 밝은 베이스의 맑은 반사율이 차단되고 정면 명도가 가라앉아 탁한 황색 느낌이 짙어집니다.\n`;
              else if (isYellow) advice += `따뜻한 웜톤이 부각되며 채도가 상승합니다.\n`;
              else if (isWhite) advice += `백색 입자 추가로 정면 명도가 상승하며 색감이 다소 옅어집니다.\n`;
              else advice += `해당 안료 고유 색감이 베이스 위로 두드러집니다.\n`;
            } else {
              if (isYellow && tonerInfo.role.includes('오커')) advice += `오커 안료 차감으로 배합의 텁텁한 베일이 걷힙니다. 반사율이 살아나 명도가 상승합니다.\n`;
              else if (isYellow) advice += `황색기가 억제되며 베이스가 맑아집니다.\n`;
              else if (isBlue) advice += `차가운 톤이 억제되며, 따뜻한 반사광이 드러나기 시작합니다.\n`;
              else if (isRed) advice += `붉은기가 억제되며, 차갑고 신선한 톤이 드러납니다.\n`;
              else if (isBlack) advice += `다크 섀도우가 걷혀 명도가 수직 상승하며 기존 채도가 살아납니다.\n`;
              else advice += `해당 색감이 억제되어 톤 밸런스가 역전됩니다.\n`;
            }
          } else {
            advice += `⚠️ **WT ${item.code}**: DB 미확인 코드\n\n`;
          }
        });
        
      } else if (foundToners.length > 0) {
        advice = `🔍 **[안료 정밀 분석 브리핑]**\n\n`;
        foundToners.forEach(item => {
          let finalKey = `WT ${item.code}`;
          if (!TONER_DB[finalKey as keyof typeof TONER_DB] && item.code.length >= 4) finalKey = `WT ${item.code.substring(0,3)}`;
          const tonerInfo = TONER_DB[finalKey as keyof typeof TONER_DB];
          
          if (tonerInfo) {
              advice += `<div style="font-weight:bold; font-size:14px; margin-top:8px;">🎯 ${finalKey} [${tonerInfo.role}]</div>`;
              advice += `▪️ **기술 데이터:** ${tonerInfo.desc}\n\n`;
          } else {
              advice += `⚠️ **WT ${item.code}**: DB에 존재하지 않는 코드입니다.\n\n`;
          }
        });
      } else {
        if (q.match(/(정면|페이스|15도).*(밝게|환하게|높이|살리)/)) { advice = `💡 **[Master Solution: 정면(Face) 명도 향상]**\n정면의 빛 반사를 극대화하려면 표면이 매끄러운 고휘도 알루미늄(WT390, WT355)을 검토하십시오. 솔리드라면 화이트(WT321) 비율을 높입니다.`; } 
        else if (q.match(/(측면|플롭|스카시|110도).*(밝게|환하게|살리)/)) { advice = `💡 **[Master Solution: 측면(Flop) 명도 향상]**\n측면이 어둡다면 플롭 컨트롤(WT386)을 소량 첨가하십시오. 마이크로/화인 실버(WT357, WT354) 교체도 도움이 됩니다.`; } 
        else if (q.match(/(탁해|탁함|채도|맑게|선명)/)) { advice = `💡 **[Master Solution: 탁색 방지 및 채도 향상]**\n채도를 높이고 맑게 하려면 WT341, WT309, WT324 등 투명한 계열로 교체하고, 은폐 목적의 블랙/오커 비중을 최소화하십시오.`; } 
        else { advice = `👑 **[HI-TEC 마스터 엔진 대기 중]**\n질문 가이드:\n🔹 "WT328 소량 줄였을 때 데이터에서 변하는 색감은?"\n🔹 "측면이 너무 어두운데 어떻게 해?"\n🔹 "WT346 안료의 특성이 뭐야?"`; }
      }

      setIsAiProcessing(false);
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
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id));
  };
  
  // 💡 안료 추가 시 Auto Focus 타겟 설정
  const addToner = (isPearl = false) => {
    const newId = `new_${Date.now()}`;
    const newToner = { id: newId, code: '', role: '코드 입력', adjustedWeight: "" };
    if (isPearl) {
      setPearlToners([...pearlToners, newToner]);
      setFocusTarget({ id: newId, type: 'pearl' });
    } else {
      setToners([...toners, newToner]);
      setFocusTarget({ id: newId, type: 'base' });
    }
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
      
      {/* 📸 카메라 기능: 찍은 사진을 상단에 고정하는 스마트 참조 모드 */}
      {scannedImage && (
        <div className="bg-slate-900 border-b-4 border-blue-500 shadow-2xl z-50 p-2 md:p-4 sticky top-0 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-2 px-2 max-w-[1600px] mx-auto">
            <h2 className="text-white text-sm md:text-base font-bold flex items-center">
              <ImageIcon className="mr-2 text-blue-400" size={18}/> 사진 고속 참조 모드 (확대 가능)
            </h2>
            <button onClick={() => setScannedImage(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors border border-slate-700">
              <X size={18} />
            </button>
          </div>
          <div className="w-full max-h-[30vh] md:max-h-[25vh] overflow-auto rounded-lg border border-slate-700 bg-black flex justify-center max-w-[1600px] mx-auto">
             <img src={scannedImage} alt="스캔된 배합표" className="object-contain w-full h-auto" />
          </div>
        </div>
      )}

      {/* Tesseract.js 스캔 중 애니메이션 오버레이 */}
      {isScanning && (
        <div className="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in">
          <div className="relative">
            <ScanLine className="text-blue-500 w-28 h-28 mb-6 animate-pulse opacity-80" />
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-[scan_1.5s_ease-in-out_infinite]"></div>
          </div>
          <h2 className="text-white text-2xl font-black mb-3 tracking-wide">AI 이미지 스캔 중</h2>
          <div className="flex items-center space-x-2">
            <RefreshCw className="animate-spin text-blue-400 w-5 h-5" />
            <p className="text-blue-200 text-sm font-bold">사진의 글씨를 판독하고 있습니다...</p>
          </div>
        </div>
      )}

      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 3.0</span></h1>
        </div>
      </header>

      {/* 📱 메인 레이아웃 */}
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
                  <div key={toner.id} className="flex flex-col bg-white p-3 mb-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:border-blue-300">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                      <div className="flex items-center space-x-3 w-full">
                        <div className="w-12 h-6 md:w-10 md:h-5 rounded shadow-sm border border-slate-400 flex overflow-hidden cursor-pointer shrink-0 hover:scale-110 transition-transform" onClick={() => { if(TONER_DB[toner.code as keyof typeof TONER_DB]) setSelectedTonerForView(toner.code); }}>
                          <div className="flex-1" style={visuals.macroStyle}></div>
                          <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                        </div>
                        {/* 💡 Auto Focus 적용 */}
                        <input 
                          type="text" 
                          autoFocus={focusTarget?.id === toner.id}
                          ref={(el) => { if (el && focusTarget?.id === toner.id) { el.focus(); setFocusTarget(null); } }}
                          value={toner.code} 
                          onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} 
                          placeholder="코드입력" 
                          className="flex-1 md:w-[120px] bg-transparent font-black text-blue-700 outline-none text-lg uppercase px-1" 
                        />
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-0">
                      <div className="flex-1 pr-0 md:pr-3">
                        <div className="text-[15px] font-bold text-slate-800 leading-tight">{toner.role}</div>
                        <div className="text-[13px] text-slate-600 leading-relaxed mt-1.5 whitespace-pre-wrap break-words">
                          {TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '정확한 코드를 입력하면 안료 정보가 100% 모두 표시됩니다.'}
                        </div>
                      </div>
                      <div className="flex items-center self-end bg-slate-50 p-1.5 rounded-lg border border-slate-200 w-full sm:w-auto justify-end">
                        <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} placeholder="0.0" className="w-24 text-right bg-white border border-slate-300 p-2 rounded text-[16px] font-black shadow-inner outline-none text-blue-900" />
                        <span className="text-slate-400 text-[14px] font-black mx-2">g</span>
                        <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500 p-1.5 bg-white rounded border border-slate-200"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-3.5 border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-xl text-slate-500 font-bold transition-all flex items-center justify-center space-x-2 text-sm shadow-sm">
                <Plus size={18} /><span>베이스 안료 추가</span>
              </button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-4 border-t-2 border-dashed border-purple-200 space-y-4 pb-8">
                <div className="text-sm font-black text-purple-700 mb-2">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '');
                  return (
                    <div key={toner.id} className="flex flex-col bg-white p-3 mb-3 rounded-xl border border-purple-200 shadow-sm transition-all hover:border-purple-400">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-50">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-12 h-6 rounded shadow-sm border flex overflow-hidden cursor-pointer shrink-0 hover:scale-110 transition-transform" onClick={() => { if(TONER_DB[toner.code as keyof typeof TONER_DB]) setSelectedTonerForView(toner.code); }}>
                            <div className="flex-1" style={visuals.macroStyle}></div>
                            <div className="flex-1 border-l" style={visuals.smoothStyle}></div>
                          </div>
                          {/* 💡 Auto Focus 적용 */}
                          <input 
                            type="text" 
                            autoFocus={focusTarget?.id === toner.id}
                            ref={(el) => { if (el && focusTarget?.id === toner.id) { el.focus(); setFocusTarget(null); } }}
                            value={toner.code} 
                            onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} 
                            placeholder="코드입력" 
                            className="flex-1 bg-transparent font-black text-purple-700 outline-none text-lg uppercase px-1" 
                          />
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3 md:gap-0">
                        <div className="flex-1 pr-0 md:pr-3">
                          <div className="text-[15px] font-bold text-slate-800 leading-tight">{toner.role}</div>
                          <div className="text-[13px] text-slate-600 leading-relaxed mt-1.5 whitespace-pre-wrap break-words">
                            {TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '정확한 코드를 입력하면 정보가 100% 모두 표시됩니다.'}
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
                <button onClick={() => addToner(true)} className="w-full py-3.5 border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 rounded-xl text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm shadow-sm">
                  <Plus size={18} /><span>펄 조색제 추가</span>
                </button>
              </div>
            )}
          </div>
          
          {/* 💡 하단 Total Weight 부분: 6052 계산 및 분리 표시 완벽 구현 */}
          <div className="p-4 bg-slate-800 text-slate-100 flex flex-col shrink-0 rounded-b-xl lg:rounded-none space-y-3 shadow-inner">
             
             {/* 베이스 코트 분리 합계 및 6052 로직 */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm border-b border-slate-700 pb-2 gap-1 sm:gap-0">
               <div className="flex items-center flex-wrap">
                 <span className="text-slate-400 font-bold tracking-wider mr-2">베이스 총량:</span> 
                 <span className="text-white font-black text-base">{totalBaseWeight}g</span>
               </div>
               <div className="flex items-center text-blue-300 bg-blue-900/40 px-2 py-1 rounded text-xs border border-blue-800/50">
                  <Beaker size={14} className="mr-1.5"/>
                  <span className="font-bold">6052 필요량:</span>
                  <span className="ml-1.5 text-white font-black">{ (parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1) }g</span>
                  <span className="ml-1 opacity-70">({isBaseMetallic ? '메탈릭 20%' : '솔리드 10%'})</span>
               </div>
             </div>

             {/* 펄 코트 분리 합계 및 6052 로직 (3Coat 시 활성화) */}
             {isThreeCoatMode && (
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm border-b border-slate-700 pb-2 gap-1 sm:gap-0">
                 <div className="flex items-center flex-wrap">
                   <span className="text-purple-400 font-bold tracking-wider mr-2">펄 코트 총량:</span> 
                   <span className="text-white font-black text-base">{totalPearlWeight}g</span>
                 </div>
                 <div className="flex items-center text-purple-300 bg-purple-900/40 px-2 py-1 rounded text-xs border border-purple-800/50">
                    <Beaker size={14} className="mr-1.5"/>
                    <span className="font-bold">6052 필요량:</span>
                    <span className="ml-1.5 text-white font-black">{ (parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1) }g</span>
                    <span className="ml-1 opacity-70">({isPearlMetallic ? '메탈릭 20%' : '솔리드 10%'})</span>
                 </div>
               </div>
             )}

             {/* 최종 합계 */}
             <div className="flex justify-between items-center pt-1">
               <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">Total Formula Weight</div>
               <div className="text-2xl font-black text-cyan-400">{totalFinalWeight} <span className="text-base text-cyan-600">g</span></div>
             </div>
          </div>

        </div>

        {/* 우측: 멀티 시각화 렌더링 & AI 터미널 */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-6">
          <div className="bg-white border border-slate-300 rounded-xl p-4 md:p-5 shadow-xl flex-none transition-all duration-300">
            <h3 className="text-[15px] font-bold mb-4 flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={18} />멀티 렌더링 비교</span>
              {/* 💡 확장 뷰어 잠금 완전 해제: onClick 속성 내 if 조건문 삭제 */}
              <button onClick={() => { setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); }} className="text-xs px-3 py-1.5 rounded bg-slate-100 border border-slate-200 font-bold flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer shadow-sm"><Maximize size={12} className="mr-1"/>확장 뷰어</button>
            </h3>
            
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-1.5">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black text-slate-500 bg-slate-100 px-2 py-0.5 rounded">A. 베이스 코트</span>
                   <span className="text-[11px] text-slate-500 font-bold">{totalBaseWeight}g</span>
                 </div>
                 <div className="h-14 rounded-lg border border-slate-300 relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}>
                 </div>
              </div>

              {isThreeCoatMode && (
                <div className="flex flex-col space-y-1.5 relative">
                   <div className="flex justify-between items-center px-1">
                     <span className="text-[11px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded"><Zap size={10} className="inline mr-1"/>B. 펄 코트</span>
                     <span className="text-[11px] text-purple-500 font-bold">{totalPearlWeight}g</span>
                   </div>
                   <div className="h-14 rounded-lg border border-purple-300 relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` }}>
                   </div>
                </div>
              )}

              <div className="flex flex-col space-y-1.5 relative">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{isThreeCoatMode ? 'C. 최종 3코트 결합' : 'B. 최종 렌더링'}</span>
                   <span className="text-[11px] text-blue-500 font-bold">{totalFinalWeight}g</span>
                 </div>
                 <div className="h-20 rounded-lg border border-blue-400 relative overflow-hidden" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` }}>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-4 flex flex-col flex-1 shadow-xl overflow-hidden min-h-[450px] lg:min-h-0">
            <h3 className="text-[14px] font-bold flex items-center mb-3 text-slate-800"><BrainCircuit className="text-blue-600 mr-2" size={18} />AI 엔진 터미널</h3>
            <div ref={chatContainerRef} className="flex-1 bg-slate-50 border p-4 overflow-y-auto mb-4 space-y-4 rounded-lg">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`p-3.5 rounded-lg border text-[13px] leading-relaxed ${msg.type === 'system' ? 'bg-slate-800 text-white' : msg.type === 'user' ? 'bg-blue-600 text-white ml-8' : 'bg-white text-slate-800 mr-8'}`}>
                   <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} />
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
                      <div className="flex w-16 h-8 md:w-20 md:h-10 rounded shadow-sm border border-slate-400 overflow-hidden mr-4 shrink-0">
                        <div className="flex-1" style={visuals.macroStyle}></div>
                        <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                      </div>
                      <div className="text-2xl md:text-3xl font-black text-blue-700">{tonerInfo.role}</div>
                   </div>
                   <p className="text-slate-700 text-[15px] md:text-base mb-6 leading-[1.6] bg-slate-50 p-4 rounded-lg border shadow-inner font-bold whitespace-pre-wrap break-keep">
                     {tonerInfo.desc}
                   </p>
                   <div className="flex flex-col md:flex-row gap-5">
                      <div className="flex-1">
                         <div className="text-xs font-bold text-slate-500 mb-2 text-center uppercase bg-slate-100 py-2 rounded shadow-sm">Macro View (입자 관찰)</div>
                         <div className="h-40 md:h-56 rounded-xl border border-slate-400 relative overflow-hidden" style={visuals.macroStyle}></div>
                      </div>
                      <div className="flex-[1.5]">
                         <div className="text-xs font-bold text-slate-500 mb-2 text-center uppercase bg-slate-100 py-2 rounded shadow-sm">Color Travel (컬러 쉬프트)</div>
                         <div className="h-40 md:h-56 rounded-xl border border-slate-400 relative overflow-hidden" style={visuals.smoothStyle}></div>
                      </div>
                   </div>
                   <div className="mt-8 text-center shrink-0">
                      <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 text-white px-10 py-3.5 rounded-xl font-bold w-full md:w-auto text-lg shadow-lg hover:bg-slate-700 transition-colors">닫기</button>
                   </div>
                </div>
             </div>
          </div>
        );
      })()}

      {/* 💡 3. [확장 뷰어] 3-Coat 지원 및 유기적 조명 (Interactive Sun) */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white font-sans animate-in fade-in duration-300 backdrop-blur-xl select-none">
          <header className="p-4 md:p-6 flex justify-between items-center bg-black/50 border-b border-slate-800 shrink-0">
            <h2 className="text-lg md:text-xl font-bold tracking-widest text-slate-300 uppercase flex items-center"><Camera className="mr-2 md:mr-3 text-blue-500" size={20}/> MULTI 3D VIEW</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-500 rounded-full transition-colors border border-slate-700"><X size={24}/></button>
          </header>

          <main 
            ref={viewerRef}
            className="flex-1 p-4 md:p-6 flex flex-col md:flex-row gap-4 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto"
            onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }}
            onPointerMove={handlePointerMove}
            onPointerUp={() => setIsDraggingLight(false)}
            onPointerLeave={() => setIsDraggingLight(false)}
          >
             {/* ☀️ 드래그 가능한 가상 태양 (광원) UI */}
             <div 
               className="absolute z-50 flex items-center justify-center transition-transform duration-75 pointer-events-none"
               style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}
             >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.8)] backdrop-blur-sm border border-white/40 animate-pulse">
                    <Sun className="text-yellow-100 drop-shadow-[0_0_15px_rgba(255,255,255,1)]" size={32} />
                </div>
             </div>

             {/* A. 베이스 렌더링 */}
             <div className="w-full md:flex-1 h-1/3 md:h-[85%] rounded-[1.5rem] md:rounded-[2rem] border border-slate-700 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-all duration-75"
                  style={{ background: getInteractiveBackground(baseOptics, lightPos) }}>
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-black/80 px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm border border-slate-600 text-slate-200 shadow-lg">A. 베이스 코트</div>
             </div>
             
             {isThreeCoatMode && (
               <>
                 <div className="text-slate-600 pointer-events-none shrink-0 hidden md:block"><ChevronRight size={32} /></div>

                 {/* B. 펄 렌더링 */}
                 <div className="w-full md:flex-1 h-1/3 md:h-[85%] rounded-[1.5rem] md:rounded-[2rem] border border-purple-500 relative overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-75"
                      style={{ background: getInteractiveBackground(pearlOptics, lightPos) }}>
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-purple-900/90 px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm border border-purple-400 text-white shadow-lg">B. 펄 코트</div>
                 </div>
               </>
             )}

             <div className="text-slate-600 pointer-events-none shrink-0 hidden md:block"><ChevronRight size={32} /></div>

             {/* C. 최종 렌더링 */}
             <div className="w-full md:flex-1 h-1/3 md:h-[85%] rounded-[1.5rem] md:rounded-[2rem] border border-blue-500 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all duration-75"
                  style={{ background: getInteractiveBackground(finalOptics, lightPos) }}>
                <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-blue-900/90 px-3 py-1.5 md:px-4 md:py-2 rounded-xl font-bold text-xs md:text-sm border border-blue-400 text-white shadow-lg">{isThreeCoatMode ? 'C. 최종 3코트' : 'B. 최종 렌더링'}</div>
             </div>
             
             {/* 조명 퀵 컨트롤 UI */}
             <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-slate-900/90 p-3 md:p-4 rounded-2xl border border-slate-700 backdrop-blur-md z-50 shadow-2xl w-[90%] md:w-auto">
                <span className="text-[10px] md:text-xs text-blue-400 font-bold mb-2 md:mb-3 uppercase tracking-wider animate-pulse flex items-center text-center leading-tight"><Sun size={14} className="mr-1 shrink-0"/>빈 공간을 드래그하여 광원을 유기적으로 움직여 보세요</span>
                <div className="flex space-x-2 md:space-x-3 w-full md:w-auto justify-center">
                  {anglePresets.map((angle) => (
                    <button 
                      key={angle.id} onClick={(e) => { e.stopPropagation(); setLightPos(angle.pos); }}
                      className="px-3 md:px-6 py-2 md:py-2.5 rounded-lg md:rounded-xl font-bold uppercase transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-blue-400 text-[10px] md:text-sm flex-1 md:flex-none whitespace-nowrap"
                    >
                      {angle.label}
                    </button>
                  ))}
                </div>
             </div>
          </main>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
      `}} />
    </div>
  );
}
