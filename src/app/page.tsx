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
    id: "THM_1.35_CAUCHY_SCHWARZ",
    title: "DESIGUALDAD_DE_CAUCHY_SCHWARZ",
    type: "theorem",
    content: "Teorema 1.35: Si a_1, ..., a_n y b_1, ..., b_n son números complejos, entonces el cuadrado del módulo de su producto interno es menor o igual al producto de las sumas de sus cuadrados.",
    formula: "\\left| \\sum_{j=1}^{n} a_j \\bar{b}_j \\right|^2 \\leq \\sum_{j=1}^{n} |a_j|^2 \\sum_{j=1}^{n} |b_j|^2",
  },
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
    id: "DEF_2.18_INTERIOR_OPEN",
    title: "PUNTO_INTERIOR_Y_ABIERTO",
    type: "definition",
    content: "Definición 2.18 (e): Un punto p es un punto interior de E si existe un entorno N de p tal que N ⊂ E.\n\nDefinición 2.18 (f): El interior de E (denotado generalmente como E° o int E) es el conjunto de todos los puntos interiores de E.\n\nDefinición 2.18 (g): Un conjunto E es abierto si cada punto de E es un punto interior de E.",
    formula: "E^\\circ = \\{ p \\in E : p \\text{ es punto interior} \\}, \\quad E \\text{ abierto } \\iff E = E^\\circ",
  },
  {
    id: "DEF_2.18_CLOSED_SET",
    title: "CONJUNTO_CERRADO",
    type: "definition",
    content: "Definición 2.18 (i): Un conjunto E es cerrado si contiene todos sus puntos límite.",
    formula: "E' \\subset E \\iff E \\text{ es cerrado}",
  },
  {
    id: "THM_2.19_NEIGHBORHOODS",
    title: "BOLAS_ABIERTAS",
    type: "theorem",
    content: "Teorema 2.19: Toda vecindad (bola abierta) es un conjunto abierto.",
    formula: "N_r(p) \\text{ es siempre un conjunto abierto}",
  },
  {
    id: "THM_2.23_COMPLEMENTS",
    title: "COMPLEMENTOS_Y_ABIERTOS",
    type: "theorem",
    content: "Teorema 2.23: Un conjunto E es abierto si y solo si su complemento es cerrado.",
    formula: "E \\text{ es abierto } \\iff E^c \\text{ es cerrado}",
  },
  {
    id: "DEF_2.26_CLOSURE",
    title: "CLAUSURA_CERRADURA",
    type: "definition",
    content: "Definición 2.26: Si E es un conjunto de puntos, la clausura de E es el conjunto E unido con su conjunto derivado E'.",
    formula: "\\overline{E} = E \\cup E'",
  },
  {
    id: "THM_2.27_CLOSURE_PROPS",
    title: "PROPIEDADES_DE_LA_CLAUSURA",
    type: "theorem",
    content: "Teorema 2.27: (a) La cerradura de E es cerrada. (b) E es cerrado si y solo si E es igual a su cerradura.",
    formula: "\\text{(a) } \\overline{E} = \\overline{\\overline{E}}, \\text{ (b) } E = \\overline{E} \\iff E \\text{ es cerrado}",
  },
  {
    id: "DEF_2.31_OPEN_COVER",
    title: "RECUBRIMIENTO_ABIERTO",
    type: "definition",
    content: "Una colección de conjuntos abiertos {G_α} es un recubrimiento abierto de un conjunto E si su unión contiene a E.",
    formula: "E \\subset \\bigcup_{\\alpha} G_{\\alpha}",
  },
  {
    id: "DEF_2.31_BOUNDED_SET",
    title: "CONJUNTO_ACOTADO",
    type: "definition",
    content: "Un subconjunto E de un espacio métrico X es acotado si existen un número real M y un punto q ∈ X tales que d(p,q) < M para todo p ∈ E.",
    formula: "\\exists M \\in \\mathbb{R}, \\exists q \\in X : d(p,q) < M \\quad \\forall p \\in E",
  },
  {
    id: "DEF_2.32_COMPACTNESS",
    title: "COMPACIDAD",
    type: "definition",
    content: "Un conjunto K es compacto si para todo recubrimiento abierto {G_α} de K, existe un subrecubrimiento finito.",
    formula: "\\forall \\{G_\\alpha\\} \\text{ s.t. } K \\subset \\cup G_\\alpha, \\exists \\alpha_1, ..., \\alpha_n \\text{ s.t. } K \\subset \\bigcup_{i=1}^n G_{\\alpha_i}",
    note: "Intuición: Si tienes infinitos 'parches' abiertos para cubrir K, siempre puedes elegir solo una cantidad finita de ellos y aun así cubrir todo el conjunto.",
  },
  {
    id: "THM_2.41_HEINE_BOREL",
    title: "COMPACIDAD_EN_R^K",
    type: "theorem",
    content: "Un conjunto K ⊂ R^k es compacto si y solo si es cerrado y acotado.",
    formula: "K \\subset \\mathbb{R}^k \\text{ es compacto } \\iff \\text{ cerrado y acotado}",
  },
  {
    id: "DEF_2.45_SEPARATED_CONNECTED",
    title: "SEPARADOS_Y_CONEXOS",
    type: "definition",
    content: "Definición 2.45: Dos conjuntos A y B son separados si A ∩ clausura(B) = vacío y clausura(A) ∩ B = vacío. Un conjunto E es conexo si no es la unión de dos conjuntos separados no vacíos.",
    formula: "A, B \\text{ sep } \\iff (A \\cap \\overline{B}) \\cup (\\overline{A} \\cap B) = \\emptyset",
  },
  {
    id: "DEF_3.1_CONVERGENCE",
    title: "CONVERGENCIA_DE_SUCESIONES",
    type: "definition",
    content: "Una sucesión {s_n} en un espacio métrico (X, d) converge si hay un punto s ∈ X tal que para cada ε > 0, existe un entero N tal que n ≥ N implica d(s_n, s) < ε.",
    formula: "\\forall \\varepsilon > 0, \\exists N \\in \\mathbb{Z} \\text{ t.q. } n \\geq N \\implies d(s_n, s) < \\varepsilon",
  },
  {
    id: "THM_3.2_CONV_IS_BOUNDED",
    title: "SUCESIONES_ACOTADAS",
    type: "theorem",
    content: "Teorema 3.2: Toda sucesión convergente es acotada. Esto significa que el conjunto de sus términos es un subconjunto acotado del espacio métrico.",
    formula: "s_n \\to s \\implies \\exists M > 0, q \\in X \\text{ t.q. } d(s_n, q) < M, \\forall n",
  },
  {
    id: "PROP_TRIANGLE_INEQ_INV",
    title: "DESIGUALDAD_TRIANGULAR_INVERSA",
    type: "theorem",
    content: "Propiedad del valor absoluto (Capítulo 1): La diferencia de los valores absolutos es menor o igual al valor absoluto de la diferencia.",
    formula: "| |a| - |b| | \\leq |a - b|",
  },
  {
    id: "THM_3.3_LIMIT_OPERATIONS",
    title: "OPERACIONES_CON_LÍMITES",
    type: "theorem",
    content: "Teorema 3.3: Si lim s_n = s y lim t_n = t, entonces: (a) lim (s_n + t_n) = s + t, (b) lim (c s_n) = c s, (c) lim (s_n t_n) = st.",
    formula: "\\lim_{n \\to \\infty} (s_n \\pm t_n) = s \\pm t, \\quad \\lim_{n \\to \\infty} (s_n t_n) = st",
  },
  {
    id: "DEF_3.21_SERIES_CONV",
    title: "CONVERGENCIA_DE_SERIES",
    type: "definition",
    content: "Definición 3.21: Una serie converge si la sucesión de sus sumas parciales converge. La suma de la serie es el límite de dichas sumas parciales.",
    formula: "s_n = \\sum_{i=1}^n a_i, \\quad \\sum_{n=1}^\\infty a_n = s \\iff s_n \\to s",
  },
  {
    id: "THM_3.23_NECESSARY_COND",
    title: "CONDICIÓN_NECESARIA_CONV",
    type: "theorem",
    content: "Teorema 3.23: Si la serie Σ a_n converge, entonces el límite de sus términos debe ser cero. El recíproco no es necesariamente cierto.",
    formula: "\\sum a_n \\text{ converge } \\implies \\lim_{n \\to \\infty} a_n = 0",
  },
  {
    id: "THM_3.25_COMPARISON_TEST",
    title: "CRITERIO_DE_COMPARACIÓN",
    type: "theorem",
    content: "Teorema 3.25: Supongamos 0 ≤ a_n ≤ c_n para n ≥ N. Si 'la grande' (Σ c_n) converge, entonces 'la pequeña' (Σ a_n) converge. Si 'la pequeña' diverge, entonces 'la grande' diverge.",
    formula: "0 \\leq a_n \\leq c_n \\implies \\begin{cases} \\sum c_n < \\infty \\implies \\sum a_n < \\infty \\\\ \\sum a_n = \\infty \\implies \\sum c_n = \\infty \\end{cases}",
  },
  {
    id: "THM_P_SERIES",
    title: "P_SERIE_HIPERARMÓNICA",
    type: "theorem",
    content: "Criterio de la p-serie: La serie Σ 1/n^p converge si p > 1 y diverge si p ≤ 1. Es fundamental para comparaciones.",
    formula: "\\sum_{n=1}^\\infty \\frac{1}{n^p} < \\infty \\iff p > 1",
  },
  {
    id: "THM_3.33_ROOT_TEST",
    title: "CRITERIO_DE_LA_RAÍZ",
    type: "theorem",
    content: "Teorema 3.33: Sea α el límite superior de la raíz n-ésima de |a_n|. La serie converge si α < 1 y diverge si α > 1.",
    formula: "\\alpha = \\limsup_{n \\to \\infty} \\sqrt[n]{|a_n|}, \\quad \\alpha < 1 \\implies \\text{conv}",
  },
  {
    id: "THM_3.26_GEOMETRIC_SERIES",
    title: "SERIE_GEOMÉTRICA",
    type: "theorem",
    content: "Teorema 3.26: La serie de potencias Σ x^n converge a 1/(1-x) si |x| < 1 y diverge si |x| ≥ 1.",
    formula: "\\sum_{n=0}^\\infty x^n = \\frac{1}{1-x} \\iff |x| < 1",
  },
  {
    id: "THM_3.20_LIMIT_N_ROOT",
    title: "LÍMITE_ESPECIAL_RAÍZ_N",
    type: "theorem",
    content: "Teorema 3.20: Un límite útil en el análisis de series y sucesiones es que la raíz n-ésima de n tiende a 1 cuando n tiende a infinito.",
    formula: "\\lim_{n \\to \\infty} \\sqrt[n]{n} = 1",
  },
  {
    id: "THM_3.39_CAUCHY_HADAMARD",
    title: "RADIO_DE_CONVERGENCIA_RAÍZ",
    type: "theorem",
    content: "Teorema 3.39 (Cauchy-Hadamard): Para una serie de potencias Σ c_n z^n, sea α = limsup |c_n|^(1/n). El radio de convergencia R es 1/α (con R=∞ si α=0 y R=0 si α=∞).",
    formula: "R = \\frac{1}{\\limsup_{n \\to \\infty} \\sqrt[n]{|c_n|}}",
  },
  {
    id: "THM_3.37_RATIO_TEST_SERIES",
    title: "RADIO_DE_CONVERGENCIA_COCIENTE",
    type: "theorem",
    content: "Criterio del Cociente: Si el límite del cociente de los coeficientes existe, el radio de convergencia R puede calcularse de forma simplificada como el límite de |c_n / c_{n+1}|.",
    formula: "R = \\lim_{n \\to \\infty} \\left| \\frac{c_n}{c_{n+1}} \\right|",
  },
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
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>2. Determinación del conjunto derivado K' (Def. 2.18)</h4>
            <p>Demostraremos que <MathRenderer formula="K' = B \cup \{0\}" />.</p>
            <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <li>• <strong>B ⊂ K':</strong> Sea <MathRenderer formula="p = 1/n \in B" />. Para cualquier <MathRenderer formula="r > 0" />, existe <MathRenderer formula="m \in \mathbb{N}" /> tal que <MathRenderer formula="1/(n^2m) < r" />. El punto <MathRenderer formula="q = 1/n + 1/(n^2m)" /> pertenece a K y cumple <MathRenderer formula="0 < |q - p| < r" />.</li>
              <li>• <strong>{'{0}'} ∈ K':</strong> Para cualquier <MathRenderer formula="r > 0" />, existe <MathRenderer formula="n \in \mathbb{N}" /> tal que <MathRenderer formula="1/n < r" />. Como <MathRenderer formula="1/n \in B \subset K" /> y <MathRenderer formula="1/n \neq 0" />, todo vecindario de 0 contiene puntos de K.</li>
              <li>• <strong>A ∩ K' = ∅:</strong> Todo punto <MathRenderer formula="x \in A" /> es un punto aislado. Debido a la separación por el factor <MathRenderer formula="1/n^2m" />, existe un radio <MathRenderer formula="r > 0" /> tal que <MathRenderer formula="N_r(x) \cap K = \{x\}" />.</li>
            </ul>
            <p style={{ marginTop: '1rem' }}><strong>Contabilidad de K':</strong> K' es contable porque es la unión del conjunto B y el punto {'{0}'}. Formalmente, existe una biyección <MathRenderer formula="f: \mathbb{N} \to K'" /> definida por <MathRenderer formula="f(1)=0" /> y <MathRenderer formula="f(n)=\frac{1}{n-1}" /> para <MathRenderer formula="n > 1" />. Como B es infinito, K' es infinito contable.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>3. Demostración de Compacidad (Teo. 2.41)</h4>
            <p>En R¹, un conjunto es compacto si y solo si es cerrado y acotado.</p>
            <p style={{ marginTop: '0.5rem' }}>• <strong>Acotado (Def. 2.31):</strong> Para todo <MathRenderer formula="x \in K" />, <MathRenderer formula="0 \leq x \leq 2" /> (máximo en <MathRenderer formula="n=1, m=1" />). Eligiendo <MathRenderer formula="q=0" /> y <MathRenderer formula="M=3" />, se cumple <MathRenderer formula="d(x, q) < M" />.</p>
            <p style={{ marginTop: '0.5rem' }}>• <strong>Cerrado (Def. 2.18):</strong> Un conjunto es cerrado si <MathRenderer formula="K' \subset K" />. Como hemos demostrado que <MathRenderer formula="K' = B \cup \{0\}" />, y ambos son subconjuntos de K, K es cerrado.</p>
          </div>
          <div style={{ borderTop: '1px solid var(--foreground)', paddingTop: '1rem', fontStyle: 'italic' }}>
            Conclusión: Al ser K cerrado y acotado en R¹, el Teorema de Heine-Borel garantiza que K es compacto. □
          </div>
        </div>
      )
    },
    {
      id: "EX_2.14",
      chapter: 2,
      number: 14,
      enunciado: "Dar un ejemplo de un recubrimiento abierto del segmento (0, 1) que no tenga un subrecubrimiento finito.",
      solution: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>1. Construcción del Recubrimiento Abierto</h4>
            <p>Definimos una familia de conjuntos <MathRenderer formula="\{G_n\}" /> para cada <MathRenderer formula="n \in \{2, 3, 4, \dots\}" />:</p>
            <MathRenderer formula="G_n = \left( \frac{1}{n}, 1 \right)" block />
            <p>Cada <MathRenderer formula="G_n" /> es un conjunto abierto en R¹ por ser un intervalo abierto.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>2. Demostración de que es un Recubrimiento</h4>
            <p>Sea <MathRenderer formula="x \in (0, 1)" />. Dado que <MathRenderer formula="x > 0" />, por la <strong>Propiedad Arquimediana</strong> (Rudin, 1.20), existe un entero <MathRenderer formula="n" /> tal que:</p>
            <MathRenderer formula="0 < \frac{1}{n} < x" block />
            <p>Como <MathRenderer formula="x < 1" />, tenemos que <MathRenderer formula="x \in (1/n, 1)" />, lo cual implica que <MathRenderer formula="x \in G_n" />. La unión de todos los <MathRenderer formula="G_n" /> cubre el intervalo completamente.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>3. Ausencia de Subrecubrimiento Finito</h4>
            <p>Supongamos que existe un subrecubrimiento finito <MathRenderer formula="\{G_{n_1}, \dots, G_{n_k}\}" />. Sea <MathRenderer formula="N = \max(n_1, \dots, n_k)" />.</p>
            <p style={{ marginTop: '0.5rem' }}>Debido a que los conjuntos están <strong>anidados</strong> (<MathRenderer formula="G_2 \subset G_3 \subset \dots" />), la unión finita es simplemente el conjunto con el índice más grande:</p>
            <MathRenderer formula="\bigcup_{i=1}^{k} G_{n_i} = G_N = \left( \frac{1}{N}, 1 \right)" block />
          </div>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>4. Conclusión</h4>
            <p>Si consideramos el punto <MathRenderer formula="x = \frac{1}{N+1}" />, observamos que:</p>
            <ul style={{ listStyle: 'none', paddingLeft: '1rem', marginTop: '0.5rem' }}>
              <li>• <MathRenderer formula="x \in (0, 1)" /> (pues <MathRenderer formula="N \ge 2" />).</li>
              <li>• <MathRenderer formula="x \notin G_N" /> (pues <MathRenderer formula="\frac{1}{N+1} < \frac{1}{N}" />).</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>Al no haber subrecubrimiento finito, el intervalo <MathRenderer formula="(0, 1)" /> no es compacto. □</p>
          </div>
        </div>
      )
    },
    {
      id: "EX_2.19",
      chapter: 2,
      number: 19,
      enunciado: "Demostrar propiedades de conjuntos separados y que todo espacio métrico conexo con al menos dos puntos es no numerable.",
      solution: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>(a) Conjuntos cerrados y disjuntos</h4>
            <p>Si A y B son cerrados y disjuntos, entonces están separados.</p>
            <p style={{ marginTop: '0.5rem' }}>Por el Teorema 2.27 (b), un conjunto es cerrado ssi <MathRenderer formula="E = \overline{E}" />. Como A y B son cerrados:</p>
            <MathRenderer formula="\overline{A} = A, \quad \overline{B} = B" block />
            <p>Dado que <MathRenderer formula="A \cap B = \emptyset" />, sustituyendo las cerraduras obtenemos:</p>
            <MathRenderer formula="A \cap \overline{B} = A \cap B = \emptyset" block />
            <MathRenderer formula="\overline{A} \cap B = A \cap B = \emptyset" block />
            <p>Por la Def. 2.45, A y B están separados.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>(b) Conjuntos abiertos y disjuntos</h4>
            <p>Si A y B son abiertos y disjuntos, están separados.</p>
            <p style={{ marginTop: '0.5rem' }}>Supongamos <MathRenderer formula="A \cap \overline{B} \neq \emptyset" />. Sea <MathRenderer formula="x \in A \cap \overline{B}" />.</p>
            <p>Como <MathRenderer formula="x \in A" /> y A es abierto, existe <MathRenderer formula="N_r(x) \subset A" />. Como <MathRenderer formula="A \cap B = \emptyset" />, entonces <MathRenderer formula="N_r(x) \cap B = \emptyset" />.</p>
            <p>Pero <MathRenderer formula="x \in \overline{B}" /> implica que toda vecindad de x contiene puntos de B (Def 2.18), lo cual es una contradicción. Por tanto, <MathRenderer formula="A \cap \overline{B} = \emptyset" />. Por simetría, están separados.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>(c) Separación por distancias</h4>
            <p>Sea <MathRenderer formula="p \in X, \delta > 0" />. Definimos <MathRenderer formula="A = \{q \in X : d(p,q) < \delta\}" /> y <MathRenderer formula="B = \{q \in X : d(p,q) > \delta\}" />.</p>
            <p style={{ marginTop: '0.5rem' }}>A es abierto (es una vecindad). Para B, sea <MathRenderer formula="q \in B" />, definimos <MathRenderer formula="r = d(p,q) - \delta > 0" />. Por desigualdad del triángulo, <MathRenderer formula="N_r(q) \subset B" />, luego B es abierto.</p>
            <p>Como A y B son abiertos y disjuntos, por el inciso (b), están separados.</p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color3)', marginBottom: '0.5rem' }}>(d) Conexidad y No Numerabilidad</h4>
            <p>Sea X conexo con <MathRenderer formula="p, y \in X" />. Supongamos X numerable.</p>
            <p>El conjunto de distancias <MathRenderer formula="D = \{d(p, q) : q \in X\}" /> es numerable. Como el intervalo <MathRenderer formula="(0, d(p,y))" /> es no numerable, existe <MathRenderer formula="\delta" /> en dicho intervalo tal que <MathRenderer formula="\delta \notin D" />.</p>
            <p>Definimos A y B como en (c) con este <MathRenderer formula="\delta" />. Entonces <MathRenderer formula="A \cup B = X" /> (pues no hay puntos a distancia <MathRenderer formula="\delta" />), ambos son no vacíos (<MathRenderer formula="p \in A, y \in B" />) y están separados. Esto contradice la conexidad de X.</p>
            <div style={{ borderTop: '1px solid var(--foreground)', paddingTop: '1rem', fontStyle: 'italic', marginTop: '1rem' }}>
              Conclusión: Por contradicción, X debe ser no numerable. □
            </div>
          </div>
        </div>
      )
    }

  ];

  useEffect(() => {
    if (searchInputRef.current && window.innerWidth > 768) {
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', marginBottom: '2rem' }}>
        <ThemeToggle />
      </div>

      <section style={{ marginBottom: '2.5rem', fontFamily: 'var(--font-mono)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
          <div className="terminal-prompt-line" style={{ fontSize: '1.1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: 'var(--color4)' }}>→</span>
            <span style={{ color: 'var(--color4)', fontWeight: 'bold' }}>jowl@mathos</span>
            <span style={{ color: 'var(--foreground)', opacity: 0.8 }}>git:(<span style={{ color: 'var(--color1)' }}>master</span>)</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="terminal-command" style={{ color: 'var(--foreground)', fontWeight: 'bold', fontSize: '2.4rem', letterSpacing: '-1px', lineHeight: '1.1' }}>
              grep -r &quot;{activeTab === 'archive' ? 'teorema' : 'ejercicio'}&quot; .
            </span>
            <span className="terminal-block-cursor"></span>
          </div>
        </div>
      </section>

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
                  <p style={{ fontSize: '1.1rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{item.content}</p>
                  {item.formula && (
                    <div style={{ marginTop: '1.5rem', padding: '1.2rem', background: 'var(--color0)', color: 'var(--color15)', overflowX: 'auto' }}>
                      <MathRenderer formula={item.formula} block />
                    </div>
                  )}
                  {item.note && (
                    <p style={{ marginTop: '1.2rem', fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.8, borderLeft: '3px solid var(--color3)', paddingLeft: '10px' }}>
                      {item.note}
                    </p>
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
          filteredExercises.length > 0 ? (
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
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', border: '1px dashed var(--foreground)', opacity: 0.5 }}>
              SIN RESULTADOS EN EJERCICIOS PARA: &quot;{searchTerm}&quot;
            </div>
          )
        )}
      </section>
    </main>
  );
}
