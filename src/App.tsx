import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sliders, Trash2, Plus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet, 
  Image as ImageIcon, Lock, Unlock, Layers, ChevronRight, BookOpen, Share2
} from 'lucide-react';

// 💡 [에러 원천 차단] TypeScript 구조를 완벽하게 정의하여 TS2339 에러를 멸균합니다.
interface TonerDetail {
  label: string;
  text: string;
}

interface TonerData {
  role: string;
  desc: string;
  type: string;
  face: string;
  flop: string;
  details?: TonerDetail[];
}

// 💡 1. 공식 안료 데이터베이스 (선생님의 HTML 원본 구조 100% 완벽 이식)
const TONER_DB: Record<string, TonerData> = {
  'WT 144': { role: '그리니쉬 블루', type: 'solid', face: '#0284c7', flop: '#0c4a6e', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임.', details: [{label:'특징',text:'녹색을 띠는 청색 조색제입니다.'},{label:'용도',text:'기존 WT346을 대체하는 안료입니다.'},{label:'배합비율',text:'WT346 : WT144 = 1 : 0.9 로 적용합니다.'}] },
  'WT 154': { role: '블루 이펙트', type: 'silver_fine', face: '#3b82f6', flop: '#1e3a8a', desc: '청색으로 착색된 광휘형 알루미늄 조색제.', details: [{label:'특징',text:'청색으로 착색된 광휘형 알루미늄 조색제입니다.'},{label:'외관',text:'입자의 반짝임이 매우 뛰어납니다.'},{label:'용도',text:'주로 채도가 높고 입자감이 두드러지는 청색 계열 컬러에 사용됩니다.'}] },
  'WT 188': { role: '슈퍼 딥 블랙', type: 'solid', face: '#0f172a', flop: '#020617', desc: '어두운 흑색 조색제. WT388보다 조금 더 어두움.', details: [{label:'특징',text:'매우 어두운 흑색 조색제입니다.'},{label:'색상비교',text:'WT388보다도 조금 더 어두운 특성을 지닙니다.'},{label:'제한용도',text:'주로 특정 흑색 계열의 컬러에 제한적으로 사용합니다.'}] },
  'WT 197': { role: '실크 실버 울트라 파인', type: 'silver_fine', face: '#e2e8f0', flop: '#64748b', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제.', details: [{label:'특징',text:'입자 크기가 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제입니다.'},{label:'용도',text:'매끈한 느낌의 은색을 연출할 때 사용됩니다.'},{label:'적용OEM',text:'Lexus - 1F1, M.Benz - 047 등에 적용됩니다.'}] },
  'WT 300': { role: '마룬', type: 'solid', face: '#991b1b', flop: '#450a0a', desc: '어두운 적색 조색제. WT332에 비해 채도가 높으며 측면(110도)을 더 어둡게 함.', details: [{label:'특징',text:'어두운 적색 조색제입니다.'},{label:'색상비교',text:'WT332에 비해 채도가 더 높습니다.'},{label:'색상변화',text:'측면(110도 각도)에서 보았을 때 더 어둡게 보입니다.'},{label:'용도',text:'주로 적색 이펙트 컬러 조색에 사용됩니다.'}] },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', type: 'silver_fine', face: '#d1d5db', flop: '#475569', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제.', details: [{label:'특징',text:'매우 작은 고휘도 광휘형 알루미늄 조색제입니다.'},{label:'비교',text:'WT389보다 입자가 더 작습니다.'}] },
  'WT 304': { role: '매직 스파클 이펙트', type: 'xirallic', face: '#fef08a', flop: '#475569', desc: '투명한 황색의 크고 반짝임이 매우 좋은 글라스 플레이크.', details: [{label:'특징',text:'투명한 황색의 반짝임이 매우 좋은 글라스 플레이크입니다.'},{label:'효과',text:'도장면에 강렬하게 튀는 스파클링 효과를 부여합니다.'}] },
  'WT 305': { role: '울트라 화인 실버', type: 'silver_fine', face: '#cbd5e1', flop: '#334155', desc: '매우 작지만 반짝임이 좋은 특수 알루미늄 조색제.', details: [{label:'특징',text:'매우 작지만 반짝임이 좋은 특수 알루미늄 조색제입니다.'},{label:'용도',text:'매끈한 느낌의 은색 베이스에 사용됩니다.'},{label:'적용OEM',text:'Nissan - KAB, Lexus - 1F1 등에 적용됩니다.'}] },
  'WT 307': { role: '프리즈마 실버', type: 'xirallic', face: '#e2e8f0', flop: '#a855f7', desc: '정면에서는 은색, 측면에서는 무지개 색을 내는 특수 조색제.', details: [{label:'특징',text:'정면은 은색, 측면은 무지개색을 내는 특수 조색제입니다.'},{label:'효과',text:'빛의 굴절에 따라 스펙트럼(홀로그램) 효과를 줍니다.'}] },
  'WT 308': { role: '브라이트 오렌지', type: 'solid', face: '#ea580c', flop: '#7c2d12', desc: '주로 이펙트 컬러에 사용하는 맑은 주황색. 은폐력은 떨어짐.', details: [{label:'특징',text:'맑은 주황색 조색제입니다.'},{label:'단점',text:'은폐력이 떨어집니다.'},{label:'용도',text:'투명한 발색 특성 때문에 주로 이펙트 컬러의 조색에 사용됩니다.'}] },
  'WT 309': { role: '브릴리언트 마젠타', type: 'solid', face: '#d946ef', flop: '#701a75', desc: '맑은 자주색 조색제. 이펙트 컬러에 사용.', details: [{label:'특징',text:'맑고 밝은 자주색 조색제입니다.'},{label:'단점',text:'은폐력은 떨어집니다.'},{label:'용도',text:'탁해지지 않고 채도가 매우 높아야 하는 이펙트 컬러 조색에 사용합니다.'}] },
  'WT 310': { role: '파우더 펄 바인더', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '파우더 펄 분말 사용을 위한 조색제 바인더', details: [{label:'특징',text:'단독으로 색상을 내지 않는 전용 조색제 바인더입니다.'},{label:'용도',text:'파우더 펄 분말을 액상 도료에 안정적으로 섞어주는 역할을 합니다.'}] },
  'WT 311': { role: '루비 레드', type: 'solid', face: '#ef4444', flop: '#7f1d1d', desc: '약하게 황색을 띠는 맑은 적색 조색제.', details: [{label:'특징',text:'약하게 황색을 띠는 맑은 적색 조색제입니다.'},{label:'단점',text:'은폐력은 떨어집니다.'},{label:'용도',text:'채도가 높아야 하는 적색 이펙트 컬러 조색에 주로 사용됩니다.'}] },
  'WT 312': { role: '매직 파이어 이펙트', type: 'pearl', face: '#ef4444', flop: '#22c55e', desc: '관찰각도에 따라 색상변화가 큰 특수 펄.', details: [{label:'특징',text:'관찰 각도에 따라 색상 변화가 매우 큰 특수 간섭 펄입니다.'},{label:'색상변화',text:'15도는 맑은 적색, 45도는 맑은 녹색, 110도는 약하게 녹색으로 변합니다.'}] },
  'WT 315': { role: '엑스트라 화인 블루 펄', type: 'pearl', face: '#3b82f6', flop: '#84cc16', desc: '가장 작은 크기의 약하게 적색을 띠는 청색 간섭 펄.', details: [{label:'특징',text:'가장 작은 크기의 약하게 적색을 띠는 청색 간섭 펄 조색제입니다.'},{label:'비교',text:'WT372 보다도 입자가 작습니다.'},{label:'색상변화',text:'15도는 적청색, 나머지 각도는 녹황색으로 변합니다.'}] },
  'WT 316': { role: '터콰이즈 펄', type: 'pearl', face: '#06b6d4', flop: '#10b981', desc: '중간 크기의 녹색을 띠는 청색 간섭 펄 조색제.', details: [{label:'특징',text:'중간 크기의 녹색을 띠는 청색 간섭 펄 조색제입니다.'},{label:'색상변화',text:'15도는 맑은 청색, 나머지 각도는 밝은 녹색으로 변합니다.'}] },
  'WT 317': { role: '플래틴 실버 브릴리언트 화인', type: 'silver_fine', face: '#f8fafc', flop: '#334155', desc: 'WT305보다 조금 더 크며 반짝임이 좋은 특수 알루미늄.', details: [{label:'특징',text:'WT305보다 조금 더 크고 반짝임이 좋은 특수 알루미늄 조색제입니다.'},{label:'색상변화',text:'WT305 대비 15도(정면)는 더 밝고, 측면은 더 어두운 강한 명암 대비를 보입니다.'}] },
  'WT 318': { role: '브릴리언트 블루', type: 'solid', face: '#0284c7', flop: '#082f49', desc: '녹색을 띠는 맑은 청색 조색제.', details: [{label:'특징',text:'녹색을 띠는 맑은 청색 조색제입니다.'},{label:'비교',text:'WT346과 비교할 때 톤이 더 밝고 녹색 기운이 더 돕니다.'}] },
  'WT 320': { role: '플래티늄 펄', type: 'pearl', face: '#f1f5f9', flop: '#64748b', desc: '가장 작은 크기의 초미립 백색 펄 조색제.', details: [{label:'특징',text:'가장 작은 크기의 초미립 백색 펄 조색제입니다.'},{label:'적용OEM',text:'현대 XB3, 아우디 LX7L, BMW A96 등에 폭넓게 사용됩니다.'}] },
  'WT 321': { role: '화이트', type: 'solid', face: '#ffffff', flop: '#e2e8f0', desc: '가장 표준이 되는 백색(고농도) 조색제.', details: [{label:'특징',text:'가장 표준이 되는 백색(고농도) 조색제입니다.'},{label:'이펙트적용',text:'15도는 어둡게, 나머지 각도는 밝게 하며 금속/펄의 입자감을 줄여줍니다.'}] },
  'WT 322': { role: '마이크로 화이트', type: 'solid', face: '#f8fafc', flop: '#cbd5e1', desc: '알루미늄 및 펄 입자가 사용되는 이펙트 컬러에만 한정하여 사용.', details: [{label:'주의사항',text:'솔리드에는 쓰지 않고 이펙트 컬러에만 한정하여 사용합니다.'},{label:'색상변화',text:'15도는 황색을 띠며 어둡고, 나머지 각도는 청색을 띠며 밝게 반사됩니다.'}] },
  'WT 323': { role: '스페셜 블랙', type: 'solid', face: '#020617', flop: '#000000', desc: '표준 흑색 조색제.', details: [{label:'특징',text:'표준 흑색 조색제입니다.'},{label:'이펙트적용',text:'알루미늄 입자와 혼합 시 명암은 어두워지면서 약하게 적황색 기운이 늘어납니다.'}] },
  'WT 324': { role: '레디쉬 옐로우', type: 'solid', face: '#f59e0b', flop: '#9a3412', desc: '적색을 띠는 맑고 채도 높은 황색 조색제.', details: [{label:'특징',text:'적색을 띠는 맑고 채도 높은 황색 조색제입니다.'},{label:'단점',text:'바탕 은폐력은 떨어집니다.'}] },
  'WT 326': { role: '그리니쉬 옐로우', type: 'solid', face: '#eab308', flop: '#65a30d', desc: '이펙트 컬러에 사용하는 녹색을 띤 맑은 황색 조색제.', details: [{label:'특징',text:'이펙트 컬러에 사용하는 녹색을 띤 맑은 황색 조색제입니다.'},{label:'이펙트적용',text:'15도는 맑은 황색, 나머지 각도는 녹황색을 띱니다.'}] },
  'WT 327': { role: '옐로우', type: 'solid', face: '#fde047', flop: '#ca8a04', desc: '약하게 녹색을 띠는 밝은 황색 조색제.', details: [{label:'특징',text:'약하게 녹색을 띠는 밝은 황색 조색제입니다.'},{label:'이펙트적용',text:'측면에 밝은 황색이 필요할 경우에만 소량 첨가합니다.'}] },
  'WT 328': { role: '오커', type: 'solid', face: '#b45309', flop: '#451a03', desc: '탁한 황토색 조색제.', details: [{label:'특징',text:'탁한 황토색 조색제입니다.'},{label:'용도',text:'은폐력이 요구되거나 채도가 낮아야 하는 솔리드 컬러에 주로 사용됩니다.'}] },
  'WT 329': { role: '트랜스페어런트 옐로우', type: 'solid', face: '#f59e0b', flop: '#ea580c', desc: '적색을 조금 띠는 아주 선명하고 맑은 투명 황색 조색제.', details: [{label:'특징',text:'적색을 조금 띠는 아주 선명하고 맑은 투명 황색 조색제입니다.'},{label:'단점',text:'투명도가 높아 은폐력은 크게 떨어집니다.'}] },
  'WT 330': { role: '블러드 오렌지', type: 'solid', face: '#ea580c', flop: '#9a3412', desc: '밝은 주황색 조색제.', details: [{label:'특징',text:'밝은 주황색 조색제입니다.'},{label:'이펙트적용',text:'측면에 밝은 황적색 기운이 부족할 경우 소량 첨가합니다.'}] },
  'WT 331': { role: '트랜스루센트 옥사이드', type: 'solid', face: '#d97706', flop: '#451a03', desc: '이펙트 컬러 내부에서 맑은 적황색을 발현하는 반투명 조색제.', details: [{label:'특징',text:'이펙트 컬러 내부에서 맑은 적황색을 발현하는 반투명 조색제입니다.'},{label:'사용금지',text:'안료 특성상 솔리드 컬러에는 사용을 엄격히 금합니다.'}] },
  'WT 332': { role: '마룬', type: 'solid', face: '#b91c1c', flop: '#7c2d12', desc: '탁하고 어두운 적색 조색제.', details: [{label:'특징',text:'탁하고 어두운 적색 조색제입니다.'},{label:'용도',text:'전체적인 톤을 황적색으로 잡아주고 명암을 조금 더 어둡게 누릅니다.'}] },
  'WT 333': { role: '그라나다 레드', type: 'solid', face: '#991b1b', flop: '#450a0a', desc: '맑고 밝은 기본 적색 조색제.', details: [{label:'특징',text:'맑고 밝은 기본 적색 조색제입니다.'},{label:'이펙트적용',text:'측면에 적색 기운이 부족할 경우 소량 첨가하여 보완합니다.'}] },
  'WT 334': { role: '옥사이드 레드', type: 'solid', face: '#7f1d1d', flop: '#450a0a', desc: '탁한 산화철 적색 조색제.', details: [{label:'특징',text:'탁한 산화철 적색 조색제입니다. 조색제 단독 은폐력이 매우 뛰어납니다.'},{label:'이펙트적용',text:'측면에 무거운 황적색 톤을 띠게 하기 위해 소량만 사용합니다.'}] },
  'WT 335': { role: '다크 옐로우', type: 'solid', face: '#d97706', flop: '#78350f', desc: '적색을 조금 띠는 차분하고 밝은 톤의 황색 조색제.', details: [{label:'특징',text:'적색을 조금 띠는 차분하고 밝은 톤의 황색 조색제입니다.'},{label:'이펙트적용',text:'측면에 밝은 녹황색 기운이 부족할 경우 한하여 소량 사용합니다.'}] },
  'WT 336': { role: '트랜스루센트 레드', type: 'solid', face: '#7c2d12', flop: '#450a0a', desc: '선명하면서도 어두운 갈색 빛이 도는 반투명 조색제.', details: [{label:'특징',text:'선명하면서도 어두운 갈색 빛이 도는 반투명 조색제입니다.'},{label:'용도제한',text:'반사광을 투과시키기 위해 이펙트 컬러에만 한정하여 사용합니다.'}] },
  'WT 337': { role: '레드', type: 'solid', face: '#ef4444', flop: '#991b1b', desc: '약하게 청색 기운이 도는 중간 정도 톤의 표준 적색 조색제.', details: [{label:'특징',text:'약하게 청색 기운이 도는 중간 정도 톤의 표준 적색 조색제입니다.'},{label:'용도',text:'솔리드 적색 컬러 배합 시 가장 기본으로 사용됩니다.'}] },
  'WT 338': { role: '블루이쉬 마젠타 레드', type: 'solid', face: '#d946ef', flop: '#86198f', desc: '표준 자주색(Magenta) 조색제.', details: [{label:'특징',text:'푸른빛이 많이 도는 표준 자주색(Magenta) 조색제입니다.'},{label:'이펙트적용',text:'백색 안료나 알루미늄에 혼합할 경우 매우 맑은 분홍색(Pink)을 나타냅니다.'}] },
  'WT 339': { role: '바이올렛', type: 'solid', face: '#8b5cf6', flop: '#4c1d95', desc: '맑은 보라색 조색제.', details: [{label:'특징',text:'맑은 보라색 조색제입니다.'},{label:'용도',text:'청색 및 회색 컬러 조색 시 은은한 보라빛을 내고 명암을 차분하게 눌러줍니다.'}] },
  'WT 340': { role: '옐로우 마젠타 레드', type: 'solid', face: '#e879f9', flop: '#a21caf', desc: '황색 기운이 도는 맑은 자주색 조색제.', details: [{label:'특징',text:'황색 기운이 도는 맑은 자주색 조색제입니다.'},{label:'비교',text:'WT338 안료에 비해 전체적으로 톤이 밝고 청색감이 적습니다.'}] },
  'WT 341': { role: '아주르 블루', type: 'solid', face: '#2563eb', flop: '#1e3a8a', desc: '채도가 가장 높은 아주 선명한 청색 조색제.', details: [{label:'특징',text:'채도가 가장 높은 아주 선명한 청색 조색제입니다.'},{label:'색상변화',text:'솔리드 안료임에도 관찰 각도 별로 컬러 변화(플롭)가 가장 큽니다.'}] },
  'WT 342': { role: '다크 바이올렛', type: 'solid', face: '#6d28d9', flop: '#2e1065', desc: '맑고 어두운 보라색 조색제.', details: [{label:'특징',text:'맑고 어두운 보라색 조색제입니다.'},{label:'비교',text:'WT339 안료에 비해 청색이 적게 배합되어 있습니다.'}] },
  'WT 343': { role: '블루', type: 'solid', face: '#3b82f6', flop: '#1e40af', desc: '특정한 색 치우침이 없는 표준 청색 조색제.', details: [{label:'특징',text:'특정한 색 치우침이 없는 표준 청색 조색제입니다.'},{label:'용도',text:'솔리드와 이펙트 배합 모두에 가장 범용적으로 쓰이는 중간톤 파란색입니다.'}] },
  'WT 344': { role: '다크 블루', type: 'solid', face: '#1d4ed8', flop: '#0f172a', desc: '명도가 가장 어두운 딥 블루 조색제.', details: [{label:'특징',text:'청색 조색제 라인업 중 명도가 가장 어두운 딥 블루입니다.'},{label:'색상변화',text:'이펙트 적용 시 15도는 어두운 청색, 측면에서는 붉은 적색 기운이 올라옵니다.'}] },
  'WT 345': { role: '트랜스페어런트 에메랄드', type: 'solid', face: '#10b981', flop: '#064e3b', desc: '맑고 선명한 황색 기운을 띠는 투명 녹색 조색제.', details: [{label:'특징',text:'맑고 선명한 황색 기운을 띠는 투명 녹색 조색제입니다.'},{label:'비교',text:'WT347에 비해 톤이 훨씬 밝고 황색 비율이 높아 화사한 에메랄드 빛을 냅니다.'}] },
  'WT 346': { role: '트랜스페어런트 딥 블루', type: 'solid', face: '#0369a1', flop: '#020617', desc: '녹색 기운을 많이 띠는 투명 청색 조색제.', details: [{label:'특징',text:'녹색 기운을 많이 띠는 투명 청색 조색제입니다.'},{label:'용도',text:'이펙트 컬러 조색 시 가장 기본적으로 많이 사용하는 청색입니다.'}] },
  'WT 347': { role: '트랜스페어런트 그린', type: 'solid', face: '#15803d', flop: '#022c22', desc: '청색 기운을 조금 띠는 맑은 투명 녹색 조색제.', details: [{label:'특징',text:'청색 기운을 조금 띠는 맑은 투명 녹색 조색제입니다.'},{label:'비교',text:'WT345 안료에 비해서 청색 비율이 높고 명암이 더 차갑고 어둡습니다.'}] },
  'WT 348': { role: '트랜스페어런트 아주르 블루', type: 'solid', face: '#0ea5e9', flop: '#0369a1', desc: '채도가 높은 맑은 하늘색(Azure) 투명 조색제.', details: [{label:'특징',text:'채도가 높은 맑은 하늘색(Azure) 투명 조색제입니다.'},{label:'이펙트적용',text:'이펙트 혼합 시 15도는 녹청색, 측면에서는 약하게 적색 기운을 띱니다.'}] },
  'WT 349': { role: '트랜스루센트 그린', type: 'solid', face: '#86efac', flop: '#064e3b', desc: '정밀한 조색을 위한 녹색 저농도 조색제.', details: [{label:'특징',text:'정밀한 조색을 위한 녹색 저농도 조색제입니다. WT347의 농도를 낮춘 버전입니다.'},{label:'배합비율',text:'WT349 : WT347 = 10.52 : 1 의 배합 비율을 가집니다.'}] },
  'WT 350': { role: '트랜스루센트 블랙', type: 'solid', face: '#525252', flop: '#451a03', desc: '정밀한 조색을 위한 흑색 저농도 조색제.', details: [{label:'특징',text:'정밀한 조색을 위한 흑색 저농도 조색제입니다. WT323의 농도를 낮춘 버전입니다.'},{label:'배합비율',text:'WT350 : WT323 = 2.89 : 1 의 배합 비율을 가집니다.'}] },
  'WT 351': { role: '트랜스루센트 아주르 블루', type: 'solid', face: '#38bdf8', flop: '#075985', desc: 'WT348 안료의 저농도 버전입니다.', details: [{label:'특징',text:'WT348 안료의 저농도 버전입니다.'},{label:'배합비율',text:'WT351 : WT348 = 8.7 : 1 의 배합 비율을 가집니다.'}] },
  'WT 352': { role: '트랜스루센트 화이트', type: 'solid', face: '#f8fafc', flop: '#cbd5e1', desc: 'WT321 안료의 저농도 버전입니다.', details: [{label:'특징',text:'WT321 안료의 저농도 버전입니다.'},{label:'배합비율',text:'WT352 : WT321 = 7.69 : 1 의 배합 비율을 가집니다.'}] },
  'WT 353': { role: '트랜스루센트 마젠타 레드', type: 'solid', face: '#c026d3', flop: '#4a044e', desc: 'WT338 안료의 저농도 버전입니다.', details: [{label:'특징',text:'WT338 안료의 저농도 버전입니다.'},{label:'배합비율',text:'WT353 : WT338 = 5.68 : 1 의 배합 비율을 가집니다.'}] },
  'WT 354': { role: '화인 실버', type: 'silver_fine', face: '#cbd5e1', flop: '#64748b', desc: '매우 작은 크기의 일반형 알루미늄 조색제.', details: [{label:'특징',text:'매우 작은 크기의 일반형 알루미늄 조색제입니다. WT356 보다 작습니다.'}] },
  'WT 355': { role: '브릴리언트 실버 코올스', type: 'silver_coarse', face: '#f8fafc', flop: '#334155', desc: '가장 큰 광휘형 알루미늄 조색제. 은폐력은 떨어짐.', details: [{label:'특징',text:'가장 큰 광휘형 알루미늄 조색제입니다.'},{label:'단점',text:'입자가 커서 은폐력은 떨어집니다.'}] },
  'WT 356': { role: '미디움 실버', type: 'silver_fine', face: '#e2e8f0', flop: '#475569', desc: '중간 크기의 일반형 알루미늄 조색제.', details: [{label:'특징',text:'중간 크기의 일반형 알루미늄 조색제입니다.'}] },
  'WT 357': { role: '마이크로 실버', type: 'silver_fine', face: '#f8fafc', flop: '#64748b', desc: '입자가 가장 작은 일반형 알루미늄 조색제.', details: [{label:'특징',text:'입자가 가장 작은 일반형 알루미늄 조색제입니다. 실버 중 은폐력이 가장 우수합니다.'},{label:'색상비교',text:'WT356보다 15도는 어둡고, 나머지 각도는 밝습니다.'}] },
  'WT 358': { role: '스페셜 실버', type: 'silver_fine', face: '#e2e8f0', flop: '#475569', desc: '이펙트 컬러용으로 배합되는 특수 실버 조색제.', details: [{label:'특징',text:'이펙트 컬러용으로 배합되는 특수 실버 조색제입니다.'}] },
  'WT 359': { role: '브라이트 실버', type: 'silver_coarse', face: '#f1f5f9', flop: '#334155', desc: 'WT356보다 큰 일반형 알루미늄 조색제.', details: [{label:'특징',text:'WT356보다 큰 일반형 알루미늄 조색제입니다.'},{label:'색상비교',text:'WT356 보다 15도는 밝고, 나머지 각도는 어두움.'}] },
  'WT 360': { role: '코올스 실버', type: 'silver_coarse', face: '#94a3b8', flop: '#1e293b', desc: 'WT359보다 큰 거친 알루미늄 조색제.', details: [{label:'특징',text:'WT359보다 큰 거친 알루미늄 조색제입니다.'},{label:'색상비교',text:'WT359보다 15도는 밝고 나머지 각도는 어두움.'}] },
  'WT 361': { role: '브릴리언트 실버', type: 'silver_coarse', face: '#f1f5f9', flop: '#64748b', desc: 'WT362보다 큰 광휘형 알루미늄 조색제.', details: [{label:'특징',text:'WT362보다 큰 광휘형 알루미늄 조색제입니다.'},{label:'색상비교',text:'WT362보다 15도는 밝고 나머지 각도는 어두움.'}] },
  'WT 362': { role: '브릴리언트 실버 화인', type: 'silver_fine', face: '#e2e8f0', flop: '#334155', desc: '작은 크기의 광휘형 알루미늄 조색제.', details: [{label:'특징',text:'작은 크기의 광휘형 알루미늄 조색제입니다. WT361에 비해 크기가 작습니다.'}] },
  'WT 363': { role: '브릴리언트 골드', type: 'pearl', face: '#fbbf24', flop: '#b45309', desc: '맑고 선명한 황색 알루미늄 조색제.', details: [{label:'특징',text:'맑고 선명한 황색 알루미늄 조색제입니다.'},{label:'용도',text:'은폐력이 우수하여 금빛(Gold) 메탈릭 컬러를 구현할 때 필수적으로 사용됩니다.'}] },
  'WT 364': { role: '화이트 펄', type: 'pearl', face: '#ffffff', flop: '#94a3b8', desc: '입자 크기가 매우 큰 백색 펄 조색제.', details: [{label:'특징',text:'입자 크기가 매우 큰 백색 펄 조색제입니다.'},{label:'외관',text:'육안으로 개별 펄 입자의 스파클링 반짝임이 가장 강렬하게 돋보입니다.'}] },
  'WT 365': { role: '라일락 펄', type: 'pearl', face: '#a3e635', flop: '#be185d', desc: '중간 크기의 자주색 간섭 펄 조색제.', details: [{label:'특징',text:'중간 크기의 자주색 간섭 펄 조색제입니다.'},{label:'색상변화',text:'15도는 푸른빛의 청적색, 측면은 노란빛의 황녹색으로 변합니다.'}] },
  'WT 366': { role: '골드 펄', type: 'pearl', face: '#facc15', flop: '#4c1d95', desc: '중간 크기의 황색 간섭 펄 조색제.', details: [{label:'특징',text:'중간 크기의 황색 간섭 펄 조색제입니다.'},{label:'색상변화',text:'15도는 황색, 측면은 청색으로 교차 변화하는 입체감을 줍니다.'}] },
  'WT 367': { role: '화인 그린 펄', type: 'pearl', face: '#4ade80', flop: '#991b1b', desc: '작은 크기의 섬세한 녹색 간섭 펄 조색제.', details: [{label:'특징',text:'작은 크기의 섬세한 녹색 간섭 펄 조색제입니다.'},{label:'색상변화',text:'15도는 녹색, 측면은 적색으로 색상이 부드럽게 반전됩니다.'}] },
  'WT 368': { role: '화인 화이트 펄', type: 'pearl', face: '#f8fafc', flop: '#64748b', desc: '중간 크기의 백색 펄 조색제.', details: [{label:'특징',text:'중간 크기의 백색 펄 조색제입니다.'}] },
  'WT 369': { role: '레드 펄', type: 'pearl', face: '#ef4444', flop: '#7f1d1d', desc: '작은 크기의 적색 착색 펄 조색제.', details: [{label:'특징',text:'작은 크기의 적색 착색 펄 조색제입니다.'},{label:'외관',text:'관찰 각도에 따라 색상 변화가 거의 없이 일관된 빛을 냅니다.'},{label:'용도',text:'은폐력이 좋아 적색 입자감이 뚜렷해야 하는 컬러에 주로 적용됩니다.'}] },
  'WT 370': { role: '브라이트 블루 펄', type: 'pearl', face: '#0ea5e9', flop: '#be123c', desc: '큰 크기를 가진 화려하고 맑은 청색 간섭 펄 조색제.', details: [{label:'특징',text:'큰 크기를 가진 화려하고 맑은 청색 간섭 펄 조색제입니다.'},{label:'색상변화',text:'15도는 녹청색, 측면은 따뜻한 적황색으로 시각적 변화 폭이 매우 큽니다.'}] },
  'WT 371': { role: '브라운 펄', type: 'pearl', face: '#d97706', flop: '#451a03', desc: '중간 크기의 주황색 착색 펄 조색제.', details: [{label:'특징',text:'중간 크기의 주황색 착색 펄 조색제입니다.'},{label:'외관',text:'각도 별로 색상 변화가 거의 없으며 안정적이고 차분한 갈색 펄감을 줍니다.'}] },
  'WT 372': { role: '화인 블루 펄', type: 'pearl', face: '#3b82f6', flop: '#c026d3', desc: '적색 기운이 도는 청색 간섭 펄 조색제.', details: [{label:'특징',text:'적색 기운이 도는 청색 간섭 펄 조색제입니다.'},{label:'비교',text:'WT370 안료보다 입자 크기가 작습니다.'},{label:'색상변화',text:'15도는 적청색, 측면은 녹황색으로 부드럽게 변합니다.'}] },
  'WT 373': { role: '루비 펄', type: 'pearl', face: '#dc2626', flop: '#7f1d1d', desc: '중간 크기의 은폐력이 있는 적색 착색 펄 조색제.', details: [{label:'특징',text:'중간 크기의 은폐력이 있는 적색 착색 펄 조색제입니다.'},{label:'외관',text:'펄 입자 자체에 어느 정도 은폐력이 있으며, 안정적인 착색 펄입니다.'}] },
  'WT 374': { role: '블루 그린 펄', type: 'pearl', face: '#0d9488', flop: '#c2410c', desc: '중간 크기의 오묘한 청녹색 간섭 펄 조색제.', details: [{label:'특징',text:'중간 크기의 오묘한 청녹색 간섭 펄 조색제입니다.'},{label:'색상변화',text:'15도는 맑은 청녹색, 측면은 따뜻한 황적색으로 교차 변화합니다.'}] },
  'WT 375': { role: '그린 펄', type: 'pearl', face: '#16a34a', flop: '#b91c1c', desc: '중간 크기의 기본 녹색 간섭 펄 조색제.', details: [{label:'특징',text:'중간 크기의 기본 녹색 간섭 펄 조색제입니다.'},{label:'색상변화',text:'15도는 맑은 녹색, 측면은 적색으로 반전되며 도장면에 신비로운 입체감을 줍니다.'}] },
  'WT 376': { role: '레드펄 엑스트라', type: 'pearl', face: '#ef4444', flop: '#16a34a', desc: '중간 크기의 적색 간섭 펄 조색제.', details: [{label:'특징',text:'중간 크기의 적색 간섭 펄 조색제입니다.'},{label:'색상변화',text:'선명한 적색 베이스로 15도는 적색, 측면은 보색인 녹색이 은은하게 드러납니다.'}] },
  'WT 377': { role: '다이아몬드 화이트', type: 'xirallic', face: '#ffffff', flop: '#64748b', desc: '질라릭 코팅 기반의 프리미엄 백색 펄 조색제.', details: [{label:'특징',text:'질라릭(Xirallic) 코팅 기반의 프리미엄 백색 펄 조색제입니다.'},{label:'외관',text:'입자의 반짝임이 다이아몬드처럼 매우 뛰어납니다.'},{label:'색상변화',text:'15도는 약하게 녹색을 띠고, 나머지 각도는 약하게 적색을 띱니다.'}] },
  'WT 378': { role: '다이아몬드 레드', type: 'xirallic', face: '#ef4444', flop: '#7f1d1d', desc: '질라릭 기반의 프리미엄 적색 펄 조색제.', details: [{label:'특징',text:'질라릭(Xirallic) 기반의 프리미엄 적색 펄 조색제입니다.'},{label:'외관',text:'입자 반짝임이 우수하며 색상 변화가 거의 없는 초고광택 착색 펄입니다.'}] },
  'WT 379': { role: '다이아몬드 카퍼', type: 'xirallic', face: '#ea580c', flop: '#7c2d12', desc: '질라릭 기반의 프리미엄 주황색(구리) 펄 조색제.', details: [{label:'특징',text:'질라릭(Xirallic) 기반의 프리미엄 주황색(Copper/구리) 펄 조색제입니다.'},{label:'외관',text:'차분하고 화려한 착색 펄입니다.'}] },
  'WT 380': { role: '다이아몬드 그린', type: 'xirallic', face: '#4ade80', flop: '#166534', desc: '질라릭 기반의 프리미엄 녹색 간섭 펄 조색제.', details: [{label:'특징',text:'질라릭(Xirallic) 기반의 프리미엄 녹색 간섭 펄 조색제입니다.'},{label:'외관/변화',text:'반짝임이 매우 뛰어나며, 15도는 그린, 측면은 붉은 적색으로 강렬하게 변합니다.'}] },
  'WT 381': { role: '다이아몬드 블루', type: 'xirallic', face: '#3b82f6', flop: '#1e3a8a', desc: '질라릭 기반의 프리미엄 청색 간섭 펄 조색제.', details: [{label:'특징',text:'질라릭(Xirallic) 기반의 프리미엄 청색 간섭 펄 조색제입니다.'},{label:'외관/변화',text:'반짝임이 눈부시며, 15도는 맑은 청색, 측면은 노란빛 황색으로 변합니다.'}] },
  'WT 382': { role: '다이아몬드 골드', type: 'xirallic', face: '#facc15', flop: '#a16207', desc: '질라릭 기반의 프리미엄 황색 간섭 펄 조색제.', details: [{label:'특징',text:'질라릭(Xirallic) 기반의 프리미엄 황색 간섭 펄 조색제입니다.'},{label:'외관/변화',text:'15도는 영롱한 황금색, 측면은 푸른 청색으로 화려하게 변합니다.'}] },
  'WT 383': { role: '브릴리언트 오렌지', type: 'silver_coarse', face: '#f97316', flop: '#9a3412', desc: '강렬한 주황빛의 알루미늄 조색제.', details: [{label:'특징',text:'강렬한 주황빛의 알루미늄 조색제입니다.'},{label:'비교/용도',text:'WT363 베이스에 비해 적색감(적황색)이 훨씬 많이 배합되었습니다.'}] },
  'WT 385': { role: '시스템 컴포넌트 A', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '투명한 백색을 내는 수지.', details: [{label:'특징',text:'투명한 백색을 내는 수지입니다. 도료 시스템의 뼈대를 구성합니다.'},{label:'상세',text:'점도 조절 첨가제인 WT387에 비해 기본 점도가 더 높은 것이 특징입니다.'}] },
  'WT 386': { role: '플롭 컨트롤', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '특수 명암 조정제.', details: [{label:'특징',text:'특수 명암 조정제입니다.'},{label:'용도/효과',text:'측면을 밝게 끌어올리기 위한 목적이며, 이펙트 입자 배열을 제어합니다.'}] },
  'WT 387': { role: '시스템 컴포넌트 B', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '점도 조절 첨가제.', details: [{label:'특징',text:'수용성 베이스코트 도료 전체의 시스템 점도 조절제입니다.'}] },
  'WT 388': { role: '슈퍼 딥 블랙', type: 'solid', face: '#050505', flop: '#000000', desc: '아주 어두운 흑색 조색제.', details: [{label:'특징',text:'아주 어두운 흑색 조색제입니다.'},{label:'비교',text:'표준 블랙인 WT323 안료보다도 훨씬 더 어둡고 진합니다.'},{label:'제한용도',text:'아주 어두운 극한의 흑색 계열 컬러 조색 시에만 제한적으로 사용합니다.'}] },
  'WT 389': { role: '플래틴 실버 화인', type: 'silver_fine', face: '#cbd5e1', flop: '#64748b', desc: '입자 크기가 작은 고휘도 광휘형 알루미늄 조색제.', details: [{label:'특징',text:'입자 크기가 작은 고휘도 광휘형 알루미늄 조색제입니다.'},{label:'상세/비교',text:'입자가 WT303 보다는 크고 WT390 보다는 작게 설계되었습니다.'}] },
  'WT 390': { role: '플래틴 실버', type: 'silver_coarse', face: '#f8fafc', flop: '#334155', desc: '중간 크기 입자의 고휘도 광휘형 알루미늄 조색제.', details: [{label:'특징',text:'중간 크기 입자의 고휘도 광휘형 알루미늄 조색제입니다.'},{label:'비교',text:'WT389 안료보다 입자가 더 큽니다.'},{label:'색상플롭',text:'15도가 가장 밝고 측면이 극단적으로 어두워져 명암 대비(플롭)가 강합니다.'}] },
  'WT 392': { role: '매직 이펙트', type: 'pearl', face: '#22c55e', flop: '#ef4444', desc: '관찰 각도에 따라 색상 변화가 매우 큰 특수 펄 조색제.', details: [{label:'특징',text:'관찰 각도에 따라 색상 변화가 매우 큰 특수 펄 조색제입니다.'},{label:'비교',text:'WT312(매직 파이어) 안료와 색상이 완전히 정반대로 변색되는 고유한 특징.'},{label:'색상변화',text:'15도는 녹색, 45도는 적색, 110도는 약하게 적색으로 변하는 마법 같은 펄입니다.'}] },
  'WT 393': { role: '라이트 옐로우', type: 'solid', face: '#fef08a', flop: '#a16207', desc: '약하게 녹색을 띠는 밝은 황색 조색제.', details: [{label:'특징',text:'녹색을 아주 약하게 띠는 밝은 황색 조색제입니다.'},{label:'비교',text:'기본 황색인 WT327 안료에 비해서 녹색 기운이 적게 돕니다.'},{label:'용도',text:'이펙트에서는 측면에 밝은 황색이 미세하게 필요할 경우에만 소량 첨가합니다.'}] },
  'WT 1051': { role: '블랜딩 1051', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '블랜드인 첨가제 및 블랜딩용 특수 첨가제.', details: [{label:'특징',text:'부분 보수 도장 작업 시 필수적인 전용 블랜딩(숨김) 첨가제입니다.'}] },
  'WT 1500': { role: '울트라 딥 블랙', type: 'solid', face: '#000000', flop: '#000000', desc: '가장 극도로 어두운 흑색 조색제.', details: [{label:'특징',text:'Hi-TEC 시스템 내에서 가장 극도로 어두운 흑색 조색제입니다. 특수 염료 함유.'},{label:'절대주의',text:'알루미늄/펄에 과도하게(2% 이상) 사용 시 색상이 변질되거나 내구성에 문제가 생깁니다.'},{label:'허용배합비율',text:'반드시 솔리드: 최대 5%, 실버: 최대 2%, 펄: 최대 5% 이내의 비율을 지켜야 합니다.'}] },
  'WT 455': { role: '퍼포먼스 컴포넌트', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '솔리드 컬러에만 단독 사용하는 기능성 첨가제.', details: [{label:'특징/용도',text:'이펙트가 아닌 솔리드 컬러에만 단독 사용하는 기능성 첨가제입니다.'},{label:'혼합비율',text:'베이스코트 총 무게의 10% 비율로 혼합하여 분사합니다.'},{label:'효과',text:'겨울철이나 건조한 환경(낮은 습도)에서도 스프레이 작업성을 보장합니다.'}] },
  'WT 3080': { role: '스페셜 애디티브', type: 'binder', face: '#ffffff', flop: '#ffffff', desc: '도막 보정 및 흐름 방지 전용 첨가제.', details: [{label:'특징',text:'도막 보정 및 흐름 방지 전용 첨가제입니다.'}] }
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

// 보간용 수학 함수
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

// 💡 🚨[화면 뻗음(Black Screen) 방어 엔진 100% 롤백]🚨
// 이전 코드에서 안료 정보 부족 시 NaN이 발생하던 치명적 버그를 완벽하게 차단했습니다.
const safeNum = (val: any): number => { const num = Number(val); return isNaN(num) ? 0 : num; };

const getOptics = (tonersList: any[]) => {
  const colorToners = tonersList.filter(t => t.code && TONER_DB[t.code]);
  const sumW = colorToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);

  if (sumW === 0) return { face: { h: 0, s: 0, l: 90 }, mid: { h: 0, s: 0, l: 90 }, flop: { h: 0, s: 0, l: 90 }, isMetallic: false };

  let faceX=0, faceY=0, faceL=0, flopX=0, flopY=0, flopL=0;
  let totalWeight = 0; let hasMetallic = false;

  colorToners.forEach(t => {
     let w = safeNum(parseFloat(t.adjustedWeight)); 
     if (w <= 0) return;
     let db = TONER_DB[t.code];
     
     totalWeight += w;
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

const getColorString = (opticsObj: any, angle: 'face'|'mid'|'flop') => {
  if (!opticsObj || !opticsObj[angle]) return 'hsl(0,0%,90%)';
  return `hsl(${opticsObj[angle].h}, ${opticsObj[angle].s}%, ${opticsObj[angle].l}%)`;
};

// 💡 확장 뷰어 3D 배경 렌더링 (매개변수 2개 완벽 방어)
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

  // 💡 필수 Refs 선언
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
  const [originalFinalOptics, setOriginalFinalOptics] = useState<any>(null); // 💡 확장 뷰어 Before 렌더링용 상태

  // 💡 [6052 수지 계산 로직 변수]
  const [isBaseMetallic, setIsBaseMetallic] = useState(false);
  const [isPearlMetallic, setIsPearlMetallic] = useState(false);

  const tonersRef = useRef<any[]>([]);
  const pearlTonersRef = useRef<any[]>([]);
  const isThreeCoatModeRef = useRef<boolean>(true);

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
    const baseTotal = toners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    const pearlTotal = pearlToners.reduce((sum, t) => sum + safeNum(parseFloat(t.adjustedWeight)), 0);
    
    setTotalBaseWeight(baseTotal.toFixed(2));
    setTotalPearlWeight(pearlTotal.toFixed(2));
    setTotalFinalWeight((baseTotal + pearlTotal).toFixed(2));
    
    setBaseOptics(getOptics(toners));
    setPearlOptics(getOptics(pearlToners));
    
    const activeToners = isThreeCoatMode ? [...toners, ...pearlToners] : toners;
    setFinalOptics(getOptics(activeToners));

    // 메탈릭 여부 감지
    const checkMetallic = (list: any[]) => list.some(t => {
      const type = TONER_DB[t.code]?.type || '';
      return type !== 'solid' && type !== 'binder' && type !== '';
    });
    setIsBaseMetallic(checkMetallic(toners));
    setIsPearlMetallic(checkMetallic(pearlToners));
  }, [toners, pearlToners, isThreeCoatMode]);

  // 💡 [고속 타이핑 엔진] 오토 포커스 딜레이 최적화
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

  // 💡 [사진 스캔 자동 렌더링 엔진]
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
                setFocusTarget({ id: id, type: 'weight' }); // 🔥 포커스 점프 예약
            }
        }
        return { ...toner, code: finalCode };
      }
      return toner;
    }));
  };

  // 💡 [고속 타이핑] 그람수(g) 입력 완료 후 Enter 키 누르면 자동 새 줄 추가 및 코드 포커스 이동
  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string, isPearl = false) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          const newId = `new_${Date.now()}`;
          const newToner = { id: newId, code: '', adjustedWeight: "" };
          if (isPearl) { setPearlToners([...pearlToners, newToner]); } 
          else { setToners([...toners, newToner]); }
          setFocusTarget({ id: newId, type: 'code' }); // 🔥 새 코드 입력칸으로 점프
      }
  };

  const removeToner = (id: string, isPearl = false) => {
    if (isPearl) setPearlToners(pearlToners.filter(t => t.id !== id));
    else setToners(toners.filter(t => t.id !== id));
  };

  // 💡 [버튼으로 안료 추가 시 자동 포커스 100% 보장]
  const addToner = (isPearl = false) => {
    const newId = `new_${Date.now()}`;
    const newToner = { id: newId, code: '', adjustedWeight: "" };
    if (isPearl) { setPearlToners([...pearlToners, newToner]); } 
    else { setToners([...toners, newToner]); }
    setFocusTarget({ id: newId, type: 'code' }); // 🔥 자동 포커스
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

  // 💡 🚨[캡처형 카카오톡 전송 엔진 탑재]🚨
  // 입력된 안료 코드, 명칭, 그람수 및 6052 수지 계산치 전체를 영수증 형태로 완벽히 빌드합니다.
  const shareToKakao = () => {
    let baseListText = toners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}g`).join('\n');
    let pearlListText = pearlToners.filter(t => t.code).map(t => `  - ${t.code} (${TONER_DB[t.code]?.role || '안료미지정'}): ${t.adjustedWeight || '0'}g`).join('\n');
    
    const text = `[PERMAHYD HI-TEC 배합 지시서]\n================================\n🎨 컬러코드: ${targetColorCode || '미지정'}\n================================\n\n[▼ 베이스 코트 (Ground)]\n${baseListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 베이스 합계: ${totalBaseWeight}g\n▶ 6052 수지 제원: ${(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n${isThreeCoatMode ? `[▼ 펄 코트 (Mid-coat)]\n${pearlListText || '  (입력 데이터 없음)'}\n--------------------------------\n▶ 펄 코트 합계: ${totalPearlWeight}g\n▶ 6052 수지 제원: ${(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g\n\n` : ''}================================\n✨ 최종 도막 혼합 총량: ${totalFinalWeight}g\n================================`;
    
    if (typeof navigator !== 'undefined' && navigator.share) {
        navigator.share({ title: 'HI-TEC 조색 데이터 인계', text: text }).catch(console.error);
    } else {
        alert("상세 배합 스펙이 클립보드에 복사되었습니다. 카카오톡에 바로 붙여넣기 하십시오.\n\n" + text);
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }
  };

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
          <h1 className="text-xl font-semibold hidden md:block"><span className="text-white tracking-wide">PERMAHYD HI-TEC</span><span className="text-blue-400 font-normal ml-2">Studio 22.0</span></h1>
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
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="text" value={targetColorCode} onChange={(e) => setTargetColorCode(e.target.value)} placeholder="컬러코드 입력 (예: UG4)" className="bg-white border border-slate-300 px-3 py-2.5 rounded-md text-sm font-bold focus:outline-none w-full sm:flex-1 uppercase shadow-inner" />
              <div className="flex w-full sm:w-auto gap-1.5">
                <button onClick={() => setIsBaseConfirmed(!isBaseConfirmed)} className={`flex-1 sm:flex-none px-4 py-2.5 rounded-md text-sm font-bold flex items-center justify-center shadow-md transition-colors ${isBaseConfirmed ? 'bg-slate-200 text-slate-500' : 'bg-slate-800 text-white'}`}>
                  {isBaseConfirmed ? <Lock size={14} className="mr-1"/> : <Unlock size={14} className="mr-1"/>}확정
                </button>
                <button onClick={shareToKakao} className="flex-1 sm:flex-none bg-[#FEE500] hover:bg-[#FADA0A] text-slate-900 px-4 py-2.5 rounded-md text-sm font-black flex items-center justify-center shadow-md transition-colors">
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
                  <span className="mr-1.5 text-[11px] font-bold text-purple-700">3Coat (펄) 모드</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isThreeCoatMode} onChange={() => setIsThreeCoatMode(!isThreeCoatMode)} />
                    <div className={`block w-8 h-5 rounded-full transition-colors ${isThreeCoatMode ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isThreeCoatMode ? 'transform translate-x-3' : ''}`}></div>
                  </div>
                </label>
              </div>

              {toners.map((toner) => {
                const info = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', role: '', desc: '', details: [] };
                const isEffect = info.type !== 'solid' && info.type !== 'binder';
                return (
                  // 💡 [UI 복구] 모바일 깨짐 방지 레이아웃 (sm:flex-row) 유지
                  <div key={toner.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-slate-50 hover:bg-blue-50/50 p-2.5 mb-1.5 rounded-xl border border-slate-200 shadow-sm gap-2 transition-colors">
                    
                    <div className="flex w-16 h-10 sm:h-12 rounded-lg shadow-sm border border-slate-300 overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => { if(TONER_DB[toner.code]) setSelectedTonerForView(toner.code); }}>
                       <div className="flex-1" style={getCachedTexture(info.type, info.face, info.face, isEffect)}></div>
                       <div className="flex-1 border-l border-slate-300" style={{ background: `linear-gradient(135deg, ${info.face} 0%, ${isEffect ? info.flop : 'rgba(0,0,0,0.2)'} 100%)` }}></div>
                    </div>
                    
                    <div className="flex flex-col flex-1 w-full">
                       <div className="flex items-center gap-2 mb-1">
                           {/* 💡 [모바일 최적화] 대형 숫자 키패드 팝업을 위해 inputMode="numeric" 적용 */}
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
                       
                       {/* 💡 [에디터 내 다중 라벨 스펙 완전 복구] */}
                       {info.details && info.details.length > 0 ? (
                           <div className="flex flex-col gap-1 mt-0.5">
                               {info.details.slice(0, 2).map((d: any, idx: number) => (
                                   <div key={idx} className="flex items-start gap-1.5">
                                       <span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-slate-500 border-slate-200 leading-none">{d.label}</span>
                                       <span className="text-[11px] text-slate-600 leading-tight break-keep whitespace-pre-wrap">{d.text}</span>
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
                           onKeyDown={e => handleWeightKeyDown(e, toner.id, false)} 
                           className="w-14 text-right text-base font-black text-blue-600 focus:outline-none clean-number-input" 
                           placeholder=""
                       />
                       <span className="text-xs font-bold text-slate-400 ml-1 mr-1">g</span>
                       {/* 💡 [iOS 대응] 엔터키 우회용 넥스트(추가) 버튼 */}
                       <button onClick={() => addToner(false)} className="ml-0.5 mr-1.5 bg-blue-100 text-blue-700 px-1.5 py-1 rounded text-[10px] font-black shadow-sm flex items-center">↵</button>
                       <button onClick={() => removeToner(toner.id, false)}><Trash2 size={16} className="text-slate-300 hover:text-red-500"/></button>
                    </div>
                  </div>
                )
              })}
              {/* 💡 자동 포커스를 위한 addToner 함수 연결 완료 */}
              <button onClick={() => addToner(false)} className="w-full py-2 border border-dashed rounded-lg text-slate-400 font-bold text-xs hover:border-blue-500 flex justify-center items-center gap-1 transition-colors"><Plus size={12}/>베이스 안료 추가</button>
            </div>

            {isThreeCoatMode && (
              <div className="pt-2 border-t border-purple-100 space-y-2 pb-8">
                <div className="text-xs font-black text-purple-700 mb-2 flex items-center">▼ 펄 코트 (Mid Coat)</div>
                {pearlToners.map((toner) => {
                  const info = TONER_DB[toner.code] || { type: 'solid', face: '#e2e8f0', flop: '#e2e8f0', role: '', desc: '', details: [] };
                  const isEffect = info.type !== 'solid' && info.type !== 'binder';
                  return (
                    <div key={toner.id} className="flex flex-col sm:flex-row items-start sm:items-center bg-purple-50/20 p-2.5 mb-1.5 rounded-xl border border-purple-100 shadow-sm gap-2 transition-colors">
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
                                         <span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-purple-500 border-purple-200 leading-none">{d.label}</span>
                                         <span className="text-[11px] text-slate-600 leading-tight break-keep whitespace-pre-wrap">{d.text}</span>
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
                             onKeyDown={e => handleWeightKeyDown(e, toner.id, true)} 
                             className="w-14 text-right text-base font-black text-purple-600 focus:outline-none clean-number-input" 
                             placeholder=""
                         />
                         <span className="text-xs font-bold text-slate-400 ml-1 mr-1">g</span>
                         <button onClick={() => addToner(true)} className="ml-0.5 mr-1.5 bg-purple-100 text-purple-700 px-1.5 py-1 rounded text-[10px] font-black shadow-sm flex items-center">↵</button>
                         <button onClick={() => removeToner(toner.id, true)}><Trash2 size={16} className="text-purple-300 hover:text-red-500"/></button>
                      </div>
                    </div>
                  )
                })}
                <button onClick={() => addToner(true)} className="w-full py-2 border border-dashed border-purple-200 rounded-lg text-purple-400 font-bold text-xs flex justify-center items-center gap-1 hover:border-purple-400 transition-colors"><Plus size={12}/>펄 조색제 추가</button>
              </div>
            )}
          </div>
          
          {/* 💡 [복원 완료] 6052 수지 자동 계산기 패널 (하단 고정형 레이아웃 분리) */}
          <div className="p-3 bg-slate-800 text-slate-100 flex flex-col sm:flex-row justify-between items-center shrink-0 rounded-b-xl lg:rounded-none z-10 border-t-2 border-slate-700 gap-2">
             <div className="flex gap-4 w-full sm:w-auto justify-around sm:justify-start">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider">A. 베이스 코트 합계</span>
                    <span className="text-lg font-black text-white">{totalBaseWeight}g</span>
                    <div className="text-blue-300 bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/50 text-[10px] flex items-center">
                       <Beaker size={10} className="mr-1"/> 6052: {(parseFloat(totalBaseWeight) * (isBaseMetallic ? 0.2 : 0.1)).toFixed(1)}g <span className="opacity-70 ml-1">({isBaseMetallic ? '메탈 20%' : '솔리드 10%'})</span>
                    </div>
                 </div>
                 {isThreeCoatMode && (
                 <div className="flex flex-col gap-1 pl-4 border-l border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold tracking-wider">B. 펄 코트 합계</span>
                    <span className="text-lg font-black text-white">{totalPearlWeight}g</span>
                    <div className="text-purple-300 bg-purple-950/50 px-2 py-0.5 rounded border border-purple-800/50 text-[10px] flex items-center">
                       <Beaker size={10} className="mr-1"/> 6052: {(parseFloat(totalPearlWeight) * (isPearlMetallic ? 0.2 : 0.1)).toFixed(1)}g <span className="opacity-70 ml-1">({isPearlMetallic ? '메탈 20%' : '솔리드 10%'})</span>
                    </div>
                 </div>
                 )}
             </div>
             <div className="flex flex-col w-full sm:w-auto items-center sm:items-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700">
                 <div className="text-[10px] text-slate-400 font-bold tracking-wider mb-1">FINAL FORMULA</div>
                 <div className="text-2xl font-black text-cyan-400">{totalFinalWeight} <span className="text-base text-cyan-400/50">g</span></div>
             </div>
          </div>
        </div>

        {/* Right Column: 시각화 뷰어 및 지능형 카탈로그 */}
        <div className="lg:col-span-5 flex flex-col h-auto lg:h-full space-y-3">
          
          {/* 💡 미니 확장 뷰어 접근 패널 */}
          <div className={`bg-white border ${isBaseConfirmed ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-slate-300'} rounded-xl p-3 shadow-xl flex-none`}>
            <h3 className="text-xs font-bold mb-2 flex justify-between items-center border-b pb-1.5">
              <span className="flex items-center"><Layers className="text-blue-600 mr-1.5" size={14} />멀티 렌더링 명암 분석</span>
              {/* 💡 [복원] 확장 뷰어 컬러 변화 시뮬레이션 복구를 위한 setOriginalFinalOptics 데이터 매핑 */}
              <button onClick={() => { setOriginalFinalOptics(finalOptics); setIsConfiguratorOpen(true); setLightPos({x:50,y:50}); }} className="text-[11px] px-2.5 py-1.5 bg-slate-800 text-white rounded font-bold flex items-center hover:bg-slate-700 shadow-md"><Maximize size={10} className="mr-1.5"/>대화면 확장 뷰어 열기</button>
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

          {/* 💡 [수성 안료 카탈로그 원안 100% 복구] */}
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
                {catalogData.map((item) => {
                    const isMetallic = item.type !== 'solid' && item.type !== 'binder';
                    return (
                        <div key={item.code} className="flex flex-col sm:flex-row bg-white rounded-lg shadow-xs border border-slate-200 overflow-hidden">
                            {/* 💡 카탈로그 내 컬러칩 클릭 시 확대 기능(모달창 연결) 완벽 복원 */}
                            <div className="w-full sm:w-28 h-16 sm:h-auto flex-shrink-0 relative border-b sm:border-b-0 sm:border-r border-slate-200 cursor-pointer hover:brightness-110 transition-all" onClick={() => setSelectedTonerForView(item.code)} style={getCachedTexture(item.type, item.face, item.flop, isMetallic)}>
                                <div className="absolute bottom-1 left-1 bg-black/70 backdrop-blur-xs text-white text-[10px] font-black px-1.5 py-0.5 rounded">{item.code}</div>
                            </div>
                            <div className="p-2 flex-1 flex flex-col justify-center">
                                <div className="font-black text-slate-800 text-xs mb-1">{item.role}</div>
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

      {/* 💡 [복원] Before/After 확장 뷰어 모달 (색상 시뮬레이션 복구 완료) */}
      {isConfiguratorOpen && (
        <div className="fixed inset-0 bg-slate-950/95 z-[100] flex flex-col text-white font-sans backdrop-blur-xl select-none">
          <header className="p-4 flex justify-between items-center bg-black/50 border-b border-slate-800 shrink-0">
            <h2 className="text-base font-bold tracking-widest text-slate-300 uppercase flex items-center"><Camera className="mr-2 text-blue-500" size={16}/> 실시간 시뮬레이션 (Before & After)</h2>
            <button onClick={() => setIsConfiguratorOpen(false)} className="p-1.5 bg-slate-800 hover:bg-red-500 rounded-full border border-slate-700"><X size={20}/></button>
          </header>
          
          <div className="w-full bg-slate-900 border-b border-slate-700 p-2 overflow-x-auto flex gap-3 items-center shrink-0 shadow-xl custom-scrollbar">
             <div className="text-[11px] font-black text-blue-400 bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-800/50 shrink-0 text-center leading-tight">배합<br/>실시간수정</div>
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
           <div className="bg-white rounded-2xl w-[600px] max-w-full shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-full">
              <div className="bg-slate-900 p-4 flex justify-between items-center shrink-0">
                 <h3 className="text-white font-bold text-sm flex items-center"><Droplet className="mr-1.5 text-blue-400" size={16}/> {selectedTonerForView} 단일 안료 정밀 분석 뷰어</h3>
                 <button onClick={() => setSelectedTonerForView(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="p-5 overflow-y-auto custom-scrollbar">
                 <div className="text-xl font-black text-blue-700 mb-1">{TONER_DB[selectedTonerForView].role}</div>
                 
                 <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4">
                    {TONER_DB[selectedTonerForView].details?.map((d: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-1.5">
                            <span className="shrink-0 inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded border bg-white text-slate-600 border-slate-300 leading-none">{d.label}</span>
                            <span className="text-xs text-slate-700 leading-relaxed break-keep" dangerouslySetInnerHTML={{__html: d.text}}></span>
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
