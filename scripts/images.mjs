// Builds responsive WebP ladders from assets-src/ into public/img/ and writes
// src/data/image-manifest.json (intrinsic size + available widths + a tiny
// blur placeholder) for the <Img> component.
//
// Add a photo's name to LIFT to brighten it (for images with a dark overlay baked in).
//
// Run: npm run images
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const SRC = path.join(root, 'assets-src');
const OUT = path.join(root, 'public', 'img');
const PORCELAIN = '#f4f1ec';

const LIFT = new Set([]);
const LADDERS = {
  photo: [640, 1024, 1600, 2200],
  team: [360, 640, 960],
  board: [320, 560],
  insights: [480, 960, 1400],
};

await fs.rm(OUT, { recursive: true, force: true });
const manifest = {};

for (const [dir, ladder] of Object.entries(LADDERS)) {
  await fs.mkdir(path.join(OUT, dir), { recursive: true });
  for (const file of await fs.readdir(path.join(SRC, dir))) {
    const name = path.parse(file).name;
    const key = `${dir}/${name}`;
    let img = sharp(path.join(SRC, dir, file)).flatten({ background: PORCELAIN });
    if (LIFT.has(name)) img = img.linear(1.75, 4).modulate({ saturation: 0.95 });
    const input = await img.toBuffer();
    const { width, height } = await sharp(input).metadata();
    const widths = ladder.filter((w) => w < width).concat(width <= ladder.at(-1) ? [width] : []);
    for (const w of widths) {
      await sharp(input).resize({ width: w }).webp({ quality: dir === 'photo' ? 76 : 80 }).toFile(path.join(OUT, dir, `${name}-${w}.webp`));
    }
    const blur = await sharp(input).resize({ width: 16 }).blur(0.8).webp({ quality: 35 }).toBuffer();
    manifest[key] = { w: width, h: height, widths, blur: `data:image/webp;base64,${blur.toString('base64')}` };
  }
  console.log(dir, Object.keys(manifest).filter((k) => k.startsWith(dir + '/')).length);
}

// Open Graph card: the hero photograph, cropped to 1200x630.
await sharp(path.join(SRC, 'photo', 'hero-horizon.jpg')).resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toFile(path.join(root, 'public', 'og.jpg'));

await fs.writeFile(path.join(root, 'src', 'data', 'image-manifest.json'), JSON.stringify(manifest));
console.log('manifest', Object.keys(manifest).length);
