import sharp from 'sharp';

/** Assemble colour and alpha before cropping so both retain the same coordinates. */
export async function renderSofaCutout(rgb: Uint8Array, mask: Uint8Array, width: number, height: number) {
  if (rgb.length !== width * height * 3 || mask.length !== width * height) throw new Error('Invalid sofa image dimensions.');
  let left = width, top = height, right = 0, bottom = 0;
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const p = y * width + x;
    rgba[p * 4] = rgb[p * 3];
    rgba[p * 4 + 1] = rgb[p * 3 + 1];
    rgba[p * 4 + 2] = rgb[p * 3 + 2];
    rgba[p * 4 + 3] = mask[p];
    if (mask[p] > 12) { left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); }
  }
  if (left >= right || top >= bottom) throw new Error('This sofa photo cannot be isolated. Try another sofa.');
  return sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 }).png().toBuffer();
}
