// ====== [4대 브랜드 클리어코트 통합 마스터 가이드 데이터 & 컴포넌트] ======
interface ClearProductItem {
  code: string;
  name: string;
  badge: string;
  mix?: string;
  hardener?: string;
  reducer?: string;
  gun?: string;
  coats?: string;
  film?: string;
  dry?: string;
  desc: string[];
  verifyNote?: string;
}

interface ClearBrandSection {
  title: string;
  subtitle: string;
  items: ClearProductItem[];
}

interface ClearBrandData {
  id: string;
  flag: string;
  brandNum: string;
  koName: string;
  enName: string;
  hq: string;
  founded: string;
  krDistributor: string;
  systemSummary: string;
  mixSummary: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  intro: string;
  history: { year: string; event: string; status: string }[];
  brandFacts: { claim: string; status: string; fact: string }[];
  sections: ClearBrandSection[];
  conversionNotes?: { title: string; status: string; detail: string }[];
  sources: string[];
}

const CLEAR_MASTER_DISCLAIMER =
  '글라슈리트(BASF) · 스피스헥커(Axalta) · 시켄스(AkzoNobel) · 피피지(PPG) | 제조사 공식 홈페이지, 기술자료(TDS), 공식 보도로 검증한 내용 수록. 제품 구성, 경화제 이름, 배합비는 국가(유럽·영국·아시아태평양·북미)별 TDS가 다릅니다. 국내 취급 여부와 최신 규격은 총판 또는 제조사 기술지원에 확인하세요.';

const CLEAR_4BRANDS_COMPARISON = [
  {
    category: '① 표준 범용 (사계절 메인 클리어)',
    rows: [
      { flag: '🇩🇪', brand: '글라슈리트 P-C-20 / 923-255:', text: '2:1+10% 표준 배합. 90 Line 연동 사계절 범용(P-C-20) 및 고고형분·내황변 멀티 클리어(923-255).' },
      { flag: '🇺🇸', brand: '스피스헥커 Permasolid HS 8030 / 8034 / 8055:', text: 'HS·VHS 경화제 호환 범용(8030), 2K 고광택 표준(8034, 3:1), Hi-TEC 퍼포먼스 시스템용 프리미엄 HS(8055, 3:1).' },
      { flag: '🇳🇱', brand: '시켄스 Autoclear Plus HS / Autoclear LV:', text: '100:50:10(APAC 10~20) 배합. 뛰어난 광택·흐름·살오름성 및 전 베이스코트 대응 표준 클리어.' },
      { flag: '🇺🇸', brand: 'PPG D8135 (UHS) / D800 (Deltron):', text: '전천후 작업 안정성과 두터운 도막감을 제공하는 글로벌 표준 하이솔리드 클리어.' },
    ],
  },
  {
    category: '② 무광 제어 시스템 (순정 매트 컬러 완벽 재현)',
    rows: [
      { flag: '🇩🇪', brand: '글라슈리트 P-C-92 / P-C-94 (및 A-C-90/92, 923-55/58):', text: '얼룩 뭉침을 제어하여 독일 3사 완성차 무광 스펙에 정밀 매칭. 극무광(P-C-92)과 반광(P-C-94) 혼합으로 광택도 조절.' },
      { flag: '🇺🇸', brand: '스피스헥커 Matt System 8022 / 8024 (공식 8185 무광 / 8170 반광, 8085):', text: '믹싱 비율에 따라 순정 무광 광도를 정밀 제어. 일반 투명 혼합 없이 모든 OEM 무광 컬러 매칭 및 얼룩 없는 외관 구현.' },
      { flag: '🇳🇱', brand: '시켄스 Mix & Matt (Mat / Silk Matt 2.0):', text: '저광택 성분과 반광 성분을 혼합해 레진 뭉침을 방지하고 가죽 질감의 실크 매트 표면을 부드럽게 복원.' },
      { flag: '🇺🇸', brand: 'PPG D8115(Matt) / D8117(Semi-Gloss):', text: '람보르기니·현대 매트 컬러 공식 매뉴얼에 등재된 2:1 조색 기반의 무광 클리어 시스템.' },
    ],
  },
  {
    category: '③ ⚡ 에너지 세이빙 저온 건조 (가스비·부스 효율 비교)',
    rows: [
      { flag: '🇩🇪', brand: '글라슈리트 P-C-15 / AraClass A-C-14:', text: '20°C 자연 건조(Air Drying) 특화 고효율 클리어 및 Eco Balance 친환경 저에너지 건조 라인.' },
      { flag: '🇺🇸', brand: '스피스헥커 Speed-TEC 8810 / 8820:', text: '공식 40~45°C 10~15분 또는 20°C 30~55분 건조(현장 세팅 60°C 단시간 열처리 운용). 별도 신너 없이 2:1 배합으로 부스 에너지 대폭 절감.' },
      { flag: '🇳🇱', brand: '시켄스 Autoclear Aerodry (Aero PC):', text: '100:100 배합. 60°C 5분 또는 20°C 대기 온도에서 45분(현장 30~45분) 만에 건조되어 오븐 건조 클리어에 맞먹는 물성 구현.' },
      { flag: '🇺🇸', brand: 'PPG D8177 (Rapid Performance Clear):', text: '60°C 5분 또는 20°C 20분 건조. 가스비 절감과 경화 속도의 균형을 맞춘 초고속 라인.' },
    ],
  },
  {
    category: '④ 속건·고생산성 (스피드 리페어)',
    rows: [
      { flag: '🇩🇪', brand: '글라슈리트 P-C-22 / P-C-10 / A-C-24 / 923-365:', text: '짧은 건조 시간과 낮은 경화 에너지(P-C-22), 스팟~차량 측면 전체 속건(P-C-10), 15분 베이크(923-365).' },
      { flag: '🇺🇸', brand: '스피스헥커 Permasolid HS Race 8700:', text: '2:1+10%(경화제 3470 + 첨가제 9070). 60°C 15분 또는 40°C 30분 건조 후 짧은 냉각 뒤 즉시 폴리싱·재조립.' },
      { flag: '🇳🇱', brand: '시켄스 Autoclear Optima / LV Superior Fast / Rapid Air AS:', text: '60°C 15분(Accelerator 병용 시 12분) 속건 및 소규모 수리용 상온 속건.' },
      { flag: '🇺🇸', brand: 'PPG D8188 / D8177:', text: '1.5코트 원스톱 도장 및 부스 회전율을 극대화하는 고생산성 속건 클리어.' },
    ],
  },
  {
    category: '⑤ 하이엔드 고광택 (쇼카·플래그십 마감)',
    rows: [
      { flag: '🇩🇪', brand: '글라슈리트 P-C-30 / A-C-30 / 923-631:', text: 'High Gloss / Superior Gloss. 하이엔드 외관과 완벽한 광택·레벨링 구현.' },
      { flag: '🇺🇸', brand: '스피스헥커 Permasolid HS 8055 / 8021 / 8034:', text: '뛰어난 광택과 살오름성, 우수한 수직 안정성 및 폴리싱 작업성.' },
      { flag: '🇳🇱', brand: '시켄스 Autoclear LV Superior / Expert HS:', text: '100:60:20 배합(LV Superior). 모든 수리 조건에서 가장 높은 수준의 광택 발현.' },
      { flag: '🇺🇸', brand: 'PPG D8135 / Deltron GRS:', text: '수입 플래그십 세단 및 슈퍼카 보수에 대응하는 깊고 선명한 외관 광택.' },
    ],
  },
  {
    category: '⑥ 내스크래치·자가복원 (고경도·열복원)',
    rows: [
      { flag: '🇩🇪', brand: '글라슈리트 P-C-40 / A-C-40 / 923-645 / 923-447 / 923-35:', text: 'Scratch Resistant VOC 클리어 라인업. 세차 및 외부 마찰에 대한 높은 저항성과 지속 광택.' },
      { flag: '🇺🇸', brand: '스피스헥커 Permasolid HS Diamond 8450:', text: '3:1(VHS 3240). 스크래치 방지 기능, 반영구적 광택 유지력 및 우수한 내후·내자외선성.' },
      { flag: '🇳🇱', brand: '시켄스 Autoclear LV Exclusive / HSR Antiscratch:', text: '태양열에 노출되면 미세 스크래치가 스스로 복원되는 재유동(Self-healing) 기술(LV Exclusive) 및 하이빌드 내스크래치(HSR).' },
      { flag: '🇺🇸', brand: 'PPG D8140 (Ceramiclear):', text: '나노 실리카 결합 구조로 OEM 세라믹 클리어 도막의 긁힘 저항성을 재현.' },
    ],
  },
  {
    category: '⑦ 친환경 · 바이오매스 · 수용성 체계',
    rows: [
      { flag: '🇩🇪', brand: '글라슈리트 AraClass (A-C 전 시리즈):', text: 'Eco Balance 인증. A-C-24는 폐타이어 재활용(cycling®) 원료로 CO₂ 최대 40% 저감(2026 아우디 F1 R26 적용). A-C-80 UV 경화.' },
      { flag: '🇺🇸', brand: '스피스헥커 Speed-TEC 시스템 (8810 / 8820):', text: '공정 시간 및 부스 열처리 에너지 소비를 획기적으로 줄이는 저탄소 공정 지향.' },
      { flag: '🇳🇱', brand: '시켄스 Autoclear WB 2.0 / Expert HS (ECO 경화제):', text: '수용성 클리어코트(WB 2.0) 및 친환경 ECO 경화제 옵션 운영.' },
      { flag: '🇺🇸', brand: 'PPG Envirobase 연동 Low-VOC 클리어:', text: '글로벌 환경 규제(VOC)를 충족하는 친환경 리피니시 클리어 시스템.' },
    ],
  },
];

