// src/clearGuideData.ts
// Clear 가이드 데이터: 제조사 공식 페이지 / TDS / 업계 보도에 적힌 내용만 수록.
// 제품마다 source 에 출처를 남겼습니다. 내용 수정은 이 파일만 고치면 됩니다.

export interface ClearProduct {
  id: string;
  name: string;
  tag: string;
  mix?: string;
  hardener?: string;
  reducer?: string;
  dry?: string;
  film?: string;
  points: string[];
  notes?: string[];
  source: string;
}

export interface ClearBrand {
  id: string;
  name: string;
  color: 'blue' | 'emerald' | 'orange';
  intro: string;
  hardenerNote?: string;
  products: ClearProduct[];
}

export interface PurposeRow {
  purpose: string;
  items: { brand: string; product: string; fact: string }[];
}

export const CLEAR_DISCLAIMER =
  '본 가이드는 제조사 공식 홈페이지, 기술자료(TDS), 업계 보도에 적힌 내용만 정리한 참고용 자료입니다. 제품 구성과 경화제·희석제 규격은 국가와 TDS 버전에 따라 다를 수 있으므로, 작업 전 반드시 제조사 최신 TDS 또는 기술지원팀에 확인하세요. 본 정보를 그대로 따라 발생한 문제에 대해 개발자는 책임지지 않습니다.';

