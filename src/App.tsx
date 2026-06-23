import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sliders, Trash2, Plus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, BookOpen, Share2, Zap, Search, FileSpreadsheet, History,
  Info, Award, Terminal
} from 'lucide-react';

interface TonerData { role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][]; }

// 💡 공식 안료 데이터베이스 (상호대체 완벽 크로스 표기 및 적청 렌더링 적용)
const TONER_DB: Record<string, TonerData> = {
  'WT 144':{role:'블루 [WT 346 완벽대체]',type:'solid',face:'#1e3a8a',flop:'#0369a1',desc:'정면에서 선명한 적청색(Reddish-Blue) 기운을 띠며 기존 WT346을 대체하는 고농축 청색입니다. (대체 안료: WT 346)',details:[['일반 특성','기존 WT 346 안료를 완벽하게 대체하기 위해 새롭게 개발된 고농축 청색 수성 조색제입니다.'],['색상 및 외관 변화','가장 큰 특징은 정면(Face)에서 맑고 선명한 적청색(Reddish-Blue)을 띠며, 측면(Flop)으로 비스듬히 볼 때 특유의 푸른빛이 발현된다는 점입니다. (기존 346의 녹청 기운과 뚜렷한 차이)'],['용도 및 적용 컬러','WT 346이 포함된 모든 솔리드 및 이펙트 컬러의 1:1 대체 처방 및 조색 보정용으로 사용됩니다.'],['배합 및 혼합 비율','기존 WT 346 대체 시 [WT346 : WT144 = 1 : 0.9]의 정밀 비율을 적용해야 동일한 착색력을 얻습니다.'],['경고 및 주의사항','정면의 뚜렷한 적청색 발색으로 인해 기존 도막과 미세한 색상 차이가 발생할 수 있으므로, 반드시 시편 대조 후 블랜딩 도장을 권장합니다.']]},
  'WT 346':{role:'트랜스페어런트 딥 블루 [WT 144 완벽대체]',type:'solid',face:'#0369a1',flop:'#020617',desc:'녹색 기운을 많이 띠면서도 묵직함을 가진 투명 청색 조색제입니다. (대체 안료: WT 144)',details:[['일반 특성','녹색 기운을 많이 띠면서도 묵직함을 가진 투명 청색 조색제입니다.'],['색상 및 외관 변화','특히 측면(45도/110도)에서 관찰할 때 전체 청색 조색제 중 녹색빛 반사가 가장 강하게 두드러지는 고유 특징이 있습니다.'],['경고 및 주의사항','이 안료는 신형 WT 144와 상호 대체가 가능합니다. 대체 시 [WT 346 : WT 144 = 1 : 0.9] 비율을 적용하십시오.']]},
  'WT 358':{role:'스페셜 실버 [WT 400 완벽대체]',type:'silver_fine',face:'#e2e8f0',flop:'#475569',desc:'특수한 반사 특성을 일으키는 밝은 톤의 기능성 알루미늄 조색제입니다. (대체 안료: WT 400)',details:[['일반 특성','독자적인 금속 배열 구조를 지녀 특수한 반사 특성을 일으키는 밝은 톤의 기능성 알루미늄 조색제입니다.'],['용도 및 적용 컬러','특정 수입차 OEM 특수 실버 컬러의 고유 반사각 매칭 시 주로 사용됩니다.'],['경고 및 주의사항','동일한 특성을 지닌 WT 400 안료와 1:1로 상호 완벽 대체가 가능합니다. 재고 상황에 따라 교차 사용하십시오.']]},
  'WT 400':{role:'스페셜 실버 대체용 [WT 358 완벽대체]',type:'silver_fine',face:'#e2e8f0',flop:'#475569',desc:'WT 358을 1:1로 완벽 대체할 수 있는 특수 밝은 톤 알루미늄입니다. (대체 안료: WT 358)',details:[['일반 특성','WT 358과 동일한 특수한 반사 특성을 일으키는 밝은 톤의 기능성 알루미늄 조색제입니다.'],['용도 및 적용 컬러','특정 수입차 OEM 특수 실버 컬러 조색 시 WT 358을 100% 동일하게 상호 대체하여 사용합니다.'],['경고 및 주의사항','기존 WT 358과 상호 대체 가능하므로 재고 상황에 맞게 헷갈리지 않도록 교차 사용하십시오.']]},
  'WT 154':{role:'블루 이펙트',type:'silver_fine',face:'#3b82f6',flop:'#1e3a8a',desc:'청색으로 특수 착색된 광휘형 알루미늄 조색제입니다.',details:[['일반 특성','청색으로 특수 착색된 광휘형 알루미늄 조색제입니다.']]},
  'WT 188':{role:'슈퍼 딥 블랙',type:'solid',face:'#0f172a',flop:'#020617',desc:'명도를 극단적으로 낮춘 매우 어두운 흑색 조색제입니다.',details:[['일반 특성','명도를 극단적으로 낮춘 매우 어두운 흑색 조색제입니다.']]},
  'WT 197':{role:'실크 실버 울트라 파인',type:'silver_fine',face:'#e2e8f0',flop:'#64748b',desc:'특수 초미립 알루미늄 조색제입니다.',details:[['일반 특성','입자 크기가 극도로 미세하게 분쇄된 특수 초미립 알루미늄 조색제입니다.']]},
  'WT 300':{role:'마룬',type:'solid',face:'#991b1b',flop:'#450a0a',desc:'짙은 밤색 기운이 도는 어두운 적색 수성 조색제입니다.',details:[['일반 특성','짙은 밤색 기운이 도는 어두운 적색(Maroon) 수성 조색제입니다.']]},
  'WT 303':{role:'플래틴 실버 엑스트라 화인',type:'silver_fine',face:'#d1d5db',flop:'#475569',desc:'고휘도 광휘형 초미립 알루미늄 조색제입니다.',details:[['일반 특성','빛 반사율이 극대화된 고휘도(빛 반사가 강한) 광휘형 초미립 알루미늄 조색제입니다.']]},
  'WT 304':{role:'매직 스파클 이펙트',type:'xirallic',face:'#fef08a',flop:'#475569',desc:'투명한 황색 코팅이 적용된 유리 입자 조색제입니다.',details:[['일반 특성','투명한 황색 코팅이 적용된 입자 크기가 매우 큰 유리 입자(Glass Flake) 조색제입니다.']]},
  'WT 305':{role:'울트라 화인 실버',type:'silver_fine',face:'#cbd5e1',flop:'#334155',desc:'반짝임이 부드러운 특수 미립자 알루미늄 수성 조색제입니다.',details:[['일반 특성','반짝임이 매우 부드러운 특수 미립자 알루미늄 수성 조색제입니다.']]},
  'WT 307':{role:'프리즈마 실버',type:'xirallic',face:'#e2e8f0',flop:'#a855f7',desc:'빛을 분산시키는 홀로그램 특성의 조색제입니다.',details:[['일반 특성','빛을 파장별로 분산시키는 홀로그램 특성을 지닌 특수 광학 조색제입니다.']]},
  'WT 308':{role:'브라이트 오렌지',type:'solid',face:'#ea580c',flop:'#7c2d12',desc:'탁함이 없는 매우 맑고 선명한 주황색 조색제입니다.',details:[['일반 특성','탁함이 전혀 없는 매우 맑고 선명한 주황색 조색제입니다.']]},
  'WT 309':{role:'브릴리언트 마젠타',type:'solid',face:'#d946ef',flop:'#701a75',desc:'고채도의 자주색(Magenta) 조색제입니다.',details:[['일반 특성','가장 맑고 밝은 톤을 자랑하는 고채도의 자주색(Magenta) 조색제입니다.']]},
  'WT 310':{role:'파우더 펄 바인더',type:'binder',face:'#ffffff',flop:'#ffffff',desc:'단독으로 색상을 내지 않는 전용 조색제 바인더입니다.',details:[['일반 특성','색상을 내는 안료가 포함되지 않은 특수 목적의 투명 수지(Binder)입니다.']]},
  'WT 311':{role:'루비 레드',type:'solid',face:'#ef4444',flop:'#7f1d1d',desc:'약하게 황색 기운을 띠는 투명한 적색 수성 조색제입니다.',details:[['일반 특성','약하게 황색(Yellowish) 기운을 띠는 맑고 투명한 적색 수성 조색제입니다.']]},
  'WT 312':{role:'매직 파이어 이펙트',type:'pearl',face:'#ef4444',flop:'#22c55e',desc:'관찰 각도에 따라 색상이 교차하는 특수 광학 간섭 펄입니다.',details:[['일반 특성','관찰 각도에 따라 색상이 극단적으로 교차하는 특수 광학 간섭 펄 조색제입니다.']]},
  'WT 315':{role:'엑스트라 화인 블루 펄',type:'pearl',face:'#3b82f6',flop:'#84cc16',desc:'가장 미세한 입자 크기의 약한 적색 기운 청색 간섭 펄입니다.',details:[['일반 특성','가장 미세한 입자 크기로 분쇄된 약한 적색 기운의 청색 간섭 펄 조색제입니다.']]},
  'WT 316':{role:'터콰이즈 펄',type:'pearl',face:'#06b6d4',flop:'#10b981',desc:'중간 크기의 녹청색(터키석 색상) 간섭 펄 조색제입니다.',details:[['일반 특성','중간 크기의 녹청색(터키석 색상) 간섭 펄 조색제입니다.']]},
  'WT 317':{role:'플래틴 실버 브릴리언트 화인',type:'silver_fine',face:'#f8fafc',flop:'#334155',desc:'고휘도 반사 특성을 지닌 매끄러운 소립자 특수 알루미늄입니다.',details:[['일반 특성','고휘도 반사 특성을 지닌 매끄러운 소립자 특수 알루미늄 조색제입니다.']]},
  'WT 318':{role:'브릴리언트 블루',type:'solid',face:'#0284c7',flop:'#082f49',desc:'밝고 화사한 녹색 기운을 띠는 고광도 맑은 청색 조색제입니다.',details:[['일반 특성','밝고 화사한 녹색 기운을 띠는 고광도 맑은 청색 조색제입니다.']]},
  'WT 320':{role:'플래티늄 펄',type:'pearl',face:'#f1f5f9',flop:'#64748b',desc:'조색 라인업 중 입자 크기가 가장 작은 초미립 백색 펄입니다.',details:[['일반 특성','조색 라인업 중 입자 크기가 가장 작은 초미립 백색(White) 펄 조색제입니다.']]},
  'WT 321':{role:'화이트',type:'solid',face:'#ffffff',flop:'#e2e8f0',desc:'시스템의 가장 표준이 되는 고농축/고은폐력 표준 백색 조색제입니다.',details:[['일반 특성','Hi-TEC 시스템의 가장 뼈대가 되는 고농축/고은폐력 표준 백색 조색제입니다.']]},
  'WT 322':{role:'마이크로 화이트',type:'solid',face:'#f8fafc',flop:'#cbd5e1',desc:'미세한 알루미늄 및 펄 입자가 혼합 설계된 특수 복합 화이트 안료입니다.',details:[['일반 특성','미세한 알루미늄 및 펄 입자가 미리 혼합 설계된 특수 복합 화이트 안료입니다.']]},
  'WT 323':{role:'스페셜 블랙',type:'solid',face:'#020617',flop:'#000000',desc:'가장 맑고 진한 시스템의 표준 흑색 수성 조색제입니다.',details:[['일반 특성','스피스해커 시스템의 가장 기준이 되는 범용 표준 흑색 수성 조색제입니다.']]},
  'WT 324':{role:'레디쉬 옐로우',type:'solid',face:'#f59e0b',flop:'#9a3412',desc:'따뜻한 적색 기운이 도는 선명한 황색 조색제입니다.',details:[['일반 특성','따뜻한 적색 기운이 도는 맑고 채도가 높은 선명한 황색 조색제입니다.']]},
  'WT 326':{role:'그리니쉬 옐로우',type:'solid',face:'#eab308',flop:'#65a30d',desc:'차가운 녹색을 살짝 띠는 매우 맑고 투명한 황색 조색제입니다.',details:[['일반 특성','차가운 녹색을 살짝 띠는 매우 맑고 투명한 황색 조색제입니다.']]},
  'WT 327':{role:'옐로우',type:'solid',face:'#fde047',flop:'#ca8a04',desc:'약하게 녹색 기운이 감도는 밝고 화사한 기본 황색 조색제입니다.',details:[['일반 특성','약하게 녹색 기운이 감도는 밝고 화사한 기본 황색 조색제입니다.']]},
  'WT 328':{role:'오커',type:'solid',face:'#b45309',flop:'#451a03',desc:'무겁고 탁한 흙빛 황토색의 고은폐력 조색제입니다.',details:[['일반 특성','무겁고 탁한 흙빛 황토색(황색 계열)의 고은폐력 조색제입니다.']]},
  'WT 329':{role:'트랜스페어런트 옐로우',type:'solid',face:'#f59e0b',flop:'#ea580c',desc:'적색이 살짝 가미된 매우 선명하고 맑은 투명 황색 조색제입니다.',details:[['일반 특성','적색이 살짝 가미된 매우 선명하고 맑은 투명 황색 조색제입니다.']]},
  'WT 330':{role:'블러드 오렌지',type:'solid',face:'#ea580c',flop:'#9a3412',desc:'따뜻하고 밝은 기운을 품은 선명한 주황색 수성 조색제입니다.',details:[['일반 특성','따뜻하고 밝은 기운을 품은 선명한 주황색 수성 조색제입니다.']]},
  'WT 331':{role:'트랜스루센트 옥사이드',type:'solid',face:'#d97706',flop:'#451a03',desc:'산화철 성분을 기반으로 맑은 발색을 내는 반투명 황적색 조색제입니다.',details:[['일반 특성','독특한 산화철 성분을 기반으로 맑은 발색을 내도록 정제된 반투명 황적색 조색제입니다.']]},
  'WT 332':{role:'마룬',type:'solid',face:'#b91c1c',flop:'#7c2d12',desc:'탁하고 짙은 검붉은 톤을 지닌 어두운 적색 조색제입니다.',details:[['일반 특성','탁하고 짙은 검붉은 톤을 지닌 어두운 적색 조색제입니다.']]},
  'WT 333':{role:'그라나다 레드',type:'solid',face:'#991b1b',flop:'#450a0a',desc:'가장 표준적이며 맑고 밝은 기본 고농축 적색 조색제입니다.',details:[['일반 특성','가장 표준적이며 맑고 밝은 기본 고농축 적색 조색제입니다.']]},
  'WT 334':{role:'옥사이드 레드',type:'solid',face:'#7f1d1d',flop:'#450a0a',desc:'적벽돌과 유사한 묵직하고 탁한 산화철 계열의 적색 조색제입니다.',details:[['일반 특성','적벽돌과 유사한 묵직하고 탁한 산화철 계열의 적색 조색제입니다.']]},
  'WT 335':{role:'다크 옐로우',type:'solid',face:'#d97706',flop:'#78350f',desc:'적색 기운이 미세하게 감도는 차분하면서 밝은 솔리드 황색입니다.',details:[['일반 특성','적색 기운이 미세하게 감도는 차분하면서도 밝은 톤의 솔리드 황색 조색제입니다.']]},
  'WT 336':{role:'트랜스루센트 레드',type:'solid',face:'#7c2d12',flop:'#450a0a',desc:'어두운 갈색(Brownish) 빛이 오묘하게 도는 반투명 적색 조색제입니다.',details:[['일반 특성','어두운 갈색(Brownish) 빛이 오묘하게 도는 선명한 반투명 적색 조색제입니다.']]},
  'WT 337':{role:'레드',type:'solid',face:'#ef4444',flop:'#991b1b',desc:'은은한 청색 기운(Bluish)이 도는 중간 톤의 표준 적색 조색제입니다.',details:[['일반 특성','은은한 청색 기운(Bluish)이 도는 중간 톤의 고은폐력 표준 적색 조색제입니다.']]},
  'WT 338':{role:'블루이쉬 마젠타 레드',type:'solid',face:'#d946ef',flop:'#86198f',desc:'차가운 푸른빛이 많이 도는 선명한 표준 자주색 조색제입니다.',details:[['일반 특성','차가운 푸른빛이 많이 도는 선명한 표준 자주색(Magenta) 조색제입니다.']]},
  'WT 339':{role:'바이올렛',type:'solid',face:'#8b5cf6',flop:'#4c1d95',desc:'맑고 깨끗한 표준 보라색 수성 조색제입니다.',details:[['일반 특성','맑고 깨끗한 표준 보라색 수성 조색제입니다.']]},
  'WT 340':{role:'옐로우 마젠타 레드',type:'solid',face:'#e879f9',flop:'#a21caf',desc:'따뜻한 황색 기운을 띠는 밝고 맑은 자주색 조색제입니다.',details:[['일반 특성','따뜻한 황색 기운을 띠는 밝고 맑은 자주색 조색제입니다.']]},
  'WT 341':{role:'아주르 블루',type:'solid',face:'#2563eb',flop:'#1e3a8a',desc:'채도가 가장 높은 아주 선명한 프리미엄 청색 조색제입니다.',details:[['일반 특성','조색 시스템 내에서 채도가 가장 높은 아주 선명한 프리미엄 청색 조색제입니다.']]},
  'WT 342':{role:'다크 바이올렛',type:'solid',face:'#581c87',flop:'#2e1065',desc:'탁함 없이 맑은 심연의 어두움을 가진 보라색 수성 조색제입니다.',details:[['일반 특성','탁함 없이 맑은 심연의 어두움을 가진 보라색 수성 조색제입니다.']]},
  'WT 343':{role:'블루',type:'solid',face:'#3b82f6',flop:'#1e40af',desc:'특정 색으로 치우침이 없는 완벽한 중간톤의 고은폐력 파란색입니다.',details:[['일반 특성','특정 색으로 치우침이 없는 완벽한 중간톤의 고은폐력 표준 파란색 조색제입니다.']]},
  'WT 344':{role:'다크 블루',type:'solid',face:'#1d4ed8',flop:'#0f172a',desc:'명도가 가장 묵직하고 어두운 딥 블루(Deep Blue) 안료입니다.',details:[['일반 특성','청색 조색제 라인업 중에서 명도가 가장 묵직하고 어두운 딥 블루(Deep Blue) 안료입니다.']]},
  'WT 345':{role:'트랜스페어런트 에메랄드',type:'solid',face:'#10b981',flop:'#064e3b',desc:'황색 기운을 강하게 띠는 에메랄드빛 투명 녹색 조색제입니다.',details:[['일반 특성','맑고 선명한 황색 기운을 강하게 띠는 에메랄드빛 투명 녹색 조색제입니다.']]},
  'WT 347':{role:'트랜스페어런트 그린',type:'solid',face:'#15803d',flop:'#022c22',desc:'청색 기운을 미세하게 품은 맑고 투명한 기본 녹색 조색제입니다.',details:[['일반 특성','차가운 청색 기운을 미세하게 품은 맑고 투명한 기본 녹색 조색제입니다.']]},
  'WT 348':{role:'트랜스페어런트 아주르 블루',type:'solid',face:'#0ea5e9',flop:'#0369a1',desc:'채도가 매우 높은 맑고 시원한 투명 하늘색(Azure) 조색제입니다.',details:[['일반 특성','채도가 매우 높은 맑고 시원한 투명 하늘색(Azure) 조색제입니다.']]},
  'WT 349':{role:'트랜스루센트 그린',type:'solid',face:'#86efac',flop:'#064e3b',desc:'착색 농도를 대폭 낮춘 반투명 저농도 녹색 조색제입니다.',details:[['일반 특성','매우 정밀한 미세 조색 보정을 위해 의도적으로 착색 농도를 대폭 낮춘 반투명 저농도 녹색 조색제입니다.']]},
  'WT 350':{role:'트랜스루센트 블랙',type:'solid',face:'#525252',flop:'#451a03',desc:'정밀한 명암 조절을 위해 착색 농도를 낮춘 저농도 흑색 조색제입니다.',details:[['일반 특성','극도로 정밀한 명암 조절을 위해 착색 농도를 낮춘 반투명 저농도 흑색 조색제입니다.']]},
  'WT 351':{role:'트랜스루센트 아주르 블루',type:'solid',face:'#38bdf8',flop:'#075985',desc:'맑고 선명한 반투명 저농도 하늘색 조색제입니다.',details:[['일반 특성','정밀 조색을 위해 개발된 맑고 선명한 반투명 저농도 하늘색(Azure Blue) 조색제입니다.']]},
  'WT 352':{role:'트랜스루센트 화이트',type:'solid',face:'#f8fafc',flop:'#cbd5e1',desc:'바탕을 덮지 않는 반투명 성질을 가진 특수 백색 조색제입니다.',details:[['일반 특성','바탕을 완전히 덮지 않는 반투명(Translucent) 성질을 가진 특수 기능성 백색 조색제입니다.']]},
  'WT 353':{role:'트랜스루센트 마젠타 레드',type:'solid',face:'#c026d3',flop:'#4a044e',desc:'착색 농도를 낮추어 설계된 선명한 반투명 자주색 조색제입니다.',details:[['일반 특성','미세 조색용으로 착색 농도를 낮추어 설계된 선명한 반투명 저농도 자주색 조색제입니다.']]},
  'WT 354':{role:'화인 실버',type:'silver_fine',face:'#cbd5e1',flop:'#64748b',desc:'입자가 곱게 가공된 고운 입자 타입의 기본 알루미늄 조색제입니다.',details:[['일반 특성','비교적 입자가 곱게(Fine) 가공된 고운 입자 타입의 기본 알루미늄 조색제입니다.']]},
  'WT 355':{role:'브릴리언트 실버 코스',type:'silver_coarse',face:'#f8fafc',flop:'#334155',desc:'알루미늄 입자가 굵고 표면 반짝임이 극도로 강한 조색제입니다.',details:[['일반 특성','알루미늄 입자가 굵고(Coarse) 표면 반짝임이 극도로 강한(Brilliant) 고휘도 거친 알루미늄 조색제입니다.']]},
  'WT 356':{role:'미디엄 실버',type:'silver_fine',face:'#e2e8f0',flop:'#475569',desc:'최적의 균형을 맞춘 중간 크기 입자의 최고 표준 범용 알루미늄입니다.',details:[['일반 특성','가장 균형 잡힌 중간 크기(Medium) 입자를 가진 스피스해커 시스템의 최고 표준 범용 알루미늄 조색제입니다.']]},
  'WT 357':{role:'마이크로 실버',type:'silver_fine',face:'#f8fafc',flop:'#64748b',desc:'알루미늄 입자를 한계치까지 미세하게 분쇄 가공한 초정밀 미립자입니다.',details:[['일반 특성','알루미늄 입자를 한계치까지 미세하게 분쇄 가공한 초정밀 미립자(Micro) 조색제입니다.']]},
  'WT 359':{role:'브라이트 실버',type:'silver_coarse',face:'#f1f5f9',flop:'#334155',desc:'명도 톤이 한계까지 높게 세팅된 극도로 밝은 광휘형 알루미늄입니다.',details:[['일반 특성','전체적인 명도 톤이 한계까지 높게 세팅된 극도로 밝은(Bright) 광휘형 알루미늄 조색제입니다.']]},
  'WT 360':{role:'코스 실버',type:'silver_coarse',face:'#94a3b8',flop:'#1e293b',desc:'입자가 크고 굵은(Coarse) 표준 거친 알루미늄 조색제입니다.',details:[['일반 특성','일반적인 범위 내에서 입자가 크고 굵은(Coarse) 표준 거친 알루미늄 조색제입니다.']]},
  'WT 361':{role:'브릴리언트 실버',type:'silver_coarse',face:'#f1f5f9',flop:'#64748b',desc:'최적의 반짝임 밸런스를 맞춘 중간 입자 크기의 고휘도 알루미늄입니다.',details:[['일반 특성','최적의 반짝임 밸런스를 맞춘 중간 입자 크기의 고휘도 광휘형 알루미늄 조색제입니다.']]},
  'WT 362':{role:'브릴리언트 실버 화인',type:'silver_fine',face:'#f8fafc',flop:'#94a3b8',desc:'빛 반사 특성과 미세하고 고운 입자를 결합한 최고급 알루미늄입니다.',details:[['일반 특성','뛰어난 빛 반사(Brilliant) 특성과 미세하고 고운 입자(Fine) 특성을 하나의 밸런스로 결합한 최고급 알루미늄 조색제입니다.']]},
  'WT 363':{role:'브릴리언트 골드',type:'pearl',face:'#fbbf24',flop:'#b45309',desc:'순금처럼 맑고 선명한 채도를 자랑하는 프리미엄 황색 알루미늄 조색제입니다.',details:[['일반 특성','순금처럼 맑고 선명한 채도를 자랑하는 프리미엄 황색 알루미늄 수성 조색제입니다.']]},
  'WT 364':{role:'화이트 펄',type:'pearl',face:'#ffffff',flop:'#94a3b8',desc:'조색 안료 중 입자 크기가 가장 뚜렷하게 식별되는 대형 백색 마이카 펄입니다.',details:[['일반 특성','조색 안료 중 입자 크기가 육안으로 가장 크고 뚜렷하게 식별되는 대형 백색(White) 마이카 펄 조색제입니다.']]},
  'WT 365':{role:'라일락 펄',type:'pearl',face:'#a3e635',flop:'#be185d',desc:'오묘한 자주색 간섭 펄입니다.',details:[['일반 특성','중간 크기의 마이카(Mica)를 베이스로 빛의 간섭 효과를 이용한 오묘한 자주색(Lilac) 펄 조색제입니다.']]},
  'WT 366':{role:'골드 펄',type:'pearl',face:'#facc15',flop:'#4c1d95',desc:'빛 간섭 효과를 가진 황색 펄입니다.',details:[['일반 특성','균일한 중간 크기의 입자로 세팅된 빛 간섭 효과를 가진 황색(Gold) 펄 조색제입니다.']]},
  'WT 367':{role:'화인 그린 펄',type:'pearl',face:'#4ade80',flop:'#991b1b',desc:'표면이 섬세하게 설계된 작은 크기의 녹색 간섭 펄입니다.',details:[['일반 특성','표면이 매우 섬세하고 매끄럽게 설계된 작은 크기(Fine)의 녹색 간섭 펄 조색제입니다.']]},
  'WT 368':{role:'화인 화이트 펄',type:'pearl',face:'#f8fafc',flop:'#64748b',desc:'가장 활용도가 높은 범용 백색 펄입니다.',details:[['일반 특성','스피스해커 라인업 중 가장 활용도가 높은 최적의 중간 크기(Fine) 범용 백색 마이카 펄 조색제입니다.']]},
  'WT 369':{role:'레드 펄',type:'pearl',face:'#ef4444',flop:'#7f1d1d',desc:'적색으로 산화 처리된 고은폐 레드 펄입니다.',details:[['일반 특성','적색으로 산화 처리되어 표면이 특수 착색된 작은 크기의 고은폐 레드 펄 조색제입니다.']]},
  'WT 370':{role:'브라이트 블루 펄',type:'pearl',face:'#0ea5e9',flop:'#be123c',desc:'반짝임이 화려한 고광도 청색 간섭 펄입니다.',details:[['일반 특성','입자 크기가 매우 크고 반짝임이 화려하게 세팅된 고광도 맑은 청색 간섭 펄 조색제입니다.']]},
  'WT 371':{role:'브라운 펄',type:'pearl',face:'#d97706',flop:'#451a03',desc:'주황/갈색 톤으로 특수 코팅된 브라운 펄 조색제입니다.',details:[['일반 특성','표면이 주황/갈색 톤으로 특수 코팅 및 착색 처리된 중간 크기의 브라운 펄 조색제입니다.']]},
  'WT 372':{role:'화인 블루 펄',type:'pearl',face:'#3b82f6',flop:'#c026d3',desc:'붉은 기운이 도는 중간 크기의 청색 간섭 펄입니다.',details:[['일반 특성','입자가 부드럽게 세팅되어 붉은 기운(Reddish)이 매력적으로 감도는 중간 크기의 청색 간섭 펄 조색제입니다.']]},
  'WT 373':{role:'루비 펄',type:'pearl',face:'#dc2626',flop:'#7f1d1d',desc:'중간 크기(Medium)의 붉은색 착색 펄 조색제입니다.',details:[['일반 특성','가장 쓰임새가 좋은 중간 크기(Medium)의 붉은색 착색 펄 조색제입니다.']]},
  'WT 374':{role:'블루 그린 펄',type:'pearl',face:'#0d9488',flop:'#c2410c',desc:'티타늄 코팅 처리를 하여 청녹색을 내는 간섭 펄입니다.',details:[['일반 특성','마이카 베이스에 티타늄 코팅 처리를 하여 청녹색을 내도록 유도한 오묘한 중간 크기 간섭 펄 조색제입니다.']]},
  'WT 375':{role:'그린 펄',type:'pearl',face:'#16a34a',flop:'#b91c1c',desc:'가장 표준적인 기본 녹색 간섭 펄입니다.',details:[['일반 특성','가장 표준적인 입자 크기와 반사 특성을 보유한 기본 녹색 간섭 펄 조색제입니다.']]},
  'WT 376':{role:'레드펄 엑스트라',type:'pearl',face:'#ef4444',flop:'#16a34a',desc:'프리미엄 적색 간섭 펄입니다.',details:[['일반 특성','단순 착색이 아닌 광학적 간섭 코팅을 통해 개발된 중간 크기의 프리미엄 적색 간섭 펄 조색제입니다.']]},
  'WT 377':{role:'다이아몬드 화이트',type:'xirallic',face:'#ffffff',flop:'#64748b',desc:'질라릭 코팅 공법이 적용된 프리미엄 초고휘도 백색 펄입니다.',details:[['일반 특성','최첨단 질라릭(Xirallic) 코팅 공법이 적용된 최상위 등급의 프리미엄 초고휘도 백색 펄 조색제입니다.']]},
  'WT 378':{role:'다이아몬드 레드',type:'xirallic',face:'#ef4444',flop:'#7f1d1d',desc:'질라릭 구조를 기반으로 한 프리미엄 적색 펄입니다.',details:[['일반 특성','인공 합성 결정질인 질라릭(Xirallic) 구조를 기반으로 설계된 딥 베이스 프리미엄 적색 펄 조색제입니다.']]},
  'WT 379':{role:'다이아몬드 카퍼',type:'xirallic',face:'#ea580c',flop:'#7c2d12',desc:'질라릭 기술로 완성된 초고휘도 구리빛 펄 조색제입니다.',details:[['일반 특성','질라릭(Xirallic) 크리스탈 코팅 기술로 완성된 초고휘도 주황색(Copper/구리빛) 프리미엄 펄 조색제입니다.']]},
  'WT 380':{role:'다이아몬드 그린',type:'xirallic',face:'#4ade80',flop:'#166534',desc:'최고급 프리미엄 녹색 간섭 펄입니다.',details:[['일반 특성','질라릭(Xirallic) 특유의 극강의 투명도와 고휘도 특성을 지닌 최고급 프리미엄 녹색 간섭 펄 조색제입니다.']]},
  'WT 381':{role:'다이아몬드 블루',type:'xirallic',face:'#3b82f6',flop:'#1e3a8a',desc:'질라릭 코팅 기반의 최고급 청색 간섭 펄 조색제입니다.',details:[['일반 특성','합성 크리스탈 질라릭(Xirallic) 코팅 기반으로 눈부시게 세팅된 최고급 청색 간섭 펄 조색제입니다.']]},
  'WT 382':{role:'다이아몬드 골드',type:'xirallic',face:'#facc15',flop:'#a16207',desc:'프리미엄 황색 간섭 질라릭 펄 조색제입니다.',details:[['일반 특성','인공 결정 질라릭(Xirallic) 공학으로 완성된 빛의 굴절을 극대화시킨 프리미엄 황색 간섭 펄 조색제입니다.']]},
  'WT 383':{role:'브릴리언트 오렌지',type:'silver_coarse',face:'#f97316',flop:'#9a3412',desc:'강렬하고 고채도의 주황빛으로 착색된 고광택 알루미늄입니다.',details:[['일반 특성','시선을 사로잡는 강렬하고 고채도의 주황빛으로 착색된 고광택 알루미늄 조색제입니다.']]},
  'WT 385':{role:'시스템 콤퍼넌트 A',type:'binder',face:'#ffffff',flop:'#ffffff',desc:'수성 시스템의 뼈대를 구성하는 베이스 투명 수지입니다.',details:[['일반 특성','색상을 발현하는 조색제가 아니라, 수성 도료 시스템 전체의 뼈대를 구성하는 필수적인 베이스 투명 수지(Resin)입니다.']]},
  'WT 386':{role:'플롭 컨트롤',type:'binder',face:'#ffffff',flop:'#ffffff',desc:'안료 입자의 눕는 각도를 제어하기 위한 조절제입니다.',details:[['일반 특성','이펙트 컬러 도장 시 안료 입자의 눕는 각도를 제어하기 위해 특수 고안된 명암(Flop) 물리적 조정제입니다.']]},
  'WT 387':{role:'시스템 콤퍼넌트 B',type:'binder',face:'#ffffff',flop:'#ffffff',desc:'수성 시스템 점도 조절제 및 바인더입니다.',details:[['일반 특성','수용성 베이스코트 도료 전체의 안정적인 분산과 흐름성을 관리하는 시스템 점도 조절제 및 바인더입니다.']]},
  'WT 388':{role:'슈퍼 딥 블랙',type:'solid',face:'#050505',flop:'#000000',desc:'빛 반사를 억제하여 깊이감을 극대화한 어두운 흑색 조색제입니다.',details:[['일반 특성','빛 반사를 억제하여 깊이감을 극대화한 아주 어두운 고농축 흑색 조색제입니다.']]},
  'WT 389':{role:'플래티닌 실버 화인',type:'silver_fine',face:'#cbd5e1',flop:'#64748b',desc:'작은 사이즈의 고휘도 광휘형 알루미늄 조색제입니다.',details:[['일반 특성','입자 크기가 정밀하게 통제된 작은 사이즈의 고휘도 광휘형 알루미늄 수성 조색제입니다.']]},
  'WT 390':{role:'플래티닌 실버',type:'silver_coarse',face:'#f8fafc',flop:'#334155',desc:'빛 굴절률과 명암 대비를 최고 수준으로 극대화한 조색제입니다.',details:[['일반 특성','모든 알루미늄 라인업 중 빛 굴절률과 명암 대비를 최고 수준으로 극대화한 중간 크기 입자의 고휘도 광휘형 조색제입니다.']]},
  'WT 392':{role:'매직 이펙트',type:'pearl',face:'#22c55e',flop:'#ef4444',desc:'다층 박막 코팅 기술을 적용한 특수 광학 간섭 펄입니다.',details:[['일반 특성','다층 박막 코팅 기술을 적용하여 관찰 각도에 따라 색상이 마법처럼 카멜레온 변이를 일으키는 특수 광학 간섭 펄 조색제입니다.']]},
  'WT 393':{role:'라이트 옐로우',type:'solid',face:'#fef08a',flop:'#a16207',desc:'레몬처럼 밝고 산뜻한 연황색 조색제입니다.',details:[['일반 특성','차가운 녹색 기운을 아주 미세하게 띠면서도 레몬처럼 밝고 산뜻한 톤을 가진 연황색 조색제입니다.']]},
  'WT 1051':{role:'블랜딩 1051',type:'binder',face:'#ffffff',flop:'#ffffff',desc:'보수 도장 작업 시 필수적인 전용 블랜딩 첨가제입니다.',details:[['일반 특성','수성 페인트 부분 보수 도장(보카시)의 경계면을 자연스럽게 무너뜨리고 녹여주는 필수적인 전용 블랜딩 수지 첨가제입니다.']]},
  'WT 1500':{role:'울트라 딥 블랙',type:'solid',face:'#000000',flop:'#000000',desc:'명도가 가장 극도로 어둡게 떨어지는 한정판 흑색 조색제입니다.',details:[['일반 특성','명도가 가장 극도로 어둡게 떨어지는 한정판 흑색 조색제입니다. 액상 특수 염료(Dye)를 함유하고 있습니다.']]},
  'WT 455':{role:'퍼포먼스 컴포넌트',type:'binder',face:'#ffffff',flop:'#ffffff',desc:'물성을 안정화시키는 기능성 유동성 첨가제입니다.',details:[['일반 특성','수성 페인트의 물성을 극적으로 안정화시키기 위해 독자 개발된 솔리드 전용 고성능 기능성 유동성 첨가제입니다.']]},
  'WT 3080':{role:'스페셜 애디티브',type:'binder',face:'#ffffff',flop:'#ffffff',desc:'도막 보정 및 흐름 방지 특수 첨가제.',details:[['일반 특성','도막 보정 및 흐름 방지 전용 특수 첨가제입니다.']]}
};

