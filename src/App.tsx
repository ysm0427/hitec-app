import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sliders, Trash2, Plus, Minus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, BookOpen, Share2, Zap, Search, FileSpreadsheet, History, PaintBucket
} from 'lucide-react';

interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

// 💡 공식 안료 데이터베이스 (100% 상세 원본 복구)
export const TONER_DB: Record<string, TonerData> = {
  'WT 144': { role: '블루 [WT 346 완벽대체]', type: 'solid', face: '#1e3a8a', flop: '#0369a1', desc: '정면에서 선명한 적청색(Reddish-Blue) 기운을 띠며 기존 WT346을 대체하는 고농축 청색입니다.', details: [['일반 특성', '기존 WT 346 안료를 완벽하게 대체하기 위해 새롭게 개발된 고농축 청색 수성 조색제입니다.'], ['색상 및 외관 변화', '가장 큰 특징은 정면(Face)에서 맑고 선명한 적청색(Reddish-Blue)을 띠며, 측면(Flop)으로 비스듬히 볼 때 특유의 푸른빛이 발현된다는 점입니다.'], ['용도 및 적용 컬러', 'WT 346이 포함된 모든 솔리드 및 이펙트 컬러의 1:1 대체 처방 및 조색 보정용으로 사용됩니다.'], ['배합 및 혼합 비율', '기존 WT 346 대체 시 [WT346 : WT144 = 1 : 0.9]의 정밀 비율을 적용해야 동일한 착색력을 얻습니다.'], ['경고 및 주의사항', '정면의 뚜렷한 적청색 발색으로 인해 기존 도막과 미세한 색상 차이가 발생할 수 있으므로 반드시 시편 대조 후 블랜딩 도장을 권장합니다.']] },
  'WT 346': { role: '트랜스페어런트 딥 블루 [WT 144 완벽대체]', type: 'solid', face: '#0369a1', flop: '#020617', desc: '녹색 기운을 많이 띠면서도 묵직함을 가진 투명 청색 조색제입니다.', details: [['일반 특성', '녹색 기운을 많이 띠면서도 묵직함을 가진 투명 청색 조색제입니다.'], ['색상 및 외관 변화', '특히 측면(45도/110도)에서 관찰할 때 전체 청색 조색제 중 녹색빛 반사가 가장 강하게 두드러지는 고유 특징이 있습니다.'], ['용도 및 적용 컬러', '시중 대부분의 이펙트 메탈릭 청색 조색 시 뼈대가 되는 가장 기초적이고 필수적인 투명 파란색입니다.'], ['배합 및 혼합 비율', '다양한 이펙트 처방에서 메인으로 쓰이므로 배합표의 대량 투입 지시를 엄수합니다.'], ['경고 및 주의사항', '이 안료는 신형 WT 144와 상호 대체가 가능합니다. 대체 시 [WT 346 : WT 144 = 1 : 0.9] 비율을 적용하십시오.']] },
  'WT 358': { role: '스페셜 실버 [WT 400 완벽대체]', type: 'silver_fine', face: '#e2e8f0', flop: '#475569', desc: '특수한 반사 특성을 일으키는 밝은 톤의 기능성 알루미늄 조색제입니다.', details: [['일반 특성', '독자적인 금속 배열 구조를 지녀 특수한 반사 특성을 일으키는 밝은 톤의 기능성 알루미늄 조색제입니다.'], ['색상 및 외관 변화', '일반 실버와 달리 특정 각도에서 빛을 머금었다가 뿜어내는 듯한 오묘한 밝기와 독특한 플롭(Flop) 현상을 일으킵니다.'], ['용도 및 적용 컬러', '특정 수입차 OEM 특수 실버 컬러의 고유 반사각 및 이색 매칭 시 독점적으로 사용됩니다.'], ['배합 및 혼합 비율', '특수 처방 데이터베이스에 명시된 배합비대로만 적용하며 임의 비율 조정 시 실패 확률이 높습니다.'], ['경고 및 주의사항', 'WT 400 안료와 1:1로 상호 완벽 대체가 가능합니다.']] },
  'WT 400': { role: '스페셜 실버 대체용 [WT 358 완벽대체]', type: 'silver_fine', face: '#e2e8f0', flop: '#475569', desc: 'WT 358을 1:1로 완벽 대체할 수 있는 특수 밝은 톤 알루미늄입니다.', details: [['일반 특성', 'WT 358과 동일한 특수한 반사 특성을 일으키는 밝은 톤의 기능성 알루미늄 조색제입니다.'], ['용도 및 적용 컬러', '특정 수입차 OEM 특수 실버 컬러 조색 시 WT 358을 100% 동일하게 상호 대체하여 사용합니다.']] },
  'WT 154': { role: '블루 이펙트', type: 'silver_fine', face: '#3b82f6', flop: '#1e3a8a', desc: '청색으로 특수 착색된 광휘형 알루미늄 조색제입니다.', details: [['일반 특성', '청색으로 특수 착색된 광휘형 알루미늄 조색제입니다.'], ['용도 및 적용 컬러', '채도가 높고 입자감이 두드러지는 고성능 차량의 청색 계열 특수 메탈릭 컬러 조색 시 핵심적으로 사용됩니다.']] },
  'WT 188': { role: '슈퍼 딥 블랙', type: 'solid', face: '#0f172a', flop: '#020617', desc: '명도를 극단적으로 낮춘 매우 어두운 흑색 조색제입니다.', details: [['일반 특성', '명도를 극단적으로 낮춘 매우 어두운 흑색 조색제입니다.'], ['경고 및 주의사항', '과량 사용 시 도막이 탁해지거나 이펙트 안료의 반짝임을 완전히 덮어버릴 수 있으므로 주의가 필요합니다.']] },
  'WT 197': { role: '실크 실버 울트라 파인', type: 'silver_fine', face: '#e2e8f0', flop: '#64748b', desc: '특수 초미립 알루미늄 조색제입니다.', details: [['일반 특성', '입자 크기가 극도로 미세하게 분쇄된 특수 초미립 알루미늄 조색제입니다.']] },
  'WT 300': { role: '마룬', type: 'solid', face: '#991b1b', flop: '#450a0a', desc: '짙은 밤색 기운이 도는 어두운 적색 수성 조색제입니다.', details: [['일반 특성', '짙은 밤색 기운이 도는 어두운 적색(Maroon) 수성 조색제입니다.']] },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', type: 'silver_fine', face: '#d1d5db', flop: '#475569', desc: '고휘도 광휘형 초미립 알루미늄 조색제입니다.', details: [['일반 특성', '빛 반사율이 극대화된 고휘도 광휘형 초미립 알루미늄 조색제입니다.']] },
  'WT 304': { role: '매직 스파클 이펙트', type: 'xirallic', face: '#fef08a', flop: '#475569', desc: '투명한 황색 코팅이 적용된 유리 입자 조색제입니다.', details: [['일반 특성', '투명한 황색 코팅이 적용된 입자 크기가 매우 큰 유리 입자 조색제입니다.']] },
  'WT 305': { role: '울트라 화인 실버', type: 'silver_fine', face: '#cbd5e1', flop: '#334155', desc: '반짝임이 부드러운 특수 미립자 알루미늄 수성 조색제입니다.', details: [['일반 특성', '반짝임이 매우 부드러운 특수 미립자 알루미늄 수성 조색제입니다.']] },
  'WT 307': { role: '프리즈마 실버', type: 'xirallic', face: '#e2e8f0', flop: '#a855f7', desc: '빛을 분산시키는 홀로그램 특성의 조색제입니다.', details: [['일반 특성', '빛을 파장별로 분산시키는 홀로그램 특성을 지닌 특수 광학 조색제입니다.']] },
  'WT 308': { role: '브라이트 오렌지', type: 'solid', face: '#ea580c', flop: '#7c2d12', desc: '탁함이 없는 매우 맑고 선명한 주황색 조색제입니다.', details: [['일반 특성', '탁함이 전혀 없는 매우 맑고 선명한 주황색 조색제입니다.']] },
  'WT 309': { role: '브릴리언트 마젠타', type: 'solid', face: '#d946ef', flop: '#701a75', desc: '고채도의 자주색(Magenta) 조색제입니다.', details: [['일반 특성', '가장 맑고 밝은 톤을 자랑하는 고채도의 자주색 조색제입니다.']] },
  'WT 310': { role: '파우더 펄 바인더', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '단독으로 색상을 내지 않는 전용 조색제 바인더입니다.', details: [['일반 특성', '색상을 내는 안료가 포함되지 않은 특수 목적의 투명 수지입니다.']] },
  'WT 311': { role: '루비 레드', type: 'solid', face: '#ef4444', flop: '#7f1d1d', desc: '약하게 황색 기운을 띠는 투명한 적색 수성 조색제입니다.', details: [['일반 특성', '약하게 황색 기운을 띠는 맑고 투명한 적색 수성 조색제입니다.']] },
  'WT 312': { role: '매직 파이어 이펙트', type: 'pearl', face: '#ef4444', flop: '#22c55e', desc: '관찰 각도에 따라 색상이 교차하는 특수 광학 간섭 펄입니다.', details: [['일반 특성', '관찰 각도에 따라 색상이 극단적으로 교차하는 특수 광학 간섭 펄 조색제입니다.']] },
  'WT 315': { role: '엑스트라 화인 블루 펄', type: 'pearl', face: '#3b82f6', flop: '#84cc16', desc: '가장 미세한 입자 크기의 약한 적색 기운 청색 간섭 펄입니다.', details: [['일반 특성', '가장 미세한 입자 크기로 분쇄된 청색 간섭 펄 조색제입니다.']] },
  'WT 316': { role: '터콰이즈 펄', type: 'pearl', face: '#06b6d4', flop: '#10b981', desc: '중간 크기의 녹청색(터키석 색상) 간섭 펄 조색제입니다.', details: [['일반 특성', '중간 크기의 녹청색 간섭 펄 조색제입니다.']] },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', type: 'silver_fine', face: '#f8fafc', flop: '#334155', desc: '고휘도 반사 특성을 지닌 매끄러운 소립자 특수 알루미늄입니다.', details: [['일반 특성', '고휘도 반사 특성을 지닌 매끄러운 소립자 특수 알루미늄 조색제입니다.']] },
  'WT 318': { role: '브릴리언트 블루', type: 'solid', face: '#0284c7', flop: '#082f49', desc: '밝고 화사한 녹색 기운을 띠는 고광도 맑은 청색 조색제입니다.', details: [['일반 특성', '밝고 화사한 녹색 기운을 띠는 고광도 맑은 청색 조색제입니다.']] },
  'WT 320': { role: '플래티늄 펄', type: 'pearl', face: '#f1f5f9', flop: '#64748b', desc: '조색 라인업 중 입자 크기가 가장 작은 초미립 백색 펄입니다.', details: [['일반 특성', '입자 크기가 가장 작은 초미립 백색 펄 조색제입니다.']] },
  'WT 321': { role: '화이트', type: 'solid', face: '#ffffff', flop: '#e2e8f0', desc: '시스템의 가장 표준이 되는 고농축/고은폐력 표준 백색 조색제입니다.', details: [['일반 특성', '가장 뼈대가 되는 고농축/고은폐력 표준 백색 조색제입니다.']] },
  'WT 322': { role: '마이크로 화이트', type: 'solid', face: '#f8fafc', flop: '#cbd5e1', desc: '미세한 알루미늄 및 펄 입자가 혼합 설계된 특수 복합 화이트 안료입니다.', details: [['일반 특성', '알루미늄 및 펄 입자가 혼합 설계된 특수 화이트 안료입니다.']] },
  'WT 323': { role: '스페셜 블랙', type: 'solid', face: '#020617', flop: '#000000', desc: '가장 맑고 진한 시스템의 표준 흑색 수성 조색제입니다.', details: [['일반 특성', '가장 기준이 되는 범용 표준 흑색 수성 조색제입니다.']] },
  'WT 324': { role: '레디쉬 옐로우', type: 'solid', face: '#f59e0b', flop: '#9a3412', desc: '따뜻한 적색 기운이 도는 선명한 황색 조색제입니다.', details: [['일반 특성', '따뜻한 적색 기운이 도는 맑고 채도가 높은 선명한 황색 조색제입니다.']] },
  'WT 326': { role: '그리니쉬 옐로우', type: 'solid', face: '#eab308', flop: '#65a30d', desc: '차가운 녹색을 살짝 띠는 매우 맑고 투명한 황색 조색제입니다.', details: [['일반 특성', '차가운 녹색을 살짝 띠는 투명한 황색 조색제입니다.']] },
  'WT 327': { role: '옐로우', type: 'solid', face: '#fde047', flop: '#ca8a04', desc: '약하게 녹색 기운이 감도는 밝고 화사한 기본 황색 조색제입니다.', details: [['일반 특성', '약하게 녹색 기운이 감도는 밝고 화사한 기본 황색 조색제입니다.']] },
  'WT 328': { role: '오커', type: 'solid', face: '#b45309', flop: '#451a03', desc: '무겁고 탁한 흙빛 황토색의 고은폐력 조색제입니다.', details: [['일반 특성', '흙빛 황토색의 고은폐력 조색제입니다.']] },
  'WT 329': { role: '트랜스페어런트 옐로우', type: 'solid', face: '#f59e0b', flop: '#ea580c', desc: '적색이 살짝 가미된 매우 선명하고 맑은 투명 황색 조색제입니다.', details: [['일반 특성', '적색이 살짝 가미된 맑은 투명 황색 조색제입니다.']] },
  'WT 330': { role: '블러드 오렌지', type: 'solid', face: '#ea580c', flop: '#9a3412', desc: '따뜻하고 밝은 기운을 품은 선명한 주황색 수성 조색제입니다.', details: [['일반 특성', '따뜻하고 밝은 선명한 주황색 수성 조색제입니다.']] },
  'WT 331': { role: '트랜스루센트 옥사이드', type: 'solid', face: '#d97706', flop: '#451a03', desc: '산화철 성분을 기반으로 맑은 발색을 내는 반투명 황적색 조색제입니다.', details: [['일반 특성', '산화철 성분 기반의 반투명 황적색 조색제입니다.']] },
  'WT 332': { role: '마룬', type: 'solid', face: '#b91c1c', flop: '#7c2d12', desc: '탁하고 짙은 검붉은 톤을 지닌 어두운 적색 조색제입니다.', details: [['일반 특성', '탁하고 짙은 검붉은 톤을 지닌 어두운 적색 조색제입니다.']] },
  'WT 333': { role: '그라나다 레드', type: 'solid', face: '#991b1b', flop: '#450a0a', desc: '가장 표준적이며 맑고 밝은 기본 고농축 적색 조색제입니다.', details: [['일반 특성', '가장 표준적이며 맑고 밝은 기본 고농축 적색 조색제입니다.']] },
  'WT 334': { role: '옥사이드 레드', type: 'solid', face: '#7f1d1d', flop: '#450a0a', desc: '적벽돌과 유사한 묵직하고 탁한 산화철 계열의 적색 조색제입니다.', details: [['일반 특성', '적벽돌과 유사한 묵직하고 탁한 산화철 계열의 적색 조색제입니다.']] },
  'WT 335': { role: '다크 옐로우', type: 'solid', face: '#d97706', flop: '#78350f', desc: '적색 기운이 미세하게 감도는 차분하면서 밝은 솔리드 황색입니다.', details: [['일반 특성', '적색 기운이 미세하게 감도는 밝은 톤의 솔리드 황색 조색제입니다.']] },
  'WT 336': { role: '트랜스루센트 레드', type: 'solid', face: '#7c2d12', flop: '#450a0a', desc: '어두운 갈색 빛이 오묘하게 도는 반투명 적색 조색제입니다.', details: [['일반 특성', '어두운 갈색 빛이 오묘하게 도는 선명한 반투명 적색 조색제입니다.']] },
  'WT 337': { role: '레드', type: 'solid', face: '#ef4444', flop: '#991b1b', desc: '은은한 청색 기운이 도는 중간 톤의 표준 적색 조색제입니다.', details: [['일반 특성', '은은한 청색 기운이 도는 중간 톤의 고은폐력 표준 적색 조색제입니다.']] },
  'WT 338': { role: '블루이쉬 마젠타 레드', type: 'solid', face: '#d946ef', flop: '#86198f', desc: '차가운 푸른빛이 많이 도는 선명한 표준 자주색 조색제입니다.', details: [['일반 특성', '차가운 푸른빛이 많이 도는 선명한 표준 자주색 조색제입니다.']] },
  'WT 339': { role: '바이올렛', type: 'solid', face: '#8b5cf6', flop: '#4c1d95', desc: '맑고 깨끗한 표준 보라색 수성 조색제입니다.', details: [['일반 특성', '맑고 깨끗한 표준 보라색 수성 조색제입니다.']] },
  'WT 340': { role: '옐로우 마젠타 레드', type: 'solid', face: '#e879f9', flop: '#a21caf', desc: '따뜻한 황색 기운을 띠는 밝고 맑은 자주색 조색제입니다.', details: [['일반 특성', '따뜻한 황색 기운을 띠는 밝고 맑은 자주색 조색제입니다.']] },
  'WT 341': { role: '아주르 블루', type: 'solid', face: '#2563eb', flop: '#1e3a8a', desc: '채도가 가장 높은 아주 선명한 프리미엄 청색 조색제입니다.', details: [['일반 특성', '채도가 가장 높은 아주 선명한 프리미엄 청색 조색제입니다.']] },
  'WT 342': { role: '다크 바이올렛', type: 'solid', face: '#581c87', flop: '#2e1065', desc: '탁함 없이 맑은 심연의 어두움을 가진 보라색 수성 조색제입니다.', details: [['일반 특성', '탁함 없이 맑은 심연의 어두움을 가진 보라색 수성 조색제입니다.']] },
  'WT 343': { role: '블루', type: 'solid', face: '#3b82f6', flop: '#1e40af', desc: '특정 색으로 치우침이 없는 완벽한 중간톤의 고은폐력 파란색입니다.', details: [['일반 특성', '특정 색으로 치우침이 없는 완벽한 중간톤의 고은폐력 표준 파란색 조색제입니다.']] },
  'WT 344': { role: '다크 블루', type: 'solid', face: '#1d4ed8', flop: '#0f172a', desc: '명도가 가장 묵직하고 어두운 딥 블루(Deep Blue) 안료입니다.', details: [['일반 특성', '명도가 가장 묵직하고 어두운 딥 블루 안료입니다.']] },
  'WT 345': { role: '트랜스페어런트 에메랄드', type: 'solid', face: '#10b981', flop: '#064e3b', desc: '황색 기운을 강하게 띠는 에메랄드빛 투명 녹색 조색제입니다.', details: [['일반 특성', '황색 기운을 강하게 띠는 에메랄드빛 투명 녹색 조색제입니다.']] },
  'WT 347': { role: '트랜스페어런트 그린', type: 'solid', face: '#15803d', flop: '#022c22', desc: '청색 기운을 미세하게 품은 맑고 투명한 기본 녹색 조색제입니다.', details: [['일반 특성', '차가운 청색 기운을 미세하게 품은 맑고 투명한 기본 녹색 조색제입니다.']] },
  'WT 348': { role: '트랜스페어런트 아주르 블루', type: 'solid', face: '#0ea5e9', flop: '#0369a1', desc: '채도가 매우 높은 맑고 시원한 투명 하늘색 조색제입니다.', details: [['일반 특성', '채도가 매우 높은 맑고 시원한 투명 하늘색(Azure) 조색제입니다.']] },
  'WT 349': { role: '트랜스루센트 그린', type: 'solid', face: '#86efac', flop: '#064e3b', desc: '착색 농도를 대폭 낮춘 반투명 저농도 녹색 조색제입니다.', details: [['일반 특성', '미세 조색 보정을 위해 의도적으로 착색 농도를 대폭 낮춘 반투명 저농도 녹색 조색제입니다.']] },
  'WT 350': { role: '트랜스루센트 블랙', type: 'solid', face: '#525252', flop: '#451a03', desc: '정밀한 명암 조절을 위해 착색 농도를 낮춘 저농도 흑색 조색제입니다.', details: [['일반 특성', '극도로 정밀한 명암 조절을 위해 착색 농도를 낮춘 반투명 저농도 흑색 조색제입니다.']] },
  'WT 351': { role: '트랜스루센트 아주르 블루', type: 'solid', face: '#38bdf8', flop: '#075985', desc: '맑고 선명한 반투명 저농도 하늘색 조색제입니다.', details: [['일반 특성', '정밀 조색을 위해 개발된 맑고 선명한 반투명 저농도 하늘색(Azure Blue) 조색제입니다.']] },
  'WT 352': { role: '트랜스루센트 화이트', type: 'solid', face: '#f8fafc', flop: '#cbd5e1', desc: '바탕을 덮지 않는 반투명 성질을 가진 특수 백색 조색제입니다.', details: [['일반 특성', '바탕을 완전히 덮지 않는 반투명(Translucent) 성질을 가진 특수 기능성 백색 조색제입니다.']] },
  'WT 353': { role: '트랜스루센트 마젠타 레드', type: 'solid', face: '#c026d3', flop: '#4a044e', desc: '착색 농도를 낮추어 설계된 선명한 반투명 자주색 조색제입니다.', details: [['일반 특성', '미세 조색용으로 착색 농도를 낮추어 설계된 선명한 반투명 저농도 자주색 조색제입니다.']] },
  'WT 354': { role: '화인 실버', type: 'silver_fine', face: '#cbd5e1', flop: '#64748b', desc: '입자가 곱게 가공된 고운 입자 타입의 기본 알루미늄 조색제입니다.', details: [['일반 특성', '비교적 입자가 곱게(Fine) 가공된 고운 입자 타입의 기본 알루미늄 조색제입니다.']] },
  'WT 355': { role: '브릴리언트 실버 코스', type: 'silver_coarse', face: '#f8fafc', flop: '#334155', desc: '알루미늄 입자가 굵고 표면 반짝임이 극도로 강한 조색제입니다.', details: [['일반 특성', '알루미늄 입자가 굵고 표면 반짝임이 극도로 강한 고휘도 거친 알루미늄 조색제입니다.']] },
  'WT 356': { role: '미디엄 실버', type: 'silver_fine', face: '#e2e8f0', flop: '#475569', desc: '최적의 균형을 맞춘 중간 크기 입자의 최고 표준 범용 알루미늄입니다.', details: [['일반 특성', '가장 균형 잡힌 중간 크기 입자를 가진 최고 표준 범용 알루미늄 조색제입니다.']] },
  'WT 357': { role: '마이크로 실버', type: 'silver_fine', face: '#f8fafc', flop: '#64748b', desc: '알루미늄 입자를 한계치까지 미세하게 분쇄 가공한 초정밀 미립자입니다.', details: [['일반 특성', '알루미늄 입자를 한계치까지 미세하게 분쇄 가공한 초정밀 미립자 조색제입니다.']] },
  'WT 359': { role: '브라이트 실버', type: 'silver_coarse', face: '#f1f5f9', flop: '#334155', desc: '명도 톤이 한계까지 높게 세팅된 극도로 밝은 광휘형 알루미늄입니다.', details: [['일반 특성', '명도 톤이 한계까지 높게 세팅된 극도로 밝은 광휘형 알루미늄 조색제입니다.']] },
  'WT 360': { role: '코스 실버', type: 'silver_coarse', face: '#94a3b8', flop: '#1e293b', desc: '입자가 크고 굵은 표준 거친 알루미늄 조색제입니다.', details: [['일반 특성', '입자가 크고 굵은(Coarse) 표준 거친 알루미늄 조색제입니다.']] },
  'WT 361': { role: '브릴리언트 실버', type: 'silver_coarse', face: '#f1f5f9', flop: '#64748b', desc: '최적의 반짝임 밸런스를 맞춘 중간 입자 크기의 고휘도 알루미늄입니다.', details: [['일반 특성', '최적의 반짝임 밸런스를 맞춘 중간 입자 크기의 고휘도 광휘형 알루미늄 조색제입니다.']] },
  'WT 362': { role: '브릴리언트 실버 화인', type: 'silver_fine', face: '#f8fafc', flop: '#94a3b8', desc: '빛 반사 특성과 미세하고 고운 입자를 결합한 최고급 알루미늄입니다.', details: [['일반 특성', '뛰어난 빛 반사 특성과 미세하고 고운 입자 특성을 결합한 최고급 알루미늄 조색제입니다.']] },
  'WT 363': { role: '브릴리언트 골드', type: 'pearl', face: '#fbbf24', flop: '#b45309', desc: '순금처럼 맑고 선명한 채도를 자랑하는 프리미엄 황색 알루미늄 조색제입니다.', details: [['일반 특성', '순금처럼 맑고 선명한 채도를 자랑하는 프리미엄 황색 알루미늄 수성 조색제입니다.']] },
  'WT 364': { role: '화이트 펄', type: 'pearl', face: '#ffffff', flop: '#94a3b8', desc: '조색 안료 중 입자 크기가 가장 뚜렷하게 식별되는 대형 백색 마이카 펄입니다.', details: [['일반 특성', '조색 안료 중 입자 크기가 육안으로 가장 뚜렷하게 식별되는 대형 백색 마이카 펄 조색제입니다.']] },
  'WT 365': { role: '라일락 펄', type: 'pearl', face: '#a3e635', flop: '#be185d', desc: '마이카 베이스에 빛의 간섭 효과를 이용한 오묘한 자주색 간섭 펄입니다.', details: [['일반 특성', '빛의 간섭 효과를 이용한 오묘한 자주색(Lilac) 펄 조색제입니다.']] },
  'WT 366': { role: '골드 펄', type: 'pearl', face: '#facc15', flop: '#4c1d95', desc: '균일한 중간 크기의 입자로 세팅된 빛 간섭 효과를 가진 황색 펄입니다.', details: [['일반 특성', '균일한 중간 크기의 입자로 세팅된 빛 간섭 효과를 가진 황색 펄 조색제입니다.']] },
  'WT 367': { role: '화인 그린 펄', type: 'pearl', face: '#4ade80', flop: '#991b1b', desc: '표면이 매우 섬세하고 매끄럽게 설계된 작은 크기의 녹색 간섭 펄입니다.', details: [['일반 특성', '표면이 매우 섬세하고 매끄럽게 설계된 작은 크기의 녹색 간섭 펄 조색제입니다.']] },
  'WT 368': { role: '화인 화이트 펄', type: 'pearl', face: '#f8fafc', flop: '#64748b', desc: '스피스해커 라인업 중 가장 활용도가 높은 최적의 범용 백색 마이카 펄입니다.', details: [['일반 특성', '가장 활용도가 높은 범용 백색 마이카 펄 조색제입니다.']] },
  'WT 369': { role: '레드 펄', type: 'pearl', face: '#ef4444', flop: '#7f1d1d', desc: '적색으로 산화 처리되어 표면이 특수 착색된 고은폐 레드 펄입니다.', details: [['일반 특성', '적색으로 산화 처리되어 표면이 특수 착색된 고은폐 레드 펄 조색제입니다.']] },
  'WT 370': { role: '브라이트 블루 펄', type: 'pearl', face: '#0ea5e9', flop: '#be123c', desc: '입자 크기가 매우 크고 반짝임이 화려한 고광도 맑은 청색 간섭 펄입니다.', details: [['일반 특성', '입자 크기가 크고 화려하게 세팅된 고광도 맑은 청색 간섭 펄 조색제입니다.']] },
  'WT 371': { role: '브라운 펄', type: 'pearl', face: '#d97706', flop: '#451a03', desc: '표면이 주황/갈색 톤으로 특수 코팅 및 착색 처리된 브라운 펄 조색제입니다.', details: [['일반 특성', '표면이 주황/갈색 톤으로 특수 코팅 및 착색 처리된 브라운 펄 조색제입니다.']] },
  'WT 372': { role: '화인 블루 펄', type: 'pearl', face: '#3b82f6', flop: '#c026d3', desc: '입자가 부드럽게 세팅되어 붉은 기운이 도는 중간 크기의 청색 간섭 펄입니다.', details: [['일반 특성', '부드럽게 세팅되어 붉은 기운이 감도는 중간 크기의 청색 간섭 펄 조색제입니다.']] },
  'WT 373': { role: '루비 펄', type: 'pearl', face: '#dc2626', flop: '#7f1d1d', desc: '가장 쓰임새가 좋은 중간 크기의 붉은색 착색 펄 조색제입니다.', details: [['일반 특성', '가장 쓰임새가 좋은 중간 크기의 붉은색 착색 펄 조색제입니다.']] },
  'WT 374': { role: '블루 그린 펄', type: 'pearl', face: '#0d9488', flop: '#c2410c', desc: '마이카 베이스에 티타늄 코팅 처리를 하여 청녹색을 내는 간섭 펄입니다.', details: [['일반 특성', '청녹색을 내도록 유도한 오묘한 중간 크기 간섭 펄 조색제입니다.']] },
  'WT 375': { role: '그린 펄', type: 'pearl', face: '#16a34a', flop: '#b91c1c', desc: '가장 표준적인 입자 크기와 반사 특성을 보유한 기본 녹색 간섭 펄입니다.', details: [['일반 특성', '가장 표준적인 기본 녹색 간섭 펄 조색제입니다.']] },
  'WT 376': { role: '레드펄 엑스트라', type: 'pearl', face: '#ef4444', flop: '#16a34a', desc: '단순 착색이 아닌 광학적 간섭 코팅을 통한 프리미엄 적색 간섭 펄입니다.', details: [['일반 특성', '천연 마이카 표면에 티타늄 및 광학 간섭 금속막을 특수 제어 증착한 프리미엄 간섭 레드 펄 안료입니다.']] },
  'WT 377': { role: '다이아몬드 화이트', type: 'xirallic', face: '#ffffff', flop: '#64748b', desc: '최첨단 질라릭 코팅 공법이 적용된 프리미엄 초고휘도 백색 펄입니다.', details: [['일반 특성', '최상위 프리미엄 등급의 초고휘도 크리스탈 질라릭 펄입니다.']] },
  'WT 378': { role: '다이아몬드 레드', type: 'xirallic', face: '#ef4444', flop: '#7f1d1d', desc: '인공 합성 결정질인 질라릭 구조를 기반으로 한 프리미엄 적색 펄입니다.', details: [['일반 특성', '질라릭 구조를 기반으로 설계된 딥 베이스 프리미엄 적색 펄 조색제입니다.']] },
  'WT 379': { role: '다이아몬드 카퍼', type: 'xirallic', face: '#ea580c', flop: '#7c2d12', desc: '질라릭 크리스탈 코팅 기술로 완성된 초고휘도 구리빛 펄 조색제입니다.', details: [['일반 특성', '질라릭 크리스탈 코팅 기술로 완성된 초고휘도 주황색(구리빛) 프리미엄 펄 조색제입니다.']] },
  'WT 380': { role: '다이아몬드 그린', type: 'xirallic', face: '#4ade80', flop: '#166534', desc: '극강의 투명도와 고휘도 특성을 지닌 최고급 프리미엄 녹색 간섭 펄입니다.', details: [['일반 특성', '극강의 투명도와 고휘도 특성을 지닌 최고급 프리미엄 녹색 간섭 펄 조색제입니다.']] },
  'WT 381': { role: '다이아몬드 블루', type: 'xirallic', face: '#3b82f6', flop: '#1e3a8a', desc: '합성 크리스탈 질라릭 코팅 기반의 최고급 청색 간섭 펄 조색제입니다.', details: [['일반 특성', '합성 크리스탈 질라릭 코팅 기반으로 눈부시게 세팅된 최고급 청색 간섭 펄 조색제입니다.']] },
  'WT 382': { role: '다이아몬드 골드', type: 'xirallic', face: '#facc15', flop: '#a16207', desc: '빛의 굴절을 극대화시킨 프리미엄 황색 간섭 질라릭 펄 조색제입니다.', details: [['일반 특성', '빛의 굴절을 극대화시킨 프리미엄 황색 간섭 질라릭 펄 조색제입니다.']] },
  'WT 383': { role: '브릴리언트 오렌지', type: 'silver_coarse', face: '#f97316', flop: '#9a3412', desc: '강렬하고 고채도의 주황빛으로 착색된 고광택 알루미늄 조색제입니다.', details: [['일반 특성', '시선을 사로잡는 강렬하고 고채도의 주황빛으로 착색된 고광택 알루미늄 조색제입니다.']] },
  'WT 385': { role: '시스템 콤퍼넌트 A', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '수성 도료 시스템 전체의 뼈대를 구성하는 필수적인 베이스 투명 수지입니다.', details: [['일반 특성', '수성 도료 시스템 전체의 뼈대를 구성하는 필수적인 베이스 투명 수지입니다.']] },
  'WT 386': { role: '플롭 컨트롤', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '안료 입자의 눕는 각도를 제어하기 위해 고안된 명암(Flop) 물리적 조정제입니다.', details: [['일반 특성', '안료 입자의 눕는 각도를 제어하기 위해 특수 고안된 명암 물리적 조정제입니다.']] },
  'WT 387': { role: '시스템 콤퍼넌트 B', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '수용성 베이스코트 도료 전체의 시스템 점도 조절제 및 바인더입니다.', details: [['일반 특성', '안정적인 분산과 흐름성을 관리하는 시스템 점도 조절제 및 바인더입니다.']] },
  'WT 388': { role: '슈퍼 딥 블랙', type: 'solid', face: '#050505', flop: '#000000', desc: '빛 반사를 억제하여 깊이감을 극대화한 아주 어두운 고농축 흑색 조색제입니다.', details: [['일반 특성', '빛 반사를 억제하여 깊이감을 극대화한 아주 어두운 고농축 흑색 조색제입니다.']] },
  'WT 389': { role: '플래티닌 실버 화인', type: 'silver_fine', face: '#cbd5e1', flop: '#64748b', desc: '입자 크기가 정밀하게 통제된 작은 사이즈의 고휘도 광휘형 알루미늄 조색제입니다.', details: [['일반 특성', '입자 크기가 정밀하게 통제된 작은 사이즈의 고휘도 광휘형 알루미늄 수성 조색제입니다.']] },
  'WT 390': { role: '플래티닌 실버', type: 'silver_coarse', face: '#f8fafc', flop: '#334155', desc: '빛 굴절률과 명암 대비를 최고 수준으로 극대화한 고휘도 광휘형 조색제입니다.', details: [['일반 특성', '빛 굴절률과 명암 대비를 최고 수준으로 극대화한 중간 크기 입자의 고휘도 광휘형 조색제입니다.']] },
  'WT 392': { role: '매직 이펙트', type: 'pearl', face: '#22c55e', flop: '#ef4444', desc: '다층 박막 코팅 기술을 적용한 특수 광학 간섭 펄 조색제입니다.', details: [['일반 특성', '관찰 각도에 따라 색상이 마법처럼 카멜레온 변이를 일으키는 특수 광학 간섭 펄 조색제입니다.']] },
  'WT 393': { role: '라이트 옐로우', type: 'solid', face: '#fef08a', flop: '#a16207', desc: '차가운 녹색 기운을 아주 미세하게 띠면서 레몬처럼 밝고 산뜻한 연황색 조색제입니다.', details: [['일반 특성', '레몬처럼 밝고 산뜻한 톤을 가진 연황색 조색제입니다.']] },
  'WT 1051': { role: '블랜딩 1051', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '부분 보수 도장 작업 시 필수적인 전용 블랜딩(숨김) 첨가제입니다.', details: [['일반 특성', '수성 페인트 부분 보수 도장의 경계면을 자연스럽게 무너뜨리고 녹여주는 필수적인 전용 블랜딩 수지 첨가제입니다.']] },
  'WT 1500': { role: '울트라 딥 블랙', type: 'solid', face: '#000000', flop: '#000000', desc: '명도가 가장 극도로 어둡게 떨어지는 한정판 흑색 조색제입니다.', details: [['일반 특성', '명도가 가장 극도로 어둡게 떨어지는 한정판 흑색 조색제입니다. 특수 염료를 함유하고 있습니다.']] },
  'WT 455': { role: '퍼포먼스 컴포넌트', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '물성을 극적으로 안정화시키는 솔리드 전용 고성능 기능성 유동성 첨가제입니다.', details: [['일반 특성', '솔리드 전용 고성능 기능성 유동성 첨가제입니다.']] },
  'WT 3080': { role: '스페셜 애디티브', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '도막 보정 및 흐름 방지 특수 첨가제.', details: [['일반 특성', '도막 보정 및 흐름 방지 전용 특수 첨가제입니다.']] }
};

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => {
  let labelCategory = "일반 특성"; let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
  const r = data.role || ''; const d = data.desc || ''; const t = data.type || '';
  if(r.includes("블루") || r.includes("레드") || r.includes("옐로우") || r.includes("그린") || r.includes("오렌지") || r.includes("바이올렛") || r.includes("마룬")) { labelCategory = "색상/외관"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200"; } 
  else if (d.includes("금지") || d.includes("최대") || d.includes("주의") || d.includes("제한") || d.includes("경고")) { labelCategory = "경고/주의사항"; badgeColor = "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100"; } 
  else if (r.includes("실버") || r.includes("펄") || r.includes("이펙트") || d.includes("이펙트") || code === 'WT 400') { labelCategory = "이펙트 전용"; badgeColor = "bg-blue-50 text-blue-600 border-blue-200"; } 
  else if (t === "binder" || d.includes("첨가제") || d.includes("수지") || d.includes("바인더") || r.includes("콤퍼넌트")) { labelCategory = "배합/첨가제"; badgeColor = "bg-purple-50 text-purple-600 border-purple-200"; }
  return { code, ...data, labelCategory, badgeColor };
});

