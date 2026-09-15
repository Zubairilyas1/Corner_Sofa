// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { cleanSofaMask, mergeSofaAccessory } from '../lib/sofa-mask';

const width = 64;
const height = 48;

function rectangle(mask: Uint8Array, left: number, top: number, right: number, bottom: number, value = 255) {
  for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) mask[y * width + x] = value;
}

describe('sofa mask cleanup', () => {
  it('adds a loose cushion touching the sofa and rejects unrelated background objects', () => {
    const sofa = new Uint8Array(width * height);
    rectangle(sofa, 7, 12, 57, 43);
    const cushion = new Uint8Array(width * height);
    rectangle(cushion, 12, 10, 25, 18);
    expect(mergeSofaAccessory(sofa, cushion, width, height, [18 / width, 14 / height])).toBe(true);
    expect(sofa[10 * width + 18]).toBe(255);
    const background = new Uint8Array(width * height);
    rectangle(background, 45, 1, 58, 6);
    expect(mergeSofaAccessory(sofa, background, width, height, [50 / width, 3 / height])).toBe(false);
  });
  it('removes a disconnected background fragment while retaining both seeded sofa regions', async () => {
    const mask = new Uint8Array(width * height);
    rectangle(mask, 7, 11, 27, 36);
    rectangle(mask, 36, 13, 56, 38);
    rectangle(mask, 44, 2, 61, 8);
    const output = await cleanSofaMask(mask, width, height, [[17 / width, 23 / height], [46 / width, 25 / height]]);

    for (const [left, top, right, bottom] of [[11, 15, 23, 32], [40, 17, 52, 34]]) {
      for (let y = top; y < bottom; y++) for (let x = left; x < right; x++) {
        expect(output[y * width + x], `sofa region at ${x},${y}`).toBe(255);
      }
    }
    for (let y = 2; y < 8; y++) for (let x = 44; x < 61; x++) {
      expect(output[y * width + x], `background fragment at ${x},${y}`).toBe(0);
    }
  });

  it('keeps every selected output pixel inside the original mask and preserves its holes', async () => {
    const mask = new Uint8Array(width * height);
    rectangle(mask, 6, 6, 58, 42);
    rectangle(mask, 29, 21, 32, 24, 0);
    rectangle(mask, 18, 3, 46, 5);
    const original = mask.slice();
    const output = await cleanSofaMask(mask, width, height, [[16 / width, 25 / height]]);

    expect(output.length).toBe(mask.length);
    expect(output[25 * width + 16]).toBe(255);
    expect(output[22 * width + 30]).toBe(0);
    for (let index = 0; index < output.length; index++) {
      if (output[index]) expect(original[index], `selected pixel ${index}`).toBe(255);
    }
    expect(mask).toEqual(original);
  });

  it('reports a clear error when no prompt lies inside the retained sofa selection', async () => {
    const mask = new Uint8Array(width * height);
    rectangle(mask, 8, 8, 40, 36);
    await expect(cleanSofaMask(mask, width, height, [[0.9, 0.9]])).rejects.toThrow(/sofa could not be isolated.*clearer, centred sofa photo/i);
    await expect(cleanSofaMask(mask, width, height, [])).rejects.toThrow(/sofa could not be isolated/i);
  });
});
