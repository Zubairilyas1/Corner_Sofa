import sharp from 'sharp';

function bounds(mask: Uint8Array, width: number, height: number) {
  let left = width, top = height, right = -1, bottom = -1, area = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (mask[y * width + x]) {
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y); area++;
  }
  return { left, top, right, bottom, area };
}

/** Add a separately selected loose cushion only when it belongs inside and touches the sofa. */
export function mergeSofaAccessory(base: Uint8Array, accessory: Uint8Array, width: number, height: number, point: number[]) {
  if (base.length !== width * height || accessory.length !== base.length) return false;
  const sofa = bounds(base, width, height), item = bounds(accessory, width, height);
  const pointX = Math.floor(point[0] * width), pointY = Math.floor(point[1] * height);
  if (item.area < width * height * .002 || item.area > width * height * .16 || !accessory[pointY * width + pointX]) return false;
  const marginX = width * .04, marginY = height * .06;
  if (item.left < sofa.left - marginX || item.right > sofa.right + marginX || item.top < sofa.top - marginY || item.bottom > sofa.bottom + marginY
    || item.right - item.left > width * .34 || item.bottom - item.top > height * .42) return false;
  const radius = Math.max(3, Math.round(width / 70));
  let touches = 0;
  for (let y = item.top; y <= item.bottom; y += 2) for (let x = item.left; x <= item.right; x += 2) {
    const index = y * width + x;
    if (!accessory[index]) continue;
    for (const [dx, dy] of [[-radius, 0], [radius, 0], [0, -radius], [0, radius]]) {
      const nearX = x + dx, nearY = y + dy;
      if (nearX >= 0 && nearX < width && nearY >= 0 && nearY < height && base[nearY * width + nearX]) { touches++; break; }
    }
  }
  if (touches < 3) return false;
  for (let index = 0; index < base.length; index++) if (accessory[index]) base[index] = 255;
  return true;
}

/** Remove loose background fragments while retaining regions containing sofa prompts. */
export async function cleanSofaMask(mask: Uint8Array, width: number, height: number, points: number[][]) {
  const radius = Math.max(2, Math.round(width / 160));
  // Sharp's morphology expands black pixels: dilate shrinks the white selection.
  const interior = await sharp(Buffer.from(mask), { raw: { width, height, channels: 1 } }).dilate(radius).greyscale().raw().toBuffer();
  const selected = new Uint8Array(mask.length);
  const queue = new Int32Array(mask.length);
  for (const [x, y] of points) {
    const start = Math.floor(y * height) * width + Math.floor(x * width);
    if (!interior[start] || selected[start]) continue;
    let head = 0, tail = 0;
    queue[tail++] = start;
    selected[start] = 255;
    const visit = (index: number) => {
      if (index >= 0 && index < interior.length && interior[index] && !selected[index]) {
        selected[index] = 255;
        queue[tail++] = index;
      }
    };
    while (head < tail) {
      const index = queue[head++];
      visit(index - width); visit(index + width);
      if (index % width > 0) visit(index - 1);
      if (index % width < width - 1) visit(index + 1);
    }
  }
  if (!selected.some(Boolean)) throw new Error('The sofa could not be isolated. Try a clearer, centred sofa photo.');
  const restored = await sharp(Buffer.from(selected), { raw: { width, height, channels: 1 } }).erode(radius).greyscale().raw().toBuffer();
  for (let index = 0; index < mask.length; index++) restored[index] = restored[index] && mask[index] ? 255 : 0;
  return restored;
}
