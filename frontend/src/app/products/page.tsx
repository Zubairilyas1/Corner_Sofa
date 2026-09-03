import { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import { Spinner } from '@/components/ui';

export const dynamic = 'force-dynamic';

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[600px] flex items-center justify-center bg-primary">
          <Spinner label="Loading products..." />
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
