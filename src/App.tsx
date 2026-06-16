import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sliders, Trash2, Plus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, BookOpen, Share2, Zap, Search
} from 'lucide-react';

// 💡 1. 공식 안료 데이터베이스 (100% 원문 보존)
const TONER_DB: Record<string, { role: string, desc: string, type: string, face: string, flop: string }> = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임. (WT346 : WT144 = 1 : 0.9)', type: 'solid', face: '#0284c7', flop: '#0c4a6e' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋으며, 채도가 높고 입자감이 좋은 청색계열의 컬러에 사용됨.', type: 'silver_fine', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 188': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두움. 주로 흑색계열의 컬러에 제한적으로 사용함.', type: 'solid', face: '#0f172a', flop: '#020617' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨.', type: 'silver_fine', face: '#a1a6b4', flop: '#64748b' },
  'WT 300': { role: '마룬', desc: '어두운 적색 조색제. WT332에 비해 채도가 높으며 측면(110도)을 더 어둡게 함. 주로 적색 이펙트 컬러에 사용.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제. WT389보다 작음.', type: 'silver_fine', face: '#d1d5db', flop: '#475569' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크.', type: 'xirallic', face: '#fef08a', flop: '#475569' },
  'WT 305': { role: '울트라 화인 실버', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제. 매끈한 느낌의 은색에 사용됨.', type: 'silver_fine', face: '#cbd5e1', flop: '#334155' },
  'WT 307': { role: '프리즈마 실버', desc: '정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제.', type: 'xirallic', face: '#e2e8f0', flop: '#a855f7' },
  'WT 308': { role: '브라이트 오렌지', desc: '주로 이펙트 컬러에 사용하는 맑은 주황색. 은폐력은 떨어짐.', type: 'solid', face: '#ea580c', flop: '#7c2d12' },
  'WT 309': { role: '브릴리언트 마젠타', desc: '맑은 자주색 조색제. 주로 채도가 높은 이펙트 컬러에 사용함. 은폐력은 떨어짐.', type: 'solid', face: '#d946ef', flop: '#701a75' },
  'WT 310': { role: '파우더 펄 바인더', desc: '파우더 펄 사용을 위한 조색제 바인더로 사용', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 311': { role: '루비 레드', desc: '약하게 황색을 띠는 맑은 적색 조색제. 주로 채도 높은 적색 이펙트 컬러에 사용함. 은폐력은 떨어짐.', type: 'solid', face: '#ef4444', flop: '#7f1d1d' },
  'WT 312': { role: '매직 파이어 이펙트', desc: '관찰각도에 따라 색상변화가 큰 특수 펄 조색제. 15도는 맑은 적색, 45도는 맑은 녹색, 110도는 약하게 녹색으로 변하는 펄.', type: 'pearl', face: '#ef4444', flop: '#22c55e' },
  'WT 315': { role: '엑스트라 화인 블루 펄', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 펄 조색제. WT372 보다도 작음. 15도는 적청색, 나머지 각도(45 & 110도)는 녹황색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#3b82f6', flop: '#84cc16' },
  'WT 316': { role: '터콰이즈 펄', desc: '중간 크기의 녹색을 띠는 청색 펄 조색제. 15도는 맑은 청색, 나머지 각도(45 & 110도)는 맑은 녹색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#06b6d4', flop: '#10b981' },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', desc: 'WT305보다 조금 큰 반짝임이 좋은 매끄러운 특수 알루미늄 조색제. WT305 보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.', type: 'silver_fine', face: '#94a3b8', flop: '#334155' },
  'WT 318': { role: '브릴리언트 블루', desc: '녹색을 띠는 맑은 청색 조색제. WT346보다 밝고 녹색이 더 많음', type: 'solid', face: '#0284c7', flop: '#082f49' },
  'WT 320': { role: '플래티늄 펄', desc: '가장 작은 크기의 백색 펄 조색제. 예) 현대 XB3, 아우디 LX7L, LX6T, BMW A96 등에 사용됨.', type: 'pearl', face: '#e2e8f0', flop: '#64748b' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제. 솔리드 컬러에서 명암을 밝게 하고 색상을 줄임. 이펙트 컬러에서 15도는 어둡고 나머지 각도(45 & 110도)는 밝게 함. 입자감을 줄임.', type: 'solid', face: '#ffffff', flop: '#e2e8f0' },
  'WT 322': { role: '마이크로 화이트', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 사용함. 15도는 황색을 띠며 어둡고 나머지 각도(45 & 110도)는 청색을 띠며 밝게 함.', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 323': { role: '스페셜 블랙', desc: '표준 흑색 조색제. 알루미늄 입자에 사용하면 명암은 어두워지고 약하게 적황색이 늘어남. 솔리드 컬러에 사용하면 명도와 채도를 낮춤.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 324': { role: '레디쉬 옐로우', desc: '적색을 띠는 맑고 채도 높은 황색 조색제. 은폐력은 떨어짐. 주로 이펙트 컬러에 사용함.', type: 'solid', face: '#f59e0b', flop: '#9a3412' },
  'WT 326': { role: '그리니쉬 옐로우', desc: '이펙트 컬러에 사용하는 녹색을 띤 맑은 황색 조색제. 알루미늄 입자에 혼합하면 15도는 맑은 황색, 나머지 각도(45 & 110도)는 녹황색을 띰.', type: 'solid', face: '#eab308', flop: '#65a30d' },
  'WT 327': { role: '옐로우', desc: '녹색을 띠는 밝은 황색 조색제. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서는 특히 45 & 110도에 밝은 황색이 필요할 경우에만 소량 사용.', type: 'solid', face: '#fde047', flop: '#ca8a04' },
  'WT 328': { role: '오커', desc: '주로 솔리드 컬러에 사용하는 탁한 황색.', type: 'solid', face: '#b45309', flop: '#451a03' },
  'WT 329': { role: '트랜스페어런트 옐로우', desc: '적색을 조금 띠는 선명하고 맑은 황색(스칼렛) 조색제. 주로 이펙트 컬러에 사용. 은폐력은 떨어짐.', type: 'solid', face: '#f59e0b', flop: '#ea580c' },
  'WT 330': { role: '블러드 오렌지', desc: '밝은 주황색 조색제. 무연(납 미함유) 성분. 주로 솔리드 컬러에 사용. 이펙트 컬러에는 특히 45 & 110도에 밝은 황적색이 부족할 경우에만 소량 사용.', type: 'solid', face: '#ea580c', flop: '#9a3412' },
  'WT 331': { role: '트랜스루센트 옥사이드', desc: '이펙트 컬러에서 맑은 적황색을 내는 조색제. 솔리드 컬러에는 사용을 금함.', type: 'solid', face: '#d97706', flop: '#451a03' },
  'WT 332': { role: '마룬', desc: '어두운 적색 조색제. 주로 적색 이펙트 컬러에 사용하며 전체적으로 황적색을 내고 명암을 조금 어둡게 함.', type: 'solid', face: '#b91c1c', flop: '#7c2d12' },
  'WT 333': { role: '그라나다 레드', desc: '밝은 적색 조색제. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서 특히 45 & 110도에 적색이 부족할 경우 소량 사용됨.', type: 'solid', face: '#991b1b', flop: '#450a0a' },
  'WT 334': { role: '옥사이드 레드', desc: '주로 솔리드 컬러에 사용하는 탁한 적색 조색제. 조색제 단독으로는 은폐력 좋음. 이펙트 컬러에서 특히 45 & 110도에 황적색을 띠게 하기위해 소량 사용.', type: 'solid', face: '#7f1d1d', flop: '#450a0a' },
  'WT 335': { role: '다크 옐로우', desc: '적색을 조금 띠는 밝은 황색 조색제. 주로 솔리드 컬러 배합에 주로 사용함. 이펙트 컬러에서는 특히 45 & 110도에 밝은 녹황색이 부족할 경우에만 소량 사용.', type: 'solid', face: '#d97706', flop: '#78350f' },
  'WT 336': { role: '트랜스루센트 레드', desc: '선명하며 어두운 갈색 조색제. 이펙트 컬러 조색에만 사용.', type: 'solid', face: '#7c2d12', flop: '#450a0a' },
  'WT 337': { role: '레드', desc: '중간 정도의 적색 조색제. 약하게 청색을 띰.', type: 'solid', face: '#ef4444', flop: '#991b1b' },
  'WT 338': { role: '블루이쉬 마젠타 레드', desc: '표준 자주색 조색제. 백색 및 알루미늄 입자에 혼합할 경우 맑은 분홍색을 나타냄.', type: 'solid', face: '#d946ef', flop: '#86198f' },
  'WT 339': { role: '바이올렛', desc: '맑은 보라색 조색제. 청색 및 회색 컬러에 주로 사용되며 보라색을 내고 명암을 어둡게 함.', type: 'solid', face: '#8b5cf6', flop: '#4c1d95' },
  'WT 340': { role: '옐로우 마젠타 레드', desc: '맑은 자주색 조색제. WT338에 비해 밝고 청색이 적음. 주로 이펙트 컬러에 사용함. 알루미늄 입자에 혼합할 경우 맑은 분홍색을 냄.', type: 'solid', face: '#e879f9', flop: '#a21caf' },
  'WT 341': { role: '아주르 블루', desc: '채도 높은 청색 조색제. 이펙트 컬러에서 15도는 녹청색, 나머지 각도(45 & 110도)는 적청색을 띰. 관찰각도 별로 컬러의 변화가 가장 큼.', type: 'solid', face: '#2563eb', flop: '#1e3a8a' },
  'WT 342': { role: '다크 바이올렛', desc: '맑은 보라색 조색제. 은폐력이 있음. 15도는 진한 보라색, 나머지는 자주색을 나타냄.', type: 'solid', face: '#6d28d9', flop: '#2e1065' },
  'WT 343': { role: '블루', desc: '표준 청색 조색제. 솔리드와 이펙트 컬러에 모두 사용하는 중간 청색 조색제.', type: 'solid', face: '#3b82f6', flop: '#1e40af' },
  'WT 344': { role: '다크 블루', desc: '어두운 청색 조색제. 이펙트 컬러에서 15도는 청색, 나머지 각도(45 & 110도)는 적색을 띰. 청색 조색제 중 가장 어두움.', type: 'solid', face: '#1d4ed8', flop: '#0f172a' },
  'WT 345': { role: '트랜스페어런트 에메랄드', desc: '맑고 선명한 황색을 조금 띠는 녹색 조색제. WT347대비 밝고 황색이 많음.', type: 'solid', face: '#10b981', flop: '#064e3b' },
  'WT 346': { role: '트랜스페어런트 딥 블루', desc: '녹색을 띠는 청색 조색제. 특히 45 & 110도에서 녹색이 가장 많은 청색 조색제. 이펙트 컬러에 가장 많이 사용하는 청색임.', type: 'solid', face: '#1d4ed8', flop: '#020617' },
  'WT 347': { role: '트랜스페어런트 그린', desc: '청색을 조금 띠는 녹색 조색제. WT345에 비해 어두움.', type: 'solid', face: '#059669', flop: '#022c22' },
  'WT 348': { role: '트랜스페어런트 아주르 블루', desc: '채도 높은 청색 조색제. 이펙트 컬러에서 15도는 녹색이 강한 청색, 나머지 각도(45 & 110도)는 약하게 적색을 띰.', type: 'solid', face: '#0ea5e9', flop: '#0369a1' },
  'WT 349': { role: '트랜스루센트 그린', desc: '녹색 저농 조색제. WT347의 저농 버전. (WT349 : WT347 = 10.52 : 1)', type: 'solid', face: '#34d399', flop: '#064e3b' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제. WT323의 저농 버전. (WT350 : WT323 = 2.89 : 1)', type: 'solid', face: '#1e293b', flop: '#451a03' },
  'WT 351': { role: '트랜스루센트 아주르 블루', desc: '저농 청색 조색제. WT348의 저농 버전. (WT351 : WT348 = 8.7 : 1)', type: 'solid', face: '#38bdf8', flop: '#075985' },
  'WT 352': { role: '트랜스루센트 화이트', desc: '저농 백색 조색제. WT321의 저농 버전. (WT352 : WT321 = 7.69 : 1)', type: 'solid', face: '#f8fafc', flop: '#cbd5e1' },
  'WT 353': { role: '트랜스루센트 마젠타 레드', desc: '저농 자주색 조색제. WT338의 저농 버전. (WT353 : WT338 = 5.68 : 1)', type: 'solid', face: '#c026d3', flop: '#4a044e' },
  'WT 354': { role: '화인 실버', desc: '매우 작은 크기의 일반형 알루미늄 조색제. WT356 보다 작음.', type: 'silver_fine', face: '#cbd5e1', flop: '#64748b' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 광휘형 알루미늄 조색제. 은폐력은 떨어짐.', type: 'silver_coarse', face: '#f8fafc', flop: '#334155' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 일반형 알루미늄 조색제.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 357': { role: '마이크로 실버', desc: '입자가 작은 일반형 알루미늄 조색제. WT356보다 15도는 어둡고, 나머지 각도(45 & 110도)는 밝음.', type: 'silver_fine', face: '#f8fafc', flop: '#64748b' },
  'WT 358': { role: '스페셜 실버', desc: '이펙트 컬러용 특수 실버 조색제', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 359': { role: '브라이트 실버', desc: 'WT356보다 큰 일반형 알루미늄 조색제. WT356 보다 15도는 밝고, 나머지 각도(45 & 110도)는 어두움.', type: 'silver_coarse', face: '#f1f5f9', flop: '#334155' },
  'WT 360': { role: '코올스 실버', desc: 'WT359보다 큰 거친 알루미늄 조색제. WT359보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.', type: 'silver_coarse', face: '#94a3b8', flop: '#1e293b' },
  'WT 361': { role: '브릴리언트 실버', desc: 'WT362보다 큰 광휘형 알루미늄 조색제. WT362보다 15도는 밝고 나머지 각도(45 & 110도)는 어두움.', type: 'silver_coarse', face: '#f1f5f9', flop: '#64748b' },
  'WT 362': { role: '브릴리언트 실버 화인', desc: '작은 크기의 광휘형 알루미늄 조색제. WT361에 비해 크기가 작음.', type: 'silver_fine', face: '#e2e8f0', flop: '#334155' },
  'WT 363': { role: '브릴리언트 골드', desc: '밝은 황색 알루미늄 조색제. 은폐력이 우수함.', type: 'pearl', face: '#fbbf24', flop: '#b45309' },
  'WT 364': { role: '화이트 펄', desc: '큰 크기의 백색 펄 조색제.', type: 'pearl', face: '#ffffff', flop: '#94a3b8' },
  'WT 365': { role: '라일락 펄', desc: '중간 크기의 자주색 간섭 펄 조색제. 15도는 청적색, 나머지 각도(45 & 110도)는 황녹색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#a3e635', flop: '#be185d' },
  'WT 366': { role: '골드 펄', desc: '중간 크기의 황색 간섭 펄 조색제. 15도는 황색, 나머지 각도(45 & 110도)는 청색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#facc15', flop: '#4c1d95' },
  'WT 367': { role: '화인 그린 펄', desc: '작은 크기의 녹색 간섭 펄 조색제. 15도는 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#4ade80', flop: '#991b1b' },
  'WT 368': { role: '화인 화이트 펄', desc: '중간 크기의 백색 펄 조색제.', type: 'pearl', face: '#f8fafc', flop: '#64748b' },
  'WT 369': { role: '레드 펄', desc: '작은 크기의 적색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임. 적색 입자감 있는 컬러에 적용하며, 다른 펄보다 은폐력이 있음.', type: 'pearl', face: '#ef4444', flop: '#7f1d1d' },
  'WT 370': { role: '브라이트 블루 펄', desc: '큰 크기의 맑은 청색 간섭 펄 조색제. 15도는 녹청색, 나머지 각도(45 & 110도)는 적황색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#0ea5e9', flop: '#be123c' },
  'WT 371': { role: '브라운 펄', desc: '중간 크기의 주황색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.', type: 'pearl', face: '#d97706', flop: '#451a03' },
  'WT 372': { role: '화인 블루 펄', desc: 'WT370보다 작은 적색이 있는 청색 간섭 펄 조색제. 15도는 적청색, 나머지 각도(45 & 110도)는 녹황색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#3b82f6', flop: '#c026d3' },
  'WT 373': { role: '루비 펄', desc: '중간 크기의 은폐력이 있는 적색 펄 조색제. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.', type: 'pearl', face: '#dc2626', flop: '#7f1d1d' },
  'WT 374': { role: '블루 그린 펄', desc: '중간 크기의 청녹색 펄 조색제. 15도는 청녹색, 나머지 각도(45 & 110도)는 황적색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#0d9488', flop: '#c2410c' },
  'WT 375': { role: '그린 펄', desc: '중간 크기의 녹색 펄 조색제. 15도는 맑은 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#16a34a', flop: '#b91c1c' },
  'WT 376': { role: '레드펄 엑스트라', desc: '중간 크기의 적색 펄 조색제. 15도는 적색, 나머지 각도(45 & 110도)는 녹색으로 변하는 간섭 펄 입자임.', type: 'pearl', face: '#ef4444', flop: '#16a34a' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 약하게 녹색을 띠며 나머지 각도는 약하게 적색을 띰.', type: 'xirallic', face: '#ffffff', flop: '#64748b' },
  'WT 378': { role: '다이아몬드 레드', desc: '질라릭 적색 펄 조색제. 입자의 반짝임이 매우 좋음. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.', type: 'xirallic', face: '#ef4444', flop: '#7f1d1d' },
  'WT 379': { role: '다이아몬드 카퍼', desc: '질라릭 주황색 펄 조색제. 입자의 반짝임이 매우 좋음. 관찰각도 별로 색상 변화가 거의 없는 착색 펄 입자임.', type: 'xirallic', face: '#ea580c', flop: '#7c2d12' },
  'WT 380': { role: '다이아몬드 그린', desc: '질라릭 녹색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 녹색, 나머지 각도(45 & 110도)는 적색으로 변하는 간섭 펄 입자임.', type: 'xirallic', face: '#4ade80', flop: '#166534' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 청색, 나머지 각도(45 & 110도)는 황색으로 변하는 간섭 펄 입자임.', type: 'xirallic', face: '#3b82f6', flop: '#1e3a8a' },
  'WT 382': { role: '다이아몬드 골드', desc: '질라릭 황색 펄 조색제. 입자의 반짝임이 매우 좋음. 15도는 황색, 나머지 각도(45 & 110도)는 청색으로 변하는 간섭 펄 입자임.', type: 'xirallic', face: '#facc15', flop: '#a16207' },
  'WT 383': { role: '브릴리언트 오렌지', desc: 'WT363에 비해 적색감이 많은 적황색 알루미늄 조색제.', type: 'silver_coarse', face: '#f97316', flop: '#9a3412' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: 'Transparent White. WT387에 비해 점도가 높음.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 386': { role: '플롭 컨트롤', desc: '측면을 밝게 하기 위한 명암 조정제.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: 'Viscosity Additive. 점도 조절제.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 388': { role: '슈퍼 딥 블랙', desc: '어두운 흑색 조색제. WT323보다 어두움. 주로 흑색계열의 컬러에 제한적으로 사용함.', type: 'solid', face: '#020617', flop: '#000000' },
  'WT 389': { role: '플래틴 실버 화인', desc: '작은 고휘도 광휘형 알루미늄 조색제. WT303보다 크고 WT390보다 작음.', type: 'silver_fine', face: '#e2e8f0', flop: '#475569' },
  'WT 390': { role: '플래틴 실버', desc: '중간 크기의 고휘도 광휘형 알루미늄 조색제. WT389보다 큼. 알루미늄 입자 중 15도가 가장 밝고 나머지 각도(45 & 110도)가 가장 어두움.', type: 'silver_coarse', face: '#f8fafc', flop: '#334155' },
  'WT 392': { role: '매직 이펙트', desc: '관찰각도에 따라 색상변화가 큰 특수 펄 조색제. 색상이 WT312의 반대로 변함. 15도는 맑은 녹색, 45도는 맑은 적색, 110도는 약하게 적색으로 변하는 펄.', type: 'pearl', face: '#22c55e', flop: '#ef4444' },
  'WT 393': { role: '라이트 옐로우', desc: '약하게 녹색을 띠는 밝은 황색 조색제. WT327에 비해 녹색이 적음. 주로 솔리드 컬러에 사용함. 이펙트 컬러에서 특히 45 & 110도에 밝은 황색이 필요할 경우에만 소량 사용.', type: 'solid', face: '#fef08a', flop: '#a16207' },
  'WT 1051': { role: '블랜딩 1051', desc: '블랜드인 첨가제, 블랜딩용 첨가제.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 1500': { role: '울트라 딥 블랙', desc: '가장 어두운 흑색 조색제. 염료를 함유하고 있어 알루미늄 입자에 2% 이상 사용하면 알루미늄 입자와 반응하여 색상이 변할 수 있고 내구성에도 문제가 될 수 있음(솔리드: 최대 5%, 실버: 최대 2%, 펄: 최대 5% 이내 사용)', type: 'solid', face: '#000000', flop: '#000000' },
  'WT 455': { role: '퍼포먼스 컴포넌트', desc: '솔리드 컬러에만 사용하는 첨가제. WT455를 베이스코트 무게의 10% 혼합하면 특히 겨울과 같은 낮은 습도 조건에서 작업성이 좋아지며 외관도 개선됨.', type: 'binder', face: '#ffffff', flop: '#ffffff' },
  'WT 3080': { role: '스페셜 애디티브', desc: '도막 보정 및 흐름 방지 첨가제', type: 'binder', face: '#ffffff', flop: '#ffffff' }
};

// 💡 1-2. 카탈로그 라벨 자동 분류 로직
const catalogData = Object.entries(TONER_DB).map(([code, data]) => {
  let labelCategory = "일반 특성";
  let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
  
  const roleStr = data.role || '';
  const descStr = data.desc || '';
  const typeStr = data.type || '';

  if(roleStr.includes("블루") || roleStr.includes("레드") || roleStr.includes("옐로우") || roleStr.includes("그린") || roleStr.includes("오렌지") || roleStr.includes("바이올렛") || roleStr.includes("마룬")) {
      labelCategory = "색상 및 외관 변화"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200";
  } else if (descStr.includes("금지") || descStr.includes("최대") || descStr.includes("주의") || descStr.includes("제한")) {
      labelCategory = "경고 및 주의사항"; badgeColor = "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100";
  } else if (roleStr.includes("실버") || roleStr.includes("펄") || roleStr.includes("이펙트") || descStr.includes("이펙트")) {
      labelCategory = "용도 및 적용 컬러"; badgeColor = "bg-blue-50 text-blue-600 border-blue-200";
  } else if (typeStr === "binder" || descStr.includes("첨가제") || descStr.includes("수지") || descStr.includes("바인더")) {
      labelCategory = "배합 및 혼합 비율"; badgeColor = "bg-purple-50 text-purple-600 border-purple-200";
  }
  return { code, ...data, labelCategory, badgeColor };
});

// 💡 2. 보간용 수학 함수 (에러 100% 멸균 완료)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHue = (a: number, b: number, t: number) => { let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360; let h = a + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360; return h; };
const lerpColor = (c1: any, c2: any, t: number) => ({ h: lerpHue(c1.h, c2.h, t), s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) });

const hex2rgb = (hex: string) => { let v = parseInt(hex.replace('#',''), 16); return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }; };
const rgb2hsl = (r: number, g: number, b: number) => {
  r /= 255; g /= 255; b /= 255; let max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) { let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const isTonerMetallic = (role: string) => {
    const r = role || '';
    return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('글라스');
}

// 💡 3. SVG 텍스처 렌더링 캐싱 엔진 (모바일 버벅임 원천 차단)
const textureCache: Record<string, React.CSSProperties> = {};
const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
    if (!isMetallic || type === 'binder' || type === 'solid') {
        return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
    }
    
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

// 💡 단일 뷰어 정밀 그라데이션
const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || ''; let h = 0, s = 0, baseL = 50;
  if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('마룬')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹')) { h = 140; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('오커') || r.includes('황')) { h = 40; s = 80; baseL = 50; }
  else if (r.includes('오렌지')) { h = 20; s = 90; baseL = 50; }
  else if (r.includes('바이올렛')) { h = 270; s = 80; baseL = 40; }
  else if (r.includes('화이트') || r.includes('백')) { h = 0; s = 0; baseL = 90; }
  else if (r.includes('블랙') || r.includes('흑')) { h = 0; s = 0; baseL = 15; }
  else if (r.includes('실버') || r.includes('알루미늄')) { h = 210; s = 10; baseL = 60; }
  else { h=0; s=0; baseL=95; } 
  
  const isMetallic = isTonerMetallic(r);
  
  if (angle === 'face') {
    const l = isMetallic ? Math.min(100, baseL + 25) : Math.min(100, baseL + 10);
    return `radial-gradient(circle at 40% 40%, hsl(${h}, ${s}%, ${Math.min(100, l+20)}%) 0%, hsl(${h}, ${s}%, ${l}%) 60%, hsl(${h}, ${s}%, ${Math.max(0, l-15)}%) 100%)`;
  } else {
    const l = isMetallic ? Math.max(0, baseL - 30) : Math.max(0, baseL - 15);
    return `radial-gradient(circle at 10% 10%, hsl(${h}, ${s}%, ${Math.min(100, l+10)}%) 0%, hsl(${h}, ${s}%, ${l}%) 100%)`;
  }
};

// 💡 🚨[화면 뻗음(Black Screen) 방어 엔진]🚨
// 이전 코드에서 안료 정보 부족 시 NaN이 발생하던 치명적 버그를 완벽하게 차단했습니다. (V18.1의 가장 안정적인 수식으로 롤백)
const getOptics = (tonersList: any[], weightKey: string) => {
  const colorToners = tonersList.filter(t => !t.role?.includes('지정되지 않은') && t.code !== '');
  const sumW = colorToners.reduce((sum, t) => sum + (parseFloat(t[weightKey]) || 0), 0);

  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0, rGreen=0, rRed=0, rYellow=0, rViolet=0;
  let wSilver=0, wWhite=0, wBlack=0, wPearl=0, wBinder=0;
  let interferenceColor: string | null = null;

  colorToners.forEach(t => {
    const w = parseFloat(t[weightKey]) || 0;
    if (w <= 0) return;

    const role = TONER_DB[t.code]?.role || '';
    const code = t.code || '';
    let strength = 1.0;
    if (code.includes('144') || code.includes('341') || code.includes('300') || code.includes('338')) strength = 2.5;

    if (role.includes('컴포넌트') || role.includes('바인더') || role.includes('애디티브') || ['WT 385', 'WT 387', 'WT 386', 'WT 400', 'WT 3080', 'WT 310'].some(c => code.includes(c.replace('WT ', '')))) {
      wBinder += w;
    } else if (role.includes('블랙') || code.includes('323') || code.includes('388') || code.includes('188')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄') || code.includes('362') || code.includes('357') || code.includes('197') || code.includes('303') || code.includes('305') || code.includes('307')) wSilver += w;
    else if (role.includes('화이트') || code.includes('321') || code.includes('328')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('스파클') || code.includes('304') || code.includes('377') || code.includes('381')) {
      wPearl += w;
      if (role.includes('블루') || code.includes('381')) { interferenceColor = 'blue'; rBlue += w * 0.15; }
      else if (role.includes('레드') || role.includes('마젠타')) { interferenceColor = 'red'; rRed += w * 0.15; }
      else if (role.includes('그린')) { interferenceColor = 'green'; rGreen += w * 0.15; }
      else if (role.includes('골드') || code.includes('304')) { interferenceColor = 'yellow'; rYellow += w * 0.15; }
      else if (role.includes('화이트') || code.includes('377')) interferenceColor = 'white';
    } else if (code.includes('144') || role.includes('블루') || role.includes('청')) { rBlue += w * strength; rGreen += (w * strength) * 0.5; }
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
  if (effectiveW === 0 && wBinder > 0) baseL = 90; 

  let blackImpact = Math.pow(pBlack, 0.45) * 60; 
  if (pWhite > 0.6) blackImpact = blackImpact * 0.15; 
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
  if (pWhite > 0.6) sat = sat * 0.3; 

  let flopHue = hue, faceHue = hue;
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

const getColorString = (opticsObj: any, angle: 'face'|'mid'|'flop') => {
  if (!opticsObj || !opticsObj[angle]) return 'hsl(0,0%,90%)';
  return `hsl(${opticsObj[angle].h}, ${opticsObj[angle].s}%, ${opticsObj[angle].l}%)`;
};

const getInteractiveBackground = (opticsObj: any, lPos: any) => {
  if (!opticsObj || !opticsObj.face || !opticsObj.mid || !opticsObj.flop) return '#f1f5f9';
  const viewAngleT = Math.max(0, Math.min(1, lPos.x / 100));
  
  const lerpColorAdvanced = (c1: any, c2: any, t: number) => {
      let d = c2.h - c1.h; if (d > 180) d -= 360; if (d < -180) d += 360;
      let h = c1.h + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360;
      return { h, s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) };
  };

  let activeBaseColor = viewAngleT > 0.5 
      ? lerpColorAdvanced(opticsObj.mid, opticsObj.face, (viewAngleT - 0.5) * 2) 
      : lerpColorAdvanced(opticsObj.flop, opticsObj.mid, viewAngleT * 2);
      
  const baseColorStr = `hsl(${Math.round(activeBaseColor.h)}, ${Math.round(activeBaseColor.s)}%, ${Math.round(activeBaseColor.l)}%)`;
  
  const dist = Math.sqrt(Math.pow(lPos.x - 50, 2) + Math.pow(lPos.y - 50, 2)); 
  const normalizedDist = Math.min(1, dist / 70); 
  const highlightAlpha = lerp(0.6, 0.0, normalizedDist);
  
  return `radial-gradient(circle at ${lPos.x}% ${lPos.y}%, rgba(255,255,255,${highlightAlpha}) 0%, ${baseColorStr} ${lerp(20, 70, normalizedDist)}%, hsl(${Math.round(activeBaseColor.h)}, ${Math.round(activeBaseColor.s)}%, ${Math.round(activeBaseColor.l * 0.4)}) 100%)`;
};


// ==========================================
// 💡 메인 APP 컴포넌트
// ==========================================
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

  // 💡 [에러 원천 차단] 필수 Refs
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
  const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null);

  const [isBaseMetallic, setIsBaseMetallic] = useState(false);
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);

  const tonersRef = useRef<any[]>([]);
  const pearlTonersRef = useRef<any[]>([]);
  const isThreeCoatModeRef = useRef<boolean>(true);

  // 실시간 정렬 트래킹
  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');

  useEffect(() => {
    tonersRef.current = toners;
    pearlTonersRef.current = pearlToners;
    isThreeCoatModeRef.current = isThreeCoatMode;
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('tesseract-script')) {
      const script = document.createElement('script');
      script.id = 'tesseract-script';
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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

    const checkMetallic = (list: any[]) => list.some(t => {
      const type = TONER_DB[t.code]?.type || '';
      return type !== 'solid' && type !== 'binder' && type !== '';
    });
    setIsBaseMetallic(checkMetallic(toners));
    setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  // 💡 [고속 타이핑 엔진] 오토 포커스 (추가 버튼 및 3자리 완성 시 작동)
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
    setTargetColorCode(''); setIsBaseConfirmed(false); setScannedImage(null);
  };

  // 💡 🚨[사진 스캔 자동 렌더링 엔진]🚨 OCR 데이터를 화면 상태에 완벽히 꽂아넣습니다.
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
                        nextPearl[j] = { ...nextPearl[j], adjustedWeight: orphanWeight }; found = true; break;
                    }
                }
            }
            if (!found) {
                for (let j = nextBase.length - 1; j >= 0; j--) {
                    if (nextBase[j].code !== '' && (!nextBase[j].adjustedWeight || nextBase[j].adjustedWeight === '')) {
                        nextBase[j] = { ...nextBase[j], adjustedWeight: orphanWeight }; found = true; break;
                    }
                }
            }
        }
    }
    setToners(nextBase);
    setPearlToners(nextPearl);
  }, []);

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
        
        if (nums && nums.length > 0) {
            processNumbers(nums);
        } else { throw new Error("코드 인식 실패"); }
      } else { throw new Error("OCR 모듈 미적용"); }
    } catch (error) { alert("스캔 실패: 화질 문제로 숫자를 찾지 못했습니다. 직접 입력해 주세요."); }
    setIsScanning(false);
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.');
    if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') val = ''; 
    else if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, '');
    else if (val.startsWith('.')) val = '0' + val; 

    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
    else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };

  // 💡 [고속 타이핑] 코드 3자리 입력 시 즉시 그람(g)수로 커서 이동
  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim(); 
    const setter = isPearl ? setPearlToners : setToners;
    
    setter(prev => prev.map(toner => {
      if (toner.id === id) {
        let finalCode = formattedCode; 
        const numMatch = formattedCode.match(/\d+/);
        if (numMatch && numMatch[0].length >= 3) {
            const testCode = `WT ${numMatch[0]}`;
            if (TONER_DB[testCode]) {
                finalCode = testCode;
                setFocusTarget({ id: id, type: 'weight' }); // 🔥 포커스 점프!
            }
        }
        return { ...toner, code: finalCode };
      }
      return toner;
    }));
  };

  // 💡 [고속 타이핑] 그람수(g) 완료 후 Enter 키 누르면 새 줄 추가 및 코드 포커스
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
    setFocusTarget({ id: newId, type: 'code' }); // 🔥 새 줄 코드로 자동 포커스!
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

  // 💡 🚨[카카오톡 공유 상세 직렬화 전송 엔진]🚨
  const shareToKakao = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || ''}): ${t.adjustedWeight || '0'}g`).join('\n');
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || ''}): ${t.adjustedWeight || '0'}g`).join('\n');
    
    const text = `[PERMAHYD HI-TEC 배합 지시서]\n================================\n🎨 컬러코드: ${targetColorCode || '미지정'}\n================================\n\n[▼ 베이스 코트 (Ground)]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 6052 수지 제원: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트 (Mid-coat)]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 코트 합계: ${totalPearlWeight}g\n▶ 6052 수지 제원: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 혼합 총량: ${totalFinalWeight}g\n================================`;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({ title: 'HI-TEC 조색 배합 인계', text: text }).catch(console.error);
    } else {
        alert("상세 배합 지시서가 클립보드에 완벽히 복사되었습니다. 카카오톡에 바로 '붙여넣기' 하십시오.\n\n" + text);
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }
  };

  // 💡 [카탈로그 실시간 정렬]
  const sortedCatalog = [...catalogData].sort((a, b) => {
      const aActive = activeCodes.includes(a.code);
      const bActive = activeCodes.includes(b.code);
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0; 
  }).filter(item => item.code.includes(catalogSearch.toUpperCase()) || item.role.includes(catalogSearch));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      
      {scannedImage && (
        <div className="bg-slate-900 border-b-4 border-blue-500 shadow-2xl z-50 p-2 md:p-4 sticky top-0 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-2 px-2 max-w-[1600px] mx-auto">
            <h2 className="text-white text-sm font-bold flex items-center"><ImageIcon className="mr-2 text-blue-400" size={18}/> 시편 고속 참조 모드</h2>
            <button onClick={() => setScannedImage(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1.5 rounded-full"><X size={18} /></button>
          </div>
          <div className="w-full max-h-[25vh] overflow-auto rounded-lg border border-slate-700 bg-black flex justify-center max-w-[1600px] mx-auto">
             <img src={scannedImage} alt="스캔본" className="object-contain w-full h-auto" />
          </div>
        </div>
      )}

      {isScanning && (
        <div className="fixed inset-0 bg-slate-900/95 z-[200] flex flex-col items-center justify-center backdrop-blur-sm z-[9999]">
          <ScanLine className="text-blue-500 w-28 h-28 animate-pulse mb-4" />
          <h2 className="text-white text-xl font-black">시편 데이터 고속 추출 중...</h2>
        </div>
      )}

      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">PERMAHYD HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 21.1</span></h1>
        </div>
        <button className="flex items-center space-x-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-bold transition-colors shadow-lg"><FolderOpen size={16} /><span>엑셀 DB 동기화</span></button>
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
              {/* 💡 스캔 버튼 이름 변경 */}
              <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md flex-1 items-center justify-center text-sm font-black shadow-md flex transition-colors"><Camera size={18} className="mr-2" />시편 촬영</button>
            </div>
            <div className="flex items-center space-x-1.5">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력 (예: UG4)" className="bg-white border border-slate-300 px-3 py-2.5 rounded-md text-xs font-bold focus:outline-none flex-1 uppercase shadow-inner" />
              <button onClick={() => setIsBaseConfirmed(!isBaseConfirmed)} className={`px-4 py-2.5 rounded-md text-sm font-bold flex items-center shadow-md ${isBaseConfirmed ? 'bg-slate-200 text-slate-500' : 'bg-slate-800 text-white'}`}>{isBaseConfirmed ? <Lock size={14} className="mr-1"/> : <Unlock size={14} className="mr-1"/>}확정</button>
              
              {/* 💡 카톡 공유 버튼 연동 */}
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
                  // 💡 모바일 깨짐 방지 레이아웃 (sm:flex-row) 유지
                  <div key={toner.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-slate-50 hover:bg-blue-50/50 p-2.5 mb-1.5 rounded-xl border border-slate-200 shadow-sm gap-2">
                    <div className="flex w-16 h-10 sm:h-12 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                       <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                       <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                    </div>
                    <div className="flex flex-col flex-1 w-full">
                       <div className="flex items-center gap-2 mb-0.5">
                           <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, false)} className="w-24 text-sm font-black uppercase border border-slate-300 rounded px-1.5 py-0.5 focus:border-blue-500 focus:outline-none shadow-inner" placeholder="코드"/>
                           <span className="font-bold text-blue-700 text-xs truncate">{info.role || '안료미지정'}</span>
                       </div>
                       <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-tight break-keep">{info.desc}</p>
                    </div>
                    <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0">
                       <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} className="w-16 text-right font-black text-blue-600 focus:outline-none" placeholder="0"/>
                       <span className="text-[11px] text-slate-400 ml-1 mr-1">g</span>
                       <button onClick={() => removeToner(toner.id, false)}><Trash2 size={14} className="text-slate-300 hover:text-red-500"/></button>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-1.5 border border-dashed rounded-lg text-slate-400 font-bold text-xs hover:border-blue-500 flex justify-center items-center gap-1"><Plus size={12}/>베이스 안료 추가</button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-2 border-t border-purple-100 space-y-2">
                <div className="text-xs font-black text-purple-700">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const info = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', role: '', desc: '' };
                  const isEffect = info.type !== 'solid' && info.type !== 'binder';
                  return (
                    <div key={toner.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-purple-50/20 p-2.5 mb-1.5 rounded-xl border border-purple-100 shadow-sm gap-2">
                      <div className="flex w-16 h-10 sm:h-12 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                         <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                         <div className="flex-1 border-l border-purple-200" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                      </div>
                      <div className="flex flex-col flex-1 w-full">
                         <div className="flex items-center gap-2 mb-0.5">
                             <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, true)} className="w-24 text-sm font-black uppercase border border-purple-200 rounded px-1.5 py-0.5 text-purple-800 shadow-inner" placeholder="코드"/>
                             <span className="font-bold text-purple-700 text-xs truncate">{info.role || '안료미지정'}</span>
                         </div>
                         <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-tight break-keep">{info.desc}</p>
                      </div>
                      <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-md px-1.5 py-0.5 shrink-0">
                         <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} className="w-16 text-right font-black text-purple-600 focus:outline-none" placeholder="0"/>
                         <span className="text-[11px] text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => removeToner(toner.id, true)}><Trash2 size={14} className="text-slate-300 hover:text-red-500"/></button>
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addToner(true)} className="w-full py-1.5 border border-dashed border-purple-200 rounded-lg text-purple-400 font-bold text-xs flex justify-center items-center gap-1 hover:border-purple-400"><Plus size={12}/>펄 조색제 추가</button>
              </div>
            )}
          </div>
          
          {/* 💡 [복원 완료] 6052 수지 자동 계산기 패널 */}
          <div className="p-3 bg-slate-800 text-slate-100 flex flex-col sm:flex-row justify-between items-center shrink-0 rounded-b-xl lg:rounded-none z-10 border-t-2 border-slate-700 gap-2">
             <div className="flex gap-4 w-full sm:w-auto justify-around sm:justify-start">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider">A. 베이스 합계</span>
                    <span className="text-base font-black text-white">{totalBaseWeight}g</span>
                    <div className="text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/50 text-[10px]">
                       6052: {(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g <span className="opacity-70">({isBaseMetallic ? '메탈 20%' : '솔리드 10%'})</span>
                    </div>
                 </div>
                 {isThreeCoatMode && (
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider">B. 펄 코트 합계</span>
                    <span className="text-base font-black text-white">{totalPearlWeight}g</span>
                    <div className="text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/50 text-[10px]">
                       6052: {(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g <span className="opacity-70">({isPearlMetallic ? '메탈 20%' : '솔리드 10%'})</span>
                    </div>
                 </div>
                 )}
             </div>
          </div>
        </div>

        {/* Right Column: 시각화 뷰어 및 지능형 카탈로그 */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-3">
          
          {/* 💡 미니 확장 뷰어 접근 패널 */}
          <div className={`bg-white border ${isBaseConfirmed ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-300'} rounded-xl p-3 shadow-xl`}>
            <h3 className="text-xs font-bold mb-2 flex justify-between items-center border-b pb-1.5">
              <span className="flex items-center"><Layers className="text-blue-600 mr-1.5" size={14} />멀티 렌더링 명암 분석</span>
              <button onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); }} className="text-[11px] px-2 py-1 bg-slate-800 text-white rounded font-bold flex items-center hover:bg-slate-700 shadow-md"><Maximize size={10} className="mr-1.5"/>확장 뷰어</button>
            </h3>
            <div className="space-y-2">
              <div><div className="flex justify-between text-[10px] font-bold text-slate-500 mb-0.5"><span>A. 베이스 코트 (Ground)</span></div>
              <div className="h-9 rounded-md border" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}></div></div>
              {isThreeCoatMode && <div><div className="flex justify-between text-[10px] font-bold text-purple-600 mb-0.5"><span>B. 펄 코트 (Mid-coat)</span></div>
              <div className="h-9 rounded-md border" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` }}></div></div>}
              <div><div className="flex justify-between text-[10px] font-bold text-blue-600 mb-0.5"><span>C. 최종 도막 광학 시뮬레이션</span></div>
              <div className="h-11 rounded-md border shadow-inner" style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` }}></div></div>
            </div>
          </div>

          {/* 💡 [수성 안료 카탈로그 원안 복구] */}
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-sm flex items-center"><BookOpen className="mr-1.5 text-blue-400" size={16}/>수성 안료 조색제 카탈로그</h3>
                <div className="relative w-36"><input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="검색 (예: 블루)" className="w-full bg-slate-800 border border-slate-700 text-white text-[11px] px-2 py-0.5 rounded-full pl-6 focus:outline-none" /><Search size={10} className="absolute left-2 top-1.5 text-slate-400" /></div>
            </div>
            
            <div className="p-3 bg-white border-b border-slate-200 shrink-0">
                <h4 className="font-bold text-slate-800 text-xs mb-1 flex items-center gap-1">💡 카탈로그 활용 가이드</h4>
                <p className="text-[11px] text-slate-500 leading-tight mb-2">각 조색제의 세부 특성을 현장 상황에 맞게 즉각적으로 파악할 수 있도록 데이터가 분류되어 있습니다. 라벨의 색상을 통해 정보의 성격을 빠르게 확인하세요.</p>
                <div className="flex flex-wrap gap-1.5 text-[9px] font-bold">
                    <span className="px-1.5 py-0.5 bg-white text-slate-600 rounded border border-slate-200 shadow-xs">일반 특성</span>
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-200 shadow-xs">색상 및 외관 변화</span>
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200 shadow-xs">용도 및 적용 컬러</span>
                    <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded border border-purple-200 shadow-xs">배합 및 혼합 비율</span>
                    <span className="px-1.5 py-0.5 bg-red-50 text-red-600 rounded border border-red-200 shadow-xs shadow-red-100">경고 및 주의사항</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 bg-slate-100">
                {/* 💡 [실시간 정렬 및 클릭 확대 적용] */}
                {sortedCatalog.map((item) => {
                    const isMetallic = item.type !== 'solid' && item.type !== 'binder';
                    const isCurrentlyUsed = activeCodes.includes(item.code);
                    return (
                        <div key={item.code} className={`flex flex-col sm:flex-row bg-white rounded-lg shadow-xs border overflow-hidden transition-all duration-300 ${isCurrentlyUsed ? 'border-l-4 border-l-blue-600 border-blue-300 bg-blue-50/20' : 'border-slate-200'}`}>
                            
                            <div className="w-full sm:w-24 h-14 sm:h-auto flex-shrink-0 relative border-b sm:border-b-0 sm:border-r border-slate-200 cursor-pointer hover:brightness-110" onClick={() => setSelectedTonerForView(item.code)} style={getCachedTexture(item.type, item.face, item.flop, isMetallic)}>
                                <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-1.5 py-0.5 rounded">{item.code}</div>
                            </div>
                            
                            <div className="p-2 flex-1 flex flex-col justify-center">
                                <div className="font-black text-slate-800 text-xs flex items-center justify-between">{item.role}{isCurrentlyUsed && <span className="text-[9px] bg-blue-600 text-white px-1.5 rounded-full font-bold shadow-sm">배합중</span>}</div>
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

      {/* 💡 [복원] Before/After 확장 뷰어 모달 */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white font-sans backdrop-blur-xl select-none">
          <header className="p-4 flex justify-between items-center bg-black/50 border-b border-slate-800 shrink-0">
            <h2 className="text-base font-bold tracking-widest text-slate-300 uppercase flex items-center"><Camera className="mr-2 text-blue-500" size={16}/> 실시간 시뮬레이션 (Before & After)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-1.5 bg-slate-800 hover:bg-red-500 rounded-full border border-slate-700"><X size={20}/></button>
          </header>
          
          <div className="w-full bg-slate-900 border-b border-slate-700 p-2 overflow-x-auto flex gap-3 items-center shrink-0 shadow-xl custom-scrollbar">
             <div className="text-[10px] font-black text-blue-400 bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-800/50 shrink-0 text-center leading-tight">배합<br/>실시간수정</div>
             {toners.filter(t => t.code).map(t => (
                <div key={t.id} className="flex items-center bg-slate-800 border border-slate-600 rounded-lg px-2.5 py-1.5 shrink-0 gap-2 shadow-inner">
                   <span className="text-xs font-bold text-slate-300">{t.code}</span>
                   <input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, false)} className="w-14 text-center bg-slate-900 text-sm font-black text-cyan-400 border border-slate-700 rounded p-0.5 focus:border-blue-500 focus:outline-none" />
                   <div className="flex gap-1">
                     <button onClick={() => quickEditWeight(t.id, -0.1, false)} className="bg-red-900/30 text-red-300 hover:bg-red-600 hover:text-white px-2 py-0.5 text-[11px] rounded font-bold border border-red-800/50">-0.1</button>
                     <button onClick={() => quickEditWeight(t.id, 0.1, false)} className="bg-blue-900/30 text-blue-300 hover:bg-blue-600 hover:text-white px-2 py-0.5 text-[11px] rounded font-bold border border-blue-800/50">+0.1</button>
                   </div>
                </div>
             ))}
          </div>

          <main ref={viewerRef} className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)} onPointerLeave={() => setIsDraggingLight(false)}>
             <div className="absolute z-50 flex items-center justify-center pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_60px_#fff] border border-white/30 animate-pulse"><Sun className="text-yellow-100" size={32} /></div>
             </div>
             
             <div className="flex-1 w-full h-[45%] md:h-[80%] rounded-[1.5rem] border border-slate-700 relative overflow-hidden shadow-2xl transition-colors duration-200" style={{ background: getInteractiveBackground(originalFinalOptics, lightPos) }}>
                <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded-lg font-bold text-xs border border-slate-600 text-slate-300 shadow-md">A. 원본 배합 (변경 전)</div>
             </div>
             
             <div className="text-slate-600 pointer-events-none shrink-0 hidden md:block"><ChevronRight size={32} /></div>
             
             <div className="flex-1 w-full h-[45%] md:h-[80%] rounded-[1.5rem] border-2 border-blue-500 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-colors duration-200" style={{ background: getInteractiveBackground(finalOptics, lightPos) }}>
                <div className="absolute top-4 left-4 bg-blue-900/90 px-3 py-1.5 rounded-lg font-bold text-xs border border-blue-400 text-white shadow-md flex items-center"><Zap size={12} className="mr-1.5 text-yellow-300 animate-pulse"/>B. 실시간 시뮬레이션 (변경 후)</div>
             </div>

             <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex bg-slate-900/90 p-2 rounded-xl border border-slate-700 gap-2">
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 50, y: 50}); }} className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">정면 (15°)</button>
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 25, y: 25}); }} className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">중면 (45°)</button>
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 5, y: 5}); }} className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">측면 (110°)</button>
             </div>
          </main>
        </div>
      )}

      {/* 안료 디테일 뷰어 모달 */}
      {selectedTonerForView && TONER_DB[selectedTonerForView] && (
        <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center backdrop-blur-xs animate-in fade-in duration-150 p-4">
           <div className="bg-white rounded-2xl w-[600px] max-w-full shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-full">
              <div className="bg-slate-900 p-4 flex justify-between items-center shrink-0">
                 <h3 className="text-white font-bold text-sm flex items-center"><Droplet className="mr-1.5 text-blue-400" size={16}/> {selectedTonerForView} 단일 안료 정밀 분석 뷰어</h3>
                 <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar">
                 <div className="text-xl font-black text-blue-700 mb-1">{TONER_DB[selectedTonerForView].role}</div>
                 <p className="text-slate-700 text-xs leading-relaxed bg-slate-50 p-3 rounded-lg border font-bold whitespace-pre-wrap break-keep">{TONER_DB[selectedTonerForView].desc}</p>
                 <div className="flex gap-4 mt-4">
                    <div className="flex-1">
                       <div className="text-[10px] font-bold text-slate-400 mb-1 text-center bg-slate-100 py-1 rounded shadow-xs">정면 (Face 15°)</div>
                       <div className="h-32 sm:h-40 rounded-lg border border-slate-300" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'face')}}></div>
                    </div>
                    <div className="flex-1">
                       <div className="text-[10px] font-bold text-slate-400 mb-1 text-center bg-slate-100 py-1 rounded shadow-xs">측면 (Flop 110°)</div>
                       <div className="h-32 sm:h-40 rounded-lg border border-slate-300" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'flop')}}></div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 text-white py-2.5 rounded-lg font-bold w-full text-xs shadow-md mt-4 hover:bg-slate-700 transition-colors">닫기</button>
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
      `}} />
    </div>
  );
}
