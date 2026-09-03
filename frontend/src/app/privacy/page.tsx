import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Corner Sofa privacy policy. How we collect, use, and protect your personal data.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="bg-primary relative overflow-hidden">
      <div className="bg-orb bg-orb-accent w-[500px] h-[500px] -top-40 -right-40 absolute pointer-events-none" />

      <section className="py-20 glass-white border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-dark uppercase mb-4">Privacy Policy</h1>
          <div className="glass-divider max-w-[120px] mx-auto" />
        </div>
      </section>

      <section className="py-20 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="glass-white rounded-2xl p-8 md:p-12 space-y-8">
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">Who We Are</h2>
              <p className="text-sm text-dark/60 leading-relaxed">Corner Sofa Ltd ("we", "us", "our") is a UK-registered company. We operate the website cornersofa.co.uk. This policy explains how we handle your personal data.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">What We Collect</h2>
              <ul className="text-sm text-dark/60 leading-relaxed space-y-1 list-disc pl-5">
                <li>Name, email, phone number, and shipping address when you place an order</li>
                <li>Payment information (processed securely via Stripe — we do not store card details)</li>
                <li>Browsing behaviour via analytics cookies (Google Analytics)</li>
                <li>Swatch request details (name, email, address)</li>
                <li>Appointment booking details (name, email, phone, preferred date)</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">How We Use It</h2>
              <ul className="text-sm text-dark/60 leading-relaxed space-y-1 list-disc pl-5">
                <li>To process and deliver your orders</li>
                <li>To communicate about your order status</li>
                <li>To send swatch samples and process appointment bookings</li>
                <li>To improve our website and services</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">Data Sharing</h2>
              <p className="text-sm text-dark/60 leading-relaxed">We share data only with: delivery partners (for order fulfilment), payment processors (Stripe), analytics providers (Google Analytics), and email service providers. We never sell your personal data.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">Your Rights</h2>
              <p className="text-sm text-dark/60 leading-relaxed">Under UK GDPR, you have the right to: access your data, correct inaccurate data, delete your data, restrict processing, and data portability. Contact us at privacy@cornersofa.co.uk to exercise these rights.</p>
            </div>
            <div>
              <h2 className="text-lg font-light tracking-[0.1em] text-dark uppercase mb-3">Cookies</h2>
              <p className="text-sm text-dark/60 leading-relaxed">We use essential cookies for site functionality and analytics cookies (Google Analytics) to understand how visitors use our site. You can control cookies via your browser settings.</p>
            </div>
            <p className="text-xs text-dark/30 pt-4">Last updated: September 2026</p>
          </div>
        </div>
      </section>
    </div>
  );
}
