'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Palette, Repeat2 } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import LazyImage from '@/components/LazyImage';
import ProductRating from '@/components/ProductRating';
import TrySofaButton from '@/components/TrySofaButton';
import { isSofaPreviewUrl } from '@/lib/sofa-preview';
import {
  formatProductPrice, getColourHex, getDefaultVariant, getSavings, getVariantImages,
  type ProductVariant,
} from '@/lib/product-options';

interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  oldPrice?: number | null;
  newPrice: number;
  saveAmount?: number;
  category?: string;
  badge?: string;
  href?: string;
  variants?: ProductVariant[];
  layout?: 'grid' | 'list';
  description?: string | null;
}

function withVariant(href: string, variant?: ProductVariant) {
  if (!variant) return href;
  const [pathAndQuery, hash] = href.split('#');
  const [path, query] = pathAndQuery.split('?');
  const params = new URLSearchParams(query);
  params.set('variant', variant.id);
  return `${path}?${params.toString()}${hash ? `#${hash}` : ''}`;
}

export default function ProductCard({
  id, title, image, oldPrice, newPrice, category, badge, href,
  variants = [], layout = 'grid', description,
}: ProductCardProps) {
  const reduceMotion = useReducedMotion();
  const coloursId = useId();
  const titleId = useId();
  const [coloursOpen, setColoursOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedVariant = variants.find((variant) => variant.id === selectedId) || getDefaultVariant(variants);
  const selectedImage = getVariantImages({ images: [image] }, selectedVariant)[0] || image;
  const selectedPrice = Number(selectedVariant?.price ?? newPrice);
  const savings = getSavings(selectedPrice, oldPrice);
  const productHref = withVariant(href || `/product/${id}`, selectedVariant);
  const isList = layout === 'list';

  return (
    <motion.article
      aria-labelledby={titleId}
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={{ duration: 0.2 }}
      style={{ containerType: 'inline-size' }}
      className={`sofa-detail-card min-w-0 overflow-hidden rounded-[22px] border border-[#dedfd8] bg-white text-left shadow-[0_2px_8px_rgba(38,53,46,0.025)] ${isList ? 'sm:grid sm:grid-cols-[220px_minmax(0,1fr)]' : 'h-full'}`}
    >
      <div
        className={`group relative block aspect-[4/3] overflow-hidden bg-[#f3f3ef] ${isList ? 'sm:aspect-auto sm:min-h-[220px]' : ''}`}
      >
        <Link href={productHref} tabIndex={-1} className="block h-full"><LazyImage
          key={selectedImage}
          src={selectedImage}
          fallback={image}
          alt={`${title}${selectedVariant ? ` in ${selectedVariant.color}` : ''}`}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
        /></Link>
        <TrySofaButton productId={id} variantId={selectedVariant?.id} title={title} />
        {(savings > 0 || badge) && (
          <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-[11px] font-medium text-[#26352e] shadow-sm backdrop-blur-xl">
            {savings > 0 ? `${Math.round(savings / Number(oldPrice) * 100)}% OFF` : badge}
          </span>
        )}
        {isSofaPreviewUrl(selectedImage) && <span className="absolute bottom-3 left-3 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-[10px] font-medium text-[#344536] backdrop-blur-xl">Colour preview</span>}
      </div>

      <div className={`sofa-card-details min-w-0 p-[clamp(10px,5cqw,20px)] ${isList ? 'flex flex-col justify-center' : ''}`}>
        <div className="mb-2 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.12em] text-[#7a8374]">
          <span>{category ? `${category} sofa` : 'Handmade sofa'}</span>
          <ProductRating productId={id} />
        </div>
        <h3 id={titleId} className="text-[clamp(15px,6.8cqw,21px)] font-semibold leading-snug tracking-[-0.025em] text-[#34413a]">
          <Link href={productHref} className="rounded-sm transition-colors hover:text-[#65745d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#65745d]">
            {title}
          </Link>
        </h3>
        {description && <p className={`${isList ? 'text-sm' : 'text-xs'} mt-2 line-clamp-2 leading-relaxed text-[#737d6a]`}>{description}</p>}

        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-3 gap-y-3">
          <div className="min-w-0" aria-label="Price">
            {savings > 0 && (
              <p className="mb-0.5 text-sm font-medium text-[#7c817b]">
                <span className="sr-only">Was </span><del>{formatProductPrice(Number(oldPrice))}</del>
              </p>
            )}
            <p className="whitespace-nowrap text-[clamp(18px,8.5cqw,26px)] font-bold leading-tight tracking-[-0.035em] text-[#34413a]">
              <span className="sr-only">{savings > 0 ? 'Now ' : 'Price '}</span>{formatProductPrice(selectedPrice)}
            </p>
            {savings > 0 && <p className="sofa-saving mt-1 text-[13px] font-bold text-[#263d31]">Save {formatProductPrice(savings)}</p>}
          </div>
          <Link href={productHref} className="inline-flex min-h-[44px] items-center gap-3 rounded-full bg-[#344536] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#243326]">Shop sofa <ArrowUpRight size={16} /></Link>
        </div>

        {variants.length > 0 && (
          <div className="mt-4 border-t border-[#e8e9e2] pt-3">
            <button
              type="button"
              onClick={() => setColoursOpen((open) => !open)}
              aria-expanded={coloursOpen}
              aria-controls={coloursId}
              aria-label={`${coloursOpen ? 'Hide' : 'More'} colours for ${title}`}
              className={`inline-flex min-h-[40px] w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold text-[#4f493e] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#65745d] ${coloursOpen ? 'border-[#cfc09d] bg-[#e9dec7]' : 'border-[#eee5d3] bg-[#f5eddf] hover:bg-[#e9dec7]'}`}
            >
              <span className="inline-flex items-center gap-2"><Palette size={17} strokeWidth={1.7} className="text-[#758061]" aria-hidden="true" />{coloursOpen ? 'Hide colours' : `${variants.length} colour${variants.length === 1 ? '' : 's'} available`}</span>
              <span aria-hidden="true">{coloursOpen ? '−' : '+'}</span>
            </button>
          </div>
        )}

        {variants.length > 1 && <button className="sofa-swap-colour" type="button" onClick={() => { const index = variants.findIndex(variant => variant.id === selectedVariant?.id); setSelectedId(variants[(index + 1) % variants.length].id); }}><Repeat2 size={22} /> SWAP COLOUR SOFA</button>}
        {selectedVariant?.stock === 0 && <p className="mt-3 text-xs font-medium text-[#8a6449]">This colour is currently sold out</p>}

        <div id={coloursId} hidden={!coloursOpen || variants.length === 0}>
          {coloursOpen && variants.length > 0 && (
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="mt-4 border-t border-[#e8e9e2] pt-4"
            >
              <p className="mb-3 text-xs text-[#66715f]">Choose your colour</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={`Colours for ${title}`}>
                {variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const repeatedColour = variants.some((option) => option.id !== variant.id && option.color.toLowerCase() === variant.color.toLowerCase());
                  const optionLabel = `${variant.color}${repeatedColour ? ` · ${variant.range_type}` : ''}`;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedId(variant.id)}
                      aria-pressed={isSelected}
                      aria-label={`${optionLabel}${variant.stock === 0 ? ', sold out' : ''}`}
                      className={`flex min-h-11 max-w-full items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[11px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65745d] motion-reduce:transition-none ${isSelected ? 'border-[#65745d] bg-[#edf1e7] text-[#344536]' : 'border-[#e0e3d9] bg-white text-[#677060] hover:border-[#a6b196] hover:bg-[#f7f8f3]'}`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]" style={{ backgroundColor: getColourHex(variant) }} aria-hidden="true">
                        {isSelected && <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/90 text-[#344536]"><Check size={11} strokeWidth={2.5} /></span>}
                      </span>
                      <span className="min-w-0 break-words">{optionLabel}{variant.stock === 0 && <span className="mt-0.5 block text-[10px] font-normal text-[#8a6449]">Sold out</span>}</span>
                    </button>
                  );
                })}
              </div>
              <p role="status" aria-live="polite" className="sr-only">
                {selectedVariant ? `${selectedVariant.color} selected, ${formatProductPrice(selectedPrice)}${selectedVariant.stock === 0 ? ', sold out' : ''}` : ''}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
