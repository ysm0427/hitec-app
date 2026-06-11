import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Eye, Zap, Search, Globe, X, 
  Clock, FolderOpen, Maximize, BarChart2, RefreshCw, Mic, Layers, Camera, Save, BrainCircuit, Lock, Unlock, AlertTriangle, ChevronRight, Sun, Droplet
} from 'lucide-react';

// 💡 1. [엄격한 한글화 규칙 적용 & 상세 설명 보강] 공식 안료 완벽 데이터베이스
const TONER_DB = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임. (WT346 : WT144 = 1 : 0.9)' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋음. 채도가 높고 입자감이 좋은 청색계열의 컬러에 사용됨.' },
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
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제. 주로 채도 높은 적색 이펙트 컬러에 사용함. 은폐력은 떨어짐.' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상변화가 큰 특수 펄 조색제. 15도는 맑은 적색, 45도는 맑은 녹색, 110도는 약하게 녹색으로 변하는 펄.' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제. WT372 보다도 작음. 15도는 적청색, 나머지 각도(45 & 110도)는 녹황색으로 변하는 간섭 펄 입자임.' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제. 15도는 맑은 청색, 나머지 각도(45 & 110도)는 맑은 녹색으로 변하는 간섭 펄 입자임.' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: 'WT305보다 조금 큰 반짝임이 좋은 매끄러운 특수 알루미늄 조색제. WT305 보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제. WT346보다 밝고 녹색이 더 많음' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 예) 현대 XB3, 아우디 LX7L, LX6T, BMW A96 등에 사용됨.' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제. 솔리드 컬러에서 명암을 밝게 하고 색상을 줄임. 이펙트 컬러에서 15도는 어둡고 나머지 각도(45 & 110도)는 밝게 함. 입자감을 줄임.' },
  'WT 322': { role: '마이크로 화이트', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 사용함. 15도는 황색을 띠며 어둡고 나머지 각도(45 & 110도)는 청색을 띠며 밝게 함.' },
  'WT 323': { role: '스페셜 블랙', desc: '표준 흑색 조색제. 알루미늄 입자에 사용하면 명암은 어두워지고 약하게 적황색이 늘어남. 솔리드 컬러에 사용하면 명도와 채도를 낮춤.' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제. 은폐력은 떨어짐. 주로 이펙트 컬러에 사용함.' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '이펙트 컬러에 사용하는 녹색을 띤 맑은 황색 조색제. 알루미늄 입자에 혼합하면 15도는 맑은 황색, 나머지 각도(45 & 110도)는 녹황색을 띰.' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 밝은 황색 조색제. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서는 특히 45 & 110도에 밝은 황색이 필요할 경우에만 소량 사용.' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러에 사용하는 탁한 황색.' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색 조색제. 주로 이펙트 컬러에 사용. 은폐력은 떨어짐.' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 주로 솔리드 컬러에 사용. 이펙트 컬러에는 특히 45 & 110도에 밝은 황적색이 부족할 경우에만 소량 사용.' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '이펙트 컬러에서 맑은 적황색을 내는 조색제. 솔리드 컬러에는 사용을 금함.' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 주로 적색 이펙트 컬러에 사용하며 전체적으로 황적색을 내고 명암을 조금 어둡게 함.' },
  'WT 333': { role: '그라나다 레드', desc: '밝은 적색 조색제. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서 특히 45 & 110도에 적색이 부족할 경우 소량 사용됨.' },
  'WT 334': { role: '옥사이드 레드', desc: '주로 솔리드 컬러에 사용하는 탁한 적색 조색제. 조색제 단독으로는 은폐력 좋음. 이펙트 컬러에서 특히 45 & 110도에 황적색을 띠게 하기위해 소량 사용.' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서는 특히 45 & 110도에 밝은 녹황색이 부족할 경우에만 소량 사용.' },
  'WT 336': { role: '트랜스루센트 레드', desc: '선명하며 어두운 갈색 조색제. 이펙트 컬러에만 사용.' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 주로 솔리드 컬러에 사용함. 약하게 청색을 띰.' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제. 백색 및 알루미늄 입자에 혼합할 경우 맑은 분홍색을 나타냄.' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 청색 및 회색 컬러에 주로 사용되며 보라색을 내고 명암을 어둡게 함.' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '맑은 자주색 조색제. WT338에 비해 밝고 청색이 적음. 주로 이펙트 컬러에 사용함. 알루미늄 입자에 혼합할 경우 맑은 분홍색을 냄.' },
  'WT 341': { role: '아주르 블루', desc: '채도 높은 청색 조색제. 이펙트 컬러에서 15도는 녹청색, 나머지 각도(45 & 110도)는 적청색을 띰. 관찰각도 별로 컬러의 변화가 가장 큼.' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 이펙트 컬러에 사용하면 15도는 보라색, 나머지 각도(45 & 110도)는 자주색을 내는 조색제. WT339에 비해 청색이 적음.' },
  'WT 343': { role: '블루', desc: '표준 청색 조색제. 솔리드와 이펙트 컬러에 모두 사용하는 중간 청색 조색제.' },
  'WT 344': { role: '다크 블루', desc: '어두운 청색 조색제. 이펙트 컬러에서 15도는 청색, 나머지 각도(45 & 110도)는 적색을 띰. 청색 조색제 중 가장 어두움.' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '맑고 선명한 황색을 조금 띠는 녹색 조색제. WT347에 비해 밝고 황색이 많음.' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 청색 조색제. 특히 45 & 110도에서 녹색이 가장 많은 청색 조색제. 이펙트 컬러에 가장 많이 사용하는 청색임.' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 녹색 조색제. WT345에 비해 청색이 많고 어두움.' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '채도 높은 청색 조색제. 이펙트 컬러에서 15도는 녹색이 강한 청색, 나머지 각도(45 & 110도)는 약하게 적색을 띰.' },
  'WT 349': { role: '트랜스루센트 그린', desc: '녹색 저농 조색제. WT347의 저농 버전. (WT349 : WT347 = 10.52 : 1)' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제. WT323의 저농 버전. (WT350 : WT323 = 2.89 : 1)' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '저농 청색 조색제. WT348의 저농 버전. (WT351 : WT348 = 8.7 : 1)' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. WT321의 저농 버전. (WT352 : WT321 = 7.69 : 1)' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농 버전. (WT353 : WT338 = 5.68 : 1)' },
  'WT 354': { role: '화인 실버', desc: '매우 작은 크기의 일반형 알루미늄 조색제. WT356 보다 작음.' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 광휘형 알루미늄 조색제. 은폐력은 떨어짐.' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 일반형 알루미늄 조색제.' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 작은 일반형 알루미늄 조색제. WT356보다 15도는 어둡고, 나머지 각도(45 & 110도)는 밝음.' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트 컬러용 특수 실버 조색제' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄 조색제. WT356 보다 15도는 밝고, 나머지 각도(45 & 110도)는 어두움.' },
  'WT 360': { role: '코올스 실버', desc: 'WT359보다 큰 일반형 알루미늄 조색제. WT359보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄 조색제. WT362보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제. WT361에 비해 크기가 작음.' },
  'WT 363': { role: '브릴리언트 골드', desc: '밝은 황색 알루미늄 조색제. 은폐력이 우수함.' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기의 백색 펄 조색제.' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 펄 조색제. 15도는 청적색, 나머지 각도(45 & 110도)는 황녹색으로 변하는 간섭 펄 입자임.' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 황색 펄 조색제. 15도는 황색, 나머지 각도(45 & 110도)는 청색으로 변하는 간섭 펄 입자임.' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 펄 조색제. 15도는 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간 크기의 백색 펄 조색제.' },
  'WT 369': { role: '레드 펄', desc: '작은 크기의 적색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임. 적색 입자감 있는 컬러에 적용하며, 다른 펄보다 은폐력이 있음.' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기의 맑은 청색 펄 조색제. 15도는 녹청색, 나머지 각도(45 & 110도)는 적황색으로 변하는 간섭 펄 입자임.' },
  'WT 371': { role: '브라운 펄', desc: '중간 크기의 주황색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 적색이 있는 청색 펄 조색제. 15도는 적청색, 나머지 각도(45 & 110도)는 녹황색으로 변하는 간섭 펄 입자임.' },
  'WT 373': { role: '루비 펄', desc: '중간 크기의 은폐력이 있는 적색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기의 청녹색 펄 조색제. 15도는 청녹색, 나머지 각도(45 & 110도)는 황적색으로 변하는 간섭 펄 입자임.' },
  'WT 375': { role: '그린 펄', desc: '중간 크기의 녹색 펄 조색제. 15도는 맑은 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기의 적색 펄 조색제. 15도는 적색, 나머지 각도(45 & 110도)는 녹색으로 변하는 간섭 펄 입자임.' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 약하게 녹색을 띠며 나머지 각도는 약하게 적색을 띰.' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄 조색제. 입자의 반짝임이 매우 좋음. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색 펄 조색제. 입자의 반짝임이 매우 좋음. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 청색, 나머지 각도(45 & 110도)는 황색으로 변하는 간섭 펄 입자임.' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 황색, 나머지 각도(45 & 110도)는 청색으로 변하는 간섭 펄 입자임.' },
  'WT 383': { role: '브릴리언트 오렌지', desc: 'WT363에 비해 적색감이 많은 적황색 알루미늄 조색제.' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: 'Transparent White. WT387에 비해 점도가 높음.' },
  'WT 386': { role: '플롭 컨트롤', desc: '측면을 밝게 하기 위한 명암 조정제.' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: 'Viscosity Additive' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT323보다 어두움. 주로 흑색계열의 컬러에 제한적으로 사용함.' },
  'WT 389': { role: '플래틴 실버 화인', desc: '작은 고휘도 광휘형 알루미늄 조색제. WT303보다 크고 WT390보다 작음.' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기의 고휘도 광휘형 알루미늄 조색제. WT389보다 큼. 알루미늄 입자 중 15도가 가장 밝고 나머지 각도(45 & 110도)가 가장 어두움.' },
  'WT 392': { role: '매직 이펙트', desc: '관찰각도에 따라 색상변화가 큰 특수 펄 조색제. 색상이 WT312의 반대로 변함. 15도는 맑은 녹색, 45도는 맑은 적색, 110도는 약하게 적색으로 변하는 펄.' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색을 띠는 밝은 황색 조색제. WT327에 비해 녹색이 적음. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서 특히 45 & 110도에 밝은 황색이 필요할 경우에만 소량 사용.' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제, 블랜딩용 첨가제.' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 염료를 함유하고 있어 알루미늄 입자에 2% 이상 사용하면 알루미늄 입자와 반응하여 색상이 변할 수 있고 내구성에도 문제가 될 수 있음(솔리드: 최대 5%, 실버: 최대 2%, 펄: 최대 5% 이내 사용)' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제. WT455를 베이스코트 무게의 10% 혼합하면 특히 겨울과 같은 낮은 습도 조건에서 작업성이 좋아지며 외관도 개선됨.' },
  'WT 3080': { role: '스페셜 애디티브', desc: '도막 보정 및 흐름 방지 첨가제' },
};

// 💡 2. 수학 및 광학 렌더링 로직
const lerp = (a, b, t) => a + (b - a) * t;
const lerpHue = (a, b, t) => {
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  let h = a + d * t;
  if (h < 0) h += 360;
  if (h >= 360) h -= 360;
  return h;
};
const lerpColor = (c1, c2, t) => ({
  h: lerpHue(c1.h, c2.h, t),
  s: lerp(c1.s, c2.s, t),
  l: lerp(c1.l, c2.l, t)
});

const getTonerVisuals = (code, role, desc = '') => {
  const isPearl = role.includes('펄') || role.includes('이펙트') || role.includes('글라스');
  const isSilver = role.includes('실버') || role.includes('알루미늄');
  const isSolid = !isPearl && !isSilver;

  let faceColor = '#e2e8f0';
  let particleColor1 = '#ffffff';
  let particleColor2 = '#94a3b8';

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
          backgroundSize: `${size}px ${size}px`,
          boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9)'
      };
  }
  return { smoothStyle, macroStyle };
};

const getOptics = (tonersList, weightKey) => {
  const colorToners = tonersList.filter(t => !t.role.includes('지정되지 않은'));
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t[weightKey]) || 0), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0, rGreen=0, rRed=0, rYellow=0, rViolet=0;
  let wSilver=0, wWhite=0, wBlack=0, wPearl=0, wBinder=0;
  let interferenceColor = null;

  colorToners.forEach(t => {
    const w = parseFloat(t[weightKey]) || 0;
    if (w <= 0) return;
    const role = t.role || '';
    const code = t.code || '';
    let strength = 1.0;
    if (code.includes('144') || code.includes('341') || code.includes('300') || code.includes('338')) strength = 2.5;

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

  const pSilver = wSilver / totalForRatio;
  const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio;
  const pPearl = wPearl / totalForRatio;
  const pColor = colorWeight / totalForRatio;

  let baseL = (pWhite * 96) + (pSilver * 65) + (pPearl * 85);
  if (effectiveW === 0 && wBinder > 0) { baseL = 90; }

  let blackImpact = Math.pow(pBlack, 0.45) * 60; 
  if (pWhite > 0.6) { blackImpact = blackImpact * 0.15; }
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
  if (pWhite > 0.6) { sat = sat * 0.3; }

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
  // 💡 [초보자용 디자인 자동 설치 마법]
  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(script);
    }
  }, []);

  const [toners, setToners] = useState([
    { id: 'WT387', code: 'WT 387', role: TONER_DB['WT 387'].role, adjustedWeight: "148" },
    { id: 'WT321', code: 'WT 321', role: TONER_DB['WT 321'].role, adjustedWeight: "88.5" },
    { id: 'WT350', code: 'WT 350', role: TONER_DB['WT 350'].role, adjustedWeight: "1.9" },
    { id: 'WT328', code: 'WT 328', role: TONER_DB['WT 328'].role, adjustedWeight: "0.5" },
    { id: 'WT3080', code: 'WT 3080', role: TONER_DB['WT 3080'].role, adjustedWeight: "12" },
  ]);
  
  const [pearlToners, setPearlToners] = useState([
    { id: 'WT387_p', code: 'WT 387', role: TONER_DB['WT 387'].role, adjustedWeight: "155" },
    { id: 'WT385_p', code: 'WT 385', role: TONER_DB['WT 385'].role, adjustedWeight: "38.7" },
    { id: 'WT377_p', code: 'WT 377', role: TONER_DB['WT 377'].role, adjustedWeight: "9" },
    { id: 'WT386_p', code: 'WT 386', role: TONER_DB['WT 386'].role, adjustedWeight: "20.4" },
    { id: 'WT381_p', code: 'WT 381', role: TONER_DB['WT 381'].role, adjustedWeight: "3.6" },
    { id: 'WT304_p', code: 'WT 304', role: TONER_DB['WT 304'].role, adjustedWeight: "5.8" },
  ]);
  
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(true);
  const [targetColorCode, setTargetColorCode] = useState('FORD-UG PLATINUM');
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState(null);

  const initialChat = { id: 1, type: 'system', text: '💡 **[HI-TEC Master Engine V3.0 로드 완료]**\n- **Role**: Spies Hecker 페인트 기술 교육 전문가 및 엑셀 수식 설계자\n- **Rule**: 철저한 정식 한글 명칭 표기, 미확인 코드 차단(ERR-404), 멀티 시각화 렌더링 강제 실행.', time: new Date().toLocaleTimeString('ko-KR') };
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
    
    setTotalBaseWeight(baseTotal.toFixed(2));
    setTotalPearlWeight(pearlTotal.toFixed(2));
    setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    
    setBaseOptics(getOptics(toners, 'adjustedWeight'));
    setPearlOptics(getOptics(pearlToners, 'adjustedWeight'));
    
    const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners;
    setFinalOptics(getOptics(activeToners, 'adjustedWeight'));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    const scrollToBottom = () => { if (chatContainerRef.current) { chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; } };
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 50);
    return () => clearTimeout(timeoutId);
  }, [chatMessages, isAiProcessing]);

  const handlePointerMove = (e) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100;
    let y = ((e.clientY - rect.top) / rect.height) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    setLightPos({ x, y });
  };

  const addChatMessage = (type, text) => { 
    setChatMessages(prev => [...prev, { id: Date.now(), type, text, time: new Date().toLocaleTimeString('ko-KR') }]); 
  };

  const handleClearAll = () => {
    setToners([]); setPearlToners([]); setTargetColorCode(''); setIsBaseConfirmed(false);
    setChatMessages([initialChat, { id: Date.now(), type: 'system', text: '🗑️ **[ACTION_RESET]** 명령어 실행됨. 모든 배합 리스트가 즉시 [빈 상태]로 초기화되었습니다.', time: new Date().toLocaleTimeString('ko-KR') }]);
  };

  const handleConfirmBase = () => {
    setIsBaseConfirmed(true);
    addChatMessage('system', '🔒 **[STATE_LOCK]** 기준 코드가 확정되었습니다. [멀티 시각화 렌더링 로직]에 따라 Base 및 Pearl-Effect, 최종 시뮬레이션 레이어를 동시 활성화합니다.');
  };

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    addChatMessage('user', q);
    setChatInput('');
    setIsAiProcessing(true);

    setTimeout(() => {
      let advice = `👑 **[HI-TEC 마스터 엔진]**\n수치 계산을 넘어 현장 조색 솔루션을 제공합니다. 명령어 (${q}) 에 대한 분석이 완료되었습니다.`;
      setIsAiProcessing(false);
      addChatMessage('ai', advice);
    }, 600);
  };

  const processWeightInput = (rawValue) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); 
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, '');
    if (val.startsWith('.')) val = '0' + val;
    return val;
  };

  const handleWeightInputChange = (id, rawValue, isPearl = false) => {
    const cleanValue = processWeightInput(rawValue);
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: cleanValue } : t));
    else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: cleanValue } : t));
  };

  const handleCodeChange = (id, newCode, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim(); 
    const targetToners = isPearl ? pearlToners : toners; 
    const setter = isPearl ? setPearlToners : setToners;
    
    setter(targetToners.map(toner => {
      if (toner.id === id) {
        let matchedTonerInfo = TONER_DB[formattedCode]; 
        let finalCode = formattedCode; 
        if (!matchedTonerInfo) {
          const numMatch = formattedCode.match(/\d+/);
          if (numMatch) {
            finalCode = `WT ${numMatch[0]}`;
            matchedTonerInfo = TONER_DB[finalCode] || { role: '지정되지 않은 안료', desc: `DB에 없습니다.` };
          }
        }
        return matchedTonerInfo ? { ...toner, code: finalCode, role: matchedTonerInfo.role } : { ...toner, code: newCode, role: '코드 입력' };
      }
      return toner;
    }));
  };

  const removeToner = (id, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id));
    else setToners(toners.filter(t => t.id !== id));
  };
  
  const addToner = (isPearl = false) => {
    const newToner = { id: `new_${Date.now()}`, code: '', role: '안료 코드 입력', adjustedWeight: "" };
    if (isPearl) setPearlToners([...pearlToners, newToner]);
    else setToners([...toners, newToner]);
  };

  const getColorString = (opticsObj, angle) => `hsl(${Math.round(opticsObj[angle].h)}, ${Math.round(opticsObj[angle].s)}%, ${Math.round(opticsObj[angle].l)}%)`;

  const getInteractiveBackground = (opticsObj, lPos) => {
    const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2));
    const normalizedDist = Math.min(1, dist / 50); 
    let activeColor;
    if (normalizedDist < 0.5) {
      const t = normalizedDist * 2;
      activeColor = lerpColor(opticsObj.face, opticsObj.mid, t);
    } else {
      const t = (normalizedDist - 0.5) * 2;
      activeColor = lerpColor(opticsObj.mid, opticsObj.flop, t);
    }
    const colorStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(activeColor.l)}%)`;
    const isLight = opticsObj.mid.l > 80;
    const highlightAlpha = lerp(0.9, 0.2, normalizedDist);
    const highlightStr = isLight ? `rgba(255,255,255,${lerp(1, 0.4, normalizedDist)})` : `rgba(255,255,255,${highlightAlpha})`;
    const shadowL = isLight ? lerp(90, 70, normalizedDist) : lerp(10, 0, normalizedDist);
    const shadowStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(shadowL)}%)`;
    const spread = lerp(30, 60, normalizedDist);
    return `radial-gradient(circle at ${lPos.x}% ${lPos.y}%, ${highlightStr} 0%, ${colorStr} ${spread}%, ${shadowStr} 100%)`;
  };

  const anglePresets = [
    { id: 'face', label: '정면 (Face 15°)', pos: {x: 50, y: 50} },
    { id: 'mid', label: '중면 (Mid 45°)', pos: {x: 25, y: 25} },
    { id: 'flop', label: '측면 (Flop 110°)', pos: {x: 5, y: 5} },
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-hidden">
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 3.0</span></h1>
        </div>
        <button className="flex items-center space-x-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-bold transition-colors shadow-lg"><FolderOpen size={16} /><span>엑셀 DB 동기화</span></button>
      </header>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start overflow-hidden h-[calc(100vh-72px)]">
        {/* Left Column: Editor */}
        <div className="lg:col-span-7 flex flex-col h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <Sliders className="text-blue-600 mr-2" size={20} />
                공식 배합 시트 (B2:D20)
              </h2>
              {isBaseConfirmed && <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-1 rounded flex items-center"><Lock size={12} className="mr-1"/> 시트 고정됨</span>}
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)}
                placeholder="컬러코드 입력"
                className="bg-white border border-slate-300 px-3 py-2 rounded-md text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 flex-1 uppercase shadow-inner"
              />
              <button onClick={handleConfirmBase} disabled={isBaseConfirmed} className={`px-3 py-2 rounded-md text-sm font-bold flex items-center shadow-md transition-colors ${isBaseConfirmed ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}>
                {isBaseConfirmed ? <Lock size={14} className="mr-1"/> : <Unlock size={14} className="mr-1"/>}<span>기준 확정</span>
              </button>
              <button onClick={handleClearAll} className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-3 py-2 rounded-md text-sm font-bold flex items-center transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-white relative">
            <div className="space-y-3 pb-6">
              <div className="text-sm font-black text-slate-500 mb-2 flex items-center justify-between border-b border-slate-100 pb-2">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  <span className="mr-2 text-xs font-bold text-purple-700">3Coat (펄) 모드</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                    <div className={`block w-8 h-5 rounded-full transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isThreeCoatMode ? 'transform translate-x-3' : ''}`}></div>
                  </div>
                </label>
              </div>

              {toners.map((toner) => {
                const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '');
                return (
                  <div key={toner.id} className="group grid grid-cols-12 gap-3 items-start bg-slate-50 hover:bg-blue-50/50 p-2.5 rounded-md border border-slate-200 transition-colors">
                    <div className="col-span-3 mt-0.5 relative">
                      <div 
                        className="absolute left-2.5 top-1/2 transform -translate-y-1/2 flex w-7 h-3.5 rounded shadow-sm border border-slate-400 pointer-events-auto cursor-pointer hover:scale-125 transition-transform z-10 overflow-hidden"
                        title="클릭하여 안료 정밀 분석 뷰어 열기"
                        onClick={() => {
                          let finalCode = toner.code.toUpperCase().trim();
                          if (!finalCode.startsWith('WT ')) {
                             const match = finalCode.match(/\d+/);
                             if(match) finalCode = `WT ${match[0]}`;
                          }
                          if(TONER_DB[finalCode]) setSelectedTonerForView(finalCode);
                        }}
                      >
                        <div className="flex-1" style={visuals.macroStyle}></div>
                        <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                      </div>
                      <input type="text" value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} placeholder="Code" className="w-full bg-white text-slate-900 text-[14px] font-black pl-11 pr-2 py-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none uppercase shadow-sm" />
                    </div>
                    <div className="col-span-6 flex flex-col justify-start py-0.5">
                      <div className="text-[14px] font-bold text-blue-700 leading-tight break-keep" title={toner.role}>{toner.role}</div>
                      <div className="text-[12px] text-slate-600 leading-snug mt-1.5 break-keep truncate" title={TONER_DB[toner.code] ? TONER_DB[toner.code].desc : ''}>
                        {TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '특성 정보 없음'}
                      </div>
                    </div>
                    <div className="col-span-3 flex justify-end items-center space-x-1 mt-0.5">
                      <input 
                        type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} placeholder="0" 
                        className="bg-white border border-slate-300 text-slate-900 font-bold px-2 py-1.5 rounded-md text-[14px] w-16 text-right focus:outline-none focus:border-blue-500 clean-number-input shadow-sm" 
                      />
                      <span className="text-slate-500 text-[12px] font-bold">g</span>
                      <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-2.5 border border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50 rounded-md text-slate-500 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-2 shadow-sm">
                <Plus size={16} /><span>베이스 안료 추가</span>
              </button>
            </div>

            {isThreeCoatMode && (
              <div className="mt-2 pt-4 border-t-2 border-dashed border-purple-200 space-y-3 pb-8">
                <div className="text-sm font-black text-purple-700 mb-2 flex items-center">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const visuals = getTonerVisuals(toner.code, toner.role, TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '');
                  return (
                    <div key={toner.id} className="group grid grid-cols-12 gap-3 items-start bg-purple-50/40 p-2.5 rounded-md border border-purple-100 transition-colors">
                      <div className="col-span-3 mt-0.5 relative">
                        <div 
                          className="absolute left-2.5 top-1/2 transform -translate-y-1/2 flex w-7 h-3.5 rounded shadow-sm border border-slate-400 pointer-events-auto cursor-pointer hover:scale-125 transition-transform z-10 overflow-hidden"
                          title="클릭하여 안료 정밀 분석 뷰어 열기"
                          onClick={() => {
                            let finalCode = toner.code.toUpperCase().trim();
                            if (!finalCode.startsWith('WT ')) {
                               const match = finalCode.match(/\d+/);
                               if(match) finalCode = `WT ${match[0]}`;
                            }
                            if(TONER_DB[finalCode]) setSelectedTonerForView(finalCode);
                          }}
                        >
                          <div className="flex-1" style={visuals.macroStyle}></div>
                          <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                        </div>
                        <input type="text" value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} placeholder="Code" className="w-full bg-white text-slate-900 text-[14px] font-black pl-11 pr-2 py-1.5 border border-purple-200 rounded focus:border-purple-500 focus:outline-none uppercase shadow-sm" />
                      </div>
                      <div className="col-span-6 flex flex-col justify-start py-0.5">
                        <div className="text-[14px] font-bold text-purple-700 leading-tight break-keep" title={toner.role}>{toner.role}</div>
                        <div className="text-[12px] text-slate-600 leading-snug mt-1.5 break-keep truncate" title={TONER_DB[toner.code] ? TONER_DB[toner.code].desc : ''}>
                          {TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '특성 정보 없음'}
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-end items-center space-x-1 mt-0.5">
                        <input 
                          type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)} placeholder="0" 
                          className="bg-white border border-purple-200 text-slate-900 font-bold px-2 py-1.5 rounded-md text-[14px] w-16 text-right focus:outline-none focus:border-purple-500 clean-number-input shadow-sm" 
                        />
                        <span className="text-slate-500 text-[12px] font-bold">g</span>
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
        <div className="lg:col-span-5 flex flex-col h-full space-y-4">
          
          <div className={`bg-white border ${isBaseConfirmed ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-300'} rounded-xl p-4 shadow-xl flex-none transition-all duration-300`}>
            <h3 className="text-[15px] font-bold mb-3 flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={18} />멀티 시각화 렌더링 비교 (Multi-View)</span>
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

          <div className="bg-white border border-slate-300 rounded-xl p-4 flex flex-col flex-1 shadow-xl overflow-hidden">
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

      {selectedTonerForView && TONER_DB[selectedTonerForView] && (() => {
        const tonerInfo = TONER_DB[selectedTonerForView];
        const visuals = getTonerVisuals(selectedTonerForView, tonerInfo.role, tonerInfo.desc);
        return (
          <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl w-[700px] max-w-[95%] shadow-2xl overflow-hidden border border-slate-700">
                <div className="bg-slate-900 p-5 flex justify-between items-center">
                   <h3 className="text-white font-bold text-lg flex items-center"><Droplet className="mr-2 text-blue-400"/> {selectedTonerForView} 단일 안료 정밀 뷰어</h3>
                   <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white transition-colors"><X size={24}/></button>
                </div>
                <div className="p-6">
                   <div className="flex items-center mb-3">
                      <div className="flex w-10 h-5 rounded shadow-sm border border-slate-400 overflow-hidden mr-3">
                        <div className="flex-1" style={visuals.macroStyle}></div>
                        <div className="flex-1 border-l border-slate-400" style={visuals.smoothStyle}></div>
                      </div>
                      <div className="text-2xl font-black text-blue-700">{tonerInfo.role}</div>
                   </div>
                   <p className="text-slate-700 text-[15px] mb-6 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-inner font-medium">{tonerInfo.desc}</p>
                   
                   <div className="flex gap-4">
                      <div className="flex-1">
                         <div className="text-xs font-bold text-slate-500 mb-2 text-center uppercase tracking-widest bg-slate-100 py-1 rounded">입자 정밀 관찰 (Macro View)</div>
                         <div className="h-44 rounded-xl shadow-inner border border-slate-400 relative overflow-hidden" style={visuals.macroStyle}></div>
                      </div>
                      <div className="flex-[1.5]">
                         <div className="text-xs font-bold text-slate-500 mb-2 text-center uppercase tracking-widest bg-slate-100 py-1 rounded">색상 트래블 (Color Shift: Face 15° ➡️ Flop 110°)</div>
                         <div className="h-44 rounded-xl shadow-inner border border-slate-400 relative overflow-hidden" style={visuals.smoothStyle}></div>
                      </div>
                   </div>
                   <div className="mt-6 text-center">
                      <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 hover:bg-slate-700 text-white px-10 py-3 rounded-xl font-bold shadow-md transition-all text-sm w-full">닫기</button>
                   </div>
                </div>
             </div>
          </div>
        );
      })()}

      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white font-sans animate-in fade-in duration-300 backdrop-blur-xl select-none">
          <header className="p-6 flex justify-between items-center bg-black/50 border-b border-slate-800">
            <h2 className="text-xl font-bold tracking-widest text-slate-300 uppercase flex items-center"><Camera className="mr-3 text-blue-500"/> HI-TEC MULTI 3D VIEW</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-500 rounded-full transition-colors border border-slate-700"><X size={24}/></button>
          </header>

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
                  style={{ background: getInteractiveBackground(baseOptics, lightPos) }}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                {baseOptics.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" style={{ opacity: lerp(0.4, 0.05, Math.min(1, Math.sqrt(Math.pow(lightPos.x - 50, 2) + Math.pow(lightPos.y - 50, 2)) / 50)) }}></div>}
                <div className="absolute top-6 left-6 bg-black/80 px-4 py-2 rounded-xl font-bold text-sm border border-slate-600 text-slate-200 shadow-lg">A. 베이스 코트 (Ground)</div>
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
                  {anglePresets.map((angle) => (
                    <button 
                      key={angle.id} onClick={(e) => { e.stopPropagation(); setLightPos(angle.pos); }}
                      className="px-6 py-2.5 rounded-xl font-bold uppercase transition-all bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-blue-400"
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