export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('글라스') || r.includes('대체용'); }

const textureCache: Record<string, React.CSSProperties> = {};
export const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
    if (!isMetallic || type === 'binder' || type === 'solid') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
    const key = `${type}_${faceColor}_${flopColor}`; if (textureCache[key]) return textureCache[key];
    let baseFreq = '0.5', alphaMult = '4', surfaceScale = '2', specConst = '1.2';
    if (type === 'xirallic') { baseFreq = '0.8'; alphaMult = '10'; surfaceScale = '5'; specConst = '2.0'; }
    else if (type === 'pearl') { baseFreq = '0.4'; alphaMult = '6'; surfaceScale = '3'; specConst = '1.5'; }
    else if (type === 'silver_fine') { baseFreq = '1.2'; alphaMult = '3'; surfaceScale = '1.5'; specConst = '1.0'; }
    else if (type === 'silver_coarse') { baseFreq = '0.2'; alphaMult = '8'; surfaceScale = '4'; specConst = '1.8'; }
    const safeFaceColor = faceColor || '#ffffff'; const safeFlopColor = flopColor || '#ffffff';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -1"/><feSpecularLighting surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="20" lighting-color="%23ffffff"><feDistantLight azimuth="45" elevation="60"/></feSpecularLighting></filter><rect width="100%25" height="100%25" fill="${encodeURIComponent(safeFaceColor)}"/><rect width="100%25" height="100%25" filter="url(%23f)" opacity="0.4"/></svg>`;
    const result = { backgroundColor: safeFaceColor, backgroundImage: `url("data:image/svg+xml;utf8,${svg}"), linear-gradient(135deg, ${safeFaceColor} 0%, ${safeFlopColor} 100%)`, backgroundBlendMode: 'overlay, normal' as any, boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)' };
    textureCache[key] = result; return result;
};

