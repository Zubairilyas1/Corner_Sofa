'use client';

import { useState } from 'react';
import { Button, Input, Card } from '@/components/ui';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <main className="py-20 bg-primary">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-light tracking-[0.2em] text-dark uppercase mb-3">Get in Touch</h1>
          <p className="text-sm tracking-widest text-dark/60 uppercase">We&apos;d love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xs font-medium tracking-[0.15em] text-dark uppercase mb-3">Sales</h3>
              <p className="text-sm text-dark/60">0800 123 4567</p>
              <p className="text-xs text-dark/40 mt-1">Mon–Fri 9am–5pm</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xs font-medium tracking-[0.15em] text-dark uppercase mb-3">Email</h3>
              <p className="text-sm text-dark/60">sales@cornersofa.co.uk</p>
              <p className="text-xs text-dark/40 mt-1">We reply within 24 hours</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xs font-medium tracking-[0.15em] text-dark uppercase mb-3">Showroom</h3>
              <p className="text-sm text-dark/60">42 Deansgate</p>
              <p className="text-xs text-dark/40">Manchester M3 1NH</p>
              <p className="text-xs text-dark/40 mt-1">Mon–Sat 9am–6pm · Sun 10am–4pm</p>
            </Card>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <Card className="p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-light tracking-[0.15em] text-dark uppercase mb-3">Message Sent</h2>
                  <p className="text-sm text-dark/60">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-lg font-light tracking-[0.15em] text-dark uppercase mb-2">Send a Message</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input label="Name" required placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
                    <Input label="Email" type="email" required placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
                  </div>
                  <Input label="Subject" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  <div>
                    <label className="block text-xs font-medium text-dark/70 mb-1.5 uppercase tracking-wider">Message</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Tell us what's on your mind..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-dark bg-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-none ${
                        errors.message ? 'border-red-500' : 'border-gray-200'
                      }`}
                    />
                    {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                  </div>
                  <Button type="submit" variant="contrast" size="lg" loading={loading} className="w-full">
                    Send Message
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
