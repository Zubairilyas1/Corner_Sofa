'use client';

import { useState, useEffect } from 'react';
import { Button, Spinner } from '@/components/ui';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

interface Swatch {
  id: string;
  name: string;
  hex_color: string;
  image_url: string | null;
  material: string;
}

const MOCK_SWATCHES: Swatch[] = [
  { id: 's1', name: 'Bourneville', hex_color: '#5C3A21', image_url: null, material: 'Velvet' },
  { id: 's2', name: 'Charcoal', hex_color: '#36454F', image_url: null, material: 'Velvet' },
  { id: 's3', name: 'Beige', hex_color: '#D4C5A9', image_url: null, material: 'Linen' },
  { id: 's4', name: 'Graphite', hex_color: '#474A51', image_url: null, material: 'Velvet' },
  { id: 's5', name: 'Mushroom', hex_color: '#C4B8A8', image_url: null, material: 'Linen' },
  { id: 's6', name: 'Cream', hex_color: '#FFFDD0', image_url: null, material: 'Bouclé' },
  { id: 's7', name: 'Cognac', hex_color: '#8B4513', image_url: null, material: 'Leather' },
  { id: 's8', name: 'Black', hex_color: '#1A1A1A', image_url: null, material: 'Leather' },
  { id: 's9', name: 'Ivory', hex_color: '#FFFFF0', image_url: null, material: 'Velvet' },
  { id: 's10', name: 'Light Grey', hex_color: '#D3D3D3', image_url: null, material: 'Fabric' },
  { id: 's11', name: 'Mink', hex_color: '#8B7355', image_url: null, material: 'Leather' },
  { id: 's12', name: 'Oatmeal', hex_color: '#D4C5A0', image_url: null, material: 'Bouclé' },
];

const MATERIAL_DESCRIPTIONS: Record<string, string> = {
  Velvet: 'Plush, soft-touch velvet with a luxurious sheen. Ideal for formal living rooms.',
  Linen: 'Relaxed, breathable linen blend. Pre-washed for a soft, lived-in feel from day one.',
  Bouclé: 'Textured looped yarn creating a cozy, trendy look. Perfect for contemporary spaces.',
  Leather: 'Genuine aniline leather that ages beautifully. Durable and easy to maintain.',
  Fabric: 'Easy-clean, family-friendly fabric. Stain-resistant and built for everyday use.',
};

export default function SwatchesPage() {
  const [swatches, setSwatches] = useState<Swatch[]>(MOCK_SWATCHES);
  const [loading, setLoading] = useState(true);
  const [selectedSwatch, setSelectedSwatch] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const addSwatchToBasket = () => {
    const swatch = swatches.find((item) => item.id === selectedSwatch);
    if (!swatch) return;
    addItem({ productId: `swatch-${swatch.id}`, variantId: `swatch-${swatch.id}`, range_type: swatch.material, color: swatch.name, price: 0, image: swatch.image_url || '/placeholder.svg', title: `Fabric swatch — ${swatch.name}`, itemType: 'swatch' });
    setAdded(true);
  };

  useEffect(() => {
    async function fetchSwatches() {
      try {
        const res = await fetch('/api/swatches');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) setSwatches(data);
        }
      } catch { /* use mock */ }
      setLoading(false);
    }
    fetchSwatches();
  }, []);

  const grouped = swatches.reduce<Record<string, Swatch[]>>((acc, s) => {
    (acc[s.material] ||= []).push(s);
    return acc;
  }, {});

  return (
    <div className="bg-white min-h-screen">
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">Free Fabric Samples</p>
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] text-dark uppercase mb-4">
            Feel the Quality
          </h1>
          <p className="text-sm tracking-widest text-dark/60 uppercase font-medium max-w-lg mx-auto">
            Choose one free fabric swatch and add it to your sofa basket
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {loading ? (
          <div className="py-32 flex justify-center">
            <Spinner label="Loading swatches..." />
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([material, items]) => (
              <section key={material} className="mb-16">
                <div className="mb-6">
                  <h2 className="text-xl font-light tracking-[0.15em] text-dark uppercase mb-2">
                    {material}
                  </h2>
                  <p className="text-sm text-dark/60">{MATERIAL_DESCRIPTIONS[material] || ''}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {items.map((swatch) => (
                    <div
                      key={swatch.id}
                      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-dark/20 hover:shadow-lg transition-all duration-300"
                    >
                      <div
                        className="aspect-square w-full"
                        style={{ backgroundColor: swatch.hex_color }}
                      />
                      <div className="p-4">
                        <p className="text-sm font-medium text-dark">{swatch.name}</p>
                        <p className="text-xs text-dark/50 mt-0.5">{material}</p>
                        <button
                          type="button"
                          onClick={() => { setSelectedSwatch(swatch.id); setAdded(false); }}
                          aria-pressed={selectedSwatch === swatch.id}
                          className={`mt-3 w-full rounded-lg border px-3 py-2 text-[10px] font-medium uppercase tracking-widest transition-colors ${selectedSwatch === swatch.id ? 'border-accent bg-accent text-white' : 'border-dark/15 text-dark hover:border-accent hover:text-accent'}`}
                        >
                          {selectedSwatch === swatch.id ? 'Selected' : 'Select swatch'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <div className="text-center pt-8 border-t border-gray-200">
              <p className="text-sm text-dark/60 mb-6">
                Choose one swatch and add it to your basket with a sofa. Swatches cannot be purchased on their own.
              </p>
              <Button variant="primary" size="lg" onClick={addSwatchToBasket} disabled={!selectedSwatch}>
                Add selected swatch to basket
              </Button>
              {added && <div className="mt-4"><p className="text-sm text-green-700">Swatch added to your basket.</p><Link href="/cart" className="mt-2 inline-block text-xs font-medium text-dark underline underline-offset-4">View basket</Link></div>}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