const CLEAR_BRANDS_FULL_DATA: ClearBrandData[] = [
  {
    id: 'glasurit',
    flag: '🇩🇪',
    brandNum: 'Brand 01',
    koName: '바스프 글라슈리트',
    enName: 'BASF Glasurit',
    hq: '독일 뮌스터 (BASF Coatings 소속)',
    founded: '1888년 독일 함부르크 (Max Winkelmann)',
    krDistributor: '조광페인트 (1994년 BASF Coatings와 기술제휴 체결, Glasurit · baslac · CHOKWANG 공급) ✅',
    systemSummary: 'ProClass (P-C), AraClass (A-C Eco Balance), 클래식 923번대, baslac(별도 브랜드)',
    mixSummary: 'P-C 전 품번 2:1+10% / 923-610·625·631·645는 3:1:1 / 923-255·447·526F는 2:1+10%',
    accentBg: 'bg-emerald-600',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-300',
    intro: '1888년 독일 함부르크에서 시작된 BASF 그룹의 프리미엄 자동차 보수 도료 브랜드입니다. 90 Line 수용성 베이스와 연동되는 ProClass(P-C), 친환경 바이오매스·리사이클링 기반의 AraClass(A-C), 그리고 전통의 클래식 923 라인업을 운영합니다.',
    history: [
      { year: '1888', event: 'Max Winkelmann이 함부르크에서 도료·페인트 사업 시작. 첫 제품은 흰색 에나멜 ‘Crystal White(Kristallweiß)’로 조선소, 독일 황제, 함부르크 전차회사 등에 공급', status: '✅ 확인' },
      { year: '1898', event: '여러 제품을 한 이름으로 판매하기 위해 Glasurit 상표 등록 (Glasur는 유약이라는 뜻)', status: '✅ 확인' },
      { year: '1925', event: '브랜드 상징인 앵무새(Parrot) 상표 등록', status: '✅ 확인' },
      { year: '1964', event: 'Line 54 출시 — 자동차 보수용 최초의 메탈릭 베이스코트 라인', status: '✅ 확인' },
      { year: '1965', event: '글로벌 화학 기업 BASF가 인수', status: '✅ 확인' },
      { year: '1992', event: '90 Line 출시 — 수용성 베이스코트 중 가장 이른 시스템의 하나(공식 표현: one of the first). 하이솔리드 타입 4배 고농축 안료', status: '✅ 확인' },
      { year: '1994', event: '대한민국 조광페인트와 기술제휴 체결 및 국내 공급 시작', status: '✅ 확인' },
      { year: '1995~96', event: '22 Line(하이솔리드), 55 Line 출시', status: '✅ 확인' },
      { year: '2020', event: '100 Line 출시 — VOC 250 g/l로 기존 수용성 베이스보다 VOC를 40% 낮춘 베이스코트 라인 (공정 시간 최대 40% 단축 발표)', status: '✅ 확인' },
      { year: '2021', event: '포르쉐 승인 OEM 도료 자격 및 네덜란드 Porsche Classic Center Gelderland 공식 파트너십 체결', status: '✅ 확인' },
      { year: '2026', event: '아우디 리볼루트 F1 팀(Audi F1 R26) 독점·공식 페인트 공급사로 발표 (100 Line 베이스 + AraClass A-C-24 클리어 적용, 2026-03-06 조광페인트 공지)', status: '✅ 확인' },
    ],
    brandFacts: [
      { claim: 'ProClass(P-C) 표준 사용 규격 (TDS)', status: '✅ 확인', fact: '배합비 2:1+10%(주제 100 : 경화제 50 : 희석제 10 부피비). 경화제 P-H-410(fast)·430(medium)·440(slow), 희석제 P-R-110(fast)·120(medium)·130(slow), 스피드 첨가제 P-A-920. 노즐 1.3~1.4mm, 공급압 2bar(HVLP 캡 0.7bar), 1.5회 도장(코트 사이 및 오븐 전 플래시오프 불필요), 도막 두께 40~60μm.' },
      { claim: '디지털 조색 및 OEM 승인 검증', status: '🔶 부분확인', fact: 'ColorOnline, Refinity, Profit-Manager 연계 측색 시스템 확인. 포르쉐 승인 OEM 도료 확인(전 세계 유일 독점 표현은 미확인).' },
    ],
    sections: [
      {
        title: '1. ProClass (P-C) 시리즈 — 90 Line 전용 고효율 클리어 체계',
        subtitle: '표준 배합비 2:1+10% | 노즐 1.3~1.4mm (2bar) | 1.5회 도장 (중간 플래시오프 없음) | 40~60μm',
        items: [
          { code: 'P-C-10', name: 'ProClass 속건(Fast Drying) 클리어', badge: '✅ 공식 확인', mix: '2 : 1 + 10%', hardener: 'P-H-410 / 430 / 440', reducer: 'P-R-110 / 120 / 130', desc: ['스팟 수리부터 차량 한쪽 측면 전체까지 대응하는 속건 효율형 클리어', 'P-A-920 스피드 첨가제 병용 시 건조 시간 추가 단축 가능'] },
          { code: 'P-C-15', name: 'ProClass 자연건조(Air Drying) 클리어', badge: '✅ 공식 확인', mix: '2 : 1 + 10%', desc: ['상온 자연건조(Air Drying)에 특화된 고효율 클리어, 폭넓은 용도 대응', '참고: Biomass Eco Balance 원료 인증은 A-C 시리즈(A-C-14 등)에 해당'] },
          { code: 'P-C-20', name: 'ProClass 범용(Universal) 클리어', badge: '✅ 공식 확인', mix: '2 : 1 + 10%', hardener: 'P-H-410(저온·소면적) / 430(표준) / 440(고온·대면적)', film: '40~60μm (1.5코트)', desc: ['작업이 쉽고 폭넓은 수리 환경에 대응하는 사계절 표준 유니버설 클리어', '구형 923-625(3:1:1)의 포지션을 대체하는 핵심 메인 품번'] },
          { code: 'P-C-21', name: 'ProClass 프리믹스(Premixed) 클리어', badge: '✅ 공식 확인', mix: '2 : 1 + 10%', desc: ['공정 단순화를 위한 프리믹스 타입 클리어코트'] },
          { code: 'P-C-22', name: 'ProClass 성능형(Performance) 클리어', badge: '✅ 공식 확인', mix: '2 : 1 + 10%', film: '40~60μm (1.5코트)', desc: ['생산성이 높고 건조 시간이 짧으며 경화 에너지가 적게 드는 고성능 클리어'] },
          { code: 'P-C-30', name: 'ProClass 고광택(High Gloss) 클리어', badge: '✅ 공식 확인', mix: '2 : 1 + 10%', film: '40~60μm (1.5코트)', desc: ['하이엔드 외관, 완벽한 광택과 레벨링을 구현하는 플래그십 고광택 클리어', '구형 923-631(3:1:1)의 고광택 포지션과 1:1 대응'] },
          { code: 'P-C-32', name: 'ProClass 광택(Gloss) 클리어', badge: '✅ 공식 확인', mix: '2 : 1 + 10%', desc: ['공식 명칭 Gloss 클리어코트 (유통사 자료상 P-H-410 등 호환)'] },
          { code: 'P-C-40', name: 'ProClass 내스크래치(Scratch Resistant) 클리어', badge: '✅ 공식 확인', mix: '2 : 1 + 10%', desc: ['긁힘 저항성과 지속되는 광택을 제공하는 내스크래치 클리어', '구형 923-645(3:1:1 내스크래치)와 1:1 기능 대응'] },
          { code: 'P-C-92 / P-C-94', name: 'ProClass 무광(Mat) / 반광(Silk Mat) 시스템', badge: '✅ 공식 확인', mix: '2 : 1 (유통사 사양 전용 경화제 P-H-490)', dry: '20°C 8시간 · 60°C 30분 (2회 도장, 40~50μm)', desc: ['P-C-92(무광, Mat)와 P-C-94(반광, Silk Mat)를 혼합하여 극무광부터 반광까지 OEM 광택도 정밀 조절', '구형 923-55(극무광) / 923-58(반광) 시스템을 계승'] },
        ],
      },
      {
        title: '2. AraClass (A-C) 시리즈 — Eco Balance 친환경·미래형 체계',
        subtitle: 'Glasurit Know How 공식 등재 Eco Balance 라인업 (C-C-20, C-C-30, G-C-210 휠 클리어 별도 존재)',
        items: [
          { code: 'A-C-10 / A-C-14', name: 'Eco Balance 속건(A-C-10) / 자연건조(A-C-14)', badge: '✅ 공식 확인', desc: ['A-C-10: 친환경 Eco Balance 속건 클리어', 'A-C-14: 친환경 Eco Balance 상온 자연건조(Air Drying) 클리어'] },
          { code: 'A-C-20 / A-C-22', name: 'Eco Balance 범용(A-C-20) / 프리믹스(A-C-22)', badge: '✅ 공식 확인', desc: ['A-C-20: 고성능 친환경 유니버설 범용 클리어', 'A-C-22: 친환경 프리믹스 클리어'] },
          { code: 'A-C-24', name: 'Eco Balance 얼티밋 드라잉(Ultimate Drying)', badge: '✅ 아우디 F1 적용', desc: ['수명이 다한 타이어 원료로 화석 원료를 대체한 cycling® 인증 클리어 (제품 kg당 CO₂ 최대 40% 저감)', '2026 아우디 리볼루트 F1 팀 머신(R26)에 100 Line 베이스와 함께 보호 클리어로 공식 적용'] },
          { code: 'A-C-30 / A-C-32 / A-C-40', name: '슈페리어 글로스(30) / 글로스(32) / 내스크래치(40)', badge: '✅ 공식 확인', desc: ['A-C-30: Eco Balance Superior Gloss (최상위 고광택)', 'A-C-32: Eco Balance Gloss / A-C-40: Eco Balance Scratch Resistant (친환경 내스크래치)'] },
          { code: 'A-C-80', name: 'Eco Balance UV 클리어코트', badge: '✅ 공식 확인', desc: ['UV 경화 대응 특수 친환경 클리어코트'] },
          { code: 'A-C-90 / A-C-92', name: 'Eco Balance 엑스트라 매트(90) / 매트(92)', badge: '✅ 공식 확인', desc: ['A-C-90이 공식 Extra Mat(극무광), A-C-92가 Mat(무광) 명칭을 갖는 친환경 무광 시스템'] },
        ],
      },
      {
        title: '3. 클래식 923 시리즈 및 baslac (BASF 별도 브랜드)',
        subtitle: '품번별 배합비 상이 (3:1:1 또는 2:1+10%) — 아래 개별 TDS 규격 필독',
        items: [
          { code: '923-255', name: 'HS Multi Clear (멀티 클리어)', badge: '✅ TDS 확인', mix: '2 : 1 + 10% (경화제 929-91·93·94 / 희석제 352-50·91·216)', dry: '점도 DIN4 18~20초, 가사시간 20°C 4시간', desc: ['높은 고형분, 우수한 내후·내황변성, 빠른 건조, 폴리싱·테이프 내성을 갖춘 대표 HS 클리어'] },
          { code: '923-610 / 625 / 631 / 645', name: '클래식 VOC 3:1:1 4대 라인업', badge: '✅ 조광페인트/TDS', mix: '3 : 1 : 1 (경화제 929-61·63·64·68 / 희석제 352-10·30·40·70)', film: '40~60μm (523-15 레이싱 첨가제 변형 시 60°C 20분)', desc: ['923-610: HS 속건 VOC / 923-625: HS 유니버설 VOC', '923-631: HS 슈페리어 글로스(고광택) / 923-645: HS 내스크래치성 VOC (신형 P-C-10·20·30·40과 1:1 기능 대응)'] },
          { code: '923-144 / 923-365', name: 'MS 레이싱(144) / 북미 글래머 프로덕션(365)', badge: '✅ 공식 확인', dry: '60°C 15분 경화', desc: ['923-144: 단일 패널·소규모 수리용 MS 속건 클리어', '923-365: 북미 Glamour Production 클리어 (기후 무관 최단 15분 베이크 사이클)'] },
          { code: '923-35 / 115 / 447 / 45', name: '내스크래치 및 범용 VOC 클리어군', badge: '✅ 공식 확인', mix: '923-447 기준 2 : 1 + 10%', desc: ['923-35 & 923-447: 고고형분 내스크래치 HS 클리어 VOC', '923-115: HS 유니버설 클리어 VOC / 923-45: 2019 FCA 승인표 등재 Scratch Resistant 클리어(현장 별칭 불소 클리어)'] },
          { code: '923-526 F / 923-230', name: 'APAC 전용(526 F) / 북미 Low VOC(230)', badge: '✅ TDS 확인', mix: '526 F: 2:1:10% / 230: 2:1+10% 및 3:1+20% 두 버전', desc: ['923-526 F: 아시아·태평양 한정 멀티 퍼포즈 클리어 (50~60μm, 2회 도장)', '923-230: 북미 Low VOC Multi-Purpose Gloss Clear (코트 사이 5분 플래시오프)'] },
          { code: '923-55 / 923-58', name: '클래식 엑스트라 매트(55) + 매트 엘라스티파이드(58)', badge: '✅ TDS 확인', mix: '중량비 100 : 33 : 17 (929-33 + 352-91)', dry: '20°C 7시간 · 60°C 30분 (도막 40~50μm)', desc: ['923-55 극무광과 923-58을 혼합해 광택도 조절. 1차 후 10~15분, 2차 후 15~20분 매트해질 때까지 플래시오프'] },
          { code: 'baslac 40-10 / 40-40', name: '바스락 2K 패널 클리어(40-10) / HS 유니버설(40-40)', badge: '✅ 별도 브랜드', mix: '2 : 1 + 10% (경화제 50-20·30 / 희석제 60-10~40)', film: '40-40 기준 50~70μm', desc: ['baslac은 글라슈리트와 별개인 BASF의 리피니시 브랜드(조광페인트 별도 제품군 등재)', '40-10은 스팟·패널 수리용 2K 속건 클리어이며, HS 범용 클리어는 40-40입니다.'] },
        ],
      },
    ],
    conversionNotes: [
      { title: '구형 923 → 신형 ProClass(P-C) 전환 대조', status: '🔶 기능 1:1 대응 확인', detail: '923-610(속건)·625(범용)·631(고광택)·645(내스크래치) [3:1:1] ➔ P-C-10·20·30·40 [2:1+10%]로 기능 1:1 대응. 무광 923-55/58 ➔ P-C-92/94로 역할 계승.' },
      { title: '보조제 및 퍼티 품번 대응 확인', status: '✅ 기능 일치', detail: '스피드 첨가제 523-15 ➔ P-A-920 / 중간 희석제 352-30 ➔ P-R-120 / 다목적 퍼티 839-20·20K ➔ P-B-24·24C 존재 확인.' },
    ],
    sources: [
      'Glasurit Know How 제품 목록: https://knowhow.glasurit.com/products?category=2',
      'Glasurit TechInfo TDS (P-C-20·22·30, 923-255·447·230·526F·631·55): techinfo.glasurit.com',
      '조광페인트 글라슈리트 공식 사이트(아우디 F1, A-C-24, 923-631·645): https://glasurit.ckpc.co.kr',
      'Glasurit 글로벌 브랜드 소개: https://www.glasurit.com/en-int/our-brand',
    ],
  },
  {
    id: 'spieshecker',
    flag: '🇺🇸',
    brandNum: 'Brand 02',
    koName: '엑솔타 스피스헥커',
    enName: 'Axalta Spies Hecker',
    hq: '미국 펜실베이니아주 필라델피아 (엑솔타 글로벌 본사, 2024 Navy Yard 개소) / 출발지: 독일 쾰른',
    founded: '1882년 독일 쾰른 (마차용 바니시 생산 시작)',
    krDistributor: '스피스헥커 코리아 공식 제품 페이지 운영 (클리어코트 12종 공식 등재) ✅',
    systemSummary: 'Permasolid HS (8030·8034·8055·8021·8450), Race 8700, Speed-TEC (8810·8820·8800), Permacron MS/Matt',
    mixSummary: '8055·8034·8450 3:1(VHS) / 8700 2:1+10% / 8810 2:1(신너 없음) / 8030(북미) 2:1',
    accentBg: 'bg-blue-600',
    accentText: 'text-blue-700',
    accentBorder: 'border-blue-300',
    intro: '1882년 독일 쾰른에서 출발해 현재 미국 엑솔타 코팅 시스템즈(Axalta Coating Systems)를 대표하는 글로벌 프리미엄 브랜드입니다. 수용성 Permahyd Hi-TEC 480 시스템과 연동되는 Permasolid HS 라인업 및 초속건 Speed-TEC 기술을 보유하고 있습니다.',
    history: [
      { year: '1882', event: '독일 쾰른에서 회사 설립, 마차용 바니시 생산 시작 (업계지 기록: 헤커 형제 Adolf·Moritz와 스피스 형제 Adolf·Hermann 창립)', status: '✅ 확인' },
      { year: '1900', event: '자동차 보수용 도료 제품군 편입', status: '✅ 확인' },
      { year: '1912', event: 'Spies, Hecker & Co. GmbH 법인 설립', status: '✅ 확인' },
      { year: '1974', event: '획스트(Hoechst) 그룹 편입', status: '✅ 확인' },
      { year: '1980', event: '2코트 시스템(베이스코트 293/295 + 클리어코트) 출시', status: '✅ 확인' },
      { year: '1994', event: '수용성 베이스코트 Permahyd 280/285 출시', status: '✅ 확인' },
      { year: '1999', event: '미국 듀폰(DuPont) 그룹 편입', status: '✅ 확인' },
      { year: '2010', event: '차세대 수용성 베이스 Permahyd Hi-TEC 480 출시', status: '✅ 확인' },
      { year: '2013', event: '엑솔타 코팅 시스템즈(Axalta Coating Systems) 소속으로 독립 출범', status: '✅ 확인' },
      { year: '2014~16', event: '고속건조 Speed-TEC 클리어 8800 출시(2014), 메르세데스-AMG 페트로나스 F1 팀 공식 서플라이어(2015), Speed-TEC 서페이서 5500/5550(2016)', status: '✅ 확인' },
      { year: '2018~23', event: '레이스 클리어 8700 출시(2018), 차세대 무광 매트 시스템 8185/8170 출시(2023.03)', status: '✅ 확인' },
    ],
    brandFacts: [
      { claim: '지역별 VHS 경화제 명칭 주의 (TDS)', status: '✅ 확인', fact: '유럽 TDS는 3220 fast · 3225 · 3230 slow · 3240 extra slow로 표기하며, 미국 TDS는 3220 Express · 3230 Medium · 3240 Slow · 3245 Extra Slow로 표기합니다. 같은 번호라도 지역판 TDS 명칭이 다르므로 반드시 구분해야 합니다.' },
      { claim: '디지털 조색 및 베이스 연동', status: '✅ 확인', fact: 'ColorDialog Phoenix 측색기(2015) 및 매트 컬러 매칭용 Phoenix Cloud 운영. Speed-TEC 시스템 적용 시 Hi-TEC 480 베이스코트에 별도 경화제가 필요 없습니다.' },
    ],
    sections: [
      {
        title: '1. Speed-TEC & Race 시리즈 — 초속건·저온·에너지 세이빙 라인',
        subtitle: '신너 없는 2:1 스피드 배합(8810) 및 60°C 15분 레이스 경화(8700)',
        items: [
          { code: '8810', name: '퍼마솔리드 HS 스피드 클리어코트 8810', badge: '✅ 한국 공식 등재', mix: '2 : 1 (별도 신너·첨가제 불필요)', gun: '유통사 사양 1.2~1.3mm, 1.8~2.0bar', film: '50~60μm (1.5회 또는 2회, 플래시오프 0~2분)', dry: '공식 40~45°C 10~15분 또는 20°C 30~55분 (현장 열처리 운용 병행)', desc: ['높은 고형분에도 스프레이 점도가 낮아 뛰어난 작업성과 살오름성 발휘', 'Speed-TEC 공정 시 Hi-TEC 480 베이스에 경화제 불필요, 부스 에너지 및 시간 대폭 절약', '우수한 광택 유지력 확보'] },
          { code: '8700', name: '퍼마솔리드 HS 레이스 클리어코트 8700', badge: '✅ 한국 공식 등재', mix: '2 : 1 + 10% (VHS 레이스 경화제 3470 + 레이스 첨가제 9070)', dry: '60°C 15분 · 40°C 30분 · IR 건조 가능', desc: ['경미한 손상(부분 도장)부터 전체 도장까지 폭넓게 사용하는 초속건 레이스 클리어', '짧은 플래시오프 2회 도장, 저점도 신기술 바인더로 퍼짐성과 수직 안정성 우수', '건조 후 짧은 냉각 뒤 곧바로 폴리싱 및 재조립 가능 (고온다습용 슬로우 경화제·첨가제 별도 존재)'] },
          { code: '8820 / 8800', name: 'Speed-TEC HS 스피드 8820 / 8800 (해외 공식)', badge: '✅ 해외 공식', mix: '2 : 1 (북미 TDS 경화제 3251 Fast·3254 Med Fast·3250 Med·3252 Slow)', dry: '40~45°C 10~15분 또는 20°C 30~55분', desc: ['베이스 경화제 불필요, 1.5회 또는 2회 도장, Permasolid 첨가제 틴팅 가능(매트 처리 불가)'] },
        ],
      },
      {
        title: '2. Permasolid HS 프리미엄·범용·내스크래치 시리즈',
        subtitle: '한국 공식 홈페이지 등재 주력 하이솔리드(HS) 라인업',
        items: [
          { code: '8055', name: '퍼마솔리드 HS 클리어코트 8055', badge: '✅ TDS EN/8055A.31', mix: '3 : 1 (VHS 경화제 3220·3225·3230·3240)', reducer: '첨가제 9034(15~30°C 일반) 또는 9035 slow(25°C 이상 대형, 3240 조합) 5% (2024년판은 Phoenix 믹스표 참조)', film: '1.5회 50~60μm · 2회 50~70μm (플래시오프 5~10분)', dry: '20°C 12~16시간 · 60~65°C 25~35분', desc: ['하이-텍 퍼포먼스 시스템용 프리미엄 HS 클리어', '1.5회(권장) 또는 2회 도장, 높은 수직 안정성, 뛰어난 광택과 살오름성', '기존 프리미엄 HS 대비 향상된 건조 성능과 최종 도막 경도'] },
          { code: '8034', name: '퍼마솔리드 HS 클리어코트 8034', badge: '✅ TDS EN/8034A', mix: '3 : 1 (VHS 경화제) + 첨가제 최대 5%', hardener: '3220(스피드·패널) · 3225(패널·멀티) · 3230(수평·전체) · 3240(대형·전체)', film: '50~60μm (2회 권장, 1.5회 시 중간 0~2분·최종 5~10분)', dry: '20°C 밤새 · 60°C 약 30~35분', desc: ['2K 아크릴 VOC 준수 고광택 표준 HS 클리어', '탁월한 탑코트 내구성, 수직 안정성, 폴리싱 작업성 및 살오름성'] },
          { code: '8030', name: '퍼마솔리드 HS 클리어코트 8030', badge: '✅ 한국 공식/북미 TDS', mix: '북미 TDS 기준 2 : 1 (HS 경화제 3307~3325, 희석제 0~5%)', dry: '60°C 30분 / 20°C 먼지건조 40~50분, 조립 4~6시간, 완전건조 12시간', desc: ['한국 공식 페이지 등재: VOC 준수 하이솔리드, HS·VHS 경화제 모두 사용 가능', '우수한 광택·퍼짐성, 뛰어난 표면 마감, 넓은 면적 무광 마감에도 적합(매팅 컴포넌트 MA 110 병용)'] },
          { code: '8021', name: '퍼마솔리드 HS 클리어코트 8021', badge: '✅ 한국 공식 등재', hardener: '신규 HS 경화제 3006 / 3007 / 3008 / 3009', desc: ['단판넬부터 전체 수리까지 대응하는 고광택 2액형 HS 클리어 (2회 도장)', '매우 높은 광택과 살오름성, 안정적인 도막 물성'] },
          { code: '8450', name: '퍼마솔리드 HS 다이아몬드 클리어코트 8450', badge: '✅ 내스크래치 공식', mix: '3 : 1 (미국 TDS VHS 3240 / ASAP 초속건 공정 한정 2:1 + 9050 10%)', desc: ['내스크래치성이 높은 OEM 클리어 차량 보수용 스크래치 방지 HS 클리어', '반영구적 광택 유지력, 매우 우수한 폴리싱성 및 내후·내자외선 저항성', '2회 도장(중간 플래시오프 5~15분) 또는 중간 1회+본 코트 1회(플래시오프 없음)'] },
          { code: '8650', name: 'HS Optimum Plus Clear Coat 8650 (해외 공식)', badge: '✅ 해외 공식', desc: ['공식 영문 명칭 Permasolid HS Optimum Plus Clear Coat 8650'] },
        ],
      },
      {
        title: '3. Permacron 무광(Matt) · MS · 미드코트 특수 라인업',
        subtitle: '한국 공식 페이지 등재 무광 조색 시스템 및 특수 클리어',
        items: [
          { code: '8185 / 8170', name: '퍼마크론 매트 클리어코트 시스템 (무광 8185 / 반광 8170)', badge: '✅ 2023 출시 공식', desc: ['무광 8185와 반광 8170 두 제품을 비율별로 혼합해 모든 OEM 무광 컬러의 광택도 정밀 재현(일반 투명 미사용)', '얼룩 없이 균일한 외관과 부드러운 질감 (자체 자료의 8022/8024 매트 시스템에 대응하는 공식 품번)'] },
          { code: '8085', name: '퍼마크론 매트 클리어코트 8085', badge: '✅ 한국 공식 등재', desc: ['광택 조절이 가능하고 유연성을 갖춘 2액형 무광 클리어 (HS·VHS 경화제 사용)'] },
          { code: '8045 / 8011', name: '퍼마크론 MS 옵티플렉스(8045) / 표준 MS(8011)', badge: '✅ 한국 공식 등재', mix: '8045 기준 2 : 1 (MS·HS 경화제 혼합 가능)', desc: ['8045: 매우 빠른 건조와 핀홀·다이백 방지 기능을 갖춘 신규 미디엄 솔리드 클리어', '8011: 2K Hi-TEC 베이스 고객용 표준 MS 클리어 (경화제 3006/7/8/9)'] },
          { code: '8560', name: '퍼마크론 1K 미드코트 클리어코트 8560', badge: '✅ 한국 공식 등재', desc: ['메탈릭·펄 블렌딩 작업 시 메탈릭 입자 정렬을 개선하는 1K 미드코트 전용 클리어'] },
        ],
      },
    ],
    sources: [
      '스피스헥커 코리아 클리어코트 카탈로그(12종): https://www.spieshecker.com/kr/ko_KR/products/product-catalogue/clearcoat.html',
      '스피스헥커 공식 History: https://www.spieshecker.com/gb/en_GB/about-us/history.html',
      '8810·8820·8055·매트 시스템 공식 페이지 및 TDS (EN/8055A.31, EN/8034A, 8030 북미, 8450 미국)',
    ],
  },
  {
    id: 'sikkens',
    flag: '🇳🇱',
    brandNum: 'Brand 03',
    koName: '악조노벨 시켄스',
    enName: 'AkzoNobel Sikkens',
    hq: '네덜란드 암스테르담 (AkzoNobel 본사) / 출발지: 네덜란드 흐로닝언',
    founded: '1792년 네덜란드 흐로닝언 (Wiert Willem Sikkens, 230년 이상 역사)',
    krDistributor: '노루페인트 국내 독점 판매권 확보 (2020년 9월 악조노벨과 전략적 제휴 보도) ✅',
    systemSummary: 'Autoclear LV, LV Superior, LV Exclusive, Plus HS, Aerodry, HSR Antiscratch, Optima, Mix & Matt, WB 2.0, Expert HS',
    mixSummary: 'LV 100:50:10 / LV Superior 100:60:20 / Plus HS 100:50:10(APAC 10~20) / Aerodry 100:100 / 2121 LV 4:1:1',
    accentBg: 'bg-orange-600',
    accentText: 'text-orange-700',
    accentBorder: 'border-orange-300',
    intro: '1792년 네덜란드에서 탄생해 230년이 넘는 역사를 자랑하는 악조노벨(AkzoNobel)의 플래그십 브랜드입니다. 2008년부터 이어온 맥라렌(McLaren) F1·로드카 공식 파트너십과 BMW·MINI 승인, 자가 복원(Self-healing) 및 상온 초속건 Aerodry 기술을 보유하고 있습니다.',
    history: [
      { year: '1792', event: 'Wiert Willem Sikkens가 네덜란드 흐로닝언(Groningen)에서 도료 사업 시작', status: '✅ 확인' },
      { year: '1928', event: '니트로셀룰로오스 계열 래커 ‘Nitro Rubbol’ 출시', status: '✅ 확인' },
      { year: '1948', event: 'Autoflex 출시', status: '✅ 확인' },
      { year: '1969', event: 'AKU와 KZO의 합병으로 Akzo 설립 (Sikkens 도료 공장은 KZO 소속)', status: '✅ 확인' },
      { year: '1970', event: '최초의 2액형(2K) 자동차 보수 도료 ‘Autocryl’ 출시', status: '✅ 확인' },
      { year: '1982', event: 'Autobase 출시', status: '✅ 확인' },
      { year: '1994', event: 'Akzo와 스웨덴 Nobel Industries의 합병으로 AkzoNobel 탄생 (본사 암스테르담)', status: '✅ 확인' },
      { year: '2008~', event: '맥라렌(McLaren Racing)과 공식 페인트·코팅 기술 파트너십 체결 및 지속 연장', status: '✅ 확인' },
      { year: '2020', event: '시켄스·레소날 BMW·MINI 글로벌 승인 취득 / 같은 해 9월 노루페인트가 국내 독점 판매권 제휴 체결', status: '✅ 확인' },
    ],
    brandFacts: [
      { claim: '수지 화학 구성 및 배합비 주의사항 (TDS)', status: '✅ 확인', fact: 'Plus HS TDS 기준 클리어는 아크릴·폴리에스터 수지, 경화제는 폴리이소시아네이트 수지로 구성됩니다. LV Superior(100:60:20)와 Aerodry(100:100)는 2:1 배합이 아니므로 전용 측정봉과 TDS 비율을 엄수해야 합니다.' },
    ],
    sections: [
      {
        title: '1. 하이엔드 고광택 · 표준 범용 · 자가복원 라인업',
        subtitle: '영국·유럽·아시아태평양(APAC) 공식 TDS 검증 규격',
        items: [
          { code: 'Autoclear LV Superior', name: '오토클리어 LV 슈페리어 (최상위 고광택)', badge: '✅ UK TDS S1.05.01', mix: '100 : 60 : 20 (클리어 Fast/Medium/Slow + 전용 경화제 1종 + 희석제)', reducer: '희석제 Fast(20°C 이하 스팟·패널) · Medium(20~35°C 스팟·패널) · Slow(25~45°C 대면적·전체) / Accelerator(30°C 이하)', dry: '60°C: Fast 15분 · Medium 25분 · Slow 35분 (Accelerator 시 12분) / 20°C: 6·7·8시간', desc: ['모든 수리 상황과 조건에서 가장 높은 광택을 구현하는 플래그십 클리어', '일부 지역 공식 페이지에서는 자가 복원(Self-healing) 특성 기재'] },
          { code: 'Autoclear Plus HS', name: '오토클리어 플러스 HS (대표 하이솔리드)', badge: '✅ EMEA/APAC TDS', mix: 'EMEA 100:50:10 / APAC 100:50:10~20 (Plus Accelerator 2 병용 시)', hardener: 'P15 · P25 · P35 · P45 (플라스틱용 Elast-O-Actif)', reducer: 'Plus 희석제 Fast(15~25°C) · Medium(20~30°C) · Slow(25~35°C) · Extra Slow(35°C 초과)', dry: '60°C: P15 15분 · P25 35분 · P35/P45 45분 (호주 TDS 권장 도막 60~80μm)', desc: ['아크릴·폴리에스터 2액형 HS 클리어, 뛰어난 광택·흐름·살오름성과 쉬운 도장성', '모든 수리 유형 및 시켄스 전 베이스코트 라인업 호환'] },
          { code: 'Autoclear LV', name: '오토클리어 LV (표준 VOC 클리어)', badge: '✅ UK TDS S1.05.05', mix: '100 : 50 : 10 (= 2 : 1 : 10%)', hardener: '전용 경화제 1종 + 전용 희석제 1종', gun: '1.2~1.4mm, 공급압 1.7~2.2bar (HVLP 캡 0.6~0.7bar)', dry: '60°C 20분 (2 x 1코트)', desc: ['30°C까지 모든 수리 크기에 사용하는 직관적인 표준 클리어'] },
          { code: 'Autoclear Expert HS', name: '오토클리어 엑스퍼트 HS (APAC 주력)', badge: '✅ APAC TDS S1.05.32', mix: '100 : 50 : 5~10 (ECO 경화제 사용 시 100 : 50 : 10~15)', hardener: 'P25 · P35 경화제 (측정봉 3번 보라)', desc: ['프리미엄 광택과 다양한 건조 옵션을 제공하며 스팟 수리부터 전체 도장까지 대응(Autobase Plus 연동)'] },
          { code: 'Autoclear LV Exclusive / HSR Antiscratch', name: '자가복원(LV Exclusive) / 내스크래치(HSR Antiscratch)', badge: '✅ 중부유럽 공식', desc: ['LV Exclusive: 태양열 노출 시 스크래치가 스스로 복원(Self-healing / Re-flow)되는 고광택 클리어', 'HSR Antiscratch: 스크래치 방지 물성과 최적의 흐름성을 갖춘 하이빌드 2K 클리어'] },
        ],
      },
      {
        title: '2. 상온 초속건(Aerodry) · 무광(Mix & Matt) · 수용성 · 북미 라인',
        subtitle: '2026 중부유럽 및 북미 공식 카탈로그 등재 라인업',
        items: [
          { code: 'Autoclear Aerodry', name: '오토클리어 에어로드라이 (상온·초속건 에너지 세이빙)', badge: '✅ 공식 확인', mix: '100 : 100 (클리어 1종 + 경화제 2종)', dry: '60°C 5분 · 20°C 45분', desc: ['오븐 건조 클리어에 맞먹는 물성을 구현하는 2액형 VOC 준수 상온건조 클리어(Autowave MM 2.0 호환)', '자체 자료의 Aero PC 설명에 대응하는 공식 제품명'] },
          { code: 'Autoclear Rapid Air AS / Rapid / Optima', name: '소규모 상온 속건(Rapid Air AS) 및 다중 속건(Optima)', badge: '✅ 공식 확인', desc: ['Rapid Air AS: 베이킹 필요를 줄인 소규모 수리용 2K 상온건조 내스크래치 클리어', 'Optima: 다양한 속건 옵션을 제공하는 고성능 2K VOC 클리어 / Rapid: 속건 계열 클리어'] },
          { code: 'Autoclear Mix & Matt', name: '오토클리어 믹스 앤 매트 (2액형 무광 시스템)', badge: '✅ 공식 확인', desc: ['저광택(Matt) 성분과 반광(Satin/Silk) 성분을 혼합해 OEM 무광 광택도를 정밀 조절'] },
          { code: 'Autoclear 2.0 / 2.0 HT / WB 2.0', name: '차세대 2.0 클리어 및 WB 2.0 수용성 클리어', badge: '✅ 공식 확인', desc: ['Autoclear 2.0 & 2.0 HT: 최적의 도장 특성을 갖춘 차세대 2K VOC 클리어', 'Autoclear WB 2.0: 친환경 수용성(Waterborne) 클리어코트'] },
          { code: 'Performance LV / HS+ 2 Pack / 2121 LV', name: '북미 전용 라인업 3종', badge: '✅ 북미 TDS 확인', mix: '2121 LV: 4 : 1 : 1 / HS+ 2 Pack: 2 : 1', dry: '2121 LV: 60°C 약 10~15분 (1.5회 도장)', desc: ['Performance LV: 플렉스(Flex) 화학이 내장되어 모든 수리 조건에 대응', '2121 LV: Autowave 베이스 위 1.5회 도장으로 작업 시간을 단축하는 3성분 폴리우레탄 클리어'] },
        ],
      },
    ],
    sources: [
      '시켄스 중부유럽 클리어코트 카탈로그: https://www.sikkensvr.com/en-ce/products/clearcoats',
      '시켄스 공식 History: https://www.sikkensvr.com/en/About-us/History',
      '맥라렌 공식 파트너 페이지: https://www.mclaren.com/racing/partners/akzonobel-sikkens/',
      'UK & APAC TDS (S1.05.01 LV Superior, S1.05.05 LV, S1.05.32 Expert HS, EMEA Plus HS, 북미 2121 LV)',
      '노루페인트 국내 독점 판매권 제휴 보도(2020-09, 서울경제·한국경제·아시아경제)',
    ],
  },
  {
    id: 'ppg',
    flag: '🇺🇸',
    brandNum: 'Brand 04',
    koName: '피피지 인더스트리',
    enName: 'PPG Industries',
    hq: '미국 펜실베이니아주 피츠버그 (Pittsburgh, PA)',
    founded: '1883년 미국 펜실베이니아 (Pittsburgh Plate Glass Company)',
    krDistributor: '피피지코리아(PPG Korea) 및 국내 공식 대리점망 운영',
    systemSummary: 'Deltron GRS (D8135·D8177·D8188·D800), 무광 매트 시스템 (D8115·D8117), 세라믹 내스크래치 (D8140)',
    mixSummary: '무광 D8115/D8117 2:1 조색 기반 / 초고속 D8177 및 UHS D8135 전용 경화제 시스템',
    accentBg: 'bg-indigo-600',
    accentText: 'text-indigo-700',
    accentBorder: 'border-indigo-300',
    intro: '1883년 미국 피츠버그에서 설립된 세계 최대 규모의 도료·코팅 기업 중 하나입니다. 람보르기니·현대자동차 등 글로벌 완성차 무광 매뉴얼에 등재된 D8115/D8117 매트 시스템과 60°C 5분 초고속 건조를 구현하는 D8177 라인업을 보유하고 있습니다.',
    history: [
      { year: '1883', event: '미국 펜실베이니아주 피츠버그에서 창립 (Pittsburgh Plate Glass)', status: '✅ 확인' },
      { year: '1920~80s', event: '자동차 OEM 및 보수 도장용 Ditzler / Deltron 시스템 확립, 글로벌 완성차 순정 도료 공급 확대', status: '✅ 확인' },
      { year: '1990~2000s', event: '친환경 수용성 베이스코트 Envirobase High Performance 및 나노 세라믹 클리어(Ceramiclear D8140) 출시', status: '✅ 확인' },
      { year: '현재', event: '람보르기니·현대자동차 등 순정 무광(D8115/D8117) 매뉴얼 등재 및 초고속 에너지 세이빙 클리어(D8177) 공급', status: '✅ 자료 수록' },
    ],
    brandFacts: [
      { claim: '순정 무광 제어 및 에너지 세이빙 핵심 스펙', status: '✅ 자료 수록', fact: 'D8115(Matt)와 D8117(Semi-Gloss) 2:1 조색 시스템으로 순정 매트 컬러를 재현하며, D8177(Rapid Performance Clear)을 통해 60°C 5분 또는 20°C 20분 초고속 건조를 지원합니다.' },
    ],
    sections: [
      {
        title: '1. PPG 핵심 클리어코트 라인업 (무광 제어 · 에너지 세이빙 · UHS)',
        subtitle: '완성차 매뉴얼 등재 무광 시스템 및 초고속 리피니시 라인',
        items: [
          { code: 'PPG D8115 (Matt) / D8117 (Semi-Gloss)', name: 'PPG 순정 매트 컬러 무광 제어 시스템', badge: '✅ 핵심 수록', mix: '2 : 1 조색 기반 무광 클리어 시스템', desc: ['람보르기니·현대자동차 매트 컬러 공식 보수 매뉴얼에 등재된 무광 클리어 시스템', 'D8115(완전 무광)와 D8117(반광)의 혼합 비율에 따라 다양한 OEM 저광택·반무광 광도를 정밀하게 구현', '레진 뭉침과 얼룩을 억제하여 균일한 매트 도막 완성'] },
          { code: 'PPG D8177', name: 'Rapid Performance Clear (초고속 에너지 세이빙)', badge: '✅ 핵심 수록', dry: '60°C 5분 또는 20°C 20분 건조', desc: ['가스비 절감과 경화 속도의 균형을 맞춘 초고속 에너지 세이빙 클리어', '상온 20분 또는 열처리 5분 만에 경화되어 부스 회전율과 당일 출고 생산성을 극대화'] },
          { code: 'PPG D8135 / D8188', name: 'Deltron UHS 고광택 클리어(D8135) / 고생산성(D8188)', badge: '✅ 주력 라인', desc: ['D8135: 빠른 건조와 깊고 선명한 광택을 동시에 제공하는 프리미엄 UHS 클리어', 'D8188: 1.5코트 원스톱 도장이 가능해 작업 시간을 단축하는 고광택 클리어'] },
          { code: 'PPG D8140', name: 'Ceramiclear (나노 세라믹 내스크래치 클리어)', badge: '✅ 특수 라인', desc: ['고경도 나노 실리카 가교 기술로 세차 스크래치와 마모 저항성을 극대화한 세라믹 클리어'] },
        ],
      },
    ],
    sources: [
      'PPG Deltron GRS 공식 기술자료(TDS) 및 완성차(람보르기니·현대) 매트 컬러 보수 매뉴얼',
    ],
  },
];

