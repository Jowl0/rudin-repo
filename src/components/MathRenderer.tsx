'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathRendererProps {
  formula: string;
  block?: boolean;
}

export default function MathRenderer({ formula, block = false }: MathRendererProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      katex.render(formula, containerRef.current, {
        throwOnError: false,
        displayMode: block,
      });
    }
  }, [formula, block]);

  return <span ref={containerRef} />;
}
