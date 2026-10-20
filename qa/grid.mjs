// Re-tiles a vertical walk strip into rows of N frames: node qa/grid.mjs <strip.png> <frameH> [perRow]
import sharp from 'sharp';
const [file, fh, per = '5'] = process.argv.slice(2);
const FH = +fh, GAP = 6, N = +per;
const meta = await sharp(file).metadata();
const count = Math.round((meta.height + GAP) / (FH + GAP));
const frames = [];
for (let i = 0; i < count; i++) frames.push(await sharp(file).extract({ left: 0, top: i * (FH + GAP), width: meta.width, height: FH }).toBuffer());
const rows = Math.ceil(count / N);
for (let r = 0; r * N * 2 < count || r < 1; r++) {} // noop
const pages = Math.ceil(count / (N * 2));
for (let p = 0; p < pages; p++) {
  const part = frames.slice(p * N * 2, p * N * 2 + N * 2);
  const W = meta.width * Math.min(N, part.length) + GAP * (Math.min(N, part.length) - 1);
  const H = FH * Math.ceil(part.length / N) + GAP;
  await sharp({ create: { width: W, height: H, channels: 3, background: '#ff00aa' } })
    .composite(part.map((input, i) => ({ input, left: (i % N) * (meta.width + GAP), top: Math.floor(i / N) * (FH + GAP) })))
    .png().toFile(file.replace('.png', `-g${p}.png`));
  console.log(file.replace('.png', `-g${p}.png`));
}
