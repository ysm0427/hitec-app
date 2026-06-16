import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Sliders, Trash2, Plus, X, FolderOpen, Maximize, Camera, ScanLine, Beaker, Sun, Droplet } from 'lucide-react';

// 💡 1. 안료 DB (설명글 원문 그대로 유지)
const TONER_DB: Record<string, { role: string, desc: string }> = {
  'WT 144': { role: '그리니쉬 블루', desc: '녹색을 띠는 청색 조색제. WT346 대체 안료임.' },
  'WT 154': { role: '블루 이펙트', desc: '청색으로 착색된 광휘형 알루미늄 조색제. 입자의 반짝임이 좋음.' },
  'WT 197': { role: '실크 실버 울트라 파인', desc: '입자의 크기는 매우 작지만 반짝임이 좋은 특수 알루미늄 조색제.' },
  'WT 303': { role: '플래틴 실버 엑스트라 화인', desc: '매우 작은 고휘도 광휘형 알루미늄 조색제.' },
  'WT 355': { role: '브릴리언트 실버 코올스', desc: '가장 큰 입자의 광휘형 알루미늄 조색제.' },
  'WT 356': { role: '미디움 실버', desc: '중간 크기의 범용 일반형 알루미늄 조색제.' },
  'WT 387': { role: '시스템 컴포넌트 B', desc: 'Viscosity Additive. 점도 조절제.' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: 'Transparent White. 도막의 투명도 조절.' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄 조색제. 입자의 반짝임이 매우 좋음.' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 간섭 펄 조색제.' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '투명한 황색 글라스 플레이크.' }
};

// 💡 2. 카탈로그 컴포넌트 (AI 터미널 위치에 배치)
const PigmentCatalog = () => (
    <div className="h-full overflow-y-auto custom-scrollbar p-4 bg-slate-50 border rounded-xl">
        <h2 className="text-lg font-black mb-4 flex items-center gap-2"><Beaker className="text-blue-600"/> 수성 안료 제원표</h2>
        <div className="space-y-4">
            {Object.entries(TONER_DB).map(([code, data]) => (
                <div key={code} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <div className="font-black text-blue-700 text-sm mb-1">{code} - {data.role}</div>
                    <div className="text-xs text-slate-600">{data.desc}</div>
                </div>
            ))}
        </div>
    </div>
);

export default function App() {
  const [toners, setToners] = useState<any[]>([{ id: Date.now(), code: '', adjustedWeight: '' }]);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  
  // 💡 포커스 제어용 Refs
  const codeRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const weightRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // 💡 [사진 스캔 강화] 
  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]; if (!file) return;
      setIsScanning(true);
      try {
        const result = await (window as any).Tesseract.recognize(file, 'eng', {
            // 💡 [개선] 삐뚤어진 글자 인식 개선을 위한 PSM 6 설정
            params: { tessedit_pageseg_mode: '6', tessedit_char_whitelist: '0123456789.WT ' }
        });
        const text = result.data.text;
        const nums = text.match(/\d*\.\d+|\d+/g);
        if (nums) {
            let next = [...toners];
            for(let i=0; i<nums.length; i++) {
                let code = nums[i];
                if (TONER_DB[`WT ${code}`]) {
                    let weight = nums[i+1] || "";
                    next.push({ id: Date.now() + i, code: `WT ${code}`, adjustedWeight: weight });
                }
            }
            setToners(next);
        }
      } catch (err) { alert("인식 실패. 밝은 곳에서 다시 촬영해 주세요."); }
      setIsScanning(false);
  };

  // 💡 [고속 타이핑] 코드 입력 후 3자리 완성 시 자동 그람수로 이동
  const handleCodeChange = (id: string, val: string) => {
    setToners(p => p.map(t => t.id === id ? {...t, code: val.toUpperCase()} : t));
    const num = val.match(/\d+/);
    if (num && num[0].length >= 3) {
        setTimeout(() => weightRefs.current[id]?.focus(), 50);
    }
  };

  // 💡 [고속 타이핑] 그람수 입력 후 Enter 시 새 행 추가 및 코드 입력으로 포커스
  const handleWeightKeyDown = (e: React.KeyboardEvent, id: string) => {
      if (e.key === 'Enter') {
          const newId = Date.now();
          setToners(prev => [...prev, { id: newId, code: '', adjustedWeight: '' }]);
          setTimeout(() => codeRefs.current[newId]?.focus(), 50);
      }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 font-sans text-slate-800">
      <div className="grid grid-cols-12 gap-6 h-[90vh]">
        
        {/* 좌측: 배합 시트 */}
        <div className="col-span-7 bg-white rounded-2xl shadow-lg border p-4 flex flex-col">
            <h2 className="text-lg font-black mb-4">공식 배합 시트</h2>
            <div className="flex-1 overflow-y-auto">
                {toners.map(t => (
                    <div key={t.id} className="flex items-center gap-2 p-2 border-b">
                        <input 
                            ref={(el) => { codeRefs.current[t.id] = el; }}
                            value={t.code} 
                            onChange={(e) => handleCodeChange(t.id, e.target.value)} 
                            className="w-24 font-black uppercase" placeholder="CODE"/>
                        <input 
                            ref={(el) => { weightRefs.current[t.id] = el; }}
                            value={t.adjustedWeight} 
                            onChange={(e) => setToners(p => p.map(x => x.id === t.id ? {...x, adjustedWeight: e.target.value} : x))}
                            onKeyDown={(e) => handleWeightKeyDown(e, t.id)}
                            className="flex-1 text-right font-black text-blue-600" placeholder="g"/>
                        <button onClick={() => setToners(p => p.filter(x => x.id !== t.id))}><Trash2 size={16}/></button>
                    </div>
                ))}
            </div>
            <button onClick={() => {
                const newId = Date.now();
                setToners([...toners, { id: newId, code: '', adjustedWeight: '' }]);
                setTimeout(() => codeRefs.current[newId]?.focus(), 50);
            }} className="w-full mt-4 p-3 border-2 border-dashed rounded-lg font-bold">+ 안료 추가</button>
        </div>

        {/* 우측: 카탈로그 (AI 터미널 대체) */}
        <div className="col-span-5 h-full">
            <PigmentCatalog />
        </div>
      </div>
    </div>
  );
}
