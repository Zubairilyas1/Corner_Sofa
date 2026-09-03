import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Delivery Information',
  description: 'Free room-of-choice delivery across the UK. Standard 5–7 day delivery, express options available. Two-person delivery team.',
  alternates: { canonical: '/delivery-info' },
};

const deliveryOptions = [
  {
    name: 'Standard Delivery',
    price: 'Free',
    timeframe: '5–7 working days',
    description: 'Two-person delivery team to your room of choice. Available across mainland UK.',
    features: ['Room of choice delivery', 'Two-person team', 'Full tracking', 'Saturday delivery available'],
  },
  {
    name: 'Express Delivery',
    price: '£29.99',
    timeframe: '2–3 working days',
    description: 'Priority delivery for when you need your sofa sooner. Same two-person service.',
    features: ['Priority scheduling', 'Room of choice delivery', 'Full tracking', 'Text alerts'],
  },
  {
    name: 'Old Sofa Removal',
    price: '£49.99',
    timeframe: 'Added to delivery',
    description: 'We\'ll take your old sofa away when we deliver your new one. Environmentally responsible disposal.',
    features: ['Eco-friendly disposal', 'Added at checkout', 'Same-day removal', 'Available with all deliveries'],
  },
];

const faqs = [
  { q: 'Can you deliver to upstairs rooms?', a: 'Yes. Our two-person delivery team will carry your sofa to any room in your home, including upstairs. There are no extra charges for stairs.' },
  { q: 'What if I\'m not home on delivery day?', a: 'We\'ll contact you to rearrange. You can reschedule online or by calling our team. First reschedule is free.' },
  { q: 'Do you deliver to Scotland and Northern Ireland?', a: 'Yes. Mainland UK delivery is free. Scotland Highlands and Islands may take an additional 2–3 working days. Northern Ireland deliveries may incur a small surcharge.' },
  { q: 'Can I choose a delivery date?', a: 'Yes. During checkout you can select your preferred delivery date. We offer Monday–Saturday delivery slots.' },
  { q: 'What happens if my sofa doesn\'t fit?', a: 'Measure your doorways before ordering. If the sofa doesn\'t fit, our team will take it back free of charge and arrange a refund or exchange.' },
  { q: 'Is delivery really free?', a: 'Yes. Free delivery is included on all orders to mainland UK. There are no hidden fees or minimum spend requirements.' },
];

export default function DeliveryInfoPage() {
  return (
    <div className="bg-primary relative overflow-hidden">
      <div className="bg-orb bg-orb-accent w-[500px] h-[500px] -top-40 -right-40 absolute pointer-events-none" />
      <div className="bg-orb bg-orb-gold w-[400px] h-[400px] top-[50%] -left-40 absolute pointer-events-none" />

      {/* Hero */}
      <section className="py-20 glass-white border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-dark uppercase mb-4">
            Delivery Information
          </h1>
          <div className="glass-divider max-w-[120px] mx-auto mb-4" />
          <p className="text-sm text-dark/50 tracking-[0.1em]">
            Free room-of-choice delivery on every order. No minimum spend.
          </p>
        </div>
      </section>

      {/* Delivery Options */}
      <section className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {deliveryOptions.map((option) => (
              <div key={option.name} className="glass-card rounded-2xl p-8">
                <p className="text-[10px] text-accent uppercase tracking-[0.2em] font-medium mb-2">{option.timeframe}</p>
                <h3 className="text-lg font-light tracking-[0.12em] text-dark uppercase mb-2">{option.name}</h3>
                <p className="text-2xl font-light text-accent mb-4">{option.price}</p>
                <p className="text-sm text-dark/50 leading-relaxed mb-6">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-dark/60">
                      <span className="text-accent">✓</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-light tracking-[0.15em] text-dark uppercase text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-0">
            {[
              { step: '01', title: 'Order Online', desc: 'Choose your sofa, select fabric and colour, and complete checkout.' },
              { step: '02', title: 'Production', desc: 'Your sofa is handcrafted to order in our UK workshop. Typically 2–4 weeks.' },
              { step: '03', title: 'Delivery Scheduling', desc: 'We\'ll contact you to confirm your preferred delivery date and time slot.' },
              { step: '04', title: 'Room of Choice', desc: 'Our two-person team delivers your sofa to any room, including upstairs. Packaging removed.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="glass-accent w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-accent">{item.step}</div>
                  {i < 3 && <div className="w-px h-16 bg-dark/10" />}
                </div>
                <div className="pb-8">
                  <h3 className="text-sm font-medium tracking-[0.1em] text-dark uppercase mb-1">{item.title}</h3>
                  <p className="text-sm text-dark/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-light tracking-[0.15em] text-dark uppercase text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-white rounded-2xl p-6">
                <h3 className="text-sm font-medium tracking-[0.05em] text-dark mb-2">{faq.q}</h3>
                <p className="text-sm text-dark/50 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