const catalogData = Object.entries(TONER_DB).map(([code, data]) => {
  let labelCategory = "일반 특성"; let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
  const r = data.role || ''; const d = data.desc || ''; const t = data.type || '';
  if(r.includes("블루") || r.includes("레드") || r.includes("옐로우") || r.includes("그린") || r.includes("오렌지") || r.includes("바이올렛") || r.includes("마룬")) { labelCategory = "색상/외관"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200"; } 
  else if (d.includes("금지") || d.includes("최대") || d.includes("주의") || d.includes("제한")) { labelCategory = "경고/주의사항"; badgeColor = "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100"; } 
  else if (r.includes("실버") || r.includes("펄") || r.includes("이펙트") || d.includes("이펙트") || code === 'WT 400') { labelCategory = "이펙트 전용"; badgeColor = "bg-blue-50 text-blue-600 border-blue-200"; } 
  else if (t === "binder" || d.includes("첨가제") || d.includes("수지") || d.includes("바인더")) { labelCategory = "배합/첨가제"; badgeColor = "bg-purple-50 text-purple-600 border-purple-200"; }
  return { code, ...data, labelCategory, badgeColor };
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHue = (a: number, b: number, t: number) => { let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360; let h = a + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360; return h; };
const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('글라스') || r.includes('400'); }

const textureCache: Record<string, React.CSSProperties> = {};
const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
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

const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || ''; let h = 0; let s = 0; let baseL = 50;
  if (code.includes('144')) { h = 230; s = 85; baseL = 35; } 
  else if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('마룬')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹')) { h = 140; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('오커') || r.includes('황')) { h = 40; s = 80; baseL = 50; }
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

const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };

const getOptics = (tonersList: any[]) => {
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
    face: { h: safeNum(Math.round(faceHue)), s: safeNum(Math.round(faceSat)), l: safeNum(Math.round(Math.min(99, Math.max(5, l15)))) },
    mid:  { h: safeNum(Math.round(hue)), s: safeNum(Math.round(sat)), l: safeNum(Math.round(Math.min(98, Math.max(5, baseL)))) },
    flop: { h: safeNum(Math.round(wPearl > 0 ? flopHue : hue)), s: safeNum(Math.round(flopSat)), l: safeNum(Math.round(Math.min(98, Math.max(2, l110)))) },
    isMetallic: (wSilver > 0 || wPearl > 0)
  };
};

