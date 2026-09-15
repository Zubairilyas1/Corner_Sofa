import Link from 'next/link';
import { ArrowUpRight, Sofa } from 'lucide-react';

export default function RoomPlannerLink() {
  return <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-b border-[#d6ddcc] bg-[#edf1e6] px-4 py-2 text-sm text-[#344536]">
    <span className="hidden sm:inline">See your favourite sofa in your own space.</span>
    <Link href="/room-planner/" className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 font-semibold underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
      <Sofa size={18} aria-hidden="true" /> Try in your room <ArrowUpRight size={16} aria-hidden="true" />
    </Link>
  </div>;
}