export const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || ''; let h = 0; let s = 0; let baseL = 50;
  if (code.includes('144')) { h = 230; s = 85; baseL = 35; } 
  else if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('적') || r.includes('마룬')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹')) { h = 140; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('황')) { h = 40; s = 80; baseL = 50; }
  else if (r.includes('오커')) { h = 30; s = 60; baseL = 40; }
  else if (r.includes('오렌지')) { h = 20; s = 90; baseL = 50; }
  else if (r.includes('바이올렛')) { h = 270; s = 80; baseL = 40; }
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

export const getMunsellDynamicDescription = (code: string, role: string, type: string, cWeight: number) => {
    let behavior = ""; let title = "";
    let weightTag = cWeight === 0 ? `[배합 대기중 : 0g]` : `[현재 투입량 : ${cWeight.toFixed(2)}g]`;

    if (type === 'binder') {
        title = "무색 투명도 제어 (N/A)"; 
        behavior = `${weightTag} 수지(Resin) 역할을 하므로 먼셀 색상(Hue)에 직접 개입하지 않습니다. 양이 늘어날수록 금속 입자의 분산 공간을 넓혀주어 정면/측면의 명암 대비(Flop Index)를 극대화합니다.`;
    } else if (role.includes('블루') || role.includes('청')) {
        title = "먼셀 5PB ~ 7.5PB 대역 제어"; 
        behavior = `${weightTag} 양이 늘어날수록 정면(Face)은 극채도의 맑은 청색(C 14+)으로 화려해지며 명도가 낮아집니다. 측면(Flop) 110도에서는 특유의 반전 톤(녹청/적청)이 짙어집니다. 점점 줄어들면 보색 간섭이 잦아들며 맑은 푸른빛 난반사 역할만 수행합니다.`;
    } else if (code.includes('376') || role.includes('레드') || role.includes('마젠타') || role.includes('적') || role.includes('마룬')) {
        title = "먼셀 5R ~ 5RP 대역 제어"; 
        behavior = `${weightTag} 양이 늘어날수록 광학 간섭이 극대화되어 정면은 피 끓는 듯한 레드(C 14+)를 뿜어내며 측면으로 갈수록 특수 코팅에 의한 보색 간섭이 피어오릅니다. 점점 줄어들면 보색 효과는 숨고 베이스 컬러에 따뜻한 붉은 윤기만 은은하게 더해집니다.`;
    } else if (role.includes('옐로우') || role.includes('황') || role.includes('오렌지') || role.includes('골드') || role.includes('오커')) {
        title = "먼셀 2.5Y ~ 7.5YR 대역 제어"; 
        behavior = `${weightTag} 양이 늘어날수록 정면에서 순금과 같은 극강의 채도(C 12+)가 발현되며 시각적인 팽창감을 제공합니다. 반면 양이 점점 줄어들면 펄 입자가 넓게 흩어지며 별빛처럼 은은하고 따뜻한 스파클링 효과를 도막에 흩뿌리게 됩니다.`;
    } else if (role.includes('그린') || role.includes('녹') || role.includes('에메랄드')) {
        title = "먼셀 5G ~ 10BG 대역 제어"; 
        behavior = `${weightTag} 양이 늘어날수록 화려한 에메랄드 펄감이 폭발하며 측면 110도 플롭에서는 붉은(Reddish) 톤으로 급격히 교차 반전(Shift)됩니다. 양이 점점 줄어들면 붉은 베이스의 채도를 억누르며 바탕을 해치지 않는 신비로운 쿨톤 미세 반사광만을 제공합니다.`;
    } else if (role.includes('블랙') || role.includes('흑')) {
        title = "먼셀 무채색 N1 ~ N3 대역 제어"; 
        behavior = `${weightTag} 양이 늘어날수록 가시광선 흡수율이 기하급수적으로 상승하여 명도(Value)를 1.0 이하의 극한의 심연으로 끌어내립니다. 점점 줄어들면 바탕색의 채도를 미세하게 꺾어(Dirty) 차분하고 무거운 딥(Deep) 톤으로 밸런스를 맞추는 역할을 합니다.`;
    } else if (role.includes('화이트') || role.includes('백')) {
        title = "먼셀 무채색 N8 ~ N9.5 대역 제어"; 
        behavior = `${weightTag} 양이 늘어날수록 정면 빛 반사율이 극대화되어 입자가 다이아몬드처럼 부서지는 화려한 발색과 고은폐 백탁 현상을 일으킵니다. 점점 줄어들면 바탕 베이스 컬러를 투과시키며 은은하고 부드러운 우유빛(Milky) 3D 깊이감을 섬세하게 연출합니다.`;
    } else if (isTonerMetallic(role)) {
        title = "명암 대비(Flop Index) 제어 안료"; 
        behavior = `${weightTag} 양이 늘어날수록 금속 입자 배열 밀도가 촘촘해지며 정면은 8.0 이상 눈부시게 밝아지고 측면은 빛을 튕겨내 3.0 이하로 극단적으로 어두워집니다. 점점 줄어들면 금속감이 은은하게 흩어지며 베이스 고유의 솔리드 톤이 함께 어우러집니다.`;
    } else {
        title = "먼셀 다중 스펙트럼 제어"; 
        behavior = `${weightTag} 투입량 증감에 따라 명도와 채도 변화 곡선이 다이내믹하게 움직이며, 주변 안료들과의 시너지 비율에 따라 정면광과 측면광의 톤 밸런스를 입체적으로 변환시킵니다.`;
    }

    return (
        <div className="mt-2 mb-4 bg-slate-900 rounded-xl p-4 border border-slate-700 shadow-xl relative overflow-hidden">
            <h4 className="text-yellow-400 font-black text-xs mb-3 flex items-center"><Zap size={14} className="mr-1.5"/> 2026 Munsell Color Dynamics</h4>
            <div className="flex gap-4 items-center bg-slate-800 p-3 rounded-lg border border-slate-600 shadow-inner">
                <div className="relative w-14 h-14 shrink-0 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.8)] border-2 border-slate-500 animate-[spin_20s_linear_infinite]" 
                     style={{ background: 'conic-gradient(from 90deg, #ef4444, #f59e0b, #eab308, #22c55e, #06b6d4, #3b82f6, #8b5cf6, #d946ef, #ef4444)' }}>
                    <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ background: `linear-gradient(135deg, ${TONER_DB[code].face}, ${TONER_DB[code].flop})` }}></div>
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider">{title}</span>
                        <span className="text-base font-black text-white">{cWeight.toFixed(2)} <span className="text-xs font-normal text-slate-400">g</span></span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-950 overflow-hidden relative border border-slate-700">
                        <div className="absolute top-0 left-0 h-full transition-all duration-500 ease-out" 
                             style={{ width: `${Math.min(100, (cWeight / 60) * 100)}%`, background: `linear-gradient(90deg, ${TONER_DB[code].flop}, ${TONER_DB[code].face})`, boxShadow: `0 0 10px ${TONER_DB[code].face}`}}>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-3 p-3 bg-blue-950/40 rounded-lg border border-blue-900/50">
                <p className="text-[12px] text-blue-100 leading-relaxed break-keep font-medium"><span className="text-blue-400 font-bold tracking-tight mr-1">✨ 시뮬레이션 브리핑:</span>{behavior}</p>
            </div>
        </div>
    );
};

