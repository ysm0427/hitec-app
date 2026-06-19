import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sliders, Trash2, Plus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, BookOpen, Share2, Zap, Search, FileSpreadsheet, History,
  Info, Award, Terminal
} from 'lucide-react';

interface TonerData {
  role: string; type: string; face: string; flop: string; desc: string; details?: [string, string][];
}

// 💡 1. 공식 안료 데이터베이스
const TONER_DB: Record<string, TonerData> = {
  'WT 144':{role:'그리니쉬 블루',type:'solid',face:'#0284c7',flop:'#0c4a6e',desc:'녹색을 띠는 고농축 청색 수성 안료 조색제입니다.',details:[['일반 특성','녹색을 띠는 고농축 청색 수성 안료 조색제입니다.'],['색상 및 외관 변화','정면에서는 짙은 청색을 띠며, 측면(플롭)으로 갈수록 맑은 녹청색 기운이 은은하게 발현됩니다.'],['용도 및 적용 컬러','기존 WT346 안료를 대체하기 위해 개발되었으며, 청녹색 계열의 솔리드 및 이펙트 컬러 조색에 범용적으로 사용됩니다.'],['배합 및 혼합 비율','기존 WT346 대체 시 [WT346 : WT144 = 1 : 0.9]의 정밀 비율을 적용하여 배합해야 동일한 착색력을 얻을 수 있습니다.'],['경고 및 주의사항','대체 배합 시 미세한 명도 및 채도 차이가 발생할 수 있으므로, 반드시 시편(Color Chip) 도장 후 대조 및 미세 조정을 거쳐야 합니다.']]},
  'WT 154':{role:'블루 이펙트',type:'silver_fine',face:'#3b82f6',flop:'#1e3a8a',desc:'청색으로 특수 착색된 광휘형 알루미늄 조색제입니다.',details:[['일반 특성','청색으로 특수 착색된 광휘형 알루미늄 조색제입니다.'],['색상 및 외관 변화','입자의 반짝임이 매우 뛰어나며 도막에 맑고 깊은 청색 메탈릭 질감을 뚜렷하게 부여합니다.'],['용도 및 적용 컬러','주로 채도가 높고 입자감이 두드러지는 고성능 차량의 청색 계열 특수 메탈릭 컬러 조색 시 핵심적으로 사용됩니다.'],['배합 및 혼합 비율','조색 프로그램(Phoenix)의 표준 배합 데이터를 기준하여 정밀 저울로 계량하며, 임의로 과량 첨가하지 않습니다.'],['경고 및 주의사항','금속 입자가 무거워 용기 바닥에 가라앉기 쉬우므로, 사용 전 반드시 조색제 전용 교반기로 충분히 혼합(Agitation)해야 합니다.']]},
  'WT 188':{role:'슈퍼 딥 블랙',type:'solid',face:'#0f172a',flop:'#020617',desc:'명도를 극단적으로 낮춘 매우 어두운 흑색 조색제입니다.',details:[['일반 특성','명도를 극단적으로 낮춘 매우 어두운 흑색 조색제입니다.'],['색상 및 외관 변화','기존 딥 블랙 계열(WT388 등)과 비교했을 때 밑색이 보이지 않을 정도로 더 차갑고 깊은 완전 흑색을 구현합니다.'],['용도 및 적용 컬러','범용적이지 않으며, 극한의 명암 대비가 필요한 특정 흑색 계열 OEM 컬러나 특수 솔리드 블랙 조색에 제한적으로 사용됩니다.'],['배합 및 혼합 비율','착색력이 매우 강하므로 일반 블랙을 대체하여 사용할 경우 기존 대비 절반 이하의 비율부터 미세 조정하며 투입합니다.'],['경고 및 주의사항','과량 사용 시 도막이 탁해지거나 이펙트 안료의 반짝임을 완전히 덮어버릴(Kill) 수 있으므로 사용량 통제에 각별한 주의가 필요합니다.']]},
  'WT 197':{role:'실크 실버 울트라 파인',type:'silver_fine',face:'#e2e8f0',flop:'#64748b',desc:'특수 초미립 알루미늄 조색제입니다.',details:[['일반 특성','입자 크기가 극도로 미세하게 분쇄된 특수 초미립 알루미늄 조색제입니다.'],['색상 및 외관 변화','입자감이 겉으로 도드라지지 않아 마치 비단(Silk)처럼 부드럽고 매끈하며 밀도 높은 금속 질감을 발현합니다.'],['용도 및 적용 컬러','프리미엄 세단의 매끄러운 고휘도 은색을 연출할 때 사용되며, 대표적으로 Lexus(1F1), M.Benz(047) 등에 적용됩니다.'],['배합 및 혼합 비율','조색 프로그램(Phoenix)의 정해진 표준 배합 수치를 엄격히 준수하여 투입합니다.'],['경고 및 주의사항','미립자 알루미늄의 특성상 도장 횟수나 에어 압력(스프레이 기법)에 따라 플롭(명암 차이)이 크게 달라질 수 있으므로 표준 도장법을 준수해야 합니다.']]},
  'WT 300':{role:'마룬',type:'solid',face:'#991b1b',flop:'#450a0a',desc:'짙은 밤색 기운이 도는 어두운 적색 수성 조색제입니다.',details:[['일반 특성','짙은 밤색 기운이 도는 어두운 적색(Maroon) 수성 조색제입니다.'],['색상 및 외관 변화','또 다른 마론 안료인 WT332에 비해 채도가 더 높으며, 측면(110도)에서 관찰할 때 명도가 급격히 어두워지는 강한 플롭 특성을 보입니다.'],['용도 및 적용 컬러','주로 입체감이 깊어야 하는 적색 베이스 이펙트(펄/메탈릭) 컬러 조색 시 톤을 눌러주기 위해 사용됩니다.'],['배합 및 혼합 비율','조색 프로그램에 명시된 기본 배합비를 준수하여 첨가합니다.'],['경고 및 주의사항','솔리드 적색에 다량 첨가 시 색상이 탁해지고 검붉게 변질될 수 있으므로 미세 조색 시 한 방울씩 조심스럽게 투입해야 합니다.']]},
  'WT 303':{role:'플래틴 실버 엑스트라 화인',type:'silver_fine',face:'#d1d5db',flop:'#475569',desc:'고휘도 광휘형 초미립 알루미늄 조색제입니다.',details:[['일반 특성','빛 반사율이 극대화된 고휘도(빛 반사가 강한) 광휘형 초미립 알루미늄 조색제입니다.'],['색상 및 외관 변화','동일한 플래티닌 실버 계열(WT389 등) 중에서 입자가 가장 작아 거친 느낌 없이 밝고 매끄러운 금속 반사광을 제공합니다.'],['용도 및 적용 컬러','고운 입자로 높은 정면 명도를 요구하는 현대적인 실버 메탈릭 컬러나 화이트 펄 바탕색을 조색할 때 사용됩니다.'],['배합 및 혼합 비율','배합표의 정량 규정을 엄격하게 준수하여 전자저울로 정밀 계량합니다.'],['경고 및 주의사항','입자가 가라앉아 있을 수 있으므로 교반기(믹싱 머신)에 장착하여 매일 2회 이상 충분히 교반해야 안정적인 색상을 낼 수 있습니다.']]},
  'WT 304':{role:'매직 스파클 이펙트',type:'xirallic',face:'#fef08a',flop:'#475569',desc:'투명한 황색 코팅이 적용된 유리 입자 조색제입니다.',details:[['일반 특성','투명한 황색 코팅이 적용된 입자 크기가 매우 큰 유리 입자(Glass Flake) 조색제입니다.'],['색상 및 외관 변화','도장면에 다이아몬드 가루를 뿌린 듯 다방향으로 강렬하게 튀는 입체적인 스파클링(Sparkling) 효과를 부여합니다.'],['용도 및 적용 컬러','입자감이 극도로 도드라져야 하는 특수 전시용 컬러나 일부 프리미엄 차종의 특수 펄 컬러 조색에 제한적으로 사용됩니다.'],['배합 및 혼합 비율','은폐력이 전무하므로 기본 안료에 소량(1~5%) 첨가하여 효과를 부여하는 형태로 처방됩니다.'],['경고 및 주의사항','유리 입자가 커서 도장 표면이 거칠어질 수 있으므로, 최종 클리어코트(투명) 작업 시 2.5회 이상 두껍게 도장하여 표면을 평활하게 잡아주어야 합니다.']]},
  'WT 305':{role:'울트라 화인 실버',type:'silver_fine',face:'#cbd5e1',flop:'#334155',desc:'반짝임이 부드러운 특수 미립자 알루미늄 수성 조색제입니다.',details:[['일반 특성','반짝임이 매우 부드러운 특수 미립자 알루미늄 수성 조색제입니다.'],['색상 및 외관 변화','일반 메탈릭처럼 입자가 눈에 띄지 않으며 은은하고 매끈한 금속광택 베이스를 형성합니다.'],['용도 및 적용 컬러','매끈한 느낌의 하이엔드 은색을 연출할 때 메인으로 사용되며, Nissan(KAB), Lexus(1F1), M.Benz(047) 등의 배합에 들어갑니다.'],['배합 및 혼합 비율','TDS(기술자료) 및 조색 프로그램의 중량 데이터를 기반으로 계량합니다.'],['경고 및 주의사항','도장 기법(웨트/드라이)에 따라 색상 톤이 민감하게 변할 수 있으므로, 보수 도장 시 블랜딩(보카시) 작업에 각별히 유의해야 합니다.']]},
  'WT 307':{role:'프리즈마 실버',type:'xirallic',face:'#e2e8f0',flop:'#a855f7',desc:'빛을 분산시키는 홀로그램 특성의 조색제입니다.',details:[['일반 특성','빛을 파장별로 분산시키는 홀로그램 특성을 지닌 특수 광학 조색제입니다.'],['색상 및 외관 변화','정면(직사광선 하)에서는 은색을 띠지만, 빛의 굴절 및 관찰 각도에 따라 표면에 무지개색(스펙트럼) 효과가 나타납니다.'],['용도 및 적용 컬러','대표적으로 Audi(LX7T)와 같은 럭셔리 라인업의 특수 홀로그램 컬러 배합에 독점적으로 사용됩니다.'],['배합 및 혼합 비율','단가가 매우 높은 특수 안료이므로 조색표에 지시된 필요 최소량만 정확하게 계량하여 사용합니다.'],['경고 및 주의사항','안료 성질상 일반 실버와 혼합 시 프리즘 효과가 쉽게 죽어버리므로, 임의로 다른 컬러에 섞어 사용하지 않는 것을 권장합니다.']]},
  'WT 308':{role:'브라이트 오렌지',type:'solid',face:'#ea580c',flop:'#7c2d12',desc:'탁함이 없는 매우 맑고 선명한 주황색 조색제입니다.',details:[['일반 특성','탁함이 전혀 없는 매우 맑고 선명한 주황색 조색제입니다.'],['색상 및 외관 변화','높은 투명도로 인해 빛을 그대로 투과시키며 채도 높은 화사한 오렌지빛을 발산합니다.'],['용도 및 적용 컬러','투명한 발색 특성 때문에 솔리드 컬러보다는 주로 알루미늄이나 펄이 혼합되는 이펙트 컬러의 화려함을 살릴 때 주로 사용됩니다.'],['배합 및 혼합 비율','조색 프로그램의 표준 데이터 배합 비율을 따릅니다.'],['경고 및 주의사항','은폐력(바탕색을 가리는 능력)이 심각하게 떨어지므로, 솔리드 단독 도장 시 바탕에 전용 프라이머나 서페이서를 반드시 도포해야 합니다.']]},
  'WT 309':{role:'브릴리언트 마젠타',type:'solid',face:'#d946ef',flop:'#701a75',desc:'고채도의 자주색(Magenta) 조색제입니다.',details:[['일반 특성','가장 맑고 밝은 톤을 자랑하는 고채도의 자주색(Magenta) 조색제입니다.'],['색상 및 외관 변화','어두워지거나 탁해지지 않고 영롱하고 생기 있는 핑크 및 자주빛을 선명하게 유지합니다.'],['용도 및 적용 컬러','채도가 매우 높아야 하는 핑크 펄이나 브라이트 레드 이펙트 컬러를 조색할 때 탁색 방지용으로 사용합니다.'],['배합 및 혼합 비율','조색표의 정량에 맞게 계량하되, 미세 조색 시 소량씩 첨가하며 채도를 확인합니다.'],['경고 및 주의사항','안료 자체의 은폐력이 매우 낮아 단독 사용은 불가하며, 반드시 화이트나 메탈릭 베이스와 혼합하여 은폐력을 보완해야 합니다.']]},
  'WT 310':{role:'파우더 펄 바인더',type:'binder',face:'#ffffff',flop:'#ffffff',desc:'단독으로 색상을 내지 않는 전용 조색제 바인더입니다.',details:[['일반 특성','색상을 내는 안료가 포함되지 않은 특수 목적의 투명 수지(Binder)입니다.'],['색상 및 외관 변화','자체 색상이 없으므로 건조 후 투명 한 도막을 형성하며 원색에 영향을 주지 않습니다.'],['용도 및 적용 컬러','건식 분말(가루) 형태인 특수 파우더 펄을 액상 도료 시스템에 사용하기 위해 안정적으로 분산시켜 주는 결합제 역할을 합니다.'],['배합 및 혼합 비율','해당 파우더 펄의 기술 문서(TDS)에 명시된 바인더 대 파우더의 중량 비율을 정확히 준수하여 혼합합니다.'],['경고 및 주의사항','혼합 시 펄 덩어리가 지지 않도록 소량씩 천천히 투입하며 부드럽게 저어주어야 완벽한 분산이 이루어집니다.']]},
  'WT 311':{role:'루비 레드',type:'solid',face:'#ef4444',flop:'#7f1d1d',desc:'약하게 황색 기운을 띠는 투명한 적색 수성 조색제입니다.',details:[['일반 특성','약하게 황색(Yellowish) 기운을 띠는 맑고 투명한 적색 수성 조색제입니다.'],['색상 및 외관 변화','이름처럼 보석 루비와 같이 맑고 깊이 있는 붉은 빛을 내며 탁해지지 않습니다.'],['용도 및 적용 컬러','채도가 높고 깊이감이 요구되는 캔디 컬러 느낌의 적색 이펙트(메탈릭/펄) 컬러 조색에 주로 사용됩니다.'],['배합 및 혼합 비율','제공되는 조색 배합 데이터에 따라 정량 투입합니다.'],['경고 및 주의사항','투명 안료이므로 은폐력이 극히 취약하여 솔리드 컬러 도장용으로는 단독 사용을 금장합니다.']]},
  'WT 312':{role:'매직 파이어 이펙트',type:'pearl',face:'#ef4444',flop:'#22c55e',desc:'관찰 각도에 따라 색상이 극단적으로 교차하는 특수 광학 간섭 펄입니다.',details:[['일반 특성','관찰 각도에 따라 색상이 극단적으로 교차하는 특수 광학 간섭 펄 조색제입니다.'],['색상 및 외관 변화','각도별로 15도(정면)는 맑은 적색, 45도는 맑은 녹색, 110도(완전 측면)는 약한 녹색으로 다이내믹하게 색상이 반전됩니다.'],['용도 및 적용 컬러','카멜레온 효과가 들어간 커스텀 페인팅이나 두 가지 이상의 색이 교차해야 하는 특수 OEM 컬러 조색에 제한적으로 쓰입니다.'],['배합 및 혼합 비율','고가 안료이므로 배합표의 필요 수량만 정확하게 저울질하여 사용합니다.'],['경고 및 주의사항','투명 클리어코트 마감 전에는 매직 효과가 완벽히 보이지 않을 수 있으므로, 반드시 클리어코트까지 도장 후 색상을 판독해야 합니다.']]},
  'WT 315':{role:'엑스트라 화인 블루 펄',type:'pearl',face:'#3b82f6',flop:'#84cc16',desc:'가장 미세한 입자 크기의 약한 적색 기운 청색 간섭 펄입니다.',details:[['일반 특성','가장 미세한 입자 크기로 분쇄된 약한 적색 기운의 청색 간섭 펄 조색제입니다.'],['색상 및 외관 변화','빛 반사 시 정면(15도)에서는 적청색을 내고 측면(45도/110도)으로 갈수록 부드러운 녹황색으로 변하는 입체감을 줍니다.'],['용도 및 적용 컬러','펄 입자가 겉으로 거칠게 보이지 않고 은은한 청색 간섭 효과만을 요구하는 고급 세단 컬러에 주로 사용됩니다.'],['배합 및 혼합 비율','화인 블루 펄(WT372)을 대체할 수 없으며 시스템 지정 배합표 수치를 따릅니다.'],['경고 및 주의사항','안료 고유의 성질상 다른 제품과 혼합 사용 시 결과가 다를 수 있습니다.']]
};

const catalogData = Object.entries(TONER_DB).map(([code, data]) => {
  let labelCategory = "일반 특성"; let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
  const r = data.role || ''; const d = data.desc || ''; const t = data.type || '';

  if(r.includes("블루") || r.includes("레드") || r.includes("옐로우") || r.includes("그린") || r.includes("오렌지") || r.includes("바이올렛") || r.includes("마룬")) { labelCategory = "색상/외관"; badgeColor = "bg-emerald-50 text-emerald-600 border-emerald-200"; } 
  else if (d.includes("금지") || d.includes("최대") || d.includes("주의") || d.includes("제한")) { labelCategory = "경고/주의사항"; badgeColor = "bg-red-50 text-red-600 border-red-200 shadow-sm shadow-red-100"; } 
  else if (r.includes("실버") || r.includes("펄") || r.includes("이펙트") || d.includes("이펙트")) { labelCategory = "이펙트 전용"; badgeColor = "bg-blue-50 text-blue-600 border-blue-200"; } 
  else if (t === "binder" || d.includes("첨가제") || d.includes("수지") || d.includes("바인더")) { labelCategory = "배합/첨가제"; badgeColor = "bg-purple-50 text-purple-600 border-purple-200"; }
  return { code, ...data, labelCategory, badgeColor };
});

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHue = (a: number, b: number, t: number) => { let d = b - a; if (d > 180) d -= 360; if (d < -180) d += 360; let h = a + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360; return h; };

const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };

