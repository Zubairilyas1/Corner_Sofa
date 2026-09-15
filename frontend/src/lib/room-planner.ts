/** All planning measurements are centimetres; photo points use normalized 0..1 coordinates. */
export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];
export type Wall = 'back' | 'right' | 'front' | 'left';
export const ROOM_CORNERS = ['back-left', 'back-right', 'front-right', 'front-left'] as const;
export type RoomCorner = typeof ROOM_CORNERS[number];

/** Anchor the chaise against the adjoining wall without mirroring the actual sofa model. */
export function cornerPlacement(corner: RoomCorner, chaise: 'left' | 'right'): { wall: Wall; position: number; walls: [Wall, Wall] } {
  const index = ROOM_CORNERS.indexOf(corner);
  const walls: Wall[] = ['back', 'right', 'front', 'left'];
  const main = walls[index];
  const adjacent = walls[(index + 3) % 4];
  return { wall: chaise === 'left' ? main : adjacent, position: chaise === 'left' ? 0 : 100, walls: [main, adjacent] };
}
export type Dimensions = { width: number; depth: number; height: number };
export const WALLS: Wall[] = ['back', 'right', 'front', 'left'];
export const DEFAULT_FLOOR: Quad = [{ x: .2, y: .48 }, { x: .8, y: .48 }, { x: .97, y: .94 }, { x: .03, y: .94 }];
// The visual-only preview treats the visible back wall as nearly the full photo width.
export const DEFAULT_PREVIEW_FLOOR: Quad = [{ x: .03, y: .46 }, { x: .97, y: .46 }, { x: .99, y: .96 }, { x: .01, y: .96 }];
export const DEFAULT_REFERENCE: Quad = [{ x: .43, y: .68 }, { x: .57, y: .68 }, { x: .6, y: .8 }, { x: .4, y: .8 }];
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

export function validQuad(points: Quad) {
  if (points.length !== 4 || points.some(p => !Number.isFinite(p.x) || !Number.isFinite(p.y))) return false;
  const crosses = points.map((p, i) => {
    const b = points[(i + 1) % 4], c = points[(i + 2) % 4];
    return (b.x - p.x) * (c.y - b.y) - (b.y - p.y) * (c.x - b.x);
  });
  return crosses.every(c => c > .00001);
}

/** Four coplanar reference corners determine a projective map, not a camera/depth estimate. */
export function homography(from: Quad, to: Quad) {
  const rows = from.flatMap((p, i) => {
    const q = to[i];
    return [[p.x, p.y, 1, 0, 0, 0, -q.x * p.x, -q.x * p.y, q.x],
      [0, 0, 0, p.x, p.y, 1, -q.y * p.x, -q.y * p.y, q.y]];
  });
  for (let col = 0; col < 8; col++) {
    let pivot = col;
    for (let row = col + 1; row < 8; row++) if (Math.abs(rows[row][col]) > Math.abs(rows[pivot][col])) pivot = row;
    [rows[col], rows[pivot]] = [rows[pivot], rows[col]];
    const div = rows[col][col];
    if (Math.abs(div) < 1e-10) throw new Error('Spread the four corners apart and keep them in order.');
    rows[col] = rows[col].map(n => n / div);
    for (let row = 0; row < 8; row++) {
      if (row === col) continue;
      const mul = rows[row][col];
      rows[row] = rows[row].map((n, i) => n - mul * rows[col][i]);
    }
  }
  const h = rows.map(row => row[8]);
  return (p: Point): Point => {
    const w = h[6] * p.x + h[7] * p.y + 1;
    if (Math.abs(w) < 1e-8) throw new Error('The reference is too close to the horizon. Move it onto the floor.');
    return { x: (h[0] * p.x + h[1] * p.y + h[2]) / w, y: (h[3] * p.x + h[4] * p.y + h[5]) / w };
  };
}

export const unitSquare: Quad = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
export function estimateWalls(floor: Quad, reference: Quad, width: number, depth: number): Record<Wall, number> {
  if (!validQuad(floor) || !validQuad(reference) || !Number.isFinite(width) || !Number.isFinite(depth) || width < 10 || depth < 10) {
    throw new Error('Mark four floor corners and four reference corners, then enter the reference size.');
  }
  const map = homography(reference, [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: depth }, { x: 0, y: depth }]);
  const room = floor.map(map);
  if (!validQuad(room as Quad)) throw new Error('These corners cross the horizon. Adjust the floor and reference markers.');
  const lengths = room.map((p, i) => Math.round(Math.hypot(p.x - room[(i + 1) % 4].x, p.y - room[(i + 1) % 4].y)));
  if (lengths.some(n => !Number.isFinite(n) || n < 100 || n > 2000)) throw new Error('The estimate is outside a usable room size. Check the reference size and corner positions.');
  return Object.fromEntries(WALLS.map((wall, i) => [wall, lengths[i]])) as Record<Wall, number>;
}

export type PlacementInput = { roomWidth: number; roomDepth: number; sofaWidth: number; sofaDepth: number; wall: Wall; position: number; sideGap: number; backGap: number; frontGap: number };
export function placeSofa(input: PlacementInput) {
  const { roomWidth, roomDepth, sofaWidth, sofaDepth, wall, sideGap, backGap, frontGap } = input;
  if (![roomWidth, roomDepth, sofaWidth, sofaDepth].every(n => Number.isFinite(n) && n > 0)
    || ![sideGap, backGap, frontGap].every(n => Number.isFinite(n) && n >= 0) || !Number.isFinite(input.position) || !WALLS.includes(wall)) return null;
  const along = wall === 'back' || wall === 'front' ? roomWidth : roomDepth;
  const across = wall === 'back' || wall === 'front' ? roomDepth : roomWidth;
  const freeAlong = along - sofaWidth - sideGap * 2;
  const freeAcross = across - sofaDepth - backGap - frontGap;
  const fits = freeAlong >= 0 && freeAcross >= 0;
  const start = sideGap + Math.max(0, freeAlong) * clamp(input.position, 0, 100) / 100;
  const transform = (p: Point): Point => {
    const x = p.x + start, y = p.y + backGap;
    if (wall === 'right') return { x: roomWidth - y, y: x };
    if (wall === 'front') return { x: roomWidth - x, y: roomDepth - y };
    if (wall === 'left') return { x: y, y: roomDepth - x };
    return { x, y };
  };
  const corners = [{ x: 0, y: 0 }, { x: sofaWidth, y: 0 }, { x: sofaWidth, y: sofaDepth }, { x: 0, y: sofaDepth }].map(transform) as Quad;
  return { fits, corners, transform, freeAlong, freeAcross, start, end: along - start - sofaWidth, openFloor: across - backGap - sofaDepth };
}

export function sofaOutline(width: number, depth: number, corner: boolean, chaise: 'left' | 'right'): Point[] {
  if (!corner) return [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: depth }, { x: 0, y: depth }];
  const seatDepth = depth * .55, chaiseWidth = width * .36;
  const left = [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: seatDepth }, { x: chaiseWidth, y: seatDepth }, { x: chaiseWidth, y: depth }, { x: 0, y: depth }];
  return chaise === 'left' ? left : left.map(p => ({ x: width - p.x, y: p.y })).reverse();
}
