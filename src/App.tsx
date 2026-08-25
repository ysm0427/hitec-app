// 🚨 주의: 이 코드 윗부분에 있는 TONER_DB 와 OEM_COLORS 부분은 기존 대표님 코드를 그대로 유지하셔야 합니다! 🚨

export const catalogData = Object.entries(TONER_DB).map(([code, data]) => {
  return { code, ...data };
});

export const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };
export const isTonerMetallic = (role: string) => { const r = role || ''; return r.includes('실버') || r.includes('알루미늄') || r.includes('펄') || r.includes('이펙트') || r.includes('글라스') || r.includes('대체용'); }

const textureCache: Record<string, React.CSSProperties> = {};

export const getCachedTexture = (type: string, faceColor: string, flopColor: string, isMetallic: boolean): React.CSSProperties => {
    if (!isMetallic || type === 'binder' || type === 'solid') return { background: `linear-gradient(135deg, ${faceColor} 0%, ${flopColor} 100%)` };
    const key = `${type}_${faceColor}_${flopColor}`; if (textureCache[key]) return textureCache[key];
    
    let baseFreq = '0.8', alphaMult = '4', surfaceScale = '1.5', specConst = '1.2';
    if (type === 'xirallic') { baseFreq = '0.6'; alphaMult = '8'; surfaceScale = '3'; specConst = '1.8'; }
    else if (type === 'pearl') { baseFreq = '0.5'; alphaMult = '6'; surfaceScale = '2'; specConst = '1.5'; }
    else if (type === 'silver_fine') { baseFreq = '1.2'; alphaMult = '3'; surfaceScale = '1.2'; specConst = '1.0'; }
    else if (type === 'silver_coarse') { baseFreq = '0.4'; alphaMult = '8'; surfaceScale = '2.5'; specConst = '1.6'; }
    
    const safeFaceColor = faceColor || '#ffffff'; const safeFlopColor = flopColor || '#ffffff';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="3"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${alphaMult} -1"/><feSpecularLighting surfaceScale="${surfaceScale}" specularConstant="${specConst}" specularExponent="25" lighting-color="%23ffffff"><feDistantLight azimuth="45" elevation="55"/></feSpecularLighting></filter><rect width="100%25" height="100%25" fill="${encodeURIComponent(safeFaceColor)}"/><rect width="100%25" height="100%25" filter="url(%23f)" opacity="0.6"/></svg>`;
    
    const result = { backgroundColor: safeFaceColor, backgroundImage: `url("data:image/svg+xml;utf8,${svg}"), radial-gradient(circle at 50% 20%, ${safeFaceColor} 0%, ${safeFlopColor} 80%, #000000 100%)`, backgroundBlendMode: 'overlay, normal' as any, boxShadow: 'inset 0 -10px 30px rgba(0,0,0,0.8)' };
    textureCache[key] = result; return result;
};

// 💡 뱃지 색상 5단계 완벽 매칭
export const getBadgeClass = (title: string) => {
    if(title.includes("일반") || title.includes("투명") || title.includes("전반적")) return "bg-teal-50 text-teal-700 border-teal-300";
    if(title.includes("외관") || title.includes("변화") || title.includes("색상 및 구성")) return "bg-blue-50 text-blue-700 border-blue-300";
    if(title.includes("용도") || title.includes("컬러") || title.includes("적용 색상")) return "bg-cyan-50 text-cyan-700 border-cyan-300";
    if(title.includes("혼합") || title.includes("비율") || title.includes("배합") || title.includes("제형화")) return "bg-amber-50 text-amber-700 border-amber-300";
    if(title.includes("경고") || title.includes("주의") || title.includes("조색 주의점")) return "bg-red-50 text-red-700 border-red-300 shadow-sm shadow-red-100";
    return "bg-slate-50 text-slate-700 border-slate-300";
};

export const getTonerDetailBackground = (code: string, role: string, angle: string) => {
  const r = role || ''; let h = 0; let s = 0; let baseL = 50;
  if (code.includes('144')) { h = 215; s = 85; baseL = 35; } 
  else if (r.includes('블루') || r.includes('청')) { h = 210; s = 80; baseL = 40; }
  else if (r.includes('레드') || r.includes('마젠타') || r.includes('적') || r.includes('마룬')) { h = 350; s = 80; baseL = 40; }
  else if (r.includes('그린') || r.includes('녹')) { h = 150; s = 80; baseL = 35; }
  else if (r.includes('옐로우') || r.includes('황')) { h = 45; s = 80; baseL = 50; }
  else if (r.includes('오커')) { h = 30; s = 60; baseL = 40; }
  else if (r.includes('오렌지')) { h = 25; s = 90; baseL = 50; }
  else if (r.includes('바이올렛')) { h = 290; s = 80; baseL = 40; }
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
                        <div className="w-5 h-5 rounded-full border border-white/30 shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ background: `linear-gradient(135deg, ${TONER_DB[code].flop}, ${TONER_DB[code].face})` }}></div>
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

const getTonerBaseHue = (code: string, role: string) => {
    if (code.includes('144')) return 215;
    if (role.includes('블루') || role.includes('청')) return 215;
    if (role.includes('레드') || role.includes('마젠타') || role.includes('마룬') || role.includes('적')) return 350;
    if (role.includes('그린') || role.includes('녹') || role.includes('에메랄드')) return 150;
    if (role.includes('옐로우') || role.includes('황')) return 45;
    if (role.includes('오렌지') || role.includes('오커') || role.includes('브라운') || role.includes('카퍼')) return 25;
    if (role.includes('바이올렛') || role.includes('라일락') || role.includes('자주')) return 290;
    return null;
};

export const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code && TONER_DB[t.code]);
  const sumW = colorToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let totalX = 0; let totalY = 0; let colorWeight = 0;
  let wSilver=0; let wWhite=0; let wBlack=0; let wPearl=0; let wBinder=0; let interferenceColor: string | null = null;

  colorToners.forEach(t => {
    const w = safeNum(parseFloat(t.adjustedWeight)); if (w <= 0) return;
    const role = TONER_DB[t.code]?.role || ''; const code = t.code || '';

    if (role.includes('컴포넌트') || role.includes('바인더') || role.includes('애디티브') || ['WT 385', 'WT 387', 'WT 386', 'WT 400', 'WT 3080', 'WT 310'].some(c => code.includes(c.replace('WT ', '')))) wBinder += w;
    else if (role.includes('블랙') || code.includes('323') || code.includes('388') || code.includes('188') || code.includes('1500')) wBlack += w;
    else if (role.includes('실버') || role.includes('알루미늄') || code.includes('362') || code.includes('357') || code.includes('197') || code.includes('303') || code.includes('305') || code.includes('307') || code.includes('400')) wSilver += w;
    else if (role.includes('화이트') || code.includes('321') || code.includes('328') || code.includes('322')) wWhite += w;
    else if (role.includes('펄') || role.includes('이펙트') || role.includes('스파클') || code.includes('304') || code.includes('377') || code.includes('381')) {
      wPearl += w;
      if (role.includes('블루') || code.includes('381')) interferenceColor = 'blue';
      else if (role.includes('레드') || role.includes('마젠타')) interferenceColor = 'red';
      else if (role.includes('그린') || code.includes('380')) interferenceColor = 'green';
      else if (role.includes('골드') || code.includes('304') || code.includes('382')) interferenceColor = 'yellow';
      else if (role.includes('화이트') || code.includes('377')) interferenceColor = 'white';
    }

    const baseHue = getTonerBaseHue(code, role);
    if (baseHue !== null) {
        let rad = baseHue * (Math.PI / 180);
        let str = 1.0;
        if(code.includes('341') || code.includes('300')) str = 1.2; 
        totalX += Math.cos(rad) * (w * str);
        totalY += Math.sin(rad) * (w * str);
        colorWeight += w;
    }
  });

  const effectiveW = wWhite + wBlack + wSilver + wPearl + colorWeight;
  const totalForRatio = effectiveW > 0 ? effectiveW : 1;
  const pSilver = wSilver / totalForRatio; const pWhite = wWhite / totalForRatio;
  const pBlack = wBlack / totalForRatio; const pPearl = wPearl / totalForRatio; const pColor = colorWeight / totalForRatio;

  let baseL = (pWhite * 90) + (pSilver * 55) + (pPearl * 65); 
  if (effectiveW === 0 && wBinder > 0) baseL = 90; 
  if (pBlack > 0) baseL = Math.max(5, baseL - (Math.pow(pBlack, 0.4) * 60)); 
  if (pColor > 0) baseL = Math.max(3, baseL - (Math.pow(pColor, 0.5) * 30));

  let l15 = Math.min(98, baseL + (pSilver * 40) + (pPearl * 35)); 
  let l110 = Math.max(1, baseL - (pSilver * 30) - (pBlack * 20)); 

  if (pWhite > 0.6) { l110 = Math.max(83, baseL - 8); l15 = Math.min(99, baseL + (pPearl > 0 ? 10 : 3)); }

  let hue = 0;
  if (totalX !== 0 || totalY !== 0) {
      hue = Math.atan2(totalY, totalX) * (180 / Math.PI);
      if (hue < 0) hue += 360;
  }

  let sat = colorWeight > 0 ? Math.min(100, (pColor / (pColor + pWhite + pBlack)) * 130) : 0;
  if (pWhite > 0.6) sat = sat * 0.3; 

  let flopHue = hue; let faceHue = hue;
  if (interferenceColor === 'blue') { faceHue = 210; flopHue = 230; }
  else if (interferenceColor === 'red') { faceHue = 340; flopHue = 350; }
  else if (interferenceColor === 'green') { faceHue = 150; flopHue = 170; } 
  else if (interferenceColor === 'yellow') { faceHue = 50; flopHue = 60; }
  
  let faceSat = Math.min(100, sat + (pPearl * (interferenceColor === 'white' ? 5 : 30)));
  let flopSat = Math.min(100, sat + (pPearl * (interferenceColor === 'white' ? 2 : 15)));
  if (colorWeight === 0 && wPearl === 0) { hue = 0; flopHue = 0; faceHue = 0; sat = 0; faceSat = 0; flopSat = 0; }

  return {
    face: { h: safeNum(Math.round(faceHue)), s: safeNum(Math.round(faceSat)), l: safeNum(Math.round(Math.min(99, Math.max(5, l15)))) },
    mid:  { h: safeNum(Math.round(hue)), s: safeNum(Math.round(sat)), l: safeNum(Math.round(Math.min(98, Math.max(3, baseL)))) },
    flop: { h: safeNum(Math.round(wPearl > 0 ? flopHue : hue)), s: safeNum(Math.round(flopSat)), l: safeNum(Math.round(Math.min(98, Math.max(1, l110)))) },
    isMetallic: (wSilver > 0 || wPearl > 0)
  };
};