const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code && TONER_DB[t.code]);
  const sumW = colorToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);

  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let rBlue=0; let rGreen=0; let rRed=0; let rYellow=0; let rViolet=0;
  let wSilver=0; let wWhite=0; let wBlack=0; let wPearl=0; let wBinder=0;
  let interferenceColor: string | null = null;

  colorToners.forEach(t => {
    const w = safeNum(parseFloat(t.adjustedWeight));
    if (w <= 0) return;

    const role = TONER_DB[t.code]?.role || '';
    const code = t.code || '';
    let strength = 1.0;
    if (code.includes('144') || code.includes('341') || code.includes('300') || code.includes('338')) strength = 2.5;

    if (role.includes('컴포넌트') || role.includes('바인더') || role.includes('애디티브') || ['WT 385', 'WT 387', 'WT 386', 'WT 400', 'WT 3080', 'WT 310'].some(c => code.includes(c.replace('WT ', '')))) {
      wBinder += w;
    } else if (role.includes('블랙') || code.includes('323') || code.includes('388') || code.includes('188') || code.includes('1500')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄') || code.includes('362') || code.includes('357') || code.includes('197') || code.includes('303') || code.includes('305') || code.includes('307')) wSilver += w;
    else if (role.includes('화이트') || code.includes('321') || code.includes('328') || code.includes('322')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('스파클') || code.includes('304') || code.includes('377') || code.includes('381')) {
      wPearl += w;
      if (role.includes('블루') || code.includes('381')) { interferenceColor = 'blue'; rBlue += w * 0.15; }
      else if (role.includes('레드') || role.includes('마젠타')) { interferenceColor = 'red'; rRed += w * 0.15; }
      else if (role.includes('그린') || code.includes('380')) { interferenceColor = 'green'; rGreen += w * 0.15; }
      else if (role.includes('골드') || code.includes('304') || code.includes('382')) { interferenceColor = 'yellow'; rYellow += w * 0.15; }
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
  const l = isNaN(opticsObj[angle].l) ? 90 : Math.round(opticsObj[angle].l);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

const getInteractiveBackground = (opticsObj: any, lPos: any) => {
  if (!opticsObj || !opticsObj.face || !opticsObj.mid || !opticsObj.flop) return '#f1f5f9';
  
  const viewAngleT = Math.max(0, Math.min(1, (lPos.x || 50) / 100));
  
  const lerpColorAdvanced = (c1: any, c2: any, t: number) => {
      let d = c2.h - c1.h; if (d > 180) d -= 360; if (d < -180) d += 360;
      let h = c1.h + d * t; if (h < 0) h += 360; if (h >= 360) h -= 360;
      return { h, s: lerp(c1.s, c2.s, t), l: lerp(c1.l, c2.l, t) };
  };

  let activeBaseColor = viewAngleT > 0.5 
      ? lerpColorAdvanced(opticsObj.mid, opticsObj.face, (viewAngleT - 0.5) * 2) 
      : lerpColorAdvanced(opticsObj.flop, opticsObj.mid, viewAngleT * 2);
      
  const h = isNaN(activeBaseColor.h) ? 0 : Math.round(activeBaseColor.h);
  const s = isNaN(activeBaseColor.s) ? 0 : Math.round(activeBaseColor.s);
  const l = isNaN(activeBaseColor.l) ? 50 : Math.round(activeBaseColor.l);
  
  const baseColorStr = `hsl(${h}, ${s}%, ${l}%)`;
  
  const dist = Math.sqrt(Math.pow((lPos.x || 50) - 50, 2) + Math.pow((lPos.y || 50) - 50, 2)); 
  const normalizedDist = Math.min(1, dist / 70); 
  const highlightAlpha = isNaN(normalizedDist) ? 0.5 : Number(lerp(0.6, 0.0, normalizedDist).toFixed(2));
  const distPercent = isNaN(normalizedDist) ? 50 : Math.round(lerp(20, 70, normalizedDist));
  const darkL = Math.round(l * 0.4);
  
  return `radial-gradient(circle at ${lPos.x || 50}% ${lPos.y || 50}%, rgba(255,255,255,${highlightAlpha}) 0%, ${baseColorStr} ${distPercent}%, hsl(${h}, ${s}%, ${darkL}%) 100%)`;
};

// 🚨 255자 한계 박살내는 수퍼 압축기
const packToners = (tonerList: any[]) => {
    return tonerList.filter(t => t.code).map(t => {
        const c = t.code.replace('WT ', '').trim();
        const w = t.adjustedWeight || '';
        const h = (t.history || []).join(',');
        return `${c}_${w}_${h}`;
    }).join('*');
};

const unpackToners = (str: string) => {
    if (!str) return [];
    return str.split('*').map((t, i) => {
        const [c, w, h] = t.split('_');
        return {
            id: `restored_${Date.now()}_${i}`,
            code: c ? `WT ${c}` : '',
            adjustedWeight: w || '',
            history: h ? h.split(',') : []
        };
    });
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [] }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [] }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  
  const [targetColorCode, setTargetColorCode] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [carModel, setCarModel] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00");
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00");
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  
  const [isBaseConfirmed, setIsBaseConfirmed] = useState(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);

  const [restoredViewData, setRestoredViewData] = useState<any>(null);
  const [isTransferTab, setIsTransferTab] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const d = urlParams.get('d');

        // 진짜 전용 도메인을 감지해서 보관해두는 스마트 로직
        const ori = window.location.origin;
        if (!ori.includes('google') && !ori.includes('gemini') && !ori.includes('usercontent') && !ori.includes('null')) {
            localStorage.setItem('hitec_clean_domain', ori);
        }

        if (d) {
            try {
                let parsed;
                if (d.includes('%7B') || d.includes('{')) {
                    parsed = JSON.parse(decodeURIComponent(d));
                } else {
                    const parts = d.split('|').map(decodeURIComponent);
                    parsed = {
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
                
                localStorage.setItem('hitec_broadcast', JSON.stringify({ data: parsed, ts: Date.now() }));
                window.close(); 
                setIsTransferTab(true);
                return; 
            } catch (e) {
                console.error("URL 파싱 실패", e);
            }
        }

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'hitec_broadcast' && e.newValue) {
                const payload = JSON.parse(e.newValue);
                setRestoredViewData(payload.data);
            }
        };
        window.addEventListener('storage', handleStorageChange);

        const savedBase = localStorage.getItem('hitec_base');
        const savedPearl = localStorage.getItem('hitec_pearl');
        const savedCode = localStorage.getItem('hitec_code');
        const savedMode = localStorage.getItem('hitec_mode');
        const savedVehicle = localStorage.getItem('hitec_vehicle');
        const savedCarModel = localStorage.getItem('hitec_carmodel');
        const savedJob = localStorage.getItem('hitec_job');
        const savedNotes = localStorage.getItem('hitec_notes');
        
        if (savedBase) setToners(JSON.parse(savedBase));
        if (savedPearl) setPearlToners(JSON.parse(savedPearl));
        if (savedCode) setTargetColorCode(savedCode);
        if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode));
        if (savedVehicle) setVehicleNumber(savedVehicle);
        if (savedCarModel) setCarModel(savedCarModel);
        if (savedJob) setJobDescription(savedJob);
        if (savedNotes) setSpecialNotes(savedNotes);
        
        setIsLoaded(true);

        return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('d')) return;

      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('hitec_base', JSON.stringify(toners));
          localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners));
          localStorage.setItem('hitec_code', targetColorCode);
          localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode));
          localStorage.setItem('hitec_vehicle', vehicleNumber);
          localStorage.setItem('hitec_carmodel', carModel);
          localStorage.setItem('hitec_job', jobDescription);
          localStorage.setItem('hitec_notes', specialNotes);
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, isLoaded]);

  const activeCodes = [...toners, ...pearlToners].map(t => t.code).filter(c => c !== '');

  useEffect(() => {
    tonersRef.current = toners;
    pearlTonersRef.current = pearlToners;
    isThreeCoatModeRef.current = isThreeCoatMode;
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    
    setTotalBaseWeight(baseTotal.toFixed(2));
    setTotalPearlWeight(pearlTotal.toFixed(2));
    setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    
    setBaseOptics(getOptics(toners));
    setPearlOptics(getOptics(pearlToners));
    
    const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners;
    setFinalOptics(getOptics(activeToners));

    const checkMetallic = (list: any[]) => list.some(t => {
      const type = TONER_DB[t.code]?.type || '';
      return type !== 'solid' && type !== 'binder' && type !== '';
    });
    setIsBaseMetallic(checkMetallic(toners));
    setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  useEffect(() => {
    if (focusTarget) {
      let attempts = 0;
      const interval = setInterval(() => {
        const el = focusTarget.type === 'code' ? codeRefs.current[focusTarget.id] : weightRefs.current[focusTarget.id];
        if (el) {
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            clearInterval(interval);
            setFocusTarget(null);
        }
        attempts++;
        if (attempts > 10) {
            clearInterval(interval);
            setFocusTarget(null);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [focusTarget, toners, pearlToners]);

  const handlePointerMove = (e: any) => {
    if (!isDraggingLight || !viewerRef.current) return;
    const rect = viewerRef.current.getBoundingClientRect();
    let x = ((e.clientX - rect.left) / rect.width) * 100; let y = ((e.clientY - rect.top) / rect.height) * 100;
    setLightPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleClearAll = () => {
    setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [] }]); 
    setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [] }]); 
    setTargetColorCode(''); 
    setVehicleNumber(''); 
    setCarModel(''); 
    setJobDescription('');
    setSpecialNotes('');
    setIsBaseConfirmed(false); 
    setScannedImage(null);
  };

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
                targetList[emptyIndex] = { ...targetList[emptyIndex], code: finalCode, adjustedWeight: finalWeight, history: targetList[emptyIndex].history || [] };
            } else {
                targetList.push({ id: `scan_${Date.now()}_${i}`, code: finalCode, adjustedWeight: finalWeight, history: [] });
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
                        const currentHistory = nextPearl[j].history || [];
                        const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== orphanWeight) ? [...currentHistory, orphanWeight] : currentHistory;
                        nextPearl[j] = { ...nextPearl[j], adjustedWeight: orphanWeight, history: nextHistory }; found = true; break;
                    }
                }
            }
            if (!found) {
                for (let j = nextBase.length - 1; j >= 0; j--) {
                    if (nextBase[j].code !== '' && (!nextBase[j].adjustedWeight || nextBase[j].adjustedWeight === '')) {
                        const currentHistory = nextBase[j].history || [];
                        const nextHistory = (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== orphanWeight) ? [...currentHistory, orphanWeight] : currentHistory;
                        nextBase[j] = { ...nextBase[j], adjustedWeight: orphanWeight, history: nextHistory }; found = true; break;
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

  const handleWeightBlur = (id: string, value: string, isPearl = false) => {
    if (!value) return;
    const setter = isPearl ? setPearlToners : setToners;
    setter(prev => prev.map(t => {
      if (t.id === id) {
        const currentHistory = t.history || [];
        if (currentHistory.length === 0 || currentHistory[currentHistory.length - 1] !== value) {
          return { ...t, history: [...currentHistory, value] };
        }
      }
      return t;
    }));
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
            if (TONER_DB[testCode]) {
                finalCode = testCode;
                setFocusTarget({ id: id, type: 'weight' }); 
            }
        }
        return { ...toner, code: finalCode };
      }
      return toner;
    }));
  };

  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          const newId = `new_${Date.now()}`; 
          const newToner = { id: newId, code: '', adjustedWeight: "", history: [] };
          if (isPearl) { setPearlToners([...pearlToners, newToner]); } 
          else { setToners([...toners, newToner]); }
          setFocusTarget({ id: newId, type: 'code' }); 
      }
  };

  const removeToner = (id: string, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id));
    else setToners(toners.filter(t => t.id !== id));
  };

  const addToner = (isPearl = false) => {
    const newId = `new_${Date.now()}`;
    const newToner = { id: newId, code: '', adjustedWeight: "", history: [] };
    if (isPearl) { setPearlToners([...pearlToners, newToner]); } 
    else { setToners([...toners, newToner]); }
    setFocusTarget({ id: newId, type: 'code' }); 
  };

  const copyToExcel = () => {
    const baseResin = (parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1);
    const baseStr = `${totalBaseWeight} (수지 ${baseResin})`;
    
    let pearlStr = "해당없음";
    if (isThreeCoatMode) {
      const pearlResin = (parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1);
      pearlStr = `${totalPearlWeight} (수지 ${pearlResin})`;
    }

    const baseDetails = toners.filter(t => t.code).map(t => `${t.code}: ${t.adjustedWeight || '0'}`).join(', ');
    const pearlDetails = isThreeCoatMode ? pearlToners.filter(t => t.code).map(t => `${t.code}: ${t.adjustedWeight || '0'}`).join(', ') : '해당없음';
    const detailStr = isThreeCoatMode ? `[베이스] ${baseDetails} / [펄] ${pearlDetails}` : baseDetails;

    // 🚨 제미나이 프리뷰 주소 방지: 저장해둔 마스터님의 진짜 도메인 주소 호출
    let currentOrigin = localStorage.getItem('hitec_clean_domain');
    if (!currentOrigin || currentOrigin.includes('google') || currentOrigin.includes('gemini')) {
        currentOrigin = window.location.origin; // 백업용
    }

    const payloadStr = [
        vehicleNumber,
        carModel,
        targetColorCode,
        jobDescription,
        specialNotes,
        packToners(toners),
        isThreeCoatMode ? packToners(pearlToners) : '',
        isThreeCoatMode ? '1' : '0'
    ].map(s => encodeURIComponent(s || '')).join('|');

    const shareUrl = `${currentOrigin}${window.location.pathname}?d=${payloadStr}`;

    const rowData = [
      "", 
      vehicleNumber || '미입력',
      carModel || '미입력',
      targetColorCode || '미지정',
      jobDescription || '미입력',
      specialNotes || '',
      baseStr,
      pearlStr,
      detailStr,
      shareUrl
    ].join('\t');

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(rowData).catch(err => console.error(err));
    } else {
       const textarea = document.createElement('textarea');
       textarea.value = rowData;
       document.body.appendChild(textarea);
       textarea.select();
       document.execCommand('copy');
       document.body.removeChild(textarea);
    }
  };

  const shareToKakao = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}`).join('\n');
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}`).join('\n');
    
    const text = `[PERMAHYD HI-TEC 배합 지시서]\n================================\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 차종: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트 (Ground)]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}\n▶ 6052 수지제원: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}\n\n${isThreeCoatMode ? `[▼ 펄 코트 (Mid-coat)]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 코트 합계: ${totalPearlWeight}\n▶ 6052 수지제원: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}\n\n` : ''}================================\n✨ 최종 도막 혼합 총량: ${totalFinalWeight}\n================================`;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({ title: 'HI-TEC 조색 데이터 인계', text: text }).catch(console.error);
    } else {
        alert("상세 배합 스펙이 클립보드에 복사되었습니다. 카카오톡 창에 바로 '붙여넣기' 하십시오.\n\n" + text);
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }
  };

  const sortedCatalog = [...catalogData].sort((a, b) => {
      const aActive = activeCodes.includes(a.code);
      const bActive = activeCodes.includes(b.code);
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;
      return 0; 
  }).filter(item => item.code.includes(catalogSearch.toUpperCase()) || item.role.includes(catalogSearch));

  if (isTransferTab) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6 font-sans">
              <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center max-w-[500px] shadow-2xl">
                  <Zap className="text-yellow-400 w-20 h-20 mx-auto mb-6 animate-pulse" />
                  <h1 className="text-2xl font-black text-blue-400 mb-4">데이터 전송 신호 발사!</h1>
                  <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                      바탕화면에 켜두신 <strong>[조색 Pro 앱]</strong>으로<br/>과거 배합 기록 신호를 성공적으로 쐈습니다.<br/><br/>
                      <span className="text-red-400 font-bold">보안상 이 껍데기 창은 자동으로 닫히지 않습니다.</span>
                  </p>
                  <button onClick={() => window.close()} className="bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] w-full mb-4 text-lg transition-colors flex items-center justify-center gap-2">
                      <X size={24}/> 이 창을 닫고 원래 하던 작업으로 복귀
                  </button>
                  <p className="text-sm text-slate-500 font-bold">※ 버튼이 안 눌리면 이 탭 위쪽의 (X)를 눌러서 강제로 꺼주세요.</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden lg:overflow-hidden">
      
      {/* 💡 [제작 스토리 헌정 모달] */}
      {isAboutOpen && (
        <div className="fixed inset-0 bg-slate-950/80 z-[400] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden">
               <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                   <h2 className="text-white font-black text-sm flex items-center"><Award className="mr-2 text-yellow-400" size={16}/> 조색 Pro - 개발자 정보</h2>
                   <button onClick={() => setIsAboutOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
               </div>
               <div className="p-6 text-slate-300 space-y-4">
                   <div className="flex items-center gap-4 mb-6">
                       <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-2 border-slate-700 shadow-lg shrink-0">
                           <span className="text-2xl font-black text-white">윤</span>
                       </div>
                       <div>
                           <h3 className="text-base font-black text-white">윤성만 마스터 <span className="text-xs font-normal text-slate-400">(Yoon Seong-man)</span></h3>
                           <p className="text-xs text-blue-400 font-bold mt-1">PERMAHYD HI-TEC 현장 조색 시스템 기획 및 개발자</p>
                       </div>
                   </div>
                   
                   <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                       <h4 className="font-bold text-white text-xs mb-2 flex items-center"><Terminal size={14} className="mr-1.5 text-emerald-400"/> 개발 과정 및 투입된 노력</h4>
                       <p className="text-xs leading-relaxed text-slate-400 text-justify break-keep">
                           본 프로그램은 실제 자동차 보수도장 현장에서 겪은 수많은 시행착오와 땀방울이 고스란히 녹아있는 결과물입니다.<br/><br/>
                           단순한 배합 계산을 넘어, <strong>PC 엑셀과의 완벽한 원클릭 연동, 과거 데이터 무손실 복원(텔레파시 엔진), 다중 시각화 렌더링, 10연속 오토 포커싱 기술</strong> 등 실제 작업자가 1초라도 아낄 수 있도록 설계된 '100% 현장 맞춤형 최적화 솔루션'입니다.<br/><br/>
                           끊임없는 피드백과 로직 설계를 거쳐 완성된 윤성만 마스터만의 고유한 마스터피스입니다.
                       </p>
                   </div>
               </div>
               <div className="p-4 bg-slate-950 border-t border-slate-800 text-center">
                   <p className="text-[10px] text-slate-600 font-bold">ⓒ 2026 Yoon Seong-man. All rights reserved.</p>
               </div>
           </div>
        </div>
      )}

      {/* 💡 [드라마틱한 과거 배합 복원 팝업창 - 롤백 닫기 완벽 지원!] */}
      {restoredViewData && (
        <div className="fixed inset-0 bg-black/85 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-[600px] max-w-full shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                 <h2 className="text-blue-400 font-black text-lg flex items-center"><History className="mr-2"/> 과거 배합 기록 복원</h2>
                 <button onClick={() => setRestoredViewData(null)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1 text-slate-300">
                 <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner">
                    <div><span className="text-xs text-slate-500 block mb-1">차량 번호</span><span className="font-bold text-white text-sm">{restoredViewData.v || '-'}</span></div>
                    <div><span className="text-xs text-slate-500 block mb-1">차종</span><span className="font-bold text-white text-sm">{restoredViewData.m || '-'}</span></div>
                    <div><span className="text-xs text-slate-500 block mb-1">컬러 코드</span><span className="font-black text-blue-300 text-lg uppercase">{restoredViewData.c || '-'}</span></div>
                    <div><span className="text-xs text-slate-500 block mb-1">작업 내용</span><span className="font-bold text-white text-sm">{restoredViewData.j || '-'}</span></div>
                    {restoredViewData.n && <div className="col-span-2 mt-2"><span className="text-xs text-slate-500 block mb-1">특이 사항</span><span className="font-bold text-yellow-300 text-sm bg-yellow-900/30 px-3 py-1.5 rounded-lg border border-yellow-800/50 inline-block">{restoredViewData.n}</span></div>}
                 </div>
                 
                 <h3 className="text-sm font-bold text-slate-400 mb-3 border-b border-slate-700 pb-2 flex items-center"><Layers size={14} className="mr-1.5"/> 베이스 코트 (Ground Coat)</h3>
                 <div className="space-y-2 mb-6">
                    {restoredViewData.b?.map((t: any, idx: number) => (
                       <div key={idx} className="flex justify-between items-center bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700">
                          <div className="flex items-center gap-3">
                             <span className="font-black text-white">{t.code}</span>
                             <span className="text-xs text-slate-500 hidden sm:inline-block">{TONER_DB[t.code]?.role || ''}</span>
                          </div>
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
                            <div className="flex items-center gap-3">
                               <span className="font-black text-white">{t.code}</span>
                               <span className="text-xs text-slate-500 hidden sm:inline-block">{TONER_DB[t.code]?.role || ''}</span>
                            </div>
                            <span className="text-purple-400 font-black text-lg">{t.adjustedWeight} <span className="text-xs font-normal text-slate-500">g</span></span>
                         </div>
                      ))}
                   </div>
                 </>
                 )}
              </div>
              <div className="p-4 border-t border-slate-700 bg-slate-900 rounded-b-2xl">
                 <button onClick={() => setRestoredViewData(null)} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-colors text-sm flex justify-center items-center gap-2">
                     <X size={18} /> 닫기 및 원래 작업 화면으로 복귀
                 </button>
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
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">PERMAHYD HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 22.9</span></h1>
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
              <button onClick={() => cameraInputRef.current?.click()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md flex-1 items-center justify-center text-sm font-black shadow-md flex transition-colors">
                <Camera size={18} className="mr-2" />시편 촬영
              </button>
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
                <button onClick={() => setIsBaseConfirmed(!isBaseConfirmed)} className={`flex-1 px-3 py-2.5 rounded-md text-sm font-bold flex items-center justify-center shadow-md transition-colors ${isBaseConfirmed ? 'bg-slate-200 text-slate-500' : 'bg-slate-800 text-white'}`}>
                  {isBaseConfirmed ? <Lock size={14} className="mr-1"/> : <Unlock size={14} className="mr-1"/>}확정
                </button>
                <button onClick={copyToExcel} className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded-md text-sm font-black flex items-center justify-center shadow-md transition-colors">
                   <FileSpreadsheet size={16} className="mr-1.5" />엑셀 복사
                </button>
                <button onClick={shareToKakao} className="flex-1 bg-[#FEE500] hover:bg-[#FADA0A] text-slate-900 px-3 py-2.5 rounded-md text-sm font-black flex items-center justify-center shadow-md transition-colors">
                   <Share2 size={16} className="mr-1.5" />공유
                </button>
                <button onClick={handleClearAll} className="bg-white text-red-600 border border-red-200 px-3 py-2.5 rounded-md flex items-center justify-center shrink-0 transition-colors hover:bg-red-50"><Trash2 size={18} /></button>
              </div>
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
                             <input 
                                ref={el => { codeRefs.current[toner.id] = el; }} 
                                value={toner.code} 
                                onChange={e => handleCodeChange(toner.id, e.target.value, false)} 
                                inputMode="numeric" pattern="[0-9]*"
                                className="w-24 text-sm font-black uppercase border border-slate-300 rounded px-1.5 py-0.5 focus:border-blue-500 focus:outline-none shadow-inner" 
                                placeholder="코드"
                             />
                             <span className="font-bold text-blue-700 text-xs truncate">{info.role || '안료미지정'}</span>
                         </div>
                         
                         {info.details && info.details.length > 0 ? (
                             <div className="flex flex-col gap-1 mt-0.5">
                                 {info.details.slice(0, 2).map((d: any, idx: number) => (
                                     <div key={idx} className="flex items-start gap-1.5">
                                         <span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-slate-500 border-slate-200 leading-none">{d[0]}</span>
                                         <span className="text-[11px] text-slate-600 leading-tight break-keep whitespace-pre-wrap">{d[1]}</span>
                                     </div>
                                 ))}
                             </div>
                         ) : (
                             <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-tight break-keep">{info.desc}</p>
                         )}
                      </div>
                      <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0 shadow-sm">
                         <input 
                             ref={el => { weightRefs.current[toner.id] = el; }} 
                             inputMode="decimal" 
                             value={toner.adjustedWeight} 
                             onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} 
                             onBlur={e => handleWeightBlur(toner.id, e.target.value, false)}
                             onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                             className="w-20 text-right text-base font-black text-blue-600 focus:outline-none clean-number-input" 
                             placeholder=""
                         />
                         <span className="text-xs font-bold text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => removeToner(toner.id, false)} className="ml-1"><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
                      </div>
                    </div>

                    {toner.history && toner.history.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 pl-1 border-t border-dashed border-slate-200 pt-1.5">
                        <span className="font-bold text-slate-400 flex items-center gap-1"><History size={12}/> 이력 ({toner.history.length}회):</span>
                        <div className="flex flex-wrap gap-1">
                          {toner.history.map((hVal: string, hIdx: number) => (
                            <button 
                              key={hIdx} 
                              onClick={() => handleWeightInputChange(toner.id, hVal, false)}
                              className="px-2 py-0.5 bg-slate-200 hover:bg-blue-600 hover:text-white rounded text-[10px] font-black tracking-tighter transition-all"
                            >
                              {hIdx + 1} ({hVal}g)
                            </button>
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
                               <input 
                                  ref={el => { codeRefs.current[toner.id] = el; }} 
                                  value={toner.code} 
                                  onChange={e => handleCodeChange(toner.id, e.target.value, true)} 
                                  inputMode="numeric" pattern="[0-9]*"
                                  className="w-24 text-sm font-black uppercase border border-purple-200 rounded px-1.5 py-0.5 text-purple-800 shadow-inner focus:outline-none focus:border-purple-500" 
                                  placeholder="코드"
                               />
                               <span className="font-bold text-purple-700 text-xs truncate">{info.role || '안료미지정'}</span>
                           </div>
                           {info.details && info.details.length > 0 ? (
                               <div className="flex flex-col gap-1 mt-0.5">
                                   {info.details.slice(0, 2).map((d: any, idx: number) => (
                                       <div key={idx} className="flex items-start gap-1.5">
                                           <span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-purple-500 border-purple-200 leading-none">{d[0]}</span>
                                           <span className="text-[11px] text-slate-600 leading-tight break-keep whitespace-pre-wrap">{d[1]}</span>
                                       </div>
                                   ))}
                               </div>
                           ) : (
                               <p className="text-[11px] text-slate-500 whitespace-pre-wrap leading-tight break-keep">{info.desc}</p>
                           )}
                        </div>
                        <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-md px-1.5 py-0.5 shrink-0 shadow-sm">
                           <input 
                               ref={el => { weightRefs.current[toner.id] = el; }} 
                               inputMode="decimal" 
                               value={toner.adjustedWeight} 
                               onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} 
                               onBlur={e => handleWeightBlur(toner.id, e.target.value, true)}
                               onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} 
                               className="w-20 text-right text-base font-black text-purple-600 focus:outline-none clean-number-input" 
                               placeholder=""
                           />
                           <span className="text-xs font-bold text-slate-400 ml-1 mr-1">g</span>
                           <button onClick={() => removeToner(toner.id, true)} className="ml-1"><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
                        </div>
                      </div>

                      {toner.history && toner.history.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500 pl-1 border-t border-dashed border-purple-100 pt-1.5">
                          <span className="font-bold text-slate-400 flex items-center gap-1"><History size={12}/> 이력 ({toner.history.length}회):</span>
                          <div className="flex flex-wrap gap-1">
                            {toner.history.map((hVal: string, hIdx: number) => (
                              <button 
                                key={hIdx} 
                                onClick={() => handleWeightInputChange(toner.id, hVal, true)}
                                className="px-2 py-0.5 bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white rounded text-[10px] font-black tracking-tighter transition-all"
                              >
                                {hIdx + 1} ({hVal}g)
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
                <button onMouseDown={(e) => e.preventDefault()} onClick={() => addToner(true)} className="w-full py-2.5 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 rounded-md text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-2 shadow-sm">
                  <Plus size={16} /><span>펄 조색제 추가</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-800 text-slate-100 flex justify-between items-center shrink-0 rounded-b-xl lg:rounded-none z-10 border-t-2 border-slate-700 gap-4">
             <div className="flex flex-col gap-1.5 flex-1 pl-2">
                <span className="text-[11px] text-slate-400 font-bold tracking-wider">A. 베이스 코트 합계</span>
                <span className="text-2xl font-black text-white">{totalBaseWeight}</span>
                <div className="text-blue-300 bg-blue-950/50 px-2 py-1 rounded border border-blue-800/50 text-[11px] inline-flex w-fit items-center mt-1">
                   <Beaker size={12} className="mr-1.5 shrink-0"/> 
                   <span>6052: {(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)} <span className="opacity-70 ml-1">({isBaseMetallic ? '메탈 20%' : '솔리드 10%'})</span></span>
                </div>
             </div>
             
             {isThreeCoatMode && (
             <div className="flex flex-col gap-1.5 flex-1 pl-4 border-l border-slate-600 ml-4">
                <span className="text-[11px] text-slate-400 font-bold tracking-wider">B. 펄 코트 합계</span>
                <span className="text-2xl font-black text-white">{totalPearlWeight}</span>
                <div className="text-purple-300 bg-purple-950/50 px-2 py-1 rounded border border-purple-800/50 text-[11px] inline-flex w-fit items-center mt-1">
                   <Beaker size={12} className="mr-1.5 shrink-0"/> 
                   <span>6052: {(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)} <span className="opacity-70 ml-1">({isPearlMetallic ? '메탈 20%' : '솔리드 10%'})</span></span>
                </div>
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
                 <button onClick={() => setIsAboutOpen(true)} className="text-xs px-3 py-1.5 rounded bg-indigo-600 text-white font-bold flex items-center hover:bg-indigo-500 shadow-md transition-all">
                     <Info size={12} className="mr-1.5"/>제작 스토리
                 </button>
                 <button onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); }} className="text-xs px-3 py-1.5 rounded bg-slate-800 text-white font-bold flex items-center hover:bg-slate-700 shadow-md transition-all">
                     <Maximize size={12} className="mr-1.5"/>확장 뷰어 열기
                 </button>
              </div>
            </h3>
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-1">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">A. 베이스 코트 (Ground Coat)</span>
                 </div>
                 <div className={`h-12 rounded-lg border ${isBaseConfirmed ? 'border-slate-300' : 'border-slate-200 opacity-60'} relative overflow-hidden`} style={{ background: `radial-gradient(circle at 35% 35%, ${getColorString(baseOptics, 'face')} 0%, ${getColorString(baseOptics, 'mid')} 45%, ${getColorString(baseOptics, 'flop')} 100%)` }}>
                   {baseOptics.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge opacity-50 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E')]"></div>}
                 </div>
              </div>

              {isThreeCoatMode && (
                <div className="flex flex-col space-y-1 relative">
                   <div className="flex justify-between items-center px-1">
                     <span className="text-[11px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded flex items-center"><Zap size={10} className="mr-1"/>B. 펄 코트 (Mid Coat)</span>
                   </div>
                   <div className={`h-12 rounded-lg border ${isBaseConfirmed ? 'border-purple-300' : 'border-slate-200'} relative overflow-hidden`} style={{ background: isBaseConfirmed ? `radial-gradient(circle at 35% 35%, ${getColorString(pearlOptics, 'face')} 0%, ${getColorString(pearlOptics, 'mid')} 45%, ${getColorString(pearlOptics, 'flop')} 100%)` : '#f1f5f9' }}>
                     {isBaseConfirmed && pearlOptics.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge opacity-70 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%221%22/%3E%3C/svg%3E')]"></div>}
                   </div>
                </div>
              )}

              <div className="flex flex-col space-y-1 relative">
                 <div className="flex justify-between items-center px-1">
                   <span className="text-[11px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{isThreeCoatMode ? 'C. 최종 3코트 결합' : 'B. 최종 렌더링'}</span>
                 </div>
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

      {/* 💡 확장 뷰어 모달 */}
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
                      <div className="flex items-center px-1">
                         <input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, false)} placeholder="" className="w-20 text-center bg-transparent text-sm font-black text-white outline-none" />
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
                             <input type="text" inputMode="decimal" value={t.adjustedWeight} onChange={(e) => handleWeightInputChange(t.id, e.target.value, true)} placeholder="" className="w-20 text-center bg-transparent text-sm font-black text-white outline-none" />
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

          <main ref={viewerRef} className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-hidden items-center justify-center relative cursor-crosshair w-full max-w-[1600px] mx-auto" onPointerDown={(e) => { setIsDraggingLight(true); handlePointerMove(e); }} onPointerMove={handlePointerMove} onPointerUp={() => setIsDraggingLight(false)} onPointerLeave={() => setIsDraggingLight(false)}>
             <div className="absolute z-50 flex items-center justify-center transition-transform duration-75 pointer-events-none" style={{ left: `${lightPos.x}%`, top: `${lightPos.y}%`, transform: 'translate(-50%, -50%)' }}>
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center shadow-[0_0_60px_#fff] border border-white/30 animate-pulse"><Sun className="text-yellow-100" size={32} /></div>
             </div>
             
             {/* 원본 */}
             <div className="flex-1 w-full h-[45%] md:h-[80%] rounded-[1.5rem] border border-slate-700 relative overflow-hidden shadow-2xl transition-colors duration-200" style={{ background: getInteractiveBackground(originalFinalOptics, lightPos) }}>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                {originalFinalOptics?.isMetallic && <div className="absolute inset-0 mix-blend-color-dodge bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" style={{ opacity: lerp(0.4, 0.05, Math.min(1, Math.sqrt(Math.pow(lightPos.x - 50, 2) + Math.pow(lightPos.y - 50, 2)) / 50)) }}></div>}
                <div className="absolute top-4 left-4 bg-black/80 px-3 py-1.5 rounded-lg font-bold text-xs border border-slate-600 text-slate-300 shadow-md">A. 원본 배합 (변경 전)</div>
             </div>
             
             <div className="text-slate-600 pointer-events-none shrink-0 hidden md:block"><ChevronRight size={32} /></div>
             
             {/* 실시간 수정본 */}
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

      {/* 안료 디테일 뷰어 모달 */}
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
                        <div key={idx} className="flex items-start gap-1.5">
                            <span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-slate-600 border-slate-300 leading-none">{d[0]}</span>
                            <span className="text-xs text-slate-700 leading-relaxed break-keep" dangerouslySetInnerHTML={{__html: d[1]}}></span>
                        </div>
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

      {/* 과거 배합 기록 복원 팝업 (텔레파시 수신 뷰어) */}
      {restoredViewData && (
        <div className="fixed inset-0 bg-black/85 z-[300] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-slate-900 border border-slate-700 rounded-2xl w-[600px] max-w-full shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-t-2xl">
                 <h2 className="text-blue-400 font-black text-lg flex items-center"><History className="mr-2"/> 과거 배합 기록 복원</h2>
                 <button onClick={() => setRestoredViewData(null)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-colors"><X size={20}/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar flex-1 text-slate-300">
                 <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-inner">
                    <div><span className="text-xs text-slate-500 block mb-1">차량 번호</span><span className="font-bold text-white text-sm">{restoredViewData.v || '-'}</span></div>
                    <div><span className="text-xs text-slate-500 block mb-1">차종</span><span className="font-bold text-white text-sm">{restoredViewData.m || '-'}</span></div>
                    <div><span className="text-xs text-slate-500 block mb-1">컬러 코드</span><span className="font-black text-blue-300 text-lg uppercase">{restoredViewData.c || '-'}</span></div>
                    <div><span className="text-xs text-slate-500 block mb-1">작업 내용</span><span className="font-bold text-white text-sm">{restoredViewData.j || '-'}</span></div>
                    {restoredViewData.n && <div className="col-span-2 mt-2"><span className="text-xs text-slate-500 block mb-1">특이 사항</span><span className="font-bold text-yellow-300 text-sm bg-yellow-900/30 px-3 py-1.5 rounded-lg border border-yellow-800/50 inline-block">{restoredViewData.n}</span></div>}
                 </div>
                 
                 <h3 className="text-sm font-bold text-slate-400 mb-3 border-b border-slate-700 pb-2 flex items-center"><Layers size={14} className="mr-1.5"/> 베이스 코트 (Ground Coat)</h3>
                 <div className="space-y-2 mb-6">
                    {restoredViewData.b?.map((t: any, idx: number) => (
                       <div key={idx} className="flex justify-between items-center bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-700">
                          <div className="flex items-center gap-3">
                             <span className="font-black text-white">{t.code}</span>
                             <span className="text-xs text-slate-500 hidden sm:inline-block">{TONER_DB[t.code]?.role || ''}</span>
                          </div>
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
                            <div className="flex items-center gap-3">
                               <span className="font-black text-white">{t.code}</span>
                               <span className="text-xs text-slate-500 hidden sm:inline-block">{TONER_DB[t.code]?.role || ''}</span>
                            </div>
                            <span className="text-purple-400 font-black text-lg">{t.adjustedWeight} <span className="text-xs font-normal text-slate-500">g</span></span>
                         </div>
                      ))}
                   </div>
                 </>
                 )}
              </div>
              <div className="p-4 border-t border-slate-700 bg-slate-900 rounded-b-2xl">
                 <button onClick={() => setRestoredViewData(null)} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-colors text-sm flex justify-center items-center gap-2">
                     <X size={18} /> 닫기 및 원래 작업 화면으로 복귀
                 </button>
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
        .metallic-flake {
          position: absolute; inset: 0; pointer-events: none; z-index: 1; mix-blend-mode: color-dodge;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E");
        }
      `}} />
    </div>
  );
}
