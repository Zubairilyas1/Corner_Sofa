'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  category: string;
  images: string[];
  variants: { id: string; color: string; stock: number; price: number; range_type: string }[];
}

const MOCK_PRODUCTS: Product[] = [
  { id: 'a1000000-0000-0000-0000-000000000001', slug: 'chesterfield-2-seater', title: 'Chesterfield 2-Seater Sofa', base_price: 2199.00, category: '2-Seater', images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v1', color: 'Cognac', stock: 3, price: 2199.00, range_type: '2-Seater' }] },
  { id: 'a1000000-0000-0000-0000-000000000002', slug: 'velvet-2-seater', title: 'Velvet 2-Seater Sofa', base_price: 1799.00, category: '2-Seater', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v2', color: 'Bourneville', stock: 5, price: 1799.00, range_type: '2-Seater' }] },
  { id: 'a1000000-0000-0000-0000-000000000003', slug: 'linen-2-seater', title: 'Linen 2-Seater Sofa', base_price: 1499.00, category: '2-Seater', images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v3', color: 'Mushroom', stock: 7, price: 1499.00, range_type: '2-Seater' }] },
  { id: 'a1000000-0000-0000-0000-000000000004', slug: 'velvet-3-seater', title: 'Velvet 3-Seater Sofa', base_price: 2499.00, category: '3-Seater', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v4', color: 'Charcoal', stock: 3, price: 2499.00, range_type: '3-Seater' }] },
  { id: 'a1000000-0000-0000-0000-000000000005', slug: 'boucle-3-seater', title: 'Bouclé 3-Seater Sofa', base_price: 2899.00, category: '3-Seater', images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v5', color: 'Cream', stock: 3, price: 2899.00, range_type: '3-Seater' }] },
  { id: 'a1000000-0000-0000-0000-000000000006', slug: 'leather-3-seater', title: 'Leather 3-Seater Sofa', base_price: 2799.00, category: '3-Seater', images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v6', color: 'Cognac', stock: 2, price: 2799.00, range_type: '3-Seater' }] },
  { id: 'a1000000-0000-0000-0000-000000000007', slug: 'velvet-corner-left', title: 'Velvet Corner Sofa — Left', base_price: 3299.00, category: 'Corner', images: ['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v7', color: 'Bourneville', stock: 2, price: 3299.00, range_type: 'Left Facing' }] },
  { id: 'a1000000-0000-0000-0000-000000000008', slug: 'velvet-corner-right', title: 'Velvet Corner Sofa — Right', base_price: 3299.00, category: 'Corner', images: ['https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v8', color: 'Charcoal', stock: 4, price: 3299.00, range_type: 'Right Facing' }] },
  { id: 'a1000000-0000-0000-0000-000000000009', slug: 'leather-corner', title: 'Leather Corner Sofa', base_price: 3599.00, category: 'Corner', images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v9', color: 'Cognac', stock: 1, price: 3599.00, range_type: 'Corner' }] },
  { id: 'a1000000-0000-0000-0000-000000000010', slug: 'velvet-recliner-pair', title: 'Velvet Recliner Pair', base_price: 2999.00, category: 'Recliner', images: ['https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v10', color: 'Bourneville', stock: 3, price: 2999.00, range_type: 'Recliner Pair' }] },
  { id: 'a1000000-0000-0000-0000-000000000011', slug: 'leather-recliner', title: 'Leather Recliner Sofa', base_price: 2299.00, category: 'Recliner', images: ['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v11', color: 'Cognac', stock: 4, price: 2299.00, range_type: 'Recliner' }] },
  { id: 'a1000000-0000-0000-0000-000000000012', slug: 'fabric-recliner-pair', title: 'Fabric Recliner Pair', base_price: 1799.00, category: 'Recliner', images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'], variants: [{ id: 'v12', color: 'Light Grey', stock: 5, price: 1799.00, range_type: 'Recliner Pair' }] },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', base_price: 0, category: '', description: '' });
  const [createForm, setCreateForm] = useState({ title: '', base_price: 0, category: '2-Seater', description: '', images: '' });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          setProducts(data);
          setLoading(false);
          return;
        }
      }
    } catch { /* fall through */ }
    setProducts(MOCK_PRODUCTS);
    setLoading(false);
  }

  const categories = ['All', ...new Set(products.map((p) => p.category))];
  const filtered = filter === 'All' ? products : products.filter((p) => p.category === filter);
  const totalVariants = products.reduce((sum, p) => sum + (p.variants?.length || 0), 0);
  const lowStock = products.reduce((sum, p) => sum + (p.variants?.filter((v) => v.stock <= 3).length || 0), 0);

  const handleCreate = async () => {
    if (!createForm.title || !createForm.base_price) return;
    setSaving(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createForm.title,
          base_price: createForm.base_price,
          category: createForm.category,
          description: createForm.description,
          images: createForm.images ? [createForm.images] : [],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProducts((prev) => [data.product, ...prev]);
        setShowCreate(false);
        setCreateForm({ title: '', base_price: 0, category: '2-Seater', description: '', images: '' });
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ title: product.title, base_price: product.base_price, category: product.category, description: '' });
  };

  const handleSaveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => p.id === id ? { ...p, ...editForm } : p));
        setEditingId(null);
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch { /* ignore */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-white/90">Products</h1>
          <p className="text-xs text-white/30 mt-1">{products.length} products · {totalVariants} variants · {lowStock} low stock</p>
        </div>
        <button onClick={() => setShowCreate(!showCreate)} className="admin-btn-primary px-6 py-2.5 rounded-xl text-xs">
          {showCreate ? 'Cancel' : '+ New Product'}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="admin-card p-6 mb-6">
          <h2 className="text-sm font-medium tracking-[0.1em] uppercase text-white/70 mb-4">Create New Product</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] block mb-1.5">Title *</label>
              <input value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} className="admin-input w-full" placeholder="Product name" />
            </div>
            <div>
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] block mb-1.5">Price (£) *</label>
              <input type="number" value={createForm.base_price || ''} onChange={(e) => setCreateForm({ ...createForm, base_price: parseFloat(e.target.value) || 0 })} className="admin-input w-full" placeholder="0.00" />
            </div>
            <div>
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] block mb-1.5">Category</label>
              <select value={createForm.category} onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })} className="admin-input w-full">
                <option value="2-Seater">2-Seater</option>
                <option value="3-Seater">3-Seater</option>
                <option value="Corner">Corner</option>
                <option value="Recliner">Recliner</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] block mb-1.5">Image URL</label>
              <input value={createForm.images} onChange={(e) => setCreateForm({ ...createForm, images: e.target.value })} className="admin-input w-full" placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="text-[10px] text-white/30 uppercase tracking-[0.15em] block mb-1.5">Description</label>
              <textarea value={createForm.description} onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })} className="admin-input w-full h-20 resize-none" placeholder="Product description" />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button onClick={handleCreate} disabled={!createForm.title || !createForm.base_price || saving} className="admin-btn-primary px-6 py-2 rounded-xl text-xs disabled:opacity-30">
              {saving ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.15em] font-medium transition-all ${filter === cat ? 'admin-btn-primary' : 'admin-btn'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="admin-card p-12 text-center">
          <div className="w-6 h-6 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-white/30">Loading products...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <p className="text-sm text-white/30">No products found.</p>
        </div>
      ) : (
        <div className="admin-table">
          <table className="w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Variants</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img src={product.images[0]} alt={product.title} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                      <div>
                        {editingId === product.id ? (
                          <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="admin-input text-sm py-1 px-2" />
                        ) : (
                          <p className="text-sm text-white/80 font-medium">{product.title}</p>
                        )}
                        <p className="text-[10px] text-white/20">{product.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge admin-badge-gold">{product.category}</span>
                  </td>
                  <td>
                    {editingId === product.id ? (
                      <input type="number" value={editForm.base_price} onChange={(e) => setEditForm({ ...editForm, base_price: parseFloat(e.target.value) || 0 })} className="admin-input w-28 text-sm py-1 px-2" />
                    ) : (
                      <span className="text-white/70">£{product.base_price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</span>
                    )}
                  </td>
                  <td className="text-white/40">{product.variants?.length || 0}</td>
                  <td>
                    {product.variants?.some((v) => v.stock <= 3) ? (
                      <span className="admin-badge admin-badge-amber">Low Stock</span>
                    ) : (
                      <span className="admin-badge admin-badge-green">In Stock</span>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      {editingId === product.id ? (
                        <>
                          <button onClick={() => handleSaveEdit(product.id)} disabled={saving} className="text-[10px] text-[#C5A880] hover:underline uppercase tracking-widest">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-[10px] text-white/30 hover:underline uppercase tracking-widest">Cancel</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(product)} className="text-[10px] text-[#C5A880] hover:underline uppercase tracking-widest">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="text-[10px] text-red-400 hover:underline uppercase tracking-widest">Delete</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
