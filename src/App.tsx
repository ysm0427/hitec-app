import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sliders, Trash2, Plus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, BookOpen, Share2, Zap, Search
} from 'lucide-react';

// 💡 1. 공식 안료 데이터베이스 (100% 완전 노출 스펙)
const TONER_DB: Record<string, { role: string, desc: string, type: string, face: string, flop: string }> = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임. (배합비율 WT346 : WT144 = 1 : 0.9)', type: 'solid', face: '#0284c7', flop: '#0c4a6e' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋으며, 채도가 높고 입자감이 좋은 청색계열의 컬러에 사용됨.', type: 'silver_fine', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두우며 주로 흑색계열의 컬러에 제한적으로 사용함.', type: 'solid', face: '#0f172a', flop: '#020617' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨. (적용 예: Nissan KAB, Lexus 1F1, M.Benz 047 등)', type: 'silver_fine', face: '#e2e8f0', flop: '#64748b' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 염료를 함유하고 있어 알루미늄 입자에 2% 이상 사용하면 색상이 변할 수 있음. (솔리드 최대 5%, 실버 2%, 펄 5% 이내)', type: 'solid', face: '#000000', flop: '#000000' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제. 베이스코트 무게의 10% 혼합하면 특히 겨울철 작업성이 좋아지며 외관도 개선됨.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. WT332에 비해 채도가 높으며 측면(110도)을 더 어둡게 함. 주로 적색 이펙트 컬러에 제한적으로 사용.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제. WT389보다 작음. 실버달러형 특수 조색제.', type: 'silver_fine', face: '#d1d5db', flop: '#475569' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크 특수 조색제. 깊이감과 탁월한 반짝임을 부여함.', type: 'xirallic', face: '#fef08a', flop: '#475569' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 안료 조색제. 매끈한 느낌의 은색에 사용. (적용 예: Nissan KAB, Lexus 1F1 등)', type: 'silver_fine', face: '#cbd5e1', flop: '#334155' },
  'WT 307': { role: '프리즈마 실버', desc: '정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제(홀로그램 효과). (적용 예: Audi LX7T 등)', type: 'xirallic', face: '#e2e8f0', flop: '#a855f7' },
  'WT 308': { role: '브라이트 오렌지', desc: '주로 이펙트 컬러에 사용하는 맑은 주황색 조색제. 단독 은폐력은 상당히 떨어짐.', type: 'solid', face: '#ea580c', flop: '#7c2d12' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 주로 채도가 높은 이펙트 컬러에 혼합하여 사용하며 은폐력은 떨어짐.', type: 'solid', face: '#d946ef', flop: '#701a75' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 분말 사용을 위한 전용 조색제 바인더.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제. 채도가 높고 순수하여 적색 이펙트 컬러에 주로 사용하며 단독 은폐력은 떨어짐.', type: 'solid', face: '#ef4444', flop: '#7f1d1d' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상 변화가 매우 큰 특수 펄. 15도는 맑은 적색, 45도는 맑은 녹색, 110도는 약하게 녹색으로 변함.', type: 'pearl', face: '#ef4444', flop: '#22c55e' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제. WT372보다 작음. 15도는 적청색, 나머지는 녹황색 간섭 펄을 나타냄.', type: 'pearl', face: '#3b82f6', flop: '#84cc16' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제. 15도는 맑은 청색, 나머지는 맑은 녹색 간섭 펄을 발현함.', type: 'pearl', face: '#06b6d4', flop: '#10b981' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: 'WT305보다 조금 더 크며 반짝임이 좋은 매끄러운 특수 알루미늄. WT305보다 15도는 밝고 나머지 각도는 어두움.', type: 'silver_fine', face: '#f8fafc', flop: '#334155' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제. WT346보다 명도가 밝고 녹색빛이 더 많이 감돎.', type: 'solid', face: '#0284c7', flop: '#082f49' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 정면 및 측면 모두 균일한 실버 색감을 띔. (적용 예: 현대 XB3, BMW A96 등)', type: 'pearl', face: '#e2e8f0', flop: '#64748b' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제. 솔리드 컬러에서 명암을 밝게 하고 색상을 줄임. 이펙트 컬러에서 15도는 어둡고 나머지 각도(45 & 110도)는 밝게 하여 전체적인 입자감을 줄임.', type: 'solid', face: '#ffffff', flop: '#e2e8f0' },
  'WT 322': { role: '마이크로 화이트', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 제한적으로 사용함. 15도는 황색을 띠며 어둡고 나머지는 청색을 띠며 밝게 발현됨.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 323': { role: '스페셜 블랙', desc: '가장 맑고 진한 표준 흑색 조색제. 알루미늄 혼합시 명암이 어두워지고 약하게 청황색이 늘어남. 솔리드에선 명도 및 채도를 낮춤.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제. 은폐력은 떨어지며 주로 이펙트 컬러에 사용.', type: 'solid', face: '#f59e0b', flop: '#9a3412' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '선명한 녹색빛을 띠는 맑은 황색 조색제. 알루미늄 혼합 시 15도는 맑은 황색, 나머지는 녹황색을 띔.', type: 'solid', face: '#eab308', flop: '#65a30d' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 채도 높고 밝은 황색 조색제. 주로 솔리드에 사용. 이펙트에서는 45 & 110도에 밝은 황색이 필요할 때만 소량 사용.', type: 'solid', face: '#fde047', flop: '#ca8a04' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러(아이보리, 베이지 등)에 사용하는 탁한 오커 브라운 계열의 황색. 은폐력이 좋으며, 정면은 어둡고 탁하며, 측면은 밝은 노란색을 띠는 투명한 브라운색.', type: 'solid', face: '#b45309', flop: '#451a03' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색(스칼렛) 조색제. 정면은 적색, 측면은 밝은 황적색을 띔. 은폐력은 크게 떨어짐.', type: 'solid', face: '#f59e0b', flop: '#ea580c' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 무연(납 미함유) 성분. 솔리드 조색에 주로 사용됨.', type: 'solid', face: '#ea580c', flop: '#9a3412' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '이펙트 컬러에서 맑은 적황색을 내는 조색제. 측면에서 극도로 어둡고 정면에서 투명함. (솔리드 컬러 사용 절대 금지)', type: 'solid', face: '#d97706', flop: '#451a03' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 적색 이펙트/메탈릭에 사용. 정면은 브라운톤 적색, 측면은 브라운/황색빛 적색으로 전체적인 황적색을 발현함.', type: 'solid', face: '#b91c1c', flop: '#7c2d12' },
  'WT 333': { role: '그라나다\". 레드', desc: '블랙 톤이 포함된 밝은 적색 조색제. 주로 솔리드 컬러에 사용함.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 334': { role: '옥사이드 레드', desc: '주로 솔리드 컬러(아이보리, 베이지 브라운 등)에 사용하는 탁한 적색 조색제. 단독 은폐력이 매우 좋음.', type: 'solid', face: '#7f1d1d', flop: '#450a0a' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제. 솔리드 컬러 배합에 주로 사용함.', type: 'solid', face: '#d97706', flop: '#78350f' },
  'WT 336': { role: '트랜스루센트 레드', desc: '선명하며 어두운 갈색 조색제. 이펙트 컬러 조색에만 사용.', type: 'solid', face: '#7c2d12', flop: '#450a0a' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 약하게 청색을 띠는 선명하고 밝은 적색 조색제. 메탈릭 혼합 시 투명하고 밝게 발현되어 적색 이펙트 컬러에 주로 사용됨.', type: 'solid', face: '#ef4444', flop: '#991b1b' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제. 백색 혼합 시 맑은 분홍색을 띔. 단색 조색시 정측면 모두 맑은 적색을 유지함.', type: 'solid', face: '#d946ef', flop: '#86198f' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 청색 및 회색 컬러에 사용. 메탈릭 혼합 시 측면은 붉은빛, 정면은 맑은 보라빛을 띔.', type: 'solid', face: '#8b5cf6', flop: '#4c1d95' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '매우 높은 채도의 맑은 자주색 조색제. WT338 대비 밝고 청색 톤이 적음.', type: 'solid', face: '#e879f9', flop: '#a21caf' },
  'WT 341': { role: '아주르 블루', desc: '채도가 높은 맑은 청색 조색제. 15도는 녹청색, 나머지는 적청색을 띄며 관찰각도별 색상 변화 폭이 가장 큼.', type: 'solid', face: '#2563eb', flop: '#1e3a8a' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 은폐력이 있음. 15도는 진한 보라색, 나머지는 자주색을 나타냄.', type: 'solid', face: '#6d28d9', flop: '#2e1065' },
  'WT 343': { role: '블루', desc: '솔리드 및 이펙트 모두 사용하는 중간 순수 청색 조색제. 정측면 모두 균일한 청색.', type: 'solid', face: '#3b82f6', flop: '#1e40af' },
  'WT 344': { role: '다크 블루', desc: '어두운 표준 청색 조색제. 15도는 청색, 나머지는 붉은 적색을 띔. 단색 조색시 맑은 청색.', type: 'solid', face: '#1d4ed8', flop: '#0f172a' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '맑고 선명한 황색을 조금 띠는 녹색 조색제. WT347대비 명도가 밝고 황색이 많음.', type: 'solid', face: '#10b981', flop: '#064e3b' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 투명한 청색 조색제. 이펙트 컬러 조색에 가장 많이 사용하는 청색임.', type: 'solid', face: '#1d4ed8', flop: '#020617' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 맑고 선명한 녹색 조색제. WT345 대비 명도가 어두움.', type: 'solid', face: '#059669', flop: '#022c22' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '맑고 채도 높고 투명한 특수 청색 조색제. 15도는 녹색이 강한 청색, 나머지는 약한 적색을 띔.', type: 'solid', face: '#0ea5e9', flop: '#0369a1' },
  'WT 349': { role: '트랜스루센트 그린', desc: '투명한 녹색 저농 조색제. WT347의 저농도 버전.', type: 'solid', face: '#34d399', flop: '#064e3b' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '투명한 저농도 흑색 조색제. 정면은 블랙, 측면은 약간의 황적색을 띠는 깊이 있는 블랙.', type: 'solid', face: '#1e293b', flop: '#451a03' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '투명한 저농 청색 조색제. WT348의 저농도 버전.', type: 'solid', face: '#38bdf8', flop: '#075985' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. WT321의 저농도 버전. 미세한 명도 조절에 사용.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농도 버전. 이펙트 컬러 미세조정에 탁월.', type: 'solid', face: '#c026d3', flop: '#4a044e' },
  'WT 354': { role: '화인 실버', desc: '매우 작은 일반형 알루미늄 조색제. 정면은 그레이 빛을 띄고, 측면은 약간 밝음.', type: 'silver_fine', face: '#cbd5e1', flop: '#64748b' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 입자의 광휘형 알루미늄 조색제. 정면은 맑고 투명하게 빛나며 측면은 확연히 어두움.', type: 'silver_coarse', face: '#f8fafc', flop: '#334155' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 범용 일반형 알루미늄 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 가장 작고 백색빛을 띠는 일반형 알루미늄. 실버 안료 중 은폐력이 가장 좋음.', type: 'silver_fine', face: '#f8fafc', flop: '#64748b' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트 및 펄 컬러 전용으로 배합되는 특수 실버 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄. 15도는 밝게 빛나고 나머지는 어두움.', type: 'silver_coarse', face: '#f1f5f9', flop: '#334155' },
  'WT 360': { role: '코올스 실버', desc: '중간 규격의 거친 알루미늄(어두운 회색 톤). 15도 밝고 나머지 어두움.', type: 'silver_coarse', face: '#94a3b8', flop: '#1e293b' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄. 실버 안료 중 측면이 제일 밝게 유지됨.', type: 'silver_coarse', face: '#f1f5f9', flop: '#64748b' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제. 정면은 맑고 측면은 어두움.', type: 'silver_fine', face: '#e2e8f0', flop: '#334155' },
  'WT 363': { role: '브릴리언트 골드', desc: '펄 입자가 강한 밝은 황색 알루미늄. 반짝임이 뛰어나며 은폐력이 매우 우수함.', type: 'pearl', face: '#fbbf24', flop: '#b45309' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기(중간~가장 거침)의 백색 운모 펄 조색제. 정/측면 모두 은색빛을 띠는 화이트 펄 질감을 냄.', type: 'pearl', face: '#ffffff', flop: '#94a3b8' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 간섭 펄 조색제. 15도는 청적색, 나머지는 완전히 대비되는 황녹색을 띔.', type: 'pearl', face: '#a3e635', flop: '#be185d' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 맑은 황색 간섭 펄 조색제. 15도는 뚜렷한 황색, 나머지는 청색으로 변함.', type: 'pearl', face: '#facc15', flop: '#4c1d95' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 간섭 펄 조색제. 15도는 녹색, 나머지는 적색으로 컬러 트래블이 발생함.', type: 'pearl', face: '#4ade80', flop: '#991b1b' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간~미세 크기의 미세 백색 펄 조색제. 정측면 모두 고운 은색빛을 유지함.', type: 'pearl', face: '#f8fafc', flop: '#64748b' },
  'WT 369': { role: '레드 펄', desc: '작은 크기의 적색 착색 펄 조색제. 적색 입자감이 뚜렷하며 다른 펄에 비해 은폐력이 있음.', type: 'pearl', face: '#ef4444', flop: '#7f1d1d' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기의 맑은 청색 간섭 펄 조색제. 15도 녹청색, 나머지는 뚜렷한 적황색으로 변색됨.', type: 'pearl', face: '#0ea5e9', flop: '#be123c' },
  'WT 371': { role: '브라운 펄', desc: '중간~거친 크기의 주황색/구리색 착색 펄 조색제. 깊이 있는 브라운 메탈릭에 필수.', type: 'pearl', face: '#d97706', flop: '#451a03' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 크기의, 적색이 가미된 청색 간섭 펄 조색제.', type: 'pearl', face: '#3b82f6', flop: '#c026d3' },
  'WT 373': { role: '루비 펄', desc: '중간~거친 크기의 은폐력이 강한 붉은 적색 착색 펄 조색제.', type: 'pearl', face: '#dc2626', flop: '#7f1d1d' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기의 청녹색 간섭 펄 조색제. 15도 청녹색, 나머지는 황적색 간섭효과를 냄.', type: 'pearl', face: '#0d9488', flop: '#c2410c' },
  'WT 375': { role: '그린 펄', desc: '중간 크기의 녹색빛 특수 간섭 펄 조색제. 15도 녹색, 나머지는 적색.', type: 'pearl', face: '#16a34a', flop: '#b91c1c' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기의 특수 적색 간섭 펄 조색제. 15도 적색, 나머지는 뚜렷한 녹색.', type: 'pearl', face: '#ef4444', flop: '#16a34a' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭(Xirallic) 백색 펄. 입자 반짝임이 글라스처럼 매우 좋음. 15도 약한 녹색, 나머지 약한 적색 띔.', type: 'xirallic', face: '#ffffff', flop: '#64748b' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄. 입자가 굵고 햇빛 아래서 반짝임이 극도로 강한 착색 펄.', type: 'xirallic', face: '#ef4444', flop: '#7f1d1d' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색(카퍼) 펄. 입자가 매우 거칠고 다이아몬드 같은 반짝임이 극에 달함.', type: 'xirallic', face: '#ea580c', flop: '#7c2d12' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄. 색감이 매우 맑고 선명함. 15도 맑은 녹색, 나머지는 적색 간섭 펄.', type: 'xirallic', face: '#4ade80', flop: '#166534' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄. 반짝임이 가장 우수한 블루. 15도 청색, 나머지는 황색 간섭 펄.', type: 'xirallic', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 펄. 15도 황색, 나머지는 청색 간섭 펄.', type: 'xirallic', face: '#facc15', flop: '#a16207' },
  'WT 383': { role: '브릴리언트 오렌지', desc: 'WT363 대비 적색감이 훨씬 많은 적황색 광휘 알루미늄. 착색감이 매우 맑음.', type: 'silver_coarse', face: '#f97316', flop: '#9a3412' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: '투명 화이트 밸런스 조정제(Transparent White). 도막의 투명도를 조절. WT387 대비 점도가 높음.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 386': { role: '플롭 컨트롤', desc: '안료 입자 배열 및 측면 반사각(Flop) 조절제. 금속 입자가 눕도록 유도하여 측면을 밝게 함.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: '점도 조절 첨가제(Viscosity Additive). 도료의 기본 흐름성과 볼륨감을 결정함.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '가장 어두운 흑색 조색제. WT323보다 확연히 어두움.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 389': { role: '플래틴 실버 화인', desc: '미세한 은빛이 감도는 고휘도 플래티넘 실버 알루미늄 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기의 고휘도 알루미늄. 15도에서 입자가 가장 밝게 빛나며 반대로 측면은 가장 어두움.', type: 'silver_coarse', face: '#f8fafc', flop: '#334155' },
  'WT 392': { role: '매직 이펙트', desc: '색상이 WT312(매직 파이어)와 완전히 반대로 변하는 특수 펄. 15도 녹색, 45도 적색.', type: 'pearl', face: '#22c55e', flop: '#ef4444' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색 띠는 밝고 화사한 황색 조색제. WT327 대비 녹색 톤이 적음.', type: 'solid', face: '#fef08a', flop: '#a16207' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제 및 블랜딩(이음매 도장)용 특수 첨가제.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 3080': { role: '스페셜 애디티브', desc: '도막 보정 및 흐름 방지 첨가제', type: 'binder', face: '#ffffff', flop: '#ffffff' }
};

// 💡 2. 초정밀 3D 프랙탈 노이즈 연산기 (Cachng 적용으로 버벅임 원천 차단)
const textureCache: Record<string, React.CSSProperties> = {};
const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
    if (!isMetallic || type === 'binder' || type === 'solid') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
    const key = `${type}_${faceColor}_${flopColor}`;
    if (textureCache[key]) return textureCache[key];

    let baseFreq = '0.5', alphaMult = '4', surfaceScale = '2', specConst = '1.2';
    if (type === 'xirallic') { baseFreq = '0.8'; alphaMult = '10'; surfaceScale = '5'; specConst = '2.0'; }
    else if (type === 'pearl') { baseFreq = '0.4'; alphaMult = '6'; surfaceScale = '3'; specConst = '1.5'; }
    else if (type === 'silver_fine') { baseFreq = '1.2'; alphaMult = '3'; surfaceScale = '1.5'; specConst = '1.0'; }
    else if (type === 'silver_coarse') { baseFreq = '0.2'; alphaMult = '8'; surfaceScale = '4'; specConst = '1.8'; }

    const safeFaceColor = faceColor || '#ffffff';
    const safeFlopColor = flopColor || '#ffffff';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -1"/><feSpecularLighting surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="20" lighting-color="%23ffffff"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting></filter><rect width="100%25" height="100%25" fill="${encodeURIComponent(safeFaceColor)}"/><rect width="100%25" height="100%25" filter="url(%23f)" opacity="0.4"/></svg>`;

    const result = {
      backgroundColor: safeFaceColor,
      backgroundImage: `url("data:image/svg+xml;utf8,${svg}"), linear-gradient(135deg, ${safeFaceColor} 0%, ${safeFlopColor} 100%)`,
      backgroundBlendMode: 'overlay, normal' as any,
      boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
    };
    textureCache[key] = result;
    return result;
};

const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };

const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code && TONER_DB[t.code]);
  const sumW = colorToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let faceX=0, faceY=0, faceL=0, flopX=0, flopY=0, flopL=0; let totalWeight = 0; let hasMetallic = false;
  colorToners.forEach(t => {
     let w = safeNum(parseFloat(t.adjustedWeight)); if (w <= 0) return;
     let db = TONER_DB[t.code]; totalWeight += w;
     if(db.type !== 'solid' && db.type !== 'binder') hasMetallic = true;
     let fRgb = hex2rgb(db.face || '#ffffff'); let fHsl = rgb2hsl(fRgb.r, fRgb.g, fRgb.b); let fRad = fHsl.h * Math.PI / 180;
     faceX += w * fHsl.s * Math.cos(fRad); faceY += w * fHsl.s * Math.sin(fRad); faceL += w * fHsl.l;
     let flRgb = hex2rgb(db.flop || '#ffffff'); let flHsl = rgb2hsl(flRgb.r, flRgb.g, flRgb.b); let flRad = flHsl.h * Math.PI / 180;
     flopX += w * flHsl.s * Math.cos(flRad); flopY += w * flHsl.s * Math.sin(flRad); flopL += w * flHsl.l;
  });

  if(totalWeight === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };
  let avgFaceH = Math.atan2(faceY, faceX) * 180 / Math.PI; if(avgFaceH < 0) avgFaceH += 360;
  let avgFlopH = Math.atan2(flopY, flopX) * 180 / Math.PI; if(avgFlopH < 0) avgFlopH += 360;

  return {
     face: { h: safeNum(Math.round(avgFaceH)), s: safeNum(Math.round(Math.min(100, Math.sqrt(faceX*faceX + faceY*faceY) / totalWeight))), l: safeNum(Math.round(faceL / totalWeight)) },
     mid: { h: safeNum(Math.round((avgFaceH + avgFlopH) / 2)), s: safeNum(Math.round((Math.min(100, Math.sqrt(faceX*faceX + faceY*faceY) / totalWeight) + Math.min(100, Math.sqrt(flopX*flopX + flopY*flopY) / totalWeight)) / 2)), l: safeNum(Math.round((faceL / totalWeight + flopL / totalWeight) / 2)) },
     flop: { h: safeNum(Math.round(avgFlopH)), s: safeNum(Math.round(Math.min(100, Math.sqrt(flopX*flopX + flopY*flopY) / totalWeight))), l: safeNum(Math.round(flopL / totalWeight)) },
     isMetallic: hasMetallic
  };
};

const getColorString = (opticsObj: any, angle: string) => `hsl(${opticsObj[angle].h}, ${opticsObj[angle].s}%, ${opticsObj[angle].l}%)`;

export default function App() {
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "" }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState('');
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null);

  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');

  const [baseOptics, setBaseOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [pearlOptics, setPearlOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });
  const [finalOptics, setFinalOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false });

  const [isBaseMetallic, setIsBaseMetallic] = useState(false);
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);

  // 💡 [실시간 정렬 연동] 배합 시트에 활성화된 코드들을 추적
  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    const pearlTotal = pearlToners.reduce((sum, t) => sum + (parseFloat(t.adjustedWeight) || 0), 0);
    setTotalBaseWeight(baseTotal.toFixed(2));
    setTotalPearlWeight(pearlTotal.toFixed(2));
    setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    
    setBaseOptics(getOptics(toners));
    setPearlOptics(getOptics(pearlToners));
    setFinalOptics(getOptics(isThreeCoatMode ? [...toners, ...pearlToners] : toners));

    const checkMetallic = (list: any[]) => list.some(t => {
      const type = TONER_DB[t.code]?.type || '';
      return type !== 'solid' && type !== 'binder' && type !== '';
    });
    setIsBaseMetallic(checkMetallic(toners));
    setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (focusTarget) {
      setTimeout(() => {
        if (focusTarget.type === 'code' && codeRefs.current[focusTarget.id]) codeRefs.current[focusTarget.id]?.focus();
        else if (focusTarget.type === 'weight' && weightRefs.current[focusTarget.id]) weightRefs.current[focusTarget.id]?.focus();
        setFocusTarget(null);
      }, 60);
    }
  }, [focusTarget, toners, pearlToners]);

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const imageUrl = URL.createObjectURL(file); setScannedImage(imageUrl); setIsScanning(true);
    try {
      if (typeof window !== 'undefined' && (window as any).Tesseract) {
        const result = await (window as any).Tesseract.recognize(file, 'eng', { 
            params: { tessedit_pageseg_mode: '6', tessedit_char_whitelist: '0123456789.WT ' }
        });
        const text = result.data.text;
        let norm = text.replace(/:/g, '.').replace(/점/g, '.').replace(/\s*\.\s*/g, '.').replace(/[A-Za-z]/g, ' ');
        const nums = norm.match(/\d*\.\d+|\d+/g);
        if (nums) {
            let nextBase = [...toners];
            for(let i=0; i<nums.length; i++) {
                let codeC = nums[i];
                if (TONER_DB[`WT ${codeC}`]) {
                    let weightC = nums[i+1];
                    let finalW = (weightC && !TONER_DB[`WT ${weightC}`]) ? weightC : "";
                    if (finalW) i++;
                    const emptyIndex = nextBase.findIndex(t => t.code === '');
                    if (emptyIndex !== -1) nextBase[emptyIndex] = { ...nextBase[emptyIndex], code: `WT ${codeC}`, adjustedWeight: finalW };
                    else nextBase.push({ id: `scan_${Date.now()}_${i}`, code: `WT ${codeC}`, adjustedWeight: finalW });
                }
            }
            setToners(nextBase);
        }
      }
    } catch (error) { alert("시편 조색표 화질을 다시 확인해 주십시오."); }
    setIsScanning(false);
  };

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim(); 
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => {
      if (toner.id === id) {
        let finalCode = formattedCode; 
        const numMatch = formattedCode.match(/\d+/);
        if (numMatch && numMatch[0].length >= 3) {
            const testCode = `WT ${numMatch[0]}`;
            if (TONER_DB[testCode]) { finalCode = testCode; setFocusTarget({ id: id, type: 'weight' }); }
        }
        return { ...toner, code: finalCode };
      }
      return toner;
    }));
  };

  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
      if (e.key === 'Enter') {
          e.preventDefault(); const newId = `new_${Date.now()}`;
          const setter = isPearl ? setPearlToners : setToners;
          setter(prev => [...prev, { id: newId, code: '', adjustedWeight: "" }]);
          setFocusTarget({ id: newId, type: 'code' }); 
      }
  };

  // 💡 [상세 배합표 직렬화 공유 엔진]
  const shareToKakao = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || ''}): ${t.adjustedWeight || '0'}g`).join('\n');
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || ''}): ${t.adjustedWeight || '0'}g`).join('\n');
    
    const text = `[HI-TEC 공식 배합 공유]\n컬러코드: ${targetColorCode || 'UG4'}\n\n■ 베이스 코트 내역:\n${baseListText || '  (입력 데이터 없음)'}\n- 베이스 합계: ${totalBaseWeight}g\n- 6052 수지제원: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `■ 펄 코트 내역:\n${pearlListText || '  (입력 데이터 없음)'}\n- 펄 합계: ${totalPearlWeight}g\n- 6052 수지제원: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}★ 최종 혼합 총량: ${totalFinalWeight}g`;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({ title: 'HI-TEC 조색 데이터 인계', text: text }).catch(console.error);
    } else {
        alert("배합 스펙 리스트가 클립보드에 복사되었습니다. 카카오톡 창에 바로 붙여넣기 하십시오.\n\n" + text);
        if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(text);
    }
  };

  // 💡 [실시간 스택 렌더링 소트] 활성화된 안료를 최상단으로 우선 정렬
  const sortedCatalog = [...catalogData].sort((a, b) => {
      const aActive = activeCodes.includes(a.code);
      const bActive = activeCodes.includes(b.code);
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0; // 둘 다 속해 있거나 없으면 원래 순서 유지
  }).filter(item => item.code.includes(catalogSearch.toUpperCase()) || item.role.includes(catalogSearch));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      {isScanning && <div className="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col items-center justify-center"><ScanLine className="text-blue-500 w-28 h-28 animate-pulse mb-4" /><h2 className="text-white text-xl font-black">시편 데이터 고속 추출 중...</h2></div>}
      
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold"><span className="text-white tracking-wide">PERMAHYD HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 21.1</span></h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-auto lg:h-[calc(100vh-75px)] overflow-y-auto lg:overflow-hidden">
        
        {/* Left Column: 배합 시트 작업 에디터 */}
        <div className="lg:col-span-7 flex flex-col h-auto lg:h-full bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3 shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 flex items-center"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 시트</h2>
              {isBaseConfirmed && <span className="bg-blue-100 text-blue-700 text-[11px] font-bold px-2 py-1 rounded flex items-center"><Lock size={12} className="mr-1"/> 시트 고정됨</span>}
            </div>
            <div className="flex items-center space-x-1.5">
              <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} className="hidden" onChange={handleCameraCapture} />
              <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md flex-1 items-center justify-center text-sm font-black shadow-md flex transition-colors"><Camera size={18} className="mr-2" />시편 촬영</button>
            </div>
            <div className="flex items-center space-x-1.5">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력 (예: UG4)" className="bg-white border border-slate-300 px-3 py-2.5 rounded-md text-xs font-bold focus:outline-none flex-1 uppercase shadow-inner" />
              <button onClick={() => setIsBaseConfirmed(!isBaseConfirmed)} className={`px-4 py-2.5 rounded-md text-sm font-bold flex items-center shadow-md ${isBaseConfirmed ? 'bg-slate-200 text-slate-500' : 'bg-slate-800 text-white'}`}>{isBaseConfirmed ? <Lock size={14} className="mr-1"/> : <Unlock size={14} className="mr-1"/>}확정</button>
              <button onClick={shareToKakao} className="bg-[#FEE500] hover:bg-[#FADA0A] text-slate-900 px-4 py-2.5 rounded-md text-sm font-black flex items-center shadow-md"><Share2 size={16} className="mr-1.5" />공유</button>
              <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-3 py-2.5 rounded-md"><Trash2 size={16} /></button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-white relative min-h-[350px] lg:min-h-0">
            <div className="space-y-2 pb-4">
              <div className="text-xs font-black text-slate-400 flex items-center justify-between border-b pb-1.5">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-0.5 rounded border">
                  <span className="mr-1.5 text-[11px] font-bold text-purple-700">3Coat 모드</span>
                  <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                  <div className={`w-8 h-4 rounded-full transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                </label>
              </div>

              {toners.map((toner) => {
                const info = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', role: '', desc: '' };
                const isEffect = info.type !== 'solid' && info.type !== 'binder';
                return (
                  <div key={toner.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-slate-50 hover:bg-blue-50/50 p-2.5 mb-1.5 rounded-xl border border-slate-200 shadow-sm gap-2">
                    <div className="flex w-16 h-8 rounded-md shadow-inner border overflow-hidden shrink-0">
                       <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                       <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                    </div>
                    <div className="flex flex-col flex-1 w-full">
                       <div className="flex items-center gap-2 mb-0.5">
                           <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, false)} className="w-24 text-sm font-black border rounded px-1.5 py-0.5" placeholder="코드"/>
                           <span className="font-bold text-blue-700 text-xs">{info.role || '안료미지정'}</span>
                       </div>
                       <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-tight">{info.desc}</p>
                    </div>
                    <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0">
                       <input ref={el => { weightRefs.current[toner.id] = el; }} value={toner.adjustedWeight} onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} className="w-16 text-right font-black text-blue-600 focus:outline-none" placeholder="0"/>
                       <span className="text-[11px] text-slate-400 ml-1 mr-1">g</span>
                       <button onClick={() => removeToner(toner.id, false)}><Trash2 size={14} className="text-slate-300 hover:text-red-500"/></button>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-1.5 border border-dashed rounded-lg text-slate-400 font-bold text-xs hover:border-blue-500 flex justify-center items-center gap-1"><Plus size={12}/>안료 추가 생성</button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-2 border-t border-purple-100 space-y-2">
                <div className="text-xs font-black text-purple-700">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const info = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', role: '', desc: '' };
                  const isEffect = info.type !== 'solid' && info.type !== 'binder';
                  return (
                    <div key={toner.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-purple-50/20 p-2.5 mb-1.5 rounded-xl border border-purple-100 shadow-sm gap-2">
                      <div className="flex w-16 h-8 rounded-md shadow-inner border overflow-hidden shrink-0">
                         <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                         <div className="flex-1 border-l border-purple-200" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                      </div>
                      <div className="flex flex-col flex-1 w-full">
                         <div className="flex items-center gap-2 mb-0.5">
                             <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, true)} className="w-24 text-sm font-black border border-purple-200 rounded px-1.5 py-0.5 text-purple-800" placeholder="코드"/>
                             <span className="font-bold text-purple-700 text-xs">{info.role || '안료미지정'}</span>
                         </div>
                         <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-tight">{info.desc}</p>
                      </div>
                      <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-md px-1.5 py-0.5 shrink-0">
                         <input ref={el => { weightRefs.current[toner.id] = el; }} value={toner.adjustedWeight} onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} className="w-16 text-right font-black text-purple-600 focus:outline-none" placeholder="0"/>
                         <span className="text-[11px] text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => removeToner(toner.id, true)}><Trash2 size={14} className="text-slate-300 hover:text-red-500"/></button>
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addToner(true)} className="w-full py-1.5 border border-dashed border-purple-200 rounded-lg text-purple-400 font-bold text-xs flex justify-center items-center gap-1"><Plus size={12}/>펄 조색제 추가 생성</button>
              </div>
            )}
          </div>
          
          {/* 💡 [수지 계산 로직 완벽 연동 복원 완료] */}
          <div className="p-3 bg-slate-800 text-slate-100 flex justify-between items-center shrink-0 border-t border-slate-700">
             <div className="flex flex-col"><div className="text-[10px] text-slate-400 font-bold uppercase">Total Formula</div><div className="text-base font-black text-cyan-400">{totalFinalWeight} g</div></div>
             <div className="flex flex-col gap-1 items-end">
                 <div className="text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/40 flex items-center text-[11px]">
                    <Beaker size={11} className="mr-1"/> 6052 (베이스 수지): <span className="text-white font-black ml-1">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g</span> <span className="opacity-60 text-[9px] ml-1">({isBaseMetallic ? '메탈 20%' : '솔리드 10%'})</span>
                 </div>
                 {isThreeCoatMode && (
                     <div className="text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/40 flex items-center text-[11px]">
                        <Beaker size={11} className="mr-1"/> 6052 (펄 코트 수지): <span className="text-white font-black ml-1">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g</span> <span className="opacity-60 text-[9px] ml-1">({isPearlMetallic ? '메탈 20%' : '솔리드 10%'})</span>
                     </div>
                 )}
             </div>
          </div>
        </div>

        {/* Right Column: 시각화 뷰어 및 지능형 카탈로그 */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-3">
          <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-xl">
            <h3 className="text-xs font-bold mb-2 flex justify-between items-center border-b pb-1.5">
              <span className="flex items-center"><Layers className="text-blue-600 mr-1.5" size={14} />멀티 렌더링 명암 분석</span>
              <button onClick={() => { setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); }} className="text-[11px] px-2 py-1 bg-slate-800 text-white rounded font-bold flex items-center"><Maximize size={10} className="mr-1"/>대화면 확장 뷰어</button>
            </h3>
            <div className="space-y-2">
              <div><div className="flex justify-between text-[10px] font-bold text-slate-500"><span>A. 베이스 코트 (Ground)</span><span>{totalBaseWeight}g</span></div>
              <div className="h-9 rounded-md border" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}></div></div>
              {isThreeCoatMode && <div><div className="flex justify-between text-[10px] font-bold text-purple-600"><span>B. 펄 코트 (Mid-coat)</span><span>{totalPearlWeight}g</span></div>
              <div className="h-9 rounded-md border" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` }}></div></div>}
              <div><div className="flex justify-between text-[10px] font-bold text-blue-600"><span>C. 최종 도막 광학 시뮬레이션</span><span>{totalFinalWeight}g</span></div>
              <div className="h-11 rounded-md border" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` }}></div></div>
            </div>
          </div>

          {/* 💡 [선생님 기획 가이드 원안 100% 영구 복원] */}
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-sm flex items-center"><BookOpen className="mr-1.5 text-blue-400" size={16}/>수성 안료 조색제 카탈로그</h3>
                <div className="relative w-36"><input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="코드 검색" className="w-full bg-slate-800 border border-slate-700 text-white text-[11px] px-2 py-0.5 rounded-full pl-6" /><Search size={10} className="absolute left-2 top-1.5 text-slate-400" /></div>
            </div>
            
            <div className="p-3 bg-white border-b border-slate-200 shrink-0">
                <h4 className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1">💡 카탈로그 활용 가이드</h4>
                <p className="text-[11px] text-slate-500 leading-tight mb-2">각 조색제의 세부 특성을 현장 상황에 맞게 즉각적으로 파악할 수 있도록 데이터가 분류되어 있습니다. 라벨의 색상을 통해 정보의 성격을 빠르게 확인하세요.</p>
                <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                    <span className="px-1.5 py-0.5 bg-white text-slate-600 rounded border border-slate-200 shadow-xs">일반 특성</span>
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-200 shadow-xs">색상 및 외관 변화</span>
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200 shadow-xs">용도 및 적용 컬러</span>
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-200 shadow-xs">배합 및 혼합 비율</span>
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-200 shadow-xs">경고 및 주의사항</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 bg-slate-100">
                {sortedCatalog.map((item) => {
                    const isMetallic = item.type !== 'solid' && item.type !== 'binder';
                    const isCurrentlyUsed = activeCodes.includes(item.code);
                    return (
                        <div key={item.code} onClick={() => setSelectedTonerForView(item.code)} className={`flex flex-col sm:flex-row bg-white rounded-lg shadow-xs border overflow-hidden cursor-pointer hover:border-blue-400 transition-all ${isCurrentlyUsed ? 'border-l-4 border-l-blue-600 border-blue-300 bg-blue-50/20' : 'border-slate-200'}`}>
                            <div className="w-full sm:w-24 h-14 sm:h-auto flex-shrink-0 relative border-b sm:border-b-0 sm:border-r border-slate-200" style={getCachedTexture(item.type, item.face, item.flop, isMetallic)}>
                                <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-1.5 py-0.5 rounded">{item.code}</div>
                            </div>
                            <div className="p-2 flex-1 flex flex-col justify-center">
                                <div className="font-black text-slate-800 text-xs flex items-center justify-between">{item.role}{isCurrentlyUsed && <span className="text-[9px] bg-blue-600 text-white px-1.5 rounded-full font-bold">배합중</span>}</div>
                                <div className="flex items-start gap-1.5 mt-1">
                                    <span className={`shrink-0 inline-flex px-1 py-0.5 text-[9px] font-bold rounded border ${item.badgeColor}`}>{item.labelCategory}</span>
                                    <p className="text-[11px] text-slate-600 leading-tight break-keep">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* 💡 확장 뷰어 모달 */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white font-sans backdrop-blur-xl select-none">
          <header className="p-4 flex justify-between items-center bg-black/50 border-b border-slate-800">
            <h2 className="text-base font-bold tracking-widest text-slate-300 uppercase flex items-center"><Camera className="mr-2 text-blue-500" size={16}/> HI-TEC MULTI 3D VIEW (BEFORE / AFTER)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-1.5 bg-slate-800 hover:bg-red-500 rounded-full border border-slate-700"><X size={20}/></button>
          </header>
          
          <div className="w-full bg-slate-900 border-b border-slate-700 p-2 overflow-x-auto flex gap-3 items-center shrink-0 shadow-xl custom-scrollbar">
             <div className="text-[10px] font-black text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50 shrink-0 text-center leading-tight">배합<br/>실시간수정</div>
             {toners.filter(t => t.code).map(t => (
                <div key={t.id} className="flex items-center bg-slate-800 border border-slate-600 rounded px-2 py-1 shrink-0 gap-2">
                   <span className="text-xs font-bold text-slate-300">{t.code}</span>
                   <input type="text" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, false)} className="w-12 text-center bg-slate-900 text-xs font-black text-cyan-400 border border-slate-700 rounded p-0.5" />
                   <div className="flex gap-0.5">
                     <button onClick={() => quickEditWeight(t.id, -0.1, false)} className="bg-slate-700 px-1 text-[10px] rounded">-</button>
                     <button onClick={() => quickEditWeight(t.id, 0.1, false)} className="bg-slate-700 px-1 text-[10px] rounded">+</button>
                   </div>
                </div>
             ))}
          </div>

          <main ref={viewerRef} className="flex-1 p-6 flex flex-col md:flex-row gap-4 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)} onPointerLeave={() => setIsDraggingLight(false)}>
             <div className="absolute z-50 flex items-center justify-center pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_60px_#fff] border border-white/30 animate-pulse"><Sun className="text-yellow-100" size={32} /></div>
             </div>
             <div className="flex-1 w-full h-[45%] md:h-[80%] rounded-[1.5rem] border border-slate-700 relative overflow-hidden shadow-2xl" style={getInteractiveBackground(finalOptics, lightPos)}>
                <div className="absolute top-4 left-4 bg-blue-900/90 px-3 py-1.5 rounded-lg font-bold text-xs border border-blue-400 text-white shadow-md">실시간 시뮬레이션 렌더링</div>
             </div>
             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex bg-slate-900/90 p-2 rounded-xl border border-slate-700 gap-2">
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 50, y: 50}); }} className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">정면 (15°)</button>
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 25, y: 25}); }} className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">중면 (45°)</button>
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 5, y: 5}); }} className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">측면 (110°)</button>
             </div>
          </main>
        </div>
      )}

      {/* 안료 디테일 뷰어 모달 */}
      {selectedTonerForView && TONER_DB[selectedTonerForView] && (
        <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center backdrop-blur-xs animate-in fade-in duration-150">
           <div className="bg-white rounded-2xl w-[600px] max-w-[95%] shadow-2xl overflow-hidden border border-slate-700">
              <div className="bg-slate-900 p-4 flex justify-between items-center">
                 <h3 className="text-white font-bold text-sm flex items-center"><Droplet className="mr-1.5 text-blue-400" size={16}/> {selectedTonerForView} 단일 안료 정밀 분석 뷰어</h3>
                 <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="p-5">
                 <div className="text-xl font-black text-blue-700 mb-1">{TONER_DB[selectedTonerForView].role}</div>
                 <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border font-bold whitespace-pre-wrap break-keep">{TONER_DB[selectedTonerForView].desc}</p>
                 <div className="flex gap-4 mt-4">
                    <div className="flex-1">
                       <div className="text-[10px] font-bold text-slate-400 mb-1 text-center bg-slate-100 py-1 rounded shadow-xs">정면 (Face 15°)</div>
                       <div className="h-36 rounded-lg border border-slate-300" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'face')}}></div>
                    </div>
                    <div className="flex-1">
                       <div className="text-[10px] font-bold text-slate-400 mb-1 text-center bg-slate-100 py-1 rounded shadow-xs">측면 (Flop 110°)</div>
                       <div className="h-36 rounded-lg border border-slate-300" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'flop')}}></div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 text-white py-2.5 rounded-lg font-bold w-full text-xs shadow-md mt-4 hover:bg-slate-700">닫기</button>
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
      `}} />
    </div>
  );
}
