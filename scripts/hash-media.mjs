// Gives photos and videos content-hashed names so browsers can cache them forever.
//
//   node scripts/hash-media.mjs
//
// Run it after adding or replacing files in public/photos or public/videos.
// It renames only files that aren't hashed yet, then updates every reference in
// content/, components/ and app/. Already-hashed files are left alone.
//
//   public/videos/hero.mp4 (+ hero.jpg)        → hero.1a2b3c4d.mp4 (+ .jpg)
//   public/photos/hk1-700.jpg + hk1-1400.jpg    → hk1.1a2b3c4d-700.jpg / -1400.jpg
//   references: "/photos/hk1.jpg"              → "/photos/hk1.1a2b3c4d.jpg"

import { createHash } from "node:crypto";
import { readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const hash = async (file) => createHash("md5").update(await readFile(file)).digest("hex").slice(0, 8);
const HASHED = /\.[0-9a-f]{8}(-\d+)?\.(mp4|jpg)$/;

const replacements = [];

// videos: name.mp4 + name.jpg (poster)
const videoDir = path.join(root, "public/videos");
for (const f of await readdir(videoDir)) {
  if (!f.endsWith(".mp4") || HASHED.test(f)) continue;
  const base = f.slice(0, -4);
  const h = await hash(path.join(videoDir, f));
  await rename(path.join(videoDir, f), path.join(videoDir, `${base}.${h}.mp4`));
  await rename(path.join(videoDir, `${base}.jpg`), path.join(videoDir, `${base}.${h}.jpg`)).catch(() => {});
  replacements.push([`/videos/${base}.mp4`, `/videos/${base}.${h}.mp4`]);
}

// photos: name-700.jpg + name-1400.jpg, referenced as /photos/name.jpg
const photoDir = path.join(root, "public/photos");
for (const f of await readdir(photoDir)) {
  const m = f.match(/^(.+)-1400\.jpg$/);
  if (!m || HASHED.test(f)) continue;
  const base = m[1];
  const h = await hash(path.join(photoDir, f));
  for (const size of [700, 1400]) {
    await rename(path.join(photoDir, `${base}-${size}.jpg`), path.join(photoDir, `${base}.${h}-${size}.jpg`));
    replacements.push([`photos/${base}-${size}.jpg`, `photos/${base}.${h}-${size}.jpg`]);
  }
  replacements.push([`/photos/${base}.jpg`, `/photos/${base}.${h}.jpg`]);
}

// rewrite references
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (/\.(ts|tsx)$/.test(entry.name)) yield p;
  }
}
let touched = 0;
for (const dir of ["content", "components", "app"]) {
  for await (const file of walk(path.join(root, dir))) {
    let src = await readFile(file, "utf8");
    const before = src;
    for (const [from, to] of replacements) src = src.split(`${from}"`).join(`${to}"`);
    if (src !== before) {
      await writeFile(file, src);
      touched++;
    }
  }
}
console.log(`renamed ${replacements.length} references across ${touched} files`);