export const CLEAR_BRANDS: ClearBrand[] = [
  {
    id: 'sh',
    name: '스피스헥커',
    color: 'blue',
    intro: '엑솔타(Axalta) 계열 퍼마솔리드(Permasolid) HS 클리어 라인입니다.',
    hardenerNote:
      'VHS 경화제 표기(유럽 TDS): 3220 fast · 3225 · 3230 slow · 3240 extra slow. 미국 TDS는 3220 Express · 3230 Medium · 3240 Slow · 3245 Extra Slow로 표기가 다릅니다. 경화제와 희석제는 작업 온도와 수리 면적에 맞춰 선택합니다(TDS).',
    products: [
      {
        id: 'sh-8055',
        name: '퍼마솔리드 HS 클리어 8055',
        tag: '프리미엄 HS 클리어 (하이-텍 퍼포먼스 시스템용)',
        mix: '3 : 1 (VHS 경화제)',
        hardener: 'VHS 3220 fast · 3225 · 3230 slow · 3240 extra slow',
        reducer: '첨가제 9034(15~30°C 일반 수리) · 9035 slow(25°C 이상 대형 수리, 3240 조합 권장) 5%',
        dry: '20°C 12~16시간 · 60~65°C 25~35분 (플래시오프 5~10분)',
        film: '1.5회 50~60µm · 2회 50~70µm',
        points: [
          '1.5회(권장) 또는 2회 도장',
          '높은 안정성, 우수한 수직 안정성',
          '뛰어난 광택과 살오름성',
          '기존 프리미엄 HS 투명 대비 뛰어난 건조 성능',
          '건조 후 최종 경도 양호',
        ],
        notes: [
          '첨가제 규정은 TDS 버전마다 다릅니다. 구 TDS는 9034 5%, 2024년판은 Phoenix 제품믹스표 참조로 기재되어 있습니다.',
        ],
        source: '스피스헥커 한국·영국 제품 페이지, TDS EN/8055A.31 (2024.01.17), TDS 8055/06, 8034 TDS(첨가제)',
      },
      {
        id: 'sh-8034',
        name: '퍼마솔리드 HS 클리어 8034',
        tag: '2K 아크릴 고광택 HS 클리어 (VOC 준수)',
        mix: '3 : 1 (VHS 경화제) + 첨가제 최대 5%',
        hardener:
          '3220 fast(스피드·패널 수리) · 3225(패널/멀티패널) · 3230 slow(수평면, 멀티패널~전체) · 3240 extra slow(수평면, 멀티패널~전체)',
        reducer: '첨가제 9034 / 9035 slow',
        dry: '20°C 밤새 · 60°C 약 30~35분 (플래시오프 5~10분)',
        film: '50~60µm',
        points: [
          '2회 도장 권장, 1.5회 도장 가능 (1.5회 시 중간 0~2분, 최종 5~10분 플래시오프)',
          '탁월한 탑코트 내구성',
          '우수한 수직 안정성',
          '우수한 폴리싱 작업성',
          '탁월한 살오름성 및 광택',
        ],
        notes: ['60°C 건조시간은 2013년판 TDS 기준입니다. 최신 TDS를 확인하세요.'],
        source: '스피스헥커 한국 제품 페이지, TDS EN/8034A, TDS 8034 (2013.10.23)',
      },
      {
        id: 'sh-8700',
        name: '퍼마솔리드 HS 레이스 클리어 8700',
        tag: '속건 레이스 클리어 (경미한 손상~전체 도장)',
        mix: '2 : 1 : 10% (레이스 경화제 3470 + 레이스 첨가제 9070)',
        hardener: 'VHS 레이스 경화제 3470 (고온다습용 슬로우 경화제 별도 구성)',
        reducer: '레이스 첨가제 9070 10% (고온다습용 슬로우 첨가제 별도 구성)',
        dry: '60°C 15분 · 40°C 30분 · IR 건조 가능',
        points: [
          '2회 도장, 짧은 플래시오프',
          '저점도 신기술 바인더로 우수한 퍼짐성',
          '수직 안정성 양호, 높은 광택',
          '오븐 건조 후 짧은 냉각 뒤 바로 폴리싱·조립 가능',
        ],
        notes: ['슬로우 경화제·첨가제의 품번은 공식 페이지에 명시되어 있지 않아 적지 않았습니다.'],
        source: '스피스헥커 한국·영국 제품 페이지, 2018 출시 보도(Autobiz, Paint & Panel)',
      },
      {
        id: 'sh-8810',
        name: '퍼마솔리드 HS 스피드 클리어 8810',
        tag: '스피드 HS 클리어',
        mix: '2 : 1 (별도 신너·첨가제 없이)',
        points: [
          '1.5회 또는 2회 도장',
          '높은 고형분에도 스프레이 점도가 낮아 작업성과 살오름성 확보',
          '우수한 광택 유지력',
        ],
        notes: ['경화제 품번과 건조시간은 확인하지 못했습니다. TDS를 참조하세요.'],
        source: '스피스헥커 한국 제품 페이지',
      },
      {
        id: 'sh-8450',
        name: '퍼마솔리드 HS 다이아몬드 클리어 8450',
        tag: '스크래치 방지 기능 HS 클리어',
        mix: '3 : 1 (VHS 경화제 3240, 미국 TDS 기준)',
        hardener: 'VHS 3240',
        points: [
          '내스크래치성이 높은 OEM 클리어가 적용된 차량의 보수용',
          '우수한 물리·화학 특성, 손쉬운 작업성',
          '뛰어난 광택과 반영구적 광택 유지력',
          '매우 우수한 폴리싱 작업성',
          '우수한 내후성·내자외선',
        ],
        notes: [
          'ASAP(초속건) 전용 공정에서만 2 : 1 (+ 9050 10%)이며, 그 외 용도는 3 : 1입니다.',
          '2회 도장 시 중간 플래시오프 5~15분, 또는 중간 코트 1회 + 본 코트 1회(플래시오프 없이).',
        ],
        source: '스피스헥커 한국·영국 제품 페이지, 미국 TDS 8450 / 8450.1',
      },
      {
        id: 'sh-matt',
        name: '퍼마크론 매트 클리어코트 시스템 8185 / 8170',
        tag: '무광(8185) · 반광(8170) 전용 시스템',
        points: [
          '두 제품을 비율별로 혼합해 광택도 조절 (일반 투명 사용 안 함)',
          '모든 OEM 브랜드의 무광 컬러 매칭이 가능한 넓은 광택도 범위',
          '작업자·스프레이 패턴에 덜 좌우되는 높은 컬러 재현성',
          '얼룩 없이 매끈한 외관, 부드러운 표면 질감',
        ],
        source: '스피스헥커 한국 제품 페이지',
      },
    ],
  },
  {
    id: 'gl',
    name: '글라슈리트',
    color: 'emerald',
    intro:
      'BASF의 프리미엄 리피니시 브랜드입니다. 제품 구성은 지역별로 다르며, 923-365·923-230은 북미, 923-526 F는 아시아/태평양 한정으로 기재되어 있습니다. 국내 취급 여부는 총판에 확인하세요.',
    hardenerNote:
      '923- 클리어용 경화제(Glasurit TechInfo): HS 경화제 929-91(소면적·저온 수리) · 929-93(RATIO 시스템) · 929-94(대면적·고온 30°C 초과). VOC 경화제는 929-33 normal · 929-31 fast · 929-34 slow, 923-610/625/630/645용은 929-63 normal · 929-61 fast · 929-64 slow.',
    products: [
      {
        id: 'gl-631',
        name: '923-631 HS 클리어 (superior gloss)',
        tag: '완벽한 흐름, 프리미엄 광택과 광휘를 내세운 HS 클리어',
        mix: '3 : 1 : 1 (용량비)',
        hardener: '929-68, -61, -63, -64 (33%)',
        reducer: '352-10, -30, -40, -70 (33%)',
        dry: '523-15 레이싱 첨가제 변형 기준: 20°C 4시간 · 60°C 20분',
        film: '40~60µm',
        points: [
          '2회 도장 또는 1/2 + 1회(중간 플래시오프 없이)',
          '2회 도장 시 중간 플래시오프 3~5분',
          '523-15 글라슈리트 레이싱 첨가제로 건조시간 단축 가능',
        ],
        source: 'Glasurit TechInfo 923-631, 923-631 Variant 523-15',
      },
      {
        id: 'gl-115',
        name: '923-115 HS 유니버설 클리어 VOC',
        tag: '범용 HS 클리어',
        points: [
          '높은 고형분, 안전한 분사성',
          '우수한 흐름과 레벨링',
          '빠른 건조, 우수한 표면 경도',
          '폴리싱성과 테이프 내성',
        ],
        source: 'Glasurit 공식 제품 페이지(UAE)',
      },
      {
        id: 'gl-35',
        name: '923-35 HS 클리어 VOC',
        tag: 'VOC 대응 표준용 HS 클리어',
        points: [
          '높은 고형분',
          '매우 우수한 내스크래치성',
          '우수한 내후성·내황변성',
          '폴리싱과 마스킹을 빠르게 진행 가능',
        ],
        source: 'Glasurit 공식 제품 페이지(UAE)',
      },
      {
        id: 'gl-447',
        name: '923-447 HS 클리어 내스크래치 VOC',
        tag: '내스크래치 HS 클리어',
        points: [
          '내스크래치 보수용 클리어, 개선된 작업성과 레벨링, 좋은 흐름',
          '짧은 건조시간',
          '대면적 도장에 적합, 선명한 탑코트 외관',
        ],
        source: 'Glasurit 공식 제품 페이지(UAE)',
      },
      {
        id: 'gl-526',
        name: '923-526 F 멀티 퍼포즈 클리어 (아시아/태평양 한정)',
        tag: '개별 패널 수리~전체 도장용 범용 클리어',
        mix: '2 : 1 : 10%',
        hardener: '929-91, -93, -94 (50%)',
        reducer: '352-91, -50, -216 (10%)',
        film: '50~60µm',
        points: [
          '빠른 건조, 좋은 폴리싱성과 테이프 내성, 좋은 마감 품질',
          '2회 도장, 중간 플래시오프 0~5분 (20°C)',
          '분사 점도 DIN 4 15~19초, 가사시간 20°C 3시간',
        ],
        notes: ['경화제·희석제는 주변 온도와 도장 면적에 맞춰 선택(TDS).'],
        source: 'Glasurit TechInfo 923-526 F',
      },
      {
        id: 'gl-365',
        name: '923-365 글래머 프로덕션 클리어 (북미)',
        tag: '고생산성 속건 클리어',
        points: [
          '기후 조건과 관계없이 베이크 사이클 최단 15분 (BASF 보도)',
          '표준 베이크 클리어 대비 생산성 향상을 내세움 (BASF 보도)',
        ],
        source: 'FenderBender 보도(BASF 자료)',
      },
      {
        id: 'gl-230',
        name: '923-230 Low VOC 멀티 퍼포즈 글로스 클리어 (북미)',
        tag: 'Low VOC 범용 클리어',
        points: ['북미 Glasurit 매뉴얼에 Low VOC Multi-Purpose Gloss Clear로 수록', '2 : 1 과 3 : 1 두 가지 혼합비 버전이 있음'],
        notes: ['상세 규격은 해당 TDS를 확인하세요.'],
        source: 'Glasurit 북미 기술 매뉴얼 (2018)',
      },
      {
        id: 'gl-144',
        name: '923-144 MS 레이싱 클리어',
        tag: '단일 패널·소규모 수리용 속건 클리어',
        dry: '60°C 15분 경화 (공기 건조도 가능)',
        points: ['빠른 건조, 우수한 폴리싱성', '수리 부위를 작게 유지해 재료 사용량 절감'],
        source: 'Glasurit 공식 제품 페이지(UAE)',
      },
      {
        id: 'gl-55',
        name: '923-55 엑스트라 매트 클리어 (+ 923-58)',
        tag: '무광·반광 보수용 2액형 클리어',
        mix: '100 : 33 : 17 (중량비, 923-55 : 929-33 : 352-91)',
        dry: '20°C 7시간 · 60°C 30분',
        film: '40~50µm',
        points: [
          '극무광, 가소화 타입 (극무광 OEM 도장 보수용)',
          '923-58 MS 클리어 매트 엘라스티파이드와 혼합해 광택도 조절',
          '매트가 될 때까지 플래시오프: 1차 후 10~15분, 2차 후 15~20분 (25분 초과 금지)',
        ],
        notes: ['923-55는 믹싱 선반(mixing shelves)에서 사용할 수 없습니다.'],
        source: 'Glasurit TechInfo 923-55 Variant 929-33',
      },
      {
        id: 'bl-10',
        name: 'baslac 40-10 2K 패널 클리어',
        tag: 'BASF 별도 브랜드 baslac · 스팟/패널 수리용 속건',
        mix: '2 : 1 : 10%',
        points: ['스팟·패널 수리용 속건 클리어', 'baslac은 BASF Coatings의 별도 리피니시 브랜드입니다 (글라슈리트 제품이 아님)'],
        source: 'baslac Product Portfolio 2021, baslac 공식 사이트',
      },
      {
        id: 'bl-40',
        name: 'baslac 40-40 HS 유니버설 클리어',
        tag: 'BASF 별도 브랜드 baslac · HS 범용',
        mix: '2 : 1 : 10%',
        hardener: '50-20, -30 (50%)',
        reducer: '60-10, -20, -30, -40 (10%)',
        film: '50~70µm',
        points: [
          '높은 고형분, 우수한 내후성',
          '좋은 폴리싱성, 높은 광택',
          '2회 도장, 코트 사이 플래시오프 2~3분 (20°C)',
        ],
        source: 'baslac TDS 40-40 (2020.05)',
      },
    ],
  },
  {
    id: 'sk',
    name: '시켄스',
    color: 'orange',
    intro:
      '아크조노벨(AkzoNobel) Sikkens 오토크리어(Autoclear) 라인입니다. 제품 구성과 혼합비는 지역(영국·APAC·북미)별 TDS가 서로 다릅니다.',
    products: [
      {
        id: 'sk-lv',
        name: '오토크리어 LV (Autoclear LV)',
        tag: '모든 수리 크기용 표준 클리어 (30°C까지)',
        mix: '100 : 50 : 10 (= 2 : 1 : 10%)',
        hardener: 'Autoclear LV 전용 경화제 1종',
        reducer: 'Autoclear LV 전용 희석제 1종',
        dry: '60°C 20분',
        points: [
          '전용 경화제·희석제 1종씩으로 혼합비 단순',
          '쉬운 도장, 빠른 경화, 좋은 광택과 높은 표면 경도',
          '2 x 1코트: 중간 닫힌 코트 후 플래시오프 뒤 본 코트',
          '건 1.2~1.4mm, 공급 압력 1.7~2.2bar, HVLP 캡 압력 최대 0.6~0.7bar',
        ],
        source: 'Sikkens 공식 제품 페이지, TDS S1.05.05 UK & Ireland (2020.11.17)',
      },
      {
        id: 'sk-superior',
        name: '오토크리어 LV 슈페리어 (Autoclear LV Superior)',
        tag: '모든 수리 크기·도장 조건 대응 고광택 HS 클리어',
        mix: '100 : 60 : 20',
        hardener: 'Autoclear LV Superior 경화제 (전 수리 크기 공용)',
        reducer:
          'Fast(20°C 이하 스팟·패널) · Medium(20~35°C 스팟·패널) · Slow(25~45°C 대면적·전체 도장) / Accelerator(30°C 이하 스팟·패널)',
        dry: '60°C: Fast 15분 · Medium 25분 · Slow 35분 / 20°C: 6 · 7 · 8시간 / Accelerator 사용 시 60°C 12분',
        points: [
          '매우 안정적이고 신뢰성 높은 물성과 높은 광택 (공식)',
          '일부 지역 공식 페이지에는 self-healing(자가 복원) 클리어로 기재',
          '지역별로 클리어·희석제 구성이 다름 (예: 호주는 클리어 2종, 경화제 1종, 희석제 3종 중 가속제 포함)',
        ],
        source: 'Sikkens 공식 제품 페이지, TDS S1.05.01 UK & Ireland, Sikkens Accelerator 소개',
      },
      {
        id: 'sk-excl',
        name: '오토크리어 LV 엑스클루시브 (Autoclear LV Exclusive)',
        tag: '스크래치 저항 클리어',
        points: [
          '내마모성이 높고 도장이 쉬운 고광택 클리어',
          '스크래치가 나도 햇빛 열에 노출되면 스스로 복원되는 재유동(re-flow) 특성',
          '우수한 광택 유지력, 스팟 수리~전체 도장 대응',
        ],
        notes: ['혼합비는 해당 TDS를 확인하세요.'],
        source: 'Sikkens 공식 제품 페이지(EX)',
      },
      {
        id: 'sk-expert',
        name: '오토크리어 엑스퍼트 HS (Autoclear Expert HS)',
        tag: '프리미엄 광택 + 다양한 건조 옵션',
        mix: '100 : 50 : 5~10 (APAC TDS) / ECO 경화제 사용 시 100 : 50 : 10~15',
        hardener: 'P 경화제 P25 / P35 (ECO 경화제 별도)',
        reducer: 'Plus 희석제 Fast/Medium/Slow/Extra Slow 또는 Xpress Dry 희석제',
        points: [
          '프리미엄 광택, 다양한 건조 옵션',
          '스팟 수리부터 전체 도장까지, Autobase Plus 베이스코트 위 사용',
          '측정봉 3번(보라), HVLP 캡 압력 최대 0.6~0.7bar',
        ],
        source: 'Sikkens 공식 제품 페이지(SG), TDS S1.05.32 APAC (2023.10.12)',
      },
      {
        id: 'sk-perf',
        name: '오토크리어 퍼포먼스 LV (Autoclear Performance LV)',
        tag: '플렉스 화학 내장 클리어',
        points: ['플렉스(flex) 화학이 내장되어 모든 수리 크기와 도장 조건에 대응', 'Autowave 또는 Autobase Plus 위 사용'],
        notes: ['혼합비는 해당 TDS를 확인하세요.'],
        source: 'Sikkens 공식 제품 페이지(US)',
      },
      {
        id: 'sk-2121',
        name: '오토크리어 2121 LV (북미)',
        tag: '1.5회 도장 3성분 폴리우레탄 클리어',
        mix: '4 : 1 : 1 (클리어 : 경화제 : 희석제)',
        reducer: 'HT 희석제 또는 LT 희석제 (2종)',
        points: ['Autowave 베이스코트 위 사용', '1.5회 도장으로 작업 시간 단축, 좋은 흐름'],
        source: 'Sikkens 북미 TDS Autoclear 2121 LV',
      },
    ],
  },
];

