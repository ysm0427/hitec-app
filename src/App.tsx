import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  Sliders, Trash2, Plus, Camera, X, Maximize, 
  Layers, Lock, Unlock, ChevronRight, Sun, Droplet, 
  Image as ImageIcon, ScanLine, Beaker, BookOpen, Search, Zap, FolderOpen
} from 'lucide-react';

// 💡 1. 공식 안료 데이터베이스 (설명글 100% 완전 노출 복원)
const TONER_DB: Record<string, { role: string, desc: string, type: string, face: string, flop: string }> = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임. (배합비율 WT346 : WT144 = 1 : 0.9)', type: 'solid', face: '#0284c7', flop: '#0c4a6e' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋으며, 채도가 높고 입자감이 좋은 청색 계열 컬러에 사용됨.', type: 'silver_fine', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두우며 주로 흑색 계열의 컬러에 제한적으로 사용.', type: 'solid', face: '#0f172a', flop: '#020617' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨. (적용 예: Nissan KAB, Lexus 1F1, M.Benz 047 등)', type: 'silver_fine', face: '#e2e8f0', flop: '#64748b' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 염료를 함유하고 있어 알루미늄 입자에 2% 이상 사용하면 색상이 변할 수 있음. (솔리드 최대 5%, 실버 2%, 펄 5% 이내)', type: 'solid', face: '#000000', flop: '#000000' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제. 베이스코트 무게의 10% 혼합하면 특히 겨울철 작업성이 좋아지며 외관도 개선됨.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. WT332에 비해 채도가 높으며 측면(110도)을 더 어둡게 함. 주로 적색 이펙트 컬러에 제한적으로 사용.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제. WT389보다 입자가 작음. 실버달러형 특수 조색제.', type: 'silver_fine', face: '#d1d5db', flop: '#475569' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크 특수 조색제. 깊이감과 탁월한 반짝임을 부여함.', type: 'xirallic', face: '#fef08a', flop: '#475569' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용. (적용 예: Nissan KAB, Lexus 1F1 등)', type: 'silver_fine', face: '#cbd5e1', flop: '#334155' },
  'WT 307': { role: '프리즈마 실버', desc: '정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제(홀로그램 효과). (적용 예: Audi LX7T 등)', type: 'xirallic', face: '#e2e8f0', flop: '#a855f7' },
  'WT 308': { role: '브라이트 오렌지', desc: '주로 이펙트 컬러에 사용하는 맑은 주황색 조색제. 단독 은폐력은 상당히 떨어짐.', type: 'solid', face: '#ea580c', flop: '#7c2d12' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 주로 채도가 높은 이펙트 컬러에 혼합하여 사용하며 은폐력은 떨어짐.', type: 'solid', face: '#d946ef', flop: '#701a75' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 분말 사용을 위한 전용 조색제 바인더.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제. 채도가 높고 순수하여 적색 이펙트 컬러에 주로 사용.', type: 'solid', face: '#ef4444', flop: '#7f1d1d' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상 변화가 매우 큰 특수 펄. 15도는 맑은 적색, 45도는 맑은 녹색, 110도는 약하게 녹색으로 변함.', type: 'pearl', face: '#ef4444', flop: '#22c55e' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제. WT372보다 작음.', type: 'pearl', face: '#3b82f6', flop: '#84cc16' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제. 15도는 맑은 청색, 나머지는 맑은 녹색 간섭 펄을 발현함.', type: 'pearl', face: '#06b6d4', flop: '#10b981' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: 'WT305보다 조금 더 크며 반짝임이 좋은 매끄러운 특수 알루미늄. WT305보다 15도는 밝고 나머지는 어두움.', type: 'silver_fine', face: '#f8fafc', flop: '#334155' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제. WT346보다 명도가 밝고 녹색빛이 더 많이 감돎.', type: 'solid', face: '#0284c7', flop: '#082f49' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 정면 및 측면 모두 균일한 실버 색감을 띔.', type: 'pearl', face: '#f1f5f9', flop: '#64748b' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제. 솔리드 컬러에서 명암을 밝게 하고 색상을 줄임.', type: 'solid', face: '#ffffff', flop: '#e2e8f0' },
  'WT 322': { role: '마이크로 화이트', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 제한적으로 사용함.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 323': { role: '스페셜 블랙', desc: '가장 맑고 진한 표준 흑색 조색제. 솔리드에선 명도 및 채도를 낮춤.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제. 은폐력은 떨어지며 주로 이펙트 컬러에 사용.', type: 'solid', face: '#f59e0b', flop: '#9a3412' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '선명한 녹색빛을 띠는 맑은 황색 조색제. 알루미늄 혼합 시 측면은 녹황색을 띔.', type: 'solid', face: '#eab308', flop: '#65a30d' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 채도 높고 밝은 황색 조색제. 주로 솔리드에 사용.', type: 'solid', face: '#fde047', flop: '#ca8a04' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러(아이보리, 베이지 등)에 사용하는 탁한 오커 브라운 계열의 황색. 은폐력이 좋음.', type: 'solid', face: '#b45309', flop: '#451a03' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색(스칼렛) 조색제. 은폐력은 크게 떨어짐.', type: 'solid', face: '#f59e0b', flop: '#ea580c' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 무연(납 미함유) 성분. 솔리드 조색에 주로 사용됨.', type: 'solid', face: '#ea580c', flop: '#9a3412' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '이펙트 컬러에서 맑은 적황색을 내는 조색제. (솔리드 컬러 사용 절대 금지)', type: 'solid', face: '#d97706', flop: '#451a03' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 적색 이펙트/메탈릭에 사용. 전체적인 황적색을 발현함.', type: 'solid', face: '#b91c1c', flop: '#7c2d12' },
  'WT 333': { role: '그라나다 레드', desc: '블랙 톤이 포함된 밝은 적색 조색제. 주로 솔리드 컬러에 사용함.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 334': { role: '옥사이드 레드', desc: '주로 솔리드 컬러에 사용하는 탁한 적색 조색제. 단독 은폐력이 매우 좋음.', type: 'solid', face: '#7f1d1d', flop: '#450a0a' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제. 솔리드 컬러 배합에 주로 사용함.', type: 'solid', face: '#d97706', flop: '#78350f' },
  'WT 336': { role: '트랜스루센트 레드', desc: '선명하며 어두운 갈색 조색제. 이펙트 컬러 조색에만 사용.', type: 'solid', face: '#7c2d12', flop: '#450a0a' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 약하게 청색을 띠는 선명하고 밝은 적색 조색제.', type: 'solid', face: '#ef4444', flop: '#991b1b' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제. 백색 혼합 시 맑은 분홍색을 띔.', type: 'solid', face: '#d946ef', flop: '#86198f' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 청색 및 회색 컬러에 사용.', type: 'solid', face: '#8b5cf6', flop: '#4c1d95' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '매우 높은 채도의 맑은 자주색 조색제. WT338 대비 밝고 청색 톤이 적음.', type: 'solid', face: '#e879f9', flop: '#a21caf' },
  'WT 341': { role: '아주르 블루', desc: '채도가 높은 맑은 청색 조색제. 15도는 녹청색, 나머지는 적청색을 띔.', type: 'solid', face: '#2563eb', flop: '#1e3a8a' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 은폐력이 있음. 15도는 진한 보라색, 나머지는 자주색.', type: 'solid', face: '#6d28d9', flop: '#2e1065' },
  'WT 343': { role: '블루', desc: '솔리드 및 이펙트 모두 사용하는 중간 순수 청색 조색제.', type: 'solid', face: '#3b82f6', flop: '#1e40af' },
  'WT 344': { role: '다크 블루', desc: '어두운 표준 청색 조색제. 청색 중 가장 어두움.', type: 'solid', face: '#1d4ed8', flop: '#0f172a' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '맑고 선명한 황색을 조금 띠는 녹색 조색제.', type: 'solid', face: '#10b981', flop: '#064e3b' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 투명한 청색 조색제. 이펙트에 가장 많이 사용하는 청색 베이스.', type: 'solid', face: '#1d4ed8', flop: '#020617' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 맑고 선명한 녹색 조색제.', type: 'solid', face: '#059669', flop: '#022c22' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '맑고 채도 높고 투명한 특수 청색 조색제.', type: 'solid', face: '#0ea5e9', flop: '#0369a1' },
  'WT 349': { role: '트랜스루센트 그린', desc: '투명한 녹색 저농 조색제. WT347의 저농도 버전.', type: 'solid', face: '#34d399', flop: '#064e3b' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '투명한 저농도 흑색 조색제. 정면은 블랙, 측면은 깊이 있는 황적색.', type: 'solid', face: '#1e293b', flop: '#451a03' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '투명한 저농 청색 조색제. WT348의 저농도 버전.', type: 'solid', face: '#38bdf8', flop: '#075985' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. 미세한 명도 조절에 사용.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농도 버전.', type: 'solid', face: '#c026d3', flop: '#4a044e' },
  'WT 354': { role: '화인 실버', desc: '매우 작은 일반형 알루미늄 조색제.', type: 'silver_fine', face: '#cbd5e1', flop: '#64748b' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 입자의 광휘형 알루미늄 조색제. 투명하게 빛나며 측면은 어두움.', type: 'silver_coarse', face: '#f8fafc', flop: '#334155' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 범용 일반형 알루미늄 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 가장 작고 백색빛을 띠는 일반형 알루미늄. 은폐력이 가장 좋음.', type: 'silver_fine', face: '#f8fafc', flop: '#64748b' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트 및 펄 컬러 전용으로 배합되는 특수 실버 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄. 15도는 밝게 빛나고 나머지는 어두움.', type: 'silver_coarse', face: '#f1f5f9', flop: '#334155' },
  'WT 360': { role: '코올스 실버', desc: '중간 규격의 거친 알루미늄(어두운 회색 톤).', type: 'silver_coarse', face: '#94a3b8', flop: '#1e293b' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄. 실버 중 측면이 제일 밝음.', type: 'silver_coarse', face: '#f1f5f9', flop: '#64748b' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제. 정면은 맑고 측면은 어두움.', type: 'silver_fine', face: '#e2e8f0', flop: '#334155' },
  'WT 363': { role: '브릴리언트 골드', desc: '펄 입자가 강한 밝은 황색 알루미늄. 반짝임과 은폐력이 우수함.', type: 'pearl', face: '#fbbf24', flop: '#b45309' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기(가장 거침)의 백색 운모 펄 조색제. 정/측면 모두 화이트 펄 질감.', type: 'pearl', face: '#ffffff', flop: '#94a3b8' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 간섭 펄 조색제. 15도는 청적색, 측면은 황녹색.', type: 'pearl', face: '#a3e635', flop: '#be185d' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 맑은 황색 간섭 펄 조색제. 15도는 황색, 측면은 청색.', type: 'pearl', face: '#facc15', flop: '#4c1d95' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 간섭 펄 조색제. 15도는 녹색, 측면은 적색.', type: 'pearl', face: '#4ade80', flop: '#991b1b' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간~미세 크기의 미세 백색 펄 조색제. 고운 은색빛을 유지함.', type: 'pearl', face: '#f8fafc', flop: '#64748b' },
  'WT 369': { role: '레드 펄', desc: '작은 크기의 적색 착색 펄 조색제. 적색 입자감이 뚜렷하며 은폐력이 있음.', type: 'pearl', face: '#ef4444', flop: '#7f1d1d' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기의 맑은 청색 간섭 펄 조색제. 15도 녹청색, 측면은 적황색.', type: 'pearl', face: '#0ea5e9', flop: '#be123c' },
  'WT 371': { role: '브라운 펄', desc: '중간~거친 크기의 주황색/구리색 착색 펄 조색제. 깊은 브라운 메탈릭.', type: 'pearl', face: '#d97706', flop: '#451a03' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 크기의, 적색이 가미된 청색 간섭 펄 조색제.', type: 'pearl', face: '#3b82f6', flop: '#c026d3' },
  'WT 373': { role: '루비 펄', desc: '중간~거친 크기의 은폐력이 강한 붉은 적색 착색 펄 조색제.', type: 'pearl', face: '#dc2626', flop: '#7f1d1d' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기의 청녹색 간섭 펄 조색제. 15도 청녹색, 측면은 황적색.', type: 'pearl', face: '#0d9488', flop: '#c2410c' },
  'WT 375': { role: '그린 펄', desc: '중간 크기의 녹색빛 특수 간섭 펄 조색제. 15도 녹색, 측면은 적색.', type: 'pearl', face: '#16a34a', flop: '#b91c1c' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기의 특수 적색 간섭 펄 조색제. 15도 적색, 측면은 녹색.', type: 'pearl', face: '#ef4444', flop: '#16a34a' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭(Xirallic) 백색 펄. 입자 반짝임이 다이아몬드처럼 빛남.', type: 'xirallic', face: '#ffffff', flop: '#64748b' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄. 입자가 굵고 햇빛 아래서 반짝임이 극도로 강함.', type: 'xirallic', face: '#ef4444', flop: '#7f1d1d' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색(카퍼) 펄. 입자가 매우 거칠고 반짝임이 극에 달함.', type: 'xirallic', face: '#ea580c', flop: '#7c2d12' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄. 15도 맑은 녹색, 측면은 적색 간섭 펄.', type: 'xirallic', face: '#4ade80', flop: '#166534' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄. 15도 청색, 측면은 황색 간섭 펄.', type: 'xirallic', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 펄. 15도 황색, 측면은 청색 간섭 펄.', type: 'xirallic', face: '#facc15', flop: '#a16207' },
  'WT 383': { role: '브릴리언트 오렌지', desc: '적황색 광휘 알루미늄. WT363 대비 적색감이 훨씬 맑음.', type: 'silver_coarse', face: '#f97316', flop: '#9a3412' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: '투명 화이트 밸런스 조정제(Transparent White). WT387 대비 점도 높음.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 386': { role: '플롭 컨트롤', desc: '안료 입자 배열 및 측면 반사각(Flop) 조절제. 측면을 밝게 유도.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: '점도 조절 첨가제(Viscosity Additive). 도료의 기본 흐름성 결정.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '가장 어두운 흑색 조색제. WT323보다 확연히 어두움.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 389': { role: '플래틴 실버 화인', desc: '미세한 은빛이 감도는 고휘도 플래티넘 실버 알루미늄 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기의 고휘도 알루미늄. 15도에서 입자가 가장 밝게 빛남.', type: 'silver_coarse', face: '#f8fafc', flop: '#334155' },
  'WT 392': { role: '매직 이펙트', desc: '색상이 WT312(매직 파이어)와 완전히 반대로 변하는 특수 펄. 15도 녹색, 45도 적색.', type: 'pearl', face: '#22c55e', flop: '#ef4444' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색 띠는 밝고 화사한 황색 조색제. WT327 대비 녹색 톤이 적음.', type: 'solid', face: '#fef08a', flop: '#a16207' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제 및 블랜딩(이음매 도장)용 특수 첨가제.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 3080': { role: '스페셜 애디티브', desc: '도막 보정 및 흐름 방지 특수 첨가제.', type: 'binder', face: '#ffffff', flop: '#ffffff' }
};

// 💡 [카탈로그용 데이터 추출]
const catalogData = Object.entries(TONER_DB).map(([code, data]) => {
    let labelCategory = "일반 특성";
    let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
    if(data.role.includes("블루") || data.role.includes("레드") || data.role.includes("옐로우") || data.role.includes("그린")) {
        labelCategory = "색상/외관"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
    } else if (data.desc.includes("금지") || data.desc.includes("최대") || data.desc.includes("주의")) {
        labelCategory = "경고/주의사항"; badgeColor = "bg-red-50 text-red-600 border-red-200";
    } else if (data.role.includes("실버") || data.role.includes("펄")) {
        labelCategory = "이펙트 전용"; badgeColor = "bg-blue-50 text-blue-600 border-blue-200";
    } else if (data.type === "binder") {
        labelCategory = "시스템/첨가제"; badgeColor = "bg-purple-50 text-purple-600 border-purple-200";
    }
    return { code, ...data, labelCategory, badgeColor };
});

// 💡 수성 안료 카탈로그 컴포넌트 (터미널 대체)
const PigmentCatalog = memo(() => {
    const [searchTerm, setSearchTerm] = useState('');
    const filtered = catalogData.filter(item => item.code.includes(searchTerm.toUpperCase()) || item.role.includes(searchTerm) || item.desc.includes(searchTerm));

    return (
        <div className="flex flex-col h-full bg-slate-50 border border-slate-300 rounded-xl shadow-xl overflow-hidden">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-lg flex items-center"><BookOpen className="mr-2 text-blue-400" size={20}/>수성 안료 데이터 카탈로그</h3>
                <div className="relative w-48">
                    <input type="text" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="코드 또는 특성 검색" className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-full pl-8 focus:outline-none focus:border-blue-500 transition-colors" />
                    <Search size={14} className="absolute left-2.5 top-1.5 text-slate-400" />
                </div>
            </div>
            
            <div className="p-3 bg-white border-b flex gap-2 flex-wrap text-[11px] font-bold shrink-0">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded border border-slate-200">일반 특성</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-200">색상/외관</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200">이펙트 전용</span>
                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded border border-purple-200">시스템/첨가제</span>
                <span className="px-2 py-1 bg-red-50 text-red-600 rounded border border-red-200">경고/주의사항</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {filtered.map(item => {
                    const isMetallic = item.type !== 'solid' && item.type !== 'binder';
                    return (
                        <div key={item.code} className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="w-full sm:w-32 h-20 sm:h-auto flex-shrink-0 relative border-b sm:border-b-0 sm:border-r border-slate-200" style={getRealisticTexture(item.type, item.face, item.flop, isMetallic)}>
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded">{item.code}</div>
                            </div>
                            <div className="p-3 flex-1">
                                <div className="font-black text-slate-800 text-sm mb-1">{item.role}</div>
                                <div className="flex items-start gap-2 mt-2">
                                    <span className={`shrink-0 inline-flex px-1.5 py-0.5 text-[10px] font-bold rounded border ${item.badgeColor}`}>
                                        {item.labelCategory}
                                    </span>
                                    <p className="text-xs text-slate-600 leading-relaxed break-keep">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

// 💡 광학 수학 로직 (HSL 변환 및 보간)
const hex2rgb = (hex: string) => { let v = parseInt(hex.replace('#',''), 16); return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }; };
const rgb2hsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255; let max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
      let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; }
      h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHue = (a: number, b: number, t: number) => { let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360; let h = a + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360; return h; };
const lerpColor = (c1: any, c2: any, t: number) => ({ h: lerpHue(c1.h, c2.h, t), s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) });

// 💡 🚨[화이트 뭉개짐 방지 완벽 조치]🚨 리얼 3D 프랙탈 질감 엔진 (URL 인코딩 완전 적용)
const getRealisticTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
  if (!isMetallic || type === 'binder' || type === 'solid') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
  let baseFreq = '0.5', alphaMult = '4', surfaceScale = '2', specConst = '1.2';
  if (type === 'xirallic') { baseFreq = '0.8'; alphaMult = '10'; surfaceScale = '5'; specConst = '2.0'; }
  else if (type === 'pearl') { baseFreq = '0.4'; alphaMult = '6'; surfaceScale = '3'; specConst = '1.5'; }
  else if (type === 'silver_fine') { baseFreq = '1.2'; alphaMult = '3'; surfaceScale = '1.5'; specConst = '1.0'; }
  else if (type === 'silver_coarse') { baseFreq = '0.2'; alphaMult = '8'; surfaceScale = '4'; specConst = '1.8'; }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -1"/><feSpecularLighting surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="20" lighting-color="%23ffffff"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting></filter><rect width="100%25" height="100%25" fill="${encodeURIComponent(faceColor)}"/><rect width="100%25" height="100%25" filter="url(%23f)" opacity="0.4"/></svg>`;
  return { backgroundImage: `url("data:image/svg+xml;utf8,${svg}"), linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)`, backgroundBlendMode: 'overlay, normal', backgroundColor: faceColor, boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)' };
};

// 💡 베이스/펄 혼합 HSL 계산식
const getOptics = (tonersList: any[], weightKey: string) => {
  const colorToners = tonersList.filter(t => t.code !== '');
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t[weightKey]) || 0), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let faceX=0, faceY=0, faceL=0, flopX=0, flopY=0, flopL=0;
  let totalWeight = 0; let hasMetallic = false;

  colorToners.forEach(t => {
     let w = parseFloat(t[weightKey]) || 0; if (w <= 0) return;
     let db = TONER_DB[t.code]; if(!db) return;

     totalWeight += w;
     if(db.type !== 'solid' && db.type !== 'binder') hasMetallic = true;

     let fRgb = hex2rgb(db.face); let fHsl = rgb2hsl(fRgb.r, fRgb.g, fRgb.b); let fRad = fHsl.h * Math.PI / 180;
     faceX += w * fHsl.s * Math.cos(fRad); faceY += w * fHsl.s * Math.sin(fRad); faceL += w * fHsl.l;

     let flRgb = hex2rgb(db.flop); let flHsl = rgb2hsl(flRgb.r, flRgb.g, flRgb.b); let flRad = flHsl.h * Math.PI / 180;
     flopX += w * flHsl.s * Math.cos(flRad); flopY += w * flHsl.s * Math.sin(flRad); flopL += w * flHsl.l;
  });

  if(totalWeight === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };
  let avgFaceH = Math.atan2(faceY, faceX) * 180 / Math.PI; if(avgFaceH < 0) avgFaceH += 360;
  let avgFlopH = Math.atan2(flopY, flopX) * 180 / Math.PI; if(avgFlopH < 0) avgFlopH += 360;

  return {
     face: {h: avgFaceH, s: Math.min(100, Math.sqrt(faceX*faceX + faceY*faceY) / totalWeight), l: faceL / totalWeight},
     mid: {h: (avgFaceH + avgFlopH) / 2, s: (Math.min(100, Math.sqrt(faceX*faceX + faceY*faceY) / totalWeight) + Math.min(100, Math.sqrt(flopX*flopX + flopY*flopY) / totalWeight)) / 2, l: (faceL / totalWeight + flopL / totalWeight) / 2},
     flop: {h: avgFlopH, s: Math.min(100, Math.sqrt(flopX*flopX + flopY*flopY) / totalWeight), l: flopL / totalWeight},
     isMetallic: hasMetallic
  };
};

const getColorString = (opticsObj: any, angle: string) => `hsl(${Math.round(opticsObj[angle].h)}, ${Math.round(opticsObj[angle].s)}%, ${Math.round(opticsObj[angle].l)}%)`;

// 💡 3D 인터랙티브 배경
const getInteractiveBackground = (opticsObj: any, lPos: any) => {
  if (!opticsObj || !opticsObj.face || !opticsObj.mid || !opticsObj.flop) return '#f1f5f9';
  const viewAngleT = Math.max(0, Math.min(1, lPos.x / 100));
  let activeColor = viewAngleT > 0.5 ? lerpColor(opticsObj.mid, opticsObj.face, (viewAngleT - 0.5) * 2) : lerpColor(opticsObj.flop, opticsObj.mid, viewAngleT * 2);
  const baseColorStr = `hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(activeColor.l)}%)`;
  const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2)); 
  const normalizedDist = Math.min(1, dist / 70); 
  const highlightAlpha = lerp(0.6, 0.0, normalizedDist);
  return `radial-gradient(circle at ${lPos.x}% ${lPos.y}%, rgba(255,255,255,${highlightAlpha}) 0%, ${baseColorStr} ${lerp(20, 70, normalizedDist)}%, hsl(${Math.round(activeColor.h)}, ${Math.round(activeColor.s)}%, ${Math.round(activeColor.l * 0.4)}) 100%)`;
};


// ==========================================
// 💡 메인 APP 컴포넌트
// ==========================================
export default function App() {
  const [toners, setToners] = useState<any[]>([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "" }]);
  
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState('');
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // 💡 [에러 멸균] 모든 누락되었던 useRef 명확히 선언
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  
  // 💡 [고속 타이핑 1] 포커스 제어 및 커서 자동 이동 로직용 Refs
  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null);

  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);

  const [baseOptics, setBaseOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [pearlOptics, setPearlOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [finalOptics, setFinalOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });

  // 비동기 파싱 시 최신 상태 접근용
  const tonersRef = useRef<any[]>([]);
  const pearlTonersRef = useRef<any[]>([]);
  const isThreeCoatModeRef = useRef<boolean>(true);

  useEffect(() => {
    tonersRef.current = toners;
    pearlTonersRef.current = pearlToners;
    isThreeCoatModeRef.current = isThreeCoatMode;
  }, [toners, pearlToners, isThreeCoatMode]);

  // OCR 스크립트 로드
  useEffect(() => {
    if (!document.getElementById('tesseract-script')) {
      const script = document.createElement('script');
      script.id = 'tesseract-script';
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // 광학 데이터 업데이트
  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    const pearlTotal = pearlToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    setTotalBaseWeight(baseTotal.toFixed(2));
    setTotalPearlWeight(pearlTotal.toFixed(2));
    setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    
    setBaseOptics(getOptics(toners, 'adjustedWeight'));
    setPearlOptics(getOptics(pearlToners, 'adjustedWeight'));
    setFinalOptics(getOptics(isThreeCoatMode ? [...toners, ...pearlToners] : toners, 'adjustedWeight'));
  }, [toners, pearlToners, isThreeCoatMode]);

  // 💡 [고속 타이핑 2] DOM 마운트 후 커서 자동 점프
  useEffect(() => {
    if (focusTarget) {
      setTimeout(() => {
        if (focusTarget.type === 'code' && codeRefs.current[focusTarget.id]) {
            codeRefs.current[focusTarget.id]?.focus();
        } else if (focusTarget.type === 'weight' && weightRefs.current[focusTarget.id]) {
            weightRefs.current[focusTarget.id]?.focus();
        }
        setFocusTarget(null);
      }, 50);
    }
  }, [focusTarget, toners, pearlToners]);

  const handlePointerMove = (e: any) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100; let y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleClearAll = () => {
    setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "" }]); 
    setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "" }]); 
    setTargetColorCode('');
    setIsBaseConfirmed(false);
  };

  // 💡 🚨[스캔 오류 해결]🚨 OCR 데이터를 화면 상태에 꽂아넣는 엔진
  const processNumbers = useCallback((nums: string[]) => {
    let nextBase = [...tonersRef.current];
    let nextPearl = [...pearlTonersRef.current];
    let i = 0;

    while (i < nums.length) {
        let codeC = nums[i];
        let isCode = !!TONER_DB[`WT ${codeC}`];

        if (isCode) {
            let finalCode = `WT ${codeC}`;
            let weightC = nums[i+1];
            
            let finalWeight = "";
            if (weightC && TONER_DB[`WT ${weightC}`]) {
                finalWeight = ""; i++; 
            } else if (weightC) {
                let nextNum = nums[i+2];
                if (nextNum && nextNum.length === 1 && !TONER_DB[`WT ${nextNum}`] && !weightC.includes('.')) {
                    finalWeight = `${weightC}.${nextNum}`; i += 3;
                } else {
                    finalWeight = weightC; i += 2;
                }
            } else { finalWeight = ""; i++; }

            const isPearlLayer = isThreeCoatModeRef.current && (TONER_DB[finalCode].type === 'pearl' || TONER_DB[finalCode].type === 'xirallic');
            const targetList = isPearlLayer ? nextPearl : nextBase;

            const emptyIndex = targetList.findIndex(t => t.code === '' || (t.code === finalCode && t.adjustedWeight === ''));
            if (emptyIndex !== -1) {
                targetList[emptyIndex] = { ...targetList[emptyIndex], code: finalCode, adjustedWeight: finalWeight };
            } else {
                targetList.push({ id: `scan_${Date.now()}_${i}`, code: finalCode, adjustedWeight: finalWeight });
            }
        } else {
            let orphanWeight = codeC;
            let nextNum = nums[i+1];
            if (nextNum && nextNum.length === 1 && !TONER_DB[`WT ${nextNum}`] && !orphanWeight.includes('.')) {
                orphanWeight = `${orphanWeight}.${nextNum}`; i += 2;
            } else { i++; }
            
            let found = false;
            if (isThreeCoatModeRef.current) {
                for (let j = nextPearl.length - 1; j >= 0; j--) {
                    if (nextPearl[j].code !== '' && (!nextPearl[j].adjustedWeight || nextPearl[j].adjustedWeight === '')) {
                        nextPearl[j] = { ...nextPearl[j], adjustedWeight: orphanWeight };
                        found = true; break;
                    }
                }
            }
            if (!found) {
                for (let j = nextBase.length - 1; j >= 0; j--) {
                    if (nextBase[j].code !== '' && (!nextBase[j].adjustedWeight || nextBase[j].adjustedWeight === '')) {
                        nextBase[j] = { ...nextBase[j], adjustedWeight: orphanWeight };
                        found = true; break;
                    }
                }
            }
        }
    }
    // 상태 강제 갱신
    setToners(nextBase);
    setPearlToners(nextPearl);
  }, []);

  // 💡 [사진 스캔 강화] 
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const imageUrl = URL.createObjectURL(file); 
    setScannedImage(imageUrl); 
    setIsScanning(true);
    
    try {
      if ((window as any).Tesseract) {
        // psm 6: 삐뚤어진 블록 스캔 향상, whitelist: 오인식 방지
        const result = await (window as any).Tesseract.recognize(file, 'eng', { 
            logger: (m: any) => console.log(m),
            params: { tessedit_pageseg_mode: '6', tessedit_char_whitelist: '0123456789.WT ' }
        });
        const text = result.data.text;
        
        let norm = text.replace(/:/g, '.').replace(/점/g, '.').replace(/\s*\.\s*/g, '.').replace(/[A-Za-z]/g, ' ');
        const nums = norm.match(/\d*\.\d+|\d+/g);
        
        if (nums && nums.length > 0) {
            processNumbers(nums);
        } else {
            throw new Error("코드 인식 실패");
        }
      } else { throw new Error("OCR 모듈 미적용"); }
    } catch (error) {
      alert("스캔 실패: 화질 문제로 숫자를 찾지 못했습니다. 직접 입력해 주세요.");
    }
    setIsScanning(false);
  };

  const processWeightInput = (rawValue: string) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); 
    const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') return ''; 
    if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, '');
    if (val.startsWith('.')) val = '0' + val; 
    return val;
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    const cleanValue = processWeightInput(rawValue);
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: cleanValue } : t));
    else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: cleanValue } : t));
  };

  // 💡 [고속 타이핑 3] 코드 3자리 입력 시 즉시 그람(g)수로 커서 이동
  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim(); 
    const targetToners = isPearl ? pearlToners : toners; 
    const setter = isPearl ? setPearlToners : setToners;
    
    setter(targetToners.map(toner => {
      if (toner.id === id) {
        let finalCode = formattedCode; 
        const numMatch = formattedCode.match(/\d+/);
        if (numMatch && numMatch[0].length >= 3) {
            const testCode = `WT ${numMatch[0]}`;
            if (TONER_DB[testCode]) {
                finalCode = testCode;
                setFocusTarget({ id: id, type: 'weight' }); // 🔥 포커스 예약
            }
        }
        return { ...toner, code: finalCode };
      }
      return toner;
    }));
  };

  // 💡 [고속 타이핑 4] 그람수(g) 완료 후 Enter 키 누르면 새 줄 추가 및 포커스
  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          addToner(isPearl);
      }
  };

  const removeToner = (id: string, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id));
    else setToners(toners.filter(t => t.id !== id));
  };
  
  const addToner = (isPearl = false) => {
    const newId = `new_${Date.now()}`; 
    const newToner = { id: newId, code: '', adjustedWeight: "" };
    if (isPearl) { setPearlToners([...pearlToners, newToner]); } 
    else { setToners([...toners, newToner]); }
    setFocusTarget({ id: newId, type: 'code' }); // 🔥 새 코드 입력칸으로 점프
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      
      {scannedImage && (
        <div className="bg-slate-900 border-b-4 border-blue-500 shadow-2xl z-50 p-2 md:p-4 sticky top-0 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-2 px-2 max-w-[1600px] mx-auto">
            <h2 className="text-white text-sm font-bold flex items-center"><ImageIcon className="mr-2 text-blue-400" size={18}/> 영수증 스캔 참조 모드</h2>
            <button onClick={() => setScannedImage(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1.5 rounded-full"><X size={18} /></button>
          </div>
          <div className="w-full max-h-[25vh] overflow-auto rounded-lg border border-slate-700 bg-black flex justify-center max-w-[1600px] mx-auto">
             <img src={scannedImage} alt="스캔본" className="object-contain w-full h-auto" />
          </div>
        </div>
      )}

      {isScanning && (
        <div className="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col items-center justify-center backdrop-blur-sm">
          <ScanLine className="text-blue-500 w-28 h-28 animate-pulse opacity-80 mb-4" />
          <h2 className="text-white text-xl font-black">숫자 헌팅 스캔 중...</h2>
        </div>
      )}

      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 20.0</span></h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-auto lg:h-[calc(100vh-10px)] overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: Editor */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 시트</h2>
              {isBaseConfirmed && <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-1 rounded flex items-center"><Lock size={12} className="mr-1"/> 시트 고정됨</span>}
            </div>
            
            <div className="flex items-center space-x-1.5">
              <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleCameraCapture} />
              <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md flex-1 items-center justify-center text-sm font-black shadow-md transition-colors flex"><Camera size={18} className="mr-2" />영수증 사진 초정밀 스캔</button>
            </div>
            
            <div className="flex items-center space-x-1.5">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 (예: UG-Z)" className="bg-white border border-slate-300 px-3 py-2.5 rounded-md text-xs font-bold focus:outline-none flex-1 uppercase shadow-inner" />
              <button onClick={() => setIsBaseConfirmed(true)} disabled={isBaseConfirmed} className={`px-4 py-2.5 rounded-md text-sm font-bold flex items-center shadow-md ${isBaseConfirmed ? 'bg-slate-200 text-slate-400' : 'bg-slate-800 text-white'}`}>
                {isBaseConfirmed ? <Lock size={14} className="mr-1"/> : <Unlock size={14} className="mr-1"/>}<span>확정</span>
              </button>
              <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-3 py-2.5 rounded-md flex items-center"><Trash2 size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-white relative min-h-[400px] lg:min-h-0">
            <div className="space-y-2 pb-4">
              <div className="text-xs font-black text-slate-400 mb-2 flex items-center justify-between border-b pb-1.5">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-0.5 rounded border">
                  <span className="mr-1.5 text-[11px] font-bold text-purple-700">3Coat (펄) 모드</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                    <div className={`block w-8 h-5 rounded-full transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isThreeCoatMode ? 'transform translate-x-3' : ''}`}></div>
                  </div>
                </label>
              </div>

              {toners.map((toner) => {
                const info = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', role: '', desc: '' };
                const isEffect = info.type !== 'solid' && info.type !== 'binder';

                return (
                  // 💡 [UI 복구 1] 널찍한 모바일 배열 (flex-col sm:flex-row) 및 안 찌그러지는 인풋
                  <div key={toner.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-slate-50 hover:bg-blue-50/50 p-3 mb-2 rounded-xl border border-slate-200 transition-colors shadow-sm gap-3">
                    
                    {/* 💡 [UI 복구 2] 주색/측면 분할 컬러칩 완전 복원 (클릭 불필요) */}
                    <div className="flex w-16 h-10 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0">
                       <div className="flex-1" style={getRealisticTexture(info.type, info.face, info.face, isEffect)}></div>
                       <div className="flex-1 border-l border-slate-400" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.4)'} 100%)` }}></div>
                    </div>
                    
                    {/* 💡 [UI 복구 3] 전체 설명 노출 (truncate 제거, whitespace-pre-wrap 적용) */}
                    <div className="flex flex-col flex-1 w-full">
                       <div className="flex items-center gap-2 mb-1">
                           <input
                              ref={(el) => { codeRefs.current[toner.id] = el; }}
                              value={toner.code}
                              onChange={(e) => handleCodeChange(toner.id, e.target.value, false)}
                              className="w-24 text-sm font-black uppercase border border-slate-300 rounded px-2 py-1 focus:border-blue-500 focus:outline-none shadow-inner"
                              placeholder="코드"
                           />
                           <span className="font-bold text-blue-700 text-sm">{info.role || '코드입력'}</span>
                       </div>
                       <p className="text-[11px] text-slate-600 whitespace-pre-wrap leading-snug break-keep">{info.desc}</p>
                    </div>

                    <div className="flex items-center self-end sm:self-auto bg-white border rounded-lg px-2 py-1 shadow-sm shrink-0">
                       <input
                           ref={(el) => { weightRefs.current[toner.id] = el; }}
                           inputMode="decimal"
                           value={toner.adjustedWeight}
                           onChange={(e) => handleWeightInputChange(toner.id, e.target.value, false)}
                           onKeyDown={(e) => handleWeightKeyDown(e, toner.id, false)}
                           className="w-16 text-right text-base font-black text-blue-600 focus:outline-none clean-number-input"
                           placeholder=""
                       />
                       <span className="text-xs font-bold text-slate-400 ml-1 mr-2">g</span>
                       <button onClick={() => removeToner(toner.id, false)} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold flex items-center justify-center space-x-1 text-xs hover:border-blue-500 transition-colors"><Plus size={14} /><span>베이스 안료 추가</span></button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-3 border-t-2 border-dashed border-purple-200 space-y-2 pb-8">
                <div className="text-xs font-black text-purple-700 mb-2 flex items-center">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const info = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', role: '', desc: '' };
                  const isEffect = info.type !== 'solid' && info.type !== 'binder';
                  
                  return (
                    <div key={toner.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-purple-50/40 p-3 mb-2 rounded-xl border border-purple-100 transition-colors shadow-sm gap-3">
                      <div className="flex w-16 h-10 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0">
                         <div className="flex-1" style={getRealisticTexture(info.type, info.face, info.face, isEffect)}></div>
                         <div className="flex-1 border-l border-slate-400" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.4)'} 100%)` }}></div>
                      </div>
                      <div className="flex flex-col flex-1 w-full">
                         <div className="flex items-center gap-2 mb-1">
                             <input
                                ref={(el) => { codeRefs.current[toner.id] = el; }}
                                value={toner.code}
                                onChange={(e) => handleCodeChange(toner.id, e.target.value, true)}
                                className="w-24 text-sm font-black uppercase border border-purple-200 rounded px-2 py-1 focus:border-purple-500 focus:outline-none shadow-inner text-purple-700"
                                placeholder="코드"
                             />
                             <span className="font-bold text-purple-700 text-sm">{info.role || '코드입력'}</span>
                         </div>
                         <p className="text-[11px] text-slate-600 whitespace-pre-wrap leading-snug break-keep">{info.desc}</p>
                      </div>
                      <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-lg px-2 py-1 shadow-sm shrink-0">
                         <input
                             ref={(el) => { weightRefs.current[toner.id] = el; }}
                             inputMode="decimal"
                             value={toner.adjustedWeight}
                             onChange={(e) => handleWeightInputChange(toner.id, e.target.value, true)}
                             onKeyDown={(e) => handleWeightKeyDown(e, toner.id, true)}
                             className="w-16 text-right text-base font-black text-purple-600 focus:outline-none clean-number-input"
                             placeholder=""
                         />
                         <span className="text-xs font-bold text-slate-400 ml-1 mr-2">g</span>
                         <button onClick={() => removeToner(toner.id, true)} className="text-purple-300 hover:text-red-500"><Trash2 size={18}/></button>
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
             <div className="text-xs font-bold uppercase text-slate-400">Total Weight</div>
             <div className="text-lg font-black">{totalFinalWeight} g</div>
          </div>
        </div>

        {/* 💡 Right Column: Multi-View & 수성 안료 카탈로그 (AI 터미널 삭제) */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-4">
          
          {/* 멀티 시각화 렌더링 */}
          <div className={`bg-white border ${isBaseConfirmed ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-300'} rounded-xl p-4 shadow-xl flex-none transition-all duration-300`}>
            <h3 className="text-[15px] font-bold mb-3 flex items-center border-b border-slate-100 pb-2">
              <Layers className="text-blue-600 mr-2" size={18} />멀티 시각화 렌더링 비교
            </h3>
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-1">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">A. 베이스 코트 (Ground Coat)</span>
                   <span className="text-[10px] text-slate-400 font-bold">{totalBaseWeight}g</span>
                 </div>
                 <div className={`h-12 rounded-lg border ${isBaseConfirmed ? 'border-slate-300' : 'border-slate-200 opacity-60'} relative overflow-hidden`} style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}>
                   {baseOptics.isMetallic && <div className="metallic-flake opacity-50"></div>}
                 </div>
              </div>

              {isThreeCoatMode && (
                <div className="flex flex-col space-y-1 relative">
                   <div className="flex justify-between items-center px-1">
                     <span className="text-[11px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded flex items-center"><Zap size={10} className="mr-1"/>B. 펄 코트 (Mid Coat)</span>
                     <span className="text-[10px] text-purple-400 font-bold">{totalPearlWeight}g</span>
                   </div>
                   <div className={`h-12 rounded-lg border ${isBaseConfirmed ? 'border-purple-300' : 'border-slate-200'} relative overflow-hidden`} style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` : '#f1f5f9' }}>
                     {isBaseConfirmed && pearlOptics.isMetallic && <div className="metallic-flake opacity-70"></div>}
                   </div>
                </div>
              )}

              <div className="flex flex-col space-y-1 relative">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{isThreeCoatMode ? 'C. 최종 3코트 결합' : 'B. 최종 렌더링'}</span>
                   <span className="text-[10px] text-blue-400 font-bold">{totalFinalWeight}g</span>
                 </div>
                 <div className={`h-16 rounded-lg border ${isBaseConfirmed ? 'border-blue-400' : 'border-slate-200'} relative overflow-hidden`} style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` : '#f1f5f9' }}>
                   {isBaseConfirmed && finalOptics.isMetallic && <div className="metallic-flake opacity-60"></div>}
                 </div>
              </div>
            </div>
          </div>

          {/* 💡 [AI 터미널 삭제 -> 수성 안료 카탈로그 배치] */}
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-sm flex items-center"><BookOpen className="mr-2 text-blue-400" size={16}/>수성 안료 조색제 카탈로그</h3>
            </div>
            
            <div className="p-3 bg-slate-50 border-b flex gap-1.5 flex-wrap text-[10px] font-bold shrink-0">
                <span className="px-2 py-1 bg-white text-slate-600 rounded border border-slate-200">일반 특성</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-200">색상/외관</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200">이펙트 전용</span>
                <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded border border-purple-200">시스템/첨가제</span>
                <span className="px-2 py-1 bg-red-50 text-red-600 rounded border border-red-200 shadow-sm shadow-red-100">경고/주의</span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-slate-100">
                {Object.entries(TONER_DB).map(([code, data]) => {
                    const isMetallic = data.type !== 'solid' && data.type !== 'binder';
                    let labelCategory = "일반 특성";
                    let badgeColor = "bg-white text-slate-600 border-slate-200";
                    if(data.role.includes("블루") || data.role.includes("레드") || data.role.includes("옐로우") || data.role.includes("그린")) {
                        labelCategory = "색상/외관"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    } else if (data.desc.includes("금지") || data.desc.includes("최대") || data.desc.includes("주의")) {
                        labelCategory = "경고/주의"; badgeColor = "bg-red-50 text-red-600 border-red-200";
                    } else if (data.role.includes("실버") || data.role.includes("펄")) {
                        labelCategory = "이펙트 전용"; badgeColor = "bg-blue-50 text-blue-600 border-blue-200";
                    } else if (data.type === "binder") {
                        labelCategory = "시스템/첨가제"; badgeColor = "bg-purple-50 text-purple-600 border-purple-200";
                    }

                    return (
                        <div key={code} className="flex flex-col sm:flex-row bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                            <div className="w-full sm:w-24 h-12 sm:h-auto flex-shrink-0 relative border-b sm:border-b-0 sm:border-r border-slate-200" style={getRealisticTexture(data.type, data.face, data.flop, isMetallic)}>
                                <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded">{code}</div>
                            </div>
                            <div className="p-2.5 flex-1 flex flex-col justify-center">
                                <div className="font-black text-slate-800 text-xs mb-1">{data.role}</div>
                                <div className="flex items-start gap-1.5">
                                    <span className={`shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border ${badgeColor}`}>
                                        {labelCategory}
                                    </span>
                                    <p className="text-[11px] text-slate-600 leading-snug break-keep">{data.desc}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>

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
