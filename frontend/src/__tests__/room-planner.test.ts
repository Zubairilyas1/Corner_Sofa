import { describe, expect, it } from 'vitest';
import { cornerPlacement, ROOM_CORNERS, estimateWalls, homography, placeSofa, unitSquare, validQuad, WALLS, type Quad } from '@/lib/room-planner';

describe('room measurements', () => {
  it('recovers known room lengths from a perspective floor reference', () => {
    const camera = homography(unitSquare, [{ x: .25, y: .3 }, { x: .75, y: .3 }, { x: .95, y: .9 }, { x: .05, y: .9 }]);
    const floor = unitSquare.map(camera) as Quad;
    const reference = [{ x: .25, y: .25 }, { x: .5, y: .25 }, { x: .5, y: .5 }, { x: .25, y: .5 }].map(camera) as Quad;
    expect(estimateWalls(floor, reference, 100, 125)).toEqual({ back: 400, right: 500, front: 400, left: 500 });
  });
  it('rejects crossed corners and unknown scale', () => {
    expect(validQuad([unitSquare[0], unitSquare[2], unitSquare[1], unitSquare[3]])).toBe(false);
    expect(() => estimateWalls(unitSquare, unitSquare, NaN, 100)).toThrow();
    expect(() => estimateWalls(unitSquare, unitSquare, 0, 0)).toThrow();
  });
});

describe('sofa clearances', () => {
  const input = { roomWidth: 400, roomDepth: 500, sofaWidth: 240, sofaDepth: 160, wall: 'back' as const, sideGap: 20, backGap: 10, frontGap: 60, position: 50 };
  it('subtracts the sofa and preserves requested free space', () => {
    expect(placeSofa(input)).toMatchObject({ fits: true, start: 80, end: 80, openFloor: 330, freeAlong: 120, freeAcross: 270 });
    expect(placeSofa({ ...input, position: 0 })).toMatchObject({ start: 20, end: 140 });
  });
  it.each(WALLS)('keeps a fitting sofa inside the room on the %s wall', wall => {
    const placement = placeSofa({ ...input, wall })!;
    expect(placement.fits).toBe(true);
    for (const point of placement.corners) {
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(input.roomWidth);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(input.roomDepth);
    }
  });
  it('rejects oversized sofas, excessive gaps and invalid measurements', () => {
    expect(placeSofa({ ...input, sofaWidth: 401 })?.fits).toBe(false);
    expect(placeSofa({ ...input, frontGap: 400 })?.fits).toBe(false);
    expect(placeSofa({ ...input, sideGap: -1 })).toBeNull();
    expect(placeSofa({ ...input, roomWidth: Infinity })).toBeNull();
    expect(placeSofa({ ...input, sofaWidth: 360, sofaDepth: 430 })?.fits).toBe(true);
  });
});

describe('corner sofas follow adjoining walls', () => {
  it.each(ROOM_CORNERS)('anchors both chaise orientations at the %s room corner', corner => {
    for (const chaise of ['left', 'right'] as const) {
      const anchor = cornerPlacement(corner, chaise);
      expect(new Set(anchor.walls).size).toBe(2);
      expect(anchor.walls).toContain(anchor.wall);
      const placed = placeSofa({ roomWidth: 400, roomDepth: 500, sofaWidth: 240, sofaDepth: 160, sideGap: 20, backGap: 20, frontGap: 0, ...anchor })!;
      const junction = placed.transform({ x: chaise === 'left' ? 0 : 240, y: 0 });
      expect(junction).toEqual({ x: corner.endsWith('left') ? 20 : 380, y: corner.startsWith('back') ? 20 : 480 });
    }
  });
});
