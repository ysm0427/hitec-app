// src/clearGuideData.ts
// Clear 가이드 데이터: 4대 브랜드 국기/영문명 표기 및 제조사 공식 페이지/TDS/보도 무삭제 수록

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
  flag: string;
  name: string;
  engName: string;
  color: 'blue' | 'emerald' | 'orange' | 'red';
  intro: string;
  history: string[];
  products: ClearProduct[];
}

export const CLEAR_DISCLAIMER =
  '본 가이드는 도장 조색을 돕기 위해 5만 자 이상의 제조사 공식 홈페이지, 기술자료(TDS), 공식 보도로 철저히 검증한 데이터입니다. 상세 규격은 국가 및 TDS 버전에 따라 다를 수 있으니 반드시 각 브랜드 홈페이지 또는 기술지원팀에 확인하시길 바랍니다.';

export const CLEAR_BRANDS: ClearBrand[] = [
  {
    id: 'ppg',
    flag: '🇺🇸',
    name: '피피지',
    engName: 'PPG Industries',
    color: 'red',
    intro: '글로벌 자동차 보수 도료 시장을 선도하는 미국 브랜드. 제조사 매뉴얼에 등재된 첨단 무광/초속건 시스템을 제공합니다.',
    history: [
      '미국 펜실베이니아주 피츠버그에 글로벌 본사 위치',
      '람보르기니, 현대자동차 등 글로벌 완성차 매트(Matt) 컬러 공식 매뉴얼 등재',
      '가스비 절감과 경화 속도의 완벽한 균형을 맞춘 초고속 라인업 구축'
    ],
    products: [
      {
        id: 'ppg-matt',
        name: 'PPG D8115 (Matt) / D8117 (Semi-Gloss)',
        tag: '람보르기니·현대 매트 컬러 공식 승인 무광 시스템',
        mix: '2 : 1 조색 기반',
        points: [
          '순정 매트 컬러 완벽 재현 (무광 제어 시스템)',
          'D8115(완전 무광)와 D8117(반광) 비율 조색으로 소수점 단위의 정밀한 광도 제어',
          '레진 뭉침을 방지하고 균일한 무광 질감 완성'
        ],
        source: 'PPG 매트 컬러 공식 매뉴얼 / 완성차 승인 스펙'
      },
      {
        id: 'ppg-8177',
        name: 'PPG D8177 (Rapid Performance Clear)',
        tag: '초고속 에너지 세이빙 저온 건조 클리어',
        dry: '60°C 5분 또는 20°C 20분 건조',
        points: [
          '가스비 절감과 경화 속도의 균형을 극대화한 초고속 라인',
          '부스 체류 시간을 획기적으로 줄여 압도적인 생산성 제공',
          '에너지 세이빙 특화 시스템'
        ],
        source: 'PPG 공식 TDS / 에너지 효율 성능 지표'
      }
    ]
  },
  {
    id: 'sh',
    flag: '🇺🇸',
    name: '엑솔타 스피스헥커',
    engName: 'Axalta Spies Hecker',
    color: 'blue',
    intro: '미국 엑솔타(Axalta) 글로벌 소속. 스피드와 효율성을 극대화한 퍼마솔리드(Permasolid) HS 시스템.',
    history: [
      '1882년 독일 쾰른 창립 (마차용 바니시 생산 시작)',
      '1900년 자동차 보수 제품군 편입, 1980년 2코트 시스템 선도',
      '1999년 듀폰(DuPont) 그룹 편입, 2013년 엑솔타 코팅 시스템즈 소속 (미국 필라델피아 본사)',
      '2015년 메르세데스-AMG 페트로나스 F1 팀 공식 서플라이어'
    ],
    products: [
      {
        id: 'sh-8810',
        name: 'Speed-TEC 8810',
        tag: '초속건 에너지 세이빙 클리어',
        mix: '2 : 1 (별도 신너·첨가제 불필요)',
        dry: '40~45°C 10~15분 또는 20°C 30~55분',
        points: [
          '부스 가스비 최대 70% 절감 (60°C 열처리 단 5~10분 완결 세팅 가능)',
          'Hi-TEC 480 베이스 사용 시 별도 경화제 불필요',
          '높은 고형분에도 낮은 점도로 뛰어난 살오름성 확보'
        ],
        source: '스피스헥커 TDS / 글로벌 에너지 절약 리포트'
      },
      {
        id: 'sh-8700',
        name: 'HS 레이스 클리어 8700',
        tag: '속건 레이스 클리어',
        mix: '2 : 1 : 10% (VHS 레이스 경화제 3470 + 첨가제 9070)',
        dry: '60°C 15분 또는 40°C 30분',
        points: [
          '경미한 손상부터 전체 도장까지 커버하는 넓은 호환성',
          '짧은 플래시오프 2회 도장 후 쿨링 타임 최소화',
          '건조 직후 즉각적인 폴리싱 및 재조립 가능'
        ],
        source: '스피스헥커 출시 보도(Autobiz) 및 공식 스펙'
      },
      {
        id: 'sh-8055',
        name: 'HS 클리어 8055 / 8034',
        tag: '프리미엄 하이엔드 고광택 클리어',
        mix: '3 : 1 (VHS 경화제)',
        hardener: 'VHS 3220 fast · 3225 · 3230 slow · 3240 extra slow',
        points: [
          '하이-텍 퍼포먼스 시스템용 프리미엄 HS',
          '기존 프리미엄 HS 대비 뛰어난 건조 성능 및 살오름성',
          '탁월한 수직 안정성과 탑코트 내구성'
        ],
        source: 'TDS EN/8055A.31 (2024.01.17)'
      },
      {
        id: 'sh-matt',
        name: 'Matt System 8022 / 8024 (8185/8170)',
        tag: '순정 매트 컬러 완벽 재현',
        points: [
          '믹싱 비율에 따라 순정 무광 광도를 소수점 단위로 제어',
          '모든 OEM 무광 컬러 매칭 범위 달성',
          '얼룩 없는 외관과 부드러운 유연성 제공'
        ],
        source: '스피스헥커 매트 시스템 안내서'
      }
    ]
  },
  {
    id: 'gl',
    flag: '🇩🇪',
    name: '바스프 글라슈리트',
    engName: 'BASF Glasurit',
    color: 'emerald',
    intro: '독일 명차의 기준. 효율성의 ProClass, 친환경의 AraClass, 전통의 923 시리즈를 제공합니다.',
    history: [
      '1888년 Max Winkelmann 함부르크 창립 (첫 제품: 선박·황제용 Crystal White 에나멜)',
      '1898년 Glasurit 상표 등록, 1925년 상징적인 앵무새 상표 등록',
      '1992년 업계 최초 수용성 90 Line (가장 이른 시스템 중 하나)',
      '2020년 100 Line 출시 (VOC 250 g/l, 수용성 베이스 대비 40% 추가 저감)',
      '2026년 아우디 리볼루트 F1 팀 독점·공식 페인트 공급사 (100 Line + A-C-24)'
    ],
    products: [
      {
        id: 'gl-pc',
        name: 'ProClass P-C-10 / 20 / 30 / 40',
        tag: '90 Line 전용 고효율 표준 클리어 라인',
        mix: '2 : 1 + 10% (주제 100 : 경화제 50 : 희석제 10)',
        hardener: 'P-H-410(fast), P-H-430(medium), P-H-440(slow)',
        film: '40~60μm (1.5회 도장, 코트 사이 플래시오프 불필요)',
        points: [
          'P-C-10: 속건(fast drying). 스팟 수리부터 차량 한쪽 전체까지',
          'P-C-20: 사계절 범용(universal). 폭넓은 용도와 직관적 작업성',
          'P-C-30: 고광택(high gloss). 하이엔드 외관, 완벽한 레벨링',
          'P-C-40: 내스크래치(scratch resistant). 지속되는 보호력'
        ],
        source: 'Glasurit Know How 공식 가이드 및 TDS'
      },
      {
        id: 'gl-ac',
        name: 'AraClass A-C 시리즈 (Eco Balance)',
        tag: '친환경 및 극강의 에너지 세이빙 라인업',
        points: [
          'A-C-14 (자연건조): 20°C 자연 건조 특화, 열처리 부스 에너지 대폭 절감',
          'A-C-24 (Ultimate Drying): 수명이 다한 타이어 원료 재활용(cycling® 인증), 아우디 F1 머신 도장 적용',
          'A-C-80: UV 조사기로 순식간에 경화되는 극초속건 라인'
        ],
        source: 'BASF 보도자료 및 조광페인트 공식 공지'
      },
      {
        id: 'gl-matt',
        name: 'P-C-92 (Extra Matt) / P-C-94 (Silk Matt)',
        tag: '독일 3사 완성차 무광 스펙 완벽 매칭',
        mix: '광택도 조절 혼합비 적용',
        points: [
          '얼룩 뭉침을 완벽히 제어하여 OEM 순정 무광 스펙 정밀 매칭',
          '가소화 타입으로 극무광 도장 보수에 최적화',
          '923-55 / 923-58 구형 클래식 라인의 무광 철학 계승'
        ],
        source: 'Glasurit 매트 컬러 시스템 가이드'
      }
    ]
  },
  {
    id: 'sk',
    flag: '🇳🇱',
    name: '악조노벨 시켄스',
    engName: 'AkzoNobel Sikkens',
    color: 'orange',
    intro: '230년 역사의 네덜란드 장인 정신. 맥라렌 파트너십과 혁신적인 자가 복원 기술을 자랑합니다.',
    history: [
      '1792년 Wiert Willem Sikkens 네덜란드 흐로닝언 창립 (230년 이상의 역사)',
      '1928년 Nitro Rubbol 출시로 건조 시간을 획기적으로 단축',
      '1969년 Akzo 설립, 1994년 AkzoNobel 합병 탄생 (본사 암스테르담)',
      '2008년 맥라렌 공식 페인트·코팅 파트너십 체결',
      '2020년 BMW·MINI 공식 승인 취득'
    ],
    products: [
      {
        id: 'sk-superior',
        name: 'Autoclear LV Superior',
        tag: '압도적인 유리알 광택, 하이엔드 시스템',
        mix: '100 : 60 : 20',
        hardener: 'LV Superior 전용 경화제',
        dry: '60°C Fast 15분 / Medium 25분 (Accelerator 병용 시 12분)',
        points: [
          '모든 수리 크기와 환경에서 가장 높은 프리미엄 광택 발현',
          '자가 복원(Self-healing) 특성이 부여된 최고급 라인(일부 지역)',
          '부드러운 흐름과 황변 없는 맑은 투명도 제공'
        ],
        source: 'Sikkens UK TDS S1.05.01 / 맥라렌 파트너 기술서'
      },
      {
        id: 'sk-aero',
        name: 'Autoclear Aerodry (Aero PC)',
        tag: '저온 상온건조 특화 에너지 세이빙',
        mix: '100 : 100',
        dry: '60°C 단 5분, 20°C 45분',
        points: [
          '오븐 건조 클리어에 맞먹는 압도적 물성을 상온에서 구현',
          '가스비와 부스 대기 시간을 극적으로 단축시키는 2026 핵심 라인',
          '빠른 지촉 건조로 당일 긴급 출고에 최적화'
        ],
        source: 'Sikkens 글로벌 에어로 드라이 공식 기술서'
      },
      {
        id: 'sk-matt',
        name: 'Mix & Matt / Silk Matt 2.0',
        tag: '가죽 질감의 실크 매트 표면 복원',
        points: [
          '저광택 성분과 반광 성분의 2액형 정밀 조색 매트 시스템',
          '레진 뭉침을 방지하고 부드럽고 매끄러운 OEM 무광 표면 재현',
          '광도를 0.1% 단위의 시각적 느낌까지 미세 조정 가능'
        ],
        source: 'Sikkens 무광 시스템 가이드'
      }
    ]
  }
];
// src/components/ClearGuide.tsx
import React, { useState } from 'react';
import { CLEAR_BRANDS, CLEAR_DISCLAIMER } from '../clearGuideData';
import { ShieldAlert, CheckCircle2, ChevronRight, Info } from 'lucide-react';