const getColorString = (opticsObj: any, angle: 'face'|'mid'|'flop') => {
  if (!opticsObj || !opticsObj[angle]) return 'hsl(0,0%,90%)';
  const h = isNaN(opticsObj[angle].h) ? 0 : Math.round(opticsObj[angle].h);
  const s = isNaN(opticsObj[angle].s) ? 0 : Math.round(opticsObj[angle].s);
  const l = isNaN(opticsObj[angle].l) ? 90 : Math.round(opticsObj[angle].l); return `hsl(${h}, ${s}%, ${l}%)`;
};

const getInteractiveBackground = (opticsObj: any, lPos: any) => {
  if (!opticsObj || !opticsObj.face || !opticsObj.mid || !opticsObj.flop) return '#f1f5f9';
  const viewAngleT = Math.max(0, Math.min(1, (lPos.x || 50) / 100));
  const lerpColorAdvanced = (c1: any, c2: any, t: number) => {
      let d = c2.h - c1.h; if (d > 180) d -= 360; if (d < -180) d += 360; let h = c1.h + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360; return { h, s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) };
  };
  let activeBaseColor = viewAngleT > 0.5 ? lerpColorAdvanced(opticsObj.mid, opticsObj.face, (viewAngleT - 0.5) * 2) : lerpColorAdvanced(opticsObj.flop, opticsObj.mid, viewAngleT * 2);
  const h = isNaN(activeBaseColor.h) ? 0 : Math.round(activeBaseColor.h); const s = isNaN(activeBaseColor.s) ? 0 : Math.round(activeBaseColor.s); const l = isNaN(activeBaseColor.l) ? 50 : Math.round(activeBaseColor.l);
  const dist = Math.sqrt(Math.pow((lPos.x || 50) - 50, 2) + Math.pow((lPos.y || 50) - 50, 2)); const normalizedDist = Math.min(1, dist / 70); 
  const highlightAlpha = isNaN(normalizedDist) ? 0.5 : Number(lerp(0.6, 0.0, normalizedDist).toFixed(2)); const distPercent = isNaN(normalizedDist) ? 50 : Math.round(lerp(20, 70, normalizedDist)); const darkL = Math.round(l * 0.4);
  return `radial-gradient(circle at ${lPos.x || 50}% ${lPos.y || 50}%, rgba(255,255,255,${highlightAlpha}) 0%, hsl(${h}, ${s}%, ${l}%) ${distPercent}%, hsl(${h}, ${s}%, ${darkL}%) 100%)`;
};

