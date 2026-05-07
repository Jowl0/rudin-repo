'use client';

import { useState, useEffect, useRef } from 'react';
import ThemeToggle from "@/components/ThemeToggle";
import MathRenderer from "@/components/MathRenderer";

// Data Types
interface ArchiveItem {
  id: string;
  title: string;
  type: 'theorem' | 'definition';
  content: string;
  formula?: string;
  note?: string;
}

interface ExerciseItem {
  id: string;
  chapter: number;
  number: number;
  enunciado: string;
  solution: React.ReactNode;
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
  },
  {
    id: "DEF_2.31_BOUNDED_SET",
    title: "CONJUNTO_ACOTADO",
    type: "definition",
    content: "Un subconjunto E de un espacio métrico X es acotado si existen un número real M y un punto q ∈ X tales que d(p,q) < M para todo p ∈ E.",
    formula: "\\exists M \\in \\mathbb{R}, \\exists q \\in X : d(p,q) < M \\quad \\forall p \\in E",
  },
  {
    id: "THM_2.41_HEINE_BOREL",
    title: "COMPACIDAD_EN_R^K",
    type: "theorem",
    content: "Un conjunto K ⊂ R^k es compacto si y solo si es cerrado y acotado.",
    formula: "K \\subset \\mathbb{R}^k \\text{ es compacto } \\iff \\text{ cerrado y acotado}",
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'archive' | 'exercises'>('archive');
  const [searchTerm, setSearchTerm] = useState('');
  const [openSolutions, setOpenSolutions] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  const EXERCISE_DATA: ExerciseItem[] = [
    {
      id: "EX_2.13",
      chapter: 2,
      number: 13,
      enunciado: "Construir un conjunto K ⊂ R¹ tal que K sea compacto y su conjunto derivado K' sea un conjunto contable e infinito.",
      solution: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>1. Construcción</h4>
            <p>Definimos el conjunto K ⊂ R como la unión:</p>
            <MathRenderer formula="K = A \cup B \cup \{0\}" block />
            <p>donde:</p>
            <MathRenderer formula="A = \{ \frac{1}{n} + \frac{1}{n^2m} : n, m \in \mathbb{N} \}" block />
            <MathRenderer formula="B = \{ \frac{1}{n} : n \in \mathbb{N} \}" block />
          </div>

          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>2. Determinación del conjunto derivado K'</h4>
            <p>Demostraremos que <MathRenderer formula="K' = B \cup \{0\}" />.</p>
            <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li>• <strong>B ⊂ K':</strong> Sea <MathRenderer formula="p = 1/n \in B" />. Para cualquier <MathRenderer formula="r > 0" />, existe <MathRenderer formula="m \in \mathbb{N}" /> tal que <MathRenderer formula="1/(n^2m) < r" />. El punto <MathRenderer formula="q = 1/n + 1/(n^2m) \in K" /> cumple <MathRenderer formula="0 < |q - p| < r" />.</li>
              <li>• <strong>{'{0}'} ∈ K':</strong> Para cualquier <MathRenderer formula="r > 0" />, existe <MathRenderer formula="n \in \mathbb{N}" /> tal que <MathRenderer formula="1/n < r" />. Todo vecindario de 0 contiene puntos de B ⊂ K.</li>
              <li>• <strong>A ∩ K' = ∅:</strong> Los puntos de A son aislados por el factor <MathRenderer formula="1/n^2m" />.</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>3. Demostración de Compacidad (Teo. 2.41)</h4>
            <p><strong>Acotado:</strong> Para todo <MathRenderer formula="x \in K" />, se observa que <MathRenderer formula="0 \leq x \leq 2" />. Si elegimos <MathRenderer formula="q=0" /> y <MathRenderer formula="M=3" />, se cumple <MathRenderer formula="d(x, q) < M" />.</p>
            <p style={{ marginTop: '0.5rem' }}><strong>Cerrado:</strong> Un conjunto es cerrado si <MathRenderer formula="K' \subset K" />. Como <MathRenderer formula="K' = B \cup \{0\}" /> y ambos son subconjuntos de K, K es cerrado.</p>
          </div>

          <div style={{ borderTop: '1px solid var(--foreground)', paddingTop: '1rem', fontStyle: 'italic' }}>
            Conclusión: Al ser K cerrado y acotado en R¹, el Teorema de Heine-Borel garantiza que K es compacto. □
          </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeTab]);

  const toggleSolution = (id: string) => {
    setOpenSolutions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const normalize = (str: string) => str.toLowerCase().replace(/_/g, ' ').replace(/\./g, ' ').trim();
  
  const matchesSearch = (itemContext: string, query: string) => {
    const tokens = query.split(/\s+/).filter(t => t.length > 0);
    return tokens.every(token => itemContext.includes(token));
  };

  const currentQuery = normalize(searchTerm);

  const filteredArchive = ARCHIVE_DATA.filter(item => {
    const context = normalize(`${item.id} ${item.title} ${item.type} ${item.content} teorema definicion`);
    return matchesSearch(context, currentQuery);
  });

  const filteredExercises = EXERCISE_DATA.filter(item => {
    const context = normalize(`${item.id} ${item.chapter} ${item.number} ejercicio ${item.enunciado}`);
    return matchesSearch(context, currentQuery);
  });

  return (
    <main className="container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <ThemeToggle />
      </div>

      <section style={{ marginBottom: '2.5rem', fontFamily: 'var(--font-mono)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div className="terminal-prompt-line" style={{ fontSize: '1.1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--color4)' }}>→</span>
            <span style={{ color: 'var(--color4)', fontWeight: 'bold' }}>jowl@mathos</span>
            <span style={{ color: 'var(--foreground)', opacity: 0.8 }}>git:(<span style={{ color: 'var(--color1)' }}>master</span>)</span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 'bold', letterSpacing: '-1px' }}>
            grep -r &quot;{activeTab === 'archive' ? 'teorema' : 'ejercicio'}&quot; .
            <span className="terminal-block-cursor"></span>
          </div>
        </div>
      </section>

      {/* Retro Tabs Navigation */}
      <nav style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
        <button 
          onClick={() => { setActiveTab('archive'); setSearchTerm(''); }}
          style={{ 
            padding: '10px 20px', 
            border: '2px solid var(--foreground)', 
            background: activeTab === 'archive' ? 'var(--foreground)' : 'var(--background)',
            color: activeTab === 'archive' ? 'var(--background)' : 'var(--foreground)',
            fontWeight: 'bold', cursor: 'pointer', fontFamily: 'var(--font-mono)'
          }}
        >
          [ARCHIVO]
        </button>
        <button 
          onClick={() => { setActiveTab('exercises'); setSearchTerm(''); }}
          style={{ 
            padding: '10px 20px', 
            border: '2px solid var(--foreground)', 
            background: activeTab === 'exercises' ? 'var(--foreground)' : 'var(--background)',
            color: activeTab === 'exercises' ? 'var(--background)' : 'var(--foreground)',
            fontWeight: 'bold', cursor: 'pointer', fontFamily: 'var(--font-mono)'
          }}
        >
          [EJERCICIOS]
        </button>
      </nav>

      <section style={{ marginBottom: '2.5rem' }}>
        <input 
          ref={searchInputRef}
          type="text" 
          placeholder={`BUSCAR EN ${activeTab === 'archive' ? 'ARCHIVO' : 'EJERCICIOS'}...`} 
          className="retro-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>

      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '4rem' }}>
        {activeTab === 'archive' ? (
          filteredArchive.length > 0 ? (
            filteredArchive.map((item) => (
              <div key={item.id} className="retro-window">
                <div className="retro-header">{item.id} // {item.title}</div>
                <div className="retro-content">
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{item.content}</p>
                  {item.formula && (
                    <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'var(--color0)', color: 'var(--color15)', overflowX: 'auto' }}>
                      <MathRenderer formula={item.formula} block />
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--foreground)', opacity: 0.5 }}>
              SIN RESULTADOS EN ARCHIVO PARA: &quot;{searchTerm}&quot;
            </div>
          )
        ) : (
          filteredExercises.map((ex) => (
            <div key={ex.id} className="retro-window">
              <div className="retro-header">CAPÍTULO_{ex.chapter} // EJERCICIO_{ex.number}</div>
              <div className="retro-content">
                <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{ex.enunciado}</p>
                <button 
                  onClick={() => toggleSolution(ex.id)}
                  style={{ 
                    width: '100%', 
                    textAlign: 'left', 
                    padding: '10px 20px', 
                    border: '2px solid var(--foreground)', 
                    background: openSolutions[ex.id] ? 'var(--foreground)' : 'var(--background)',
                    color: openSolutions[ex.id] ? 'var(--background)' : 'var(--foreground)',
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    fontFamily: 'var(--font-mono)',
                    marginBottom: openSolutions[ex.id] ? '1.5rem' : '0'
                  }}
                >
                  {openSolutions[ex.id] ? '[-] OCULTAR PRUEBA' : '[+] VER PRUEBA'}
                </button>
                {openSolutions[ex.id] && (
                  <div style={{ padding: '1.5rem', border: '1px dashed var(--foreground)', fontSize: '1rem', opacity: 0.9 }}>
                    {ex.solution}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
