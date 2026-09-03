import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Corner Sofa terms and conditions. Read our policies on orders, delivery, returns, warranties, and more.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="bg-primary relative overflow-hidden">
      <div className="bg-orb bg-orb-accent w-[500px] h-[500px] -top-40 -right-40 absolute pointer-events-none" />

      <section className="py-20 glass-white border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-dark uppercase mb-4">Terms & Conditions</h1>
          <div className="glass-divider max-w-[120px] mx-auto" />
        </div>
      </section>

      <section className="py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-6 prose prose-sm prose-dark">
          <div className="glass-white rounded-2xl p-8 md:p-12 space-y-8">
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">1. General</h2>
              <p className="text-sm text-dark/60 leading-relaxed">These terms apply to all orders placed with Corner Sofa Ltd ("we", "us", "our") via our website cornersofa.co.uk. By placing an order, you agree to these terms.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">2. Orders</h2>
              <p className="text-sm text-dark/60 leading-relaxed">All orders are subject to availability and acceptance. We reserve the right to refuse any order. A contract is formed when we send you an order confirmation email.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">3. Pricing</h2>
              <p className="text-sm text-dark/60 leading-relaxed">All prices are in GBP and include VAT. We reserve the right to change prices at any time. Delivery to mainland UK is free unless otherwise stated.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">4. Delivery</h2>
              <p className="text-sm text-dark/60 leading-relaxed">Standard delivery is 5–7 working days from dispatch. Express delivery is 2–3 working days. We deliver to mainland UK. Additional charges may apply for Scotland Highlands, Islands, and Northern Ireland.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">5. Returns</h2>
              <p className="text-sm text-dark/60 leading-relaxed">You may return your sofa within 14 days of delivery if it is unused and in its original packaging. Made-to-order items (custom fabrics/colors) cannot be returned unless faulty. Return delivery charges apply.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">6. Warranty</h2>
              <p className="text-sm text-dark/60 leading-relaxed">All sofas come with a 10-year structural warranty covering the frame and joints. Fabric is covered for 2 years. Recliner mechanisms are covered for 5 years. See our warranty page for full details.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">7. Payment</h2>
              <p className="text-sm text-dark/60 leading-relaxed">We accept Visa, Mastercard, American Express, Klarna (Pay in 3), and bank transfer. Payment is taken at the time of order.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">8. Privacy</h2>
              <p className="text-sm text-dark/60 leading-relaxed">We collect personal data to process your order and improve our services. We do not sell your data to third parties. See our Privacy Policy for details.</p>
            </div>
            <p className="text-xs text-dark/30 pt-4">Last updated: September 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}