const packToners = (tonerList: any[]) => { return tonerList.filter(t => t.code).map(t => { const c = t.code.replace('WT ', '').trim(); const w = t.adjustedWeight || ''; const h = (t.history || []).join(','); return `${c}_${w}_${h}`; }).join('*'); };
const unpackToners = (str: string) => { if (!str) return []; return str.split('*').map((t, i) => { const [c, w, h] = t.split('_'); return { id: `restored_${Date.now()}_${i}`, code: c ? `WT ${c}` : '', adjustedWeight: w || '', history: h ? h.split(',') : [] }; }); };

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [] }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [] }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState(''); const [vehicleNumber, setVehicleNumber] = useState(''); const [carModel, setCarModel] = useState(''); const [jobDescription, setJobDescription] = useState(''); const [specialNotes, setSpecialNotes] = useState('');
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00"); const [totalPearlWeight, setTotalPearlWeight] = useState("0.00"); const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false); const [scannedImage, setScannedImage] = useState<string | null>(null); const [isScanning, setIsScanning] = useState(false); const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);
  const [restoredViewData, setRestoredViewData] = useState<any>(null); const [isTransferTab, setIsTransferTab] = useState(false); const [isAboutOpen, setIsAboutOpen] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null); const viewerRef = useRef<HTMLElement>(null); const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null); const [lightPos, setLightPos] = useState({ x: 50, y: 50 }); const [isDraggingLight, setIsDraggingLight] = useState(false); const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  const [baseOptics, setBaseOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false }); const [pearlOptics, setPearlOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false }); const [finalOptics, setFinalOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false }); const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null);
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");
  const tonersRef = useRef<any[]>([]); const pearlTonersRef = useRef<any[]>([]); const isThreeCoatModeRef = useRef<boolean>(true);

  useEffect(() => { document.title = "조색 Pro"; }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search); const d = urlParams.get('d'); const ori = window.location.origin;
        if (!ori.includes('google') && !ori.includes('gemini') && !ori.includes('usercontent') && !ori.includes('null')) localStorage.setItem('hitec_clean_domain', ori);
        if (d) {
            try {
                let parsed; if (d.includes('%7B') || d.includes('{')) parsed = JSON.parse(decodeURIComponent(d));
                else { const parts = d.split('|').map(decodeURIComponent); parsed = { v: parts[0] || '', m: parts[1] || '', c: parts[2] || '', j: parts[3] || '', n: parts[4] || '', b: unpackToners(parts[5]), p: unpackToners(parts[6]), t: parts[7] === '1' }; }
                localStorage.setItem('hitec_broadcast', JSON.stringify({ data: parsed, ts: Date.now() })); window.close(); setIsTransferTab(true); return; 
            } catch (e) { console.error("URL 파싱 실패", e); }
        }

        const handleStorageChange = (e: StorageEvent) => { if (e.key === 'hitec_broadcast' && e.newValue) { const payload = JSON.parse(e.newValue); setRestoredViewData(payload.data); } };
        window.addEventListener('storage', handleStorageChange);

        const savedBase = localStorage.getItem('hitec_base'); const savedPearl = localStorage.getItem('hitec_pearl'); const savedCode = localStorage.getItem('hitec_code'); const savedMode = localStorage.getItem('hitec_mode'); const savedVehicle = localStorage.getItem('hitec_vehicle'); const savedCarModel = localStorage.getItem('hitec_carmodel'); const savedJob = localStorage.getItem('hitec_job'); const savedNotes = localStorage.getItem('hitec_notes');
        if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl)); if (savedCode) setTargetColorCode(savedCode); if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode)); if (savedVehicle) setVehicleNumber(savedVehicle); if (savedCarModel) setCarModel(savedCarModel); if (savedJob) setJobDescription(savedJob); if (savedNotes) setSpecialNotes(savedNotes);
        setIsLoaded(true); return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search); if (urlParams.get('d')) return;
      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes);
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, isLoaded]);

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');
  useEffect(() => { tonersRef.current = toners; pearlTonersRef.current = pearlToners; isThreeCoatModeRef.current = isThreeCoatMode; }, [toners, pearlToners, isThreeCoatMode]);
  useEffect(() => { if (typeof document !== 'undefined' && !document.getElementById('tesseract-script')) { const script = document.createElement('script'); script.id = 'tesseract-script'; script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'; script.async = true; document.body.appendChild(script); } }, []);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0); const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    setTotalBaseWeight(baseTotal.toFixed(2)); setTotalPearlWeight(pearlTotal.toFixed(2)); setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    setBaseOptics(getOptics(toners)); setPearlOptics(getOptics(pearlToners)); const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners; setFinalOptics(getOptics(activeToners));
    const checkMetallic = (list: any[]) => list.some(t => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== ''; });
    setIsBaseMetallic(checkMetallic(toners)); setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (focusTarget) {
      let attempts = 0; const interval = setInterval(() => {
        const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
        if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); clearInterval(interval); setFocusTarget(null); }
        attempts++; if (attempts > 10) { clearInterval(interval); setFocusTarget(null); }
      }, 30); return () => clearInterval(interval);
    }
  }, [focusTarget, toners, pearlToners]);

  const handlePointerMove = (e: any) => { if (!isDraggingLight || !viewerRef.current) return; const rect = viewerRef.current.getBoundingClientRect(); let x = ((e.clientX - rect.left) / rect.width) * 100; let y = ((e.clientY - rect.top) / rect.height) * 100; setLightPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }); };
  const handleClearAll = () => { setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [] }]); setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [] }]); setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); setIsBaseConfirmed(false); setScannedImage(null); };

  const processNumbers = useCallback((nums: string[]) => {
    let nextBase = [...tonersRef.current]; let nextPearl = [...pearlTonersRef.current]; let i = 0;
    while (i < nums.length) {
        let codeC = nums[i]; let isCode = !!TONER_DB[`WT ${codeC}`];
        if (isCode) {
            let finalCode = `WT ${codeC}`; let weightC = nums[i+1]; let finalWeight = "";
            if (weightC && TONER_DB[`WT ${weightC}`]) { finalWeight = ""; i++; } 
            else if (weightC) { let nextNum = nums[i+2]; if (nextNum && nextNum.length === 1 && !TONER_DB[`WT ${nextNum}`] && !weightC.includes('.')) { finalWeight = `${weightC}.${nextNum}`; i += 3; } else { finalWeight = weightC; i += 2; } } else { finalWeight = ""; i++; }
            const isPearlLayer = isThreeCoatModeRef.current && (TONER_DB[finalCode].type === 'pearl' || TONER_DB[finalCode].type === 'xirallic'); const targetList = isPearlLayer ? nextPearl : nextBase;
            const emptyIndex = targetList.findIndex(t => t.code === '' || (t.code === finalCode && t.adjustedWeight === ''));
            if (emptyIndex !== -1) targetList[emptyIndex] = { ...targetList[emptyIndex], code: finalCode, adjustedWeight: finalWeight, history: targetList[emptyIndex].history || [] }; else targetList.push({ id: `scan_${Date.now()}_${i}`, code: finalCode, adjustedWeight: finalWeight, history: [] });
        } else {
            let orphanWeight = codeC; let nextNum = nums[i+1]; if (nextNum && nextNum.length === 1 && !TONER_DB[`WT ${nextNum}`] && !orphanWeight.includes('.')) { orphanWeight = `${orphanWeight}.${nextNum}`; i += 2; } else { i++; }
            let found = false;
            if (isThreeCoatModeRef.current) { for (let j = nextPearl.length - 1; j >= 0; j--) { if (nextPearl[j].code !== '' && (!nextPearl[j].adjustedWeight || nextPearl[j].adjustedWeight === '')) { const currentHistory = nextPearl[j].history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== orphanWeight) ? [...currentHistory, orphanWeight] : currentHistory; nextPearl[j] = { ...nextPearl[j], adjustedWeight: orphanWeight, history: nextHistory }; found = true; break; } } }
            if (!found) { for (let j = nextBase.length - 1; j >= 0; j--) { if (nextBase[j].code !== '' && (!nextBase[j].adjustedWeight || nextBase[j].adjustedWeight === '')) { const currentHistory = nextBase[j].history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== orphanWeight) ? [...currentHistory, orphanWeight] : currentHistory; nextBase[j] = { ...nextBase[j], adjustedWeight: orphanWeight, history: nextHistory }; found = true; break; } } }
        }
    }
    setToners(nextBase); setPearlToners(nextPearl);
  }, []);

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return; const imageUrl = URL.createObjectURL(file); setScannedImage(imageUrl); setIsScanning(true);
    try {
      if (typeof window !== 'undefined' && (window as any).Tesseract) {
        const result = await (window as any).Tesseract.recognize(file, 'eng', { params: { tessedit_pageseg_mode: '6', tessedit_char_whitelist: '0123456789.WT ' } });
        const text = result.data.text; let norm = text.replace(/:/g, '.').replace(/점/g, '.').replace(/\s*\.\s*/g, '.').replace(/[A-Za-z]/g, ' ');
        const nums = norm.match(/\d*\.\d+|\d+/g); if (nums && nums.length > 0) processNumbers(nums); else throw new Error("코드 인식 실패");
      } else throw new Error("OCR 모듈 미적용");
    } catch (error) { alert("스캔 실패: 화질 문제로 숫자를 찾지 못했습니다. 직접 입력해 주세요."); }
    setIsScanning(false);
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

  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
      if (e.key === 'Enter') { e.preventDefault(); const newId = `new_${Date.now()}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [] }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); }
  };
  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };
  const addToner = (isPearl = false) => { const newId = `new_${Date.now()}`; const newToner = { id: newId, code: '', adjustedWeight: "", history: [] }; if (isPearl) setPearlToners([...pearlToners, newToner]); else setToners([...toners, newToner]); setFocusTarget({ id: newId, type: 'code' }); };

  const quickEditWeight = (id: string, delta: number, isPearl: boolean) => {
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if(t.id === id) {
         let current = parseFloat(t.adjustedWeight) || 0; let newVal = Math.max(0, current + delta).toFixed(1);
         const currentHistory = t.history || []; const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== newVal) ? [...currentHistory, newVal] : currentHistory;
         return { ...t, adjustedWeight: newVal, history: nextHistory };
      }
      return t;
    }));
  };

  const handleScaleAll = (isMultiply: boolean) => {
    const factor = parseFloat(scaleFactor); if (isNaN(factor) || factor <= 0) { alert("올바른 배율(숫자)을 입력해주세요."); return; }
    const scale = (valStr: string) => { const val = parseFloat(valStr); if (isNaN(val) || val === 0) return valStr; return (isMultiply ? val * factor : val / factor).toFixed(1); };
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
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0'].map(s => encodeURIComponent(s || '')).join('|');
    const shareUrl = `${currentOrigin}${window.location.pathname}?d=${payloadStr}`;
    const rowData = ["", vehicleNumber || '미입력', carModel || '미입력', targetColorCode || '미지정', jobDescription || '미입력', specialNotes || '', baseStr, pearlStr, detailStr, shareUrl].join('\t');
    if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(rowData).catch(err => console.error(err));
    else { const textarea = document.createElement('textarea'); textarea.value = rowData; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); document.body.removeChild(textarea); }
  };

  const shareToKakao = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}`).join('\n');
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}`).join('\n');
    const text = `[PERMAHYD HI-TEC 배합 지시서]\n================================\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 차종: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트 (Ground)]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}\n▶ 6052 수지제원: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}\n\n${isThreeCoatMode ? `[▼ 펄 코트 (Mid-coat)]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 코트 합계: ${totalPearlWeight}\n▶ 6052 수지제원: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}\n\n` : ''}================================\n✨ 최종 도막 혼합 총량: ${totalFinalWeight}\n================================`;
    if (typeof navigator !== 'undefined' && navigator.share) navigator.share({ title: 'HI-TEC 조색 데이터 인계', text: text }).catch(console.error);
    else { alert("상세 배합 스펙이 클립보드에 복사되었습니다. 카카오톡 창에 바로 '붙여넣기' 하십시오.\n\n" + text); if (typeof navigator !== 'undefined' && navigator.clipboard) navigator.clipboard.writeText(text); }
  };

  const sortedCatalog = [...catalogData].sort((a, b) => { const aActive = activeCodes.includes(a.code); const bActive = activeCodes.includes(b.code); if (aActive && !bActive) return -1; if (!aActive && bActive) return 1; return 0; }).filter(item => item.code.includes(catalogSearch.toUpperCase()) || item.role.includes(catalogSearch));

  if (isTransferTab) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 font-sans">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center max-w-[500px] shadow-2xl">
                  <Zap className="text-yellow-400 w-20 h-20 mx-auto mb-6 animate-pulse" />
                  <h1 className="text-2xl font-black text-blue-400 mb-4">데이터 전송 신호 발사!</h1>
                  <p className="text-slate-300 text-base mb-6 leading-relaxed">바탕화면에 켜두신 <strong>[조색 Pro 앱]</strong>으로<br/>과거 배합 기록 신호를 성공적으로 쐈습니다.<br/><br/><span className="text-red-400 font-bold">보안상 이 껍데기 창은 자동으로 닫히지 않습니다.</span></p>
                  <button onClick={() => window.close()} className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] w-full mb-4 text-lg transition-colors flex items-center justify-center gap-2"><X size={24}/> 이 창을 닫고 원래 하던 작업으로 복귀</button>
                  <p className="text-sm text-slate-500 font-bold">※ 버튼이 안 눌리면 이 탭 위쪽의 (X)를 눌러서 강제로 꺼주세요.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      {isAboutOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-[400] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden">
               <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800"><h2 className="text-white font-black text-sm flex items-center"><Award className="mr-2 text-yellow-400" size={16}/> 조색 Pro - 개발자 정보</h2><button onClick={() => setIsAboutOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button></div>
               <div className="p-6 text-slate-300 space-y-4">
                   <div className="flex items-center gap-4 mb-6">
                       <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-lg shrink-0"><span className="text-2xl font-black text-white">윤</span></div>
                       <div><h3 className="text-base font-black text-white">윤성만 마스터 <span className="text-xs font-normal text-slate-400">(Yoon Seong-man)</span></h3><p className="text-xs text-blue-400 font-bold mt-1">PERMAHYD HI-TEC 현장 조색 시스템 기획 및 개발자</p></div>
                   </div>
                   <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                       <h4 className="font-bold text-white text-xs mb-2 flex items-center"><Terminal size={14} className="mr-1.5 text-emerald-400"/> 개발 과정 및 투입된 노력</h4>
                       <p className="text-xs leading-relaxed text-slate-400 text-justify break-keep">본 프로그램은 실제 자동차 보수도장 현장에서 겪은 수많은 시행착오와 땀방울이 고스란히 녹아있는 결과물입니다.<br/><br/>단순한 배합 계산을 넘어, <strong>PC 엑셀과의 완벽한 원클릭 연동, 과거 데이터 무손실 복원(텔레파시 엔진), 다중 시각화 렌더링, 10연속 오토 포커싱 기술</strong> 등 실제 작업자가 1초라도 아낄 수 있도록 설계된 '100% 현장 맞춤형 최적화 솔루션'입니다.<br/><br/>끊임없는 피드백과 로직 설계를 거쳐 완성된 윤성만 마스터만의 고유한 마스터피스입니다.</p>
                   </div>
               </div>
               <div className="p-4 bg-slate-950 border-t border-slate-800 text-center"><p className="text-[10px] text-slate-600 font-bold">ⓒ 2026 Yoon Seong-man. All rights reserved.</p></div>
           </div>
        </div>
      )}

      {restoredViewData && (
        <div className="fixed inset-0 bg-black/85 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-[800px] max-w-full shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                 <h2 className="text-blue-400 font-black text-lg flex items-center"><History className="mr-2"/> 과거 배합 기록 복원</h2>
                 <button onClick={() => setRestoredViewData(null)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1 text-slate-300">
                 <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner flex-1">
                        <div><span className="text-xs text-slate-500 block mb-1">차량 번호</span><span className="font-bold text-white text-sm">{restoredViewData.v || '-'}</span></div>
                        <div><span className="text-xs text-slate-500 block mb-1">차종</span><span className="font-bold text-white text-sm">{restoredViewData.m || '-'}</span></div>
                        <div><span className="text-xs text-slate-500 block mb-1">컬러 코드</span><span className="font-black text-blue-300 text-lg uppercase">{restoredViewData.c || '-'}</span></div>
                        <div><span className="text-xs text-slate-500 block mb-1">작업 내용</span><span className="font-bold text-white text-sm">{restoredViewData.j || '-'}</span></div>
                        {restoredViewData.n && <div className="col-span-2 mt-2"><span className="text-xs text-slate-500 block mb-1">특이 사항</span><span className="font-bold text-yellow-300 text-sm bg-yellow-900/30 px-3 py-1.5 rounded-lg border border-yellow-800/50 inline-block">{restoredViewData.n}</span></div>}
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner min-w-[220px] flex flex-col justify-center gap-3">
                        {(()=>{
                             const rBaseToners = restoredViewData.b || []; const rPearlToners = restoredViewData.p || [];
                             const rBaseTotal = rBaseToners.reduce((sum: number, t: any) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
                             const rPearlTotal = rPearlToners.reduce((sum: number, t: any) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
                             const rIsBaseMetallic = rBaseToners.some((t: any) => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== ''; });
                             const rIsPearlMetallic = rPearlToners.some((t: any) => { const type = TONER_DB[t.code]?.type || ''; return type !== 'solid' && type !== 'binder' && type !== ''; });
                             const rBaseResin = (rBaseTotal * (rIsBaseMetallic ? 0.2 : 0.1)).toFixed(1);
                             const rPearlResin = (rPearlTotal * (rIsPearlMetallic ? 0.2 : 0.1)).toFixed(1);
                             return (
                                 <>
                                     <div>
                                         <span className="text-[10px] text-slate-400 font-bold block mb-1">A. 베이스 합계 / 6052</span>
                                         <div className="flex items-end gap-2"><span className="text-xl font-black text-blue-400">{rBaseTotal.toFixed(1)}<span className="text-xs font-normal">g</span></span><span className="text-xs font-bold text-slate-500 mb-1">수지: <span className="text-slate-300">{rBaseResin}g</span></span></div>
                                     </div>
                                     {restoredViewData.t && rPearlToners.length > 0 && (
                                     <div className="border-t border-slate-700 pt-3 mt-1">
                                         <span className="text-[10px] text-slate-400 font-bold block mb-1">B. 펄 코트 합계 / 6052</span>
                                         <div className="flex items-end gap-2"><span className="text-xl font-black text-purple-400">{rPearlTotal.toFixed(1)}<span className="text-xs font-normal">g</span></span><span className="text-xs font-bold text-slate-500 mb-1">수지: <span className="text-slate-300">{rPearlResin}g</span></span></div>
                                     </div>
                                     )}
                                 </>
                             )
                        })()}
                    </div>
                 </div>
                 
                 <h3 className="text-sm font-bold text-slate-400 mb-3 border-b border-slate-700 pb-2 flex items-center"><Layers size={14} className="mr-1.5"/> 베이스 코트 (Ground Coat)</h3>
                 <div className="space-y-2 mb-6">
                    {restoredViewData.b?.map((t: any, idx: number) => (
                       <div key={idx} className="flex justify-between items-center bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700">
                          <div className="flex items-center gap-3"><span className="font-black text-white">{t.code}</span><span className="text-xs text-slate-500 hidden sm:inline-block">{TONER_DB[t.code]?.role || ''}</span></div>
                          <span className="text-blue-400 font-black text-lg">{t.adjustedWeight} <span className="text-xs font-normal text-slate-500">g</span></span>
                       </div>
                    ))}
                 </div>
                 {restoredViewData.t && restoredViewData.p?.length > 0 && (
                 <>
                   <h3 className="text-sm font-bold text-purple-400 mb-3 border-b border-slate-700 pb-2 flex items-center"><Zap size={14} className="mr-1.5"/> 펄 코트 (Mid Coat)</h3>
                   <div className="space-y-2 mb-4">
                      {restoredViewData.p?.map((t: any, idx: number) => (
                         <div key={idx} className="flex justify-between items-center bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-3"><span className="font-black text-white">{t.code}</span><span className="text-xs text-slate-500 hidden sm:inline-block">{TONER_DB[t.code]?.role || ''}</span></div>
                            <span className="text-purple-400 font-black text-lg">{t.adjustedWeight} <span className="text-xs font-normal text-slate-500">g</span></span>
                         </div>
                      ))}
                   </div>
                 </>
                 )}
              </div>
              <div className="p-4 border-t border-slate-700 bg-slate-900 rounded-b-2xl">
                 <button onClick={() => setRestoredViewData(null)} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-colors text-sm flex justify-center items-center gap-2"><X size={18} /> 닫기 및 원래 작업 화면으로 복귀</button>
              </div>
           </div>
        </div>
      )}

      {scannedImage && (
        <div className="bg-slate-900 border-b-4 border-blue-500 shadow-2xl z-50 p-2 md:p-4 sticky top-0 animate-in slide-in-from-top-10">
          <div className="flex justify-between items-center mb-2 px-2 max-w-[1600px] mx-auto">
            <h2 className="text-white text-sm font-bold flex items-center"><ImageIcon className="mr-2 text-blue-400" size={18}/> 시편 고속 참조 모드</h2>
            <button onClick={() => setScannedImage(null)} className="text-slate-300 hover:text-white bg-slate-800 p-1.5 rounded-full"><X size={18} /></button>
          </div>
          <div className="w-full max-h-[25vh] overflow-auto rounded-lg border border-slate-700 bg-black flex justify-center max-w-[1600px] mx-auto"><img src={scannedImage} alt="스캔본" className="object-contain w-full h-auto" /></div>
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
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">PERMAHYD HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 22.9.5</span></h1>
        </div>
        <button className="flex items-center space-x-2 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white px-4 py-2 rounded-full font-bold transition-colors shadow-lg"><FolderOpen size={16} /><span>엑셀 DB 동기화</span></button>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start h-auto lg:h-[calc(100vh-75px)] overflow-y-auto lg:overflow-hidden">
        
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
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="차량번호 (예: 12가3456)" className="bg-white border border-slate-300 px-3 py-2 rounded-md text-sm font-bold focus:outline-none w-full sm:w-1/3 shadow-inner" />
                <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="차종 (예: G80)" className="bg-white border border-slate-300 px-3 py-2 rounded-md text-sm font-bold focus:outline-none w-full sm:w-1/3 shadow-inner" />
                <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 (예: UG4)" className="bg-white border border-slate-300 px-3 py-2 rounded-md text-sm font-bold focus:outline-none w-full sm:w-1/3 uppercase shadow-inner" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="작업내용 (예: 프론트 범퍼 보수)" className="bg-white border border-slate-300 px-3 py-2.5 rounded-md text-sm font-bold focus:outline-none w-full sm:w-1/2 shadow-inner" />
                <input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="특이사항 (선택사항)" className="bg-yellow-50 border border-yellow-300 px-3 py-2.5 rounded-md text-sm font-bold focus:outline-none w-full sm:w-1/2 shadow-inner" />
              </div>
              <div className="flex w-full gap-1.5 mt-1">
                <button onClick={() => setIsBaseConfirmed(!isBaseConfirmed)} className={`flex-1 px-3 py-2.5 rounded-md text-sm font-bold flex items-center justify-center shadow-md transition-colors ${isBaseConfirmed ? 'bg-slate-200 text-slate-500' : 'bg-slate-800 text-white'}`}>{isBaseConfirmed ? <Lock size={14} className="mr-1"/> : <Unlock size={14} className="mr-1"/>}확정</button>
                <button onClick={copyToExcel} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-md text-sm font-black flex items-center justify-center shadow-md transition-colors"><FileSpreadsheet size={16} className="mr-1.5" />엑셀 복사</button>
                <button onClick={shareToKakao} className="flex-1 bg-[#FEE500] hover:bg-[#FADA0A] text-slate-900 px-3 py-2.5 rounded-md text-sm font-black flex items-center justify-center shadow-md transition-colors"><Share2 size={16} className="mr-1.5" />공유</button>
                <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-3 py-2.5 rounded-md flex items-center justify-center shrink-0 transition-colors hover:bg-red-50"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 bg-white relative min-h-[350px] lg:min-h-0">
            <div className="mb-4 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2"><Beaker size={16} className="text-indigo-600" /><span className="text-xs font-bold text-indigo-800">전체 사용량 일괄 조절</span></div>
                <div className="flex items-center gap-1.5">
                    <input type="text" inputMode="decimal" value={scaleFactor} onChange={(e) => setScaleFactor(e.target.value.replace(/[^0-9.]/g, ''))} className="w-12 text-center text-sm font-black text-indigo-700 border border-indigo-200 rounded py-1 focus:outline-none focus:border-indigo-500 shadow-inner" />
                    <span className="text-xs font-bold text-indigo-400 mr-1">배</span>
                    <button onClick={() => handleScaleAll(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm transition-colors flex items-center gap-1">× 곱하기</button>
                    <button onClick={() => handleScaleAll(false)} className="bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-100 text-xs font-bold px-3 py-1.5 rounded shadow-sm transition-colors flex items-center gap-1">÷ 나누기</button>
                </div>
            </div>

            <div className="space-y-2 pb-4">
              <div className="text-xs font-black text-slate-400 flex items-center justify-between border-b pb-1.5">
                <span>▼ 베이스 코트 (Ground Coat)</span>
                <label className="flex items-center cursor-pointer bg-slate-50 px-2 py-0.5 rounded border">
                  <span className="mr-1.5 text-[11px] font-bold text-purple-700">3Coat 모드</span>
                  <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                  <div className={`w-8 h-4 rounded-full transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isThreeCoatMode ? 'transform translate-x-3' : ''}`}></div>
                </label>
              </div>

              {toners.map((toner) => {
                const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '', details: [] };
                const isEffect = info.type !== 'solid' && info.type !== 'binder';
                return (
                  <div key={toner.id} className="flex flex-col bg-slate-50 hover:bg-blue-50/50 p-2.5 mb-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                      <div className="flex w-16 h-10 sm:h-12 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                         <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                         <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                      </div>
                      <div className="flex flex-col flex-1 w-full">
                         <div className="flex items-center gap-2 mb-0.5">
                             <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, false)} inputMode="numeric" pattern="[0-9]*" className="w-24 text-sm font-black uppercase border border-slate-300 rounded px-1.5 py-0.5 focus:border-blue-500 focus:outline-none shadow-inner" placeholder="코드" />
                             <span className="font-bold text-blue-700 text-xs truncate">{info.role || '안료미지정'}</span>
                         </div>
                         {info.details && info.details.length > 0 ? (
                             <div className="flex flex-col gap-1 mt-0.5">
                                 {info.details.slice(0, 2).map((d: any, idx: number) => (
                                     <div key={idx} className="flex items-start gap-1.5"><span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-slate-500 border-slate-200 leading-none">{d[0]}</span><span className="text-[11px] text-slate-600 leading-tight break-keep whitespace-pre-wrap">{d[1]}</span></div>
                                 ))}
                             </div>
                         ) : <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-tight break-keep">{info.desc}</p>}
                      </div>
                      <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0 shadow-sm">
                         <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} onBlur={e => handleWeightBlur(toner.id, e.target.value, false)} onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} className="w-20 text-right text-base font-black text-blue-600 focus:outline-none clean-number-input" placeholder="" />
                         <span className="text-xs font-bold text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => removeToner(toner.id, false)} className="ml-1"><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
                      </div>
                    </div>
                    {toner.history && toner.history.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 pl-1 border-t border-dashed border-slate-200 pt-1.5">
                        <span className="font-bold text-slate-400 flex items-center gap-1"><History size={12}/> 이력 ({toner.history.length}회):</span>
                        <div className="flex flex-wrap gap-1">
                          {toner.history.map((hVal: string, hIdx: number) => (
                            <button key={hIdx} onClick={() => handleWeightInputChange(toner.id, hVal, false)} className="px-2 py-0.5 bg-slate-200 hover:bg-blue-600 hover:text-white rounded text-[10px] font-black tracking-tighter transition-all" title="클릭 시 이 단계 값으로 즉시 복원">{hIdx + 1} ({hVal}g)</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <button onMouseDown={(e) => e.preventDefault()} onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold text-xs hover:border-blue-500 flex justify-center items-center gap-1 transition-colors"><Plus size={12}/>베이스 안료 추가</button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-2 border-t border-purple-100 space-y-2 pb-8">
                <div className="text-xs font-black text-purple-700 mb-2 flex items-center">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const info = TONER_DB[toner.code] || { role: '', type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', desc: '', details: [] };
                  const isEffect = info.type !== 'solid' && info.type !== 'binder';
                  return (
                    <div key={toner.id} className="flex flex-col bg-purple-50/20 p-2.5 mb-1.5 rounded-xl border border-purple-100 shadow-sm transition-colors">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                        <div className="flex w-16 h-10 sm:h-12 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                           <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                           <div className="flex-1 border-l border-purple-200" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                        </div>
                        <div className="flex flex-col flex-1 w-full">
                           <div className="flex items-center gap-2 mb-0.5">
                               <input ref={el => { codeRefs.current[toner.id] = el; }} value={toner.code} onChange={e => handleCodeChange(toner.id, e.target.value, true)} inputMode="numeric" pattern="[0-9]*" className="w-24 text-sm font-black uppercase border border-purple-200 rounded px-1.5 py-0.5 text-purple-800 shadow-inner focus:outline-none focus:border-purple-500" placeholder="코드" />
                               <span className="font-bold text-purple-700 text-xs truncate">{info.role || '안료미지정'}</span>
                           </div>
                           {info.details && info.details.length > 0 ? (
                               <div className="flex flex-col gap-1 mt-0.5">
                                   {info.details.slice(0, 2).map((d: any, idx: number) => (
                                       <div key={idx} className="flex items-start gap-1.5"><span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-purple-500 border-purple-200 leading-none">{d[0]}</span><span className="text-[11px] text-slate-600 leading-tight break-keep whitespace-pre-wrap">{d[1]}</span></div>
                                   ))}
                               </div>
                           ) : <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-tight break-keep">{info.desc}</p>}
                        </div>
                        <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-md px-1.5 py-0.5 shrink-0 shadow-sm">
                           <input ref={el => { weightRefs.current[toner.id] = el; }} inputMode="decimal" value={toner.adjustedWeight} onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} onBlur={e => handleWeightBlur(toner.id, e.target.value, true)} onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} className="w-20 text-right text-base font-black text-purple-600 focus:outline-none clean-number-input" placeholder="" />
                           <span className="text-xs font-bold text-slate-400 ml-1 mr-1">g</span>
                           <button onClick={() => removeToner(toner.id, true)} className="ml-1"><Trash2 size={16} className="text-purple-300 hover:text-red-500"/></button>
                        </div>
                      </div>
                      {toner.history && toner.history.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 pl-1 border-t border-dashed border-purple-100 pt-1.5">
                          <span className="font-bold text-slate-400 flex items-center gap-1"><History size={12}/> 이력 ({toner.history.length}회):</span>
                          <div className="flex flex-wrap gap-1">
                            {toner.history.map((hVal: string, hIdx: number) => (
                              <button key={hIdx} onClick={() => handleWeightInputChange(toner.id, hVal, true)} className="px-2 py-0.5 bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white rounded text-[10px] font-black tracking-tighter transition-all" title="클릭 시 이 단계 값으로 즉시 복원">{hIdx + 1} ({hVal}g)</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => addToner(true)} className="w-full py-2.5 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 rounded-md text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-2 shadow-sm"><Plus size={16} /><span>펄 조색제 추가</span></button>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-800 text-slate-100 flex justify-between items-center shrink-0 rounded-b-xl lg:rounded-none z-10 border-t-2 border-slate-700 gap-4">
             <div className="flex flex-col gap-1.5 flex-1 pl-2">
                <span className="text-[11px] text-slate-400 font-bold tracking-wider">A. 베이스 코트 합계</span>
                <span className="text-2xl font-black text-white">{totalBaseWeight}</span>
                <div className="text-blue-300 bg-blue-950/50 px-2 py-1 rounded border border-blue-800/50 text-[11px] inline-flex w-fit items-center mt-1"><Beaker size={12} className="mr-1.5 shrink-0"/> <span>6052: {(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)} <span className="opacity-70 ml-1">({isBaseMetallic ? '메탈 20%' : '솔리드 10%'})</span></span></div>
             </div>
             {isThreeCoatMode && (
             <div className="flex flex-col gap-1.5 flex-1 pl-4 border-l border-slate-600 ml-4">
                <span className="text-[11px] text-slate-400 font-bold tracking-wider">B. 펄 코트 합계</span>
                <span className="text-2xl font-black text-white">{totalPearlWeight}</span>
                <div className="text-purple-300 bg-purple-950/50 px-2 py-1 rounded border border-purple-800/50 text-[11px] inline-flex w-fit items-center mt-1"><Beaker size={12} className="mr-1.5 shrink-0"/> <span>6052: {(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)} <span className="opacity-70 ml-1">({isPearlMetallic ? '메탈 20%' : '솔리드 10%'})</span></span></div>
             </div>
             )}
          </div>
        </div>

        {/* Right Column: 시각화 뷰어 및 지능형 카탈로그 */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-4">
          <div className={`bg-white border ${isBaseConfirmed ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-300'} rounded-xl p-4 shadow-xl flex-none transition-all duration-300`}>
            <h3 className="text-[15px] font-bold mb-3 flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="flex items-center"><Layers className="text-blue-600 mr-2" size={18} />멀티 시각화 렌더링 비교</span>
              <div className="flex gap-2">
                 <button onClick={() => setIsAboutOpen(true)} className="text-xs px-3 py-1.5 rounded bg-indigo-600 text-white font-bold flex items-center hover:bg-indigo-500 shadow-md transition-all"><Info size={12} className="mr-1.5"/>제작 스토리</button>
                 <button onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); }} className="text-xs px-3 py-1.5 rounded bg-slate-800 text-white font-bold flex items-center hover:bg-slate-700 shadow-md transition-all"><Maximize size={12} className="mr-1.5"/>확장 뷰어 열기</button>
              </div>
            </h3>
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-1">
                 <div className="flex justify-between items-center px-1"><span className="text-[11px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">A. 베이스 코트 (Ground Coat)</span></div>
                 <div className={`h-12 rounded-lg border ${isBaseConfirmed ? 'border-slate-300' : 'border-slate-200 opacity-60'} relative overflow-hidden`} style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}>
                   {baseOptics.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge opacity-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E')]"></div>}
                 </div>
              </div>
              {isThreeCoatMode && (
                <div className="flex flex-col space-y-1 relative">
                   <div className="flex justify-between items-center px-1"><span className="text-[11px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded flex items-center"><Zap size={10} className="mr-1"/>B. 펄 코트 (Mid Coat)</span></div>
                   <div className={`h-12 rounded-lg border ${isBaseConfirmed ? 'border-purple-300' : 'border-slate-200'} relative overflow-hidden`} style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` : '#f1f5f9' }}>
                     {isBaseConfirmed && pearlOptics.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge opacity-70 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E')]"></div>}
                   </div>
                </div>
              )}
              <div className="flex flex-col space-y-1 relative">
                 <div className="flex justify-between items-center px-1"><span className="text-[11px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{isThreeCoatMode ? 'C. 최종 3코트 결합' : 'B. 최종 렌더링'}</span></div>
                 <div className={`h-16 rounded-lg border ${isBaseConfirmed ? 'border-blue-400' : 'border-slate-200'} relative overflow-hidden`} style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(finalOptics, 'face')} 0%, ${getColorString(finalOptics, 'mid')} 45%, ${getColorString(finalOptics, 'flop')} 100%)` : '#f1f5f9' }}>
                   {isBaseConfirmed && finalOptics.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge opacity-60 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E')]"></div>}
                 </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[400px]">
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center shrink-0">
                <h3 className="text-white font-black text-base flex items-center"><BookOpen className="mr-2 text-blue-400" size={20}/>수성 안료 조색제 카탈로그</h3>
                <div className="relative w-40"><input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="검색 (예: 블루)" className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-full pl-8 focus:outline-none" /><Search size={14} className="absolute left-2.5 top-1.5 text-slate-400" /></div>
            </div>
            
            <div className="p-5 bg-white border-b border-slate-200 shrink-0">
                <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><span className="text-lg">💡</span> 카탈로그 활용 가이드</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">각 조색제의 세부 특성을 현장 상황에 맞게 즉각적으로 파악할 수 있도록 데이터가 분류되어 있습니다.<br/>라벨의 색상을 통해 정보의 성격을 빠르게 확인하세요.</p>
                <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                    <span className="px-2 py-1 bg-white text-slate-600 rounded border border-slate-200 shadow-sm">일반 특성</span>
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded border border-emerald-200 shadow-sm">색상 및 외관 변화</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200 shadow-sm">용도 및 적용 컬러</span>
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 rounded border border-purple-200 shadow-sm">배합 및 혼합 비율</span>
                    <span className="px-2 py-1 bg-red-50 text-red-600 rounded border border-red-200 shadow-sm shadow-red-100">경고 및 주의사항</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-slate-100">
                {sortedCatalog.map((item) => {
                    const isMetallic = item.type !== 'solid' && item.type !== 'binder';
                    const isCurrentlyUsed = activeCodes.includes(item.code);
                    return (
                        <div key={item.code} className={`flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isCurrentlyUsed ? 'border-l-4 border-l-blue-600 border-blue-300 bg-blue-50/20 shadow-md transform scale-[1.01]' : 'border-slate-200'}`}>
                            <div className="w-full sm:w-28 h-16 sm:h-auto flex-shrink-0 relative border-b sm:border-b-0 sm:border-r border-slate-200 cursor-pointer hover:brightness-110 transition-all" onClick={() => setSelectedTonerForView(item.code)} style={getCachedTexture(item.type, item.face, item.flop, isMetallic)}>
                                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-black px-1.5 py-0.5 rounded">{item.code}</div>
                            </div>
                            <div className="p-3 flex-1 flex flex-col justify-center">
                                <div className="font-black text-slate-800 text-xs mb-1 flex items-center justify-between">
                                    {item.role}
                                    {isCurrentlyUsed && <span className="text-[9px] bg-blue-600 text-white px-1.5 rounded-full font-bold shadow-sm">배합중</span>}
                                </div>
                                <div className="flex flex-col gap-1.5 mt-2">
                                    {item.details?.map((d: any, idx: number) => (
                                        <div key={idx} className="flex items-start gap-1.5">
                                            <span className={`shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border leading-none ${item.badgeColor}`}>{d[0]}</span>
                                            <span className="text-[11px] text-slate-600 leading-relaxed break-keep" dangerouslySetInnerHTML={{__html: d[1]}}></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>

      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white font-sans animate-in fade-in duration-300 backdrop-blur-xl select-none">
          <header className="p-6 flex justify-between items-center bg-black/50 border-b border-slate-800">
            <h2 className="text-xl font-bold tracking-widest text-slate-300 uppercase flex items-center"><Camera className="mr-3 text-blue-500"/> HI-TEC MULTI 3D VIEW</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-500 rounded-full transition-colors border border-slate-700"><X size={24}/></button>
          </header>
          
          <div className="w-full bg-slate-900 border-b border-slate-700 p-3 overflow-x-auto flex gap-3 items-center custom-scrollbar shrink-0 shadow-xl">
             <div className="text-[10px] font-black text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-800/50 shrink-0 mr-1 text-center leading-tight">배합<br/>실시간수정</div>
             {toners.filter(t => t.code).map(t => (
                <div key={t.id} className="flex flex-col bg-slate-800 border border-slate-600 rounded p-2 shrink-0 min-w-[240px] items-center shadow-inner">
                   <span className="text-[11px] font-bold text-slate-300 mb-2">{t.code}</span>
                   <div className="flex items-center space-x-1 w-full justify-between">
                      <div className="flex space-x-1">
                        <button onClick={() => quickEditWeight(t.id, -10, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-10</button>
                        <button onClick={() => quickEditWeight(t.id, -1, false)} className="bg-slate-700 hover:bg-slate-600 w-7 h-6 rounded flex items-center justify-center font-bold text-[9px] text-slate-300">-1</button>
                        <button onClick={() => quickEditWeight(t.id, -0.1, false)} className="bg-red-900/50 hover:bg-red-500 text-red-100 w-8 h-6 rounded flex items-center justify-center font-bold text-[10px] border border-red-800/50">-0.1</button>
                      </div>
                      <div className="flex items-center px-1"><input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, false)} placeholder="" className="w-20 text-center bg-transparent text-sm font-black text-white outline-none" /></div>
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
                          <div className="flex items-center px-1"><input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, true)} placeholder="" className="w-20 text-center bg-transparent text-sm font-black text-white outline-none" /></div>
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

          <main ref={viewerRef} className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)} onPointerLeave={() => setIsDraggingLight(false)}>
             <div className="absolute z-50 flex items-center justify-center transition-transform duration-75 pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}><div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_60px_#fff] border border-white/30 animate-pulse"><Sun className="text-yellow-100" size={32} /></div></div>
             <div className="flex-1 w-full h-[45%] md:h-[80%] rounded-[1.5rem] border border-slate-700 relative overflow-hidden shadow-2xl transition-colors duration-200" style={{ background: getInteractiveBackground(originalFinalOptics, lightPos) }}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                {originalFinalOptics?.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" style={{ opacity: lerp(0.4, 0.05, Math.min(1, Math.sqrt(Math.pow(lightPos.x - 50, 2) + Math.pow(lightPos.y - 50, 2)) / 50)) }}></div>}
                <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded-lg font-bold text-xs border border-slate-600 text-slate-300 shadow-md">A. 원본 배합 (변경 전)</div>
             </div>
             <div className="text-slate-600 pointer-events-none shrink-0 hidden md:block"><ChevronRight size={32} /></div>
             <div className="flex-1 w-full h-[45%] md:h-[80%] rounded-[1.5rem] border-2 border-blue-500 relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-colors duration-200" style={{ background: getInteractiveBackground(finalOptics, lightPos) }}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                {finalOptics?.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" style={{ opacity: lerp(0.4, 0.05, Math.min(1, Math.sqrt(Math.pow(lightPos.x - 50, 2) + Math.pow(lightPos.y - 50, 2)) / 50)) }}></div>}
                <div className="absolute top-4 left-4 bg-blue-900/90 px-3 py-1.5 rounded-lg font-bold text-xs border border-blue-400 text-white shadow-md flex items-center"><Zap size={12} className="mr-1.5 text-yellow-300 animate-pulse"/>B. 실시간 시뮬레이션 (변경 후)</div>
             </div>
             <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex bg-slate-900/90 p-2.5 rounded-2xl border border-slate-700 gap-2 shadow-2xl backdrop-blur-md">
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 50, y: 50}); }} className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-600 transition-colors">정면 (15°)</button>
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 25, y: 25}); }} className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-600 transition-colors">중면 (45°)</button>
                <button onClick={(e) => { e.stopPropagation(); setLightPos({x: 5, y: 5}); }} className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-600 transition-colors">측면 (110°)</button>
             </div>
          </main>
        </div>
      )}

      {selectedTonerForView && TONER_DB[selectedTonerForView] && (
        <div className="fixed inset-0 bg-slate-900/85 z-[120] flex items-center justify-center backdrop-blur-xs animate-in fade-in duration-150 p-4">
           <div className="bg-white rounded-2xl w-[600px] max-w-full shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[85vh]">
              <div className="bg-slate-900 p-4 flex justify-between items-center shrink-0">
                 <h3 className="text-white font-bold text-sm flex items-center"><Droplet className="mr-1.5 text-blue-400" size={16}/> {selectedTonerForView} 단일 안료 정밀 분석 뷰어</h3>
                 <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar">
                 <div className="text-xl font-black text-blue-700 mb-1">{TONER_DB[selectedTonerForView].role}</div>
                 <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                    {TONER_DB[selectedTonerForView].details?.map((d: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5"><span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-slate-600 border-slate-300 leading-none">{d[0]}</span><span className="text-xs text-slate-700 leading-relaxed break-keep" dangerouslySetInnerHTML={{__html: d[1]}}></span></div>
                    ))}
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                       <div className="text-[10px] font-bold text-slate-400 mb-1 text-center bg-slate-100 py-1.5 rounded shadow-xs uppercase tracking-widest">정면 (Face 15°)</div>
                       <div className="h-32 sm:h-40 rounded-xl border border-slate-300 relative overflow-hidden" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'face')}}>
                           {isTonerMetallic(TONER_DB[selectedTonerForView].role) && <div className="metallic-flake opacity-50"></div>}
                       </div>
                    </div>
                    <div className="flex-1">
                       <div className="text-[10px] font-bold text-slate-400 mb-1 text-center bg-slate-100 py-1.5 rounded shadow-xs uppercase tracking-widest">측면 (Flop 110°)</div>
                       <div className="h-32 sm:h-40 rounded-xl border border-slate-300 relative overflow-hidden" style={{background: getTonerDetailBackground(selectedTonerForView, TONER_DB[selectedTonerForView].role, 'flop')}}>
                           {isTonerMetallic(TONER_DB[selectedTonerForView].role) && <div className="metallic-flake opacity-25"></div>}
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedTonerForView(null)} className="bg-slate-800 text-white py-2.5 rounded-xl font-bold w-full text-sm shadow-md mt-5 hover:bg-slate-700 transition-colors">닫기</button>
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
        .clean-number-input { font-variant-numeric: tabular-nums; -webkit-text-fill-color: #0f172a; }
        .metallic-flake { position: absolute; inset: 0; pointer-events: none; z-index: 1; mix-blend-mode: color-dodge; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E"); }
      `}} />
    </div>
  );
}
