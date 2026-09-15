const linear = (value: number) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
const srgb = (value: number) => Math.round(255 * (value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055));
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** Recolour only the selected fabric; retain its shading and all unselected pixels. */
export function recolourSofaPixels(rgb: Uint8Array, mask: Uint8Array, colour: string): Uint8Array {
  if (rgb.length !== mask.length * 3 || !/^#[0-9a-f]{6}$/i.test(colour)) throw new Error('Invalid sofa colour preview.');
  const palette = [1, 3, 5].map((position) => linear(parseInt(colour.slice(position, position + 2), 16) / 255));
  const histogram = new Uint32Array(256);
  const luminance = new Float32Array(mask.length);
  let selected = 0;
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const offset = i * 3;
    const value = linear(rgb[offset] / 255) * 0.2126 + linear(rgb[offset + 1] / 255) * 0.7152 + linear(rgb[offset + 2] / 255) * 0.0722;
    luminance[i] = value;
    if (mask[i] > 200) { histogram[Math.min(255, Math.round(value * 255))]++; selected++; }
  }
  if (!selected) throw new Error('The sofa could not be selected in this photo. Try a clearer front-facing photo.');
  let midpoint = 0.18;
  let cumulative = 0;
  for (let i = 0; i < histogram.length; i++) {
    cumulative += histogram[i];
    if (cumulative >= selected / 2) { midpoint = Math.max(0.015, i / 255); break; }
  }
  const output = new Uint8Array(rgb);
  for (let i = 0; i < mask.length; i++) {
    const opacity = mask[i] / 255;
    if (!opacity) continue;
    const shade = Math.min(3.5, luminance[i] / midpoint);
    for (let channel = 0; channel < 3; channel++) {
      const offset = i * 3 + channel;
      const light = palette[channel] * shade;
      const highlight = Math.max(0, shade - 1.35) * 0.06;
      const recoloured = srgb(clamp(light + highlight));
      output[offset] = Math.round(rgb[offset] * (1 - opacity) + recoloured * opacity);
    }
  }
  return output;
}
