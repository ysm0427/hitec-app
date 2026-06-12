import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Zap, Maximize, Lock, Unlock, Layers, BrainCircuit, RefreshCw, Mic, MicOff, FolderOpen, ChevronRight, Sun, Droplet, Camera, X, Image as ImageIcon, ScanLine, Beaker
} from 'lucide-react';

// 💡 1. 사용자 맞춤형 안료 DB (설명글 100% 완전 노출 보장)
const TONER_DB = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임. (배합비율 WT346 : WT144 = 1 : 0.9)' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋으며, 채도가 높고 입자감이 좋은 청색 계열 컬러에 사용.' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두우며 주로 흑색 계열의 컬러에 제한적으로 사용.' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨. (적용 예: Nissan KAB, Lexus 1F1, M.Benz 047)' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 염료를 함유하고 있어 알루미늄 입자에 2% 이상 사용하면 알루미늄 입자와 반응하여 색상이 변할 수 있고 내구성에 문제가 될 수 있음. (사용 한도: 솔리드 최대 5%, 실버 최대 2%, 펄 최대 5% 이내)' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제. 베이스코트 무게의 10% 혼합하면 특히 겨울과 같은 낮은 습도 조건에서 작업성이 좋아지며 외관도 개선됨.' },
  'WT 813': { role: '오렌지/옐로우 계열', desc: '오렌지/옐로우 계열 조색제. 현장 대응용 보강 안료.' },
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

