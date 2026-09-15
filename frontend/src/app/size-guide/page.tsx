import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sofa Size Guide',
  description: 'Complete sofa sizing guide. Find the perfect fit for your living room with our detailed measurements for 2-seater, 3-seater, corner, and recliner sofas.',
  alternates: { canonical: '/size-guide' },
};

const sizes = [
  {
    type: '2-Seater',
    dimensions: 'W 150–170cm × D 90–100cm × H 80–90cm',
    seats: '2 people',
    roomMin: '3m × 3m',
    description: 'Compact yet comfortable. Perfect for smaller living rooms, apartments, or as a secondary seating area.',
    image: '/images/sofas/premium-two-seater.webp',
  },
  {
    type: '3-Seater',
    dimensions: 'W 200–220cm × D 90–100cm × H 80–90cm',
    seats: '3 people',
    roomMin: '3.5m × 3.5m',
    description: 'The classic family sofa. Generous seating for everyday comfort without overwhelming the room.',
    image: '/images/sofas/premium-three-seater.webp',
  },
  {
    type: 'Corner (Left/Right)',
    dimensions: 'W 250–280cm × D 170–190cm × H 80–90cm',
    seats: '4–5 people',
    roomMin: '4m × 4m',
    description: 'Maximise seating in open-plan spaces. The L-shape creates a natural conversation area.',
    image: '/images/sofas/premium-corner.webp',
  },
  {
    type: 'Recliner',
    dimensions: 'W 85–100cm × D 95–105cm × H 100–110cm (per seat)',
    seats: '1–2 people',
    roomMin: '2.5m × 2.5m',
    description: 'Individual comfort with reclining backrest. Allow 40cm clearance behind for full recline.',
    image: '/images/sofas/premium-recliners.webp',
  },
];

const tips = [
  { title: 'Measure Your Doorways', content: 'Check door, hallway, and staircase dimensions. Our delivery team can navigate tight spaces, but knowing measurements helps plan the route.' },
  { title: 'Consider Room Layout', content: 'Leave 40–50cm between the sofa and coffee table, and 80–90cm for walkways behind or beside the sofa.' },
  { title: 'Account for Recline Space', content: 'Recliners need 40cm clearance behind the backrest. Wall-hugger models need only 5cm.' },
  { title: 'Corner Sofa Orientation', content: 'Left-facing = chaise on the left when facing the sofa. Measure your room to determine which orientation fits.' },
  { title: 'Seat Depth Matters', content: 'Standard seat depth is 50–55cm. Deeper seats (60cm+) are more lounging-friendly; shallower seats are better for upright seating.' },
  { title: 'Arm Width Counts', content: 'Wide arms can add 15–20cm to overall width. Factor this into your room measurements.' },
];

export default function SizeGuidePage() {
  return (
    <div className="bg-primary relative overflow-hidden">
      <div className="bg-orb bg-orb-accent w-[500px] h-[500px] -top-40 -right-40 absolute pointer-events-none" />
      <div className="bg-orb bg-orb-gold w-[400px] h-[400px] top-[50%] -left-40 absolute pointer-events-none" />

      {/* Hero */}
      <section className="py-20 glass-white border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.15em] text-dark uppercase mb-4">
            Size Guide
          </h1>
          <div className="glass-divider max-w-[120px] mx-auto mb-4" />
          <p className="text-sm text-dark/50 tracking-[0.1em] max-w-xl mx-auto">
            Find the perfect fit for your space. All measurements are approximate and may vary by ±2cm.
          </p>
        </div>
      </section>

      {/* Size Cards */}
      <section className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sizes.map((size) => (
              <div key={size.type} className="glass-card rounded-2xl overflow-hidden">
                <div className="aspect-[16/7] overflow-hidden">
                  <img src={size.image} alt={size.type} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-light tracking-[0.15em] text-dark uppercase mb-3">{size.type}</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] text-dark/40 uppercase tracking-[0.2em] mb-1">Dimensions</p>
                      <p className="text-xs text-dark/70">{size.dimensions}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark/40 uppercase tracking-[0.2em] mb-1">Seats</p>
                      <p className="text-xs text-dark/70">{size.seats}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-dark/40 uppercase tracking-[0.2em] mb-1">Min Room Size</p>
                      <p className="text-xs text-dark/70">{size.roomMin}</p>
                    </div>
                  </div>
                  <p className="text-sm text-dark/50 leading-relaxed">{size.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-light tracking-[0.15em] text-dark uppercase text-center mb-12">
            Measuring Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div key={i} className="glass-white rounded-2xl p-6">
                <h3 className="text-sm font-medium tracking-[0.1em] text-dark uppercase mb-2">{tip.title}</h3>
                <p className="text-sm text-dark/50 leading-relaxed">{tip.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
