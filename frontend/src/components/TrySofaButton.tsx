'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import dynamic from 'next/dynamic';
import { Sofa, X } from 'lucide-react';
const RoomPlanner = dynamic(() => import('@/app/room-planner/RoomPlanner'), { ssr: false, loading: () => <p className="p-8">Loading room preview…</p> });
export default function TrySofaButton({ productId, variantId, title }: { productId: string; variantId?: string; title: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <>
    <button type="button" className="sofa-try-button" onClick={() => setOpen(true)} aria-label={`Try ${title} in your room`}><Sofa size={15} />Try in room</button>
    {open && createPortal(<dialog ref={dialog} className="sofa-room-dialog" aria-label={`Try ${title} in your room`} onCancel={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="sofa-room-dialog-heading"><span>{title}</span><button type="button" aria-label="Close room preview" onClick={() => setOpen(false)}><X size={22} /></button></div>
      <RoomPlanner initialProductId={productId} initialVariantId={variantId} />
    </dialog>, document.body)}
  </>;
}
