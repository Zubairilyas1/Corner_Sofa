-- ============================================
-- Corner Sofa — Seed Data
-- Run after schema.sql to populate the database
-- ============================================

-- Products (12 sofas across 4 categories)
INSERT INTO products (id, slug, title, description, base_price, images, category) VALUES

-- 2-Seater Sofas
('a1000000-0000-0000-0000-000000000001', 'chesterfield-2-seater', 'Chesterfield 2-Seater Sofa',
 'Classic deep buttoned Chesterfield in genuine leather. Solid hardwood frame with serpentine springs for lasting comfort.',
 2199.00,
 ARRAY['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'],
 '2-Seater'),

('a1000000-0000-0000-0000-000000000002', 'velvet-2-seater', 'Velvet 2-Seater Sofa',
 'Plush velvet upholstery with slim oak legs. Compact design perfect for smaller living spaces.',
 1799.00,
 ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'],
 '2-Seater'),

('a1000000-0000-0000-0000-000000000003', 'linen-2-seater', 'Linen 2-Seater Sofa',
 'Relaxed linen blend with feather-filled cushions. Timeless rolled arms and turnip legs.',
 1499.00,
 ARRAY['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800'],
 '2-Seater'),

-- 3-Seater Sofas
('a1000000-0000-0000-0000-000000000004', 'velvet-3-seater', 'Velvet 3-Seater Sofa',
 'Luxurious velvet 3-seater with deep seat and supportive back cushions. Handcrafted in the UK.',
 2499.00,
 ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'],
 '3-Seater'),