export const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code && TONER_DB[t.code]);
  const sumW = colorToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0; let rGreen=0; let rRed=0; let rYellow=0; let rViolet=0;
  let wSilver=0; let wWhite=0; let wBlack=0; let wPearl=0; let wBinder=0; let interferenceColor: string | null = null;

  colorToners.forEach(t => {
    const w = safeNum(parseFloat(t.adjustedWeight)); if (w <= 0) return;
    const role = TONER_DB[t.code]?.role || ''; const code = t.code || ''; let strength = 1.0;
    if (code.includes('341') || code.includes('300') || code.includes('338')) strength = 2.5;

    if (role.includes('컴포넌트') || role.includes('바인더') || role.includes('애디티브') || ['WT 385', 'WT 387', 'WT 386', 'WT 400', 'WT 3080', 'WT 310'].some(c => code.includes(c.replace('WT ', '')))) wBinder += w;
    else if (role.includes('블랙') || code.includes('323') || code.includes('388') || code.includes('188') || code.includes('1500')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄') || code.includes('362') || code.includes('357') || code.includes('197') || code.includes('303') || code.includes('305') || code.includes('307') || code.includes('400')) wSilver += w;
    else if (role.includes('화이트') || code.includes('321') || code.includes('328') || code.includes('322')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('스파클') || code.includes('304') || code.includes('377') || code.includes('381')) {
      wPearl += w;
      if (role.includes('블루') || code.includes('381')) { interferenceColor = 'blue'; rBlue += w * 0.15; }
      else if (role.includes('레드') || role.includes('마젠타')) { interferenceColor = 'red'; rRed += w * 0.15; }
      else if (role.includes('그린') || code.includes('380')) { interferenceColor = 'green'; rGreen += w * 0.15; }
      else if (role.includes('골드') || code.includes('304') || code.includes('382')) { interferenceColor = 'yellow'; rYellow += w * 0.15; }
      else if (role.includes('화이트') || code.includes('377')) interferenceColor = 'white';
    } 
    else if (code.includes('144')) { rBlue += w * 2.5; rRed += (w * 2.5) * 0.4; } 
    else if (role.includes('블루') || role.includes('청')) { rBlue += w * strength; rGreen += (w * strength) * 0.5; }
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

  let baseL = (pWhite * 96) + (pSilver * 65) + (pPearl * 85); if (effectiveW === 0 && wBinder > 0) baseL = 90; 
  let blackImpact = Math.pow(pBlack, 0.45) * 60; if (pWhite > 0.6) blackImpact = blackImpact * 0.15; 
  const colorImpactL = Math.pow(pColor, 0.5) * 30; baseL = Math.max(4, baseL - blackImpact - colorImpactL);
  let l15 = baseL + (Math.pow(pSilver + pPearl, 0.6) * 45); 
  let l110 = Math.max(2, baseL - 30 - (pSilver * 40) - (pBlack * 20));
  if (pWhite > 0.6) { l110 = Math.max(83, baseL - 8); l15 = Math.min(99, baseL + (pPearl > 0 ? 10 : 3)); }

  let x = rRed + (rYellow * 0.5) - (rGreen * 0.5) - rBlue - (rViolet * 0.5);
  let y = (rYellow * 0.866) + (rGreen * 0.866) - (rBlue * 0.866) - (rViolet * 0.866);
  let hue = Math.atan2(y, x) * (180 / Math.PI); if (hue < 0) hue += 360;
  
  let sat = colorWeight > 0 ? Math.min(100, Math.pow((colorWeight / (colorWeight + wWhite + wSilver + Math.max(wBlack * 2, 0))), 0.4) * 150) : 0;
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
    face: { h: safeNum(Math.round(faceHue)), s: safeNum(Math.round(faceSat)), l: safeNum(Math.round(Math.min(99, Math.max(5, l15)))) },
    mid:  { h: safeNum(Math.round(hue)), s: safeNum(Math.round(sat)), l: safeNum(Math.round(Math.min(98, Math.max(5, baseL)))) },
    flop: { h: safeNum(Math.round(wPearl > 0 ? flopHue : hue)), s: safeNum(Math.round(flopSat)), l: safeNum(Math.round(Math.min(98, Math.max(2, l110)))) },
    isMetallic: (wSilver > 0 || wPearl > 0)
  };
};

export const packToners = (tonerList: any[]) => { return tonerList.filter((t: any) => t.code).map((t: any) => { const c = t.code.replace('WT ', '').trim(); const w = t.adjustedWeight || ''; return `${c}_${w}`; }).join('*'); };
export const unpackToners = (str: string) => { if (!str) return []; return str.split('*').map((t, i) => { const [c, w] = t.split('_'); return { id: `restored_${Date.now()}_${i}`, code: c ? `WT ${c}` : '', adjustedWeight: w || '', history: [], memo: '' }; }); };

const MUNSELL_WHEEL_COLORS = [
    { name: '빨강', symbol: 'R', hex: '#E60012' },
    { name: '다홍', symbol: 'yR', hex: '#EB6100' },
    { name: '주황', symbol: 'YR', hex: '#F39800' },
    { name: '귤색', symbol: 'rY', hex: '#FCC800' },
    { name: '노랑', symbol: 'Y', hex: '#FFF100' },
    { name: '노랑연두', symbol: 'gY', hex: '#CFDB00' },
    { name: '연두', symbol: 'GY', hex: '#8FC31F' },
    { name: '풀색', symbol: 'yG', hex: '#22AC38' },
    { name: '녹색', symbol: 'G', hex: '#009944' },
    { name: '초록', symbol: 'bG', hex: '#009B6B' },
    { name: '청록', symbol: 'BG', hex: '#009E96' },
    { name: '바다색', symbol: 'gB', hex: '#00A0C1' },
    { name: '파랑', symbol: 'B', hex: '#00A0E9' },
    { name: '감청', symbol: 'pB', hex: '#0086D1' },
    { name: '남색', symbol: 'PB', hex: '#0068B7' },
    { name: '남보라', symbol: 'bP', hex: '#00479D' },
    { name: '보라', symbol: 'P', hex: '#1D2088' },
    { name: '붉은보라', symbol: 'rP', hex: '#601986' },
    { name: '자주', symbol: 'RP', hex: '#920783' },
    { name: '연지', symbol: 'pR', hex: '#BE0081' },
];

const MIXING_DATA: Record<string, any> = {
    'R': { c1: '빨강 (R)', h1: '#ff0000', r1: 100 },
    'yR': { c1: '빨강 (R)', h1: '#ff0000', r1: 75, c2: '노랑 (Y)', h2: '#ffff00', r2: 25 },
    'YR': { c1: '빨강 (R)', h1: '#ff0000', r1: 50, c2: '노랑 (Y)', h2: '#ffff00', r2: 50 },
    'rY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 75, c2: '빨강 (R)', h2: '#ff0000', r2: 25 },
    'Y': { c1: '노랑 (Y)', h1: '#ffff00', r1: 100 },
    'gY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 75, c2: '녹색 (G)', h2: '#009900', r2: 25 },
    'GY': { c1: '노랑 (Y)', h1: '#ffff00', r1: 50, c2: '녹색 (G)', h2: '#009900', r2: 50 },
    'yG': { c1: '녹색 (G)', h1: '#009900', r1: 75, c2: '노랑 (Y)', h2: '#ffff00', r2: 25 },
    'G': { c1: '녹색 (G)', h1: '#009900', r1: 100 },
    'bG': { c1: '녹색 (G)', h1: '#009900', r1: 75, c2: '파랑 (B)', h2: '#0000ff', r2: 25 },
    'BG': { c1: '녹색 (G)', h1: '#009900', r1: 50, c2: '파랑 (B)', h2: '#0000ff', r2: 50 },
    'gB': { c1: '파랑 (B)', h1: '#0000ff', r1: 75, c2: '녹색 (G)', h2: '#009900', r2: 25 },
    'B': { c1: '파랑 (B)', h1: '#0000ff', r1: 100 },
    'pB': { c1: '파랑 (B)', h1: '#0000ff', r1: 75, c2: '보라 (P)', h2: '#700070', r2: 25 },
    'PB': { c1: '파랑 (B)', h1: '#0000ff', r1: 50, c2: '보라 (P)', h2: '#700070', r2: 50 },
    'bP': { c1: '보라 (P)', h1: '#700070', r1: 75, c2: '파랑 (B)', h2: '#0000ff', r2: 25 },
    'P': { c1: '보라 (P)', h1: '#700070', r1: 100 },
    'rP': { c1: '보라 (P)', h1: '#700070', r1: 75, c2: '빨강 (R)', h2: '#ff0000', r2: 25 },
    'RP': { c1: '보라 (P)', h1: '#700070', r1: 50, c2: '빨강 (R)', h2: '#ff0000', r2: 50 },
    'pR': { c1: '빨강 (R)', h1: '#ff0000', r1: 75, c2: '보라 (P)', h2: '#700070', r2: 25 },
};

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return { x: centerX + (radius * Math.cos(angleInRadians)), y: centerY + (radius * Math.sin(angleInRadians)) };
};

