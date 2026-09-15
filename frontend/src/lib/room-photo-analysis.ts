import type { Point } from './room-planner';

/** Find the strongest wide horizontal boundary in the useful lower part of a room photo. */
export function detectWallFloorPixels(data: Uint8Array | Uint8ClampedArray, width: number, height: number) {
  if (width < 20 || height < 20 || data.length < width * height * 4) return .78;
  const firstY = Math.floor(height * .28);
  const lastY = Math.floor(height * .95);
  const firstX = Math.floor(width * .03);
  const lastX = Math.ceil(width * .97);
  const scores = new Float64Array(height);
  for (let y = firstY; y <= lastY; y++) {
    let difference = 0;
    let changed = 0;
    const above = Math.max(0, y - 2);
    const below = Math.min(height - 1, y + 2);
    for (let x = firstX; x < lastX; x++) {
      const a = (above * width + x) * 4;
      const b = (below * width + x) * 4;
      const delta = Math.abs(data[a] - data[b]) + Math.abs(data[a + 1] - data[b + 1]) + Math.abs(data[a + 2] - data[b + 2]);
      difference += delta;
      if (delta > 45) changed++;
    }
    const columns = lastX - firstX;
    scores[y] = difference / columns * (.55 + changed / columns);
  }
  let bestY = Math.round(height * .78);
  let bestScore = -1;
  for (let y = firstY + 2; y <= lastY - 2; y++) {
    const score = (scores[y - 2] + scores[y - 1] + scores[y] + scores[y + 1] + scores[y + 2]) / 5;
    if (score > bestScore) { bestScore = score; bestY = y; }
  }
  return Math.max(.28, Math.min(.95, bestY / height));
}

export function detectWallFloor(image: HTMLImageElement) {
  const width = Math.min(420, image.naturalWidth);
  const height = Math.max(20, Math.round(image.naturalHeight * width / image.naturalWidth));
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return .78;
  context.drawImage(image, 0, 0, width, height);
  return detectWallFloorPixels(context.getImageData(0, 0, width, height).data, width, height);
}

/** Return the small correction needed to level the lower edge of a transparent sofa cutout. */
export function detectSofaBaselineRotation(data: Uint8Array | Uint8ClampedArray, width: number, height: number) {
  if (width < 40 || height < 20 || data.length < width * height * 4) return 0;
  const firstX = Math.floor(width * .05);
  const lastX = Math.ceil(width * .95);
  const binWidth = Math.max(3, Math.floor((lastX - firstX) / 24));
  const points: Point[] = [];
  for (let start = firstX; start < lastX; start += binWidth) {
    const bottoms: number[] = [];
    for (let x = start; x < Math.min(start + binWidth, lastX); x++) {
      for (let y = height - 1; y >= 0; y--) {
        if (data[(y * width + x) * 4 + 3] > 32) { bottoms.push(y); break; }
      }
    }
    if (bottoms.length < binWidth * .4) continue;
    bottoms.sort((a, b) => a - b);
    points.push({ x: start + binWidth / 2, y: bottoms[Math.floor(bottoms.length * .58)] });
  }
  if (points.length < 6) return 0;
  const meanX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const meanY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  const numerator = points.reduce((sum, p) => sum + (p.x - meanX) * (p.y - meanY), 0);
  const denominator = points.reduce((sum, p) => sum + (p.x - meanX) ** 2, 0);
  if (!denominator) return 0;
  return Math.max(-12, Math.min(12, -Math.atan(numerator / denominator) * 180 / Math.PI));
}

export function detectSofaRotation(image: HTMLImageElement) {
  const width = Math.min(600, image.naturalWidth);
  const height = Math.max(20, Math.round(image.naturalHeight * width / image.naturalWidth));
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return 0;
  context.drawImage(image, 0, 0, width, height);
  return detectSofaBaselineRotation(context.getImageData(0, 0, width, height).data, width, height);
}

/** Keep the sofa complete while letting its front feet extend slightly onto the floor. */
export function groundedSofaBox(targetWidth: number, naturalHeight: number, floorLine: number, centre: Point) {
  const maxHeight = Math.min(.7, Math.max(.28, floorLine + .16 - .02));
  const fit = naturalHeight > maxHeight ? maxHeight / naturalHeight : 1;
  const width = targetWidth * fit;
  const height = naturalHeight * fit;
  const bottom = Math.min(.97, floorLine + Math.min(.16, height * .25));
  return { x: centre.x - width / 2, y: Math.max(.01, bottom - height), width, height };
}
