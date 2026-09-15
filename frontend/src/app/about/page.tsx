import type { Metadata } from 'next';
import AboutExperience from './AboutExperience';

export const metadata: Metadata = {
  title: 'About Corner Sofa',
  description: 'UK based. Made for your everyday. Discover Corner Sofa, with free UK delivery and cash on delivery available.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutExperience />;
}