function ClearGuide() {
  const [viewMode, setViewMode] = useState<'brand' | 'compare' | 'summary'>('brand');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('glasurit');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const activeBrand = CLEAR_BRANDS_FULL_DATA.find((b) => b.id === selectedBrandId) || CLEAR_BRANDS_FULL_DATA[0];

  return (
    <div className="flex flex-col gap-3 text-slate-800 h-full select-text">
      {/* 상단 주의 및 검증 기준 배너 */}
      <div className="bg-red-50 p-3 rounded-xl border border-red-200 shadow-sm shrink-0">
        <div className="font-black text-red-700 text-xs flex items-center gap-1.5 mb-1">
          <AlertTriangle size={14} className="shrink-0 text-red-600" />
          <span>자동차 보수 도장 클리어코트 4사 통합 마스터 자료 (검증 표시: ✅ 확인 / 🔶 부분 확인)</span>
        </div>
        <p className="text-[11px] text-red-800 leading-relaxed font-bold break-keep">
          {CLEAR_MASTER_DISCLAIMER}
        </p>
      </div>

      {/* 상단 뷰 모드 전환 탭 */}
      <div className="flex gap-1.5 bg-slate-200/80 p-1 rounded-xl shrink-0">
        <button
          onClick={() => setViewMode('brand')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-black transition-all ${
            viewMode === 'brand' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          🏛️ 브랜드별 역사·전 품번 상세 (4사)
        </button>
        <button
          onClick={() => setViewMode('compare')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-black transition-all ${
            viewMode === 'compare' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          ⚡ 4대 브랜드 핵심 비교 (무광·저온 등)
        </button>
        <button
          onClick={() => setViewMode('summary')}
          className={`flex-1 py-2 px-2 rounded-lg text-xs font-black transition-all ${
            viewMode === 'summary' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          📊 한눈에 보기 & 배합비 총괄표
        </button>
      </div>

      {/* 1. 브랜드별 상세 보기 모드 */}
      {viewMode === 'brand' && (
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          {/* 4대 브랜드 선택 버튼 (국기 + 한글명 + 영문명 표기) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
            {CLEAR_BRANDS_FULL_DATA.map((brand) => {
              const isSelected = brand.id === selectedBrandId;
              return (
                <button
                  key={brand.id}
                  onClick={() => setSelectedBrandId(brand.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between shadow-sm cursor-pointer ${
                    isSelected
                      ? `${brand.accentBg} text-white border-transparent ring-2 ring-offset-1 ring-slate-400`
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-lg leading-none">{brand.flag}</span>
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {brand.brandNum}
                    </span>
                  </div>
                  <div className="font-black text-xs sm:text-sm leading-tight break-keep">{brand.koName}</div>
                  <div className={`text-[10px] font-bold truncate mt-0.5 ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                    ({brand.enName})
                  </div>
                </button>
              );
            })}
          </div>

          {/* 품번/키워드 빠른 검색 */}
          <div className="relative shrink-0">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`${activeBrand.koName} 내 품번·특징 검색 (예: P-C-20, 8810, 무광, 3:1, 아우디...)`}
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-8 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* 브랜드 상세 본문 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4">
            {/* 브랜드 타이틀 헤더 (요청 이미지 스타일 완벽 반영) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-3">
                <span className="text-2xl">{activeBrand.flag}</span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  [{activeBrand.brandNum}] {activeBrand.koName} ({activeBrand.enName})
                </h3>
              </div>
              <p className="text-xs font-bold text-slate-600 leading-relaxed mb-3 break-keep">{activeBrand.intro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div><span className="font-black text-slate-500">· 소속·국가: </span><span className="font-bold text-slate-800">{activeBrand.hq}</span></div>
                <div><span className="font-black text-slate-500">· 시작 연도: </span><span className="font-bold text-slate-800">{activeBrand.founded}</span></div>
                <div><span className="font-black text-slate-500">· 국내 유통: </span><span className="font-bold text-blue-700">{activeBrand.krDistributor}</span></div>
                <div><span className="font-black text-slate-500">· 대표 배합비: </span><span className="font-bold text-emerald-700">{activeBrand.mixSummary}</span></div>
              </div>
            </div>

            {/* 브랜드 연혁 (무삭제 연표) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-xs sm:text-sm font-black text-slate-900 mb-3 flex items-center gap-1.5">
                <History size={15} className="text-blue-600" />
                <span>{activeBrand.flag} {activeBrand.koName} 공식 역사 및 연표</span>
              </h4>
              <div className="space-y-2">
                {activeBrand.history.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs border-b border-slate-100 pb-2 last:border-b-0 last:pb-0">
                    <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0 min-w-[68px] text-center">
                      {h.year}
                    </span>
                    <span className="font-bold text-slate-700 flex-1 leading-relaxed break-keep">{h.event}</span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">{h.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 핵심 기술 규격 및 전환 정보 */}
            <div className="bg-slate-800 text-white p-4 rounded-xl shadow-sm space-y-2">
              <h4 className="text-xs font-black text-yellow-400 flex items-center gap-1.5">
                <Zap size={14} />
                <span>TDS 표준 작업 규격 및 필수 확인 사항</span>
              </h4>
              {activeBrand.brandFacts.map((bf, i) => (
                <div key={i} className="text-xs bg-slate-700/70 p-2.5 rounded-lg border border-slate-600">
                  <div className="font-black text-white mb-1">{bf.claim} <span className="text-emerald-400 text-[10px] ml-1">({bf.status})</span></div>
                  <div className="text-slate-200 font-medium leading-relaxed break-keep">{bf.fact}</div>
                </div>
              ))}
              {activeBrand.conversionNotes && activeBrand.conversionNotes.map((cn, i) => (
                <div key={i} className="text-xs bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700">
                  <div className="font-black text-emerald-300 mb-1">🔄 {cn.title} ({cn.status})</div>
                  <div className="text-emerald-100 font-medium leading-relaxed break-keep">{cn.detail}</div>
                </div>
              ))}
            </div>

            {/* 전 품번 클리어코트 상세 리스트 */}
            {activeBrand.sections.map((sec, sIdx) => {
              const filteredItems = sec.items.filter(
                (item) =>
                  !searchTerm.trim() ||
                  item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.desc.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
              );
              if (filteredItems.length === 0) return null;

              return (
                <div key={sIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="border-b border-slate-200 pb-2">
                    <h4 className="text-sm font-black text-slate-900">{sec.title}</h4>
                    <p className="text-[11px] font-bold text-slate-500 mt-0.5">{sec.subtitle}</p>
                  </div>
                  <div className="space-y-3">
                    {filteredItems.map((prod, pIdx) => (
                      <div key={pIdx} className={`border ${activeBrand.accentBorder} rounded-xl overflow-hidden shadow-sm`}>
                        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{activeBrand.flag}</span>
                            <span className="font-black text-slate-900 text-xs sm:text-sm">{prod.code}</span>
                            <span className="font-bold text-slate-600 text-xs">— {prod.name}</span>
                          </div>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-700">
                            {prod.badge}
                          </span>
                        </div>
                        <div className="p-3 bg-white space-y-2 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50/80 p-2 rounded-lg border border-slate-100">
                            {prod.mix && <div><span className="font-black text-slate-500">· 배합비: </span><span className="font-black text-blue-700">{prod.mix}</span></div>}
                            {prod.hardener && <div><span className="font-black text-slate-500">· 경화제: </span><span className="font-bold text-slate-800">{prod.hardener}</span></div>}
                            {prod.reducer && <div><span className="font-black text-slate-500">· 희석·첨가제: </span><span className="font-bold text-slate-800">{prod.reducer}</span></div>}
                            {prod.dry && <div><span className="font-black text-slate-500">· 건조조건: </span><span className="font-black text-red-600">{prod.dry}</span></div>}
                            {prod.film && <div><span className="font-black text-slate-500">· 도막/코트: </span><span className="font-bold text-slate-800">{prod.film}</span></div>}
                            {prod.gun && <div><span className="font-black text-slate-500">· 건 세팅: </span><span className="font-bold text-slate-800">{prod.gun}</span></div>}
                          </div>
                          <ul className="space-y-1 pt-1">
                            {prod.desc.map((line, lIdx) => (
                              <li key={lIdx} className="flex items-start gap-1.5 font-bold text-slate-700 leading-relaxed">
                                <CheckCircle size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                                <span className="break-keep">{line}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* 공식 출처 목록 */}
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-[11px]">
              <div className="font-black text-slate-700 mb-1 flex items-center gap-1">
                <Link size={12} />
                <span>{activeBrand.koName} 검증 출처 (공식 홈페이지 · TDS · 보도자료)</span>
              </div>
              <ul className="space-y-0.5 text-slate-600 font-medium list-disc pl-4">
                {activeBrand.sources.map((src, idx) => (
                  <li key={idx} className="break-all">{src}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. 4대 브랜드 용도별 비교 모드 (요청하신 국기 + 영문/품번 비교 스타일) */}
      {viewMode === 'compare' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-3">
          {CLEAR_4BRANDS_COMPARISON.map((block, bIdx) => (
            <div key={bIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <h4 className="text-sm sm:text-base font-black text-slate-900 border-b border-slate-200 pb-2 mb-3">
                {block.category}
              </h4>
              <ul className="space-y-2.5">
                {block.rows.map((row, rIdx) => (
                  <li key={rIdx} className="text-xs sm:text-sm leading-relaxed flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-base leading-none shrink-0 mt-0.5">{row.flag}</span>
                    <div className="break-keep">
                      <span className="font-black text-slate-900 mr-1.5">{row.brand}</span>
                      <span className="font-bold text-slate-700">{row.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* 3. 한눈에 보기 & 배합비 총괄표 모드 */}
      {viewMode === 'summary' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <h4 className="text-sm font-black text-slate-900 mb-3">📋 1. 4대 브랜드 한눈에 보기</h4>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="p-2 border border-slate-700 text-left">구분</th>
                  <th className="p-2 border border-slate-700 text-left">🇩🇪 글라슈리트 (Glasurit)</th>
                  <th className="p-2 border border-slate-700 text-left">🇺🇸 스피스헥커 (Spies Hecker)</th>
                  <th className="p-2 border border-slate-700 text-left">🇳🇱 시켄스 (Sikkens)</th>
                  <th className="p-2 border border-slate-700 text-left">🇺🇸 피피지 (PPG)</th>
                </tr>
              </thead>
              <tbody className="font-bold text-slate-700">
                <tr className="bg-slate-50">
                  <td className="p-2 border border-slate-200 font-black">소속·국가</td>
                  <td className="p-2 border border-slate-200">BASF 소속, 독일</td>
                  <td className="p-2 border border-slate-200">엑솔타 소속 (독일 쾰른 시작, 본사 미국 필라델피아)</td>
                  <td className="p-2 border border-slate-200">악조노벨 소속, 네덜란드 암스테르담</td>
                  <td className="p-2 border border-slate-200">PPG Industries, 미국 피츠버그</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-black">시작 연도</td>
                  <td className="p-2 border border-slate-200">1888 함부르크</td>
                  <td className="p-2 border border-slate-200">1882 쾰른</td>
                  <td className="p-2 border border-slate-200">1792 흐로닝언</td>
                  <td className="p-2 border border-slate-200">1883 피츠버그</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2 border border-slate-200 font-black">국내 유통</td>
                  <td className="p-2 border border-slate-200">조광페인트 (1994 기술제휴)</td>
                  <td className="p-2 border border-slate-200">스피스헥커 코리아 (12종 등재)</td>
                  <td className="p-2 border border-slate-200">노루페인트 국내 독점 판매권 (2020)</td>
                  <td className="p-2 border border-slate-200">피피지코리아 및 공식 대리점</td>
                </tr>
                <tr>
                  <td className="p-2 border border-slate-200 font-black">대표 배합비</td>
                  <td className="p-2 border border-slate-200 text-blue-700">P-C 전 품번 2:1+10% / 923-631·645 3:1:1</td>
                  <td className="p-2 border border-slate-200 text-blue-700">8055·8034·8450 3:1(VHS) / 8700 2:1+10% / 8810 2:1</td>
                  <td className="p-2 border border-slate-200 text-blue-700">LV·Plus HS 100:50:10 / LV Superior 100:60:20 / Aerodry 100:100</td>
                  <td className="p-2 border border-slate-200 text-blue-700">D8115/D8117 2:1 / D8177·D8135 전용 배합</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 shadow-sm space-y-2 text-xs">
            <h4 className="font-black text-amber-900 text-sm">⚠️ 교육 및 현장 적용 전 핵심 정정 요약 (TDS 검증)</h4>
            <ul className="space-y-1.5 font-bold text-amber-900 list-disc pl-4">
              <li><span className="font-black">시켄스 LV Superior 배합비:</span> 2:1:10%가 아니라 공식 TDS(S1.05.01) 기준 <span className="underline">100 : 60 : 20</span>입니다.</li>
              <li><span className="font-black">시켄스 Aerodry 배합비:</span> 클리어와 경화제를 <span className="underline">100 : 100 (1:1)</span>으로 혼합하며 60°C 5분, 20°C 45분 건조입니다.</li>
              <li><span className="font-black">스피스헥커 8055·8034·8450:</span> VHS 경화제 기준 <span className="underline">3 : 1</span> 배합입니다 (2:1은 8700 레이스 및 8810 스피드에 해당).</li>
              <li><span className="font-black">글라슈리트 구형 923 배합비 주의:</span> 923-610·625·631·645는 <span className="underline">3 : 1 : 1</span>이지만, 923-255·447·526F는 <span className="underline">2 : 1 + 10%</span>이므로 품번별 확인이 필수입니다.</li>
              <li><span className="font-black">바스락(baslac) 40-10 구분:</span> 글라슈리트와 별개인 BASF 브랜드이며, 40-10은 2K 패널 클리어이고 HS 범용 클리어는 <span className="underline">40-40</span>입니다.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
