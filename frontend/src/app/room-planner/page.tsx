import type { Metadata } from 'next';
import RoomPlanner from './RoomPlanner';

export const metadata: Metadata = {
  title: 'Plan my room | See your sofa at home',
  description: 'Upload a room photo and preview sofas straight away. Explore colours, choose adjoining walls for corner sofas, and adjust visual spacing. Measurements are optional.',
};

export default function RoomPlannerPage() { return <RoomPlanner />; }