export const packToners = (tonerList: any[]) => { return tonerList.filter((t: any) => t.code).map((t: any) => { const c = t.code.replace('WT ', '').trim(); const w = t.adjustedWeight || ''; return `${c}_${w}`; }).join('*'); };
export const unpackToners = (str: string) => { if (!str) return []; return str.split('*').map((t, i) => { const [c, w] = t.split('_'); return { id: `restored_${Date.now()}_${i}`, code: c ? `WT ${c}` : '', adjustedWeight: w || '', history: [], memo: '', isExpanded: false }; }); };

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

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [toners, setToners] = useState<any[]>([{ id: `b_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [pearlToners, setPearlToners] = useState<any[]>([{ id: `p_init`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(false); 
  const [targetColorCode, setTargetColorCode] = useState(''); 
  const [vehicleNumber, setVehicleNumber] = useState(''); 
  const [carModel, setCarModel] = useState(''); 
  const [jobDescription, setJobDescription] = useState(''); 
  const [specialNotes, setSpecialNotes] = useState('');
  const [registrationDate, setRegistrationDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalBaseWeight, setTotalBaseWeight] = useState("0.00"); 
  const [totalPearlWeight, setTotalPearlWeight] = useState("0.00"); 
  const [totalFinalWeight, setTotalFinalWeight] = useState("0.00");
  const [selectedTonerForView, setSelectedTonerForView] = useState<string | null>(null);
  
  const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null); 
  const [restoredViewData, setRestoredViewData] = useState<any>(null); 
  
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(true);
  const [isBoardOpen, setIsBoardOpen] = useState(false); 
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); 
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false); 
  const [viewingPost, setViewingPost] = useState<any>(null); 

  const [subName, setSubName] = useState('');
  const [subAge, setSubAge] = useState('');
  const [subRegion, setSubRegion] = useState('');
  const [subBiz, setSubBiz] = useState('');
  const [subEmail, setSubEmail] = useState('');

  const [boardSearch, setBoardSearch] = useState('');
  const [boardBrandFilter, setBoardBrandFilter] = useState('전체');
  
  const [boardPosts, setBoardPosts] = useState([
      { id: 1, brand: '현대', code: 'UG4', date: '2026-08-20', likes: 12, views: 45, author: '김프로', spec: '이색 심함, 블랜딩 필수', baseFormula: [{code: 'WT 321', adjustedWeight: '15.5'}, {code: 'WT 328', adjustedWeight: '2.1'}], pearlFormula: [], isThreeCoat: false },
      { id: 2, brand: '기아', code: 'SWP', date: '2026-08-22', likes: 28, views: 102, author: '이반장', spec: '정면 밝음, 측면 어두움', baseFormula: [{code: 'WT 321', adjustedWeight: '20.0'}], pearlFormula: [{code: 'WT 368', adjustedWeight: '5.0'}], isThreeCoat: true },
      { id: 3, brand: '벤츠', code: '197', date: '2026-08-24', likes: 8, views: 15, author: '성남최고', spec: '은폐력 약함, 하도 필수', baseFormula: [{code: 'WT 323', adjustedWeight: '18.5'}, {code: 'WT 362', adjustedWeight: '1.2'}], pearlFormula: [], isThreeCoat: false },
      { id: 4, brand: 'BMW', code: 'C3E', date: '2026-08-25', likes: 45, views: 210, author: '광주도장러', spec: '신형 펄 입자 적용', baseFormula: [{code: 'WT 323', adjustedWeight: '12.0'}], pearlFormula: [], isThreeCoat: false },
      { id: 5, brand: '아우디', code: 'LY9C', date: '2026-08-25', likes: 3, views: 12, author: '하남공업사', spec: '화이트 솔리드 기본 배합', baseFormula: [{code: 'WT 321', adjustedWeight: '30.0'}], pearlFormula: [], isThreeCoat: false }
  ]);

  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({}); 
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const [focusTarget, setFocusTarget] = useState<{id: string, type: 'code'|'weight'} | null>(null); 
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState('');
  
  const [finalOptics, setFinalOptics] = useState<any>({ face: { h:0, s:0, l:90 }, mid: { h:0, s:0, l:90 }, flop: { h:0, s:0, l:90 }, isMetallic: false }); 
  const [isBaseMetallic, setIsBaseMetallic] = useState(false); 
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);
  const [scaleFactor, setScaleFactor] = useState("2");
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
                if (d.includes('%7B') || d.includes('{')) {
                    parsedData = JSON.parse(decodeURIComponent(d));
                } else {
                    let decodedStr = d;
                    if (!d.includes('|') && !d.includes('%')) {
                        try { decodedStr = decodeURIComponent(escape(atob(d))); } catch(e) { decodedStr = atob(d); }
                    } else {
                        decodedStr = decodeURIComponent(d.replace(/%7C/g, '|'));
                    }
                    const parts = decodedStr.split('|');
                    if(parts.length >= 6) {
                        parsedData = {
                            v: parts[0] || '', m: parts[1] || '', c: parts[2] || '', j: parts[3] || '', n: parts[4] || '', b: unpackToners(parts[5]), p: unpackToners(parts[6]), t: parts[7] === '1'
                        };
                    }
                }

                if (parsedData) {
                    setRestoredViewData(parsedData);
                    window.history.replaceState({}, document.title, window.location.pathname);
                    loadedFromUrl = true;
                }
            } catch (e) { 
                console.error("URL 파싱 실패", e); 
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
        
        if (!loadedFromUrl) {
            const savedBase = localStorage.getItem('hitec_base'); const savedPearl = localStorage.getItem('hitec_pearl'); const savedCode = localStorage.getItem('hitec_code'); const savedMode = localStorage.getItem('hitec_mode'); const savedVehicle = localStorage.getItem('hitec_vehicle'); const savedCarModel = localStorage.getItem('hitec_carmodel'); const savedJob = localStorage.getItem('hitec_job'); const savedNotes = localStorage.getItem('hitec_notes'); const savedMemos = localStorage.getItem('hitec_toner_memos'); const savedBoard = localStorage.getItem('hitec_board_mock');
            
            if (savedBase) setToners(JSON.parse(savedBase)); if (savedPearl) setPearlToners(JSON.parse(savedPearl)); if (savedCode) setTargetColorCode(savedCode); if (savedMode) setIsThreeCoatMode(JSON.parse(savedMode)); if (savedVehicle) setVehicleNumber(savedVehicle); if (savedCarModel) setCarModel(savedCarModel); if (savedJob) setJobDescription(savedJob); if (savedNotes) setSpecialNotes(savedNotes); if (savedMemos) setTonerMemos(JSON.parse(savedMemos));
            if (savedBoard) setBoardPosts(JSON.parse(savedBoard));
        }
        setIsLoaded(true); 
    }
  }, []);

  useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search); if (urlParams.get('d')) return;
      if (isLoaded && typeof window !== 'undefined') {
          localStorage.setItem('hitec_base', JSON.stringify(toners)); localStorage.setItem('hitec_pearl', JSON.stringify(pearlToners)); localStorage.setItem('hitec_code', targetColorCode); localStorage.setItem('hitec_mode', JSON.stringify(isThreeCoatMode)); localStorage.setItem('hitec_vehicle', vehicleNumber); localStorage.setItem('hitec_carmodel', carModel); localStorage.setItem('hitec_job', jobDescription); localStorage.setItem('hitec_notes', specialNotes); localStorage.setItem('hitec_toner_memos', JSON.stringify(tonerMemos));
          localStorage.setItem('hitec_board_mock', JSON.stringify(boardPosts));
      }
  }, [toners, pearlToners, targetColorCode, isThreeCoatMode, vehicleNumber, carModel, jobDescription, specialNotes, tonerMemos, boardPosts, isLoaded]);

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

  const handleClearAllInfo = () => { 
      if(!window.confirm("차량 정보를 포함한 모든 입력 데이터를 초기화하시겠습니까?")) return;
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setTargetColorCode(''); setVehicleNumber(''); setCarModel(''); setJobDescription(''); setSpecialNotes(''); 
      setRegistrationDate(new Date().toISOString().split('T')[0]); setSelectedTonerForView(null); 
  };

  const handleResetFormula = () => { 
      setToners([{ id: `b_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setPearlToners([{ id: `p_${Date.now()}`, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }]); 
      setSelectedTonerForView(null); 
  };

  const handleCodeChange = (id: string, newCode: string, isPearl = false) => {
    const numOnly = newCode.replace(/[^0-9]/g, '');
    const finalCode = numOnly ? `WT ${numOnly}` : '';
    const setter = isPearl ? setPearlToners : setToners;
    
    setter(prev => prev.map(toner => {
      if (toner.id === id) {
        if (numOnly.length >= 3 && TONER_DB[finalCode]) { setFocusTarget({ id: id, type: 'weight' }); }
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
          const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; 
          if (isPearl) setPearlToners([...pearlToners, newToner]); 
          else setToners([...toners, newToner]); 
          setFocusTarget({ id: newId, type: 'code' }); 
      }
  };
  
  const removeToner = (id: string, isPearl = false) => { if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id)); else setToners(toners.filter(t => t.id !== id)); };
  
  const addToner = (isPearl = false) => { 
      const newId = `new_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`; 
      const newToner = { id: newId, code: '', adjustedWeight: "", history: [], memo: "", isExpanded: false }; 
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

  const toggleExpand = (id: string, isPearl: boolean) => {
      const setter = isPearl ? setPearlToners : setToners;
      setter(prev => prev.map(t => t.id === id ? { ...t, isExpanded: !t.isExpanded } : t));
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

  const generateShareText = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}g`).join('\n');
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}g`).join('\n');
    let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin;
    const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0'].join('|');
    const shareUrl = `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`;
    
    return `[PERMAHYD HI-TEC 조색 배합 지시서]\n================================\n📅 등록날짜: ${registrationDate}\n🚗 차량번호: ${vehicleNumber || '미지정'}\n🚙 브랜드/차종: ${carModel || '미지정'}\n🎨 컬러코드: ${targetColorCode || '미지정'}\n🛠️ 작업내용: ${jobDescription || '미지정'}\n📌 특이사항: ${specialNotes || '없음'}\n================================\n\n[▼ 베이스 코트 (Ground)]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 6052 수지제원: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트 (Mid-coat)]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 코트 합계: ${totalPearlWeight}g\n▶ 6052 수지제원: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 혼합 총량: ${totalFinalWeight}g\n\n👉 모바일 배합 복원 링크:\n${shareUrl}`;
  };

  const handleShareKakao = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(generateShareText());
        alert("배합 스펙이 클립보드에 복사되었습니다. 카카오톡 대화창에 붙여넣기 하십시오.");
    } else { alert("클립보드 복사를 지원하지 않는 브라우저입니다."); }
    setIsShareModalOpen(false);
  };
  const handleShareSMS = () => { window.location.href = `sms:?body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };
  const handleShareMail = () => { window.location.href = `mailto:?subject=${encodeURIComponent('[조색PRO] 배합 지시서 공유')}&body=${encodeURIComponent(generateShareText())}`; setIsShareModalOpen(false); };

  const generateShareUrl = () => {
      let currentOrigin = localStorage.getItem('hitec_clean_domain') || window.location.origin;
      const payloadStr = [vehicleNumber, carModel, targetColorCode, jobDescription, specialNotes, packToners(toners), isThreeCoatMode ? packToners(pearlToners) : '', isThreeCoatMode ? '1' : '0'].join('|');
      return `${currentOrigin}${window.location.pathname}?d=${btoa(unescape(encodeURIComponent(payloadStr)))}`;
  }
  const handleCopyExcelTemplate = () => {
      const headerRow = ['등록 날짜', '차량 번호', '브랜드/차종', '컬러코드', '작업내용', '특이사항', '배합보기'].join('\t');
      navigator.clipboard.writeText(headerRow); alert("엑셀 헤더(제목 표시줄)가 복사되었습니다. 엑셀 A1 셀에 붙여넣기 하세요.");
  }
  const copyToExcelData = () => {
    const linkStr = `=HYPERLINK("${generateShareUrl()}", "[팝업으로 복원]")`; 
    const rowData = [registrationDate, vehicleNumber || '미입력', carModel || '미입력', targetColorCode || '미지정', jobDescription || '미입력', specialNotes || '', linkStr].join('\t');
    if (typeof navigator !== 'undefined' && navigator.clipboard) { navigator.clipboard.writeText(rowData).catch(err => console.error(err)); }
    alert("현재 데이터가 복사되었습니다. 엑셀의 빈 줄에 붙여넣기 하세요.");
    setIsExcelModalOpen(false);
  };

  const handleSubscribeSubmit = () => {
      if(!subName || !subAge || !subRegion || !subBiz || !subEmail) { alert("모든 항목을 입력해주세요."); return; }
      const subject = encodeURIComponent(`[조색 PRO 승인요청] ${subBiz} - ${subName}`);
      const body = encodeURIComponent(`이름: ${subName}\n나이: ${subAge}\n지역: ${subRegion}\n사업장명: ${subBiz}\n이메일: ${subEmail}\n\n위의 정보로 조색 PRO 정식 사용 및 월 구독(3,000원) 승인을 요청합니다.`);
      window.location.href = `mailto:ysm0427@gmail.com?subject=${subject}&body=${body}`;
      setIsSubscribeOpen(false);
  };

  const saveToBoard = () => {
      if(!targetColorCode) { 
          alert("⚠️ [안내] 컬러코드를 입력해야 합니다!\n\n워크시트 왼쪽 상단 '🎨 컬러코드' 입력칸에 색상코드(예: UG4)를 먼저 적어주셔야 게시판에 등록 및 공유가 가능합니다."); 
          return; 
      }
      const newPost = {
          id: Date.now(),
          brand: carModel || '미지정', 
          code: targetColorCode,
          date: registrationDate,
          likes: 0,
          views: 0,
          author: '내 데이터',
          spec: specialNotes || '특이사항 없음',
          baseFormula: [...toners],
          pearlFormula: [...pearlToners],
          isThreeCoat: isThreeCoatMode
      };
      setBoardPosts([newPost, ...boardPosts]);
      alert("🎉 게시판에 성공적으로 시편 데이터가 등록되었습니다!\n(※ 현재는 로컬 테스트 환경에 저장됩니다.)");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col relative overflow-x-hidden pb-[320px] lg:pb-[140px]">
      
      {isNoticeOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[2000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[450px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-rose-600 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><AlertTriangle size={18} /> 시스템 업데이트 안내</h3>
              <button onClick={() => setIsNoticeOpen(false)} className="hover:text-red-200 transition-colors bg-rose-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4 bg-slate-50">
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-sm leading-relaxed font-medium">
                  <p className="mb-2"><span className="font-black text-rose-600">[안내]</span> 조색 PRO 시스템이 최신 버전으로 업데이트 되었습니다.</p>
                  <p>안전한 데이터 관리를 위해 등록된 배합은 정기적으로 <b>엑셀 복사(백업)</b> 해두시는 것을 권장합니다.</p>
              </div>
              <button onClick={() => setIsNoticeOpen(false)} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold shadow-md hover:bg-slate-700 transition-colors">확인했습니다</button>
            </div>
          </div>
        </div>
      )}

      <header className="bg-slate-900 flex flex-col sm:flex-row justify-between items-center p-4 border-b border-slate-800 shadow-md shrink-0 gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">H</span></div>
          <h1 className="text-lg md:text-xl font-semibold flex items-center gap-2 w-full">
              <span className="text-white tracking-wide truncate">윤성만님을 위한</span>
              <span className="text-blue-400 font-normal shrink-0">조색 PRO</span>
              <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-700 ml-1 hidden sm:inline-block shrink-0">Last Patch: {LAST_PATCH_DATE}</span>
          </h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button onClick={() => window.location.reload()} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <RefreshCw size={14} /> 업데이트
            </button>
            <button onClick={() => setIsBoardOpen(true)} className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-900/50 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Layers size={14} /> 시편 게시판
            </button>
            <button onClick={() => setIsSubscribeOpen(true)} className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shadow-sm">
                <Users size={14} /> PRO 승인요청
            </button>
        </div>
      </header>

      <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 flex flex-col bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden">
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-3">
            
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center shrink-0">
                <Sliders className="text-blue-600 mr-2" size={16} />공식 배합 워크 시트
              </h2>
              <button onClick={handleClearAllInfo} className="text-[11px] font-bold text-slate-500 hover:text-red-600 flex items-center transition-colors bg-white hover:bg-red-50 px-2.5 py-1.5 rounded-md border border-slate-200 shadow-sm shrink-0">
                <Trash2 size={14} className="mr-1"/> 전체 초기화
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col">
                   <label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📅 등록 날짜</label>
                   <input type="date" value={registrationDate} onChange={(e) => setRegistrationDate(e.target.value)} className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm cursor-pointer" />
                </div>
                <div className="flex flex-col">
                   <label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚗 차량 번호</label>
                   <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} placeholder="예: 12가3456" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
                </div>
                <div className="flex flex-col">
                   <label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🚙 브랜드 등록</label>
                   <input type="text" value={carModel} onChange={(e) => setCarModel(e.target.value)} placeholder="예: 현대, BMW..." className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
                </div>
                <div className="flex flex-col">
                   <label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🎨 컬러코드</label>
                   <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="예: UX" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full uppercase focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
                </div>
              </div>
              
              <div>
                 <label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">🛠️ 작업 내용</label>
                 <input type="text" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="예: 조수석 앞휀다 교환, 본넷 교환 등" className="bg-white border border-slate-300 p-2.5 rounded text-sm font-bold w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm" />
              </div>
              
              <div>
                 <label className="block text-[11px] font-black text-slate-600 mb-1 ml-0.5">📌 특이사항 및 스펙 메모</label>
                 <input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} placeholder="선택사항 직접 입력 (예: 이색 심함, 조색 주의 등)" className="bg-yellow-50 border-yellow-400 border p-2.5 rounded text-sm font-bold w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow" />
              </div>
              
              <div className="flex w-full gap-2 mt-2">
                <button onClick={() => setIsExcelModalOpen(true)} className="flex-[1.5] bg-green-600 text-white p-3 rounded text-xs font-black flex items-center justify-center hover:bg-green-700 transition-colors shadow-sm"><FileSpreadsheet size={16} className="mr-1 hidden sm:block"/> 엑셀 복사</button>
                <button onClick={() => { saveToBoard(); setIsBoardOpen(true); }} className="flex-[1.5] bg-blue-600 text-white p-3 rounded text-xs font-black flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm"><Layers size={16} className="mr-1 hidden sm:block"/> 시편 공유</button>
                <button onClick={() => setIsShareModalOpen(true)} className="flex-[2] bg-[#FEE500] text-slate-900 p-3 rounded text-sm font-black flex items-center justify-center hover:bg-[#E5C100] transition-colors shadow-sm">
                    <Share2 size={18} className="mr-1.5"/> 공유 전송
                </button>
                <button onClick={handleResetFormula} className="bg-white border border-red-200 text-red-500 px-3 rounded flex flex-col items-center justify-center hover:bg-red-50 transition-colors shadow-sm whitespace-nowrap">
                    <Trash2 size={18} className="mb-0.5" />
                    <span className="text-[9px] font-black">배합 리셋</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-white">
            <div className="mb-4 bg-indigo-50 border border-indigo-100 p-2.5 rounded-lg flex flex-col sm:flex-row items-center justify-between shadow-sm gap-2">
                <div className="flex items-center gap-2"><Beaker size={14} className="text-indigo-600" /><span className="text-xs font-bold text-indigo-800">현장 실시간 용량 배율 변환기</span></div>
                <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    <input type="text" inputMode="decimal" value={scaleFactor} onChange={(e) => setScaleFactor(e.target.value.replace(/[^0-9.]/g, ''))} className="w-12 text-center text-sm font-black text-indigo-700 border rounded py-1" />
                    <span className="text-[11px] font-bold text-indigo-400 mr-1">배</span>
                    <button onClick={() => handleScaleAll(true)} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm hover:bg-indigo-700 transition-colors">× 곱하기</button>
                    <button onClick={() => handleScaleAll(false)} className="bg-white border border-indigo-300 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded shadow-sm hover:bg-indigo-50 transition-colors">÷ 나누기</button>
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
                      <div className="flex flex-col flex-1 w-full overflow-hidden">
                          <div className="flex items-center gap-2 mb-1 w-full">
                              <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                                   <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                                   <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                              </div>
                              <input 
                                  ref={el => { codeRefs.current[toner.id] = el; }} 
                                  value={toner.code.replace('WT ', '')} 
                                  onChange={e => handleCodeChange(toner.id, e.target.value, false)} 
                                  onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                          e.preventDefault();
                                          setFocusTarget({ id: toner.id, type: 'weight' });
                                      }
                                  }}
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  className="w-20 text-center text-sm font-black border border-slate-300 rounded p-1.5 focus:border-blue-500 focus:outline-none shadow-inner shrink-0" 
                                  placeholder="번호" 
                              />
                              
                              <div 
                                  className="flex items-center gap-1 cursor-pointer hover:bg-blue-100/50 py-1 px-1.5 rounded transition-colors flex-1 overflow-hidden"
                                  onClick={() => toggleExpand(toner.id, false)}
                              >
                                  <span className="font-bold text-blue-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                                  {toner.isExpanded ? <ChevronUp size={16} className="text-blue-400 shrink-0" /> : <ChevronDown size={16} className="text-blue-400 shrink-0" />}
                              </div>
                          </div>
                          
                          {toner.isExpanded && (
                              <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2 pt-2 border-t border-slate-200">
                                  {info.details && info.details.length > 0 ? (
                                      <div className="flex flex-col gap-1.5 w-full">
                                          {info.details.map((d: any, idx: number) => {
                                              const splitIndex = d[0].indexOf('(');
                                              let mainTitle = d[0]; let subTitle = '';
                                              if(splitIndex !== -1) { 
                                                  mainTitle = d[0].substring(0, splitIndex).trim(); 
                                                  subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); 
                                              }
                                              return (
                                              <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2.5 mb-2">
                                                  <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-1 py-1.5 rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                      <span className="text-[11px] font-black leading-tight break-keep">{mainTitle}</span>
                                                      {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                                  </div>
                                                  <span className="text-[11px] text-slate-700 leading-relaxed break-keep pt-0.5">{d[1]}</span>
                                              </div>
                                          )})}
                                      </div>
                                  ) : <p className="text-[11px] text-slate-500 leading-tight break-keep">{info.desc}</p>}
                              </div>
                          )}
                      </div>

                      <div className="flex items-center self-end sm:self-auto bg-white border rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                         <button onClick={() => quickEditWeight(toner.id, -0.1, false)} className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                         <input 
                             ref={el => { weightRefs.current[toner.id] = el; }} 
                             inputMode="decimal" 
                             pattern="[0-9]*"
                             value={toner.adjustedWeight} 
                             onChange={e => handleWeightInputChange(toner.id, e.target.value, false)} 
                             onBlur={e => handleWeightBlur(toner.id, e.target.value, false)} 
                             onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                             className="w-16 text-right text-base font-black text-blue-600 focus:outline-none clean-number-input mx-1" 
                             placeholder="0.0" 
                         />
                         <button onClick={() => quickEditWeight(toner.id, 0.1, false)} className="px-2 py-1 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                         <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => removeToner(toner.id, false)} className="ml-1"><Trash2 size={18} className="text-slate-300 hover:text-red-500 transition-colors"/></button>
                      </div>
                    </div>
                    {toner.history && toner.history.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500 bg-slate-100 px-2 py-1.5 rounded-md w-full">
                            <span className="font-bold shrink-0">이력 ({toner.history.length}회):</span>
                            <div className="flex gap-1 flex-wrap">
                                {toner.history.map((hVal: string, hIdx: number) => (
                                    <button key={hIdx} onClick={() => quickEditWeight(toner.id, parseFloat(hVal) - parseFloat(toner.adjustedWeight||'0'), false)} className="hover:text-blue-600 hover:font-bold transition-colors">{hIdx + 1}({hVal}g)</button>
                                ))}
                            </div>
                        </div>
                    )}
                  </div>
                )
              })}
              
              <button 
                  onMouseDown={(e) => e.preventDefault()} 
                  onTouchStart={(e) => e.preventDefault()}
                  onClick={() => addToner(false)} 
                  className="w-full py-3 border border-dashed border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 rounded-lg text-slate-500 hover:text-blue-600 font-bold text-sm flex justify-center items-center transition-all shadow-sm mt-2"
              >
                  <Plus size={18} className="mr-1"/>베이스 안료 추가
              </button>
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
                        <div className="flex flex-col flex-1 w-full overflow-hidden pl-2">
                            <div className="flex items-center gap-2 mb-1 w-full">
                                <div className="flex w-14 h-10 rounded shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                                     <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                                     <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                                </div>
                                <input 
                                    ref={el => { codeRefs.current[toner.id] = el; }} 
                                    value={toner.code.replace('WT ', '')} 
                                    onChange={e => handleCodeChange(toner.id, e.target.value, true)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            setFocusTarget({ id: toner.id, type: 'weight' });
                                        }
                                    }}
                                    type="tel"
                                    inputMode="numeric" 
                                    pattern="[0-9]*" 
                                    className="w-20 text-center text-sm font-black border border-purple-200 rounded px-1.5 py-1 text-purple-800 shadow-inner focus:outline-none focus:border-purple-500 shrink-0" 
                                    placeholder="번호" 
                                />
                                <div 
                                    className="flex items-center gap-1 cursor-pointer hover:bg-purple-100/50 py-1 px-1.5 rounded transition-colors flex-1 overflow-hidden"
                                    onClick={() => toggleExpand(toner.id, true)}
                                >
                                    <span className="font-bold text-purple-700 text-sm truncate">{info.role || '미등록 안료'}</span>
                                    {toner.isExpanded ? <ChevronUp size={16} className="text-purple-400 shrink-0" /> : <ChevronDown size={16} className="text-purple-400 shrink-0" />}
                                </div>
                            </div>
                            
                            {toner.isExpanded && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2 pt-2 border-t border-purple-200">
                                    {info.details && info.details.length > 0 ? (
                                        <div className="flex flex-col gap-1.5 w-full">
                                            {info.details.map((d: any, idx: number) => {
                                                const splitIndex = d[0].indexOf('(');
                                                let mainTitle = d[0]; let subTitle = '';
                                                if(splitIndex !== -1) { 
                                                    mainTitle = d[0].substring(0, splitIndex).trim(); 
                                                    subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); 
                                                }
                                                return (
                                                <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-2.5 mb-2">
                                                    <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                                        <span className="text-[10.5px] font-black leading-tight">{mainTitle}</span>
                                                        {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                                    </div>
                                                    <span className="text-xs text-slate-700 leading-relaxed break-keep pt-0.5">{d[1]}</span>
                                                </div>
                                            )})}
                                        </div>
                                    ) : <p className="text-[11px] text-slate-500 leading-tight break-keep">{info.desc}</p>}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center self-end sm:self-auto bg-white border border-purple-100 rounded-md px-1.5 py-0.5 shrink-0 shadow-sm mt-2 sm:mt-0">
                           <button onClick={() => quickEditWeight(toner.id, -0.1, true)} className="px-2 py-1 text-red-500 font-bold hover:bg-red-50 rounded">-</button>
                           <input 
                               ref={el => { weightRefs.current[toner.id] = el; }} 
                               inputMode="decimal" 
                               pattern="[0-9]*"
                               value={toner.adjustedWeight} 
                               onChange={e => handleWeightInputChange(toner.id, e.target.value, true)} 
                               onBlur={e => handleWeightBlur(toner.id, e.target.value, true)} 
                               onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} 
                               className="w-16 text-right text-base font-black text-purple-600 focus:outline-none clean-number-input mx-1" 
                               placeholder="0.0" 
                           />
                           <button onClick={() => quickEditWeight(toner.id, 0.1, true)} className="px-2 py-1 text-blue-500 font-bold hover:bg-blue-50 rounded">+</button>
                           <span className="text-[10px] font-bold text-slate-400 ml-1 mr-1">g</span>
                           <button onClick={() => removeToner(toner.id, true)} className="ml-1"><Trash2 size={18} className="text-purple-300 hover:text-red-500 transition-colors"/></button>
                        </div>
                      </div>
                      {toner.history && toner.history.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-purple-500 bg-purple-100 px-2 py-1.5 rounded-md w-full">
                              <span className="font-bold shrink-0">이력 ({toner.history.length}회):</span>
                              <div className="flex gap-1 flex-wrap">
                                  {toner.history.map((hVal: string, hIdx: number) => (
                                      <button key={hIdx} onClick={() => quickEditWeight(toner.id, parseFloat(hVal) - parseFloat(toner.adjustedWeight||'0'), true)} className="hover:text-purple-700 hover:font-bold transition-colors">{hIdx + 1}({hVal}g)</button>
                                  ))}
                              </div>
                          </div>
                      )}
                    </div>
                  )
                })}
                <button 
                    onMouseDown={(e) => e.preventDefault()} 
                    onTouchStart={(e) => e.preventDefault()}
                    onClick={() => addToner(true)} 
                    className="w-full py-3 border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-100/50 rounded-lg text-purple-600 font-bold transition-all flex items-center justify-center space-x-2 text-sm mt-2 shadow-sm"
                >
                    <Plus size={18} /><span>펄 조색제 추가</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 우측 컬럼: 3D 그래픽 엔진 & 카탈로그 */}
        <div className="lg:col-span-5 flex flex-col space-y-4 h-full">
          <div className="flex-1 bg-white border border-slate-300 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-3 shrink-0 bg-slate-50 border-b border-slate-200">
              <h3 className="text-xs font-black mb-2 flex justify-between items-center text-slate-800">
                <span className="flex items-center"><Sun size={14} className="mr-1 text-orange-500"/> ✨ STUDIO 3D 광학 조정 시뮬레이터</span>
                <button onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); }} className="text-[10px] px-2.5 py-1.5 rounded-lg bg-blue-600 text-white font-bold flex items-center hover:bg-blue-700 transition-colors shadow-sm"><Maximize size={10} className="mr-1"/>먼셀 컬러 믹싱 랩</button>
              </h3>
              
              <div className="h-44 rounded-xl overflow-hidden shadow-inner border border-slate-300 bg-slate-800 bg-cover bg-center flex items-center justify-center cursor-pointer relative group" onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); }}>
                  <div className="relative z-10 w-full h-full">
                      {render3DView()}
                  </div>
                  <div className="absolute top-3 left-3 bg-white/90 text-slate-800 text-[10px] font-black px-2.5 py-1 rounded shadow backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center">
                      <Maximize size={12} className="mr-1 text-blue-600"/> 화면을 클릭하여 스튜디오 크게 열기
                  </div>
              </div>

              <div className="flex gap-2 mt-3 relative z-10">
                  <button 
                      onClick={() => setIsEmailModalOpen(true)}
                      className="flex-1 bg-yellow-400 border border-yellow-500 text-slate-900 py-2.5 rounded-lg text-sm font-black flex items-center justify-center hover:bg-yellow-500 transition-colors shadow-sm cursor-pointer"
                  >
                      <Mail size={16} className="mr-1.5 text-slate-800 pointer-events-none" /> <span className="pointer-events-none">다이렉트 피드백 보내기</span>
                  </button>
                  <button 
                      onClick={() => setIsHistoryModalOpen(true)}
                      className="flex-1 bg-slate-800 border border-slate-700 text-slate-300 py-2.5 rounded-lg text-sm font-black flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors shadow-sm cursor-pointer"
                  >
                      <Code size={16} className="mr-1.5 text-slate-400 pointer-events-none" /> <span className="pointer-events-none">PRO 제작 과정 보기</span>
                  </button>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center shrink-0 gap-3">
                <h3 className="text-white font-black text-sm flex items-center shrink-0"><BookOpen className="mr-2 text-blue-400" size={18}/>지능형 안료 도감</h3>
                
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-48">
                        <input type="text" value={catalogSearch} onChange={e=>setCatalogSearch(e.target.value)} placeholder="안료명 / FORD 검색" className="w-full bg-slate-800 border border-slate-700 text-white text-xs px-2.5 py-1.5 rounded-full pl-8 focus:outline-none focus:border-blue-500 transition-colors" />
                        <Search size={14} className="absolute left-2.5 top-1.5 text-slate-400" />
                    </div>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3 bg-slate-100">
                {catalogSearch.trim() !== '' && OEM_COLORS.some(c => c.code.toUpperCase().includes(catalogSearch.toUpperCase()) || c.name.toUpperCase().includes(catalogSearch.toUpperCase())) && (
                    <div className="mb-2 p-3 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
                        <h4 className="text-xs font-black text-blue-800 mb-2">🔍 FORD 색상코드 검색 결과</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {OEM_COLORS.filter(c => c.code.toUpperCase().includes(catalogSearch.toUpperCase()) || c.name.toUpperCase().includes(catalogSearch.toUpperCase())).slice(0, 20).map((oem, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded shadow-sm border border-slate-200 cursor-pointer hover:border-blue-400 transition-colors" onClick={() => setTargetColorCode(oem.code)}>
                                    <span className="font-black text-blue-600 text-sm">{oem.code}</span>
                                    <span className="text-xs text-slate-600 font-bold truncate max-w-[100px]">{oem.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {sortedCatalog.map((item) => {
                    const isMetallic = item.type !== 'solid' && item.type !== 'binder';
                    const isCurrentlyUsed = activeCodes.includes(item.code);

                    return (
                        <div key={item.code} className={`flex flex-col bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${isCurrentlyUsed ? 'border-2 border-blue-500 shadow-md transform scale-[1.01]' : 'border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer'}`} onClick={() => setSelectedTonerForView(item.code)}>
                            <div className="h-12 w-full relative transition-all border-b border-slate-200" style={{background: getTonerDetailBackground(item.code, item.role, 'face')}}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <div className="absolute bottom-1.5 left-3 text-white text-sm font-black drop-shadow-md">{item.code} <span className="text-[10px] font-normal opacity-90 ml-1">{item.role}</span></div>
                                {isCurrentlyUsed && <div className="absolute top-1.5 right-2 bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold shadow">배합 중</div>}
                            </div>
                            <div className="p-3 flex flex-col gap-1.5">
                                {item.details?.map((d: any, idx: number) => {
                                    const splitIndex = d[0].indexOf('(');
                                    let mainTitle = d[0]; let subTitle = '';
                                    if(splitIndex !== -1) { 
                                        mainTitle = d[0].substring(0, splitIndex).trim(); 
                                        subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); 
                                    }
                                    return (
                                    <div key={idx} className="flex items-start gap-2.5 mb-2">
                                        <div className={`shrink-0 flex flex-col items-center justify-center w-[120px] sm:w-[130px] px-2 py-1.5 text-[10px] font-bold rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                            <span className="text-[10.5px] font-black leading-tight">{mainTitle}</span>
                                            {subTitle && <span className="text-[9px] font-bold mt-0.5 opacity-80 leading-tight">{subTitle}</span>}
                                        </div>
                                        <span className="text-[11px] text-slate-700 leading-relaxed break-keep pt-0.5">{d[1]}</span>
                                    </div>
                                )})}
                            </div>
                        </div>
                    );
                })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full z-[500] bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-[0_-12px_45px_rgba(0,0,0,0.85)] text-slate-100 pb-[env(safe-area-inset-bottom)]">
          <div className="flex lg:hidden items-center justify-between p-3 px-4">
             <div className="flex gap-4">
                <div className="flex flex-col">
                   <span className="text-[10px] text-slate-400 font-bold mb-0.5"><Layers size={10} className="inline mr-1 text-blue-400"/>베이스</span>
                   <span className="text-sm font-black text-white">{totalBaseWeight}g</span>
                </div>
                {isThreeCoatMode && (
                   <div className="flex flex-col border-l border-slate-700 pl-4">
                      <span className="text-[10px] text-slate-400 font-bold mb-0.5"><Zap size={10} className="inline mr-1 text-purple-400"/>펄</span>
                      <span className="text-sm font-black text-white">{totalPearlWeight}g</span>
                   </div>
                )}
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-yellow-500 font-black tracking-wider flex items-center mb-0.5"><Beaker size={10} className="mr-0.5"/>수지포함 최종</span>
                <span className="text-2xl font-black text-yellow-400 leading-none">
                   {(
                       parseFloat((parseFloat(totalBaseWeight) * (isBaseMetallic ? 1.2 : 1.1)).toFixed(1)) + 
                       (isThreeCoatMode ? parseFloat((parseFloat(totalPearlWeight) * (isPearlMetallic ? 1.2 : 1.1)).toFixed(1)) : 0)
                   ).toFixed(1)}<span className="text-sm font-bold text-yellow-600 ml-0.5">g</span>
                </span>
             </div>
          </div>

          <div className="hidden lg:flex p-4 justify-between items-center gap-4">
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
      </div>

      {/* ========================================================= */}
      {/* 💡 모든 팝업(Modal) 컴포넌트는 오직 최하단 여기에만 배치됩니다! */}
      {/* ========================================================= */}

      {/* 1. 이메일 팝업 */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[400px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-yellow-500 flex justify-between items-center text-slate-900">
              <h3 className="font-black flex items-center gap-2"><Mail size={18} /> 개발자에게 피드백 보내기</h3>
              <button onClick={() => setIsEmailModalOpen(false)} className="hover:text-red-600 transition-colors bg-yellow-400 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4 bg-slate-50">
              <p className="text-sm text-slate-600 text-center font-medium break-keep">버그 제보, 기능 추가 요청 등 어떤 의견이든 환영합니다!<br/>어떤 메일 서비스로 보내시겠습니까?</p>
              <div className="flex gap-3 mt-2">
                  <a href="https://mail.naver.com/v2/new?to=ysm0427@gmail.com" target="_blank" rel="noreferrer" className="flex-1 bg-[#03C75A] text-white py-3 rounded-xl font-black text-center shadow-md hover:bg-[#02b350] transition-colors">네이버 메일</a>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ysm0427@gmail.com" target="_blank" rel="noreferrer" className="flex-1 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-black text-center shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                    구글 메일
                  </a>
              </div>
              <button onClick={() => { navigator.clipboard.writeText('ysm0427@gmail.com'); alert('이메일 주소가 복사되었습니다.'); }} className="text-xs text-slate-400 underline mt-2 hover:text-yellow-600 transition-colors">주소만 복사하기 (ysm0427@gmail.com)</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 제작 비하인드 히스토리 모달 */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 rounded-2xl w-[600px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-700 my-8">
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center sticky top-0 z-10">
              <h3 className="text-white font-black text-lg flex items-center gap-2"><Code className="text-blue-400" /> 조색 PRO 한계 돌파의 기록</h3>
              <button onClick={() => setIsHistoryModalOpen(false)} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 text-slate-300 text-sm leading-relaxed">
                <p className="text-blue-200 font-bold text-base border-l-4 border-blue-500 pl-3">"이 앱은 단순한 웹 툴이 아닙니다. 색채 공학과 극한의 코드 최적화가 낳은 피와 땀의 결과물입니다."</p>
                <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <h4 className="text-white font-bold mb-2 flex items-center gap-2"><Zap size={14} className="text-yellow-400"/> 1. 광학 엔진(Vector HSL Engine) 자체 개발</h4>
                        <p>기존 조색 앱들의 단순 더하기 방식이 아닌, 안료의 고유 파장과 반사각을 수학적 벡터로 계산하여 혼합하는 엔진을 밑바닥부터 다시 설계했습니다.</p>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
                <button onClick={() => setIsHistoryModalOpen(false)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 안료 클릭 상세 분석 보드 모달 */}
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
                        const splitIndex = d[0].indexOf('(');
                        let mainTitle = d[0]; let subTitle = '';
                        if(splitIndex !== -1) { 
                            mainTitle = d[0].substring(0, splitIndex).trim(); 
                            subTitle = d[0].substring(splitIndex).trim().replace(/\s*&\s*/g, '&'); 
                        }
                        return (
                        <div key={idx} className="flex items-start gap-2.5 mb-2">
                            <div className={`shrink-0 flex flex-col items-center justify-center w-[130px] sm:w-[140px] px-2 py-1.5 text-[10px] font-bold rounded-md border text-center shadow-sm ${getBadgeClass(d[0])}`}>
                                <span className="text-[10px] font-black leading-none">{mainTitle}</span>
                                {subTitle && <span className="text-[8.5px] font-bold mt-1 opacity-80 leading-none">{subTitle}</span>}
                            </div>
                            <span className="text-xs text-slate-700 leading-relaxed break-keep pt-0.5">{d[1]}</span>
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

      {/* 4. 과거 연동 데이터 모달 */}
      {restoredViewData && (
        <div className="fixed inset-0 bg-slate-950/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            <div className="p-4 flex justify-between items-center border-b border-slate-700/50 bg-[#1e293b]">
              <h3 className="text-white font-bold flex items-center gap-2">
                <History size={18} className="text-blue-400" /> 과거 구성에 따른 구성
              </h3>
              <button 
                onClick={() => { setRestoredViewData(null); window.close(); }} 
                className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar max-h-[70vh] bg-[#0f172a] space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-[#1e293b] p-4 rounded-xl border border-slate-700/50">
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">차량번호</div>
                  <div className="text-sm font-bold text-white">{restoredViewData.v || restoredViewData.vehicleNumber || '미입력'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">브랜드/차종</div>
                  <div className="text-sm font-bold text-white">{restoredViewData.m || restoredViewData.carModel || '미입력'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">컬러코드</div>
                  <div className="text-sm font-bold text-blue-400 uppercase">{restoredViewData.c || restoredViewData.targetColorCode || '미지정'}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 mb-1">작업 내용</div>
                  <div className="text-sm font-bold text-white leading-snug">{restoredViewData.j || restoredViewData.jobDescription || '미입력'}</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2">
                  <Layers size={14} /> 베이스 코트 (Ground Coat)
                </h4>
                <div className="space-y-2">
                  {(restoredViewData.b || restoredViewData.toners || [])?.filter((t: any) => t.code).map((t: any, idx: number) => (
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

              {((restoredViewData.t !== undefined ? restoredViewData.t : restoredViewData.isThreeCoatMode)) && (restoredViewData.p || restoredViewData.pearlToners || [])?.filter((t: any) => t.code).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-purple-400 mb-3 flex items-center gap-2 mt-2">
                    <Zap size={14} /> 펄코트 (Mid Coat)
                  </h4>
                  <div className="space-y-2">
                    {(restoredViewData.p || restoredViewData.pearlToners || []).filter((t: any) => t.code).map((t: any, idx: number) => (
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

            <div className="p-4 bg-[#1e293b] border-t border-slate-700/50">
              <button 
                onClick={() => { setRestoredViewData(null); window.close(); }} 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
              >
                닫기 및 진행 중으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 엑셀 연동 모달 */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border-2 border-green-600">
            <div className="p-4 bg-green-600 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><FileSpreadsheet size={18} /> 엑셀(Excel) 연동 가이드 및 복사</h3>
              <button onClick={() => setIsExcelModalOpen(false)} className="hover:text-red-200 transition-colors bg-green-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4 bg-slate-50">
              <div className="text-sm text-slate-700 leading-relaxed bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="font-black text-green-800 mb-2">✅ 사용 방법</p>
                  <p><b>Step 1.</b> 처음 등록 시 아래 <b>'엑셀 기본 양식 복사'</b>를 눌러 본인의 엑셀 A1 셀에 붙여넣어 <b>제목 틀</b>을 만드세요.</p>
                  <p className="mt-1"><b>Step 2.</b> 작업이 끝난 후 <b>'현재 데이터 엑셀 복사'</b>를 누르고 엑셀의 빈 줄 첫 칸에 붙여넣으면 깔끔하게 연동됩니다.</p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                  <button onClick={handleCopyExcelTemplate} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold shadow-sm hover:bg-slate-700 transition-colors">
                      📋 Step 1. 엑셀 기본 양식 복사 (제목줄 만들기)
                  </button>
                  <button onClick={copyToExcelData} className="w-full bg-green-600 text-white py-3 rounded-xl font-black shadow-md hover:bg-green-700 transition-colors">
                      🚀 Step 2. 현재 데이터 엑셀 복사 (배합 저장하기)
                  </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 월 구독 승인요청 모달 */}
      {isSubscribeOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl w-[450px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200 my-8">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><CreditCard size={18} /> 조색 PRO 정식 사용 승인 요청</h3>
              <button onClick={() => setIsSubscribeOpen(false)} className="hover:text-purple-200 transition-colors bg-white/20 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 flex flex-col gap-4 bg-slate-50">
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-center">
                  <p className="text-purple-800 font-black text-lg">월 사용료: 3,000원</p>
                  <p className="text-xs text-purple-600 mt-1">계좌번호: 카카오뱅크 3333-XX-XXXXXX (윤성만)</p>
              </div>
              <div className="space-y-3">
                  <div><label className="text-xs font-bold text-slate-600">이름</label><input type="text" value={subName} onChange={e=>setSubName(e.target.value)} className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="홍길동" /></div>
                  <div><label className="text-xs font-bold text-slate-600">나이</label><input type="text" value={subAge} onChange={e=>setSubAge(e.target.value)} className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="35" /></div>
                  <div><label className="text-xs font-bold text-slate-600">지역 (현재 경기권 우선 승인)</label><input type="text" value={subRegion} onChange={e=>setSubRegion(e.target.value)} className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="예: 경기 광주, 성남 등" /></div>
                  <div><label className="text-xs font-bold text-slate-600">사업장명</label><input type="text" value={subBiz} onChange={e=>setSubBiz(e.target.value)} className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="ㅇㅇ모터스" /></div>
                  <div><label className="text-xs font-bold text-slate-600">연락처(이메일)</label><input type="email" value={subEmail} onChange={e=>setSubEmail(e.target.value)} className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-purple-400 focus:outline-none" placeholder="example@gmail.com" /></div>
              </div>
              <button onClick={handleSubscribeSubmit} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-2 shadow-md hover:bg-indigo-700 transition-colors">승인 요청 메일 보내기</button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 공유하기 다중 전송 모달 */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-[400px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 bg-slate-800 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2"><Share2 size={18} /> 배합 데이터 공유 전송</h3>
              <button onClick={() => setIsShareModalOpen(false)} className="hover:text-red-200 transition-colors bg-slate-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 flex flex-col gap-3 bg-slate-50">
                <button onClick={handleShareKakao} className="w-full bg-[#FEE500] text-slate-900 py-3 rounded-xl font-black shadow-sm hover:bg-[#E5C100] transition-colors flex items-center justify-center gap-2">
                    <MessageSquare size={18}/> 카카오톡 복사 전송
                </button>
                <button onClick={handleShareSMS} className="w-full bg-blue-500 text-white py-3 rounded-xl font-black shadow-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                    <Send size={18}/> 문자(SMS)로 앱 열기
                </button>
                <button onClick={handleShareMail} className="w-full bg-slate-600 text-white py-3 rounded-xl font-black shadow-sm hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                    <Mail size={18}/> 이메일 앱 열기
                </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. 브랜드별 시편 공유 게시판 (시편 상세 모달 연동) */}
      {isBoardOpen && (
        <div className="fixed inset-0 bg-slate-900/90 z-[1000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-slate-100 rounded-2xl w-[800px] max-w-full h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-slate-300">
            <div className="p-4 bg-slate-800 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2"><Layers size={18} className="text-emerald-400"/> 브랜드별 실시간 시편 데이터 (Beta)</h3>
              <button onClick={() => setIsBoardOpen(false)} className="hover:text-red-300 transition-colors bg-slate-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            
            <div className="p-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-3 shrink-0">
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                    {['전체', '현대', '기아', '제네시스', '쉐보레', '르노', 'KGM', '벤츠', 'BMW', '아우디', '포드', '렉서스'].map(b => (
                        <button key={b} onClick={() => setBoardBrandFilter(b)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${boardBrandFilter === b ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300'}`}>{b}</button>
                    ))}
                </div>
                <div className="flex gap-2 flex-1 max-w-md">
                    <div className="relative flex-1">
                        <input type="text" value={boardSearch} onChange={e=>setBoardSearch(e.target.value)} placeholder="브랜드, 컬러코드, 특이사항 동시 검색" className="w-full bg-slate-50 border border-slate-300 text-sm px-3 py-1.5 rounded-lg pl-9 focus:outline-none focus:border-emerald-500 shadow-sm" />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    <button onClick={saveToBoard} className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-md hover:bg-emerald-700 transition-colors shrink-0 whitespace-nowrap flex items-center gap-1">
                        <Plus size={14}/> 현재 배합 등록
                    </button>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3 bg-slate-100">
                {boardPosts.filter(p => {
                    const passBrandFilter = boardBrandFilter === '전체' || p.brand === boardBrandFilter;
                    const searchLower = boardSearch.toLowerCase();
                    const passSearch = p.brand.toLowerCase().includes(searchLower) || p.code.toLowerCase().includes(searchLower) || p.spec.toLowerCase().includes(searchLower);
                    return passBrandFilter && passSearch;
                }).map(post => (
                    <div key={post.id} onClick={() => setViewingPost(post)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded font-bold">{post.brand}</span>
                                <span className="text-lg font-black text-emerald-700 uppercase tracking-wide group-hover:text-emerald-500 transition-colors">{post.code}</span>
                            </div>
                            <span className="text-xs text-slate-400 font-medium flex items-center gap-1"><Calendar size={12}/> {post.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 font-bold mb-3 break-keep">{post.spec}</p>
                        <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                            <span className="text-xs text-slate-500">By. <b>{post.author}</b></span>
                            <div className="flex gap-3 text-xs font-bold text-slate-400">
                                <span className="flex items-center gap-1 group-hover:text-emerald-600 transition-colors"><Eye size={14}/> {post.views}</span>
                                <span className="flex items-center gap-1 hover:text-blue-600 transition-colors"><ThumbsUp size={14}/> {post.likes}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {boardPosts.length === 0 && <div className="text-center py-10 text-slate-500">검색 조건에 맞는 시편 데이터가 없습니다.</div>}
            </div>
            
            <div className="p-3 bg-emerald-50 border-t border-emerald-200 shrink-0 text-center">
                <p className="text-xs text-emerald-800 font-bold">※ 등록된 시편을 클릭하시면 상세 배합량 확인이 가능합니다.</p>
            </div>
          </div>
        </div>
      )}

      {/* 8-1. 시편 상세 내용 보기 모달 */}
      {viewingPost && (
        <div className="fixed inset-0 bg-slate-900/90 z-[2000] flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl w-[500px] max-w-full shadow-2xl flex flex-col overflow-hidden border border-slate-300 my-8">
            <div className="p-4 bg-emerald-600 flex justify-between items-center text-white sticky top-0 z-10">
              <h3 className="font-bold flex items-center gap-2"><Layers size={18} /> 시편 배합 상세 보기</h3>
              <button onClick={() => setViewingPost(null)} className="hover:text-red-200 transition-colors bg-emerald-700 p-1.5 rounded-full"><X size={16} /></button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-4 bg-slate-50">
              <div className="flex justify-between items-end border-b border-slate-200 pb-3">
                 <div>
                    <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded font-bold mr-2">{viewingPost.brand}</span>
                    <span className="text-2xl font-black text-emerald-700 uppercase tracking-wide">{viewingPost.code}</span>
                 </div>
                 <span className="text-xs text-slate-500 font-medium">{viewingPost.date}</span>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm font-bold text-slate-700 break-keep">
                 {viewingPost.spec}
              </div>

              <div>
                <h4 className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1"><Layers size={14} /> 베이스 코트 (Ground Coat)</h4>
                <div className="space-y-1.5">
                  {viewingPost.baseFormula?.filter((t: any) => t.code).map((t: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-800 font-black text-sm w-16">{t.code.replace('WT ', '')}</span>
                        <span className="text-xs text-slate-500">{TONER_DB[t.code]?.role || '미등록 안료'}</span>
                      </div>
                      <span className="text-blue-600 font-bold">{t.adjustedWeight}g</span>
                    </div>
                  ))}
                  {(!viewingPost.baseFormula || viewingPost.baseFormula.filter((t: any) => t.code).length === 0) && (
                      <div className="text-xs text-slate-400 text-center py-2">등록된 베이스 데이터가 없습니다.</div>
                  )}
                </div>
              </div>

              {viewingPost.isThreeCoat && viewingPost.pearlFormula?.filter((t: any) => t.code).length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="text-xs font-bold text-purple-600 mb-2 flex items-center gap-1"><Zap size={14} /> 펄 코트 (Mid Coat)</h4>
                  <div className="space-y-1.5">
                    {viewingPost.pearlFormula?.filter((t: any) => t.code).map((t: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-800 font-black text-sm w-16">{t.code.replace('WT ', '')}</span>
                          <span className="text-xs text-slate-500">{TONER_DB[t.code]?.role || '미등록 안료'}</span>
                        </div>
                        <span className="text-purple-600 font-bold">{t.adjustedWeight}g</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 bg-white flex justify-end">
               <button onClick={() => setViewingPost(null)} className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-700 transition-colors shadow-md">닫기</button>
            </div>
          </div>
        </div>
      )}

      {/* 9. 먼셀 컬러 믹싱 스튜디오 (최하단 배치) */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/98 z-[800] flex flex-col text-white font-sans select-none animate-in fade-in overflow-y-scroll custom-scrollbar">
          <header className="p-4 flex justify-between items-center bg-black/60 border-b border-slate-800 shrink-0 sticky top-0 z-40 backdrop-blur-md">
            <h2 className="text-base font-black tracking-widest text-slate-300 uppercase flex items-center"><Beaker className="mr-2 text-indigo-500"/> 먼셀 컬러 믹싱 스튜디오 (Munsell Mixing Lab)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-2 bg-slate-800 hover:bg-red-600 rounded-full border border-slate-700 transition-colors"><X size={18}/></button>
          </header>
          
          <main className="flex-1 p-6 md:p-10 flex flex-col items-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950 overflow-x-hidden">
             <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-8 items-start">
                 
                 {/* 1. 먼셀 20 색상환 */}
                 <div className="w-full flex flex-col items-center justify-center h-[460px]">
                     <h3 className="text-lg font-black text-white mb-6 flex items-center bg-slate-900 px-6 py-2 rounded-full border border-slate-700 shadow-lg shrink-0">
                         <Sun className="mr-2 text-yellow-400" size={20}/> 먼셀 20 색상환 (Munsell Wheel)
                     </h3>
                     <div className="relative flex justify-center items-center w-[360px] h-[360px] shrink-0">
                        <svg className="w-full h-full drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]" viewBox="0 0 400 400">
                            <defs>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                                </marker>
                            </defs>

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
                                        className={`cursor-pointer transition-all duration-300 hover:opacity-80`}
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWheelClick(index); }}
                                        style={{ transformOrigin: '200px 200px', transform: isSelected ? 'scale(1.05)' : 'scale(1)' }}
                                    />
                                );
                            })}

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

                            <circle cx="200" cy="200" r="98" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                            <text x="200" y="195" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" className="tracking-widest">MUNSELL</text>
                            <text x="200" y="215" fill="#ffffff" fontSize="16" fontWeight="900" textAnchor="middle" dominantBaseline="middle">표준 색상환</text>

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

                 <div className="w-full flex flex-col items-center justify-center h-[460px]">
                    <div className="bg-[#111111] rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col items-center w-full max-w-[420px] h-[420px] justify-center transition-all">
                        <h4 className="text-xl font-black text-white mb-6 tracking-widest flex items-center shrink-0">
                            <BookOpen className="mr-2 text-blue-400" size={20}/>RGB <span className="text-xs text-slate-500 ml-2 font-normal">Additive Color (빛의 혼합)</span>
                        </h4>
                        <div className="w-60 h-60 relative shrink-0">
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

                 <div className="w-full flex flex-col items-center justify-center h-[460px]">
                    {selectedWheelIndex !== null && MUNSELL_WHEEL_COLORS[selectedWheelIndex] ? (
                        <div className="bg-slate-800 p-6 rounded-3xl border border-blue-500/50 shadow-[0_0_25px_rgba(59,130,246,0.3)] w-full max-w-[420px] h-[420px] flex flex-col justify-center text-center">
                            <h4 className="text-xl font-black text-white mb-6 flex items-center justify-center gap-3 shrink-0">
                                <span className="w-6 h-6 rounded-full shadow-md border border-slate-400" style={{backgroundColor: MUNSELL_WHEEL_COLORS[selectedWheelIndex].hex}}></span>
                                {MUNSELL_WHEEL_COLORS[selectedWheelIndex].name} ({MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol}) 배합 규격
                            </h4>
                            <div className="flex justify-center items-center gap-6 bg-slate-900 py-8 px-4 rounded-xl border border-slate-700 w-full shrink-0 min-h-[140px]">
                                {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol] ? (
                                    <div className="flex flex-row justify-center items-center gap-6 w-full">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-14 h-14 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h1}}></div>
                                            <span className="text-slate-300 font-bold text-sm">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c1}</span>
                                            <span className="text-white font-black text-3xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r1}%</span>
                                        </div>
                                        {MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2 && (
                                            <div className="flex flex-row justify-center items-center gap-6">
                                                <span className="text-slate-600 font-black text-2xl">+</span>
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-14 h-14 rounded-full border-2 border-slate-500 shadow-inner" style={{backgroundColor: MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].h2}}></div>
                                                    <span className="text-slate-300 font-bold text-sm">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].c2}</span>
                                                    <span className="text-white font-black text-3xl">{MIXING_DATA[MUNSELL_WHEEL_COLORS[selectedWheelIndex].symbol].r2}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-red-400 text-sm font-bold w-full text-center">배합 데이터를 불러올 수 없습니다.</div>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-6 font-medium bg-slate-900/50 py-3 rounded-lg shrink-0">* 기술 보고서 기준의 단일 원색 정밀 조색 비율입니다.</p>
                        </div>
                    ) : (
                        <div className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700 border-dashed w-full max-w-[420px] h-[420px] flex flex-col items-center justify-center gap-4 text-center text-slate-500">
                            <Sun className="text-slate-600 mb-2" size={40} />
                            <p className="text-base font-bold text-slate-400">색상환에서 컬러를 클릭하세요.</p>
                            <p className="text-sm">선택된 색상의 원색 조색 배율이<br/>이곳에 표시됩니다.</p>
                        </div>
                    )}
                 </div>

                 <div className="w-full flex flex-col items-center justify-center h-[460px]">
                    <div className="bg-[#f8f9fa] rounded-3xl p-6 border border-slate-300 shadow-2xl flex flex-col items-center w-full max-w-[420px] h-[420px] justify-center transition-all">
                        <h4 className="text-xl font-black text-slate-900 mb-6 tracking-widest flex items-center shrink-0">
                            <BookOpen className="mr-2 text-pink-500" size={20}/>CMYK <span className="text-xs text-slate-500 ml-2 font-normal">Subtractive Color (물감의 혼합)</span>
                        </h4>
                        <div className="w-60 h-60 relative shrink-0">
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

             <div className="mt-4 pb-12 w-full flex justify-center shrink-0">
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
