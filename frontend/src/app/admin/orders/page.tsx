'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  status: string;
  date: string;
}

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-001', customer: 'Emma Richardson', email: 'emma@example.com', total: 2499.00, items: 1, status: 'delivered', date: '2026-08-28' },
  { id: 'ORD-002', customer: 'James Thompson', email: 'james@example.com', total: 3299.00, items: 1, status: 'shipped', date: '2026-08-30' },
  { id: 'ORD-003', customer: 'Sophie Hughes', email: 'sophie@example.com', total: 1799.00, items: 2, status: 'processing', date: '2026-09-01' },
  { id: 'ORD-004', customer: 'David Mitchell', email: 'david@example.com', total: 3599.00, items: 1, status: 'pending', date: '2026-09-01' },
  { id: 'ORD-005', customer: 'Sarah Kingsley', email: 'sarah@example.com', total: 2199.00, items: 1, status: 'pending', date: '2026-09-02' },
];

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

  useEffect(() => {
    setTimeout(() => {
      setOrders(MOCK_ORDERS);
      setLoading(false);
    }, 300);
  }, []);

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: newStatus } : o));
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;

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
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="text-white/80 font-medium">{order.id}</td>
                  <td>
                    <p className="text-white/70">{order.customer}</p>
                    <p className="text-[10px] text-white/25">{order.email}</p>
                  </td>
                  <td className="text-white/40">{order.date}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[10px] text-white/15 mt-4">Orders are managed via Stripe. Connect a Stripe webhook to populate this table with live data.</p>
    </div>
  );
}
