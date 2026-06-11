import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, Trash2, Plus, Maximize, Lock, Unlock, Zap, Layers, BrainCircuit, RefreshCw, Sun, Droplet, Camera, X, ChevronRight
} from 'lucide-react';

// 💡 공식 안료 DB (간략화 버전)
const TONER_DB = {
  'WT 387': { role: '시스템 컴포넌트 B', desc: 'Viscosity Additive' },
  'WT 321': { role: '화이트', desc: '표준 백색(고농) 조색제.' },
  'WT 350': { role: '트랜스루센트 블랙', desc: '저농 흑색 조색제.' },
  'WT 328': { role: '오커', desc: '솔리드 컬러용 탁한 황색.' },
  'WT 3080': { role: '스페셜 애디티브', desc: '도막 보정 및 흐름 방지.' },
  'WT 385': { role: '시스템 컴포넌트 A', desc: 'Transparent White.' },
  'WT 377': { role: '다이아몬드 화이트', desc: '질라릭 백색 펄.' },
  'WT 386': { role: '플롭 컨트롤', desc: '명암 조정제.' },
  'WT 381': { role: '다이아몬드 블루', desc: '질라릭 청색 펄.' },
  'WT 304': { role: '매직 스파클 이펙트', desc: '글라스 플레이크.' },
};

export default function App() {
  const [toners, setToners] = useState([
    { id: '1', code: 'WT 387', role: '시스템 컴포넌트 B', adjustedWeight: "148" },
    { id: '2', code: 'WT 321', role: '화이트', adjustedWeight: "88.5" }
  ]);
  const [pearlToners, setPearlToners] = useState([
    { id: '3', code: 'WT 377', role: '다이아몬드 화이트', adjustedWeight: "9" }
  ]);
  const [isThreeCoatMode, setIsThreeCoatMode] = useState(true);

  const totalBaseWeight = toners.reduce((sum, t) => sum + parseFloat(t.adjustedWeight || 0), 0);
  const totalPearlWeight = pearlToners.reduce((sum, t) => sum + parseFloat(t.adjustedWeight || 0), 0);
  const totalFinalWeight = (totalBaseWeight + totalPearlWeight).toFixed(2);

  return (
    <div className="app-container">
      <header className="header">
        <h1>HI-TECApp</h1>
      </header>

      <main className="main-content">
        {/* 왼쪽: 배합 에디터 */}
        <section className="editor-section">
          <h2>▼ 배합 에디터</h2>
          {toners.map(t => (
            <div key={t.id} className="row">
              <input value={t.code} readOnly />
              <span>{t.role}</span>
              <input value={t.adjustedWeight} readOnly />
              <span>g</span>
            </div>
          ))}
          <button>+ 베이스 추가</button>
        </section>

        {/* 오른쪽: 멀티 시각화 렌더링 */}
        <section className="visual-section">
          <h2>멀티 시각화 렌더링</h2>
          <div className="render-box">최종 렌더링 (Final Color)</div>
          <div className="total-weight">
            <span>TOTAL WEIGHT (BASE + PEARL)</span>
            <strong>{totalFinalWeight} g</strong>
          </div>
        </section>
      </main>

      <style>{`
        .app-container { min-height: 100vh; padding: 20px; font-family: sans-serif; }
        .header { margin-bottom: 20px; }
        .main-content { display: flex; gap: 40px; }
        .editor-section, .visual-section { flex: 1; border: 1px solid #ccc; padding: 20px; border-radius: 10px; }
        .row { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; }
        .row input { padding: 5px; border: 1px solid #ddd; }
        .render-box { height: 150px; background: #e0e7ff; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-weight: bold; }
        .total-weight { background: #1e293b; color: white; padding: 15px; border-radius: 8px; display: flex; justify-content: space-between; }
      `}</style>
    </div>
  );
}
