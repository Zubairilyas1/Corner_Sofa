'use client';

import { useState } from 'react';

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: number[];
  className?: string;
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className = '',
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set(defaultOpen));

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };

  return (
    <div className={`divide-y divide-dark/5 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        return (
          <div key={index}>
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center justify-between py-5 text-left text-dark font-light tracking-wide hover:text-accent transition-colors"
              aria-expanded={isOpen}
            >
              <span className="text-sm pr-4">{item.question}</span>
              <svg className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-400 ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
              <p className="text-sm text-dark/60 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
