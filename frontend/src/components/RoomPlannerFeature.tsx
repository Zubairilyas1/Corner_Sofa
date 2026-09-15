import Link from 'next/link';
import { ArrowUpRight, Check, ImagePlus, Ruler, Sofa } from 'lucide-react';

export default function RoomPlannerFeature() {
  return <section className="page-container my-10 sm:my-16" aria-labelledby="room-planner-title">
    <div className="relative grid overflow-hidden rounded-[28px] border border-white bg-gradient-to-br from-[#ecf0e4] via-[#f6f7ef] to-[#dee8d4] p-7 shadow-[inset_0_1px_0_white,0_16px_50px_#3445360a] sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:p-12">
      <div className="relative z-10">
        <p className="eyebrow">A little imagination. A better fit.</p>
        <h2 id="room-planner-title" className="mb-4 font-serif text-3xl leading-tight tracking-tight text-[#344536] sm:text-4xl">Your room. Your sofa.<br /><em className="text-[#798968]">See them together.</em></h2>
        <p className="max-w-md text-sm leading-7 text-[#6b765f]">Upload your room photo and choose a sofa to preview it straight away. Explore colours, place a corner sofa along two walls, or choose one wall for a straight sofa.</p>
        <Link href="/room-planner/" className="button-primary mt-6">Plan my room <ArrowUpRight size={18} aria-hidden="true" /></Link>
        <p className="mt-3 text-[11px] text-[#718065]">No sizes required to preview. Your photo stays in your browser.</p>
      </div>
      <div className="relative mt-8 flex min-h-[230px] items-center justify-center lg:mt-0" aria-hidden="true">
        <div className="absolute h-60 w-60 rounded-full bg-[#c4d5b4]/40 blur-3xl" />
        <div className="relative w-full max-w-sm -rotate-3 rounded-2xl border border-white bg-white/60 p-5 shadow-xl shadow-[#344536]/5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-[10px] text-[#728166]"><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#7c986c]" />YOUR ROOM PLAN</span><Ruler size={16} /></div>
          <div className="relative mx-8 my-6 flex h-32 items-center justify-center rounded border-2 border-[#b9c8a8] bg-[linear-gradient(#aabb9618_1px,transparent_1px),linear-gradient(90deg,#aabb9618_1px,transparent_1px)] bg-[size:20px_20px]">
            <Sofa size={85} strokeWidth={1} className="rounded-xl bg-[#d3dec8] px-2 text-[#6a8057]" />
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white bg-[#edf4e5] px-3 py-1 text-[9px] text-[#566c45]">Space to make it yours</span>
          </div>
          <div className="flex items-center justify-between border-t border-[#dbe3d1] pt-3 text-[10px] text-[#718065]"><span className="flex items-center gap-2"><ImagePlus size={13} />Upload · Choose · Place</span><Check size={15} /></div>
        </div>
      </div>
    </div>
  </section>;
}