('a1000000-0000-0000-0000-000000000005', 'boucle-3-seater', 'Bouclé 3-Seater Sofa',
 'Trendy bouclé fabric with cloud-like comfort. Oversized proportions for ultimate lounging.',
 2899.00,
 ARRAY['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
 '3-Seater'),

('a1000000-0000-0000-0000-000000000006', 'leather-3-seater', 'Leather 3-Seater Sofa',
 'Premium aniline leather with natural patina. Solid oak frame and hand-stitched detailing.',
 2799.00,
 ARRAY['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'],
 '3-Seater'),

-- Corner Sofas
('a1000000-0000-0000-0000-000000000007', 'velvet-corner-left', 'Velvet Corner Sofa — Left Facing',
 'Generous L-shaped corner in premium velvet. Reversible cushion design for flexible styling.',
 3299.00,
 ARRAY['https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
 'Corner'),

('a1000000-0000-0000-0000-000000000008', 'velvet-corner-right', 'Velvet Corner Sofa — Right Facing',
 'Mirror of our best-selling left-facing corner. Same premium velvet and construction.',
 3299.00,
 ARRAY['https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'],
 'Corner'),

('a1000000-0000-0000-0000-000000000009', 'leather-corner', 'Leather Corner Sofa',
 'Statement corner in full-grain leather. Wide arms and deep seats for a luxurious feel.',
 3599.00,
 ARRAY['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
 'Corner'),

-- Recliners
('a1000000-0000-0000-0000-000000000010', 'velvet-recliner-pair', 'Velvet Recliner Pair',
 'Set of 2 electric recliners in soft velvet. USB charging port and adjustable headrest.',
 2999.00,
 ARRAY['https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800'],
 'Recliner'),

('a1000000-0000-0000-0000-000000000011', 'leather-recliner', 'Leather Recliner Sofa',
 'Manual recliner in durable bonded leather. Solid mechanism with 5-year guarantee.',
 2299.00,
 ARRAY['https://images.unsplash.com/photo-1540574163026-643ea20d5d5d?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1512212621149-107ffe572d2f?auto=format&fit=crop&q=80&w=800'],
 'Recliner'),

('a1000000-0000-0000-0000-000000000012', 'fabric-recliner-pair', 'Fabric Recliner Pair',
 'Set of 2 manual recliners in easy-clean fabric. Foam-filled cushions and lumbar support.',
 1799.00,
 ARRAY['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800'],
 'Recliner');

-- Product Variants
INSERT INTO product_variants (product_id, range_type, sku, price, color, stock) VALUES

-- Chesterfield 2-Seater
('a1000000-0000-0000-0000-000000000001', '2-Seater', 'CH-2S-COG', 2199.00, 'Cognac', 3),
('a1000000-0000-0000-0000-000000000001', '2-Seater', 'CH-2S-BLK', 2299.00, 'Black', 2),

-- Velvet 2-Seater
('a1000000-0000-0000-0000-000000000002', '2-Seater', 'VL-2S-BNV', 1799.00, 'Bourneville', 5),
('a1000000-0000-0000-0000-000000000002', '2-Seater', 'VL-2S-CHC', 1799.00, 'Charcoal', 4),
('a1000000-0000-0000-0000-000000000002', '2-Seater', 'VL-2S-BEG', 1849.00, 'Beige', 6),

-- Linen 2-Seater
('a1000000-0000-0000-0000-000000000003', '2-Seater', 'LN-2S-MSH', 1499.00, 'Mushroom', 7),
('a1000000-0000-0000-0000-000000000003', '2-Seater', 'LN-2S-CRM', 1499.00, 'Cream', 5),

-- Velvet 3-Seater
('a1000000-0000-0000-0000-000000000004', '3-Seater', 'VL-3S-BNV', 2499.00, 'Bourneville', 3),
('a1000000-0000-0000-0000-000000000004', '3-Seater', 'VL-3S-CHC', 2499.00, 'Charcoal', 4),
('a1000000-0000-0000-0000-000000000004', '3-Seater', 'VL-3S-IVR', 2599.00, 'Ivory', 2),

-- Bouclé 3-Seater
('a1000000-0000-0000-0000-000000000005', '3-Seater', 'BC-3S-CRM', 2899.00, 'Cream', 3),
('a1000000-0000-0000-0000-000000000005', '3-Seater', 'BC-3S-GRF', 2999.00, 'Grey', 2),

-- Leather 3-Seater
('a1000000-0000-0000-0000-000000000006', '3-Seater', 'LT-3S-COG', 2799.00, 'Cognac', 2),
('a1000000-0000-0000-0000-000000000006', '3-Seater', 'LT-3S-BLK', 2899.00, 'Black', 3),

-- Velvet Corner Left
('a1000000-0000-0000-0000-000000000007', 'Left Facing', 'VL-CL-BNV', 3299.00, 'Bourneville', 2),
('a1000000-0000-0000-0000-000000000007', 'Left Facing', 'VL-CL-CHC', 3299.00, 'Charcoal', 3),

-- Velvet Corner Right
('a1000000-0000-0000-0000-000000000008', 'Right Facing', 'VL-CR-BNV', 3299.00, 'Bourneville', 2),
('a1000000-0000-0000-0000-000000000008', 'Right Facing', 'VL-CR-CHC', 3299.00, 'Charcoal', 4),

-- Leather Corner
('a1000000-0000-0000-0000-000000000009', 'Corner', 'LT-CO-COG', 3599.00, 'Cognac', 1),
('a1000000-0000-0000-0000-000000000009', 'Corner', 'LT-CO-BLK', 3699.00, 'Black', 2),

-- Velvet Recliner Pair
('a1000000-0000-0000-0000-000000000010', 'Recliner Pair', 'VL-RP-BNV', 2999.00, 'Bourneville', 3),
('a1000000-0000-0000-0000-000000000010', 'Recliner Pair', 'VL-RP-CHC', 2999.00, 'Charcoal', 2),

-- Leather Recliner
('a1000000-0000-0000-0000-000000000011', 'Recliner', 'LT-RC-COG', 2299.00, 'Cognac', 4),
('a1000000-0000-0000-0000-000000000011', 'Recliner', 'LT-RC-BLK', 2399.00, 'Black', 3),

-- Fabric Recliner Pair
('a1000000-0000-0000-0000-000000000012', 'Recliner Pair', 'FB-RP-GRF', 1799.00, 'Light Grey', 5),
('a1000000-0000-0000-0000-000000000012', 'Recliner Pair', 'FB-RP-MSH', 1799.00, 'Mushroom', 4);

-- Fabric Swatches
INSERT INTO swatches (name, hex_color, image_url, material) VALUES
('Bourneville Velvet', '#5C3A21', '/swatches/bourneville.jpg', 'Velvet'),
('Charcoal Velvet', '#36454F', '/swatches/charcoal.jpg', 'Velvet'),
('Beige Linen', '#D4C5A9', '/swatches/beige.jpg', 'Linen'),
('Graphite Velvet', '#474A51', '/swatches/graphite.jpg', 'Velvet'),
('Mushroom Linen', '#C4B8A8', '/swatches/mushroom.jpg', 'Linen'),
('Cream Bouclé', '#FFFDD0', '/swatches/cream.jpg', 'Bouclé'),
('Cognac Leather', '#8B4513', '/swatches/cognac.jpg', 'Leather'),
('Black Leather', '#1A1A1A', '/swatches/black.jpg', 'Leather'),
('Ivory Velvet', '#FFFFF0', '/swatches/ivory.jpg', 'Velvet'),
('Light Grey Fabric', '#D3D3D3', '/swatches/light-grey.jpg', 'Fabric'),
('Mink Leather', '#8B7355', '/swatches/mink.jpg', 'Leather'),
('Oatmeal Bouclé', '#D4C5A0', '/swatches/oatmeal.jpg', 'Bouclé');
