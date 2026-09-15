'use client';

import { Fragment, useState, useEffect } from 'react';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  address?: string;
  postcode?: string;
  total: number;
  items: number;
  status: string;
  date: string;
  deliveryDate?: string;
  sofaDetails?: string;
  emailSentAt?: string;
  lines?: Array<{ title: string; color: string; quantity: number; price: number; type?: string }>;
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'admin-badge-amber',
  processing: 'admin-badge-blue',
  shipped: 'admin-badge-blue',
  delivered: 'admin-badge-green',
  cancelled: 'admin-badge-red',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [sofaDetails, setSofaDetails] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/orders', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const previous = orders;
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    const response = await fetch(`/api/orders/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }),
    });
    if (!response.ok) setOrders(previous);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

  const editDelivery = (order: Order) => { setEditingId(order.id); setDeliveryDate(order.deliveryDate || ''); setSofaDetails(order.sofaDetails || order.lines?.filter((line) => line.type !== 'swatch').map((line) => `${line.title} — ${line.color} × ${line.quantity}`).join('\n') || ''); };
  const saveDelivery = async (sendEmail: boolean) => {
    if (!editingId) return;
    setSaving(true);
    const response = await fetch(`/api/orders/${editingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deliveryDate, sofaDetails, sendEmail }) });
    const data = await response.json().catch(() => ({}));
    if (response.ok) { setOrders((current) => current.map((order) => order.id === editingId ? data.order : order)); if (sendEmail) alert('Delivery details saved and email sent.'); }
    else alert(data.error || 'Could not save delivery details.');
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-white/90">Orders</h1>
          <p className="text-xs text-white/30 mt-1">{orders.length} orders · £{totalRevenue.toLocaleString('en-GB', { minimumFractionDigits: 2 })} total revenue</p>
        </div>
        <div className="admin-card px-4 py-2">
          <span className="text-[10px] text-white/30">Pending: </span>
          <span className="text-[10px] text-[#C5A880] font-medium">{pendingCount}</span>
        </div>
      </div>

      {loading ? (
        <div className="admin-card p-12 text-center">
          <div className="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-white/30">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-sm text-white/30">No orders yet.</p>
        </div>
      ) : (
        <div className="admin-table">
          <table className="w-full">
            <thead>
                <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                  <th>Status</th>
                  <th>Delivery</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order.id}><tr>
                  <td className="text-white/80 font-medium">{order.id}</td>
                  <td>
                    <p className="text-white/70">{order.customer}</p>
                    <p className="text-[10px] text-white/25">{order.email}</p>
                    {order.phone && <p className="text-[10px] text-white/25">{order.phone}</p>}
                  </td>
                  <td className="text-white/40">{new Date(order.date).toLocaleDateString('en-GB')}</td>
                  <td className="text-white/40">{order.items}</td>
                  <td className="text-white/70">£{order.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</td>
                  <td>
                    <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="admin-input py-1 px-2 text-[10px] rounded-lg">
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td><button type="button" onClick={() => editDelivery(order)} className="text-[10px] text-[#C5A880] hover:underline">Add details</button>{order.emailSentAt && <span className="mt-1 block text-[9px] text-emerald-300">Email sent</span>}</td>
                </tr>
                {editingId === order.id && <tr><td colSpan={7}><div className="grid gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[180px_1fr_auto] md:items-end"><label className="text-[10px] uppercase tracking-widest text-white/45">Delivery date<input type="date" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} className="admin-input mt-2 w-full text-xs" /></label><label className="text-[10px] uppercase tracking-widest text-white/45">Sofa details<textarea value={sofaDetails} onChange={(event) => setSofaDetails(event.target.value)} className="admin-input mt-2 min-h-16 w-full resize-y text-xs" placeholder="3-seater, charcoal velvet, left-facing chaise" /></label><div className="flex gap-2"><button type="button" disabled={saving} onClick={() => saveDelivery(false)} className="rounded-lg bg-[#65745d] px-3 py-2 text-[10px] text-white disabled:opacity-50">Save</button><button type="button" disabled={saving} onClick={() => saveDelivery(true)} className="rounded-lg bg-[#C5A880] px-3 py-2 text-[10px] text-slate-950 disabled:opacity-50">Save & email</button></div></div></td></tr>}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[10px] text-white/15 mt-4">Confirmed checkout orders appear here automatically. Update their fulfilment status using the menu above.</p>
    </div>
  );
}
