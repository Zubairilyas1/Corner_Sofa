'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '🛋️' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/swatch-requests', label: 'Swatches', icon: '🎨' },
  { href: '/admin/appointments', label: 'Appointments', icon: '📅' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const expires = localStorage.getItem('admin_token_expires');
    if (token && expires && Date.now() < parseInt(expires)) {
      setAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid password');
        setLoggingIn(false);
        return;
      }

      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_token_expires', data.expiresAt.toString());
      setAuthenticated(true);
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expires');
    setAuthenticated(false);
    setPassword('');
  };

  if (loading) {
    return (
      <main className="admin-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-white/30 tracking-[0.2em] uppercase">Loading...</p>
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="admin-dark flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.08)_0%,transparent_70%)]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(157,102,56,0.06)_0%,transparent_70%)]" />
        </div>

        <div className="admin-card p-10 w-full max-w-sm relative z-10">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[rgba(197,168,128,0.1)] border border-[rgba(197,168,128,0.15)] flex items-center justify-center mx-auto mb-4">
              <span className="text-lg">🔒</span>
            </div>
            <h1 className="text-lg font-light tracking-[0.2em] uppercase text-white/90">Admin Access</h1>
            <p className="text-[10px] text-white/25 mt-2 tracking-[0.15em] uppercase">Enter password to continue</p>
          </div>

          {error && (
            <div className="admin-badge admin-badge-red w-full justify-center mb-4">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input w-full"
            />
            <button
              type="submit"
              disabled={loggingIn}
              className="admin-btn-primary w-full py-3 rounded-xl text-xs uppercase tracking-[0.15em] font-medium disabled:opacity-50"
            >
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="admin-dark flex min-h-screen">
      {/* Sidebar */}
      <aside className="admin-sidebar w-64 flex-shrink-0 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="block">
            <span className="text-sm font-light tracking-[0.25em] uppercase text-white/90">Corner Sofa</span>
            <span className="block text-[9px] text-[#C5A880]/60 mt-1 tracking-[0.2em] uppercase">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-sidebar-link ${isActive(item.href) ? 'active' : ''}`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <Link href="/" className="admin-sidebar-link text-white/30 hover:text-white/60">
            <span>🌐</span>
            <span>View Site</span>
          </Link>
          <button onClick={handleLogout} className="admin-sidebar-link w-full text-left text-white/30 hover:text-red-400">
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(197,168,128,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