const describeArc = (x: number, y: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) => {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", startOuter.x, startOuter.y, "A", outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y, "A", innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y, "Z"
  ].join(" ");
};
export default function App() {export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: 'WT 318', adjustedWeight: "0.3", history: [], memo: "" }, { id: `b_next`, code: 'WT 144', adjustedWeight: "4.0", history: [], memo: "" }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "" }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState('UG4'); 
  const [vehicleNumber, setVehicleNumber] = useState('9'); 
  const [carModel, setCarModel] = useState('UN'); 
  const [jobDescription, setJobDescription] = useState(''); 
  const [specialNotes, setSpecialNotes] = useState('');
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00"); 
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00"); 
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);
  
  const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null); 
  // 💡 [핵심 해결] 까만 화면(TransferTab) 상태 변수를 아예 삭제하고, 오직 팝업(restoredViewData)만 씁니다!
  const [restoredViewData, setRestoredViewData] = useState<any>(null); 
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null); 
  const [isScanning, setIsScanning] = useState(false);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 }); 
  const [isDraggingLight, setIsDraggingLight] = useState(false); 

  const cameraInputRef = useRef<HTMLInputElement>(null); 
  const viewerRef = useRef<HTMLElement>(null); 
  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null); 
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [finalOptics, setFinalOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false }); 
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");
  const [renderMode, setRenderMode] = useState<'shape' | 'car'>('car');
  const [viewAngle, setViewAngle] = useState({ rotY: 15, rotX: 5, scale: 1.1 });
  const [tonerMemos, setTonerMemos] = useState<Record<string, string>>({});
  const [selectedWheelIndex, setSelectedWheelIndex] = useState<number | null>(null);

  const handleWheelClick = (index: number) => { setSelectedWheelIndex(index); };

  const tonersRef = useRef<any[]>([]); const pearlTonersRef = useRef<any[]>([]); const isThreeCoatModeRef = useRef<boolean>(true);

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  const sortedCatalog = [...catalogData].sort((a, b) => { 
      const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); 
      if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; 
  }).filter(item => item.code.includes(catalogSearch.toUpperCase()) || item.role.includes(catalogSearch));

  useEffect(() => { document.title = "조색 Pro"; }, []);

  // 💡 [핵심 복구] 엑셀에서 넘어온 링크를 읽어 무조건 "팝업창"으로 띄우는 완벽한 디코더
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search); 
        const d = urlParams.get('d'); 
        const ori = window.location.origin;
        if (!ori.includes('google') && !ori.includes('gemini') && !ori.includes('null')) localStorage.setItem('hitec_clean_domain', ori);
        
        let loadedFromUrl = false;

        if (d) {
            try {
                let parsedData = null;
                
                // 1. 아주 옛날 방식 해독
                if (d.includes('%7B') || d.includes('{')) {
                    parsedData = JSON.parse(decodeURIComponent(d));
                } 
                // 2. 중간 및 최신 방식(Base64) 해독
                else {
                    let decodedStr = d;
                    if (!d.includes('|') && !d.includes('%')) {
                        try { decodedStr = decodeURIComponent(escape(atob(d))); } catch(e) { decodedStr = atob(d); }
                    } else {
                        decodedStr = decodeURIComponent(d.replace(/%7C/g, '|'));
                    }
                    
                    const parts = decodedStr.split('|');
                    if(parts.length >= 6) {
                        parsedData = {
                            v: parts[0] || '',
                            m: parts[1] || '',
                            c: parts[2] || '',
                            j: parts[3] || '',
                            n: parts[4] || '',
                            b: unpackToners(parts[5]),
                            p: unpackToners(parts[6]),
                            t: parts[7] === '1'
                        };
                    }
                }

                if (parsedData) {
                    // 🚨 이제 까만 화면으로 튕기지 않고 무조건 팝업 데이터 변수에 꽂아 넣습니다!
                    setRestoredViewData(parsedData);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    loadedFromUrl = true;
                }
            } catch (e) { 
                console.error("URL 파싱 실패", e); 
                alert("과거 데이터 링크를 해독할 수 없습니다.");
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }

        if (!loadedFromUrl) {
            const savedBase = localStorage.getItem('hitec_base'); const savedPearl = localStorage.getItem('hitec_pearl'); const savedCode = localStorage.getItem('hitec_code'); const savedMode = localStorage.getItem('hitec_mode'); const savedVehicle = localStorage.getItem('hitec_vehicle'); const savedCarModel = localStorage.getItem('hitec_carmodel'); const savedJob = localStorage.getItem('hitec_job'); const savedNotes = localStorage.getItem('hitec_notes'); const savedMemos = localStorage.getItem('hitec_toner_memos');
            if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl)); if (savedCode) setTargetColorCode(savedCode); if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode)); if (savedVehicle) setVehicleNumber(savedVehicle); if (savedCarModel) setCarModel(savedCarModel); if (savedJob) setJobDescription(savedJob); if (savedNotes) setSpecialNotes(savedNotes); if (savedMemos) setTonerMemos(JSON.parse(savedMemos));
        }
        setIsLoaded(true); 
    }
  }, []);

  // 원래 화면 백업 로직
  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search); if (urlParams.get('d')) return;
      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_toner_memos', JSON.stringify(tonerMemos));
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, tonerMemos, isLoaded]);

  useEffect(() => { tonersRef.current = toners; pearlTonersRef.current = pearlToners; isThreeCoatModeRef.current = isThreeCoatMode; }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2)); setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners; 
    setFinalOptics(getOptics(activeToners));
    const checkMetallic = (list: any[]) => list.some(t => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== ''; });
    setIsBaseMetallic(checkMetallic(toners)); setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (focusTarget) {
      let attempts = 0; 
      const interval = setInterval(() => {
        const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
        if (el) { 
            el.focus(); 
            setTimeout(() => { if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30);
            clearInterval(interval); 
            setFocusTarget(null); 
        }
        attempts++; 
        if (attempts > 30) { clearInterval(interval); setFocusTarget(null); }
      }, 20); 
      return () => clearInterval(interval);
    }
  }, [focusTarget, toners, pearlToners]);

  const handleClearAll = () => { setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "" }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "" }]); setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setSelectedTonerForView(null); };

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const formattedCode = newCode.toUpperCase().trim(); const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(toner => {
      if (toner.id === id) {
        let finalCode = formattedCode; const numMatch = formattedCode.match(/\d+/);
        if (numMatch && numMatch[0].length >= 3) { const testCode = `WT ${numMatch[0]}`; if (TONER_DB[testCode]) { finalCode = testCode; setFocusTarget({ id: id, type: 'weight' }); } }
        return { ...toner, code: finalCode };
      }
      return toner;
    }));
  };

  const handleWeightInputChange = (id: string, rawValue: string, isPearl = false) => {
    let val = rawValue.replace(/[^0-9.]/g, ''); const parts = val.split('.'); if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join(''); 
    if (val === '') val = ''; else if (val.length > 1 && val.startsWith('0') && val[1] !== '.') val = val.replace(/^0+/, ''); else if (val.startsWith('.')) val = '0' + val; 
    if (isPearl) setPearlToners(pearlToners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t)); else setToners(toners.map(t => t.id === id ? { ...t, adjustedWeight: val } : t));
  };

  const handleWeightBlur = (id: string, value: string, isPearl = false) => {
    if (!value) return; const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if (t.id === id) { const currentHistory = t.history || []; if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== value) return { ...t, history: [...currentHistory, value] }; }
      return t;
    }));
  };

  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
      if (e.key === 'Enter') { 
          e.preventDefault(); 
          const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; 
          const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "" }; 
          if (isPearl) setPearlToners([...pearlToners, newToner]); 
          else setToners([...toners, newToner]); 
          setFocusTarget({ id: newId, type: 'code' }); 
      }
  };
  
  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };
  
  const addToner = (isPearl = false) => { 
      const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; 
      const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "" }; 
      if (isPearl) setPearlToners([...pearlToners, newToner]); 
      else setToners([...toners, newToner]); 
      setFocusTarget({ id: newId, type: 'code' }); 
  };

  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if(t.id === id) {
         let current = parseFloat(t.adjustedWeight) || 0; 
         let newVal = Math.max(0, current + delta);
         let strVal = String(Number(Math.round(newVal * 100000) / 100000));
         const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== strVal) ? [...currentHistory, strVal] : currentHistory;
         return { ...t, adjustedWeight: strVal, history: nextHistory };
      }
      return t;
    }));
  };

  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율 상수를 입력하세요."); return; }
    const scale = (valStr: string) => { 
        const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; 
        const calcVal = isMultiply ? (val * 100000 * factor) / 100000 : (val * 100000) / (factor * 100000);
        return String(Number(Math.round(calcVal * 100000) / 100000)); 
    };
    const applyScale = (list: any[]) => list.map(t => {
        if (!t.adjustedWeight) return t; const newVal = scale(t.adjustedWeight);
        const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory;
        return { ...t, adjustedWeight: newVal, history: nextHistory };
    });
    setToners(applyScale(toners)); setPearlToners(applyScale(pearlToners));
  };

  const copyToExcel = () => {
    const baseResin = (parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1); const baseStr = `${totalBaseWeight} (수지 ${baseResin})`; let pearlStr = "해당없음";
    if (isThreeCoatMode) { const pearlResin = (parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1); pearlStr = `${totalPearlWeight} (수지 ${pearlResin})`; }
    const baseDetails = toners.filter(t => t.code).map(t => `${t.code}: ${t.adjustedWeight || '0'}`).join(', '); const pearlDetails = isThreeCoatMode ? pearlToners.filter(t => t.code).map(t => `${t.code}: ${t.adjustedWeight || '0'}`).join(', ') : '해당없음'; const detailStr = isThreeCoatMode ? `[베이스] ${baseDetails} / [펄] ${pearlDetails}` : baseDetails;
    let currentOrigin = localStorage.getItem('hitec_clean_domain'); if (!currentOrigin || currentOrigin.includes('google') || currentOrigin.includes('gemini')) currentOrigin = window.location.origin; 
    
    // Base64 압축 (주소 잘림 방지)
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0'].join('|');
    const safeUrlString = btoa(unescape(encodeURIComponent(payloadStr))); 
    const shareUrl = `${currentOrigin}${window.location.pathname}?d=${safeUrlString}`;
    
    const rowData = ["", vehicleNumber || '미입력', carModel || '미입력', targetColorCode || '미지정', jobDescription || '미입력', specialNotes || '', baseStr, pearlStr, detailStr, shareUrl].join('\t');
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(rowData).catch(err => console.error(err));
    else { const textarea = document.createElement('textarea'); textarea.value = rowData; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); document.body.removeChild(textarea); }
  };

  const shareToKakao = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}g`).join('\n');
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}g`).join('\n');
    const text = `[PERMAHYD HI-TEC 배합 지시서]\n================================\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 차종: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트 (Ground)]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 6052 수지제원: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트 (Mid-coat)]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 코트 합계: ${totalPearlWeight}g\n▶ 6052 수지제원: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 혼합 총량: ${totalFinalWeight}g\n================================`;
    if (typeof navigator !== 'undefined' && navigator.share) navigator.share({ title: 'HI-TEC 조색 데이터 인계', text: text }).catch(console.error);
    else { alert("상세 배합 스펙이 클립보드에 복사되었습니다. 카카오톡 창에 붙여넣기 하십시오.\n\n" + text); if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(text); }
  };

  const render3DView = (optics: any, mode: 'shape'|'car') => {
      const getBg = () => {
          if (!optics || !optics.face || !optics.mid || !optics.flop) return '#f8fafc'; 
          const h = isNaN(optics.mid.h) ? 0 : Math.round(optics.mid.h); const s = isNaN(optics.mid.s) ? 0 : Math.round(optics.mid.s); const lx = isNaN(optics.mid.l) ? 80 : Math.round(optics.mid.l);
          const hFlop = isNaN(optics.flop.h) ? h : Math.round(optics.flop.h); const sFlop = isNaN(optics.flop.s) ? s : Math.round(optics.flop.s); const lFlop = isNaN(optics.flop.l) ? Math.max(0, lx-20) : Math.round(optics.flop.l);
          return `linear-gradient(105deg, hsl(${h}, ${s}%, ${lx}%) 0%, hsl(${hFlop}, ${sFlop}%, ${lFlop}%) 100%)`;
      };
      const getLightReflection = () => `linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.8) 25%, rgba(255,255,255,0.95) 30%, transparent 35%)`;

      return (
          <div className="w-full h-full perspective-[1000px] flex items-center justify-center relative overflow-hidden bg-transparent">
              <div className="w-3/4 h-3/4 transition-transform duration-500 transform-gpu relative" style={{ transform: `rotateY(${viewAngle.rotY}deg) rotateX(${viewAngle.rotX}deg) scale(${viewAngle.scale})` }}>
                  {mode === 'shape' ? (
                      <div className="absolute inset-0 rounded-[40%_60%_60%_40%/50%_50%_50%_50%] shadow-[inset_15px_15px_40px_rgba(255,255,255,0.6),inset_-15px_-20px_40px_rgba(0,0,0,0.5),0_20px_40px_rgba(0,0,0,0.3)]" style={{ background: getBg() }}>
                          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay rounded-[inherit]"></div>
                          {optics?.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge rounded-[inherit] opacity-60 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>}
                          <div className="absolute inset-0 rounded-[inherit] mix-blend-overlay opacity-90 transition-opacity duration-300" style={{ background: getLightReflection() }}></div>
                      </div>
                  ) : (
                      <div className="w-full h-full relative car-mask shadow-xl" style={{ background: getBg() }}>
                          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                          {optics?.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge opacity-60 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>}
                          <div className="absolute inset-0 mix-blend-overlay opacity-90 transition-opacity duration-300" style={{ background: getLightReflection() }}></div>
                          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.6)_0%,transparent_30%,rgba(0,0,0,0.5)_100%)] mix-blend-multiply"></div>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-[220px] lg:pb-[150px]">
      <header className="bg-slate-900 flex justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">PERMAHYD HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 2026 PRO</span></h1>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
            <div className="flex items-center justify-between"><h2 className="text-sm font-bold text-slate-800 flex items-center"><Sliders className="text-blue-600 mr-2" size={16} />공식 배합 워크 시트</h2></div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="차량번호" className="bg-white border p-2 rounded text-xs font-bold w-1/3" />
                <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="차종" className="bg-white border p-2 rounded text-xs font-bold w-1/3" />
                <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드" className="bg-white border p-2 rounded text-xs font-bold w-1/3 uppercase" />
              </div>
              <input type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="작업내용" className="bg-white border p-2 rounded text-xs font-bold w-full" />
              
              <input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="특이사항 및 스펙 메모 (직접 입력)" className="bg-yellow-50 border-yellow-400 border p-2.5 rounded text-sm font-bold w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              
              <div className="flex w-full gap-2 mt-1">
                <button onClick={copyToExcel} className="flex-1 bg-green-600 text-white p-2.5 rounded text-xs font-black flex items-center justify-center hover:bg-green-700 transition-colors"><FileSpreadsheet size={14} className="mr-1"/> 엑셀 연동 복사</button>
                <button onClick={shareToKakao} className="flex-1 bg-[#FEE500] text-slate-900 p-2.5 rounded text-xs font-black flex items-center justify-center hover:bg-[#E5C100] transition-colors"><Share2 size={14} className="mr-1"/> 모바일 인계</button>
                <button onClick={handleClearAll} className="bg-red-50 text-red-600 border border-red-200 px-3 rounded flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-white">
            <div className="mb-4 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2"><Beaker size={14} className="text-indigo-600" /><span className="text-xs font-bold text-indigo-800">현장 실시간 용량 배율 변환기</span></div>
                <div className="flex items-center gap-1.5">
                    <input type="text" inputMode="decimal" value={scaleFactor} onChange={(e) => setScaleFactor(e.target.value.replace(/[^0-9.]/g, ''))} className="w-10 text-center text-xs font-black text-indigo-700 border rounded py-1" />
                    <span className="text-[11px] font-bold text-indigo-400 mr-1">배</span>
                    <button onClick={() => handleScaleAll(true)} className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm hover:bg-indigo-700 transition-colors">× 곱하기</button>
                    <button onClick={() => handleScaleAll(false)} className="bg-white border border-indigo-300 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded shadow-sm hover:bg-indigo-50 transition-colors">÷ 나누기</button>
                </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-black text-slate-400 flex justify-between border-b pb-1"><span>▼ 베이스 원색 리스트 (Ground Coat)</span></div>
              {toners.map((toner) => {
                const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
                const isEffect = info.type !== 'solid' && info.type !== 'binder';
                return (
                  <div key={toner.id} className="flex flex-col bg-slate-50 hover:bg-blue-50/50 p-2.5 mb-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                      <div className="flex flex-col flex-1 w-full">
                          <div className="flex items-center gap-2 mb-1">
                              <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                                   <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                                   <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                              </div>
                              <input 
                                  ref={el => { codeRefs.current[toner.id] = el; }} 
                                  value={toner.code} 
                                  onChange={e => handleCodeChange(toner.id, e.target.value, false)} 
                                  className="w-20 text-sm font-black uppercase border border-slate-300 rounded p-1 focus:border-blue-500 focus:outline-none shadow-inner" 
                                  placeholder="코드" 
                              />
                              <span className="font-bold text-blue-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                          </div>
                          
                          {info.details && info.details.length > 0 ? (
                              <div className="flex flex-col gap-0.5 mt-1 ml-[64px]">
                                  {info.details.slice(0, 2).map((d: any, idx: number) => (
                                      <div key={idx} className="flex items-start gap-1.5">
                                          <span className="shrink-0 text-[10px] font-bold text-slate-500 leading-none mt-0.5">[{d[0]}]</span>
                                          <span className="text-[11px] text-slate-600 leading-tight break-keep">{d[1]}</span>
                                      </div>
                                  ))}
                              </div>
                          ) : <p className="text-[11px] text-slate-500 leading-tight break-keep ml-[64px]">{info.desc}</p>}

                          {toner.history && toner.history.length > 0 && (
                              <div className="flex items-center gap-1.5 mt-2 ml-[64px] text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                  <span className="font-bold">이력 ({toner.history.length}회):</span>
                                  <div className="flex gap-1 flex-wrap">
                                      {toner.history.map((hVal: string, hIdx: number) => (
                                          <button key={hIdx} onClick={() => quickEditWeight(toner.id, parseFloat(hVal) - parseFloat(toner.adjustedWeight||'0'), false)} className="hover:text-blue-600 hover:font-bold transition-colors">{hIdx + 1}({hVal}g)</button>
                                      ))}
                                  </div>
                              </div>
                          )}
                      </div>

                      <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                         <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="px-1.5 py-0.5 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                         <input 
                             ref={el => { weightRefs.current[toner.id] = el; }} 
                             inputMode="decimal" 
                             value={toner.adjustedWeight} 
                             onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} 
                             onBlur={e => handleWeightBlur(toner.id, e.target.value, false)} 
                             onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                             className="w-16 text-right text-base font-black text-blue-600 focus:outline-none clean-number-input mx-1" 
                             placeholder="0.0" 
                         />
                         <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="px-1.5 py-0.5 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                         <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => removeToner(toner.id, false)} className="ml-1"><Trash2 size={16} className="text-slate-300 hover:text-red-500 transition-colors"/></button>
                      </div>
                    </div>
                  </div>
                )
              })}
              <button onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold text-xs flex justify-center items-center hover:bg-blue-50 hover:text-blue-500 hover:border-blue-400 transition-colors"><Plus size={12} className="mr-1"/>베이스 안료 추가</button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                <label className="flex items-center cursor-pointer bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-purple-50 transition-colors">
                  <span className="mr-2 text-xs font-black text-purple-700">3Coat (펄 추가) 켜기</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                    <div className={`w-10 h-5 rounded-full shadow-inner transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full shadow transition-transform ${isThreeCoatMode ? 'transform translate-x-5' : ''}`}></div>
                  </div>
                </label>
            </div>

            {isThreeCoatMode && (
              <div className="pt-4 mt-4 border-t border-purple-200 space-y-2 pb-8">
                <div className="text-xs font-black text-purple-700 flex justify-between border-b pb-1"><span>▼ 펄 코트 (Mid Coat)</span></div>
                {pearlToners.map((toner) => {
                  const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '' };
                  const isEffect = info.type !== 'solid' && info.type !== 'binder';
                  return (
                    <div key={toner.id} className="flex flex-col bg-purple-50 p-2.5 mb-1.5 rounded-xl border border-purple-200 shadow-sm transition-colors hover:bg-purple-100/50">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center w-full">
                        <div className="flex flex-col flex-1 w-full pl-2">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                                     <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                                     <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                                </div>
                                <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, true)} inputMode="numeric" pattern="[0-9]*" className="w-24 text-sm font-black uppercase border border-purple-200 rounded px-1.5 py-0.5 text-purple-800 shadow-inner focus:outline-none focus:border-purple-500" placeholder="코드" />
                                <span className="font-bold text-purple-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                            </div>
                            
                            {info.details && info.details.length > 0 ? (
                                <div className="flex flex-col gap-0.5 mt-1 ml-[64px]">
                                    {info.details.slice(0, 2).map((d: any, idx: number) => (
                                        <div key={idx} className="flex items-start gap-1.5">
                                            <span className="shrink-0 text-[10px] font-bold text-purple-500 leading-none mt-0.5">[{d[0]}]</span>
                                            <span className="text-[11px] text-slate-600 leading-tight break-keep">{d[1]}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-[11px] text-slate-500 leading-tight break-keep ml-[64px]">{info.desc}</p>}

                            {toner.history && toner.history.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2 ml-[64px] text-[10px] text-purple-500 bg-purple-100 px-2 py-1 rounded">
                                    <span className="font-bold">이력 ({toner.history.length}회):</span>
                                    <div className="flex gap-1 flex-wrap">
                                        {toner.history.map((hVal: string, hIdx: number) => (
                                            <button key={hIdx} onClick={() => quickEditWeight(toner.id, parseFloat(hVal) - parseFloat(toner.adjustedWeight||'0'), true)} className="hover:text-purple-700 hover:font-bold transition-colors">{hIdx + 1}({hVal}g)</button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                           <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="px-1.5 py-0.5 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                           <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} onBlur={e => handleWeightBlur(toner.id, e.target.value, true)} onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} className="w-16 text-right text-base font-black text-purple-600 focus:outline-none clean-number-input mx-1" placeholder="0.0" />
                           <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="px-1.5 py-0.5 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                           <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                           <button onClick={() => removeToner(toner.id, true)} className="ml-1"><Trash2 size={16} className="text-purple-300 hover:text-red-500 transition-colors"/></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => addToner(true)} className="w-full py-2.5 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 rounded-md text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-2 shadow-sm"><Plus size={16} /><span>펄 조색제 추가</span></button>
              </div>
            )}
          </div>
        </div>

        {/* 우측 컬럼: 3D 그래픽 엔진 & 카탈로그 */}
        <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-3 shrink-0 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-black mb-2 flex justify-between items-center text-slate-800">
                <span className="flex items-center"><Sun size={14} className="mr-1 text-orange-500"/> STUDIO 3D 광학 변환 시뮬레이터</span>
                <button onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); }} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"><Maximize size={10} className="mr-1"/>먼셀 컬러 믹싱 랩</button>
              </h3>
              
              <div className="h-44 rounded-xl overflow-hidden shadow-inner border border-slate-300 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center cursor-pointer relative group" onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); }}>
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
                  
                  <div className="relative z-10 w-full h-full">
                      {render3DView(finalOptics, renderMode)}
                  </div>
                  
                  <div className="absolute top-3 left-3 bg-white/90 text-slate-800 text-[10px] font-black px-2.5 py-1 rounded shadow backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center">
                      <Maximize size={12} className="mr-1 text-blue-600"/> 화면을 클릭하여 스튜디오 크게 열기
                  </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-sm flex items-center"><BookOpen className="mr-2 text-blue-400" size={18}/>지능형 안료 도감</h3>
                <span className="text-[10px] text-slate-500 hidden sm:block mx-auto flex-1 text-center font-bold">전체 안료 데이터 열람 영역</span>
                <div className="relative w-40"><input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="검색 (예: 블루)" className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-full pl-8 focus:outline-none focus:border-blue-500 transition-colors" /><Search size={14} className="absolute left-2.5 top-1.5 text-slate-400" /></div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-slate-100">
                {sortedCatalog.map((item) => {
                    const isMetallic = item.type !== 'solid' && item.type !== 'binder';
                    const isCurrentlyUsed = activeCodes.includes(item.code);
                    
                    const getBadgeClass = (title: string) => {
                        if(title.includes("일반")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
                        if(title.includes("외관")) return "bg-blue-50 text-blue-700 border-blue-200";
                        if(title.includes("용도")) return "bg-purple-50 text-purple-700 border-purple-200";
                        if(title.includes("혼합")) return "bg-amber-50 text-amber-700 border-amber-200";
                        if(title.includes("경고") || title.includes("주의")) return "bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-100";
                        return "bg-slate-50 text-slate-700 border-slate-200";
                    };

                    return (
                        <div key={item.code} className={`flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isCurrentlyUsed ? 'border-2 border-blue-500 shadow-md transform scale-[1.01]' : 'border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer'}`} onClick={() => setSelectedTonerForView(item.code)}>
                            <div className="h-12 w-full relative transition-all border-b border-slate-200" style={getCachedTexture(item.type, item.face, item.flop, isMetallic)}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-1.5 left-3 text-white text-sm font-black drop-shadow-md">{item.code} <span className="text-[10px] font-normal opacity-90 ml-1">{item.role}</span></div>
                                {isCurrentlyUsed && <div className="absolute top-1.5 right-2 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow">배합 중</div>}
                            </div>
                            <div className="p-3 flex flex-col gap-1.5">
                                {item.details?.map((d: any, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2">
                                        <span className={`shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border leading-none mt-0.5 ${getBadgeClass(d[0])}`}>{d[0]}</span>
                                        <span className="text-[11px] text-slate-700 leading-snug break-keep">{d[1]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-3 sm:p-4 bg-slate-950 text-slate-100 flex flex-col lg:flex-row justify-between items-center z-[500] border-t-4 border-indigo-900 shadow-[0_-12px_45px_rgba(0,0,0,0.85)] gap-4 backdrop-blur-md">
          <div className="flex w-full lg:w-auto gap-4 flex-col sm:flex-row justify-between lg:justify-start">
              <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
                 <span className="text-[10px] text-slate-400 font-black tracking-widest flex items-center uppercase"><Layers size={11} className="mr-1 text-blue-400"/> A. 베이스 코트 실시간 중량</span>
                 <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-800 shadow-inner text-xs">
                     <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 font-bold">순수 안료</span><span className="font-black text-white text-sm">{totalBaseWeight}g</span></div>
                     <span className="text-slate-600 font-black text-sm">+</span>
                     <div className="flex flex-col items-center"><span className="text-[9px] text-blue-400 font-bold">6052 수지 ({isBaseMetallic ? '20%' : '10%'})</span><span className="font-black text-blue-400 text-sm">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g</span></div>
                     <span className="text-slate-600 font-black text-sm">=</span>
                     <div className="flex flex-col items-center bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/50"><span className="text-[9px] text-emerald-400 font-bold">총 중량</span><span className="font-black text-emerald-400 text-base">{(parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)}g</span></div>
                 </div>
              </div>
              
              {isThreeCoatMode && (
              <div className="flex flex-col gap-1 flex-1 min-w-[240px]">
                 <span className="text-[10px] text-slate-400 font-black tracking-widest flex items-center uppercase"><Zap size={11} className="mr-1 text-purple-400"/> B. 펄 코트 실시간 중량</span>
                 <div className="flex items-center justify-between bg-slate-900/90 px-3 py-2.5 rounded-xl border border-slate-800 shadow-inner text-xs">
                     <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 font-bold">순수 안료</span><span className="font-black text-white text-sm">{totalPearlWeight}g</span></div>
                     <span className="text-slate-600 font-black text-sm">+</span>
                     <div className="flex flex-col items-center"><span className="text-[9px] text-purple-400 font-bold">6052 수지 ({isPearlMetallic ? '20%' : '10%'})</span><span className="font-black text-purple-400 text-sm">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g</span></div>
                     <span className="text-slate-600 font-black text-sm">=</span>
                     <div className="flex flex-col items-center bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/50"><span className="text-[9px] text-emerald-400 font-bold">총 중량</span><span className="font-black text-emerald-400 text-base">{(parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)}g</span></div>
                 </div>
              </div>
              )}
          </div>

          <div className="flex flex-col items-center justify-center shrink-0 bg-gradient-to-br from-amber-950/50 to-yellow-900/20 border-2 border-yellow-500/60 px-6 py-2 rounded-xl w-full lg:w-auto shadow-[0_0_25px_rgba(234,179,8,0.2)]">
             <span className="text-[11px] text-yellow-500 font-black tracking-widest flex items-center uppercase"><Beaker size={13} className="mr-1"/> ✨ 최종 도막 혼합 총량</span>
             <span className="text-3xl font-black text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                 {(
                     parseFloat((parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)) + 
                     (isThreeCoatMode ? parseFloat((parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)) : 0)
                 ).toFixed(1)}<span className="text-lg font-bold text-yellow-600 ml-0.5">g</span>
             </span>
          </div>
      </div>

      {/* 안료 분석 모달 */}
      {selectedTonerForView && TONER_DB[selectedTonerForView] && (
        <div className="fixed inset-0 bg-slate-900/90 z-[700] flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
           <div className="bg-white rounded-2xl w-[650px] max-w-full shadow-2xl overflow-hidden border flex flex-col max-h-[90vh]">
              <div className="bg-slate-900 p-3.5 flex justify-between items-center text-white shrink-0 border-b-4 border-blue-600">
                 <h3 className="text-sm font-black flex items-center"><Droplet size={16} className="mr-1.5 text-blue-400"/> {selectedTonerForView} 정밀 광학 & 먼셀 분석 보드</h3>
                 <button onClick={() => setSelectedTonerForView(null)} className="hover:text-red-400 transition-colors bg-slate-800 p-1 rounded-full"><X size={18}/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1 bg-slate-50">
                 <div className="text-xl font-black text-slate-800 mb-3">{TONER_DB[selectedTonerForView].role}</div>
                 
                 {(()=>{
                     const activeT = [...toners, ...pearlToners].find(t => t.code === selectedTonerForView);
                     const cWeight = activeT ? (parseFloat(activeT.adjustedWeight) || 0) : 0;
                     return getMunsellDynamicDescription(selectedTonerForView, TONER_DB[selectedTonerForView].role, TONER_DB[selectedTonerForView].type, cWeight);
                 })()}

                 <div className="flex flex-col gap-2 bg-white p-4 rounded-lg border border-slate-200 mb-4 shadow-sm">
                    {TONER_DB[selectedTonerForView].details?.map((d: any, idx: number) => {
                        const getBadgeClass = (title: string) => {
                            if(title.includes("일반")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
                            if(title.includes("외관")) return "bg-blue-50 text-blue-700 border-blue-200";
                            if(title.includes("용도")) return "bg-purple-50 text-purple-700 border-purple-200";
                            if(title.includes("혼합")) return "bg-amber-50 text-amber-700 border-amber-200";
                            if(title.includes("경고") || title.includes("주의")) return "bg-red-50 text-red-700 border-red-200 shadow-sm shadow-red-100";
                            return "bg-slate-50 text-slate-700 border-slate-200";
                        };
                        return (
                        <div key={idx} className="flex items-start gap-2.5">
                            <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold rounded border ${getBadgeClass(d[0])}`}>{d[0]}</span>
                            <span className="text-xs text-slate-700 leading-relaxed break-keep mt-0.5">{d[1]}</span>
                        </div>
                    )})}
                 </div>

                 <div className="mb-4">
                     <div className="text-[10px] font-black text-slate-500 mb-1 flex items-center"><Search size={10} className="mr-1"/> 수동 특이사항 메모 (자동 저장)</div>
                     <textarea
                         value={tonerMemos[selectedTonerForView] || ''}
                         onChange={(e) => setTonerMemos(prev => ({ ...prev, [selectedTonerForView]: e.target.value }))}
                         placeholder={`여기에 [${selectedTonerForView}] 안료에 대한 현장 작업 메모나 특이사항을 직접 기록하세요...\n(※ 작성하신 메모는 안료별로 영구 저장됩니다.)`}
                         className="w-full bg-yellow-50 border border-yellow-300 p-3 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 shadow-inner resize-none h-20"
                     />
                 </div>

                 <div className="flex gap-4 mt-2">
                    <div className="flex-1">
                       <div className="text-[10px] font-black text-center text-white bg-slate-800 py-1.5 rounded-t-lg tracking-widest">정면 반사광 (Face 15°)</div>
                       <div className="h-32 rounded-b-lg border border-slate-300 relative overflow-hidden shadow-inner" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'face')}}>
                           {isTonerMetallic(TONER_DB[selectedTonerForView].role) && <div className="metallic-flake opacity-50"></div>}
                       </div>
                    </div>
                    <div className="flex-1">
                       <div className="text-[10px] font-black text-center text-white bg-slate-800 py-1.5 rounded-t-lg tracking-widest">측면 음영 (Flop 110°)</div>
                       <div className="h-32 rounded-b-lg border border-slate-300 relative overflow-hidden shadow-inner" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'flop')}}>
                           {isTonerMetallic(TONER_DB[selectedTonerForView].role) && <div className="metallic-flake opacity-30"></div>}
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTonerForView(null)} className="bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black w-full text-sm mt-5 shadow-md transition-colors">분석창 닫기</button>
              </div>
           </div>
        </div>
      )}

      {/* 💡 [복구 완료] 과거 데이터 기록을 띄워주는 읽기 전용 모달창 팝업 */}
      {restoredViewData && (
        <div className="fixed inset-0 bg-slate-950/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            {/* Header */}
            <div className="p-4 flex justify-between items-center border-b border-slate-700/50 bg-[#1e293b]">
              <h3 className="text-white font-bold flex items-center gap-2">
                <History size={18} className="text-blue-400" /> 과거 구성에 따른 구성
              </h3>
              <button onClick={() => setRestoredViewData(null)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors">
                <X size={16} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto custom-scrollbar max-h-[70vh] bg-[#0f172a] space-y-6">
              {/* Info Card */}
              <div className="grid grid-cols-2 gap-4 bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">차량번호</div>
                  <div className="text-sm font-bold text-white">{restoredViewData.v || '미입력'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">차종</div>
                  <div className="text-sm font-bold text-white">{restoredViewData.m || '미입력'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">컬러코드</div>
                  <div className="text-sm font-bold text-blue-400 uppercase">{restoredViewData.c || '미지정'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">작업 내용</div>
                  <div className="text-sm font-bold text-white leading-snug">{restoredViewData.j || '미입력'}</div>
                </div>
              </div>

              {/* Ground Coat */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Layers size={14} /> 베이스 코트 (Ground Coat)
                </h4>
                <div className="space-y-2">
                  {restoredViewData.b?.filter((t: any) => t.code).map((t: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-[#1e293b] p-3.5 rounded-xl border border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-sm">무게 {t.code.replace('WT ', '')}</span>
                        <span className="text-xs text-slate-500">{TONER_DB[t.code]?.role || ''}</span>
                      </div>
                      <span className="text-blue-400 font-bold">{t.adjustedWeight}g</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mid Coat */}
              {restoredViewData.t && restoredViewData.p?.filter((t: any) => t.code).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-purple-400 mb-3 flex items-center gap-2 mt-2">
                    <Zap size={14} /> 펄코트 (Mid Coat)
                  </h4>
                  <div className="space-y-2">
                    {restoredViewData.p.filter((t: any) => t.code).map((t: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-[#1e293b] p-3.5 rounded-xl border border-purple-900/30">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-bold text-sm">무게 {t.code.replace('WT ', '')}</span>
                          <span className="text-xs text-slate-500">{TONER_DB[t.code]?.role || ''}</span>
                        </div>
                        <span className="text-purple-400 font-bold">{t.adjustedWeight}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Button */}
            <div className="p-4 bg-[#1e293b] border-t border-slate-700/50">
              <button 
                onClick={() => setRestoredViewData(null)} 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
              >
                닫기 및 진행중인 작업으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💡 1:1:1:1 최적화된 다중 색상 혼합 랩 스튜디오 (4분할 레이아웃 & 보색 화살표 강화) */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/98 z-[800] flex flex-col text-white font-sans select-none animate-in fade-in overflow-y-auto custom-scrollbar">
          <header className="p-4 flex justify-between items-center bg-black/60 border-b border-slate-800 shrink-0 sticky top-0 z-40 backdrop-blur-md">
            <h2 className="text-base font-black tracking-widest text-slate-300 uppercase flex items-center"><Beaker className="mr-2 text-indigo-500"/> 먼셀 컬러 믹싱 스튜디오 (Munsell Mixing Lab)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-full border border-slate-700 transition-colors"><X size={18}/></button>
          </header>
          
          <main className="flex-1 p-6 md:p-10 flex flex-col items-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950">
             
             {/* 💡 4분할 (2x2) 완벽 대칭 레이아웃 적용 */}
             <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12 mb-8 items-center">
                 
                 {/* 1사분면 (좌측 상단): 먼셀 20 색상환 */}
                 <div className="flex flex-col items-center relative w-full h-full justify-center">
                     <h3 className="text-lg font-black text-white mb-6 flex items-center bg-slate-900 px-6 py-2 rounded-full border border-slate-700 shadow-lg"><Sun className="mr-2 text-yellow-400" size={20}/> 먼셀 20 색상환 (Munsell Wheel)</h3>
                     <div className="relative flex justify-center items-center w-[360px] h-[360px] md:w-[420px] md:h-[420px]">
                        <svg className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]" viewBox="0 0 400 400">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                                </marker>
                            </defs>

                            {/* 20 분할 아크 그리기 */}
                            {MUNSELL_WHEEL_COLORS.map((color, index) => {
                                const startAngle = index * 18;
                                const endAngle = (index + 1) * 18 - 1; 
                                const pathData = describeArc(200, 200, 100, 170, startAngle, endAngle); 
                                const isSelected = selectedWheelIndex === index;
                                
                                return (
                                    <path 
                                        key={index} 
                                        d={pathData} 
                                        fill={color.hex} 
                                        stroke={isSelected ? "#ffffff" : "transparent"} 
                                        strokeWidth={isSelected ? "3" : "0"}
                                        className={`cursor-pointer transition-all duration-300 hover:opacity-80 ${isSelected ? 'z-10 relative' : ''}`}
                                        onClick={() => handleWheelClick(index)}
                                        style={{ transformOrigin: '200px 200px', transform: isSelected ? 'scale(1.05)' : 'scale(1)' }}
                                    />
                                );
                            })}

                            {/* 텍스트 라벨 배치 */}
                            {MUNSELL_WHEEL_COLORS.map((color, index) => {
                                const midAngle = index * 18 + 8.5; 
                                const pos = polarToCartesian(200, 200, 185, midAngle); 
                                let textRotation = midAngle;
                                if (midAngle > 90 && midAngle < 270) textRotation += 180;

                                return (
                                    <g key={`label_${index}`} transform={`rotate(${textRotation}, ${pos.x}, ${pos.y})`}>
                                        <text x={pos.x} y={pos.y - 4} fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle" className="pointer-events-none drop-shadow-md">{color.name}</text>
                                        <text x={pos.x} y={pos.y + 6} fill="#64748b" fontSize="8" fontWeight="normal" textAnchor="middle" className="pointer-events-none">({color.symbol})</text>
                                    </g>
                                );
                            })}

                            {/* 중앙 원 장식 */}
                            <circle cx="200" cy="200" r="98" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                            <text x="200" y="195" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="tracking-widest">MUNSELL</text>
                            <text x="200" y="215" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle" dominantBaseline="middle">표준 색상환</text>

                            {/* 💡 요청하신 보색 화살표 (중앙 원 위로 렌더링되며 빨간색으로 강조) */}
                            {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] && (
                                <line 
                                    x1={polarToCartesian(200, 200, 80, selectedWheelIndex * 18 + 8.5).x} 
                                    y1={polarToCartesian(200, 200, 80, selectedWheelIndex * 18 + 8.5).y} 
                                    x2={polarToCartesian(200, 200, 80, ((selectedWheelIndex + 10) % 20) * 18 + 8.5).x} 
                                    y2={polarToCartesian(200, 200, 80, ((selectedWheelIndex + 10) % 20) * 18 + 8.5).y} 
                                    stroke="#ef4444" 
                                    strokeWidth="3.5" 
                                    markerEnd="url(#arrowhead)" 
                                    className="drop-shadow-[0_0_12px_rgba(239,68,68,1)] pointer-events-none"
                                />
                            )}
                        </svg>
                     </div>
                 </div>

                 {/* 2사분면 (우측 상단): RGB 혼합 */}
                 <div className="flex flex-col items-center w-full h-full justify-center">
                    <div className="bg-[#111111] rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col items-center w-full max-w-[420px] mx-auto h-full min-h-[360px] justify-center">
                        <h4 className="text-xl font-black text-white mb-8 tracking-widest flex items-center"><BookOpen className="mr-2 text-blue-400" size={20}/>RGB <span className="text-xs text-slate-500 ml-2 font-normal">Additive Color (빛의 혼합)</span></h4>
                        <div className="w-56 h-56 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" style={{ backgroundColor: 'transparent' }}>
                                <circle cx="75" cy="75" r="55" fill="#0000FF" style={{ mixBlendMode: 'screen' }} />
                                <circle cx="125" cy="75" r="55" fill="#FF0000" style={{ mixBlendMode: 'screen' }} />
                                <circle cx="100" cy="120" r="55" fill="#00FF00" style={{ mixBlendMode: 'screen' }} />
                                
                                <g stroke="#ffffff" strokeWidth="1" strokeOpacity="0.5">
                                    <line x1="75" y1="75" x2="30" y2="40" />
                                    <line x1="125" y1="75" x2="170" y2="40" />
                                    <line x1="100" y1="120" x2="100" y2="175" />
                                    <line x1="100" y1="55" x2="100" y2="25" /> 
                                    <line x1="75" y1="105" x2="30" y2="130" /> 
                                    <line x1="125" y1="105" x2="170" y2="130" /> 
                                    <line x1="100" y1="90" x2="150" y2="90" /> 
                                </g>
                                <g fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" className="drop-shadow-md">
                                    <text x="25" y="35">Blue</text>
                                    <text x="175" y="35">Red</text>
                                    <text x="100" y="185">Green</text>
                                    <text x="100" y="20" fill="#FF00FF">Magenta</text>
                                    <text x="25" y="140" fill="#00FFFF">Cyan</text>
                                    <text x="175" y="140" fill="#FFFF00">Yellow</text>
                                    <rect x="155" y="82" width="30" height="14" fill="#ffffff" rx="2" />
                                    <text x="170" y="93" fill="#000000">White</text>
                                </g>
                            </svg>
                        </div>
                    </div>
                 </div>

                 {/* 3사분면 (좌측 하단): 조색 가이드 결과 */}
                 {/* 💡 [에러 해결] 데이터를 불러오지 못하더라도 앱 전체가 죽지 않게 렌더링 방어 추가 */}
                 <div className="flex flex-col items-center w-full h-full justify-center">
                    {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] ? (
                        <div className="bg-slate-800 p-8 rounded-3xl border border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.3)] w-full max-w-[420px] mx-auto min-h-[360px] flex flex-col justify-center text-center animate-in fade-in zoom-in duration-300">
                            <h4 className="text-xl font-black text-white mb-8 flex items-center justify-center gap-3">
                                <span className="w-6 h-6 rounded-full shadow-md border border-slate-400" style={{backgroundColor: MUNSELL_WHEEL_COLORS[selectedWheelIndex].hex}}></span>
                                {MUNSELL_WHEEL_COLORS[selectedWheelIndex].name} ({MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol}) 배합 규격
                            </h4>
                            <div className="flex justify-center items-center gap-6 bg-slate-900 py-8 px-4 rounded-xl border border-slate-700">
                                {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol] ? (
                                    <>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h1}}></div>
                                            <span className="text-slate-300 font-bold text-sm">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c1}</span>
                                            <span className="text-white font-black text-3xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r1}%</span>
                                        </div>
                                        {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2 && (
                                            <>
                                                <span className="text-slate-600 font-black text-2xl">+</span>
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-14 h-14 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h2}}></div>
                                                    <span className="text-slate-300 font-bold text-sm">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2}</span>
                                                    <span className="text-white font-black text-3xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r2}%</span>
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-red-400 text-sm font-bold">배합 데이터를 불러올 수 없습니다.</div>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-6 font-medium bg-slate-900/50 py-3 rounded-lg">* 기술 보고서 기준의 단일 원색 정밀 조색 비율입니다.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 border-dashed w-full max-w-[420px] mx-auto min-h-[360px] flex flex-col items-center justify-center gap-4 text-center text-slate-500">
                            <Sun className="text-slate-600 mb-2" size={40} />
                            <p className="text-base font-bold text-slate-400">색상환에서 컬러를 클릭하세요.</p>
                            <p className="text-sm">선택된 색상의 원색 조색 배율이<br/>이곳에 표시됩니다.</p>
                        </div>
                    )}
                 </div>

                 {/* 4사분면 (우측 하단): CMYK 혼합 */}
                 <div className="flex flex-col items-center w-full h-full justify-center">
                    <div className="bg-[#f8f9fa] rounded-3xl p-8 border border-slate-300 shadow-2xl flex flex-col items-center w-full max-w-[420px] mx-auto h-full min-h-[360px] justify-center">
                        <h4 className="text-xl font-black text-slate-900 mb-8 tracking-widest flex items-center"><BookOpen className="mr-2 text-pink-500" size={20}/>CMYK <span className="text-xs text-slate-500 ml-2 font-normal">Subtractive Color (물감의 혼합)</span></h4>
                        <div className="w-56 h-56 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl" style={{ backgroundColor: 'transparent' }}>
                                <circle cx="75" cy="75" r="55" fill="#00FFFF" style={{ mixBlendMode: 'multiply' }} />
                                <circle cx="125" cy="75" r="55" fill="#FF00FF" style={{ mixBlendMode: 'multiply' }} />
                                <circle cx="100" cy="120" r="55" fill="#FFFF00" style={{ mixBlendMode: 'multiply' }} />
                                
                                <g stroke="#000000" strokeWidth="1" strokeOpacity="0.5">
                                    <line x1="75" y1="75" x2="30" y2="40" />
                                    <line x1="125" y1="75" x2="170" y2="40" />
                                    <line x1="100" y1="120" x2="100" y2="175" />
                                    <line x1="100" y1="55" x2="100" y2="25" /> 
                                    <line x1="75" y1="105" x2="30" y2="130" /> 
                                    <line x1="125" y1="105" x2="170" y2="130" /> 
                                    <line x1="100" y1="90" x2="150" y2="90" /> 
                                </g>
                                <g fill="#000000" fontSize="10" fontWeight="bold" textAnchor="middle">
                                    <text x="25" y="35">Cyan</text>
                                    <text x="175" y="35">Magenta</text>
                                    <text x="100" y="185">Yellow</text>
                                    <text x="100" y="20" fill="#0000FF">Blue</text>
                                    <text x="25" y="140" fill="#008000">Green</text>
                                    <text x="175" y="140" fill="#FF0000">Red</text>
                                    <rect x="155" y="82" width="30" height="14" fill="#000000" rx="2" />
                                    <text x="170" y="93" fill="#ffffff">Black</text>
                                </g>
                            </svg>
                        </div>
                    </div>
                 </div>

             </div>

             {/* 하단 닫기 버튼 */}
             <div className="mt-4 pb-12 w-full flex justify-center">
                <button onClick={() => setIsConfiguratorOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 font-bold py-4 px-16 rounded-full transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center gap-2 text-lg">
                    <X size={24} /> 믹싱 스튜디오 닫기
                </button>
             </div>
          </main>
        </div>
      )}
    </div>
  );
}
