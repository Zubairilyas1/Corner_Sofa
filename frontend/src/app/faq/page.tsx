'use client';

import { useState } from 'react';
import { Accordion, Button } from '@/components/ui';
import Link from 'next/link';
import { generateFAQSchema } from '@/lib/schema';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  // Delivery
  { category: 'Delivery', question: 'How long does delivery take?', answer: 'Standard delivery is 5–7 working days. Express delivery (2–3 days) is available for £29.99 at checkout. We also offer room-of-choice delivery with assembly for £49.99.' },
  { category: 'Delivery', question: 'Is delivery really free?', answer: 'Yes — standard room-of-choice delivery is completely free across mainland UK. Our two-person delivery team will carry your sofa to the room of your choice.' },
  { category: 'Delivery', question: 'Do you deliver to Scotland?', answer: 'Yes, we deliver to Scotland. Delivery may take an additional 2–3 working days. Please contact us for a precise delivery window.' },
  { category: 'Delivery', question: 'Can I choose a delivery date?', answer: 'Yes — during checkout you can select your preferred delivery window. We offer standard (5–7 days), express (2–3 days), and room-of-choice with assembly (3–5 days).' },

  // Corner Sofas
  { category: 'Corner Sofas', question: 'How do I know if I need a left or right-facing corner sofa?', answer: 'Stand facing the sofa: if the chaise is on your left, it\'s left-facing. If it\'s on your right, it\'s right-facing. Measure your room and check which configuration fits best. Our showroom team can also advise.' },
  { category: 'Corner Sofas', question: 'Can I change the corner direction after ordering?', answer: 'Some models can be reversed before dispatch. Contact us within 24 hours of ordering and we\'ll do our best to accommodate your request.' },

  // Showroom
  { category: 'Showroom', question: 'Do I need to book a showroom visit?', answer: 'We recommend booking an appointment for a personalised consultation, but walk-ins are welcome during opening hours (Mon–Sat 9am–6pm, Sun 10am–4pm).' },
  { category: 'Showroom', question: 'Where is your showroom?', answer: 'Our Manchester showroom is at 42 Deansgate, Manchester M3 1NH. We also have a London showroom at 118 Tottenham Court Rd, London W1T 5HP.' },

  // Warranty
  { category: 'Warranty', question: 'What does the 10-year warranty cover?', answer: 'Our 10-year warranty covers the structural frame — joints, legs, and base. It includes sagging prevention and frame integrity. Fabric is covered for 2 years, recliner mechanisms for 5 years.' },
  { category: 'Warranty', question: 'How do I make a warranty claim?', answer: 'Contact us with your order number and a description of the issue. We\'ll assess it and, if covered, arrange a repair or replacement at no cost to you.' },

  // Assembly
  { category: 'Assembly', question: 'Do I need to assemble the sofa?', answer: 'Most of our sofas arrive fully assembled and ready to use. Corner sofas may require simple leg attachment (tools included). Room-of-choice + Assembly delivery includes full setup.' },
  { category: 'Assembly', question: 'Can I fit a corner sofa through my door?', answer: 'Our corner sofas are delivered in sections (typically 2–3 pieces) to navigate standard UK doorways. Measure your doorways and hallway — our team can advise on specific dimensions.' },

  // Returns
  { category: 'Returns', question: 'Can I return my sofa?', answer: 'We offer a 14-day return policy. The sofa must be unused and in its original packaging. A collection fee may apply. Contact us to arrange a return.' },
  { category: 'Returns', question: 'What if my sofa arrives damaged?', answer: 'Inspect your sofa on delivery. If there\'s any damage, note it on the delivery paperwork and contact us immediately. We\'ll arrange a replacement or repair at no cost.' },

  // Payment
  { category: 'Payment', question: 'Do you offer finance or pay-later options?', answer: 'Yes — we offer Klarna Pay Later, which lets you split your purchase into 3 interest-free instalments. Select Klarna at checkout.' },
  { category: 'Payment', question: 'What payment methods do you accept?', answer: 'We accept all major debit and credit cards via Stripe (Visa, Mastercard, Amex). We also support Apple Pay and Google Pay.' },
];

const CATEGORIES = [...new Set(FAQS.map((f) => f.category))];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory ? FAQS.filter((f) => f.category === activeCategory) : FAQS;

  return (
    <main className="py-20 bg-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(FAQS.map((f) => ({ question: f.question, answer: f.answer })))),
        }}
      />
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-3">Frequently Asked Questions</h1>
          <p className="text-sm tracking-widest text-dark/60 uppercase">Everything you need to know</p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
              activeCategory === null ? 'bg-accent text-primary' : 'bg-white text-dark border border-gray-200 hover:border-dark/20'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-accent text-primary' : 'bg-white text-dark border border-gray-200 hover:border-dark/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="mb-12">
          <Accordion
            items={filtered.map((faq) => ({ question: faq.question, answer: faq.answer }))}
          />
        </div>

        <div className="text-center bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-lg font-light tracking-[0.15em] text-dark uppercase mb-3">Still Have Questions?</h2>
          <p className="text-sm text-dark/50 mb-6">Our team is happy to help with anything not covered above.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <Button variant="contrast" size="lg">Contact Us</Button>
            </Link>
            <Link href="/appointment">
              <Button variant="ghost" size="lg">Book a Showroom Visit</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