// 용도별 보기: 각 제조사가 공식 자료에 적은 특징만 나열. 우열 판단은 넣지 않았습니다.
export const CLEAR_BY_PURPOSE: PurposeRow[] = [
  {
    purpose: '속건 / 스피드 리페어',
    items: [
      { brand: '스피스헥커', product: '8700', fact: '60°C 15분 · 40°C 30분' },
      { brand: '글라슈리트', product: '923-144 / 923-365(북미)', fact: '60°C 15분 / 베이크 최단 15분' },
      { brand: '시켄스', product: 'LV 슈페리어 Fast', fact: '60°C 15분 (Accelerator 병용 12분)' },
    ],
  },
  {
    purpose: '범용 (스팟~전체 도장)',
    items: [
      { brand: '스피스헥커', product: '8055 / 8034', fact: '패널·전체 수리용 HS, 1.5~2회 도장' },
      { brand: '글라슈리트', product: '923-115 / 923-526 F(APAC)', fact: 'HS 유니버설 / 패널~전체 범용' },
      { brand: '시켄스', product: 'LV / 엑스퍼트 HS', fact: '모든 수리 크기 / 스팟~전체 도장' },
    ],
  },
  {
    purpose: '공식 문구상 광택 강조',
    items: [
      { brand: '스피스헥커', product: '8055 / 8034', fact: '뛰어난 광택과 살오름성 / 탁월한 살오름성 및 광택' },
      { brand: '글라슈리트', product: '923-631', fact: '완벽한 흐름, 프리미엄 광택과 광휘' },
      { brand: '시켄스', product: 'LV 슈페리어 / 엑스퍼트 HS', fact: '매우 높은 광택 / 프리미엄 광택' },
    ],
  },
  {
    purpose: '내스크래치',
    items: [
      { brand: '스피스헥커', product: '8450', fact: '스크래치 방지 기능, 반영구적 광택 유지력' },
      { brand: '글라슈리트', product: '923-447 / 923-35', fact: '내스크래치 HS 클리어' },
      { brand: '시켄스', product: 'LV 엑스클루시브', fact: '열에 의한 재유동(자가 복원)' },
    ],
  },
  {
    purpose: '무광 / 반광',
    items: [
      { brand: '스피스헥커', product: '8185 무광 + 8170 반광', fact: '두 제품 혼합으로 광택도 조절' },
      { brand: '글라슈리트', product: '923-55 + 923-58', fact: '923-58과 혼합해 광택도 조절' },
      { brand: '시켄스', product: '-', fact: '이 자료에서 공식 확인하지 못함' },
    ],
  },
];
