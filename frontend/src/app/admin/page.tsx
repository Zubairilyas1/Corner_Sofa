'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  products: number;
  swatchRequests: number;
  appointments: number;
  orders: number;
  pendingAppointments: number;
  pendingSwatches: number;
  lowStockProducts: number;
}

interface Activity {
  id: string;
  type: 'appointment' | 'swatch' | 'system';
  message: string;
  time: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, swatchRequests: 0, appointments: 0, orders: 0, pendingAppointments: 0, pendingSwatches: 0, lowStockProducts: 0 });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [statsRes, appointmentsRes, swatchesRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/appointment').catch(() => null),
          fetch('/api/swatch-request').catch(() => null),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());

        const acts: Activity[] = [];

        if (appointmentsRes?.ok) {
          const apts = await appointmentsRes.json();
          apts.slice(0, 5).forEach((a: { customer_name: string; appointment_date: string; status: string }) => {
            acts.push({
              id: `apt-${a.customer_name}`,
              type: 'appointment',
              message: `${a.customer_name} booked an appointment`,
              time: new Date(a.appointment_date).toLocaleDateString('en-GB'),
            });
          });
        }

        if (swatchesRes?.ok) {
          const sw = await swatchesRes.json();
          sw.slice(0, 5).forEach((s: { customer_name: string; created_at: string }) => {
            acts.push({
              id: `sw-${s.customer_name}`,
              type: 'swatch',
              message: `${s.customer_name} requested fabric swatches`,
              time: new Date(s.created_at).toLocaleDateString('en-GB'),
            });
          });
        }

        acts.push(
          { id: 'sys-1', type: 'system', message: 'Admin dashboard initialized', time: 'Just now' },
          { id: 'sys-2', type: 'system', message: 'Stripe test mode active', time: '—' },
        );

        setActivities(acts);
      } catch {
        setStats({ products: 12, swatchRequests: 0, appointments: 0, orders: 0, pendingAppointments: 0, pendingSwatches: 0, lowStockProducts: 0 });
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, href: '/admin/products', icon: '🛋️' },
    { label: 'Orders', value: stats.orders, href: '/admin/orders', icon: '📦' },
    { label: 'Swatch Requests', value: stats.swatchRequests, href: '/admin/swatch-requests', icon: '🎨', badge: stats.pendingSwatches > 0 ? `${stats.pendingSwatches} pending` : undefined },
    { label: 'Appointments', value: stats.appointments, href: '/admin/appointments', icon: '📅', badge: stats.pendingAppointments > 0 ? `${stats.pendingAppointments} pending` : undefined },
  ];

  const alerts = [
    stats.lowStockProducts > 0 && { type: 'warning' as const, message: `${stats.lowStockProducts} product variants with low stock (≤3 units)` },
    stats.pendingAppointments > 0 && { type: 'info' as const, message: `${stats.pendingAppointments} appointment(s) awaiting confirmation` },
    stats.pendingSwatches > 0 && { type: 'info' as const, message: `${stats.pendingSwatches} swatch request(s) to process` },
  ].filter(Boolean);

  return (
    <div>
      <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-white/90 mb-8">Dashboard</h1>

      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className={`admin-card px-4 py-3 flex items-center gap-3 ${alert.type === 'warning' ? 'border-amber-500/20' : 'border-blue-500/20'}`}>
              <span className="text-xs">{alert.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
              <p className="text-xs text-white/60">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-card p-6 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-2xl font-light text-[#C5A880]">{card.value}</span>
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">{card.label}</p>
            {card.badge && <p className="text-[10px] text-[#C5A880]/70 mt-1">{card.badge}</p>}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card p-6">
          <h2 className="text-xs font-light tracking-[0.2em] text-white/30 uppercase mb-4">Recent Activity</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-5 h-5 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {activities.map((act) => (
                <div key={act.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className={`w-2 h-2 rounded-full ${act.type === 'appointment' ? 'bg-[#C5A880]' : act.type === 'swatch' ? 'bg-emerald-500' : 'bg-white/20'}`} />
                  <p className="text-xs text-white/50 flex-1">{act.message}</p>
                  <span className="text-[10px] text-white/20">{act.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-card p-6">
          <h2 className="text-xs font-light tracking-[0.2em] text-white/30 uppercase mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: '/admin/products', label: 'Manage Products', icon: '🛋️' },
              { href: '/admin/orders', label: 'View Orders', icon: '📦' },
              { href: '/admin/swatch-requests', label: 'Swatch Requests', icon: '🎨' },
              { href: '/admin/appointments', label: 'Appointments', icon: '📅' },
              { href: '/', label: 'View Live Site', icon: '🌐' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-white/40 hover:text-[#C5A880] hover:border-[#C5A880]/20 transition-all">
                <span>{link.icon}</span>
                <span className="tracking-wide">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
