import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Zap, Maximize, Lock, Layers, BrainCircuit, Mic, MicOff, ChevronRight, Sun, Droplet, Camera, X, Image as ImageIcon, ScanLine, Beaker, Minus, ChevronsLeft, ChevronsRight
} from 'lucide-react';

// 💡 1. 사용자 맞춤형 안료 DB 
// 🚨 [디버깅 완료] 실버/펄 계열의 Face(정면) 명도를 실제 금속 물성에 맞춰 정밀 재조정했습니다.
const TONER_DB: Record<string, { role: string, desc: string, type: string, face: string, flop: string }> = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임. (배합비율 WT346 : WT144 = 1 : 0.9)', type: 'solid', face: '#0284c7', flop: '#0c4a6e' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋으며, 채도가 높고 입자감이 좋은 청색 계열 컬러에 사용됨.', type: 'silver_fine', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두우며 주로 흑색 계열의 컬러에 제한적으로 사용.', type: 'solid', face: '#0f172a', flop: '#020617' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨.', type: 'silver_fine', face: '#e2e8f0', flop: '#64748b' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 알루미늄 입자와 반응하여 색상이 변할 수 있음. (사용 한도: 솔리드 5%, 실버 2%, 펄 5% 이내)', type: 'solid', face: '#000000', flop: '#000000' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제. 작업성 및 외관 개선됨.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 813': { role: '오렌지/옐로우 계열', desc: '오렌지/옐로우 계열 조색제. 현장 대응용 보강 안료로 주로 사용됨.', type: 'solid', face: '#f59e0b', flop: '#78350f' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제 및 블랜딩(이음매 도장)용 특수 첨가제.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. 측면(110도)을 더 어둡게 함. 주로 적색 이펙트 컬러에 제한적으로 사용.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제. 실버달러형 특수 조색제.', type: 'silver_fine', face: '#d1d5db', flop: '#475569' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크 특수 조색제.', type: 'xirallic', face: '#fef08a', flop: '#475569' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용.', type: 'silver_fine', face: '#cbd5e1', flop: '#334155' },
  'WT 307': { role: '프리즈마 실버', desc: '정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제(홀로그램 효과).', type: 'xirallic', face: '#e2e8f0', flop: '#a855f7' },
  'WT 308': { role: '브라이트 오렌지', desc: '주로 이펙트 컬러에 사용하는 맑은 주황색 조색제. 단독 은폐력은 상당히 떨어짐.', type: 'solid', face: '#ea580c', flop: '#7c2d12' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 주로 채도가 높은 이펙트 컬러에 혼합하여 사용하며 은폐력은 떨어짐.', type: 'solid', face: '#d946ef', flop: '#701a75' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 분말 사용을 위한 전용 조색제 바인더.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제. 채도가 높고 순수하여 단독 은폐력은 떨어짐.', type: 'solid', face: '#ef4444', flop: '#7f1d1d' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상 변화가 매우 큰 특수 펄 조색제. 15도는 맑은 적색, 45/110도는 약하게 녹색으로 변함.', type: 'pearl', face: '#ef4444', flop: '#22c55e' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제. 15도는 적청색, 나머지는 녹황색 간섭 펄을 나타냄.', type: 'pearl', face: '#3b82f6', flop: '#84cc16' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제. 15도는 맑은 청색, 나머지는 맑은 녹색 간섭 펄을 발현함.', type: 'pearl', face: '#06b6d4', flop: '#10b981' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: 'WT305보다 조금 더 크며 반짝임이 좋은 매끄러운 특수 알루미늄. 15도는 밝고 나머지 각도는 어두움.', type: 'silver_fine', face: '#94a3b8', flop: '#334155' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제. WT346보다 명도가 밝고 녹색빛이 더 많이 감돎.', type: 'solid', face: '#0284c7', flop: '#082f49' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 정면 및 측면 모두 균일한 실버 색감을 띔.', type: 'pearl', face: '#e2e8f0', flop: '#64748b' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제. 솔리드 컬러에서 명암을 밝게 하고 색상을 줄임.', type: 'solid', face: '#ffffff', flop: '#e2e8f0' },
  'WT 322': { role: '마이크로 화이트', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 제한적으로 사용함.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 323': { role: '스페셜 블랙', desc: '가장 맑고 진한 표준 흑색 조색제. 솔리드에선 명도 및 채도를 낮춤.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제. 은폐력은 떨어지며 주로 이펙트 컬러에 사용.', type: 'solid', face: '#f59e0b', flop: '#9a3412' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '선명한 녹색빛을 띠는 맑은 황색 조색제. 알루미늄 혼합 시 15도는 맑은 황색, 나머지는 녹황색을 띔.', type: 'solid', face: '#eab308', flop: '#65a30d' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 채도 높고 밝은 황색 조색제. 주로 솔리드에 사용.', type: 'solid', face: '#fde047', flop: '#ca8a04' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러에 사용하는 탁한 오커 브라운 계열의 황색. 정면은 어둡고 탁하며, 측면은 밝은 노란색.', type: 'solid', face: '#b45309', flop: '#451a03' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색(스칼렛) 조색제. 은폐력은 크게 떨어짐.', type: 'solid', face: '#f59e0b', flop: '#ea580c' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 무연(납 미함유) 성분. 솔리드 조색에 주로 사용됨.', type: 'solid', face: '#ea580c', flop: '#9a3412' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '이펙트 컬러에서 맑은 적황색을 내는 조색제. 측면에서 극도로 어둡고 정면에서 투명함.', type: 'solid', face: '#d97706', flop: '#451a03' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 적색 이펙트/메탈릭에 사용. 전체적인 황적색을 발현함.', type: 'solid', face: '#b91c1c', flop: '#7c2d12' },
  'WT 333': { role: '그라나다 레드', desc: '블랙 톤이 포함된 밝은 적색 조색제. 주로 솔리드 컬러에 사용함.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 334': { role: '옥사이드 레드', desc: '주로 솔리드 컬러에 사용하는 탁한 적색 조색제. 단독 은폐력이 매우 좋음.', type: 'solid', face: '#7f1d1d', flop: '#450a0a' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제. 솔리드 컬러 배합에 주로 사용함.', type: 'solid', face: '#d97706', flop: '#78350f' },
  'WT 336': { role: '트랜스루센트 레드', desc: '선명하며 어두운 갈색 조색제. 이펙트 컬러 조색에만 사용.', type: 'solid', face: '#7c2d12', flop: '#450a0a' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 약하게 청색을 띠는 선명하고 밝은 적색 조색제.', type: 'solid', face: '#ef4444', flop: '#991b1b' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제. 단색 조색시 정측면 모두 맑은 적색을 유지함.', type: 'solid', face: '#d946ef', flop: '#86198f' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 메탈릭 혼합 시 측면은 붉은빛, 정면은 맑은 보라빛을 띔.', type: 'solid', face: '#8b5cf6', flop: '#4c1d95' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '매우 높은 채도의 맑은 자주색 조색제. WT338 대비 밝고 청색 톤이 적음.', type: 'solid', face: '#e879f9', flop: '#a21caf' },
  'WT 341': { role: '아주르 블루', desc: '채도가 높은 맑은 청색 조색제. 15도는 녹청색, 나머지는 적청색을 띄며 변색 폭이 큼.', type: 'solid', face: '#2563eb', flop: '#1e3a8a' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 은폐력이 있음. 15도는 진한 보라색, 나머지는 자주색을 나타냄.', type: 'solid', face: '#6d28d9', flop: '#2e1065' },
  'WT 343': { role: '블루', desc: '솔리드 및 이펙트 모두 사용하는 중간 순수 청색 조색제. 정측면 모두 균일한 청색.', type: 'solid', face: '#3b82f6', flop: '#1e40af' },
  'WT 344': { role: '다크 블루', desc: '어두운 표준 청색 조색제. 15도는 청색, 나머지는 붉은 적색을 띔.', type: 'solid', face: '#1d4ed8', flop: '#0f172a' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '맑고 선명한 황색을 조금 띠는 녹색 조색제. WT347대비 명도가 밝고 황색이 많음.', type: 'solid', face: '#10b981', flop: '#064e3b' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 투명한 청색 조색제. 이펙트 컬러 조색에 가장 많이 베이스로 사용하는 청색임.', type: 'solid', face: '#1d4ed8', flop: '#020617' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 맑고 선명한 녹색 조색제. WT345 대비 명도가 어두움.', type: 'solid', face: '#059669', flop: '#022c22' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '맑고 채도 높고 투명한 특수 청색 조색제. 15도는 녹색이 강한 청색, 나머지는 약한 적색을 띔.', type: 'solid', face: '#0ea5e9', flop: '#0369a1' },
  'WT 349': { role: '트랜스루센트 그린', desc: '투명한 녹색 저농 조색제. WT347의 저농도 버전.', type: 'solid', face: '#34d399', flop: '#064e3b' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '투명한 저농도 흑색 조색제. 정면은 블랙, 측면은 약간의 황적색을 띠는 깊이 있는 블랙.', type: 'solid', face: '#1e293b', flop: '#451a03' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '투명한 저농 청색 조색제. WT348의 저농도 버전.', type: 'solid', face: '#38bdf8', flop: '#075985' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. WT321의 저농도 버전. 미세한 명도 조절에 사용.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농도 버전. 이펙트 컬러 미세조정에 탁월.', type: 'solid', face: '#c026d3', flop: '#4a044e' },
  
  // 🚨 [디버깅] 실버 계열 명도/채도 100% 정밀 튜닝 (흰 바탕 뭉개짐 방지)
  'WT 354': { role: '화인 실버', desc: '매우 작은 일반형 알루미늄 조색제. 정면은 그레이 빛을 띄고, 측면은 약간 밝음.', type: 'silver_fine', face: '#a1a9b7', flop: '#5d6778' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 입자의 광휘형 알루미늄 조색제. 정면은 맑고 투명하게 빛나며 측면은 확연히 어두움.', type: 'silver_coarse', face: '#e8ecf2', flop: '#475163' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 범용 일반형 알루미늄 조색제.', type: 'silver_fine', face: '#b8c0cc', flop: '#4f596b' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 가장 작고 백색빛을 띠는 일반형 알루미늄. 실버 안료 중 은폐력이 가장 좋음.', type: 'silver_fine', face: '#d1d7e0', flop: '#707b8f' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트 및 펄 컬러 전용으로 배합되는 특수 실버 조색제.', type: 'silver_fine', face: '#b0b8c6', flop: '#596375' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄. 15도는 밝게 빛나고 나머지는 어두움.', type: 'silver_coarse', face: '#c8d0db', flop: '#4a5468' },
  'WT 360': { role: '코올스 실버', desc: '중간 규격의 거친 알루미늄(어두운 회색 톤). 15도 밝고 나머지 어두움.', type: 'silver_coarse', face: '#8b95a5', flop: '#2f3644' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄. 실버 안료 중 측면이 제일 밝게 유지됨.', type: 'silver_coarse', face: '#d8dfe8', flop: '#7a8599' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제. 정면은 맑고 측면은 어두움.', type: 'silver_fine', face: '#c0c8d6', flop: '#545f73' },
  
  'WT 363': { role: '브릴리언트 골드', desc: '펄 입자가 강한 밝은 황색 알루미늄. 반짝임이 뛰어나며 은폐력이 매우 우수함.', type: 'pearl', face: '#fbbf24', flop: '#b45309' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기(중간~가장 거침)의 백색 운모 펄 조색제. 정/측면 모두 은색빛을 띠는 화이트 펄 질감을 냄.', type: 'pearl', face: '#ffffff', flop: '#94a3b8' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 간섭 펄 조색제. 15도는 청적색, 나머지는 완전히 대비되는 황녹색을 띔.', type: 'pearl', face: '#e1e1e1', flop: '#be185d' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 맑은 황색 간섭 펄 조색제. 15도는 뚜렷한 황색, 나머지는 청색으로 변함.', type: 'pearl', face: '#e1e1e1', flop: '#4c1d95' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 간섭 펄 조색제. 15도는 녹색, 나머지는 적색으로 컬러 트래블이 발생함.', type: 'pearl', face: '#e1e1e1', flop: '#991b1b' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간~미세 크기의 미세 백색 펄 조색제. 정측면 모두 고운 은색빛을 유지함.', type: 'pearl', face: '#ffffff', flop: '#64748b' },
  'WT 369': { role: '레드 펄', desc: '작은 크기의 적색 착색 펄 조색제. 적색 입자감이 뚜렷하며 다른 펄에 비해 은폐력이 있음.', type: 'pearl', face: '#dc143c', flop: '#7f1d1d' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기의 맑은 청색 간섭 펄 조색제. 15도 녹청색, 나머지는 뚜렷한 적황색으로 변색됨.', type: 'pearl', face: '#e1e1e1', flop: '#be123c' },
  'WT 371': { role: '브라운 펄', desc: '중간~거친 크기의 주황색/구리색 착색 펄 조색제. 깊이 있는 브라운 메탈릭에 필수.', type: 'pearl', face: '#cd853f', flop: '#451a03' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 크기의, 적색이 가미된 청색 간섭 펄 조색제.', type: 'pearl', face: '#e1e1e1', flop: '#c026d3' },
  'WT 373': { role: '루비 펄', desc: '중간~거친 크기의 은폐력이 강한 붉은 적색 착색 펄 조색제.', type: 'pearl', face: '#dc143c', flop: '#7f1d1d' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기의 청녹색 간섭 펄 조색제. 15도 청녹색, 나머지는 황적색 간섭효과를 냄.', type: 'pearl', face: '#e1e1e1', flop: '#c2410c' },
  'WT 375': { role: '그린 펄', desc: '중간 크기의 녹색빛 특수 간섭 펄 조색제. 15도 녹색, 나머지는 적색.', type: 'pearl', face: '#e1e1e1', flop: '#b91c1c' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기의 특수 적색 간섭 펄 조색제. 15도 적색, 나머지는 뚜렷한 녹색.', type: 'pearl', face: '#e1e1e1', flop: '#16a34a' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭(Xirallic) 백색 펄. 입자 반짝임이 글라스처럼 매우 좋음. 15도 약한 녹색, 나머지 약한 적색 띔.', type: 'xirallic', face: '#ffffff', flop: '#64748b' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄. 입자가 굵고 햇빛 아래서 반짝임이 극도로 강한 착색 펄.', type: 'xirallic', face: '#dc143c', flop: '#7f1d1d' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색(카퍼) 펄. 입자가 매우 거칠고 다이아몬드 같은 반짝임이 극에 달함.', type: 'xirallic', face: '#cd853f', flop: '#7c2d12' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄. 색감이 매우 맑고 선명함. 15도 맑은 녹색, 나머지는 적색 간섭 펄.', type: 'xirallic', face: '#e1e1e1', flop: '#166534' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄. 반짝임이 가장 우수한 블루. 15도 청색, 나머지는 황색 간섭 펄.', type: 'xirallic', face: '#e1e1e1', flop: '#1e3a8a' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 펄. 측면 관찰 시 매우 맑은 톤 유지. 15도 황색, 나머지는 청색 간섭 펄.', type: 'xirallic', face: '#e1e1e1', flop: '#a16207' },
  
  'WT 383': { role: '브릴리언트 오렌지', desc: 'WT363 대비 적색감이 훨씬 많은 적황색 광휘 알루미늄. 착색감이 매우 맑음.', type: 'silver_coarse', face: '#e24d2e', flop: '#9a3412' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: '투명 화이트 밸런스 조정제(Transparent White). 도막의 투명도를 조절. WT387 대비 점도가 높음.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 386': { role: '플롭 컨트롤', desc: '안료 입자 배열 및 측면 반사각(Flop) 조절제. 금속 입자가 눕도록 유도하여 측면을 밝게 함.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: '점도 조절 첨가제(Viscosity Additive). 도료의 기본 흐름성과 볼륨감을 결정함.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '가장 어두운 흑색 조색제. WT323보다 확연히 어두움.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 389': { role: '플래틴 실버 화인', desc: '미세한 은빛이 감도는 고휘도 플래티넘 실버 알루미늄 조색제.', type: 'silver_fine', face: '#a1a6b4', flop: '#475569' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기의 고휘도 알루미늄. 15도에서 입자가 가장 밝게 빛나며 반대로 측면은 가장 어두움.', type: 'silver_coarse', face: '#cbd5e1', flop: '#334155' },
  'WT 392': { role: '매직 이펙트', desc: '색상이 WT312(매직 파이어)와 완전히 반대로 변하는 특수 펄. 15도 녹색, 45도 적색, 110도 약한 적색.', type: 'pearl', face: '#e1e1e1', flop: '#ef4444' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색 띠는 밝고 화사한 황색 조색제. WT327 대비 녹색 톤이 적음.', type: 'solid', face: '#fef08a', flop: '#a16207' },
  'WT 6050': { role: '에디티브 6050', desc: '퍼마하이드 하이텍 전용 속건용/부분 도장 컨트롤러.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 6052': { role: '에디티브 6052', desc: '퍼마하이드 하이텍 전용 지연용 컨트롤러. 넓은 면적 도장 시 얼룩 방지.', type: 'binder', face: '#ffffff', flop: '#ffffff' }
};

// 💡 2. 벡터 HSL 수식
const hex2rgb = (hex: string) => {
  let v = parseInt(hex.replace('#',''), 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
};

const rgb2hsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// 💡 3. 🚨[디버깅 완료] 입자 질감별 초정밀 노이즈 렌더링 엔진🚨
const getRealisticTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
  if (!isMetallic || type === 'binder') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };

  let baseFreq = '0.5', alphaMult = '5', surfaceScale = '3', specConst = '1.5', specExp = '30';
  
  // 선생님의 지시대로 "일반형/큰 광휘형/작은 광휘형"에 맞게 프랙탈 계수를 세분화했습니다.
  if (type === 'xirallic') { baseFreq = '0.6'; alphaMult = '15'; surfaceScale = '5'; specConst = '3.5'; specExp = '20'; }
  else if (type === 'pearl') { baseFreq = '0.8'; alphaMult = '8'; surfaceScale = '3'; specConst = '1.5'; specExp = '15'; }
  else if (type === 'silver_fine') { baseFreq = '1.5'; alphaMult = '4'; surfaceScale = '1.5'; specConst = '1.2'; specExp = '40'; }
  else if (type === 'silver_coarse') { baseFreq = '0.4'; alphaMult = '12'; surfaceScale = '4'; specConst = '2.5'; specExp = '10'; }

  // 특수문자(#)로 인한 렌더링 파괴 방지를 위해 %23ffffff 로 완벽히 인코딩
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <filter id="f">
      <feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3" result="t"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -2" in="t" result="c"/>
      <feSpecularLighting in="t" surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="${specExp}" lighting-color="%23ffffff">
        <feDistantLight azimuth="45" elevation="60"/>
      </feSpecularLighting>
      <feComposite in2="c" operator="in" result="s"/>
      <feMerge>
        <feMergeNode in="c"/>
        <feMergeNode in="s"/>
      </feMerge>
    </filter>
    <rect width="100%" height="100%" fill="${encodeURIComponent(faceColor)}"/>
    <rect width="100%" height="100%" filter="url(#f)" opacity="0.9"/>
  </svg>`;

  return {
    backgroundImage: `url("data:image/svg+xml;utf8,${svgString}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
  };
};

const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code !== '' && !t.role.includes('지정되지'));
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let faceX=0, faceY=0, faceL=0;
  let flopX=0, flopY=0, flopL=0;
  let totalWeight = 0; let hasMetallic = false;

  colorToners.forEach(t => {
     let w = parseFloat(t.adjustedWeight) || 0;
     if (w <= 0 || !t.code) return;
     let db = TONER_DB[t.code];
     if(!db) return;

     totalWeight += w;
     if(db.type !== 'solid' && db.type !== 'binder') hasMetallic = true;

     let fRgb = hex2rgb(db.face); let fHsl = rgb2hsl(fRgb.r, fRgb.g, fRgb.b);
     let fRad = fHsl.h * Math.PI / 180;
     faceX += w * fHsl.s * Math.cos(fRad); faceY += w * fHsl.s * Math.sin(fRad); faceL += w * fHsl.l;

     let flRgb = hex2rgb(db.flop); let flHsl = rgb2hsl(flRgb.r, flRgb.g, flRgb.b);
     let flRad = flHsl.h * Math.PI / 180;
     flopX += w * flHsl.s * Math.cos(flRad); flopY += w * flHsl.s * Math.sin(flRad); flopL += w * flHsl.l;
  });

  if(totalWeight === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let avgFaceH = Math.atan2(faceY, faceX) * 180 / Math.PI; if(avgFaceH < 0) avgFaceH += 360;
  let avgFaceS = Math.min(100, Math.sqrt(faceX*faceX + faceY*faceY) / totalWeight);
  let avgFaceL = faceL / totalWeight;

  let avgFlopH = Math.atan2(flopY, flopX) * 180 / Math.PI; if(avgFlopH < 0) avgFlopH += 360;
  let avgFlopS = Math.min(100, Math.sqrt(flopX*flopX + flopY*flopY) / totalWeight);
  let avgFlopL = flopL / totalWeight;

  let midH = (avgFaceH + avgFlopH) / 2;
  let midS = (avgFaceS + avgFlopS) / 2;
  let midL = (avgFaceL + avgFlopL) / 2;

  return {
     face: {h: avgFaceH, s: avgFaceS, l: avgFaceL},
     mid: {h: midH, s: midS, l: midL},
     flop: {h: avgFlopH, s: avgFlopS, l: avgFlopL},
     isMetallic: hasMetallic
  };
};

const getColorString = (opticsObj: any, angle: 'face'|'mid'|'flop') => {
  if (!opticsObj || !opticsObj[angle]) return 'hsl(0,0%,90%)';
  return `hsl(${Math.round(opticsObj[angle].h)}, ${Math.round(opticsObj[angle].s)}%, ${Math.round(opticsObj[angle].l)}%)`;
};

// 💡 확장 뷰어 3D 배경 렌더링 (안전한 인코딩 적용 유지)
const getInteractiveBackground = (opticsObj: any, lPos: any, hasMetallic: boolean): React.CSSProperties => {
  if (!opticsObj || !opticsObj.face || !opticsObj.mid || !opticsObj.flop) return { background: '#f1f5f9' };
  
  const viewAngleT = Math.max(0, Math.min(1, lPos.x / 100));
  
  const lerpColorAdvanced = (c1: any, c2: any, t: number) => {
      let d = c2.h - c1.h; if (d > 180) d -= 360; if (d < -180) d += 360;
      let h = c1.h + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360;
      return { h, s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) };
  };

  let activeBaseColor = viewAngleT > 0.5 ? lerpColorAdvanced(opticsObj.mid, opticsObj.face, (viewAngleT - 0.5) * 2) : lerpColorAdvanced(opticsObj.flop, opticsObj.mid, viewAngleT * 2);
  const baseColorStr = `hsl(${Math.round(activeBaseColor.h)}, ${Math.round(activeBaseColor.s)}%, ${Math.round(activeBaseColor.l)}%)`;
  
  const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2)); 
  const normalizedDist = Math.min(1, dist / 70); 
  const highlightAlpha = lerp(0.6, 0.0, normalizedDist);
  
  const gradient = `radial-gradient(circle at ${lPos.x}% ${lPos.y}%, rgba(255,255,255,${highlightAlpha}) 0%, ${baseColorStr} ${lerp(20, 70, normalizedDist)}%, hsl(${Math.round(activeBaseColor.h)}, ${Math.round(activeBaseColor.s)}%, ${Math.round(activeBaseColor.l * 0.4)}) 100%)`;

  if (hasMetallic) {
      const svgNoiseStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3"/><feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 5 -2" result="c"/><feSpecularLighting surfaceScale="3" specularConstant="1.5" specularExponent="30" lighting-color="%23ffffff" in="c"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting></filter><rect width="100%" height="100%" filter="url(#f)" opacity="0.5"/></svg>`;
      const encodedNoise = encodeURIComponent(svgNoiseStr);
      return {
          backgroundImage: `url("data:image/svg+xml;utf8,${encodedNoise}"), ${gradient}`,
          backgroundBlendMode: 'screen, normal',
          backgroundColor: baseColorStr
      };
  }
  return { background: gradient };
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

  const [focusTarget, setFocusTarget] = useState<{ id: string, type: 'base' | 'pearl' } | null>(null);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [chatMessages, setChatMessages] = useState<any[]>([
    { id: 1, type: 'system', text: '💡 **[HI-TEC Master V16.3 최종 해결 완료]**\n- 🎙️ 🚨**[음성 엔진 버그 완벽 해결]**🚨 "311 20.5" 처럼 부르면 대기 시간 없이 즉각 빈칸을 찾아 채워 넣습니다.\n- ✨ 🚨**[실버 질감 화이트 문제 완벽 해결]**🚨 실버/펄 안료의 명도를 재설정하고, 안전한 인코딩을 통해 리얼한 입자 질감이 100% 부활했습니다.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [liveVoiceText, setLiveVoiceText] = useState('');
  const recognitionRef = useRef<any>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);
  const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null); 

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
    
    setBaseOptics(getOptics(toners)); 
    setPearlOptics(getOptics(pearlToners)); 
    setFinalOptics(getOptics(isThreeCoatMode ? [...toners, ...pearlToners] : toners));

    const checkMetallic = (tonerList: any[]) => tonerList.some(t => {
      const type = TONER_DB[t.code]?.type || '';
      return type !== 'solid' && type !== 'binder' && type !== '';
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

  const getLightDirectionText = (x: number, y: number) => {
    let angle = Math.round(110 - (x / 100) * 95); 
    let pos = "센터 조명";
    if (x > 70) pos = "우측면 (Face)"; else if (x < 30) pos = "좌측면 (Flop)";
    if (y < 30) pos = `상단 ${pos}`; else if (y > 70) pos = `하단 ${pos}`;
    return `[조명위치: ${pos}] 현재 관찰 각도: 약 ${angle}°`;
  };

  const addChatMessage = (type: string, text: string) => { 
    setChatMessages(prev => [...prev, { id: Date.now(), type, text, time: new Date().toLocaleTimeString('ko-KR') }]); 
  };

  const handleClearAll = () => {
    setToners([{ id: `init_b_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" }]); 
    setPearlToners([{ id: `init_p_${Date.now()}`, code: '', role: '코드 입력', adjustedWeight: "" }]); 
    setTargetColorCode(''); setIsBaseConfirmed(false); setScannedImage(null);
    addChatMessage('system', '🗑️ 모든 배합 리스트가 초기화되었습니다.');
  };

  const handleConfirmBase = () => {
    setIsBaseConfirmed(true);
    addChatMessage('system', '🔒 기준 코드가 확정되었습니다. 멀티 시각화 렌더링을 활성화합니다.');
  };

  const addTonerAutoFill = (codeNum: string, weightStr: string) => {
    const finalCode = `WT ${codeNum}`;
    const tonerInfo = TONER_DB[finalCode];
    if (!tonerInfo) return false;

    const isPearlLayer = isThreeCoatMode && (tonerInfo.type === 'pearl' || tonerInfo.type === 'xirallic');
    const setter = isPearlLayer ? setPearlToners : setToners;

    setter(prev => {
      // 💡 완전히 비어있거나, 입력하려는 코드가 이미 빈칸으로 존재하는 경우 그곳에 매칭
      const emptyIndex = prev.findIndex(t => t.code === '' || (t.code === finalCode && t.adjustedWeight === ''));
      if (emptyIndex !== -1) {
        const updated = [...prev];
        updated[emptyIndex] = { ...updated[emptyIndex], code: finalCode, role: tonerInfo.role, adjustedWeight: weightStr };
        return updated;
      }
      return [...prev, { id: `auto_${Date.now()}_${Math.random()}`, code: finalCode, role: tonerInfo.role, adjustedWeight: weightStr }];
    });
    return true;
  };

  // 💡 [디버깅 완료] 🚨음성 인식 방어벽 완전 철거 및 실시간 인터셉트 엔진🚨
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

    recognition.onstart = () => {
      setIsListening(true);
      addChatMessage('system', '🎙️ **[무한 음성 쾌속 채움 모드]**\n"311 20.5" 처럼 부르기만 해도 딜레이 없이 즉시 채워집니다. 끝내시려면 "완료"라고 말씀하세요.');
    };
    
    let processedTranscript = ''; // 이미 처리된 문자열 추적기

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setLiveVoiceText(currentTranscript);

      // 새롭게 추가된 음성 구간만 발췌하여 즉시 분석
      const newSegment = currentTranscript.substring(processedTranscript.length);
      
      if (newSegment.trim().length > 0) {
          if (/(완료|끝)/.test(newSegment)) {
             recognition.stop(); setIsListening(false);
             addChatMessage('system', '🎙️ [음성 입력 완료] 마이크가 정상 종료되었습니다.'); return;
          }

          // 💡 "20점 5" 등을 20.5로 완벽 치환, 불필요 단어 싹 제거
          let normalizedText = newSegment.replace(/점/g, '.').replace(/(\d)\s*\.\s*(\d)/g, '$1.$2');
          // 순수하게 숫자만 배열로 추출
          const nums = normalizedText.match(/\d+(?:\.\d+)?/g);
          
          if (nums && nums.length > 0) {
              let addedCount = 0;
              let i = 0;
              
              // 💡 족집게 쾌속 파싱 알고리즘
              while(i < nums.length) {
                  let codeC = nums[i];
                  if (TONER_DB[`WT ${codeC}`]) {
                      let weightC = nums[i+1];
                      if (weightC && TONER_DB[`WT ${weightC}`]) {
                          addTonerAutoFill(codeC, "");
                          i++; 
                      } else if (weightC) {
                          addTonerAutoFill(codeC, weightC);
                          i += 2; 
                      } else {
                          addTonerAutoFill(codeC, "");
                          i++;
                      }
                      addedCount++;
                  } else {
                      // 코드가 아니라 용량(그람수)만 단독으로 들어왔을 경우
                      const weightStr = codeC;
                      const updateLastEmptyWeight = (prev: any[]) => {
                          let found = false;
                          const next = [...prev];
                          for (let j = next.length - 1; j >= 0; j--) {
                              if (next[j].code !== '' && next[j].adjustedWeight === '') {
                                  next[j] = { ...next[j], adjustedWeight: weightStr };
                                  found = true;
                                  break;
                              }
                          }
                          return { next, found };
                      };

                      if (isThreeCoatMode) {
                          setPearlToners(prev => {
                              const { next, found } = updateLastEmptyWeight(prev);
                              if (found) return next;
                              setToners(prevBase => {
                                  const baseResult = updateLastEmptyWeight(prevBase);
                                  return baseResult.found ? baseResult.next : prevBase;
                              });
                              return prev;
                          });
                      } else {
                          setToners(prev => updateLastEmptyWeight(prev).next);
                      }
                      addedCount++;
                      i++;
                  }
              }
              if (addedCount > 0) {
                  addChatMessage('user', `🗣️ "${newSegment.trim()}" -> ✅ 즉각 반영됨`);
                  processedTranscript = currentTranscript; // 처리 완료 마킹
              }
          }
      }
    };
    recognition.onerror = () => { setIsListening(false); setLiveVoiceText(''); };
    recognition.onend = () => { setIsListening(false); setLiveVoiceText(''); };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const imageUrl = URL.createObjectURL(file); setScannedImage(imageUrl); setIsScanning(true);
    addChatMessage('system', '⏳ **[AI 비전 사냥 가동]** 안료 번호와 소수점 중량만 추출하여 빈칸에 자동 입력합니다.');
    
    try {
      if ((window as any).Tesseract) {
        const result = await (window as any).Tesseract.recognize(file, 'eng', { logger: (m: any) => console.log(m) });
        const text = result.data.text;
        const numRegex = /\d+(?:\.\d+)?/g;
        const numbers = text.match(numRegex) || [];
        
        let pendingCode: string | null = null; let addedCount = 0;
        for(let i=0; i<numbers.length; i++) {
            const num = numbers[i];
            if (num.length >= 3 && num.length <= 4 && /^[13468]/.test(num)) {
                if (pendingCode) { if(addTonerAutoFill(pendingCode, "")) addedCount++; }
                pendingCode = num;
            } else {
                if (pendingCode) { if(addTonerAutoFill(pendingCode, num)) addedCount++; pendingCode = null; }
            }
        }
        if (pendingCode) { if(addTonerAutoFill(pendingCode, "")) addedCount++; }

        if (addedCount > 0) addChatMessage('ai', `📸 **[스캔 매칭 완료]** 영수증 숫자 배열 분석으로 총 ${addedCount}개 데이터를 화면 빈칸에 꽂아 넣었습니다.`);
        else throw new Error("코드 인식 실패");
      } else { throw new Error("OCR 모듈 미적용"); }
    } catch (error) {
      addChatMessage('ai', `❌ **[스캔 경고]** 사진 화질 문제로 숫자를 찾지 못했습니다. 사진을 띄워두었으니 직접 추가해 주십시오.`);
    }
    setIsScanning(false);
  };

  const handleAskSolution = () => {
    if (!chatInput.trim()) return;
    const q = chatInput; addChatMessage('user', q); setChatInput(''); setIsAiProcessing(true);
    setTimeout(() => {
      setIsAiProcessing(false);
      const regex = /(?:WT\s*)?(\d{3,4}).*?(감소|빼|추가|올리|더|변화)/i;
      const match = q.match(regex);
      let advice = "";
      
      if (match) {
          const finalCode = `WT ${match[1]}`;
          const tonerInfo = TONER_DB[finalCode];
          if (tonerInfo) {
              advice = `👑 **[AI 광학 시뮬레이션 분석: ${finalCode}]**\n\n`;
              advice += `▪️ **특성:** ${tonerInfo.desc}\n\n`;
              if (q.includes('감소') || q.includes('빼')) {
                  advice += `📉 **[감소 시 변화]** ${tonerInfo.role.split(' ')[0]} 입자의 지배력이 약해져 반사각(Flop)에서 바탕색이 투명하게 드러나고 명도가 상승할 수 있습니다.\n\n`;
              } else if (q.includes('추가') || q.includes('올리') || q.includes('더')) {
                  advice += `📈 **[추가 시 변화]** 정면(Face) 색감이 짙어지고, 은폐력이 상승하여 다소 탁해질 수 있습니다.\n\n`;
              }
              advice += `💡 **Action:** 상단의 **[확장 뷰어 (Before/After)]**를 열어 **[퀵 에디터 버튼]**을 눌러보세요. 원본과 수정본의 렌더링을 실시간으로 비교할 수 있습니다!`;
          } else { advice = `⚠️ ${finalCode} 안료를 DB에서 찾을 수 없습니다.`; }
      } else { advice = `👑 명령어 분석 완료. 구체적으로 "WT 315 0.9 감소 색상 변화" 처럼 질문해 주세요.`; }
      addChatMessage('ai', advice);
    }, 600);
  };

  const processWeightInput = (rawValue: string) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); 
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') return ''; // 빈 값이면 빈 값 그대로 유지
    if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, '');
    if (val.startsWith('.')) val = '0' + val; 
    return val;
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
        let matchedTonerInfo = TONER_DB[formattedCode]; let finalCode = formattedCode; 
        if (!matchedTonerInfo) {
          const numMatch = formattedCode.match(/\d+/);
          if (numMatch) { finalCode = `WT ${numMatch[0]}`; matchedTonerInfo = TONER_DB[finalCode]; }
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
    if (isPearl) { setPearlToners([...pearlToners, newToner]); setFocusTarget({ id: newId, type: 'pearl' }); } 
    else { setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'base' }); }
  };

  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if(t.id === id) {
         let current = parseFloat(t.adjustedWeight) || 0;
         let newVal = Math.max(0, current + delta);
         return { ...t, adjustedWeight: newVal.toFixed(1) };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      
      {scannedImage && (
        <div className="bg-slate-900 border-b-4 border-blue-500 shadow-2xl z-50 p-2 md:p-4 sticky top-0 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-2 px-2 max-w-[1600px] mx-auto">
            <h2 className="text-white text-sm md:text-base font-bold flex items-center">
              <ImageIcon className="mr-2 text-blue-400" size={18}/> 사진 고속 참조 모드
            </h2>
            <button onClick={() => setScannedImage(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1.5 rounded-full border border-slate-700">
              <X size={18} />
            </button>
          </div>
          <div className="w-full max-h-[30vh] md:max-h-[25vh] overflow-auto rounded-lg border border-slate-700 bg-black flex justify-center max-w-[1600px] mx-auto">
             <img src={scannedImage} alt="스캔된 배합표" className="object-contain w-full h-auto" />
          </div>
        </div>
      )}

      {isScanning && (
        <div className="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="relative mb-4">
            <ScanLine className="text-blue-500 w-28 h-28 animate-pulse opacity-80" />
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-400 shadow-[0_0_15px_#60a5fa] animate-[scan_1.5s_ease-in-out_infinite]"></div>
          </div>
          <h2 className="text-white text-xl font-black tracking-wide">숫자 헌팅 필터 가동 중...</h2>
        </div>
      )}

      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 16.3</span></h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-auto lg:h-[calc(100vh-10px)] overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
            
            {isListening && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center space-x-2 text-xs font-bold shadow-inner">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shrink-0"></span>
                <span className="text-slate-400 font-normal shrink-0">음성 쾌속 채움 중:</span>
                <span className="text-slate-900 font-black truncate">{liveVoiceText || '대기 중... (말씀하시면 즉시 입력됩니다)'}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 시트</h2>
              
              <div className="flex space-x-1.5 shrink-0">
                <button onClick={toggleVoiceDictation} className={`px-2.5 py-1.5 rounded-md flex items-center text-xs font-black transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-md border-red-400' : 'bg-slate-700 hover:bg-slate-800 text-white'}`}>
                  {isListening ? <MicOff size={14} className="mr-1" /> : <Mic size={14} className="mr-1" />}
                  <span>{isListening ? '듣고있습니다' : '음성 추가'}</span>
                </button>
                <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleCameraCapture} />
                <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-md flex items-center text-xs font-black shadow-md"><Camera size={14} className="mr-1" />시편 촬영</button>
              </div>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력 (예: UG-Z)" className="bg-white border border-slate-300 px-3 py-2 rounded text-xs font-bold focus:outline-none flex-1 uppercase" />
              <button onClick={handleConfirmBase} className="bg-slate-800 text-white px-3 py-2 rounded text-xs font-bold whitespace-nowrap">확정</button>
              <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-2 py-2 rounded"><Trash2 size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-white relative min-h-[400px] lg:min-h-0">
            <div className="space-y-3 pb-4">
              <div className="text-xs font-black text-slate-400 mb-1 flex items-center justify-between border-b pb-1.5">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-0.5 rounded border">
                  <span className="mr-1.5 text-[11px] font-bold text-purple-700">3Coat 펄 모드</span>
                  <input type="checkbox" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                </label>
              </div>

              {toners.map((toner) => {
                const tonerInfo = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#1e293b', role: '', desc: '' };
                const isEffect = tonerInfo.type !== 'solid' && tonerInfo.type !== 'binder';
                const macroBg = getRealisticTexture(tonerInfo.type, tonerInfo.face, tonerInfo.flop, isEffect);

                return (
                  <div key={toner.id} className="flex flex-col bg-white p-2.5 mb-2 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2 w-full">
                        <div className="w-10 h-5 rounded shadow-xs border flex overflow-hidden cursor-pointer shrink-0 hover:scale-110 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                          <div className="flex-1" style={macroBg}></div>
                          <div className="flex-1 border-l border-slate-400" style={{ background: `linear-gradient(135deg, ${tonerInfo.face} 0%, ${tonerInfo.type!=='solid'?tonerInfo.flop:'rgba(0,0,0,0.4)'} 100%)` }}></div>
                        </div>
                        <input type="text" autoFocus={focusTarget?.id === toner.id} ref={(el) => { if (el && focusTarget?.id === toner.id) { el.focus(); setFocusTarget(null); } }} value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, false)} placeholder="코드입력" className="flex-1 bg-transparent font-black text-blue-700 outline-none text-base uppercase px-1" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-full">
                        <div className="text-xs font-black text-slate-800">{toner.role}</div>
                        <div className="text-[12px] text-slate-600 leading-relaxed mt-1 break-keep whitespace-pre-wrap">
                          {TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '코드를 입력하면 상세 데이터 스펙이 100% 완전 노출됩니다.'}
                        </div>
                      </div>
                      <div className="flex items-center self-end bg-slate-50 p-1 rounded-md border w-full justify-end mt-1">
                        <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)} placeholder="" className="w-20 text-right bg-white border p-1 rounded text-sm font-black text-blue-900 outline-none" />
                        <span className="text-slate-400 text-xs font-bold mx-1.5">g</span>
                        <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold flex items-center justify-center space-x-1 text-xs hover:border-blue-500 transition-colors"><Plus size={14} /><span>빈칸 추가</span></button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-3 border-t-2 border-dashed border-purple-100 space-y-3 pb-6">
                <div className="text-xs font-black text-purple-700 mb-1">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const tonerInfo = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#1e293b', role: '', desc: '' };
                  const isEffect = tonerInfo.type !== 'solid' && tonerInfo.type !== 'binder';
                  const macroBg = getRealisticTexture(tonerInfo.type, tonerInfo.face, tonerInfo.flop, isEffect);
                  
                  return (
                    <div key={toner.id} className="flex flex-col bg-white p-2.5 mb-2 rounded-lg border border-purple-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2 w-full">
                          <div className="w-10 h-5 rounded shadow-xs border flex overflow-hidden cursor-pointer shrink-0 hover:scale-110 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                            <div className="flex-1" style={macroBg}></div>
                            <div className="flex-1 border-l border-slate-400" style={{ background: `linear-gradient(135deg, ${tonerInfo.face} 0%, ${tonerInfo.type!=='solid'?tonerInfo.flop:'rgba(0,0,0,0.4)'} 100%)` }}></div>
                          </div>
                          <input type="text" autoFocus={focusTarget?.id === toner.id} ref={(el) => { if (el && focusTarget?.id === toner.id) { el.focus(); setFocusTarget(null); } }} value={toner.code} onChange={(e) => handleCodeChange(toner.id, e.target.value, true)} placeholder="코드입력" className="flex-1 bg-transparent font-black text-purple-700 outline-none text-base uppercase px-1" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="w-full">
                          <div className="text-xs font-black text-slate-800">{toner.role}</div>
                          <div className="text-[12px] text-slate-600 leading-relaxed mt-1 break-keep whitespace-pre-wrap">
                            {TONER_DB[toner.code] ? TONER_DB[toner.code].desc : '코드를 입력하면 상세 스펙 데이터가 100% 완전 노출됩니다.'}
                          </div>
                        </div>
                        <div className="flex items-center self-end bg-purple-50/30 p-1 rounded-md border border-purple-100 w-full justify-end mt-1">
                          <input type="text" inputMode="decimal" value={toner.adjustedWeight} onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)} placeholder="" className="w-20 text-right bg-white border p-1 rounded text-sm font-black text-purple-900 outline-none" />
                          <span className="text-slate-400 text-xs font-bold mx-1.5">g</span>
                          <button onClick={() => removeToner(toner.id, true)} className="text-purple-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addToner(true)} className="w-full py-2 border border-dashed rounded-lg text-purple-400 font-bold flex items-center justify-center space-x-1 text-xs hover:border-purple-500 transition-colors"><Plus size={14} /><span>빈칸 추가</span></button>
              </div>
            )}
          </div>
          
          <div className="p-3 bg-slate-800 text-slate-200 flex flex-col shrink-0 space-y-2 text-xs rounded-b-xl lg:rounded-none">
             <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
               <div>베이스 합계: <span className="text-white font-black text-sm">{totalBaseWeight}g</span></div>
               <div className="text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/30 flex items-center">
                  <Beaker size={12} className="mr-1"/> 6052: <span className="text-white font-black ml-1">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g</span> <span className="opacity-70 ml-1">({isBaseMetallic ? '메탈릭 20%' : '솔리드 10%'})</span>
               </div>
             </div>
             {isThreeCoatMode && (
               <div className="flex justify-between items-center border-b border-slate-700 pb-1.5">
                 <div>펄 코트 합계: <span className="text-white font-black text-sm">{totalPearlWeight}g</span></div>
                 <div className="text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/30 flex items-center">
                    <Beaker size={12} className="mr-1"/> 6052: <span className="text-white font-black ml-1">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g</span> <span className="opacity-70 ml-1">({isPearlMetallic ? '메탈릭 20%' : '솔리드 10%'})</span>
                 </div>
               </div>
             )}
             <div className="flex justify-between items-center pt-1 font-bold text-sm">
               <span className="text-slate-400 uppercase tracking-wider text-xs">Total Formula</span>
               <span className="text-base text-cyan-400 font-black">{totalFinalWeight} <span className="text-xs">g</span></span>
             </div>
          </div>
        </div>

        {/* Right Column: Multi-View & AI Terminal */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-4">
          <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-xl flex-none">
            <h3 className="text-sm font-bold mb-3 flex justify-between items-center border-b pb-2">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={16} />멀티 렌더링 비교</span>
              <button onClick={() => { 
                  setOriginalFinalOptics(finalOptics); 
                  setIsConfiguratorOpen(true); 
                  setLightPos({x:50,y:50}); 
              }} className="text-xs px-3 py-1.5 bg-blue-50 border border-blue-200 rounded font-black text-blue-700 shadow-sm hover:bg-blue-100 transition-colors">확장 뷰어 (Before/After)</button>
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
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAskSolution()} placeholder="명령어 입력 (예: 315 0.9 감소 색상 변화)" className="w-full bg-white border rounded p-2 text-xs focus:outline-none focus:border-blue-500 shadow-inner" />
              <button onClick={handleAskSolution} className="bg-blue-600 text-white px-4 rounded font-bold text-xs whitespace-nowrap">분석</button>
            </div>
          </div>
        </div>
      </div>

      {/* 안료 디테일 뷰어 모달 */}
      {selectedTonerForView && TONER_DB[selectedTonerForView] && (() => {
        const tonerInfo = TONER_DB[selectedTonerForView];
        const isEffect = tonerInfo.type !== 'solid' && tonerInfo.type !== 'binder';
        const macroBg = getRealisticTexture(tonerInfo.type, tonerInfo.face, tonerInfo.flop, isEffect);
        
        return (
          <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center p-3 backdrop-blur-xs">
             <div className="bg-white rounded-xl w-full max-w-lg flex flex-col max-h-[85vh] shadow-2xl border border-slate-700">
                <div className="bg-slate-900 p-3.5 flex justify-between items-center shrink-0 rounded-t-xl">
                   <h3 className="text-white font-bold text-sm flex items-center"><Droplet className="mr-2 text-blue-400" size={16}/> {selectedTonerForView} 정밀분석</h3>
                   <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-4 overflow-y-auto space-y-4">
                   <div className="flex items-center mb-1">
                      <div className="flex w-16 h-8 rounded shadow-xs border border-slate-400 overflow-hidden mr-3 shrink-0">
                        <div className="flex-1" style={macroBg}></div>
                        <div className="flex-1 border-l border-slate-400" style={{ background: `linear-gradient(135deg, ${tonerInfo.face} 0%, ${isEffect ? tonerInfo.flop : 'rgba(0,0,0,0.4)'} 100%)` }}></div>
                      </div>
                      <div className="text-xl font-black text-blue-700">{tonerInfo.role}</div>
                   </div>
                   <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border font-bold whitespace-pre-wrap break-keep">{tonerInfo.desc}</p>
                   <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                         <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase text-center bg-slate-100 py-1.5 rounded shadow-sm">Macro View (주색/질감)</div>
                         <div className="h-40 rounded-lg border border-slate-300 relative overflow-hidden" style={macroBg}></div>
                      </div>
                      <div className="flex-[1.3]">
                         <div className="text-[10px] font-bold text-slate-400 mb-1 uppercase text-center bg-slate-100 py-1.5 rounded shadow-sm">Color Travel (변각 도막광학)</div>
                         <div className="h-40 rounded-lg border border-slate-300 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${tonerInfo.face} 0%, ${isEffect ? tonerInfo.flop : 'rgba(0,0,0,0.4)'} 100%)` }}></div>
                      </div>
                   </div>
                   <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 text-white py-3 rounded-lg font-bold w-full text-sm shadow-md mt-2 hover:bg-slate-700">닫기</button>
                </div>
             </div>
          </div>
        );
      })()}

      {/* 💡 확장 뷰어 퀵 에디터 패널 */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white backdrop-blur-md select-none">
          <header className="p-3 flex justify-between items-center bg-black/60 border-b border-slate-800 shrink-0">
            <h2 className="text-sm font-black tracking-widest text-slate-300 flex items-center"><Camera className="mr-2 text-blue-500" size={16}/> 실시간 조색 시뮬레이터 (Before & After)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-1.5 bg-slate-800 hover:bg-red-500 rounded-full border border-slate-700 transition-colors"><X size={18}/></button>
          </header>
          
          <div className="w-full bg-slate-900 border-b border-slate-700 p-3 overflow-x-auto flex gap-3 items-center custom-scrollbar shrink-0 shadow-xl">
             <div className="text-[10px] font-black text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50 shrink-0 mr-1 text-center leading-tight">베이스<br/>수정</div>
             {toners.filter(t => t.code).map(t => (
                <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-2 shrink-0 min-w-[240px] items-center shadow-inner">
                   <span className="text-[11px] font-bold text-slate-300 mb-2">{t.code}</span>
                   
                   <div className="flex items-center space-x-1 w-full justify-between">
                      <div className="flex space-x-1">
                        <button onClick={() => quickEditWeight(t.id, -10, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-10</button>
                        <button onClick={() => quickEditWeight(t.id, -1, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-1</button>
                        <button onClick={() => quickEditWeight(t.id, -0.1, false)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-red-800/50">-0.1</button>
                      </div>
                      
                      <div className="flex items-center px-1">
                         <input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, false)} placeholder="" className="w-10 text-center bg-transparent text-sm font-black text-white outline-none" />
                         <span className="text-slate-400 text-[10px] font-bold">g</span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button onClick={() => quickEditWeight(t.id, 0.1, false)} className="bg-blue-900/50 hover:bg-blue-500 text-blue-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-blue-800/50">+0.1</button>
                        <button onClick={() => quickEditWeight(t.id, 1, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">+1</button>
                        <button onClick={() => quickEditWeight(t.id, 10, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">+10</button>
                      </div>
                   </div>
                </div>
             ))}
             {isThreeCoatMode && (
               <>
                 <div className="w-px h-12 bg-slate-700 mx-2 shrink-0"></div>
                 <div className="text-[10px] font-black text-purple-400 bg-purple-900/30 px-2 py-1 rounded border border-purple-800/50 shrink-0 mr-1 text-center leading-tight">펄 코트<br/>수정</div>
                 {pearlToners.filter(t => t.code).map(t => (
                    <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-2 shrink-0 min-w-[240px] items-center shadow-inner">
                       <span className="text-[11px] font-bold text-purple-300 mb-2">{t.code}</span>
                       <div className="flex items-center space-x-1 w-full justify-between">
                          <div className="flex space-x-1">
                            <button onClick={() => quickEditWeight(t.id, -10, true)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-10</button>
                            <button onClick={() => quickEditWeight(t.id, -1, true)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-1</button>
                            <button onClick={() => quickEditWeight(t.id, -0.1, true)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-red-800/50">-0.1</button>
                          </div>
                          
                          <div className="flex items-center px-1">
                             <input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, true)} placeholder="" className="w-10 text-center bg-transparent text-sm font-black text-white outline-none" />
                             <span className="text-slate-400 text-[10px] font-bold">g</span>
                          </div>
                          
                          <div className="flex space-x-1">
                            <button onClick={() => quickEditWeight(t.id, 0.1, true)} className="bg-purple-900/50 hover:bg-purple-500 text-purple-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-purple-800/50">+0.1</button>
                            <button onClick={() => quickEditWeight(t.id, 1, true)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">+1</button>
                            <button onClick={() => quickEditWeight(t.id, 10, true)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">+10</button>
                          </div>
                       </div>
                    </div>
                 ))}
               </>
             )}
          </div>

          <main ref={viewerRef} className="flex-1 p-3 flex flex-col md:flex-row gap-4 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)} onPointerLeave={() => setIsDraggingLight(false)}>
             
             <div className="absolute z-50 flex items-center justify-center pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-14 h-16 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_50px_#fff] border border-white/30"><Sun className="text-yellow-100" size={28} /></div>
                <div className="absolute top-16 whitespace-nowrap text-[11px] font-black text-yellow-300 bg-black/80 px-2.5 py-1 rounded-md shadow-lg border border-yellow-500/30">{getLightDirectionText(lightPos.x, lightPos.y)}</div>
             </div>
             
             {/* 좌측: 변경 전 원본 */}
             <div className="w-full md:flex-1 h-1/2 md:h-[80%] rounded-2xl border border-slate-600 relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]" style={getInteractiveBackground(originalFinalOptics, lightPos, isBaseMetallic || isPearlMetallic)}>
                <div className="absolute top-3 left-3 bg-black/80 px-3 py-1.5 rounded-lg text-xs font-black text-slate-300 border border-slate-700 shadow-md">A. 원본 배합 (변경 전)</div>
             </div>
             
             <div className="text-slate-600 pointer-events-none shrink-0 hidden md:block"><ChevronRight size={32} /></div>
             
             {/* 우측: 변경 후 실시간 렌더링 */}
             <div className="w-full md:flex-1 h-1/2 md:h-[80%] rounded-2xl border-2 border-blue-500 relative overflow-hidden shadow-[0_0_40px_rgba(59,130,246,0.3)]" style={getInteractiveBackground(finalOptics, lightPos, isBaseMetallic || isPearlMetallic)}>
                <div className="absolute top-3 left-3 bg-blue-900/90 px-3 py-1.5 rounded-lg text-xs font-black text-white border border-blue-400 shadow-md flex items-center">
                   <Zap size={14} className="mr-1.5 text-yellow-300 animate-pulse"/> B. 실시간 시뮬레이션 (변경 후)
                </div>
             </div>
             
             <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 w-[92%] sm:w-auto shadow-2xl">
                <span className="text-[10px] text-blue-400 font-bold text-center leading-tight">화면을 드래그하면 원본과 수정본의 반사광을 동시에 비교할 수 있습니다.</span>
                <div className="flex space-x-2 mt-2">
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x:50, y:50}); }} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors">정면 (Face 15°)</button>
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x:25, y:25}); }} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors">중면 (Mid 45°)</button>
                  <button onClick={(e) => { e.stopPropagation(); setLightPos({x:5, y:5}); }} className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 text-[10px] font-bold whitespace-nowrap transition-colors">측면 (Flop 110°)</button>
                </div>
             </div>
          </main>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.3); border-radius: 10px; }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
      `}} />
    </div>
  );
}
