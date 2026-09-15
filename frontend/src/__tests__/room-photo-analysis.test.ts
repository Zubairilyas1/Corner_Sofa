import { describe, expect, it } from 'vitest';
import { detectSofaBaselineRotation, detectWallFloorPixels, groundedSofaBox } from '@/lib/room-photo-analysis';

function room(width: number, height: number, boundary: number) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const p = (y * width + x) * 4;
    const value = y < boundary ? 220 : 60 + (x % 7);
    data[p] = value; data[p + 1] = value; data[p + 2] = value; data[p + 3] = 255;
  }
  return data;
}

describe('room photo wall/floor placement', () => {
  it.each([40, 72, 90])('detects a full-width boundary at %s%% of the photo', percent => {
    const width = 120, height = 100;
    expect(detectWallFloorPixels(room(width, height, percent), width, height)).toBeCloseTo(percent / 100, 1);
  });

  it('keeps a large sofa complete and grounded near a low floor line', () => {
    const box = groundedSofaBox(.94, .94, .9, { x: .5, y: .5 });
    expect(box.height).toBe(.7);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(.98);
    expect(box.y + box.height).toBeGreaterThan(.9);
  });

  it('levels a sofa cutout whose base slopes down to the right', () => {
    const width = 200, height = 100;
    const data = new Uint8ClampedArray(width * height * 4);
    for (let x = 10; x < 190; x++) {
      const bottom = Math.round(65 + x * .1);
      for (let y = 25; y <= bottom; y++) data[(y * width + x) * 4 + 3] = 255;
    }
    expect(detectSofaBaselineRotation(data, width, height)).toBeCloseTo(-Math.atan(.1) * 180 / Math.PI, 0);
  });
});
