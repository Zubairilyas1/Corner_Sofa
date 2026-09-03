'use client';

import { Accordion } from './ui';

interface FaqItem {
  question: string;
  answer: string;
  category?: 'delivery' | 'corner' | 'warranty' | 'showroom' | 'general';
}

interface FaqAccordionProps {
  items: FaqItem[];
  onCategorySelect?: (category: string) => void;
}

export default function FaqAccordion({
  items,
}: FaqAccordionProps) {
  const defaultOpen = items.findIndex((item) => item.category === 'delivery');

  return (
    <Accordion
      items={items.map((item) => ({
        question: item.question,
        answer: item.answer,
      }))}
      defaultOpen={defaultOpen >= 0 ? [defaultOpen] : []}
    />
  );
}
