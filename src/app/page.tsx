'use client';

import { useState, useEffect, useRef } from 'react';
import ThemeToggle from "@/components/ThemeToggle";
import MathRenderer from "@/components/MathRenderer";

// Data Structure for the Archive
interface ArchiveItem {
  id: string;
  title: string;
  type: 'theorem' | 'definition';
  content: string;
  formula?: string;
  note?: string;
}

const ARCHIVE_DATA: ArchiveItem[] = [
  {
    id: "DEF_2.12_COUNTABLE",
    title: "CONJUNTO_CONTABLE",
    type: "definition",
    content: "Un conjunto A es contable (numerable) si existe una función biyectiva entre A y el conjunto de los números naturales N.",
    formula: "f: A \\to \\mathbb{N} \\quad \\text{(biyectiva)}",
  },
  {
    id: "DEF_2.18_LIMIT_POINT",
    title: "PUNTO_LÍMITE",
    type: "definition",
    content: "Un punto p es un punto límite de un conjunto E si cada vecindad de p contiene un punto q ≠ p tal que q ∈ E.",
    formula: "\\forall r > 0, (N_r(p) \\setminus \\{p\\}) \\cap E \\neq \\emptyset",
    note: "Intuición: El conjunto E 'se acumula' infinitamente cerca de p.",
  },
  {
    id: "DEF_2.18_CLOSED_SET",
    title: "CONJUNTO_CERRADO",
    type: "definition",
    content: "Un conjunto E es cerrado si contiene a todos sus puntos límite.",
    formula: "E' \\subseteq E",
  },
  {
    id: "THM_2.41_HEINE_BOREL",
    title: "COMPACIDAD_EN_R^K",
    type: "theorem",
    content: "Un conjunto K ⊂ R^k es compacto si y solo si es cerrado y acotado.",
    formula: "K \\subset \\mathbb{R}^k \\text{ es compacto } \\iff \\text{ cerrado y acotado}",
    note: "Nota: Herramienta práctica para verificar compacidad en la recta real.",
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const filteredData = ARCHIVE_DATA.filter(item => {
    const normalize = (str: string) => str.toLowerCase().replace(/_/g, ' ').trim();
    const query = normalize(searchTerm);
    
    return normalize(item.id).includes(query) ||
           normalize(item.title).includes(query) ||
           normalize(item.content).includes(query);
  });

  return (
    <main className="container">
      {/* Theme Toggle Anchor */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', marginBottom: '2rem' }}>
        <ThemeToggle />
      </div>

      {/* Terminal Hero */}
      <section style={{ marginBottom: '2.5rem', fontFamily: 'var(--font-mono)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
          <div className="terminal-prompt-line" style={{ fontSize: '1.1rem', lineHeight: '1.4', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--color4)' }}>→</span>
            <span style={{ color: 'var(--color4)', fontWeight: 'bold' }}>jowl@mathos</span>
            <span style={{ color: 'var(--foreground)', opacity: 0.8 }}>git:(<span style={{ color: 'var(--color1)' }}>master</span>)</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="terminal-command" style={{ color: 'var(--foreground)', fontWeight: 'bold', fontSize: '2.4rem', letterSpacing: '-1px', lineHeight: '1.1' }}>
              grep -r &quot;theorem&quot; .
            </span>
            <span className="terminal-block-cursor"></span>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section style={{ marginBottom: '2.5rem' }}>
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder="SEARCH_BY_ID_OR_KEYWORD..." 
          className="retro-input"
          style={{ marginBottom: '0' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      {/* Results Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className="retro-window">
              <div className="retro-header">
                {item.id} // {item.title}
              </div>
              <div className="retro-content">
                <div style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
                  <p>{item.content}</p>
                  
                  {item.formula && (
                    <div style={{ 
                      marginTop: '1.5rem', 
                      padding: '1.2rem', 
                      background: 'var(--color0)', 
                      color: 'var(--color15)',
                      overflowX: 'auto' 
                    }}>
                      <MathRenderer formula={item.formula} block />
                    </div>
                  )}

                  {item.note && (
                    <p style={{ marginTop: '1.2rem', fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8 }}>
                      {item.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--foreground)', opacity: 0.5 }}>
            NO_RESULTS_FOUND_FOR: &quot;{searchTerm}&quot;
          </div>
        )}
      </section>
    </main>
  );
}
