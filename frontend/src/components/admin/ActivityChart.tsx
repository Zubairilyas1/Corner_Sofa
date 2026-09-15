'use client';

import { useId, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import styles from './ActivityChart.module.css';

export type ActivityRange = 'year' | 'month' | 'week';
export type ActivityPoint = {
  label: string;
  fullLabel: string;
  orders: number;
  appointments: number;
  swatches: number;
};

interface ActivityChartProps {
  points: ActivityPoint[];
  range: ActivityRange;
  onRangeChange: (range: ActivityRange) => void;
  available: { orders: boolean; appointments: boolean; swatches: boolean };
  loading: boolean;
}

const series = [
  { key: 'orders', label: 'Orders', color: '#ec4388' },
  { key: 'appointments', label: 'Appointments', color: '#7772ff' },
  { key: 'swatches', label: 'Swatches', color: '#e8a2c6' },
] as const;

const periods = [
  { value: 'year', label: '12 months' },
  { value: 'month', label: '30 days' },
  { value: 'week', label: '7 days' },
] as const;

const WIDTH = 600;
const HEIGHT = 160;

// Horizontal control points keep each segment inside its actual data range.
function curve(coordinates: { x: number; y: number }[]) {
  return coordinates.reduce((path, point, index) => {
    if (!index) return `M ${point.x} ${point.y}`;
    const previous = coordinates[index - 1];
    const middle = (previous.x + point.x) / 2;
    return `${path} C ${middle} ${previous.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
  }, '');
}

export default function ActivityChart({ points, range, onRangeChange, available, loading }: ActivityChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const headingId = useId();
  const tooltipId = useId();
  const visibleSeries = series.filter(item => available[item.key]);
  const maximum = Math.max(4, ...points.flatMap(point => visibleSeries.map(item => point[item.key])));
  const step = Math.max(1, Math.ceil(maximum / 4));
  const ceiling = step * 4;
  const isEmpty = !points.some(point => visibleSeries.some(item => point[item.key] > 0));
  const isUnavailable = visibleSeries.length === 0;
  const xAt = (index: number) => points.length <= 1 ? WIDTH / 2 : index / (points.length - 1) * WIDTH;
  const yAt = (value: number) => HEIGHT - value / ceiling * HEIGHT;
  const active = activeIndex === null ? null : points[activeIndex];
  const labelIndexes = Array.from(new Set(Array.from({ length: Math.min(6, points.length) }, (_, index) => (
    Math.round(index * (points.length - 1) / Math.max(1, Math.min(6, points.length) - 1))
  ))));

  const describePoint = (point: ActivityPoint) => `${point.fullLabel}. ${visibleSeries.map(item => `${point[item.key]} ${item.label.toLowerCase()}`).join(', ')}.`;

  return (
    <section className={styles.chart} aria-labelledby={headingId} aria-busy={loading}>
      <div className={styles.heading}>
        <h2 id={headingId}>Store activity</h2>
        <div className={styles.periods} aria-label="Activity time period">
          {periods.map(period => (
            <button
              key={period.value}
              type="button"
              aria-pressed={range === period.value}
              className={range === period.value ? styles.selectedPeriod : undefined}
              onClick={() => { setActiveIndex(null); onRangeChange(period.value); }}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.graph} onMouseLeave={() => setActiveIndex(null)}>
        <div className={styles.yAxis} aria-hidden="true">
          {[4, 3, 2, 1, 0].map(tick => <span key={tick}>{(tick * step).toLocaleString()}</span>)}
        </div>
        <div className={styles.plot}>
          <svg className={styles.svg} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" role="group" aria-label="Orders, appointments, and swatch requests over time">
            <g aria-hidden="true">
              {[0, 1, 2, 3, 4].map(tick => <line key={`h-${tick}`} x1="0" x2={WIDTH} y1={tick / 4 * HEIGHT} y2={tick / 4 * HEIGHT} className={styles.horizontalGrid} />)}
              {labelIndexes.map(index => <line key={`v-${index}`} x1={xAt(index)} x2={xAt(index)} y1="0" y2={HEIGHT} className={styles.verticalGrid} />)}
              {!loading && visibleSeries.map(item => (
                <path key={item.key} d={curve(points.map((point, index) => ({ x: xAt(index), y: yAt(point[item.key]) })))} fill="none" stroke={item.color} strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
              ))}
              {!loading && points.length === 1 && visibleSeries.map(item => (
                <circle key={item.key} cx={WIDTH / 2} cy={yAt(points[0][item.key])} r="3" fill={item.color} />
              ))}
              {!loading && active && activeIndex !== null && (
                <g>
                  <line x1={xAt(activeIndex)} x2={xAt(activeIndex)} y1="0" y2={HEIGHT} className={styles.activeLine} />
                  {visibleSeries.map(item => <circle key={item.key} cx={xAt(activeIndex)} cy={yAt(active[item.key])} r="4" fill={item.color} stroke="#25242a" strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
                </g>
              )}
            </g>
            {!loading && !isUnavailable && points.map((point, index) => (
              <rect
                key={`${point.fullLabel}-${index}`}
                className={styles.hitTarget}
                x={Math.max(0, xAt(index) - WIDTH / Math.max(1, points.length - 1) / 2)}
                y="0"
                width={points.length === 1 ? WIDTH : WIDTH / (points.length - 1) * (index === 0 || index === points.length - 1 ? 0.5 : 1)}
                height={HEIGHT}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={describePoint(point)}
                aria-describedby={activeIndex === index ? tooltipId : undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(index)}
                onKeyDown={event => {
                  if (event.key === 'Escape') setActiveIndex(null);
                  if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setActiveIndex(index); }
                  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    const next = event.key === 'ArrowRight' ? event.currentTarget.nextElementSibling : event.currentTarget.previousElementSibling;
                    if (next?.getAttribute('role') === 'button') (next as SVGElement).focus();
                  }
                }}
              />
            ))}
          </svg>
          {(loading || isEmpty || isUnavailable) && !active && (
            <div className={styles.emptyState} role="status">
              {loading ? <><LoaderCircle size={21} className={styles.spinner} /><strong>Loading your store activity</strong></> : isUnavailable ? <><strong>Activity is temporarily unavailable.</strong><span>Please try refreshing the dashboard.</span></> : <><strong>Your next chapter starts with your first activity.</strong><span>Orders and customer requests will appear here.</span></>}
            </div>
          )}
          {!loading && active && activeIndex !== null && (
            <div id={tooltipId} role="tooltip" className={styles.tooltip} style={{ left: `clamp(92px, ${xAt(activeIndex) / WIDTH * 100}%, calc(100% - 92px))` }}>
              <strong>{active.fullLabel}</strong>
              {visibleSeries.map(item => <span key={item.key}><i style={{ background: item.color }} />{item.label}<b>{active[item.key].toLocaleString()}</b></span>)}
            </div>
          )}
          <div className={styles.xAxis} aria-hidden="true">
            {labelIndexes.map((index, order) => <span key={index} style={{ left: `${xAt(index) / WIDTH * 100}%`, transform: order === 0 && points.length > 1 ? 'none' : order === labelIndexes.length - 1 && points.length > 1 ? 'translateX(-100%)' : 'translateX(-50%)' }}>{points[index].label}</span>)}
          </div>
        </div>
      </div>

      <div className={styles.legend} aria-label="Chart series">
        {series.map(item => <span key={item.key} className={!available[item.key] && !loading ? styles.unavailable : undefined}><i style={{ background: item.color }} />{item.label}{!available[item.key] && !loading && <em>Unavailable</em>}</span>)}
      </div>
    </section>
  );
}