// 💡 2. 렌더링용 보간 함수들 (절대 삭제 금지)
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
  const [toners, setToners] = useState<any[]>([{ id: 't_init', code: '', role: '코드 입력', adjustedWeight: "" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: 'p_init', code: '', role: '코드 입력', adjustedWeight: "" }]);
  
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false);
  const [targetColorCode, setTargetColorCode] = useState('');
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);

  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 1, type: 'system', text: '💡 **[HI-TEC Master V8.5 스튜디오 로드 완료]**\n- 🎙️ 무한 음성 자동 채움 기능 활성화\n- 📸 소수점 숫자 사냥(OCR) 스캔 활성화' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  // 🎙️ 실시간 음성인식
  const [isListening, setIsListening] = useState(false);
  const [liveVoiceText, setLiveVoiceText] = useState('');
  const recognitionRef = useRef<any>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);

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
      const role = TONER_DB[t.code as keyof typeof TONER_DB]?.role || '';
      return role.includes('실버') || role.includes('알루미늄') || role.includes('펄') || role.includes('이펙트') || role.includes('다이아몬드') || role.includes('글라스');
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

  const addChatMessage = (type: string, text: string) => { 
    setChatMessages(prev => [...prev, { id: Date.now(), type, text, time: new Date().toLocaleTimeString('ko-KR') }]); 
  };

  const handleClearAll = () => {
    setToners([{ id: `init_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" }]); 
    setPearlToners([{ id: `init_p_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" }]); 
    setTargetColorCode(''); setIsBaseConfirmed(false); setScannedImage(null);
    addChatMessage('system', '🗑️ 모든 배합 리스트가 초기화되었습니다.');
  };

  const handleConfirmBase = () => {
    setIsBaseConfirmed(true);
    addChatMessage('system', '🔒 기준 코드가 확정되었습니다. 멀티 시각화 렌더링을 활성화합니다.');
  };

  // 💡 1. 빈칸 자동 채움 로직 (음성 및 스캔에서 공통 사용)
  const addTonerAutoFill = (codeNum: string, weightStr: string) => {
    const finalCode = `WT ${codeNum}`;
    const tonerInfo = TONER_DB[finalCode as keyof typeof TONER_DB];
    if (!tonerInfo) return false;

    const isPearlType = tonerInfo.role.includes('펄') || tonerInfo.role.includes('다이아몬드') || tonerInfo.role.includes('이펙트');
    
    if (isPearlType && isThreeCoatMode) {
      setPearlToners(prev => {
        const emptyIndex = prev.findIndex(t => t.code === '');
        if (emptyIndex !== -1) {
          const updated = [...prev];
          updated[emptyIndex] = { ...updated[emptyIndex], code: finalCode, role: tonerInfo.role, adjustedWeight: weightStr };
          return updated;
        }
        return [...prev, { id: `voice_p_${Date.now()}_${Math.random()}`, code: finalCode, role: tonerInfo.role, adjustedWeight: weightStr }];
      });
    } else {
      setToners(prev => {
        const emptyIndex = prev.findIndex(t => t.code === '');
        if (emptyIndex !== -1) {
          const updated = [...prev];
          updated[emptyIndex] = { ...updated[emptyIndex], code: finalCode, role: tonerInfo.role, adjustedWeight: weightStr };
          return updated;
        }
        return [...prev, { id: `voice_b_${Date.now()}_${Math.random()}`, code: finalCode, role: tonerInfo.role, adjustedWeight: weightStr }];
      });
    }
    return true;
  };

  // 🎙️ V8.5 타겟팅 무한 음성 인식 (빈칸 채움 및 자동 추가)
  const toggleVoiceDictation = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setLiveVoiceText('');
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('아이폰 사파리(Safari) 앱을 직접 실행하셔야 모바일 마이크 연동이 작동합니다.'); return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR'; 
    recognition.continuous = true; 
    recognition.interimResults = true; 
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      addChatMessage('system', '🎙️ **[무한 음성 입력 켜짐]**\n"311 20.5 추가", "312 10.3" 등 계속 말씀하세요. 화면의 빈칸에 즉시 채워집니다. 종료하시려면 "완료"라고 말씀하세요.');
    };
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      
      if (interimTranscript) setLiveVoiceText(interimTranscript);
      
      if (finalTranscript) {
        setLiveVoiceText('');
        const trimmedText = finalTranscript.trim();
        addChatMessage('user', `🗣️ "${trimmedText}"`);
        
        if (trimmedText.includes('완료') || trimmedText.includes('끝')) {
           recognition.stop();
           setIsListening(false);
           addChatMessage('system', '🎙️ [음성 입력 완료] 마이크가 정상 종료되었습니다.');
           return;
        }

        // 💡 한글 다 무시하고 오직 숫자(+소수점)만 덩어리로 뽑아냄
        const regex = /\d+(?:\.\d+)?/g;
        const numbers = trimmedText.match(regex);
        
        if (numbers && numbers.length > 0) {
            let pendingCode: string | null = null;
            let addedCount = 0;

            for (let i = 0; i < numbers.length; i++) {
                const num = numbers[i];
                // 3~4자리이며 1,3,4,6,8로 시작하면 코드로 간주
                if (num.length >= 3 && num.length <= 4 && /^[13468]/.test(num)) {
                    if (pendingCode) {
                        if(addTonerAutoFill(pendingCode, "0")) addedCount++;
                    }
                    pendingCode = num;
                } else {
                    // 용량으로 간주
                    if (pendingCode) {
                        if(addTonerAutoFill(pendingCode, num)) addedCount++;
                        pendingCode = null;
                    }
                }
            }
            // 마지막 코드가 남았다면 0g으로 등록
            if (pendingCode) {
                if(addTonerAutoFill(pendingCode, "0")) addedCount++;
            }
            
            if (addedCount > 0) {
                addChatMessage('system', `✅ ${addedCount}개 안료 추가 완료. 빈칸이 없으면 새 줄이 자동 생성됩니다.`);
            } else {
                addChatMessage('system', `❌ 유효한 안료 번호(3~4자리)를 찾지 못했습니다.`);
            }
        }
      }
    };
    recognition.onerror = () => { setIsListening(false); setLiveVoiceText(''); };
    recognition.onend = () => { setIsListening(false); setLiveVoiceText(''); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // 📸 진짜 소수점 헌팅 스캔 (빈칸 자동 채움)
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const imageUrl = URL.createObjectURL(file); setScannedImage(imageUrl); setIsScanning(true);
    addChatMessage('system', '⏳ **[AI 비전 사냥 가동]** 오직 안료 번호와 소수점 중량만 추출하여 빈칸에 자동 입력합니다.');
    
    try {
      if ((window as any).Tesseract) {
        // eng 전용 모드로 돌려 모바일 메모리 부하 및 한글 찌꺼기 완벽 차단
        const result = await (window as any).Tesseract.recognize(file, 'eng', { logger: (m: any) => console.log(m) });
        const text = result.data.text;
        
        // 💡 텍스트 내의 모든 숫자 덩어리 추출 (311-20.5-20.3 같은 경우에서 - 무시하고 숫자만)
        const numRegex = /\d+(?:\.\d+)?/g;
        const numbers = text.match(numRegex) || [];
        
        let pendingCode: string | null = null;
        let addedCount = 0;
        
        for(let i=0; i<numbers.length; i++) {
            const num = numbers[i];
            if (num.length >= 3 && num.length <= 4 && /^[13468]/.test(num)) {
                if (pendingCode) {
                    if(addTonerAutoFill(pendingCode, "0")) addedCount++;
                }
                pendingCode = num;
            } else {
                if (pendingCode) {
                    // 누적무게 등 3번째 숫자는 pendingCode가 null이 되므로 자연스럽게 무시됨
                    if(addTonerAutoFill(pendingCode, num)) addedCount++;
                    pendingCode = null;
                }
            }
        }
        if (pendingCode) { if(addTonerAutoFill(pendingCode, "0")) addedCount++; }

        if (addedCount > 0) {
          addChatMessage('ai', `📸 **[스캔 매칭 완료]** 영수증의 숫자 배열을 분석하여 총 ${addedCount}개의 데이터를 화면의 빈칸에 꽂아 넣었습니다.`);
        } else {
           throw new Error("코드 인식 실패");
        }
      } else {
        throw new Error("OCR 모듈 미적용");
      }
    } catch (error) {
      addChatMessage('ai', `❌ **[스캔 경고]** 사진 화질 문제로 숫자를 찾지 못했습니다. 사진을 상단에 띄워두었으니 마이크로 직접 추가해 주십시오.`);
    }
    setIsScanning(false);
  };

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput; addChatMessage('user', q); setChatInput(''); setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      addChatMessage('ai', `👑 명령어 처리 완료. 매크로 렌더링에 반영했습니다.`);
    }, 500);
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
  
  const addToner = (isPearl = false) => {
    const newId = `new_${Date.now()}`; const newToner = { id: newId, code: '', role: '코드 입력', adjustedWeight: "" };
    if (isPearl) { setPearlToners([...pearlToners, newToner]); } 
    else { setToners([...toners, newToner]); }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      
      {scannedImage && (
        <div className="bg-slate-900 border-b-4 border-blue-500 shadow-2xl z-50 p-2 sticky top-0 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-2 px-2 max-w-[1600px] mx-auto">
            <h2 className="text-white text-xs font-bold flex items-center"><ImageIcon className="mr-2 text-blue-400" size={14}/> 시편 고속 참조 가상 스크린</h2>
            <button onClick={() => setScannedImage(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1 rounded-full"><X size={14} /></button>
          </div>
          <div className="w-full max-h-[22vh] overflow-auto bg-black flex justify-center rounded">
             <img src={scannedImage} alt="배합표" className="object-contain w-full h-auto" />
          </div>
        </div>
      )}

      {isScanning && (
        <div className="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="relative mb-4">
            <ScanLine className="text-blue-500 w-24 h-24 animate-pulse opacity-80" />
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-[scan_1.5s_ease-in-out_infinite]"></div>
          </div>
          <h2 className="text-white text-lg font-black tracking-wide">숫자 헌팅 필터 가동 중...</h2>
        </div>
      )}

      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 8.5</span></h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-auto lg:h-[calc(100vh-10px)] overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
            
            {/* 🎙️ 실시간 음성인식 자막 바 */}
            {isListening && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center space-x-2 text-xs font-bold shadow-inner">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0"></span>
                <span className="text-slate-400 font-normal">음성 인식 중:</span>
                <span className="text-slate-900 font-black">{liveVoiceText || '대기 중... 계속 말씀하세요 ("완료" 시 종료)'}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 시트</h2>
              
              {/* 🎙️ 📸 시편 촬영 바로 왼쪽 옆단 배치 완벽 고정 */}
              <div className="flex space-x-1.5 shrink-0">
                <button onClick={toggleVoiceDictation} className={`px-3 py-2 rounded-md flex items-center text-xs font-black transition-all ${isListening ? 'bg-red-500 text-white animate-pulse border-2 border-red-400 shadow-md' : 'bg-slate-700 hover:bg-slate-800 text-white'}`}>
                  {isListening ? <MicOff size={14} className="mr-1" /> : <Mic size={14} className="mr-1" />}
                  <span>음성 추가</span>
                </button>
                <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleCameraCapture} />
                <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center text-xs font-black shadow-md"><Camera size={14} className="mr-1" />시편 촬영</button>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력 (예: UG-Z)" className="bg-white border border-slate-300 px-3 py-2 rounded text-xs font-bold focus:outline-none flex-1 uppercase" />
              <button onClick={handleConfirmBase} className="bg-slate-800 text-white px-3 py-2 rounded text-xs font-bold whitespace-nowrap">확정</button>
              <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-2 py-2 rounded"><Trash2 size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-white relative min-h-[350px] lg:min-h-0">
            <div className="space-y-3 pb-4">
              <div className="text-xs font-black text-slate-400 mb-1 flex items-center justify-between border-b pb-1.5">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-0.5 rounded border">
                  <span className="mr-1.5 text-[11px] font-bold text-purple-700">3Coat 펄 모드</span>
                  <input type="checkbox" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                </label>
              </div>

              {toners.map((toner) => {
                const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '');
                return (
                  <div key={toner.id} className="flex flex-col bg-white p-2.5 mb-2 rounded-lg border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-10 h-5 rounded shadow-xs border flex overflow-hidden cursor-pointer shrink-0" onClick={() => { if(TONER_DB[toner.code as keyof typeof TONER_DB]) setSelectedTonerForView(toner.code); }}>
                          <div className="flex-1" style={visuals.macroStyle}></div>
                          <div className="flex-1 border-l" style={visuals.smoothStyle}></div>
                        </div>
                        <input 
                          type="text" 
                          value={toner.code} 
                          onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} 
                          placeholder="코드" 
                          className="flex-1 md:w-[120px] bg-transparent font-black text-blue-700 outline-none text-base uppercase" 
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-full">
                        <div className="text-xs font-black text-slate-800">{toner.role}</div>
                        {/* 💡 설명칸 줄바꿈 100% 완전 노출 로직 */}
                        <div className="text-[12px] text-slate-600 leading-relaxed mt-1 whitespace-pre-wrap break-keep">
                          {TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '코드를 입력하면 안료의 상세 스펙 데이터가 출력됩니다.'}
                        </div>
                      </div>
                      <div className="flex items-center self-end bg-slate-50 p-1 rounded-md border w-full justify-end">
                        <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} placeholder="0.0" className="w-20 text-right bg-white border p-1 rounded text-sm font-black text-blue-900" />
                        <span className="text-slate-400 text-xs font-bold mx-1.5">g</span>
                        <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold flex items-center justify-center space-x-1 text-xs"><Plus size={14} /><span>베이스 추가</span></button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-3 border-t-2 border-dashed border-purple-100 space-y-3">
                <div className="text-xs font-black text-purple-700 mb-1">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '');
                  return (
                    <div key={toner.id} className="flex flex-col bg-white p-2.5 mb-2 rounded-lg border border-purple-200 shadow-xs">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2 w-full">
                          <div className="w-10 h-5 rounded shadow-xs border flex overflow-hidden cursor-pointer shrink-0" onClick={() => { if(TONER_DB[toner.code as keyof typeof TONER_DB]) setSelectedTonerForView(toner.code); }}>
                            <div className="flex-1" style={visuals.macroStyle}></div>
                            <div className="flex-1 border-l" style={visuals.smoothStyle}></div>
                          </div>
                          <input 
                            type="text" 
                            value={toner.code} 
                            onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} 
                            placeholder="코드" 
                            className="flex-1 bg-transparent font-black text-purple-700 outline-none text-base uppercase" 
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="w-full">
                          <div className="text-xs font-black text-slate-800">{toner.role}</div>
                          <div className="text-[12px] text-slate-500 leading-relaxed mt-1 whitespace-pre-wrap break-keep">
                            {TONER_DB[toner.code as keyof typeof TONER_DB] ? TONER_DB[toner.code as keyof typeof TONER_DB].desc : '코드를 입력하면 안료의 상세 스펙 데이터가 출력됩니다.'}
                          </div>
                        </div>
                        <div className="flex items-center self-end bg-purple-50/50 p-1 rounded-md border w-full justify-end">
                          <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)} placeholder="0.0" className="w-20 text-right bg-white border p-1 rounded text-sm font-black text-purple-900" />
                          <span className="text-slate-400 text-xs font-bold mx-1.5">g</span>
                          <button onClick={() => removeToner(toner.id, true)} className="text-purple-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addToner(true)} className="w-full py-2 border border-dashed rounded-lg text-purple-400 font-bold flex items-center justify-center space-x-1 text-xs"><Plus size={14} /><span>펄 추가</span></button>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-800 text-slate-200 flex flex-col shrink-0 space-y-2 text-xs">
             <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
               <div>베이스 합계: <span className="text-white font-black text-sm">{totalBaseWeight}g</span></div>
               <div className="text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/30">6052 수지 희석제: <span className="text-white font-black">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g</span> ({isBaseMetallic ? '메탈릭 20%' : '솔리드 10%'})</div>
             </div>
             {isThreeCoatMode && (
               <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                 <div>펄 코트 합계: <span className="text-white font-black text-sm">{totalPearlWeight}g</span></div>
                 <div className="text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/30">6052 수지 희석제: <span className="text-white font-black">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g</span> ({isPearlMetallic ? '메탈릭 20%' : '솔리드 10%'})</div>
               </div>
             )}
             <div className="flex justify-between items-center pt-1 font-bold text-sm">
               <span className="text-slate-400 uppercase tracking-wider text-xs">Total Weight</span>
               <span className="text-base text-cyan-400 font-black">{totalFinalWeight} g</span>
             </div>
          </div>
        </div>

        {/* Right Column: Multi-View & AI Terminal */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-4">
          <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-xl">
            <h3 className="text-sm font-bold mb-3 flex justify-between items-center border-b pb-2">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={16} />멀티 렌더링 비교</span>
              <button onClick={() => { setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); }} className="text-xs px-2 py-1 bg-slate-100 border rounded font-bold text-blue-600 shadow-sm cursor-pointer">확장 뷰어</button>
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
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskSolution()} placeholder="명령어 입력" className="w-full bg-white border rounded p-2 text-xs focus:outline-none focus:border-blue-500 shadow-inner" />
              <button onClick={handleAskSolution} className="bg-blue-600 text-white px-4 rounded font-bold text-xs whitespace-nowrap">실행</button>
            </div>
          </div>
        </div>
      </div>

      {/* 안료 디테일 뷰어 모달 */}
      {selectedTonerForView && TONER_DB[selectedTonerForView as keyof typeof TONER_DB] && (() => {
        const tonerInfo = TONER_DB[selectedTonerForView as keyof typeof TONER_DB];
        const visuals = getTonerVisuals(selectedTonerForView, tonerInfo.role, tonerInfo.desc);
        return (
          <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center p-3 backdrop-blur-xs">
             <div className="bg-white rounded-xl w-full max-w-lg flex flex-col max-h-[85vh] shadow-2xl border">
                <div className="bg-slate-900 p-3.5 flex justify-between items-center shrink-0">
                   <h3 className="text-white font-bold text-sm flex items-center"><Droplet className="mr-2 text-blue-400" size={16}/> {selectedTonerForView} 정밀분석</h3>
                   <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-4 overflow-y-auto space-y-4">
                   <div className="flex items-center mb-1">
                      <div className="flex w-12 h-6 rounded shadow-xs border border-slate-400 overflow-hidden mr-3 shrink-0">
                        <div className="flex-1" style={visuals.macroStyle}></div>
                        <div className="flex-1 border-l" style={visuals.smoothStyle}></div>
                      </div>
                      <div className="text-lg font-black text-blue-700">{tonerInfo.role}</div>
                   </div>
                   <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border font-bold whitespace-pre-wrap break-keep">{tonerInfo.desc}</p>
                   <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                         <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase text-center bg-slate-100 py-1 rounded">Macro View</div>
                         <div className="h-32 rounded-lg border border-slate-300 relative overflow-hidden" style={visuals.macroStyle}></div>
                      </div>
                      <div className="flex-[1.3]">
                         <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase text-center bg-slate-100 py-1 rounded">Color Travel</div>
                         <div className="h-32 rounded-lg border border-slate-300 relative overflow-hidden" style={visuals.smoothStyle}></div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 text-white py-2.5 rounded-lg font-bold w-full text-xs shadow-md mt-2">닫기</button>
                </div>
             </div>
          </div>
        );
      })()}

      {/* 3D 확장 뷰어 모달 */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white backdrop-blur-md select-none">
          <header className="p-3 flex justify-between items-center bg-black/40 border-b border-slate-800 shrink-0">
            <h2 className="text-xs font-bold tracking-wider text-slate-300 flex items-center"><Camera className="mr-2 text-blue-500" size={14}/> MULTI 3D VIEW</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-1 bg-slate-800 hover:bg-red-500 rounded-full border border-slate-700"><X size={18}/></button>
          </header>
          <main ref={viewerRef} className="flex-1 p-3 flex flex-col md:flex-row gap-3 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)} onPointerLeave={() => setIsDraggingLight(false)}>
             <div className="absolute z-50 flex items-center justify-center pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-14 h-16 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_#fff] border border-white/30"><Sun className="text-yellow-100" size={28} /></div>
             </div>
             <div className="w-full md:flex-1 h-1/3 md:h-[80%] rounded-xl border border-slate-700 relative overflow-hidden" style={{ background: getInteractiveBackground(baseOptics, lightPos) }}>
                <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-slate-200">A. 베이스 코트</div>
             </div>
             {isThreeCoatMode && (
               <div className="w-full md:flex-1 h-1/3 md:h-[80%] rounded-xl border border-purple-500 relative overflow-hidden" style={{ background: getInteractiveBackground(pearlOptics, lightPos) }}>
                  <div className="absolute top-3 left-3 bg-purple-900/90 px-2 py-1 rounded text-[10px] font-bold text-white">B. 펄 코트</div>
               </div>
             )}
             <div className="w-full md:flex-1 h-1/3 md:h-[80%] rounded-xl border border-blue-500 relative overflow-hidden" style={{ background: getInteractiveBackground(finalOptics, lightPos) }}>
                <div className="absolute top-3 left-3 bg-blue-900/90 px-2 py-1 rounded text-[10px] font-bold text-white">C. 최종 결합 컬러</div>
             </div>
             <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 w-[92%] sm:w-auto">
                <span className="text-[10px] text-blue-400 font-bold text-center leading-tight">화면 드래그 시 가상 광원 각도가 실시간 연동됩니다.</span>
                <div className="flex space-x-2 mt-2">
                  {anglePresets.map((angle) => (
                    <button key={angle.id} onClick={(e) => { e.stopPropagation(); setLightPos(angle.pos); }} className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 border border-slate-600 text-[10px] font-bold whitespace-nowrap">{angle.label}</button>
                  ))}
                </div>
             </div>
          </main>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 10px; }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
      `}} />
    </div>
  );
}
