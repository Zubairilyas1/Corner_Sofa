// @vitest-environment node
import { expect, it } from 'vitest';
import sharp from 'sharp';
import { renderSofaCutout } from '@/lib/sofa-cutout';

it('crops the sofa and keeps its colour pixels aligned with transparency', async () => {
  const width = 8, height = 6;
  const rgb = new Uint8Array(width * height * 3);
  const mask = new Uint8Array(width * height);
  for (let y = 2; y < 5; y++) for (let x = 3; x < 7; x++) {
    const p = y * width + x;
    rgb[p * 3] = x * 30;
    rgb[p * 3 + 1] = y * 40;
    mask[p] = 255;
  }
  mask[3 * width + 4] = 0;
  const { data, info } = await sharp(await renderSofaCutout(rgb, mask, width, height)).raw().toBuffer({ resolveWithObject: true });
  expect(info).toMatchObject({ width: 4, height: 3, channels: 4 });
  expect([...data.subarray(0, 4)]).toEqual([90, 80, 0, 255]);
  expect([...data.subarray(20, 24)]).toEqual([120, 120, 0, 0]);
});
