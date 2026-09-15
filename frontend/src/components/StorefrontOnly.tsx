'use client';

import { usePathname } from 'next/navigation';

/** Keep the shopping header and footer out of the admin workspace. */
export default function StorefrontOnly({ children, hideOnHome = false, hideOn = [] }: { children: React.ReactNode; hideOnHome?: boolean; hideOn?: string[] }) {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return null;
  if (hideOnHome && pathname === '/') return null;
  if (hideOn.includes(pathname.replace(/\/$/, '') || '/')) return null;
  return <>{children}</>;
}