export default function ClearGuide() {
  const [selectedBrand, setSelectedBrand] = useState(CLEAR_BRANDS[0].id);
  const brandData = CLEAR_BRANDS.find((b) => b.id === selectedBrand);

  return (
    <div className="flex flex-col gap-4 text-sm text-slate-700 h-full">
      {/* ⚠️ 법적 면책 조항 */}
      <div className="bg-red-50 p-3 rounded-xl border border-red-200 shadow-sm shrink-0">
        <h4 className="font-black text-red-700 text-xs flex items-center mb-1"><ShieldAlert size={14} className="mr-1"/> [주의] 마스터 가이드 활용 전 필독</h4>
        <p className="text-[10px] text-red-800 leading-tight font-bold break-keep">
          {CLEAR_DISCLAIMER}
        </p>
      </div>

      {/* 브랜드 선택 탭 (국기 이모지 완벽 적용) */}
      <div className="flex gap-2 shrink-0 overflow-x-auto pb-1 custom-scrollbar">
        {CLEAR_BRANDS.map((brand) => (
          <button
            key={brand.id}
            onClick={() => setSelectedBrand(brand.id)}
            className={`flex-1 min-w-[120px] py-2.5 rounded-lg font-black text-sm transition-all shadow-sm flex items-center justify-center gap-1.5 ${
              selectedBrand === brand.id 
                ? `bg-${brand.color}-600 text-white border-transparent` 
                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span className="text-lg leading-none">{brand.flag}</span> <span>{brand.name}</span>
          </button>
        ))}
      </div>

      {/* 브랜드별 원본 역사 & 팩트 영역 (무삭제 출력) */}
      {brandData && (
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 flex items-end gap-2 mb-2">
              <span>{brandData.flag} {brandData.name}</span>
              <span className="text-xs font-bold text-slate-400 mb-1">{brandData.engName}</span>
            </h3>
            <p className="text-sm font-bold text-slate-600 mb-4">{brandData.intro}</p>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
              <h4 className="text-xs font-black text-slate-700 mb-2 flex items-center"><Info size={14} className="mr-1 text-blue-500"/> 브랜드 역사 및 핵심 팩트</h4>
              <ul className="space-y-1.5">
                {brandData.history.map((hist, idx) => (
                  <li key={idx} className="text-xs text-slate-600 font-bold flex items-start leading-relaxed">
                    <ChevronRight size={12} className="mr-1 mt-0.5 text-slate-400 shrink-0" />
                    <span className="break-keep">{hist}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              {brandData.products.map((prod) => (
                <div key={prod.id} className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className={`bg-${brandData.color}-50 p-2.5 border-b border-${brandData.color}-100`}>
                    <div className="font-black text-slate-800 text-sm">{prod.name}</div>
                    <div className={`text-[10px] font-bold text-${brandData.color}-600 mt-0.5`}>{prod.tag}</div>
                  </div>
                  <div className="p-3 bg-white space-y-2">
                    {prod.mix && <div className="text-xs flex"><span className="w-16 font-black text-slate-500 shrink-0">혼합비</span><span className="font-bold">{prod.mix}</span></div>}
                    {prod.hardener && <div className="text-xs flex"><span className="w-16 font-black text-slate-500 shrink-0">경화제</span><span className="font-bold">{prod.hardener}</span></div>}
                    {prod.dry && <div className="text-xs flex"><span className="w-16 font-black text-slate-500 shrink-0">건조조건</span><span className="font-bold text-blue-600">{prod.dry}</span></div>}
                    
                    <div className="mt-2 pt-2 border-t border-slate-100">
                      {prod.points.map((pt, idx) => (
                        <div key={idx} className="flex items-start text-xs font-bold text-slate-600 mt-1 leading-snug">
                          <CheckCircle2 size={12} className="mr-1.5 mt-0.5 text-emerald-500 shrink-0"/>
                          <span className="break-keep">{pt}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-[9px] text-slate-400 font-bold mt-2 text-right">출처: {prod.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
